import { jwtDecode } from "jwt-decode";

export interface CurrentUser {
  id: number;
  username: string;
}

export const getCurrentUser = (): CurrentUser | null => {
  const token = localStorage.getItem("token");
  if (!token) return null;

  try {
    const decoded = jwtDecode<{ id: number; username: string }>(token);
    return {
      id: decoded.id,
      username: decoded.username,
    };
  } catch (err) {
    console.error("Invalid token", err);
    return null;
  }
};
