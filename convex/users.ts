// Convex Authentication & User Management Functions
// Server-side auth with role-based access control

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
// REGISTRATION
// ============================================================

export const register = mutation({
  args: {
    email: v.string(),
    password: v.string(),
    fullName: v.string(),
    role: v.optional(v.union(v.literal("admin"), v.literal("teacher"), v.literal("student"))),
    batch: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const cleanEmail = args.email.trim().toLowerCase();

    // Check if user already exists
    const existing = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", cleanEmail))
      .first();

    if (existing) {
      return { success: false, error: "An account with this email already exists." };
    }

    const passwordHash = await hashPassword(args.password);
    const now = new Date().toISOString();

    const userId = await ctx.db.insert("users", {
      email: cleanEmail,
      fullName: args.fullName.trim(),
      passwordHash,
      role: args.role || "student",
      isActive: true,
      batch: args.batch || "B1",
      semester: "III Sem",
      course: "B.Tech AI & Data Science",
      university: "School of Engineering & Technology",
      studentId: args.role === "student" || !args.role
        ? `AI26-BTECH-${Math.floor(100 + Math.random() * 900)}`
        : undefined,
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
// LOGIN
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
// USER MUTATIONS (Admin)
// ============================================================

export const createUser = mutation({
  args: {
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

    const existing = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", cleanEmail))
      .first();

    if (existing) {
      return { success: false, error: "Email already registered." };
    }

    const passwordHash = await hashPassword(args.password);
    const now = new Date().toISOString();

    const userId = await ctx.db.insert("users", {
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
// SEED DATA (Initial admin user)
// ============================================================

export const seedAdminUser = mutation({
  args: {},
  handler: async (ctx) => {
    const existing = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", "admin@stellar.edu"))
      .first();

    if (existing) {
      return { success: false, message: "Admin user already exists." };
    }

    const passwordHash = await hashPassword("StellarAdmin@2026");
    const now = new Date().toISOString();

    // Create admin
    await ctx.db.insert("users", {
      email: "admin@stellar.edu",
      fullName: "System Administrator",
      passwordHash,
      role: "admin",
      isActive: true,
      department: "Administration",
      designation: "System Administrator",
      onboardingCompleted: true,
      hasTimetableConfigured: true,
      createdAt: now,
      lastLoginAt: now,
    });

    // Create sample teacher
    const teacherHash = await hashPassword("StellarTeacher@2026");
    await ctx.db.insert("users", {
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

    // Create sample student (existing Abhiram user)
    const studentHash = await hashPassword("StellarAI@2026");
    await ctx.db.insert("users", {
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

    return { success: true, message: "Seed users created: admin, teacher, student." };
  },
});
