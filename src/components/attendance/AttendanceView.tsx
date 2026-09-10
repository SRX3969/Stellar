import React, { useState } from 'react';
import {
  UserCheck,
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
  HelpCircle,
  ArrowRight,
  ShieldCheck,
  ShieldAlert,
  ChevronRight,
  Calculator,
  Plus,
  Minus,
  Check,
  X
} from 'lucide-react';
import { SUBJECTS as DEFAULT_SUBJECTS } from '../../data/mockData';
import { Subject } from '../../types';
import { useToast } from '../common/Toast';

interface AttendanceViewProps {
  subjects?: Subject[];
  onUpdateAttendance?: (subjectId: string, status: 'present' | 'absent') => void;
  criterion?: number;
}

export const AttendanceView: React.FC<AttendanceViewProps> = ({
  subjects = DEFAULT_SUBJECTS,
  onUpdateAttendance,
  criterion = 75,
}) => {
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>('sub-os');
  const [missCount, setMissCount] = useState<number>(1);
  const [scenario, setScenario] = useState<'best' | 'normal' | 'worst'>('normal');
  const { showToast } = useToast();

  // Selected subject for simulator
  const activeSubject = subjects.find((s) => s.id === selectedSubjectId) || subjects[0];

  // Simulator calculations
  const simPresent = activeSubject.attendance.present;
  const simTotal = activeSubject.attendance.total + missCount;
  const projectedPercentage = Math.round((simPresent / simTotal) * 100);

  // Recovery calculation: How many consecutive classes needed to reach criterion?
  const calculateConsecutiveNeeded = (present: number, total: number, crit: number = criterion) => {
    const currentPct = (present / total) * 100;
    if (currentPct >= crit) return 0;
    const reqRatio = crit / 100;
    const needed = Math.ceil((reqRatio * total - present) / (1 - reqRatio));
    return Math.max(0, needed);
  };

  const consecutiveNeeded = calculateConsecutiveNeeded(activeSubject.attendance.present, activeSubject.attendance.total, criterion);

  // Buffer calculation: How many classes can be missed while staying >= criterion?
  const calculateBuffer = (present: number, total: number, crit: number = criterion) => {
    const reqRatio = crit / 100;
    const maxTotalAllowed = Math.floor(present / reqRatio);
    return Math.max(0, maxTotalAllowed - total);
  };

  const handleMark = (subjectId: string, status: 'present' | 'absent', subjectName: string) => {
    if (onUpdateAttendance) {
      onUpdateAttendance(subjectId, status);
      showToast(
        status === 'present' ? 'Marked Present' : 'Marked Absent',
        `${subjectName} record updated. Metrics re-synchronized.`,
        status === 'present' ? 'success' : 'warning'
      );
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'SAFE':
        return <span className="badge badge-success">SAFE</span>;
      case 'WATCH':
        return <span className="badge badge-warning">WATCH</span>;
      case 'RISK':
        return <span className="badge badge-danger">RISK</span>;
      case 'CRITICAL':
        return <span className="badge badge-danger">CRITICAL</span>;
      default:
        return <span className="badge badge-neutral">{status}</span>;
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px', maxWidth: '1200px', margin: '0 auto' }}>
      {/* Page Heading & Overview Header */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
          <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Academic Analytics</span>
          <span style={{ color: 'var(--border-strong)' }}>•</span>
          <span style={{ fontSize: '12px', color: 'var(--accent-primary)', fontWeight: 500 }}>
            Institutional Criterion: {criterion.toFixed(1)}%
          </span>
        </div>
        <h2 style={{ fontSize: '28px', fontWeight: 600, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
          Attendance Management &amp; Analytics
        </h2>
        <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginTop: '4px' }}>
          Real-time tracking, live class logging, predictive miss simulations, and recovery pathways.
        </p>
      </div>

      {/* Main Subjects Attendance Table / Analytics Cards */}
      <div className="card-base" style={{ padding: '0', overflow: 'hidden' }}>
        <div style={{ padding: '18px 22px', borderBottom: '1px solid var(--border-default)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
          <div style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-primary)' }}>
            Enrolled Subjects Record
          </div>
          <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
            Click row to select in simulator, or log today's lecture below
          </span>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
            <thead>
              <tr style={{ backgroundColor: 'var(--surface-secondary)', borderBottom: '1px solid var(--border-default)', color: 'var(--text-muted)', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                <th style={{ padding: '12px 20px' }}>Subject</th>
                <th style={{ padding: '12px 16px' }}>Present / Total</th>
                <th style={{ padding: '12px 16px' }}>Attendance</th>
                <th style={{ padding: '12px 16px' }}>Buffer</th>
                <th style={{ padding: '12px 16px' }}>Criterion</th>
                <th style={{ padding: '12px 16px' }}>Status</th>
                <th style={{ padding: '12px 20px', textAlign: 'right' }}>Log Lecture</th>
              </tr>
            </thead>
            <tbody>
              {subjects.map((s) => {
                const buffer = calculateBuffer(s.attendance.present, s.attendance.total, criterion);
                const isSelected = s.id === selectedSubjectId;

                return (
                  <tr
                    key={s.id}
                    onClick={() => setSelectedSubjectId(s.id)}
                    style={{
                      borderBottom: '1px solid var(--border-subtle)',
                      backgroundColor: isSelected ? 'var(--surface-elevated)' : 'transparent',
                      cursor: 'pointer',
                      transition: 'background-color var(--transition-fast)',
                    }}
                    onMouseEnter={(e) => {
                      if (!isSelected) e.currentTarget.style.backgroundColor = 'var(--surface-secondary)';
                    }}
                    onMouseLeave={(e) => {
                      if (!isSelected) e.currentTarget.style.backgroundColor = 'transparent';
                    }}
                  >
                    <td style={{ padding: '16px 20px' }}>
                      <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{s.code}</div>
                      <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{s.name}</div>
                    </td>
                    <td style={{ padding: '16px 16px', color: 'var(--text-secondary)' }}>
                      {s.attendance.present} / {s.attendance.total}
                    </td>
                    <td style={{ padding: '16px 16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontWeight: 600, color: 'var(--text-primary)', width: '36px' }}>
                          {s.attendance.percentage}%
                        </span>
                        <div
                          style={{
                            width: '80px',
                            height: '5px',
                            backgroundColor: 'var(--surface-secondary)',
                            borderRadius: '3px',
                            overflow: 'hidden',
                          }}
                        >
                          <div
                            style={{
                              width: `${s.attendance.percentage}%`,
                              height: '100%',
                              backgroundColor: s.attendance.percentage >= criterion ? 'var(--color-success)' : 'var(--color-danger)',
                            }}
                          />
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '16px 16px', color: 'var(--text-secondary)' }}>
                      {buffer > 0 ? (
                        <span style={{ color: 'var(--color-success)' }}>+{buffer} classes</span>
                      ) : (
                        <span style={{ color: 'var(--color-danger)' }}>0 (At Risk)</span>
                      )}
                    </td>
                    <td style={{ padding: '16px 16px', color: 'var(--text-muted)' }}>
                      {criterion}%
                    </td>
                    <td style={{ padding: '16px 16px' }}>
                      {getStatusBadge(s.attendance.status)}
                    </td>
                    <td style={{ padding: '16px 20px', textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }} onClick={(e) => e.stopPropagation()}>
                        <button
                          type="button"
                          onClick={() => handleMark(s.id, 'present', s.name)}
                          title="Mark today's class Present (+1)"
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            padding: '4px 8px',
                            borderRadius: 'var(--radius-sm)',
                            backgroundColor: 'var(--color-success-bg)',
                            border: '1px solid var(--color-success-border)',
                            color: 'var(--color-success)',
                            fontSize: '11px',
                            fontWeight: 600,
                            cursor: 'pointer',
                          }}
                        >
                          <Check size={12} />
                          <span>Present</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleMark(s.id, 'absent', s.name)}
                          title="Mark today's class Absent (+0)"
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            padding: '4px 8px',
                            borderRadius: 'var(--radius-sm)',
                            backgroundColor: 'var(--color-danger-bg)',
                            border: '1px solid var(--color-danger-border)',
                            color: 'var(--color-danger)',
                            fontSize: '11px',
                            fontWeight: 600,
                            cursor: 'pointer',
                          }}
                        >
                          <X size={12} />
                          <span>Absent</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Grid: Attendance Simulator (Section 23) + Attendance Recovery (Section 24) + "Should I Attend?" (Section 27) */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
          gap: '24px',
        }}
      >
        {/* Section 23: ATTENDANCE SIMULATOR */}
        <div className="card-base">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <Calculator size={16} style={{ color: 'var(--accent-primary)' }} />
            <h3 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-primary)' }}>
              Attendance Simulator
            </h3>
          </div>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '16px' }}>
            Simulate the mathematical impact on <strong style={{ color: 'var(--text-primary)' }}>{activeSubject.name} ({activeSubject.code})</strong>.
          </p>

          {/* Preset Buttons */}
          <div style={{ display: 'flex', gap: '8px', marginBottom: '18px' }}>
            {[1, 2, 3, 4].map((count) => (
              <button
                key={count}
                onClick={() => setMissCount(count)}
                style={{
                  flex: 1,
                  padding: '8px',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: missCount === count ? 'var(--surface-elevated)' : 'var(--surface-secondary)',
                  border: '1px solid',
                  borderColor: missCount === count ? 'var(--accent-primary)' : 'var(--border-default)',
                  color: missCount === count ? 'var(--text-primary)' : 'var(--text-secondary)',
                  fontSize: '12px',
                  fontWeight: 500,
                }}
              >
                Miss {count} {count === 1 ? 'class' : 'classes'}
              </button>
            ))}
          </div>

          {/* Outcome Card */}
          <div
            style={{
              padding: '16px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--surface-secondary)',
              border: '1px solid var(--border-default)',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Current Attendance</span>
              <span style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-primary)' }}>
                {activeSubject.attendance.percentage}% ({activeSubject.attendance.present}/{activeSubject.attendance.total})
              </span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Projected Attendance (after {missCount} miss)</span>
              <span
                style={{
                  fontSize: '18px',
                  fontWeight: 700,
                  color: projectedPercentage >= 75 ? 'var(--color-success)' : 'var(--color-danger)',
                }}
              >
                {projectedPercentage}% ({simPresent}/{simTotal})
              </span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Institutional Criterion</span>
              <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>75.0% Required</span>
            </div>

            <div style={{ height: '1px', backgroundColor: 'var(--border-subtle)' }} />

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              {projectedPercentage >= 75 ? (
                <>
                  <ShieldCheck size={16} style={{ color: 'var(--color-success)' }} />
                  <span style={{ fontSize: '12px', color: 'var(--color-success)' }}>
                    Safe: Projected attendance remains above the 75% criterion.
                  </span>
                </>
              ) : (
                <>
                  <ShieldAlert size={16} style={{ color: 'var(--color-danger)' }} />
                  <span style={{ fontSize: '12px', color: 'var(--color-danger)' }}>
                    Critical Risk: Drops below criterion. Debarment risk warning triggered!
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Section 24: ATTENDANCE RECOVERY */}
        <div className="card-base">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <TrendingUp size={16} style={{ color: 'var(--color-warning)' }} />
            <h3 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-primary)' }}>
              Attendance Recovery Pathway
            </h3>
          </div>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '16px' }}>
            Minimum attendance recovery plan for deficient subjects.
          </p>

          <div
            style={{
              padding: '16px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: activeSubject.attendance.percentage < 75 ? 'var(--color-danger-bg)' : 'var(--surface-secondary)',
              border: '1px solid',
              borderColor: activeSubject.attendance.percentage < 75 ? 'var(--color-danger-border)' : 'var(--border-default)',
              marginBottom: '16px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
              <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Subject: {activeSubject.code}</span>
              <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)' }}>
                Target: 75%
              </span>
            </div>

            {consecutiveNeeded > 0 ? (
              <div>
                <div style={{ fontSize: '13px', color: 'var(--color-danger)', fontWeight: 500 }}>
                  You need to attend:
                </div>
                <div style={{ fontSize: '24px', fontWeight: 700, color: 'var(--color-danger)', margin: '4px 0' }}>
                  {consecutiveNeeded} consecutive classes
                </div>
                <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                  Without missing any session to restore your status to SAFE (≥75%).
                </p>
              </div>
            ) : (
              <div>
                <div style={{ fontSize: '13px', color: 'var(--color-success)', fontWeight: 500 }}>
                  Attendance Criterion Met
                </div>
                <div style={{ fontSize: '24px', fontWeight: 700, color: 'var(--color-success)', margin: '4px 0' }}>
                  {activeSubject.attendance.percentage}% (Safe)
                </div>
                <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                  You have a buffer of {calculateBuffer(activeSubject.attendance.present, activeSubject.attendance.total)} optional leaves.
                </p>
              </div>
            )}
          </div>

          {/* Section 27: "SHOULD I ATTEND?" */}
          <div
            style={{
              padding: '14px 16px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--surface-secondary)',
              border: '1px solid var(--border-default)',
            }}
          >
            <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '6px' }}>
              Decision Engine: "Can I miss today's {activeSubject.code} class?"
            </div>
            <div style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              {activeSubject.attendance.percentage < 75 ? (
                <span style={{ color: 'var(--color-danger)' }}>
                  🔴 <strong>Do NOT miss.</strong> Your attendance is already at {activeSubject.attendance.percentage}%. Skipping today will drop you to {Math.round((activeSubject.attendance.present / (activeSubject.attendance.total + 1)) * 100)}% and require formal justification to the Dean.
                </span>
              ) : (
                <span>
                  🟢 <strong>Attend if possible.</strong> If you miss today, attendance will dip to {Math.round((activeSubject.attendance.present / (activeSubject.attendance.total + 1)) * 100)}%. It remains above 75%, but depletes your safety buffer for exam week.
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
