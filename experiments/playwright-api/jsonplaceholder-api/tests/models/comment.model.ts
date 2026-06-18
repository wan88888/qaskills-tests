export interface Comment {
  postId: number;
  id: number;
  name: string;
  email: string;
  body: string;
}

export interface CreateCommentRequest {
  postId: number;
  name: string;
  email: string;
  body: string;
}
