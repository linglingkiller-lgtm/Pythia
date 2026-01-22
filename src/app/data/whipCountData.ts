import { Legislator } from '../components/legislators/legislatorData';

export interface WhipCount {
  billId: string;
  counts: {
    hardYes: string[];
    softYes: string[];
    undecided: string[];
    softNo: string[];
    hardNo: string[];
  };
  targetVotes: number;
  totalVotes: number;
  lastUpdated: string;
}

export const mockWhipCounts: Record<string, WhipCount> = {
  'bill-001': {
    billId: 'bill-001',
    targetVotes: 31, // Need 31 for House majority
    totalVotes: 60,
    lastUpdated: '2025-12-16T14:30:00',
    counts: {
      hardYes: ['leg-001', 'leg-002', 'leg-005', 'leg-006', 'leg-010', 'leg-011', 'leg-012', 'leg-013', 'leg-016', 'leg-017', 'leg-018', 'leg-021', 'leg-023'],
      softYes: ['leg-004', 'leg-007', 'leg-020', 'leg-025', 'leg-028'],
      undecided: ['leg-009', 'leg-019', 'leg-022', 'leg-024', 'leg-026', 'leg-030'],
      softNo: ['leg-003', 'leg-008', 'leg-015', 'leg-027', 'leg-029'],
      hardNo: ['leg-014', 'leg-031', 'leg-032', 'leg-033', 'leg-034', 'leg-035', 'leg-036', 'leg-037', 'leg-038', 'leg-039', 'leg-040']
    }
  }
};
