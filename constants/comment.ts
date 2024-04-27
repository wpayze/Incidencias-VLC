import { User } from "./user";

interface CommentBase {
  issueId: number;
  userId: number;
  content: string;
}

export interface Comment extends CommentBase {
  _id: string;
  createdAt: Date;
  parentId?: string;
  user: User;
}

export interface newComment extends CommentBase {}
