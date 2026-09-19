// Authentication Context & Hooks for Stellar
// Provides auth state, role-based access control, and session management

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useConvex, useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';

// Types
export type UserRole = 'admin' | 'teacher' | 'student';

export interface AuthUser {
  _id: string;
  username?: string;
  email: string;
  fullName: string;
  role: UserRole;
  isActive: boolean;
  batch?: string;
  semester?: string;
  course?: string;
  university?: string;
  studentId?: string;
  employeeId?: string;
  designation?: string;
  specialization?: string;
  avatarUrl?: string;
  dob?: string;
  phone?: string;
  department?: string;
  campus?: string;
  roomNo?: string;
  guardianName?: string;
  guardianContact?: string;
  emergencyContact?: string;
  currentAddress?: string;
  criterion?: number;
  dailyGoal?: number;
  onboardingCompleted?: boolean;
  hasTimetableConfigured?: boolean;
  createdAt: string;
  lastLoginAt: string;
}

interface AuthContextType {
  user: AuthUser | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  role: UserRole | null;
  login: (username: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (username: string, email: string, password: string, fullName: string, batch?: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  updateUser: (updates: Partial<AuthUser>) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

const TOKEN_KEY = 'stellar_auth_token';
const USER_KEY = 'stellar_active_user';

// Demo users for when Convex backend is offline
const DEMO_USERS: Record<UserRole, AuthUser> = {
  admin: {
    _id: 'demo-admin-001',
    username: 'stellar_admin',
    email: 'admin@stellar.edu',
    fullName: 'System Administrator',
    role: 'admin',
    isActive: true,
    department: 'Administration',
    designation: 'System Administrator',
    employeeId: 'ADM-2026-001',
    university: 'School of Engineering and Technology',
    onboardingCompleted: true,
    hasTimetableConfigured: true,
    createdAt: new Date().toISOString(),
    lastLoginAt: new Date().toISOString(),
  },
  teacher: {
    _id: 'demo-teacher-001',
    username: 'stellar_teacher',
    email: 'swati.raj@stellar.edu',
    fullName: 'Prof. Swati Raj',
    role: 'teacher',
    isActive: true,
    department: 'Department of AI and Data Science Engineering',
    designation: 'Assistant Professor',
    specialization: 'Database Management Systems',
    employeeId: 'FAC-2026-001',
    campus: 'Central Campus / Arch Block',
    roomNo: 'Cabin 304, 3F Arch Block',
    university: 'School of Engineering and Technology',
    onboardingCompleted: true,
    hasTimetableConfigured: true,
    createdAt: new Date().toISOString(),
    lastLoginAt: new Date().toISOString(),
  },
  student: {
    _id: 'demo-student-001',
    username: 'stellar_student',
    email: 'abhiram.stellar@gmail.com',
    fullName: 'Abhiram',
    role: 'student',
    isActive: true,
    batch: 'B1',
    semester: 'III Sem',
    course: 'B.Tech AI & Data Science',
    studentId: 'AI24-BTECH-303',
    department: 'Department of AI and Data Science Engineering',
    campus: 'Central Campus / Arch Block',
    roomNo: 'Room No: 303, 3F- Arch Block',
    criterion: 75,
    dailyGoal: 2.0,
    onboardingCompleted: true,
    hasTimetableConfigured: true,
    university: 'School of Engineering and Technology',
    createdAt: new Date().toISOString(),
    lastLoginAt: new Date().toISOString(),
  },
};

// Demo credentials (only checked when Convex is offline)
const DEMO_CREDENTIALS: Array<{ username: string; password: string; role: UserRole }> = [
  { username: 'stellar_admin', password: 'St3llar!Admin2026', role: 'admin' },
  { username: 'stellar_teacher', password: 'St3llar!Teach2026', role: 'teacher' },
  { username: 'stellar_student', password: 'St3llar!Stud2026', role: 'student' },
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(() => {
    try {
      const cached = localStorage.getItem(USER_KEY);
      if (cached) return JSON.parse(cached);
    } catch {}
    return null;
  });
  const [token, setToken] = useState<string | null>(() => localStorage.getItem(TOKEN_KEY));
  const [isLoading, setIsLoading] = useState(true);

  const convex = useConvex();
  const loginByUsernameMutation = useMutation(api.users.loginByUsername);
  const registerMutation = useMutation(api.users.register);
  const logoutMutation = useMutation(api.users.logout);

  // Restore session on mount
  useEffect(() => {
    let isMounted = true;
    const restoreSession = async () => {
      const savedToken = localStorage.getItem(TOKEN_KEY);
      const savedUser = localStorage.getItem(USER_KEY);

      if (savedUser && savedToken) {
        try {
          const parsed = JSON.parse(savedUser);
          if (isMounted) {
            setUser(parsed);
            setToken(savedToken);
          }
        } catch {
          // invalid json
        }
      }

      if (savedToken && convex) {
        try {
          const validationPromise = convex.query(api.users.validateSession, { token: savedToken });
          const timeoutPromise = new Promise<{ valid: boolean; user: null }>((resolve) =>
            setTimeout(() => resolve({ valid: false, user: null }), 2000)
          );

          const result = await Promise.race([validationPromise, timeoutPromise]);
          if (result && result.valid && result.user && isMounted) {
            setUser(result.user as AuthUser);
            localStorage.setItem(USER_KEY, JSON.stringify(result.user));
          }
        } catch {
          // If Convex is offline, preserve cached user
        }
      }

      if (isMounted) {
        setIsLoading(false);
      }
    };

    restoreSession();
    return () => { isMounted = false; };
  }, [convex]);

  const login = useCallback(async (username: string, password: string) => {
    const cleanUsername = username.trim().toLowerCase();

    // 1. Try Convex mutation first
    try {
      const result = await loginByUsernameMutation({ username: cleanUsername, password });
      if (result.success && result.user && result.token) {
        const authUser = result.user as AuthUser;
        setUser(authUser);
        setToken(result.token);
        localStorage.setItem(TOKEN_KEY, result.token);
        localStorage.setItem(USER_KEY, JSON.stringify(authUser));
        return { success: true };
      }
      if (!result.success && result.error) {
        return { success: false, error: result.error };
      }
    } catch {
      // Convex offline — fall through to demo credentials
    }

    // 2. Fallback: check demo credentials when Convex is unavailable
    const matched = DEMO_CREDENTIALS.find(
      (c) => c.username === cleanUsername && c.password === password
    );
    if (matched) {
      const demoUser = DEMO_USERS[matched.role];
      setUser(demoUser);
      const demoToken = `demo-token-${matched.role}-${Date.now()}`;
      setToken(demoToken);
      localStorage.setItem(TOKEN_KEY, demoToken);
      localStorage.setItem(USER_KEY, JSON.stringify(demoUser));
      return { success: true };
    }

    return { success: false, error: 'Invalid username or password.' };
  }, [loginByUsernameMutation]);

  const register = useCallback(async (username: string, email: string, password: string, fullName: string, batch?: string) => {
    const cleanUsername = username.trim().toLowerCase();
    const cleanEmail = email.trim().toLowerCase();

    // Validate username
    if (cleanUsername.length < 3 || cleanUsername.length > 30) {
      return { success: false, error: 'Username must be between 3 and 30 characters.' };
    }
    if (!/^[a-z0-9_]+$/.test(cleanUsername)) {
      return { success: false, error: 'Username can only contain lowercase letters, numbers, and underscores.' };
    }

    // Validate password
    if (password.length < 8) {
      return { success: false, error: 'Password must be at least 8 characters.' };
    }

    // 1. Try Convex mutation
    try {
      const result = await registerMutation({
        username: cleanUsername,
        email: cleanEmail,
        password,
        fullName,
        batch,
      });
      if (result.success && result.user && result.token) {
        const authUser = result.user as AuthUser;
        setUser(authUser);
        setToken(result.token);
        localStorage.setItem(TOKEN_KEY, result.token);
        localStorage.setItem(USER_KEY, JSON.stringify(authUser));
        return { success: true };
      }
      if (!result.success && result.error) {
        return { success: false, error: result.error };
      }
    } catch {
      // Convex offline
    }

    // 2. Client-side fallback for demo/offline use
    const newUser: AuthUser = {
      _id: `user-${Date.now()}`,
      username: cleanUsername,
      email: cleanEmail,
      fullName: fullName.trim(),
      role: 'student',
      isActive: true,
      batch: batch || 'B1',
      semester: 'III Sem',
      course: 'B.Tech AI & Data Science',
      studentId: `AI24-BTECH-${Math.floor(350 + Math.random() * 50)}`,
      university: 'School of Engineering and Technology',
      department: 'Department of AI and Data Science Engineering',
      criterion: 75,
      dailyGoal: 2.0,
      onboardingCompleted: false,
      hasTimetableConfigured: false,
      createdAt: new Date().toISOString(),
      lastLoginAt: new Date().toISOString(),
    };

    const fakeToken = `offline-token-${Date.now()}`;
    setUser(newUser);
    setToken(fakeToken);
    localStorage.setItem(TOKEN_KEY, fakeToken);
    localStorage.setItem(USER_KEY, JSON.stringify(newUser));

    return { success: true };
  }, [registerMutation]);

  const logout = useCallback(async () => {
    if (token) {
      try {
        await logoutMutation({ token });
      } catch { /* ignore */ }
    }
    setUser(null);
    setToken(null);
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  }, [token, logoutMutation]);

  const updateUser = useCallback((updates: Partial<AuthUser>) => {
    setUser((prev) => {
      if (!prev) return null;
      const updated = { ...prev, ...updates };
      localStorage.setItem(USER_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        isAuthenticated: !!user,
        role: user?.role || null,
        login,
        register,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}

export function useRequireRole(allowedRoles: UserRole[]) {
  const { user, role, isLoading } = useAuth();
  const isAuthorized = role !== null && allowedRoles.includes(role);
  return { isAuthorized, isLoading, user, role };
}
