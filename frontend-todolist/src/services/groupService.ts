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

  // 👇 Đổi từ userId sang keyword
  addMember: async (groupId: number, keyword: string) => {
    const res = await api.post(`/groups/${groupId}/add-member`, { keyword });
    return res.data;
  },

  endGroup: async (groupId: number) => {
    const res = await api.post(`/groups/${groupId}/end`);
    return res.data;
  },
};
