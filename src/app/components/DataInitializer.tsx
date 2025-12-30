import React, { useEffect, useState } from 'react';
import { seedAllData } from '../../utils/api';
import { LoadingScreen } from './LoadingScreen';
import { useOrg } from '../contexts/OrgContext';

interface Props {
  isDarkMode: boolean;
  onComplete: () => void;
}

export function DataInitializer({ isDarkMode, onComplete }: Props) {
  const [status, setStatus] = useState<'checking' | 'seeding' | 'complete'>('checking');
  
  // Get org info for Step 3
  const { activeOrgMeta, userRole } = useOrg();

  useEffect(() => {
    initializeData();
  }, []);

  async function initializeData() {
    // Check if data already exists in localStorage
    const dataSeeded = localStorage.getItem('revere-data-seeded');
    
    // Simulate checking phase for UX
    await new Promise(resolve => setTimeout(resolve, 800));

    if (dataSeeded === 'true') {
      setStatus('complete');
      setTimeout(onComplete, 2000);
      return;
    }

    // Seed the data
    setStatus('seeding');
    
    try {
      const result = await seedAllData();
      
      if (result.success) {
        localStorage.setItem('revere-data-seeded', 'true');
        setStatus('complete');
        setTimeout(onComplete, 2500);
      } else {
        // Backend not ready - automatically fall back to local data
        console.warn('Backend not ready, using local data mode');
        localStorage.setItem('revere-data-seeded', 'true');
        localStorage.setItem('revere-use-local-data', 'true');
        setStatus('complete');
        setTimeout(onComplete, 2500);
      }
    } catch (err) {
      // Automatically fall back to local data on any error
      console.warn('Backend error, using local data mode:', err);
      localStorage.setItem('revere-data-seeded', 'true');
      localStorage.setItem('revere-use-local-data', 'true');
      setStatus('complete');
      setTimeout(onComplete, 2500);
    }
  }

  // Map status to loading screen props
  const getStep = () => {
    switch (status) {
      case 'checking': return 1;
      case 'seeding': return 2;
      case 'complete': return 3;
      default: return 1;
    }
  };

  const getContent = () => {
    switch (status) {
      case 'checking':
        return {
          title: 'Establishing your workspace…',
          subtext: 'Confirming membership and org permissions.'
        };
      case 'seeding':
        return {
          title: 'Synchronizing your intel…',
          subtext: 'Loading tasks, records, and dashboards.'
        };
      case 'complete':
        return {
          title: 'Pythia is online.',
          subtext: 'Your org is configured. You’re cleared to proceed.'
        };
    }
  };

  const { title, subtext } = getContent();

  return (
    <LoadingScreen 
      step={getStep()} 
      title={title} 
      subtext={subtext} 
      isDarkMode={isDarkMode}
      orgName={activeOrgMeta?.name}
      userRole={userRole || undefined}
    />
  );
}
