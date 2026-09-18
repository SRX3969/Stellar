// Faculty Portal Settings & Profile
import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../common/Toast';
import { Settings, User, Bell, Shield, Save, Key, Mail, Building } from 'lucide-react';

export const TeacherSettings: React.FC = () => {
  const { user, updateUser } = useAuth();
  const { showToast } = useToast();

  const [form, setForm] = useState({
    fullName: user?.fullName || 'Prof. Swati Raj',
    email: user?.email || 'swati.raj@stellar.edu',
    department: user?.department || 'Department of AI and Data Science Engineering',
    designation: user?.designation || 'Assistant Professor',
    employeeId: user?.employeeId || 'FAC-2026-001',
    specialization: user?.specialization || 'Database Management Systems & Information Systems',
    roomNo: user?.roomNo || 'Cabin 304, 3F Arch Block',
    attendanceAlertThreshold: '75',
    autoNotifyAbsence: true,
    emailDailyDigest: false,
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateUser({
      fullName: form.fullName,
      email: form.email,
      department: form.department,
      designation: form.designation,
      specialization: form.specialization,
      roomNo: form.roomNo,
    });
    showToast('Faculty Profile Updated', 'Settings and notification preferences saved.', 'success');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '900px', margin: '0 auto' }}>
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
          <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Faculty Portal</span>
          <span style={{ color: 'var(--border-strong)' }}>•</span>
          <span style={{ fontSize: '12px', color: 'var(--accent-primary)', fontWeight: 500 }}>Preferences</span>
        </div>
        <h2 style={{ fontSize: '24px', fontWeight: 600 }}>Faculty Profile & Preferences</h2>
        <p style={{ fontSize: '14px', color: 'var(--text-muted)' }}>
          Manage your faculty profile details, course settings, and alert rules.
        </p>
      </div>

      <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {/* Profile Details */}
        <div className="card-base" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <User size={16} style={{ color: 'var(--accent-primary)' }} />
            Academic Information
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '4px' }}>
                Full Name
              </label>
              <input value={form.fullName} onChange={e => setForm(p => ({ ...p, fullName: e.target.value }))} style={{ width: '100%' }} />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '4px' }}>
                Institutional Email
              </label>
              <input value={form.email} disabled style={{ width: '100%', opacity: 0.7 }} />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '4px' }}>
                Employee ID
              </label>
              <input value={form.employeeId} disabled style={{ width: '100%', opacity: 0.7 }} />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '4px' }}>
                Designation
              </label>
              <input value={form.designation} onChange={e => setForm(p => ({ ...p, designation: e.target.value }))} style={{ width: '100%' }} />
            </div>

            <div style={{ gridColumn: '1 / -1' }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '4px' }}>
                Academic Department
              </label>
              <input value={form.department} onChange={e => setForm(p => ({ ...p, department: e.target.value }))} style={{ width: '100%' }} />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '4px' }}>
                Specialization / Domain
              </label>
              <input value={form.specialization} onChange={e => setForm(p => ({ ...p, specialization: e.target.value }))} style={{ width: '100%' }} />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '4px' }}>
                Faculty Cabin / Room
              </label>
              <input value={form.roomNo} onChange={e => setForm(p => ({ ...p, roomNo: e.target.value }))} style={{ width: '100%' }} />
            </div>
          </div>
        </div>

        {/* Attendance Alert Rules */}
        <div className="card-base" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Bell size={16} style={{ color: 'var(--accent-primary)' }} />
            Classroom & Notification Rules
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={form.autoNotifyAbsence}
                onChange={e => setForm(p => ({ ...p, autoNotifyAbsence: e.target.checked }))}
                style={{ width: '16px', height: '16px', accentColor: 'var(--accent-primary)' }}
              />
              <div>
                <div style={{ fontSize: '14px', fontWeight: 500 }}>Automatic Absence Notifications</div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Send notification to student when marked absent for 2 consecutive sessions</div>
              </div>
            </label>

            <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={form.emailDailyDigest}
                onChange={e => setForm(p => ({ ...p, emailDailyDigest: e.target.checked }))}
                style={{ width: '16px', height: '16px', accentColor: 'var(--accent-primary)' }}
              />
              <div>
                <div style={{ fontSize: '14px', fontWeight: 500 }}>Daily Session Summary Digest</div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Receive an end-of-day summary of recorded attendance and pending evaluations</div>
              </div>
            </label>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button type="submit" className="btn btn-accent-solid" style={{ gap: '8px', padding: '10px 24px' }}>
            <Save size={16} /> Save Faculty Preferences
          </button>
        </div>
      </form>
    </div>
  );
};
