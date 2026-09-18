// Convex Assessment & Marks Management Functions

import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// ============================================================
// ASSESSMENTS
// ============================================================

export const createAssessment = mutation({
  args: {
    subjectId: v.id("subjects"),
    sectionId: v.id("sections"),
    teacherId: v.id("users"),
    title: v.string(),
    type: v.union(
      v.literal("quiz"),
      v.literal("assignment"),
      v.literal("cia"),
      v.literal("mid_sem"),
      v.literal("end_sem"),
      v.literal("lab"),
      v.literal("project"),
      v.literal("practical")
    ),
    maxMarks: v.float64(),
    date: v.optional(v.string()),
    topic: v.optional(v.string()),
    description: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("assessments", {
      ...args,
      isPublished: false,
      createdAt: new Date().toISOString(),
    });
  },
});

export const updateAssessment = mutation({
  args: {
    assessmentId: v.id("assessments"),
    title: v.optional(v.string()),
    maxMarks: v.optional(v.float64()),
    date: v.optional(v.string()),
    topic: v.optional(v.string()),
    description: v.optional(v.string()),
    isPublished: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const { assessmentId, ...updates } = args;
    const cleanUpdates: Record<string, any> = {};
    for (const [key, value] of Object.entries(updates)) {
      if (value !== undefined) cleanUpdates[key] = value;
    }
    await ctx.db.patch(assessmentId, cleanUpdates);
    return await ctx.db.get(assessmentId);
  },
});

export const publishAssessment = mutation({
  args: { assessmentId: v.id("assessments") },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.assessmentId, { isPublished: true });
    return { success: true };
  },
});

export const getAssessmentsByTeacher = query({
  args: { teacherId: v.id("users") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("assessments")
      .withIndex("by_teacherId", (q) => q.eq("teacherId", args.teacherId))
      .collect();
  },
});

export const getAssessmentsBySection = query({
  args: { sectionId: v.id("sections") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("assessments")
      .withIndex("by_sectionId", (q) => q.eq("sectionId", args.sectionId))
      .collect();
  },
});

export const getAssessmentsBySubject = query({
  args: { subjectId: v.id("subjects") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("assessments")
      .withIndex("by_subjectId", (q) => q.eq("subjectId", args.subjectId))
      .collect();
  },
});

// ============================================================
// MARKS
// ============================================================

export const enterMarks = mutation({
  args: {
    assessmentId: v.id("assessments"),
    studentId: v.id("users"),
    marks: v.float64(),
    remarks: v.optional(v.string()),
    gradedBy: v.id("users"),
  },
  handler: async (ctx, args) => {
    // Validate marks against max
    const assessment = await ctx.db.get(args.assessmentId);
    if (!assessment) {
      return { success: false, error: "Assessment not found." };
    }
    if (args.marks > assessment.maxMarks) {
      return { success: false, error: `Marks cannot exceed maximum (${assessment.maxMarks}).` };
    }
    if (args.marks < 0) {
      return { success: false, error: "Marks cannot be negative." };
    }

    // Check for existing marks
    const existing = await ctx.db
      .query("assessmentMarks")
      .withIndex("by_assessment_student", (q) =>
        q.eq("assessmentId", args.assessmentId).eq("studentId", args.studentId)
      )
      .first();

    if (existing) {
      await ctx.db.patch(existing._id, {
        marks: args.marks,
        remarks: args.remarks,
        gradedBy: args.gradedBy,
        gradedAt: new Date().toISOString(),
      });
      return { success: true, markId: existing._id };
    }

    const markId = await ctx.db.insert("assessmentMarks", {
      assessmentId: args.assessmentId,
      studentId: args.studentId,
      marks: args.marks,
      remarks: args.remarks,
      gradedBy: args.gradedBy,
      gradedAt: new Date().toISOString(),
    });

    return { success: true, markId };
  },
});

export const batchEnterMarks = mutation({
  args: {
    assessmentId: v.id("assessments"),
    entries: v.array(v.object({
      studentId: v.id("users"),
      marks: v.float64(),
      remarks: v.optional(v.string()),
    })),
    gradedBy: v.id("users"),
  },
  handler: async (ctx, args) => {
    const assessment = await ctx.db.get(args.assessmentId);
    if (!assessment) {
      return { success: false, error: "Assessment not found." };
    }

    const now = new Date().toISOString();
    let count = 0;

    for (const entry of args.entries) {
      if (entry.marks > assessment.maxMarks || entry.marks < 0) continue;

      const existing = await ctx.db
        .query("assessmentMarks")
        .withIndex("by_assessment_student", (q) =>
          q.eq("assessmentId", args.assessmentId).eq("studentId", entry.studentId)
        )
        .first();

      if (existing) {
        await ctx.db.patch(existing._id, {
          marks: entry.marks,
          remarks: entry.remarks,
          gradedBy: args.gradedBy,
          gradedAt: now,
        });
      } else {
        await ctx.db.insert("assessmentMarks", {
          assessmentId: args.assessmentId,
          studentId: entry.studentId,
          marks: entry.marks,
          remarks: entry.remarks,
          gradedBy: args.gradedBy,
          gradedAt: now,
        });
      }
      count++;
    }

    return { success: true, count };
  },
});

export const getMarksByAssessment = query({
  args: { assessmentId: v.id("assessments") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("assessmentMarks")
      .withIndex("by_assessmentId", (q) => q.eq("assessmentId", args.assessmentId))
      .collect();
  },
});

export const getMarksByStudent = query({
  args: { studentId: v.id("users") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("assessmentMarks")
      .withIndex("by_studentId", (q) => q.eq("studentId", args.studentId))
      .collect();
  },
});
