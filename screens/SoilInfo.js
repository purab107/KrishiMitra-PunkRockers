import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export default function SoilInfo({ navigation }) {
  const [location, setLocation] = useState('Raipur');
  const [ph, setPh] = useState('6.5');
  const [texture, setTexture] = useState('Loam');
  const [organic, setOrganic] = useState('2.0');
  const [resultsVisible, setResultsVisible] = useState(false);

  const analyze = () => {
    // For now, simple local rules to create a recommendation
    setResultsVisible(true);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={22} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>मिट्टी जानकारी</Text>
      </View>

      <ScrollView contentContainerStyle={styles.body}>
        <View style={styles.card}>
          <Text style={styles.label}>स्थान</Text>
          <TextInput value={location} onChangeText={setLocation} style={styles.input} />

          <Text style={styles.label}>pH</Text>
          <TextInput value={ph} onChangeText={setPh} keyboardType="numeric" style={styles.input} />

          <Text style={styles.label}>मिट्टी संरचना</Text>
          <View style={styles.row}>
            {['Sandy', 'Loam', 'Clay'].map(t => (
              <TouchableOpacity key={t} onPress={() => setTexture(t)} style={[styles.chip, texture === t && styles.chipActive]}>
                <Text style={[styles.chipText, texture === t && styles.chipTextActive]}>{t}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.label}>कार्बनिक पदार्थ (%)</Text>
          <TextInput value={organic} onChangeText={setOrganic} keyboardType="numeric" style={styles.input} />

          <TouchableOpacity style={styles.button} onPress={analyze}>
            <Text style={styles.buttonText}>नमूना विश्लेषण करें</Text>
          </TouchableOpacity>
        </View>

        {resultsVisible && (
          <View style={styles.card}>
            <Text style={styles.resultTitle}>परिणाम — {location}</Text>
            <Text style={styles.resultItem}>pH: {ph}</Text>
            <Text style={styles.resultItem}>मिट्टी: {texture}</Text>
            <Text style={styles.resultItem}>कार्बनिक पदार्थ: {organic}%</Text>

            <View style={{ height: 12 }} />
            <Text style={styles.recoTitle}>सिफारिशें</Text>
            <Text style={styles.recoText}>- pH 6 से कम है तो लाइम डालने पर विचार करें।</Text>
            <Text style={styles.recoText}>- कार्बनिक पदार्थ कम है तो खाद/हरी खाद जोड़ें।</Text>
            <Text style={styles.recoText}>- रेतीली मिट्टी के लिए सिंचाई बार-बार करें।</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: { padding: 16, backgroundColor: '#8BCD45', flexDirection: 'row', alignItems: 'center' },
  backButton: { padding: 6 },
  headerTitle: { color: '#fff', fontWeight: '700', fontSize: 18, marginLeft: 8 },
  body: { padding: 16 },
  card: { backgroundColor: '#fff', padding: 12, borderRadius: 10, marginBottom: 12, elevation: 3, borderWidth: 1, borderColor: '#eee' },
  label: { fontSize: 14, color: '#333', marginTop: 8 },
  input: { borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 8, marginTop: 6 },
  row: { flexDirection: 'row', marginTop: 8 },
  chip: { paddingVertical: 8, paddingHorizontal: 12, borderRadius: 20, backgroundColor: '#eee', marginRight: 8 },
  chipActive: { backgroundColor: '#4A90E2' },
  chipText: { color: '#333' },
  chipTextActive: { color: '#fff' },
  button: { backgroundColor: '#4A90E2', padding: 12, borderRadius: 8, marginTop: 12, alignItems: 'center' },
  buttonText: { color: '#fff', fontWeight: '700' },
  resultTitle: { fontSize: 16, fontWeight: '700', marginBottom: 6 },
  resultItem: { fontSize: 14, marginBottom: 4 },
  recoTitle: { fontWeight: '700', marginTop: 8 },
  recoText: { fontSize: 13, marginTop: 4 },
});
