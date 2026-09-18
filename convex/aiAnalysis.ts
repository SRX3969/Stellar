// Convex AI / Academic Intelligence Functions
// Rule-based heuristic system for at-risk detection, topic analysis, and intervention recommendations

import { v } from "convex/values";
import { mutation, query, action } from "./_generated/server";
import { api } from "./_generated/api";

// ============================================================
// AI INSIGHTS QUERIES
// ============================================================

export const getInsightsBySection = query({
  args: { sectionId: v.id("sections") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("aiInsights")
      .withIndex("by_sectionId", (q) => q.eq("sectionId", args.sectionId))
      .collect();
  },
});

export const getInsightsByTeacher = query({
  args: { teacherId: v.id("users") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("aiInsights")
      .withIndex("by_teacherId", (q) => q.eq("teacherId", args.teacherId))
      .collect();
  },
});

export const getInsightsByType = query({
  args: {
    type: v.union(
      v.literal("at_risk"),
      v.literal("topic_weakness"),
      v.literal("attendance_trend"),
      v.literal("performance_trend"),
      v.literal("intervention"),
      v.literal("general")
    ),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("aiInsights")
      .withIndex("by_type", (q) => q.eq("type", args.type))
      .collect();
  },
});

export const getActiveInsights = query({
  args: {},
  handler: async (ctx) => {
    const all = await ctx.db.query("aiInsights").collect();
    return all.filter((i) => i.isActive);
  },
});

// ============================================================
// AI INSIGHT CREATION (called by analysis engine)
// ============================================================

export const createInsight = mutation({
  args: {
    type: v.union(
      v.literal("at_risk"),
      v.literal("topic_weakness"),
      v.literal("attendance_trend"),
      v.literal("performance_trend"),
      v.literal("intervention"),
      v.literal("general")
    ),
    targetType: v.union(v.literal("student"), v.literal("section"), v.literal("subject")),
    targetId: v.string(),
    teacherId: v.optional(v.id("users")),
    sectionId: v.optional(v.id("sections")),
    subjectId: v.optional(v.id("subjects")),
    title: v.string(),
    description: v.string(),
    severity: v.union(v.literal("info"), v.literal("warning"), v.literal("critical")),
    metrics: v.optional(v.string()),
    recommendations: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("aiInsights", {
      ...args,
      isActive: true,
      generatedAt: new Date().toISOString(),
    });
  },
});

export const dismissInsight = mutation({
  args: { insightId: v.id("aiInsights") },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.insightId, { isActive: false });
    return { success: true };
  },
});

// ============================================================
// ANALYSIS ENGINE (Rule-based heuristic)
// ============================================================

export const analyzeStudentRisk = query({
  args: { sectionId: v.id("sections") },
  handler: async (ctx, args) => {
    // Get all enrolled students
    const enrollments = await ctx.db
      .query("enrollments")
      .withIndex("by_sectionId", (q) => q.eq("sectionId", args.sectionId))
      .collect();

    const riskReport: Array<{
      studentId: string;
      studentName: string;
      riskLevel: "low" | "medium" | "high" | "critical";
      riskScore: number;
      factors: string[];
      metrics: {
        attendancePercentage: number;
        averageMarks: number;
        incompleteLabCount: number;
        totalAssessments: number;
        assessmentsBelow50: number;
      };
      recommendations: string[];
    }> = [];

    for (const enrollment of enrollments) {
      if (!enrollment.isActive) continue;

      const student = await ctx.db.get(enrollment.studentId);
      if (!student || !student.isActive) continue;

      // Get attendance records
      const attendanceRecords = await ctx.db
        .query("attendanceRecords")
        .withIndex("by_studentId", (q) => q.eq("studentId", enrollment.studentId))
        .collect();

      const totalClasses = attendanceRecords.length;
      const presentClasses = attendanceRecords.filter(
        (r) => r.status === "present" || r.status === "late"
      ).length;
      const attendancePercentage = totalClasses > 0
        ? Math.round((presentClasses / totalClasses) * 100)
        : 100;

      // Get assessment marks
      const marks = await ctx.db
        .query("assessmentMarks")
        .withIndex("by_studentId", (q) => q.eq("studentId", enrollment.studentId))
        .collect();

      let totalMarksPercentage = 0;
      let assessmentsBelow50 = 0;
      for (const mark of marks) {
        const assessment = await ctx.db.get(mark.assessmentId);
        if (assessment) {
          const pct = (mark.marks / assessment.maxMarks) * 100;
          totalMarksPercentage += pct;
          if (pct < 50) assessmentsBelow50++;
        }
      }
      const averageMarks = marks.length > 0
        ? Math.round(totalMarksPercentage / marks.length)
        : -1; // -1 = no data

      // Get lab records
      const labRecords = await ctx.db
        .query("labRecords")
        .withIndex("by_studentId", (q) => q.eq("studentId", enrollment.studentId))
        .collect();
      const incompleteLabCount = labRecords.filter(
        (l) => l.status === "pending" || l.status === "incomplete"
      ).length;

      // ============ RISK SCORING (Transparent heuristic) ============
      let riskScore = 0;
      const factors: string[] = [];
      const recommendations: string[] = [];

      // Attendance risk
      if (attendancePercentage < 65) {
        riskScore += 35;
        factors.push(`Critical attendance: ${attendancePercentage}% (below 65%)`);
        recommendations.push("Immediate attendance counseling required");
      } else if (attendancePercentage < 75) {
        riskScore += 25;
        factors.push(`Low attendance: ${attendancePercentage}% (below 75% criterion)`);
        recommendations.push("Follow up on attendance, schedule make-up sessions");
      } else if (attendancePercentage < 80) {
        riskScore += 10;
        factors.push(`Attendance watch: ${attendancePercentage}%`);
      }

      // Assessment risk
      if (averageMarks >= 0) {
        if (averageMarks < 35) {
          riskScore += 30;
          factors.push(`Very low assessment average: ${averageMarks}%`);
          recommendations.push("Additional tutoring and revision support needed");
        } else if (averageMarks < 50) {
          riskScore += 20;
          factors.push(`Below-average assessment performance: ${averageMarks}%`);
          recommendations.push("Review weak topics and provide practice material");
        } else if (averageMarks < 60) {
          riskScore += 10;
          factors.push(`Moderate assessment performance: ${averageMarks}%`);
        }
      }

      // Failed assessments
      if (assessmentsBelow50 >= 3) {
        riskScore += 15;
        factors.push(`${assessmentsBelow50} assessments scored below 50%`);
        recommendations.push("Identify specific weak topics across failed assessments");
      } else if (assessmentsBelow50 >= 2) {
        riskScore += 8;
        factors.push(`${assessmentsBelow50} assessments scored below 50%`);
      }

      // Lab risk
      if (incompleteLabCount >= 3) {
        riskScore += 15;
        factors.push(`${incompleteLabCount} incomplete lab records`);
        recommendations.push("Schedule lab completion sessions");
      } else if (incompleteLabCount >= 1) {
        riskScore += 5;
        factors.push(`${incompleteLabCount} pending lab record(s)`);
      }

      // Determine risk level
      let riskLevel: "low" | "medium" | "high" | "critical" = "low";
      if (riskScore >= 60) riskLevel = "critical";
      else if (riskScore >= 40) riskLevel = "high";
      else if (riskScore >= 20) riskLevel = "medium";

      if (riskScore > 0 || totalClasses > 0) {
        riskReport.push({
          studentId: enrollment.studentId as string,
          studentName: student.fullName,
          riskLevel,
          riskScore: Math.min(100, riskScore),
          factors,
          metrics: {
            attendancePercentage,
            averageMarks: averageMarks >= 0 ? averageMarks : 0,
            incompleteLabCount,
            totalAssessments: marks.length,
            assessmentsBelow50,
          },
          recommendations,
        });
      }
    }

    // Sort by risk score descending
    riskReport.sort((a, b) => b.riskScore - a.riskScore);
    return riskReport;
  },
});

export const analyzeTopicPerformance = query({
  args: { subjectId: v.id("subjects"), sectionId: v.id("sections") },
  handler: async (ctx, args) => {
    const assessments = await ctx.db
      .query("assessments")
      .withIndex("by_subject_section", (q) =>
        q.eq("subjectId", args.subjectId).eq("sectionId", args.sectionId)
      )
      .collect();

    const topicStats: Record<string, {
      topic: string;
      assessmentCount: number;
      totalStudents: number;
      averagePercentage: number;
      below50Count: number;
      above80Count: number;
    }> = {};

    for (const assessment of assessments) {
      if (!assessment.topic || !assessment.isPublished) continue;
      const topic = assessment.topic;

      const marks = await ctx.db
        .query("assessmentMarks")
        .withIndex("by_assessmentId", (q) => q.eq("assessmentId", assessment._id))
        .collect();

      if (marks.length === 0) continue;

      if (!topicStats[topic]) {
        topicStats[topic] = {
          topic,
          assessmentCount: 0,
          totalStudents: 0,
          averagePercentage: 0,
          below50Count: 0,
          above80Count: 0,
        };
      }

      topicStats[topic].assessmentCount++;
      let totalPct = 0;
      for (const mark of marks) {
        const pct = (mark.marks / assessment.maxMarks) * 100;
        totalPct += pct;
        topicStats[topic].totalStudents++;
        if (pct < 50) topicStats[topic].below50Count++;
        if (pct >= 80) topicStats[topic].above80Count++;
      }
      topicStats[topic].averagePercentage = Math.round(
        totalPct / marks.length
      );
    }

    return Object.values(topicStats).sort(
      (a, b) => a.averagePercentage - b.averagePercentage
    );
  },
});

export const generateSectionInsights = query({
  args: { sectionId: v.id("sections") },
  handler: async (ctx, args) => {
    const enrollments = await ctx.db
      .query("enrollments")
      .withIndex("by_sectionId", (q) => q.eq("sectionId", args.sectionId))
      .collect();

    const activeEnrollments = enrollments.filter((e) => e.isActive);
    const totalStudents = activeEnrollments.length;

    // Calculate section-level metrics
    let totalAttendancePct = 0;
    let studentsWithLowAttendance = 0;
    let totalMarksPct = 0;
    let studentsWithMarks = 0;

    for (const enrollment of activeEnrollments) {
      const records = await ctx.db
        .query("attendanceRecords")
        .withIndex("by_studentId", (q) => q.eq("studentId", enrollment.studentId))
        .collect();

      if (records.length > 0) {
        const present = records.filter((r) => r.status === "present" || r.status === "late").length;
        const pct = (present / records.length) * 100;
        totalAttendancePct += pct;
        if (pct < 75) studentsWithLowAttendance++;
      }

      const marks = await ctx.db
        .query("assessmentMarks")
        .withIndex("by_studentId", (q) => q.eq("studentId", enrollment.studentId))
        .collect();

      if (marks.length > 0) {
        let studentAvg = 0;
        for (const mark of marks) {
          const assessment = await ctx.db.get(mark.assessmentId);
          if (assessment) {
            studentAvg += (mark.marks / assessment.maxMarks) * 100;
          }
        }
        totalMarksPct += studentAvg / marks.length;
        studentsWithMarks++;
      }
    }

    const avgAttendance = totalStudents > 0 ? Math.round(totalAttendancePct / totalStudents) : 0;
    const avgPerformance = studentsWithMarks > 0 ? Math.round(totalMarksPct / studentsWithMarks) : 0;

    const insights: string[] = [];

    if (studentsWithLowAttendance > 0) {
      insights.push(
        `${studentsWithLowAttendance} of ${totalStudents} students have attendance below 75% criterion.`
      );
    }

    if (avgAttendance < 80) {
      insights.push(
        `Section average attendance is ${avgAttendance}%, which is below the recommended 80% threshold.`
      );
    }

    if (avgPerformance > 0 && avgPerformance < 60) {
      insights.push(
        `Section average assessment performance is ${avgPerformance}%. Consider topic revision sessions.`
      );
    }

    if (avgPerformance >= 75) {
      insights.push(
        `Strong section performance: ${avgPerformance}% average across assessments.`
      );
    }

    return {
      totalStudents,
      avgAttendance,
      avgPerformance,
      studentsWithLowAttendance,
      insights,
    };
  },
});
