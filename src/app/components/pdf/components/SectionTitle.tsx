import React from 'react';
import { Text, View, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    marginTop: 15,
    paddingBottom: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  text: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#8B1538', // Revere Red
    textTransform: 'uppercase',
  },
});

interface SectionTitleProps {
  children: React.ReactNode;
}

export const SectionTitle = ({ children }: SectionTitleProps) => (
  <View style={styles.container}>
    <Text style={styles.text}>{children}</Text>
  </View>
);
