import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, X, BookOpen, CheckSquare, Calendar, Files, MessageSquare, Layers, ChevronRight } from 'lucide-react';
import { SUBJECTS, INITIAL_TASKS, UPCOMING_ASSESSMENTS, DOCUMENTS, FLASHCARDS } from '../../data/mockData';
import { NavRoute } from './Sidebar';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (route: NavRoute) => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({
  isOpen,
  onClose,
  onNavigate,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 80);
      setSearchTerm('');
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '/' && !isOpen && document.activeElement?.tagName !== 'INPUT' && document.activeElement?.tagName !== 'TEXTAREA') {
        e.preventDefault();
        // Trigger handled externally or via parent
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const query = searchTerm.toLowerCase().trim();

  const matchingSubjects = SUBJECTS.filter(s =>
    !query || s.name.toLowerCase().includes(query) || s.code.toLowerCase().includes(query)
  );

  const matchingTasks = INITIAL_TASKS.filter(t =>
    !query || t.title.toLowerCase().includes(query) || t.subject.toLowerCase().includes(query)
  );

  const matchingAssessments = UPCOMING_ASSESSMENTS.filter(a =>
    !query || a.title.toLowerCase().includes(query) || a.subjectCode.toLowerCase().includes(query)
  );

  const matchingDocs = DOCUMENTS.filter(d =>
    !query || d.name.toLowerCase().includes(query) || d.category.toLowerCase().includes(query)
  );

  const matchingCards = FLASHCARDS.filter(f =>
    !query || f.question.toLowerCase().includes(query) || f.subjectCode.toLowerCase().includes(query)
  );

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
            paddingTop: '10vh',
            paddingLeft: '16px',
            paddingRight: '16px',
          }}
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            style={{
              position: 'absolute',
              inset: 0,
              backgroundColor: 'rgba(9, 9, 11, 0.8)',
              backdropFilter: 'blur(4px)',
            }}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.97, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: -10 }}
            transition={{ duration: 0.2 }}
            style={{
              position: 'relative',
              width: '100%',
              maxWidth: '640px',
              backgroundColor: 'var(--surface-primary)',
              border: '1px solid var(--border-strong)',
              borderRadius: 'var(--radius-xl)',
              boxShadow: '0 25px 50px -12px rgba(0,0,0,0.7)',
              overflow: 'hidden',
              zIndex: 20,
            }}
          >
            {/* Search Input Bar */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '16px 20px',
                borderBottom: '1px solid var(--border-default)',
              }}
            >
              <Search size={18} style={{ color: 'var(--text-muted)' }} />
              <input
                ref={inputRef}
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search subjects, tasks, documents, flashcards (try 'DBMS')..."
                style={{
                  flex: 1,
                  background: 'transparent',
                  border: 'none',
                  padding: 0,
                  fontSize: '15px',
                  color: 'var(--text-primary)',
                  outline: 'none',
                  boxShadow: 'none',
                }}
              />
              <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>ESC</span>
            </div>

            {/* Categorized Search Results */}
            <div
              style={{
                maxHeight: '440px',
                overflowY: 'auto',
                padding: '16px 20px',
                display: 'flex',
                flexDirection: 'column',
                gap: '16px',
              }}
            >
              {/* Subjects */}
              {matchingSubjects.length > 0 && (
                <div>
                  <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '8px' }}>
                    Subjects ({matchingSubjects.length})
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    {matchingSubjects.map(s => (
                      <div
                        key={s.id}
                        onClick={() => {
                          onClose();
                          onNavigate('subjects');
                        }}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '8px 12px',
                          borderRadius: 'var(--radius-md)',
                          backgroundColor: 'var(--surface-secondary)',
                          cursor: 'pointer',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <BookOpen size={15} style={{ color: 'var(--accent-primary)' }} />
                          <span style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text-primary)' }}>
                            {s.code}: {s.name}
                          </span>
                        </div>
                        <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                          Attendance {s.attendance.percentage}%
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Assessments */}
              {matchingAssessments.length > 0 && (
                <div>
                  <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '8px' }}>
                    Assessments ({matchingAssessments.length})
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    {matchingAssessments.map(a => (
                      <div
                        key={a.id}
                        onClick={() => {
                          onClose();
                          onNavigate('assessments');
                        }}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '8px 12px',
                          borderRadius: 'var(--radius-md)',
                          backgroundColor: 'var(--surface-secondary)',
                          cursor: 'pointer',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <Calendar size={15} style={{ color: 'var(--color-warning)' }} />
                          <span style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text-primary)' }}>
                            {a.title} ({a.subjectCode})
                          </span>
                        </div>
                        <span style={{ fontSize: '12px', color: 'var(--color-warning)' }}>
                          {a.daysRemaining} days left ({a.date})
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tasks */}
              {matchingTasks.length > 0 && (
                <div>
                  <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '8px' }}>
                    Tasks ({matchingTasks.length})
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    {matchingTasks.slice(0, 3).map(t => (
                      <div
                        key={t.id}
                        onClick={() => {
                          onClose();
                          onNavigate('tasks');
                        }}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '8px 12px',
                          borderRadius: 'var(--radius-md)',
                          backgroundColor: 'var(--surface-secondary)',
                          cursor: 'pointer',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <CheckSquare size={15} style={{ color: 'var(--color-info)' }} />
                          <span style={{ fontSize: '13px', color: 'var(--text-primary)' }}>
                            {t.title}
                          </span>
                        </div>
                        <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                          {t.subject}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Documents */}
              {matchingDocs.length > 0 && (
                <div>
                  <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '8px' }}>
                    Documents ({matchingDocs.length})
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    {matchingDocs.slice(0, 3).map(d => (
                      <div
                        key={d.id}
                        onClick={() => {
                          onClose();
                          onNavigate('documents');
                        }}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '8px 12px',
                          borderRadius: 'var(--radius-md)',
                          backgroundColor: 'var(--surface-secondary)',
                          cursor: 'pointer',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <Files size={15} style={{ color: 'var(--text-secondary)' }} />
                          <span style={{ fontSize: '13px', color: 'var(--text-primary)' }}>
                            {d.name}
                          </span>
                        </div>
                        <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                          {d.size}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Flashcards */}
              {matchingCards.length > 0 && (
                <div>
                  <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '8px' }}>
                    Flashcards ({matchingCards.length})
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    {matchingCards.slice(0, 2).map(f => (
                      <div
                        key={f.id}
                        onClick={() => {
                          onClose();
                          onNavigate('study');
                        }}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '8px 12px',
                          borderRadius: 'var(--radius-md)',
                          backgroundColor: 'var(--surface-secondary)',
                          cursor: 'pointer',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <Layers size={15} style={{ color: 'var(--accent-primary)' }} />
                          <span style={{ fontSize: '13px', color: 'var(--text-primary)' }}>
                            {f.question}
                          </span>
                        </div>
                        <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                          {f.subjectCode}
                        </span>
                      </div>
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
