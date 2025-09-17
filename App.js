import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import * as Linking from 'expo-linking';
import { Platform } from 'react-native';

// Import your screens
import SplashScreen from './screens/SplashScreen';
import LanguageScreen from './screens/LanguageScreen';
import LoginScreen from './screens/LoginScreen';
import SignUpScreen from './screens/SignUpScreen';
import HomePage from './screens/HomePage'; // Add this import
import CropRecommendation from './screens/CropRecommendation';
import Profile from './screens/Profile';
import Forecast from './screens/Forecast';
import MarketPrices from './screens/MarketPrices';
import SoilInfo from './screens/SoilInfo';

const Stack = createStackNavigator();

const linking = {
  prefixes: [Linking.createURL('/')],
  config: {
    screens: {
      // Map paths to routes. On web the root path will go to Login by default.
      Splash: 'splash',
      Language: 'language',
      Login: '',
      SignUp: 'signup',
      Home: 'home',
      CropRecommendation: 'crop',
          Profile: 'profile',
          Forecast: 'forecast',
          MarketPrices: 'market',
    },
  },
};

export default function App() {
  // On native, keep Splash as the initial route to show the launch experience.
  const initialRoute = Platform.OS === 'web' ? undefined : 'Splash';

  return (
    <NavigationContainer linking={linking}>
      <Stack.Navigator 
        initialRouteName={initialRoute}
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="Language" component={LanguageScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="SignUp" component={SignUpScreen} />
        <Stack.Screen name="Home" component={HomePage} />
        <Stack.Screen name="CropRecommendation" component={CropRecommendation} />
        <Stack.Screen name="Profile" component={Profile} />
        <Stack.Screen name="Forecast" component={Forecast} />
        <Stack.Screen name="MarketPrices" component={MarketPrices} />
        <Stack.Screen name="SoilInfo" component={SoilInfo} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
