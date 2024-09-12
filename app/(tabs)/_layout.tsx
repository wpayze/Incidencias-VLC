import React from "react";
import { Tabs } from "expo-router";
import { FontAwesome6 } from "@expo/vector-icons";
import Colors from "@/constants/colors";

const Layout = () => {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors.primary,
        tabBarLabelStyle: {
          fontFamily: "mon-sb",
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarLabel: "Inicio",
          title: "Inicio",
          tabBarIcon: ({ size, color }) => (
            <FontAwesome6 name="house" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="popular"
        options={{
          tabBarLabel: "Recientes",
          title: "Incidencias mas recientes",
          tabBarIcon: ({ size, color }) => (
            <FontAwesome6 name="fire" size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="createIssue"
        options={{
          tabBarLabel: "Reportar",
          title: "Reportar una incidencia",
          tabBarIcon: ({ size, color }) => (
            <FontAwesome6 name="circle-plus" size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="activity"
        options={{
          tabBarLabel: "Actividad",
          title: "Actividad reciente",
          tabBarIcon: ({ size, color }) => (
            <FontAwesome6 name="list" size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="settings"
        options={{
          tabBarLabel: "Ajustes",
          title: "Ajustes",
          tabBarIcon: ({ size, color }) => (
            <FontAwesome6 name="gears" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
};

export default Layout;
