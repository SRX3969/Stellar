import React, { useState } from 'react';
import {
  Sun,
  Moon,
  Shield,
  Bell,
  Sparkles,
  Calendar,
  Check,
  Smartphone,
  Sliders,
  UserCheck,
  Clock
} from 'lucide-react';
import { UserProfile } from '../../types';
import { useToast } from '../common/Toast';

interface SettingsViewProps {
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
  userProfile?: UserProfile;
  onUpdateProfile?: (updated: Partial<UserProfile>) => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  theme,
  onToggleTheme,
  userProfile = {
    name: 'Abhiram',
    email: 'abhiram@nit.edu',
    university: 'National Institute of Technology',
    course: 'Computer Science & Engineering',
    semester: 'Semester 5',
    criterion: 75,
    dailyGoal: 2.0,
  },
  onUpdateProfile,
}) => {
  const [aiReasoningMode, setAiReasoningMode] = useState<'concise' | 'pedagogical'>('pedagogical');
  const [attendanceAlerts, setAttendanceAlerts] = useState(true);
  const [criterion, setCriterion] = useState<number>(userProfile.criterion || 75);
  const [dailyGoal, setDailyGoal] = useState<number>(userProfile.dailyGoal || 2.0);
  const [userName, setUserName] = useState<string>(userProfile.name || 'Abhiram');
  const [savedNotification, setSavedNotification] = useState(false);
  const { showToast } = useToast();

  const handleSave = () => {
    if (onUpdateProfile) {
      onUpdateProfile({
        name: userName,
        criterion,
        dailyGoal,
      });
    }
    setSavedNotification(true);
    showToast('Preferences Saved', 'All threshold criteria, theme, and profile preferences updated.', 'success');
    setTimeout(() => setSavedNotification(false), 2000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px', maxWidth: '840px', margin: '0 auto' }}>
      {/* Header */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
          <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>System Preferences</span>
          <span style={{ color: 'var(--border-strong)' }}>•</span>
          <span style={{ fontSize: '12px', color: 'var(--accent-primary)', fontWeight: 500 }}>STELLAR OS v1.0</span>
        </div>
        <h2 style={{ fontSize: '28px', fontWeight: 600, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
          Settings &amp; Environment
        </h2>
        <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginTop: '4px' }}>
          Customize visual theme, intelligent reasoning thresholds, and notification hygiene.
        </p>
      </div>

      {/* Appearance Section */}
      <div className="card-base" style={{ padding: '22px' }}>
        <h3 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '4px' }}>
          Appearance &amp; Theme
        </h3>
        <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '18px' }}>
          Choose your visual preference. Designed for calm, glare-free nocturnal study sessions.
        </p>

        <div style={{ display: 'flex', gap: '14px' }}>
          <button
            onClick={onToggleTheme}
            style={{
              flex: 1,
              padding: '14px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: theme === 'dark' ? 'var(--surface-elevated)' : 'var(--surface-secondary)',
              border: '1.5px solid',
              borderColor: theme === 'dark' ? 'var(--accent-primary)' : 'var(--border-default)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              color: 'var(--text-primary)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Moon size={18} style={{ color: 'var(--accent-primary)' }} />
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontSize: '14px', fontWeight: 600 }}>Dark Theme (Default)</div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Calm obsidian &amp; champagne accents</div>
              </div>
            </div>
            {theme === 'dark' && <Check size={16} style={{ color: 'var(--accent-primary)' }} />}
          </button>

          <button
            onClick={onToggleTheme}
            style={{
              flex: 1,
              padding: '14px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: theme === 'light' ? 'var(--surface-elevated)' : 'var(--surface-secondary)',
              border: '1.5px solid',
              borderColor: theme === 'light' ? 'var(--accent-primary)' : 'var(--border-default)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              color: 'var(--text-primary)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Sun size={18} style={{ color: 'var(--color-warning)' }} />
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontSize: '14px', fontWeight: 600 }}>Light Theme</div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Clean high-contrast ivory paper</div>
              </div>
            </div>
            {theme === 'light' && <Check size={16} style={{ color: 'var(--accent-primary)' }} />}
          </button>
        </div>
      </div>

      {/* Academic Policy & Thresholds */}
      <div className="card-base" style={{ padding: '22px' }}>
        <h3 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '4px' }}>
          Academic Policy &amp; Thresholds
        </h3>
        <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '18px' }}>
          Adjust mandatory attendance criteria and daily study hour targets.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Minimum Criterion Slider */}
          <div style={{ padding: '16px', backgroundColor: 'var(--surface-secondary)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-default)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <span style={{ fontSize: '14px', fontWeight: 500, color: 'var(--text-primary)' }}>
                  Institutional Attendance Criterion
                </span>
                <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>
                  Used across Attendance simulator, leave buffers, and warning badges.
                </p>
              </div>
              <span style={{ fontSize: '20px', fontWeight: 700, color: 'var(--accent-light)' }}>
                {criterion}%
              </span>
            </div>

            <input
              type="range"
              min={60}
              max={85}
              step={5}
              value={criterion}
              onChange={(e) => setCriterion(Number(e.target.value))}
              style={{ width: '100%', marginTop: '14px', accentColor: 'var(--accent-primary)' }}
            />

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-muted)', marginTop: '6px' }}>
              <span>60% (Lenient)</span>
              <span>75% (Standard)</span>
              <span>85% (Strict)</span>
            </div>
          </div>

          {/* Daily Study Goal */}
          <div style={{ padding: '16px', backgroundColor: 'var(--surface-secondary)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-default)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <div>
                <span style={{ fontSize: '14px', fontWeight: 500, color: 'var(--text-primary)' }}>
                  Target Daily Focus Hours
                </span>
                <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>
                  Target daily study metric on Dashboard &amp; Analytics.
                </p>
              </div>
              <span style={{ fontSize: '18px', fontWeight: 700, color: 'var(--accent-light)' }}>
                {dailyGoal}h / day
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
              {[1.5, 2.0, 3.0].map((hours) => (
                <button
                  key={hours}
                  type="button"
                  onClick={() => setDailyGoal(hours)}
                  style={{
                    padding: '10px',
                    borderRadius: 'var(--radius-sm)',
                    backgroundColor: dailyGoal === hours ? 'var(--surface-elevated)' : 'transparent',
                    border: '1.5px solid',
                    borderColor: dailyGoal === hours ? 'var(--accent-primary)' : 'var(--border-default)',
                    color: dailyGoal === hours ? 'var(--text-primary)' : 'var(--text-secondary)',
                    textAlign: 'center',
                  }}
                >
                  <div style={{ fontSize: '14px', fontWeight: 700 }}>{hours} Hours</div>
                  <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>
                    {hours === 1.5 ? 'Balanced' : hours === 2.0 ? 'Optimal' : 'Intensive'}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* AI Reasoning Preferences */}
      <div className="card-base" style={{ padding: '22px' }}>
        <h3 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '4px' }}>
          AI Tutor Reasoning Preferences
        </h3>
        <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '18px' }}>
          Control how STELLAR reasons through your academic doubt resolution.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div
            onClick={() => setAiReasoningMode('pedagogical')}
            style={{
              padding: '12px 16px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: aiReasoningMode === 'pedagogical' ? 'var(--surface-elevated)' : 'var(--surface-secondary)',
              border: '1px solid',
              borderColor: aiReasoningMode === 'pedagogical' ? 'var(--accent-primary)' : 'var(--border-default)',
              cursor: 'pointer',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <div>
              <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>
                Pedagogical Socratic Reasoning
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>
                Explains foundational axioms first, verifies candidate keys, and provides high-yield exam tips.
              </div>
            </div>
            {aiReasoningMode === 'pedagogical' && <Check size={16} style={{ color: 'var(--accent-primary)' }} />}
          </div>

          <div
            onClick={() => setAiReasoningMode('concise')}
            style={{
              padding: '12px 16px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: aiReasoningMode === 'concise' ? 'var(--surface-elevated)' : 'var(--surface-secondary)',
              border: '1px solid',
              borderColor: aiReasoningMode === 'concise' ? 'var(--accent-primary)' : 'var(--border-default)',
              cursor: 'pointer',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <div>
              <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>
                Direct &amp; Concise Mode
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>
                Yields minimal step answers optimized for immediate problem set verification.
              </div>
            </div>
            {aiReasoningMode === 'concise' && <Check size={16} style={{ color: 'var(--accent-primary)' }} />}
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
        {savedNotification && (
          <span style={{ fontSize: '13px', color: 'var(--color-success)', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Check size={14} /> Preferences synchronized
          </span>
        )}
        <button onClick={handleSave} className="btn btn-accent-solid">
          Save Changes
        </button>
      </div>
    </div>
  );
};

