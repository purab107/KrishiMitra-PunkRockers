import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle } from 'react-native';
import { Colors } from '@/constants/theme';

type Props = {
  title: string;
  onPress?: () => void;
  style?: ViewStyle;
  disabled?: boolean;
};

export default function PrimaryButton({ title, onPress, style, disabled }: Props) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.button, style, disabled ? styles.disabled : null]}
      activeOpacity={0.9}
      disabled={disabled}
    >
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: Colors.light.primary,
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 6,
  },
  text: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
  disabled: {
    backgroundColor: '#A0A0A0',
  },
});
