export type Priority = 'urgent' | 'high' | 'medium' | 'low';

export type AttendanceStatus = 'SAFE' | 'WATCH' | 'RISK' | 'CRITICAL';

export interface Task {
  id: string;
  title: string;
  subject: string;
  priority: Priority;
  deadline: string;
  estimatedDuration: string;
  completed: boolean;
  section: 'today' | 'upcoming' | 'overdue' | 'completed';
}

export interface Subject {
  id: string;
  code: string;
  name: string;
  professor: string;
  attendance: {
    present: number;
    total: number;
    percentage: number;
    criterion: number;
    status: AttendanceStatus;
  };
  syllabusCompletion: number;
  nextAssessment?: {
    name: string;
    date: string;
    daysLeft: number;
  };
  credits: number;
  room: string;
}

export interface TimelineItem {
  id: string;
  time: string;
  endTime?: string;
  title: string;
  subtitle: string;
  type: 'class' | 'assignment' | 'break' | 'study' | 'personal';
  subjectCode?: string;
  duration?: string;
  isCompleted?: boolean;
}

export interface AttentionItem {
  id: string;
  title: string;
  subtitle: string;
  daysRemaining?: number;
  metric?: string;
  status: 'critical' | 'warning' | 'info';
  type: 'assessment' | 'attendance' | 'assignment';
}

export interface Assessment {
  id: string;
  subjectCode: string;
  subjectName: string;
  title: string;
  type: 'CIA' | 'Mid-Sem' | 'End-Sem' | 'Assignment' | 'Lab' | 'Project';
  date: string;
  daysRemaining: number;
  maxMarks: number;
  status: 'Upcoming' | 'Submitted' | 'Graded';
  score?: number;
}

export interface DocumentItem {
  id: string;
  name: string;
  folder: 'academic' | 'career' | 'personal';
  category: string;
  fileType: 'PDF' | 'DOCX' | 'PPT' | 'IMG';
  size: string;
  updatedAt: string;
  status: 'ready' | 'processing';
}

export interface Flashcard {
  id: string;
  subjectCode: string;
  topic: string;
  question: string;
  answer: string;
  difficulty?: 'easy' | 'medium' | 'hard';
}

export interface AIMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  mode?: string;
  attachment?: {
    name: string;
    type: 'image' | 'pdf' | 'doc';
    url?: string;
  };
}

export interface NotificationItem {
  id: string;
  title: string;
  description: string;
  type: 'attendance' | 'deadline' | 'task' | 'study' | 'class';
  timestamp: string;
  read: boolean;
  priority: 'urgent' | 'normal';
}

export interface MockExamQuestion {
  id: string;
  question: string;
  options: string[];
  correctOptionIndex: number;
  explanation: string;
}

export interface UserProfile {
  name: string;
  email: string;
  university: string;
  course: string;
  semester: string;
  criterion: number;
  dailyGoal: number;
  studentId?: string;
  registrationBatch?: string;
  batch?: 'B1' | 'B2';
}

export type ClassReminderType =
  | 'submission'
  | 'exam'
  | 'quiz'
  | 'lab_report'
  | 'viva'
  | 'reading'
  | 'other';

export type PriorOffsetType = '15min' | '1hour' | '1day' | '2days' | '1week';

export interface ClassReminder {
  id: string;
  courseCode: string;
  courseName: string;
  type: ClassReminderType;
  title: string;
  description?: string;
  dueDate: string; // YYYY-MM-DD or readable
  dueTime?: string; // HH:mm
  priorOffset: PriorOffsetType;
  completed: boolean;
  createdAt: string;
  priority: Priority;
}

export type DayOfWeek = 'MON' | 'TUE' | 'WED' | 'THU' | 'FRI' | 'SAT';

export interface TimetableSlot {
  id: string;
  day: DayOfWeek;
  period: number; // 1 to 6 (or combined 3-4, 5-6)
  span?: number; // 1 or 2 periods
  time: string; // "09:00 - 10:00"
  startTime: string; // "09:00"
  endTime: string; // "10:00"
  courseCode: string;
  courseName: string;
  faculty: string;
  room?: string;
  batch?: 'B1' | 'B2' | 'ALL';
  isLab?: boolean;
  isBreak?: boolean;
  category?: 'theory' | 'lab' | 'honours' | 'aec' | 'holistic' | 'other';
}

export interface CourseMaster {
  sNo: number;
  code: string;
  name: string;
  faculty: string;
  room?: string;
  category: 'theory' | 'lab' | 'honours' | 'aec' | 'holistic' | 'other';
}

