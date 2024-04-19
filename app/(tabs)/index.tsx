import React, { useEffect, useState } from "react";
import MapView, { Callout, Marker, PROVIDER_GOOGLE } from "react-native-maps";
import { StyleSheet, View, Text, Alert } from "react-native";
import { Issue } from "@/constants/issue";
import issueService from "@/services/issueService";
import { router } from "expo-router";

const INITIAL_REGION = {
  latitude: 39.466667,
  longitude: -0.375,
  latitudeDelta: 0.1,
  longitudeDelta: 0.1,
};

export default function App() {
  const [issues, setIssues] = useState<Issue[]>([]);

  useEffect(() => {
    const fetchIssues = async () => {
      try {
        const loadedIssues = await issueService.getIssues();
        setIssues(loadedIssues);
      } catch (error) {
        console.error("Error al cargar los issues:", error);
      }
    };

    fetchIssues();
  }, []);

  const onMarkerSelected = (issue: Issue) => {
    router.navigate(`/listing/${issue.id}`);
  };

  return (
    <View style={{ flex: 1 }}>
      <MapView
        style={StyleSheet.absoluteFill}
        initialRegion={INITIAL_REGION}
        showsUserLocation={true}
        showsMyLocationButton={true}
      >
        {issues.map((issue, index) => (
          <Marker
            key={index}
            coordinate={issue}
            onPress={() => onMarkerSelected(issue)}
          />
        ))}
      </MapView>
    </View>
  );
}
