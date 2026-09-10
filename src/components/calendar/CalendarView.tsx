import React, { useState } from 'react';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Clock,
  BookOpen,
  GraduationCap,
  Sparkles,
  Plus
} from 'lucide-react';
import { TODAY_TIMELINE, UPCOMING_ASSESSMENTS } from '../../data/mockData';

type CalendarViewMode = 'month' | 'week' | 'day' | 'agenda';

interface CalendarEvent {
  id: string;
  title: string;
  time: string;
  date: string;
  type: 'class' | 'cia' | 'assignment' | 'study' | 'personal';
  subject?: string;
}

const EVENTS: CalendarEvent[] = [
  { id: 'ev-1', title: 'Database Management Systems', time: '09:00 - 10:00', date: '2026-09-09', type: 'class', subject: 'DBMS' },
  { id: 'ev-2', title: 'Artificial Intelligence & ML', time: '10:00 - 11:00', date: '2026-09-09', type: 'class', subject: 'AI/ML' },
  { id: 'ev-3', title: 'Mathematics Assignment Due', time: '23:59', date: '2026-09-10', type: 'assignment', subject: 'Mathematics' },
  { id: 'ev-4', title: 'Operating Systems Concurrency Lab', time: '14:00 - 16:00', date: '2026-09-11', type: 'class', subject: 'OS' },
  { id: 'ev-5', title: 'DBMS CIA (Comprehensive Internal Assessment)', time: '10:00 - 12:00', date: '2026-09-18', type: 'cia', subject: 'DBMS' },
  { id: 'ev-6', title: 'AI/ML Lab Practical Assessment', time: '14:00 - 17:00', date: '2026-09-22', type: 'cia', subject: 'AI/ML' },
  { id: 'ev-7', title: 'OS Mid-Semester Theory Exam', time: '09:30 - 12:30', date: '2026-09-28', type: 'cia', subject: 'OS' },
];

export const CalendarView: React.FC = () => {
  const [viewMode, setViewMode] = useState<CalendarViewMode>('agenda');
  const [currentWeekOffset, setCurrentWeekOffset] = useState(0);

  const getEventTypeBadge = (type: CalendarEvent['type']) => {
    switch (type) {
      case 'cia':
        return <span className="badge badge-danger">Exam / CIA</span>;
      case 'assignment':
        return <span className="badge badge-warning">Assignment</span>;
      case 'class':
        return <span className="badge badge-info">Lecture</span>;
      case 'study':
        return <span className="badge badge-accent">Focus Block</span>;
      default:
        return <span className="badge badge-neutral">Event</span>;
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px', maxWidth: '1100px', margin: '0 auto' }}>
      {/* Calendar Header & View Switcher */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Academic Timetable</span>
            <span style={{ color: 'var(--border-strong)' }}>•</span>
            <span style={{ fontSize: '12px', color: 'var(--accent-primary)', fontWeight: 500 }}>September 2026</span>
          </div>
          <h2 style={{ fontSize: '28px', fontWeight: 600, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
            Schedule & Calendar
          </h2>
        </div>

        {/* View Mode Selector */}
        <div
          style={{
            display: 'flex',
            backgroundColor: 'var(--surface-primary)',
            padding: '3px',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-default)',
          }}
        >
          {(['agenda', 'day', 'week', 'month'] as const).map((mode) => (
            <button
              key={mode}
              onClick={() => setViewMode(mode)}
              style={{
                padding: '6px 14px',
                borderRadius: 'var(--radius-sm)',
                fontSize: '13px',
                fontWeight: viewMode === mode ? 600 : 400,
                backgroundColor: viewMode === mode ? 'var(--surface-elevated)' : 'transparent',
                color: viewMode === mode ? 'var(--text-primary)' : 'var(--text-secondary)',
                border: '1px solid',
                borderColor: viewMode === mode ? 'var(--border-strong)' : 'transparent',
                textTransform: 'capitalize',
              }}
            >
              {mode}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content Area based on View Mode */}
      {viewMode === 'agenda' ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Today Block */}
          <div className="card-base" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CalendarIcon size={16} style={{ color: 'var(--accent-primary)' }} />
                <h3 style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-primary)' }}>
                  Today — Wednesday, Sep 9
                </h3>
              </div>
              <span className="badge badge-accent">Current Day</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {TODAY_TIMELINE.map((item) => (
                <div
                  key={item.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px 16px',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: 'var(--surface-secondary)',
                    border: '1px solid var(--border-default)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', fontFamily: 'monospace', width: '50px' }}>
                      {item.time}
                    </span>
                    <div>
                      <div style={{ fontSize: '14px', fontWeight: 500, color: 'var(--text-primary)' }}>
                        {item.title}
                      </div>
                      <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>
                        {item.subtitle}
                      </div>
                    </div>
                  </div>

                  <span
                    style={{
                      fontSize: '11px',
                      padding: '2px 8px',
                      borderRadius: '4px',
                      backgroundColor: item.type === 'class' ? 'var(--color-info-bg)' : item.type === 'assignment' ? 'var(--color-warning-bg)' : 'var(--accent-subtle)',
                      color: item.type === 'class' ? 'var(--color-info)' : item.type === 'assignment' ? 'var(--color-warning)' : 'var(--accent-light)',
                      fontWeight: 600,
                    }}
                  >
                    {item.type}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Upcoming Days in Agenda */}
          <div className="card-base" style={{ padding: '20px' }}>
            <h3 style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '16px' }}>
              Upcoming Schedule & Academic Milestones
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {EVENTS.filter((e) => e.date !== '2026-09-09').map((event) => (
                <div
                  key={event.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '14px 16px',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: 'var(--surface-secondary)',
                    border: '1px solid var(--border-default)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div
                      style={{
                        padding: '6px 10px',
                        backgroundColor: 'var(--surface-elevated)',
                        borderRadius: 'var(--radius-sm)',
                        textAlign: 'center',
                        minWidth: '60px',
                        border: '1px solid var(--border-subtle)',
                      }}
                    >
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>SEP</div>
                      <div style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)' }}>
                        {event.date.split('-')[2]}
                      </div>
                    </div>

                    <div>
                      <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>
                        {event.title}
                      </div>
                      <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>
                        Time: {event.time} • Subject: {event.subject}
                      </div>
                    </div>
                  </div>

                  {getEventTypeBadge(event.type)}
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* Month / Week / Day Grid Representation */
        <div className="card-base" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-primary)' }}>
              {viewMode === 'month' ? 'September 2026 Overview' : viewMode === 'week' ? 'Week of Sep 7 - Sep 13' : 'Day: Sep 9'}
            </h3>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button className="btn btn-secondary" style={{ padding: '6px 10px' }}><ChevronLeft size={16} /></button>
              <button className="btn btn-secondary" style={{ padding: '6px 10px' }}><ChevronRight size={16} /></button>
            </div>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(7, 1fr)',
              gap: '8px',
              textAlign: 'center',
            }}
          >
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
              <div key={day} style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', paddingBottom: '8px' }}>
                {day}
              </div>
            ))}

            {/* Render 28 calendar cells */}
            {Array.from({ length: 28 }).map((_, i) => {
              const dayNumber = i + 1;
              const isToday = dayNumber === 9;
              const hasCIA = dayNumber === 18 || dayNumber === 22 || dayNumber === 28;
              const hasAssignment = dayNumber === 10;

              return (
                <div
                  key={i}
                  style={{
                    minHeight: '80px',
                    padding: '8px',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: isToday ? 'var(--surface-elevated)' : 'var(--surface-secondary)',
                    border: '1px solid',
                    borderColor: isToday ? 'var(--accent-primary)' : 'var(--border-default)',
                    textAlign: 'left',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                  }}
                >
                  <span style={{ fontSize: '12px', fontWeight: isToday ? 700 : 500, color: isToday ? 'var(--accent-light)' : 'var(--text-secondary)' }}>
                    {dayNumber}
                  </span>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    {isToday && (
                      <span style={{ fontSize: '10px', padding: '1px 4px', borderRadius: '3px', backgroundColor: 'var(--accent-subtle)', color: 'var(--accent-light)' }}>
                        Today: 4 Classes
                      </span>
                    )}
                    {hasAssignment && (
                      <span style={{ fontSize: '10px', padding: '1px 4px', borderRadius: '3px', backgroundColor: 'var(--color-warning-bg)', color: 'var(--color-warning)' }}>
                        Maths Due
                      </span>
                    )}
                    {hasCIA && (
                      <span style={{ fontSize: '10px', padding: '1px 4px', borderRadius: '3px', backgroundColor: 'var(--color-danger-bg)', color: 'var(--color-danger)' }}>
                        CIA Exam
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
