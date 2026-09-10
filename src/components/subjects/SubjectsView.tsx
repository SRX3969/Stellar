import React, { useState } from 'react';
import {
  BookOpen,
  ChevronRight,
  UserCheck,
  Calendar,
  Layers,
  FileText,
  MessageSquare,
  GraduationCap,
  Sparkles,
  X
} from 'lucide-react';
import { SUBJECTS } from '../../data/mockData';
import { Subject } from '../../types';
import { NavRoute } from '../shell/Sidebar';

interface SubjectsViewProps {
  onNavigate: (route: NavRoute) => void;
  onOpenAITutorForSubject?: (subjectCode: string) => void;
  subjects?: Subject[];
}

export const SubjectsView: React.FC<SubjectsViewProps> = ({
  onNavigate,
  onOpenAITutorForSubject,
  subjects = SUBJECTS,
}) => {
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  const [activeDrawerTab, setActiveDrawerTab] = useState<'overview' | 'syllabus' | 'assessments' | 'flashcards'>('overview');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px', maxWidth: '1100px', margin: '0 auto' }}>
      {/* Header */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
          <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Academic Curriculum</span>
          <span style={{ color: 'var(--border-strong)' }}>•</span>
          <span style={{ fontSize: '12px', color: 'var(--accent-primary)', fontWeight: 500 }}>4 Core Subjects Enrolled</span>
        </div>
        <h2 style={{ fontSize: '28px', fontWeight: 600, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
          Subjects & Syllabus Central
        </h2>
        <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginTop: '4px' }}>
          Real-time syllabus completion tracking, assessments, notes, and attendance sync.
        </p>
      </div>

      {/* Subject Cards Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '20px',
        }}
      >
        {subjects.map((subject) => (
          <div
            key={subject.id}
            className="card-base"
            style={{
              padding: '20px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              cursor: 'pointer',
              position: 'relative',
            }}
            onClick={() => setSelectedSubject(subject)}
          >
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                <span
                  style={{
                    fontSize: '11px',
                    fontWeight: 700,
                    letterSpacing: '0.06em',
                    padding: '2px 8px',
                    borderRadius: '4px',
                    backgroundColor: 'var(--surface-secondary)',
                    color: 'var(--accent-primary)',
                    border: '1px solid var(--border-subtle)',
                  }}
                >
                  {subject.code}
                </span>

                <span
                  className={`badge ${subject.attendance.status === 'SAFE' ? 'badge-success' : subject.attendance.status === 'WATCH' ? 'badge-warning' : 'badge-danger'}`}
                >
                  {subject.attendance.percentage}% ATT
                </span>
              </div>

              <h3 style={{ fontSize: '17px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '4px' }}>
                {subject.name}
              </h3>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '16px' }}>
                {subject.professor} • {subject.room}
              </p>

              {/* Syllabus Progress */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Syllabus Completion</span>
                  <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{subject.syllabusCompletion}%</span>
                </div>
                <div style={{ height: '5px', backgroundColor: 'var(--surface-secondary)', borderRadius: '3px', overflow: 'hidden' }}>
                  <div
                    style={{
                      height: '100%',
                      width: `${subject.syllabusCompletion}%`,
                      backgroundColor: 'var(--accent-primary)',
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Bottom context pill */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingTop: '12px',
                borderTop: '1px solid var(--border-subtle)',
                fontSize: '12px',
              }}
            >
              {subject.nextAssessment ? (
                <span style={{ color: 'var(--color-warning)', fontWeight: 500 }}>
                  {subject.nextAssessment.name} in {subject.nextAssessment.daysLeft} days
                </span>
              ) : (
                <span style={{ color: 'var(--text-muted)' }}>No imminent exams</span>
              )}

              <span style={{ color: 'var(--accent-light)', display: 'flex', alignItems: 'center', gap: '2px' }}>
                Explore <ChevronRight size={13} />
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Drilldown Drawer / Modal */}
      {selectedSubject && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 999,
            display: 'flex',
            justifyContent: 'flex-end',
          }}
        >
          {/* Backdrop */}
          <div
            onClick={() => setSelectedSubject(null)}
            style={{
              position: 'absolute',
              inset: 0,
              backgroundColor: 'rgba(9, 9, 11, 0.75)',
              backdropFilter: 'blur(3px)',
            }}
          />

          {/* Drawer Panel */}
          <div
            style={{
              position: 'relative',
              width: '100%',
              maxWidth: '520px',
              height: '100vh',
              backgroundColor: 'var(--surface-primary)',
              borderLeft: '1px solid var(--border-strong)',
              display: 'flex',
              flexDirection: 'column',
              zIndex: 10,
              overflowY: 'auto',
              padding: '28px',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
              <div>
                <span style={{ fontSize: '11px', color: 'var(--accent-primary)', fontWeight: 600 }}>
                  {selectedSubject.code} • {selectedSubject.credits} Credits
                </span>
                <h3 style={{ fontSize: '20px', fontWeight: 600, color: 'var(--text-primary)', marginTop: '2px' }}>
                  {selectedSubject.name}
                </h3>
                <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '2px' }}>
                  {selectedSubject.professor} • {selectedSubject.room}
                </p>
              </div>
              <button
                onClick={() => setSelectedSubject(null)}
                style={{ color: 'var(--text-muted)', padding: '4px' }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Drawer Tabs */}
            <div
              style={{
                display: 'flex',
                gap: '8px',
                borderBottom: '1px solid var(--border-default)',
                paddingBottom: '12px',
                marginBottom: '20px',
              }}
            >
              {(['overview', 'syllabus', 'assessments', 'flashcards'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveDrawerTab(tab)}
                  style={{
                    padding: '5px 12px',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '12px',
                    fontWeight: activeDrawerTab === tab ? 600 : 400,
                    backgroundColor: activeDrawerTab === tab ? 'var(--surface-elevated)' : 'transparent',
                    color: activeDrawerTab === tab ? 'var(--text-primary)' : 'var(--text-secondary)',
                    textTransform: 'capitalize',
                  }}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Tab Contents */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', flex: 1 }}>
              <div
                style={{
                  padding: '14px 16px',
                  backgroundColor: 'var(--surface-secondary)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-default)',
                }}
              >
                <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '8px' }}>
                  Current Attendance Health
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Attended:</span>
                  <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>
                    {selectedSubject.attendance.present} / {selectedSubject.attendance.total} ({selectedSubject.attendance.percentage}%)
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginTop: '4px' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Status:</span>
                  <span style={{ color: selectedSubject.attendance.percentage >= 75 ? 'var(--color-success)' : 'var(--color-danger)', fontWeight: 600 }}>
                    {selectedSubject.attendance.status}
                  </span>
                </div>
              </div>

              {/* Quick Actions for Subject */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <button
                  onClick={() => {
                    setSelectedSubject(null);
                    onNavigate('ai');
                  }}
                  className="btn btn-secondary"
                  style={{ width: '100%', justifyContent: 'flex-start', padding: '10px 14px' }}
                >
                  <MessageSquare size={16} style={{ color: 'var(--accent-primary)' }} />
                  <span>Ask AI Tutor about {selectedSubject.code}</span>
                </button>

                <button
                  onClick={() => {
                    setSelectedSubject(null);
                    onNavigate('study');
                  }}
                  className="btn btn-secondary"
                  style={{ width: '100%', justifyContent: 'flex-start', padding: '10px 14px' }}
                >
                  <Layers size={16} style={{ color: 'var(--accent-primary)' }} />
                  <span>Review {selectedSubject.code} Flashcards</span>
                </button>

                <button
                  onClick={() => {
                    setSelectedSubject(null);
                    onNavigate('attendance');
                  }}
                  className="btn btn-secondary"
                  style={{ width: '100%', justifyContent: 'flex-start', padding: '10px 14px' }}
                >
                  <UserCheck size={16} style={{ color: 'var(--color-info)' }} />
                  <span>Run Attendance Simulator for {selectedSubject.code}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
