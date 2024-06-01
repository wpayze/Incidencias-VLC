import colors from "@/constants/colors";
import { Link } from "expo-router";
import React from "react";
import { StyleSheet, Text, View, Pressable } from "react-native";

interface LogInBlockProps {
  title: string;
  instructions: string;
}

const LogInBlock: React.FC<LogInBlockProps> = ({ title, instructions }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.instructions}>
        {instructions}
      </Text>

      <Link href={"/(modals)/login"} asChild>
        <Pressable>
          <Text style={styles.boton}>Iniciar Sesión</Text>
        </Pressable>
      </Link>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  instructions: {
    fontSize: 18,
    textAlign: "center",
    marginBottom: 20,
  },
  boton: {
    backgroundColor: colors.primary,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    color: "#ffffff",
    fontSize: 16,
  },
});

export default LogInBlock;
