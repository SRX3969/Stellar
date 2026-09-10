import React, { useState, useEffect, useMemo } from 'react';
import {
  Clock,
  Users,
  MapPin,
  Bell,
  Plus,
  CheckCircle2,
  AlertCircle,
  Trash2
} from 'lucide-react';
import {
  INSTITUTIONAL_INFO,
  COURSE_CATALOG,
  PERIODS,
  getSlotsForDay,
  calculateOngoingClass
} from '../../data/timetableData';
import { DayOfWeek, TimetableSlot, ClassReminder } from '../../types';
import { ClassReminderModal } from '../reminders/ClassReminderModal';
import { db } from '../../services/db';
import { useToast } from '../common/Toast';

interface TimetableScheduleViewProps {
  onMarkAttendance?: (subjectCode: string, status: 'present' | 'absent') => void;
}

export const TimetableScheduleView: React.FC<TimetableScheduleViewProps> = ({
  onMarkAttendance,
}) => {
  const [selectedBatch, setSelectedBatch] = useState<'B1' | 'B2'>(() => db.getBatch());
  const [activeTab, setActiveTab] = useState<'matrix' | 'day' | 'reminders' | 'catalog'>('matrix');
  const [selectedDay, setSelectedDay] = useState<DayOfWeek>('MON');
  const [isReminderModalOpen, setIsReminderModalOpen] = useState(false);
  const [targetCourseForReminder, setTargetCourseForReminder] = useState<string>('AIML334');
  const [reminders, setReminders] = useState<ClassReminder[]>(() => db.getReminders());

  // Simulation Mode vs Live Mode
  const [isSimulationMode, setIsSimulationMode] = useState(false);
  const [simulatedDay, setSimulatedDay] = useState<DayOfWeek>('MON');
  const [simulatedTime, setSimulatedTime] = useState<string>('09:30'); // 9:30 AM during Period 1

  // Live system clock state
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  const { showToast } = useToast();

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleBatchChange = (batch: 'B1' | 'B2') => {
    setSelectedBatch(batch);
    db.setBatch(batch);
    showToast('Batch Updated', `Switched schedule view to ${batch}`, 'info');
  };

  // Determine current day of week
  const liveDay: DayOfWeek = useMemo(() => {
    const dayIndex = currentTime.getDay(); // 0 = Sun, 1 = Mon, ..., 6 = Sat
    const map: Record<number, DayOfWeek> = {
      1: 'MON',
      2: 'TUE',
      3: 'WED',
      4: 'THU',
      5: 'FRI',
      6: 'SAT',
    };
    return map[dayIndex] || 'MON';
  }, [currentTime]);

  const liveTimeStr = useMemo(() => {
    const h = String(currentTime.getHours()).padStart(2, '0');
    const m = String(currentTime.getMinutes()).padStart(2, '0');
    return `${h}:${m}`;
  }, [currentTime]);

  // Ongoing class calculation based on either simulation or real clock
  const effectiveDay = isSimulationMode ? simulatedDay : liveDay;
  const effectiveTimeStr = isSimulationMode ? simulatedTime : liveTimeStr;

  const ongoingStatus = useMemo(() => {
    return calculateOngoingClass(effectiveDay, effectiveTimeStr, selectedBatch);
  }, [effectiveDay, effectiveTimeStr, selectedBatch]);

  // Filter reminders
  const handleToggleReminder = (id: string) => {
    const updated = db.toggleReminder(id);
    setReminders(updated);
  };

  const handleDeleteReminder = (id: string) => {
    const updated = db.deleteReminder(id);
    setReminders(updated);
    showToast('Reminder Removed', 'Academic reminder has been removed.', 'info');
  };

  const handleSaveReminder = (newReminder: Omit<ClassReminder, 'id' | 'createdAt'>) => {
    db.saveReminder(newReminder);
    setReminders(db.getReminders());
  };

  const openReminderForCourse = (courseCode: string) => {
    // Strip batch tag if present e.g. "CSE352 (B1)" -> "CSE352"
    const cleanCode = courseCode.split(' ')[0];
    setTargetCourseForReminder(cleanCode);
    setIsReminderModalOpen(true);
  };

  // Helper to count reminders for a course
  const getRemindersForCourse = (courseCode: string) => {
    const cleanCode = courseCode.split(' ')[0].toUpperCase();
    return reminders.filter((r) => r.courseCode.toUpperCase().includes(cleanCode) && !r.completed);
  };

  const daysList: { key: DayOfWeek; label: string; full: string }[] = [
    { key: 'MON', label: 'Mon', full: 'Monday' },
    { key: 'TUE', label: 'Tue', full: 'Tuesday' },
    { key: 'WED', label: 'Wed', full: 'Wednesday' },
    { key: 'THU', label: 'Thu', full: 'Thursday' },
    { key: 'FRI', label: 'Fri', full: 'Friday' },
    { key: 'SAT', label: 'Sat', full: 'Saturday' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '1240px', margin: '0 auto', paddingBottom: '40px' }}>
      {/* Institutional Header Banner */}
      <div
        className="card-base"
        style={{
          padding: '24px',
          background: 'linear-gradient(135deg, rgba(24, 24, 27, 0.9) 0%, rgba(39, 39, 42, 0.6) 100%)',
          border: '1px solid var(--border-strong)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div style={{ position: 'absolute', top: '-40px', right: '-40px', width: '220px', height: '220px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(99, 102, 241, 0.15) 0%, transparent 70%)', pointerEvents: 'none' }} />

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <span style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--accent-primary)', fontWeight: 600 }}>
                {INSTITUTIONAL_INFO.school}
              </span>
              <span style={{ color: 'var(--border-strong)' }}>•</span>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                {INSTITUTIONAL_INFO.academicYear}
              </span>
            </div>

            <h1 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.02em', margin: 0 }}>
              {INSTITUTIONAL_INFO.department}
            </h1>

            <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginTop: '10px' }}>
              <span className="badge badge-accent" style={{ fontSize: '12px', padding: '4px 10px' }}>
                Class: {INSTITUTIONAL_INFO.className} ({INSTITUTIONAL_INFO.semester})
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: 'var(--text-secondary)' }}>
                <MapPin size={13} style={{ color: 'var(--accent-primary)' }} />
                {INSTITUTIONAL_INFO.roomNo}
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: 'var(--text-secondary)' }}>
                <Users size={13} style={{ color: 'var(--color-info)' }} />
                Class Teacher: <strong>{INSTITUTIONAL_INFO.classTeacher}</strong> (Co: {INSTITUTIONAL_INFO.coClassTeacher})
              </span>
              <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                HOD: {INSTITUTIONAL_INFO.hod}
              </span>
            </div>
          </div>

          {/* Batch Selector & Add Reminder CTA */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                backgroundColor: 'var(--surface-elevated)',
                padding: '4px',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-default)',
              }}
            >
              <span style={{ fontSize: '11px', color: 'var(--text-muted)', padding: '0 8px', fontWeight: 600 }}>
                LAB BATCH:
              </span>
              <button
                onClick={() => handleBatchChange('B1')}
                style={{
                  padding: '5px 12px',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '12px',
                  fontWeight: selectedBatch === 'B1' ? 600 : 400,
                  backgroundColor: selectedBatch === 'B1' ? 'var(--accent-primary)' : 'transparent',
                  color: selectedBatch === 'B1' ? '#fff' : 'var(--text-secondary)',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                Batch 1 (B1)
              </button>
              <button
                onClick={() => handleBatchChange('B2')}
                style={{
                  padding: '5px 12px',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '12px',
                  fontWeight: selectedBatch === 'B2' ? 600 : 400,
                  backgroundColor: selectedBatch === 'B2' ? 'var(--accent-primary)' : 'transparent',
                  color: selectedBatch === 'B2' ? '#fff' : 'var(--text-secondary)',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                Batch 2 (B2)
              </button>
            </div>

            <button
              onClick={() => {
                setTargetCourseForReminder('AIML334');
                setIsReminderModalOpen(true);
              }}
              className="btn btn-accent-solid"
              style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 14px', fontSize: '13px' }}
            >
              <Plus size={15} />
              <span>Add Class Reminder</span>
            </button>
          </div>
        </div>
      </div>

      {/* ===================== LIVE ONGOING CLASS MONITOR ===================== */}
      <div
        className="card-base"
        style={{
          padding: '20px 24px',
          backgroundColor: ongoingStatus.isClassOngoing
            ? 'rgba(99, 102, 241, 0.07)'
            : 'var(--surface-primary)',
          border: `1px solid ${ongoingStatus.isClassOngoing ? 'var(--accent-border)' : 'var(--border-default)'}`,
          boxShadow: ongoingStatus.isClassOngoing ? '0 0 24px rgba(99, 102, 241, 0.12)' : 'none',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginBottom: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {ongoingStatus.isClassOngoing ? (
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '4px 10px',
                  borderRadius: '100px',
                  backgroundColor: 'rgba(34, 197, 94, 0.15)',
                  border: '1px solid rgba(34, 197, 94, 0.3)',
                  color: '#4ade80',
                  fontSize: '12px',
                  fontWeight: 600,
                  letterSpacing: '0.04em',
                }}
              >
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#22c55e', animation: 'pulse 1.8s infinite' }} />
                CLASS IN PROGRESS NOW
              </span>
            ) : ongoingStatus.isLunch ? (
              <span className="badge badge-warning" style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <Clock size={12} />
                LUNCH INTERVAL (13:00 - 14:00)
              </span>
            ) : (
              <span className="badge badge-neutral" style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <Clock size={12} />
                {ongoingStatus.isOffHours ? 'NO ONGOING LECTURE (CAMPUS RECESS)' : 'BETWEEN PERIODS'}
              </span>
            )}

            <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
              Target: <strong>{effectiveDay}</strong> at <strong>{effectiveTimeStr}</strong>
            </span>
          </div>

          {/* Simulation Mode Toggle (Allows user to test and view ongoing states at any time) */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px' }}>
            <span style={{ color: 'var(--text-muted)' }}>Simulation:</span>
            <button
              onClick={() => setIsSimulationMode(!isSimulationMode)}
              style={{
                padding: '4px 10px',
                borderRadius: 'var(--radius-sm)',
                fontSize: '11px',
                fontWeight: 600,
                backgroundColor: isSimulationMode ? 'var(--accent-primary)' : 'var(--surface-elevated)',
                color: isSimulationMode ? '#fff' : 'var(--text-secondary)',
                border: '1px solid var(--border-default)',
                cursor: 'pointer',
              }}
            >
              {isSimulationMode ? 'Preview Mode Active' : 'Enable Time Preview'}
            </button>

            {isSimulationMode && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <select
                  value={simulatedDay}
                  onChange={(e) => setSimulatedDay(e.target.value as DayOfWeek)}
                  style={{ padding: '3px 8px', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--surface-elevated)', color: 'var(--text-primary)', border: '1px solid var(--border-default)', fontSize: '11px' }}
                >
                  <option value="MON">Mon</option>
                  <option value="TUE">Tue</option>
                  <option value="WED">Wed</option>
                  <option value="THU">Thu</option>
                  <option value="FRI">Fri</option>
                  <option value="SAT">Sat</option>
                </select>

                <select
                  value={simulatedTime}
                  onChange={(e) => setSimulatedTime(e.target.value)}
                  style={{ padding: '3px 8px', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--surface-elevated)', color: 'var(--text-primary)', border: '1px solid var(--border-default)', fontSize: '11px' }}
                >
                  <option value="09:20">P1 (09:20)</option>
                  <option value="10:30">P2 (10:30)</option>
                  <option value="11:45">P3-P4 Lab (11:45)</option>
                  <option value="13:20">Lunch (13:20)</option>
                  <option value="14:30">P5 (14:30)</option>
                  <option value="15:15">P6 (15:15)</option>
                  <option value="17:00">Evening Off-hours</option>
                </select>
              </div>
            )}
          </div>
        </div>

        {/* Ongoing Class Details Card */}
        {ongoingStatus.isClassOngoing && ongoingStatus.currentSlot ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <span className="badge badge-accent" style={{ fontSize: '11px' }}>
                    PERIOD {ongoingStatus.currentSlot.period}
                  </span>
                  <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>
                    {ongoingStatus.currentSlot.time}
                  </span>
                  {ongoingStatus.currentSlot.isLab && (
                    <span className="badge badge-info" style={{ fontSize: '11px' }}>
                      LAB PRACTICAL
                    </span>
                  )}
                </div>
                <h3 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text-primary)', margin: '4px 0' }}>
                  {ongoingStatus.currentSlot.courseCode} — {ongoingStatus.currentSlot.courseName}
                </h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap', marginTop: '6px' }}>
                  <span style={{ fontSize: '13px', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Users size={13} style={{ color: 'var(--accent-light)' }} />
                    Instructor: <strong>{ongoingStatus.currentSlot.faculty}</strong>
                  </span>
                  <span style={{ fontSize: '13px', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <MapPin size={13} style={{ color: 'var(--color-warning)' }} />
                    Location: <strong>{ongoingStatus.currentSlot.room || 'Room 303'}</strong>
                  </span>
                </div>
              </div>

              {/* Actions for current class */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <button
                  onClick={() => openReminderForCourse(ongoingStatus.currentSlot!.courseCode)}
                  className="btn btn-outline"
                  style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', padding: '6px 12px' }}
                >
                  <Bell size={13} style={{ color: 'var(--accent-primary)' }} />
                  <span>Set Class Reminder</span>
                </button>

                {onMarkAttendance && (
                  <button
                    onClick={() => {
                      onMarkAttendance(ongoingStatus.currentSlot!.courseCode, 'present');
                      showToast('Attendance Marked', `Marked Present for ${ongoingStatus.currentSlot!.courseCode}`, 'success');
                    }}
                    className="btn btn-accent-solid"
                    style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', padding: '6px 14px' }}
                  >
                    <CheckCircle2 size={13} />
                    <span>Mark Present</span>
                  </button>
                )}
              </div>
            </div>

            {/* Progress Bar */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                <span>Progress ({ongoingStatus.progressPercentage}% elapsed)</span>
                <span style={{ fontWeight: 600, color: 'var(--accent-light)' }}>
                  {ongoingStatus.minutesRemaining} minutes remaining
                </span>
              </div>
              <div style={{ width: '100%', height: '6px', borderRadius: '100px', backgroundColor: 'var(--surface-elevated)', overflow: 'hidden' }}>
                <div
                  style={{
                    width: `${ongoingStatus.progressPercentage}%`,
                    height: '100%',
                    backgroundColor: 'var(--accent-primary)',
                    borderRadius: '100px',
                    transition: 'width 0.4s ease',
                  }}
                />
              </div>
            </div>

            {/* Pending Reminders for this ongoing course */}
            {(() => {
              const activeReminders = getRemindersForCourse(ongoingStatus.currentSlot.courseCode);
              if (activeReminders.length === 0) return null;
              return (
                <div
                  style={{
                    padding: '10px 14px',
                    borderRadius: 'var(--radius-sm)',
                    backgroundColor: 'rgba(239, 68, 68, 0.08)',
                    border: '1px solid rgba(239, 68, 68, 0.25)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <AlertCircle size={15} style={{ color: 'var(--color-danger)' }} />
                    <span style={{ fontSize: '12px', color: 'var(--text-primary)', fontWeight: 500 }}>
                      Reminder Due for this session: <strong>{activeReminders[0].title}</strong> ({activeReminders[0].type.toUpperCase()})
                    </span>
                  </div>
                  <button
                    onClick={() => handleToggleReminder(activeReminders[0].id)}
                    style={{ fontSize: '11px', color: 'var(--accent-primary)', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}
                  >
                    Mark Done
                  </button>
                </div>
              );
            })()}
          </div>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '14px' }}>
            <div>
              <h4 style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-primary)' }}>
                {ongoingStatus.isLunch
                  ? 'Midday Lunch Break — Academic sessions resume at 14:00 (Period 5)'
                  : ongoingStatus.nextSlot
                  ? `Next Lecture Scheduled: ${ongoingStatus.nextSlot.courseCode} — ${ongoingStatus.nextSlot.courseName}`
                  : 'Classes completed for today. Review tasks and prepare for tomorrow.'}
              </h4>
              {ongoingStatus.nextSlot && (
                <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                  Starting at <strong>{ongoingStatus.nextSlot.startTime}</strong> ({ongoingStatus.minutesUntilNext} minutes from now) with {ongoingStatus.nextSlot.faculty} in {ongoingStatus.nextSlot.room}
                </p>
              )}
            </div>

            {ongoingStatus.nextSlot && (
              <button
                onClick={() => openReminderForCourse(ongoingStatus.nextSlot!.courseCode)}
                className="btn btn-outline"
                style={{ fontSize: '12px', padding: '6px 12px' }}
              >
                Set Reminder for Next Class
              </button>
            )}
          </div>
        )}
      </div>

      {/* ===================== VIEW NAVIGATION TABS ===================== */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', borderBottom: '1px solid var(--border-default)', paddingBottom: '12px' }}>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={() => setActiveTab('matrix')}
            style={{
              padding: '8px 16px',
              borderRadius: 'var(--radius-sm)',
              fontSize: '13px',
              fontWeight: activeTab === 'matrix' ? 600 : 400,
              backgroundColor: activeTab === 'matrix' ? 'var(--surface-elevated)' : 'transparent',
              color: activeTab === 'matrix' ? 'var(--text-primary)' : 'var(--text-secondary)',
              border: `1px solid ${activeTab === 'matrix' ? 'var(--border-strong)' : 'transparent'}`,
              cursor: 'pointer',
            }}
          >
            Weekly Master Grid
          </button>
          <button
            onClick={() => setActiveTab('day')}
            style={{
              padding: '8px 16px',
              borderRadius: 'var(--radius-sm)',
              fontSize: '13px',
              fontWeight: activeTab === 'day' ? 600 : 400,
              backgroundColor: activeTab === 'day' ? 'var(--surface-elevated)' : 'transparent',
              color: activeTab === 'day' ? 'var(--text-primary)' : 'var(--text-secondary)',
              border: `1px solid ${activeTab === 'day' ? 'var(--border-strong)' : 'transparent'}`,
              cursor: 'pointer',
            }}
          >
            Day-by-Day View
          </button>
          <button
            onClick={() => setActiveTab('reminders')}
            style={{
              padding: '8px 16px',
              borderRadius: 'var(--radius-sm)',
              fontSize: '13px',
              fontWeight: activeTab === 'reminders' ? 600 : 400,
              backgroundColor: activeTab === 'reminders' ? 'var(--surface-elevated)' : 'transparent',
              color: activeTab === 'reminders' ? 'var(--text-primary)' : 'var(--text-secondary)',
              border: `1px solid ${activeTab === 'reminders' ? 'var(--border-strong)' : 'transparent'}`,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <Bell size={13} style={{ color: 'var(--accent-primary)' }} />
            <span>Class Reminders ({reminders.filter((r) => !r.completed).length})</span>
          </button>
          <button
            onClick={() => setActiveTab('catalog')}
            style={{
              padding: '8px 16px',
              borderRadius: 'var(--radius-sm)',
              fontSize: '13px',
              fontWeight: activeTab === 'catalog' ? 600 : 400,
              backgroundColor: activeTab === 'catalog' ? 'var(--surface-elevated)' : 'transparent',
              color: activeTab === 'catalog' ? 'var(--text-primary)' : 'var(--text-secondary)',
              border: `1px solid ${activeTab === 'catalog' ? 'var(--border-strong)' : 'transparent'}`,
              cursor: 'pointer',
            }}
          >
            Course &amp; Faculty Master
          </button>
        </div>

        <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
          Showing for: <strong>{selectedBatch === 'B1' ? 'Batch 1 (B1)' : 'Batch 2 (B2)'}</strong>
        </div>
      </div>

      {/* ===================== TAB 1: MASTER MATRIX TABLE ===================== */}
      {activeTab === 'matrix' && (
        <div className="card-base" style={{ padding: '0', overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '950px' }}>
            <thead>
              <tr style={{ backgroundColor: 'var(--surface-secondary)', borderBottom: '1px solid var(--border-default)' }}>
                <th style={{ padding: '14px 16px', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', width: '80px' }}>
                  DAY
                </th>
                {PERIODS.slice(0, 4).map((p) => (
                  <th key={p.period} style={{ padding: '12px 14px', fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)' }}>
                    <div>{p.label}</div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 400 }}>{p.displayTime}</div>
                  </th>
                ))}
                <th style={{ padding: '12px 10px', fontSize: '11px', fontWeight: 600, color: 'var(--color-warning)', backgroundColor: 'rgba(234, 179, 8, 0.05)', textAlign: 'center', width: '70px' }}>
                  LUNCH<br />(13-14)
                </th>
                {PERIODS.slice(4).map((p) => (
                  <th key={p.period} style={{ padding: '12px 14px', fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)' }}>
                    <div>{p.label}</div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 400 }}>{p.displayTime}</div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {daysList.map((dayObj) => {
                const day = dayObj.key;
                const isDayActive = effectiveDay === day;
                const daySlots = getSlotsForDay(day, selectedBatch);

                // Slot lookups for single periods
                const p1 = daySlots.find((s) => s.period === 1);
                const p2 = daySlots.find((s) => s.period === 2);
                const p3 = daySlots.find((s) => s.period === 3);
                const p4 = daySlots.find((s) => s.period === 4);
                const p5 = daySlots.find((s) => s.period === 5);
                const p6 = daySlots.find((s) => s.period === 6);

                const renderCell = (slot?: TimetableSlot, spanPeriods: number = 1) => {
                  if (!slot) {
                    return (
                      <td colSpan={spanPeriods} style={{ padding: '12px', borderBottom: '1px solid var(--border-default)', backgroundColor: 'var(--surface-primary)', color: 'var(--text-muted)', fontSize: '12px', textAlign: 'center' }}>
                        —
                      </td>
                    );
                  }

                  const isSlotOngoing = ongoingStatus.isClassOngoing && ongoingStatus.currentSlot?.id === slot.id;
                  const courseReminders = getRemindersForCourse(slot.courseCode);

                  return (
                    <td
                      colSpan={spanPeriods}
                      style={{
                        padding: '10px 12px',
                        borderBottom: '1px solid var(--border-default)',
                        backgroundColor: isSlotOngoing
                          ? 'rgba(99, 102, 241, 0.15)'
                          : slot.isLab
                          ? 'rgba(14, 165, 233, 0.04)'
                          : 'transparent',
                        verticalAlign: 'top',
                        position: 'relative',
                        borderLeft: isSlotOngoing ? '2px solid var(--accent-primary)' : undefined,
                      }}
                    >
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '4px' }}>
                          <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-primary)' }}>
                            {slot.courseCode}
                          </span>
                          {courseReminders.length > 0 && (
                            <span
                              title={`${courseReminders.length} reminder(s) pending`}
                              style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: 'var(--color-danger)' }}
                            />
                          )}
                        </div>
                        <div style={{ fontSize: '11px', color: 'var(--text-secondary)', lineHeight: 1.2, maxHeight: '28px', overflow: 'hidden' }}>
                          {slot.courseName}
                        </div>
                        <div style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'flex', justifyContent: 'space-between', marginTop: '2px' }}>
                          <span>{slot.faculty.split(' ')[0]} {slot.faculty.split(' ')[1] || ''}</span>
                          <span style={{ color: 'var(--accent-light)', fontWeight: 500 }}>{slot.room}</span>
                        </div>
                        {/* Quick Reminder Trigger */}
                        <button
                          onClick={() => openReminderForCourse(slot.courseCode)}
                          title="Add reminder for this class"
                          style={{
                            alignSelf: 'flex-start',
                            fontSize: '10px',
                            color: 'var(--accent-primary)',
                            background: 'none',
                            border: 'none',
                            padding: '0',
                            marginTop: '2px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '3px',
                          }}
                        >
                          <Bell size={10} />
                          <span>+ reminder</span>
                        </button>
                      </div>
                    </td>
                  );
                };

                return (
                  <tr
                    key={day}
                    style={{
                      backgroundColor: isDayActive ? 'rgba(99, 102, 241, 0.04)' : 'transparent',
                      transition: 'background-color 0.15s ease',
                    }}
                  >
                    {/* Day Column */}
                    <td style={{ padding: '14px 16px', borderBottom: '1px solid var(--border-default)', fontWeight: 700, fontSize: '13px', color: isDayActive ? 'var(--accent-primary)' : 'var(--text-primary)' }}>
                      <div>{day}</div>
                      {isDayActive && (
                        <span style={{ fontSize: '9px', color: 'var(--accent-light)', textTransform: 'uppercase', display: 'block' }}>
                          TODAY
                        </span>
                      )}
                    </td>

                    {/* Periods based on Day structure */}
                    {day === 'MON' && (
                      <>
                        {renderCell(p1)}
                        {renderCell(p2)}
                        {/* P3 & P4 are combined lab */}
                        {renderCell(p3, 2)}
                        <td style={{ backgroundColor: 'rgba(234, 179, 8, 0.03)', borderBottom: '1px solid var(--border-default)', textAlign: 'center', fontSize: '11px', color: 'var(--text-muted)' }}>
                          🥗
                        </td>
                        {renderCell(p5)}
                        {renderCell(p6)}
                      </>
                    )}

                    {day === 'TUE' && (
                      <>
                        {/* P1 & P2 are combined lab */}
                        {renderCell(p1, 2)}
                        {renderCell(p3)}
                        {renderCell(p4)}
                        <td style={{ backgroundColor: 'rgba(234, 179, 8, 0.03)', borderBottom: '1px solid var(--border-default)', textAlign: 'center', fontSize: '11px', color: 'var(--text-muted)' }}>
                          🥗
                        </td>
                        {renderCell(p5)}
                        {renderCell(p6)}
                      </>
                    )}

                    {day === 'WED' && (
                      <>
                        {renderCell(p1)}
                        {renderCell(p2)}
                        {/* P3 & P4 are Honours */}
                        {renderCell(p3, 2)}
                        <td style={{ backgroundColor: 'rgba(234, 179, 8, 0.03)', borderBottom: '1px solid var(--border-default)', textAlign: 'center', fontSize: '11px', color: 'var(--text-muted)' }}>
                          🥗
                        </td>
                        {/* P5 & P6 are Honours */}
                        {renderCell(p5, 2)}
                      </>
                    )}

                    {day === 'THU' && (
                      <>
                        {renderCell(p1)}
                        {renderCell(p2)}
                        {/* P3 & P4 are OEC371 */}
                        {renderCell(p3, 2)}
                        <td style={{ backgroundColor: 'rgba(234, 179, 8, 0.03)', borderBottom: '1px solid var(--border-default)', textAlign: 'center', fontSize: '11px', color: 'var(--text-muted)' }}>
                          🥗
                        </td>
                        {renderCell(p5)}
                        {renderCell(p6)}
                      </>
                    )}

                    {day === 'FRI' && (
                      <>
                        {renderCell(p1)}
                        {renderCell(p2)}
                        {renderCell(p3)}
                        {renderCell(p4)}
                        <td style={{ backgroundColor: 'rgba(234, 179, 8, 0.03)', borderBottom: '1px solid var(--border-default)', textAlign: 'center', fontSize: '11px', color: 'var(--text-muted)' }}>
                          🥗
                        </td>
                        {/* P5 & P6 are combined lab */}
                        {renderCell(p5, 2)}
                      </>
                    )}

                    {day === 'SAT' && (
                      <>
                        {renderCell(p1)}
                        {renderCell(p2)}
                        {renderCell(p3)}
                        {renderCell(p4)}
                        <td style={{ backgroundColor: 'rgba(234, 179, 8, 0.03)', borderBottom: '1px solid var(--border-default)', textAlign: 'center', fontSize: '11px', color: 'var(--text-muted)' }}>
                          —
                        </td>
                        <td colSpan={2} style={{ padding: '12px', borderBottom: '1px solid var(--border-default)', color: 'var(--text-muted)', fontSize: '12px', textAlign: 'center' }}>
                          Weekend Recess / Self-Study
                        </td>
                      </>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* ===================== TAB 2: DAY-BY-DAY INTERACTIVE VIEW ===================== */}
      {activeTab === 'day' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Day Selector Buttons */}
          <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
            {daysList.map((d) => (
              <button
                key={d.key}
                onClick={() => setSelectedDay(d.key)}
                style={{
                  padding: '8px 20px',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '13px',
                  fontWeight: selectedDay === d.key ? 600 : 400,
                  backgroundColor: selectedDay === d.key ? 'var(--surface-elevated)' : 'var(--surface-primary)',
                  border: `1px solid ${selectedDay === d.key ? 'var(--accent-primary)' : 'var(--border-default)'}`,
                  color: selectedDay === d.key ? 'var(--text-primary)' : 'var(--text-secondary)',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                }}
              >
                {d.full}
              </button>
            ))}
          </div>

          {/* Cards for Selected Day */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {getSlotsForDay(selectedDay, selectedBatch).map((slot) => {
              const isOngoing = ongoingStatus.isClassOngoing && ongoingStatus.currentSlot?.id === slot.id && effectiveDay === selectedDay;
              const courseReminders = getRemindersForCourse(slot.courseCode);

              return (
                <div
                  key={slot.id}
                  className="card-base"
                  style={{
                    padding: '18px 20px',
                    border: `1px solid ${isOngoing ? 'var(--accent-primary)' : 'var(--border-default)'}`,
                    backgroundColor: isOngoing ? 'rgba(99, 102, 241, 0.08)' : 'var(--surface-primary)',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
                      <div
                        style={{
                          width: '44px',
                          height: '44px',
                          borderRadius: '8px',
                          backgroundColor: slot.isLab ? 'rgba(14, 165, 233, 0.15)' : 'var(--surface-elevated)',
                          border: '1px solid var(--border-strong)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: slot.isLab ? 'var(--color-info)' : 'var(--accent-primary)',
                          fontWeight: 700,
                          fontSize: '13px',
                          flexShrink: 0,
                        }}
                      >
                        P{slot.period}
                      </div>

                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px' }}>
                          <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>
                            {slot.time}
                          </span>
                          <span className="badge badge-neutral" style={{ fontSize: '10px' }}>
                            {slot.category?.toUpperCase() || 'CORE'}
                          </span>
                          {slot.batch && slot.batch !== 'ALL' && (
                            <span className="badge badge-accent" style={{ fontSize: '10px' }}>
                              {slot.batch}
                            </span>
                          )}
                          {isOngoing && (
                            <span className="badge badge-success" style={{ fontSize: '10px' }}>
                              LIVE NOW
                            </span>
                          )}
                        </div>

                        <h4 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-primary)', margin: '2px 0' }}>
                          {slot.courseCode} — {slot.courseName}
                        </h4>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginTop: '6px', fontSize: '12px', color: 'var(--text-secondary)' }}>
                          <span>Faculty: <strong>{slot.faculty}</strong></span>
                          <span>•</span>
                          <span>Room: <strong>{slot.room || 'Room 303'}</strong></span>
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <button
                        onClick={() => openReminderForCourse(slot.courseCode)}
                        className="btn btn-outline"
                        style={{ fontSize: '12px', padding: '6px 12px', display: 'flex', alignItems: 'center', gap: '5px' }}
                      >
                        <Bell size={12} />
                        <span>Add Reminder</span>
                      </button>

                      {onMarkAttendance && (
                        <button
                          onClick={() => {
                            onMarkAttendance(slot.courseCode, 'present');
                            showToast('Attendance Marked', `Present for ${slot.courseCode}`, 'success');
                          }}
                          className="btn btn-ghost"
                          style={{ fontSize: '12px', padding: '6px 12px' }}
                        >
                          Mark Present
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Course reminders inline preview */}
                  {courseReminders.length > 0 && (
                    <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px solid var(--border-default)', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <span style={{ fontSize: '11px', color: 'var(--color-warning)', fontWeight: 600 }}>
                        {courseReminders.length} UPCOMING DEADLINE(S) FOR THIS CLASS:
                      </span>
                      {courseReminders.map((rem) => (
                        <div key={rem.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '12px', color: 'var(--text-secondary)' }}>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--color-danger)' }} />
                            <strong>{rem.title}</strong> — Due {rem.dueDate} ({rem.priorOffset} notice)
                          </span>
                          <button
                            onClick={() => handleToggleReminder(rem.id)}
                            style={{ background: 'none', border: 'none', color: 'var(--accent-primary)', fontSize: '11px', cursor: 'pointer' }}
                          >
                            Mark Complete
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ===================== TAB 3: CLASS REMINDERS MANAGER ===================== */}
      {activeTab === 'reminders' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <h3 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--text-primary)' }}>
                Active Class Reminders &amp; Deadlines
              </h3>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                Track exam alerts, project submissions, quiz preps, and viva prior notices for each class.
              </p>
            </div>

            <button
              onClick={() => {
                setTargetCourseForReminder('AIML334');
                setIsReminderModalOpen(true);
              }}
              className="btn btn-accent-solid"
              style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 14px', fontSize: '13px' }}
            >
              <Plus size={14} />
              <span>New Reminder</span>
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '14px' }}>
            {reminders.map((rem) => {
              const typeColor =
                rem.type === 'exam'
                  ? 'var(--color-danger)'
                  : rem.type === 'submission'
                  ? 'var(--color-warning)'
                  : rem.type === 'quiz'
                  ? 'var(--accent-primary)'
                  : 'var(--color-info)';

              return (
                <div
                  key={rem.id}
                  className="card-base"
                  style={{
                    padding: '16px',
                    opacity: rem.completed ? 0.6 : 1,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    gap: '12px',
                    border: rem.completed ? '1px solid var(--border-default)' : '1px solid var(--border-strong)',
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                      <span
                        style={{
                          fontSize: '11px',
                          fontWeight: 700,
                          padding: '3px 8px',
                          borderRadius: 'var(--radius-sm)',
                          backgroundColor: 'var(--surface-elevated)',
                          color: typeColor,
                          border: `1px solid ${typeColor}`,
                          textTransform: 'uppercase',
                        }}
                      >
                        {rem.type} • {rem.courseCode}
                      </span>

                      <span style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Clock size={11} />
                        Prior: {rem.priorOffset}
                      </span>
                    </div>

                    <h4
                      style={{
                        fontSize: '15px',
                        fontWeight: 600,
                        color: 'var(--text-primary)',
                        textDecoration: rem.completed ? 'line-through' : 'none',
                        margin: '4px 0',
                      }}
                    >
                      {rem.title}
                    </h4>

                    {rem.description && (
                      <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px', lineHeight: 1.35 }}>
                        {rem.description}
                      </p>
                    )}
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '10px', borderTop: '1px solid var(--border-default)' }}>
                    <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                      Due: <strong>{rem.dueDate}</strong> {rem.dueTime ? `at ${rem.dueTime}` : ''}
                    </span>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <button
                        onClick={() => handleToggleReminder(rem.id)}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: rem.completed ? 'var(--color-success)' : 'var(--text-secondary)',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                          fontSize: '12px',
                        }}
                      >
                        <CheckCircle2 size={15} />
                        <span>{rem.completed ? 'Completed' : 'Done'}</span>
                      </button>

                      <button
                        onClick={() => handleDeleteReminder(rem.id)}
                        style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '4px' }}
                        title="Delete reminder"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ===================== TAB 4: COURSE & FACULTY CATALOG ===================== */}
      {activeTab === 'catalog' && (
        <div className="card-base" style={{ padding: '0', overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '700px' }}>
            <thead>
              <tr style={{ backgroundColor: 'var(--surface-secondary)', borderBottom: '1px solid var(--border-default)' }}>
                <th style={{ padding: '12px 16px', fontSize: '12px', color: 'var(--text-secondary)', width: '60px' }}>S.NO</th>
                <th style={{ padding: '12px 16px', fontSize: '12px', color: 'var(--text-secondary)', width: '130px' }}>COURSE CODE</th>
                <th style={{ padding: '12px 16px', fontSize: '12px', color: 'var(--text-secondary)' }}>COURSE NAME</th>
                <th style={{ padding: '12px 16px', fontSize: '12px', color: 'var(--text-secondary)' }}>FACULTY NAME</th>
                <th style={{ padding: '12px 16px', fontSize: '12px', color: 'var(--text-secondary)' }}>ROOM / VENUE</th>
                <th style={{ padding: '12px 16px', fontSize: '12px', color: 'var(--text-secondary)', width: '120px' }}>ACTION</th>
              </tr>
            </thead>
            <tbody>
              {COURSE_CATALOG.map((c) => (
                <tr key={c.code} style={{ borderBottom: '1px solid var(--border-default)' }}>
                  <td style={{ padding: '12px 16px', fontSize: '13px', color: 'var(--text-muted)' }}>{c.sNo}</td>
                  <td style={{ padding: '12px 16px', fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>{c.code}</td>
                  <td style={{ padding: '12px 16px', fontSize: '13px', color: 'var(--text-primary)' }}>{c.name}</td>
                  <td style={{ padding: '12px 16px', fontSize: '13px', color: 'var(--text-secondary)' }}>{c.faculty}</td>
                  <td style={{ padding: '12px 16px', fontSize: '12px', color: 'var(--accent-light)', fontWeight: 500 }}>
                    {c.room || 'Room 303'}
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <button
                      onClick={() => openReminderForCourse(c.code)}
                      className="btn btn-outline"
                      style={{ fontSize: '11px', padding: '4px 8px', display: 'flex', alignItems: 'center', gap: '4px' }}
                    >
                      <Bell size={11} />
                      <span>Set Alert</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Class Reminder Modal */}
      <ClassReminderModal
        isOpen={isReminderModalOpen}
        onClose={() => setIsReminderModalOpen(false)}
        defaultCourseCode={targetCourseForReminder}
        onSaveReminder={handleSaveReminder}
      />
    </div>
  );
};
