import React from 'react';
import {
  TrendingUp,
  Award,
  Clock,
  CheckCircle2,
  AlertTriangle,
  BookOpen,
  Calendar
} from 'lucide-react';
import { SUBJECTS } from '../../data/mockData';

export const AnalyticsView: React.FC = () => {
  const healthMetrics = [
    { label: 'Attendance Health', value: 82, target: '75% req.', status: 'safe', desc: 'Above institutional minimum' },
    { label: 'Task Completion Rate', value: 87, target: '80% target', status: 'safe', desc: '5 of 7 tasks closed on schedule' },
    { label: 'Study Consistency Index', value: 64, target: '70% target', status: 'warning', desc: 'Weekend focus sessions were missed' },
    { label: 'Deadline Risk Index', value: 35, target: 'Lower is better', status: 'safe', desc: 'Manageable load across next 7 days' },
    { label: 'CIA Readiness (DBMS)', value: 72, target: '85% target', status: 'warning', desc: 'Unit 3 normal forms revision required' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px', maxWidth: '1100px', margin: '0 auto' }}>
      {/* Header */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
          <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Performance Intelligence</span>
          <span style={{ color: 'var(--border-strong)' }}>•</span>
          <span style={{ fontSize: '12px', color: 'var(--accent-primary)', fontWeight: 500 }}>Fall Semester Analytics</span>
        </div>
        <h2 style={{ fontSize: '28px', fontWeight: 600, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
          Academic Health & Analytics
        </h2>
        <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginTop: '4px' }}>
          Quantitative diagnostics of study consistency, deadline buffer, and syllabus velocity.
        </p>
      </div>

      {/* Academic Health Diagnostic Gauges */}
      <div className="card-base" style={{ padding: '24px' }}>
        <h3 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '4px' }}>
          Academic Health Diagnostic
        </h3>
        <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '20px' }}>
          Comprehensive multi-factor assessment of your semester trajectory.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {healthMetrics.map((metric, idx) => (
            <div
              key={idx}
              style={{
                padding: '14px 18px',
                backgroundColor: 'var(--surface-secondary)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-default)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <div>
                  <span style={{ fontSize: '14px', fontWeight: 500, color: 'var(--text-primary)' }}>
                    {metric.label}
                  </span>
                  <span style={{ fontSize: '12px', color: 'var(--text-muted)', marginLeft: '8px' }}>
                    ({metric.desc})
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)' }}>
                    {metric.value}%
                  </span>
                  <span
                    className={`badge ${metric.status === 'safe' ? 'badge-success' : 'badge-warning'}`}
                  >
                    {metric.target}
                  </span>
                </div>
              </div>

              {/* Progress track */}
              <div style={{ height: '6px', backgroundColor: 'var(--surface-primary)', borderRadius: '3px', overflow: 'hidden' }}>
                <div
                  style={{
                    height: '100%',
                    width: `${metric.value}%`,
                    backgroundColor: metric.status === 'safe' ? 'var(--color-success)' : 'var(--color-warning)',
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Subject Velocity Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '16px',
        }}
      >
        {SUBJECTS.map((s) => (
          <div key={s.id} className="card-base" style={{ padding: '18px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--accent-primary)' }}>{s.code}</span>
              <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{s.attendance.percentage}% Attendance</span>
            </div>
            <div style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '12px' }}>
              {s.name}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Syllabus Covered</span>
              <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{s.syllabusCompletion}%</span>
            </div>
            <div style={{ height: '4px', backgroundColor: 'var(--surface-secondary)', borderRadius: '2px', overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${s.syllabusCompletion}%`, backgroundColor: 'var(--accent-light)' }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
