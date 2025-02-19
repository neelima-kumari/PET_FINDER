import axios from "axios";

const api = axios.create({
  baseURL: "https://frontend-take-home-service.fetch.com",
  withCredentials: true,
});

export const login = (name: string, email: string) =>
  api.post("/auth/login", { name, email });
export const getBreeds = () => api.get<string[]>("/dogs/breeds");
export const searchDogs = (params: any) => api.get("/dogs/search", { params });
export const getDogDetails = (ids: string[]) => api.post("/dogs", ids);
export const getMatch = (ids: string[]) => api.post("/dogs/match", ids);
