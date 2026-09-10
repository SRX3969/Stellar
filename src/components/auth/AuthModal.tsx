import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import {
  Compass,
  Mail,
  Lock,
  User,
  ArrowRight,
  Eye,
  EyeOff,
  CheckCircle2,
  XCircle,
  ShieldCheck,
  LogOut,
  Sparkles
} from 'lucide-react';
import { useToast } from '../common/Toast';
import { db, validateGmailAddress, validatePasswordStrength } from '../../services/db';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (userName: string, email?: string, batch?: 'B1' | 'B2') => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [batch, setBatch] = useState<'B1' | 'B2'>('B1');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const { showToast } = useToast();
  const currentUser = db.getCurrentUser();

  // Password validation analysis for sign-up
  const passAnalysis = validatePasswordStrength(password);
  const emailAnalysis = validateGmailAddress(email);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsLoading(true);

    try {
      if (mode === 'signup') {
        const result = await db.register(email, password, name, batch);
        if (!result.success || !result.user) {
          setErrorMessage(result.error || 'Registration failed. Please check inputs.');
          setIsLoading(false);
          return;
        }

        showToast('Account Created', `Welcome to STELLAR, ${result.user.fullName}.`, 'success');
        onSuccess(result.user.fullName, result.user.email, result.user.batch);
        onClose();
      } else {
        const result = await db.login(email, password);
        if (!result.success || !result.user) {
          setErrorMessage(result.error || 'Invalid credentials. Please verify your Gmail & password.');
          setIsLoading(false);
          return;
        }

        showToast('Authenticated', `Welcome back, ${result.user.fullName}.`, 'success');
        onSuccess(result.user.fullName, result.user.email, result.user.batch);
        onClose();
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'An unexpected error occurred. Please retry.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleOAuth = async () => {
    setIsLoading(true);
    try {
      const googleEmail = email.trim().toLowerCase().endsWith('@gmail.com')
        ? email.trim().toLowerCase()
        : 'abhiram.stellar@gmail.com';
      const googleName = name.trim() || 'Abhiram';

      const result = await db.googleOAuthSignIn(googleEmail, googleName);
      showToast('Google Sign-In Successful', `Signed in with ${result.user.email}`, 'success');
      onSuccess(result.user.fullName, result.user.email, result.user.batch);
      onClose();
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    db.logout();
    showToast('Signed Out', 'You have been signed out of your STELLAR session.', 'info');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="460px">
      {/* If currently logged in, show active user card */}
      {currentUser && (
        <div
          style={{
            padding: '12px 16px',
            marginBottom: '16px',
            borderRadius: 'var(--radius-sm)',
            backgroundColor: 'var(--surface-primary)',
            border: '1px solid var(--border-default)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                backgroundColor: 'var(--accent-primary)',
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 600,
                fontSize: '13px',
              }}
            >
              {currentUser.fullName.charAt(0)}
            </div>
            <div>
              <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>
                {currentUser.fullName}
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                {currentUser.email} • Batch {currentUser.batch}
              </div>
            </div>
          </div>

          <button
            onClick={handleLogout}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              fontSize: '11px',
            }}
          >
            <LogOut size={12} />
            <span>Switch</span>
          </button>
        </div>
      )}

      {/* Header */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', marginBottom: '18px' }}>
        <div
          style={{
            width: '42px',
            height: '42px',
            borderRadius: '12px',
            backgroundColor: 'var(--surface-elevated)',
            border: '1px solid var(--border-strong)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--accent-primary)',
            marginBottom: '10px',
          }}
        >
          <Compass size={24} strokeWidth={2.2} />
        </div>
        <h3 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
          {mode === 'login' ? 'Sign in to STELLAR OS' : 'Create Student Account'}
        </h3>
        <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>
          Department of AI &amp; Data Science Engineering • III Sem
        </p>
      </div>

      {/* Error message banner */}
      {errorMessage && (
        <div
          style={{
            padding: '10px 14px',
            borderRadius: 'var(--radius-sm)',
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            color: '#f87171',
            fontSize: '12px',
            marginBottom: '14px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <XCircle size={14} style={{ flexShrink: 0 }} />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Google OAuth Quick Button */}
      <button
        type="button"
        onClick={handleGoogleOAuth}
        disabled={isLoading}
        style={{
          width: '100%',
          padding: '10px',
          borderRadius: 'var(--radius-sm)',
          backgroundColor: 'var(--surface-elevated)',
          border: '1px solid var(--border-strong)',
          color: 'var(--text-primary)',
          fontSize: '13px',
          fontWeight: 500,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '10px',
          cursor: 'pointer',
          marginBottom: '16px',
        }}
      >
        <svg width="16" height="16" viewBox="0 0 24 24">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
        </svg>
        <span>Continue with Google Account</span>
      </button>

      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
        <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--border-default)' }} />
        <span style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
          Or with Gmail &amp; Password
        </span>
        <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--border-default)' }} />
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {mode === 'signup' && (
          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '4px' }}>
              Full Name *
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Abhiram"
                style={{
                  width: '100%',
                  padding: '9px 12px 9px 34px',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: 'var(--surface-primary)',
                  border: '1px solid var(--border-default)',
                  color: 'var(--text-primary)',
                  fontSize: '13px',
                }}
              />
              <User size={14} style={{ position: 'absolute', left: '11px', top: '12px', color: 'var(--text-muted)' }} />
            </div>
          </div>
        )}

        {/* Gmail Address */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
            <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)' }}>
              Gmail Address *
            </label>
            {email && (
              <span style={{ fontSize: '11px', color: emailAnalysis.isValid ? 'var(--color-success)' : 'var(--color-danger)' }}>
                {emailAnalysis.isValid ? '✓ Valid Gmail' : 'Requires @gmail.com'}
              </span>
            )}
          </div>
          <div style={{ position: 'relative' }}>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setErrorMessage(null);
              }}
              placeholder="yourname@gmail.com"
              style={{
                width: '100%',
                padding: '9px 12px 9px 34px',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: 'var(--surface-primary)',
                border: `1px solid ${email && !emailAnalysis.isValid ? 'var(--color-danger)' : 'var(--border-default)'}`,
                color: 'var(--text-primary)',
                fontSize: '13px',
              }}
            />
            <Mail size={14} style={{ position: 'absolute', left: '11px', top: '12px', color: 'var(--text-muted)' }} />
          </div>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '3px' }}>
            Demo: <code>abhiram.stellar@gmail.com</code> (Password: <code>StellarAI@2026</code>)
          </div>
        </div>

        {/* Batch Selection for Sign Up */}
        {mode === 'signup' && (
          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '4px' }}>
              Allocated Practical Lab Batch *
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              <button
                type="button"
                onClick={() => setBatch('B1')}
                style={{
                  padding: '8px',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '12px',
                  fontWeight: batch === 'B1' ? 600 : 400,
                  backgroundColor: batch === 'B1' ? 'var(--accent-primary)' : 'var(--surface-primary)',
                  color: batch === 'B1' ? '#fff' : 'var(--text-secondary)',
                  border: '1px solid var(--border-default)',
                  cursor: 'pointer',
                }}
              >
                Batch 1 (B1)
              </button>
              <button
                type="button"
                onClick={() => setBatch('B2')}
                style={{
                  padding: '8px',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '12px',
                  fontWeight: batch === 'B2' ? 600 : 400,
                  backgroundColor: batch === 'B2' ? 'var(--accent-primary)' : 'var(--surface-primary)',
                  color: batch === 'B2' ? '#fff' : 'var(--text-secondary)',
                  border: '1px solid var(--border-default)',
                  cursor: 'pointer',
                }}
              >
                Batch 2 (B2)
              </button>
            </div>
          </div>
        )}

        {/* Password */}
        <div>
          <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '4px' }}>
            Password *
          </label>
          <div style={{ position: 'relative' }}>
            <input
              type={showPassword ? 'text' : 'password'}
              required
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setErrorMessage(null);
              }}
              placeholder="••••••••••••"
              style={{
                width: '100%',
                padding: '9px 34px 9px 34px',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: 'var(--surface-primary)',
                border: '1px solid var(--border-default)',
                color: 'var(--text-primary)',
                fontSize: '13px',
              }}
            />
            <Lock size={14} style={{ position: 'absolute', left: '11px', top: '12px', color: 'var(--text-muted)' }} />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: 'absolute',
                right: '10px',
                top: '10px',
                background: 'none',
                border: 'none',
                color: 'var(--text-muted)',
                cursor: 'pointer',
              }}
            >
              {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
            </button>
          </div>

          {/* Password Security Checklist (Shown during Sign-Up) */}
          {mode === 'signup' && (
            <div style={{ marginTop: '8px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {/* Strength Bar */}
              <div style={{ display: 'flex', gap: '4px', height: '4px', marginTop: '2px' }}>
                {[1, 2, 3, 4].map((step) => (
                  <div
                    key={step}
                    style={{
                      flex: 1,
                      borderRadius: '2px',
                      backgroundColor:
                        passAnalysis.score >= step
                          ? passAnalysis.score <= 2
                            ? 'var(--color-warning)'
                            : 'var(--color-success)'
                          : 'var(--surface-elevated)',
                    }}
                  />
                ))}
              </div>

              {/* Requirement points */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px', marginTop: '6px', fontSize: '11px' }}>
                <span style={{ color: passAnalysis.hasMinLength ? 'var(--color-success)' : 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  {passAnalysis.hasMinLength ? '✓' : '•'} 8+ characters
                </span>
                <span style={{ color: passAnalysis.hasUpper ? 'var(--color-success)' : 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  {passAnalysis.hasUpper ? '✓' : '•'} Uppercase (A-Z)
                </span>
                <span style={{ color: passAnalysis.hasLower ? 'var(--color-success)' : 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  {passAnalysis.hasLower ? '✓' : '•'} Lowercase (a-z)
                </span>
                <span style={{ color: passAnalysis.hasNumber ? 'var(--color-success)' : 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  {passAnalysis.hasNumber ? '✓' : '•'} Number (0-9)
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isLoading}
          className="btn btn-accent-solid"
          style={{ width: '100%', padding: '10px', marginTop: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
        >
          <span>{isLoading ? 'Authenticating...' : mode === 'login' ? 'Sign In' : 'Complete Registration'}</span>
          <ArrowRight size={14} />
        </button>

        {/* Toggle Mode */}
        <div style={{ textAlign: 'center', marginTop: '6px' }}>
          <button
            type="button"
            onClick={() => {
              setMode(mode === 'login' ? 'signup' : 'login');
              setErrorMessage(null);
            }}
            style={{ fontSize: '12px', color: 'var(--text-muted)', background: 'none', border: 'none', cursor: 'pointer' }}
          >
            {mode === 'login' ? (
              <>New to STELLAR? <span style={{ color: 'var(--accent-light)', fontWeight: 600 }}>Create an account</span></>
            ) : (
              <>Already have a registered account? <span style={{ color: 'var(--accent-light)', fontWeight: 600 }}>Sign in</span></>
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
};
