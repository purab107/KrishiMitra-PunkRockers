import React, { useState } from "react";
import { View, Text, TextInput, StyleSheet, ScrollView } from "react-native";
import PrimaryButton from "../../components/ui/PrimaryButton";
import { useRouter } from "expo-router";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>🌾 Farmer Login</Text>

      <TextInput
        style={styles.input}
        placeholder="Phone / Username"
        value={username}
        onChangeText={setUsername}
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

  {/* navigate to the dashboard inside tabs */}
  <PrimaryButton title="Login" onPress={() => router.replace("/(tabs)")} />

  <View style={{ height: 10 }} />

  <PrimaryButton title="Register" onPress={() => router.push("/register")} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 20, backgroundColor: "#fff" },
  title: { fontSize: 24, fontWeight: "700", marginBottom: 20, textAlign: "center" },
  input: { borderWidth: 1, borderColor: "#ccc", padding: 10, marginBottom: 12, borderRadius: 8 },
});
