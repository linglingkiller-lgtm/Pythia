import React from 'react';
import { Text, View, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  chip: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    backgroundColor: '#F1F5F9', // Default muted
    alignSelf: 'flex-start',
  },
  text: {
    fontSize: 8,
    color: '#475569',
  },
  // Variants
  high: { backgroundColor: '#FEF2F2' },
  highText: { color: '#991B1B' },
  medium: { backgroundColor: '#FFFBEB' },
  mediumText: { color: '#92400E' },
  low: { backgroundColor: '#F0FDF4' },
  lowText: { color: '#166534' },
});

interface ChipProps {
  label: string;
  variant?: 'high' | 'medium' | 'low' | 'neutral';
}

export const Chip = ({ label, variant = 'neutral' }: ChipProps) => {
  const getStyle = () => {
    switch (variant) {
      case 'high': return [styles.chip, styles.high];
      case 'medium': return [styles.chip, styles.medium];
      case 'low': return [styles.chip, styles.low];
      default: return styles.chip;
    }
  };

  const getTextStyle = () => {
    switch (variant) {
      case 'high': return [styles.text, styles.highText];
      case 'medium': return [styles.text, styles.mediumText];
      case 'low': return [styles.text, styles.lowText];
      default: return styles.text;
    }
  };

  return (
    <View style={getStyle()}>
      <Text style={getTextStyle()}>{label}</Text>
    </View>
  );
};
