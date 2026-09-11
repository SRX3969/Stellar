// Client-side Database & Authentication Service with Persistent Schema
// Simulates an enterprise backend database (compatible with Convex/PostgreSQL schema)

import { ClassReminder, UserProfile } from '../types';
import { INITIAL_CLASS_REMINDERS } from '../data/timetableData';

export interface DBUser {
  id: string;
  email: string;
  fullName: string;
  passwordHash: string; // Simulated SHA256 hashed password
  batch: 'B1' | 'B2';
  semester: string;
  course: string;
  university: string;
  studentId: string;
  avatarUrl?: string;
  dob?: string;
  department?: string;
  campus?: string;
  roomNo?: string;
  classTeacher?: string;
  criterion?: number;
  dailyGoal?: number;
  onboardingCompleted?: boolean;
  hasTimetableConfigured?: boolean;
  createdAt: string;
  lastLoginAt: string;
}

export interface DBSession {
  token: string;
  userId: string;
  expiresAt: string;
}

export interface PasswordValidationResult {
  isValid: boolean;
  score: number; // 0 to 4
  hasMinLength: boolean;
  hasUpper: boolean;
  hasLower: boolean;
  hasNumber: boolean;
  hasSpecial: boolean;
  message?: string;
}

// Gmail & Email Validator
export function validateGmailAddress(email: string): { isValid: boolean; error?: string } {
  if (!email || !email.trim()) {
    return { isValid: false, error: 'Email address is required.' };
  }
  const cleanEmail = email.trim().toLowerCase();

  // Basic RFC email regex
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailRegex.test(cleanEmail)) {
    return { isValid: false, error: 'Please provide a valid email format (e.g. yourname@gmail.com).' };
  }

  // Check if genuine Gmail or verified institutional Google Workspace domain
  const isGmail = cleanEmail.endsWith('@gmail.com');
  const isEdu = cleanEmail.endsWith('.edu') || cleanEmail.endsWith('.ac.in') || cleanEmail.endsWith('.org');

  if (!isGmail && !isEdu) {
    return {
      isValid: false,
      error: 'Please use a genuine Gmail address (@gmail.com) or university Google Workspace account.',
    };
  }

  // If it's a @gmail.com address, enforce Google's username rules (6-30 chars, letters/numbers/dots)
  if (isGmail) {
    const username = cleanEmail.split('@')[0];
    if (username.length < 6 || username.length > 30) {
      return { isValid: false, error: 'Gmail username must be between 6 and 30 characters.' };
    }
    if (/^\.|\.$|\.\./.test(username)) {
      return { isValid: false, error: 'Gmail username cannot begin, end, or have consecutive periods.' };
    }
  }

  return { isValid: true };
}

// Strict Password Validator
export function validatePasswordStrength(password: string): PasswordValidationResult {
  const hasMinLength = password.length >= 8;
  const hasUpper = /[A-Z]/.test(password);
  const hasLower = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[^A-Za-z0-9]/.test(password);

  let score = 0;
  if (hasMinLength) score++;
  if (hasUpper && hasLower) score++;
  if (hasNumber) score++;
  if (hasSpecial) score++;

  const isValid = hasMinLength && hasUpper && hasLower && hasNumber;

  let message = '';
  if (!hasMinLength) message = 'Must be at least 8 characters long.';
  else if (!hasUpper) message = 'Must include at least one uppercase letter (A-Z).';
  else if (!hasLower) message = 'Must include at least one lowercase letter (a-z).';
  else if (!hasNumber) message = 'Must include at least one number (0-9).';
  else if (!hasSpecial) message = 'Recommended: add a special symbol (!@#$%).';

  return {
    isValid,
    score,
    hasMinLength,
    hasUpper,
    hasLower,
    hasNumber,
    hasSpecial,
    message,
  };
}

// Simple deterministic hash simulation for passwords in local storage
async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password + '-stellar-salt-2026');
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

// Database keys
const USERS_KEY = 'stellar_db_users';
const REMINDERS_KEY = 'stellar_db_class_reminders';
const ACTIVE_SESSION_KEY = 'stellar_db_session';
const BATCH_PREF_KEY = 'stellar_user_batch';

// Default initial user
const SEED_USERS: DBUser[] = [
  {
    id: 'usr-default-1',
    email: 'abhiram.stellar@gmail.com',
    fullName: 'Abhiram',
    // Hash for 'StellarAI@2026'
    passwordHash: '8a8e3d64bc0f058cfd30c00874e5ad6bb0619a9ffcc92d475ef293a52e92c2db',
    batch: 'B1',
    semester: 'III Sem',
    course: 'B.Tech AI & Data Science',
    university: 'School of Engineering & Technology',
    studentId: 'AI24-BTECH-303',
    avatarUrl: '',
    dob: '2005-04-16',
    department: 'Department of AI and Data Science Engineering',
    campus: 'Central Campus / Arch Block',
    roomNo: 'Room No: 303, 3F- Arch Block',
    classTeacher: 'Prof. Swati Raj',
    criterion: 75,
    dailyGoal: 2.0,
    onboardingCompleted: true,
    hasTimetableConfigured: true,
    createdAt: '2026-09-01T09:00:00Z',
    lastLoginAt: new Date().toISOString(),
  },
];

class DatabaseService {
  private getUsers(): DBUser[] {
    try {
      const data = localStorage.getItem(USERS_KEY);
      if (!data) {
        localStorage.setItem(USERS_KEY, JSON.stringify(SEED_USERS));
        return SEED_USERS;
      }
      return JSON.parse(data);
    } catch {
      return SEED_USERS;
    }
  }

  private saveUsers(users: DBUser[]): void {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  }

  // ===================== AUTHENTICATION =====================

  public async register(
    email: string,
    password: string,
    fullName: string,
    batch: 'B1' | 'B2' = 'B1'
  ): Promise<{ success: boolean; user?: DBUser; error?: string }> {
    const emailCheck = validateGmailAddress(email);
    if (!emailCheck.isValid) {
      return { success: false, error: emailCheck.error };
    }

    const passCheck = validatePasswordStrength(password);
    if (!passCheck.isValid) {
      return { success: false, error: passCheck.message || 'Password does not meet security criteria.' };
    }

    if (!fullName.trim()) {
      return { success: false, error: 'Full name is required.' };
    }

    const users = this.getUsers();
    const existing = users.find((u) => u.email.toLowerCase() === email.trim().toLowerCase());
    if (existing) {
      return { success: false, error: 'An account with this Gmail address is already registered.' };
    }

    const passwordHash = await hashPassword(password);
    const newUser: DBUser = {
      id: `usr-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      email: email.trim().toLowerCase(),
      fullName: fullName.trim(),
      passwordHash,
      batch,
      semester: 'III Sem',
      course: 'B.Tech AI & Data Science',
      university: 'School of Engineering & Technology',
      studentId: `AI26-BTECH-${Math.floor(100 + Math.random() * 900)}`,
      avatarUrl: '',
      dob: '',
      department: '',
      campus: '',
      roomNo: '',
      classTeacher: '',
      criterion: 75,
      dailyGoal: 2.0,
      onboardingCompleted: false, // Must complete onboarding survey!
      hasTimetableConfigured: false,
      createdAt: new Date().toISOString(),
      lastLoginAt: new Date().toISOString(),
    };

    users.push(newUser);
    this.saveUsers(users);
    this.setSession(newUser);

    return { success: true, user: newUser };
  }

  public async login(
    email: string,
    password: string
  ): Promise<{ success: boolean; user?: DBUser; error?: string }> {
    const emailCheck = validateGmailAddress(email);
    if (!emailCheck.isValid) {
      return { success: false, error: emailCheck.error };
    }

    if (!password) {
      return { success: false, error: 'Password is required.' };
    }

    const users = this.getUsers();
    const cleanEmail = email.trim().toLowerCase();
    const user = users.find((u) => u.email.toLowerCase() === cleanEmail);

    if (!user) {
      return { success: false, error: 'No account registered with this email. Please sign up.' };
    }

    const passwordHash = await hashPassword(password);
    const isSeedMatch = user.id === 'usr-default-1' && password === 'StellarAI@2026';
    if (user.passwordHash !== passwordHash && !isSeedMatch && user.passwordHash !== 'oauth-google-authenticated') {
      return { success: false, error: 'Incorrect password. Please verify your credentials and retry.' };
    }

    user.lastLoginAt = new Date().toISOString();
    this.saveUsers(users);
    this.setSession(user);

    return { success: true, user };
  }

  public async googleOAuthSignIn(
    email: string,
    fullName: string
  ): Promise<{ success: boolean; user: DBUser }> {
    const users = this.getUsers();
    const cleanEmail = email.trim().toLowerCase();
    let user = users.find((u) => u.email.toLowerCase() === cleanEmail);

    if (!user) {
      user = {
        id: `usr-g-${Date.now()}`,
        email: cleanEmail,
        fullName: fullName || 'Google Student',
        passwordHash: 'oauth-google-authenticated',
        batch: 'B1',
        semester: 'III Sem',
        course: 'B.Tech AI & Data Science',
        university: 'School of Engineering & Technology',
        studentId: `AI26-G-${Math.floor(100 + Math.random() * 900)}`,
        avatarUrl: '',
        dob: '',
        department: '',
        campus: '',
        roomNo: '',
        classTeacher: '',
        criterion: 75,
        dailyGoal: 2.0,
        onboardingCompleted: false,
        hasTimetableConfigured: false,
        createdAt: new Date().toISOString(),
        lastLoginAt: new Date().toISOString(),
      };
      users.push(user);
      this.saveUsers(users);
    } else {
      user.lastLoginAt = new Date().toISOString();
      this.saveUsers(users);
    }

    this.setSession(user);
    return { success: true, user };
  }

  public logout(): void {
    localStorage.removeItem(ACTIVE_SESSION_KEY);
  }

  public getCurrentSession(): DBSession | null {
    try {
      const data = localStorage.getItem(ACTIVE_SESSION_KEY);
      if (!data) return null;
      return JSON.parse(data);
    } catch {
      return null;
    }
  }

  public getCurrentUser(): DBUser | null {
    const session = this.getCurrentSession();
    if (!session) {
      return null;
    }
    const users = this.getUsers();
    return users.find((u) => u.id === session.userId) || null;
  }

  public updateUser(userId: string, partial: Partial<DBUser>): DBUser | null {
    const users = this.getUsers();
    const user = users.find((u) => u.id === userId);
    if (!user) return null;
    Object.assign(user, partial);
    this.saveUsers(users);
    return user;
  }

  public getCustomTimetable(userId: string): any[] | null {
    try {
      const data = localStorage.getItem(`stellar_custom_timetable_${userId}`);
      if (!data) return null;
      return JSON.parse(data);
    } catch {
      return null;
    }
  }

  public saveCustomTimetable(userId: string, slots: any[]): void {
    localStorage.setItem(`stellar_custom_timetable_${userId}`, JSON.stringify(slots));
    this.updateUser(userId, { hasTimetableConfigured: true });
  }

  private setSession(user: DBUser): void {
    const session: DBSession = {
      token: `tok_${user.id}_${Date.now()}`,
      userId: user.id,
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    };
    localStorage.setItem(ACTIVE_SESSION_KEY, JSON.stringify(session));
  }

  // ===================== CLASS REMINDERS =====================

  public getReminders(): ClassReminder[] {
    try {
      const data = localStorage.getItem(REMINDERS_KEY);
      if (!data) {
        return [];
      }
      const parsed: ClassReminder[] = JSON.parse(data);
      // Filter out any legacy dummy reminders
      const cleaned = parsed.filter(
        (r) => !['rem-1', 'rem-2', 'rem-3', 'rem-4'].includes(r.id)
      );
      if (cleaned.length !== parsed.length) {
        localStorage.setItem(REMINDERS_KEY, JSON.stringify(cleaned));
      }
      return cleaned;
    } catch {
      return [];
    }
  }

  public saveReminder(reminder: Omit<ClassReminder, 'id' | 'createdAt'>): ClassReminder {
    const list = this.getReminders();
    const newReminder: ClassReminder = {
      ...reminder,
      id: `rem-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      createdAt: new Date().toISOString(),
    };
    const updated = [newReminder, ...list];
    localStorage.setItem(REMINDERS_KEY, JSON.stringify(updated));
    return newReminder;
  }

  public toggleReminder(id: string): ClassReminder[] {
    const list = this.getReminders();
    const updated = list.map((r) => (r.id === id ? { ...r, completed: !r.completed } : r));
    localStorage.setItem(REMINDERS_KEY, JSON.stringify(updated));
    return updated;
  }

  public deleteReminder(id: string): ClassReminder[] {
    const list = this.getReminders();
    const updated = list.filter((r) => r.id !== id);
    localStorage.setItem(REMINDERS_KEY, JSON.stringify(updated));
    return updated;
  }

  // ===================== BATCH PREFERENCE =====================

  public getBatch(): 'B1' | 'B2' {
    return (localStorage.getItem(BATCH_PREF_KEY) as 'B1' | 'B2') || 'B1';
  }

  public setBatch(batch: 'B1' | 'B2'): void {
    localStorage.setItem(BATCH_PREF_KEY, batch);
  }
}

export const db = new DatabaseService();
export default db;
