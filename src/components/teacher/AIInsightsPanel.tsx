// Teacher — AI Insights Panel
// Transparent, heuristic-based academic risk scoring, topic weakness analysis, and intervention triggers

import React, { useState } from 'react';
import {
  Brain,
  AlertTriangle,
  TrendingDown,
  Lightbulb,
  Sparkles,
  Send,
  Calendar,
  CheckCircle2,
  FileText,
  Clock,
  ChevronRight,
  RefreshCw,
  Sliders,
} from 'lucide-react';
import { useToast } from '../common/Toast';
import {
  INSTITUTIONAL_STUDENTS,
  InstitutionalStudent,
} from '../../data/institutionalData';

export const AIInsightsPanel: React.FC = () => {
  const { showToast } = useToast();

  const [students] = useState<InstitutionalStudent[]>(() => {
    try {
      const saved = localStorage.getItem('stellar_institutional_students');
      if (saved) return JSON.parse(saved);
    } catch {}
    return INSTITUTIONAL_STUDENTS;
  });

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [filterSeverity, setFilterSeverity] = useState<'all' | 'critical' | 'high' | 'medium'>('all');
  const [activeInterventionStudent, setActiveInterventionStudent] = useState<InstitutionalStudent | null>(null);

  // Topic Weaknesses in Curriculum
  const topicWeaknesses = [
    {
      topic: 'Relational Division & Tuple Relational Calculus (TRC)',
      module: 'Module 1: Relational Model',
      averageScorePct: 38,
      failureCount: 5,
      recommendation: 'Conduct 45-min targeted problem-solving session with step-by-step TRC proofs.',
    },
    {
      topic: 'B+ Tree Indexing Node Splitting & Paging',
      module: 'Module 4: Storage & File Structures',
      averageScorePct: 44,
      failureCount: 4,
      recommendation: 'Provide animated visualization tool and sample insertion/deletion trace exercises.',
    },
    {
      topic: 'Two-Phase Locking (2PL) & Deadlock Detection Graphs',
      module: 'Module 5: Concurrency Control',
      averageScorePct: 47,
      failureCount: 4,
      recommendation: 'Review Wait-For graph algorithms and strict vs rigorous 2PL protocols in next lecture.',
    },
  ];

  // At-risk students
  const atRiskStudents = students.filter((s) => s.riskLevel !== 'safe');

  const filteredAtRisk = atRiskStudents.filter((s) => {
    if (filterSeverity === 'all') return true;
    return s.riskLevel === filterSeverity;
  });

  const handleRunAnalysis = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      setIsAnalyzing(false);
      showToast(
        'Analysis Synchronized',
        `Evaluated ${students.length} students. Flagged ${atRiskStudents.length} requiring academic attention.`,
        'success'
      );
    }, 900);
  };

  const handleTriggerIntervention = (student: InstitutionalStudent, intervention: string) => {
    showToast(
      'Intervention Dispatched',
      `${intervention} initiated for ${student.fullName} (${student.studentId}).`,
      'success'
    );
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '1100px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Academic Intelligence</span>
            <span style={{ color: 'var(--border-strong)' }}>•</span>
            <span style={{ fontSize: '12px', color: 'var(--accent-primary)', fontWeight: 500 }}>
              CIA-3 Rule-Based Engine
            </span>
          </div>
          <h2 style={{ fontSize: '24px', fontWeight: 600 }}>AI Academic Intelligence & Early Warnings</h2>
          <p style={{ fontSize: '14px', color: 'var(--text-muted)' }}>
            Transparent heuristic correlation between attendance buffers, CIA marks, and lab records.
          </p>
        </div>

        <button
          onClick={handleRunAnalysis}
          disabled={isAnalyzing}
          className="btn btn-accent-solid"
          style={{ gap: '8px' }}
        >
          <RefreshCw size={15} className={isAnalyzing ? 'animate-spin' : ''} />
          {isAnalyzing ? 'Analyzing Section Data...' : 'Re-Run Risk Analysis'}
        </button>
      </div>

      {/* Overview Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
        <div className="card-base" style={{ padding: '20px', borderLeft: '3px solid #d96c6c' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '13px', color: '#d96c6c' }}>Critical Risk</span>
            <AlertTriangle size={18} style={{ color: '#d96c6c' }} />
          </div>
          <div style={{ fontSize: '28px', fontWeight: 700 }}>
            {students.filter((s) => s.riskLevel === 'critical').length} Students
          </div>
          <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>
            Score ≥ 60: Attendance &lt; 65% or Failed CIA-1
          </div>
        </div>

        <div className="card-base" style={{ padding: '20px', borderLeft: '3px solid #d6a84f' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '13px', color: '#d6a84f' }}>High Risk</span>
            <AlertTriangle size={18} style={{ color: '#d6a84f' }} />
          </div>
          <div style={{ fontSize: '28px', fontWeight: 700 }}>
            {students.filter((s) => s.riskLevel === 'high').length} Students
          </div>
          <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>
            Score 40-59: Attendance &lt; 75% or 2+ Pending Labs
          </div>
        </div>

        <div className="card-base" style={{ padding: '20px', borderLeft: '3px solid #7298d6' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '13px', color: '#7298d6' }}>Moderate Watch</span>
            <Lightbulb size={18} style={{ color: '#7298d6' }} />
          </div>
          <div style={{ fontSize: '28px', fontWeight: 700 }}>
            {students.filter((s) => s.riskLevel === 'medium').length} Students
          </div>
          <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>
            Score 20-39: Borderline 75% Attendance Buffer
          </div>
        </div>

        <div className="card-base" style={{ padding: '20px', borderLeft: '3px solid #4caf7a' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '13px', color: '#4caf7a' }}>Safe Trajectory</span>
            <CheckCircle2 size={18} style={{ color: '#4caf7a' }} />
          </div>
          <div style={{ fontSize: '28px', fontWeight: 700 }}>
            {students.filter((s) => s.riskLevel === 'safe').length} Students
          </div>
          <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>
            Score &lt; 20: Regular attendance & passing marks
          </div>
        </div>
      </div>

      {/* Transparent Model Explanation Callout */}
      <div className="card-base" style={{ padding: '20px', backgroundColor: 'var(--surface-secondary)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
          <Brain size={18} style={{ color: 'var(--accent-primary)' }} />
          <h3 style={{ fontSize: '15px', fontWeight: 600 }}>Deterministic Heuristic Rules (Zero Black-Box AI)</h3>
        </div>
        <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
          Risk scores are calculated deterministically: Attendance deficit scores up to <strong>35 pts</strong>,
          Assessment scores below 50% add up to <strong>30 pts</strong>, Failed assessments add <strong>15 pts</strong>,
          and Unsubmitted lab records contribute up to <strong>15 pts</strong>. Every flagged student displays the exact factors contributing to their score.
        </p>
      </div>

      {/* Flagged At-Risk Students Detailed Cards */}
      <div className="card-base" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <AlertTriangle size={18} style={{ color: '#d96c6c' }} />
            Flagged Students Requiring Intervention ({filteredAtRisk.length})
          </h3>

          <div style={{ display: 'flex', gap: '6px' }}>
            {(['all', 'critical', 'high', 'medium'] as const).map((lvl) => (
              <button
                key={lvl}
                onClick={() => setFilterSeverity(lvl)}
                style={{
                  padding: '5px 12px',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '12px',
                  textTransform: 'capitalize',
                  border: '1px solid var(--border-default)',
                  backgroundColor: filterSeverity === lvl ? 'var(--accent-subtle)' : 'transparent',
                  color: filterSeverity === lvl ? 'var(--accent-light)' : 'var(--text-secondary)',
                }}
              >
                {lvl}
              </button>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {filteredAtRisk.map((student) => (
            <div
              key={student.id}
              style={{
                padding: '20px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--surface-secondary)',
                border: `1px solid ${
                  student.riskLevel === 'critical'
                    ? 'rgba(217, 108, 108, 0.4)'
                    : student.riskLevel === 'high'
                    ? 'rgba(214, 168, 79, 0.4)'
                    : 'var(--border-default)'
                }`,
                display: 'flex',
                flexDirection: 'column',
                gap: '14px',
              }}
            >
              {/* Student Header */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{
                    width: '36px', height: '36px', borderRadius: '50%',
                    backgroundColor: 'var(--surface-elevated)', border: '1px solid var(--accent-border)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: 'var(--accent-primary)', fontSize: '15px', fontWeight: 700,
                  }}>
                    {student.avatarLetter}
                  </div>
                  <div>
                    <div style={{ fontSize: '15px', fontWeight: 600 }}>{student.fullName}</div>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                      {student.studentId} • Batch {student.batch} • {student.email}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Composite Risk Score</div>
                    <div style={{ fontSize: '18px', fontWeight: 700, color: student.riskLevel === 'critical' ? '#d96c6c' : '#d6a84f' }}>
                      {student.riskScore} / 100
                    </div>
                  </div>
                  <span className={`badge ${student.riskLevel === 'critical' ? 'badge-danger' : 'badge-warning'}`}>
                    {student.riskLevel.toUpperCase()}
                  </span>
                </div>
              </div>

              {/* Factors Grid */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                gap: '10px',
                padding: '12px',
                backgroundColor: 'var(--surface-primary)',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border-subtle)',
              }}>
                <div>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Attendance</span>
                  <div style={{ fontSize: '14px', fontWeight: 600, color: student.attendancePct >= 75 ? '#4caf7a' : '#d96c6c' }}>
                    {student.attendancePct}% ({student.classesPresent}/{student.classesTotal} classes)
                  </div>
                </div>
                <div>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>CIA-1 Marks</span>
                  <div style={{ fontSize: '14px', fontWeight: 600, color: student.cia1Score >= 25 ? '#4caf7a' : '#d96c6c' }}>
                    {student.cia1Score} / 50 pts
                  </div>
                </div>
                <div>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Quiz 1 (Relational Alg)</span>
                  <div style={{ fontSize: '14px', fontWeight: 600, color: student.quiz1Score >= 10 ? '#4caf7a' : '#d96c6c' }}>
                    {student.quiz1Score} / 20 pts
                  </div>
                </div>
                <div>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Lab Practical Status</span>
                  <div style={{ fontSize: '14px', fontWeight: 600 }}>
                    {student.labCompletedCount} of {student.labTotalCount} Completed
                  </div>
                </div>
              </div>

              {/* Contributing Factors & Recommended Action */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div>
                  <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                    Triggered Warning Factors:
                  </div>
                  <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '12px', color: 'var(--text-secondary)' }}>
                    {student.riskFactors.map((f, i) => (
                      <li key={i} style={{ marginBottom: '3px' }}>{f}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                    System Suggested Interventions:
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    {student.recommendedInterventions.map((rec, i) => (
                      <div
                        key={i}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '6px 10px',
                          borderRadius: 'var(--radius-sm)',
                          backgroundColor: 'var(--surface-primary)',
                          border: '1px solid var(--border-subtle)',
                          fontSize: '12px',
                        }}
                      >
                        <span>{rec}</span>
                        <button
                          type="button"
                          onClick={() => handleTriggerIntervention(student, rec)}
                          className="btn btn-ghost"
                          style={{ padding: '2px 8px', fontSize: '11px', color: 'var(--accent-primary)' }}
                        >
                          Trigger
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Curriculum Topic Weakness Analysis */}
      <div className="card-base" style={{ padding: '24px' }}>
        <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <TrendingDown size={18} style={{ color: '#d6a84f' }} />
          Curriculum Topic Weakness Heatmap
        </h3>
        <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '20px' }}>
          Identifies lecture modules where section average is below 50% across formal evaluations.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {topicWeaknesses.map((item, idx) => (
            <div
              key={idx}
              style={{
                padding: '16px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--surface-secondary)',
                border: '1px solid var(--border-default)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span className="badge badge-warning">{item.module}</span>
                <span style={{ fontSize: '13px', fontWeight: 700, color: '#d96c6c' }}>
                  Class Avg: {item.averageScorePct}%
                </span>
              </div>
              <h4 style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '4px' }}>
                {item.topic}
              </h4>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '10px' }}>
                <strong>Recommended Remedy:</strong> {item.recommendation}
              </p>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  type="button"
                  onClick={() => showToast('Revision Material Generated', `Sent study guide for "${item.topic}" to student portal.`, 'success')}
                  className="btn btn-secondary"
                  style={{ fontSize: '12px', padding: '5px 12px' }}
                >
                  Generate AI Flashcards & Notes
                </button>
                <button
                  type="button"
                  onClick={() => showToast('Remedial Scheduled', `Created tutorial schedule for ${item.topic}.`, 'info')}
                  className="btn btn-secondary"
                  style={{ fontSize: '12px', padding: '5px 12px' }}
                >
                  Schedule Remedial Class
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
