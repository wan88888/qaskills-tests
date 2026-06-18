export interface Post {
  userId: number;
  id: number;
  title: string;
  body: string;
}

export interface CreatePostRequest {
  title: string;
  body: string;
  userId: number;
}

export interface UpdatePostRequest {
  title?: string;
  body?: string;
  userId?: number;
}
