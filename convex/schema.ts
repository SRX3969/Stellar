// Convex Database Schema for STELLAR Academic Intelligence Platform
// Proper defineSchema() with validators for production deployment

import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // ============================================================
  // USERS & AUTHENTICATION
  // ============================================================

  users: defineTable({
    email: v.string(),
    fullName: v.string(),
    passwordHash: v.string(),
    role: v.union(v.literal("admin"), v.literal("teacher"), v.literal("student")),
    isActive: v.boolean(),
    // Student-specific
    batch: v.optional(v.string()),
    semester: v.optional(v.string()),
    course: v.optional(v.string()),
    university: v.optional(v.string()),
    studentId: v.optional(v.string()),
    registrationNumber: v.optional(v.string()),
    // Teacher-specific
    employeeId: v.optional(v.string()),
    designation: v.optional(v.string()),
    specialization: v.optional(v.string()),
    // Shared profile fields
    avatarUrl: v.optional(v.string()),
    dob: v.optional(v.string()),
    phone: v.optional(v.string()),
    department: v.optional(v.string()),
    campus: v.optional(v.string()),
    roomNo: v.optional(v.string()),
    guardianName: v.optional(v.string()),
    guardianContact: v.optional(v.string()),
    emergencyContact: v.optional(v.string()),
    currentAddress: v.optional(v.string()),
    // Preferences
    criterion: v.optional(v.float64()),
    dailyGoal: v.optional(v.float64()),
    onboardingCompleted: v.optional(v.boolean()),
    hasTimetableConfigured: v.optional(v.boolean()),
    // Metadata
    createdAt: v.string(),
    lastLoginAt: v.string(),
  })
    .index("by_email", ["email"])
    .index("by_role", ["role"])
    .index("by_studentId", ["studentId"])
    .index("by_employeeId", ["employeeId"])
    .index("by_department", ["department"]),

  sessions: defineTable({
    userId: v.id("users"),
    token: v.string(),
    expiresAt: v.string(),
    createdAt: v.string(),
  })
    .index("by_token", ["token"])
    .index("by_userId", ["userId"]),

  // ============================================================
  // ACADEMIC STRUCTURE
  // ============================================================

  departments: defineTable({
    name: v.string(),
    code: v.string(),
    hodName: v.optional(v.string()),
    isActive: v.boolean(),
    createdAt: v.string(),
  })
    .index("by_code", ["code"]),

  programs: defineTable({
    name: v.string(),
    code: v.string(),
    departmentId: v.id("departments"),
    durationYears: v.float64(),
    isActive: v.boolean(),
    createdAt: v.string(),
  })
    .index("by_departmentId", ["departmentId"])
    .index("by_code", ["code"]),

  sections: defineTable({
    name: v.string(),
    programId: v.id("programs"),
    academicYear: v.string(),
    semester: v.string(),
    classTeacher: v.optional(v.string()),
    coClassTeacher: v.optional(v.string()),
    roomNo: v.optional(v.string()),
    isActive: v.boolean(),
    createdAt: v.string(),
  })
    .index("by_programId", ["programId"])
    .index("by_academicYear", ["academicYear"]),

  subjects: defineTable({
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
    isActive: v.boolean(),
    createdAt: v.string(),
  })
    .index("by_code", ["code"])
    .index("by_departmentId", ["departmentId"]),

  // ============================================================
  // ASSIGNMENTS & ENROLLMENTS
  // ============================================================

  teacherAssignments: defineTable({
    teacherId: v.id("users"),
    subjectId: v.id("subjects"),
    sectionId: v.id("sections"),
    academicYear: v.string(),
    room: v.optional(v.string()),
    isActive: v.boolean(),
    createdAt: v.string(),
  })
    .index("by_teacherId", ["teacherId"])
    .index("by_subjectId", ["subjectId"])
    .index("by_sectionId", ["sectionId"])
    .index("by_teacher_section", ["teacherId", "sectionId"]),

  enrollments: defineTable({
    studentId: v.id("users"),
    sectionId: v.id("sections"),
    academicYear: v.string(),
    isActive: v.boolean(),
    enrolledAt: v.string(),
  })
    .index("by_studentId", ["studentId"])
    .index("by_sectionId", ["sectionId"])
    .index("by_student_section", ["studentId", "sectionId"]),

  // ============================================================
  // ATTENDANCE
  // ============================================================

  attendanceSessions: defineTable({
    subjectId: v.id("subjects"),
    sectionId: v.id("sections"),
    teacherId: v.id("users"),
    date: v.string(),
    startTime: v.optional(v.string()),
    endTime: v.optional(v.string()),
    topic: v.optional(v.string()),
    status: v.union(v.literal("open"), v.literal("closed")),
    createdAt: v.string(),
  })
    .index("by_subjectId", ["subjectId"])
    .index("by_sectionId", ["sectionId"])
    .index("by_teacherId", ["teacherId"])
    .index("by_date", ["date"])
    .index("by_subject_section_date", ["subjectId", "sectionId", "date"]),

  attendanceRecords: defineTable({
    sessionId: v.id("attendanceSessions"),
    studentId: v.id("users"),
    status: v.union(v.literal("present"), v.literal("absent"), v.literal("late")),
    markedAt: v.string(),
    markedBy: v.id("users"),
  })
    .index("by_sessionId", ["sessionId"])
    .index("by_studentId", ["studentId"])
    .index("by_session_student", ["sessionId", "studentId"]),

  // ============================================================
  // ASSESSMENTS & MARKS
  // ============================================================

  assessments: defineTable({
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
    isPublished: v.boolean(),
    createdAt: v.string(),
  })
    .index("by_subjectId", ["subjectId"])
    .index("by_sectionId", ["sectionId"])
    .index("by_teacherId", ["teacherId"])
    .index("by_type", ["type"])
    .index("by_subject_section", ["subjectId", "sectionId"]),

  assessmentMarks: defineTable({
    assessmentId: v.id("assessments"),
    studentId: v.id("users"),
    marks: v.float64(),
    remarks: v.optional(v.string()),
    gradedBy: v.id("users"),
    gradedAt: v.string(),
  })
    .index("by_assessmentId", ["assessmentId"])
    .index("by_studentId", ["studentId"])
    .index("by_assessment_student", ["assessmentId", "studentId"]),

  // ============================================================
  // LAB RECORDS
  // ============================================================

  labRecords: defineTable({
    subjectId: v.id("subjects"),
    sectionId: v.id("sections"),
    studentId: v.id("users"),
    experimentNumber: v.float64(),
    experimentTitle: v.string(),
    date: v.string(),
    status: v.union(
      v.literal("pending"),
      v.literal("submitted"),
      v.literal("evaluated"),
      v.literal("incomplete")
    ),
    marks: v.optional(v.float64()),
    maxMarks: v.optional(v.float64()),
    remarks: v.optional(v.string()),
    evaluatedBy: v.optional(v.id("users")),
    evaluatedAt: v.optional(v.string()),
    createdAt: v.string(),
  })
    .index("by_subjectId", ["subjectId"])
    .index("by_studentId", ["studentId"])
    .index("by_sectionId", ["sectionId"])
    .index("by_subject_student", ["subjectId", "studentId"]),

  // ============================================================
  // NOTIFICATIONS
  // ============================================================

  notifications: defineTable({
    userId: v.id("users"),
    title: v.string(),
    description: v.string(),
    type: v.union(
      v.literal("attendance"),
      v.literal("assessment"),
      v.literal("lab"),
      v.literal("deadline"),
      v.literal("system"),
      v.literal("ai_alert"),
      v.literal("general")
    ),
    priority: v.union(v.literal("urgent"), v.literal("normal")),
    read: v.boolean(),
    actionUrl: v.optional(v.string()),
    createdAt: v.string(),
  })
    .index("by_userId", ["userId"])
    .index("by_userId_read", ["userId", "read"]),

  // ============================================================
  // AI / ACADEMIC INTELLIGENCE
  // ============================================================

  aiInsights: defineTable({
    type: v.union(
      v.literal("at_risk"),
      v.literal("topic_weakness"),
      v.literal("attendance_trend"),
      v.literal("performance_trend"),
      v.literal("intervention"),
      v.literal("general")
    ),
    targetType: v.union(v.literal("student"), v.literal("section"), v.literal("subject")),
    targetId: v.string(), // ID of the target entity
    teacherId: v.optional(v.id("users")),
    sectionId: v.optional(v.id("sections")),
    subjectId: v.optional(v.id("subjects")),
    title: v.string(),
    description: v.string(),
    severity: v.union(v.literal("info"), v.literal("warning"), v.literal("critical")),
    metrics: v.optional(v.string()), // JSON stringified metrics
    recommendations: v.optional(v.string()), // JSON stringified recommendations
    isActive: v.boolean(),
    generatedAt: v.string(),
  })
    .index("by_targetId", ["targetId"])
    .index("by_type", ["type"])
    .index("by_sectionId", ["sectionId"])
    .index("by_teacherId", ["teacherId"]),

  // ============================================================
  // AUDIT LOG
  // ============================================================

  auditLogs: defineTable({
    actorId: v.id("users"),
    actorName: v.string(),
    actorRole: v.string(),
    action: v.string(),
    targetType: v.string(),
    targetId: v.optional(v.string()),
    targetName: v.optional(v.string()),
    details: v.optional(v.string()),
    timestamp: v.string(),
  })
    .index("by_actorId", ["actorId"])
    .index("by_action", ["action"])
    .index("by_timestamp", ["timestamp"]),

  // ============================================================
  // EXISTING STELLAR FEATURES (Preserved & Enhanced)
  // ============================================================

  tasks: defineTable({
    userId: v.id("users"),
    title: v.string(),
    subject: v.string(),
    priority: v.union(v.literal("urgent"), v.literal("high"), v.literal("medium"), v.literal("low")),
    deadline: v.string(),
    estimatedDuration: v.string(),
    completed: v.boolean(),
    section: v.union(v.literal("today"), v.literal("upcoming"), v.literal("overdue"), v.literal("completed")),
    createdAt: v.float64(),
  })
    .index("by_userId", ["userId"])
    .index("by_userId_completed", ["userId", "completed"]),

  classReminders: defineTable({
    userId: v.id("users"),
    courseCode: v.string(),
    courseName: v.string(),
    type: v.union(
      v.literal("submission"),
      v.literal("exam"),
      v.literal("quiz"),
      v.literal("lab_report"),
      v.literal("viva"),
      v.literal("reading"),
      v.literal("other")
    ),
    title: v.string(),
    description: v.optional(v.string()),
    dueDate: v.string(),
    dueTime: v.optional(v.string()),
    priorOffset: v.union(
      v.literal("15min"),
      v.literal("1hour"),
      v.literal("1day"),
      v.literal("2days"),
      v.literal("1week")
    ),
    completed: v.boolean(),
    priority: v.union(v.literal("urgent"), v.literal("high"), v.literal("medium"), v.literal("low")),
    createdAt: v.string(),
  })
    .index("by_userId", ["userId"]),

  timetableSlots: defineTable({
    day: v.union(
      v.literal("MON"),
      v.literal("TUE"),
      v.literal("WED"),
      v.literal("THU"),
      v.literal("FRI"),
      v.literal("SAT")
    ),
    period: v.float64(),
    span: v.optional(v.float64()),
    time: v.string(),
    startTime: v.string(),
    endTime: v.string(),
    courseCode: v.string(),
    courseName: v.string(),
    faculty: v.string(),
    room: v.optional(v.string()),
    batch: v.optional(v.string()),
    isLab: v.optional(v.boolean()),
    category: v.union(
      v.literal("theory"),
      v.literal("lab"),
      v.literal("honours"),
      v.literal("aec"),
      v.literal("holistic"),
      v.literal("other")
    ),
    sectionId: v.optional(v.id("sections")),
    createdAt: v.optional(v.string()),
  })
    .index("by_day", ["day"])
    .index("by_sectionId", ["sectionId"]),

  documents: defineTable({
    userId: v.id("users"),
    name: v.string(),
    folder: v.union(v.literal("academic"), v.literal("career"), v.literal("personal")),
    category: v.string(),
    fileType: v.union(v.literal("PDF"), v.literal("DOCX"), v.literal("PPT"), v.literal("IMG")),
    size: v.string(),
    status: v.union(v.literal("ready"), v.literal("processing")),
    updatedAt: v.string(),
  })
    .index("by_userId", ["userId"]),

  flashcards: defineTable({
    userId: v.optional(v.id("users")),
    subjectCode: v.string(),
    topic: v.string(),
    question: v.string(),
    answer: v.string(),
    difficulty: v.optional(v.union(v.literal("easy"), v.literal("medium"), v.literal("hard"))),
  })
    .index("by_subjectCode", ["subjectCode"]),

  routineSlots: defineTable({
    userId: v.id("users"),
    time: v.string(),
    endTime: v.string(),
    activity: v.string(),
    category: v.string(),
    type: v.union(v.literal("fixed"), v.literal("ai-adaptive")),
    notes: v.optional(v.string()),
  })
    .index("by_userId", ["userId"]),
});
