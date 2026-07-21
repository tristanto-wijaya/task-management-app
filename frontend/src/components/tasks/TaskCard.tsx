"use client";

import { useEffect, useRef, useState } from "react";
import type { Task, TaskStatus } from "@/types";
import { formatDate, initials, isOverdue } from "@/lib/date";
import { Select } from "@/components/ui/Select";

interface TaskCardProps {
  task: Task;
  onOpen: (task: Task) => void;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
  onStatusChange: (task: Task, status: TaskStatus) => void;
}

export function TaskCard({ task, onOpen, onEdit, onDelete, onStatusChange }: TaskCardProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const overdue = isOverdue(task.deadline, task.status);

  useEffect(() => {
    if (!menuOpen) return;
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [menuOpen]);

  return (
    <div
      className="relative cursor-pointer rounded-md border border-line bg-surface p-4 transition-shadow hover:border-line-strong hover:shadow-xs"
      onClick={() => onOpen(task)}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <div className="text-[13.5px] leading-snug font-semibold">{task.title}</div>
          {task.description && (
            <div className="mt-1 line-clamp-2 text-[12px] text-ink-muted">{task.description}</div>
          )}
        </div>
        <div className="relative flex-shrink-0" ref={menuRef}>
          <button
            type="button"
            aria-haspopup="true"
            aria-label="Task actions"
            onClick={(e) => {
              e.stopPropagation();
              setMenuOpen((open) => !open);
            }}
            className="flex h-[26px] w-[26px] items-center justify-center rounded-sm text-ink-muted hover:bg-surface-alt hover:text-ink"
          >
            <svg className="h-[15px] w-[15px]" viewBox="0 0 24 24" fill="currentColor">
              <circle cx="12" cy="5" r="1.8" />
              <circle cx="12" cy="12" r="1.8" />
              <circle cx="12" cy="19" r="1.8" />
            </svg>
          </button>
          {menuOpen && (
            <div className="absolute top-[34px] right-0 z-20 w-[148px] rounded-sm border border-line bg-surface p-1 shadow-md">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setMenuOpen(false);
                  onEdit(task);
                }}
                className="flex w-full items-center gap-2 rounded px-2 py-2 text-left text-[12.5px] font-medium hover:bg-surface-alt"
              >
                <svg className="h-[14px] w-[14px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 20h9" />
                  <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z" />
                </svg>
                Edit
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setMenuOpen(false);
                  onDelete(task);
                }}
                className="flex w-full items-center gap-2 rounded px-2 py-2 text-left text-[12.5px] font-medium text-destructive hover:bg-destructive-soft"
              >
                <svg className="h-[14px] w-[14px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="3 6 5 6 21 6" />
                  <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                </svg>
                Delete
              </button>
            </div>
          )}
        </div>
      </div>

      {overdue && (
        <div className="mt-2 inline-flex items-center gap-1 rounded-full bg-destructive-soft px-2 py-0.5 text-[11px] font-bold text-destructive">
          <svg className="h-[11px] w-[11px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          Overdue
        </div>
      )}

      <div className="mt-3 flex items-center justify-between gap-2">
        <div className="flex min-w-0 items-center gap-2">
          <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-accent-soft text-[10px] font-bold text-accent-strong">
            {task.assignee ? initials(task.assignee.name) : "—"}
          </span>
          <span className="truncate text-[12px] font-medium">{task.assignee?.name ?? "Unassigned"}</span>
        </div>
        <span className={`flex-shrink-0 text-[11.5px] whitespace-nowrap ${overdue ? "font-semibold text-destructive" : "text-ink-muted"}`}>
          {formatDate(task.deadline)}
        </span>
      </div>

      <div className="mt-3 border-t border-line pt-3" onClick={(e) => e.stopPropagation()}>
        <Select
          aria-label={`Change status for ${task.title}`}
          value={task.status}
          onChange={(e) => onStatusChange(task, e.target.value as TaskStatus)}
          className="h-[30px] text-[11.5px]"
        >
          <option value="todo">Todo</option>
          <option value="in_progress">In Progress</option>
          <option value="done">Done</option>
        </Select>
      </div>
    </div>
  );
}
