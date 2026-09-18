// Teacher Dashboard — Faculty Command Hub
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { useAuth } from '../../hooks/useAuth';
import {
  UserCheck,
  ClipboardCheck,
  FlaskConical,
  Users,
  TrendingUp,
  AlertTriangle,
  Calendar,
  Clock,
  ArrowRight,
  BookOpen,
} from 'lucide-react';
import {
  INSTITUTIONAL_STUDENTS,
  INITIAL_LAB_EXPERIMENTS,
  INITIAL_ASSESSMENTS,
} from '../../data/institutionalData';

export const TeacherDashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const allStudents = useQuery(api.users.getUsersByRole, { role: 'student' }) || [];
  const subjects = useQuery(api.academics.getSubjects) || [];

  const effectiveStudentsCount = allStudents.length > 0 ? allStudents.length : INSTITUTIONAL_STUDENTS.length;
  const effectiveSubjectsCount = subjects.length > 0 ? subjects.length : 3;

  const stats = [
    { label: 'Assigned Courses', value: effectiveSubjectsCount, icon: BookOpen, color: '#c8a96b' },
    { label: 'Enrolled Students', value: effectiveStudentsCount, icon: Users, color: '#7298d6' },
    { label: 'Today\'s Classes', value: 2, icon: Calendar, color: '#4caf7a' },
    { label: 'Active Assessments', value: INITIAL_ASSESSMENTS.length, icon: ClipboardCheck, color: '#d6a84f' },
  ];

  const quickActions = [
    {
      label: 'Record Class Attendance',
      route: '/teacher/attendance',
      icon: UserCheck,
      color: '#4caf7a',
      description: 'Start session roster & mark students present or absent',
    },
    {
      label: 'Gradebook & Assessments',
      route: '/teacher/assessments',
      icon: ClipboardCheck,
      color: '#c8a96b',
      description: 'Create CIA tests, quizzes, and enter student marks',
    },
    {
      label: 'Lab Practical Records',
      route: '/teacher/lab-records',
      icon: FlaskConical,
      color: '#7298d6',
      description: 'Verify code outputs & continuous lab evaluations',
    },
    {
      label: 'AI Student Risk Report',
      route: '/teacher/ai-insights',
      icon: AlertTriangle,
      color: '#d96c6c',
      description: 'Check attendance buffers & automated early warnings',
    },
    {
      label: 'Section Performance Analytics',
      route: '/teacher/analytics',
      icon: TrendingUp,
      color: '#d6a84f',
      description: 'Class-wide distribution & syllabus retention curves',
    },
    {
      label: 'Enrolled Students Directory',
      route: '/teacher/students',
      icon: Users,
      color: '#7298d6',
      description: 'Search & inspect student academic profiles',
    },
  ];

  const todaySchedule = [
    {
      time: '09:00 - 10:00 AM',
      code: 'CSE335',
      name: 'Database Management Systems (Theory)',
      room: 'Room 303 (Arch Block)',
      section: 'AI-A (Batch B1)',
      topic: 'Lecture 25: Relational Normalization & Multi-valued Dependencies',
    },
    {
      time: '11:00 AM - 01:00 PM',
      code: 'CSE353',
      name: 'Database Management Systems Lab',
      room: 'CRB F02 - SOA',
      section: 'AI-A (Batch B1)',
      topic: 'Lab Practical 5: Database Indexing Benchmarks & Query Plan Analysis',
    },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '1100px', margin: '0 auto' }}>
      {/* Welcome Banner */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
          <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Faculty Portal</span>
          <span style={{ color: 'var(--border-strong)' }}>•</span>
          <span style={{ fontSize: '12px', color: 'var(--accent-primary)', fontWeight: 500 }}>
            Academic Intelligence
          </span>
        </div>
        <h2 style={{ fontSize: '24px', fontWeight: 600, marginBottom: '4px' }}>
          Welcome back, {user?.fullName || 'Prof. Swati Raj'}
        </h2>
        <p style={{ fontSize: '14px', color: 'var(--text-muted)' }}>
          {user?.department || 'Department of AI and Data Science Engineering'} • {user?.specialization || 'Database Management Systems'}
        </p>
      </div>

      {/* Stats Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} className="card-base" style={{ padding: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                <div style={{
                  width: '36px', height: '36px', borderRadius: '8px',
                  backgroundColor: `${stat.color}15`, border: `1px solid ${stat.color}30`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', color: stat.color,
                }}>
                  <Icon size={18} />
                </div>
              </div>
              <div style={{ fontSize: '28px', fontWeight: 700 }}>{stat.value}</div>
              <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '4px' }}>{stat.label}</div>
            </div>
          );
        })}
      </div>

      {/* Today's Teaching Schedule */}
      <div className="card-base" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Calendar size={16} style={{ color: 'var(--accent-primary)' }} />
            Today's Faculty Teaching Schedule
          </h3>
          <span className="badge badge-accent">Semester III • AI & DS</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {todaySchedule.map((slot, idx) => (
            <div
              key={idx}
              style={{
                padding: '16px',
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
                  <span className="badge badge-neutral">{slot.code}</span>
                  <span className="badge badge-neutral">{slot.section}</span>
                  <span style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Clock size={12} /> {slot.time}
                  </span>
                  <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>• {slot.room}</span>
                </div>
                <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>{slot.name}</div>
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>{slot.topic}</div>
              </div>

              <button
                onClick={() => navigate('/teacher/attendance')}
                className="btn btn-accent-solid"
                style={{ fontSize: '12px', padding: '6px 14px', gap: '6px' }}
              >
                <UserCheck size={14} /> Mark Attendance
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions Grid */}
      <div className="card-base" style={{ padding: '24px' }}>
        <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '16px' }}>Faculty Workflow Modules</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '14px' }}>
          {quickActions.map((action, i) => {
            const Icon = action.icon;
            return (
              <div
                key={i}
                onClick={() => navigate(action.route)}
                style={{
                  padding: '18px',
                  borderRadius: 'var(--radius-md)',
                  cursor: 'pointer',
                  backgroundColor: 'var(--surface-secondary)',
                  border: '1px solid var(--border-default)',
                  transition: 'all var(--transition-fast)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'var(--accent-primary)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'var(--border-default)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{
                      width: '32px', height: '32px', borderRadius: '6px',
                      backgroundColor: `${action.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: action.color,
                    }}>
                      <Icon size={16} />
                    </div>
                    <span style={{ fontSize: '14px', fontWeight: 600 }}>{action.label}</span>
                  </div>
                  <ArrowRight size={14} style={{ color: 'var(--text-muted)' }} />
                </div>
                <p style={{ fontSize: '12px', color: 'var(--text-muted)', lineHeight: 1.5, margin: 0 }}>
                  {action.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
