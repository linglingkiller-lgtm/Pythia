import React from 'react';
import { Text, View, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 40,
    right: 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    paddingTop: 10,
  },
  text: {
    fontSize: 8,
    color: '#94A3B8',
  },
});

interface PdfFooterProps {
  clientName: string;
}

export const PdfFooter = ({ clientName }: PdfFooterProps) => (
  <View style={styles.footer} fixed>
    <Text style={styles.text}>Confidential – Prepared for {clientName}</Text>
    <Text style={styles.text} render={({ pageNumber, totalPages }) => (
      `Page ${pageNumber} of ${totalPages}`
    )} />
  </View>
);
