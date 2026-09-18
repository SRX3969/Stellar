// Teacher — Student Viewer & Inspector
import React, { useState } from 'react';
import { useQuery } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { Users, Search, Mail, BookOpen, Calendar, Award, AlertTriangle, ShieldCheck, X } from 'lucide-react';
import { INSTITUTIONAL_STUDENTS, InstitutionalStudent } from '../../data/institutionalData';

export const StudentViewer: React.FC = () => {
  const convexStudents = useQuery(api.users.getUsersByRole, { role: 'student' }) || [];
  const [search, setSearch] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<InstitutionalStudent | null>(null);

  // Combine or fallback to institutional dataset
  const displayStudents: InstitutionalStudent[] = INSTITUTIONAL_STUDENTS;

  const filtered = displayStudents.filter(s =>
    s.fullName.toLowerCase().includes(search.toLowerCase()) ||
    s.email.toLowerCase().includes(search.toLowerCase()) ||
    s.studentId.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '1100px', margin: '0 auto' }}>
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
          <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Faculty Portal</span>
          <span style={{ color: 'var(--border-strong)' }}>•</span>
          <span style={{ fontSize: '12px', color: 'var(--accent-primary)', fontWeight: 500 }}>Section Roster</span>
        </div>
        <h2 style={{ fontSize: '24px', fontWeight: 600 }}>Enrolled Students Roster</h2>
        <p style={{ fontSize: '14px', color: 'var(--text-muted)' }}>
          {filtered.length} active students enrolled in B.Tech AI & Data Science (Batch B1, Semester III)
        </p>
      </div>

      <div style={{ position: 'relative' }}>
        <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search students by name, email, or student ID..."
          style={{ width: '100%', paddingLeft: '36px' }}
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }}>
        {filtered.map(s => (
          <div
            key={s.id}
            onClick={() => setSelectedStudent(s)}
            className="card-base"
            style={{
              padding: '18px',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
              border: '1px solid var(--border-default)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
              <div style={{
                width: '42px', height: '42px', borderRadius: '50%',
                backgroundColor: 'var(--accent-subtle)', border: '1px solid var(--accent-border)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'var(--accent-primary)', fontSize: '16px', fontWeight: 700,
              }}>
                {s.avatarLetter}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-primary)' }}>{s.fullName}</div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontFamily: 'monospace' }}>{s.studentId}</div>
              </div>
              <span className="badge badge-neutral">{s.batch}</span>
            </div>

            <div style={{
              display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px',
              padding: '10px', backgroundColor: 'var(--surface-secondary)', borderRadius: 'var(--radius-sm)',
            }}>
              <div>
                <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Attendance</span>
                <div style={{ fontSize: '13px', fontWeight: 700, color: s.attendancePct >= 75 ? '#4caf7a' : '#d96c6c' }}>
                  {s.attendancePct}%
                </div>
              </div>
              <div>
                <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Avg Marks</span>
                <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--accent-primary)' }}>
                  {s.marksAverage}%
                </div>
              </div>
              <div>
                <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Lab Progress</span>
                <div style={{ fontSize: '13px', fontWeight: 600 }}>
                  {s.labCompletedCount}/5
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Student Detail Modal */}
      {selectedStudent && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 999,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: '20px', backgroundColor: 'rgba(9, 9, 11, 0.8)', backdropFilter: 'blur(4px)',
        }}>
          <div className="card-base" style={{ width: '100%', maxWidth: '520px', padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div style={{
                  width: '48px', height: '48px', borderRadius: '50%',
                  backgroundColor: 'var(--surface-elevated)', border: '1px solid var(--accent-border)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'var(--accent-primary)', fontSize: '18px', fontWeight: 700,
                }}>
                  {selectedStudent.avatarLetter}
                </div>
                <div>
                  <h3 style={{ fontSize: '18px', fontWeight: 600 }}>{selectedStudent.fullName}</h3>
                  <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                    {selectedStudent.studentId} • {selectedStudent.email}
                  </p>
                </div>
              </div>
              <button onClick={() => setSelectedStudent(null)} className="btn btn-ghost"><X size={18} /></button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
                <div style={{ padding: '12px', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--surface-secondary)' }}>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Program & Batch</span>
                  <div style={{ fontSize: '13px', fontWeight: 600 }}>{selectedStudent.course}</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Semester III • Batch {selectedStudent.batch}</div>
                </div>

                <div style={{ padding: '12px', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--surface-secondary)' }}>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Attendance Record</span>
                  <div style={{ fontSize: '15px', fontWeight: 700, color: selectedStudent.attendancePct >= 75 ? '#4caf7a' : '#d96c6c' }}>
                    {selectedStudent.attendancePct}%
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{selectedStudent.classesPresent} of {selectedStudent.classesTotal} attended</div>
                </div>
              </div>

              <div style={{ padding: '14px', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--surface-secondary)' }}>
                <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '8px' }}>
                  Assessment Scores Breakdown
                </span>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '6px' }}>
                  <span>CIA-1 (DBMS Theory):</span>
                  <strong>{selectedStudent.cia1Score} / 50 pts</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '6px' }}>
                  <span>Quiz 1 (Relational Alg & SQL):</span>
                  <strong>{selectedStudent.quiz1Score} / 20 pts</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '6px' }}>
                  <span>Assignment 1 (ER Modeling):</span>
                  <strong>{selectedStudent.assignment1Score} / 25 pts</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                  <span>Lab Experiments Completed:</span>
                  <strong>{selectedStudent.labCompletedCount} / 5 Verified</strong>
                </div>
              </div>

              {selectedStudent.riskFactors.length > 0 && (
                <div style={{ padding: '12px', borderRadius: 'var(--radius-sm)', backgroundColor: 'rgba(217, 108, 108, 0.08)', border: '1px solid rgba(217, 108, 108, 0.3)' }}>
                  <div style={{ fontSize: '12px', fontWeight: 600, color: '#d96c6c', marginBottom: '4px' }}>
                    Active Warning Factors:
                  </div>
                  <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '12px', color: 'var(--text-secondary)' }}>
                    {selectedStudent.riskFactors.map((f, i) => (
                      <li key={i}>{f}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px' }}>
              <button onClick={() => setSelectedStudent(null)} className="btn btn-secondary">Close Inspector</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
