// Teacher — Attendance Manager
// Session creation, student roster marking (Present/Absent/Late), metrics, and past session history

import React, { useState } from 'react';
import {
  UserCheck,
  Calendar,
  Clock,
  BookOpen,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Plus,
  History,
  RotateCcw,
  Save,
  Users,
  Search,
  Filter,
} from 'lucide-react';
import { useToast } from '../common/Toast';
import {
  INSTITUTIONAL_STUDENTS,
  INITIAL_TEACHER_SESSIONS,
  InstitutionalStudent,
  TeacherSession,
} from '../../data/institutionalData';

export const AttendanceManager: React.FC = () => {
  const { showToast } = useToast();

  // Active view: 'new-session' | 'history'
  const [activeTab, setActiveTab] = useState<'new-session' | 'history'>('new-session');

  // Sessions state (persisted to localStorage)
  const [sessions, setSessions] = useState<TeacherSession[]>(() => {
    try {
      const saved = localStorage.getItem('stellar_teacher_sessions');
      if (saved) return JSON.parse(saved);
    } catch {}
    return INITIAL_TEACHER_SESSIONS;
  });

  // Students state
  const [students] = useState<InstitutionalStudent[]>(() => {
    try {
      const saved = localStorage.getItem('stellar_institutional_students');
      if (saved) return JSON.parse(saved);
    } catch {}
    return INSTITUTIONAL_STUDENTS;
  });

  // Active Session Creation Form
  const [selectedSubject, setSelectedSubject] = useState('CSE335');
  const [selectedSection, setSelectedSection] = useState('AI-A (B1)');
  const [sessionDate, setSessionDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [timeSlot, setTimeSlot] = useState('09:00 - 10:00 AM');
  const [topic, setTopic] = useState('Lecture 25: Relational Normalization & Multi-valued Dependencies');

  // Current session attendance marks { [studentId]: 'present' | 'absent' | 'late' }
  const [attendanceRecords, setAttendanceRecords] = useState<Record<string, 'present' | 'absent' | 'late'>>(() => {
    const initial: Record<string, 'present' | 'absent' | 'late'> = {};
    students.forEach((s) => {
      initial[s.id] = 'present';
    });
    return initial;
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'present' | 'absent' | 'late'>('all');

  // Selected past session for detail modal/drawer
  const [selectedPastSession, setSelectedPastSession] = useState<TeacherSession | null>(null);

  // Statistics calculation
  const totalCount = students.length;
  const presentCount = Object.values(attendanceRecords).filter((s) => s === 'present').length;
  const absentCount = Object.values(attendanceRecords).filter((s) => s === 'absent').length;
  const lateCount = Object.values(attendanceRecords).filter((s) => s === 'late').length;
  const attendanceRate = totalCount > 0 ? Math.round(((presentCount + lateCount) / totalCount) * 100) : 0;

  // Toggle status for student
  const handleSetStatus = (studentId: string, status: 'present' | 'absent' | 'late') => {
    setAttendanceRecords((prev) => ({
      ...prev,
      [studentId]: status,
    }));
  };

  // Batch actions
  const handleMarkAll = (status: 'present' | 'absent') => {
    const updated: Record<string, 'present' | 'absent' | 'late'> = {};
    students.forEach((s) => {
      updated[s.id] = status;
    });
    setAttendanceRecords(updated);
    showToast(
      status === 'present' ? 'All Marked Present' : 'All Marked Absent',
      `Updated ${students.length} students to ${status}.`,
      status === 'present' ? 'success' : 'warning'
    );
  };

  const handleReset = () => {
    const reset: Record<string, 'present' | 'absent' | 'late'> = {};
    students.forEach((s) => {
      reset[s.id] = 'present';
    });
    setAttendanceRecords(reset);
    showToast('Reset Complete', 'Defaulted all students to present.', 'info');
  };

  // Submit and save session
  const handleSaveSession = () => {
    if (!topic.trim()) {
      showToast('Missing Topic', 'Please enter a lecture topic before saving.', 'error');
      return;
    }

    const newSession: TeacherSession = {
      id: `sess-${Date.now()}`,
      subjectCode: selectedSubject,
      subjectName: selectedSubject === 'CSE335' ? 'Database Management Systems' : 'Database Management Systems Lab',
      section: selectedSection,
      date: sessionDate,
      timeSlot,
      topic: topic.trim(),
      totalStudents: totalCount,
      presentCount,
      absentCount,
      lateCount,
      attendancePct: attendanceRate,
      status: 'closed',
      records: attendanceRecords,
    };

    const updatedSessions = [newSession, ...sessions];
    setSessions(updatedSessions);
    localStorage.setItem('stellar_teacher_sessions', JSON.stringify(updatedSessions));

    showToast(
      'Attendance Recorded',
      `${presentCount}/${totalCount} students marked present (${attendanceRate}% attendance).`,
      'success'
    );

    setActiveTab('history');
  };

  // Filter students for roster view
  const filteredStudents = students.filter((s) => {
    const matchesSearch =
      s.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.studentId.toLowerCase().includes(searchQuery.toLowerCase());
    const currentStatus = attendanceRecords[s.id];
    const matchesFilter = filterStatus === 'all' || currentStatus === filterStatus;
    return matchesSearch && matchesFilter;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '1100px', margin: '0 auto' }}>
      {/* Page Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Faculty Operations</span>
            <span style={{ color: 'var(--border-strong)' }}>•</span>
            <span style={{ fontSize: '12px', color: 'var(--accent-primary)', fontWeight: 500 }}>
              Attendance Manager
            </span>
          </div>
          <h2 style={{ fontSize: '24px', fontWeight: 600 }}>Attendance Sessions & Roster</h2>
          <p style={{ fontSize: '14px', color: 'var(--text-muted)' }}>
            Record class attendance, manage daily registers, and verify student records.
          </p>
        </div>

        {/* Tab Switcher */}
        <div style={{ display: 'flex', gap: '6px', backgroundColor: 'var(--surface-secondary)', padding: '4px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-default)' }}>
          <button
            onClick={() => setActiveTab('new-session')}
            className={`btn ${activeTab === 'new-session' ? 'btn-accent-solid' : 'btn-ghost'}`}
            style={{ fontSize: '13px', padding: '6px 14px', gap: '6px' }}
          >
            <Plus size={14} /> New Session
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`btn ${activeTab === 'history' ? 'btn-accent-solid' : 'btn-ghost'}`}
            style={{ fontSize: '13px', padding: '6px 14px', gap: '6px' }}
          >
            <History size={14} /> Past Registers ({sessions.length})
          </button>
        </div>
      </div>

      {activeTab === 'new-session' ? (
        <>
          {/* Session Parameters Card */}
          <div className="card-base" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <BookOpen size={16} style={{ color: 'var(--accent-primary)' }} />
              Class Session Parameters
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                  Course / Subject *
                </label>
                <select
                  value={selectedSubject}
                  onChange={(e) => setSelectedSubject(e.target.value)}
                  style={{ width: '100%', padding: '9px 12px', borderRadius: 'var(--radius-sm)' }}
                >
                  <option value="CSE335">CSE335 — Database Management Systems (Theory)</option>
                  <option value="CSE353">CSE353 — Database Management Systems Lab</option>
                  <option value="OEC371">OEC371 — Ability Enhancement Course-III</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                  Section / Batch *
                </label>
                <select
                  value={selectedSection}
                  onChange={(e) => setSelectedSection(e.target.value)}
                  style={{ width: '100%', padding: '9px 12px', borderRadius: 'var(--radius-sm)' }}
                >
                  <option value="AI-A (B1)">AI-A — Batch B1 (12 Enrolled)</option>
                  <option value="AI-A (B2)">AI-A — Batch B2 (12 Enrolled)</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                  Session Date *
                </label>
                <input
                  type="date"
                  value={sessionDate}
                  onChange={(e) => setSessionDate(e.target.value)}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: 'var(--radius-sm)' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                  Time Slot *
                </label>
                <select
                  value={timeSlot}
                  onChange={(e) => setTimeSlot(e.target.value)}
                  style={{ width: '100%', padding: '9px 12px', borderRadius: 'var(--radius-sm)' }}
                >
                  <option value="09:00 - 10:00 AM">09:00 - 10:00 AM (Period 1)</option>
                  <option value="10:00 - 11:00 AM">10:00 - 11:00 AM (Period 2)</option>
                  <option value="11:00 AM - 01:00 PM">11:00 AM - 01:00 PM (Lab Block)</option>
                  <option value="02:00 - 03:00 PM">02:00 - 03:00 PM (Period 4)</option>
                  <option value="03:00 - 04:00 PM">03:00 - 04:00 PM (Period 5)</option>
                </select>
              </div>

              <div style={{ gridColumn: '1 / -1' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                  Lecture / Lab Topic *
                </label>
                <input
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="e.g. Lecture 25: Relational Normalization & Multi-valued Dependencies"
                  style={{ width: '100%', padding: '9px 12px', borderRadius: 'var(--radius-sm)' }}
                />
              </div>
            </div>
          </div>

          {/* Live Roster & Metrics */}
          <div className="card-base" style={{ padding: '24px' }}>
            {/* KPI Summary Bar */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
              gap: '12px',
              padding: '16px',
              backgroundColor: 'var(--surface-secondary)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-default)',
              marginBottom: '20px',
            }}>
              <div>
                <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Total Roster</span>
                <div style={{ fontSize: '22px', fontWeight: 700 }}>{totalCount}</div>
              </div>
              <div>
                <span style={{ fontSize: '12px', color: '#4caf7a' }}>Present</span>
                <div style={{ fontSize: '22px', fontWeight: 700, color: '#4caf7a' }}>
                  {presentCount} <span style={{ fontSize: '14px', fontWeight: 500 }}>({attendanceRate}%)</span>
                </div>
              </div>
              <div>
                <span style={{ fontSize: '12px', color: '#d96c6c' }}>Absent</span>
                <div style={{ fontSize: '22px', fontWeight: 700, color: '#d96c6c' }}>{absentCount}</div>
              </div>
              <div>
                <span style={{ fontSize: '12px', color: '#d6a84f' }}>Late</span>
                <div style={{ fontSize: '22px', fontWeight: 700, color: '#d6a84f' }}>{lateCount}</div>
              </div>
            </div>

            {/* Filter and Quick Action Tools */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '12px',
              marginBottom: '16px',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1, minWidth: '240px' }}>
                <div style={{ position: 'relative', width: '100%' }}>
                  <Search size={15} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  <input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search student by name or ID..."
                    style={{ width: '100%', paddingLeft: '36px', paddingRight: '12px', fontSize: '13px' }}
                  />
                </div>
                <div style={{ display: 'flex', gap: '4px' }}>
                  {(['all', 'present', 'absent', 'late'] as const).map((status) => (
                    <button
                      key={status}
                      onClick={() => setFilterStatus(status)}
                      style={{
                        padding: '6px 10px',
                        borderRadius: 'var(--radius-sm)',
                        fontSize: '12px',
                        textTransform: 'capitalize',
                        border: '1px solid var(--border-default)',
                        backgroundColor: filterStatus === status ? 'var(--accent-subtle)' : 'transparent',
                        color: filterStatus === status ? 'var(--accent-light)' : 'var(--text-secondary)',
                      }}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>

              {/* Batch Toggle Buttons */}
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  type="button"
                  onClick={() => handleMarkAll('present')}
                  className="btn btn-secondary"
                  style={{ fontSize: '12px', padding: '6px 12px', gap: '6px' }}
                >
                  <CheckCircle2 size={14} style={{ color: '#4caf7a' }} /> Mark All Present
                </button>
                <button
                  type="button"
                  onClick={() => handleMarkAll('absent')}
                  className="btn btn-secondary"
                  style={{ fontSize: '12px', padding: '6px 12px', gap: '6px' }}
                >
                  <XCircle size={14} style={{ color: '#d96c6c' }} /> Mark All Absent
                </button>
                <button
                  type="button"
                  onClick={handleReset}
                  className="btn btn-secondary"
                  style={{ fontSize: '12px', padding: '6px 10px' }}
                  title="Reset status"
                >
                  <RotateCcw size={14} />
                </button>
              </div>
            </div>

            {/* Student Roster Table */}
            <div style={{ overflowX: 'auto', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-md)' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                <thead>
                  <tr style={{ backgroundColor: 'var(--surface-secondary)', borderBottom: '1px solid var(--border-default)' }}>
                    <th style={{ textAlign: 'left', padding: '10px 16px', color: 'var(--text-muted)', fontWeight: 500 }}>Student</th>
                    <th style={{ textAlign: 'left', padding: '10px 16px', color: 'var(--text-muted)', fontWeight: 500 }}>Student ID</th>
                    <th style={{ textAlign: 'left', padding: '10px 16px', color: 'var(--text-muted)', fontWeight: 500 }}>Batch</th>
                    <th style={{ textAlign: 'left', padding: '10px 16px', color: 'var(--text-muted)', fontWeight: 500 }}>Cumulative %</th>
                    <th style={{ textAlign: 'center', padding: '10px 16px', color: 'var(--text-muted)', fontWeight: 500 }}>Attendance Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStudents.length === 0 ? (
                    <tr>
                      <td colSpan={5} style={{ padding: '32px', textAlign: 'center', color: 'var(--text-muted)' }}>
                        No students matching current search or filter.
                      </td>
                    </tr>
                  ) : (
                    filteredStudents.map((student) => {
                      const currentStatus = attendanceRecords[student.id] || 'present';
                      return (
                        <tr
                          key={student.id}
                          style={{
                            borderBottom: '1px solid var(--border-subtle)',
                            backgroundColor:
                              currentStatus === 'absent'
                                ? 'rgba(217, 108, 108, 0.05)'
                                : currentStatus === 'late'
                                ? 'rgba(214, 168, 79, 0.05)'
                                : 'transparent',
                          }}
                        >
                          <td style={{ padding: '12px 16px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                              <div style={{
                                width: '30px', height: '30px', borderRadius: '50%',
                                backgroundColor: 'var(--surface-elevated)', border: '1px solid var(--accent-border)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                color: 'var(--accent-primary)', fontSize: '13px', fontWeight: 600,
                              }}>
                                {student.avatarLetter}
                              </div>
                              <div>
                                <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{student.fullName}</div>
                                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{student.email}</div>
                              </div>
                            </div>
                          </td>
                          <td style={{ padding: '12px 16px', color: 'var(--text-secondary)', fontFamily: 'monospace' }}>
                            {student.studentId}
                          </td>
                          <td style={{ padding: '12px 16px' }}>
                            <span className="badge badge-neutral">{student.batch}</span>
                          </td>
                          <td style={{ padding: '12px 16px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                              <span style={{
                                fontWeight: 600,
                                color:
                                  student.attendancePct >= 75
                                    ? '#4caf7a'
                                    : student.attendancePct >= 65
                                    ? '#d6a84f'
                                    : '#d96c6c',
                              }}>
                                {student.attendancePct}%
                              </span>
                              <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                                ({student.classesPresent}/{student.classesTotal})
                              </span>
                            </div>
                          </td>
                          <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                            <div style={{ display: 'inline-flex', gap: '4px', backgroundColor: 'var(--surface-secondary)', padding: '3px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-default)' }}>
                              <button
                                type="button"
                                onClick={() => handleSetStatus(student.id, 'present')}
                                style={{
                                  padding: '5px 12px',
                                  borderRadius: 'var(--radius-xs)',
                                  fontSize: '12px',
                                  fontWeight: 600,
                                  cursor: 'pointer',
                                  border: 'none',
                                  backgroundColor: currentStatus === 'present' ? '#4caf7a' : 'transparent',
                                  color: currentStatus === 'present' ? '#fff' : 'var(--text-secondary)',
                                  transition: 'all 0.15s ease',
                                }}
                              >
                                Present
                              </button>
                              <button
                                type="button"
                                onClick={() => handleSetStatus(student.id, 'absent')}
                                style={{
                                  padding: '5px 12px',
                                  borderRadius: 'var(--radius-xs)',
                                  fontSize: '12px',
                                  fontWeight: 600,
                                  cursor: 'pointer',
                                  border: 'none',
                                  backgroundColor: currentStatus === 'absent' ? '#d96c6c' : 'transparent',
                                  color: currentStatus === 'absent' ? '#fff' : 'var(--text-secondary)',
                                  transition: 'all 0.15s ease',
                                }}
                              >
                                Absent
                              </button>
                              <button
                                type="button"
                                onClick={() => handleSetStatus(student.id, 'late')}
                                style={{
                                  padding: '5px 12px',
                                  borderRadius: 'var(--radius-xs)',
                                  fontSize: '12px',
                                  fontWeight: 600,
                                  cursor: 'pointer',
                                  border: 'none',
                                  backgroundColor: currentStatus === 'late' ? '#d6a84f' : 'transparent',
                                  color: currentStatus === 'late' ? '#fff' : 'var(--text-secondary)',
                                  transition: 'all 0.15s ease',
                                }}
                              >
                                Late
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Bottom Commit Action Bar */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginTop: '20px',
              paddingTop: '16px',
              borderTop: '1px solid var(--border-subtle)',
              flexWrap: 'wrap',
              gap: '12px',
            }}>
              <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                Marking <strong>{presentCount}</strong> present, <strong>{absentCount}</strong> absent out of <strong>{totalCount}</strong> students.
              </div>
              <button
                type="button"
                onClick={handleSaveSession}
                className="btn btn-accent-solid"
                style={{ padding: '10px 24px', fontSize: '14px', gap: '8px' }}
              >
                <Save size={16} /> Save & Commit Attendance Session
              </button>
            </div>
          </div>
        </>
      ) : (
        /* Past Sessions History Tab */
        <div className="card-base" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <History size={16} style={{ color: 'var(--accent-primary)' }} />
              Recorded Attendance Registers
            </h3>
            <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
              {sessions.length} recorded session registers
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {sessions.map((sess) => (
              <div
                key={sess.id}
                style={{
                  padding: '18px',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'var(--surface-secondary)',
                  border: '1px solid var(--border-default)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '14px',
                }}
              >
                <div style={{ flex: 1, minWidth: '280px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <span className="badge badge-accent">{sess.subjectCode}</span>
                    <span className="badge badge-neutral">{sess.section}</span>
                    <span style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Calendar size={12} /> {sess.date}
                    </span>
                    <span style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Clock size={12} /> {sess.timeSlot}
                    </span>
                  </div>
                  <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>
                    {sess.topic}
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                    {sess.subjectName}
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '18px', fontWeight: 700, color: sess.attendancePct >= 75 ? '#4caf7a' : '#d96c6c' }}>
                      {sess.attendancePct}%
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                      {sess.presentCount} / {sess.totalStudents} Present
                    </div>
                  </div>

                  <button
                    onClick={() => setSelectedPastSession(sess)}
                    className="btn btn-secondary"
                    style={{ fontSize: '12px', padding: '6px 14px' }}
                  >
                    View Roster
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Past Session Inspection Modal */}
      {selectedPastSession && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 999,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: '20px', backgroundColor: 'rgba(9, 9, 11, 0.8)', backdropFilter: 'blur(4px)',
        }}>
          <div className="card-base" style={{ width: '100%', maxWidth: '640px', maxHeight: '85vh', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border-default)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 style={{ fontSize: '16px', fontWeight: 600 }}>{selectedPastSession.topic}</h3>
                <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                  {selectedPastSession.subjectCode} • {selectedPastSession.section} • {selectedPastSession.date} ({selectedPastSession.timeSlot})
                </p>
              </div>
              <button onClick={() => setSelectedPastSession(null)} className="btn btn-ghost" style={{ padding: '4px 8px' }}>✕</button>
            </div>

            <div style={{ padding: '20px 24px', overflowY: 'auto', flex: 1 }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '10px' }}>
                {students.map((st) => {
                  const stStatus = selectedPastSession.records[st.id] || 'present';
                  return (
                    <div
                      key={st.id}
                      style={{
                        padding: '10px 14px',
                        borderRadius: 'var(--radius-sm)',
                        backgroundColor: 'var(--surface-secondary)',
                        border: '1px solid var(--border-subtle)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                      }}
                    >
                      <div>
                        <div style={{ fontSize: '13px', fontWeight: 500 }}>{st.fullName}</div>
                        <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{st.studentId}</div>
                      </div>
                      <span className={`badge ${stStatus === 'present' ? 'badge-success' : stStatus === 'late' ? 'badge-warning' : 'badge-danger'}`}>
                        {stStatus}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div style={{ padding: '16px 24px', borderTop: '1px solid var(--border-default)', display: 'flex', justifyContent: 'flex-end' }}>
              <button onClick={() => setSelectedPastSession(null)} className="btn btn-secondary">Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
