import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Profile({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>मेरा प्रोफ़ाइल</Text>
      </View>

      <View style={styles.body}>
        <Image source={require('../assets/Avatars.png')} style={styles.avatar} />
        <Text style={styles.name}>Demo User</Text>
        <Text style={styles.info}>Email: demo@example.com</Text>
        <Text style={styles.info}>Phone: +91 90000 00000</Text>

        <TouchableOpacity style={styles.button} onPress={() => navigation.goBack()}>
          <Text style={styles.buttonText}>वापस</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: { padding: 20, backgroundColor: '#8BCD45' },
  title: { color: '#fff', fontSize: 20, fontWeight: 'bold' },
  body: { alignItems: 'center', padding: 20 },
  avatar: { width: 120, height: 120, borderRadius: 60, marginBottom: 16 },
  name: { fontSize: 20, fontWeight: 'bold', marginBottom: 8 },
  info: { color: '#666', marginBottom: 6 },
  button: { marginTop: 20, backgroundColor: '#4A90E2', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 8 },
  buttonText: { color: '#fff', fontWeight: 'bold' },
});
