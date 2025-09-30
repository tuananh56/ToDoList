// services/auth.ts
import axios from "axios";

const API_URL = "http://localhost:3001"; // URL backend

export interface LoginResponse {
  token: string;
  user: {
    id: number;
    username: string;
    email: string;
    role: string;
  };
}

export const loginApi = async (email: string, password: string): Promise<LoginResponse> => {
  const res = await axios.post(`${API_URL}/auth/login`, { email, password });
  return res.data;
};

export const registerApi = async (username: string, email: string, password: string) => {
  const res = await axios.post(`${API_URL}/auth/register`, { username, email, password });
  return res.data;
};
