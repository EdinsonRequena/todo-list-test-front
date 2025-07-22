import { api } from "./api";

export interface AuthPayload {
  email: string;
  password: string;
}
interface AuthResponse {
  user: { id: number; email: string };
  token: string;
}

export const login = async (data: AuthPayload) => {
  const res = await api.post<AuthResponse, AuthPayload>("auth/login", data);
  localStorage.setItem("token", res.token);
  return res.user;
};

export const register = async (data: AuthPayload) => {
  const res = await api.post<AuthResponse, AuthPayload>("auth/register", data);
  localStorage.setItem("token", res.token);
  return res.user;
};
