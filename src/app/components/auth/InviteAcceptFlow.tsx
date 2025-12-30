import React, { useState, useEffect } from 'react';
import { Mail, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { api } from '../../../utils/api';
import { auditLogWrite } from '../../utils/kvAccess';

interface InviteAcceptFlowProps {
  token: string;
  isDarkMode: boolean;
  onAccepted: () => void;
}

export function InviteAcceptFlow({ token, isDarkMode, onAccepted }: InviteAcceptFlowProps) {
  const { currentUser, isAuthenticated } = useAuth();
  const [invite, setInvite] = useState<any>(null);
  const [orgMeta, setOrgMeta] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAccepting, setIsAccepting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    loadInvite();
  }, [token]);

  async function loadInvite() {
    try {
      setIsLoading(true);
      const inviteData = await api.getInviteByToken(token);
      setInvite(inviteData);

      const meta = await api.getOrgMeta(inviteData.orgId);
      setOrgMeta(meta);
    } catch (err) {
      setError('Invite not found or expired');
    } finally {
      setIsLoading(false);
    }
  }

  async function handleAccept() {
    if (!currentUser || !invite) return;

    // Validate email match (recommended)
    if (invite.email.toLowerCase() !== currentUser.email.toLowerCase()) {
      setError(`This invite is for ${invite.email}. Please sign in with that email.`);
      return;
    }

    // Check expiry
    if (new Date(invite.expiresAt) < new Date()) {
      setError('This invite has expired');
      return;
    }

    // Check status
    if (invite.status !== 'pending') {
      setError('This invite has already been used or revoked');
      return;
    }

    setIsAccepting(true);
    setError(null);

    try {
      await api.acceptInvite(invite.inviteId, invite.orgId, currentUser.id, currentUser.email);

      // Audit log
      await auditLogWrite(
        invite.orgId,
        currentUser.id,
        currentUser.email,
        'ORG_INVITE_ACCEPT',
        'invite',
        `Accepted invite to join organization`,
        invite.inviteId
      );

      setSuccess(true);
      setTimeout(() => {
        onAccepted();
      }, 2000);
    } catch (err) {
      setError('Failed to accept invite');
    } finally {
      setIsAccepting(false);
    }
  }

  const cardBg = isDarkMode ? 'bg-slate-800' : 'bg-white';
  const textColor = isDarkMode ? 'text-white' : 'text-gray-900';
  const textMuted = isDarkMode ? 'text-gray-400' : 'text-gray-600';
  const borderColor = isDarkMode ? 'border-slate-700' : 'border-gray-200';

  if (!isAuthenticated) {
    return (
      <div className={`${cardBg} border ${borderColor} p-8 text-center`}>
        <Mail className={`w-16 h-16 mx-auto mb-4 ${textMuted}`} />
        <h2 className={`text-xl mb-2 ${textColor}`}>Please Sign In</h2>
        <p className={textMuted}>You must be signed in to accept this invite</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className={`${cardBg} border ${borderColor} p-8 text-center`}>
        <Loader2 className={`w-12 h-12 animate-spin mx-auto mb-4 ${textMuted}`} />
        <p className={textMuted}>Loading invite...</p>
      </div>
    );
  }

  if (success) {
    return (
      <div className={`${cardBg} border ${borderColor} p-8 text-center`}>
        <CheckCircle className={`w-16 h-16 mx-auto mb-4 ${isDarkMode ? 'text-green-400' : 'text-green-600'}`} />
        <h2 className={`text-xl mb-2 ${textColor}`}>Welcome Aboard!</h2>
        <p className={textMuted}>Redirecting you to {orgMeta?.name}...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`${cardBg} border ${borderColor} p-8 text-center`}>
        <XCircle className={`w-16 h-16 mx-auto mb-4 ${isDarkMode ? 'text-red-400' : 'text-red-600'}`} />
        <h2 className={`text-xl mb-2 ${textColor}`}>Cannot Accept Invite</h2>
        <p className={textMuted}>{error}</p>
      </div>
    );
  }

  return (
    <div className={`${cardBg} border ${borderColor} p-8`}>
      <div className="text-center mb-6">
        <Mail className={`w-16 h-16 mx-auto mb-4 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
        <h2 className={`text-2xl mb-2 ${textColor}`}>You're Invited!</h2>
        <p className={textMuted}>
          Join <span className={`font-semibold ${textColor}`}>{orgMeta?.name}</span>
        </p>
      </div>

      <div className={`p-4 border ${borderColor} mb-6 ${isDarkMode ? 'bg-slate-900' : 'bg-gray-50'}`}>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className={textMuted}>Your email:</span>
            <div className={textColor}>{currentUser.email}</div>
          </div>
          <div>
            <span className={textMuted}>Role:</span>
            <div className={textColor}>{invite.role}</div>
          </div>
        </div>
      </div>

      <button
        onClick={handleAccept}
        disabled={isAccepting}
        className={`w-full py-3 ${isDarkMode ? 'bg-red-600 hover:bg-red-700 disabled:bg-slate-700' : 'bg-red-600 hover:bg-red-700 disabled:bg-gray-300'} text-white transition-colors disabled:cursor-not-allowed flex items-center justify-center gap-2`}
      >
        {isAccepting ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Accepting...
          </>
        ) : (
          'Accept Invitation'
        )}
      </button>
    </div>
  );
}
