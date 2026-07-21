"use client";

import type { TaskStatus, User } from "@/types";
import { Select } from "@/components/ui/Select";

export type DeadlineFilter = "all" | "today" | "overdue";
export type StatusFilter = TaskStatus | "all";

interface WorkspaceHeaderProps {
  title: string;
  description: string;
  search: string;
  onSearchChange: (value: string) => void;
  statusFilter: StatusFilter;
  onStatusFilterChange: (value: StatusFilter) => void;
  assigneeFilter: string;
  onAssigneeFilterChange: (value: string) => void;
  users: User[];
  deadlineFilter: DeadlineFilter;
  onDeadlineFilterChange: (value: DeadlineFilter) => void;
  onAddTask: () => void;
}

export function WorkspaceHeader({
  title,
  description,
  search,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  assigneeFilter,
  onAssigneeFilterChange,
  users,
  deadlineFilter,
  onDeadlineFilterChange,
  onAddTask,
}: WorkspaceHeaderProps) {
  return (
    <div>
      <div className="mb-5 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-start">
        <div>
          <h1 className="text-[22px] font-bold tracking-tight">{title}</h1>
          <p className="mt-1 text-[13.5px] text-ink-muted">{description}</p>
        </div>
        <button
          type="button"
          onClick={onAddTask}
          className="flex h-[38px] w-full items-center justify-center gap-2 rounded-sm bg-accent px-4 text-[13.5px] font-semibold whitespace-nowrap text-white transition-colors hover:bg-accent-strong sm:w-auto"
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Add Task
        </button>
      </div>

      <div className="mb-5 flex flex-col flex-wrap items-stretch gap-3 sm:flex-row sm:items-center">
        <div className="relative min-w-[180px] flex-1 sm:flex-[1_1_240px]">
          <svg
            className="pointer-events-none absolute top-1/2 left-[11px] h-[15px] w-[15px] -translate-y-1/2 text-ink-faint"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="11" cy="11" r="7" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="search"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search tasks..."
            className="h-[38px] w-full rounded-sm border border-line-strong bg-surface pr-3 pl-[34px] outline-none transition-colors hover:border-ink-faint focus:border-accent focus:ring-3 focus:ring-accent-soft"
          />
        </div>

        <Select
          aria-label="Filter by status"
          value={statusFilter}
          onChange={(e) => onStatusFilterChange(e.target.value as StatusFilter)}
          className="sm:w-auto sm:min-w-[138px]"
        >
          <option value="all">All statuses</option>
          <option value="todo">Todo</option>
          <option value="in_progress">In Progress</option>
          <option value="done">Done</option>
        </Select>

        <Select
          aria-label="Filter by assignee"
          value={assigneeFilter}
          onChange={(e) => onAssigneeFilterChange(e.target.value)}
          className="sm:w-auto sm:min-w-[138px]"
        >
          <option value="all">All assignees</option>
          {users.map((user) => (
            <option key={user.id} value={String(user.id)}>
              {user.name}
            </option>
          ))}
        </Select>

        <Select
          aria-label="Filter by deadline"
          value={deadlineFilter}
          onChange={(e) => onDeadlineFilterChange(e.target.value as DeadlineFilter)}
          className="sm:w-auto sm:min-w-[138px]"
        >
          <option value="all">All deadlines</option>
          <option value="today">Due today</option>
          <option value="overdue">Overdue</option>
        </Select>
      </div>
    </div>
  );
}
