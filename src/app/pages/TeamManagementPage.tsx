import React, { useState, useEffect } from 'react';
import { X, Plus, UserPlus, Search, MoreVertical, Mail, AlertCircle, Settings, Users, Shield, Building, Link, XCircle, Copy, Clock, RefreshCw } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Chip } from '../components/ui/Chip';
import { copyToClipboard } from '../utils/clipboard';
import { motion } from 'motion/react';
import { getPageTheme, hexToRgba } from '../config/pageThemes';

import { useAuth } from '../contexts/AuthContext';
import { useOrg } from '../contexts/OrgContext';
import { useTheme } from '../contexts/ThemeContext';
import { api } from '../../utils/api';
import { can, generateId, generateToken, auditLogWrite } from '../utils/kvAccess';

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

export function TeamManagementPage() {
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

  // Get Team page theme
  const teamTheme = getPageTheme('Team');

  // Count active members
  const activeMembersCount = activeOrgMembers 
    ? Object.values(activeOrgMembers).filter((m: any) => m.status !== 'disabled').length 
    : 0;
  const pendingInvitesCount = invites.filter(inv => inv.status === 'pending').length;

  const bgColor = isDarkMode ? 'bg-slate-900' : 'bg-gray-50';
  const cardBg = isDarkMode ? 'bg-slate-800' : 'bg-white';
  const textColor = isDarkMode ? 'text-white' : 'text-gray-900';
  const textMuted = isDarkMode ? 'text-gray-400' : 'text-gray-600';
  const borderColor = isDarkMode ? 'border-slate-700' : 'border-gray-200';

  return (
    <div className={`min-h-screen ${bgColor} p-6`}>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {/* Left: Section Label (Pill) + Divider + Title + Subtitle */}
            <div className="flex items-center gap-3">
              {/* Section Label Pill - "Team" */}
              <motion.div
                className="group relative flex items-center gap-2.5 px-5 py-2.5 rounded-2xl transition-all duration-300"
                style={{
                  background: isDarkMode
                    ? `linear-gradient(135deg, ${hexToRgba(teamTheme.gradientFrom, 0.12)}, ${hexToRgba(teamTheme.gradientTo, 0.08)})`
                    : `linear-gradient(135deg, ${hexToRgba(teamTheme.gradientFrom, 0.08)}, ${hexToRgba(teamTheme.gradientTo, 0.06)})`,
                  borderWidth: '1px',
                  borderStyle: 'solid',
                  borderColor: isDarkMode
                    ? hexToRgba(teamTheme.accent, 0.25)
                    : hexToRgba(teamTheme.accent, 0.2),
                  boxShadow: isDarkMode
                    ? `0 0 18px ${hexToRgba(teamTheme.glow, 0.15)}, inset 0 1px 0 rgba(255, 255, 255, 0.08)`
                    : `0 0 12px ${hexToRgba(teamTheme.glow, 0.08)}, inset 0 1px 0 rgba(255, 255, 255, 0.4)`,
                }}
                whileHover={{
                  boxShadow: isDarkMode
                    ? `0 0 24px ${hexToRgba(teamTheme.glow, 0.22)}, inset 0 1px 0 rgba(255, 255, 255, 0.12)`
                    : `0 0 18px ${hexToRgba(teamTheme.glow, 0.12)}, inset 0 1px 0 rgba(255, 255, 255, 0.6)`,
                }}
              >
                {/* Icon with subtle pulse */}
                <div className="relative">
                  <Users
                    className="w-4 h-4"
                    style={{
                      color: isDarkMode ? teamTheme.glow : teamTheme.accent,
                    }}
                  />
                  <div
                    className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full animate-pulse"
                    style={{
                      backgroundColor: teamTheme.glow,
                    }}
                  />
                </div>
                <span
                  className="text-sm font-bold tracking-wide"
                  style={{
                    color: isDarkMode ? teamTheme.glow : teamTheme.accent,
                  }}
                >
                  Team
                </span>
              </motion.div>

              {/* Subtle breadcrumb-style divider */}
              <span
                className="text-sm font-medium"
                style={{
                  color: isDarkMode
                    ? hexToRgba('#FFFFFF', 0.2)
                    : hexToRgba('#000000', 0.15),
                }}
              >
                /
              </span>

              {/* Title + Subtitle */}
              <div>
                <h1 
                  className={`text-3xl ${textColor}`} 
                  style={{ fontFamily: '"Corpline", sans-serif' }}
                >
                  Team Overview
                </h1>
                <p className={textMuted}>
                  {activeMembersCount} active members • {pendingInvitesCount} pending invites • {activeOrgMeta?.name}
                </p>
              </div>
            </div>
            
            {canInvite && (
              <button
                onClick={() => {
                  setShowInviteModal(true);
                  setInviteEmail('');
                  setInviteRole('staff');
                  setInviteLink('');
                }}
                className={`flex items-center gap-2 px-4 py-2 ${isDarkMode ? 'bg-red-600 hover:bg-red-700' : 'bg-red-600 hover:bg-red-700'} text-white transition-colors`}
              >
                <UserPlus size={18} />
                Invite Member
              </button>
            )}
          </div>
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
            <div className={`${cardBg} border ${borderColor} p-6`}>
              <div className="flex items-center gap-2 mb-4">
                <Users className={textMuted} size={20} />
                <h2 className={`text-xl ${textColor}`} style={{ fontFamily: '"Corpline", sans-serif' }}>
                  Active Members
                </h2>
              </div>

              <div className="space-y-3">
                {activeOrgMembers && Object.entries(activeOrgMembers).map(([userId, member]: [string, any]) => {
                  if (member.status === 'disabled') return null;
                  
                  const profile = memberProfiles[userId];
                  const isCurrentUser = userId === currentUser?.id;
                  
                  return (
                    <div key={userId} className={`p-4 border ${borderColor} flex items-center justify-between`}>
                      <div className="flex-1">
                        <div className={`font-medium ${textColor}`}>
                          {profile?.fullName || profile?.email || 'Unknown User'}
                          {isCurrentUser && <span className="text-xs ml-2 text-blue-500">(You)</span>}
                        </div>
                        <div className={`text-sm ${textMuted}`}>{profile?.email}</div>
                        <div className="flex items-center gap-2 mt-1">
                          <Shield size={14} className={textMuted} />
                          <span className={`text-xs ${textMuted}`}>{member.role}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {canEditRole && !isCurrentUser && member.role !== 'owner' && (
                          <select
                            value={member.role}
                            onChange={(e) => handleChangeRole(userId, e.target.value)}
                            className={`px-2 py-1 text-sm border ${borderColor} ${isDarkMode ? 'bg-slate-900 text-white' : 'bg-white text-gray-900'}`}
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
                            className="p-1 text-red-500 hover:text-red-700"
                            title="Disable member"
                          >
                            <XCircle size={18} />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Invites List */}
            <div className={`${cardBg} border ${borderColor} p-6`}>
              <div className="flex items-center gap-2 mb-4">
                <Mail className={textMuted} size={20} />
                <h2 className={`text-xl ${textColor}`} style={{ fontFamily: '"Corpline", sans-serif' }}>
                  Pending Invites
                </h2>
              </div>

              {invites.filter(inv => inv.status === 'pending').length === 0 ? (
                <p className={`text-center py-8 ${textMuted}`}>No pending invites</p>
              ) : (
                <div className="space-y-3">
                  {invites.filter(inv => inv.status === 'pending').map(invite => (
                    <div key={invite.inviteId} className={`p-4 border ${borderColor}`}>
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
                            className="p-1 text-red-500 hover:text-red-700"
                            title="Revoke invite"
                          >
                            <XCircle size={18} />
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
      </div>

      {/* Invite Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className={`w-full max-w-md ${cardBg} border ${borderColor} p-6`}>
            <h2 className={`text-xl mb-4 ${textColor}`} style={{ fontFamily: '"Corpline", sans-serif' }}>
              Invite Team Member
            </h2>

            {inviteLink ? (
              <div>
                <div className={`p-4 border ${borderColor} mb-4 ${isDarkMode ? 'bg-slate-900' : 'bg-gray-50'}`}>
                  <p className={`text-sm mb-2 ${textMuted}`}>Invite created! Share this link:</p>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={inviteLink}
                      readOnly
                      className={`flex-1 px-3 py-2 text-sm border ${borderColor} ${isDarkMode ? 'bg-slate-800 text-white' : 'bg-white text-gray-900'}`}
                    />
                    <button
                      onClick={copyInviteLink}
                      className={`p-2 ${isDarkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-600 hover:bg-blue-700'} text-white`}
                      title="Copy link"
                    >
                      <Copy size={18} />
                    </button>
                  </div>
                </div>

                <button
                  onClick={() => setShowInviteModal(false)}
                  className={`w-full py-2 ${isDarkMode ? 'bg-slate-700 hover:bg-slate-600' : 'bg-gray-200 hover:bg-gray-300'} ${textColor} transition-colors`}
                >
                  Close
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className={`block text-sm mb-2 ${textColor}`}>Email</label>
                  <input
                    type="email"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    placeholder="colleague@example.com"
                    className={`w-full px-3 py-2 border ${borderColor} ${isDarkMode ? 'bg-slate-900 text-white' : 'bg-white text-gray-900'}`}
                    autoFocus
                  />
                </div>

                <div>
                  <label className={`block text-sm mb-2 ${textColor}`}>Role</label>
                  <select
                    value={inviteRole}
                    onChange={(e) => setInviteRole(e.target.value)}
                    className={`w-full px-3 py-2 border ${borderColor} ${isDarkMode ? 'bg-slate-900 text-white' : 'bg-white text-gray-900'}`}
                  >
                    <option value="staff">Staff</option>
                    <option value="manager">Manager</option>
                    <option value="admin">Admin</option>
                    <option value="client_viewer">Client Viewer</option>
                  </select>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={handleCreateInvite}
                    disabled={isCreatingInvite || !inviteEmail.trim()}
                    className={`flex-1 py-2 ${isDarkMode ? 'bg-red-600 hover:bg-red-700 disabled:bg-slate-700' : 'bg-red-600 hover:bg-red-700 disabled:bg-gray-300'} text-white transition-colors disabled:cursor-not-allowed`}
                  >
                    {isCreatingInvite ? 'Creating...' : 'Create Invite'}
                  </button>

                  <button
                    onClick={() => setShowInviteModal(false)}
                    className={`px-4 py-2 ${isDarkMode ? 'bg-slate-700 hover:bg-slate-600' : 'bg-gray-200 hover:bg-gray-300'} ${textColor} transition-colors`}
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