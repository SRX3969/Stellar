import { TimetableSlot, CourseMaster, DayOfWeek } from '../types';

export interface DepartmentInfo {
  school: string;
  department: string;
  academicYear: string;
  semester: string;
  className: string;
  roomNo: string;
  hod: string;
  classTeacher: string;
  coClassTeacher: string;
}

export const INSTITUTIONAL_INFO: DepartmentInfo = {
  school: 'School of Engineering and Technology',
  department: 'Department of AI and Data Science Engineering',
  academicYear: 'TIME TABLE - ODD SEM 2026-2027',
  semester: 'III Sem',
  className: 'B.Tech AI',
  roomNo: 'Room No: 303, 3F- Arch Block',
  hod: 'Dr Michael Moses T',
  classTeacher: 'Prof. Swati Raj',
  coClassTeacher: 'Dr Ambily Balaram',
};

export const COURSE_CATALOG: CourseMaster[] = [
  {
    sNo: 1,
    code: 'ADS331',
    name: 'Digital Systems and Computer Architecture',
    faculty: 'Dr Ambily Balaram',
    room: 'Room 303',
    category: 'theory',
  },
  {
    sNo: 2,
    code: 'CSEAM332',
    name: 'Introduction to Artificial Intelligence',
    faculty: 'Dr. Gnana Prakasi O S',
    room: 'Room 303',
    category: 'theory',
  },
  {
    sNo: 3,
    code: 'CSE333',
    name: 'Data Structures',
    faculty: 'Dr. Florance G',
    room: 'Room 303',
    category: 'theory',
  },
  {
    sNo: 4,
    code: 'CSE335',
    name: 'Data Base Management System',
    faculty: 'Prof. Swati Raj',
    room: 'Room 303',
    category: 'theory',
  },
  {
    sNo: 5,
    code: 'ADS336',
    name: 'Design Thinking',
    faculty: 'Dr. Jeno Lovesum S P',
    room: 'Room 303',
    category: 'theory',
  },
  {
    sNo: 6,
    code: 'ADS351',
    name: 'Extended Reality Lab',
    faculty: 'Prof. Athulya S & Prof. C Cynthia',
    room: 'Lab 635',
    category: 'lab',
  },
  {
    sNo: 7,
    code: 'CSE352',
    name: 'Data Structures Lab',
    faculty: 'Dr. Florance G & Dr. Santhrupth B C',
    room: 'M101 - SOA',
    category: 'lab',
  },
  {
    sNo: 8,
    code: 'CSE353',
    name: 'DataBase Management Systems Lab',
    faculty: 'Prof. Swati Raj & Dr. Sania Thomas',
    room: 'CRB F02- SOA',
    category: 'lab',
  },
  {
    sNo: 9,
    code: 'AIML334',
    name: 'Mathematical Foundations for AI',
    faculty: 'Dr. Ammani Kuttan B',
    room: 'Room 303',
    category: 'theory',
  },
  {
    sNo: 10,
    code: 'OEC371',
    name: 'Ability Enhancement Course-III',
    faculty: 'Prof. Swati Raj',
    room: 'Room 303',
    category: 'aec',
  },
  {
    sNo: 11,
    code: 'HOL331K',
    name: 'Holistic Education (HED)',
    faculty: 'Department Faculty',
    room: 'Room 303',
    category: 'holistic',
  },
  {
    sNo: 12,
    code: 'EVS321',
    name: 'Environmental Science',
    faculty: 'Dr. Beulah M',
    room: 'Room 303',
    category: 'theory',
  },
  {
    sNo: 13,
    code: 'ADHO331 DAP',
    name: 'Statistical Methods for Data Analytics (Honours)',
    faculty: 'Honours Faculty',
    room: 'Room 303',
    category: 'honours',
  },
  {
    sNo: 14,
    code: 'CSHO331CSP',
    name: 'Ethical Hacking (Honours)',
    faculty: 'New Faculty',
    room: 'Room 303',
    category: 'honours',
  },
  {
    sNo: 15,
    code: 'CSHO331QCP',
    name: 'Introduction to Quantum Computing (Honours)',
    faculty: 'Industry Expert',
    room: 'Room 303',
    category: 'honours',
  },
  {
    sNo: 16,
    code: 'CERT301',
    name: 'Certification Course',
    faculty: 'Industry Mentors',
    room: 'Room 303',
    category: 'other',
  },
];

export interface PeriodDefinition {
  period: number;
  label: string;
  startTime: string; // '09:00'
  endTime: string;   // '10:00'
  displayTime: string; // '9.00 - 10.00'
}

export const PERIODS: PeriodDefinition[] = [
  { period: 1, label: 'PERIOD 1', startTime: '09:00', endTime: '10:00', displayTime: '09:00 - 10:00' },
  { period: 2, label: 'PERIOD 2', startTime: '10:00', endTime: '11:00', displayTime: '10:00 - 11:00' },
  { period: 3, label: 'PERIOD 3', startTime: '11:00', endTime: '12:00', displayTime: '11:00 - 12:00' },
  { period: 4, label: 'PERIOD 4', startTime: '12:00', endTime: '13:00', displayTime: '12:00 - 13:00' },
  { period: 5, label: 'PERIOD 5', startTime: '14:00', endTime: '15:00', displayTime: '14:00 - 15:00' },
  { period: 6, label: 'PERIOD 6', startTime: '15:00', endTime: '16:00', displayTime: '15:00 - 16:00' },
];

export const LUNCH_PERIOD = {
  label: 'LUNCH BREAK',
  startTime: '13:00',
  endTime: '14:00',
  displayTime: '13:00 - 14:00',
};

// All scheduled slots across MON to SAT
export const TIMETABLE_SLOTS: TimetableSlot[] = [
  // ===================== MONDAY =====================
  {
    id: 'mon-p1',
    day: 'MON',
    period: 1,
    time: '09:00 - 10:00',
    startTime: '09:00',
    endTime: '10:00',
    courseCode: 'AIML334',
    courseName: 'Mathematical Foundations for AI',
    faculty: 'Dr. Ammani Kuttan B',
    room: 'Room 303',
    batch: 'ALL',
    category: 'theory',
  },
  {
    id: 'mon-p2',
    day: 'MON',
    period: 2,
    time: '10:00 - 11:00',
    startTime: '10:00',
    endTime: '11:00',
    courseCode: 'CSE333',
    courseName: 'Data Structures',
    faculty: 'Dr. Florance G',
    room: 'Room 303',
    batch: 'ALL',
    category: 'theory',
  },
  // Split Lab P3 & P4: CSE353 B2 / CSE352 B1
  {
    id: 'mon-p3p4-b1',
    day: 'MON',
    period: 3,
    span: 2,
    time: '11:00 - 13:00',
    startTime: '11:00',
    endTime: '13:00',
    courseCode: 'CSE352 (B1)',
    courseName: 'Data Structures Lab (B1)',
    faculty: 'Dr. Florance G and Dr. Santhrupth B C',
    room: 'M101 - SOA',
    batch: 'B1',
    isLab: true,
    category: 'lab',
  },
  {
    id: 'mon-p3p4-b2',
    day: 'MON',
    period: 3,
    span: 2,
    time: '11:00 - 13:00',
    startTime: '11:00',
    endTime: '13:00',
    courseCode: 'CSE353 (B2)',
    courseName: 'DataBase Management Systems Lab (B2)',
    faculty: 'Prof. Swati Raj and Dr. Sania Thomas',
    room: 'CRB F02- SOA',
    batch: 'B2',
    isLab: true,
    category: 'lab',
  },
  {
    id: 'mon-p5',
    day: 'MON',
    period: 5,
    time: '14:00 - 15:00',
    startTime: '14:00',
    endTime: '15:00',
    courseCode: 'CSE335',
    courseName: 'Data Base Management System',
    faculty: 'Prof. Swati Raj',
    room: 'Room 303',
    batch: 'ALL',
    category: 'theory',
  },
  {
    id: 'mon-p6',
    day: 'MON',
    period: 6,
    time: '15:00 - 16:00',
    startTime: '15:00',
    endTime: '16:00',
    courseCode: 'EVS321',
    courseName: 'Environmental Science',
    faculty: 'Dr. Beulah M',
    room: 'Room 303',
    batch: 'ALL',
    category: 'theory',
  },

  // ===================== TUESDAY =====================
  // Split Lab P1 & P2: ADS351 B2 / CSE353 B1
  {
    id: 'tue-p1p2-b1',
    day: 'TUE',
    period: 1,
    span: 2,
    time: '09:00 - 11:00',
    startTime: '09:00',
    endTime: '11:00',
    courseCode: 'CSE353 (B1)',
    courseName: 'DataBase Management Systems Lab (B1)',
    faculty: 'Prof. Swati Raj and Dr. Sania Thomas',
    room: 'CRB F02- SOA',
    batch: 'B1',
    isLab: true,
    category: 'lab',
  },
  {
    id: 'tue-p1p2-b2',
    day: 'TUE',
    period: 1,
    span: 2,
    time: '09:00 - 11:00',
    startTime: '09:00',
    endTime: '11:00',
    courseCode: 'ADS351 (B2)',
    courseName: 'Extended Reality Lab (B2)',
    faculty: 'Prof. Athulya S & Prof. C Cynthia',
    room: 'Lab 635',
    batch: 'B2',
    isLab: true,
    category: 'lab',
  },
  {
    id: 'tue-p3',
    day: 'TUE',
    period: 3,
    time: '11:00 - 12:00',
    startTime: '11:00',
    endTime: '12:00',
    courseCode: 'HOL331K',
    courseName: 'Holistic Education (HED)',
    faculty: 'Department Faculty',
    room: 'Room 303',
    batch: 'ALL',
    category: 'holistic',
  },
  {
    id: 'tue-p4',
    day: 'TUE',
    period: 4,
    time: '12:00 - 13:00',
    startTime: '12:00',
    endTime: '13:00',
    courseCode: 'HON-MIN',
    courseName: 'Department Meeting / Honours Minors',
    faculty: 'Honours Faculty',
    room: 'Room 303',
    batch: 'ALL',
    category: 'honours',
  },
  {
    id: 'tue-p5',
    day: 'TUE',
    period: 5,
    time: '14:00 - 15:00',
    startTime: '14:00',
    endTime: '15:00',
    courseCode: 'CSE333',
    courseName: 'Data Structures',
    faculty: 'Dr. Florance G',
    room: 'Room 303',
    batch: 'ALL',
    category: 'theory',
  },
  {
    id: 'tue-p6',
    day: 'TUE',
    period: 6,
    time: '15:00 - 16:00',
    startTime: '15:00',
    endTime: '16:00',
    courseCode: 'CSEAM332',
    courseName: 'Introduction to Artificial Intelligence',
    faculty: 'Dr. Gnana Prakasi O S',
    room: 'Room 303',
    batch: 'ALL',
    category: 'theory',
  },

  // ===================== WEDNESDAY =====================
  {
    id: 'wed-p1',
    day: 'WED',
    period: 1,
    time: '09:00 - 10:00',
    startTime: '09:00',
    endTime: '10:00',
    courseCode: 'ADS331',
    courseName: 'Digital Systems and Computer Architecture',
    faculty: 'Dr Ambily Balaram',
    room: 'Room 303',
    batch: 'ALL',
    category: 'theory',
  },
  {
    id: 'wed-p2',
    day: 'WED',
    period: 2,
    time: '10:00 - 11:00',
    startTime: '10:00',
    endTime: '11:00',
    courseCode: 'AIML334',
    courseName: 'Mathematical Foundations for AI',
    faculty: 'Dr. Ammani Kuttan B',
    room: 'Room 303',
    batch: 'ALL',
    category: 'theory',
  },
  {
    id: 'wed-p3p4',
    day: 'WED',
    period: 3,
    span: 2,
    time: '11:00 - 13:00',
    startTime: '11:00',
    endTime: '13:00',
    courseCode: 'HONOURS',
    courseName: 'Honours Minors (Statistical Methods / Ethical Hacking / Quantum)',
    faculty: 'Honours Faculty',
    room: 'Room 303',
    batch: 'ALL',
    category: 'honours',
  },
  {
    id: 'wed-p5p6',
    day: 'WED',
    period: 5,
    span: 2,
    time: '14:00 - 16:00',
    startTime: '14:00',
    endTime: '16:00',
    courseCode: 'HONOURS',
    courseName: 'Honours Minors Track Specialization',
    faculty: 'Honours Faculty',
    room: 'Room 303',
    batch: 'ALL',
    category: 'honours',
  },

  // ===================== THURSDAY =====================
  {
    id: 'thu-p1',
    day: 'THU',
    period: 1,
    time: '09:00 - 10:00',
    startTime: '09:00',
    endTime: '10:00',
    courseCode: 'CSE335',
    courseName: 'Data Base Management System',
    faculty: 'Prof. Swati Raj',
    room: 'Room 303',
    batch: 'ALL',
    category: 'theory',
  },
  {
    id: 'thu-p2',
    day: 'THU',
    period: 2,
    time: '10:00 - 11:00',
    startTime: '10:00',
    endTime: '11:00',
    courseCode: 'CSE333',
    courseName: 'Data Structures',
    faculty: 'Dr. Florance G',
    room: 'Room 303',
    batch: 'ALL',
    category: 'theory',
  },
  {
    id: 'thu-p3p4',
    day: 'THU',
    period: 3,
    span: 2,
    time: '11:00 - 13:00',
    startTime: '11:00',
    endTime: '13:00',
    courseCode: 'OEC371',
    courseName: 'Ability Enhancement Course-III',
    faculty: 'Prof. Swati Raj',
    room: 'Room 303',
    batch: 'ALL',
    category: 'aec',
  },
  {
    id: 'thu-p5',
    day: 'THU',
    period: 5,
    time: '14:00 - 15:00',
    startTime: '14:00',
    endTime: '15:00',
    courseCode: 'ADS336',
    courseName: 'Design Thinking',
    faculty: 'Dr. Jeno Lovesum S P',
    room: 'Room 303',
    batch: 'ALL',
    category: 'theory',
  },
  {
    id: 'thu-p6',
    day: 'THU',
    period: 6,
    time: '15:00 - 16:00',
    startTime: '15:00',
    endTime: '16:00',
    courseCode: 'ADS331',
    courseName: 'Digital Systems and Computer Architecture',
    faculty: 'Dr Ambily Balaram',
    room: 'Room 303',
    batch: 'ALL',
    category: 'theory',
  },

  // ===================== FRIDAY =====================
  {
    id: 'fri-p1',
    day: 'FRI',
    period: 1,
    time: '09:00 - 10:00',
    startTime: '09:00',
    endTime: '10:00',
    courseCode: 'CSE333',
    courseName: 'Data Structures',
    faculty: 'Dr. Florance G',
    room: 'Room 303',
    batch: 'ALL',
    category: 'theory',
  },
  {
    id: 'fri-p2',
    day: 'FRI',
    period: 2,
    time: '10:00 - 11:00',
    startTime: '10:00',
    endTime: '11:00',
    courseCode: 'AIML334',
    courseName: 'Mathematical Foundations for AI',
    faculty: 'Dr. Ammani Kuttan B',
    room: 'Room 303',
    batch: 'ALL',
    category: 'theory',
  },
  {
    id: 'fri-p3',
    day: 'FRI',
    period: 3,
    time: '11:00 - 12:00',
    startTime: '11:00',
    endTime: '12:00',
    courseCode: 'ADS336',
    courseName: 'Design Thinking',
    faculty: 'Dr. Jeno Lovesum S P',
    room: 'Room 303',
    batch: 'ALL',
    category: 'theory',
  },
  {
    id: 'fri-p4',
    day: 'FRI',
    period: 4,
    time: '12:00 - 13:00',
    startTime: '12:00',
    endTime: '13:00',
    courseCode: 'CSEAM332',
    courseName: 'Introduction to Artificial Intelligence',
    faculty: 'Dr. Gnana Prakasi O S',
    room: 'Room 303',
    batch: 'ALL',
    category: 'theory',
  },
  // Split Lab P5 & P6: ADS351 B2 / CSE352 B1
  {
    id: 'fri-p5p6-b1',
    day: 'FRI',
    period: 5,
    span: 2,
    time: '14:00 - 16:00',
    startTime: '14:00',
    endTime: '16:00',
    courseCode: 'CSE352 (B1)',
    courseName: 'Data Structures Lab (B1)',
    faculty: 'Dr. Florance G and Dr. Santhrupth B C',
    room: 'M101 - SOA',
    batch: 'B1',
    isLab: true,
    category: 'lab',
  },
  {
    id: 'fri-p5p6-b2',
    day: 'FRI',
    period: 5,
    span: 2,
    time: '14:00 - 16:00',
    startTime: '14:00',
    endTime: '16:00',
    courseCode: 'ADS351 (B2)',
    courseName: 'Extended Reality Lab (B2)',
    faculty: 'Prof. Athulya S & Prof. C Cynthia',
    room: 'Lab 635',
    batch: 'B2',
    isLab: true,
    category: 'lab',
  },

  // ===================== SATURDAY =====================
  {
    id: 'sat-p1',
    day: 'SAT',
    period: 1,
    time: '09:00 - 10:00',
    startTime: '09:00',
    endTime: '10:00',
    courseCode: 'CSEAM332',
    courseName: 'Introduction to Artificial Intelligence',
    faculty: 'Dr. Gnana Prakasi O S',
    room: 'Room 303',
    batch: 'ALL',
    category: 'theory',
  },
  {
    id: 'sat-p2',
    day: 'SAT',
    period: 2,
    time: '10:00 - 11:00',
    startTime: '10:00',
    endTime: '11:00',
    courseCode: 'ADS331',
    courseName: 'Digital Systems and Computer Architecture',
    faculty: 'Dr Ambily Balaram',
    room: 'Room 303',
    batch: 'ALL',
    category: 'theory',
  },
  {
    id: 'sat-p3',
    day: 'SAT',
    period: 3,
    time: '11:00 - 12:00',
    startTime: '11:00',
    endTime: '12:00',
    courseCode: 'AIML334',
    courseName: 'Mathematical Foundations for AI',
    faculty: 'Dr. Ammani Kuttan B',
    room: 'Room 303',
    batch: 'ALL',
    category: 'theory',
  },
  {
    id: 'sat-p4',
    day: 'SAT',
    period: 4,
    time: '12:00 - 13:00',
    startTime: '12:00',
    endTime: '13:00',
    courseCode: 'CSE335',
    courseName: 'Data Base Management System',
    faculty: 'Prof. Swati Raj',
    room: 'Room 303',
    batch: 'ALL',
    category: 'theory',
  },
];

// Helper to get slots filtered by day and student's batch ('B1' | 'B2')
export function getSlotsForDay(day: DayOfWeek, batch: 'B1' | 'B2' = 'B1'): TimetableSlot[] {
  return TIMETABLE_SLOTS.filter(
    (slot) => slot.day === day && (slot.batch === 'ALL' || slot.batch === batch)
  );
}

// Convert "HH:mm" string to minutes from midnight
export function timeToMinutes(timeStr: string): number {
  const [h, m] = timeStr.split(':').map(Number);
  return h * 60 + (m || 0);
}

// Ongoing class determination logic
export interface OngoingClassStatus {
  isClassOngoing: boolean;
  currentSlot: TimetableSlot | null;
  nextSlot: TimetableSlot | null;
  progressPercentage: number;
  minutesRemaining: number;
  minutesUntilNext: number | null;
  isLunch: boolean;
  isOffHours: boolean;
  activeDay: DayOfWeek;
}

export function calculateOngoingClass(
  currentDay: DayOfWeek,
  currentTimeStr: string, // "HH:mm"
  batch: 'B1' | 'B2' = 'B1'
): OngoingClassStatus {
  const currentMinutes = timeToMinutes(currentTimeStr);
  const daySlots = getSlotsForDay(currentDay, batch).sort(
    (a, b) => timeToMinutes(a.startTime) - timeToMinutes(b.startTime)
  );

  const lunchStart = timeToMinutes('13:00');
  const lunchEnd = timeToMinutes('14:00');
  const isLunch = currentMinutes >= lunchStart && currentMinutes < lunchEnd;

  // Find currently active slot
  const currentSlot = daySlots.find((slot) => {
    const start = timeToMinutes(slot.startTime);
    const end = timeToMinutes(slot.endTime);
    return currentMinutes >= start && currentMinutes < end;
  }) || null;

  // Find next upcoming slot
  const nextSlot = daySlots.find((slot) => {
    const start = timeToMinutes(slot.startTime);
    return start > currentMinutes;
  }) || null;

  let progressPercentage = 0;
  let minutesRemaining = 0;
  let minutesUntilNext: number | null = null;

  if (currentSlot) {
    const start = timeToMinutes(currentSlot.startTime);
    const end = timeToMinutes(currentSlot.endTime);
    const total = end - start;
    const elapsed = Math.max(0, currentMinutes - start);
    progressPercentage = Math.min(100, Math.round((elapsed / total) * 100));
    minutesRemaining = Math.max(0, end - currentMinutes);
  }

  if (nextSlot) {
    const nextStart = timeToMinutes(nextSlot.startTime);
    minutesUntilNext = Math.max(0, nextStart - currentMinutes);
  }

  const isOffHours = !currentSlot && !nextSlot && (currentMinutes < timeToMinutes('09:00') || currentMinutes >= timeToMinutes('16:00'));

  return {
    isClassOngoing: !!currentSlot,
    currentSlot,
    nextSlot,
    progressPercentage,
    minutesRemaining,
    minutesUntilNext,
    isLunch,
    isOffHours,
    activeDay: currentDay,
  };
}

export const INITIAL_CLASS_REMINDERS = [
  {
    id: 'rem-1',
    courseCode: 'AIML334',
    courseName: 'Mathematical Foundations for AI',
    type: 'submission' as const,
    title: 'Gradient Descent & Matrix Calculus Problem Set 2',
    description: 'Solve Unit 2 problem set exercises 1-8. Submit in hard copy during Period 1.',
    dueDate: '2026-09-14',
    dueTime: '09:00',
    priorOffset: '1day' as const,
    completed: false,
    createdAt: new Date().toISOString(),
    priority: 'urgent' as const,
  },
  {
    id: 'rem-2',
    courseCode: 'CSE333',
    courseName: 'Data Structures',
    type: 'exam' as const,
    title: 'Surprise Quiz: Balanced AVL Trees & Rotations',
    description: 'Announced by Dr. Florance G. Review tree balance factors and LL/LR/RL/RR operations.',
    dueDate: '2026-09-15',
    dueTime: '10:00',
    priorOffset: '2days' as const,
    completed: false,
    createdAt: new Date().toISOString(),
    priority: 'high' as const,
  },
  {
    id: 'rem-3',
    courseCode: 'CSE353',
    courseName: 'DataBase Management Systems Lab',
    type: 'lab_report' as const,
    title: 'Lab Experiment 4: SQL Complex Joins & Subqueries',
    description: 'Get record book signed by Prof. Swati Raj before entering CRB F02 lab.',
    dueDate: '2026-09-15',
    dueTime: '09:00',
    priorOffset: '1hour' as const,
    completed: false,
    createdAt: new Date().toISOString(),
    priority: 'medium' as const,
  },
  {
    id: 'rem-4',
    courseCode: 'ADS336',
    courseName: 'Design Thinking',
    type: 'submission' as const,
    title: 'Empathy Map & Problem Statement Poster',
    description: 'Group presentation on campus accessibility solutions.',
    dueDate: '2026-09-17',
    dueTime: '14:00',
    priorOffset: '1day' as const,
    completed: false,
    createdAt: new Date().toISOString(),
    priority: 'medium' as const,
  },
];
