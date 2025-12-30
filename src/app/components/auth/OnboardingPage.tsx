import React, { useState } from 'react';
import { Building2, Loader2, AlertCircle } from 'lucide-react';
import { api } from '../../../utils/api';

interface OnboardingPageProps {
  userId: string;
  userEmail: string;
  isDarkMode: boolean;
  onComplete: () => void;
}

export const OnboardingPage: React.FC<OnboardingPageProps> = ({
  userId,
  userEmail,
  isDarkMode,
  onComplete,
}) => {
  const [orgName, setOrgName] = useState('');
  const [slug, setSlug] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Auto-generate slug from org name
  const handleOrgNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    setOrgName(name);
    
    // Auto-generate slug if user hasn't manually entered one
    if (!slug || slug === generateSlug(orgName)) {
      setSlug(generateSlug(name));
    }
  };

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '');
  };

  const generateOrgId = () => {
    const randomStr = Math.random().toString(36).substring(2, 12);
    return `org_${randomStr}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!orgName.trim()) {
      setError('Organization name is required');
      return;
    }

    setIsCreating(true);
    setError(null);

    try {
      const orgId = generateOrgId();
      const finalSlug = slug || generateSlug(orgName);

      console.log('Creating organization:', { orgId, name: orgName, slug: finalSlug });

      await api.createOrg({
        orgId,
        name: orgName.trim(),
        slug: finalSlug,
        userId,
        userEmail,
      });

      console.log('✅ Organization created successfully');

      // Save activeOrgId to localStorage
      localStorage.setItem('revere-active-org-id', orgId);

      // Call onComplete to trigger re-bootstrap
      onComplete();
    } catch (err) {
      console.error('❌ Error creating organization:', err);
      setError(err instanceof Error ? err.message : 'Failed to create organization');
      setIsCreating(false);
    }
  };

  const bgColor = isDarkMode ? 'bg-slate-900' : 'bg-gray-50';
  const cardBg = isDarkMode ? 'bg-slate-800' : 'bg-white';
  const textColor = isDarkMode ? 'text-white' : 'text-gray-900';
  const textMuted = isDarkMode ? 'text-gray-400' : 'text-gray-600';
  const borderColor = isDarkMode ? 'border-slate-700' : 'border-gray-200';
  const inputBg = isDarkMode ? 'bg-slate-900' : 'bg-gray-50';
  const inputBorder = isDarkMode ? 'border-slate-600' : 'border-gray-300';
  const inputFocus = isDarkMode 
    ? 'focus:border-red-500 focus:ring-red-500/20' 
    : 'focus:border-red-500 focus:ring-red-500/20';

  return (
    <div className={`min-h-screen ${bgColor} flex items-center justify-center p-4`}>
      <div className={`w-full max-w-md ${cardBg} border ${borderColor} p-8`}>
        {/* Header */}
        <div className="text-center mb-8">
          <div className={`inline-flex items-center justify-center w-16 h-16 ${isDarkMode ? 'bg-red-900/20' : 'bg-red-50'} mb-4`}>
            <Building2 className={`w-8 h-8 ${isDarkMode ? 'text-red-400' : 'text-red-600'}`} />
          </div>
          <h1 className={`text-2xl mb-2 ${textColor}`}>Welcome to Revere</h1>
          <p className={textMuted}>
            Let's get started by creating your organization
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className={`mb-6 p-4 ${isDarkMode ? 'bg-red-900/20 border-red-800' : 'bg-red-50 border-red-200'} border flex items-start gap-3`}>
            <AlertCircle className={`w-5 h-5 flex-shrink-0 mt-0.5 ${isDarkMode ? 'text-red-400' : 'text-red-600'}`} />
            <p className={`text-sm ${isDarkMode ? 'text-red-300' : 'text-red-700'}`}>{error}</p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Organization Name */}
          <div>
            <label htmlFor="orgName" className={`block text-sm mb-2 ${textColor}`}>
              Organization Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="orgName"
              value={orgName}
              onChange={handleOrgNameChange}
              disabled={isCreating}
              placeholder="e.g., Echo Canyon Consulting"
              className={`w-full px-4 py-2.5 ${inputBg} border ${inputBorder} ${textColor} placeholder-gray-400 transition-all ${inputFocus} focus:outline-none focus:ring-2 disabled:opacity-50 disabled:cursor-not-allowed`}
              autoFocus
            />
          </div>

          {/* Slug (optional) */}
          <div>
            <label htmlFor="slug" className={`block text-sm mb-2 ${textColor}`}>
              URL Slug <span className={`text-xs ${textMuted}`}>(optional)</span>
            </label>
            <input
              type="text"
              id="slug"
              value={slug}
              onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
              disabled={isCreating}
              placeholder="e.g., echo-canyon-consulting"
              className={`w-full px-4 py-2.5 ${inputBg} border ${inputBorder} ${textColor} placeholder-gray-400 transition-all ${inputFocus} focus:outline-none focus:ring-2 disabled:opacity-50 disabled:cursor-not-allowed`}
            />
            <p className={`text-xs mt-1.5 ${textMuted}`}>
              This will be used in URLs and must be unique
            </p>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isCreating || !orgName.trim()}
            className={`w-full py-3 px-4 ${
              isDarkMode
                ? 'bg-red-600 hover:bg-red-700 disabled:bg-slate-700'
                : 'bg-red-600 hover:bg-red-700 disabled:bg-gray-300'
            } text-white transition-colors disabled:cursor-not-allowed flex items-center justify-center gap-2`}
          >
            {isCreating ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Creating Organization...
              </>
            ) : (
              <>
                <Building2 className="w-5 h-5" />
                Create Organization
              </>
            )}
          </button>
        </form>

        {/* Footer Note */}
        <p className={`text-xs text-center mt-6 ${textMuted}`}>
          You can invite team members and configure settings after setup
        </p>
      </div>
    </div>
  );
};
