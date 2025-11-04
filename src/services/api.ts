import axios from 'axios';
import { Bookmark, Tag, Folder, CreateBookmarkDTO, UpdateBookmarkDTO, ApiResponse } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Bookmarks API
export const bookmarkAPI = {
  getAll: async (params?: { folder?: string; tag?: string; search?: string }) => {
    const response = await api.get<ApiResponse<Bookmark[]>>('/bookmarks', { params });
    return response.data;
  },

  getById: async (id: number) => {
    const response = await api.get<ApiResponse<Bookmark>>(`/bookmarks/${id}`);
    return response.data;
  },

  create: async (data: CreateBookmarkDTO) => {
    const response = await api.post<ApiResponse<Bookmark>>('/bookmarks', data);
    return response.data;
  },

  update: async (id: number, data: UpdateBookmarkDTO) => {
    const response = await api.put<ApiResponse<Bookmark>>(`/bookmarks/${id}`, data);
    return response.data;
  },

  delete: async (id: number) => {
    const response = await api.delete<ApiResponse<void>>(`/bookmarks/${id}`);
    return response.data;
  },

  getFolders: async () => {
    const response = await api.get<ApiResponse<Folder[]>>('/bookmarks/folders');
    return response.data;
  },
};

// Tags API
export const tagAPI = {
  getAll: async () => {
    const response = await api.get<ApiResponse<Tag[]>>('/tags');
    return response.data;
  },

  create: async (name: string) => {
    const response = await api.post<ApiResponse<Tag>>('/tags', { name });
    return response.data;
  },

  delete: async (id: number) => {
    const response = await api.delete<ApiResponse<void>>(`/tags/${id}`);
    return response.data;
  },
};

export default api;