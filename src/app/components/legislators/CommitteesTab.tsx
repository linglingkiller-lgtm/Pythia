import React from 'react';
import { CommitteesIndexPage } from '../committees/CommitteesIndexPage';

interface CommitteesTabProps {
  onNavigateToLegislator: (legislatorId: string) => void;
}

export function CommitteesTab({ onNavigateToLegislator }: CommitteesTabProps) {
  return (
    <CommitteesIndexPage
      onNavigateToLegislator={onNavigateToLegislator}
    />
  );
}
