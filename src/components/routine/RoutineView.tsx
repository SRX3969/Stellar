import React, { useState } from 'react';
import {
  Clock,
  Sparkles,
  Lock,
  Plus,
  Edit2,
  CheckCircle2,
  Calendar,
  Coffee,
  Dumbbell,
  BookOpen,
  Moon,
  Sun,
  Bus
} from 'lucide-react';
import { useToast } from '../common/Toast';

export interface RoutineSlot {
  id: string;
  time: string;
  endTime: string;
  activity: string;
  category: 'wake' | 'breakfast' | 'college' | 'commute' | 'lunch' | 'gym' | 'study' | 'dinner' | 'sleep';
  type: 'fixed' | 'ai-adaptive';
  notes?: string;
}

const INITIAL_ROUTINE: RoutineSlot[] = [
  { id: 'r-1', time: '06:30', endTime: '07:00', activity: 'Wake Up & Morning Mindfulness', category: 'wake', type: 'fixed' },
  { id: 'r-2', time: '07:15', endTime: '07:45', activity: 'Nutritious Breakfast', category: 'breakfast', type: 'fixed' },
  { id: 'r-3', time: '08:00', endTime: '08:45', activity: 'Commute to University Campus', category: 'commute', type: 'fixed', notes: 'Review offline flashcards on bus' },
  { id: 'r-4', time: '09:00', endTime: '13:00', activity: 'College Lectures (DBMS, AI/ML, Math)', category: 'college', type: 'fixed', notes: 'Mandatory 75% attendance threshold' },
  { id: 'r-5', time: '13:00', endTime: '14:00', activity: 'Lunch & Campus Walk', category: 'lunch', type: 'fixed' },
  { id: 'r-6', time: '14:15', endTime: '15:10', activity: '✦ STELLAR Focus Window: OS Concurrency Review', category: 'study', type: 'ai-adaptive', notes: 'Generated dynamically based on 73% attendance risk' },
  { id: 'r-7', time: '15:30', endTime: '17:00', activity: 'Operating Systems Lab Session', category: 'college', type: 'fixed' },
  { id: 'r-8', time: '17:30', endTime: '18:45', activity: 'Gym / Strength Conditioning', category: 'gym', type: 'fixed' },
  { id: 'r-9', time: '19:00', endTime: '20:15', activity: '✦ Deep Study: DBMS Unit 3 Normalization', category: 'study', type: 'ai-adaptive', notes: 'Prioritized for upcoming CIA in 4 days' },
  { id: 'r-10', time: '20:30', endTime: '21:15', activity: 'Dinner & Social Downtime', category: 'dinner', type: 'fixed' },
  { id: 'r-11', time: '21:30', endTime: '22:15', activity: '✦ Active Recall & Flashcard Wrap-Up', category: 'study', type: 'ai-adaptive', notes: 'Scheduled by STELLAR spaced repetition engine' },
  { id: 'r-12', time: '23:00', endTime: '06:30', activity: 'Sleep & Sleep Quality Tracking', category: 'sleep', type: 'fixed', notes: 'Target: 7.5 hrs cognitive restoration' },
];

export const RoutineView: React.FC = () => {
  const [routine, setRoutine] = useState<RoutineSlot[]>(INITIAL_ROUTINE);
  const [filterType, setFilterType] = useState<'all' | 'fixed' | 'ai-adaptive'>('all');
  const { showToast } = useToast();

  const filteredSlots = routine.filter((r) => {
    if (filterType === 'all') return true;
    return r.type === filterType;
  });

  const getCategoryIcon = (category: RoutineSlot['category']) => {
    switch (category) {
      case 'wake':
        return <Sun size={15} style={{ color: 'var(--color-warning)' }} />;
      case 'breakfast':
      case 'lunch':
      case 'dinner':
        return <Coffee size={15} style={{ color: 'var(--accent-primary)' }} />;
      case 'commute':
        return <Bus size={15} style={{ color: 'var(--text-secondary)' }} />;
      case 'college':
        return <BookOpen size={15} style={{ color: 'var(--color-info)' }} />;
      case 'gym':
        return <Dumbbell size={15} style={{ color: 'var(--color-success)' }} />;
      case 'study':
        return <Sparkles size={15} style={{ color: 'var(--accent-primary)' }} />;
      case 'sleep':
        return <Moon size={15} style={{ color: 'var(--accent-light)' }} />;
    }
  };

  const totalFixedHours = 12.5;
  const totalAIStudyHours = 2.5;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px', maxWidth: '1100px', margin: '0 auto' }}>
      {/* Header */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
          <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Daily Operating Architecture</span>
          <span style={{ color: 'var(--border-strong)' }}>•</span>
          <span style={{ fontSize: '12px', color: 'var(--accent-primary)', fontWeight: 500 }}>Circadian & Academic Sync</span>
        </div>
        <h2 style={{ fontSize: '28px', fontWeight: 600, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
          Routine & Daily Schedule
        </h2>
        <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginTop: '4px' }}>
          Visual timeline distinguishing fixed commitments from intelligent AI-generated study and recovery windows.
        </p>
      </div>

      {/* Routine Balance Metrics */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '16px',
        }}
      >
        <div className="card-base" style={{ padding: '16px 20px' }}>
          <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Fixed Institutional Hours</span>
          <div style={{ fontSize: '24px', fontWeight: 600, color: 'var(--text-primary)', marginTop: '4px' }}>
            {totalFixedHours}h / day
          </div>
          <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>College, sleep &amp; commute</span>
        </div>

        <div className="card-base" style={{ padding: '16px 20px', border: '1px solid var(--accent-border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Sparkles size={13} style={{ color: 'var(--accent-primary)' }} />
            <span style={{ fontSize: '12px', color: 'var(--accent-primary)', fontWeight: 600 }}>AI Study Windows</span>
          </div>
          <div style={{ fontSize: '24px', fontWeight: 600, color: 'var(--accent-light)', marginTop: '4px' }}>
            {totalAIStudyHours}h / day
          </div>
          <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Adaptive to upcoming CIA deadlines</span>
        </div>

        <div className="card-base" style={{ padding: '16px 20px' }}>
          <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Free Discretionary Time</span>
          <div style={{ fontSize: '24px', fontWeight: 600, color: 'var(--color-success)', marginTop: '4px' }}>
            1h 35m
          </div>
          <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Open buffer for recharge</span>
        </div>
      </div>

      {/* Legend & Filter Controls */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', borderBottom: '1px solid var(--border-default)', paddingBottom: '12px' }}>
        <div style={{ display: 'flex', gap: '8px' }}>
          {(['all', 'fixed', 'ai-adaptive'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setFilterType(tab)}
              style={{
                padding: '6px 14px',
                borderRadius: 'var(--radius-md)',
                fontSize: '13px',
                fontWeight: filterType === tab ? 600 : 400,
                backgroundColor: filterType === tab ? 'var(--surface-elevated)' : 'transparent',
                color: filterType === tab ? 'var(--text-primary)' : 'var(--text-secondary)',
                border: '1px solid',
                borderColor: filterType === tab ? 'var(--border-strong)' : 'transparent',
                textTransform: 'capitalize',
              }}
            >
              {tab === 'all' ? 'Entire Routine' : tab === 'fixed' ? 'Fixed Activities' : '✦ AI-Adaptive Windows'}
            </button>
          ))}
        </div>

        {/* Legend */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '12px', color: 'var(--text-muted)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div style={{ width: '10px', height: '10px', borderRadius: '2px', backgroundColor: 'var(--surface-secondary)', border: '1px solid var(--border-strong)' }} />
            <span>Fixed Activity</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div style={{ width: '10px', height: '10px', borderRadius: '2px', backgroundColor: 'var(--accent-subtle)', border: '1px solid var(--accent-border)' }} />
            <span style={{ color: 'var(--accent-primary)', fontWeight: 500 }}>AI Generated</span>
          </div>
        </div>
      </div>

      {/* Visual Timeline (Section 37) */}
      <div className="card-base" style={{ padding: '24px' }}>
        <div style={{ position: 'relative', paddingLeft: '32px' }}>
          {/* Vertical Line */}
          <div
            style={{
              position: 'absolute',
              left: '10px',
              top: '10px',
              bottom: '10px',
              width: '1.5px',
              backgroundColor: 'var(--border-default)',
            }}
          />

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {filteredSlots.map((slot) => {
              const isAI = slot.type === 'ai-adaptive';

              return (
                <div
                  key={slot.id}
                  style={{
                    position: 'relative',
                    padding: '14px 18px',
                    borderRadius: 'var(--radius-lg)',
                    backgroundColor: isAI ? 'rgba(200, 169, 107, 0.05)' : 'var(--surface-secondary)',
                    border: '1px solid',
                    borderColor: isAI ? 'var(--accent-border)' : 'var(--border-default)',
                    transition: 'border-color var(--transition-fast)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = isAI ? 'var(--accent-primary)' : 'var(--border-strong)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = isAI ? 'var(--accent-border)' : 'var(--border-default)';
                  }}
                >
                  {/* Marker Dot on Timeline */}
                  <div
                    style={{
                      position: 'absolute',
                      left: '-32px',
                      top: '16px',
                      width: '20px',
                      height: '20px',
                      borderRadius: '50%',
                      backgroundColor: isAI ? 'var(--accent-subtle)' : 'var(--surface-elevated)',
                      border: '2px solid',
                      borderColor: isAI ? 'var(--accent-primary)' : 'var(--border-strong)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {isAI ? (
                      <Sparkles size={10} style={{ color: 'var(--accent-primary)' }} />
                    ) : (
                      <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--text-muted)' }} />
                    )}
                  </div>

                  {/* Header Row: Time & Activity */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: 600, color: isAI ? 'var(--accent-light)' : 'var(--text-primary)', fontFamily: 'monospace' }}>
                        <Clock size={13} />
                        <span>{slot.time} - {slot.endTime}</span>
                      </div>

                      <span
                        style={{
                          fontSize: '11px',
                          padding: '1px 6px',
                          borderRadius: '3px',
                          backgroundColor: isAI ? 'var(--accent-subtle)' : 'var(--surface-primary)',
                          color: isAI ? 'var(--accent-primary)' : 'var(--text-secondary)',
                          border: '1px solid',
                          borderColor: isAI ? 'var(--accent-border)' : 'var(--border-subtle)',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                        }}
                      >
                        {getCategoryIcon(slot.category)}
                        <span style={{ textTransform: 'capitalize' }}>{slot.category}</span>
                      </span>
                    </div>

                    <span
                      style={{
                        fontSize: '11px',
                        fontWeight: 600,
                        letterSpacing: '0.04em',
                        color: isAI ? 'var(--accent-primary)' : 'var(--text-muted)',
                        textTransform: 'uppercase',
                      }}
                    >
                      {isAI ? '✦ AI Generated' : 'Fixed Block'}
                    </span>
                  </div>

                  {/* Activity Name */}
                  <div style={{ fontSize: '14px', fontWeight: 500, color: 'var(--text-primary)', marginTop: '8px' }}>
                    {slot.activity}
                  </div>

                  {/* Context Note */}
                  {slot.notes && (
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>
                      {slot.notes}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
