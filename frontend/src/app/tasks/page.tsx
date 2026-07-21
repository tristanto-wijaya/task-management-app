"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ListChecks } from "lucide-react";
import type { Task, TaskCreateInput, TaskStatus, TaskUpdateInput, User } from "@/types";
import { ApiError, createTask, deleteTask, getTasks, getUsers, updateTask, updateTaskStatus } from "@/lib/api";
import { clearSession, getStoredEmail, getToken } from "@/lib/auth";
import { isDueToday, isOverdue } from "@/lib/date";
import { Sidebar } from "@/components/layout/Sidebar";
import { WorkspaceHeader, type DeadlineFilter, type StatusFilter } from "@/components/tasks/WorkspaceHeader";
import { KanbanBoard } from "@/components/tasks/KanbanBoard";
import { LoadingBoard, EmptyBoardState, NoResultsState, ErrorBoardState } from "@/components/tasks/BoardStates";
import { TaskDrawer } from "@/components/tasks/TaskDrawer";
import { TaskFormModal } from "@/components/tasks/TaskFormModal";
import { DeleteDialog } from "@/components/tasks/DeleteDialog";
import { ToastStack, type ToastItem } from "@/components/ui/Toast";
import { AssistantPanel } from "@/components/chat/AssistantPanel";

type View = "all" | "mine";
type FormModalState = { mode: "add" | "edit"; task?: Task } | null;

let toastId = 0;

export default function TasksPage() {
  const router = useRouter();

  const [users, setUsers] = useState<User[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [view, setView] = useState<View>("all");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [assigneeFilter, setAssigneeFilter] = useState("all");
  const [deadlineFilter, setDeadlineFilter] = useState<DeadlineFilter>("all");

  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [drawerTask, setDrawerTask] = useState<Task | null>(null);
  const [formModal, setFormModal] = useState<FormModalState>(null);
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Task | null>(null);
  const [deleteSubmitting, setDeleteSubmitting] = useState(false);
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const addToast = useCallback((message: string, type: ToastItem["type"]) => {
    const id = ++toastId;
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3200);
  }, []);

  useEffect(() => {
    if (!getToken()) {
      router.replace("/login");
    }
  }, [router]);

  useEffect(() => {
    getUsers()
      .then(setUsers)
      .catch(() => undefined);
  }, []);

  const loadTasks = useCallback(() => {
    setLoading(true);
    setLoadError(null);
    getTasks({ search: search || undefined, status: statusFilter })
      .then(setTasks)
      .catch((err) => {
        setLoadError(err instanceof ApiError ? err.message : "Something went wrong while retrieving the task list.");
      })
      .finally(() => setLoading(false));
  }, [search, statusFilter]);

  useEffect(() => {
    const timeout = setTimeout(loadTasks, 250);
    return () => clearTimeout(timeout);
  }, [loadTasks]);

  const currentUser = useMemo(
    () => users.find((u) => u.email === getStoredEmail()) ?? null,
    [users],
  );

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      if (view === "mine" && (!currentUser || task.assignee?.id !== currentUser.id)) return false;
      if (assigneeFilter !== "all" && String(task.assignee?.id ?? "") !== assigneeFilter) return false;
      if (deadlineFilter === "today" && !isDueToday(task.deadline)) return false;
      if (deadlineFilter === "overdue" && !isOverdue(task.deadline, task.status)) return false;
      return true;
    });
  }, [tasks, view, currentUser, assigneeFilter, deadlineFilter]);

  function handleLogout() {
    clearSession();
    router.push("/login");
  }

  function openAddModal() {
    setFormError(null);
    setFormModal({ mode: "add" });
  }

  function openEditModal(task: Task) {
    setDrawerTask(null);
    setFormError(null);
    setFormModal({ mode: "edit", task });
  }

  function openDeleteDialog(task: Task) {
    setDrawerTask(null);
    setDeleteTarget(task);
  }

  async function handleFormSubmit(input: TaskCreateInput | TaskUpdateInput) {
    if (!formModal) return;
    setFormSubmitting(true);
    setFormError(null);
    try {
      if (formModal.mode === "add") {
        const created = await createTask(input as TaskCreateInput);
        setTasks((prev) => [created, ...prev]);
        addToast("Task created successfully.", "success");
      } else if (formModal.task) {
        const updated = await updateTask(formModal.task.id, input as TaskUpdateInput);
        setTasks((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
        addToast("Task updated successfully.", "success");
      }
      setFormModal(null);
    } catch (err) {
      const message = err instanceof ApiError ? err.message : "Something went wrong. Please try again.";
      setFormError(message);
    } finally {
      setFormSubmitting(false);
    }
  }

  async function handleConfirmDelete() {
    if (!deleteTarget) return;
    setDeleteSubmitting(true);
    try {
      await deleteTask(deleteTarget.id);
      setTasks((prev) => prev.filter((t) => t.id !== deleteTarget.id));
      addToast("Task deleted successfully.", "success");
      setDeleteTarget(null);
    } catch (err) {
      addToast(err instanceof ApiError ? err.message : "Failed to delete task.", "error");
    } finally {
      setDeleteSubmitting(false);
    }
  }

  async function handleStatusChange(task: Task, status: TaskStatus) {
    try {
      const updated = await updateTaskStatus(task.id, status);
      setTasks((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
      addToast("Task updated successfully.", "success");
    } catch (err) {
      addToast(err instanceof ApiError ? err.message : "Failed to update status.", "error");
    }
  }

  let boardContent;
  if (loading) {
    boardContent = <LoadingBoard />;
  } else if (loadError) {
    boardContent = <ErrorBoardState onRetry={loadTasks} />;
  } else if (tasks.length === 0 && !search && statusFilter === "all") {
    boardContent = <EmptyBoardState onAddTask={openAddModal} />;
  } else if (filteredTasks.length === 0) {
    boardContent = <NoResultsState />;
  } else {
    boardContent = (
      <KanbanBoard
        tasks={filteredTasks}
        onOpen={setDrawerTask}
        onEdit={openEditModal}
        onDelete={openDeleteDialog}
        onStatusChange={handleStatusChange}
      />
    );
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar
        view={view}
        onChangeView={setView}
        currentUser={currentUser}
        onLogout={handleLogout}
        mobileOpen={mobileSidebarOpen}
        onCloseMobile={() => setMobileSidebarOpen(false)}
      />

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="sticky top-0 z-40 flex h-14 flex-shrink-0 items-center justify-between border-b border-line bg-surface px-4 md:hidden">
          <div className="flex items-center gap-2">
            <div className="flex h-[26px] w-[26px] items-center justify-center rounded-md bg-ink text-accent-soft">
              <ListChecks className="h-3.5 w-3.5" strokeWidth={2} />
            </div>
            <span className="text-[14px] font-bold">Task Management</span>
          </div>
          <button
            type="button"
            onClick={() => setMobileSidebarOpen(true)}
            aria-label="Open menu"
            className="flex h-8 w-8 items-center justify-center rounded-sm text-ink-muted hover:bg-surface-alt hover:text-ink"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>
        </div>

        <main className="flex-1 px-4 py-6 sm:px-6 md:px-8 md:py-6 lg:pb-10">
          <WorkspaceHeader
            title={view === "all" ? "All Tasks" : "My Tasks"}
            description={
              view === "all"
                ? "Create, assign, and track tasks from one shared workspace."
                : "Tasks currently assigned to you."
            }
            search={search}
            onSearchChange={setSearch}
            statusFilter={statusFilter}
            onStatusFilterChange={setStatusFilter}
            assigneeFilter={assigneeFilter}
            onAssigneeFilterChange={setAssigneeFilter}
            users={users}
            deadlineFilter={deadlineFilter}
            onDeadlineFilterChange={setDeadlineFilter}
            onAddTask={openAddModal}
          />
          {boardContent}
        </main>
      </div>

      <TaskDrawer
        task={drawerTask}
        onClose={() => setDrawerTask(null)}
        onEdit={openEditModal}
        onDelete={openDeleteDialog}
      />

      <TaskFormModal
        key={formModal ? `${formModal.mode}-${formModal.task?.id ?? "new"}` : "closed"}
        mode={formModal?.mode ?? "add"}
        open={formModal !== null}
        task={formModal?.task}
        users={users}
        submitting={formSubmitting}
        error={formError}
        onClose={() => setFormModal(null)}
        onSubmit={handleFormSubmit}
      />

      <DeleteDialog
        open={deleteTarget !== null}
        taskTitle={deleteTarget?.title}
        submitting={deleteSubmitting}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={handleConfirmDelete}
      />

      <ToastStack toasts={toasts} />
      <AssistantPanel />
    </div>
  );
}
