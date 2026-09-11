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
import { TODAY_TIMELINE } from '../../data/mockData';
import { TIMETABLE_SLOTS } from '../../data/timetableData';
import { db } from '../../services/db';

type CalendarViewMode = 'month' | 'week' | 'day' | 'agenda';

interface CalendarEvent {
  id: string;
  title: string;
  time: string;
  date: string;
  type: 'class' | 'cia' | 'assignment' | 'study' | 'personal';
  subject?: string;
}

export const CalendarView: React.FC = () => {
  const [viewMode, setViewMode] = useState<CalendarViewMode>('agenda');
  const [currentWeekOffset, setCurrentWeekOffset] = useState(0);

  const reminders = db.getReminders();
  const userBatch = db.getBatch() || 'B1';

  // Derive genuine events from student's institutional timetable
  const timetableEvents: CalendarEvent[] = TIMETABLE_SLOTS.filter(
    (s) => s.batch === 'ALL' || s.batch === userBatch
  ).map((slot, idx) => ({
    id: `tt-${slot.day}-${slot.period}-${idx}`,
    title: `${slot.courseCode}: ${slot.courseName}`,
    time: slot.time,
    date: slot.day === 'MON' ? 'Monday' : slot.day === 'TUE' ? 'Tuesday' : slot.day === 'WED' ? 'Wednesday' : slot.day === 'THU' ? 'Thursday' : 'Friday',
    type: slot.isLab ? 'study' : 'class',
    subject: `${slot.faculty} • ${slot.room}`,
  }));

  // User created reminders
  const reminderEvents: CalendarEvent[] = reminders.map((rem) => ({
    id: rem.id,
    title: rem.title,
    time: rem.dueTime || 'Due Date',
    date: rem.dueDate,
    type: rem.type === 'exam' ? 'cia' : 'assignment',
    subject: `${rem.courseCode}: ${rem.courseName}`,
  }));

  const events: CalendarEvent[] = [...reminderEvents, ...timetableEvents];

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
              Academic Schedule &amp; Course Timelines
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {events.length === 0 ? (
                <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '13px' }}>
                  No scheduled classes or deadlines found for this view.
                </div>
              ) : (
                events.slice(0, 12).map((event) => (
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
                        <div style={{ fontSize: '10px', color: 'var(--accent-light)', fontWeight: 600 }}>PERIOD</div>
                        <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)' }}>
                          {event.date}
                        </div>
                      </div>

                      <div>
                        <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>
                          {event.title}
                        </div>
                        <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>
                          Time: {event.time} • {event.subject}
                        </div>
                      </div>
                    </div>

                    {getEventTypeBadge(event.type)}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      ) : (
        /* Month / Week / Day Grid Representation */
        <div className="card-base" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-primary)' }}>
              {viewMode === 'month' ? 'Academic Calendar Overview' : viewMode === 'week' ? 'Weekly Lecture Schedule' : 'Daily Schedule'}
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
              const dateStr = `2026-09-${String(dayNumber).padStart(2, '0')}`;
              const dayReminders = reminders.filter((r) => r.dueDate === dateStr);

              return (
                <div
                  key={i}
                  style={{
                    minHeight: '80px',
                    padding: '8px',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: 'var(--surface-secondary)',
                    border: '1px solid var(--border-default)',
                    textAlign: 'left',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                  }}
                >
                  <span style={{ fontSize: '12px', fontWeight: 500, color: 'var(--text-secondary)' }}>
                    {dayNumber}
                  </span>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    {dayReminders.map((rem) => (
                      <span
                        key={rem.id}
                        style={{
                          fontSize: '10px',
                          padding: '1px 4px',
                          borderRadius: '3px',
                          backgroundColor: rem.type === 'exam' ? 'var(--color-danger-bg)' : 'var(--color-warning-bg)',
                          color: rem.type === 'exam' ? 'var(--color-danger)' : 'var(--color-warning)',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}
                      >
                        {rem.title}
                      </span>
                    ))}
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
