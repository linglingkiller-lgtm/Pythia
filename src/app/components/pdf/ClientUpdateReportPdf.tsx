import React from 'react';
import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';
import { PdfHeader } from './components/PdfHeader';
import { PdfFooter } from './components/PdfFooter';
import { MetricCard } from './components/MetricCard';
import { SectionTitle } from './components/SectionTitle';
import { SimpleTable, Column } from './components/SimpleTable';
import { Chip } from './components/Chip';

// Define styles
const styles = StyleSheet.create({
  page: {
    paddingTop: 40,
    paddingBottom: 60,
    paddingHorizontal: 40,
    fontFamily: 'Helvetica',
    backgroundColor: '#FFFFFF',
  },
  section: {
    marginBottom: 10,
  },
  titleBlock: {
    marginBottom: 20,
  },
  reportTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#0F1419',
  },
  reportSubtitle: {
    fontSize: 10,
    color: '#64748B',
  },
  metricGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  summaryText: {
    fontSize: 10,
    lineHeight: 1.5,
    color: '#334155',
    marginBottom: 10,
  },
  bulletPoint: {
    fontSize: 10,
    lineHeight: 1.4,
    color: '#334155',
    marginBottom: 4,
    flexDirection: 'row',
  },
  bullet: {
    width: 10,
    color: '#8B1538',
  },
  bulletContent: {
    flex: 1,
  },
  note: {
    fontSize: 9,
    fontStyle: 'italic',
    color: '#94A3B8',
    marginTop: 5,
  }
});

// Interfaces matching your data structures
interface PdfData {
  clientName: string;
  dateRange: string;
  metrics: {
    issues: number;
    bills: number;
    engagements: number;
    deadlines: number;
  };
  summary: string;
  wins: string[];
  risks: string[];
  actions: Array<{ action: string; owner: string; due: string; confidence: string }>;
  outlook: string;
  engagementHighlights: string[];
  // Expanded data
  bills?: Array<{ number: string; title: string; status: string }>;
  issues?: Array<{ name: string; priority: string }>;
  engagementLedger?: Array<{ date: string; type: string; summary: string }>;
}

interface ClientUpdateReportPdfProps {
  data: PdfData;
  mode: 'compact' | 'expanded';
  options: {
    includeBills: boolean;
    includeIssues: boolean;
    includeLedger: boolean;
  };
}

export const ClientUpdateReportPdf = ({ data, mode, options }: ClientUpdateReportPdfProps) => {
  const isExpanded = mode === 'expanded';

  return (
    <Document>
      <Page size="LETTER" style={styles.page}>
        <PdfHeader clientName={data.clientName} dateRange={data.dateRange} />

        {/* Page 1 Content */}
        <View style={styles.titleBlock}>
          <Text style={styles.reportTitle}>Executive Update</Text>
          <Text style={styles.reportSubtitle}>Prepared by Revere • {new Date().toLocaleDateString()}</Text>
        </View>

        {/* Metrics */}
        <View style={styles.metricGrid}>
          <MetricCard label="Active Issues" value={data.metrics.issues} />
          <MetricCard label="Bills Tracking" value={data.metrics.bills} />
          <MetricCard label="Engagements" value={data.metrics.engagements} />
          <MetricCard label="Upcoming Deadlines" value={data.metrics.deadlines} />
        </View>

        {/* Executive Summary */}
        <View style={styles.section}>
          <SectionTitle>Executive Summary</SectionTitle>
          <Text style={styles.summaryText}>{data.summary}</Text>
        </View>

        {/* Wins */}
        <View style={styles.section}>
          <SectionTitle>Key Wins & Progress</SectionTitle>
          {data.wins.map((win, i) => (
            <View key={i} style={styles.bulletPoint}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.bulletContent}>{win}</Text>
            </View>
          ))}
        </View>

        {/* Risks */}
        <View style={styles.section}>
          <SectionTitle>Risks & Watch Items</SectionTitle>
          {data.risks.map((risk, i) => (
            <View key={i} style={styles.bulletPoint}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.bulletContent}>{risk}</Text>
            </View>
          ))}
        </View>

        <PdfFooter clientName={data.clientName} />
      </Page>

      <Page size="LETTER" style={styles.page}>
        <PdfHeader clientName={data.clientName} dateRange={data.dateRange} />

        {/* Recommended Actions */}
        <View style={styles.section}>
          <SectionTitle>Recommended Actions</SectionTitle>
          <SimpleTable
            data={data.actions}
            columns={[
              { header: 'Action', accessor: (d) => <Text>{d.action}</Text>, width: '40%' },
              { header: 'Owner', accessor: (d) => <Text>{d.owner}</Text>, width: '20%' },
              { header: 'Due', accessor: (d) => <Text>{d.due}</Text>, width: '20%' },
              { 
                header: 'Confidence', 
                accessor: (d) => <Chip label={d.confidence} variant={d.confidence === 'High' ? 'high' : 'medium'} />,
                width: '20%' 
              },
            ]}
          />
        </View>

        {/* Legislative Outlook */}
        <View style={styles.section}>
          <SectionTitle>Legislative Outlook</SectionTitle>
          <Text style={styles.summaryText}>{data.outlook}</Text>
        </View>

        {/* Engagement Highlights */}
        <View style={styles.section}>
          <SectionTitle>Engagement Highlights</SectionTitle>
          {data.engagementHighlights.map((item, i) => (
            <View key={i} style={styles.bulletPoint}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.bulletContent}>{item}</Text>
            </View>
          ))}
        </View>

        <PdfFooter clientName={data.clientName} />
      </Page>

      {/* Expanded Sections */}
      {isExpanded && (
        <Page size="LETTER" style={styles.page}>
          <PdfHeader clientName={data.clientName} dateRange={data.dateRange} />
          
          <View style={styles.titleBlock}>
            <Text style={styles.reportTitle}>Detailed Appendix</Text>
          </View>

          {options.includeBills && (
            <View style={styles.section}>
              <SectionTitle>Core Bills</SectionTitle>
              {data.bills && data.bills.length > 0 ? (
                <SimpleTable
                  data={data.bills}
                  columns={[
                    { header: 'Bill #', accessor: (d) => <Text style={{fontWeight:'bold'}}>{d.number}</Text>, width: '20%' },
                    { header: 'Title', accessor: (d) => <Text>{d.title}</Text>, width: '60%' },
                    { header: 'Status', accessor: (d) => <Chip label={d.status} />, width: '20%' },
                  ]}
                />
              ) : (
                <Text style={styles.note}>No bill tracking data connected for this client yet.</Text>
              )}
            </View>
          )}

          {options.includeIssues && (
            <View style={styles.section}>
              <SectionTitle>Issue Map</SectionTitle>
              {data.issues && data.issues.length > 0 ? (
                <SimpleTable
                  data={data.issues}
                  columns={[
                    { header: 'Issue', accessor: (d) => <Text>{d.name}</Text>, width: '70%' },
                    { header: 'Priority', accessor: (d) => <Chip label={d.priority} />, width: '30%' },
                  ]}
                />
              ) : (
                <Text style={styles.note}>No issue data connected for this client yet.</Text>
              )}
            </View>
          )}

          {options.includeLedger && (
            <View style={styles.section}>
              <SectionTitle>Engagement Ledger</SectionTitle>
              {data.engagementLedger && data.engagementLedger.length > 0 ? (
                <SimpleTable
                  data={data.engagementLedger}
                  columns={[
                    { header: 'Date', accessor: (d) => <Text>{d.date}</Text>, width: '20%' },
                    { header: 'Type', accessor: (d) => <Text>{d.type}</Text>, width: '20%' },
                    { header: 'Summary', accessor: (d) => <Text>{d.summary}</Text>, width: '60%' },
                  ]}
                />
              ) : (
                <Text style={styles.note}>No recent engagements recorded.</Text>
              )}
            </View>
          )}

          <PdfFooter clientName={data.clientName} />
        </Page>
      )}
    </Document>
  );
};
