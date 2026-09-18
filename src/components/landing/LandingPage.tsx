// Professional Landing Page for STELLAR
// Academic Intelligence Platform

import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Compass,
  ArrowRight,
  UserCheck,
  GraduationCap,
  TrendingUp,
  Shield,
  Brain,
  BarChart3,
  BookOpen,
  Bell,
  ClipboardCheck,
  FlaskConical,
  Users,
  ChevronRight,
  Zap,
} from 'lucide-react';

import { useAuth, UserRole } from '../../hooks/useAuth';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { loginAsDemoRole } = useAuth();

  const features = [
    {
      icon: UserCheck,
      title: 'Smart Attendance',
      description: 'Automated tracking with 75% criterion buffers, projections, and batch-aware scheduling.',
      color: '#4caf7a',
    },
    {
      icon: ClipboardCheck,
      title: 'Assessment Management',
      description: 'CIA, quizzes, assignments, and practicals — create, grade, and analyze all from one place.',
      color: '#c8a96b',
    },
    {
      icon: FlaskConical,
      title: 'Lab Record Tracking',
      description: 'Monitor experiment completion, submissions, and evaluations across every lab course.',
      color: '#7298d6',
    },
    {
      icon: Brain,
      title: 'AI Academic Intelligence',
      description: 'Identify at-risk students early with transparent rule-based analysis and intervention recommendations.',
      color: '#d96c6c',
    },
    {
      icon: BarChart3,
      title: 'Performance Analytics',
      description: 'Topic-level analysis, performance trends, and class-wide dashboards for data-driven teaching.',
      color: '#d6a84f',
    },
    {
      icon: Shield,
      title: 'Role-Based Access',
      description: 'Distinct experiences for administrators, faculty, and students with proper authorization.',
      color: '#4caf7a',
    },
  ];

  const roleCards: Array<{
    role: string;
    roleKey: UserRole;
    description: string;
    features: string[];
    gradient: string;
    border: string;
    actionLabel: string;
  }> = [
    {
      role: 'Administrator',
      roleKey: 'admin',
      description: 'Manage the academic ecosystem: departments, faculty, students, academic structure, and system-wide analytics.',
      features: ['User management', 'Academic structure', 'System analytics', 'Audit logging'],
      gradient: 'linear-gradient(135deg, rgba(200, 169, 107, 0.12), rgba(200, 169, 107, 0.04))',
      border: 'rgba(200, 169, 107, 0.25)',
      actionLabel: 'Launch Administrator Portal →',
    },
    {
      role: 'Faculty',
      roleKey: 'teacher',
      description: 'Complete teaching toolkit: attendance, assessments, lab records, performance insights, and AI-assisted student analysis.',
      features: ['Attendance sessions', 'Marks entry', 'AI insights', 'Report generation'],
      gradient: 'linear-gradient(135deg, rgba(114, 152, 214, 0.12), rgba(114, 152, 214, 0.04))',
      border: 'rgba(114, 152, 214, 0.25)',
      actionLabel: 'Launch Faculty Portal →',
    },
    {
      role: 'Student',
      roleKey: 'student',
      description: 'Your academic command center: timetable, attendance tracking, assessment results, study tools, and personalized insights.',
      features: ['Live timetable', 'Attendance status', 'Assessment results', 'Study hub'],
      gradient: 'linear-gradient(135deg, rgba(76, 175, 122, 0.12), rgba(76, 175, 122, 0.04))',
      border: 'rgba(76, 175, 122, 0.25)',
      actionLabel: 'Launch Student Portal →',
    },
  ];

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: 'var(--bg-main)',
      color: 'var(--text-primary)',
      fontFamily: 'var(--font-family)',
      overflowX: 'hidden',
    }}>
      {/* Navigation */}
      <nav style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        padding: '16px 32px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottom: '1px solid var(--border-subtle)',
        backgroundColor: 'rgba(9, 9, 11, 0.85)',
        backdropFilter: 'blur(12px)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '32px', height: '32px', borderRadius: '8px',
            backgroundColor: 'var(--surface-elevated)', border: '1px solid var(--accent-border)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-primary)',
          }}>
            <Compass size={18} strokeWidth={2.2} />
          </div>
          <span style={{ fontSize: '16px', fontWeight: 700, letterSpacing: '0.08em' }}>STELLAR</span>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={() => navigate('/login')}
            className="btn btn-secondary"
            style={{ fontSize: '13px', padding: '8px 18px' }}
          >
            Sign In
          </button>
          <button
            onClick={() => navigate('/login')}
            className="btn btn-accent-solid"
            style={{ fontSize: '13px', padding: '8px 18px' }}
          >
            Get Started
            <ArrowRight size={14} />
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section style={{
        padding: '100px 32px 80px',
        textAlign: 'center',
        position: 'relative',
        backgroundImage: 'radial-gradient(ellipse 80% 50% at 50% -10%, rgba(200, 169, 107, 0.15), transparent 70%)',
      }}>
        <div style={{ maxWidth: '720px', margin: '0 auto' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            padding: '6px 14px', borderRadius: '20px',
            backgroundColor: 'var(--accent-subtle)', border: '1px solid var(--accent-border)',
            fontSize: '12px', fontWeight: 500, color: 'var(--accent-light)',
            marginBottom: '28px',
          }}>
            <Zap size={13} />
            Academic Intelligence Platform
          </div>

          <h1 style={{
            fontSize: 'clamp(36px, 5vw, 56px)',
            fontWeight: 700,
            letterSpacing: '-0.03em',
            lineHeight: 1.1,
            marginBottom: '20px',
          }}>
            Academic intelligence for{' '}
            <span style={{ color: 'var(--accent-light)' }}>better teaching</span> and{' '}
            <span style={{ color: 'var(--accent-light)' }}>learning</span>
          </h1>

          <p style={{
            fontSize: '17px',
            color: 'var(--text-secondary)',
            lineHeight: 1.7,
            maxWidth: '560px',
            margin: '0 auto 36px',
          }}>
            A unified platform connecting attendance, assessments, labs, performance analytics,
            and AI-assisted insights — designed for engineering faculty and students.
          </p>

          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button
              onClick={() => navigate('/login')}
              className="btn btn-accent-solid"
              style={{ padding: '12px 28px', fontSize: '15px' }}
            >
              Login to Stellar
              <ArrowRight size={16} />
            </button>
            <button
              onClick={() => navigate('/login')}
              className="btn btn-secondary"
              style={{ padding: '12px 28px', fontSize: '15px' }}
            >
              Create Account
            </button>
          </div>
        </div>
      </section>

      {/* Platform Overview */}
      <section style={{ padding: '60px 32px', maxWidth: '1100px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <h2 style={{ fontSize: '28px', fontWeight: 600, letterSpacing: '-0.02em', marginBottom: '8px' }}>
            Everything your department needs
          </h2>
          <p style={{ fontSize: '15px', color: 'var(--text-muted)', maxWidth: '500px', margin: '0 auto' }}>
            From daily attendance to semester-end analytics, Stellar covers the complete academic workflow.
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '20px',
        }}>
          {features.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <div
                key={i}
                className="card-base"
                style={{
                  padding: '24px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '14px',
                }}
              >
                <div style={{
                  width: '40px', height: '40px', borderRadius: '10px',
                  backgroundColor: `${feature.color}15`,
                  border: `1px solid ${feature.color}30`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: feature.color,
                }}>
                  <Icon size={20} />
                </div>
                <h3 style={{ fontSize: '16px', fontWeight: 600 }}>{feature.title}</h3>
                <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Role-Based Overview */}
      <section style={{
        padding: '60px 32px',
        maxWidth: '1100px',
        margin: '0 auto',
      }}>
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <h2 style={{ fontSize: '28px', fontWeight: 600, letterSpacing: '-0.02em', marginBottom: '8px' }}>
            Designed for every role
          </h2>
          <p style={{ fontSize: '15px', color: 'var(--text-muted)', maxWidth: '480px', margin: '0 auto' }}>
            Administrators, faculty, and students each get a purpose-built experience.
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '20px',
        }}>
          {roleCards.map((card, i) => (
            <div
              key={i}
              style={{
                padding: '28px',
                borderRadius: 'var(--radius-lg)',
                background: card.gradient,
                border: `1px solid ${card.border}`,
              }}
            >
              <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '8px' }}>
                {card.role}
              </h3>
              <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '20px' }}>
                {card.description}
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {card.features.map((f, j) => (
                  <div key={j} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: 'var(--text-primary)' }}>
                    <ChevronRight size={14} style={{ color: 'var(--accent-primary)' }} />
                    {f}
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={() => {
                  loginAsDemoRole(card.roleKey);
                  const roleRoutes: Record<string, string> = {
                    admin: '/admin/dashboard',
                    teacher: '/teacher/dashboard',
                    student: '/student/dashboard',
                  };
                  navigate(roleRoutes[card.roleKey]);
                }}
                className="btn btn-secondary"
                style={{ marginTop: '24px', width: '100%', fontSize: '13px', fontWeight: 600, padding: '10px 14px' }}
              >
                {card.actionLabel}
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* CIA-3 Context */}
      <section style={{
        padding: '60px 32px',
        borderTop: '1px solid var(--border-subtle)',
        textAlign: 'center',
      }}>
        <div style={{ maxWidth: '700px', margin: '0 auto' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            padding: '6px 14px', borderRadius: '20px',
            backgroundColor: 'rgba(114, 152, 214, 0.1)',
            border: '1px solid rgba(114, 152, 214, 0.25)',
            fontSize: '12px', fontWeight: 500, color: '#7298d6',
            marginBottom: '24px',
          }}>
            <Brain size={13} />
            Academic Intelligence Engine
          </div>

          <h2 style={{ fontSize: '28px', fontWeight: 600, letterSpacing: '-0.02em', marginBottom: '12px' }}>
            Identify struggling students before it's too late
          </h2>
          <p style={{ fontSize: '15px', color: 'var(--text-secondary)', lineHeight: 1.7 }}>
            Stellar's transparent rule-based analysis correlates attendance, quiz marks, assignment scores,
            and lab performance to identify students requiring academic attention — with clear explanations
            of why each student was flagged and recommended interventions.
          </p>
        </div>
      </section>

      {/* Final CTA */}
      <section style={{
        padding: '80px 32px',
        textAlign: 'center',
        backgroundImage: 'radial-gradient(ellipse 60% 50% at 50% 100%, rgba(200, 169, 107, 0.1), transparent 70%)',
      }}>
        <h2 style={{ fontSize: '28px', fontWeight: 600, marginBottom: '12px' }}>
          Ready to transform your academic workflow?
        </h2>
        <p style={{ fontSize: '15px', color: 'var(--text-muted)', marginBottom: '28px' }}>
          Start using Stellar today — no complex setup required.
        </p>
        <button
          onClick={() => navigate('/login')}
          className="btn btn-accent-solid"
          style={{ padding: '14px 32px', fontSize: '16px' }}
        >
          Get Started with Stellar
          <ArrowRight size={16} />
        </button>
      </section>

      {/* Footer */}
      <footer style={{
        padding: '32px',
        borderTop: '1px solid var(--border-subtle)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px',
        maxWidth: '1100px',
        margin: '0 auto',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Compass size={16} style={{ color: 'var(--accent-primary)' }} />
          <span style={{ fontSize: '13px', fontWeight: 600 }}>STELLAR</span>
          <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Academic Intelligence Platform</span>
        </div>
        <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
          © 2026 Stellar. School of Engineering and Technology.
        </div>
      </footer>
    </div>
  );
};
