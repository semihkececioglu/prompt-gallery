import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_URL,
});

// Tüm promptları getir
export const getPrompts = async () => {
  const response = await api.get("/prompts");
  return response.data;
};

// Tek prompt getir
export const getPromptById = async (id) => {
  const response = await api.get(`/prompts/${id}`);
  return response.data;
};

// Yeni prompt ekle
export const createPrompt = async (promptData) => {
  const response = await api.post("/prompts", promptData);
  return response.data;
};

// Prompt sil
export const deletePrompt = async (id) => {
  const response = await api.delete(`/prompts/${id}`);
  return response.data;
};

// Prompt güncelle
export const updatePrompt = async (id, promptData) => {
  const response = await api.put(`/prompts/${id}`, promptData);
  return response.data;
};

// Görsel yükle (Cloudinary)
export const uploadImage = async (file) => {
  const formData = new FormData();
  formData.append("image", file);

  const response = await axios.post(`${API_URL}/upload`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

// Login
export const login = async (username, password) => {
  const response = await api.post("/login", { username, password });
  return response.data;
};

export default api;
