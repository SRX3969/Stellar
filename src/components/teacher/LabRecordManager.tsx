// Teacher — Lab Record Manager
// Experiment creation, student practical submission tracking, evaluation, and verification

import React, { useState } from 'react';
import {
  FlaskConical,
  Plus,
  Calendar,
  CheckCircle2,
  Clock,
  AlertTriangle,
  FileCheck,
  Check,
  Search,
  Filter,
  Users,
  Award,
  X,
} from 'lucide-react';
import { useToast } from '../common/Toast';
import {
  INSTITUTIONAL_STUDENTS,
  INITIAL_LAB_EXPERIMENTS,
  InstitutionalStudent,
  InstitutionalLabExperiment,
} from '../../data/institutionalData';

export const LabRecordManager: React.FC = () => {
  const { showToast } = useToast();

  const [experiments, setExperiments] = useState<InstitutionalLabExperiment[]>(() => {
    try {
      const saved = localStorage.getItem('stellar_teacher_labs');
      if (saved) return JSON.parse(saved);
    } catch {}
    return INITIAL_LAB_EXPERIMENTS;
  });

  const [students] = useState<InstitutionalStudent[]>(() => {
    try {
      const saved = localStorage.getItem('stellar_institutional_students');
      if (saved) return JSON.parse(saved);
    } catch {}
    return INSTITUTIONAL_STUDENTS;
  });

  const [selectedExpId, setSelectedExpId] = useState<string>(experiments[0]?.id || '');
  const [isAddExpModalOpen, setIsAddExpModalOpen] = useState(false);
  const [activeVerifyStudent, setActiveVerifyStudent] = useState<{ expId: string; studentId: string } | null>(null);

  const [verifyMarks, setVerifyMarks] = useState('10');
  const [verifyRemarks, setVerifyRemarks] = useState('Verified code and execution output.');

  // Form for new experiment
  const [form, setForm] = useState({
    title: '',
    expNumber: String(experiments.length + 1),
    subjectCode: 'CSE353',
    maxMarks: '10',
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  });

  const activeExp = experiments.find((e) => e.id === selectedExpId) || experiments[0];

  // Overall Lab Stats
  const totalExperiments = experiments.length;
  let totalSubmissionsCount = 0;
  let verifiedSubmissionsCount = 0;
  let pendingSubmissionsCount = 0;

  experiments.forEach((exp) => {
    Object.values(exp.submissions).forEach((sub) => {
      totalSubmissionsCount++;
      if (sub.status === 'verified') verifiedSubmissionsCount++;
      else if (sub.status === 'submitted' || sub.status === 'pending') pendingSubmissionsCount++;
    });
  });

  const overallVerificationRate = totalSubmissionsCount > 0
    ? Math.round((verifiedSubmissionsCount / totalSubmissionsCount) * 100)
    : 0;

  const handleVerifyStudent = (expId: string, studentId: string) => {
    const numMarks = parseFloat(verifyMarks) || 10;
    const updated = experiments.map((exp) => {
      if (exp.id === expId) {
        return {
          ...exp,
          submissions: {
            ...exp.submissions,
            [studentId]: {
              status: 'verified' as const,
              marks: numMarks,
              verifiedAt: new Date().toISOString(),
              remarks: verifyRemarks,
            },
          },
        };
      }
      return exp;
    });

    setExperiments(updated);
    localStorage.setItem('stellar_teacher_labs', JSON.stringify(updated));

    const st = students.find((s) => s.id === studentId);
    showToast('Record Verified', `${st?.fullName || 'Student'} lab evaluated with ${numMarks}/10 marks.`, 'success');
    setActiveVerifyStudent(null);
  };

  const handleBatchVerifySubmitted = (expId: string) => {
    const updated = experiments.map((exp) => {
      if (exp.id === expId) {
        const newSubs = { ...exp.submissions };
        let count = 0;
        students.forEach((s) => {
          if (newSubs[s.id]?.status === 'submitted') {
            newSubs[s.id] = {
              status: 'verified',
              marks: exp.maxMarks,
              verifiedAt: new Date().toISOString(),
              remarks: 'Batch verified by faculty',
            };
            count++;
          }
        });
        showToast('Batch Verified', `Verified ${count} pending submissions.`, 'success');
        return { ...exp, submissions: newSubs };
      }
      return exp;
    });

    setExperiments(updated);
    localStorage.setItem('stellar_teacher_labs', JSON.stringify(updated));
  };

  const handleAddExperiment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) return;

    const initialSubs: Record<string, { status: 'pending' }> = {};
    students.forEach((s) => {
      initialSubs[s.id] = { status: 'pending' };
    });

    const newExp: InstitutionalLabExperiment = {
      id: `lab-exp-${Date.now()}`,
      expNumber: parseInt(form.expNumber) || experiments.length + 1,
      title: form.title.trim(),
      subjectCode: form.subjectCode,
      subjectName: 'Database Management Systems Lab',
      section: 'AI-A (B1)',
      maxMarks: parseFloat(form.maxMarks) || 10,
      dueDate: form.dueDate,
      submissions: initialSubs,
    };

    const updated = [...experiments, newExp];
    setExperiments(updated);
    localStorage.setItem('stellar_teacher_labs', JSON.stringify(updated));

    showToast('Experiment Added', `Exp ${newExp.expNumber}: ${newExp.title} created.`, 'success');
    setIsAddExpModalOpen(false);
    setSelectedExpId(newExp.id);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '1100px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Faculty Operations</span>
            <span style={{ color: 'var(--border-strong)' }}>•</span>
            <span style={{ fontSize: '12px', color: 'var(--accent-primary)', fontWeight: 500 }}>
              Lab Record Management
            </span>
          </div>
          <h2 style={{ fontSize: '24px', fontWeight: 600 }}>Lab Practical Experiments</h2>
          <p style={{ fontSize: '14px', color: 'var(--text-muted)' }}>
            Track experiment submissions, evaluate program outputs, and record continuous laboratory assessment.
          </p>
        </div>

        <button
          onClick={() => setIsAddExpModalOpen(true)}
          className="btn btn-accent-solid"
          style={{ gap: '6px' }}
        >
          <Plus size={15} /> Add Experiment
        </button>
      </div>

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
        <div className="card-base" style={{ padding: '20px' }}>
          <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '4px' }}>Total Experiments</div>
          <div style={{ fontSize: '26px', fontWeight: 700 }}>{totalExperiments}</div>
          <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>CSE353 — DBMS Practical</div>
        </div>

        <div className="card-base" style={{ padding: '20px' }}>
          <div style={{ fontSize: '13px', color: '#4caf7a', marginBottom: '4px' }}>Verified Submissions</div>
          <div style={{ fontSize: '26px', fontWeight: 700, color: '#4caf7a' }}>
            {verifiedSubmissionsCount} <span style={{ fontSize: '14px', color: 'var(--text-muted)', fontWeight: 400 }}>({overallVerificationRate}%)</span>
          </div>
          <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>Evaluated & Signed</div>
        </div>

        <div className="card-base" style={{ padding: '20px' }}>
          <div style={{ fontSize: '13px', color: '#d6a84f', marginBottom: '4px' }}>Pending Evaluation</div>
          <div style={{ fontSize: '26px', fontWeight: 700, color: '#d6a84f' }}>
            {pendingSubmissionsCount}
          </div>
          <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>Awaiting Viva / Sign-off</div>
        </div>
      </div>

      {/* Main Experiment Selector & Roster Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: '20px' }}>
        {/* Left Column: Experiments List */}
        <div className="card-base" style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <h3 style={{ fontSize: '15px', fontWeight: 600, padding: '8px', borderBottom: '1px solid var(--border-subtle)' }}>
            Course Experiments
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', overflowY: 'auto' }}>
            {experiments.map((exp) => {
              const isSelected = exp.id === activeExp?.id;
              const expVerified = Object.values(exp.submissions).filter((s) => s.status === 'verified').length;
              return (
                <div
                  key={exp.id}
                  onClick={() => setSelectedExpId(exp.id)}
                  style={{
                    padding: '12px',
                    borderRadius: 'var(--radius-md)',
                    cursor: 'pointer',
                    backgroundColor: isSelected ? 'var(--surface-elevated)' : 'transparent',
                    border: `1px solid ${isSelected ? 'var(--accent-primary)' : 'var(--border-subtle)'}`,
                    transition: 'all 0.15s ease',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <span className="badge badge-accent">Exp {exp.expNumber}</span>
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Due: {exp.dueDate}</span>
                  </div>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', lineHeight: 1.3 }}>
                    {exp.title}
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '6px', display: 'flex', justifyContent: 'space-between' }}>
                    <span>Verified: {expVerified}/{students.length}</span>
                    <span style={{ color: expVerified === students.length ? '#4caf7a' : 'var(--text-muted)' }}>
                      {Math.round((expVerified / students.length) * 100)}%
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Selected Experiment Student Roster */}
        {activeExp && (
          <div className="card-base" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
              <div>
                <span className="badge badge-neutral" style={{ marginBottom: '4px' }}>
                  {activeExp.subjectCode} • {activeExp.section}
                </span>
                <h3 style={{ fontSize: '18px', fontWeight: 600 }}>
                  Exp {activeExp.expNumber}: {activeExp.title}
                </h3>
                <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                  Maximum Marks: {activeExp.maxMarks} pts • Deadline: {activeExp.dueDate}
                </p>
              </div>

              <button
                type="button"
                onClick={() => handleBatchVerifySubmitted(activeExp.id)}
                className="btn btn-secondary"
                style={{ fontSize: '13px', gap: '6px' }}
              >
                <FileCheck size={14} style={{ color: '#4caf7a' }} /> Batch Verify Submitted
              </button>
            </div>

            {/* Students Table */}
            <div style={{ overflowX: 'auto', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-md)' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                <thead>
                  <tr style={{ backgroundColor: 'var(--surface-secondary)', borderBottom: '1px solid var(--border-default)' }}>
                    <th style={{ textAlign: 'left', padding: '10px 14px', color: 'var(--text-muted)' }}>Student</th>
                    <th style={{ textAlign: 'left', padding: '10px 14px', color: 'var(--text-muted)' }}>Student ID</th>
                    <th style={{ textAlign: 'center', padding: '10px 14px', color: 'var(--text-muted)' }}>Status</th>
                    <th style={{ textAlign: 'center', padding: '10px 14px', color: 'var(--text-muted)' }}>Marks (/ {activeExp.maxMarks})</th>
                    <th style={{ textAlign: 'right', padding: '10px 14px', color: 'var(--text-muted)' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((student) => {
                    const sub = activeExp.submissions[student.id] || { status: 'pending' };
                    const isVerified = sub.status === 'verified';
                    const isSubmitted = sub.status === 'submitted';

                    return (
                      <tr key={student.id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                        <td style={{ padding: '12px 14px' }}>
                          <div style={{ fontWeight: 600 }}>{student.fullName}</div>
                          <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{student.email}</div>
                        </td>
                        <td style={{ padding: '12px 14px', fontFamily: 'monospace', color: 'var(--text-secondary)' }}>
                          {student.studentId}
                        </td>
                        <td style={{ padding: '12px 14px', textAlign: 'center' }}>
                          <span className={`badge ${
                            isVerified
                              ? 'badge-success'
                              : isSubmitted
                              ? 'badge-info'
                              : sub.status === 'incomplete'
                              ? 'badge-warning'
                              : 'badge-neutral'
                          }`}>
                            {sub.status.toUpperCase()}
                          </span>
                        </td>
                        <td style={{ padding: '12px 14px', textAlign: 'center', fontWeight: 600 }}>
                          {sub.marks !== undefined ? `${sub.marks} pts` : '—'}
                        </td>
                        <td style={{ padding: '12px 14px', textAlign: 'right' }}>
                          {isVerified ? (
                            <span style={{ fontSize: '12px', color: '#4caf7a', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                              <Check size={14} /> Signed
                            </span>
                          ) : (
                            <button
                              onClick={() => {
                                setActiveVerifyStudent({ expId: activeExp.id, studentId: student.id });
                                setVerifyMarks(String(activeExp.maxMarks));
                              }}
                              className="btn btn-accent-solid"
                              style={{ fontSize: '12px', padding: '5px 12px', gap: '4px' }}
                            >
                              Verify & Sign
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* VERIFY DIALOG MODAL */}
      {activeVerifyStudent && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 999,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: '20px', backgroundColor: 'rgba(9, 9, 11, 0.8)', backdropFilter: 'blur(4px)',
        }}>
          <div className="card-base" style={{ width: '100%', maxWidth: '440px', padding: '24px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '6px' }}>Evaluate Lab Practical Record</h3>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '16px' }}>
              Student: {students.find((s) => s.id === activeVerifyStudent.studentId)?.fullName}
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '4px' }}>
                  Awarded Marks (Out of {activeExp?.maxMarks || 10})
                </label>
                <input
                  type="number"
                  max={activeExp?.maxMarks || 10}
                  min="0"
                  step="0.5"
                  value={verifyMarks}
                  onChange={(e) => setVerifyMarks(e.target.value)}
                  style={{ width: '100%' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '4px' }}>
                  Faculty Evaluation Remarks
                </label>
                <textarea
                  rows={3}
                  value={verifyRemarks}
                  onChange={(e) => setVerifyRemarks(e.target.value)}
                  style={{ width: '100%', resize: 'none' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                <button type="button" onClick={() => setActiveVerifyStudent(null)} className="btn btn-secondary">
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => handleVerifyStudent(activeVerifyStudent.expId, activeVerifyStudent.studentId)}
                  className="btn btn-accent-solid"
                >
                  Verify & Sign Off
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ADD EXPERIMENT MODAL */}
      {isAddExpModalOpen && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 999,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: '20px', backgroundColor: 'rgba(9, 9, 11, 0.8)', backdropFilter: 'blur(4px)',
        }}>
          <div className="card-base" style={{ width: '100%', maxWidth: '500px', padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 600 }}>Add Practical Experiment</h3>
              <button onClick={() => setIsAddExpModalOpen(false)} className="btn btn-ghost"><X size={18} /></button>
            </div>

            <form onSubmit={handleAddExperiment} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '4px' }}>Experiment #</label>
                <input required type="number" value={form.expNumber} onChange={e => setForm(p => ({ ...p, expNumber: e.target.value }))} style={{ width: '100%' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '4px' }}>Experiment Title *</label>
                <input required value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} placeholder="e.g. B-Tree vs Hash Index Benchmarks" style={{ width: '100%' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '4px' }}>Max Marks</label>
                <input required type="number" value={form.maxMarks} onChange={e => setForm(p => ({ ...p, maxMarks: e.target.value }))} style={{ width: '100%' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '4px' }}>Due Date</label>
                <input type="date" value={form.dueDate} onChange={e => setForm(p => ({ ...p, dueDate: e.target.value }))} style={{ width: '100%' }} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                <button type="button" onClick={() => setIsAddExpModalOpen(false)} className="btn btn-secondary">Cancel</button>
                <button type="submit" className="btn btn-accent-solid">Add Experiment</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
