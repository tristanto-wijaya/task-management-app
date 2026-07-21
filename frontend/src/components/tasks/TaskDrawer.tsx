"use client";

import type { Task } from "@/types";
import { formatDate, formatDateTime, initials, isOverdue } from "@/lib/date";

interface TaskDrawerProps {
  task: Task | null;
  onClose: () => void;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
}

const STATUS_LABEL: Record<string, string> = { todo: "Todo", in_progress: "In Progress", done: "Done" };
const STATUS_CLASS: Record<string, string> = {
  todo: "bg-status-todo-bg text-status-todo-text",
  in_progress: "bg-status-progress-bg text-status-progress-text",
  done: "bg-status-done-bg text-status-done-text",
};

export function TaskDrawer({ task, onClose, onEdit, onDelete }: TaskDrawerProps) {
  const open = task !== null;
  const overdue = task ? isOverdue(task.deadline, task.status) : false;

  return (
    <>
      <div
        className={`fixed inset-0 z-50 bg-black/40 transition-opacity ${open ? "opacity-100" : "pointer-events-none opacity-0"}`}
        onClick={onClose}
        aria-hidden="true"
      />
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Task details"
        className={`fixed inset-y-0 right-0 z-[60] flex w-[408px] max-w-[92vw] flex-col bg-surface shadow-lg transition-transform duration-200 ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {task && (
          <>
            <div className="flex flex-shrink-0 items-center justify-between border-b border-line p-5">
              <h2 className="text-[15px] font-bold">Task Details</h2>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close task details"
                className="flex h-8 w-8 items-center justify-center rounded-sm text-ink-muted hover:bg-surface-alt hover:text-ink"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-5">
              <span
                className={`inline-flex items-center gap-1.5 rounded-full py-1 pr-2.5 pl-2 text-[12px] font-semibold before:h-1.5 before:w-1.5 before:rounded-full before:bg-current ${STATUS_CLASS[task.status]}`}
              >
                {STATUS_LABEL[task.status]}
              </span>
              <h3 className="my-3 text-[18px] font-bold tracking-tight">{task.title}</h3>
              <p className="my-2 rounded-sm bg-surface-alt p-4 text-[13.5px] leading-relaxed">
                {task.description || "No description provided."}
              </p>

              {overdue && (
                <div className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-destructive-soft px-[9px] py-[3px] text-[12px] font-bold text-destructive">
                  <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="8" x2="12" y2="12" />
                    <line x1="12" y1="16" x2="12.01" y2="16" />
                  </svg>
                  Overdue
                </div>
              )}

              <div className="mt-3 flex items-center justify-between border-b border-line py-3">
                <span className="text-[12px] font-semibold text-ink-muted">Assignee</span>
                <span className="flex items-center gap-2 text-[13px] font-medium">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-accent-soft text-[10px] font-bold text-accent-strong">
                    {task.assignee ? initials(task.assignee.name) : "—"}
                  </span>
                  {task.assignee?.name ?? "Unassigned"}
                </span>
              </div>
              <div className="flex items-center justify-between border-b border-line py-3">
                <span className="text-[12px] font-semibold text-ink-muted">Deadline</span>
                <span className="text-[13px] font-medium">{formatDate(task.deadline)}</span>
              </div>
              <div className="flex items-center justify-between border-b border-line py-3">
                <span className="text-[12px] font-semibold text-ink-muted">Created</span>
                <span className="text-[13px] font-medium">{formatDateTime(task.created_at)}</span>
              </div>
              <div className="flex items-center justify-between border-b border-line py-3">
                <span className="text-[12px] font-semibold text-ink-muted">Last updated</span>
                <span className="text-[13px] font-medium">{formatDateTime(task.updated_at)}</span>
              </div>
            </div>

            <div className="flex flex-shrink-0 gap-3 border-t border-line p-5">
              <button
                type="button"
                onClick={() => onEdit(task)}
                className="h-[38px] flex-1 rounded-sm border border-line-strong bg-surface text-[13.5px] font-semibold hover:bg-surface-alt"
              >
                Edit Task
              </button>
              <button
                type="button"
                onClick={() => onDelete(task)}
                className="h-[38px] flex-1 rounded-sm border border-line-strong bg-transparent text-[13.5px] font-semibold text-destructive hover:bg-destructive-soft"
              >
                Delete Task
              </button>
            </div>
          </>
        )}
      </aside>
    </>
  );
}
