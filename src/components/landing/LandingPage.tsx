// Premium Landing Page for STELLAR — Proddy AI-Inspired Design
// Academic Intelligence Platform

import React, { useState, useEffect, useRef } from 'react';
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
  ClipboardCheck,
  FlaskConical,
  Users,
  ChevronRight,
  Zap,
  CalendarClock,
  LayoutDashboard,
  Menu,
  X,
  CheckCircle2,
  Sparkles,
  Bell,
  Clock,
} from 'lucide-react';

// ============================================================
// ANIMATED SECTION WRAPPER
// ============================================================

function AnimatedSection({ children, className = '', delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsVisible(true); },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(24px)',
        transition: `opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms, transform 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

// ============================================================
// LANDING PAGE
// ============================================================

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeModule, setActiveModule] = useState(0);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const modules = [
    {
      icon: UserCheck,
      title: 'Smart Attendance',
      description: 'Automated tracking with 75% criterion buffers, batch-aware scheduling, real-time projections, and safe-zone calculations for every student.',
      color: '#22c55e',
      features: ['Live criterion tracking', 'Batch-aware schedules', 'Projection calculator', 'Attendance history'],
    },
    {
      icon: ClipboardCheck,
      title: 'Assessment Hub',
      description: 'CIA, quizzes, assignments, mid-semester and end-semester exams — create, grade, publish, and analyze performance from a single interface.',
      color: '#f59e0b',
      features: ['Multi-type assessments', 'Marks entry & grading', 'Performance analytics', 'Grade distribution'],
    },
    {
      icon: FlaskConical,
      title: 'Lab Records',
      description: 'Track experiment completion, student submissions, evaluation status, and practical marks across every lab course effortlessly.',
      color: '#3b82f6',
      features: ['Experiment tracking', 'Submission management', 'Evaluation workflow', 'Progress monitoring'],
    },
    {
      icon: Brain,
      title: 'AI Intelligence',
      description: 'Identify at-risk students early with transparent rule-based analysis correlating attendance, assessments, and lab performance data.',
      color: '#ef4444',
      features: ['At-risk identification', 'Intervention alerts', 'Performance trends', 'Topic weakness analysis'],
    },
    {
      icon: CalendarClock,
      title: 'Timetable System',
      description: 'Institutional timetable with live class tracking, period progress bars, room locators, and advance reminder notifications.',
      color: '#8b5cf6',
      features: ['Live class tracker', 'Period progress', 'Room locator', 'Advance reminders'],
    },
    {
      icon: BarChart3,
      title: 'Analytics Engine',
      description: 'Topic-level performance analysis, class-wide dashboards, attendance trends, and data-driven teaching insights.',
      color: '#06b6d4',
      features: ['Topic analysis', 'Class dashboards', 'Trend detection', 'Export reports'],
    },
  ];

  const workflowSteps = [
    { step: '01', title: 'Create Your Account', description: 'Sign up in seconds with your username. Administrators and faculty accounts are provisioned by your institution.', icon: Users },
    { step: '02', title: 'Configure Your Profile', description: 'Set up your academic details — courses, sections, departments, timetable, and preferences.', icon: BookOpen },
    { step: '03', title: 'Track Everything', description: 'Attendance, assessments, lab records, and deadlines — all synchronized in real-time from one dashboard.', icon: TrendingUp },
    { step: '04', title: 'Get AI Insights', description: 'Receive proactive alerts on at-risk students, performance trends, and intervention recommendations.', icon: Brain },
  ];

  const ActiveModuleIcon = modules[activeModule].icon;

  return (
    <div className="theme-light" style={{
      minHeight: '100vh',
      backgroundColor: '#f8f7fa',
      color: '#0f172a',
      fontFamily: 'var(--font-family)',
      overflowX: 'hidden',
    }}>
      {/* ==================== NAVIGATION ==================== */}
      <header style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        transition: 'all 0.3s ease',
        backgroundColor: isScrolled ? 'rgba(248, 247, 250, 0.85)' : 'transparent',
        backdropFilter: isScrolled ? 'blur(16px) saturate(180%)' : 'none',
        borderBottom: isScrolled ? '1px solid #e8e7ec' : '1px solid transparent',
        padding: isScrolled ? '12px 0' : '20px 0',
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          {/* Logo */}
          <a href="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none', color: '#0f172a' }}>
            <div style={{
              width: '36px', height: '36px', borderRadius: '10px',
              background: 'linear-gradient(135deg, #7c3aed, #6d28d9)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white',
              boxShadow: '0 2px 8px rgba(124, 58, 237, 0.3)',
            }}>
              <Compass size={20} strokeWidth={2.2} />
            </div>
            <span style={{ fontSize: '20px', fontWeight: 700, letterSpacing: '-0.02em' }}>Stellar</span>
          </a>

          {/* Desktop Nav */}
          <nav style={{ display: 'flex', alignItems: 'center', gap: '32px' }} className="hide-on-mobile">
            <a href="#features" style={{ fontSize: '14px', fontWeight: 500, color: '#475569', transition: 'color 0.2s' }}
              onMouseEnter={e => (e.currentTarget.style.color = '#7c3aed')}
              onMouseLeave={e => (e.currentTarget.style.color = '#475569')}>Features</a>
            <a href="#how-it-works" style={{ fontSize: '14px', fontWeight: 500, color: '#475569', transition: 'color 0.2s' }}
              onMouseEnter={e => (e.currentTarget.style.color = '#7c3aed')}
              onMouseLeave={e => (e.currentTarget.style.color = '#475569')}>How It Works</a>
            <a href="#roles" style={{ fontSize: '14px', fontWeight: 500, color: '#475569', transition: 'color 0.2s' }}
              onMouseEnter={e => (e.currentTarget.style.color = '#7c3aed')}
              onMouseLeave={e => (e.currentTarget.style.color = '#475569')}>Roles</a>
          </nav>

          {/* Desktop Auth Buttons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }} className="hide-on-mobile">
            <button
              onClick={() => navigate('/login')}
              style={{
                padding: '9px 20px', borderRadius: '9999px', fontSize: '14px', fontWeight: 500,
                color: '#0f172a', backgroundColor: 'white', border: '1px solid #e2e1e6',
                cursor: 'pointer', transition: 'all 0.2s',
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = '#7c3aed'; e.currentTarget.style.color = '#7c3aed'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = '#e2e1e6'; e.currentTarget.style.color = '#0f172a'; }}
            >Sign In</button>
            <button
              onClick={() => navigate('/signup')}
              style={{
                padding: '9px 20px', borderRadius: '9999px', fontSize: '14px', fontWeight: 600,
                color: 'white', backgroundColor: '#7c3aed', border: '1px solid #8b5cf6',
                cursor: 'pointer', transition: 'all 0.2s',
                boxShadow: '0 2px 8px rgba(124, 58, 237, 0.3)',
              }}
              onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#6d28d9'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
              onMouseLeave={e => { e.currentTarget.style.backgroundColor = '#7c3aed'; e.currentTarget.style.transform = 'translateY(0)'; }}
            >Get Started</button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            style={{ display: 'none', padding: '8px', borderRadius: '8px', color: '#475569', background: 'none', border: 'none', cursor: 'pointer' }}
            className="mobile-menu-btn"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div style={{
            position: 'absolute', top: '100%', left: 0, right: 0,
            backgroundColor: 'rgba(255, 255, 255, 0.98)', backdropFilter: 'blur(16px)',
            borderBottom: '1px solid #e8e7ec', padding: '16px 24px',
            display: 'flex', flexDirection: 'column', gap: '12px',
          }}>
            <a href="#features" onClick={() => setIsMobileMenuOpen(false)} style={{ padding: '10px 0', fontSize: '15px', fontWeight: 500, color: '#475569' }}>Features</a>
            <a href="#how-it-works" onClick={() => setIsMobileMenuOpen(false)} style={{ padding: '10px 0', fontSize: '15px', fontWeight: 500, color: '#475569' }}>How It Works</a>
            <a href="#roles" onClick={() => setIsMobileMenuOpen(false)} style={{ padding: '10px 0', fontSize: '15px', fontWeight: 500, color: '#475569' }}>Roles</a>
            <div style={{ display: 'flex', gap: '10px', paddingTop: '8px', borderTop: '1px solid #e8e7ec' }}>
              <button onClick={() => { navigate('/login'); setIsMobileMenuOpen(false); }}
                style={{ flex: 1, padding: '10px', borderRadius: '9999px', fontSize: '14px', fontWeight: 500, color: '#0f172a', backgroundColor: 'white', border: '1px solid #e2e1e6', cursor: 'pointer' }}>Sign In</button>
              <button onClick={() => { navigate('/signup'); setIsMobileMenuOpen(false); }}
                style={{ flex: 1, padding: '10px', borderRadius: '9999px', fontSize: '14px', fontWeight: 600, color: 'white', backgroundColor: '#7c3aed', border: '1px solid #8b5cf6', cursor: 'pointer' }}>Get Started</button>
            </div>
          </div>
        )}
      </header>

      {/* ==================== HERO SECTION ==================== */}
      <section style={{
        position: 'relative',
        paddingTop: '140px',
        paddingBottom: '80px',
        overflow: 'hidden',
      }}>
        {/* Background Glow */}
        <div style={{ position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none' }}>
          <div style={{
            position: 'absolute', left: '50%', top: '-100px', transform: 'translateX(-50%)',
            width: '900px', height: '500px', borderRadius: '50%',
            background: 'radial-gradient(ellipse, rgba(124, 58, 237, 0.12), transparent 70%)',
            filter: 'blur(60px)',
          }} />
          <div style={{
            position: 'absolute', left: '10%', top: '40%', width: '300px', height: '300px', borderRadius: '50%',
            background: 'rgba(139, 92, 246, 0.06)', filter: 'blur(80px)',
          }} />
          <div style={{
            position: 'absolute', right: '10%', top: '20%', width: '250px', height: '250px', borderRadius: '50%',
            background: 'rgba(124, 58, 237, 0.08)', filter: 'blur(80px)',
          }} />
        </div>

        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px', position: 'relative', zIndex: 1 }}>
          <AnimatedSection>
            <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              {/* Badge */}
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: '6px',
                padding: '6px 14px', borderRadius: '9999px',
                backgroundColor: 'rgba(124, 58, 237, 0.08)', border: '1px solid rgba(124, 58, 237, 0.15)',
                fontSize: '13px', fontWeight: 500, color: '#7c3aed',
                marginBottom: '28px',
              }}>
                <Sparkles size={14} />
                Academic Intelligence Platform
              </div>

              {/* Hero Heading */}
              <h1 style={{
                fontSize: 'clamp(36px, 5.5vw, 60px)',
                fontWeight: 700,
                letterSpacing: '-0.03em',
                lineHeight: 1.08,
                marginBottom: '20px',
                maxWidth: '800px',
                color: '#0f172a',
              }}>
                Your Department's Smart{' '}
                <br />
                <span style={{
                  background: 'linear-gradient(135deg, #7c3aed, #a855f7)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}>Academic Intelligence</span>{' '}Suite
              </h1>

              {/* Subtitle */}
              <p style={{
                fontSize: 'clamp(16px, 2vw, 19px)',
                color: '#475569',
                lineHeight: 1.65,
                maxWidth: '680px',
                marginBottom: '36px',
              }}>
                Stellar unifies attendance, assessments, lab records, timetables, and AI analytics so academic work moves from tracking to insights without friction.
              </p>

              {/* CTA Buttons */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '14px', justifyContent: 'center', marginBottom: '60px' }}>
                <button
                  onClick={() => navigate('/signup')}
                  style={{
                    padding: '14px 32px', borderRadius: '9999px', fontSize: '16px', fontWeight: 600,
                    color: 'white', backgroundColor: '#7c3aed', border: '1px solid #8b5cf6',
                    cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '8px',
                    boxShadow: '0 4px 16px rgba(124, 58, 237, 0.3)',
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#6d28d9'; e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 6px 24px rgba(124, 58, 237, 0.4)'; }}
                  onMouseLeave={e => { e.currentTarget.style.backgroundColor = '#7c3aed'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(124, 58, 237, 0.3)'; }}
                >
                  Get Started Free
                  <ArrowRight size={18} />
                </button>
                <button
                  onClick={() => { const el = document.getElementById('features'); el?.scrollIntoView({ behavior: 'smooth' }); }}
                  style={{
                    padding: '14px 32px', borderRadius: '9999px', fontSize: '16px', fontWeight: 500,
                    color: '#0f172a', backgroundColor: 'white', border: '1px solid #e2e1e6',
                    cursor: 'pointer', transition: 'all 0.2s',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = '#d1d0d5'; e.currentTarget.style.backgroundColor = '#f8f7fa'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = '#e2e1e6'; e.currentTarget.style.backgroundColor = 'white'; }}
                >
                  See How It Works
                </button>
              </div>
            </div>
          </AnimatedSection>

          {/* App Preview */}
          <AnimatedSection delay={200}>
            <div style={{
              maxWidth: '1100px', margin: '0 auto',
              borderRadius: '20px', overflow: 'hidden',
              border: '1px solid #e2e1e6', backgroundColor: 'white',
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.08), 0 4px 20px rgba(0, 0, 0, 0.04)',
              padding: '6px',
            }}>
              <div style={{
                borderRadius: '16px', overflow: 'hidden',
                background: 'linear-gradient(135deg, #1e1b2e 0%, #13111c 100%)',
                padding: '24px',
                minHeight: '400px',
                display: 'flex', flexDirection: 'column', gap: '16px',
              }}>
                {/* Mock Dashboard UI */}
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#ef4444' }} />
                    <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#f59e0b' }} />
                    <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#22c55e' }} />
                  </div>
                  <div style={{ flex: 1, height: '28px', borderRadius: '8px', backgroundColor: 'rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', padding: '0 12px', gap: '8px' }}>
                    <div style={{ width: '14px', height: '14px', borderRadius: '4px', backgroundColor: 'rgba(124, 58, 237, 0.4)' }} />
                    <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)' }}>Stellar — Academic Intelligence Platform</span>
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: '16px', flex: 1, minHeight: '340px' }}>
                  {/* Mock Sidebar */}
                  <div style={{ borderRadius: '12px', backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', padding: '16px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <div style={{ padding: '8px 12px', borderRadius: '8px', backgroundColor: 'rgba(124, 58, 237, 0.15)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <LayoutDashboard size={14} style={{ color: '#8b5cf6' }} />
                      <span style={{ fontSize: '12px', color: '#c4b5fd', fontWeight: 500 }}>Dashboard</span>
                    </div>
                    {['Timetable', 'Attendance', 'Assessments', 'Lab Records', 'Analytics', 'AI Tutor'].map((item) => (
                      <div key={item} style={{ padding: '8px 12px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ width: '14px', height: '14px', borderRadius: '4px', backgroundColor: 'rgba(255,255,255,0.08)' }} />
                        <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.35)' }}>{item}</span>
                      </div>
                    ))}
                  </div>
                  {/* Mock Content */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div style={{ display: 'flex', gap: '12px' }}>
                      {[
                        { label: 'Attendance', value: '87%', color: '#22c55e' },
                        { label: 'Assessments', value: '12/15', color: '#f59e0b' },
                        { label: 'Lab Records', value: '8/10', color: '#3b82f6' },
                        { label: 'AI Alerts', value: '3', color: '#ef4444' },
                      ].map((stat) => (
                        <div key={stat.label} style={{ flex: 1, padding: '16px', borderRadius: '12px', backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                          <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{stat.label}</div>
                          <div style={{ fontSize: '22px', fontWeight: 700, color: stat.color }}>{stat.value}</div>
                        </div>
                      ))}
                    </div>
                    <div style={{ flex: 1, borderRadius: '12px', backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', padding: '16px' }}>
                      <div style={{ fontSize: '12px', fontWeight: 600, color: 'rgba(255,255,255,0.6)', marginBottom: '12px' }}>Academic Performance Overview</div>
                      <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-end', height: '140px', padding: '0 8px' }}>
                        {[65, 78, 82, 70, 88, 92, 75, 85, 90, 68, 95, 80].map((h, i) => (
                          <div key={i} style={{ flex: 1, height: `${h}%`, borderRadius: '4px 4px 0 0', background: `linear-gradient(180deg, rgba(124, 58, 237, ${0.4 + i * 0.05}), rgba(124, 58, 237, 0.15))`, transition: 'height 0.5s ease' }} />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ==================== FEATURES / MODULES SECTION ==================== */}
      <section id="features" style={{ padding: '80px 0', backgroundColor: '#f1f0f3' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
          <AnimatedSection>
            <div style={{ textAlign: 'center', marginBottom: '48px' }}>
              <h2 style={{ fontSize: 'clamp(28px, 3.5vw, 40px)', fontWeight: 700, letterSpacing: '-0.025em', color: '#0f172a', marginBottom: '12px' }}>
                Powerful <span style={{ color: '#7c3aed' }}>Tools</span> for Every Need
              </h2>
              <p style={{ fontSize: '17px', color: '#475569', maxWidth: '600px', margin: '0 auto', lineHeight: 1.6 }}>
                Each module works independently or as part of the integrated academic ecosystem.
              </p>
            </div>
          </AnimatedSection>

          <AnimatedSection delay={100}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '24px' }}>
              {/* Module Selector Tabs */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
                gap: '8px',
                padding: '6px',
                backgroundColor: 'white',
                borderRadius: '16px',
                border: '1px solid #e8e7ec',
              }}>
                {modules.map((mod, i) => {
                  const Icon = mod.icon;
                  return (
                    <button
                      key={i}
                      onClick={() => setActiveModule(i)}
                      style={{
                        display: 'flex', alignItems: 'center', gap: '10px',
                        padding: '12px 16px', borderRadius: '12px',
                        backgroundColor: activeModule === i ? '#7c3aed' : 'transparent',
                        color: activeModule === i ? 'white' : '#475569',
                        border: 'none', cursor: 'pointer', transition: 'all 0.2s',
                        fontWeight: activeModule === i ? 600 : 500,
                        fontSize: '13px',
                      }}
                    >
                      <Icon size={16} />
                      <span>{mod.title}</span>
                    </button>
                  );
                })}
              </div>

              {/* Active Module Detail */}
              <div style={{
                display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0',
                borderRadius: '20px', overflow: 'hidden',
                border: '1px solid #e8e7ec', backgroundColor: 'white',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.04)',
                minHeight: '380px',
              }}>
                <div style={{ padding: '40px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                  <div style={{
                    width: '48px', height: '48px', borderRadius: '14px',
                    backgroundColor: `${modules[activeModule].color}15`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: modules[activeModule].color, marginBottom: '20px',
                    boxShadow: `0 4px 12px ${modules[activeModule].color}20`,
                  }}>
                    <ActiveModuleIcon size={24} />
                  </div>
                  <h3 style={{ fontSize: '22px', fontWeight: 700, marginBottom: '12px', color: '#0f172a' }}>
                    {modules[activeModule].title}
                  </h3>
                  <p style={{ fontSize: '15px', color: '#475569', lineHeight: 1.65, marginBottom: '24px' }}>
                    {modules[activeModule].description}
                  </p>
                  <div style={{ fontSize: '12px', fontWeight: 600, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '12px' }}>
                    Key Features
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {modules[activeModule].features.map((feat, j) => (
                      <div key={j} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <ArrowRight size={14} style={{ color: '#7c3aed', flexShrink: 0 }} />
                        <span style={{ fontSize: '14px', color: '#0f172a' }}>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div style={{
                  backgroundColor: '#f1f0f3', position: 'relative', overflow: 'hidden',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <div style={{
                    width: '85%', height: '85%', borderRadius: '16px',
                    backgroundColor: 'white', border: '1px solid #e8e7ec',
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.06)',
                    padding: '24px', display: 'flex', flexDirection: 'column', gap: '12px',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                      <ActiveModuleIcon size={16} style={{ color: modules[activeModule].color }} />
                      <span style={{ fontSize: '13px', fontWeight: 600, color: '#0f172a' }}>{modules[activeModule].title} Dashboard</span>
                    </div>
                    {/* Mini preview cards */}
                    {modules[activeModule].features.map((feat, k) => (
                      <div key={k} style={{
                        padding: '12px 14px', borderRadius: '10px',
                        backgroundColor: '#f8f7fa', border: '1px solid #e8e7ec',
                        display: 'flex', alignItems: 'center', gap: '10px',
                      }}>
                        <div style={{
                          width: '8px', height: '8px', borderRadius: '50%',
                          backgroundColor: modules[activeModule].color,
                          boxShadow: `0 0 8px ${modules[activeModule].color}40`,
                        }} />
                        <span style={{ fontSize: '12px', color: '#475569', fontWeight: 500 }}>{feat}</span>
                        <div style={{ marginLeft: 'auto', fontSize: '11px', color: '#94a3b8' }}>Active</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ==================== HOW IT WORKS ==================== */}
      <section id="how-it-works" style={{ padding: '80px 0', backgroundColor: '#f8f7fa' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
          <AnimatedSection>
            <div style={{ textAlign: 'center', marginBottom: '56px' }}>
              <h2 style={{ fontSize: 'clamp(28px, 3.5vw, 40px)', fontWeight: 700, letterSpacing: '-0.025em', color: '#0f172a', marginBottom: '12px' }}>
                How <span style={{ color: '#7c3aed' }}>Stellar</span> Works
              </h2>
              <p style={{ fontSize: '17px', color: '#475569', maxWidth: '540px', margin: '0 auto', lineHeight: 1.6 }}>
                From setup to insights in four simple steps. No complex configuration required.
              </p>
            </div>
          </AnimatedSection>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '24px' }}>
            {workflowSteps.map((step, i) => {
              const Icon = step.icon;
              return (
                <AnimatedSection key={i} delay={i * 100}>
                  <div style={{
                    padding: '32px 28px', borderRadius: '20px',
                    backgroundColor: 'white', border: '1px solid #e8e7ec',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.03)',
                    transition: 'all 0.3s ease', cursor: 'default',
                    height: '100%',
                  }}
                    onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 8px 30px rgba(0, 0, 0, 0.08)'; }}
                    onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.03)'; }}
                  >
                    <div style={{
                      display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px',
                    }}>
                      <div style={{
                        width: '44px', height: '44px', borderRadius: '12px',
                        background: 'linear-gradient(135deg, rgba(124, 58, 237, 0.1), rgba(124, 58, 237, 0.05))',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: '#7c3aed',
                      }}>
                        <Icon size={22} />
                      </div>
                      <span style={{ fontSize: '32px', fontWeight: 800, color: 'rgba(124, 58, 237, 0.12)', letterSpacing: '-0.02em' }}>{step.step}</span>
                    </div>
                    <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '8px', color: '#0f172a' }}>{step.title}</h3>
                    <p style={{ fontSize: '14px', color: '#475569', lineHeight: 1.65 }}>{step.description}</p>
                  </div>
                </AnimatedSection>
              );
            })}
          </div>
        </div>
      </section>

      {/* ==================== ROLE-BASED SECTION ==================== */}
      <section id="roles" style={{ padding: '80px 0', backgroundColor: '#f1f0f3' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
          <AnimatedSection>
            <div style={{ textAlign: 'center', marginBottom: '48px' }}>
              <h2 style={{ fontSize: 'clamp(28px, 3.5vw, 40px)', fontWeight: 700, letterSpacing: '-0.025em', color: '#0f172a', marginBottom: '12px' }}>
                Designed for <span style={{ color: '#7c3aed' }}>Every Role</span>
              </h2>
              <p style={{ fontSize: '17px', color: '#475569', maxWidth: '540px', margin: '0 auto', lineHeight: 1.6 }}>
                Administrators, faculty, and students each get a purpose-built experience.
              </p>
            </div>
          </AnimatedSection>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
            {[
              {
                title: 'Administrator',
                description: 'Manage the academic ecosystem: departments, faculty, students, structure, and system-wide analytics.',
                features: ['User management', 'Academic structure', 'System analytics', 'Audit logging'],
                icon: Shield,
                gradient: 'linear-gradient(135deg, rgba(124, 58, 237, 0.06), rgba(124, 58, 237, 0.02))',
                iconBg: 'rgba(124, 58, 237, 0.1)',
                iconColor: '#7c3aed',
              },
              {
                title: 'Faculty',
                description: 'Complete teaching toolkit: attendance sessions, grading, lab record tracking, and AI-assisted student analysis.',
                features: ['Attendance sessions', 'Marks entry & grading', 'AI insights', 'Report generation'],
                icon: GraduationCap,
                gradient: 'linear-gradient(135deg, rgba(59, 130, 246, 0.06), rgba(59, 130, 246, 0.02))',
                iconBg: 'rgba(59, 130, 246, 0.1)',
                iconColor: '#3b82f6',
              },
              {
                title: 'Student',
                description: 'Your academic command center: timetable, attendance status, assessment results, study tools, and personal insights.',
                features: ['Live timetable', 'Attendance tracking', 'Assessment results', 'AI study tutor'],
                icon: Users,
                gradient: 'linear-gradient(135deg, rgba(34, 197, 94, 0.06), rgba(34, 197, 94, 0.02))',
                iconBg: 'rgba(34, 197, 94, 0.1)',
                iconColor: '#22c55e',
              },
            ].map((card, i) => {
              const Icon = card.icon;
              return (
                <AnimatedSection key={i} delay={i * 100}>
                  <div style={{
                    padding: '32px', borderRadius: '20px',
                    background: card.gradient, border: '1px solid #e8e7ec',
                    backgroundColor: 'white', height: '100%',
                    display: 'flex', flexDirection: 'column',
                    transition: 'all 0.3s ease',
                  }}
                    onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 8px 30px rgba(0, 0, 0, 0.08)'; }}
                    onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
                  >
                    <div style={{
                      width: '48px', height: '48px', borderRadius: '14px',
                      backgroundColor: card.iconBg,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: card.iconColor, marginBottom: '20px',
                    }}>
                      <Icon size={24} />
                    </div>
                    <h3 style={{ fontSize: '20px', fontWeight: 600, marginBottom: '10px', color: '#0f172a' }}>{card.title}</h3>
                    <p style={{ fontSize: '14px', color: '#475569', lineHeight: 1.65, marginBottom: '24px' }}>{card.description}</p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '28px', flex: 1 }}>
                      {card.features.map((f, j) => (
                        <div key={j} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <CheckCircle2 size={16} style={{ color: card.iconColor, flexShrink: 0 }} />
                          <span style={{ fontSize: '14px', color: '#0f172a' }}>{f}</span>
                        </div>
                      ))}
                    </div>
                    <button
                      onClick={() => navigate('/signup')}
                      style={{
                        width: '100%', padding: '12px', borderRadius: '12px',
                        backgroundColor: 'white', border: '1px solid #e2e1e6',
                        fontSize: '14px', fontWeight: 600, color: '#0f172a',
                        cursor: 'pointer', transition: 'all 0.2s',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                      }}
                      onMouseEnter={e => { e.currentTarget.style.borderColor = '#7c3aed'; e.currentTarget.style.color = '#7c3aed'; }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor = '#e2e1e6'; e.currentTarget.style.color = '#0f172a'; }}
                    >
                      Get Started
                      <ArrowRight size={16} />
                    </button>
                  </div>
                </AnimatedSection>
              );
            })}
          </div>
        </div>
      </section>

      {/* ==================== AI INTELLIGENCE SECTION ==================== */}
      <section style={{ padding: '80px 0', backgroundColor: '#f8f7fa' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
          <AnimatedSection>
            <div style={{
              textAlign: 'center',
              padding: '60px 40px', borderRadius: '24px',
              background: 'linear-gradient(135deg, #1e1b2e, #13111c)',
              border: '1px solid rgba(124, 58, 237, 0.2)',
              position: 'relative', overflow: 'hidden',
            }}>
              <div style={{
                position: 'absolute', inset: 0, pointerEvents: 'none',
                background: 'radial-gradient(ellipse 60% 50% at 50% 0%, rgba(124, 58, 237, 0.2), transparent 70%)',
              }} />
              <div style={{ position: 'relative', zIndex: 1 }}>
                <div style={{
                  display: 'inline-flex', alignItems: 'center', gap: '6px',
                  padding: '6px 14px', borderRadius: '9999px',
                  backgroundColor: 'rgba(124, 58, 237, 0.15)', border: '1px solid rgba(124, 58, 237, 0.3)',
                  fontSize: '13px', fontWeight: 500, color: '#a78bfa',
                  marginBottom: '24px',
                }}>
                  <Brain size={14} />
                  Academic Intelligence Engine
                </div>
                <h2 style={{ fontSize: 'clamp(24px, 3vw, 36px)', fontWeight: 700, color: 'white', letterSpacing: '-0.025em', marginBottom: '16px', maxWidth: '600px', margin: '0 auto 16px' }}>
                  Identify struggling students before it's too late
                </h2>
                <p style={{ fontSize: '16px', color: 'rgba(255,255,255,0.6)', lineHeight: 1.7, maxWidth: '580px', margin: '0 auto' }}>
                  Stellar's transparent rule-based analysis correlates attendance, quiz marks, assignment scores, and lab performance to identify students requiring academic attention — with clear explanations and recommended interventions.
                </p>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ==================== FINAL CTA ==================== */}
      <section style={{ padding: '80px 0', backgroundColor: '#f8f7fa' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
          <AnimatedSection>
            <div style={{ textAlign: 'center' }}>
              <h2 style={{ fontSize: 'clamp(28px, 3.5vw, 40px)', fontWeight: 700, letterSpacing: '-0.025em', color: '#0f172a', marginBottom: '14px' }}>
                Ready to transform your academic workflow?
              </h2>
              <p style={{ fontSize: '17px', color: '#475569', marginBottom: '36px', maxWidth: '500px', margin: '0 auto 36px' }}>
                Start using Stellar today — no complex setup required.
              </p>
              <button
                onClick={() => navigate('/signup')}
                style={{
                  padding: '16px 40px', borderRadius: '9999px', fontSize: '17px', fontWeight: 600,
                  color: 'white', backgroundColor: '#7c3aed', border: '1px solid #8b5cf6',
                  cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '10px',
                  boxShadow: '0 4px 16px rgba(124, 58, 237, 0.3)', transition: 'all 0.2s',
                }}
                onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#6d28d9'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                onMouseLeave={e => { e.currentTarget.style.backgroundColor = '#7c3aed'; e.currentTarget.style.transform = 'translateY(0)'; }}
              >
                Get Started with Stellar
                <ArrowRight size={18} />
              </button>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ==================== FOOTER ==================== */}
      <footer style={{
        padding: '32px 24px', borderTop: '1px solid #e8e7ec', backgroundColor: '#f8f7fa',
      }}>
        <div style={{
          maxWidth: '1200px', margin: '0 auto',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '28px', height: '28px', borderRadius: '8px',
              background: 'linear-gradient(135deg, #7c3aed, #6d28d9)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white',
            }}>
              <Compass size={14} />
            </div>
            <span style={{ fontSize: '14px', fontWeight: 600, color: '#0f172a' }}>Stellar</span>
            <span style={{ fontSize: '12px', color: '#64748b' }}>Academic Intelligence Platform</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
            <a href="#features" style={{ fontSize: '13px', color: '#64748b', transition: 'color 0.2s' }}
              onMouseEnter={e => (e.currentTarget.style.color = '#7c3aed')}
              onMouseLeave={e => (e.currentTarget.style.color = '#64748b')}>Features</a>
            <a href="#how-it-works" style={{ fontSize: '13px', color: '#64748b', transition: 'color 0.2s' }}
              onMouseEnter={e => (e.currentTarget.style.color = '#7c3aed')}
              onMouseLeave={e => (e.currentTarget.style.color = '#64748b')}>How It Works</a>
            <span style={{ fontSize: '12px', color: '#94a3b8' }}>© 2026 Stellar. All rights reserved.</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
