// Authentication Gateway — Premium Login & Signup Pages
// Proddy AI-inspired design with username/password authentication

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Compass,
  Lock,
  User,
  Mail,
  ArrowRight,
  Eye,
  EyeOff,
  ShieldCheck,
  XCircle,
  CheckCircle2,
  UserCheck,
  GraduationCap,
  BarChart3,
  Brain,
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

// ============================================================
// LOGIN PAGE
// ============================================================

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!username.trim()) { setError('Please enter your username.'); return; }
    if (!password) { setError('Please enter your password.'); return; }
    setIsLoading(true);
    try {
      const result = await login(username, password);
      if (!result.success) {
        setError(result.error || 'Invalid credentials.');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh', display: 'flex',
      backgroundColor: '#f8f7fa', fontFamily: 'var(--font-family)',
    }}>
      {/* Left Panel — Branding */}
      <div className="hide-on-mobile" style={{
        flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center',
        padding: '60px', maxWidth: '560px',
        background: 'linear-gradient(135deg, #1e1b2e 0%, #13111c 100%)',
        position: 'relative', overflow: 'hidden',
      }}>
        {/* Glow */}
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
          <div style={{ position: 'absolute', top: '-20%', left: '-10%', width: '400px', height: '400px', borderRadius: '50%', background: 'rgba(124, 58, 237, 0.15)', filter: 'blur(100px)' }} />
          <div style={{ position: 'absolute', bottom: '-10%', right: '-10%', width: '300px', height: '300px', borderRadius: '50%', background: 'rgba(139, 92, 246, 0.1)', filter: 'blur(80px)' }} />
        </div>

        <div style={{ position: 'relative', zIndex: 1 }}>
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '48px' }}>
            <div style={{
              width: '44px', height: '44px', borderRadius: '12px',
              background: 'linear-gradient(135deg, #7c3aed, #6d28d9)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white',
              boxShadow: '0 4px 16px rgba(124, 58, 237, 0.4)',
            }}>
              <Compass size={24} strokeWidth={2.2} />
            </div>
            <div>
              <span style={{ fontSize: '22px', fontWeight: 700, color: '#fafafa', letterSpacing: '-0.02em' }}>Stellar</span>
              <span style={{ display: 'block', fontSize: '11px', color: '#a78bfa', fontWeight: 500, letterSpacing: '0.05em' }}>ACADEMIC INTELLIGENCE</span>
            </div>
          </div>

          <h1 style={{ fontSize: '32px', fontWeight: 700, color: '#fafafa', lineHeight: 1.2, letterSpacing: '-0.025em', marginBottom: '16px' }}>
            Welcome back to your <span style={{ color: '#a78bfa' }}>academic command center.</span>
          </h1>
          <p style={{ fontSize: '15px', color: 'rgba(255,255,255,0.5)', lineHeight: 1.65, marginBottom: '40px' }}>
            Sign in to access your timetable, attendance tracking, assessments, and AI-powered insights.
          </p>

          {/* Feature highlights */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {[
              { icon: UserCheck, label: 'Smart Attendance Tracking', desc: 'Live 75% criterion buffers' },
              { icon: BarChart3, label: 'Performance Analytics', desc: 'Data-driven insights' },
              { icon: Brain, label: 'AI Academic Intelligence', desc: 'Proactive intervention alerts' },
            ].map((item, i) => {
              const Icon = item.icon;
              return (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <div style={{
                    width: '36px', height: '36px', borderRadius: '10px',
                    backgroundColor: 'rgba(124, 58, 237, 0.15)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#a78bfa',
                  }}>
                    <Icon size={18} />
                  </div>
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: 600, color: '#e2e8f0' }}>{item.label}</div>
                    <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.35)' }}>{item.desc}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Right Panel — Login Form */}
      <div style={{
        flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '40px 24px',
      }}>
        <div style={{ width: '100%', maxWidth: '420px' }}>
          {/* Mobile Logo */}
          <div style={{ display: 'none', marginBottom: '32px', textAlign: 'center' }} className="show-on-mobile">
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '10px' }}>
              <div style={{
                width: '36px', height: '36px', borderRadius: '10px',
                background: 'linear-gradient(135deg, #7c3aed, #6d28d9)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white',
              }}>
                <Compass size={20} />
              </div>
              <span style={{ fontSize: '20px', fontWeight: 700, color: '#0f172a' }}>Stellar</span>
            </div>
          </div>

          <h2 style={{ fontSize: '26px', fontWeight: 700, color: '#0f172a', letterSpacing: '-0.02em', marginBottom: '6px' }}>
            Sign in to your account
          </h2>
          <p style={{ fontSize: '14px', color: '#64748b', marginBottom: '28px' }}>
            Enter your username and password to continue
          </p>

          {/* Error */}
          {error && (
            <div style={{
              padding: '12px 16px', borderRadius: '12px',
              backgroundColor: 'rgba(239, 68, 68, 0.08)', border: '1px solid rgba(239, 68, 68, 0.2)',
              color: '#dc2626', fontSize: '13px', marginBottom: '20px',
              display: 'flex', alignItems: 'center', gap: '10px',
            }}>
              <XCircle size={16} style={{ flexShrink: 0 }} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            {/* Username */}
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                Username
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  value={username}
                  onChange={e => { setUsername(e.target.value); setError(null); }}
                  placeholder="e.g. stellar_student"
                  autoComplete="username"
                  style={{
                    width: '100%', padding: '12px 14px 12px 42px', borderRadius: '12px',
                    backgroundColor: 'white', border: '1px solid #e2e1e6', color: '#0f172a',
                    fontSize: '14px', transition: 'border-color 0.2s, box-shadow 0.2s',
                    outline: 'none',
                  }}
                  onFocus={e => { e.target.style.borderColor = '#7c3aed'; e.target.style.boxShadow = '0 0 0 3px rgba(124, 58, 237, 0.1)'; }}
                  onBlur={e => { e.target.style.borderColor = '#e2e1e6'; e.target.style.boxShadow = 'none'; }}
                />
                <User size={16} style={{ position: 'absolute', left: '14px', top: '14px', color: '#94a3b8' }} />
              </div>
            </div>

            {/* Password */}
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => { setPassword(e.target.value); setError(null); }}
                  placeholder="••••••••••"
                  autoComplete="current-password"
                  style={{
                    width: '100%', padding: '12px 42px 12px 42px', borderRadius: '12px',
                    backgroundColor: 'white', border: '1px solid #e2e1e6', color: '#0f172a',
                    fontSize: '14px', transition: 'border-color 0.2s, box-shadow 0.2s',
                    outline: 'none',
                  }}
                  onFocus={e => { e.target.style.borderColor = '#7c3aed'; e.target.style.boxShadow = '0 0 0 3px rgba(124, 58, 237, 0.1)'; }}
                  onBlur={e => { e.target.style.borderColor = '#e2e1e6'; e.target.style.boxShadow = 'none'; }}
                />
                <Lock size={16} style={{ position: 'absolute', left: '14px', top: '14px', color: '#94a3b8' }} />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  style={{ position: 'absolute', right: '12px', top: '12px', background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '2px' }}>
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              style={{
                width: '100%', padding: '13px', borderRadius: '12px', fontSize: '15px', fontWeight: 600,
                color: 'white', backgroundColor: '#7c3aed', border: '1px solid #8b5cf6',
                cursor: isLoading ? 'wait' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                boxShadow: '0 2px 8px rgba(124, 58, 237, 0.3)', transition: 'all 0.2s',
                opacity: isLoading ? 0.7 : 1, marginTop: '4px',
              }}
              onMouseEnter={e => { if (!isLoading) { e.currentTarget.style.backgroundColor = '#6d28d9'; e.currentTarget.style.transform = 'translateY(-1px)'; } }}
              onMouseLeave={e => { e.currentTarget.style.backgroundColor = '#7c3aed'; e.currentTarget.style.transform = 'translateY(0)'; }}
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
              {!isLoading && <ArrowRight size={16} />}
            </button>

            {/* Signup Link */}
            <div style={{ textAlign: 'center', marginTop: '4px' }}>
              <span style={{ fontSize: '14px', color: '#64748b' }}>
                Don't have an account?{' '}
                <Link to="/signup" style={{ color: '#7c3aed', fontWeight: 600, textDecoration: 'none' }}>
                  Create one
                </Link>
              </span>
            </div>

            {/* Security */}
            <div style={{ paddingTop: '16px', borderTop: '1px solid #e8e7ec', textAlign: 'center' }}>
              <div style={{ fontSize: '12px', color: '#94a3b8', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                <ShieldCheck size={14} style={{ color: '#7c3aed' }} />
                Secured with encrypted authentication
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

// ============================================================
// SIGNUP PAGE
// ============================================================

export const SignupPage: React.FC = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [username, setUsername] = useState('');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const passwordChecks = {
    hasMinLength: password.length >= 8,
    hasUpper: /[A-Z]/.test(password),
    hasLower: /[a-z]/.test(password),
    hasNumber: /[0-9]/.test(password),
  };
  const passwordScore = Object.values(passwordChecks).filter(Boolean).length;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!username.trim()) { setError('Please enter a username.'); return; }
    if (username.trim().length < 3) { setError('Username must be at least 3 characters.'); return; }
    if (!/^[a-zA-Z0-9_]+$/.test(username.trim())) { setError('Username can only contain letters, numbers, and underscores.'); return; }
    if (!fullName.trim()) { setError('Please enter your full name.'); return; }
    if (!email.trim()) { setError('Please enter your email address.'); return; }
    if (!password) { setError('Please create a password.'); return; }
    if (password.length < 8) { setError('Password must be at least 8 characters.'); return; }
    if (password !== confirmPassword) { setError('Passwords do not match.'); return; }

    setIsLoading(true);
    try {
      const result = await register(username.trim(), email.trim(), password, fullName.trim());
      if (!result.success) {
        setError(result.error || 'Registration failed.');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh', display: 'flex',
      backgroundColor: '#f8f7fa', fontFamily: 'var(--font-family)',
    }}>
      {/* Left Panel — Branding */}
      <div className="hide-on-mobile" style={{
        flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center',
        padding: '60px', maxWidth: '560px',
        background: 'linear-gradient(135deg, #1e1b2e 0%, #13111c 100%)',
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
          <div style={{ position: 'absolute', top: '-20%', left: '-10%', width: '400px', height: '400px', borderRadius: '50%', background: 'rgba(124, 58, 237, 0.15)', filter: 'blur(100px)' }} />
          <div style={{ position: 'absolute', bottom: '-10%', right: '-10%', width: '300px', height: '300px', borderRadius: '50%', background: 'rgba(139, 92, 246, 0.1)', filter: 'blur(80px)' }} />
        </div>

        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '48px' }}>
            <div style={{
              width: '44px', height: '44px', borderRadius: '12px',
              background: 'linear-gradient(135deg, #7c3aed, #6d28d9)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white',
              boxShadow: '0 4px 16px rgba(124, 58, 237, 0.4)',
            }}>
              <Compass size={24} strokeWidth={2.2} />
            </div>
            <div>
              <span style={{ fontSize: '22px', fontWeight: 700, color: '#fafafa', letterSpacing: '-0.02em' }}>Stellar</span>
              <span style={{ display: 'block', fontSize: '11px', color: '#a78bfa', fontWeight: 500, letterSpacing: '0.05em' }}>ACADEMIC INTELLIGENCE</span>
            </div>
          </div>

          <h1 style={{ fontSize: '32px', fontWeight: 700, color: '#fafafa', lineHeight: 1.2, letterSpacing: '-0.025em', marginBottom: '16px' }}>
            Start your <span style={{ color: '#a78bfa' }}>intelligent academic journey.</span>
          </h1>
          <p style={{ fontSize: '15px', color: 'rgba(255,255,255,0.5)', lineHeight: 1.65, marginBottom: '40px' }}>
            Create your student account to access timetable, attendance tracking, study tools, and personalized insights.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {[
              { icon: GraduationCap, label: 'Student Dashboard', desc: 'Your academic command center' },
              { icon: UserCheck, label: 'Attendance Monitoring', desc: 'Live criterion tracking' },
              { icon: Brain, label: 'AI Study Tutor', desc: 'Personalized learning assistant' },
            ].map((item, i) => {
              const Icon = item.icon;
              return (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <div style={{
                    width: '36px', height: '36px', borderRadius: '10px',
                    backgroundColor: 'rgba(124, 58, 237, 0.15)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#a78bfa',
                  }}>
                    <Icon size={18} />
                  </div>
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: 600, color: '#e2e8f0' }}>{item.label}</div>
                    <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.35)' }}>{item.desc}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Right Panel — Signup Form */}
      <div style={{
        flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '40px 24px', overflowY: 'auto',
      }}>
        <div style={{ width: '100%', maxWidth: '420px' }}>
          <h2 style={{ fontSize: '26px', fontWeight: 700, color: '#0f172a', letterSpacing: '-0.02em', marginBottom: '6px' }}>
            Create your account
          </h2>
          <p style={{ fontSize: '14px', color: '#64748b', marginBottom: '28px' }}>
            Student accounts only. Admin and teacher accounts are provisioned by your institution.
          </p>

          {error && (
            <div style={{
              padding: '12px 16px', borderRadius: '12px',
              backgroundColor: 'rgba(239, 68, 68, 0.08)', border: '1px solid rgba(239, 68, 68, 0.2)',
              color: '#dc2626', fontSize: '13px', marginBottom: '20px',
              display: 'flex', alignItems: 'center', gap: '10px',
            }}>
              <XCircle size={16} style={{ flexShrink: 0 }} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Username */}
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                Username *
              </label>
              <div style={{ position: 'relative' }}>
                <input type="text" value={username} onChange={e => { setUsername(e.target.value); setError(null); }}
                  placeholder="e.g. john_doe" autoComplete="username"
                  style={{ width: '100%', padding: '11px 14px 11px 42px', borderRadius: '12px', backgroundColor: 'white', border: '1px solid #e2e1e6', color: '#0f172a', fontSize: '14px', outline: 'none', transition: 'border-color 0.2s, box-shadow 0.2s' }}
                  onFocus={e => { e.target.style.borderColor = '#7c3aed'; e.target.style.boxShadow = '0 0 0 3px rgba(124, 58, 237, 0.1)'; }}
                  onBlur={e => { e.target.style.borderColor = '#e2e1e6'; e.target.style.boxShadow = 'none'; }}
                />
                <User size={16} style={{ position: 'absolute', left: '14px', top: '13px', color: '#94a3b8' }} />
              </div>
            </div>

            {/* Full Name */}
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                Full Name *
              </label>
              <input type="text" value={fullName} onChange={e => { setFullName(e.target.value); setError(null); }}
                placeholder="e.g. John Doe"
                style={{ width: '100%', padding: '11px 14px', borderRadius: '12px', backgroundColor: 'white', border: '1px solid #e2e1e6', color: '#0f172a', fontSize: '14px', outline: 'none', transition: 'border-color 0.2s, box-shadow 0.2s' }}
                onFocus={e => { e.target.style.borderColor = '#7c3aed'; e.target.style.boxShadow = '0 0 0 3px rgba(124, 58, 237, 0.1)'; }}
                onBlur={e => { e.target.style.borderColor = '#e2e1e6'; e.target.style.boxShadow = 'none'; }}
              />
            </div>

            {/* Email */}
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                Email Address *
              </label>
              <div style={{ position: 'relative' }}>
                <input type="email" value={email} onChange={e => { setEmail(e.target.value); setError(null); }}
                  placeholder="you@example.com" autoComplete="email"
                  style={{ width: '100%', padding: '11px 14px 11px 42px', borderRadius: '12px', backgroundColor: 'white', border: '1px solid #e2e1e6', color: '#0f172a', fontSize: '14px', outline: 'none', transition: 'border-color 0.2s, box-shadow 0.2s' }}
                  onFocus={e => { e.target.style.borderColor = '#7c3aed'; e.target.style.boxShadow = '0 0 0 3px rgba(124, 58, 237, 0.1)'; }}
                  onBlur={e => { e.target.style.borderColor = '#e2e1e6'; e.target.style.boxShadow = 'none'; }}
                />
                <Mail size={16} style={{ position: 'absolute', left: '14px', top: '13px', color: '#94a3b8' }} />
              </div>
            </div>

            {/* Password */}
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                Password *
              </label>
              <div style={{ position: 'relative' }}>
                <input type={showPassword ? 'text' : 'password'} value={password}
                  onChange={e => { setPassword(e.target.value); setError(null); }}
                  placeholder="At least 8 characters" autoComplete="new-password"
                  style={{ width: '100%', padding: '11px 42px 11px 42px', borderRadius: '12px', backgroundColor: 'white', border: '1px solid #e2e1e6', color: '#0f172a', fontSize: '14px', outline: 'none', transition: 'border-color 0.2s, box-shadow 0.2s' }}
                  onFocus={e => { e.target.style.borderColor = '#7c3aed'; e.target.style.boxShadow = '0 0 0 3px rgba(124, 58, 237, 0.1)'; }}
                  onBlur={e => { e.target.style.borderColor = '#e2e1e6'; e.target.style.boxShadow = 'none'; }}
                />
                <Lock size={16} style={{ position: 'absolute', left: '14px', top: '13px', color: '#94a3b8' }} />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  style={{ position: 'absolute', right: '12px', top: '11px', background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '2px' }}>
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {/* Strength indicator */}
              {password && (
                <div style={{ marginTop: '10px' }}>
                  <div style={{ display: 'flex', gap: '4px', marginBottom: '8px' }}>
                    {[1, 2, 3, 4].map((s) => (
                      <div key={s} style={{ flex: 1, height: '3px', borderRadius: '2px', backgroundColor: passwordScore >= s ? (passwordScore <= 2 ? '#f59e0b' : '#22c55e') : '#e2e1e6', transition: 'background-color 0.2s' }} />
                    ))}
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px' }}>
                    {[
                      { ok: passwordChecks.hasMinLength, label: '8+ characters' },
                      { ok: passwordChecks.hasUpper, label: 'Uppercase (A-Z)' },
                      { ok: passwordChecks.hasLower, label: 'Lowercase (a-z)' },
                      { ok: passwordChecks.hasNumber, label: 'Number (0-9)' },
                    ].map((c, i) => (
                      <span key={i} style={{ fontSize: '11px', color: c.ok ? '#22c55e' : '#94a3b8' }}>
                        {c.ok ? '✓' : '•'} {c.label}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                Confirm Password *
              </label>
              <div style={{ position: 'relative' }}>
                <input type={showPassword ? 'text' : 'password'} value={confirmPassword}
                  onChange={e => { setConfirmPassword(e.target.value); setError(null); }}
                  placeholder="Re-enter password" autoComplete="new-password"
                  style={{ width: '100%', padding: '11px 14px 11px 42px', borderRadius: '12px', backgroundColor: 'white', border: `1px solid ${confirmPassword && confirmPassword !== password ? '#ef4444' : '#e2e1e6'}`, color: '#0f172a', fontSize: '14px', outline: 'none', transition: 'border-color 0.2s, box-shadow 0.2s' }}
                  onFocus={e => { e.target.style.borderColor = '#7c3aed'; e.target.style.boxShadow = '0 0 0 3px rgba(124, 58, 237, 0.1)'; }}
                  onBlur={e => { e.target.style.borderColor = confirmPassword && confirmPassword !== password ? '#ef4444' : '#e2e1e6'; e.target.style.boxShadow = 'none'; }}
                />
                <Lock size={16} style={{ position: 'absolute', left: '14px', top: '13px', color: '#94a3b8' }} />
              </div>
              {confirmPassword && confirmPassword !== password && (
                <p style={{ fontSize: '12px', color: '#ef4444', marginTop: '4px' }}>Passwords do not match</p>
              )}
            </div>

            {/* Submit */}
            <button type="submit" disabled={isLoading}
              style={{
                width: '100%', padding: '13px', borderRadius: '12px', fontSize: '15px', fontWeight: 600,
                color: 'white', backgroundColor: '#7c3aed', border: '1px solid #8b5cf6',
                cursor: isLoading ? 'wait' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                boxShadow: '0 2px 8px rgba(124, 58, 237, 0.3)', transition: 'all 0.2s',
                opacity: isLoading ? 0.7 : 1, marginTop: '4px',
              }}
              onMouseEnter={e => { if (!isLoading) { e.currentTarget.style.backgroundColor = '#6d28d9'; } }}
              onMouseLeave={e => { e.currentTarget.style.backgroundColor = '#7c3aed'; }}
            >
              {isLoading ? 'Creating account...' : 'Create Student Account'}
              {!isLoading && <ArrowRight size={16} />}
            </button>

            {/* Login Link */}
            <div style={{ textAlign: 'center', marginTop: '4px' }}>
              <span style={{ fontSize: '14px', color: '#64748b' }}>
                Already have an account?{' '}
                <Link to="/login" style={{ color: '#7c3aed', fontWeight: 600, textDecoration: 'none' }}>
                  Sign in
                </Link>
              </span>
            </div>

            <div style={{ paddingTop: '16px', borderTop: '1px solid #e8e7ec', textAlign: 'center' }}>
              <div style={{ fontSize: '12px', color: '#94a3b8', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                <ShieldCheck size={14} style={{ color: '#7c3aed' }} />
                Passwords are securely hashed — never stored in plaintext
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

// Keep legacy export for backwards compatibility
export const AuthGateway = LoginPage;
