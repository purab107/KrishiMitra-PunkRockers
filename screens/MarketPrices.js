import React, { useEffect, useState, useMemo } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity, TextInput, Modal, Pressable } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function MarketPrices({ navigation }) {
  const [loading, setLoading] = useState(true);
  const [markets, setMarkets] = useState([]);
  const [query, setQuery] = useState('');
  const [selectedCrop, setSelectedCrop] = useState('All');
  const [cropModalVisible, setCropModalVisible] = useState(false);
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
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={22} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.title}>मंडी भाव</Text>
      </View>
      <View style={styles.body}>
        <View style={styles.controlsRow}>
          <TextInput
          placeholder="Search: market or crop / बाजार या फसल" 
          value={query}
          onChangeText={setQuery}
          style={styles.search}
          clearButtonMode="while-editing"
          />
          <TouchableOpacity style={styles.dropdownButton} onPress={() => setCropModalVisible(true)}>
            <Text style={styles.dropdownButtonText}>{selectedCrop === 'All' ? 'All Crops' : selectedCrop}</Text>
            <Icon name="menu-down" size={18} color="#fff" />
          </TouchableOpacity>
        </View>
        {loading ? (
          <ActivityIndicator />
        ) : error ? (
          <Text style={{ color: 'red' }}>{error}</Text>
        ) : (
          (() => {
            // Translations map: hindi -> english (lower-cased when used)
            const TRANSLATIONS = {
              'सोयाबीन': 'soybean',
              'धान': 'rice',
              'चावल': 'rice',
              'आलू': 'potato',
              'गेहूँ': 'wheat',
              'केला': 'banana'
            };
            const translationsLower = {};
            Object.entries(TRANSLATIONS).forEach(([hi, en]) => {
              translationsLower[hi.toLowerCase()] = en.toLowerCase();
              translationsLower[en.toLowerCase()] = en.toLowerCase();
            });

            // Simple normalization helper: fold to ASCII and lower-case.
            const normalize = (s) => {
              if (!s) return '';
              let t = String(s).toLowerCase();
              // Remove combining diacritical marks using a safe range (works in most JS engines)
              try {
                t = t.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
              } catch (e) {
                // String.normalize may not be available in some RN JS runtimes; ignore if not supported
              }

              // Map some common Hindi/Devanagari crop words to English for simpler English matching.
              // Keys should be lower-case. Extend this map as needed.
              const map = {
                'केला': 'banana',
                'kela': 'banana',
                'आलू': 'potato',
                'aaloo': 'potato',
                'आलू': 'potato',
                'गेहूँ': 'wheat',
                'गेहू': 'wheat',
                'धान': 'rice',
                'चावल': 'rice'
              };
              // If a translation exists for this token (either Hindi->eng or eng->eng), append it
              const trans = translationsLower[t];
              if (trans && !t.includes(trans)) {
                t = `${t} ${trans}`;
              }

              return t;
            };

            const qNorm = normalize(query.trim());

            const filtered = markets.filter(m => {
              if (!qNorm) return true;
              const name = normalize(m.name || '');
              const crop = normalize(m.crop || '');
              return name.includes(qNorm) || crop.includes(qNorm);
            });

            // apply crop filter if selected (use normalized comparison to allow english input matches)
            const withCrop = selectedCrop && selectedCrop !== 'All'
              ? filtered.filter(m => {
                  const cropNorm = normalize(m.crop || '');
                  const selNorm = normalize(selectedCrop || '');
                  return cropNorm.includes(selNorm) || selNorm.includes(cropNorm);
                })
              : filtered;

            if (withCrop.length === 0) {
              return <Text style={styles.noResults}>कोई परिणाम नहीं मिला</Text>;
            }

            return (
              <FlatList
                data={withCrop}
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
            );
          })()
        )}
        
        {/* Crop selection modal */}
        <Modal visible={cropModalVisible} animationType="slide" transparent={true} onRequestClose={() => setCropModalVisible(false)}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalBody}>
              <Text style={styles.modalTitle}>Select Crop</Text>
              <FlatList
                data={[ 'All', ...Array.from(new Set(markets.map(m => m.crop).filter(Boolean))) ]}
                keyExtractor={(item, idx) => item + idx}
                renderItem={({ item }) => (
                  <Pressable
                    onPress={() => { setSelectedCrop(item); setCropModalVisible(false); }}
                    style={({ pressed }) => [styles.modalItem, pressed && { backgroundColor: '#eee' }]}
                  >
                    <Text style={styles.modalItemText}>{item}</Text>
                  </Pressable>
                )}
              />
              <TouchableOpacity style={styles.modalClose} onPress={() => setCropModalVisible(false)}>
                <Text style={styles.modalCloseText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
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
  controlsRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  search: { flex: 1, borderWidth: 1, borderColor: '#ddd', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 8, marginRight: 8 },
  dropdownButton: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 8, backgroundColor: '#4A7C59', borderRadius: 8 },
  dropdownButtonText: { color: '#fff', marginRight: 6, fontWeight: '600' },
  row: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 12, borderBottomWidth: 1, borderColor: '#eee' },
  marketName: { fontWeight: '700' },
  crop: { color: '#666' },
  price: { fontWeight: '700', color: '#4A7C59' },
  noResults: { marginTop: 20, textAlign: 'center', color: '#666' },

  /* modal */
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', alignItems: 'center' },
  modalBody: { width: '90%', maxHeight: '70%', backgroundColor: '#fff', borderRadius: 10, padding: 16 },
  modalTitle: { fontSize: 16, fontWeight: '700', marginBottom: 12 },
  modalItem: { paddingVertical: 12, paddingHorizontal: 8, borderBottomWidth: 1, borderColor: '#eee' },
  modalItemText: { fontSize: 14 },
  modalClose: { marginTop: 12, alignItems: 'center' },
  modalCloseText: { color: '#4A7C59', fontWeight: '700' },
});
