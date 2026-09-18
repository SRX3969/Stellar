// Convex Academic Structure Management (Departments, Programs, Sections, Subjects)

import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// ============================================================
// DEPARTMENTS
// ============================================================

export const createDepartment = mutation({
  args: {
    name: v.string(),
    code: v.string(),
    hodName: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("departments", {
      ...args,
      isActive: true,
      createdAt: new Date().toISOString(),
    });
  },
});

export const getDepartments = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("departments").collect();
  },
});

export const updateDepartment = mutation({
  args: {
    departmentId: v.id("departments"),
    name: v.optional(v.string()),
    code: v.optional(v.string()),
    hodName: v.optional(v.string()),
    isActive: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const { departmentId, ...updates } = args;
    const clean: Record<string, any> = {};
    for (const [k, val] of Object.entries(updates)) {
      if (val !== undefined) clean[k] = val;
    }
    await ctx.db.patch(departmentId, clean);
    return await ctx.db.get(departmentId);
  },
});

// ============================================================
// PROGRAMS
// ============================================================

export const createProgram = mutation({
  args: {
    name: v.string(),
    code: v.string(),
    departmentId: v.id("departments"),
    durationYears: v.float64(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("programs", {
      ...args,
      isActive: true,
      createdAt: new Date().toISOString(),
    });
  },
});

export const getPrograms = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("programs").collect();
  },
});

export const getProgramsByDepartment = query({
  args: { departmentId: v.id("departments") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("programs")
      .withIndex("by_departmentId", (q) => q.eq("departmentId", args.departmentId))
      .collect();
  },
});

// ============================================================
// SECTIONS
// ============================================================

export const createSection = mutation({
  args: {
    name: v.string(),
    programId: v.id("programs"),
    academicYear: v.string(),
    semester: v.string(),
    classTeacher: v.optional(v.string()),
    coClassTeacher: v.optional(v.string()),
    roomNo: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("sections", {
      ...args,
      isActive: true,
      createdAt: new Date().toISOString(),
    });
  },
});

export const getSections = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("sections").collect();
  },
});

export const getSectionsByProgram = query({
  args: { programId: v.id("programs") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("sections")
      .withIndex("by_programId", (q) => q.eq("programId", args.programId))
      .collect();
  },
});

// ============================================================
// SUBJECTS
// ============================================================

export const createSubject = mutation({
  args: {
    code: v.string(),
    name: v.string(),
    credits: v.float64(),
    category: v.union(
      v.literal("theory"),
      v.literal("lab"),
      v.literal("honours"),
      v.literal("aec"),
      v.literal("holistic"),
      v.literal("other")
    ),
    departmentId: v.optional(v.id("departments")),
    semester: v.optional(v.string()),
    maxMarks: v.optional(v.float64()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("subjects", {
      ...args,
      isActive: true,
      createdAt: new Date().toISOString(),
    });
  },
});

export const getSubjects = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("subjects").collect();
  },
});

export const getSubjectsByDepartment = query({
  args: { departmentId: v.id("departments") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("subjects")
      .withIndex("by_departmentId", (q) => q.eq("departmentId", args.departmentId))
      .collect();
  },
});

export const updateSubject = mutation({
  args: {
    subjectId: v.id("subjects"),
    name: v.optional(v.string()),
    credits: v.optional(v.float64()),
    isActive: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const { subjectId, ...updates } = args;
    const clean: Record<string, any> = {};
    for (const [k, val] of Object.entries(updates)) {
      if (val !== undefined) clean[k] = val;
    }
    await ctx.db.patch(subjectId, clean);
    return await ctx.db.get(subjectId);
  },
});

// ============================================================
// TEACHER ASSIGNMENTS
// ============================================================

export const assignTeacher = mutation({
  args: {
    teacherId: v.id("users"),
    subjectId: v.id("subjects"),
    sectionId: v.id("sections"),
    academicYear: v.string(),
    room: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("teacherAssignments", {
      ...args,
      isActive: true,
      createdAt: new Date().toISOString(),
    });
  },
});

export const getAssignmentsByTeacher = query({
  args: { teacherId: v.id("users") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("teacherAssignments")
      .withIndex("by_teacherId", (q) => q.eq("teacherId", args.teacherId))
      .collect();
  },
});

export const getAssignmentsBySection = query({
  args: { sectionId: v.id("sections") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("teacherAssignments")
      .withIndex("by_sectionId", (q) => q.eq("sectionId", args.sectionId))
      .collect();
  },
});

// ============================================================
// ENROLLMENTS
// ============================================================

export const enrollStudent = mutation({
  args: {
    studentId: v.id("users"),
    sectionId: v.id("sections"),
    academicYear: v.string(),
  },
  handler: async (ctx, args) => {
    // Check duplicate enrollment
    const existing = await ctx.db
      .query("enrollments")
      .withIndex("by_student_section", (q) =>
        q.eq("studentId", args.studentId).eq("sectionId", args.sectionId)
      )
      .first();

    if (existing) {
      return { success: false, error: "Student already enrolled in this section." };
    }

    const enrollmentId = await ctx.db.insert("enrollments", {
      ...args,
      isActive: true,
      enrolledAt: new Date().toISOString(),
    });

    return { success: true, enrollmentId };
  },
});

export const getEnrollmentsBySection = query({
  args: { sectionId: v.id("sections") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("enrollments")
      .withIndex("by_sectionId", (q) => q.eq("sectionId", args.sectionId))
      .collect();
  },
});

export const getEnrollmentsByStudent = query({
  args: { studentId: v.id("users") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("enrollments")
      .withIndex("by_studentId", (q) => q.eq("studentId", args.studentId))
      .collect();
  },
});
