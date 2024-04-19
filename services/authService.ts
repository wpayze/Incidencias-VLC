import { LoginRequest } from "@/constants/request/loginRequest";
import { LoginResponse } from "@/constants/response/loginResponse";

const API_URL = process.env.EXPO_PUBLIC_API_URL;

const authService = {
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        throw new Error("Error en el login");
      }

      const data: LoginResponse = await response.json();
      return data;
    } catch (error) {
      throw error;
    }
  },
};

export default authService;
