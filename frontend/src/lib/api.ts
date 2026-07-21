import type { ChatResponse, Task, TaskCreateInput, TaskStatus, TaskUpdateInput, User } from "@/types";
import { clearSession, getToken } from "@/lib/auth";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000/api/v1";

export class ApiError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

function extractErrorMessage(body: unknown, fallback: string): string {
  if (body && typeof body === "object" && "detail" in body) {
    const detail = (body as { detail: unknown }).detail;
    if (typeof detail === "string") return detail;
    if (Array.isArray(detail) && detail.length > 0) {
      const first = detail[0] as { msg?: string; loc?: string[] };
      const field = first.loc?.[first.loc.length - 1];
      return field ? `${field}: ${first.msg}` : first.msg ?? fallback;
    }
  }
  return fallback;
}

async function request<T>(
  path: string,
  options: { method?: string; body?: unknown; auth?: boolean } = {},
): Promise<T> {
  const { method = "GET", body, auth = true } = options;
  const headers: Record<string, string> = { "Content-Type": "application/json" };

  if (auth) {
    const token = getToken();
    if (!token) {
      clearSession();
      throw new ApiError(401, "Not authenticated");
    }
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE}${path}`, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  if (response.status === 401 && auth) {
    clearSession();
  }

  if (response.status === 204) {
    return undefined as T;
  }

  const raw = await response.text();
  const data = raw ? JSON.parse(raw) : null;

  if (!response.ok) {
    throw new ApiError(response.status, extractErrorMessage(data, "Something went wrong."));
  }

  return data as T;
}

export function login(email: string, password: string) {
  return request<{ access_token: string; token_type: string }>("/auth/login", {
    method: "POST",
    body: { email, password },
    auth: false,
  });
}

export function getUsers() {
  return request<User[]>("/users");
}

export function getTasks(params: { search?: string; status?: TaskStatus | "all" } = {}) {
  const query = new URLSearchParams();
  if (params.search) query.set("search", params.search);
  if (params.status && params.status !== "all") query.set("status", params.status);
  const qs = query.toString();
  return request<Task[]>(`/tasks${qs ? `?${qs}` : ""}`);
}

export function createTask(input: TaskCreateInput) {
  return request<Task>("/tasks", { method: "POST", body: input });
}

export function updateTask(taskId: number, input: TaskUpdateInput) {
  return request<Task>(`/tasks/${taskId}`, { method: "PUT", body: input });
}

export function updateTaskStatus(taskId: number, status: TaskStatus) {
  return request<Task>(`/tasks/${taskId}/status`, { method: "PATCH", body: { status } });
}

export function deleteTask(taskId: number) {
  return request<void>(`/tasks/${taskId}`, { method: "DELETE" });
}

export function askAssistant(message: string) {
  return request<ChatResponse>("/chat", { method: "POST", body: { message } });
}
