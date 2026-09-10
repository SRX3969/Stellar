import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Play,
  Pause,
  RotateCcw,
  X,
  Sparkles,
  CheckCircle2,
  Volume2,
  VolumeX,
  Coffee,
  Layers,
  BookOpen,
  Edit3,
  Copy,
  Check
} from 'lucide-react';
import { useToast } from '../common/Toast';

interface FocusSessionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSessionComplete?: (minutesLogged: number) => void;
  initialSubject?: string;
}

export const FocusSessionModal: React.FC<FocusSessionModalProps> = ({
  isOpen,
  onClose,
  onSessionComplete,
  initialSubject = 'DBMS',
}) => {
  const [selectedSubject, setSelectedSubject] = useState<string>(initialSubject);
  const [selectedDurationMins, setSelectedDurationMins] = useState<number>(25);
  const [secondsRemaining, setSecondsRemaining] = useState<number>(25 * 60);
  const [isActive, setIsActive] = useState<boolean>(false);
  const [currentPhase, setCurrentPhase] = useState<'study' | 'break' | 'flashcards'>('study');
  const [scratchNotes, setScratchNotes] = useState<string>('');
  const [soundEnabled, setSoundEnabled] = useState<boolean>(false);
  const [copiedNotes, setCopiedNotes] = useState<boolean>(false);
  const { showToast } = useToast();

  const audioCtxRef = useRef<AudioContext | null>(null);
  const noiseNodeRef = useRef<AudioNode | null>(null);

  // Sync initial subject if passed
  useEffect(() => {
    if (initialSubject) setSelectedSubject(initialSubject);
  }, [initialSubject]);

  // Handle ambient sound generator with Web Audio API
  useEffect(() => {
    if (soundEnabled && isOpen) {
      try {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        if (!AudioCtx) return;
        const ctx = new AudioCtx();
        audioCtxRef.current = ctx;

        // Generate peaceful brownian ambient noise
        const bufferSize = ctx.sampleRate * 2;
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        let lastOut = 0.0;
        for (let i = 0; i < bufferSize; i++) {
          const white = Math.random() * 2 - 1;
          data[i] = (lastOut + 0.02 * white) / 1.02;
          lastOut = data[i];
          data[i] *= 0.18; // soothing low volume
        }

        const noise = ctx.createBufferSource();
        noise.buffer = buffer;
        noise.loop = true;

        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.value = 400; // Warm muffled sound like rain or distant library

        const gain = ctx.createGain();
        gain.gain.setValueAtTime(0.06, ctx.currentTime);

        noise.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);

        noise.start();
        noiseNodeRef.current = noise;
      } catch {
        // Fallback gracefully if Web Audio is restricted
      }
    } else {
      if (audioCtxRef.current) {
        audioCtxRef.current.close().catch(() => {});
        audioCtxRef.current = null;
        noiseNodeRef.current = null;
      }
    }

    return () => {
      if (audioCtxRef.current) {
        audioCtxRef.current.close().catch(() => {});
        audioCtxRef.current = null;
        noiseNodeRef.current = null;
      }
    };
  }, [soundEnabled, isOpen]);

  useEffect(() => {
    let interval: any = null;
    if (isActive && secondsRemaining > 0) {
      interval = setInterval(() => {
        setSecondsRemaining((prev) => prev - 1);
      }, 1000);
    } else if (secondsRemaining === 0) {
      setIsActive(false);
      if (currentPhase === 'study') {
        setCurrentPhase('break');
        setSecondsRemaining(5 * 60);
        showToast('Study block complete', 'Enjoy your 5 minute cognitive reset.', 'success');
      } else if (currentPhase === 'break') {
        setCurrentPhase('flashcards');
        setSecondsRemaining(selectedDurationMins * 60);
        showToast('Break over', `Time for active recall flashcards on ${selectedSubject}.`, 'info');
      }
    }
    return () => clearInterval(interval);
  }, [isActive, secondsRemaining, currentPhase, showToast, selectedDurationMins, selectedSubject]);

  const handleSelectDuration = (mins: number) => {
    setSelectedDurationMins(mins);
    if (!isActive) {
      setSecondsRemaining(mins * 60);
    }
  };

  const handleCopyNotes = () => {
    if (!scratchNotes.trim()) return;
    navigator.clipboard.writeText(scratchNotes);
    setCopiedNotes(true);
    showToast('Notes copied', 'Paste into AI Tutor or study document.', 'info');
    setTimeout(() => setCopiedNotes(false), 2000);
  };

  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleFinishEarly = () => {
    setIsActive(false);
    const minutesCompleted = Math.max(15, Math.round((selectedDurationMins * 60 - secondsRemaining) / 60) || selectedDurationMins);
    showToast('Focus session logged', `${minutesCompleted} minutes recorded to today’s study metrics.`, 'success');
    if (onSessionComplete) onSessionComplete(minutesCompleted);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 1050,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px',
        }}
      >
        {/* Deep Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          style={{
            position: 'absolute',
            inset: 0,
            backgroundColor: 'rgba(9, 9, 11, 0.88)',
            backdropFilter: 'blur(6px)',
          }}
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 10 }}
          transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
          style={{
            position: 'relative',
            width: '100%',
            maxWidth: '680px',
            backgroundColor: 'var(--surface-primary)',
            border: '1px solid var(--border-strong)',
            borderRadius: 'var(--radius-xl)',
            boxShadow: '0 30px 60px rgba(0, 0, 0, 0.8), 0 0 0 1px rgba(200, 169, 107, 0.1)',
            overflow: 'hidden',
            zIndex: 20,
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {/* Header */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '18px 24px',
              borderBottom: '1px solid var(--border-default)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Sparkles size={16} style={{ color: 'var(--accent-primary)' }} />
              <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>
                Active Study Session
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <button
                onClick={() => setSoundEnabled(!soundEnabled)}
                title={soundEnabled ? 'Mute ambient sound' : 'Enable ambient white noise'}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '5px 10px',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: soundEnabled ? 'var(--accent-subtle)' : 'var(--surface-secondary)',
                  color: soundEnabled ? 'var(--accent-primary)' : 'var(--text-muted)',
                  fontSize: '12px',
                }}
              >
                {soundEnabled ? <Volume2 size={14} /> : <VolumeX size={14} />}
                <span>{soundEnabled ? 'Ambient: On' : 'Silent'}</span>
              </button>

              <button
                onClick={onClose}
                style={{ color: 'var(--text-muted)', padding: '4px' }}
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Session Body */}
          <div style={{ padding: '24px 28px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
            {/* Subject Selector Chips */}
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', justifyContent: 'center' }}>
              {['DBMS', 'OS', 'AI/ML', 'Mathematics'].map((sub) => (
                <button
                  key={sub}
                  type="button"
                  onClick={() => setSelectedSubject(sub)}
                  style={{
                    padding: '4px 10px',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '11px',
                    fontWeight: 600,
                    backgroundColor: selectedSubject === sub ? 'var(--accent-subtle)' : 'var(--surface-secondary)',
                    border: '1px solid',
                    borderColor: selectedSubject === sub ? 'var(--accent-primary)' : 'var(--border-subtle)',
                    color: selectedSubject === sub ? 'var(--accent-light)' : 'var(--text-muted)',
                    cursor: 'pointer',
                  }}
                >
                  {sub}
                </button>
              ))}
            </div>

            {/* Context Badge */}
            <div style={{ textAlign: 'center' }}>
              <span
                style={{
                  fontSize: '11px',
                  fontWeight: 700,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  color: 'var(--accent-primary)',
                  backgroundColor: 'var(--accent-subtle)',
                  padding: '3px 10px',
                  borderRadius: '4px',
                  border: '1px solid var(--accent-border)',
                }}
              >
                {currentPhase === 'study' ? 'Phase 1: Deep Revision' : currentPhase === 'break' ? 'Phase 2: Cognitive Rest' : 'Phase 3: Flashcards'}
              </span>
              <h3 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--text-primary)', marginTop: '8px' }}>
                {selectedSubject === 'DBMS'
                  ? 'DBMS Unit 3: Normalization & 3NF Synthesis'
                  : selectedSubject === 'OS'
                  ? 'Operating Systems: Virtual Memory & Paging'
                  : selectedSubject === 'AI/ML'
                  ? 'Artificial Intelligence: Search Heuristics'
                  : 'Mathematics: Linear Transformations & Proofs'}
              </h3>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '2px' }}>
                {selectedSubject === 'DBMS' ? 'Targeted for DBMS CIA in 4 days' : 'Curriculum focus block'}
              </p>
            </div>

            {/* Duration Selector */}
            <div style={{ display: 'flex', gap: '8px' }}>
              {[25, 45, 60].map((mins) => (
                <button
                  key={mins}
                  type="button"
                  onClick={() => handleSelectDuration(mins)}
                  style={{
                    padding: '4px 12px',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '12px',
                    fontWeight: selectedDurationMins === mins ? 600 : 400,
                    backgroundColor: selectedDurationMins === mins ? 'var(--surface-elevated)' : 'transparent',
                    border: '1px solid',
                    borderColor: selectedDurationMins === mins ? 'var(--border-strong)' : 'var(--border-subtle)',
                    color: selectedDurationMins === mins ? 'var(--text-primary)' : 'var(--text-muted)',
                  }}
                >
                  {mins} min
                </button>
              ))}
            </div>

            {/* Huge Clean Focus Timer */}
            <div
              style={{
                fontSize: '68px',
                fontWeight: 700,
                letterSpacing: '-0.03em',
                color: 'var(--text-primary)',
                fontFamily: 'monospace',
                lineHeight: 1,
              }}
            >
              {formatTime(secondsRemaining)}
            </div>

            {/* Timer Controls */}
            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={() => setIsActive(!isActive)}
                className="btn btn-accent-solid"
                style={{ padding: '10px 24px', fontSize: '14px', gap: '8px' }}
              >
                {isActive ? <Pause size={16} /> : <Play size={16} fill="currentColor" />}
                <span>{isActive ? 'Pause Focus' : 'Start Focus'}</span>
              </button>

              <button
                onClick={() => {
                  setIsActive(false);
                  setSecondsRemaining(selectedDurationMins * 60);
                }}
                className="btn btn-secondary"
                style={{ padding: '10px 14px' }}
                title="Reset timer"
              >
                <RotateCcw size={16} />
              </button>
            </div>

            {/* Quick Scratchpad during session */}
            <div style={{ width: '100%', marginTop: '4px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)' }}>
                  <Edit3 size={13} />
                  <span>Session Scratchpad &amp; Doubt Log</span>
                </div>
                {scratchNotes.trim() && (
                  <button
                    type="button"
                    onClick={handleCopyNotes}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      fontSize: '11px',
                      color: 'var(--accent-primary)',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                    }}
                  >
                    {copiedNotes ? <Check size={12} /> : <Copy size={12} />}
                    <span>{copiedNotes ? 'Copied' : 'Copy Notes'}</span>
                  </button>
                )}
              </div>
              <textarea
                value={scratchNotes}
                onChange={(e) => setScratchNotes(e.target.value)}
                placeholder="Jot down quick thoughts, formulas, or questions for the AI Tutor..."
                rows={2}
                style={{
                  width: '100%',
                  fontSize: '13px',
                  backgroundColor: 'var(--surface-secondary)',
                  border: '1px solid var(--border-default)',
                  borderRadius: 'var(--radius-md)',
                  resize: 'none',
                }}
              />
            </div>
          </div>

          {/* Footer Bar */}
          <div
            style={{
              padding: '14px 24px',
              backgroundColor: 'var(--surface-secondary)',
              borderTop: '1px solid var(--border-default)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
              STELLAR Focus Session • Spaced cognitive intervals
            </span>
            <button
              onClick={handleFinishEarly}
              className="btn btn-primary"
              style={{ fontSize: '12px', padding: '6px 12px' }}
            >
              Complete &amp; Log Session
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
