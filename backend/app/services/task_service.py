from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.models import Task, TaskStatus, User
from app.schemas import TaskCreate, TaskUpdate


def _get_task_or_404(db: Session, task_id: int) -> Task:
    task = db.query(Task).filter(Task.id == task_id).first()
    if task is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Task not found")
    return task


def _validate_assignee(db: Session, assignee_id: int | None) -> None:
    if assignee_id is None:
        return
    if not db.query(User).filter(User.id == assignee_id).first():
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Assignee not found")


def get_tasks(db: Session, search: str | None, status_filter: TaskStatus | None) -> list[Task]:
    query = db.query(Task)
    if search:
        query = query.filter(Task.title.ilike(f"%{search}%"))
    if status_filter:
        query = query.filter(Task.status == status_filter)
    return query.order_by(Task.created_at.desc()).all()


def get_task(db: Session, task_id: int) -> Task:
    return _get_task_or_404(db, task_id)


def create_task(db: Session, data: TaskCreate) -> Task:
    _validate_assignee(db, data.assignee_id)
    task = Task(**data.model_dump())
    db.add(task)
    db.commit()
    db.refresh(task)
    return task


def update_task(db: Session, task_id: int, data: TaskUpdate) -> Task:
    task = _get_task_or_404(db, task_id)
    updates = data.model_dump(exclude_unset=True)
    if "assignee_id" in updates:
        _validate_assignee(db, updates["assignee_id"])
    for field, value in updates.items():
        setattr(task, field, value)
    db.commit()
    db.refresh(task)
    return task


def delete_task(db: Session, task_id: int) -> None:
    task = _get_task_or_404(db, task_id)
    db.delete(task)
    db.commit()
