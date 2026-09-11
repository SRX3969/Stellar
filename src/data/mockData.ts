import {
  Task,
  Subject,
  TimelineItem,
  AttentionItem,
  Assessment,
  DocumentItem,
  Flashcard,
  AIMessage,
  NotificationItem,
  MockExamQuestion
} from '../types';

// Tasks: Start clean (no random fake tasks)
export const INITIAL_TASKS: Task[] = [];

// Subjects: Official Institutional Semester III Courses (Room 303, AI & DS Dept)
export const SUBJECTS: Subject[] = [
  {
    id: 'sub-aiml334',
    code: 'AIML334',
    name: 'Mathematical Foundations for AI',
    professor: 'Dr. Ammani Kuttan B',
    attendance: {
      present: 20,
      total: 20,
      percentage: 100,
      criterion: 75,
      status: 'SAFE',
    },
    syllabusCompletion: 45,
    credits: 4,
    room: 'Room 303',
  },
  {
    id: 'sub-cse333',
    code: 'CSE333',
    name: 'Data Structures',
    professor: 'Dr. Florance G',
    attendance: {
      present: 20,
      total: 20,
      percentage: 100,
      criterion: 75,
      status: 'SAFE',
    },
    syllabusCompletion: 40,
    credits: 4,
    room: 'Room 303',
  },
  {
    id: 'sub-cse335',
    code: 'CSE335',
    name: 'Database Management Systems',
    professor: 'Prof. Swati Raj',
    attendance: {
      present: 20,
      total: 20,
      percentage: 100,
      criterion: 75,
      status: 'SAFE',
    },
    syllabusCompletion: 40,
    credits: 4,
    room: 'Room 303',
  },
  {
    id: 'sub-ads336',
    code: 'ADS336',
    name: 'Design Thinking',
    professor: 'Dr. Santhrupth B C',
    attendance: {
      present: 10,
      total: 10,
      percentage: 100,
      criterion: 75,
      status: 'SAFE',
    },
    syllabusCompletion: 50,
    credits: 2,
    room: 'Room 303',
  },
  {
    id: 'sub-ads351',
    code: 'ADS351',
    name: 'Artificial Intelligence Lab',
    professor: 'Dr. Ammani Kuttan B',
    attendance: {
      present: 10,
      total: 10,
      percentage: 100,
      criterion: 75,
      status: 'SAFE',
    },
    syllabusCompletion: 50,
    credits: 1.5,
    room: 'Lab 635',
  },
  {
    id: 'sub-cse352',
    code: 'CSE352',
    name: 'Data Structures Lab',
    professor: 'Dr. Florance G & Dr. Santhrupth B C',
    attendance: {
      present: 10,
      total: 10,
      percentage: 100,
      criterion: 75,
      status: 'SAFE',
    },
    syllabusCompletion: 48,
    credits: 1.5,
    room: 'M101-SOA',
  },
  {
    id: 'sub-cse353',
    code: 'CSE353',
    name: 'DataBase Management Systems Lab',
    professor: 'Prof. Swati Raj & Dr. Sania Thomas',
    attendance: {
      present: 10,
      total: 10,
      percentage: 100,
      criterion: 75,
      status: 'SAFE',
    },
    syllabusCompletion: 45,
    credits: 1.5,
    room: 'CRB F02-SOA',
  },
  {
    id: 'sub-oec371',
    code: 'OEC371',
    name: 'Ability Enhancement Course-III',
    professor: 'Prof. Swati Raj',
    attendance: {
      present: 10,
      total: 10,
      percentage: 100,
      criterion: 75,
      status: 'SAFE',
    },
    syllabusCompletion: 50,
    credits: 2,
    room: 'Room 303',
  },
  {
    id: 'sub-evs321',
    code: 'EVS321',
    name: 'Environmental Science',
    professor: 'Dr. Beulah M',
    attendance: {
      present: 10,
      total: 10,
      percentage: 100,
      criterion: 75,
      status: 'SAFE',
    },
    syllabusCompletion: 60,
    credits: 2,
    room: 'Room 303',
  },
];

// Today's Academic Schedule based directly on the actual institutional timetable
export const TODAY_TIMELINE: TimelineItem[] = [
  {
    id: 'slot-1',
    time: '09:00',
    endTime: '10:00',
    title: 'Mathematical Foundations for AI',
    subtitle: 'Dr. Ammani Kuttan B • Room 303',
    type: 'class',
    subjectCode: 'AIML334',
    duration: '1h',
    isCompleted: false,
  },
  {
    id: 'slot-2',
    time: '10:00',
    endTime: '11:00',
    title: 'Data Structures',
    subtitle: 'Dr. Florance G • Room 303',
    type: 'class',
    subjectCode: 'CSE333',
    duration: '1h',
    isCompleted: false,
  },
  {
    id: 'slot-3',
    time: '11:00',
    endTime: '13:00',
    title: 'Data Structures / DBMS Lab Practical',
    subtitle: 'Dr. Florance G & Prof. Swati Raj • M101 / CRB F02',
    type: 'class',
    subjectCode: 'CSE352 / CSE353',
    duration: '2h',
    isCompleted: false,
  },
  {
    id: 'slot-4',
    time: '13:00',
    endTime: '14:00',
    title: 'Lunch Break & Student Commons',
    subtitle: 'Campus Dining & Recharge',
    type: 'break',
    duration: '1h',
    isCompleted: false,
  },
  {
    id: 'slot-5',
    time: '14:00',
    endTime: '15:00',
    title: 'Database Management Systems',
    subtitle: 'Prof. Swati Raj • Room 303',
    type: 'class',
    subjectCode: 'CSE335',
    duration: '1h',
    isCompleted: false,
  },
  {
    id: 'slot-6',
    time: '15:00',
    endTime: '16:00',
    title: 'Design Thinking',
    subtitle: 'Dr. Santhrupth B C • Room 303',
    type: 'class',
    subjectCode: 'ADS336',
    duration: '1h',
    isCompleted: false,
  },
];

// Attention items: Clean by default (no random warnings)
export const ATTENTION_ITEMS: AttentionItem[] = [];

// Upcoming assessments: Empty until user adds tests/CIAs
export const UPCOMING_ASSESSMENTS: Assessment[] = [];

// Documents: Empty by default
export const DOCUMENTS: DocumentItem[] = [];

// Flashcards: Academic concepts related to real courses
export const FLASHCARDS: Flashcard[] = [
  {
    id: 'fc-1',
    subjectCode: 'CSE335',
    topic: 'Normalization',
    question: 'What is Third Normal Form (3NF)?',
    answer: 'A relation is in 3NF if it is in 2NF and every non-prime attribute is non-transitively dependent on every candidate key.',
    difficulty: 'medium',
  },
  {
    id: 'fc-2',
    subjectCode: 'CSE333',
    topic: 'Data Structures',
    question: 'What is an AVL Tree balance factor?',
    answer: 'Balance Factor = Height(Left Subtree) - Height(Right Subtree). For an AVL tree to remain balanced, the balance factor must be in {-1, 0, 1}.',
    difficulty: 'medium',
  },
  {
    id: 'fc-3',
    subjectCode: 'AIML334',
    topic: 'Optimization',
    question: 'What is the role of learning rate (alpha) in Gradient Descent?',
    answer: 'The learning rate is a hyperparameter determining the step size taken in the direction of the negative gradient toward local minimum of the loss function.',
    difficulty: 'easy',
  },
];

export const INITIAL_AI_MESSAGES: AIMessage[] = [
  {
    id: 'msg-1',
    role: 'assistant',
    content: 'Hello! I am STELLAR, your institutional AI tutor and academic companion. How can I assist you with your coursework, conceptual doubts, or revision today?',
    timestamp: '09:00',
    mode: 'Ask Anything',
  },
];

// Notifications: Clean by default (no fake alerts)
export const NOTIFICATIONS: NotificationItem[] = [];

export const MOCK_EXAM_QUESTIONS: MockExamQuestion[] = [
  {
    id: 'q-1',
    question: 'Consider a relation R(A, B, C, D) with functional dependencies: A → B, B → C, and C → D. What is the candidate key?',
    options: ['A', 'B', 'C', 'D'],
    correctOptionIndex: 0,
    explanation: 'From A+, we can derive A, B, C, and D. Since no attribute determines A, A is the unique candidate key.',
  },
  {
    id: 'q-2',
    question: 'Which property is strictly maintained by ACID transaction management in DBMS?',
    options: ['Atomicity', 'Consistency', 'Isolation & Durability', 'All of the above'],
    correctOptionIndex: 3,
    explanation: 'ACID stands for Atomicity, Consistency, Isolation, and Durability.',
  },
];
