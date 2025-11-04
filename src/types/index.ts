export interface Bookmark {
  id: number;
  title: string;
  url: string;
  description: string | null;
  favicon: string | null;
  folder: string;
  created_at: string;
  updated_at: string;
  tags: Tag[];
}

export interface Tag {
  id: number;
  name: string;
  created_at: string;
  usage_count?: number;
}

export interface Folder {
  folder: string;
  count: number;
}

export interface CreateBookmarkDTO {
  url: string;
  title?: string;
  description?: string;
  favicon?: string;
  folder?: string;
  tags?: string[];
}

export interface UpdateBookmarkDTO {
  title?: string;
  description?: string;
  folder?: string;
  tags?: string[];
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}