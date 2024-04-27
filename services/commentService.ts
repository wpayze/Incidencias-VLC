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
};

export default commentService;
