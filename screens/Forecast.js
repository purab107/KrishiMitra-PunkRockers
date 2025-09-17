import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Forecast({ navigation }) {
  const [loading, setLoading] = useState(true);
  const [days, setDays] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch('http://localhost:5000/api/weather/forecast?q=Raipur,IN');
        const json = await res.json();
        if (json.ok) setDays(json.days || []);
        else setError(json.message || 'Failed to load forecast');
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={22} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.title}>5-Day Forecast</Text>
      </View>
      <View style={styles.body}>
        {loading ? (
          <ActivityIndicator />
        ) : error ? (
          <Text style={{ color: 'red' }}>{error}</Text>
        ) : (
          <FlatList
            data={days}
            keyExtractor={(item) => item.date}
            renderItem={({ item }) => (
              <View style={styles.row}>
                <Text style={styles.date}>{item.date}</Text>
                <Text style={styles.temp}>{item.temp_min}° / {item.temp_max}°</Text>
                <Text style={styles.weather}>{item.weather}</Text>
              </View>
            )}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: { padding: 16, backgroundColor: '#8BCD45', flexDirection: 'row', alignItems: 'center' },
  title: { color: '#fff', fontWeight: 'bold', fontSize: 18, marginLeft: 8 },
  backButton: { padding: 6 },
  body: { padding: 16 },
  row: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 12, borderBottomWidth: 1, borderColor: '#eee' },
  date: { fontWeight: '600' },
  temp: { color: '#333' },
  weather: { color: '#666' },
});
