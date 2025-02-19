import axios from "axios";

const API_BASE = "https://frontend-take-home-service.fetch.com";

export const getBreeds = async (): Promise<string[]> => {
  const response = await axios.get(`${API_BASE}/dogs/breeds`, {
    withCredentials: true,
  });
  return response.data;
};

export const searchDogs = async (params: any) => {
  const response = await axios.get(`${API_BASE}/dogs/search`, {
    withCredentials: true,
    params,
  });
  return response.data;
};

export const getDogsByIds = async (ids: string[]) => {
  const response = await axios.post(`${API_BASE}/dogs`, ids, {
    withCredentials: true,
  });
  return response.data;
};

export const getMatch = async (dogIds: string[]) => {
  try {
    const response = await fetch(
      "https://frontend-take-home-service.fetch.com/dogs/match",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dogIds),
        credentials: "include", // Ensures authentication cookie is sent
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch match");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching match:", error);
    return null;
  }
};
