import axios from 'axios';
import { Group } from '../types';

const API_URL = 'http://localhost:3000';

export const getUserGroups = async (token: string): Promise<Group[]> => {
  const res = await axios.get(`${API_URL}/groups`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const createGroup = async (data: { name: string; description?: string }, token: string): Promise<Group> => {
  const res = await axios.post(`${API_URL}/groups`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const addMember = async (groupId: number, userId: number, token: string): Promise<Group> => {
  const res = await axios.post(`${API_URL}/groups/${groupId}/add-member`, { userId }, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const endGroup = async (groupId: number, token: string): Promise<Group> => {
  const res = await axios.post(`${API_URL}/groups/${groupId}/end`, {}, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};
