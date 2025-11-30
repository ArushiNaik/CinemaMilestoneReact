
import axios from "axios";

const BASE = import.meta.env.VITE_API_BASE || "http://localhost:8080";

export async function apiGet(path: string) {
  const response = await axios.get(`${BASE}${path}`);
  return response.data;
}

export async function apiPost(path: string, data?: any) {
  const response = await axios.post(`${BASE}${path}`, data);
  return response.data;
}

export async function apiPut(path: string, data?: any) {
  const response = await axios.put(`${BASE}${path}`, data);
  return response.data;
}

export async function apiDelete(path: string) {
  const response = await axios.delete(`${BASE}${path}`);
  return response.data;
}
