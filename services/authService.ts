interface LoginResponse {
  token: string;
}

interface LoginCredentials {
  username: string;
  password: string;
}

const authService = {
  login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
    try {
      const response = await fetch("TU_ENDPOINT_DE_LOGIN", {
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
