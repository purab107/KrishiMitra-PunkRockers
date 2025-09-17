import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Profile({ navigation }) {
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState('Demo User');
  const [email, setEmail] = useState('demo@example.com');
  const [phone, setPhone] = useState('+91 90000 00000');

  // Try to load/save with AsyncStorage if available (optional dependency)
  let AsyncStorage = null;
  try {
    // dynamic require so missing package doesn't crash the app during bundling in some setups
    // eslint-disable-next-line global-require
    AsyncStorage = require('@react-native-async-storage/async-storage');
  } catch (e) {
    AsyncStorage = null;
  }

  useEffect(() => {
    const load = async () => {
      if (!AsyncStorage) return;
      try {
        const raw = await AsyncStorage.getItem('profile');
        if (raw) {
          const p = JSON.parse(raw);
          if (p.name) setName(p.name);
          if (p.email) setEmail(p.email);
          if (p.phone) setPhone(p.phone);
        }
      } catch (err) {
        // ignore
      }
    };
    load();
  }, []);

  const save = async () => {
    setEditing(false);
    if (!AsyncStorage) return;
    try {
      await AsyncStorage.setItem('profile', JSON.stringify({ name, email, phone }));
    } catch (err) {
      // ignore
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>मेरा प्रोफ़ाइल</Text>
        <TouchableOpacity style={styles.editButton} onPress={() => (editing ? save() : setEditing(true))}>
          <Text style={styles.editButtonText}>{editing ? 'Save' : 'Edit'}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.body}>
        <Image source={require('../assets/Avatars.png')} style={styles.avatar} />

        {editing ? (
          <View style={{ width: '100%', paddingHorizontal: 20 }}>
            <Text style={styles.label}>नाम</Text>
            <TextInput style={styles.input} value={name} onChangeText={setName} />
            <Text style={styles.label}>ईमेल</Text>
            <TextInput style={styles.input} value={email} onChangeText={setEmail} keyboardType="email-address" />
            <Text style={styles.label}>फ़ोन</Text>
            <TextInput style={styles.input} value={phone} onChangeText={setPhone} keyboardType="phone-pad" />
          </View>
        ) : (
          <>
            <Text style={styles.name}>{name}</Text>
            <Text style={styles.info}>Email: {email}</Text>
            <Text style={styles.info}>Phone: {phone}</Text>
          </>
        )}

        {!editing && (
          <TouchableOpacity style={styles.button} onPress={() => navigation.goBack()}>
            <Text style={styles.buttonText}>वापस</Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: { padding: 16, backgroundColor: '#8BCD45', flexDirection: 'row', alignItems: 'center' },
  backButton: { padding: 6 },
  backText: { color: '#fff', fontSize: 18 },
  title: { color: '#fff', fontSize: 18, fontWeight: '700', marginLeft: 8, flex: 1 },
  editButton: { paddingHorizontal: 12, paddingVertical: 6, backgroundColor: 'transparent' },
  editButtonText: { color: '#fff', fontWeight: '700' },
  body: { alignItems: 'center', padding: 20 },
  avatar: { width: 120, height: 120, borderRadius: 60, marginBottom: 16 },
  name: { fontSize: 20, fontWeight: 'bold', marginBottom: 8 },
  info: { color: '#666', marginBottom: 6 },
  input: { width: '100%', borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 8, marginBottom: 10 },
  label: { alignSelf: 'flex-start', marginLeft: 20, color: '#333', fontWeight: '600', marginTop: 8 },
  button: { marginTop: 20, backgroundColor: '#4A90E2', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 8 },
  buttonText: { color: '#fff', fontWeight: 'bold' },
});
