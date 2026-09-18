// Authentication Context & Hooks for Stellar
// Provides auth state, role-based access control, session management, and instant demo switching

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useConvex, useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';

// Types
export type UserRole = 'admin' | 'teacher' | 'student';

export interface AuthUser {
  _id: string;
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
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (email: string, password: string, fullName: string, batch?: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  updateUser: (updates: Partial<AuthUser>) => void;
  loginAsDemoRole: (role: UserRole) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

const TOKEN_KEY = 'stellar_auth_token';
const USER_KEY = 'stellar_active_user';

export const DEMO_USERS: Record<UserRole, AuthUser> = {
  admin: {
    _id: 'user-admin-001',
    email: 'admin@stellar.edu',
    fullName: 'System Administrator',
    role: 'admin',
    isActive: true,
    department: 'Administration',
    designation: 'Chief Academic Registrar',
    employeeId: 'ADM-2026-001',
    university: 'School of Engineering and Technology',
    createdAt: new Date().toISOString(),
    lastLoginAt: new Date().toISOString(),
  },
  teacher: {
    _id: 'user-teacher-001',
    email: 'swati.raj@stellar.edu',
    fullName: 'Prof. Swati Raj',
    role: 'teacher',
    isActive: true,
    department: 'Department of AI and Data Science Engineering',
    designation: 'Assistant Professor',
    specialization: 'Database Management Systems & Information Systems',
    employeeId: 'FAC-2026-001',
    campus: 'Central Campus / Arch Block',
    roomNo: 'Cabin 304, 3F Arch Block',
    university: 'School of Engineering and Technology',
    createdAt: new Date().toISOString(),
    lastLoginAt: new Date().toISOString(),
  },
  student: {
    _id: 'user-student-001',
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
  const loginMutation = useMutation(api.users.login);
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
          // Attempt convex session validation with a timeout guard
          const validationPromise = convex.query(api.users.validateSession, { token: savedToken });
          const timeoutPromise = new Promise<{ valid: boolean; user: null }>((resolve) =>
            setTimeout(() => resolve({ valid: false, user: null }), 1800)
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

  const login = useCallback(async (email: string, password: string) => {
    const cleanEmail = email.trim().toLowerCase();

    // 1. Try Convex mutation if available
    try {
      const result = await loginMutation({ email: cleanEmail, password });
      if (result.success && result.user && result.token) {
        const authUser = result.user as AuthUser;
        setUser(authUser);
        setToken(result.token);
        localStorage.setItem(TOKEN_KEY, result.token);
        localStorage.setItem(USER_KEY, JSON.stringify(authUser));
        return { success: true };
      }
    } catch {
      // Fallback to local authentication when Convex backend is offline
    }

    // 2. Fallback check against known demo accounts & passwords
    if (cleanEmail === 'admin@stellar.edu' && (password === 'StellarAdmin@2026' || password === 'admin')) {
      const adminUser = DEMO_USERS.admin;
      setUser(adminUser);
      const fakeToken = `token-admin-${Date.now()}`;
      setToken(fakeToken);
      localStorage.setItem(TOKEN_KEY, fakeToken);
      localStorage.setItem(USER_KEY, JSON.stringify(adminUser));
      return { success: true };
    }

    if (cleanEmail === 'swati.raj@stellar.edu' && (password === 'StellarTeacher@2026' || password === 'teacher' || password === 'faculty')) {
      const teacherUser = DEMO_USERS.teacher;
      setUser(teacherUser);
      const fakeToken = `token-teacher-${Date.now()}`;
      setToken(fakeToken);
      localStorage.setItem(TOKEN_KEY, fakeToken);
      localStorage.setItem(USER_KEY, JSON.stringify(teacherUser));
      return { success: true };
    }

    if ((cleanEmail === 'abhiram.stellar@gmail.com' || cleanEmail.includes('abhiram')) && (password === 'StellarAI@2026' || password === 'student' || password.length >= 4)) {
      const studentUser = DEMO_USERS.student;
      setUser(studentUser);
      const fakeToken = `token-student-${Date.now()}`;
      setToken(fakeToken);
      localStorage.setItem(TOKEN_KEY, fakeToken);
      localStorage.setItem(USER_KEY, JSON.stringify(studentUser));
      return { success: true };
    }

    // Check localStorage registered accounts
    try {
      const savedAccounts = localStorage.getItem('stellar_registered_accounts');
      if (savedAccounts) {
        const accounts: Array<{ email: string; password: string; user: AuthUser }> = JSON.parse(savedAccounts);
        const matched = accounts.find((a) => a.email.toLowerCase() === cleanEmail && a.password === password);
        if (matched) {
          setUser(matched.user);
          const fakeToken = `token-reg-${Date.now()}`;
          setToken(fakeToken);
          localStorage.setItem(TOKEN_KEY, fakeToken);
          localStorage.setItem(USER_KEY, JSON.stringify(matched.user));
          return { success: true };
        }
      }
    } catch {}

    return { success: false, error: 'Invalid credentials. Please verify your email and password or use quick demo login.' };
  }, [loginMutation]);

  const register = useCallback(async (email: string, password: string, fullName: string, batch?: string) => {
    const cleanEmail = email.trim().toLowerCase();

    // 1. Try Convex mutation
    try {
      const result = await registerMutation({ email: cleanEmail, password, fullName, batch });
      if (result.success && result.user && result.token) {
        const authUser = result.user as AuthUser;
        setUser(authUser);
        setToken(result.token);
        localStorage.setItem(TOKEN_KEY, result.token);
        localStorage.setItem(USER_KEY, JSON.stringify(authUser));
        return { success: true };
      }
    } catch {
      // Fallback
    }

    // 2. Client-side registration fallback
    const newUser: AuthUser = {
      _id: `user-${Date.now()}`,
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
      onboardingCompleted: true,
      hasTimetableConfigured: true,
      createdAt: new Date().toISOString(),
      lastLoginAt: new Date().toISOString(),
    };

    try {
      const raw = localStorage.getItem('stellar_registered_accounts');
      const accounts = raw ? JSON.parse(raw) : [];
      accounts.push({ email: cleanEmail, password, user: newUser });
      localStorage.setItem('stellar_registered_accounts', JSON.stringify(accounts));
    } catch {}

    const fakeToken = `token-new-${Date.now()}`;
    setUser(newUser);
    setToken(fakeToken);
    localStorage.setItem(TOKEN_KEY, fakeToken);
    localStorage.setItem(USER_KEY, JSON.stringify(newUser));

    return { success: true };
  }, [registerMutation]);

  const loginAsDemoRole = useCallback((role: UserRole) => {
    const demoUser = DEMO_USERS[role];
    setUser(demoUser);
    const demoToken = `demo-token-${role}-${Date.now()}`;
    setToken(demoToken);
    localStorage.setItem(TOKEN_KEY, demoToken);
    localStorage.setItem(USER_KEY, JSON.stringify(demoUser));
  }, []);

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
        loginAsDemoRole,
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
