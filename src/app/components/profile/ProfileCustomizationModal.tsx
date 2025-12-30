import React, { useState, useRef, useEffect } from 'react';
import { X, Upload, Camera, Trash2, Move, Check, Loader2, Lock, Shield } from 'lucide-react';
import { Button } from '../ui/Button';
import { AvatarCropModal } from './AvatarCropModal';
import { useAuth } from '../../contexts/AuthContext';

interface ProfileCustomizationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProfileUpdate: (updates: ProfileUpdates) => void;
}

export interface ProfileUpdates {
  firstName?: string;
  lastName?: string;
  displayName?: string;
  birthday?: string;
  pronunciation?: string;
  timezone?: string;
  phone?: string;
  avatarUrl?: string;
  coverUrl?: string;
  preferences?: {
    defaultLanding?: string;
    dateFormat?: string;
    weekStart?: string;
    compactMode?: boolean;
  };
}

interface UserProfile {
  userId: string;
  firstName: string;
  lastName: string;
  displayName: string;
  birthday: string;
  pronunciation: string;
  timezone: string;
  phone: string;
  avatarUrl: string;
  coverUrl: string;
  preferences: {
    defaultLanding: string;
    dateFormat: string;
    weekStart: string;
    compactMode: boolean;
  };
}

export const ProfileCustomizationModal: React.FC<ProfileCustomizationModalProps> = ({
  isOpen,
  onClose,
  onProfileUpdate,
}) => {
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [showCropModal, setShowCropModal] = useState(false);
  const [imageToCrop, setImageToCrop] = useState<string | null>(null);
  const [cropType, setCropType] = useState<'avatar' | 'cover'>('avatar');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const modalRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);
  const avatarInputRef = useRef<HTMLInputElement>(null);

  // Load profile from localStorage or use defaults
  const getStoredProfile = (): UserProfile => {
    const stored = localStorage.getItem('pythia_user_profile');
    if (stored) {
      return JSON.parse(stored);
    }
    
    // Default profile from currentUser
    return {
      userId: currentUser?.id || '',
      firstName: currentUser?.firstName || '',
      lastName: currentUser?.lastName || '',
      displayName: '',
      birthday: '',
      pronunciation: '',
      timezone: 'America/Phoenix',
      phone: '',
      avatarUrl: currentUser?.avatarUrl || '',
      coverUrl: '',
      preferences: {
        defaultLanding: 'war-room',
        dateFormat: 'MM/DD/YYYY',
        weekStart: 'Sunday',
        compactMode: false,
      },
    };
  };

  const [profile, setProfile] = useState<UserProfile>(getStoredProfile());
  const [originalProfile, setOriginalProfile] = useState<UserProfile>(getStoredProfile());

  // Check for changes
  useEffect(() => {
    const changed = JSON.stringify(profile) !== JSON.stringify(originalProfile);
    setHasChanges(changed);
  }, [profile, originalProfile]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen && !showCropModal) {
        handleClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, showCropModal]);

  // Handle outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (overlayRef.current && e.target === overlayRef.current) {
        handleClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
    }
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [isOpen]);

  const handleClose = () => {
    if (hasChanges) {
      if (!window.confirm('You have unsaved changes. Are you sure you want to close?')) {
        return;
      }
    }
    onClose();
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!profile.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }
    if (!profile.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }
    if (profile.displayName && profile.displayName.length > 50) {
      newErrors.displayName = 'Display name must be 50 characters or less';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      showToastMessage('Please fix the errors before saving');
      return;
    }

    setLoading(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800));

    // Save to localStorage
    localStorage.setItem('pythia_user_profile', JSON.stringify(profile));

    // Update original to mark as saved
    setOriginalProfile(profile);
    setLastSaved(new Date());

    // Call parent update handler
    const updates: ProfileUpdates = {
      firstName: profile.firstName,
      lastName: profile.lastName,
      displayName: profile.displayName,
      birthday: profile.birthday,
      pronunciation: profile.pronunciation,
      timezone: profile.timezone,
      phone: profile.phone,
      avatarUrl: profile.avatarUrl,
      coverUrl: profile.coverUrl,
      preferences: profile.preferences,
    };
    onProfileUpdate(updates);

    setLoading(false);
    showToastMessage('Profile updated successfully');
  };

  const showToastMessage = (message: string) => {
    setToastMessage(message);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleFileUpload = (type: 'avatar' | 'cover', file: File) => {
    // Validate file
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (!validTypes.includes(file.type)) {
      setErrors({ ...errors, [type]: 'Please upload a JPG or PNG file' });
      return;
    }

    if (file.size > maxSize) {
      setErrors({ ...errors, [type]: 'File size must be less than 5MB' });
      return;
    }

    // Clear error
    const newErrors = { ...errors };
    delete newErrors[type];
    setErrors(newErrors);

    // Read file as data URL
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      
      // Open crop modal for avatar
      if (type === 'avatar') {
        setImageToCrop(dataUrl);
        setCropType('avatar');
        setShowCropModal(true);
      } else {
        // For cover, just set it directly
        setProfile({ ...profile, coverUrl: dataUrl });
      }
    };
    reader.readAsDataURL(file);
  };

  const handleCoverUpload = () => {
    coverInputRef.current?.click();
  };

  const handleAvatarUpload = () => {
    avatarInputRef.current?.click();
  };

  const handleRemoveCover = () => {
    setProfile({ ...profile, coverUrl: '' });
  };

  const handleRemoveAvatar = () => {
    setProfile({ ...profile, avatarUrl: '' });
  };

  const handleCropComplete = (croppedImageUrl: string) => {
    if (cropType === 'avatar') {
      setProfile({ ...profile, avatarUrl: croppedImageUrl });
    }
    setShowCropModal(false);
    setImageToCrop(null);
  };

  const getInitials = () => {
    const first = profile.firstName.charAt(0).toUpperCase();
    const last = profile.lastName.charAt(0).toUpperCase();
    return `${first}${last}`;
  };

  const getAvatarColor = () => {
    // Generate consistent color from name
    const str = `${profile.firstName}${profile.lastName}`;
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    const colors = ['#ef4444', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6', '#ec4899'];
    return colors[Math.abs(hash) % colors.length];
  };

  if (!isOpen) return null;

  return (
    <>
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px) scale(0.98);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes toastIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .modal-overlay {
          animation: fadeIn 200ms ease-out;
        }

        .modal-card {
          animation: slideUp 350ms cubic-bezier(0.22, 1, 0.36, 1);
        }

        .toast-notification {
          animation: toastIn 250ms cubic-bezier(0.22, 1, 0.36, 1);
        }
      `}</style>

      {/* Modal Overlay */}
      <div
        ref={overlayRef}
        className="modal-overlay"
        style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.4)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1rem',
          zIndex: 1000001,
          overflowY: 'auto',
        }}
      >
        {/* Modal Card */}
        <div
          ref={modalRef}
          className="modal-card"
          style={{
            backgroundColor: 'white',
            borderRadius: '16px',
            boxShadow: '0 24px 48px -12px rgba(0, 0, 0, 0.25)',
            width: '100%',
            maxWidth: '840px',
            maxHeight: '90vh',
            display: 'flex',
            flexDirection: 'column',
            position: 'relative',
          }}
        >
          {/* Header */}
          <div style={{ 
            padding: '1.75rem 2rem', 
            borderBottom: '1px solid #e5e7eb',
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
          }}>
            <div>
              <h2 style={{ fontSize: '24px', fontWeight: 700, color: '#111827', marginBottom: '0.375rem' }}>
                Profile & Preferences
              </h2>
              <p style={{ fontSize: '14px', color: '#6b7280', margin: 0 }}>
                Update how your account appears across Pythia
              </p>
            </div>
            <button
              onClick={handleClose}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '0.5rem',
                color: '#6b7280',
                borderRadius: '0.375rem',
              }}
              aria-label="Close"
            >
              <X size={20} />
            </button>
          </div>

          {/* Body - Two Column Layout */}
          <div style={{ 
            flex: 1, 
            overflowY: 'auto',
            display: 'grid',
            gridTemplateColumns: '280px 1fr',
            gap: '2rem',
            padding: '2rem',
          }}>
            {/* Left Column: Visual Identity */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {/* Cover Photo */}
              <div>
                <label style={{ 
                  display: 'block', 
                  fontSize: '13px', 
                  fontWeight: 600, 
                  color: '#374151', 
                  marginBottom: '0.75rem' 
                }}>
                  Cover Photo
                </label>
                
                {/* Cover Preview */}
                <div
                  style={{
                    width: '100%',
                    height: '140px',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    position: 'relative',
                    backgroundColor: profile.coverUrl ? 'transparent' : '#f3f4f6',
                    backgroundImage: profile.coverUrl ? `url(${profile.coverUrl})` : 
                      'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    border: '2px dashed #d1d5db',
                  }}
                >
                  {/* Overlay Controls */}
                  <div style={{
                    position: 'absolute',
                    inset: 0,
                    backgroundColor: 'rgba(0, 0, 0, 0.4)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    opacity: 0,
                    transition: 'opacity 200ms',
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
                  onMouseLeave={(e) => e.currentTarget.style.opacity = '0'}
                  >
                    <button
                      onClick={handleCoverUpload}
                      style={{
                        padding: '0.5rem',
                        backgroundColor: 'white',
                        border: 'none',
                        borderRadius: '0.375rem',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.375rem',
                        fontSize: '12px',
                        fontWeight: 600,
                        color: '#374151',
                      }}
                      title="Upload cover"
                    >
                      <Upload size={14} />
                      Upload
                    </button>
                    {profile.coverUrl && (
                      <button
                        onClick={handleRemoveCover}
                        style={{
                          padding: '0.5rem',
                          backgroundColor: 'white',
                          border: 'none',
                          borderRadius: '0.375rem',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.375rem',
                          fontSize: '12px',
                          fontWeight: 600,
                          color: '#dc2626',
                        }}
                        title="Remove cover"
                      >
                        <Trash2 size={14} />
                        Remove
                      </button>
                    )}
                  </div>
                </div>

                {/* Helper Text */}
                <p style={{ fontSize: '11px', color: '#6b7280', marginTop: '0.5rem', margin: '0.5rem 0 0 0' }}>
                  Recommended: 1600×400px. JPG/PNG. Max 5MB.
                </p>
                {errors.cover && (
                  <p style={{ fontSize: '12px', color: '#dc2626', marginTop: '0.375rem', margin: '0.375rem 0 0 0' }}>
                    {errors.cover}
                  </p>
                )}

                {/* Hidden File Input */}
                <input
                  ref={coverInputRef}
                  type="file"
                  accept="image/jpeg,image/jpg,image/png"
                  style={{ display: 'none' }}
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleFileUpload('cover', file);
                  }}
                />
              </div>

              {/* Avatar */}
              <div>
                <label style={{ 
                  display: 'block', 
                  fontSize: '13px', 
                  fontWeight: 600, 
                  color: '#374151', 
                  marginBottom: '0.75rem' 
                }}>
                  Profile Picture
                </label>

                {/* Avatar Preview */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div
                    style={{
                      width: '96px',
                      height: '96px',
                      borderRadius: '50%',
                      overflow: 'hidden',
                      backgroundColor: profile.avatarUrl ? 'transparent' : getAvatarColor(),
                      backgroundImage: profile.avatarUrl ? `url(${profile.avatarUrl})` : 'none',
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '32px',
                      fontWeight: 700,
                      color: 'white',
                      border: '3px solid white',
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                    }}
                  >
                    {!profile.avatarUrl && getInitials()}
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <button
                      onClick={handleAvatarUpload}
                      style={{
                        padding: '0.5rem 0.875rem',
                        backgroundColor: '#f3f4f6',
                        border: '1px solid #d1d5db',
                        borderRadius: '0.375rem',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        fontSize: '13px',
                        fontWeight: 600,
                        color: '#374151',
                      }}
                    >
                      <Camera size={14} />
                      Upload
                    </button>
                    {profile.avatarUrl && (
                      <button
                        onClick={handleRemoveAvatar}
                        style={{
                          padding: '0.5rem 0.875rem',
                          backgroundColor: 'transparent',
                          border: '1px solid #fecaca',
                          borderRadius: '0.375rem',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                          fontSize: '13px',
                          fontWeight: 600,
                          color: '#dc2626',
                        }}
                      >
                        <Trash2 size={14} />
                        Remove
                      </button>
                    )}
                  </div>
                </div>

                {errors.avatar && (
                  <p style={{ fontSize: '12px', color: '#dc2626', marginTop: '0.5rem', margin: '0.5rem 0 0 0' }}>
                    {errors.avatar}
                  </p>
                )}

                {/* Hidden File Input */}
                <input
                  ref={avatarInputRef}
                  type="file"
                  accept="image/jpeg,image/jpg,image/png"
                  style={{ display: 'none' }}
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleFileUpload('avatar', file);
                  }}
                />
              </div>
            </div>

            {/* Right Column: Form Fields */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              {/* Section 1: Personal Info */}
              <div>
                <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#111827', marginBottom: '1rem' }}>
                  Personal Information
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {/* First Name */}
                  <div>
                    <label htmlFor="firstName" style={{ 
                      display: 'block', 
                      fontSize: '13px', 
                      fontWeight: 600, 
                      color: '#374151', 
                      marginBottom: '0.375rem' 
                    }}>
                      First Name <span style={{ color: '#dc2626' }}>*</span>
                    </label>
                    <input
                      id="firstName"
                      type="text"
                      value={profile.firstName}
                      onChange={(e) => setProfile({ ...profile, firstName: e.target.value })}
                      style={{ 
                        width: '100%', 
                        padding: '0.625rem 0.75rem', 
                        border: `1.5px solid ${errors.firstName ? '#dc2626' : '#e5e7eb'}`, 
                        borderRadius: '0.5rem',
                        fontSize: '14px',
                      }}
                    />
                    {errors.firstName && (
                      <p style={{ fontSize: '12px', color: '#dc2626', marginTop: '0.25rem', margin: '0.25rem 0 0 0' }}>
                        {errors.firstName}
                      </p>
                    )}
                  </div>

                  {/* Last Name */}
                  <div>
                    <label htmlFor="lastName" style={{ 
                      display: 'block', 
                      fontSize: '13px', 
                      fontWeight: 600, 
                      color: '#374151', 
                      marginBottom: '0.375rem' 
                    }}>
                      Last Name <span style={{ color: '#dc2626' }}>*</span>
                    </label>
                    <input
                      id="lastName"
                      type="text"
                      value={profile.lastName}
                      onChange={(e) => setProfile({ ...profile, lastName: e.target.value })}
                      style={{ 
                        width: '100%', 
                        padding: '0.625rem 0.75rem', 
                        border: `1.5px solid ${errors.lastName ? '#dc2626' : '#e5e7eb'}`, 
                        borderRadius: '0.5rem',
                        fontSize: '14px',
                      }}
                    />
                    {errors.lastName && (
                      <p style={{ fontSize: '12px', color: '#dc2626', marginTop: '0.25rem', margin: '0.25rem 0 0 0' }}>
                        {errors.lastName}
                      </p>
                    )}
                  </div>

                  {/* Display Name */}
                  <div>
                    <label htmlFor="displayName" style={{ 
                      display: 'block', 
                      fontSize: '13px', 
                      fontWeight: 600, 
                      color: '#374151', 
                      marginBottom: '0.375rem' 
                    }}>
                      Display Name <span style={{ fontSize: '12px', fontWeight: 400, color: '#6b7280' }}>(Optional)</span>
                    </label>
                    <input
                      id="displayName"
                      type="text"
                      value={profile.displayName}
                      onChange={(e) => setProfile({ ...profile, displayName: e.target.value })}
                      placeholder="How you want to appear in tasks/records"
                      style={{ 
                        width: '100%', 
                        padding: '0.625rem 0.75rem', 
                        border: `1.5px solid ${errors.displayName ? '#dc2626' : '#e5e7eb'}`, 
                        borderRadius: '0.5rem',
                        fontSize: '14px',
                      }}
                    />
                    {errors.displayName && (
                      <p style={{ fontSize: '12px', color: '#dc2626', marginTop: '0.25rem', margin: '0.25rem 0 0 0' }}>
                        {errors.displayName}
                      </p>
                    )}
                  </div>

                  {/* Birthday */}
                  <div>
                    <label htmlFor="birthday" style={{ 
                      display: 'block', 
                      fontSize: '13px', 
                      fontWeight: 600, 
                      color: '#374151', 
                      marginBottom: '0.375rem' 
                    }}>
                      Birthday <span style={{ fontSize: '12px', fontWeight: 400, color: '#6b7280' }}>(Optional)</span>
                    </label>
                    <input
                      id="birthday"
                      type="date"
                      value={profile.birthday}
                      onChange={(e) => setProfile({ ...profile, birthday: e.target.value })}
                      style={{ 
                        width: '100%', 
                        padding: '0.625rem 0.75rem', 
                        border: '1.5px solid #e5e7eb', 
                        borderRadius: '0.5rem',
                        fontSize: '14px',
                      }}
                    />
                  </div>

                  {/* Pronunciation */}
                  <div>
                    <label htmlFor="pronunciation" style={{ 
                      display: 'block', 
                      fontSize: '13px', 
                      fontWeight: 600, 
                      color: '#374151', 
                      marginBottom: '0.375rem' 
                    }}>
                      Name Pronunciation <span style={{ fontSize: '12px', fontWeight: 400, color: '#6b7280' }}>(Optional)</span>
                    </label>
                    <input
                      id="pronunciation"
                      type="text"
                      value={profile.pronunciation}
                      onChange={(e) => setProfile({ ...profile, pronunciation: e.target.value })}
                      placeholder="e.g., 'Smith' sounds like 'smihth'"
                      style={{ 
                        width: '100%', 
                        padding: '0.625rem 0.75rem', 
                        border: '1.5px solid #e5e7eb', 
                        borderRadius: '0.5rem',
                        fontSize: '14px',
                      }}
                    />
                  </div>

                  {/* Timezone */}
                  <div>
                    <label htmlFor="timezone" style={{ 
                      display: 'block', 
                      fontSize: '13px', 
                      fontWeight: 600, 
                      color: '#374151', 
                      marginBottom: '0.375rem' 
                    }}>
                      Timezone
                    </label>
                    <select
                      id="timezone"
                      value={profile.timezone}
                      onChange={(e) => setProfile({ ...profile, timezone: e.target.value })}
                      style={{ 
                        width: '100%', 
                        padding: '0.625rem 0.75rem', 
                        border: '1.5px solid #e5e7eb', 
                        borderRadius: '0.5rem',
                        fontSize: '14px',
                        backgroundColor: 'white',
                      }}
                    >
                      <option value="America/Phoenix">America/Phoenix (MST)</option>
                      <option value="America/Los_Angeles">America/Los Angeles (PST)</option>
                      <option value="America/Denver">America/Denver (MST)</option>
                      <option value="America/Chicago">America/Chicago (CST)</option>
                      <option value="America/New_York">America/New York (EST)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Section 2: Contact */}
              <div>
                <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#111827', marginBottom: '1rem' }}>
                  Contact Information
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {/* Work Email (Read-only) */}
                  <div>
                    <label htmlFor="email" style={{ 
                      display: 'flex', 
                      alignItems: 'center',
                      gap: '0.375rem',
                      fontSize: '13px', 
                      fontWeight: 600, 
                      color: '#374151', 
                      marginBottom: '0.375rem',
                    }}>
                      Work Email
                      <Lock size={12} style={{ color: '#6b7280' }} />
                    </label>
                    <input
                      id="email"
                      type="email"
                      value={currentUser?.email || ''}
                      readOnly
                      style={{ 
                        width: '100%', 
                        padding: '0.625rem 0.75rem', 
                        border: '1.5px solid #e5e7eb', 
                        borderRadius: '0.5rem',
                        fontSize: '14px',
                        backgroundColor: '#f9fafb',
                        color: '#6b7280',
                        cursor: 'not-allowed',
                      }}
                    />
                    <p style={{ fontSize: '11px', color: '#6b7280', marginTop: '0.25rem', margin: '0.25rem 0 0 0' }}>
                      Managed by your administrator
                    </p>
                  </div>

                  {/* Phone */}
                  <div>
                    <label htmlFor="phone" style={{ 
                      display: 'block', 
                      fontSize: '13px', 
                      fontWeight: 600, 
                      color: '#374151', 
                      marginBottom: '0.375rem' 
                    }}>
                      Phone <span style={{ fontSize: '12px', fontWeight: 400, color: '#6b7280' }}>(Optional)</span>
                    </label>
                    <input
                      id="phone"
                      type="tel"
                      value={profile.phone}
                      onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                      placeholder="(555) 123-4567"
                      style={{ 
                        width: '100%', 
                        padding: '0.625rem 0.75rem', 
                        border: '1.5px solid #e5e7eb', 
                        borderRadius: '0.5rem',
                        fontSize: '14px',
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Section 3: Preferences */}
              <div>
                <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#111827', marginBottom: '1rem' }}>
                  Preferences
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {/* Default Landing Page */}
                  <div>
                    <label htmlFor="defaultLanding" style={{ 
                      display: 'block', 
                      fontSize: '13px', 
                      fontWeight: 600, 
                      color: '#374151', 
                      marginBottom: '0.375rem' 
                    }}>
                      Default Landing Page
                    </label>
                    <select
                      id="defaultLanding"
                      value={profile.preferences.defaultLanding}
                      onChange={(e) => setProfile({ 
                        ...profile, 
                        preferences: { ...profile.preferences, defaultLanding: e.target.value }
                      })}
                      style={{ 
                        width: '100%', 
                        padding: '0.625rem 0.75rem', 
                        border: '1.5px solid #e5e7eb', 
                        borderRadius: '0.5rem',
                        fontSize: '14px',
                        backgroundColor: 'white',
                      }}
                    >
                      <option value="dashboard">Dashboard</option>
                      <option value="war-room">War Room</option>
                      <option value="records">Records</option>
                      <option value="canvassing-planner">Canvassing Planner</option>
                      <option value="clients">Clients</option>
                      <option value="project-hub">Project Hub</option>
                    </select>
                  </div>

                  {/* Date Format */}
                  <div>
                    <label htmlFor="dateFormat" style={{ 
                      display: 'block', 
                      fontSize: '13px', 
                      fontWeight: 600, 
                      color: '#374151', 
                      marginBottom: '0.375rem' 
                    }}>
                      Date Format
                    </label>
                    <select
                      id="dateFormat"
                      value={profile.preferences.dateFormat}
                      onChange={(e) => setProfile({ 
                        ...profile, 
                        preferences: { ...profile.preferences, dateFormat: e.target.value }
                      })}
                      style={{ 
                        width: '100%', 
                        padding: '0.625rem 0.75rem', 
                        border: '1.5px solid #e5e7eb', 
                        borderRadius: '0.5rem',
                        fontSize: '14px',
                        backgroundColor: 'white',
                      }}
                    >
                      <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                      <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                      <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                    </select>
                  </div>

                  {/* Week Starts On */}
                  <div>
                    <label htmlFor="weekStart" style={{ 
                      display: 'block', 
                      fontSize: '13px', 
                      fontWeight: 600, 
                      color: '#374151', 
                      marginBottom: '0.375rem' 
                    }}>
                      Week Starts On
                    </label>
                    <select
                      id="weekStart"
                      value={profile.preferences.weekStart}
                      onChange={(e) => setProfile({ 
                        ...profile, 
                        preferences: { ...profile.preferences, weekStart: e.target.value }
                      })}
                      style={{ 
                        width: '100%', 
                        padding: '0.625rem 0.75rem', 
                        border: '1.5px solid #e5e7eb', 
                        borderRadius: '0.5rem',
                        fontSize: '14px',
                        backgroundColor: 'white',
                      }}
                    >
                      <option value="Sunday">Sunday</option>
                      <option value="Monday">Monday</option>
                    </select>
                  </div>

                  {/* Compact Mode Toggle */}
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'space-between',
                    padding: '0.75rem 1rem',
                    backgroundColor: '#f9fafb',
                    borderRadius: '0.5rem',
                    border: '1px solid #e5e7eb',
                  }}>
                    <div>
                      <div style={{ fontSize: '13px', fontWeight: 600, color: '#374151' }}>
                        Compact Mode
                      </div>
                      <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '0.125rem' }}>
                        Tightens spacing in tables and lists
                      </div>
                    </div>
                    <label style={{ position: 'relative', display: 'inline-block', width: '48px', height: '24px' }}>
                      <input
                        type="checkbox"
                        checked={profile.preferences.compactMode}
                        onChange={(e) => setProfile({ 
                          ...profile, 
                          preferences: { ...profile.preferences, compactMode: e.target.checked }
                        })}
                        style={{ opacity: 0, width: 0, height: 0 }}
                      />
                      <span style={{
                        position: 'absolute',
                        cursor: 'pointer',
                        inset: 0,
                        backgroundColor: profile.preferences.compactMode ? '#7f1d1d' : '#d1d5db',
                        transition: '400ms',
                        borderRadius: '24px',
                      }}>
                        <span style={{
                          position: 'absolute',
                          content: '',
                          height: '18px',
                          width: '18px',
                          left: profile.preferences.compactMode ? '27px' : '3px',
                          bottom: '3px',
                          backgroundColor: 'white',
                          transition: '400ms',
                          borderRadius: '50%',
                        }} />
                      </span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Section 4: Security Quick Actions */}
              <div>
                <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#111827', marginBottom: '1rem' }}>
                  Security
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <button
                    onClick={() => showToastMessage('Password change flow coming soon')}
                    style={{
                      padding: '0.75rem 1rem',
                      backgroundColor: 'white',
                      border: '1.5px solid #e5e7eb',
                      borderRadius: '0.5rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      fontSize: '14px',
                      fontWeight: 600,
                      color: '#374151',
                      textAlign: 'left',
                    }}
                  >
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Lock size={16} />
                      Change Password
                    </span>
                  </button>
                  <button
                    onClick={() => showToastMessage('Multi-factor authentication coming soon')}
                    style={{
                      padding: '0.75rem 1rem',
                      backgroundColor: 'white',
                      border: '1.5px solid #e5e7eb',
                      borderRadius: '0.5rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      fontSize: '14px',
                      fontWeight: 600,
                      color: '#374151',
                      textAlign: 'left',
                    }}
                  >
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Shield size={16} />
                      Enable Multi-Factor Authentication
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Footer - Sticky Save Bar */}
          <div style={{ 
            padding: '1.25rem 2rem', 
            borderTop: '1px solid #e5e7eb',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: '#f9fafb',
          }}>
            <div style={{ fontSize: '13px', color: '#6b7280' }}>
              {lastSaved && (
                <span>Last saved: {lastSaved.toLocaleTimeString()}</span>
              )}
            </div>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button
                onClick={handleClose}
                style={{
                  padding: '0.625rem 1.25rem',
                  backgroundColor: 'white',
                  border: '1.5px solid #d1d5db',
                  borderRadius: '0.5rem',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: 600,
                  color: '#374151',
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={!hasChanges || loading}
                style={{
                  padding: '0.625rem 1.5rem',
                  backgroundColor: hasChanges && !loading ? '#7f1d1d' : '#d1d5db',
                  border: 'none',
                  borderRadius: '0.5rem',
                  cursor: hasChanges && !loading ? 'pointer' : 'not-allowed',
                  fontSize: '14px',
                  fontWeight: 600,
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                }}
              >
                {loading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Saving...
                  </>
                ) : (
                  'Save Changes'
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Toast Notification */}
      {showToast && (
        <div
          className="toast-notification"
          style={{
            position: 'fixed',
            top: '2rem',
            right: '2rem',
            backgroundColor: '#065f46',
            color: 'white',
            padding: '1rem 1.5rem',
            borderRadius: '0.5rem',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            zIndex: 999999,
          }}
        >
          <Check size={18} />
          <span style={{ fontSize: '14px', fontWeight: 600 }}>{toastMessage}</span>
        </div>
      )}

      {/* Avatar Crop Modal */}
      {showCropModal && imageToCrop && (
        <AvatarCropModal
          imageUrl={imageToCrop}
          onComplete={handleCropComplete}
          onCancel={() => {
            setShowCropModal(false);
            setImageToCrop(null);
          }}
        />
      )}
    </>
  );
};