import React from 'react';
import { Search, Sparkles, Menu, Bell, SunMedium, Moon } from 'lucide-react';
import { NavRoute } from './Sidebar';

interface TopBarProps {
  currentRoute: NavRoute;
  onOpenCommandCenter: () => void;
  onOpenGlobalSearch: () => void;
  onOpenDailyBriefing: () => void;
  onOpenMobileMenu: () => void;
  onOpenNotifications: () => void;
  unreadCount?: number;
  userName?: string;
  userAvatar?: string;
  onNavigateProfile?: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  currentRoute,
  onOpenCommandCenter,
  onOpenGlobalSearch,
  onOpenDailyBriefing,
  onOpenMobileMenu,
  onOpenNotifications,
  unreadCount = 2,
  userName = 'Abhiram',
  userAvatar,
  onNavigateProfile,
}) => {
  const getPageTitle = (route: NavRoute) => {
    switch (route) {
      case 'dashboard':
        return 'Dashboard';
      case 'timetable':
        return 'Class Timetable';
      case 'ai':
        return 'AI Tutor';
      case 'calendar':
        return 'Calendar';
      case 'tasks':
        return 'Tasks';
      case 'routine':
        return 'Daily Routine';
      case 'reminders':
        return 'Smart Reminders';
      case 'subjects':
        return 'Subjects';
      case 'attendance':
        return 'Attendance';
      case 'assessments':
        return 'Assessments';
      case 'study':
        return 'Study Hub';
      case 'notifications':
        return 'Notifications';
      case 'documents':
        return 'Document Vault';
      case 'analytics':
        return 'Analytics';
      case 'settings':
        return 'Settings';
      case 'profile':
        return 'Student Profile';
      default:
        return 'STELLAR';
    }
  };

  return (
    <header
      style={{
        height: 'var(--topbar-height)',
        backgroundColor: 'var(--surface-primary)',
        borderBottom: '1px solid var(--border-default)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 24px',
        userSelect: 'none',
        zIndex: 50,
      }}
    >
      {/* Left side: Mobile Toggle & Page Title */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <button
          className="mobile-menu-btn"
          onClick={onOpenMobileMenu}
          style={{
            display: 'none',
            color: 'var(--text-secondary)',
            padding: '6px',
            borderRadius: 'var(--radius-sm)',
          }}
          aria-label="Toggle navigation menu"
        >
          <Menu size={20} />
        </button>

        <div>
          <h1
            style={{
              fontSize: '16px',
              fontWeight: 600,
              color: 'var(--text-primary)',
              letterSpacing: '-0.01em',
              margin: 0,
            }}
          >
            {getPageTitle(currentRoute)}
          </h1>
        </div>
      </div>

      {/* Middle: Global Search Trigger */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1, maxWidth: '420px', margin: '0 20px' }}>
        <button
          onClick={onOpenGlobalSearch}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '7px 12px',
            backgroundColor: 'var(--surface-secondary)',
            border: '1px solid var(--border-default)',
            borderRadius: 'var(--radius-md)',
            color: 'var(--text-muted)',
            fontSize: '13px',
            transition: 'border-color var(--transition-fast)',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'var(--border-strong)')}
          onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'var(--border-default)')}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Search size={14} style={{ color: 'var(--text-muted)' }} />
            <span>Search subjects, tasks, notes...</span>
          </div>
          <kbd
            style={{
              fontSize: '11px',
              padding: '1px 5px',
              borderRadius: '4px',
              backgroundColor: 'var(--surface-elevated)',
              border: '1px solid var(--border-subtle)',
              color: 'var(--text-secondary)',
              fontFamily: 'inherit',
            }}
          >
            /
          </kbd>
        </button>
      </div>

      {/* Right Side Actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        {/* Daily Briefing Button */}
        <button
          onClick={onOpenDailyBriefing}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '6px 12px',
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'var(--surface-secondary)',
            border: '1px solid var(--border-default)',
            color: 'var(--text-secondary)',
            fontSize: '12px',
            fontWeight: 500,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = 'var(--text-primary)';
            e.currentTarget.style.borderColor = 'var(--border-strong)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = 'var(--text-secondary)';
            e.currentTarget.style.borderColor = 'var(--border-default)';
          }}
        >
          <SunMedium size={14} style={{ color: 'var(--color-warning)' }} />
          <span className="hide-on-mobile">Daily Briefing</span>
        </button>

        {/* Signature Action: "✦ What should I do now?" */}
        <button
          onClick={onOpenCommandCenter}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '7px 14px',
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'var(--accent-subtle)',
            border: '1px solid var(--accent-border)',
            color: 'var(--accent-light)',
            fontSize: '13px',
            fontWeight: 500,
            transition: 'all var(--transition-fast)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(200, 169, 107, 0.16)';
            e.currentTarget.style.borderColor = 'var(--accent-primary)';
            e.currentTarget.style.transform = 'translateY(-1px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--accent-subtle)';
            e.currentTarget.style.borderColor = 'var(--accent-border)';
            e.currentTarget.style.transform = 'translateY(0)';
          }}
        >
          <Sparkles size={14} style={{ color: 'var(--accent-primary)' }} />
          <span style={{ fontWeight: 600 }}>What should I do now?</span>
          <kbd
            style={{
              fontSize: '10px',
              padding: '1px 4px',
              borderRadius: '3px',
              backgroundColor: 'rgba(0,0,0,0.3)',
              border: '1px solid var(--accent-border)',
              marginLeft: '4px',
            }}
          >
            ⌘K
          </kbd>
        </button>

        {/* Notification Bell */}
        <button
          onClick={onOpenNotifications}
          aria-label="Notifications"
          style={{
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '34px',
            height: '34px',
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'transparent',
            color: 'var(--text-secondary)',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--surface-secondary)')}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
        >
          <Bell size={16} />
          {unreadCount > 0 && (
            <span
              style={{
                position: 'absolute',
                top: '6px',
                right: '6px',
                width: '7px',
                height: '7px',
                borderRadius: '50%',
                backgroundColor: 'var(--color-danger)',
              }}
            />
          )}
        </button>

        {/* Profile Avatar Quick Link */}
        {onNavigateProfile && (
          <button
            onClick={onNavigateProfile}
            title={`View profile for ${userName}`}
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              backgroundColor: 'var(--accent-subtle)',
              border: '1.5px solid var(--accent-border)',
              color: 'var(--accent-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '12px',
              fontWeight: 700,
              textTransform: 'uppercase',
              cursor: 'pointer',
              transition: 'all var(--transition-fast)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.06)';
              e.currentTarget.style.borderColor = 'var(--accent-primary)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.borderColor = 'var(--accent-border)';
            }}
          >
            {userAvatar && userAvatar.startsWith('data:') ? (
              <img src={userAvatar} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : userAvatar ? (
              <span style={{ fontSize: '16px' }}>{userAvatar}</span>
            ) : (
              userName.charAt(0) || 'A'
            )}
          </button>
        )}
      </div>
    </header>
  );
};
