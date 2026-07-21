"use client";

import type { Task, TaskStatus } from "@/types";
import { TaskCard } from "@/components/tasks/TaskCard";

interface KanbanBoardProps {
  tasks: Task[];
  onOpen: (task: Task) => void;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
  onStatusChange: (task: Task, status: TaskStatus) => void;
}

const COLUMNS: { status: TaskStatus; label: string; dotClass: string }[] = [
  { status: "todo", label: "Todo", dotClass: "bg-status-todo-text" },
  { status: "in_progress", label: "In Progress", dotClass: "bg-status-progress-text" },
  { status: "done", label: "Done", dotClass: "bg-status-done-text" },
];

export function KanbanBoard({ tasks, onOpen, onEdit, onDelete, onStatusChange }: KanbanBoardProps) {
  return (
    <div className="grid grid-cols-1 items-start gap-5 md:grid-cols-3">
      {COLUMNS.map((column) => {
        const columnTasks = tasks.filter((task) => task.status === column.status);
        return (
          <div key={column.status} className="flex min-h-[120px] flex-col rounded-md border border-line bg-surface-alt">
            <div className="flex items-center justify-between px-3 pt-3 pb-2">
              <div className="flex items-center gap-2">
                <span className={`h-2 w-2 rounded-full ${column.dotClass}`} />
                <h3 className="text-[13px] font-bold">{column.label}</h3>
                <span className="rounded-full border border-line bg-surface px-[7px] py-[1px] text-[11.5px] font-semibold text-ink-muted">
                  {columnTasks.length}
                </span>
              </div>
            </div>
            <div className="flex flex-1 flex-col gap-3 px-3 pb-3">
              {columnTasks.length === 0 ? (
                <div className="rounded-sm border border-dashed border-line-strong px-3 py-6 text-center text-[12px] text-ink-faint">
                  No tasks in this status.
                </div>
              ) : (
                columnTasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onOpen={onOpen}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    onStatusChange={onStatusChange}
                  />
                ))
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
