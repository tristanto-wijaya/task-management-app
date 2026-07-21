import json
from datetime import date

import httpx
from fastapi import HTTPException, status
from sqlalchemy import func
from sqlalchemy.orm import Session

from app.config import settings
from app.models import Task, TaskStatus, User
from app.schemas import ChatResponse

SUPPORTED_INTENTS = (
    "LIST_INCOMPLETE_TASKS",
    "COUNT_COMPLETED_TASKS",
    "LIST_TASKS_DUE_TODAY",
    "GET_TASK_ASSIGNEE",
)
UNSUPPORTED_INTENT = "UNSUPPORTED"

UNAVAILABLE_MESSAGE = "The task assistant is temporarily unavailable. Please try again in a moment."
UNSUPPORTED_MESSAGE = (
    "I can only help with a few things right now: incomplete tasks, how many tasks are completed, "
    "tasks due today, or who is assigned to a specific task."
)

GEMINI_TIMEOUT_SECONDS = 10.0

INTENT_RESPONSE_SCHEMA = {
    "type": "OBJECT",
    "properties": {
        "intent": {
            "type": "STRING",
            "enum": [*SUPPORTED_INTENTS, UNSUPPORTED_INTENT],
        },
        "task_title": {"type": "STRING"},
    },
    "required": ["intent"],
}

SYSTEM_INSTRUCTION = """You are an intent classifier for a task management assistant.
Classify the user's message into exactly one of these intents:

- LIST_INCOMPLETE_TASKS: the user wants to see unfinished / incomplete / pending tasks.
- COUNT_COMPLETED_TASKS: the user asks how many tasks are completed / done.
- LIST_TASKS_DUE_TODAY: the user asks what tasks are due today.
- GET_TASK_ASSIGNEE: the user asks who is assigned to a specific task. \
Extract the task title exactly as mentioned into task_title.
- UNSUPPORTED: the message does not clearly match any of the intents above.

Only output the classification. Never answer the question yourself, \
never write SQL, and never invent task data."""


class ChatbotUnavailableError(Exception):
    pass


def is_chatbot_enabled() -> bool:
    return settings.ENABLE_AI_CHATBOT and bool(settings.GEMINI_API_KEY)


def _classify_intent(message: str) -> dict:
    url = (
        f"https://generativelanguage.googleapis.com/v1beta/models/"
        f"{settings.GEMINI_MODEL}:generateContent"
    )
    payload = {
        "system_instruction": {"parts": [{"text": SYSTEM_INSTRUCTION}]},
        "contents": [{"role": "user", "parts": [{"text": message}]}],
        "generationConfig": {
            "responseMimeType": "application/json",
            "responseSchema": INTENT_RESPONSE_SCHEMA,
        },
    }

    try:
        response = httpx.post(
            url,
            params={"key": settings.GEMINI_API_KEY},
            json=payload,
            timeout=GEMINI_TIMEOUT_SECONDS,
        )
        response.raise_for_status()
        data = response.json()
        text = data["candidates"][0]["content"]["parts"][0]["text"]
        return json.loads(text)
    except (httpx.TimeoutException, httpx.HTTPError, KeyError, IndexError, ValueError) as exc:
        raise ChatbotUnavailableError("Gemini request failed") from exc


def _list_incomplete_tasks(db: Session) -> str:
    tasks = db.query(Task).filter(Task.status != TaskStatus.done).order_by(Task.deadline).all()
    if not tasks:
        return "You have no incomplete tasks."
    titles = ", ".join(t.title for t in tasks)
    return f"You have {len(tasks)} incomplete task(s): {titles}."


def _count_completed_tasks(db: Session) -> str:
    count = db.query(func.count(Task.id)).filter(Task.status == TaskStatus.done).scalar()
    if not count:
        return "You have no completed tasks yet."
    return f"You have {count} completed task(s)."


def _list_tasks_due_today(db: Session) -> str:
    today = date.today()
    tasks = db.query(Task).filter(Task.deadline == today).all()
    if not tasks:
        return "No tasks are due today."
    parts = [f"{t.title} ({t.assignee.name if t.assignee else 'unassigned'})" for t in tasks]
    return f"{len(tasks)} task(s) due today: {', '.join(parts)}."


def _get_task_assignee(db: Session, task_title: str | None) -> str:
    if not task_title:
        return "Please mention which task you'd like to know the assignee for."

    task = db.query(Task).filter(Task.title.ilike(f"%{task_title}%")).first()
    if not task:
        return f"I couldn't find a task titled \"{task_title}\"."
    if not task.assignee:
        return f"\"{task.title}\" is currently unassigned."
    return f"{task.assignee.name} is assigned to \"{task.title}\". It's currently {task.status.value}."


def ask(db: Session, message: str) -> ChatResponse:
    if not is_chatbot_enabled():
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="The AI task assistant is disabled. Set ENABLE_AI_CHATBOT=true and GEMINI_API_KEY to enable it.",
        )

    try:
        result = _classify_intent(message)
    except ChatbotUnavailableError:
        raise HTTPException(status_code=status.HTTP_503_SERVICE_UNAVAILABLE, detail=UNAVAILABLE_MESSAGE)

    intent = result.get("intent") if isinstance(result, dict) else None
    task_title = result.get("task_title") if isinstance(result, dict) else None

    if intent == "LIST_INCOMPLETE_TASKS":
        answer = _list_incomplete_tasks(db)
    elif intent == "COUNT_COMPLETED_TASKS":
        answer = _count_completed_tasks(db)
    elif intent == "LIST_TASKS_DUE_TODAY":
        answer = _list_tasks_due_today(db)
    elif intent == "GET_TASK_ASSIGNEE":
        answer = _get_task_assignee(db, task_title)
    else:
        intent = UNSUPPORTED_INTENT
        answer = UNSUPPORTED_MESSAGE

    return ChatResponse(answer=answer, intent=intent)
