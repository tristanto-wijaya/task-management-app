"use client";

import { FormEvent, useState } from "react";
import type { Task, TaskCreateInput, TaskStatus, TaskUpdateInput, User } from "@/types";
import { Select } from "@/components/ui/Select";

interface TaskFormModalProps {
  mode: "add" | "edit";
  open: boolean;
  task?: Task | null;
  users: User[];
  submitting: boolean;
  error: string | null;
  onClose: () => void;
  onSubmit: (input: TaskCreateInput | TaskUpdateInput) => void;
}

interface FormState {
  title: string;
  description: string;
  status: TaskStatus;
  deadline: string;
  assigneeId: string;
}

const EMPTY_FORM: FormState = { title: "", description: "", status: "todo", deadline: "", assigneeId: "" };

function initialFormState(mode: "add" | "edit", task?: Task | null): FormState {
  if (mode === "edit" && task) {
    return {
      title: task.title,
      description: task.description ?? "",
      status: task.status,
      deadline: task.deadline ?? "",
      assigneeId: task.assignee ? String(task.assignee.id) : "",
    };
  }
  return EMPTY_FORM;
}

// Parent remounts this component (via `key`) whenever it opens for a
// different task/mode, so form state only ever needs its initial value.
export function TaskFormModal({ mode, open, task, users, submitting, error, onClose, onSubmit }: TaskFormModalProps) {
  const [form, setForm] = useState<FormState>(() => initialFormState(mode, task));
  const [titleError, setTitleError] = useState(false);
  const [deadlineError, setDeadlineError] = useState(false);
  const [assigneeError, setAssigneeError] = useState(false);

  if (!open) return null;

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const title = form.title.trim();
    const hasTitleError = title.length === 0;
    const hasDeadlineError = form.deadline.length === 0;
    const hasAssigneeError = form.assigneeId.length === 0;

    setTitleError(hasTitleError);
    setDeadlineError(hasDeadlineError);
    setAssigneeError(hasAssigneeError);
    if (hasTitleError || hasDeadlineError || hasAssigneeError) return;

    onSubmit({
      title,
      description: form.description.trim() || null,
      status: form.status,
      deadline: form.deadline,
      assignee_id: Number(form.assigneeId),
    });
  }

  return (
    <>
      <div className="fixed inset-0 z-[60] bg-black/40" onClick={onClose} aria-hidden="true" />
      <div className="fixed inset-0 z-[60] flex items-center justify-center p-6">
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="task-form-title"
          className="flex max-h-[calc(100vh-48px)] w-full max-w-[460px] flex-col rounded-lg bg-surface shadow-lg"
        >
          <div className="flex flex-shrink-0 items-center justify-between border-b border-line p-5">
            <h2 id="task-form-title" className="text-[15.5px] font-bold">
              {mode === "add" ? "Add Task" : "Edit Task"}
            </h2>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="flex h-8 w-8 items-center justify-center rounded-sm text-ink-muted hover:bg-surface-alt hover:text-ink"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          <form id="task-form" onSubmit={handleSubmit} noValidate className="overflow-y-auto p-5">
            {error && (
              <div role="alert" className="mb-4 rounded-sm border border-destructive/20 bg-destructive-soft px-3 py-2.5 text-[12.5px] text-destructive">
                {error}
              </div>
            )}

            <div className="flex flex-col gap-2">
              <label htmlFor="task-title" className="text-[12.5px] font-semibold">
                Title
              </label>
              <input
                id="task-title"
                type="text"
                value={form.title}
                onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                placeholder="e.g. Write onboarding checklist"
                className={`h-[38px] w-full rounded-sm border bg-surface px-3 outline-none focus:ring-3 focus:ring-accent-soft ${
                  titleError ? "border-destructive" : "border-line-strong focus:border-accent"
                }`}
              />
              {titleError && <span className="text-[12px] text-destructive">Title is required.</span>}
            </div>

            <div className="mt-4 flex flex-col gap-2">
              <label htmlFor="task-description" className="text-[12.5px] font-semibold">
                Description
              </label>
              <textarea
                id="task-description"
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                placeholder="What does this task involve?"
                className="min-h-[84px] w-full resize-y rounded-sm border border-line-strong bg-surface p-3 outline-none focus:border-accent focus:ring-3 focus:ring-accent-soft"
              />
            </div>

            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="flex flex-col gap-2">
                <label htmlFor="task-status" className="text-[12.5px] font-semibold">
                  Status
                </label>
                <Select
                  id="task-status"
                  value={form.status}
                  onChange={(e) => setForm((f) => ({ ...f, status: e.target.value as TaskStatus }))}
                >
                  <option value="todo">Todo</option>
                  <option value="in_progress">In Progress</option>
                  <option value="done">Done</option>
                </Select>
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="task-deadline" className="text-[12.5px] font-semibold">
                  Deadline
                </label>
                <input
                  id="task-deadline"
                  type="date"
                  value={form.deadline}
                  onChange={(e) => setForm((f) => ({ ...f, deadline: e.target.value }))}
                  className={`h-[38px] w-full rounded-sm border bg-surface px-3 outline-none focus:ring-3 focus:ring-accent-soft ${
                    deadlineError ? "border-destructive" : "border-line-strong focus:border-accent"
                  }`}
                />
                {deadlineError && <span className="text-[12px] text-destructive">Deadline is required.</span>}
              </div>
            </div>

            <div className="mt-4 flex flex-col gap-2">
              <label htmlFor="task-assignee" className="text-[12.5px] font-semibold">
                Assignee
              </label>
              <Select
                id="task-assignee"
                value={form.assigneeId}
                onChange={(e) => setForm((f) => ({ ...f, assigneeId: e.target.value }))}
                className={assigneeError ? "border-destructive" : undefined}
              >
                <option value="">Select a team member</option>
                {users.map((user) => (
                  <option key={user.id} value={String(user.id)}>
                    {user.name}
                  </option>
                ))}
              </Select>
              {assigneeError && <span className="text-[12px] text-destructive">Please select an assignee.</span>}
            </div>
          </form>

          <div className="flex flex-shrink-0 justify-end gap-3 border-t border-line p-5">
            <button
              type="button"
              onClick={onClose}
              className="flex h-[38px] items-center justify-center rounded-sm border border-line-strong bg-surface px-4 text-[13.5px] font-semibold hover:bg-surface-alt"
            >
              Cancel
            </button>
            <button
              type="submit"
              form="task-form"
              disabled={submitting}
              className="relative flex h-[38px] items-center justify-center rounded-sm bg-accent px-4 text-[13.5px] font-semibold text-white hover:bg-accent-strong disabled:cursor-not-allowed disabled:opacity-60"
            >
              <span className={submitting ? "invisible" : ""}>{mode === "add" ? "Create Task" : "Save Changes"}</span>
              {submitting && (
                <span className="absolute h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
