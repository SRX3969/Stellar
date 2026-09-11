import React, { useState, useEffect } from 'react';
import { Sidebar, NavRoute } from './components/shell/Sidebar';
import { TopBar } from './components/shell/TopBar';
import { MobileNav } from './components/shell/MobileNav';
import { CommandCenter } from './components/command-center/CommandCenter';
import { GlobalSearchModal } from './components/shell/GlobalSearchModal';
import { DailyBriefingModal } from './components/dashboard/DailyBriefingModal';
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
import { AuthGateway } from './components/auth/AuthGateway';
import { AuthModal } from './components/auth/AuthModal';
import { OnboardingModal } from './components/auth/OnboardingModal';
import { ToastProvider, useToast } from './components/common/Toast';
import { db } from './services/db';

import { INITIAL_TASKS, NOTIFICATIONS, SUBJECTS as INITIAL_SUBJECTS } from './data/mockData';
import { Task, NotificationItem, Subject, UserProfile } from './types';

export function AppContent() {
  const [currentRoute, setCurrentRoute] = useState<NavRoute>('dashboard');
  const [currentUser, setCurrentUser] = useState<any>(() => db.getCurrentUser());

  // Persistent User Profile State
  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem('stellar_user_profile');
      if (saved) return JSON.parse(saved);
    } catch {}
    const activeDbUser = db.getCurrentUser();
    return {
      name: activeDbUser?.fullName || 'Abhiram',
      email: activeDbUser?.email || 'abhiram.stellar@gmail.com',
      university: activeDbUser?.university || 'School of Engineering and Technology',
      course: activeDbUser?.course || 'B.Tech AI & Data Science',
      semester: activeDbUser?.semester || 'III Sem',
      criterion: activeDbUser?.criterion || 75,
      dailyGoal: activeDbUser?.dailyGoal || 2.0,
      studentId: activeDbUser?.studentId || 'AI26-BTECH-303',
      registrationBatch: 'Batch of 2027',
      batch: activeDbUser?.batch || 'B1',
      avatarUrl: activeDbUser?.avatarUrl || '',
      dob: activeDbUser?.dob || '2005-04-16',
      department: activeDbUser?.department || 'Department of AI and Data Science Engineering',
      campus: activeDbUser?.campus || 'Central Campus / Arch Block',
      roomNo: activeDbUser?.roomNo || 'Room No: 303, 3F- Arch Block',
      classTeacher: activeDbUser?.classTeacher || 'Prof. Swati Raj',
      onboardingCompleted: activeDbUser?.onboardingCompleted ?? true,
      hasTimetableConfigured: activeDbUser?.hasTimetableConfigured ?? true,
    };
  });

  // Persistent Subjects State with live attendance tracking
  const [subjects, setSubjects] = useState<Subject[]>(() => {
    try {
      const saved = localStorage.getItem('stellar_subjects');
      if (saved) return JSON.parse(saved);
    } catch {}
    return INITIAL_SUBJECTS;
  });

  // Persistent Today's Study Minutes
  const [studyMinutesToday, setStudyMinutesToday] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('stellar_study_minutes');
      if (saved) return Number(saved);
    } catch {}
    return 80; // 1h 20m default baseline
  });

  // Persistent Tasks State
  const [tasks, setTasks] = useState<Task[]>(() => {
    try {
      const saved = localStorage.getItem('stellar_tasks');
      if (saved) return JSON.parse(saved);
    } catch {}
    return INITIAL_TASKS;
  });

  // Persistent Notifications State
  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    try {
      const saved = localStorage.getItem('stellar_notifications');
      if (saved) return JSON.parse(saved);
    } catch {}
    return NOTIFICATIONS;
  });

  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  // Modals state
  const [isCommandCenterOpen, setIsCommandCenterOpen] = useState(false);
  const [isGlobalSearchOpen, setIsGlobalSearchOpen] = useState(false);
  const [isDailyBriefingOpen, setIsDailyBriefingOpen] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isFocusSessionOpen, setIsFocusSessionOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);

  // Sync theme attribute on document root
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Sync state to local storage
  useEffect(() => {
    localStorage.setItem('stellar_user_profile', JSON.stringify(userProfile));
  }, [userProfile]);

  useEffect(() => {
    localStorage.setItem('stellar_subjects', JSON.stringify(subjects));
  }, [subjects]);

  useEffect(() => {
    localStorage.setItem('stellar_study_minutes', String(studyMinutesToday));
  }, [studyMinutesToday]);

  useEffect(() => {
    localStorage.setItem('stellar_tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('stellar_notifications', JSON.stringify(notifications));
  }, [notifications]);

  // Global hotkeys (Ctrl+K or Cmd+K for Command Center, / for Search)
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsCommandCenterOpen((prev) => !prev);
      }
      if (
        e.key === '/' &&
        !isCommandCenterOpen &&
        !isGlobalSearchOpen &&
        document.activeElement?.tagName !== 'INPUT' &&
        document.activeElement?.tagName !== 'TEXTAREA'
      ) {
        e.preventDefault();
        setIsGlobalSearchOpen(true);
      }
    };

    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, [isCommandCenterOpen, isGlobalSearchOpen]);

  // Profile update handler
  const handleUpdateProfile = (updated: Partial<UserProfile>) => {
    setUserProfile((prev) => ({ ...prev, ...updated }));
  };

  // Live attendance marker
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

          return {
            ...s,
            attendance: {
              ...s.attendance,
              present: newPresent,
              total: newTotal,
              percentage: newPct,
              status: newStatus,
            },
          };
        }
        return s;
      })
    );
  };

  // Study focus logger
  const handleLogStudySession = (minutesLogged: number) => {
    setStudyMinutesToday((prev) => prev + minutesLogged);
  };

  // Task management handlers
  const handleToggleTask = (taskId: string) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === taskId) {
          const newCompleted = !t.completed;
          return {
            ...t,
            completed: newCompleted,
            section: newCompleted ? 'completed' : 'today',
          };
        }
        return t;
      })
    );
  };

  const handleAddTask = (newTask: Omit<Task, 'id' | 'completed' | 'section'>) => {
    const task: Task = {
      ...newTask,
      id: `task-${Date.now()}`,
      completed: false,
      section: 'today',
    };
    setTasks((prev) => [task, ...prev]);
  };

  const handleDeleteTask = (taskId: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
  };

  // Notification management handlers
  const handleMarkAllNotificationsAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const handleToggleNotificationRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: !n.read } : n))
    );
  };

  const handleDeleteNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const unreadNotificationsCount = notifications.filter((n) => !n.read).length;
  const tasksCompletedCount = tasks.filter((t) => t.completed).length;

  const handleAuthSuccess = (user: any) => {
    setCurrentUser(user);
    setUserProfile((prev) => ({
      ...prev,
      name: user.fullName || prev.name,
      email: user.email || prev.email,
      university: user.university || prev.university,
      course: user.course || prev.course,
      semester: user.semester || prev.semester,
      batch: user.batch || prev.batch,
      studentId: user.studentId || prev.studentId,
      avatarUrl: user.avatarUrl || prev.avatarUrl,
      dob: user.dob || prev.dob,
      department: user.department || prev.department,
      roomNo: user.roomNo || prev.roomNo,
      campus: user.campus || prev.campus,
      classTeacher: user.classTeacher || prev.classTeacher,
      onboardingCompleted: user.onboardingCompleted,
      hasTimetableConfigured: user.hasTimetableConfigured,
    }));
    if (!user.onboardingCompleted) {
      setIsOnboardingOpen(true);
    }
  };

  const handleOnboardingComplete = (data: Partial<UserProfile>) => {
    handleUpdateProfile(data);
    if (currentUser) {
      db.updateUser(currentUser.id, {
        fullName: data.name,
        dob: data.dob,
        studentId: data.studentId,
        avatarUrl: data.avatarUrl,
        university: data.university,
        campus: data.campus,
        department: data.department,
        course: data.course,
        semester: data.semester,
        roomNo: data.roomNo,
        batch: data.batch,
        classTeacher: data.classTeacher,
        criterion: data.criterion,
        dailyGoal: data.dailyGoal,
        onboardingCompleted: true,
        hasTimetableConfigured: data.hasTimetableConfigured,
      });
      setCurrentUser(db.getCurrentUser());
    }
    setIsOnboardingOpen(false);
  };

  const { showToast } = useToast();

  const handleLogout = () => {
    db.logout();
    setCurrentUser(null);
    showToast('Signed Out', 'You have been securely signed out. Access to STELLAR is now locked.', 'info');
  };

  // MANDATORY LOGIN GATE: Only authenticated users can access the website
  if (!currentUser) {
    return <AuthGateway onAuthSuccess={handleAuthSuccess} />;
  }

  return (
    <div className="app-container">
      {/* Fixed Left Sidebar */}
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

      {/* Main Viewport Container */}
      <div className="main-viewport">
        {/* TopBar */}
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

        {/* Scrollable View Content */}
        <main className="main-content-scrollable">
          {currentRoute === 'dashboard' && (
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
          )}

          {currentRoute === 'timetable' && (
            <TimetableScheduleView
              hasTimetableConfigured={userProfile.hasTimetableConfigured}
              onMarkAttendance={(code, status) => {
                const sub = subjects.find(
                  (s) => s.code.toLowerCase().includes(code.toLowerCase()) || code.toLowerCase().includes(s.code.toLowerCase())
                );
                if (sub) {
                  handleMarkAttendance(sub.id, status);
                }
              }}
            />
          )}

          {currentRoute === 'ai' && <AITutorView />}

          {currentRoute === 'calendar' && <CalendarView />}

          {currentRoute === 'tasks' && (
            <TasksView
              tasks={tasks}
              onToggleTask={handleToggleTask}
              onAddTask={handleAddTask}
              onDeleteTask={handleDeleteTask}
            />
          )}

          {currentRoute === 'routine' && <RoutineView />}

          {currentRoute === 'reminders' && <RemindersView />}

          {currentRoute === 'subjects' && (
            <SubjectsView
              onNavigate={setCurrentRoute}
              onOpenAITutorForSubject={() => setCurrentRoute('ai')}
              subjects={subjects}
            />
          )}

          {currentRoute === 'attendance' && (
            <AttendanceView
              subjects={subjects}
              onUpdateAttendance={handleMarkAttendance}
              criterion={userProfile.criterion}
            />
          )}

          {currentRoute === 'assessments' && <AssessmentsView />}

          {currentRoute === 'study' && <StudyView />}

          {currentRoute === 'documents' && <DocumentVaultView onNavigate={setCurrentRoute} />}

          {currentRoute === 'notifications' && (
            <NotificationsView
              notifications={notifications}
              onMarkAllAsRead={handleMarkAllNotificationsAsRead}
              onToggleRead={handleToggleNotificationRead}
              onDeleteNotification={handleDeleteNotification}
              onNavigate={setCurrentRoute}
              onStartStudySession={() => setIsFocusSessionOpen(true)}
            />
          )}

          {currentRoute === 'analytics' && <AnalyticsView />}

          {currentRoute === 'settings' && (
            <SettingsView
              theme={theme}
              onToggleTheme={() => setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'))}
              userProfile={userProfile}
              onUpdateProfile={handleUpdateProfile}
              onLogout={handleLogout}
            />
          )}

          {currentRoute === 'profile' && (
            <ProfileView
              userProfile={userProfile}
              subjects={subjects}
              onUpdateProfile={handleUpdateProfile}
              onOpenOnboarding={() => setIsOnboardingOpen(true)}
              onLogout={handleLogout}
            />
          )}
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <MobileNav
        currentRoute={currentRoute}
        onRouteChange={setCurrentRoute}
        onOpenMoreMenu={() => setIsMobileSidebarOpen(true)}
      />

      {/* Signature Command Center Modal */}
      <CommandCenter
        isOpen={isCommandCenterOpen}
        onClose={() => setIsCommandCenterOpen(false)}
        onNavigate={(route) => setCurrentRoute(route as NavRoute)}
        onTaskAdded={(title, subject) => {
          handleAddTask({
            title,
            subject,
            priority: 'urgent',
            deadline: 'Sep 18',
            estimatedDuration: '45 min',
          });
        }}
        onStartFocusSession={() => setIsFocusSessionOpen(true)}
      />

      {/* Global Search Modal */}
      <GlobalSearchModal
        isOpen={isGlobalSearchOpen}
        onClose={() => setIsGlobalSearchOpen(false)}
        onNavigate={setCurrentRoute}
      />

      {/* Daily Briefing & Review Modal */}
      <DailyBriefingModal
        isOpen={isDailyBriefingOpen}
        onClose={() => setIsDailyBriefingOpen(false)}
        onStartStudy={() => setIsFocusSessionOpen(true)}
      />

      {/* Interactive Focus / Study Session Modal */}
      <FocusSessionModal
        isOpen={isFocusSessionOpen}
        onClose={() => setIsFocusSessionOpen(false)}
        onSessionComplete={handleLogStudySession}
      />

      {/* Auth Modal (/login and /signup) */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onLogout={handleLogout}
        onSuccess={(name, email, batch) => {
          handleUpdateProfile({
            name,
            ...(email ? { email } : {}),
            ...(batch ? { batch } : {}),
          });
          const updatedUser = db.getCurrentUser();
          setCurrentUser(updatedUser);
          if (updatedUser && !updatedUser.onboardingCompleted) {
            setIsOnboardingOpen(true);
          }
        }}
      />

      {/* Onboarding Wizard Modal (/onboarding) */}
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

export function App() {
  return (
    <ToastProvider>
      <AppContent />
    </ToastProvider>
  );
}

export default App;
