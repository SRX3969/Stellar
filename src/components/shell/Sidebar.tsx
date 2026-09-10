import React from 'react';
import {
  LayoutDashboard,
  MessageSquareCode,
  Calendar,
  CheckSquare,
  BookOpen,
  UserCheck,
  GraduationCap,
  Layers,
  Bell,
  Files,
  TrendingUp,
  Settings,
  Plus,
  Compass,
  Clock,
  BellRing,
  LogIn,
  Sparkles,
  CalendarClock
} from 'lucide-react';

export type NavRoute =
  | 'dashboard'
  | 'timetable'
  | 'ai'
  | 'calendar'
  | 'tasks'
  | 'routine'
  | 'reminders'
  | 'subjects'
  | 'attendance'
  | 'assessments'
  | 'study'
  | 'notifications'
  | 'documents'
  | 'analytics'
  | 'settings'
  | 'profile';

interface SidebarProps {
  currentRoute: NavRoute;
  onRouteChange: (route: NavRoute) => void;
  onNewChat: () => void;
  unreadNotificationsCount?: number;
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
  onOpenAuth?: () => void;
  onOpenOnboarding?: () => void;
  userName?: string;
  userAvatar?: string;
  userCourse?: string;
  userSemester?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentRoute,
  onRouteChange,
  onNewChat,
  unreadNotificationsCount = 2,
  isOpenMobile = false,
  onCloseMobile,
  onOpenAuth,
  onOpenOnboarding,
  userName = 'Abhiram',
  userAvatar,
  userCourse = 'Computer Science',
  userSemester = 'Semester 5',
}) => {
  const primaryNavItems: { route: NavRoute; label: string; icon: React.ElementType }[] = [
    { route: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { route: 'timetable', label: 'Class Timetable', icon: CalendarClock },
    { route: 'ai', label: 'AI Tutor', icon: MessageSquareCode },
    { route: 'calendar', label: 'Calendar', icon: Calendar },
    { route: 'tasks', label: 'Tasks', icon: CheckSquare },
    { route: 'routine', label: 'Daily Routine', icon: Clock },
    { route: 'reminders', label: 'Reminders', icon: BellRing },
    { route: 'subjects', label: 'Subjects', icon: BookOpen },
    { route: 'attendance', label: 'Attendance', icon: UserCheck },
    { route: 'assessments', label: 'Assessments', icon: GraduationCap },
    { route: 'study', label: 'Study Hub', icon: Layers },
    { route: 'notifications', label: 'Notifications', icon: Bell },
    { route: 'documents', label: 'Document Vault', icon: Files },
    { route: 'analytics', label: 'Analytics', icon: TrendingUp },
  ];

  const handleNavClick = (route: NavRoute) => {
    onRouteChange(route);
    if (onCloseMobile) onCloseMobile();
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div
          onClick={onCloseMobile}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(9, 9, 11, 0.8)',
            zIndex: 90,
            backdropFilter: 'blur(3px)',
          }}
        />
      )}

      <aside
        className={`stellar-sidebar ${isOpenMobile ? 'mobile-open' : ''}`}
        style={{
          width: 'var(--sidebar-width)',
          backgroundColor: 'var(--surface-primary)',
          borderRight: '1px solid var(--border-default)',
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
          zIndex: 100,
          userSelect: 'none',
          transition: 'transform var(--transition-panel)',
        }}
      >
        {/* Brand Header */}
        <div
          style={{
            height: 'var(--topbar-height)',
            padding: '0 20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '1px solid var(--border-subtle)',
          }}
        >
          <div
            onClick={() => handleNavClick('dashboard')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              cursor: 'pointer',
            }}
          >
            <div
              style={{
                width: '28px',
                height: '28px',
                borderRadius: '7px',
                backgroundColor: 'var(--surface-elevated)',
                border: '1px solid var(--border-strong)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--accent-primary)',
              }}
            >
              <Compass size={17} strokeWidth={2.2} />
            </div>
            <div>
              <span
                style={{
                  fontSize: '15px',
                  fontWeight: 700,
                  letterSpacing: '0.08em',
                  color: 'var(--text-primary)',
                  display: 'block',
                  lineHeight: 1.1,
                }}
              >
                STELLAR
              </span>
              <span
                style={{
                  fontSize: '10px',
                  color: 'var(--text-muted)',
                  letterSpacing: '0.02em',
                }}
              >
                Student OS
              </span>
            </div>
          </div>
        </div>

        {/* Quick New Chat Button */}
        <div style={{ padding: '14px 16px 8px 16px' }}>
          <button
            onClick={() => {
              onNewChat();
              handleNavClick('ai');
            }}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              padding: '9px 14px',
              backgroundColor: 'var(--surface-secondary)',
              color: 'var(--text-primary)',
              border: '1px solid var(--border-default)',
              borderRadius: 'var(--radius-md)',
              fontSize: '13px',
              fontWeight: 500,
              transition: 'all var(--transition-fast)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--surface-hover)';
              e.currentTarget.style.borderColor = 'var(--border-strong)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--surface-secondary)';
              e.currentTarget.style.borderColor = 'var(--border-default)';
            }}
          >
            <Plus size={16} style={{ color: 'var(--accent-primary)' }} />
            <span>New Chat</span>
          </button>
        </div>

        {/* Navigation List */}
        <nav
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '8px 12px',
            display: 'flex',
            flexDirection: 'column',
            gap: '2px',
          }}
        >
          {primaryNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentRoute === item.route;

            return (
              <button
                key={item.route}
                onClick={() => handleNavClick(item.route)}
                style={{
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  width: '100%',
                  padding: '8px 12px',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: isActive ? 'var(--surface-elevated)' : 'transparent',
                  color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                  fontWeight: isActive ? 500 : 400,
                  fontSize: '13px',
                  transition: 'all var(--transition-fast)',
                  border: '1px solid',
                  borderColor: isActive ? 'var(--border-strong)' : 'transparent',
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.backgroundColor = 'var(--surface-secondary)';
                    e.currentTarget.style.color = 'var(--text-primary)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.color = 'var(--text-secondary)';
                  }
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Icon
                    size={16}
                    style={{
                      color: isActive ? 'var(--accent-primary)' : 'inherit',
                      transition: 'color var(--transition-fast)',
                    }}
                  />
                  <span>{item.label}</span>
                </div>

                {item.route === 'notifications' && unreadNotificationsCount > 0 && (
                  <span
                    style={{
                      fontSize: '11px',
                      padding: '1px 6px',
                      borderRadius: '10px',
                      backgroundColor: 'var(--color-danger-bg)',
                      color: 'var(--color-danger)',
                      border: '1px solid var(--color-danger-border)',
                      fontWeight: 600,
                    }}
                  >
                    {unreadNotificationsCount}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Footer Navigation */}
        <div
          style={{
            padding: '12px',
            borderTop: '1px solid var(--border-subtle)',
            display: 'flex',
            flexDirection: 'column',
            gap: '2px',
          }}
        >
          <button
            onClick={() => handleNavClick('settings')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              width: '100%',
              padding: '8px 12px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: currentRoute === 'settings' ? 'var(--surface-elevated)' : 'transparent',
              color: currentRoute === 'settings' ? 'var(--text-primary)' : 'var(--text-secondary)',
              fontSize: '13px',
            }}
          >
            <Settings size={16} />
            <span>Settings</span>
          </button>

          {/* Student Profile Quick View */}
          <div
            onClick={() => handleNavClick('profile')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '8px 10px',
              marginTop: '4px',
              borderRadius: 'var(--radius-md)',
              cursor: 'pointer',
              backgroundColor: currentRoute === 'profile' ? 'var(--surface-elevated)' : 'var(--surface-secondary)',
              border: '1px solid var(--border-default)',
            }}
          >
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                backgroundColor: 'var(--accent-subtle)',
                border: '1px solid var(--accent-border)',
                color: 'var(--accent-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: userAvatar && userAvatar.length <= 4 ? '15px' : '12px',
                fontWeight: 600,
                textTransform: 'uppercase',
                overflow: 'hidden',
                flexShrink: 0,
              }}
            >
              {userAvatar && userAvatar.startsWith('data:') ? (
                <img src={userAvatar} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : userAvatar ? (
                <span>{userAvatar}</span>
              ) : (
                userName.charAt(0) || 'A'
              )}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div
                style={{
                  fontSize: '13px',
                  fontWeight: 500,
                  color: 'var(--text-primary)',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {userName}
              </div>
              <div
                style={{
                  fontSize: '11px',
                  color: 'var(--text-muted)',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {userCourse} • {userSemester}
              </div>
            </div>
          </div>

          {/* Quick Setup & Auth action bar */}
          <div style={{ display: 'flex', gap: '6px', marginTop: '6px' }}>
            {onOpenOnboarding && (
              <button
                type="button"
                onClick={onOpenOnboarding}
                title="Open Setup Wizard"
                style={{
                  flex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '4px',
                  padding: '5px 8px',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: 'transparent',
                  border: '1px solid var(--border-subtle)',
                  color: 'var(--text-muted)',
                  fontSize: '11px',
                  transition: 'all var(--transition-fast)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--surface-secondary)';
                  e.currentTarget.style.color = 'var(--accent-primary)';
                  e.currentTarget.style.borderColor = 'var(--accent-border)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = 'var(--text-muted)';
                  e.currentTarget.style.borderColor = 'var(--border-subtle)';
                }}
              >
                <Sparkles size={12} style={{ color: 'var(--accent-primary)' }} />
                <span>Setup</span>
              </button>
            )}

            {onOpenAuth && (
              <button
                type="button"
                onClick={onOpenAuth}
                title="Sign in or switch student profile"
                style={{
                  flex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '4px',
                  padding: '5px 8px',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: 'transparent',
                  border: '1px solid var(--border-subtle)',
                  color: 'var(--text-muted)',
                  fontSize: '11px',
                  transition: 'all var(--transition-fast)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--surface-secondary)';
                  e.currentTarget.style.color = 'var(--text-primary)';
                  e.currentTarget.style.borderColor = 'var(--border-strong)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = 'var(--text-muted)';
                  e.currentTarget.style.borderColor = 'var(--border-subtle)';
                }}
              >
                <LogIn size={12} />
                <span>Account</span>
              </button>
            )}
          </div>
        </div>
      </aside>
    </>
  );
};
