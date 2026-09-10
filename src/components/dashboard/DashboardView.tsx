import React, { useState } from 'react';
import {
  Sparkles,
  ArrowRight,
  Clock,
  AlertCircle,
  Calendar,
  CheckCircle2,
  BookOpen,
  GraduationCap,
  Play,
  TrendingUp,
  ExternalLink,
  CalendarClock,
  Bell
} from 'lucide-react';
import { TODAY_TIMELINE, ATTENTION_ITEMS, UPCOMING_ASSESSMENTS, SUBJECTS as DEFAULT_SUBJECTS } from '../../data/mockData';
import { calculateOngoingClass, INSTITUTIONAL_INFO } from '../../data/timetableData';
import { db } from '../../services/db';
import { NavRoute } from '../shell/Sidebar';
import { Subject, UserProfile } from '../../types';

interface DashboardViewProps {
  onNavigate: (route: NavRoute) => void;
  onOpenCommandCenter: () => void;
  onStartStudySession?: () => void;
  tasksCompletedCount: number;
  totalTasksCount: number;
  userName?: string;
  userProfile?: UserProfile;
  subjects?: Subject[];
  studyMinutesToday?: number;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  onNavigate,
  onOpenCommandCenter,
  onStartStudySession,
  tasksCompletedCount,
  totalTasksCount,
  userName = 'Abhiram',
  userProfile,
  subjects = DEFAULT_SUBJECTS,
  studyMinutesToday = 80,
}) => {
  const [activeSessionStarted, setActiveSessionStarted] = useState(false);

  const criterion = userProfile?.criterion || 75;
  const targetDailyHours = userProfile?.dailyGoal || 2.0;
  const targetDailyMinutes = Math.round(targetDailyHours * 60);

  // Overall attendance calculation from live subjects
  const totalAttended = subjects.reduce((acc, s) => acc + s.attendance.present, 0);
  const totalClasses = subjects.reduce((acc, s) => acc + s.attendance.total, 0);
  const overallAttendance = totalClasses > 0 ? Math.round((totalAttended / totalClasses) * 100) : 82;

  // Study hours calculation
  const studyHours = Math.floor(studyMinutesToday / 60);
  const studyMins = studyMinutesToday % 60;
  const studyTimeString = `${studyHours > 0 ? `${studyHours}h ` : ''}${studyMins}m`;
  const studyGoalPercent = Math.min(100, Math.round((studyMinutesToday / targetDailyMinutes) * 100));

  // Find any at-risk subject for the attendance card footnote
  const atRiskSubject = subjects.find((s) => s.attendance.percentage < criterion);

  const userBatch = userProfile?.batch || db.getBatch() || 'B1';
  const activeClassReminders = db.getReminders().filter((r) => !r.completed);

  // Timetable Ongoing calculation
  const now = new Date();
  const dayIndex = now.getDay();
  const daysMap: Record<number, 'MON' | 'TUE' | 'WED' | 'THU' | 'FRI' | 'SAT'> = {
    1: 'MON', 2: 'TUE', 3: 'WED', 4: 'THU', 5: 'FRI', 6: 'SAT',
  };
  const currentDay = daysMap[dayIndex] || 'MON';
  const currentTimeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
  const ongoing = calculateOngoingClass(currentDay, currentTimeStr, userBatch);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', maxWidth: '1200px', margin: '0 auto' }}>
      {/* Top Editorial Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Wednesday, September 9</span>
            <span style={{ color: 'var(--border-strong)' }}>•</span>
            <span style={{ fontSize: '12px', color: 'var(--accent-primary)', fontWeight: 500 }}>
              {userProfile?.semester || "Fall Semester '26"}
            </span>
          </div>
          <h2
            style={{
              fontSize: '28px',
              fontWeight: 600,
              letterSpacing: '-0.02em',
              color: 'var(--text-primary)',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
            }}
          >
            Good evening, {userName} 👋
          </h2>
          <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginTop: '4px' }}>
            What matters today: 1 urgent CIA revision, OS attendance buffer warning, and 1 assignment due.
          </p>
        </div>

        {/* Quick Trigger Button for Command Center */}
        <button
          onClick={onOpenCommandCenter}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 18px',
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'var(--surface-elevated)',
            border: '1px solid var(--border-strong)',
            color: 'var(--text-primary)',
            fontSize: '13px',
            fontWeight: 500,
            boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = 'var(--accent-primary)';
            e.currentTarget.style.backgroundColor = 'var(--surface-hover)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = 'var(--border-strong)';
            e.currentTarget.style.backgroundColor = 'var(--surface-elevated)';
          }}
        >
          <Sparkles size={15} style={{ color: 'var(--accent-primary)' }} />
          <span>What should I do now?</span>
          <kbd style={{ fontSize: '11px', padding: '1px 5px', borderRadius: '4px', backgroundColor: 'var(--surface-primary)', border: '1px solid var(--border-default)', color: 'var(--text-muted)' }}>⌘K</kbd>
        </button>
      </div>

      {/* 4 Stat Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '16px',
        }}
      >
        {/* Attendance Stat */}
        <div
          onClick={() => onNavigate('attendance')}
          className="card-base"
          style={{ cursor: 'pointer', padding: '16px 20px' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '13px', color: 'var(--text-secondary)', fontWeight: 500 }}>Attendance</span>
            <span
              style={{
                fontSize: '11px',
                padding: '2px 7px',
                borderRadius: '4px',
                backgroundColor: overallAttendance >= criterion ? 'var(--color-success-bg)' : 'var(--color-danger-bg)',
                color: overallAttendance >= criterion ? 'var(--color-success)' : 'var(--color-danger)',
                fontWeight: 600,
              }}
            >
              {overallAttendance >= criterion ? 'SAFE' : 'RISK'}
            </span>
          </div>
          <div style={{ fontSize: '26px', fontWeight: 600, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
            {overallAttendance}%
          </div>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>
            Criterion: {criterion}% • {atRiskSubject ? `${atRiskSubject.code} needs watch` : 'All subjects safe'}
          </div>
        </div>

        {/* Tasks Stat */}
        <div
          onClick={() => onNavigate('tasks')}
          className="card-base"
          style={{ cursor: 'pointer', padding: '16px 20px' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '13px', color: 'var(--text-secondary)', fontWeight: 500 }}>Tasks</span>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Today</span>
          </div>
          <div style={{ fontSize: '26px', fontWeight: 600, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
            {tasksCompletedCount} / {totalTasksCount}
          </div>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>
            {Math.max(0, totalTasksCount - tasksCompletedCount)} tasks pending today
          </div>
        </div>

        {/* Study Stat */}
        <div
          onClick={() => onNavigate('study')}
          className="card-base"
          style={{ cursor: 'pointer', padding: '16px 20px' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '13px', color: 'var(--text-secondary)', fontWeight: 500 }}>Study</span>
            <span style={{ fontSize: '11px', color: 'var(--accent-primary)', fontWeight: 600 }}>Active</span>
          </div>
          <div style={{ fontSize: '26px', fontWeight: 600, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
            {studyTimeString}
          </div>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>
            Target: {targetDailyHours.toFixed(1)}h ({studyGoalPercent}% achieved)
          </div>
        </div>

        {/* Upcoming Stat */}
        <div
          onClick={() => onNavigate('assessments')}
          className="card-base"
          style={{ cursor: 'pointer', padding: '16px 20px' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '13px', color: 'var(--text-secondary)', fontWeight: 500 }}>Upcoming</span>
            <span style={{ fontSize: '11px', color: 'var(--color-warning)', fontWeight: 600 }}>Assessments</span>
          </div>
          <div style={{ fontSize: '26px', fontWeight: 600, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
            3 items
          </div>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>
            Next: DBMS CIA in 4 days
          </div>
        </div>
      </div>

      {/* Live Class Timetable Ongoing Spotlight */}
      <div
        className="card-base"
        style={{
          padding: '18px 22px',
          background: ongoing.isClassOngoing
            ? 'linear-gradient(135deg, rgba(99, 102, 241, 0.12) 0%, rgba(24, 24, 27, 0.9) 100%)'
            : 'var(--surface-primary)',
          border: `1px solid ${ongoing.isClassOngoing ? 'var(--accent-primary)' : 'var(--border-default)'}`,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div
            style={{
              width: '46px',
              height: '46px',
              borderRadius: '12px',
              backgroundColor: ongoing.isClassOngoing ? 'rgba(34, 197, 94, 0.15)' : 'var(--surface-elevated)',
              border: '1px solid var(--border-strong)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: ongoing.isClassOngoing ? '#4ade80' : 'var(--accent-primary)',
              flexShrink: 0,
            }}
          >
            <CalendarClock size={22} />
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '3px' }}>
              {ongoing.isClassOngoing ? (
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '5px',
                    fontSize: '11px',
                    fontWeight: 700,
                    color: '#4ade80',
                    letterSpacing: '0.04em',
                  }}
                >
                  <span style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: '#22c55e', animation: 'pulse 1.8s infinite' }} />
                  LIVE ONGOING CLASS (P{ongoing.currentSlot?.period})
                </span>
              ) : (
                <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                  {ongoing.isLunch ? 'LUNCH INTERVAL' : 'ACADEMIC TIMETABLE (ODD SEM 26-27)'}
                </span>
              )}
              <span style={{ color: 'var(--border-strong)' }}>•</span>
              <span style={{ fontSize: '11px', color: 'var(--accent-light)', fontWeight: 500 }}>
                {INSTITUTIONAL_INFO.className} • {INSTITUTIONAL_INFO.roomNo.split(',')[0]}
              </span>
            </div>

            <h4 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>
              {ongoing.isClassOngoing && ongoing.currentSlot
                ? `${ongoing.currentSlot.courseCode} — ${ongoing.currentSlot.courseName}`
                : ongoing.nextSlot
                ? `Next Up: ${ongoing.nextSlot.courseCode} — ${ongoing.nextSlot.courseName} at ${ongoing.nextSlot.startTime}`
                : 'All classes completed for today. Great job!'}
            </h4>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '4px', fontSize: '12px', color: 'var(--text-secondary)' }}>
              {ongoing.isClassOngoing && ongoing.currentSlot ? (
                <>
                  <span>Faculty: <strong>{ongoing.currentSlot.faculty}</strong></span>
                  <span>•</span>
                  <span>Room: <strong>{ongoing.currentSlot.room || 'Room 303'}</strong></span>
                  <span>•</span>
                  <span style={{ color: 'var(--accent-light)', fontWeight: 600 }}>
                    {ongoing.minutesRemaining} mins remaining
                  </span>
                </>
              ) : ongoing.nextSlot ? (
                <>
                  <span>Faculty: <strong>{ongoing.nextSlot.faculty}</strong></span>
                  <span>•</span>
                  <span>In {ongoing.minutesUntilNext} minutes ({ongoing.nextSlot.time})</span>
                </>
              ) : (
                <span>Next academic session starts tomorrow at 09:00 AM</span>
              )}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {activeClassReminders.length > 0 && (
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                padding: '4px 10px',
                borderRadius: '100px',
                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                color: '#f87171',
                fontSize: '11px',
                fontWeight: 600,
              }}
            >
              <Bell size={11} />
              {activeClassReminders.length} reminder(s) pending
            </span>
          )}

          <button
            onClick={() => onNavigate('timetable')}
            className="btn btn-accent-solid"
            style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', padding: '8px 14px' }}
          >
            <span>Open Timetable</span>
            <ArrowRight size={13} />
          </button>
        </div>
      </div>

      {/* Main Split Grid: Left = Recommendations + Today Timeline; Right = Attention Needed + Upcoming */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
          gap: '24px',
          alignItems: 'start',
        }}
      >
        {/* Left Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Section 11: STELLAR RECOMMENDS */}
          <div
            style={{
              backgroundColor: 'var(--surface-primary)',
              border: '1px solid var(--accent-border)',
              borderRadius: 'var(--radius-lg)',
              padding: '22px',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            {/* Subtle top indicator bar */}
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '2px',
                backgroundColor: 'var(--accent-primary)',
              }}
            />

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ color: 'var(--accent-primary)', fontSize: '13px' }}>✦</span>
                <span
                  style={{
                    fontSize: '11px',
                    fontWeight: 700,
                    letterSpacing: '0.08em',
                    color: 'var(--accent-primary)',
                    textTransform: 'uppercase',
                  }}
                >
                  STELLAR RECOMMENDS
                </span>
              </div>
              <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Smart Focus Block</span>
            </div>

            <p style={{ fontSize: '15px', color: 'var(--text-primary)', fontWeight: 500, marginBottom: '16px' }}>
              "You have 55 minutes available."
            </p>

            {/* Structured Study Session Roadmap */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
                backgroundColor: 'var(--surface-secondary)',
                borderRadius: 'var(--radius-md)',
                padding: '14px 16px',
                border: '1px solid var(--border-default)',
                marginBottom: '18px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--accent-light)', width: '50px' }}>25 min</span>
                  <span style={{ fontSize: '13px', color: 'var(--text-primary)' }}>DBMS Unit 3 Revision</span>
                </div>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Theory & 3NF</span>
              </div>

              <div style={{ height: '1px', backgroundColor: 'var(--border-subtle)' }} />

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', width: '50px' }}>5 min</span>
                  <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Cognitive Reset / Break</span>
                </div>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Rest</span>
              </div>

              <div style={{ height: '1px', backgroundColor: 'var(--border-subtle)' }} />

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--accent-light)', width: '50px' }}>25 min</span>
                  <span style={{ fontSize: '13px', color: 'var(--text-primary)' }}>DBMS Flashcards</span>
                </div>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>30 Cards</span>
              </div>
            </div>

            <button
              onClick={() => {
                setActiveSessionStarted(true);
                if (onStartStudySession) onStartStudySession();
              }}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                padding: '10px 16px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: activeSessionStarted ? 'var(--color-success-bg)' : 'var(--accent-subtle)',
                color: activeSessionStarted ? 'var(--color-success)' : 'var(--accent-light)',
                border: '1px solid',
                borderColor: activeSessionStarted ? 'var(--color-success-border)' : 'var(--accent-border)',
                fontSize: '13px',
                fontWeight: 600,
                transition: 'all var(--transition-fast)',
              }}
            >
              {activeSessionStarted ? (
                <>
                  <CheckCircle2 size={15} />
                  <span>Session Active • Focus Window Running</span>
                </>
              ) : (
                <>
                  <Play size={15} fill="currentColor" />
                  <span>Start Session</span>
                </>
              )}
            </button>
          </div>

          {/* Section 8: TODAY TIMELINE */}
          <div className="card-base">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
              <div>
                <h3 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-primary)' }}>
                  Today Timeline
                </h3>
                <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>
                  Editorial schedule for Wednesday
                </p>
              </div>
              <button
                onClick={() => onNavigate('calendar')}
                style={{ fontSize: '12px', color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', gap: '4px' }}
              >
                Full Calendar <ArrowRight size={13} />
              </button>
            </div>

            {/* Vertical Editorial Timeline */}
            <div style={{ position: 'relative', paddingLeft: '28px' }}>
              {/* Subtle continuous vertical line */}
              <div
                style={{
                  position: 'absolute',
                  left: '7px',
                  top: '6px',
                  bottom: '24px',
                  width: '1px',
                  backgroundColor: 'var(--border-default)',
                }}
              />

              <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
                {TODAY_TIMELINE.map((item) => (
                  <div
                    key={item.id}
                    style={{
                      position: 'relative',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '2px',
                    }}
                  >
                    {/* Marker dot */}
                    <div
                      style={{
                        position: 'absolute',
                        left: '-28px',
                        top: '4px',
                        width: '15px',
                        height: '15px',
                        borderRadius: '50%',
                        backgroundColor: item.isCompleted ? 'var(--surface-elevated)' : 'var(--accent-subtle)',
                        border: '1.5px solid',
                        borderColor: item.isCompleted ? 'var(--border-strong)' : 'var(--accent-primary)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      {item.isCompleted && (
                        <div
                          style={{
                            width: '5px',
                            height: '5px',
                            borderRadius: '50%',
                            backgroundColor: 'var(--text-muted)',
                          }}
                        />
                      )}
                    </div>

                    {/* Time & Type Tag */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span
                        style={{
                          fontSize: '12px',
                          fontWeight: 600,
                          color: item.isCompleted ? 'var(--text-muted)' : 'var(--text-primary)',
                          fontFamily: 'monospace',
                        }}
                      >
                        {item.time}
                      </span>
                      {item.subjectCode && (
                        <span
                          style={{
                            fontSize: '10px',
                            padding: '1px 6px',
                            borderRadius: '3px',
                            backgroundColor: 'var(--surface-secondary)',
                            color: 'var(--text-secondary)',
                            border: '1px solid var(--border-subtle)',
                            fontWeight: 500,
                          }}
                        >
                          {item.subjectCode}
                        </span>
                      )}
                      {item.duration && (
                        <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                          ({item.duration})
                        </span>
                      )}
                    </div>

                    {/* Title */}
                    <div
                      style={{
                        fontSize: '14px',
                        fontWeight: 500,
                        color: item.isCompleted ? 'var(--text-secondary)' : 'var(--text-primary)',
                      }}
                    >
                      {item.title}
                    </div>

                    {/* Subtitle */}
                    {item.subtitle && (
                      <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                        {item.subtitle}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Section 9: ATTENTION NEEDED */}
          <div className="card-base">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <AlertCircle size={16} style={{ color: 'var(--color-danger)' }} />
                <h3
                  style={{
                    fontSize: '12px',
                    fontWeight: 700,
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    color: 'var(--text-primary)',
                  }}
                >
                  ATTENTION NEEDED
                </h3>
              </div>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>3 alerts</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {ATTENTION_ITEMS.map((item) => {
                const isDanger = item.status === 'critical';
                return (
                  <div
                    key={item.id}
                    onClick={() => {
                      if (item.type === 'attendance') onNavigate('attendance');
                      else if (item.type === 'assessment') onNavigate('assessments');
                      else onNavigate('tasks');
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '12px 14px',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: 'var(--surface-secondary)',
                      border: '1px solid',
                      borderColor: isDanger ? 'var(--color-danger-border)' : 'var(--color-warning-border)',
                      cursor: 'pointer',
                      transition: 'transform var(--transition-fast)',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateX(2px)')}
                    onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateX(0)')}
                  >
                    <div>
                      <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>
                        {item.title}
                      </div>
                      <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>
                        {item.subtitle}
                      </div>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      {item.daysRemaining !== undefined && (
                        <span
                          style={{
                            fontSize: '11px',
                            fontWeight: 600,
                            color: isDanger ? 'var(--color-danger)' : 'var(--color-warning)',
                            padding: '2px 8px',
                            borderRadius: '4px',
                            backgroundColor: isDanger ? 'var(--color-danger-bg)' : 'var(--color-warning-bg)',
                            border: `1px solid ${isDanger ? 'var(--color-danger-border)' : 'var(--color-warning-border)'}`,
                          }}
                        >
                          {item.daysRemaining === 1 ? 'Due tomorrow' : `${item.daysRemaining} days remaining`}
                        </span>
                      )}
                      {item.metric && (
                        <span
                          style={{
                            fontSize: '11px',
                            fontWeight: 600,
                            color: 'var(--color-danger)',
                            padding: '2px 8px',
                            borderRadius: '4px',
                            backgroundColor: 'var(--color-danger-bg)',
                            border: '1px solid var(--color-danger-border)',
                          }}
                        >
                          {item.metric} (Below 75%)
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Section 10: UPCOMING ASSESSMENTS & DEADLINES */}
          <div className="card-base">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <div>
                <h3 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-primary)' }}>
                  Upcoming
                </h3>
                <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>
                  Evaluations & assessments countdown
                </p>
              </div>
              <button
                onClick={() => onNavigate('assessments')}
                style={{ fontSize: '12px', color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', gap: '4px' }}
              >
                View all <ArrowRight size={13} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {UPCOMING_ASSESSMENTS.map((item) => (
                <div
                  key={item.id}
                  onClick={() => onNavigate('assessments')}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px 14px',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: 'var(--surface-secondary)',
                    border: '1px solid var(--border-default)',
                    cursor: 'pointer',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'var(--border-strong)')}
                  onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'var(--border-default)')}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    {/* Date Block */}
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '46px',
                        padding: '6px 0',
                        backgroundColor: 'var(--surface-elevated)',
                        borderRadius: 'var(--radius-sm)',
                        border: '1px solid var(--border-default)',
                      }}
                    >
                      <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-primary)' }}>
                        {item.date.split(' ')[0]}
                      </span>
                      <span style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                        {item.date.split(' ')[1] || 'SEP'}
                      </span>
                    </div>

                    <div>
                      <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>
                        {item.title}
                      </div>
                      <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>
                        {item.subjectName} • {item.type}
                      </div>
                    </div>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <span
                      style={{
                        fontSize: '12px',
                        fontWeight: 600,
                        color: item.daysRemaining <= 4 ? 'var(--color-warning)' : 'var(--text-secondary)',
                      }}
                    >
                      {item.daysRemaining} days
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
