import React, { useRef } from 'react';
import { Animated, Pressable, Image, Text, StyleSheet, ViewStyle, ImageSourcePropType } from 'react-native';
import { Colors } from '@/constants/theme';

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
    <Pressable onPress={onPress} onPressIn={onPressIn} onPressOut={onPressOut} style={{ flexBasis: '45%', marginBottom: 12, alignItems: 'center' }}>
      <Animated.View style={[styles.tile, { transform: [{ scale }] }, style]}>
        <Image source={icon} style={styles.icon} />
      </Animated.View>
      <Text numberOfLines={2} style={styles.title}>{title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  tile: {
    width: 84,
    height: 84,
    borderRadius: 16,
    backgroundColor: Colors.light.card,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
  },
  icon: {
    width: 46,
    height: 46,
    resizeMode: 'contain',
  },
  title: {
    marginTop: 8,
    textAlign: 'center',
    color: '#fff',
    width: 100,
    fontWeight: '700',
  },
});
