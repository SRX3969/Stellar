import React, { useState } from 'react';
import {
  Bell,
  CheckCircle2,
  AlertCircle,
  Calendar,
  Layers,
  Clock,
  Check,
  Trash2,
  ChevronRight,
  Eye,
  EyeOff,
  Sparkles,
  CheckSquare
} from 'lucide-react';
import { NotificationItem } from '../../types';
import { NavRoute } from '../shell/Sidebar';

interface NotificationsViewProps {
  notifications: NotificationItem[];
  onMarkAllAsRead: () => void;
  onToggleRead?: (id: string) => void;
  onDeleteNotification?: (id: string) => void;
  onNavigate?: (route: NavRoute) => void;
  onStartStudySession?: () => void;
}

export const NotificationsView: React.FC<NotificationsViewProps> = ({
  notifications,
  onMarkAllAsRead,
  onToggleRead,
  onDeleteNotification,
  onNavigate,
  onStartStudySession,
}) => {
  const [filter, setFilter] = useState<'all' | 'unread' | 'urgent'>('all');

  const filtered = notifications.filter((n) => {
    if (filter === 'urgent') return n.priority === 'urgent';
    if (filter === 'unread') return !n.read;
    return true;
  });

  const getIcon = (type: NotificationItem['type']) => {
    switch (type) {
      case 'attendance':
        return <AlertCircle size={16} style={{ color: 'var(--color-danger)' }} />;
      case 'deadline':
        return <Calendar size={16} style={{ color: 'var(--color-warning)' }} />;
      case 'study':
        return <Layers size={16} style={{ color: 'var(--accent-primary)' }} />;
      default:
        return <Clock size={16} style={{ color: 'var(--color-info)' }} />;
    }
  };

  const handleActionClick = (item: NotificationItem) => {
    if (onToggleRead && !item.read) {
      onToggleRead(item.id);
    }

    if (item.type === 'attendance' && onNavigate) {
      onNavigate('attendance');
    } else if (item.type === 'study' && onStartStudySession) {
      onStartStudySession();
    } else if (item.type === 'deadline' && onNavigate) {
      onNavigate('assessments');
    } else if (item.type === 'task' && onNavigate) {
      onNavigate('tasks');
    }
  };

  const getActionButtonLabel = (type: NotificationItem['type']) => {
    switch (type) {
      case 'attendance':
        return 'Check Attendance Buffer';
      case 'study':
        return 'Launch Focus Block';
      case 'deadline':
        return 'View Assessments';
      case 'task':
        return 'Go to Tasks';
      default:
        return 'View Details';
    }
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px', maxWidth: '900px', margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>System Intelligence</span>
            <span style={{ color: 'var(--border-strong)' }}>•</span>
            <span style={{ fontSize: '12px', color: 'var(--accent-primary)', fontWeight: 500 }}>
              {unreadCount} Unread Alert{unreadCount === 1 ? '' : 's'}
            </span>
          </div>
          <h2 style={{ fontSize: '28px', fontWeight: 600, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
            Notifications &amp; Signal Center
          </h2>
          <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginTop: '4px' }}>
            Actionable academic alerts with zero noise.
          </p>
        </div>

        {unreadCount > 0 && (
          <button
            onClick={onMarkAllAsRead}
            className="btn btn-secondary"
          >
            <Check size={14} />
            <span>Mark all as read</span>
          </button>
        )}
      </div>

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid var(--border-default)', paddingBottom: '12px' }}>
        <button
          onClick={() => setFilter('all')}
          style={{
            padding: '6px 14px',
            borderRadius: 'var(--radius-md)',
            fontSize: '13px',
            fontWeight: filter === 'all' ? 600 : 400,
            backgroundColor: filter === 'all' ? 'var(--surface-elevated)' : 'transparent',
            color: filter === 'all' ? 'var(--text-primary)' : 'var(--text-secondary)',
            border: '1px solid',
            borderColor: filter === 'all' ? 'var(--border-strong)' : 'transparent',
          }}
        >
          All ({notifications.length})
        </button>

        <button
          onClick={() => setFilter('unread')}
          style={{
            padding: '6px 14px',
            borderRadius: 'var(--radius-md)',
            fontSize: '13px',
            fontWeight: filter === 'unread' ? 600 : 400,
            backgroundColor: filter === 'unread' ? 'var(--surface-elevated)' : 'transparent',
            color: filter === 'unread' ? 'var(--text-primary)' : 'var(--text-secondary)',
            border: '1px solid',
            borderColor: filter === 'unread' ? 'var(--border-strong)' : 'transparent',
          }}
        >
          Unread ({unreadCount})
        </button>

        <button
          onClick={() => setFilter('urgent')}
          style={{
            padding: '6px 14px',
            borderRadius: 'var(--radius-md)',
            fontSize: '13px',
            fontWeight: filter === 'urgent' ? 600 : 400,
            backgroundColor: filter === 'urgent' ? 'var(--surface-elevated)' : 'transparent',
            color: filter === 'urgent' ? 'var(--text-primary)' : 'var(--text-secondary)',
            border: '1px solid',
            borderColor: filter === 'urgent' ? 'var(--border-strong)' : 'transparent',
          }}
        >
          Urgent Alerts ({notifications.filter(n => n.priority === 'urgent').length})
        </button>
      </div>

      {/* Notification List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {filtered.length === 0 ? (
          <div className="card-base" style={{ padding: '36px', textAlign: 'center', color: 'var(--text-muted)' }}>
            <CheckCircle2 size={32} style={{ color: 'var(--color-success)', margin: '0 auto 12px auto' }} />
            <div style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-primary)' }}>All caught up!</div>
            <p style={{ fontSize: '13px', marginTop: '4px' }}>No alerts matching the selected filter.</p>
          </div>
        ) : (
          filtered.map((item) => (
            <div
              key={item.id}
              className="card-base"
              style={{
                padding: '16px 20px',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '14px',
                backgroundColor: !item.read ? 'var(--surface-secondary)' : 'var(--surface-primary)',
                borderLeft: !item.read
                  ? (item.priority === 'urgent' ? '3px solid var(--color-danger)' : '3px solid var(--accent-primary)')
                  : '1px solid var(--border-default)',
                transition: 'all var(--transition-fast)',
              }}
            >
              <div style={{ marginTop: '2px' }}>
                {getIcon(item.type)}
              </div>

              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '10px' }}>
                  <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>
                    {item.title}
                  </div>
                  <span style={{ fontSize: '12px', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
                    {item.timestamp}
                  </span>
                </div>

                <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px', lineHeight: 1.5 }}>
                  {item.description}
                </p>

                {/* Contextual Action & Control Buttons */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '12px', paddingTop: '10px', borderTop: '1px solid var(--border-subtle)' }}>
                  <button
                    type="button"
                    onClick={() => handleActionClick(item)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px',
                      fontSize: '12px',
                      fontWeight: 600,
                      color: 'var(--accent-light)',
                      backgroundColor: 'transparent',
                      padding: 0,
                    }}
                  >
                    <span>{getActionButtonLabel(item.type)}</span>
                    <ChevronRight size={13} />
                  </button>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {onToggleRead && (
                      <button
                        type="button"
                        onClick={() => onToggleRead(item.id)}
                        title={item.read ? 'Mark as unread' : 'Mark as read'}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                          padding: '4px 8px',
                          borderRadius: 'var(--radius-sm)',
                          backgroundColor: 'var(--surface-elevated)',
                          border: '1px solid var(--border-subtle)',
                          fontSize: '11px',
                          color: 'var(--text-secondary)',
                        }}
                      >
                        {item.read ? <EyeOff size={12} /> : <Eye size={12} />}
                        <span>{item.read ? 'Mark Unread' : 'Mark Read'}</span>
                      </button>
                    )}

                    {onDeleteNotification && (
                      <button
                        type="button"
                        onClick={() => onDeleteNotification(item.id)}
                        title="Dismiss notification"
                        style={{
                          padding: '4px 6px',
                          borderRadius: 'var(--radius-sm)',
                          color: 'var(--text-muted)',
                          backgroundColor: 'transparent',
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--color-danger)')}
                        onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-muted)')}
                      >
                        <Trash2 size={13} />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

