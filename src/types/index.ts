// User Types
export interface User {
  id: number;
  username: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  created_at: string;
  last_login?: string;
  total_bookmarks?: number;
  public_bookmarks?: number;
}

export interface RegisterDTO {
  username: string;
  email: string;
  password: string;
  full_name?: string;
}

export interface LoginDTO {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  tokens: {
    accessToken: string;
    refreshToken: string;
  };
}

// Bookmark Types
export interface Bookmark {
  id: number;
  user_id: number;
  title: string;
  url: string;
  description: string | null;
  favicon: string | null;
  folder: string;
  is_public: boolean;
  created_at: string;
  updated_at: string;
  tags: Tag[];
  user?: User;
}

export interface Tag {
  id: number;
  user_id: number;
  name: string;
  created_at: string;
  usage_count?: number;
}

export interface Folder {
  folder: string;
  count: number;
}

export interface CreateBookmarkDTO {
  url?: string;
  title?: string;
  description?: string;
  favicon?: string;
  folder?: string;
  is_public?: boolean;
  tags?: string[];
}

export interface UpdateBookmarkDTO {
   url?: string;
  title?: string;
  description?: string;
  folder?: string;
  is_public?: boolean;
  tags?: string[];
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}