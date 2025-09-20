import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Irrigation({ navigation, route }) {
  const [schedules, setSchedules] = useState([]);
  const highlightId = route && route.params && route.params.newEntryId ? Number(route.params.newEntryId) : null;

  const loadSchedules = async () => {
    try {
      const raw = await AsyncStorage.getItem('sow_schedules');
      const parsed = raw ? JSON.parse(raw) : [];
      if (highlightId) {
        const found = parsed.find(p => Number(p.id) === highlightId);
        const rest = parsed.filter(p => Number(p.id) !== highlightId);
        setSchedules(found ? [found, ...rest] : parsed);
      } else {
        setSchedules(parsed);
      }
    } catch (err) {
      console.warn('Failed to load schedules', err);
    }
  };

  useEffect(() => {
    // Load on mount
    loadSchedules();
    // Reload when screen focuses
    const unsubscribe = navigation.addListener('focus', () => {
      loadSchedules();
    });
    return unsubscribe;
  }, [navigation, highlightId]);

  const markWatered = async (id) => {
    try {
      const raw = await AsyncStorage.getItem('sow_schedules');
      const parsed = raw ? JSON.parse(raw) : [];
      const beforeCount = parsed.length;
      // remove the entry when watered
  const remaining = parsed.filter((p) => Number(p.id) !== Number(id));
      await AsyncStorage.setItem('sow_schedules', JSON.stringify(remaining));
      setSchedules(remaining);
      const afterCount = remaining.length;
      console.log(`markWatered: before=${beforeCount} after=${afterCount}`);
      Alert.alert('नोट:', `शेड्यूल हटाया गया — पहले ${beforeCount} अब ${afterCount}`);
    } catch (err) {
      console.warn('markWatered error', err);
      Alert.alert('त्रुटि', String(err));
    }
  };

  const upcomingIrrigation = (s) => {
    // show firstIrrigation window
    return s.schedule && s.schedule.firstIrrigation ? s.schedule.firstIrrigation : null;
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={{padding:24}}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate('Home')}>
          <Text style={styles.backButtonText}>← वापस</Text>
        </TouchableOpacity>
        
        <View style={styles.headerRow}>
          <View style={styles.header}>
            <Text style={styles.title}>सिंचाई समय</Text>
            <Text style={styles.help}>यहाँ आप सिंचाई अनुसूची और सुझाव देख सकते हैं।</Text>
          </View>
          <TouchableOpacity
            style={[styles.backButton, { marginTop: 6, backgroundColor: '#C62828' }]}
            onPress={() => {
              Alert.alert('पुष्टि', 'क्या आप सभी शेड्यूल हटाना चाहते हैं?', [
                { text: 'रद्द करें', style: 'cancel' },
                { text: 'हाँ', style: 'destructive', onPress: async () => {
                  try {
                    await AsyncStorage.removeItem('sow_schedules');
                    setSchedules([]);
                    Alert.alert('सफल', 'सभी शेड्यूल हटाए गए');
                  } catch (err) {
                    console.warn('clear all error', err);
                  }
                } }
              ]);
            }}
          >
            <Text style={{ color: '#fff', fontWeight: '700' }}>सभी हटाएँ</Text>
          </TouchableOpacity>
        </View>

        {schedules.length === 0 ? (
          <View style={{ padding: 20, alignItems: 'center' }}>
            <Text style={{ color: '#fff' }}>किसी भी फसल के शेड्यूल उपलब्ध नहीं हैं। पहले कैलेंडर में शेड्यूल बनाएं।</Text>
          </View>
        ) : (
          schedules.map((s) => {
            const next = upcomingIrrigation(s);
            const isHighlight = highlightId && s.id === highlightId;
            return (
              <View key={s.id} style={[styles.scheduleCard, isHighlight ? styles.highlightCard : null]}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.cropName}>{s.crop}</Text>
                  <Text style={styles.sowDate}>बोई गई: {s.sowDate}</Text>
                  {next ? (
                    <Text style={styles.sowRange}>अगली सिंचाई: {next.from ? next.from.substring(0,10) : '—'} — {next.to ? next.to.substring(0,10) : '—'}</Text>
                  ) : (
                    <Text style={styles.sowRange}>सिंचाई विंडो उपलब्ध नहीं</Text>
                  )}
                </View>
                <View style={{ justifyContent: 'center' }}>
                  {!s.watered ? (
                    <TouchableOpacity style={styles.waterButton} onPress={() => {
                      Alert.alert('पुष्टि', 'क्या आप इस शेड्यूल को हटाना चाहते हैं?', [
                        { text: 'नहीं', style: 'cancel' },
                        { text: 'हाँ', onPress: () => markWatered(s.id) }
                      ]);
                    }}>
                      <Text style={styles.waterText}>मार्क करें</Text>
                    </TouchableOpacity>
                  ) : (
                    <Text style={{ color: '#DFF6E4' }}>सिंचाई पूर्ण</Text>
                  )}
                </View>
              </View>
            );
          })
        )}

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  backButton: {
    alignSelf: 'flex-start',
    marginTop: 10,
    marginBottom: 0,
    marginLeft: 10,
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: '#4A90E2',
    borderRadius: 8,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  container: { flex: 1, backgroundColor: '#8BCD45' },
  header: { paddingHorizontal: 20, paddingTop: 20, paddingBottom: 10, backgroundColor: '#8BCD45', alignItems: 'center' },
  title: { fontSize: 22, fontWeight: 'bold', color: '#fff' },
  help: { color: '#E8F5E8', marginTop: 6 },
  scheduleCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  highlightCard: {
    borderColor: '#2E7D32',
    borderWidth: 2,
    backgroundColor: '#E8FDF0',
  },
  cropName: { fontSize: 16, fontWeight: '700', color: '#234' },
  sowDate: { color: '#666', marginTop: 4 },
  sowRange: { color: '#444', marginTop: 6, fontWeight: '600' },
  waterButton: {
    backgroundColor: '#2E7D32',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  waterText: { color: '#fff', fontWeight: '700' },
});
