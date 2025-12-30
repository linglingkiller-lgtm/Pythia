import React from 'react';
import { Text, View, StyleSheet, Image, Font } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#8B1538', // Revere Red
    marginLeft: 5,
  },
  reportType: {
    fontSize: 10,
    color: '#64748B',
    marginTop: 2,
  },
  clientInfo: {
    alignItems: 'flex-end',
  },
  clientName: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#0F1419',
  },
  dateRange: {
    fontSize: 10,
    color: '#64748B',
  },
});

interface PdfHeaderProps {
  clientName: string;
  dateRange: string;
}

export const PdfHeader = ({ clientName, dateRange }: PdfHeaderProps) => (
  <View style={styles.header} fixed>
    <View>
      <View style={styles.logoContainer}>
        {/* Replace with actual logo image if available, for now just text */}
        <Text style={styles.logoText}>REVERE</Text>
      </View>
      <Text style={styles.reportType}>CLIENT UPDATE</Text>
    </View>
    <View style={styles.clientInfo}>
      <Text style={styles.clientName}>{clientName}</Text>
      <Text style={styles.dateRange}>{dateRange}</Text>
    </View>
  </View>
);
