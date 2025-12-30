import { projectId, publicAnonKey } from '../../utils/supabase/info';

const API_BASE_URL = `https://${projectId}.supabase.co/functions/v1/make-server-9c2c6866`;

// Helper to make API requests
async function apiRequest<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${publicAnonKey}`,
      ...options?.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(error.error || `API request failed: ${response.statusText}`);
  }

  const result = await response.json();
  return result.data;
}

// ============================================
// DATA API CALLS
// ============================================

export const api = {
  // Arizona Districts
  getAzDistricts: async () => {
    return apiRequest<any[]>('/data/az-districts');
  },

  getAzDistrict: async (districtNumber: string) => {
    return apiRequest<any>(`/data/az-districts/${districtNumber}`);
  },

  // Issues
  getIssues: async () => {
    return apiRequest<any[]>('/data/issues');
  },

  getIssuesMockData: async () => {
    return apiRequest<any>('/data/issues-mock');
  },

  // Bills
  getBills: async () => {
    return apiRequest<any[]>('/data/bills');
  },

  // Clients
  getClients: async () => {
    return apiRequest<any[]>('/data/clients');
  },

  // Work Hub
  getWorkHub: async () => {
    return apiRequest<any>('/data/work-hub');
  },

  // Analytics
  getAnalytics: async () => {
    return apiRequest<any>('/data/analytics');
  },

  // Campaigns
  getCampaigns: async () => {
    return apiRequest<any[]>('/data/campaigns');
  },

  // Team
  getTeam: async () => {
    return apiRequest<any[]>('/data/team');
  },

  // Notifications
  getNotifications: async () => {
    return apiRequest<any[]>('/data/notifications');
  },

  // Records
  getRecords: async () => {
    return apiRequest<any[]>('/data/records');
  },

  // User Data
  saveWatchlist: async (userId: string, watchlist: any[]) => {
    return apiRequest('/user/watchlist', {
      method: 'POST',
      body: JSON.stringify({ userId, watchlist }),
    });
  },

  getWatchlist: async (userId: string) => {
    return apiRequest<any[]>(`/user/watchlist/${userId}`);
  },

  saveBrief: async (userId: string, brief: any) => {
    return apiRequest<{ briefId: string }>('/user/briefs', {
      method: 'POST',
      body: JSON.stringify({ userId, brief }),
    });
  },

  getBriefs: async (userId: string) => {
    return apiRequest<any[]>(`/user/briefs/${userId}`);
  },

  // Multi-tenancy API
  getUserProfile: async (userId: string) => {
    return apiRequest<any>(`/user/profile/${userId}`);
  },

  saveUserProfile: async (profile: any) => {
    return apiRequest('/user/profile', {
      method: 'POST',
      body: JSON.stringify(profile),
    });
  },

  getUserOrgs: async (userId: string) => {
    return apiRequest<{ orgIds: string[]; activeOrgId: string | null }>(`/user/orgs/${userId}`);
  },

  updateUserOrgs: async (userId: string, orgIds: string[], activeOrgId: string | null) => {
    return apiRequest('/user/orgs', {
      method: 'POST',
      body: JSON.stringify({ userId, orgIds, activeOrgId }),
    });
  },

  getOrgMeta: async (orgId: string) => {
    return apiRequest<any>(`/org/meta/${orgId}`);
  },

  getOrgMetaBatch: async (orgIds: string[]) => {
    return apiRequest<any[]>('/org/meta/batch', {
      method: 'POST',
      body: JSON.stringify({ orgIds }),
    });
  },

  getOrgMembers: async (orgId: string) => {
    return apiRequest<any>(`/org/members/${orgId}`);
  },

  createOrg: async (orgData: { orgId: string; name: string; slug?: string; userId: string; userEmail: string }) => {
    return apiRequest<{ org: any; members: any; orgIndex: any }>('/org/create', {
      method: 'POST',
      body: JSON.stringify(orgData),
    });
  },

  // Member management
  updateMemberRole: async (orgId: string, targetUserId: string, newRole: string) => {
    return apiRequest('/org/member/role', {
      method: 'POST',
      body: JSON.stringify({ orgId, targetUserId, newRole }),
    });
  },

  disableMember: async (orgId: string, targetUserId: string) => {
    return apiRequest('/org/member/disable', {
      method: 'POST',
      body: JSON.stringify({ orgId, targetUserId }),
    });
  },

  // Invites
  createInvite: async (inviteData: any) => {
    return apiRequest('/org/invite/create', {
      method: 'POST',
      body: JSON.stringify(inviteData),
    });
  },

  getInviteByToken: async (token: string) => {
    return apiRequest<any>(`/invite/token/${token}`);
  },

  getOrgInvites: async (orgId: string) => {
    return apiRequest<any[]>(`/org/invites/${orgId}`);
  },

  acceptInvite: async (inviteId: string, orgId: string, userId: string, userEmail: string) => {
    return apiRequest('/invite/accept', {
      method: 'POST',
      body: JSON.stringify({ inviteId, orgId, userId, userEmail }),
    });
  },

  revokeInvite: async (inviteId: string, orgId: string) => {
    return apiRequest('/invite/revoke', {
      method: 'POST',
      body: JSON.stringify({ inviteId, orgId }),
    });
  },

  // Tasks
  getTasks: async (orgId: string) => {
    return apiRequest<any[]>(`/org/tasks/${orgId}`);
  },

  createTask: async (orgId: string, taskId: string, task: any) => {
    return apiRequest('/org/tasks', {
      method: 'POST',
      body: JSON.stringify({ orgId, taskId, task }),
    });
  },

  updateTask: async (taskId: string, orgId: string, task: any) => {
    return apiRequest(`/org/tasks/${taskId}`, {
      method: 'PUT',
      body: JSON.stringify({ orgId, task }),
    });
  },

  deleteTask: async (taskId: string, orgId: string) => {
    return apiRequest(`/org/tasks/${taskId}`, {
      method: 'DELETE',
      body: JSON.stringify({ orgId }),
    });
  },

  // Records
  getRecords: async (orgId: string) => {
    return apiRequest<any[]>(`/org/records/${orgId}`);
  },

  createRecord: async (orgId: string, recordId: string, record: any) => {
    return apiRequest('/org/records', {
      method: 'POST',
      body: JSON.stringify({ orgId, recordId, record }),
    });
  },

  updateRecord: async (recordId: string, orgId: string, record: any) => {
    return apiRequest(`/org/records/${recordId}`, {
      method: 'PUT',
      body: JSON.stringify({ orgId, record }),
    });
  },

  deleteRecord: async (recordId: string, orgId: string) => {
    return apiRequest(`/org/records/${recordId}`, {
      method: 'DELETE',
      body: JSON.stringify({ orgId }),
    });
  },

  // Audit logs
  auditLogAppend: async (orgId: string, monthKey: string, entry: any) => {
    return apiRequest('/org/audit/append', {
      method: 'POST',
      body: JSON.stringify({ orgId, monthKey, entry }),
    });
  },

  getAuditLogs: async (orgId: string) => {
    return apiRequest<any[]>(`/org/audit/${orgId}`);
  },

  getAuditLogMonth: async (orgId: string, monthKey: string) => {
    return apiRequest<any[]>(`/org/audit/${orgId}/${monthKey}`);
  },

  // Admin
  seedData: async (dataType: string, data: any) => {
    return apiRequest('/admin/seed-data', {
      method: 'POST',
      body: JSON.stringify({ dataType, data }),
    });
  },
};

// ============================================
// DATA SEEDER UTILITY
// ============================================

export async function seedAllData() {
  try {
    console.log('🌱 Starting data seeding...');

    // First, check if the backend is accessible
    try {
      const healthCheck = await fetch(`${API_BASE_URL}/health`, {
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
        },
      });
      
      if (!healthCheck.ok) {
        console.warn('⚠️ Backend health check failed, but continuing...');
      } else {
        const health = await healthCheck.json();
        console.log('✅ Backend is healthy:', health);
      }
    } catch (healthError) {
      console.error('❌ Backend health check error:', healthError);
      throw new Error('Backend is not accessible. Please ensure Supabase is connected.');
    }

    // Import all data files
    const issuesMockData = await import('../app/data/issuesMockData');
    const { mockBills } = await import('../app/data/billsData');
    const { mockClients } = await import('../app/data/clientsData');
    const { projects, tasks } = await import('../app/data/workHubData');
    const { 
      mockClientPerformance,
      mockBillTypePerformance,
      mockLegislatorInfluence,
      mockTeamUtilization,
      mockPythiaAccuracy,
      mockWinRateTrend,
      mockDeliverablesTrend
    } = await import('../app/data/analyticsData');
    const { campaignProjects: campaigns } = await import('../app/data/campaignData');
    const { mockTeamMembers: teamMembers } = await import('../app/data/teamData');
    const { sampleNotifications } = await import('../app/data/sampleNotifications');
    const { mockRecords: recordItems } = await import('../app/data/recordsData');

    // Seed AZ district profiles (if available)
    try {
      const azDistrictProfilesRes = await fetch('/assets/data/az_district_profiles.json');
      const contentType = azDistrictProfilesRes.headers.get('content-type');
      
      if (azDistrictProfilesRes.ok && contentType && contentType.includes('application/json')) {
        const azProfiles = await azDistrictProfilesRes.json();
        for (const [districtNum, profile] of Object.entries(azProfiles)) {
          // Skip null or undefined profiles
          if (!profile || profile === null || profile === undefined) {
            console.warn(`⚠️ Skipping district ${districtNum} - profile is null/undefined`);
            continue;
          }
          await api.seedData(`az-district-${districtNum}`, profile);
        }
        console.log('✅ Seeded AZ district profiles');
      } else {
        console.log('⚠️ AZ district profiles not found or invalid format, skipping...');
      }
    } catch (azError) {
      console.warn('⚠️ Could not seed AZ district profiles:', azError);
      // Continue anyway
    }

    // Seed all other data with individual error handling
    const seedOperations = [
      // 'issues' was missing, removed from seed operations
      { 
        name: 'issues-mock-data', 
        data: {
          stateScores: issuesMockData.stateScores || {},
          countyScores: issuesMockData.countyScores || {},
          districtScores: issuesMockData.districtScores || {},
          topicsByIssue: issuesMockData.topicsByIssue || {},
          billsByTopic: issuesMockData.billsByTopic || {},
          peopleByTopic: issuesMockData.peopleByTopic || {},
          narrativesByIssue: issuesMockData.narrativesByIssue || {},
          stateKeywords: issuesMockData.stateKeywords || {},
        },
        label: 'issues mock data'
      },
      { name: 'bills-data', data: mockBills, label: 'bills data' },
      { name: 'clients-data', data: mockClients, label: 'clients data' },
      { name: 'work-hub-data', data: { projects, tasks }, label: 'work hub data' },
      { name: 'analytics-data', data: { 
        mockClientPerformance,
        mockBillTypePerformance,
        mockLegislatorInfluence,
        mockTeamUtilization,
        mockPythiaAccuracy,
        mockWinRateTrend,
        mockDeliverablesTrend
      }, label: 'analytics data' },
      { name: 'campaign-data', data: campaigns, label: 'campaign data' },
      { name: 'team-data', data: teamMembers, label: 'team data' },
      { name: 'notifications-data', data: sampleNotifications, label: 'notifications data' },
      { name: 'records-data', data: recordItems, label: 'records data' },
    ];

    let successCount = 0;
    let failCount = 0;

    for (const operation of seedOperations) {
      try {
        // Skip null or undefined data
        if (!operation.data || operation.data === null || operation.data === undefined) {
          console.warn(`⚠️ Skipping ${operation.label} - no data available`);
          continue;
        }
        
        // Log what we're about to send (for debugging)
        console.log(`Attempting to seed ${operation.label}:`, {
          name: operation.name,
          dataType: typeof operation.data,
          isArray: Array.isArray(operation.data),
          hasKeys: typeof operation.data === 'object' ? Object.keys(operation.data).length : 'N/A'
        });
        
        await api.seedData(operation.name, operation.data);
        console.log(`✅ Seeded ${operation.label}`);
        successCount++;
      } catch (error) {
        console.error(`❌ Failed to seed ${operation.label}:`, error);
        failCount++;
      }
    }

    console.log(`🎉 Data seeding complete! Success: ${successCount}, Failed: ${failCount}`);
    
    if (failCount > 0 && successCount === 0) {
      throw new Error('All seeding operations failed');
    }
    
    return { success: true, successCount, failCount };
  } catch (error) {
    console.error('❌ Error seeding data:', error);
    return { success: false, error };
  }
}
