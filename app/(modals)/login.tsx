import colors from "@/constants/colors";
import { LoginRequest } from "@/constants/request/loginRequest";
import { LoginResponse } from "@/constants/response/loginResponse";
import { useAuth } from "@/context/AuthContext";
import authService from "@/services/authService";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";

const LoginPage = () => {
  const [loginState, setLoginState] = useState<LoginRequest>({
    email: "wil@uv.es",
    password: "password",
  });
  const [error, setError] = useState<string>('');

  const handleEmailChange = (email: string) => {
    setLoginState({ ...loginState, email });
  };

  const handlePasswordChange = (password: string) => {
    setLoginState({ ...loginState, password });
  };

  const { login } = useAuth();

  const handleLogin = async () => {
    if (!loginState.email.trim() || !loginState.password.trim()) {
      setError("El email y la contraseña no pueden estar vacíos.")
    }

    try {
      const response: LoginResponse = await authService.login(loginState);
      login(response.user, response.token);
      router.back();
    } catch (error) {
      setError("Credenciales incorrectas.")
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={loginState.email}
        onChangeText={handleEmailChange}
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={loginState.password}
        onChangeText={handlePasswordChange}
        secureTextEntry={true}
        autoCapitalize="none"
      />
      <TouchableOpacity onPress={handleLogin} style={styles.button}>
        <Text style={styles.buttonText}>Iniciar Sesión</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  input: {
    width: "100%",
    height: 40,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
  },
  button: {
    backgroundColor: colors.primary,
    width: "100%",
    padding: 10,
    alignItems: "center",
    borderRadius: 5,
  },
  buttonText: {
    color: "white",
  },
  errorText: {
    color: 'red',
    marginTop: 10,
    marginBottom: 5,
    textAlign: 'center', 
  }
});

export default LoginPage;
