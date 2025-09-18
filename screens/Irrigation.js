import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Irrigation({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={{padding:24}}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate('Home')}>
          <Text style={styles.backButtonText}>← वापस</Text>
        </TouchableOpacity>
        <View style={styles.header}>
          <Text style={styles.title}>सिंचाई समय</Text>
          <Text style={styles.help}>यहाँ आप सिंचाई अनुसूची और सुझाव देख सकते हैं।</Text>
        </View>
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
});
