export interface User {
  id: number;
  username: string;
  email: string;
  role: string;
}

export type TaskStatus = "pending" | "in_progress" | "completed" | "late";

export interface Task {
  [x: string]: string | number | Date;
  id: number;
  title: string;
  description?: string;
  status: TaskStatus;
  deadline?: string; // ISO string từ backend
  assignee?: User;
}

export interface Group {
  id: number;
  name: string;
  description?: string;
  isEnded: boolean;
  createdAt: string;
  leader: User;
  members: User[];
  tasks: Task[];
}

// FE interface để gửi dữ liệu tạo task
export interface CreateTaskDto {
  title: string;
  description?: string;
  assigneeId?: number;
  deadline?: string; // ISO string
}
