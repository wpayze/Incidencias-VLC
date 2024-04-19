import React, { createContext, useContext, useState, ReactNode } from "react";
import { User } from "@/constants/user";

interface AuthContextType {
  isLoggedIn: boolean;
  login: (user: User, token: string) => void;
  logout: () => void;
  currentUser: User | null;
  token: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth debe usarse dentro de un AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [token, setToken] = useState<string>("");

  const login = (user: User, token: string) => {
    setIsLoggedIn(true);
    setCurrentUser(user);
    setToken(token);
  };

  const logout = () => {
    setIsLoggedIn(false);
    setCurrentUser(null);
    setToken("");
  };

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        login,
        logout,
        currentUser,
        token,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
