import { useState } from "react";
import { View, Text, TextInput, StyleSheet, ScrollView } from "react-native";
import PrimaryButton from "../components/ui/PrimaryButton";
import { useRouter } from "expo-router";

export default function LoginScreen() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', padding: 20 }}>
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

  <PrimaryButton title="Login" onPress={() => router.replace("/(tabs)")} />
  <View style={{ height: 10 }} />
  <PrimaryButton title="Register" onPress={() => router.push("/register")} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 20 },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20, textAlign: "center" },
  input: { borderWidth: 1, borderColor: "#ccc", padding: 10, marginBottom: 10, borderRadius: 8 },
});
