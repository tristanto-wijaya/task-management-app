export type TaskStatus = "todo" | "in_progress" | "done";

export interface User {
  id: number;
  name: string;
  email: string;
}

export interface Task {
  id: number;
  title: string;
  description: string | null;
  deadline: string | null;
  status: TaskStatus;
  assignee: User | null;
  created_at: string;
  updated_at: string;
}

export interface TaskCreateInput {
  title: string;
  description?: string | null;
  deadline: string;
  status: TaskStatus;
  assignee_id: number;
}

export interface TaskUpdateInput {
  title?: string;
  description?: string | null;
  deadline?: string;
  status?: TaskStatus;
  assignee_id?: number;
}

export interface ChatResponse {
  answer: string;
  intent: string;
}
