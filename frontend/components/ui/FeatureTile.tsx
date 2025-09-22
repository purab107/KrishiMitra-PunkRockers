import React, { useRef } from 'react';
import { Animated, Pressable, Image, Text, StyleSheet, ViewStyle, ImageSourcePropType } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '../../constants/theme';

type Props = {
  title: string;
  onPress?: () => void;
  icon: ImageSourcePropType;
  style?: ViewStyle;
};

export default function FeatureTile({ title, onPress, icon, style }: Props) {
  const scale = useRef(new Animated.Value(1)).current;

  const onPressIn = () => Animated.spring(scale, { toValue: 0.97, useNativeDriver: true, speed: 20 }).start();
  const onPressOut = () => Animated.spring(scale, { toValue: 1, useNativeDriver: true, speed: 20 }).start();

  return (
    <Pressable onPress={onPress} onPressIn={onPressIn} onPressOut={onPressOut} style={{ flexBasis: '48%', marginBottom: 8, alignItems: 'center' }}>
      <Animated.View style={[styles.tileContainer, { transform: [{ scale }] }, style]}>
        <LinearGradient
          colors={['#2196F3', '#1976D2']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.tile}
        >
          <Image source={icon} style={styles.icon} resizeMode="contain" />
          <Text numberOfLines={2} style={styles.title}>{title}</Text>
        </LinearGradient>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  tileContainer: {
    borderRadius: 28,
    elevation: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
  },
  tile: {
    width: 180,
    height: 160,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
    paddingVertical: 18,
  },
  icon: {
    width: 75,
    height: 75,
    marginBottom: 15,
    filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))',
  },
  title: {
    textAlign: 'center',
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
    lineHeight: 20,
    flexShrink: 1,
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
});
