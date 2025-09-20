import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export default function HomePage({ navigation }) {
  const insets = useSafeAreaInsets();
  const [weather, setWeather] = useState(null);
  const [loadingWeather, setLoadingWeather] = useState(false);
  const [weatherError, setWeatherError] = useState(null);

  useEffect(() => {
    // Fetch weather for Raipur (fallback) from backend proxy
    const fetchWeather = async () => {
      setLoadingWeather(true);
      setWeatherError(null);
      try {
        const res = await fetch('http://localhost:5000/api/weather?q=Raipur,IN');
        const text = await res.text();
        try {
          const json = JSON.parse(text);
          if (json.ok) {
            setWeather(json);
          } else {
            setWeatherError(json.message || JSON.stringify(json.error || json));
          }
        } catch (parseErr) {
          // Not JSON — show raw body to aid debugging (often HTML error pages)
          setWeatherError(`Non-JSON response from server: ${text.slice(0, 200)}`);
        }
      } catch (err) {
        setWeatherError(err.message);
      } finally {
        setLoadingWeather(false);
      }
    };

    fetchWeather();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      {/* Scrollable Content */}
      <ScrollView
        contentContainerStyle={{ paddingBottom: Math.max(140, insets.bottom + 100) }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header Section */}
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <View style={styles.logoSection}>
              <View style={styles.logoImages}>
                <Image
                  source={require('../frontend/assets/images/emblem.png')}
                  style={styles.emblem}
                />
                <Image
                  source={require('../frontend/assets/images/Group 3 1.png')}
                  style={styles.emblemBadge}
                />
              </View>
              <Text style={styles.appTitle}>कृषि मित्र</Text>
              <Text style={styles.tagline}>स्मार्ट खेती, टिकाऊ भविष्य</Text>
            </View>
            <TouchableOpacity
              style={styles.profileButton}
              onPress={() => navigation.navigate('Profile')}
              accessibilityLabel="Open profile"
            >
              <Image
                  source={require('../assets/Avatars.png')}
                  style={{ width: 64, height: 64, resizeMode: 'contain' }}
              />
            </TouchableOpacity>
          </View>
          <Text style={styles.welcomeText}>स्वागत है, किसान!</Text>
        </View>

        {/* Weather Card */}
        <View style={styles.weatherCard}>
          <Text style={styles.weatherTitle}>मौसम जानकारी</Text>

          <View style={styles.locationRow}>
            <Image
              source={require('../assets/vector-5.png')}
              style={styles.locationIcon2}
            />
            <Text style={styles.locationText}>रायपुर, छत्तीसगढ़</Text>
          </View>

          {loadingWeather ? (
            <ActivityIndicator size="large" color="#4A90E2" />
          ) : weatherError ? (
            <Text style={{ color: 'red' }}>{weatherError}</Text>
          ) : weather ? (
            <View style={styles.weatherGrid}>
              <View style={styles.weatherItem}>
                <Image
                  source={require('../assets/vector-6.png')}
                  style={styles.weatherIcon}
                />
                <View style={styles.weatherTextContainer}>
                  <Text style={styles.weatherValue}>{Math.round(weather.temp)}°</Text>
                  <Text style={styles.weatherLabel}>सेल्सियस</Text>
                </View>
              </View>

              <View style={styles.weatherItem}>
                <Image
                  source={require('../assets/vector-4.png')}
                  style={styles.weatherIcon}
                />
                <View style={styles.weatherTextContainer}>
                  <Text style={styles.weatherValue}>{weather.rain_1h ? weather.rain_1h + 'mm' : '—'}</Text>
                  <Text style={styles.weatherLabel}>वर्षा</Text>
                </View>
              </View>

              <View style={styles.weatherItem}>
                <Image
                  source={require('../assets/vector-3.png')}
                  style={styles.weatherIcon}
                />
                <View style={styles.weatherTextContainer}>
                  <Text style={styles.weatherValue}>{weather.wind_speed ? weather.wind_speed + ' m/s' : '—'}</Text>
                  <Text style={styles.weatherLabel}>हवा</Text>
                </View>
              </View>

              <View style={styles.weatherItem}>
                <Image
                  source={require('../assets/vector-2.png')}
                  style={styles.weatherIcon}
                />
                <View style={styles.weatherTextContainer}>
                  <Text style={styles.weatherValue}>{weather.humidity}%</Text>
                  <Text style={styles.weatherLabel}>नमी</Text>
                </View>
              </View>
            </View>
          ) : (
            <Text>मौसम उपलब्ध नहीं है</Text>
          )}
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

          {/* New: Calendar */}
          <TouchableOpacity
            style={styles.featureButton}
            onPress={() => navigation.navigate('Calendar')}
          >
            <Image
              source={require('../assets/calendar.png')}
              style={styles.locationIcon}
            />
            <Text style={styles.featureText}>कैलेंडर</Text>
          </TouchableOpacity>

          {/* New: Irrigation */}
          <TouchableOpacity
            style={styles.featureButton}
            onPress={() => navigation.navigate('Irrigation')}
          >
            <Image
              source={require('../assets/watering-plants.png')}
              style={styles.locationIcon}
            />
            <Text style={styles.featureText}>सिंचाई</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>



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
    paddingTop: 12,
    paddingBottom: 10,
    backgroundColor: '#8BCD45',
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  logoSection: {
    flex: 1,
  },
  logoImages: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
  },
  emblem: {
    width: 64,
    height: 64,
    resizeMode: 'contain',
  },
  emblemBadge: {
    width: 64,
    height: 64,
    resizeMode: 'contain',
    marginLeft: 10,
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
    padding: 8,
    alignItems: 'center',
    justifyContent: 'center',
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
  locationIcon: {
    width: 56,
    height: 56,
    resizeMode: 'contain',
    marginBottom: 8,
  },
  weatherIcon: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
    marginBottom: 8,
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
