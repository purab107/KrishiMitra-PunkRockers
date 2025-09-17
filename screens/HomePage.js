import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export default function HomePage({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      {/* Scrollable Content */}
      <ScrollView
        contentContainerStyle={{ paddingBottom: 140 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header Section */}
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <View style={styles.logoSection}>
              <Image
                source={require('../frontend/assets/images/emblem.png')}
              />
              <Text style={styles.appTitle}>कृषि मित्र</Text>
              <Text style={styles.tagline}>स्मार्ट खेती, टिकाऊ भविष्य</Text>
            </View>
            <TouchableOpacity style={styles.profileButton}>
              <Image
                source={require('../assets/Avatars.png')}
              />
            </TouchableOpacity>
          </View>
          <Text style={styles.welcomeText}>स्वागत है, किसान!</Text>
        </View>

        {/* Weather Card */}
        <View style={styles.weatherCard}>
          <Text style={styles.weatherTitle}>गर्जन के साथ बारिश</Text>

          <View style={styles.locationRow}>
            <Image
              source={require('../assets/vector-5.png')}
              style={styles.locationIcon2}
            />
            <Text style={styles.locationText}>मुझगहान, छत्तीसगढ़</Text>
          </View>

          <View style={styles.weatherGrid}>
            <View style={styles.weatherItem}>
              <Image
                source={require('../assets/vector-6.png')}
                style={styles.locationIcon}
              />
              <View style={styles.weatherTextContainer}>
                <Text style={styles.weatherValue}>32°</Text>
                <Text style={styles.weatherLabel}>सेल्सियस</Text>
              </View>
            </View>

            <View style={styles.weatherItem}>
              <Image
                source={require('../assets/vector-4.png')}
                style={styles.locationIcon}
              />
              <View style={styles.weatherTextContainer}>
                <Text style={styles.weatherValue}>45%</Text>
                <Text style={styles.weatherLabel}>वर्षा</Text>
              </View>
            </View>

            <View style={styles.weatherItem}>
              <Image
                source={require('../assets/vector-3.png')}
                style={styles.locationIcon}
              />
              <View style={styles.weatherTextContainer}>
                <Text style={styles.weatherValue}>11 किमी/घं</Text>
                <Text style={styles.weatherLabel}>हवा</Text>
              </View>
            </View>

            <View style={styles.weatherItem}>
              <Image
                source={require('../assets/vector-2.png')}
                style={styles.locationIcon}
              />
              <View style={styles.weatherTextContainer}>
                <Text style={styles.weatherValue}>78%</Text>
                <Text style={styles.weatherLabel}>नमी</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Main Feature Buttons */}
        <View style={styles.featuresGrid}>
          <TouchableOpacity
            style={styles.featureButton}
            onPress={() => navigation.navigate('CropRecommendation')}
          >
            <Image
              source={require('../assets/vector-1.png')}
              style={styles.locationIcon}
            />
            <Text style={styles.featureText}>फसल अनुशंसा</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.featureButton}
            onPress={() => navigation.navigate('MarketPrices')}
          >
            <Image
              source={require('../assets/vector-9.png')}
              style={styles.locationIcon}
            />
            <Text style={styles.featureText}>बाज़ार भाव देखें</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.featureButton}
            onPress={() => navigation.navigate('SoilInfo')}
          >
            <Image
              source={require('../assets/vector-8.png')}
              style={styles.locationIcon}
            />
            <Text style={styles.featureText}>मिट्टी की जानकारी</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.featureButton}
            onPress={() => navigation.navigate('VoiceAssistant')}
          >
            <Image
              source={require('../assets/vector-7.png')}
              style={styles.locationIcon}
            />
            <Text style={styles.featureText}>वॉइस एआई सहायक</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem}>
          <Icon name="home" size={26} color="#4CAF50" />
          <Text style={[styles.navText, styles.activeNavText]}>
            मुख्य पृष्ठ
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navItem}
          onPress={() => navigation.navigate('AIChat')}
        >
          <Icon name="chat-processing" size={26} color="#777" />
          <Text style={styles.navText}>एआई चैट</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navItem}
          onPress={() => navigation.navigate('Forecast')}
        >
          <Icon name="weather-cloudy" size={26} color="#777" />
          <Text style={styles.navText}>मौसम पूर्वानुमान</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navItem}
          onPress={() => navigation.navigate('Profile')}
        >
          <Icon name="account" size={26} color="#777" />
          <Text style={styles.navText}>मेरा प्रोफ़ाइल</Text>
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
  locationIcon2: {
    backgroundColor: '#4A90E2',
    borderRadius: 15,
    padding: 30,
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
    marginBottom: 100,
  },
  featureButton: {
    backgroundColor: '#4A90E2',
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
