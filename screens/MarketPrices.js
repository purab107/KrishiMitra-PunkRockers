import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function MarketPrices() {
  const [loading, setLoading] = useState(true);
  const [markets, setMarkets] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch('http://localhost:5000/api/market/prices');
        const json = await res.json();
        if (json.ok) setMarkets(json.markets || []);
        else setError(json.message || 'Failed to load prices');
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
      <View style={styles.header}><Text style={styles.title}>मंडी भाव</Text></View>
      <View style={styles.body}>
        {loading ? (
          <ActivityIndicator />
        ) : error ? (
          <Text style={{ color: 'red' }}>{error}</Text>
        ) : (
          <FlatList
            data={markets}
            keyExtractor={(item, idx) => item.name + idx}
            renderItem={({ item }) => (
              <View style={styles.row}>
                <View>
                  <Text style={styles.marketName}>{item.name}</Text>
                  <Text style={styles.crop}>{item.crop}</Text>
                </View>
                <Text style={styles.price}>{item.price} {item.unit}</Text>
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
  header: { padding: 16, backgroundColor: '#8BCD45' },
  title: { color: '#fff', fontWeight: 'bold', fontSize: 18 },
  body: { padding: 16 },
  row: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 12, borderBottomWidth: 1, borderColor: '#eee' },
  marketName: { fontWeight: '700' },
  crop: { color: '#666' },
  price: { fontWeight: '700', color: '#4A7C59' },
});
