// src/services/taskService.ts
import api from "../utils/axios";
import { Task, TaskPriority } from "../types";

interface CreateTaskDto {
  title: string;
  description?: string;
  assigneeId?: number;
  deadline?: string; // ISO string
  priority?: TaskPriority; // ✅ thêm priority
}

interface UpdateTaskDto {
  title?: string;
  description?: string;
  assigneeId?: number;
  deadline?: string; // ISO string
  status?: "pending" | "in_progress" | "completed" | "late";
  priority?: TaskPriority; // ✅ thêm priority
}

export const taskService = {
  createTask: async (groupId: number, dto: CreateTaskDto): Promise<Task> => {
    const res = await api.post(`/tasks/${groupId}`, dto);
    return res.data;
  },

  getTasksByGroup: async (groupId: number): Promise<Task[]> => {
    const res = await api.get(`/tasks/group/${groupId}`);
    return res.data;
  },

  updateTaskStatus: async (
    taskId: number,
    status: "pending" | "in_progress" | "completed" | "late"
  ): Promise<Task> => {
    const res = await api.patch(`/tasks/${taskId}/status`, { status });
    return res.data;
  },

  updateTask: async (
    taskId: number,
    dto: Partial<UpdateTaskDto>
  ): Promise<Task> => {
    const res = await api.patch(`/tasks/${taskId}`, dto);
    return res.data;
  },

  deleteTask: async (taskId: number): Promise<void> => {
    await api.delete(`/tasks/${taskId}`);
  },
};
