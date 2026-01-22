import React, { useState, useEffect } from 'react';
import { X, Plus, UserPlus, Search, MoreVertical, Mail, AlertCircle, Settings, Users, Shield, Building, Link, XCircle, Copy, Clock, RefreshCw } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Chip } from '../ui/Chip';
import { copyToClipboard } from '../../utils/clipboard';
import { motion } from 'motion/react';
import { getPageTheme, hexToRgba } from '../../config/pageThemes';

import { useAuth } from '../../contexts/AuthContext';
import { useOrg } from '../../contexts/OrgContext';
import { useTheme } from '../../contexts/ThemeContext';
import { api } from '../../../utils/api';
import { can, generateId, generateToken, auditLogWrite } from '../../utils/kvAccess';

interface Invite {
  inviteId: string;
  orgId: string;
  email: string;
  role: string;
  status: 'pending' | 'accepted' | 'revoked' | 'expired';
  token: string;
  createdBy: string;
  createdAt: string;
  expiresAt: string;
}

interface TeamRosterTabProps {
  searchQuery?: string;
}

export function TeamRosterTab({ searchQuery }: TeamRosterTabProps) {
  const { currentUser } = useAuth();
  const { activeOrgId, activeOrgMeta, activeOrgMembers, userRole, refreshOrgData, userProfile, allOrgsMeta } = useOrg();
  const { isDarkMode } = useTheme();
  
  const [invites, setInvites] = useState<Invite[]>([]);
  const [memberProfiles, setMemberProfiles] = useState<Record<string, any>>({});
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<string>('staff');
  const [isCreatingInvite, setIsCreatingInvite] = useState(false);
  const [inviteLink, setInviteLink] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  
  // Permission check
  const canInvite = can(userRole, 'ORG_INVITE_CREATE');
  const canEditRole = can(userRole, 'ORG_MEMBER_EDIT_ROLE');
  const canRemove = can(userRole, 'ORG_MEMBER_REMOVE');

  useEffect(() => {
    loadTeamData();
  }, [activeOrgId]);

  async function loadTeamData() {
    if (!activeOrgId) return;
    
    setIsLoading(true);
    try {
      // Load invites
      const invitesData = await api.getOrgInvites(activeOrgId);
      setInvites(invitesData || []);
      
      // Load member profiles
      if (activeOrgMembers) {
        const userIds = Object.keys(activeOrgMembers);
        const profiles: Record<string, any> = {};
        
        for (const userId of userIds) {
          try {
            const profile = await api.getUserProfile(userId);
            if (profile) {
              profiles[userId] = profile;
            }
          } catch (err) {
            console.warn(`Could not load profile for ${userId}`);
          }
        }
        
        setMemberProfiles(profiles);
      }
    } catch (error) {
      console.error('Error loading team data:', error);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleCreateInvite() {
    if (!activeOrgId || !currentUser || !inviteEmail.trim()) return;
    
    setIsCreatingInvite(true);
    try {
      const inviteId = generateId('inv');
      const token = generateToken();
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 14); // 14 days expiry
      
      const inviteData = {
        orgId: activeOrgId,
        inviteId,
        email: inviteEmail.trim(),
        role: inviteRole,
        token,
        createdBy: currentUser.id,
        expiresAt: expiresAt.toISOString(),
      };
      
      await api.createInvite(inviteData);
      
      // Audit log
      await auditLogWrite(
        activeOrgId,
        currentUser.id,
        currentUser.email,
        'ORG_INVITE_CREATE',
        'invite',
        `Invited ${inviteEmail} as ${inviteRole}`,
        inviteId
      );
      
      // Generate invite link
      const link = `${window.location.origin}?invite=${token}`;
      setInviteLink(link);
      
      // Reload invites
      await loadTeamData();
    } catch (error) {
      console.error('Error creating invite:', error);
      alert('Failed to create invite');
    } finally {
      setIsCreatingInvite(false);
    }
  }

  async function handleRevokeInvite(inviteId: string) {
    if (!activeOrgId || !currentUser) return;
    
    if (!confirm('Revoke this invite?')) return;
    
    try {
      await api.revokeInvite(inviteId, activeOrgId);
      
      // Audit log
      await auditLogWrite(
        activeOrgId,
        currentUser.id,
        currentUser.email,
        'ORG_INVITE_REVOKE',
        'invite',
        `Revoked invite`,
        inviteId
      );
      
      await loadTeamData();
    } catch (error) {
      console.error('Error revoking invite:', error);
      alert('Failed to revoke invite');
    }
  }

  async function handleChangeRole(targetUserId: string, newRole: string) {
    if (!activeOrgId || !currentUser) return;
    
    try {
      await api.updateMemberRole(activeOrgId, targetUserId, newRole);
      
      // Audit log
      const targetEmail = memberProfiles[targetUserId]?.email || targetUserId;
      await auditLogWrite(
        activeOrgId,
        currentUser.id,
        currentUser.email,
        'ORG_MEMBER_ROLE_UPDATE',
        'member',
        `Changed ${targetEmail} role to ${newRole}`,
        targetUserId
      );
      
      await refreshOrgData();
      await loadTeamData();
    } catch (error) {
      console.error('Error changing role:', error);
      alert('Failed to change role');
    }
  }

  async function handleDisableMember(targetUserId: string) {
    if (!activeOrgId || !currentUser) return;
    
    const targetEmail = memberProfiles[targetUserId]?.email || targetUserId;
    if (!confirm(`Disable ${targetEmail}?`)) return;
    
    try {
      await api.disableMember(activeOrgId, targetUserId);
      
      // Audit log
      await auditLogWrite(
        activeOrgId,
        currentUser.id,
        currentUser.email,
        'ORG_MEMBER_DISABLED',
        'member',
        `Disabled member ${targetEmail}`,
        targetUserId
      );
      
      await refreshOrgData();
      await loadTeamData();
    } catch (error) {
      console.error('Error disabling member:', error);
      alert('Failed to disable member');
    }
  }

  async function copyInviteLink() {
    const success = await copyToClipboard(inviteLink);
    if (success) {
      alert('Invite link copied!');
    } else {
      alert('Failed to copy invite link');
    }
  }

  const bgColor = isDarkMode ? 'bg-slate-900' : 'bg-gray-50';
  const cardBg = isDarkMode ? 'bg-slate-800' : 'bg-white';
  const textColor = isDarkMode ? 'text-white' : 'text-gray-900';
  const textMuted = isDarkMode ? 'text-gray-400' : 'text-gray-600';
  const borderColor = isDarkMode ? 'border-slate-700' : 'border-gray-200';

  return (
    <div className="space-y-6">
      {/* Actions Row */}
      <div className="flex justify-end">
        {canInvite && (
          <button
            onClick={() => {
              setShowInviteModal(true);
              setInviteEmail('');
              setInviteRole('staff');
              setInviteLink('');
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg ${isDarkMode ? 'bg-purple-600 hover:bg-purple-700' : 'bg-purple-600 hover:bg-purple-700'} text-white transition-colors shadow-lg shadow-purple-500/20`}
          >
            <UserPlus size={18} />
            Invite Member
          </button>
        )}
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="text-center py-12">
          <RefreshCw className={`w-8 h-8 animate-spin mx-auto mb-4 ${textMuted}`} />
          <p className={textMuted}>Loading team data...</p>
        </div>
      )}

      {!isLoading && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Members List */}
          <div className={`${cardBg} border ${borderColor} rounded-xl overflow-hidden shadow-sm`}>
            <div className={`p-4 border-b ${borderColor} flex items-center gap-2`}>
              <Users className={textMuted} size={20} />
              <h2 className={`text-lg font-semibold ${textColor}`}>
                Active Members
              </h2>
            </div>

            <div className="divide-y divide-gray-200 dark:divide-slate-700">
              {activeOrgMembers && Object.entries(activeOrgMembers).map(([userId, member]: [string, any]) => {
                if (member.status === 'disabled') return null;
                
                const profile = memberProfiles[userId];
                // Filter by search query if provided
                if (searchQuery && profile) {
                   const searchLower = searchQuery.toLowerCase();
                   const nameMatch = (profile.fullName || '').toLowerCase().includes(searchLower);
                   const emailMatch = (profile.email || '').toLowerCase().includes(searchLower);
                   if (!nameMatch && !emailMatch) return null;
                }

                const isCurrentUser = userId === currentUser?.id;
                
                return (
                  <div key={userId} className="p-4 flex items-center justify-between hover:bg-gray-50/50 dark:hover:bg-slate-700/50 transition-colors">
                    <div className="flex-1">
                      <div className={`font-medium ${textColor} flex items-center gap-2`}>
                        {profile?.fullName || profile?.email || 'Unknown User'}
                        {isCurrentUser && <span className="text-xs px-1.5 py-0.5 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">You</span>}
                      </div>
                      <div className={`text-sm ${textMuted}`}>{profile?.email}</div>
                      <div className="flex items-center gap-2 mt-1">
                        <Shield size={12} className={textMuted} />
                        <span className={`text-xs uppercase tracking-wider font-medium ${textMuted}`}>{member.role}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {canEditRole && !isCurrentUser && member.role !== 'owner' && (
                        <select
                          value={member.role}
                          onChange={(e) => handleChangeRole(userId, e.target.value)}
                          className={`px-2 py-1 text-xs rounded border ${borderColor} ${isDarkMode ? 'bg-slate-900 text-white' : 'bg-white text-gray-900'} outline-none focus:border-purple-500`}
                        >
                          <option value="staff">Staff</option>
                          <option value="manager">Manager</option>
                          <option value="admin">Admin</option>
                          {userRole === 'owner' && <option value="owner">Owner</option>}
                        </select>
                      )}

                      {canRemove && !isCurrentUser && member.role !== 'owner' && (
                        <button
                          onClick={() => handleDisableMember(userId)}
                          className="p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
                          title="Disable member"
                        >
                          <XCircle size={16} />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Invites List */}
          <div className={`${cardBg} border ${borderColor} rounded-xl overflow-hidden shadow-sm h-fit`}>
            <div className={`p-4 border-b ${borderColor} flex items-center gap-2`}>
              <Mail className={textMuted} size={20} />
              <h2 className={`text-lg font-semibold ${textColor}`}>
                Pending Invites
              </h2>
            </div>

            {invites.filter(inv => inv.status === 'pending').length === 0 ? (
              <p className={`text-center py-8 ${textMuted}`}>No pending invites</p>
            ) : (
              <div className="divide-y divide-gray-200 dark:divide-slate-700">
                {invites.filter(inv => inv.status === 'pending').map(invite => (
                  <div key={invite.inviteId} className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className={`font-medium ${textColor}`}>{invite.email}</div>
                        <div className={`text-sm ${textMuted}`}>Role: {invite.role}</div>
                        <div className={`text-xs ${textMuted} mt-1 flex items-center gap-1`}>
                          <Clock size={12} />
                          Expires {new Date(invite.expiresAt).toLocaleDateString()}
                        </div>
                      </div>

                      {canInvite && (
                        <button
                          onClick={() => handleRevokeInvite(invite.inviteId)}
                          className="p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
                          title="Revoke invite"
                        >
                          <XCircle size={16} />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Invite Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100] p-4 backdrop-blur-sm">
          <div className={`w-full max-w-md ${cardBg} border ${borderColor} p-6 rounded-xl shadow-2xl`}>
            <h2 className={`text-xl font-bold mb-4 ${textColor}`}>
              Invite Team Member
            </h2>

            {inviteLink ? (
              <div>
                <div className={`p-4 border ${borderColor} rounded-lg mb-4 ${isDarkMode ? 'bg-slate-900' : 'bg-gray-50'}`}>
                  <p className={`text-sm mb-2 ${textMuted}`}>Invite created! Share this link:</p>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={inviteLink}
                      readOnly
                      className={`flex-1 px-3 py-2 text-sm rounded border ${borderColor} ${isDarkMode ? 'bg-slate-800 text-white' : 'bg-white text-gray-900'}`}
                    />
                    <button
                      onClick={copyInviteLink}
                      className={`p-2 rounded ${isDarkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-600 hover:bg-blue-700'} text-white`}
                      title="Copy link"
                    >
                      <Copy size={18} />
                    </button>
                  </div>
                </div>

                <button
                  onClick={() => setShowInviteModal(false)}
                  className={`w-full py-2 rounded-lg ${isDarkMode ? 'bg-slate-700 hover:bg-slate-600' : 'bg-gray-200 hover:bg-gray-300'} ${textColor} transition-colors`}
                >
                  Close
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className={`block text-sm font-medium mb-2 ${textColor}`}>Email</label>
                  <input
                    type="email"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    placeholder="colleague@example.com"
                    className={`w-full px-3 py-2 rounded-lg border ${borderColor} ${isDarkMode ? 'bg-slate-900 text-white' : 'bg-white text-gray-900'} focus:ring-2 focus:ring-purple-500 outline-none`}
                    autoFocus
                  />
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-2 ${textColor}`}>Role</label>
                  <select
                    value={inviteRole}
                    onChange={(e) => setInviteRole(e.target.value)}
                    className={`w-full px-3 py-2 rounded-lg border ${borderColor} ${isDarkMode ? 'bg-slate-900 text-white' : 'bg-white text-gray-900'} focus:ring-2 focus:ring-purple-500 outline-none`}
                  >
                    <option value="staff">Staff</option>
                    <option value="manager">Manager</option>
                    <option value="admin">Admin</option>
                    <option value="client_viewer">Client Viewer</option>
                  </select>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    onClick={handleCreateInvite}
                    disabled={isCreatingInvite || !inviteEmail.trim()}
                    className={`flex-1 py-2 rounded-lg ${isDarkMode ? 'bg-purple-600 hover:bg-purple-700 disabled:bg-slate-700' : 'bg-purple-600 hover:bg-purple-700 disabled:bg-gray-300'} text-white transition-colors disabled:cursor-not-allowed font-medium`}
                  >
                    {isCreatingInvite ? 'Creating...' : 'Create Invite'}
                  </button>

                  <button
                    onClick={() => setShowInviteModal(false)}
                    className={`px-4 py-2 rounded-lg ${isDarkMode ? 'bg-slate-700 hover:bg-slate-600' : 'bg-gray-200 hover:bg-gray-300'} ${textColor} transition-colors font-medium`}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}