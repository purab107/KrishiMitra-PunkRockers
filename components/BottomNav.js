import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Colors } from '../frontend/constants/theme';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { navigationRef } from '../App';

export const BOTTOM_NAV_HEIGHT = 88;

export default function BottomNav() {
  const nav = navigationRef;

  const go = (name) => {
    if (nav && nav.current && nav.current.isReady && nav.current.isReady()) {
      nav.current.navigate(name);
    }
  };

  return (
    <View style={styles.bottomNav}>
      <Pressable style={styles.navItem} onPress={() => go('Home')}>
        <Icon name="home" size={26} color={Colors.light.surfaceText || '#fff'} />
        <Text style={[styles.navText, styles.activeNavText]}>मुख्य पृष्ठ</Text>
      </Pressable>

      <Pressable style={styles.navItem} onPress={() => go('AIChat')}>
        <Icon name="chat-processing" size={26} color={Colors.light.surfaceText || '#fff'} />
        <Text style={styles.navText}>एआई चैट</Text>
      </Pressable>

      <Pressable style={styles.navItem} onPress={() => go('Forecast')}>
        <Icon name="weather-cloudy" size={26} color={Colors.light.surfaceText || '#fff'} />
        <Text style={styles.navText}>मौसम पूर्वानुमान</Text>
      </Pressable>

      <Pressable style={styles.navItem} onPress={() => go('Profile')}>
        <Icon name="account" size={26} color={Colors.light.surfaceText || '#fff'} />
        <Text style={styles.navText}>मेरा प्रोफ़ाइल</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  bottomNav: {
    position: 'absolute',
    left: 12,
    right: 12,
    bottom: 12,
    backgroundColor: '#4A7C59',
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
    paddingBottom: 14,
    borderRadius: 18,
    elevation: 16,
    zIndex: 999,
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
