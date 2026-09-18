// Teacher — Performance & Academic Analytics Dashboard
// Attendance breakdown, score trends, topic distributions, and student risk identification

import React, { useState } from 'react';
import {
  BarChart3,
  TrendingUp,
  Users,
  AlertTriangle,
  Award,
  BookOpen,
  Calendar,
  CheckCircle2,
  PieChart,
  ArrowUpRight,
  Filter,
} from 'lucide-react';
import {
  INSTITUTIONAL_STUDENTS,
  INITIAL_ASSESSMENTS,
  InstitutionalStudent,
} from '../../data/institutionalData';

export const TeacherAnalytics: React.FC = () => {
  const [students] = useState<InstitutionalStudent[]>(() => {
    try {
      const saved = localStorage.getItem('stellar_institutional_students');
      if (saved) return JSON.parse(saved);
    } catch {}
    return INSTITUTIONAL_STUDENTS;
  });

  const [selectedSubject, setSelectedSubject] = useState('CSE335');

  // Attendance segmentation
  const safeAttendance = students.filter((s) => s.attendancePct >= 75);
  const watchAttendance = students.filter((s) => s.attendancePct >= 65 && s.attendancePct < 75);
  const criticalAttendance = students.filter((s) => s.attendancePct < 65);

  const safePct = Math.round((safeAttendance.length / students.length) * 100);
  const watchPct = Math.round((watchAttendance.length / students.length) * 100);
  const criticalPct = Math.round((criticalAttendance.length / students.length) * 100);

  // Performance segmentation
  const distinctions = students.filter((s) => s.marksAverage >= 80);
  const firstClass = students.filter((s) => s.marksAverage >= 65 && s.marksAverage < 80);
  const passClass = students.filter((s) => s.marksAverage >= 50 && s.marksAverage < 65);
  const atRiskStudents = students.filter((s) => s.marksAverage < 50 || s.attendancePct < 70);

  // Class Average
  const classAvgMarks = Math.round(
    students.reduce((acc, curr) => acc + curr.marksAverage, 0) / students.length
  );
  const classAvgAttendance = Math.round(
    students.reduce((acc, curr) => acc + curr.attendancePct, 0) / students.length
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '1100px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Faculty Analytics</span>
            <span style={{ color: 'var(--border-strong)' }}>•</span>
            <span style={{ fontSize: '12px', color: 'var(--accent-primary)', fontWeight: 500 }}>
              Academic Intelligence Dashboard
            </span>
          </div>
          <h2 style={{ fontSize: '24px', fontWeight: 600 }}>Performance & Attendance Analytics</h2>
          <p style={{ fontSize: '14px', color: 'var(--text-muted)' }}>
            Section-wide analytics, assessment distributions, topic retention, and intervention tracking.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            style={{ padding: '8px 14px', borderRadius: 'var(--radius-sm)', fontSize: '13px' }}
          >
            <option value="CSE335">CSE335 — Database Management Systems</option>
            <option value="CSE353">CSE353 — DBMS Lab Practical</option>
          </select>
        </div>
      </div>

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
        <div className="card-base" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Mean Attendance</span>
            <span className="badge badge-success">Target: 75%</span>
          </div>
          <div style={{ fontSize: '28px', fontWeight: 700, color: classAvgAttendance >= 75 ? '#4caf7a' : '#d6a84f' }}>
            {classAvgAttendance}%
          </div>
          <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>
            {safeAttendance.length} of {students.length} students clear 75% criterion
          </div>
        </div>

        <div className="card-base" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Class Marks Average</span>
            <span className="badge badge-accent">Theory + Practical</span>
          </div>
          <div style={{ fontSize: '28px', fontWeight: 700, color: 'var(--accent-primary)' }}>
            {classAvgMarks}%
          </div>
          <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>
            Across CIA-1, Quizzes, & Assignments
          </div>
        </div>

        <div className="card-base" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Distinction Ratio</span>
            <Award size={16} style={{ color: '#4caf7a' }} />
          </div>
          <div style={{ fontSize: '28px', fontWeight: 700, color: '#4caf7a' }}>
            {Math.round((distinctions.length / students.length) * 100)}%
          </div>
          <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>
            {distinctions.length} students scoring 80%+
          </div>
        </div>

        <div className="card-base" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '13px', color: '#d96c6c' }}>At-Risk Flagged</span>
            <AlertTriangle size={16} style={{ color: '#d96c6c' }} />
          </div>
          <div style={{ fontSize: '28px', fontWeight: 700, color: '#d96c6c' }}>
            {atRiskStudents.length}
          </div>
          <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>
            Require academic counseling or makeup labs
          </div>
        </div>
      </div>

      {/* Analytics Visual Charts Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(440px, 1fr))', gap: '20px' }}>
        {/* Attendance Distribution */}
        <div className="card-base" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '6px' }}>
            Attendance Compliance Segmentation
          </h3>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '20px' }}>
            Distribution relative to institutional 75% criterion buffer
          </p>

          <div style={{ display: 'flex', height: '16px', borderRadius: '8px', overflow: 'hidden', marginBottom: '20px' }}>
            <div style={{ width: `${safePct}%`, backgroundColor: '#4caf7a' }} title={`Safe: ${safePct}%`} />
            <div style={{ width: `${watchPct}%`, backgroundColor: '#d6a84f' }} title={`Watch: ${watchPct}%`} />
            <div style={{ width: `${criticalPct}%`, backgroundColor: '#d96c6c' }} title={`Critical: ${criticalPct}%`} />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '13px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#4caf7a' }} />
                <span>Safe (≥ 75% Criterion)</span>
              </div>
              <span style={{ fontWeight: 600 }}>{safeAttendance.length} students ({safePct}%)</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '13px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#d6a84f' }} />
                <span>Watchlist (65% – 74%)</span>
              </div>
              <span style={{ fontWeight: 600 }}>{watchAttendance.length} students ({watchPct}%)</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '13px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#d96c6c' }} />
                <span>Critical Risk (&lt; 65%)</span>
              </div>
              <span style={{ fontWeight: 600, color: '#d96c6c' }}>{criticalAttendance.length} students ({criticalPct}%)</span>
            </div>
          </div>
        </div>

        {/* Assessment Marks Distribution */}
        <div className="card-base" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '6px' }}>
            Academic Performance Bands
          </h3>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '20px' }}>
            Cumulative test scores across CIA, quizzes, and continuous evaluation
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {[
              { label: 'Distinction (≥ 80%)', count: distinctions.length, color: '#4caf7a' },
              { label: 'First Class (65% – 79%)', count: firstClass.length, color: '#7298d6' },
              { label: 'Second Class (50% – 64%)', count: passClass.length, color: '#d6a84f' },
              { label: 'Remedial Required (&lt; 50%)', count: atRiskStudents.length, color: '#d96c6c' },
            ].map((band, i) => {
              const pct = Math.round((band.count / students.length) * 100);
              return (
                <div key={i}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px' }}>
                    <span>{band.label}</span>
                    <span style={{ fontWeight: 600 }}>{band.count} students ({pct}%)</span>
                  </div>
                  <div style={{ height: '8px', backgroundColor: 'var(--surface-secondary)', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ width: `${pct}%`, height: '100%', backgroundColor: band.color, borderRadius: '4px' }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* At-Risk Students Actionable Table */}
      <div className="card-base" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <div>
            <h3 style={{ fontSize: '16px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <AlertTriangle size={16} style={{ color: '#d96c6c' }} />
              Students Requiring Academic Attention
            </h3>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
              Identified through attendance threshold buffers and assessment scores
            </p>
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
            <thead>
              <tr style={{ backgroundColor: 'var(--surface-secondary)', borderBottom: '1px solid var(--border-default)' }}>
                <th style={{ textAlign: 'left', padding: '10px 14px', color: 'var(--text-muted)' }}>Student</th>
                <th style={{ textAlign: 'center', padding: '10px 14px', color: 'var(--text-muted)' }}>Attendance</th>
                <th style={{ textAlign: 'center', padding: '10px 14px', color: 'var(--text-muted)' }}>CIA-1 Score</th>
                <th style={{ textAlign: 'center', padding: '10px 14px', color: 'var(--text-muted)' }}>Lab Progress</th>
                <th style={{ textAlign: 'left', padding: '10px 14px', color: 'var(--text-muted)' }}>Risk Factor</th>
                <th style={{ textAlign: 'center', padding: '10px 14px', color: 'var(--text-muted)' }}>Risk Level</th>
              </tr>
            </thead>
            <tbody>
              {atRiskStudents.map((st) => (
                <tr key={st.id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                  <td style={{ padding: '12px 14px' }}>
                    <div style={{ fontWeight: 600 }}>{st.fullName}</div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{st.studentId}</div>
                  </td>
                  <td style={{ padding: '12px 14px', textAlign: 'center', fontWeight: 600, color: st.attendancePct >= 75 ? '#4caf7a' : '#d96c6c' }}>
                    {st.attendancePct}%
                  </td>
                  <td style={{ padding: '12px 14px', textAlign: 'center', fontWeight: 600, color: st.cia1Score >= 25 ? '#4caf7a' : '#d96c6c' }}>
                    {st.cia1Score}/50
                  </td>
                  <td style={{ padding: '12px 14px', textAlign: 'center' }}>
                    <span style={{ fontSize: '12px' }}>{st.labCompletedCount}/5 Verified</span>
                  </td>
                  <td style={{ padding: '12px 14px', color: 'var(--text-secondary)', fontSize: '12px' }}>
                    {st.riskFactors[0] || 'Borderline performance'}
                  </td>
                  <td style={{ padding: '12px 14px', textAlign: 'center' }}>
                    <span className={`badge ${st.riskLevel === 'critical' ? 'badge-danger' : 'badge-warning'}`}>
                      {st.riskLevel.toUpperCase()}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
