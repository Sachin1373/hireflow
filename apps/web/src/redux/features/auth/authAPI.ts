import api from "@/axiosInstance";

export const loginUser = async (credentials: any) => {
  const response = await api.post("/auth/login", credentials);
  return response.data;
};

export const refreshAccessToken = async () => {
  const response = await api.post("/auth/refresh");
  return response.data;
};

export const fetchMe = async () => {
  const response = await api.get("/auth/me");
  return response.data;
};
