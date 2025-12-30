import React, { useState } from 'react';
import { Button } from '../ui/Button';
import pythiaStarLogo from 'figma:asset/e9e0c1ac0931dcb43912f4570079500e566ef87a.png';
import { AlertCircle, Check, X, Loader2 } from 'lucide-react';
import { mockInvites, mockRoles, mockOrganization } from '../../data/authData';

interface InviteAcceptPageProps {
  token: string;
  onAcceptSuccess: () => void;
}

export const InviteAcceptPage: React.FC<InviteAcceptPageProps> = ({ token, onAcceptSuccess }) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Find the invite
  const invite = mockInvites.find(inv => inv.token === token);
  const role = invite ? mockRoles.find(r => r.id === invite.roleId) : null;

  // Password validation
  const passwordMinLength = 12;
  const passwordHasLength = password.length >= passwordMinLength;
  const passwordHasUppercase = /[A-Z]/.test(password);
  const passwordHasLowercase = /[a-z]/.test(password);
  const passwordHasNumber = /[0-9]/.test(password);
  const passwordsMatch = password === confirmPassword && password.length > 0;
  const passwordValid = passwordHasLength && passwordHasUppercase && passwordHasLowercase && passwordHasNumber;

  const getStrengthColor = () => {
    if (!password) return 'bg-gray-200';
    if (passwordValid) return 'bg-green-500';
    if (passwordHasLength) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getStrengthLabel = () => {
    if (!password) return '';
    if (passwordValid) return 'Strong';
    if (passwordHasLength) return 'Medium';
    return 'Weak';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!passwordValid) {
      setError('Password does not meet requirements');
      return;
    }

    if (!passwordsMatch) {
      setError('Passwords do not match');
      return;
    }

    if (!acceptTerms) {
      setError('You must accept the Terms and Privacy Policy');
      return;
    }

    setLoading(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    setLoading(false);
    setSuccess(true);

    // Auto-redirect after 2 seconds
    setTimeout(() => {
      onAcceptSuccess();
    }, 2000);
  };

  if (!invite) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-8">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 border border-gray-200 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <X className="text-red-600" size={32} />
          </div>
          <h2 className="text-gray-900 mb-2">Invalid Invite</h2>
          <p className="text-sm text-gray-600 mb-6">
            This invitation link is invalid or has expired. Please contact your administrator for a new invitation.
          </p>
          <Button
            onClick={onAcceptSuccess}
            className="w-full bg-red-900 hover:bg-red-800 text-white py-2.5 rounded-md font-medium transition-colors"
          >
            Back to sign in
          </Button>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-8">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 border border-gray-200 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="text-green-600" size={32} />
          </div>
          <h2 className="text-gray-900 mb-2">Account Created!</h2>
          <p className="text-sm text-gray-600 mb-6">
            Your Pythia account has been successfully created. Redirecting to sign in...
          </p>
          <div className="flex justify-center">
            <Loader2 className="w-6 h-6 text-red-900 animate-spin" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-8">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex items-center gap-3 mb-8 justify-center">
          <img 
            src={pythiaStarLogo} 
            alt="Pythia" 
            className="h-12 w-12"
            style={{ filter: 'brightness(0) saturate(100%) invert(22%) sepia(89%) saturate(2789%) hue-rotate(346deg) brightness(89%) contrast(96%)' }}
          />
          <h1 
            className="text-red-900 uppercase tracking-wide"
            style={{ 
              fontSize: '24px',
              fontFamily: '"Corpline", -apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
              letterSpacing: '0.1em',
              fontWeight: 700
            }}
          >
            Pythia
          </h1>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8 border border-gray-200">
          <div className="mb-6 text-center">
            <h2 className="text-gray-900 mb-2">You're joining {mockOrganization.name}</h2>
            <p className="text-sm text-gray-600">Complete your account setup to get started</p>
          </div>

          {/* Invite Details */}
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-md">
            <div className="text-sm">
              <div className="flex justify-between mb-1">
                <span className="text-gray-600">Email:</span>
                <span className="font-medium text-gray-900">{invite.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Role:</span>
                <span className="font-medium text-gray-900">{role?.name}</span>
              </div>
            </div>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                  First Name
                </label>
                <input
                  id="firstName"
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                  Last Name
                </label>
                <input
                  id="lastName"
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                required
              />
              {password && (
                <div className="mt-2">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                      <div className={`h-full transition-all ${getStrengthColor()}`} style={{ width: passwordValid ? '100%' : passwordHasLength ? '66%' : '33%' }} />
                    </div>
                    <span className="text-xs font-medium text-gray-600">{getStrengthLabel()}</span>
                  </div>
                </div>
              )}
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                required
              />
              {confirmPassword && (
                <div className="mt-1 flex items-center gap-1">
                  {passwordsMatch ? (
                    <>
                      <Check size={14} className="text-green-600" />
                      <span className="text-xs text-green-600">Passwords match</span>
                    </>
                  ) : (
                    <>
                      <X size={14} className="text-red-600" />
                      <span className="text-xs text-red-600">Passwords do not match</span>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Password Requirements */}
            <div className="p-3 bg-gray-50 rounded-md border border-gray-200">
              <p className="text-xs font-medium text-gray-700 mb-2">Password requirements:</p>
              <div className="space-y-1">
                {[
                  { label: `At least ${passwordMinLength} characters`, met: passwordHasLength },
                  { label: 'One uppercase letter', met: passwordHasUppercase },
                  { label: 'One lowercase letter', met: passwordHasLowercase },
                  { label: 'One number', met: passwordHasNumber },
                ].map((req, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-xs">
                    {password ? (
                      req.met ? (
                        <Check size={12} className="text-green-600" />
                      ) : (
                        <X size={12} className="text-gray-400" />
                      )
                    ) : (
                      <div className="w-3 h-3 rounded-full border border-gray-300" />
                    )}
                    <span className={password && req.met ? 'text-green-700' : 'text-gray-600'}>{req.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Terms Checkbox */}
            <div className="flex items-start gap-2">
              <input
                id="terms"
                type="checkbox"
                checked={acceptTerms}
                onChange={(e) => setAcceptTerms(e.target.checked)}
                className="mt-1 w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
              />
              <label htmlFor="terms" className="text-xs text-gray-600">
                I accept the <button type="button" className="text-red-700 hover:text-red-800 font-medium">Terms of Service</button> and <button type="button" className="text-red-700 hover:text-red-800 font-medium">Privacy Policy</button>
              </label>
            </div>

            <Button
              type="submit"
              disabled={loading || !passwordValid || !passwordsMatch || !acceptTerms}
              className="w-full bg-red-900 hover:bg-red-800 text-white py-2.5 rounded-md font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Creating account...
                </>
              ) : (
                'Create account'
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};
