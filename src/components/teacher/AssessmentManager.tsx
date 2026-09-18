// Teacher — Assessment & Marks Manager
// Create CIA/quizzes/assignments/practicals, enter & publish student marks, compute grade distribution

import React, { useState } from 'react';
import {
  ClipboardCheck,
  Plus,
  Calendar,
  CheckCircle2,
  Clock,
  Eye,
  Edit3,
  Award,
  Save,
  Search,
  Sparkles,
  BarChart2,
  X,
} from 'lucide-react';
import { useToast } from '../common/Toast';
import {
  INSTITUTIONAL_STUDENTS,
  INITIAL_ASSESSMENTS,
  InstitutionalStudent,
  InstitutionalAssessment,
} from '../../data/institutionalData';

export const AssessmentManager: React.FC = () => {
  const { showToast } = useToast();

  const [assessments, setAssessments] = useState<InstitutionalAssessment[]>(() => {
    try {
      const saved = localStorage.getItem('stellar_teacher_assessments');
      if (saved) return JSON.parse(saved);
    } catch {}
    return INITIAL_ASSESSMENTS;
  });

  const [students] = useState<InstitutionalStudent[]>(() => {
    try {
      const saved = localStorage.getItem('stellar_institutional_students');
      if (saved) return JSON.parse(saved);
    } catch {}
    return INSTITUTIONAL_STUDENTS;
  });

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [activeGradebookAssessment, setActiveGradebookAssessment] = useState<InstitutionalAssessment | null>(null);

  // New Assessment Form state
  const [form, setForm] = useState({
    title: '',
    type: 'cia' as InstitutionalAssessment['type'],
    subjectCode: 'CSE335',
    section: 'AI-A (B1)',
    maxMarks: '50',
    weightage: '25%',
    date: new Date().toISOString().split('T')[0],
    topic: '',
  });

  // Gradebook Marks Entry buffer
  const [gradebookMarks, setGradebookMarks] = useState<Record<string, { marks: number; grade: string; remarks?: string }>>({});

  const calculateGrade = (score: number, max: number): string => {
    const pct = (score / max) * 100;
    if (pct >= 90) return 'O';
    if (pct >= 80) return 'A+';
    if (pct >= 70) return 'A';
    if (pct >= 60) return 'B+';
    if (pct >= 50) return 'B';
    if (pct >= 40) return 'C';
    return 'F';
  };

  const handleOpenGradebook = (asmt: InstitutionalAssessment) => {
    setActiveGradebookAssessment(asmt);
    const existing = { ...asmt.marks };
    students.forEach((s) => {
      if (!existing[s.id]) {
        existing[s.id] = { marks: 0, grade: 'F', remarks: '' };
      }
    });
    setGradebookMarks(existing);
  };

  const handleUpdateStudentMark = (studentId: string, markValue: string, maxMarks: number) => {
    const num = Math.max(0, Math.min(maxMarks, parseFloat(markValue) || 0));
    setGradebookMarks((prev) => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        marks: num,
        grade: calculateGrade(num, maxMarks),
      },
    }));
  };

  const handleUpdateStudentRemark = (studentId: string, remarks: string) => {
    setGradebookMarks((prev) => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        remarks,
      },
    }));
  };

  const handleAutofillMarks = (maxMarks: number) => {
    const autofilled: Record<string, { marks: number; grade: string; remarks?: string }> = {};
    students.forEach((s) => {
      // Realistic simulation based on student performance
      const ratio = s.marksAverage / 100;
      const score = Math.round(maxMarks * ratio);
      autofilled[s.id] = {
        marks: score,
        grade: calculateGrade(score, maxMarks),
        remarks: score >= maxMarks * 0.8 ? 'Good mastery of topics' : score >= maxMarks * 0.5 ? 'Satisfactory' : 'Needs tutoring',
      };
    });
    setGradebookMarks(autofilled);
    showToast('Marks Autofilled', 'Populated gradebook with section performance profile.', 'info');
  };

  const handleSaveGradebook = (publish: boolean = false) => {
    if (!activeGradebookAssessment) return;

    const scores = Object.values(gradebookMarks).map((m) => m.marks);
    const avg = scores.length > 0 ? Math.round((scores.reduce((a, b) => a + b, 0) / scores.length) * 10) / 10 : undefined;

    const updated = assessments.map((a) => {
      if (a.id === activeGradebookAssessment.id) {
        return {
          ...a,
          marks: gradebookMarks,
          averageScore: avg,
          isPublished: publish ? true : a.isPublished,
        };
      }
      return a;
    });

    setAssessments(updated);
    localStorage.setItem('stellar_teacher_assessments', JSON.stringify(updated));

    showToast(
      publish ? 'Marks Published' : 'Gradebook Saved',
      `Assessment marks saved. Class Average: ${avg}/${activeGradebookAssessment.maxMarks}.`,
      'success'
    );
    setActiveGradebookAssessment(null);
  };

  const handleCreateAssessment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) {
      showToast('Title Required', 'Please provide an assessment title.', 'error');
      return;
    }

    const newAsmt: InstitutionalAssessment = {
      id: `asmt-${Date.now()}`,
      title: form.title.trim(),
      type: form.type,
      subjectCode: form.subjectCode,
      subjectName: form.subjectCode === 'CSE335' ? 'Database Management Systems' : 'Database Management Systems Lab',
      section: form.section,
      maxMarks: parseFloat(form.maxMarks) || 50,
      weightage: form.weightage || '20%',
      date: form.date,
      topic: form.topic || 'General Syllabus Evaluation',
      isPublished: false,
      marks: {},
    };

    const updated = [newAsmt, ...assessments];
    setAssessments(updated);
    localStorage.setItem('stellar_teacher_assessments', JSON.stringify(updated));

    showToast('Assessment Created', `${newAsmt.title} added to curriculum.`, 'success');
    setIsCreateModalOpen(false);
    setForm({
      title: '',
      type: 'cia',
      subjectCode: 'CSE335',
      section: 'AI-A (B1)',
      maxMarks: '50',
      weightage: '25%',
      date: new Date().toISOString().split('T')[0],
      topic: '',
    });
  };

  const handleTogglePublish = (asmtId: string) => {
    const updated = assessments.map((a) => {
      if (a.id === asmtId) {
        const next = !a.isPublished;
        showToast(
          next ? 'Results Published' : 'Reverted to Draft',
          `${a.title} is now ${next ? 'visible to students' : 'hidden from student portal'}.`,
          next ? 'success' : 'info'
        );
        return { ...a, isPublished: next };
      }
      return a;
    });
    setAssessments(updated);
    localStorage.setItem('stellar_teacher_assessments', JSON.stringify(updated));
  };

  // Metrics
  const totalAssessments = assessments.length;
  const publishedCount = assessments.filter((a) => a.isPublished).length;
  const scoredAssessments = assessments.filter((a) => a.averageScore !== undefined);
  const classOverallAverage = scoredAssessments.length > 0
    ? Math.round((scoredAssessments.reduce((acc, curr) => acc + (curr.averageScore! / curr.maxMarks) * 100, 0) / scoredAssessments.length))
    : 0;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '1100px', margin: '0 auto' }}>
      {/* Page Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Faculty Operations</span>
            <span style={{ color: 'var(--border-strong)' }}>•</span>
            <span style={{ fontSize: '12px', color: 'var(--accent-primary)', fontWeight: 500 }}>
              Assessment & Marks Manager
            </span>
          </div>
          <h2 style={{ fontSize: '24px', fontWeight: 600 }}>Assessments & Marks Entry</h2>
          <p style={{ fontSize: '14px', color: 'var(--text-muted)' }}>
            Schedule CIAs, quizzes, assignments, enter student gradebooks, and publish results.
          </p>
        </div>

        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="btn btn-accent-solid"
          style={{ gap: '6px' }}
        >
          <Plus size={15} /> Create Assessment
        </button>
      </div>

      {/* KPI Stats Bar */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '16px',
      }}>
        <div className="card-base" style={{ padding: '20px' }}>
          <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '6px' }}>Total Assessments</div>
          <div style={{ fontSize: '26px', fontWeight: 700 }}>{totalAssessments}</div>
          <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>Across Course Modules</div>
        </div>

        <div className="card-base" style={{ padding: '20px' }}>
          <div style={{ fontSize: '13px', color: '#4caf7a', marginBottom: '6px' }}>Published to Students</div>
          <div style={{ fontSize: '26px', fontWeight: 700, color: '#4caf7a' }}>
            {publishedCount} <span style={{ fontSize: '14px', color: 'var(--text-muted)', fontWeight: 400 }}>/ {totalAssessments}</span>
          </div>
          <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>Live in Student Portals</div>
        </div>

        <div className="card-base" style={{ padding: '20px' }}>
          <div style={{ fontSize: '13px', color: 'var(--accent-primary)', marginBottom: '6px' }}>Section Class Average</div>
          <div style={{ fontSize: '26px', fontWeight: 700, color: 'var(--accent-primary)' }}>
            {classOverallAverage}%
          </div>
          <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>Across Evaluated Papers</div>
        </div>
      </div>

      {/* Assessments List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {assessments.map((asmt) => {
          const gradedStudentCount = Object.keys(asmt.marks).length;
          const isGraded = gradedStudentCount > 0;

          return (
            <div
              key={asmt.id}
              className="card-base"
              style={{
                padding: '20px 24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '16px',
                borderLeft: `4px solid ${asmt.isPublished ? 'var(--accent-primary)' : 'var(--border-default)'}`,
              }}
            >
              <div style={{ flex: 1, minWidth: '300px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                  <span className="badge badge-accent">{asmt.type.toUpperCase()}</span>
                  <span className="badge badge-neutral">{asmt.subjectCode}</span>
                  <span className="badge badge-neutral">{asmt.section}</span>
                  <span className={`badge ${asmt.isPublished ? 'badge-success' : 'badge-warning'}`}>
                    {asmt.isPublished ? 'Published' : 'Draft'}
                  </span>
                  <span style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Calendar size={12} /> {asmt.date}
                  </span>
                </div>

                <h3 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '4px' }}>
                  {asmt.title}
                </h3>
                <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                  Topic: {asmt.topic}
                </p>
              </div>

              {/* Assessment Metrics */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Max Marks</div>
                  <div style={{ fontSize: '16px', fontWeight: 600 }}>{asmt.maxMarks} pts</div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Class Average</div>
                  <div style={{ fontSize: '16px', fontWeight: 700, color: asmt.averageScore ? '#4caf7a' : 'var(--text-muted)' }}>
                    {asmt.averageScore ? `${asmt.averageScore} / ${asmt.maxMarks}` : 'Ungraded'}
                  </div>
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    onClick={() => handleOpenGradebook(asmt)}
                    className="btn btn-accent-solid"
                    style={{ fontSize: '13px', padding: '8px 16px', gap: '6px' }}
                  >
                    <Edit3 size={14} /> Enter Marks
                  </button>

                  <button
                    onClick={() => handleTogglePublish(asmt.id)}
                    className="btn btn-secondary"
                    style={{ fontSize: '13px', padding: '8px 14px' }}
                    title={asmt.isPublished ? 'Unpublish' : 'Publish'}
                  >
                    <Eye size={14} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* CREATE ASSESSMENT MODAL */}
      {isCreateModalOpen && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 999,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: '20px', backgroundColor: 'rgba(9, 9, 11, 0.8)', backdropFilter: 'blur(4px)',
        }}>
          <div className="card-base" style={{ width: '100%', maxWidth: '560px', padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 600 }}>Create New Assessment</h3>
              <button onClick={() => setIsCreateModalOpen(false)} className="btn btn-ghost" style={{ padding: '4px 8px' }}><X size={18} /></button>
            </div>

            <form onSubmit={handleCreateAssessment} style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '14px' }}>
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '4px' }}>Assessment Title *</label>
                <input required value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} placeholder="e.g. CIA-2: Concurrency & Transaction Management" style={{ width: '100%' }} />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '4px' }}>Type *</label>
                <select value={form.type} onChange={e => setForm(p => ({ ...p, type: e.target.value as any }))} style={{ width: '100%' }}>
                  <option value="cia">CIA Examination</option>
                  <option value="quiz">Quiz / MCQ Test</option>
                  <option value="assignment">Assignment / Report</option>
                  <option value="practical">Lab Practical Evaluation</option>
                  <option value="mid_sem">Mid-Semester Exam</option>
                  <option value="end_sem">End-Semester Exam</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '4px' }}>Subject</label>
                <select value={form.subjectCode} onChange={e => setForm(p => ({ ...p, subjectCode: e.target.value }))} style={{ width: '100%' }}>
                  <option value="CSE335">CSE335 — Database Management Systems</option>
                  <option value="CSE353">CSE353 — DBMS Lab</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '4px' }}>Maximum Marks *</label>
                <input required type="number" step="1" value={form.maxMarks} onChange={e => setForm(p => ({ ...p, maxMarks: e.target.value }))} style={{ width: '100%' }} />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '4px' }}>Assessment Date</label>
                <input type="date" value={form.date} onChange={e => setForm(p => ({ ...p, date: e.target.value }))} style={{ width: '100%' }} />
              </div>

              <div style={{ gridColumn: '1 / -1' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '4px' }}>Topics / Syllabus Covered</label>
                <input value={form.topic} onChange={e => setForm(p => ({ ...p, topic: e.target.value }))} placeholder="e.g. ACID properties, Two-Phase Locking, Deadlock Detection" style={{ width: '100%' }} />
              </div>

              <div style={{ gridColumn: '1 / -1', display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '12px' }}>
                <button type="button" onClick={() => setIsCreateModalOpen(false)} className="btn btn-secondary">Cancel</button>
                <button type="submit" className="btn btn-accent-solid">Create Assessment</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* GRADEBOOK MARKS ENTRY MODAL */}
      {activeGradebookAssessment && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 999,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: '20px', backgroundColor: 'rgba(9, 9, 11, 0.85)', backdropFilter: 'blur(5px)',
        }}>
          <div className="card-base" style={{ width: '100%', maxWidth: '880px', maxHeight: '90vh', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            {/* Modal Header */}
            <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border-default)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span className="badge badge-accent">{activeGradebookAssessment.type.toUpperCase()}</span>
                  <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Max: {activeGradebookAssessment.maxMarks} Marks</span>
                </div>
                <h3 style={{ fontSize: '18px', fontWeight: 600, marginTop: '4px' }}>
                  {activeGradebookAssessment.title} — Gradebook
                </h3>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <button
                  type="button"
                  onClick={() => handleAutofillMarks(activeGradebookAssessment.maxMarks)}
                  className="btn btn-secondary"
                  style={{ fontSize: '12px', padding: '6px 12px', gap: '6px' }}
                >
                  <Sparkles size={13} style={{ color: 'var(--accent-primary)' }} /> Autofill Sample Marks
                </button>
                <button onClick={() => setActiveGradebookAssessment(null)} className="btn btn-ghost" style={{ padding: '4px 8px' }}><X size={18} /></button>
              </div>
            </div>

            {/* Students Marks Sheet */}
            <div style={{ padding: '20px 24px', overflowY: 'auto', flex: 1 }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                <thead>
                  <tr style={{ backgroundColor: 'var(--surface-secondary)', borderBottom: '1px solid var(--border-default)' }}>
                    <th style={{ textAlign: 'left', padding: '10px 14px', color: 'var(--text-muted)' }}>Student</th>
                    <th style={{ textAlign: 'left', padding: '10px 14px', color: 'var(--text-muted)' }}>Student ID</th>
                    <th style={{ textAlign: 'center', padding: '10px 14px', color: 'var(--text-muted)', width: '140px' }}>
                      Marks (/ {activeGradebookAssessment.maxMarks})
                    </th>
                    <th style={{ textAlign: 'center', padding: '10px 14px', color: 'var(--text-muted)', width: '80px' }}>Grade</th>
                    <th style={{ textAlign: 'left', padding: '10px 14px', color: 'var(--text-muted)' }}>Faculty Feedback</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((student) => {
                    const entry = gradebookMarks[student.id] || { marks: 0, grade: 'F', remarks: '' };
                    return (
                      <tr key={student.id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                        <td style={{ padding: '10px 14px', fontWeight: 500 }}>
                          <div>{student.fullName}</div>
                          <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{student.email}</div>
                        </td>
                        <td style={{ padding: '10px 14px', fontFamily: 'monospace', color: 'var(--text-secondary)' }}>
                          {student.studentId}
                        </td>
                        <td style={{ padding: '10px 14px', textAlign: 'center' }}>
                          <input
                            type="number"
                            min="0"
                            max={activeGradebookAssessment.maxMarks}
                            step="0.5"
                            value={entry.marks}
                            onChange={(e) => handleUpdateStudentMark(student.id, e.target.value, activeGradebookAssessment.maxMarks)}
                            style={{
                              width: '80px',
                              textAlign: 'center',
                              padding: '6px 8px',
                              fontWeight: 600,
                              borderRadius: 'var(--radius-sm)',
                              border: '1px solid var(--border-default)',
                            }}
                          />
                        </td>
                        <td style={{ padding: '10px 14px', textAlign: 'center' }}>
                          <span
                            className="badge"
                            style={{
                              backgroundColor:
                                entry.grade === 'O' || entry.grade === 'A+'
                                  ? 'rgba(76, 175, 122, 0.2)'
                                  : entry.grade === 'F'
                                  ? 'rgba(217, 108, 108, 0.2)'
                                  : 'rgba(200, 169, 107, 0.2)',
                              color:
                                entry.grade === 'O' || entry.grade === 'A+'
                                  ? '#4caf7a'
                                  : entry.grade === 'F'
                                  ? '#d96c6c'
                                  : '#c8a96b',
                            }}
                          >
                            {entry.grade}
                          </span>
                        </td>
                        <td style={{ padding: '10px 14px' }}>
                          <input
                            value={entry.remarks || ''}
                            onChange={(e) => handleUpdateStudentRemark(student.id, e.target.value)}
                            placeholder="Optional feedback..."
                            style={{ width: '100%', padding: '6px 10px', fontSize: '12px' }}
                          />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Modal Footer */}
            <div style={{
              padding: '16px 24px',
              borderTop: '1px solid var(--border-default)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              backgroundColor: 'var(--surface-secondary)',
            }}>
              <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                Entered marks for {students.length} students.
              </span>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  type="button"
                  onClick={() => handleSaveGradebook(false)}
                  className="btn btn-secondary"
                >
                  Save as Draft
                </button>
                <button
                  type="button"
                  onClick={() => handleSaveGradebook(true)}
                  className="btn btn-accent-solid"
                  style={{ gap: '6px' }}
                >
                  <Save size={15} /> Save & Publish Marks
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
