import Colors from "@/constants/colors";
import { Issue } from "@/constants/issue";
import issueService from "@/services/issueService";
import React, { useState, useEffect } from "react";
import { useRouter } from "expo-router";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  RefreshControl,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { useAuth } from "@/context/AuthContext";
import LogInBlock from "@/components/LogInBlock";
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import { Dimensions } from 'react-native';
import { Comment } from "@/constants/comment";
import commentService from "@/services/commentService";

interface IssueItemProps {
  issue: Issue;
}

interface CommentItemProps {
  comment: Comment;
}

const formatDateTime = (dateString: Date) => {
  const date = new Date(dateString);
  const formattedDate = date.toLocaleDateString('es-ES');
  const formattedTime = date.toLocaleTimeString('es-ES');
  return `${formattedDate} a las ${formattedTime}`;
};

const IssueItem: React.FC<IssueItemProps> = ({ issue }) => {
  const router = useRouter();
  return (
    <TouchableOpacity onPress={() => router.push(`/listing/${issue.id}`)}>
      <View style={styles.itemContainer}>
        <Text style={styles.activityText}>
          El {formatDateTime(issue.createdAt)}, creaste esta incidencia:
        </Text>
        <View style={styles.textContainer}>
          <Text style={styles.title}>{issue.title}</Text>
          <Text>{issue.address}</Text>
          <Text>Categoría: {issue.category.name}</Text>
          <Text>Estado: {issue.status.name}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const CommentItem: React.FC<CommentItemProps> = ({ comment }) => {
  const router = useRouter();
  return (
    <TouchableOpacity onPress={() => router.push(`/listing/${comment.issueId}`)}>
      <View style={styles.itemContainer}>
        <Text style={styles.activityText}>
          El {formatDateTime(comment.createdAt)}, comentaste:
        </Text>
        <View style={styles.textContainer}>
          <Text style={styles.title}>{comment.content}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const IssuesList: React.FC<{ issues: Issue[], refreshing: boolean, onRefresh: () => void }> = ({ issues, refreshing, onRefresh }) => (
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
);

const CommentsList:  React.FC<{ comments: Comment[] }> = ({ comments }) => (
  <FlatList
    data={comments}
    renderItem={({ item }) => <CommentItem comment={item} />}
    keyExtractor={(item) => item._id.toString()}
    contentContainerStyle={styles.listContainer}
  />
);

const Activity: React.FC = () => {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);

  const [loading, setLoading] = useState<boolean>(false);
  const [refreshing, setRefreshing] = useState(false);
  const { isLoggedIn, currentUser } = useAuth();
  const layout = Dimensions.get('window');

  useEffect(() => {
    const fetchIssues = async () => {
      try {
        if (!currentUser?.id) return;
        setLoading(true);
        const loadedIssues = await issueService.getIssuesByUserId(currentUser?.id);
        setIssues(loadedIssues);
        setLoading(false);
      } catch (error) {
        console.error("Error al cargar los issues:", error);
        setLoading(false);
      }
    };

    const fetchComments = async () => {
      try {
        if (!currentUser?.id) return;
        const loadedComments = await commentService.getCommentsByUserId(currentUser?.id);
        setComments(loadedComments);
      } catch (error) {
        console.error("Error al cargar los comments:", error);
      }
    };

    fetchIssues();
    fetchComments();
  }, [currentUser]);

  const onRefresh = async () => {
    if (!currentUser?.id) return;

    setRefreshing(true);
    try {
      const loadedIssues = await issueService.getIssuesByUserId(currentUser?.id);
      setIssues(loadedIssues);
    } catch (error) {
      console.error("Error al recargar los issues:", error);
    }
    setRefreshing(false);
  };

  const renderScene = SceneMap({
    issues: () => <IssuesList issues={issues} refreshing={refreshing} onRefresh={onRefresh} />,
    comments: () =>  <CommentsList comments={comments} />,
  });

  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: 'issues', title: 'Incidencias' },
    { key: 'comments', title: 'Comentarios' },
  ]);

  if (!isLoggedIn) {
    return <LogInBlock title="Actividad reciente" instructions="Para ver tu actividad reciente, es necesario iniciar sesión." />;
  }

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <TabView
      navigationState={{ index, routes }}
      renderScene={renderScene}
      onIndexChange={setIndex}
      initialLayout={{ width: layout.width }}
      renderTabBar={props => (
        <TabBar
          {...props}
          indicatorStyle={{ backgroundColor: Colors.primary }}
          style={{ backgroundColor: 'white' }}
          labelStyle={{ color: Colors.primary }}
          activeColor={Colors.primary}
          inactiveColor={Colors.primary}
        />
      )}
    />
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f8f8",
    width: '100%',
  },
  itemContainer: {
    flexDirection: "column",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    backgroundColor: "#fff",
    marginBottom: 5,
    width: '100%',
  },
  textContainer: {
    flex: 1,
    flexDirection: "column",
  },
  title: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 5,
  },
  activityText: {
    fontStyle: "italic",
    color: "#777",
    marginBottom: 10,
  },
  listContainer: {
    paddingHorizontal: 10,
    paddingVertical: 20,
    width: '100%',
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default Activity;
