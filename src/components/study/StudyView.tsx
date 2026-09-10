import React, { useState } from 'react';
import {
  Layers,
  FileText,
  Clock,
  Sparkles,
  CheckCircle2,
  RotateCw,
  Award,
  ChevronRight,
  BookOpen,
  ArrowRight
} from 'lucide-react';
import { FLASHCARDS, MOCK_EXAM_QUESTIONS } from '../../data/mockData';

export const StudyView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'flashcards' | 'notes' | 'mock-exam'>('flashcards');

  // Flashcards state
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [cardsReviewed, setCardsReviewed] = useState(12);

  // Notes Generator state
  const [selectedDoc, setSelectedDoc] = useState('DBMS_Unit3_Normalization_Syllabus.pdf');
  const [isGeneratingNotes, setIsGeneratingNotes] = useState(false);
  const [generatedNotes, setGeneratedNotes] = useState<boolean>(true);

  // Mock Exam state
  const [examStatus, setExamStatus] = useState<'idle' | 'in-progress' | 'completed'>('idle');
  const [examCurrentQ, setExamCurrentQ] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [examScore, setExamScore] = useState(0);

  const activeCard = FLASHCARDS[currentCardIndex % FLASHCARDS.length];

  const handleNextCard = () => {
    setIsFlipped(false);
    setCurrentCardIndex((prev) => (prev + 1) % FLASHCARDS.length);
    setCardsReviewed((prev) => prev + 1);
  };

  const handleGenerateNotes = () => {
    setIsGeneratingNotes(true);
    setTimeout(() => {
      setIsGeneratingNotes(false);
      setGeneratedNotes(true);
    }, 800);
  };

  const handleAnswerSelect = (optionIdx: number) => {
    const updated = [...selectedAnswers];
    updated[examCurrentQ] = optionIdx;
    setSelectedAnswers(updated);
  };

  const handleFinishExam = () => {
    let score = 0;
    MOCK_EXAM_QUESTIONS.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.correctOptionIndex) {
        score++;
      }
    });
    setExamScore(score);
    setExamStatus('completed');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px', maxWidth: '1100px', margin: '0 auto' }}>
      {/* Header */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
          <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Intelligent Learning Workspace</span>
          <span style={{ color: 'var(--border-strong)' }}>•</span>
          <span style={{ fontSize: '12px', color: 'var(--accent-primary)', fontWeight: 500 }}>Active Recall & Retrieval Practice</span>
        </div>
        <h2 style={{ fontSize: '28px', fontWeight: 600, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
          Study Hub
        </h2>
        <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginTop: '4px' }}>
          Spaced-repetition flashcards, syllabus notes synthesizer, and mock examination engines.
        </p>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid var(--border-default)', paddingBottom: '12px' }}>
        <button
          onClick={() => setActiveTab('flashcards')}
          style={{
            padding: '6px 14px',
            borderRadius: 'var(--radius-md)',
            fontSize: '13px',
            fontWeight: activeTab === 'flashcards' ? 600 : 400,
            backgroundColor: activeTab === 'flashcards' ? 'var(--surface-elevated)' : 'transparent',
            color: activeTab === 'flashcards' ? 'var(--text-primary)' : 'var(--text-secondary)',
            border: '1px solid',
            borderColor: activeTab === 'flashcards' ? 'var(--border-strong)' : 'transparent',
          }}
        >
          Spaced Flashcards
        </button>

        <button
          onClick={() => setActiveTab('notes')}
          style={{
            padding: '6px 14px',
            borderRadius: 'var(--radius-md)',
            fontSize: '13px',
            fontWeight: activeTab === 'notes' ? 600 : 400,
            backgroundColor: activeTab === 'notes' ? 'var(--surface-elevated)' : 'transparent',
            color: activeTab === 'notes' ? 'var(--text-primary)' : 'var(--text-secondary)',
            border: '1px solid',
            borderColor: activeTab === 'notes' ? 'var(--border-strong)' : 'transparent',
          }}
        >
          Notes Generator
        </button>

        <button
          onClick={() => setActiveTab('mock-exam')}
          style={{
            padding: '6px 14px',
            borderRadius: 'var(--radius-md)',
            fontSize: '13px',
            fontWeight: activeTab === 'mock-exam' ? 600 : 400,
            backgroundColor: activeTab === 'mock-exam' ? 'var(--surface-elevated)' : 'transparent',
            color: activeTab === 'mock-exam' ? 'var(--text-primary)' : 'var(--text-secondary)',
            border: '1px solid',
            borderColor: activeTab === 'mock-exam' ? 'var(--border-strong)' : 'transparent',
          }}
        >
          Mock Exam Engine
        </button>
      </div>

      {/* 1. Flashcards View */}
      {activeTab === 'flashcards' && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
          {/* Deck Status Bar */}
          <div style={{ width: '100%', maxWidth: '640px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '13px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="badge badge-accent">{activeCard.subjectCode}</span>
              <span style={{ color: 'var(--text-muted)' }}>{activeCard.topic}</span>
            </div>
            <span style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>
              Progress: {cardsReviewed} / 30 reviewed
            </span>
          </div>

          {/* Flashcard Component */}
          <div
            onClick={() => setIsFlipped(!isFlipped)}
            style={{
              width: '100%',
              maxWidth: '640px',
              minHeight: '280px',
              backgroundColor: 'var(--surface-primary)',
              border: '1px solid var(--border-strong)',
              borderRadius: 'var(--radius-xl)',
              padding: '36px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              cursor: 'pointer',
              userSelect: 'none',
              boxShadow: '0 12px 28px rgba(0,0,0,0.35)',
              transition: 'transform var(--transition-fast), border-color var(--transition-fast)',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'var(--accent-primary)')}
            onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'var(--border-strong)')}
          >
            <div>
              <span style={{ fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)' }}>
                {isFlipped ? 'Answer' : 'Question (Click to flip)'}
              </span>
              <div
                style={{
                  fontSize: isFlipped ? '15px' : '20px',
                  fontWeight: isFlipped ? 400 : 600,
                  color: 'var(--text-primary)',
                  lineHeight: 1.6,
                  marginTop: '16px',
                  whiteSpace: 'pre-line',
                }}
              >
                {isFlipped ? activeCard.answer : activeCard.question}
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '16px', borderTop: '1px solid var(--border-subtle)' }}>
              <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                {isFlipped ? 'Rate difficulty below to schedule next interval' : 'Click card to reveal answer'}
              </span>
              <RotateCw size={15} style={{ color: 'var(--text-muted)' }} />
            </div>
          </div>

          {/* Spaced Repetition Rating Controls */}
          {isFlipped ? (
            <div style={{ display: 'flex', gap: '12px', width: '100%', maxWidth: '640px' }}>
              <button
                onClick={handleNextCard}
                className="btn btn-secondary"
                style={{ flex: 1, borderColor: 'var(--color-danger-border)', color: 'var(--color-danger)' }}
              >
                Again (&lt;1m)
              </button>
              <button
                onClick={handleNextCard}
                className="btn btn-secondary"
                style={{ flex: 1, borderColor: 'var(--color-warning-border)', color: 'var(--color-warning)' }}
              >
                Hard (1d)
              </button>
              <button
                onClick={handleNextCard}
                className="btn btn-secondary"
                style={{ flex: 1, borderColor: 'var(--color-info-border)', color: 'var(--color-info)' }}
              >
                Good (3d)
              </button>
              <button
                onClick={handleNextCard}
                className="btn btn-secondary"
                style={{ flex: 1, borderColor: 'var(--color-success-border)', color: 'var(--color-success)' }}
              >
                Easy (7d)
              </button>
            </div>
          ) : (
            <button
              onClick={() => setIsFlipped(true)}
              className="btn btn-primary"
              style={{ width: '100%', maxWidth: '640px', padding: '12px' }}
            >
              Show Answer
            </button>
          )}
        </div>
      )}

      {/* 2. Notes Generator View */}
      {activeTab === 'notes' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="card-base" style={{ padding: '20px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '4px' }}>
              Generate Structured Academic Notes
            </h3>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '16px' }}>
              Select an uploaded textbook or lecture syllabus from Document Vault to extract high-yield notes.
            </p>

            <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
              <select
                value={selectedDoc}
                onChange={(e) => setSelectedDoc(e.target.value)}
                style={{ minWidth: '320px' }}
              >
                <option value="DBMS_Unit3_Normalization_Syllabus.pdf">DBMS_Unit3_Normalization_Syllabus.pdf</option>
                <option value="AIML_Lecture_Slides_SupervisedLearning.pptx">AIML_Lecture_Slides_SupervisedLearning.pptx</option>
                <option value="OS_Process_Concurrency_LabManual.pdf">OS_Process_Concurrency_LabManual.pdf</option>
              </select>

              <button
                onClick={handleGenerateNotes}
                disabled={isGeneratingNotes}
                className="btn btn-accent-solid"
              >
                <Sparkles size={14} />
                <span>{isGeneratingNotes ? 'Synthesizing...' : 'Generate Notes'}</span>
              </button>
            </div>
          </div>

          {/* Generated Structured Output */}
          {generatedNotes && (
            <div className="card-base" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid var(--border-default)', paddingBottom: '14px' }}>
                <div>
                  <span className="badge badge-accent">Generated Notes</span>
                  <h3 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--text-primary)', marginTop: '4px' }}>
                    DBMS Unit 3: Functional Dependencies & Normal Forms
                  </h3>
                  <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Source: {selectedDoc}</span>
                </div>
                <button className="btn btn-secondary" style={{ fontSize: '12px' }}>
                  Save to Vault
                </button>
              </div>

              {/* Summary */}
              <div>
                <h4 style={{ fontSize: '14px', fontWeight: 600, color: 'var(--accent-light)', marginBottom: '6px' }}>
                  1. Executive Summary
                </h4>
                <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                  Normalization is the systematic process of organizing relation schemas to reduce data redundancy and eliminate insertion, update, and deletion anomalies. It decomposes tables using functional dependencies into progressively stricter normal forms (1NF → 2NF → 3NF → BCNF).
                </p>
              </div>

              {/* Definitions */}
              <div>
                <h4 style={{ fontSize: '14px', fontWeight: 600, color: 'var(--accent-light)', marginBottom: '6px' }}>
                  2. Core Definitions
                </h4>
                <ul style={{ paddingLeft: '20px', fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                  <li><strong>Functional Dependency (X → Y):</strong> If two tuples agree on attribute X, they must also agree on attribute Y.</li>
                  <li><strong>Superkey:</strong> A set of attributes that uniquely identifies every tuple in relation R.</li>
                  <li><strong>Prime Attribute:</strong> An attribute that is a member of ANY candidate key for relation R.</li>
                </ul>
              </div>

              {/* Exam Points */}
              <div style={{ padding: '14px 16px', backgroundColor: 'var(--surface-secondary)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                <h4 style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-warning)', marginBottom: '6px' }}>
                  ✦ High-Yield Exam Points (Sep 18 CIA)
                </h4>
                <ul style={{ paddingLeft: '18px', fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                  <li>3NF synthesis guarantees both <strong>Lossless Join</strong> and <strong>Dependency Preservation</strong>.</li>
                  <li>BCNF decomposition guarantees <strong>Lossless Join</strong>, but may NOT preserve all functional dependencies.</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 3. Mock Exam Engine */}
      {activeTab === 'mock-exam' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {examStatus === 'idle' && (
            <div className="card-base" style={{ padding: '28px', maxWidth: '640px', margin: '0 auto', width: '100%' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <Award size={18} style={{ color: 'var(--accent-primary)' }} />
                <h3 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--text-primary)' }}>
                  Interactive Mock Examination
                </h3>
              </div>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '20px' }}>
                Timed assessment modeled after standard university CIA format.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Target Subject:</span>
                  <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>CS301: DBMS</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Questions:</span>
                  <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{MOCK_EXAM_QUESTIONS.length} Questions</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Duration:</span>
                  <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>10 Minutes</span>
                </div>
              </div>

              <button
                onClick={() => {
                  setSelectedAnswers([]);
                  setExamCurrentQ(0);
                  setExamStatus('in-progress');
                }}
                className="btn btn-accent-solid"
                style={{ width: '100%', padding: '12px' }}
              >
                Start Mock Exam
              </button>
            </div>
          )}

          {examStatus === 'in-progress' && (
            <div className="card-base" style={{ padding: '24px', maxWidth: '720px', margin: '0 auto', width: '100%' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                  Question {examCurrentQ + 1} of {MOCK_EXAM_QUESTIONS.length}
                </span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--color-warning)', fontSize: '13px', fontWeight: 600 }}>
                  <Clock size={15} />
                  <span>08:42 remaining</span>
                </div>
              </div>

              <div style={{ fontSize: '16px', fontWeight: 500, color: 'var(--text-primary)', marginBottom: '20px', lineHeight: 1.5 }}>
                {MOCK_EXAM_QUESTIONS[examCurrentQ].question}
              </div>

              {/* Options */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '24px' }}>
                {MOCK_EXAM_QUESTIONS[examCurrentQ].options.map((opt, oIdx) => {
                  const isSelected = selectedAnswers[examCurrentQ] === oIdx;

                  return (
                    <div
                      key={oIdx}
                      onClick={() => handleAnswerSelect(oIdx)}
                      style={{
                        padding: '12px 16px',
                        borderRadius: 'var(--radius-md)',
                        backgroundColor: isSelected ? 'var(--surface-elevated)' : 'var(--surface-secondary)',
                        border: '1px solid',
                        borderColor: isSelected ? 'var(--accent-primary)' : 'var(--border-default)',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        fontSize: '13px',
                        color: 'var(--text-primary)',
                      }}
                    >
                      <div
                        style={{
                          width: '16px',
                          height: '16px',
                          borderRadius: '50%',
                          border: '1.5px solid',
                          borderColor: isSelected ? 'var(--accent-primary)' : 'var(--border-strong)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        {isSelected && <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--accent-primary)' }} />}
                      </div>
                      <span>{opt}</span>
                    </div>
                  );
                })}
              </div>

              {/* Exam Nav Buttons */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <button
                  onClick={() => setExamCurrentQ((prev) => Math.max(0, prev - 1))}
                  disabled={examCurrentQ === 0}
                  className="btn btn-secondary"
                >
                  Previous
                </button>

                {examCurrentQ < MOCK_EXAM_QUESTIONS.length - 1 ? (
                  <button
                    onClick={() => setExamCurrentQ((prev) => prev + 1)}
                    className="btn btn-primary"
                  >
                    Next Question
                  </button>
                ) : (
                  <button
                    onClick={handleFinishExam}
                    className="btn btn-accent-solid"
                  >
                    Submit Exam
                  </button>
                )}
              </div>
            </div>
          )}

          {examStatus === 'completed' && (
            <div className="card-base" style={{ padding: '28px', maxWidth: '640px', margin: '0 auto', width: '100%', textAlign: 'center' }}>
              <Award size={40} style={{ color: 'var(--accent-primary)', margin: '0 auto 12px auto' }} />
              <h3 style={{ fontSize: '20px', fontWeight: 600, color: 'var(--text-primary)' }}>
                Exam Assessment Complete
              </h3>
              <div style={{ fontSize: '28px', fontWeight: 700, color: 'var(--accent-light)', margin: '12px 0' }}>
                {examScore} / {MOCK_EXAM_QUESTIONS.length} Correct
              </div>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '20px' }}>
                Strong topic: Transaction anomalies. Weak topic: BCNF decomposition guarantees.
              </p>

              <button
                onClick={() => setExamStatus('idle')}
                className="btn btn-secondary"
              >
                Retake or Select Another Subject
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
