import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  ScrollView,
  Image,
  Button,
  TextInput,
  Alert,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Link, useLocalSearchParams } from "expo-router";
import issueService from "@/services/issueService";
import { Issue } from "@/constants/issue";
import Colors from "@/constants/colors";
import { useAuth } from "@/context/AuthContext";
import commentService from "@/services/commentService";
import { Comment, newComment } from "@/constants/comment";

const API_URL = process.env.EXPO_PUBLIC_API_URL;

const Page = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [issue, setIssue] = useState<Issue | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [commentText, setCommentText] = useState("");
  const { isLoggedIn, currentUser } = useAuth();

  useEffect(() => {
    fetchIssue();
  }, [id]);

  const fetchIssue = () => {
    if (id)
      issueService
        .getIssue(id)
        .then(setIssue)
        .catch((error) => {
          console.error(error);
          setError("Failed to load issue details");
        })
        .finally(() => setLoading(false));
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = {
      day: "2-digit",
      month: "long",
      year: "numeric",
    };
    return date.toLocaleDateString("es-ES", options);
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text>{error}</Text>
      </View>
    );
  }

  const handleAddComment = () => {
    Alert.alert(
      "Confirmar comentario",
      "¿Estás seguro de que deseas agregar este comentario?",
      [
        {
          text: "Cancelar",
          onPress: () => console.log("Operación cancelada"),
          style: "cancel",
        },
        {
          text: "Confirmar",
          onPress: () => addComment(),
        },
      ]
    );
  };

  const addComment = () => {
    if (commentText && currentUser?.id) {
      const newComment: newComment = {
        issueId: parseInt(id),
        userId: currentUser?.id,
        content: commentText,
      };
      
      commentService
        .createComment(newComment)
        .then(() => setCommentText(""))
        .catch((error) => {
          console.error(error);
          setError("Failed to create comment");
        })
        .finally(() => fetchIssue());
    }
  };
  return (
    <ScrollView style={styles.container}>
      {issue ? (
        <>
          <Image
            source={{ uri: `${API_URL}/images/${issue.imageUrl}` }}
            style={styles.image}
          />
          <View style={styles.textContainer}>
            <Text style={styles.title}>{issue.title}</Text>
            <Text style={styles.dateText}>
              Reportado el {formatDate(issue.createdAt.toString())}
            </Text>
            <Text style={styles.description}>{issue.description}</Text>
            <Text style={styles.status}>{issue.status.name}</Text>
          </View>

          <View style={styles.commentsSection}>
            <Text style={styles.commentsTitle}>Comentarios</Text>
            {issue.comments.length > 0 ? (
              issue.comments.map((comment, index) => (
                <View key={index} style={styles.comment}>
                  <Text style={styles.commentContent}>{comment.content}</Text>
                  <Text style={styles.commentUser}>- {comment.user.name}</Text>
                </View>
              ))
            ) : (
              <Text style={styles.noComments}>No hay comentarios aún.</Text>
            )}
            {isLoggedIn ? (
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  value={commentText}
                  onChangeText={setCommentText}
                  placeholder="Añade un comentario..."
                />
                <Button
                  title="Comentar"
                  onPress={handleAddComment}
                  color={Colors.primary}
                />
              </View>
            ) : (
              <Text style={styles.loginPrompt}>
                Para comentar, debes {""}
                <Link href={"/(modals)/login"}>
                    <Text style={styles.loginLink}>iniciar sesión</Text>
                </Link>
                .
              </Text>
            )}
          </View>
        </>
      ) : (
        <Text>No issue found with ID {id}</Text>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
  },
  image: {
    width: "100%",
    height: 200,
    resizeMode: "cover",
    borderBottomRightRadius: 20,
    borderBottomLeftRadius: 20,
    overflow: "hidden",
  },
  textContainer: {
    padding: 20,
    backgroundColor: "#ffffff",
    borderBottomWidth: 1,
    borderBottomColor: "#dddddd",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 5,
  },
  dateText: {
    fontSize: 14,
    color: "#666",
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    marginBottom: 10,
    lineHeight: 24,
    color: "#333",
  },
  status: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.primary,
  },
  commentsSection: {
    padding: 20,
    backgroundColor: "#ffffff",
    borderTopWidth: 1,
    borderTopColor: "#eeeeee",
    marginTop: 10,
  },
  commentsTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  comment: {
    marginBottom: 5,
    paddingLeft: 10,
    borderLeftWidth: 3,
    borderLeftColor: Colors.primary,
  },
  commentContent: {
    fontSize: 16,
    color: "#444",
  },
  commentUser: {
    fontSize: 14,
    color: "#888",
    fontStyle: "italic",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginRight: 10,
    borderRadius: 5,
    backgroundColor: "#fff",
  },
  errorText: {
    fontSize: 18,
    color: "red",
    textAlign: "center",
    marginTop: 20,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  noComments: {
    fontSize: 16,
    color: "#666",
    fontStyle: "italic",
    textAlign: "center",
    marginTop: 10,
  },
  loginPrompt: {
    fontSize: 16,
    textAlign: "center",
    color: "#666",
    marginTop: 10,
  },
  loginLink: {
    color: Colors.primary,
    textDecorationLine: "underline",
  },
});

export default Page;
