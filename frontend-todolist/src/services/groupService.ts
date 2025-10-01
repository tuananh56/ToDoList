// services/groupService.ts
import api from "../utils/axios";
import { Group } from "../types";

export const groupService = {
  getMyGroups: async (): Promise<Group[]> => {
    const res = await api.get("/groups");
    return res.data;
  },

  getGroupDetail: async (id: number): Promise<Group> => {
    const res = await api.get(`/groups/${id}`);
    return res.data;
  },

  createGroup: async (name: string, description?: string): Promise<Group> => {
    const res = await api.post("/groups", { name, description });
    return res.data;
  },

  addMember: async (groupId: number, keyword: string) => {
    const res = await api.post(`/groups/${groupId}/add-member`, { keyword });
    return res.data;
  },

  endGroup: async (groupId: number) => {
    const res = await api.post(`/groups/${groupId}/end`);
    return res.data;
  },

  // ⭐ Mới: sửa nhóm
  editGroup: async (groupId: number, name: string, description?: string): Promise<Group> => {
    const res = await api.put(`/groups/${groupId}`, { name, description });
    return res.data;
  },

  // ⭐ Mới: xóa nhóm
  deleteGroup: async (groupId: number): Promise<void> => {
    await api.delete(`/groups/${groupId}`);
  },
};
