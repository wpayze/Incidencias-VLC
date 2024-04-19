import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Pressable,
} from "react-native";
import { useAuth } from "@/context/AuthContext";
import { Link } from "expo-router";
import colors from "@/constants/colors";

const SettingsPage = () => {
  const { isLoggedIn, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <View style={styles.container}>
      {isLoggedIn ? (
        <>
          <TouchableOpacity style={styles.button} onPress={() => {}}>
            <Text style={styles.buttonText}>Perfil</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={handleLogout}>
            <Text style={styles.buttonText}>Logout</Text>
          </TouchableOpacity>
        </>
      ) : (
        <Link href={"/(modals)/login"} style={styles.button} asChild>
          <Pressable>
            <Text style={styles.buttonText}>Iniciar Sesión</Text>
          </Pressable>
        </Link>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  button: {
    backgroundColor: colors.primary,
    width: "100%",
    padding: 15,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
  },
});

export default SettingsPage;
