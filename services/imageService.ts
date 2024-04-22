import { getMimeType } from "@/app/helpers/helpers";

const API_URL = process.env.EXPO_PUBLIC_API_URL;

const imageService = {
  uploadImage: async (issueId: number, imageUri: string): Promise<any> => {
    try {
      const formData = new FormData();
      formData.append("issueId", issueId.toString());

      // @ts-ignore
      formData.append("image", {
        uri: imageUri,
        name: "photo.jpg",
        type: getMimeType(imageUri),
      });

      const response = await fetch(`${API_URL}/images/upload`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to upload image");
      }
      return await response.json();
    } catch (error) {
      console.error("Error uploading image:", error);
      throw error;
    }
  },
};

export default imageService;
