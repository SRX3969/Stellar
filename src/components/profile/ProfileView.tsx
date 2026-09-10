import React, { useState } from 'react';
import {
  User,
  GraduationCap,
  BookOpen,
  Mail,
  Calendar,
  Shield,
  Award,
  Edit2,
  Check,
  Sparkles
} from 'lucide-react';
import { SUBJECTS as DEFAULT_SUBJECTS } from '../../data/mockData';
import { Subject, UserProfile } from '../../types';
import { useToast } from '../common/Toast';

interface ProfileViewProps {
  userProfile?: UserProfile;
  subjects?: Subject[];
  onUpdateProfile?: (updated: Partial<UserProfile>) => void;
  onOpenOnboarding?: () => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  userProfile = {
    name: 'Abhiram',
    email: 'abhiram@nit.edu',
    university: 'National Institute of Technology',
    course: 'Computer Science & Engineering',
    semester: 'Semester 5',
    criterion: 75,
    dailyGoal: 2.0,
    studentId: 'CS24-BTECH-9082',
    registrationBatch: 'Batch of 2027',
  },
  subjects = DEFAULT_SUBJECTS,
  onUpdateProfile,
  onOpenOnboarding,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(userProfile.name);
  const [email, setEmail] = useState(userProfile.email || 'abhiram@nit.edu');
  const [university, setUniversity] = useState(userProfile.university);
  const [course, setCourse] = useState(userProfile.course);
  const [semester, setSemester] = useState(userProfile.semester);
  const [dailyGoal, setDailyGoal] = useState(userProfile.dailyGoal);
  const { showToast } = useToast();

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (onUpdateProfile) {
      onUpdateProfile({
        name,
        email,
        university,
        course,
        semester,
        dailyGoal,
      });
    }
    setIsEditing(false);
    showToast('Profile Updated', 'Student identity and academic credentials synchronized.', 'success');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px', maxWidth: '840px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Student Identity</span>
            <span style={{ color: 'var(--border-strong)' }}>•</span>
            <span style={{ fontSize: '12px', color: 'var(--accent-primary)', fontWeight: 500 }}>Active Matriculation</span>
          </div>
          <h2 style={{ fontSize: '28px', fontWeight: 600, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
            Academic Profile
          </h2>
          <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginTop: '4px' }}>
            Your verified student record, institutional affiliation, and enrolled credits.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          {onOpenOnboarding && (
            <button
              onClick={onOpenOnboarding}
              className="btn btn-secondary"
              style={{ fontSize: '12px' }}
            >
              <Sparkles size={13} style={{ color: 'var(--accent-primary)' }} />
              <span>Run Setup Wizard</span>
            </button>
          )}

          <button
            onClick={() => setIsEditing(!isEditing)}
            className="btn btn-primary"
            style={{ fontSize: '12px' }}
          >
            <Edit2 size={13} />
            <span>{isEditing ? 'Cancel' : 'Edit Profile'}</span>
          </button>
        </div>
      </div>

      {/* Inline Edit Mode */}
      {isEditing ? (
        <form onSubmit={handleSave} className="card-base" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-primary)' }}>
            Edit Academic Credentials
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                style={{ width: '100%' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                University Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{ width: '100%' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                Institution
              </label>
              <input
                type="text"
                value={university}
                onChange={(e) => setUniversity(e.target.value)}
                required
                style={{ width: '100%' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                Degree / Major
              </label>
              <input
                type="text"
                value={course}
                onChange={(e) => setCourse(e.target.value)}
                required
                style={{ width: '100%' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                Current Semester
              </label>
              <input
                type="text"
                value={semester}
                onChange={(e) => setSemester(e.target.value)}
                required
                style={{ width: '100%' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                Daily Study Target (Hours)
              </label>
              <input
                type="number"
                step="0.5"
                min="0.5"
                max="8"
                value={dailyGoal}
                onChange={(e) => setDailyGoal(Number(e.target.value))}
                required
                style={{ width: '100%' }}
              />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '8px' }}>
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="btn btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-accent-solid"
            >
              <Check size={14} />
              <span>Save Changes</span>
            </button>
          </div>
        </form>
      ) : (
        /* Main Profile Identity Card */
        <div className="card-base" style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              backgroundColor: 'var(--accent-subtle)',
              border: '2px solid var(--accent-border)',
              color: 'var(--accent-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '24px',
              fontWeight: 700,
              textTransform: 'uppercase',
            }}
          >
            {userProfile.name.charAt(0) || 'A'}
          </div>

          <div>
            <h3 style={{ fontSize: '20px', fontWeight: 600, color: 'var(--text-primary)' }}>
              {userProfile.name}
            </h3>
            <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginTop: '2px' }}>
              {userProfile.university} • {userProfile.course}
            </p>
            <div style={{ display: 'flex', gap: '8px', marginTop: '8px', flexWrap: 'wrap' }}>
              <span className="badge badge-accent">{userProfile.semester}</span>
              <span className="badge badge-neutral">{userProfile.registrationBatch || 'Batch of 2027'}</span>
              <span className="badge badge-success">Good Academic Standing</span>
            </div>
          </div>
        </div>
      )}

      {/* Institutional Details */}
      <div className="card-base" style={{ padding: '22px' }}>
        <h3 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '16px' }}>
          Course &amp; Matriculation Data
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
          <div style={{ padding: '12px 14px', backgroundColor: 'var(--surface-secondary)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-default)' }}>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Student ID / Registration</span>
            <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)', marginTop: '2px' }}>
              {userProfile.studentId || 'CS24-BTECH-9082'}
            </div>
          </div>

          <div style={{ padding: '12px 14px', backgroundColor: 'var(--surface-secondary)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-default)' }}>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Registered Semester</span>
            <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)', marginTop: '2px' }}>
              {userProfile.semester}
            </div>
          </div>

          <div style={{ padding: '12px 14px', backgroundColor: 'var(--surface-secondary)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-default)' }}>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Total Credits Registered</span>
            <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)', marginTop: '2px' }}>
              21 Credits (4 Theory, 2 Labs)
            </div>
          </div>

          <div style={{ padding: '12px 14px', backgroundColor: 'var(--surface-secondary)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-default)' }}>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Daily Study Goal</span>
            <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--accent-light)', marginTop: '2px' }}>
              {userProfile.dailyGoal} Hours / Day
            </div>
          </div>
        </div>
      </div>

      {/* Enrolled Courses Summary */}
      <div className="card-base" style={{ padding: '22px' }}>
        <h3 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '16px' }}>
          Registered Courses ({subjects.length})
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {subjects.map((s) => (
            <div
              key={s.id}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '12px 14px',
                backgroundColor: 'var(--surface-secondary)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-default)',
              }}
            >
              <div>
                <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>
                  {s.code}: {s.name}
                </span>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>
                  {s.professor} • {s.credits} Credits • {s.attendance.present}/{s.attendance.total} Classes
                </div>
              </div>
              <span className={`badge ${s.attendance.status === 'SAFE' ? 'badge-success' : 'badge-danger'}`}>
                {s.attendance.percentage}% ATT
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

