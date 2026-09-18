import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './hooks/useAuth';

// Existing Shell Components
import { Sidebar, NavRoute } from './components/shell/Sidebar';
import { TopBar } from './components/shell/TopBar';
import { MobileNav } from './components/shell/MobileNav';
import { CommandCenter } from './components/command-center/CommandCenter';
import { GlobalSearchModal } from './components/shell/GlobalSearchModal';
import { DailyBriefingModal } from './components/dashboard/DailyBriefingModal';

// Existing Student Feature Views (PRESERVED)
import { DashboardView } from './components/dashboard/DashboardView';
import { AITutorView } from './components/ai-tutor/AITutorView';
import { CalendarView } from './components/calendar/CalendarView';
import { TasksView } from './components/tasks/TasksView';
import { RoutineView } from './components/routine/RoutineView';
import { RemindersView } from './components/reminders/RemindersView';
import { SubjectsView } from './components/subjects/SubjectsView';
import { AttendanceView } from './components/attendance/AttendanceView';
import { AssessmentsView } from './components/assessments/AssessmentsView';
import { StudyView } from './components/study/StudyView';
import { FocusSessionModal } from './components/study/FocusSessionModal';
import { DocumentVaultView } from './components/documents/DocumentVaultView';
import { NotificationsView } from './components/notifications/NotificationsView';
import { AnalyticsView } from './components/analytics/AnalyticsView';
import { SettingsView } from './components/settings/SettingsView';
import { ProfileView } from './components/profile/ProfileView';
import { TimetableScheduleView } from './components/timetable/TimetableScheduleView';

// Auth Components (PRESERVED)
import { AuthGateway } from './components/auth/AuthGateway';
import { AuthModal } from './components/auth/AuthModal';
import { OnboardingModal } from './components/auth/OnboardingModal';

// New Portal Components
import { AdminLayout } from './components/admin/AdminLayout';
import { TeacherLayout } from './components/teacher/TeacherLayout';
import { LandingPage } from './components/landing/LandingPage';

// Common
import { ToastProvider, useToast } from './components/common/Toast';
import { db } from './services/db';

import { INITIAL_TASKS, NOTIFICATIONS, SUBJECTS as INITIAL_SUBJECTS } from './data/mockData';
import { Task, NotificationItem, Subject, UserProfile } from './types';

// ============================================================
// ROUTE GUARD COMPONENT
// ============================================================

function ProtectedRoute({ children, allowedRoles }: { children: React.ReactNode; allowedRoles?: string[] }) {
  const { user, isLoading, isAuthenticated } = useAuth();

  if (isLoading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'var(--bg-main)',
        color: 'var(--text-primary)',
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '40px', height: '40px',
            border: '3px solid var(--border-default)',
            borderTopColor: 'var(--accent-primary)',
            borderRadius: '50%',
            animation: 'spin 0.8s linear infinite',
            margin: '0 auto 16px',
          }} />
          <p style={{ fontSize: '14px', color: 'var(--text-muted)' }}>Restoring session...</p>
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    // Redirect to correct dashboard based on role
    const roleRoutes: Record<string, string> = {
      admin: '/admin/dashboard',
      teacher: '/teacher/dashboard',
      student: '/student/dashboard',
    };
    return <Navigate to={roleRoutes[user.role] || '/login'} replace />;
  }

  return <>{children}</>;
}

// ============================================================
// STUDENT PORTAL (Wraps existing features)
// ============================================================

function StudentPortal() {
  const { user, logout: authLogout, updateUser: authUpdateUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { showToast } = useToast();

  // Derive current route from URL path
  const pathSegments = location.pathname.split('/').filter(Boolean);
  const currentRoute: NavRoute = (pathSegments[1] || 'dashboard') as NavRoute;

  const setCurrentRoute = (route: NavRoute) => {
    navigate(`/student/${route}`);
  };

  // Persistent User Profile State (PRESERVED from original App.tsx)
  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem('stellar_user_profile');
      if (saved) return JSON.parse(saved);
    } catch {}
    return {
      name: user?.fullName || 'Student',
      email: user?.email || '',
      university: user?.university || 'School of Engineering and Technology',
      course: user?.course || 'B.Tech AI & Data Science',
      semester: user?.semester || 'III Sem',
      criterion: user?.criterion || 75,
      dailyGoal: user?.dailyGoal || 2.0,
      studentId: user?.studentId || '',
      registrationBatch: 'Batch of 2027',
      batch: user?.batch || 'B1',
      avatarUrl: user?.avatarUrl || '',
      dob: user?.dob || '',
      department: user?.department || 'Department of AI and Data Science Engineering',
      campus: user?.campus || 'Central Campus / Arch Block',
      roomNo: user?.roomNo || '',
      classTeacher: '',
      onboardingCompleted: user?.onboardingCompleted ?? true,
      hasTimetableConfigured: user?.hasTimetableConfigured ?? true,
    };
  });

  // Persistent Subjects State (PRESERVED)
  const [subjects, setSubjects] = useState<Subject[]>(() => {
    try {
      const saved = localStorage.getItem('stellar_subjects');
      if (saved) {
        const parsed: Subject[] = JSON.parse(saved);
        if (!parsed.some((s) => s.professor?.includes('Aris Thorne') || s.code === 'CS301' || s.code === 'CS302')) {
          return parsed;
        }
      }
    } catch {}
    return INITIAL_SUBJECTS;
  });

  // Persistent Study Minutes (PRESERVED)
  const [studyMinutesToday, setStudyMinutesToday] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('stellar_study_minutes');
      if (saved) return Number(saved);
    } catch {}
    return 0;
  });

  // Persistent Tasks (PRESERVED)
  const [tasks, setTasks] = useState<Task[]>(() => {
    try {
      const saved = localStorage.getItem('stellar_tasks');
      if (saved) {
        const parsed: Task[] = JSON.parse(saved);
        return parsed.filter((t) => !['task-1', 'task-2', 'task-3', 'task-4', 'task-5', 'task-6', 'task-7', 'task-8', 'task-9', 'task-10'].includes(t.id));
      }
    } catch {}
    return INITIAL_TASKS;
  });

  // Persistent Notifications (PRESERVED)
  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    try {
      const saved = localStorage.getItem('stellar_notifications');
      if (saved) {
        const parsed: NotificationItem[] = JSON.parse(saved);
        return parsed.filter((n) => !['notif-1', 'notif-2', 'notif-3', 'notif-4'].includes(n.id));
      }
    } catch {}
    return NOTIFICATIONS;
  });

  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  // Modal States (PRESERVED)
  const [isCommandCenterOpen, setIsCommandCenterOpen] = useState(false);
  const [isGlobalSearchOpen, setIsGlobalSearchOpen] = useState(false);
  const [isDailyBriefingOpen, setIsDailyBriefingOpen] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isFocusSessionOpen, setIsFocusSessionOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);

  // Theme sync (PRESERVED)
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Local storage syncs (PRESERVED)
  useEffect(() => { localStorage.setItem('stellar_user_profile', JSON.stringify(userProfile)); }, [userProfile]);
  useEffect(() => { localStorage.setItem('stellar_subjects', JSON.stringify(subjects)); }, [subjects]);
  useEffect(() => { localStorage.setItem('stellar_study_minutes', String(studyMinutesToday)); }, [studyMinutesToday]);
  useEffect(() => { localStorage.setItem('stellar_tasks', JSON.stringify(tasks)); }, [tasks]);
  useEffect(() => { localStorage.setItem('stellar_notifications', JSON.stringify(notifications)); }, [notifications]);

  // Global hotkeys (PRESERVED)
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsCommandCenterOpen((prev) => !prev);
      }
      if (e.key === '/' && !isCommandCenterOpen && !isGlobalSearchOpen &&
        document.activeElement?.tagName !== 'INPUT' && document.activeElement?.tagName !== 'TEXTAREA') {
        e.preventDefault();
        setIsGlobalSearchOpen(true);
      }
    };
    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, [isCommandCenterOpen, isGlobalSearchOpen]);

  // Handler functions (ALL PRESERVED)
  const handleUpdateProfile = (updated: Partial<UserProfile>) => {
    setUserProfile((prev) => ({ ...prev, ...updated }));
  };

  const handleMarkAttendance = (subjectId: string, status: 'present' | 'absent') => {
    setSubjects((prev) =>
      prev.map((s) => {
        if (s.id === subjectId) {
          const newPresent = status === 'present' ? s.attendance.present + 1 : s.attendance.present;
          const newTotal = s.attendance.total + 1;
          const newPct = Math.round((newPresent / newTotal) * 100);
          let newStatus: Subject['attendance']['status'] = 'SAFE';
          const crit = userProfile.criterion || 75;
          if (newPct >= crit) newStatus = 'SAFE';
          else if (newPct >= crit - 5) newStatus = 'WATCH';
          else if (newPct >= crit - 12) newStatus = 'RISK';
          else newStatus = 'CRITICAL';
          return { ...s, attendance: { ...s.attendance, present: newPresent, total: newTotal, percentage: newPct, status: newStatus } };
        }
        return s;
      })
    );
  };

  const handleLogStudySession = (minutesLogged: number) => {
    setStudyMinutesToday((prev) => prev + minutesLogged);
  };

  const handleToggleTask = (taskId: string) => {
    setTasks((prev) => prev.map((t) => {
      if (t.id === taskId) {
        const newCompleted = !t.completed;
        return { ...t, completed: newCompleted, section: newCompleted ? 'completed' as const : 'today' as const };
      }
      return t;
    }));
  };

  const handleAddTask = (newTask: Omit<Task, 'id' | 'completed' | 'section'>) => {
    const task: Task = { ...newTask, id: `task-${Date.now()}`, completed: false, section: 'today' };
    setTasks((prev) => [task, ...prev]);
  };

  const handleDeleteTask = (taskId: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
  };

  const handleMarkAllNotificationsAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const handleToggleNotificationRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: !n.read } : n)));
  };

  const handleDeleteNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const unreadNotificationsCount = notifications.filter((n) => !n.read).length;
  const tasksCompletedCount = tasks.filter((t) => t.completed).length;

  const handleLogout = async () => {
    await authLogout();
    showToast('Signed Out', 'You have been securely signed out.', 'info');
    navigate('/');
  };

  const handleOnboardingComplete = (data: Partial<UserProfile>) => {
    handleUpdateProfile(data);
    setIsOnboardingOpen(false);
  };

  return (
    <div className="app-container">
      {/* Fixed Left Sidebar (PRESERVED) */}
      <Sidebar
        currentRoute={currentRoute}
        onRouteChange={setCurrentRoute}
        onNewChat={() => setCurrentRoute('ai')}
        unreadNotificationsCount={unreadNotificationsCount}
        isOpenMobile={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
        onOpenAuth={() => setIsAuthOpen(true)}
        onOpenOnboarding={() => setIsOnboardingOpen(true)}
        onLogout={handleLogout}
        userName={userProfile.name}
        userAvatar={userProfile.avatarUrl}
        userCourse={userProfile.course || "B.Tech AI"}
        userSemester={userProfile.semester}
      />

      {/* Main Viewport (PRESERVED) */}
      <div className="main-viewport">
        <TopBar
          currentRoute={currentRoute}
          onOpenCommandCenter={() => setIsCommandCenterOpen(true)}
          onOpenGlobalSearch={() => setIsGlobalSearchOpen(true)}
          onOpenDailyBriefing={() => setIsDailyBriefingOpen(true)}
          onOpenMobileMenu={() => setIsMobileSidebarOpen(true)}
          onOpenNotifications={() => setCurrentRoute('notifications')}
          unreadCount={unreadNotificationsCount}
          userName={userProfile.name}
          userAvatar={userProfile.avatarUrl}
          onNavigateProfile={() => setCurrentRoute('profile')}
          onLogout={handleLogout}
        />

        <main className="main-content-scrollable">
          <Routes>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={
              <DashboardView
                onNavigate={setCurrentRoute}
                onOpenCommandCenter={() => setIsCommandCenterOpen(true)}
                onStartStudySession={() => setIsFocusSessionOpen(true)}
                tasksCompletedCount={tasksCompletedCount}
                totalTasksCount={tasks.length}
                userName={userProfile.name}
                userProfile={userProfile}
                subjects={subjects}
                studyMinutesToday={studyMinutesToday}
              />
            } />
            <Route path="timetable" element={
              <TimetableScheduleView
                hasTimetableConfigured={userProfile.hasTimetableConfigured}
                onMarkAttendance={(code, status) => {
                  const sub = subjects.find(
                    (s) => s.code.toLowerCase().includes(code.toLowerCase()) || code.toLowerCase().includes(s.code.toLowerCase())
                  );
                  if (sub) handleMarkAttendance(sub.id, status);
                }}
              />
            } />
            <Route path="ai" element={<AITutorView />} />
            <Route path="calendar" element={<CalendarView />} />
            <Route path="tasks" element={
              <TasksView tasks={tasks} onToggleTask={handleToggleTask} onAddTask={handleAddTask} onDeleteTask={handleDeleteTask} />
            } />
            <Route path="routine" element={<RoutineView />} />
            <Route path="reminders" element={<RemindersView />} />
            <Route path="subjects" element={
              <SubjectsView onNavigate={setCurrentRoute} onOpenAITutorForSubject={() => setCurrentRoute('ai')} subjects={subjects} />
            } />
            <Route path="attendance" element={
              <AttendanceView subjects={subjects} onUpdateAttendance={handleMarkAttendance} criterion={userProfile.criterion} />
            } />
            <Route path="assessments" element={<AssessmentsView />} />
            <Route path="study" element={<StudyView />} />
            <Route path="documents" element={<DocumentVaultView onNavigate={setCurrentRoute} />} />
            <Route path="notifications" element={
              <NotificationsView
                notifications={notifications}
                onMarkAllAsRead={handleMarkAllNotificationsAsRead}
                onToggleRead={handleToggleNotificationRead}
                onDeleteNotification={handleDeleteNotification}
                onNavigate={setCurrentRoute}
                onStartStudySession={() => setIsFocusSessionOpen(true)}
              />
            } />
            <Route path="analytics" element={<AnalyticsView />} />
            <Route path="settings" element={
              <SettingsView
                theme={theme}
                onToggleTheme={() => setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'))}
                userProfile={userProfile}
                onUpdateProfile={handleUpdateProfile}
                onLogout={handleLogout}
              />
            } />
            <Route path="profile" element={
              <ProfileView
                userProfile={userProfile}
                subjects={subjects}
                onUpdateProfile={handleUpdateProfile}
                onOpenOnboarding={() => setIsOnboardingOpen(true)}
                onLogout={handleLogout}
              />
            } />
            <Route path="*" element={<Navigate to="dashboard" replace />} />
          </Routes>
        </main>
      </div>

      {/* Mobile Bottom Navigation (PRESERVED) */}
      <MobileNav
        currentRoute={currentRoute}
        onRouteChange={setCurrentRoute}
        onOpenMoreMenu={() => setIsMobileSidebarOpen(true)}
      />

      {/* ALL MODALS PRESERVED */}
      <CommandCenter
        isOpen={isCommandCenterOpen}
        onClose={() => setIsCommandCenterOpen(false)}
        onNavigate={(route) => setCurrentRoute(route as NavRoute)}
        onTaskAdded={(title, subject) => {
          handleAddTask({ title, subject, priority: 'urgent', deadline: 'Sep 18', estimatedDuration: '45 min' });
        }}
        onStartFocusSession={() => setIsFocusSessionOpen(true)}
      />
      <GlobalSearchModal isOpen={isGlobalSearchOpen} onClose={() => setIsGlobalSearchOpen(false)} onNavigate={setCurrentRoute} />
      <DailyBriefingModal isOpen={isDailyBriefingOpen} onClose={() => setIsDailyBriefingOpen(false)} onStartStudy={() => setIsFocusSessionOpen(true)} />
      <FocusSessionModal isOpen={isFocusSessionOpen} onClose={() => setIsFocusSessionOpen(false)} onSessionComplete={handleLogStudySession} />
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onLogout={handleLogout}
        onSuccess={(name, email, batch) => {
          handleUpdateProfile({ name, ...(email ? { email } : {}), ...(batch ? { batch } : {}) });
        }}
      />
      <OnboardingModal
        isOpen={isOnboardingOpen}
        onClose={() => setIsOnboardingOpen(false)}
        onComplete={handleOnboardingComplete}
        initialName={userProfile.name}
        initialEmail={userProfile.email}
      />
    </div>
  );
}

// ============================================================
// LOGIN PAGE (Enhanced AuthGateway with routing)
// ============================================================

function LoginPage() {
  const { login, register, isAuthenticated, user, loginAsDemoRole } = useAuth();
  const navigate = useNavigate();
  const { showToast } = useToast();

  useEffect(() => {
    if (isAuthenticated && user) {
      const roleRoutes: Record<string, string> = {
        admin: '/admin/dashboard',
        teacher: '/teacher/dashboard',
        student: '/student/dashboard',
      };
      navigate(roleRoutes[user.role] || '/student/dashboard', { replace: true });
    }
  }, [isAuthenticated, user, navigate]);

  const handleAuthSuccess = (authUser: any) => {
    if (authUser.role === 'admin' || authUser.role === 'teacher' || authUser.role === 'student') {
      loginAsDemoRole(authUser.role);
    } else {
      loginAsDemoRole('student');
    }
    showToast('Signed In', `Welcome, ${authUser.fullName || 'User'}.`, 'success');
  };

  return (
    <div style={{ position: 'relative' }}>
      {/* Instant Demo Role Access Floating Bar */}
      <div style={{
        position: 'fixed',
        top: '16px',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 100,
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        padding: '6px 14px',
        backgroundColor: 'rgba(18, 18, 24, 0.92)',
        border: '1px solid var(--border-strong)',
        borderRadius: '30px',
        backdropFilter: 'blur(12px)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
        maxWidth: '92vw',
        overflowX: 'auto',
      }}>
        <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--accent-primary)', textTransform: 'uppercase', letterSpacing: '0.05em', whiteSpace: 'nowrap' }}>
          Instant Demo:
        </span>
        <button
          type="button"
          onClick={() => {
            loginAsDemoRole('student');
            showToast('Student Session', 'Logged in as Abhiram (Student).', 'success');
          }}
          className="btn btn-secondary"
          style={{ fontSize: '12px', padding: '4px 12px', borderRadius: '16px', height: '28px', whiteSpace: 'nowrap' }}
        >
          🎓 Student
        </button>
        <button
          type="button"
          onClick={() => {
            loginAsDemoRole('teacher');
            showToast('Faculty Session', 'Logged in as Prof. Swati Raj (Faculty).', 'success');
          }}
          className="btn btn-secondary"
          style={{ fontSize: '12px', padding: '4px 12px', borderRadius: '16px', height: '28px', whiteSpace: 'nowrap' }}
        >
          👩‍🏫 Faculty
        </button>
        <button
          type="button"
          onClick={() => {
            loginAsDemoRole('admin');
            showToast('Admin Session', 'Logged in as System Administrator.', 'success');
          }}
          className="btn btn-secondary"
          style={{ fontSize: '12px', padding: '4px 12px', borderRadius: '16px', height: '28px', whiteSpace: 'nowrap' }}
        >
          👑 Admin
        </button>
      </div>

      <AuthGateway onAuthSuccess={handleAuthSuccess} />
    </div>
  );
}

// ============================================================
// MAIN APP ROUTER
// ============================================================

function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />

      {/* Student Portal (all existing features preserved) */}
      <Route path="/student/*" element={
        <ProtectedRoute allowedRoles={['student']}>
          <StudentPortal />
        </ProtectedRoute>
      } />

      {/* Admin Portal */}
      <Route path="/admin/*" element={
        <ProtectedRoute allowedRoles={['admin']}>
          <AdminLayout />
        </ProtectedRoute>
      } />

      {/* Teacher Portal */}
      <Route path="/teacher/*" element={
        <ProtectedRoute allowedRoles={['teacher']}>
          <TeacherLayout />
        </ProtectedRoute>
      } />

      {/* Fallback: redirect to appropriate location */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

// ============================================================
// APP ROOT
// ============================================================

export function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </ToastProvider>
  );
}

export default App;
