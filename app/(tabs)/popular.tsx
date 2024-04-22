import Colors from "@/constants/colors";
import { Issue } from "@/constants/issue";
import issueService from "@/services/issueService";
import React, { useState, useEffect } from "react";
import { Link } from "expo-router";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Image,
  RefreshControl,
  ActivityIndicator,
} from "react-native";

interface IssueItemProps {
  issue: Issue;
}

const API_URL = process.env.EXPO_PUBLIC_API_URL;

const IssueItem: React.FC<IssueItemProps> = ({ issue }) => {
  return (
    <Link href={`/listing/${issue.id}`}>
      <View style={styles.itemContainer}>
        <Image source={{ uri: `${API_URL}/images/${issue.imageUrl}` }} style={styles.image} />
        <View style={styles.textContainer}>
          <Text style={styles.title}>{issue.title}</Text>
          <Text>{issue.description}</Text>
          <Text>{issue.address}</Text>
          <Text>Categoría: {issue.category.name}</Text>
          <Text>Estado: {issue.status.name}</Text>
        </View>
      </View>
    </Link>
  );
};

const Page: React.FC = () => {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    const fetchIssues = async () => {
      try {
        setLoading(true);
        const loadedIssues = await issueService.getIssues();
        setIssues(loadedIssues);
        setLoading(false);
      } catch (error) {
        console.error("Error al cargar los issues:", error);
        setLoading(false);
      }
    };

    fetchIssues();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      const loadedIssues = await issueService.getIssues();
      setIssues(loadedIssues);
    } catch (error) {
      console.error("Error al recargar los issues:", error);
    }
    setRefreshing(false);
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <View>
      <FlatList
        data={issues}
        renderItem={({ item }) => <IssueItem issue={item} />}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[Colors.primary]}
            tintColor={Colors.primary}
          />
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  itemContainer: {
    flexDirection: "row",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  image: {
    width: 100,
    height: 100,
    marginRight: 10,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontWeight: "bold",
  },
  listContainer: {
    paddingHorizontal: 10,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default Page;
