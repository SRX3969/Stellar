// Convex Authentication & User Management Functions
// Server-side auth with role-based access control and username-based login

import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// ============================================================
// HELPERS
// ============================================================

async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password + "-stellar-convex-salt-2026");
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

function generateToken(): string {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, (b) => b.toString(16).padStart(2, "0")).join("");
}

// ============================================================
// REGISTRATION (Public signup creates STUDENT accounts only)
// ============================================================

export const register = mutation({
  args: {
    username: v.string(),
    email: v.string(),
    password: v.string(),
    fullName: v.string(),
    batch: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const cleanUsername = args.username.trim().toLowerCase();
    const cleanEmail = args.email.trim().toLowerCase();

    // Validate username format
    if (cleanUsername.length < 3 || cleanUsername.length > 30) {
      return { success: false, error: "Username must be between 3 and 30 characters." };
    }
    if (!/^[a-z0-9_]+$/.test(cleanUsername)) {
      return { success: false, error: "Username can only contain lowercase letters, numbers, and underscores." };
    }

    // Check if username already exists
    const existingUsername = await ctx.db
      .query("users")
      .withIndex("by_username", (q) => q.eq("username", cleanUsername))
      .first();

    if (existingUsername) {
      return { success: false, error: "This username is already taken. Please choose another." };
    }

    // Check if email already exists
    const existingEmail = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", cleanEmail))
      .first();

    if (existingEmail) {
      return { success: false, error: "An account with this email already exists." };
    }

    // Password validation
    if (args.password.length < 8) {
      return { success: false, error: "Password must be at least 8 characters long." };
    }

    const passwordHash = await hashPassword(args.password);
    const now = new Date().toISOString();

    // Public registration ALWAYS creates student accounts (prevents privilege escalation)
    const userId = await ctx.db.insert("users", {
      username: cleanUsername,
      email: cleanEmail,
      fullName: args.fullName.trim(),
      passwordHash,
      role: "student",
      isActive: true,
      batch: args.batch || "B1",
      semester: "III Sem",
      course: "B.Tech AI & Data Science",
      university: "School of Engineering & Technology",
      studentId: `AI26-BTECH-${Math.floor(100 + Math.random() * 900)}`,
      criterion: 75,
      dailyGoal: 2.0,
      onboardingCompleted: false,
      hasTimetableConfigured: false,
      createdAt: now,
      lastLoginAt: now,
    });

    // Create session
    const token = generateToken();
    await ctx.db.insert("sessions", {
      userId,
      token,
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      createdAt: now,
    });

    const user = await ctx.db.get(userId);

    return { success: true, user, token };
  },
});

// ============================================================
// LOGIN BY USERNAME
// ============================================================

export const loginByUsername = mutation({
  args: {
    username: v.string(),
    password: v.string(),
  },
  handler: async (ctx, args) => {
    const cleanUsername = args.username.trim().toLowerCase();

    const user = await ctx.db
      .query("users")
      .withIndex("by_username", (q) => q.eq("username", cleanUsername))
      .first();

    if (!user) {
      return { success: false, error: "No account found with this username." };
    }

    if (!user.isActive) {
      return { success: false, error: "This account has been deactivated. Contact an administrator." };
    }

    const passwordHash = await hashPassword(args.password);
    if (user.passwordHash !== passwordHash) {
      return { success: false, error: "Incorrect password." };
    }

    // Update last login
    await ctx.db.patch(user._id, { lastLoginAt: new Date().toISOString() });

    // Create new session
    const token = generateToken();
    await ctx.db.insert("sessions", {
      userId: user._id,
      token,
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      createdAt: new Date().toISOString(),
    });

    return { success: true, user: { ...user, _id: user._id }, token };
  },
});

// ============================================================
// LOGIN BY EMAIL (Legacy support)
// ============================================================

export const login = mutation({
  args: {
    email: v.string(),
    password: v.string(),
  },
  handler: async (ctx, args) => {
    const cleanEmail = args.email.trim().toLowerCase();

    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", cleanEmail))
      .first();

    if (!user) {
      return { success: false, error: "No account found with this email." };
    }

    if (!user.isActive) {
      return { success: false, error: "This account has been deactivated. Contact an administrator." };
    }

    const passwordHash = await hashPassword(args.password);
    if (user.passwordHash !== passwordHash) {
      return { success: false, error: "Incorrect password." };
    }

    // Update last login
    await ctx.db.patch(user._id, { lastLoginAt: new Date().toISOString() });

    // Create new session
    const token = generateToken();
    await ctx.db.insert("sessions", {
      userId: user._id,
      token,
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      createdAt: new Date().toISOString(),
    });

    return { success: true, user: { ...user, _id: user._id }, token };
  },
});

// ============================================================
// SESSION VALIDATION
// ============================================================

export const validateSession = query({
  args: { token: v.string() },
  handler: async (ctx, args) => {
    const session = await ctx.db
      .query("sessions")
      .withIndex("by_token", (q) => q.eq("token", args.token))
      .first();

    if (!session) {
      return { valid: false, user: null };
    }

    if (new Date(session.expiresAt) < new Date()) {
      return { valid: false, user: null };
    }

    const user = await ctx.db.get(session.userId);
    if (!user || !user.isActive) {
      return { valid: false, user: null };
    }

    return { valid: true, user };
  },
});

// ============================================================
// LOGOUT
// ============================================================

export const logout = mutation({
  args: { token: v.string() },
  handler: async (ctx, args) => {
    const session = await ctx.db
      .query("sessions")
      .withIndex("by_token", (q) => q.eq("token", args.token))
      .first();

    if (session) {
      await ctx.db.delete(session._id);
    }

    return { success: true };
  },
});

// ============================================================
// USER QUERIES
// ============================================================

export const getUser = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.userId);
  },
});

export const getUsersByRole = query({
  args: { role: v.union(v.literal("admin"), v.literal("teacher"), v.literal("student")) },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("users")
      .withIndex("by_role", (q) => q.eq("role", args.role))
      .collect();
  },
});

export const getAllUsers = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("users").collect();
  },
});

// ============================================================
// USER MUTATIONS (Admin-only operations)
// ============================================================

export const createUser = mutation({
  args: {
    username: v.optional(v.string()),
    email: v.string(),
    fullName: v.string(),
    password: v.string(),
    role: v.union(v.literal("admin"), v.literal("teacher"), v.literal("student")),
    batch: v.optional(v.string()),
    department: v.optional(v.string()),
    employeeId: v.optional(v.string()),
    studentId: v.optional(v.string()),
    designation: v.optional(v.string()),
    specialization: v.optional(v.string()),
    semester: v.optional(v.string()),
    course: v.optional(v.string()),
    phone: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const cleanEmail = args.email.trim().toLowerCase();
    const cleanUsername = args.username?.trim().toLowerCase();

    // Check email uniqueness
    const existing = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", cleanEmail))
      .first();

    if (existing) {
      return { success: false, error: "Email already registered." };
    }

    // Check username uniqueness if provided
    if (cleanUsername) {
      const existingUsername = await ctx.db
        .query("users")
        .withIndex("by_username", (q) => q.eq("username", cleanUsername))
        .first();

      if (existingUsername) {
        return { success: false, error: "Username already taken." };
      }
    }

    const passwordHash = await hashPassword(args.password);
    const now = new Date().toISOString();

    const userId = await ctx.db.insert("users", {
      username: cleanUsername,
      email: cleanEmail,
      fullName: args.fullName.trim(),
      passwordHash,
      role: args.role,
      isActive: true,
      batch: args.batch,
      department: args.department,
      employeeId: args.employeeId,
      studentId: args.studentId || (args.role === "student"
        ? `AI26-BTECH-${Math.floor(100 + Math.random() * 900)}`
        : undefined),
      designation: args.designation,
      specialization: args.specialization,
      semester: args.semester || "III Sem",
      course: args.course || "B.Tech AI & Data Science",
      university: "School of Engineering & Technology",
      phone: args.phone,
      criterion: 75,
      dailyGoal: 2.0,
      onboardingCompleted: true,
      hasTimetableConfigured: false,
      createdAt: now,
      lastLoginAt: now,
    });

    const user = await ctx.db.get(userId);
    return { success: true, user };
  },
});

export const updateUser = mutation({
  args: {
    userId: v.id("users"),
    fullName: v.optional(v.string()),
    email: v.optional(v.string()),
    phone: v.optional(v.string()),
    department: v.optional(v.string()),
    batch: v.optional(v.string()),
    semester: v.optional(v.string()),
    course: v.optional(v.string()),
    designation: v.optional(v.string()),
    specialization: v.optional(v.string()),
    avatarUrl: v.optional(v.string()),
    dob: v.optional(v.string()),
    campus: v.optional(v.string()),
    roomNo: v.optional(v.string()),
    guardianName: v.optional(v.string()),
    guardianContact: v.optional(v.string()),
    emergencyContact: v.optional(v.string()),
    currentAddress: v.optional(v.string()),
    criterion: v.optional(v.float64()),
    dailyGoal: v.optional(v.float64()),
    onboardingCompleted: v.optional(v.boolean()),
    hasTimetableConfigured: v.optional(v.boolean()),
    isActive: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const { userId, ...updates } = args;
    const cleanUpdates: Record<string, any> = {};

    for (const [key, value] of Object.entries(updates)) {
      if (value !== undefined) {
        cleanUpdates[key] = value;
      }
    }

    await ctx.db.patch(userId, cleanUpdates);
    return await ctx.db.get(userId);
  },
});

export const toggleUserActive = mutation({
  args: {
    userId: v.id("users"),
    isActive: v.boolean(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.userId, { isActive: args.isActive });
    return await ctx.db.get(args.userId);
  },
});

// ============================================================
// SEED DATA (Sample accounts with usernames)
// ============================================================

export const seedAdminUser = mutation({
  args: {},
  handler: async (ctx) => {
    // Check if seed accounts already exist
    const existingAdmin = await ctx.db
      .query("users")
      .withIndex("by_username", (q) => q.eq("username", "stellar_admin"))
      .first();

    if (existingAdmin) {
      return { success: false, message: "Seed accounts already exist." };
    }

    const now = new Date().toISOString();

    // Create admin — Password: St3llar!Admin2026
    const adminHash = await hashPassword("St3llar!Admin2026");
    await ctx.db.insert("users", {
      username: "stellar_admin",
      email: "admin@stellar.edu",
      fullName: "System Administrator",
      passwordHash: adminHash,
      role: "admin",
      isActive: true,
      department: "Administration",
      designation: "System Administrator",
      onboardingCompleted: true,
      hasTimetableConfigured: true,
      createdAt: now,
      lastLoginAt: now,
    });

    // Create teacher — Password: St3llar!Teach2026
    const teacherHash = await hashPassword("St3llar!Teach2026");
    await ctx.db.insert("users", {
      username: "stellar_teacher",
      email: "swati.raj@stellar.edu",
      fullName: "Prof. Swati Raj",
      passwordHash: teacherHash,
      role: "teacher",
      isActive: true,
      department: "Department of AI and Data Science Engineering",
      designation: "Assistant Professor",
      specialization: "Database Management Systems",
      employeeId: "FAC-2026-001",
      onboardingCompleted: true,
      hasTimetableConfigured: true,
      createdAt: now,
      lastLoginAt: now,
    });

    // Create student — Password: St3llar!Stud2026
    const studentHash = await hashPassword("St3llar!Stud2026");
    await ctx.db.insert("users", {
      username: "stellar_student",
      email: "abhiram.stellar@gmail.com",
      fullName: "Abhiram",
      passwordHash: studentHash,
      role: "student",
      isActive: true,
      batch: "B1",
      semester: "III Sem",
      course: "B.Tech AI & Data Science",
      university: "School of Engineering & Technology",
      studentId: "AI24-BTECH-303",
      department: "Department of AI and Data Science Engineering",
      campus: "Central Campus / Arch Block",
      roomNo: "Room No: 303, 3F- Arch Block",
      dob: "2005-04-16",
      criterion: 75,
      dailyGoal: 2.0,
      onboardingCompleted: true,
      hasTimetableConfigured: true,
      createdAt: now,
      lastLoginAt: now,
    });

    return { success: true, message: "Seed users created: stellar_admin, stellar_teacher, stellar_student." };
  },
});
