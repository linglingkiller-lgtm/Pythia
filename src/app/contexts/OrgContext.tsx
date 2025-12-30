import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../../utils/api';

// Types
export interface UserProfile {
  userId: string;
  email: string;
  fullName: string;
  avatarUrl: string | null;
  title: string;
  department: string;
  createdAt: string;
  updatedAt: string;
}

export interface OrgMeta {
  orgId: string;
  name: string;
  slug: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface OrgMember {
  role: 'owner' | 'admin' | 'manager' | 'staff' | 'client_viewer';
  status: 'active' | 'invited' | 'disabled';
  addedAt: string;
}

export interface OrgMembers {
  [userId: string]: OrgMember;
}

interface OrgContextType {
  // Loading states
  isBootstrapping: boolean;
  bootstrapError: string | null;
  
  // User data
  userProfile: UserProfile | null;
  userOrgs: string[];
  
  // Active org
  activeOrgId: string | null;
  activeOrgMeta: OrgMeta | null;
  activeOrgMembers: OrgMembers | null;
  userRole: string | null;
  
  // All orgs metadata
  allOrgsMeta: OrgMeta[];
  
  // Actions
  switchOrg: (orgId: string) => Promise<void>;
  refreshOrgData: () => Promise<void>;
  retryBootstrap: () => Promise<void>;
  
  // Onboarding
  needsOnboarding: boolean;
}

const defaultOrgContext: OrgContextType = {
  isBootstrapping: true,
  bootstrapError: null,
  userProfile: null,
  userOrgs: [],
  activeOrgId: null,
  activeOrgMeta: null,
  activeOrgMembers: null,
  userRole: null,
  allOrgsMeta: [],
  switchOrg: async () => {},
  refreshOrgData: async () => {},
  retryBootstrap: async () => {},
  needsOnboarding: false,
};

const OrgContext = createContext<OrgContextType>(defaultOrgContext);

interface OrgProviderProps {
  children: React.ReactNode;
  userId: string;
  userEmail: string;
}

export const OrgProvider: React.FC<OrgProviderProps> = ({ children, userId, userEmail }) => {
  const [isBootstrapping, setIsBootstrapping] = useState(true);
  const [bootstrapError, setBootstrapError] = useState<string | null>(null);
  
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [userOrgs, setUserOrgs] = useState<string[]>([]);
  const [activeOrgId, setActiveOrgId] = useState<string | null>(null);
  const [activeOrgMeta, setActiveOrgMeta] = useState<OrgMeta | null>(null);
  const [activeOrgMembers, setActiveOrgMembers] = useState<OrgMembers | null>(null);
  const [allOrgsMeta, setAllOrgsMeta] = useState<OrgMeta[]>([]);

  const userRole = activeOrgMembers && userId ? activeOrgMembers[userId]?.role || null : null;
  const needsOnboarding = !isBootstrapping && userOrgs.length === 0;

  // Bootstrap on mount
  useEffect(() => {
    bootstrap();
  }, [userId]);

  async function bootstrap() {
    try {
      setIsBootstrapping(true);
      setBootstrapError(null);

      console.log('🚀 Bootstrapping org data for user:', userId);

      // 1. Load or create user profile
      let profile = await api.getUserProfile(userId);
      if (!profile) {
        console.log('Creating new user profile...');
        profile = await api.saveUserProfile({
          userId,
          email: userEmail,
          fullName: userEmail,
        });
      }
      setUserProfile(profile);

      // 2. Load user org index
      const orgIndex = await api.getUserOrgs(userId);
      const orgIds = orgIndex?.orgIds || [];
      setUserOrgs(orgIds);

      console.log('User org index:', orgIndex);

      // 3. If no orgs, user needs onboarding
      if (orgIds.length === 0) {
        console.log('User has no organizations - needs onboarding');
        setIsBootstrapping(false);
        return;
      }

      // 4. Determine active org
      let selectedOrgId = null;
      
      // Prefer localStorage activeOrgId if valid
      const localStorageOrgId = localStorage.getItem('revere-active-org-id');
      if (localStorageOrgId && orgIds.includes(localStorageOrgId)) {
        selectedOrgId = localStorageOrgId;
      } 
      // Else prefer orgIndex.activeOrgId if valid
      else if (orgIndex.activeOrgId && orgIds.includes(orgIndex.activeOrgId)) {
        selectedOrgId = orgIndex.activeOrgId;
      } 
      // Else use first org
      else {
        selectedOrgId = orgIds[0];
      }

      console.log('Selected active org:', selectedOrgId);

      // 5. Load active org data
      const orgMeta = await api.getOrgMeta(selectedOrgId);
      const orgMembers = await api.getOrgMembers(selectedOrgId);
      
      setActiveOrgId(selectedOrgId);
      setActiveOrgMeta(orgMeta);
      setActiveOrgMembers(orgMembers);

      // Save to localStorage and backend
      localStorage.setItem('revere-active-org-id', selectedOrgId);
      await api.updateUserOrgs(userId, orgIds, selectedOrgId);

      // 6. Load all orgs metadata for switcher
      if (orgIds.length > 1) {
        const allMetas = await api.getOrgMetaBatch(orgIds);
        setAllOrgsMeta(allMetas.filter(Boolean));
      } else {
        setAllOrgsMeta([orgMeta]);
      }

      console.log('✅ Bootstrap complete');
      setIsBootstrapping(false);
    } catch (error) {
      console.error('❌ Bootstrap error:', error);
      setBootstrapError(error instanceof Error ? error.message : 'Failed to load organization data');
      setIsBootstrapping(false);
    }
  }

  async function switchOrg(orgId: string) {
    try {
      console.log('Switching to org:', orgId);

      // Load new org data
      const orgMeta = await api.getOrgMeta(orgId);
      const orgMembers = await api.getOrgMembers(orgId);

      setActiveOrgId(orgId);
      setActiveOrgMeta(orgMeta);
      setActiveOrgMembers(orgMembers);

      // Save to localStorage and backend
      localStorage.setItem('revere-active-org-id', orgId);
      await api.updateUserOrgs(userId, userOrgs, orgId);

      console.log('✅ Switched to org:', orgMeta.name);
    } catch (error) {
      console.error('❌ Error switching org:', error);
      throw error;
    }
  }

  async function refreshOrgData() {
    if (!activeOrgId) return;
    
    try {
      const orgMeta = await api.getOrgMeta(activeOrgId);
      const orgMembers = await api.getOrgMembers(activeOrgId);
      
      setActiveOrgMeta(orgMeta);
      setActiveOrgMembers(orgMembers);
      
      console.log('✅ Refreshed org data');
    } catch (error) {
      console.error('❌ Error refreshing org data:', error);
      throw error;
    }
  }

  async function retryBootstrap() {
    await bootstrap();
  }

  return (
    <OrgContext.Provider
      value={{
        isBootstrapping,
        bootstrapError,
        userProfile,
        userOrgs,
        activeOrgId,
        activeOrgMeta,
        activeOrgMembers,
        userRole,
        allOrgsMeta,
        switchOrg,
        refreshOrgData,
        retryBootstrap,
        needsOnboarding,
      }}
    >
      {children}
    </OrgContext.Provider>
  );
};

export const useOrg = () => {
  const context = useContext(OrgContext);
  return context;
};
