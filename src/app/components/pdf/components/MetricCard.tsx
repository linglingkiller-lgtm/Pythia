import React from 'react';
import { Text, View, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  card: {
    padding: 10,
    backgroundColor: '#F8FAFC',
    borderRadius: 4,
    width: '48%', // 2x2 grid
    marginBottom: 10,
  },
  label: {
    fontSize: 8,
    color: '#64748B',
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  value: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0F1419',
  },
});

interface MetricCardProps {
  label: string;
  value: string | number;
}

export const MetricCard = ({ label, value }: MetricCardProps) => (
  <View style={styles.card}>
    <Text style={styles.label}>{label}</Text>
    <Text style={styles.value}>{value}</Text>
  </View>
);
