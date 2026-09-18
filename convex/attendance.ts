// Convex Attendance Management Functions
// Teacher creates sessions, marks attendance, student views attendance

import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// ============================================================
// ATTENDANCE SESSIONS
// ============================================================

export const createSession = mutation({
  args: {
    subjectId: v.id("subjects"),
    sectionId: v.id("sections"),
    teacherId: v.id("users"),
    date: v.string(),
    startTime: v.optional(v.string()),
    endTime: v.optional(v.string()),
    topic: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const sessionId = await ctx.db.insert("attendanceSessions", {
      ...args,
      status: "open",
      createdAt: new Date().toISOString(),
    });
    return sessionId;
  },
});

export const closeSession = mutation({
  args: { sessionId: v.id("attendanceSessions") },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.sessionId, { status: "closed" });
    return { success: true };
  },
});

export const getSessionsByTeacher = query({
  args: { teacherId: v.id("users") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("attendanceSessions")
      .withIndex("by_teacherId", (q) => q.eq("teacherId", args.teacherId))
      .collect();
  },
});

export const getSessionsBySection = query({
  args: { sectionId: v.id("sections") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("attendanceSessions")
      .withIndex("by_sectionId", (q) => q.eq("sectionId", args.sectionId))
      .collect();
  },
});

export const getSessionsBySubject = query({
  args: { subjectId: v.id("subjects") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("attendanceSessions")
      .withIndex("by_subjectId", (q) => q.eq("subjectId", args.subjectId))
      .collect();
  },
});

// ============================================================
// ATTENDANCE RECORDS
// ============================================================

export const markAttendance = mutation({
  args: {
    sessionId: v.id("attendanceSessions"),
    studentId: v.id("users"),
    status: v.union(v.literal("present"), v.literal("absent"), v.literal("late")),
    markedBy: v.id("users"),
  },
  handler: async (ctx, args) => {
    // Check for duplicate
    const existing = await ctx.db
      .query("attendanceRecords")
      .withIndex("by_session_student", (q) =>
        q.eq("sessionId", args.sessionId).eq("studentId", args.studentId)
      )
      .first();

    if (existing) {
      // Update existing record
      await ctx.db.patch(existing._id, {
        status: args.status,
        markedAt: new Date().toISOString(),
        markedBy: args.markedBy,
      });
      return existing._id;
    }

    return await ctx.db.insert("attendanceRecords", {
      sessionId: args.sessionId,
      studentId: args.studentId,
      status: args.status,
      markedAt: new Date().toISOString(),
      markedBy: args.markedBy,
    });
  },
});

export const batchMarkAttendance = mutation({
  args: {
    sessionId: v.id("attendanceSessions"),
    records: v.array(v.object({
      studentId: v.id("users"),
      status: v.union(v.literal("present"), v.literal("absent"), v.literal("late")),
    })),
    markedBy: v.id("users"),
  },
  handler: async (ctx, args) => {
    const now = new Date().toISOString();
    for (const record of args.records) {
      const existing = await ctx.db
        .query("attendanceRecords")
        .withIndex("by_session_student", (q) =>
          q.eq("sessionId", args.sessionId).eq("studentId", record.studentId)
        )
        .first();

      if (existing) {
        await ctx.db.patch(existing._id, {
          status: record.status,
          markedAt: now,
          markedBy: args.markedBy,
        });
      } else {
        await ctx.db.insert("attendanceRecords", {
          sessionId: args.sessionId,
          studentId: record.studentId,
          status: record.status,
          markedAt: now,
          markedBy: args.markedBy,
        });
      }
    }
    return { success: true, count: args.records.length };
  },
});

export const getRecordsBySession = query({
  args: { sessionId: v.id("attendanceSessions") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("attendanceRecords")
      .withIndex("by_sessionId", (q) => q.eq("sessionId", args.sessionId))
      .collect();
  },
});

export const getRecordsByStudent = query({
  args: { studentId: v.id("users") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("attendanceRecords")
      .withIndex("by_studentId", (q) => q.eq("studentId", args.studentId))
      .collect();
  },
});

// ============================================================
// ATTENDANCE ANALYTICS
// ============================================================

export const getStudentAttendanceSummary = query({
  args: { studentId: v.id("users") },
  handler: async (ctx, args) => {
    const records = await ctx.db
      .query("attendanceRecords")
      .withIndex("by_studentId", (q) => q.eq("studentId", args.studentId))
      .collect();

    // Get session details for each record
    const sessionMap = new Map();
    for (const record of records) {
      if (!sessionMap.has(record.sessionId)) {
        const session = await ctx.db.get(record.sessionId);
        if (session) {
          sessionMap.set(record.sessionId, session);
        }
      }
    }

    // Group by subject
    const subjectStats: Record<string, { present: number; absent: number; late: number; total: number; subjectId: string }> = {};
    for (const record of records) {
      const session = sessionMap.get(record.sessionId);
      if (!session) continue;
      const subjectId = session.subjectId as string;
      if (!subjectStats[subjectId]) {
        subjectStats[subjectId] = { present: 0, absent: 0, late: 0, total: 0, subjectId };
      }
      subjectStats[subjectId].total++;
      if (record.status === "present" || record.status === "late") {
        subjectStats[subjectId].present++;
      }
      if (record.status === "absent") {
        subjectStats[subjectId].absent++;
      }
      if (record.status === "late") {
        subjectStats[subjectId].late++;
      }
    }

    return subjectStats;
  },
});
