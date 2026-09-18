// Convex Lab Records Management

import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const createLabRecord = mutation({
  args: {
    subjectId: v.id("subjects"),
    sectionId: v.id("sections"),
    studentId: v.id("users"),
    experimentNumber: v.float64(),
    experimentTitle: v.string(),
    date: v.string(),
    maxMarks: v.optional(v.float64()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("labRecords", {
      ...args,
      status: "pending",
      createdAt: new Date().toISOString(),
    });
  },
});

export const updateLabRecord = mutation({
  args: {
    recordId: v.id("labRecords"),
    status: v.optional(v.union(
      v.literal("pending"),
      v.literal("submitted"),
      v.literal("evaluated"),
      v.literal("incomplete")
    )),
    marks: v.optional(v.float64()),
    maxMarks: v.optional(v.float64()),
    remarks: v.optional(v.string()),
    evaluatedBy: v.optional(v.id("users")),
  },
  handler: async (ctx, args) => {
    const { recordId, ...updates } = args;
    const clean: Record<string, any> = {};
    for (const [k, val] of Object.entries(updates)) {
      if (val !== undefined) clean[k] = val;
    }
    if (updates.evaluatedBy) {
      clean.evaluatedAt = new Date().toISOString();
    }
    await ctx.db.patch(recordId, clean);
    return await ctx.db.get(recordId);
  },
});

export const getLabRecordsByStudent = query({
  args: { studentId: v.id("users") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("labRecords")
      .withIndex("by_studentId", (q) => q.eq("studentId", args.studentId))
      .collect();
  },
});

export const getLabRecordsBySubject = query({
  args: { subjectId: v.id("subjects") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("labRecords")
      .withIndex("by_subjectId", (q) => q.eq("subjectId", args.subjectId))
      .collect();
  },
});

export const getLabRecordsBySection = query({
  args: { sectionId: v.id("sections") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("labRecords")
      .withIndex("by_sectionId", (q) => q.eq("sectionId", args.sectionId))
      .collect();
  },
});

export const batchCreateLabRecords = mutation({
  args: {
    subjectId: v.id("subjects"),
    sectionId: v.id("sections"),
    experimentNumber: v.float64(),
    experimentTitle: v.string(),
    date: v.string(),
    maxMarks: v.optional(v.float64()),
    studentIds: v.array(v.id("users")),
  },
  handler: async (ctx, args) => {
    const now = new Date().toISOString();
    for (const studentId of args.studentIds) {
      await ctx.db.insert("labRecords", {
        subjectId: args.subjectId,
        sectionId: args.sectionId,
        studentId,
        experimentNumber: args.experimentNumber,
        experimentTitle: args.experimentTitle,
        date: args.date,
        maxMarks: args.maxMarks,
        status: "pending",
        createdAt: now,
      });
    }
    return { success: true, count: args.studentIds.length };
  },
});
