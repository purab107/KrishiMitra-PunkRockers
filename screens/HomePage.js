import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export default function HomePage({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      {/* Header Section */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View style={styles.logoSection}>
            <Icon name="leaf" size={24} color="#fff" />
            <Text style={styles.appTitle}>Krishi Mitra</Text>
            <Text style={styles.tagline}>Smart Farming, Sustainable Future</Text>
          </View>
          <TouchableOpacity style={styles.profileButton}>
            <Icon name="account-circle" size={40} color="#fff" />
          </TouchableOpacity>
        </View>
        <Text style={styles.welcomeText}>Welcome, User Name!</Text>
      </View>

      {/* Weather Card */}
      <View style={styles.weatherCard}>
        <Text style={styles.weatherTitle}>Thundershower</Text>
        <View style={styles.locationRow}>
          <Icon name="map-marker" size={20} color="#666" />
          <Text style={styles.locationText}>Mujgahan, Chhattisgarh</Text>
        </View>

        <View style={styles.weatherGrid}>
          <View style={styles.weatherItem}>
            <Icon name="thermometer" size={32} color="#fff" />
            <View style={styles.weatherTextContainer}>
              <Text style={styles.weatherValue}>32°</Text>
              <Text style={styles.weatherLabel}>Celsius</Text>
            </View>
          </View>

          <View style={styles.weatherItem}>
            <Icon name="weather-rainy" size={32} color="#fff" />
            <View style={styles.weatherTextContainer}>
              <Text style={styles.weatherValue}>45%</Text>
              <Text style={styles.weatherLabel}>Precipitation</Text>
            </View>
          </View>

          <View style={styles.weatherItem}>
            <Icon name="weather-windy" size={32} color="#fff" />
            <View style={styles.weatherTextContainer}>
              <Text style={styles.weatherValue}>11 km/h</Text>
              <Text style={styles.weatherLabel}>Wind</Text>
            </View>
          </View>

          <View style={styles.weatherItem}>
            <Icon name="water-percent" size={32} color="#fff" />
            <View style={styles.weatherTextContainer}>
              <Text style={styles.weatherValue}>78%</Text>
              <Text style={styles.weatherLabel}>Humidity</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Main Feature Buttons */}
      <View style={styles.featuresGrid}>
        <TouchableOpacity style={styles.featureButton} onPress={() => navigation.navigate('CropRecommendation')}>
          <Icon name="sprout" size={48} color="#fff" />
          <Text style={styles.featureText}>Crop Recommendation</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.featureButton} onPress={() => navigation.navigate('MarketPrices')}>
          <Icon name="cart-outline" size={48} color="#fff" />
          <Text style={styles.featureText}>Check Market Prices</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.featureButton} onPress={() => navigation.navigate('SoilInfo')}>
          <Icon name="shovel" size={48} color="#fff" />
          <Text style={styles.featureText}>Soil Information</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.featureButton} onPress={() => navigation.navigate('VoiceAssistant')}>
          <Icon name="microphone" size={48} color="#fff" />
          <Text style={styles.featureText}>Voice Assisted AI</Text>
        </TouchableOpacity>
      </View>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem}>
          <Icon name="home" size={26} color="#4CAF50" />
          <Text style={[styles.navText, styles.activeNavText]}>Home</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('AIChat')}>
          <Icon name="chat-processing" size={26} color="#777" />
          <Text style={styles.navText}>AI Chat</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Forecast')}>
          <Icon name="weather-cloudy" size={26} color="#777" />
          <Text style={styles.navText}>Forecast</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Profile')}>
          <Icon name="account" size={26} color="#777" />
          <Text style={styles.navText}>My Profile</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#8BCD45',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 30,
    backgroundColor: '#8BCD45',
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 15,
  },
  logoSection: {
    flex: 1,
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
  profileButton: {
    padding: 5,
  },
  welcomeText: {
    color: '#fff',
    fontSize: 28,
    fontWeight: 'bold',
  },
  weatherCard: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 20,
    padding: 20,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  weatherTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  locationText: {
    fontSize: 18,
    color: '#666',
    marginLeft: 8,
  },
  weatherGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  weatherItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4A90E2',
    borderRadius: 15,
    padding: 15,
    width: '48%',
    marginBottom: 12,
  },
  weatherTextContainer: {
    marginLeft: 12,
    flex: 1,
  },
  weatherValue: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  weatherLabel: {
    color: '#E3F2FD',
    fontSize: 14,
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
    marginBottom: 100, // Space for bottom navigation
  },
  featureButton: {
    backgroundColor: '#7BB945',
    width: '45%',
    aspectRatio: 1,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10,
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  featureText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 12,
    lineHeight: 20,
  },
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#4A7C59',
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 12,
    elevation: 10,
  },
  navItem: {
    alignItems: 'center',
    flex: 1,
  },
  navText: {
    color: '#B8D4C1',
    fontSize: 12,
    marginTop: 4,
    fontWeight: '500',
  },
  activeNavText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
