import React, { createContext, useContext, useState, useEffect } from 'react';
import { useMsal } from "@azure/msal-react";
import { loginRequest } from '../config/msalConfig';
import { User, mockUsers, mockRoles, Role, mockUserFieldPermissions, UserFieldPermissions } from '../data/authData';

interface AuthContextType {
  currentUser: User | null;
  isAuthenticated: boolean;
  isAuthInProgress: boolean; // Add this
  login: (email?: string, password?: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  hasPermission: (permission: string) => boolean;
  getUserRole: () => Role | null;
  getFieldPermissions: () => UserFieldPermissions | null;
  syncWithSupabase: (supabaseUserId: string | null, supabaseEmail: string | null) => void;
}

const defaultAuthContext: AuthContextType = {
  currentUser: null,
  isAuthenticated: false,
  isAuthInProgress: false, // Add this
  login: async () => ({ success: false, error: 'Auth provider not initialized' }),
  logout: () => {},
  hasPermission: () => false,
  getUserRole: () => null,
  getFieldPermissions: () => null,
  syncWithSupabase: () => {},
};

const AuthContext = createContext<AuthContextType | undefined>(defaultAuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { instance, accounts, inProgress } = useMsal();
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // Derive isAuthInProgress from MSAL state
  const isAuthInProgress = inProgress !== "none" && inProgress !== "acquireToken";

  // Debug MSAL state
  useEffect(() => {
    if (inProgress !== "none") {
      console.log('[AuthContext] MSAL Interaction Status:', inProgress);
    }
  }, [inProgress]);

  // Sync MSAL account with app user state
  useEffect(() => {
    // Wait for MSAL to finish any in-progress operations
    if (inProgress !== "none") {
      console.log('[AuthContext] Waiting for MSAL operation to complete:', inProgress);
      return;
    }

    if (accounts.length > 0) {
      const account = accounts[0];
      console.log('[AuthProvider] MSAL Account detected:', account);
      console.log('[AuthProvider] Account details:', {
        homeAccountId: account.homeAccountId,
        username: account.username,
        name: account.name
      });
      
      // Try to find a matching mock user by email to preserve roles/permissions if possible
      const existingUser = mockUsers.find(u => u.email.toLowerCase() === account.username.toLowerCase());
      
      if (existingUser) {
        // Update existing user with latest info from MSAL if needed
        const fullName = account.name || '';
        const nameParts = fullName.split(' ');
        const firstName = nameParts[0] || existingUser.firstName;
        const lastName = nameParts.slice(1).join(' ') || existingUser.lastName;
        
        setCurrentUser({
          ...existingUser,
          firstName,
          lastName,
          lastLoginAt: new Date().toISOString(),
        });
        console.log('[AuthProvider] ✅ Updated existing user from MSAL account');
      } else {
        // Create new user from MSAL profile
        const fullName = account.name || 'User';
        const nameParts = fullName.split(' ');
        const firstName = nameParts[0] || 'User';
        const lastName = nameParts.slice(1).join(' ') || '';

        const newUser: User = {
          id: account.homeAccountId,
          orgId: 'org-1', // Default organization
          email: account.username,
          firstName: firstName,
          lastName: lastName,
          roleId: 'role-admin', // Default to admin for now so they can access features
          status: 'active',
          createdAt: new Date().toISOString(),
          lastLoginAt: new Date().toISOString(),
          avatarUrl: '', 
        };
        setCurrentUser(newUser);
        console.log('[AuthProvider] ✅ Created new user from MSAL account:', {
          id: newUser.id,
          email: newUser.email,
          name: `${newUser.firstName} ${newUser.lastName}`
        });
      }
    } else {
      console.log('[AuthProvider] No MSAL accounts found, checking localStorage for demo user...');
      // Fallback to local storage for demo users if no MSAL account
      const savedUserId = localStorage.getItem('pythia_current_user_id');
      if (savedUserId && !currentUser) {
         const user = mockUsers.find(u => u.id === savedUserId);
         if (user && user.status === 'active') {
           setCurrentUser(user);
           console.log('[AuthProvider] ✅ Restored demo user from localStorage');
         }
      } else if (!savedUserId) {
        setCurrentUser(null);
        console.log('[AuthProvider] No saved user found');
      }
    }
  }, [accounts, inProgress]);

  const login = async (email?: string, password?: string): Promise<{ success: boolean; error?: string }> => {
    // If credentials provided, use legacy mock login (for demo/admin access)
    if (email && password) {
       // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));

      // Check for demo credentials first
      if (email.toLowerCase() === 'admin' && password === 'demo') {
        const demoUser = mockUsers.find(u => u.roleId === 'role-superadmin' && u.status === 'active');
        if (demoUser) {
          demoUser.lastLoginAt = new Date().toISOString();
          setCurrentUser(demoUser);
          localStorage.setItem('pythia_current_user_id', demoUser.id);
          return { success: true };
        }
      }
      
      const user = mockUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
      if (user && user.password === password) {
          user.lastLoginAt = new Date().toISOString();
          setCurrentUser(user);
          localStorage.setItem('pythia_current_user_id', user.id);
          return { success: true };
      }
      return { success: false, error: 'Invalid credentials' };
    }

    // Otherwise trigger MSAL login
    try {
      // Use redirect flow for production/SPA
      await instance.loginRedirect(loginRequest);
      // loginRedirect doesn't return a result here; it redirects the page.
      // The result will be processed by MsalProvider on return.
      return { success: true };
    } catch (e: any) {
      console.error('Login failed:', e);
      return { success: false, error: e.message };
    }
  };

  const logout = () => {
    if (accounts.length > 0) {
        instance.logoutRedirect({
            postLogoutRedirectUri: window.location.origin,
        });
    }
    setCurrentUser(null);
    localStorage.removeItem('pythia_current_user_id');
  };

  const getUserRole = (): Role | null => {
    if (!currentUser) return null;
    return mockRoles.find(r => r.id === currentUser.roleId) || null;
  };

  const hasPermission = (permission: string): boolean => {
    const role = getUserRole();
    if (!role) return false;
    return role.permissions.includes(permission);
  };

  const getFieldPermissions = (): UserFieldPermissions | null => {
    if (!currentUser) return null;
    return mockUserFieldPermissions.find(fp => fp.userId === currentUser.id) || null;
  };

  const syncWithSupabase = (supabaseUserId: string | null, supabaseEmail: string | null) => {
    if (supabaseUserId) {
      const user = mockUsers.find(u => u.id === supabaseUserId);
      if (user && user.status === 'active') {
        setCurrentUser(user);
        localStorage.setItem('pythia_current_user_id', user.id);
      }
    } else if (supabaseEmail) {
      const user = mockUsers.find(u => u.email.toLowerCase() === supabaseEmail.toLowerCase());
      if (user && user.status === 'active') {
        setCurrentUser(user);
        localStorage.setItem('pythia_current_user_id', user.id);
      }
    } else {
      logout();
    }
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAuthenticated: currentUser !== null,
        isAuthInProgress, // Provide this
        login,
        logout,
        hasPermission,
        getUserRole,
        getFieldPermissions,
        syncWithSupabase,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    // Return default context instead of throwing, but log a warning
    console.warn('useAuth used outside of AuthProvider, returning default context');
    return defaultAuthContext;
  }
  return context;
};