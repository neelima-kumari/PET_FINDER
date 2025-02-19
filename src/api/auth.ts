import axios from "axios";

const API_BASE = "https://frontend-take-home-service.fetch.com";

export const login = async (name: string, email: string) => {
  const response = await axios.post(
    `${API_BASE}/auth/login`,
    { name, email },
    { withCredentials: true }
  );
  return response.data;
};

export const logout = async () => {
  await axios.post(`${API_BASE}/auth/logout`, {}, { withCredentials: true });
};
