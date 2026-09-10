// Convex Database Schema definition for STELLAR Student Operating System
// Pre-configured for seamless 'npx convex dev' activation

export const schemaDefinition = {
  tasks: {
    title: 'string',
    subject: 'string',
    priority: 'string', // 'urgent' | 'high' | 'medium' | 'low'
    deadline: 'string',
    estimatedDuration: 'string',
    completed: 'boolean',
    section: 'string', // 'today' | 'upcoming' | 'overdue' | 'completed'
    createdAt: 'number',
  },
  subjects: {
    code: 'string',
    name: 'string',
    professor: 'string',
    present: 'number',
    total: 'number',
    criterion: 'number',
    status: 'string', // 'SAFE' | 'WATCH' | 'RISK' | 'CRITICAL'
    syllabusCompletion: 'number',
    credits: 'number',
    room: 'string',
  },
  assessments: {
    subjectCode: 'string',
    subjectName: 'string',
    title: 'string',
    type: 'string',
    date: 'string',
    daysRemaining: 'number',
    maxMarks: 'number',
    status: 'string',
  },
  reminders: {
    title: 'string',
    time: 'string',
    frequency: 'string',
    category: 'string',
    tag: 'string',
    active: 'boolean',
  },
  routineSlots: {
    time: 'string',
    endTime: 'string',
    activity: 'string',
    category: 'string',
    type: 'string', // 'fixed' | 'ai-adaptive'
    notes: 'optional string',
  },
  documents: {
    name: 'string',
    folder: 'string',
    category: 'string',
    fileType: 'string',
    size: 'string',
    status: 'string',
  },
  flashcards: {
    subjectCode: 'string',
    topic: 'string',
    question: 'string',
    answer: 'string',
    difficulty: 'string',
  },
  users: {
    email: 'string', // required genuine Gmail
    fullName: 'string',
    passwordHash: 'string',
    batch: 'string', // 'B1' | 'B2'
    semester: 'string',
    course: 'string',
    university: 'string',
    studentId: 'string',
    createdAt: 'string',
    lastLoginAt: 'string',
  },
  classReminders: {
    userId: 'optional string',
    courseCode: 'string',
    courseName: 'string',
    type: 'string', // 'submission' | 'exam' | 'quiz' | 'lab_report' | 'viva' | 'reading' | 'other'
    title: 'string',
    description: 'optional string',
    dueDate: 'string',
    dueTime: 'optional string',
    priorOffset: 'string', // '15min' | '1hour' | '1day' | '2days' | '1week'
    completed: 'boolean',
    priority: 'string', // 'urgent' | 'high' | 'medium' | 'low'
    createdAt: 'string',
  },
  timetableSlots: {
    day: 'string', // 'MON' | 'TUE' | 'WED' | 'THU' | 'FRI' | 'SAT'
    period: 'number', // 1 - 6
    time: 'string',
    startTime: 'string',
    endTime: 'string',
    courseCode: 'string',
    courseName: 'string',
    faculty: 'string',
    room: 'string',
    batch: 'string', // 'ALL' | 'B1' | 'B2'
    category: 'string', // 'theory' | 'lab' | 'honours' | 'aec' | 'holistic'
  },
};

export default schemaDefinition;
