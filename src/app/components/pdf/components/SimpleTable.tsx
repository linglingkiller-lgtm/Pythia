import React from 'react';
import { Text, View, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  table: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 4,
    overflow: 'hidden',
    marginTop: 5,
    marginBottom: 10,
  },
  row: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    paddingVertical: 6,
    paddingHorizontal: 8,
    minHeight: 24,
    alignItems: 'center',
  },
  headerRow: {
    backgroundColor: '#F8FAFC',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  evenRow: {
    backgroundColor: '#FFFFFF',
  },
  oddRow: {
    backgroundColor: '#FAFAFA',
  },
  headerCell: {
    fontSize: 8,
    fontWeight: 'bold',
    color: '#475569',
  },
  cell: {
    fontSize: 9,
    color: '#0F1419',
  },
});

export interface Column<T> {
  header: string;
  accessor: (item: T) => React.ReactNode;
  width?: string;
}

interface SimpleTableProps<T> {
  data: T[];
  columns: Column<T>[];
}

export function SimpleTable<T>({ data, columns }: SimpleTableProps<T>) {
  return (
    <View style={styles.table}>
      {/* Header */}
      <View style={[styles.row, styles.headerRow]}>
        {columns.map((col, i) => (
          <View key={i} style={{ width: col.width || `${100 / columns.length}%` }}>
            <Text style={styles.headerCell}>{col.header}</Text>
          </View>
        ))}
      </View>
      {/* Body */}
      {data.map((item, rowIndex) => (
        <View key={rowIndex} style={[styles.row, rowIndex % 2 === 0 ? styles.evenRow : styles.oddRow]}>
          {columns.map((col, i) => (
            <View key={i} style={{ width: col.width || `${100 / columns.length}%` }}>
              <View style={styles.cell}>{col.accessor(item)}</View>
            </View>
          ))}
        </View>
      ))}
    </View>
  );
}
