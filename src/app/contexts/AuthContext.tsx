import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, mockUsers, mockRoles, Role, mockUserFieldPermissions, UserFieldPermissions } from '../data/authData';

interface AuthContextType {
  currentUser: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  hasPermission: (permission: string) => boolean;
  getUserRole: () => Role | null;
  getFieldPermissions: () => UserFieldPermissions | null;
  syncWithSupabase: (supabaseUserId: string | null, supabaseEmail: string | null) => void;
}

const defaultAuthContext: AuthContextType = {
  currentUser: null,
  isAuthenticated: false,
  login: async () => ({ success: false, error: 'Auth provider not initialized' }),
  logout: () => {},
  hasPermission: () => false,
  getUserRole: () => null,
  getFieldPermissions: () => null,
  syncWithSupabase: () => {},
};

const AuthContext = createContext<AuthContextType>(defaultAuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // Load user from localStorage on mount
  useEffect(() => {
    const savedUserId = localStorage.getItem('pythia_current_user_id');
    if (savedUserId) {
      const user = mockUsers.find(u => u.id === savedUserId);
      if (user && user.status === 'active') {
        setCurrentUser(user);
      } else {
        localStorage.removeItem('pythia_current_user_id');
      }
    }
  }, []);

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // Check for demo credentials first
    if (email.toLowerCase() === 'admin' && password === 'demo') {
      // Use the first super admin user for demo login
      const demoUser = mockUsers.find(u => u.roleId === 'role-superadmin' && u.status === 'active');
      if (demoUser) {
        demoUser.lastLoginAt = new Date().toISOString();
        setCurrentUser(demoUser);
        localStorage.setItem('pythia_current_user_id', demoUser.id);
        return { success: true };
      }
    }

    // Regular email/password authentication
    const user = mockUsers.find(u => u.email.toLowerCase() === email.toLowerCase());

    if (!user) {
      return { success: false, error: 'Invalid credentials' };
    }

    if (user.status === 'disabled') {
      return { success: false, error: 'Account disabled. Please contact your administrator.' };
    }

    if (user.password !== password) {
      return { success: false, error: 'Invalid credentials' };
    }

    // Update last login
    user.lastLoginAt = new Date().toISOString();

    setCurrentUser(user);
    localStorage.setItem('pythia_current_user_id', user.id);

    return { success: true };
  };

  const logout = () => {
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
  return context;
};