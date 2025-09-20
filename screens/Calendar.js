import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Alert, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Calendar({ navigation }) {
  useEffect(() => {
    if (typeof __DEV__ !== 'undefined' && __DEV__) {
      try {
        Alert.alert('Debug', 'Calendar mounted');
      } catch (e) {
        console.log('Alert failed', e);
      }
      console.log('Calendar mounted');
    }
  }, []);
  const insets = useSafeAreaInsets();
  const [crop, setCrop] = useState('');
  const [sowDateText, setSowDateText] = useState(''); // yyyy-mm-dd
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [pickerDate, setPickerDate] = useState(new Date());
  const [manualDateMode, setManualDateMode] = useState(false);
  const [schedule, setSchedule] = useState(null);

  const parseDate = (text) => {
    // Expect yyyy-mm-dd; fallback to Date.parse
    const parts = text.split('-').map(p => parseInt(p, 10));
    if (parts.length === 3 && parts.every(Boolean)) {
      return new Date(parts[0], parts[1] - 1, parts[2]);
    }
    const d = new Date(text);
    return isNaN(d.getTime()) ? null : d;
  };

  const format = (d) => {
    if (!d) return '—';
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  };

  const computeSchedule = (sowDate) => {
    // Simple agricultural guideline windows (example):
    // Germination: sow + 2 to +14 days
    // First irrigation: +3 to +7 days
    // Fertilization: +21 to +35 days
    // Mid-season top-up: +45 to +60 days
    // Harvest window: +90 to +120 days
    const addDays = (d, days) => {
      const x = new Date(d);
      x.setDate(x.getDate() + days);
      return x;
    };

    return {
      germination: { from: addDays(sowDate, 2), to: addDays(sowDate, 14), note: 'बीज अंकुरण की जाँच करें' },
      firstIrrigation: { from: addDays(sowDate, 3), to: addDays(sowDate, 7), note: 'पहली सिंचाई' },
      fertilization: { from: addDays(sowDate, 21), to: addDays(sowDate, 35), note: 'पहला उर्वरक' },
      midSeason: { from: addDays(sowDate, 45), to: addDays(sowDate, 60), note: 'मिड-सीज़न देखभाल' },
      harvest: { from: addDays(sowDate, 90), to: addDays(sowDate, 120), note: 'कटाई की संभावना' },
    };
  };

  const onUseToday = async () => {
    if (!crop) { Alert.alert('कृपया फसल का नाम दर्ज करें'); return; }
    const today = new Date();
    setSowDateText(format(today));
    const s = computeSchedule(today);
    setSchedule(s);
    // persist schedule for irrigation reminders
    try {
      const entry = await saveSchedule(crop.trim(), today, s);
      Alert.alert('Saved', 'Schedule saved — redirecting to सिंचाई (Irrigation)');
      if (entry && entry.id) navigation.navigate('Irrigation', { newEntryId: entry.id });
    } catch (err) {
      // ignore
    }
  };

  const onCompute = async () => {
    if (!crop) { Alert.alert('कृपया फसल का नाम दर्ज करें'); return; }
    const d = parseDate(sowDateText || '');
    if (!d) { Alert.alert('कृपया एक वैध रोज़ाना तिथि दर्ज करें (YYYY-MM-DD)'); return; }
    const s = computeSchedule(d);
    setSchedule(s);
    // persist schedule for irrigation reminders
    try {
      const entry = await saveSchedule(crop, d, s);
      Alert.alert('Saved', 'Schedule saved — redirecting to सिंचाई (Irrigation)');
      if (entry && entry.id) navigation.navigate('Irrigation', { newEntryId: entry.id });
    } catch (err) {
      // ignore
    }
  };

  const saveSchedule = async (cropName, sowDateObj, scheduleObj) => {
    try {
      const key = 'sow_schedules';
      const raw = await AsyncStorage.getItem(key);
      const existing = raw ? JSON.parse(raw) : [];
      const entry = {
        id: Date.now(),
        crop: cropName,
        sowDate: format(sowDateObj),
        schedule: scheduleObj,
        createdAt: new Date().toISOString(),
        watered: false,
      };
      existing.unshift(entry);
      await AsyncStorage.setItem(key, JSON.stringify(existing));
      return entry;
    } catch (err) {
      console.warn('Failed to save schedule', err);
    }
  };
  return (
    <SafeAreaView style={styles.container}>
  <ScrollView contentContainerStyle={{padding:24, paddingBottom: Math.max(120, insets.bottom + 80)}}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate('Home')}>
          <Text style={styles.backButtonText}>← वापस</Text>
        </TouchableOpacity>
        <View style={styles.header}>
          <Text style={styles.title}>कैलेंडर</Text>
          <Text style={styles.help}>यहाँ आप अपनी फसल कैलेंडर और नोट्स देख सकते हैं।</Text>
        </View>

        <View style={styles.formCard}>
          <Text style={styles.label}>🌱  फसल का नाम</Text>
          <TextInput
            placeholder="उदा. धान"
            value={crop}
            onChangeText={setCrop}
            style={styles.inputRounded}
          />

          <Text style={styles.label}>📅  बोने की तिथि (YYYY-MM-DD)</Text>
          {!manualDateMode ? (
            <TouchableOpacity
              style={[styles.inputRounded, { justifyContent: 'center' }]}
              onPress={() => {
                // initialize picker with current value if present
                const parsed = parseDate(sowDateText);
                const base = parsed || new Date();
                setPickerDate(base);
                setShowDatePicker(true);
              }}
            >
              <Text style={{ color: sowDateText ? '#111' : '#888' }}>{sowDateText || 'टैप करें और तारीख चुनें'}</Text>
            </TouchableOpacity>
          ) : (
            <TextInput
              placeholder="2025-09-20"
              value={sowDateText}
              onChangeText={setSowDateText}
              style={styles.inputRounded}
            />
          )}

          <View style={{ flexDirection: 'row', marginTop: 8, alignItems: 'center' }}>
            <TouchableOpacity onPress={() => setManualDateMode(m => !m)} style={{ marginRight: 12 }}>
              <Text style={{ color: '#2E7D32', fontWeight: '700' }}>{manualDateMode ? 'कैलेंडर से चुनें' : 'टाइप करके भरें'}</Text>
            </TouchableOpacity>
            <Text style={{ color: '#666' }}>(यदि कैलेंडर नहीं खुलता तो टाइप करें)</Text>
          </View>

          {showDatePicker && !manualDateMode && (
            <DateTimePicker
              value={pickerDate}
              mode="date"
              display={Platform.OS === 'ios' ? 'spinner' : 'calendar'}
              onChange={(event, selected) => {
                try {
                  // selected may be undefined if dismissed on Android
                  const selectedDate = selected || (event && event.timestamp ? new Date(event.timestamp) : undefined);
                  if (!selectedDate) {
                    setShowDatePicker(false);
                    return;
                  }
                  setPickerDate(selectedDate);
                  setSowDateText(format(selectedDate));
                  // on Android, the picker closes after selection; on iOS keep it open until user dismisses
                  if (Platform.OS === 'android') setShowDatePicker(false);
                } catch (err) {
                  console.warn('Date picker change handler error', err);
                  setShowDatePicker(false);
                }
              }}
            />
          )}

          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 12 }}>
            <TouchableOpacity style={styles.ghostButton} onPress={onUseToday}>
              <Text style={styles.ghostText}>आज का उपयोग करें</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.primaryButton} onPress={onCompute}>
              <Text style={styles.primaryText}>सिंचाई देखें</Text>
            </TouchableOpacity>
          </View>
        </View>

        {schedule && (
          <View style={styles.scheduleContainer}>
            <Text style={styles.scheduleTitle}>✨ अनुशंसित गतिविधियाँ — {crop}</Text>
            {Object.keys(schedule).map((k) => {
              const item = schedule[k];
              const emoji = k === 'germination' ? '🌱' : k === 'firstIrrigation' ? '💧' : k === 'fertilization' ? '🧪' : k === 'midSeason' ? '🌿' : '🚜';
              return (
                <View key={k} style={styles.scheduleCard}>
                  <View style={styles.scheduleLeft}>
                    <Text style={styles.scheduleEmoji}>{emoji}</Text>
                  </View>
                  <View style={styles.scheduleRight}>
                    <Text style={styles.scheduleActivity}>{item.note}</Text>
                    <Text style={styles.scheduleRange}>{format(item.from)} — {format(item.to)}</Text>
                  </View>
                </View>
              );
            })}
          </View>
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
  formCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginTop: 18,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 6,
  },
  label: {
    fontSize: 16,
    color: '#333',
    marginBottom: 8,
    fontWeight: '600',
  },
  inputRounded: {
    backgroundColor: '#F6F9F6',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E6EDE6',
  },
  primaryButton: {
    backgroundColor: '#2E7D32',
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 10,
  },
  primaryText: { color: '#fff', fontWeight: '700' },
  ghostButton: {
    backgroundColor: '#fff',
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#CFE9CF',
  },
  ghostText: { color: '#2E7D32', fontWeight: '700' },
  scheduleContainer: { marginTop: 12 },
  scheduleTitle: { fontSize: 18, fontWeight: '700', marginBottom: 12, color: '#234' },
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
  scheduleLeft: { width: 48, alignItems: 'center' },
  scheduleEmoji: { fontSize: 26 },
  scheduleRight: { flex: 1 },
  scheduleActivity: { fontSize: 16, fontWeight: '600', color: '#234' },
  scheduleRange: { color: '#666', marginTop: 6 },
});
