import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Compass, GraduationCap, ShieldCheck, Clock, Check, ArrowRight } from 'lucide-react';
import { useToast } from '../common/Toast';

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (data: {
    university: string;
    course: string;
    semester: string;
    criterion: number;
    dailyGoal: number;
  }) => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({
  isOpen,
  onClose,
  onComplete,
}) => {
  const [step, setStep] = useState(1);
  const [university, setUniversity] = useState('National Institute of Technology');
  const [course, setCourse] = useState('Computer Science & Engineering');
  const [semester, setSemester] = useState('Semester 5 (Fall \'26)');
  const [criterion, setCriterion] = useState(75);
  const [dailyGoal, setDailyGoal] = useState(2);
  const { showToast } = useToast();

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      showToast('STELLAR OS Configured', 'Your timetable, subjects, and attendance criteria are live.', 'success');
      onComplete({
        university,
        course,
        semester,
        criterion,
        dailyGoal,
      });
      onClose();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="500px"
    >
      {/* Progress Dots */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginBottom: '20px' }}>
        {[1, 2, 3].map((s) => (
          <div
            key={s}
            style={{
              width: s === step ? '24px' : '8px',
              height: '4px',
              borderRadius: '2px',
              backgroundColor: s <= step ? 'var(--accent-primary)' : 'var(--surface-secondary)',
              transition: 'all var(--transition-fast)',
            }}
          />
        ))}
      </div>

      {step === 1 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--accent-primary)', textTransform: 'uppercase' }}>
              Step 1 of 3
            </span>
            <h3 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--text-primary)', marginTop: '2px' }}>
              University &amp; Degree Details
            </h3>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '2px' }}>
              Tell STELLAR where and what you are studying.
            </p>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 500, color: 'var(--text-secondary)', marginBottom: '4px' }}>
              Institution
            </label>
            <input
              type="text"
              value={university}
              onChange={(e) => setUniversity(e.target.value)}
              style={{ width: '100%' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 500, color: 'var(--text-secondary)', marginBottom: '4px' }}>
              Degree / Major
            </label>
            <input
              type="text"
              value={course}
              onChange={(e) => setCourse(e.target.value)}
              style={{ width: '100%' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 500, color: 'var(--text-secondary)', marginBottom: '4px' }}>
              Current Semester
            </label>
            <select
              value={semester}
              onChange={(e) => setSemester(e.target.value)}
              style={{ width: '100%' }}
            >
              <option value="Semester 1">Semester 1</option>
              <option value="Semester 2">Semester 2</option>
              <option value="Semester 3">Semester 3</option>
              <option value="Semester 4">Semester 4</option>
              <option value="Semester 5">Semester 5 (Fall '26)</option>
              <option value="Semester 6">Semester 6</option>
              <option value="Semester 7">Semester 7</option>
              <option value="Semester 8">Semester 8</option>
            </select>
          </div>
        </div>
      )}

      {step === 2 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--accent-primary)', textTransform: 'uppercase' }}>
              Step 2 of 3
            </span>
            <h3 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--text-primary)', marginTop: '2px' }}>
              Institutional Attendance Policy
            </h3>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '2px' }}>
              STELLAR uses this threshold to calculate leave buffers and debarment warnings.
            </p>
          </div>

          <div style={{ padding: '16px', backgroundColor: 'var(--surface-secondary)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-default)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '13px', color: 'var(--text-primary)', fontWeight: 500 }}>
                Minimum Mandatory Criterion
              </span>
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
        </div>
      )}

      {step === 3 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--accent-primary)', textTransform: 'uppercase' }}>
              Step 3 of 3
            </span>
            <h3 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--text-primary)', marginTop: '2px' }}>
              Daily Study Target
            </h3>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '2px' }}>
              How much deep focus time do you want STELLAR to schedule into your daily routine?
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
            {[1.5, 2.0, 3.0].map((hours) => (
              <button
                key={hours}
                type="button"
                onClick={() => setDailyGoal(hours)}
                style={{
                  padding: '16px 12px',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: dailyGoal === hours ? 'var(--surface-elevated)' : 'var(--surface-secondary)',
                  border: '1.5px solid',
                  borderColor: dailyGoal === hours ? 'var(--accent-primary)' : 'var(--border-default)',
                  color: dailyGoal === hours ? 'var(--text-primary)' : 'var(--text-secondary)',
                  textAlign: 'center',
                }}
              >
                <Clock size={16} style={{ color: dailyGoal === hours ? 'var(--accent-primary)' : 'var(--text-muted)', margin: '0 auto 6px auto' }} />
                <div style={{ fontSize: '16px', fontWeight: 700 }}>{hours}h</div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
                  {hours === 1.5 ? 'Balanced' : hours === 2.0 ? 'Optimal' : 'Intensive'}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Action Footer */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '24px', paddingTop: '16px', borderTop: '1px solid var(--border-subtle)' }}>
        {step > 1 ? (
          <button
            type="button"
            onClick={() => setStep(step - 1)}
            className="btn btn-secondary"
            style={{ fontSize: '12px' }}
          >
            Back
          </button>
        ) : (
          <div />
        )}

        <button
          type="button"
          onClick={handleNext}
          className="btn btn-accent-solid"
          style={{ padding: '8px 18px' }}
        >
          <span>{step === 3 ? 'Launch STELLAR' : 'Continue'}</span>
          <ArrowRight size={14} />
        </button>
      </div>
    </Modal>
  );
};
