import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Sun, Moon, CheckCircle2, AlertTriangle, Clock, ArrowRight, Sparkles } from 'lucide-react';

interface DailyBriefingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartStudy?: () => void;
}

export const DailyBriefingModal: React.FC<DailyBriefingModalProps> = ({
  isOpen,
  onClose,
  onStartStudy,
}) => {
  const [activeTab, setActiveTab] = useState<'morning' | 'night'>('morning');

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={activeTab === 'morning' ? 'Daily Morning Briefing' : 'Evening Daily Review'}
      subtitle={activeTab === 'morning' ? 'Intelligent summary for Wednesday, September 9' : 'Wrap-up and automated carry-overs for tomorrow'}
      maxWidth="540px"
    >
      {/* Mode toggle */}
      <div
        style={{
          display: 'flex',
          backgroundColor: 'var(--surface-secondary)',
          padding: '3px',
          borderRadius: 'var(--radius-md)',
          marginBottom: '20px',
        }}
      >
        <button
          onClick={() => setActiveTab('morning')}
          style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            padding: '7px',
            fontSize: '13px',
            fontWeight: 500,
            borderRadius: 'var(--radius-sm)',
            backgroundColor: activeTab === 'morning' ? 'var(--surface-elevated)' : 'transparent',
            color: activeTab === 'morning' ? 'var(--text-primary)' : 'var(--text-secondary)',
          }}
        >
          <Sun size={15} style={{ color: activeTab === 'morning' ? 'var(--color-warning)' : 'inherit' }} />
          <span>Morning Briefing</span>
        </button>
        <button
          onClick={() => setActiveTab('night')}
          style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            padding: '7px',
            fontSize: '13px',
            fontWeight: 500,
            borderRadius: 'var(--radius-sm)',
            backgroundColor: activeTab === 'night' ? 'var(--surface-elevated)' : 'transparent',
            color: activeTab === 'night' ? 'var(--text-primary)' : 'var(--text-secondary)',
          }}
        >
          <Moon size={15} style={{ color: activeTab === 'night' ? 'var(--accent-primary)' : 'inherit' }} />
          <span>Night Review</span>
        </button>
      </div>

      {activeTab === 'morning' ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Main Focus banner */}
          <div
            style={{
              padding: '16px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--accent-subtle)',
              border: '1px solid var(--accent-border)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <Sparkles size={15} style={{ color: 'var(--accent-primary)' }} />
              <span style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.05em', color: 'var(--accent-primary)', textTransform: 'uppercase' }}>
                Main Academic Focus
              </span>
            </div>
            <div style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-primary)' }}>
              Complete DBMS Unit 3 (Functional Dependencies & 3NF)
            </div>
            <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px' }}>
              Targeted for CIA in 4 days. 1h 20m recommended study time today.
            </div>
          </div>

          {/* Metric Grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '12px',
            }}
          >
            <div style={{ padding: '14px', backgroundColor: 'var(--surface-secondary)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-default)' }}>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Today's Lectures</div>
              <div style={{ fontSize: '20px', fontWeight: 600, color: 'var(--text-primary)', marginTop: '4px' }}>
                4 Classes
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                DBMS, AI/ML, Maths, OS
              </div>
            </div>

            <div style={{ padding: '14px', backgroundColor: 'var(--surface-secondary)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-default)' }}>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Priority Deadline</div>
              <div style={{ fontSize: '20px', fontWeight: 600, color: 'var(--color-warning)', marginTop: '4px' }}>
                4 Days
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                DBMS CIA (Sep 18)
              </div>
            </div>

            <div style={{ padding: '14px', backgroundColor: 'var(--surface-secondary)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-default)' }}>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Attendance Watch</div>
              <div style={{ fontSize: '20px', fontWeight: 600, color: 'var(--color-danger)', marginTop: '4px' }}>
                OS 73%
              </div>
              <div style={{ fontSize: '11px', color: 'var(--color-danger)', marginTop: '2px' }}>
                Below 75% threshold (Attend next 2)
              </div>
            </div>

            <div style={{ padding: '14px', backgroundColor: 'var(--surface-secondary)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-default)' }}>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Tasks Due Today</div>
              <div style={{ fontSize: '20px', fontWeight: 600, color: 'var(--text-primary)', marginTop: '4px' }}>
                1 Assignment
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                Maths Problem Set (11:59 PM)
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '8px' }}>
            <button
              onClick={onClose}
              className="btn btn-secondary"
            >
              Dismiss
            </button>
            <button
              onClick={() => {
                onClose();
                if (onStartStudy) onStartStudy();
              }}
              className="btn btn-accent-solid"
            >
              Start Recommended Session
            </button>
          </div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Night Review metrics */}
          <div
            style={{
              padding: '16px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--surface-secondary)',
              border: '1px solid var(--border-default)',
            }}
          >
            <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '12px' }}>
              Today's Performance Summary
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '13px' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Tasks Completed</span>
                <span style={{ fontWeight: 600, color: 'var(--color-success)' }}>5 / 6 completed (83%)</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '13px' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Deep Study Time</span>
                <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>1h 35m</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '13px' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Incomplete Task</span>
                <span style={{ color: 'var(--color-warning)' }}>1 task rolled over to tomorrow</span>
              </div>
            </div>
          </div>

          <div
            style={{
              padding: '14px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--surface-elevated)',
              border: '1px solid var(--border-subtle)',
              fontSize: '13px',
              color: 'var(--text-secondary)',
              lineHeight: 1.5,
            }}
          >
            <span style={{ color: 'var(--accent-primary)', fontWeight: 600 }}>✦ STELLAR Overnight Sync:</span>
            {" "}Your unchecked task "OS Process Synchronization Notes" has been automatically scheduled into tomorrow's 11:00 AM focus window. Rest well tonight.
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '8px' }}>
            <button
              onClick={onClose}
              className="btn btn-primary"
            >
              Complete Daily Review
            </button>
          </div>
        </div>
      )}
    </Modal>
  );
};
