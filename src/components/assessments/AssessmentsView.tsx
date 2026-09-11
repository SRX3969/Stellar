import React, { useState } from 'react';
import {
  GraduationCap,
  Calendar,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Award,
  Filter
} from 'lucide-react';
import { UPCOMING_ASSESSMENTS } from '../../data/mockData';
import { Assessment } from '../../types';

export const AssessmentsView: React.FC = () => {
  const [filterType, setFilterType] = useState<string>('all');

  const filtered = UPCOMING_ASSESSMENTS.filter((a) => {
    if (filterType === 'all') return true;
    return a.type.toLowerCase() === filterType.toLowerCase();
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px', maxWidth: '1100px', margin: '0 auto' }}>
      {/* Header */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
          <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Examinations & Evaluations</span>
          <span style={{ color: 'var(--border-strong)' }}>•</span>
          <span style={{ fontSize: '12px', color: 'var(--accent-primary)', fontWeight: 500 }}>Fall 2026 Assessment Schedule</span>
        </div>
        <h2 style={{ fontSize: '28px', fontWeight: 600, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
          Assessments & Milestones
        </h2>
        <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginTop: '4px' }}>
          Continuous Internal Assessments (CIA), mid-terms, practical labs, and submissions.
        </p>
      </div>

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid var(--border-default)', paddingBottom: '12px' }}>
        {['all', 'CIA', 'Lab', 'Mid-Sem', 'Assignment'].map((type) => (
          <button
            key={type}
            onClick={() => setFilterType(type)}
            style={{
              padding: '6px 14px',
              borderRadius: 'var(--radius-md)',
              fontSize: '13px',
              fontWeight: filterType === type ? 600 : 400,
              backgroundColor: filterType === type ? 'var(--surface-elevated)' : 'transparent',
              color: filterType === type ? 'var(--text-primary)' : 'var(--text-secondary)',
              border: '1px solid',
              borderColor: filterType === type ? 'var(--border-strong)' : 'transparent',
              textTransform: 'capitalize',
            }}
          >
            {type === 'all' ? 'All Assessments' : type}
          </button>
        ))}
      </div>

      {/* Assessment Cards Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '18px',
        }}
      >
        {filtered.length === 0 ? (
          <div
            className="card-base"
            style={{
              padding: '48px 24px',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '12px',
              gridColumn: '1 / -1',
            }}
          >
            <div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                backgroundColor: 'var(--surface-secondary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--text-muted)',
              }}
            >
              <GraduationCap size={24} />
            </div>
            <div>
              <h4 style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-primary)', margin: '0 0 4px 0' }}>
                No assessments scheduled
              </h4>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: 0, maxWidth: '420px' }}>
                You have no upcoming CIAs, practical evaluations, or exams scheduled. Set prior alerts in Smart Reminders to track testing milestones.
              </p>
            </div>
          </div>
        ) : (
          filtered.map((item) => {
          const isImminent = item.daysRemaining <= 4;

          return (
            <div
              key={item.id}
              className="card-base"
              style={{
                padding: '20px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                borderLeft: isImminent ? '3px solid var(--color-warning)' : '1px solid var(--border-default)',
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <span
                    style={{
                      fontSize: '11px',
                      fontWeight: 700,
                      padding: '2px 8px',
                      borderRadius: '4px',
                      backgroundColor: 'var(--surface-secondary)',
                      color: 'var(--accent-primary)',
                      border: '1px solid var(--border-subtle)',
                    }}
                  >
                    {item.subjectCode}
                  </span>

                  <span
                    style={{
                      fontSize: '11px',
                      fontWeight: 600,
                      padding: '2px 8px',
                      borderRadius: '4px',
                      backgroundColor: isImminent ? 'var(--color-warning-bg)' : 'var(--surface-secondary)',
                      color: isImminent ? 'var(--color-warning)' : 'var(--text-muted)',
                      border: `1px solid ${isImminent ? 'var(--color-warning-border)' : 'var(--border-subtle)'}`,
                    }}
                  >
                    {item.daysRemaining} days left
                  </span>
                </div>

                <h3 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '4px' }}>
                  {item.title}
                </h3>
                <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '16px' }}>
                  {item.subjectName} • {item.type}
                </p>

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '10px 12px',
                    backgroundColor: 'var(--surface-secondary)',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-subtle)',
                    fontSize: '12px',
                    marginBottom: '16px',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-secondary)' }}>
                    <Calendar size={14} />
                    <span>{item.date}, 2026</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-secondary)' }}>
                    <Award size={14} />
                    <span>Max Marks: {item.maxMarks}</span>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '10px', borderTop: '1px solid var(--border-subtle)' }}>
                <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Status: {item.status}</span>
                <button
                  className="btn btn-secondary"
                  style={{ padding: '4px 10px', fontSize: '12px' }}
                >
                  Study Plan
                </button>
              </div>
            </div>
          );
        })
      )}
      </div>
    </div>
  );
};
