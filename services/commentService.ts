import { Comment, newComment } from "@/constants/comment";

const API_URL = process.env.EXPO_PUBLIC_API_URL;

const commentService = {
  createComment: async (newComment: newComment): Promise<Comment> => {
    try {
      const response = await fetch(`${API_URL}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newComment),
      });

      if (!response.ok) {
        throw new Error(`Error al crear el comentario`);
      }

      const createdComment: Comment = await response.json();
      return createdComment;
    } catch (error) {
      console.error(`Hubo un problema al crear el comentario:`, error);
      throw error;
    }
  },
  getCommentsByUserId: async (userId: number): Promise<Comment[]> => {
    try {
      const response = await fetch(`${API_URL}/comments/user/${userId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(
          `Error al obtener comentarios del usuario con ID ${userId}`
        );
      }

      const comments: Comment[] = await response.json();
      return comments;
    } catch (error) {
      console.error(`Hubo un problema al obtener los comentarios:`, error);
      throw error;
    }
  },
};

export default commentService;
