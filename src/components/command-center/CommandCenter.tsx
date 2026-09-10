import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sparkles,
  ArrowUp,
  X,
  CheckCircle2,
  Calendar,
  CheckSquare,
  BookOpen,
  Bell,
  Clock,
  ChevronRight
} from 'lucide-react';

interface CommandCenterProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate?: (route: string) => void;
  onTaskAdded?: (title: string, subject: string) => void;
  onStartFocusSession?: () => void;
}

export const CommandCenter: React.FC<CommandCenterProps> = ({
  isOpen,
  onClose,
  onNavigate,
  onTaskAdded,
  onStartFocusSession,
}) => {
  const [query, setQuery] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [parsedResult, setParsedResult] = useState<{
    detectedTitle: string;
    items: string[];
    completed: boolean;
    actionType?: 'study' | 'attendance' | 'task' | 'calendar' | 'ai';
    actionLabel?: string;
  } | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 80);
      setParsedResult(null);
      setQuery('');
      setIsProcessing(false);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const defaultSuggestions = [
    { label: 'I have DBMS CIA on September 18.', type: 'nlp' },
    { label: 'What should I study right now?', type: 'study' },
    { label: 'Check my OS attendance buffer', type: 'attendance' },
    { label: 'Add task: Linear Algebra proof set', type: 'task' },
    { label: 'Schedule 45 min revision block', type: 'calendar' },
    { label: 'Ask AI Tutor about 3NF vs BCNF', type: 'ai' },
  ];

  const handleSelectSuggestion = (suggestion: string) => {
    setQuery(suggestion);
    handleExecute(suggestion);
  };

  const handleExecute = (textToExecute?: string) => {
    const targetText = textToExecute || query;
    if (!targetText.trim()) return;

    setIsProcessing(true);
    setParsedResult(null);

    // Realistic intelligent parsing animation
    setTimeout(() => {
      setIsProcessing(false);
      const lower = targetText.toLowerCase();

      if (lower.startsWith('add task') || lower.startsWith('task:') || lower.includes('task:')) {
        let taskTitle = targetText.replace(/^add task:?/i, '').replace(/^task:?/i, '').trim();
        if (!taskTitle) taskTitle = 'New Academic Assignment';
        
        let detectedSubject = 'DBMS';
        if (lower.includes('os') || lower.includes('operating')) detectedSubject = 'OS';
        else if (lower.includes('math') || lower.includes('algebra')) detectedSubject = 'Mathematics';
        else if (lower.includes('ai') || lower.includes('ml')) detectedSubject = 'AI/ML';

        if (onTaskAdded) {
          onTaskAdded(taskTitle, detectedSubject);
        }

        setParsedResult({
          detectedTitle: `New Task Created: "${taskTitle}"`,
          items: [
            `Classified under: ${detectedSubject}`,
            'Priority tagged: High • Due tomorrow at 11:59 PM',
            'Estimated duration: 45 minutes',
            'Synchronized to Tasks list and Daily Agenda'
          ],
          completed: true,
          actionType: 'task',
          actionLabel: 'View in Tasks',
        });
      } else if (lower.includes('dbms') || lower.includes('cia') || lower.includes('september 18') || lower.includes('18')) {
        setParsedResult({
          detectedTitle: 'DBMS Comprehensive Internal Assessment (CIA) Detected',
          items: [
            'Assessment: DBMS CIA scheduled for Sep 18 (4 days away)',
            'Calendar: Added examination slot & 2 study blocks to schedule',
            'Tasks: Created 5 syllabus checklist tasks (3NF, BCNF, Relational Algebra, SQL, Transactions)',
            'Reminders: Set countdown alerts at T-3d, T-24h, and T-2h',
            'Flashcards: Prepared 30 high-yield DBMS cards for revision'
          ],
          completed: true,
          actionType: 'calendar',
          actionLabel: 'View Assessment Schedule',
        });
        if (onTaskAdded) {
          onTaskAdded('DBMS CIA Unit 3 Revision', 'DBMS');
        }
      } else if (lower.includes('study') || lower.includes('what should i do') || lower.includes('focus') || lower.includes('revision block')) {
        setParsedResult({
          detectedTitle: 'Targeted Focus Session Recommendation',
          items: [
            'Evaluated current time window: 55 minutes open',
            'Priority alignment: DBMS Unit 3 Normalization (CIA in 4 days)',
            'Phase 1: 25 min Deep Revision (Functional Dependencies & BCNF)',
            'Phase 2: 5 min Cognitive Reset / Break',
            'Phase 3: 25 min Active Recall Flashcards'
          ],
          completed: true,
          actionType: 'study',
          actionLabel: 'Launch Focus Session Now',
        });
      } else if (lower.includes('attendance') || lower.includes('os') || lower.includes('buffer') || lower.includes('miss')) {
        setParsedResult({
          detectedTitle: 'Attendance Health Analysis: OS & DBMS',
          items: [
            'OS Status: 22 / 30 attended (73% vs 75% threshold) — RISK',
            'Mandatory: You must attend the next 2 classes to restore 75% criterion',
            'DBMS Status: 27 / 30 attended (90%) — SAFE (can safely miss 3 classes if needed)',
            'AI Recommendation: Prioritize OS lecture attendance this Friday'
          ],
          completed: true,
          actionType: 'attendance',
          actionLabel: 'Open Attendance Simulator',
        });
      } else if (lower.includes('ai tutor') || lower.includes('bcnf') || lower.includes('3nf') || lower.includes('explain') || lower.includes('solve')) {
        setParsedResult({
          detectedTitle: 'Query Prepared for AI Academic Tutor',
          items: [
            'Domain matched: Database Management Systems (CS301)',
            'Prerequisites referenced: 1NF, 2NF, Functional Dependencies closure',
            'Syllabus alignment: Unit 3 Examination Blueprint',
            'Ready for pedagogical Socratic breakdown'
          ],
          completed: true,
          actionType: 'ai',
          actionLabel: 'Open in AI Tutor',
        });
      } else {
        setParsedResult({
          detectedTitle: `Action Processed for "${targetText}"`,
          items: [
            'Natural language request analyzed',
            'Context correlated with current semester timetable',
            'Action item registered and synced to daily agenda'
          ],
          completed: true,
          actionType: 'calendar',
          actionLabel: 'View on Dashboard',
        });
      }
    }, 380);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 1000,
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'center',
            paddingTop: '12vh',
            paddingLeft: '16px',
            paddingRight: '16px',
          }}
        >
          {/* Subtle Dim Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            onClick={onClose}
            style={{
              position: 'absolute',
              inset: 0,
              backgroundColor: 'rgba(9, 9, 11, 0.78)',
              backdropFilter: 'blur(4px)',
            }}
          />

          {/* Command Interface Window */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -10 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            style={{
              position: 'relative',
              width: '100%',
              maxWidth: '620px',
              backgroundColor: 'var(--surface-primary)',
              border: '1px solid var(--border-strong)',
              borderRadius: 'var(--radius-xl)',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7), 0 0 0 1px rgba(200, 169, 107, 0.08)',
              overflow: 'hidden',
              zIndex: 20,
            }}
          >
            {/* Header / Sub-brand */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '16px 20px 10px 20px',
                borderBottom: '1px solid var(--border-subtle)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Sparkles size={15} style={{ color: 'var(--accent-primary)' }} />
                <span
                  style={{
                    fontSize: '13px',
                    fontWeight: 600,
                    letterSpacing: '0.02em',
                    color: 'var(--text-primary)',
                  }}
                >
                  What do you need?
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>ESC to close</span>
                <button
                  onClick={onClose}
                  style={{
                    color: 'var(--text-muted)',
                    display: 'flex',
                    alignItems: 'center',
                    padding: '2px',
                  }}
                >
                  <X size={15} />
                </button>
              </div>
            </div>

            {/* Natural Language Input */}
            <div style={{ padding: '16px 20px' }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  backgroundColor: 'var(--surface-secondary)',
                  border: '1px solid var(--border-default)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '10px 14px',
                  transition: 'border-color var(--transition-fast)',
                }}
              >
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value);
                    if (parsedResult) setParsedResult(null);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleExecute();
                    }
                  }}
                  placeholder="Type naturally (e.g. 'I have DBMS CIA on September 18')..."
                  style={{
                    flex: 1,
                    background: 'transparent',
                    border: 'none',
                    padding: 0,
                    fontSize: '14px',
                    color: 'var(--text-primary)',
                    outline: 'none',
                    boxShadow: 'none',
                  }}
                />

                <button
                  onClick={() => handleExecute()}
                  disabled={!query.trim() || isProcessing}
                  style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: 'var(--radius-sm)',
                    backgroundColor: query.trim() ? 'var(--accent-primary)' : 'var(--surface-elevated)',
                    color: query.trim() ? '#09090b' : 'var(--text-muted)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all var(--transition-fast)',
                    cursor: query.trim() ? 'pointer' : 'default',
                  }}
                  aria-label="Execute prompt"
                >
                  <ArrowUp size={15} strokeWidth={2.5} />
                </button>
              </div>
            </div>

            {/* Content Area: Suggestions vs Processing vs Staggered Results */}
            <div
              style={{
                padding: '0 20px 20px 20px',
                maxHeight: '380px',
                overflowY: 'auto',
              }}
            >
              {/* 1. Loading State */}
              {isProcessing && (
                <div
                  style={{
                    padding: '24px 16px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    color: 'var(--text-secondary)',
                    fontSize: '13px',
                  }}
                >
                  <div
                    style={{
                      width: '16px',
                      height: '16px',
                      border: '2px solid var(--border-default)',
                      borderTopColor: 'var(--accent-primary)',
                      borderRadius: '50%',
                      animation: 'spin 0.8s linear infinite',
                    }}
                  />
                  <span>Understanding request and coordinating student schedule...</span>
                  <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
                </div>
              )}

              {/* 2. Staggered Action Results */}
              {!isProcessing && parsedResult && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  style={{
                    backgroundColor: 'var(--surface-secondary)',
                    border: '1px solid var(--border-default)',
                    borderRadius: 'var(--radius-lg)',
                    padding: '16px',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      marginBottom: '14px',
                      paddingBottom: '10px',
                      borderBottom: '1px solid var(--border-subtle)',
                    }}
                  >
                    <div
                      style={{
                        width: '20px',
                        height: '20px',
                        borderRadius: '50%',
                        backgroundColor: 'var(--color-success-bg)',
                        color: 'var(--color-success)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <CheckCircle2 size={14} />
                    </div>
                    <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>
                      {parsedResult.detectedTitle}
                    </span>
                  </div>

                  {/* Staggered items */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {parsedResult.items.map((item, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, x: -6 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.18, delay: idx * 0.08 }}
                        style={{
                          display: 'flex',
                          alignItems: 'flex-start',
                          gap: '10px',
                          fontSize: '13px',
                          color: 'var(--text-secondary)',
                        }}
                      >
                        <CheckCircle2
                          size={14}
                          style={{
                            color: 'var(--accent-primary)',
                            marginTop: '2px',
                            flexShrink: 0,
                          }}
                        />
                        <span>{item}</span>
                      </motion.div>
                    ))}
                  </div>

                  <div
                    style={{
                      marginTop: '16px',
                      paddingTop: '14px',
                      borderTop: '1px solid var(--border-subtle)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      flexWrap: 'wrap',
                      gap: '10px',
                    }}
                  >
                    <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                      Synchronized across STELLAR OS
                    </span>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      {parsedResult.actionType === 'study' && onStartFocusSession && (
                        <button
                          type="button"
                          onClick={() => {
                            onClose();
                            onStartFocusSession();
                          }}
                          className="btn btn-accent-solid"
                          style={{ fontSize: '12px', padding: '6px 14px' }}
                        >
                          <Sparkles size={13} />
                          <span>{parsedResult.actionLabel || 'Start Focus Session'}</span>
                        </button>
                      )}

                      {parsedResult.actionType === 'task' && onNavigate && (
                        <button
                          type="button"
                          onClick={() => {
                            onClose();
                            onNavigate('tasks');
                          }}
                          className="btn btn-accent-solid"
                          style={{ fontSize: '12px', padding: '6px 14px' }}
                        >
                          <CheckSquare size={13} />
                          <span>{parsedResult.actionLabel || 'View in Tasks'}</span>
                        </button>
                      )}

                      {parsedResult.actionType === 'attendance' && onNavigate && (
                        <button
                          type="button"
                          onClick={() => {
                            onClose();
                            onNavigate('attendance');
                          }}
                          className="btn btn-accent-solid"
                          style={{ fontSize: '12px', padding: '6px 14px' }}
                        >
                          <span>{parsedResult.actionLabel || 'Open Simulator'}</span>
                        </button>
                      )}

                      {parsedResult.actionType === 'ai' && onNavigate && (
                        <button
                          type="button"
                          onClick={() => {
                            onClose();
                            onNavigate('ai');
                          }}
                          className="btn btn-accent-solid"
                          style={{ fontSize: '12px', padding: '6px 14px' }}
                        >
                          <span>{parsedResult.actionLabel || 'Open AI Tutor'}</span>
                        </button>
                      )}

                      {parsedResult.actionType === 'calendar' && onNavigate && (
                        <button
                          type="button"
                          onClick={() => {
                            onClose();
                            onNavigate('calendar');
                          }}
                          className="btn btn-accent-solid"
                          style={{ fontSize: '12px', padding: '6px 14px' }}
                        >
                          <span>{parsedResult.actionLabel || 'View Schedule'}</span>
                        </button>
                      )}

                      <button
                        onClick={() => {
                          onClose();
                          if (onNavigate) onNavigate('dashboard');
                        }}
                        style={{
                          fontSize: '12px',
                          fontWeight: 500,
                          color: 'var(--accent-light)',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                          padding: '6px 8px',
                          backgroundColor: 'transparent',
                        }}
                      >
                        Dashboard <ChevronRight size={13} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* 3. Empty State Suggestions */}
              {!isProcessing && !parsedResult && (
                <div>
                  <div
                    style={{
                      fontSize: '11px',
                      fontWeight: 600,
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      color: 'var(--text-muted)',
                      marginBottom: '10px',
                    }}
                  >
                    Suggested Actions
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    {defaultSuggestions.map((item, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSelectSuggestion(item.label)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          width: '100%',
                          padding: '8px 12px',
                          borderRadius: 'var(--radius-md)',
                          backgroundColor: 'transparent',
                          color: 'var(--text-secondary)',
                          fontSize: '13px',
                          textAlign: 'left',
                          transition: 'all var(--transition-fast)',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = 'var(--surface-secondary)';
                          e.currentTarget.style.color = 'var(--text-primary)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = 'transparent';
                          e.currentTarget.style.color = 'var(--text-secondary)';
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <span style={{ color: 'var(--accent-primary)', fontSize: '12px' }}>✦</span>
                          <span>{item.label}</span>
                        </div>
                        <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Enter</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
