import React from "react";
import "../app.css";
import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      {/* root index -> login */}
      <Stack.Screen name="index" />
      {/* register page */}
      <Stack.Screen name="register" />
      {/* tabs layout */}
      <Stack.Screen name="tabs" />
    </Stack>
  );
}
