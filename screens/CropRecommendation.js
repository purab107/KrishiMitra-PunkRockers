import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function CropRecommendation({ navigation }) {
  const [showPrices, setShowPrices] = React.useState(false);
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={{padding: 24}}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate('Home')}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <View style={styles.header}>
          <Text style={styles.appTitle}>फसल अनुशंसा</Text>
          <Text style={styles.tagline}>AI आधारित अनुशंसा परिणाम</Text>
        </View>
        <View style={styles.weatherCard}>
          <Text style={styles.weatherTitle}>Recommended Crop: <Text style={{color:'#4A7C59', fontWeight:'bold'}}>Soyabean</Text></Text>
          <View style={{marginVertical: 8}}>
            <Text style={styles.weatherLabel}>Expected Yield: <Text style={styles.weatherValue}>~12 quintals/acre</Text></Text>
            <Text style={styles.weatherLabel}>Estimated Profit: <Text style={styles.weatherValue}>₹45,000</Text></Text>
            <Text style={styles.weatherLabel}>Sustainability Score: <Text style={styles.weatherValue}>8/10 (Good for soil health)</Text></Text>
          </View>
          <View style={{flexDirection:'row', justifyContent:'space-between', marginTop: 16}}>
            <TouchableOpacity style={styles.featureButton}>
              <Text style={styles.featureText}>🔊 Listen</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.featureButton} onPress={()=>setShowPrices(!showPrices)}>
              <Text style={styles.featureText}>See Market Prices</Text>
            </TouchableOpacity>
          </View>
          {showPrices && (
            <View style={{marginTop:16, backgroundColor:'#E8F5E8', borderRadius:12, padding:12}}>
              <Text style={{fontWeight:'bold', color:'#4A7C59', marginBottom:4}}>मंडी भाव (Mandi Prices)</Text>
              <Text>रायपुर: ₹4,200/क्विंटल</Text>
              <Text>बिलासपुर: ₹4,150/क्विंटल</Text>
              <Text>राजनांदगांव: ₹4,300/क्विंटल</Text>
            </View>
          )}
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
  container: {
    flex: 1,
    backgroundColor: '#8BCD45',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
    backgroundColor: '#8BCD45',
    alignItems: 'center',
  },
  appTitle: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 5,
  },
  tagline: {
    color: '#E8F5E8',
    fontSize: 14,
    marginTop: 2,
  },
  weatherCard: {
    backgroundColor: '#fff',
    marginTop: 20,
    borderRadius: 20,
    padding: 20,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  weatherTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  weatherLabel: {
    color: '#4A7C59',
    fontSize: 16,
    marginBottom: 4,
  },
  weatherValue: {
    color: '#333',
    fontWeight: 'bold',
    fontSize: 16,
  },
  featureButton: {
    backgroundColor: '#4A90E2',
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 18,
    marginHorizontal: 4,
    marginTop: 4,
    elevation: 3,
  },
  featureText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
