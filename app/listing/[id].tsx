import { View, Text, ActivityIndicator, StyleSheet, ScrollView, Image } from "react-native";
import React, { useEffect, useState } from "react";
import { useLocalSearchParams } from "expo-router";
import issueService from "@/services/issueService";
import { Issue } from "@/constants/issue";
import Colors from "@/constants/colors";

const Page = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [issue, setIssue] = useState<Issue | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    if (id) {
      issueService
        .getIssue(id)
        .then(setIssue)
        .catch((error) => {
          console.error(error);
          setError("Failed to load issue details");
        })
        .finally(() => setLoading(false));
    }
  }, [id]);

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = { day: '2-digit', month: 'long', year: 'numeric' };
    return date.toLocaleDateString('es-ES', options);
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

  return (
    <ScrollView style={styles.container}>
      {issue ? (
        <>
          <Image source={{ uri: issue.imageUrl }} style={styles.image} />
          <View style={styles.textContainer}>
            <Text style={styles.title}>{issue.title}</Text>
            <Text>Reportado el {formatDate(issue.createdAt.toString())}</Text>
            <Text>{issue.description}</Text>
            <Text>{issue.status.name}</Text>
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
  },
  image: {
    width: "100%",
    height: 200,
    resizeMode: "cover",
  },
  textContainer: {
    paddingHorizontal: 20,
    alignItems: "flex-start",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 10,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default Page;
