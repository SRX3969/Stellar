import React, { useState, useRef, useEffect } from 'react';
import {
  Paperclip,
  Mic,
  ArrowUp,
  Image as ImageIcon,
  X,
  Sparkles,
  Bot,
  User,
  BookOpen,
  CheckCircle2,
  Copy,
  ChevronDown
} from 'lucide-react';
import { AIMessage } from '../../types';
import { INITIAL_AI_MESSAGES } from '../../data/mockData';

const TUTOR_MODES = [
  'Ask Anything',
  'Teach Me',
  'Explain',
  'Solve This',
  'Exam Mode',
  'Summarize',
  'Generate Notes',
  'Flashcards',
  'Mock Test',
];

const SAMPLE_THREADS = [
  { id: 'th-1', title: 'DBMS Unit 3: 3NF vs BCNF Synthesis', time: 'Yesterday' },
  { id: 'th-2', title: 'Matrix Eigenvalues & Diagonalization Proof', time: 'Sep 7' },
  { id: 'th-3', title: 'OS Deadlock Banker Algorithm Simulation', time: 'Sep 5' },
  { id: 'th-4', title: 'AI/ML Gradient Descent Step Size Decay', time: 'Sep 3' },
];

export const AITutorView: React.FC = () => {
  const [messages, setMessages] = useState<AIMessage[]>(INITIAL_AI_MESSAGES);
  const [inputMessage, setInputMessage] = useState('');
  const [selectedMode, setSelectedMode] = useState('Ask Anything');
  const [attachedImage, setAttachedImage] = useState<{ name: string; url: string } | null>(null);
  const [isAiThinking, setIsAiThinking] = useState(false);
  const [isListeningVoice, setIsListeningVoice] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isAiThinking]);

  const handleSend = (textToSend?: string) => {
    const text = textToSend || inputMessage;
    if (!text.trim() && !attachedImage) return;

    const userMsg: AIMessage = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      mode: selectedMode,
      attachment: attachedImage ? { name: attachedImage.name, type: 'image', url: attachedImage.url } : undefined,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage('');
    const currentAttachment = attachedImage;
    setAttachedImage(null);
    setIsAiThinking(true);

    // Simulate AI response based on mode and query
    setTimeout(() => {
      let responseContent = '';

      if (currentAttachment) {
        responseContent = `I have analyzed the attached diagram/problem **"${currentAttachment.name}"**.\n\n### Analysis & Step-by-Step Resolution:\n1. **Identified Schema**: Relation $R(A, B, C, D)$ with Functional Dependencies: $A \\rightarrow B$ and $B \\rightarrow C, C \\rightarrow D$.\n2. **Candidate Key**: Attribute $A$ uniquely determines all attributes via closure $A^+ = \\{A, B, C, D\\}$.\n3. **Normal Form Check**: \n   - $B \\rightarrow C$ violates 3NF because $B$ is not a superkey and $C$ is not a prime attribute.\n4. **BCNF Decomposition**: \n   - Decompose into $R_1(B, C)$ with F.D. $B \\rightarrow C$\n   - Decompose into $R_2(C, D)$ with F.D. $C \\rightarrow D$\n   - Remaining relation $R_3(A, B)$ with $A \\rightarrow B$\n   - This decomposition is guaranteed **lossless join**.\n\nWould you like me to generate 5 practice questions for this topic?`;
      } else {
        const lower = text.toLowerCase();
        if (lower.includes('bcnf') || lower.includes('3nf')) {
          responseContent = `### Boyce-Codd Normal Form (BCNF) vs 3NF\n\nA relation is in **3NF** if for every non-trivial functional dependency $X \\rightarrow Y$, at least one of the following holds:\n- $X$ is a superkey, OR\n- $Y$ is a prime attribute (part of any candidate key).\n\n**BCNF is strictly stronger**:\n- In BCNF, the second condition is eliminated! For *every* non-trivial dependency $X \\rightarrow Y$, $X$ MUST be a superkey.\n\n**Key Exam Takeaway**:\nEvery relation in BCNF is automatically in 3NF. However, BCNF decomposition cannot always preserve functional dependencies, whereas 3NF synthesis guarantees both lossless join and dependency preservation.`;
        } else if (lower.includes('exam') || selectedMode === 'Exam Mode') {
          responseContent = `### [Exam Mode: High-Yield Revision]\n\nBased on your upcoming **DBMS CIA in 4 days**, here are the top 3 high-probability questions:\n\n1. **State and prove Armstrong's Axioms** (Reflexivity, Augmentation, Transitivity).\n2. **Explain Conflict Serializability** and describe how precedence graphs detect non-serializable schedules.\n3. **Compare 3NF and BCNF with a counterexample relation**.\n\nShall we test your answer to question 1 right now?`;
        } else {
          responseContent = `I've structured a response for your question in **${selectedMode}** mode:\n\nRegarding "${text}":\n\n- **Core Principle**: In your current syllabus, this concept directly underpins this week's problem sets and lab evaluations.\n- **Recommended Approach**: First master the formal definitions, then practice identifying edge cases where assumptions fail.\n\nFeel free to upload an image of your textbook problem or handwritten attempt, and I will check your steps!`;
        }
      }

      const assistantMsg: AIMessage = {
        id: `msg-${Date.now() + 1}`,
        role: 'assistant',
        content: responseContent,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        mode: selectedMode,
      };

      setMessages((prev) => [...prev, assistantMsg]);
      setIsAiThinking(false);
    }, 1200);
  };

  const handleSimulateImageUpload = () => {
    // Attach a realistic textbook snapshot
    setAttachedImage({
      name: 'DBMS_Normalization_Problem_Unit3.png',
      url: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=600&auto=format&fit=crop&q=80',
    });
  };

  return (
    <div
      style={{
        display: 'flex',
        height: 'calc(100vh - var(--topbar-height) - 40px)',
        backgroundColor: 'var(--surface-primary)',
        border: '1px solid var(--border-default)',
        borderRadius: 'var(--radius-lg)',
        overflow: 'hidden',
      }}
    >
      {/* AI Tutor Left Sidebar: Chat History */}
      <div
        className="hide-on-mobile"
        style={{
          width: '260px',
          borderRight: '1px solid var(--border-default)',
          backgroundColor: 'var(--surface-secondary)',
          display: 'flex',
          flexDirection: 'column',
          padding: '16px 12px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px', padding: '0 4px' }}>
          <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
            Academic Threads
          </span>
          <span style={{ fontSize: '11px', color: 'var(--accent-primary)', fontWeight: 500 }}>Active</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', overflowY: 'auto', flex: 1 }}>
          {SAMPLE_THREADS.map((thread) => (
            <div
              key={thread.id}
              style={{
                padding: '9px 10px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: thread.id === 'th-1' ? 'var(--surface-elevated)' : 'transparent',
                border: '1px solid',
                borderColor: thread.id === 'th-1' ? 'var(--border-strong)' : 'transparent',
                cursor: 'pointer',
                transition: 'all var(--transition-fast)',
              }}
              onMouseEnter={(e) => {
                if (thread.id !== 'th-1') e.currentTarget.style.backgroundColor = 'var(--surface-hover)';
              }}
              onMouseLeave={(e) => {
                if (thread.id !== 'th-1') e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              <div style={{ fontSize: '13px', color: 'var(--text-primary)', fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {thread.title}
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
                {thread.time}
              </div>
            </div>
          ))}
        </div>

        {/* Syllabus Context Pill */}
        <div
          style={{
            padding: '12px',
            backgroundColor: 'var(--surface-primary)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-subtle)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: 'var(--accent-primary)', fontWeight: 600, textTransform: 'uppercase' }}>
            <Sparkles size={13} /> Current Focus
          </div>
          <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>
            CS301: DBMS CIA preparation (Unit 3 Normalization)
          </div>
        </div>
      </div>

      {/* Main Conversation Container */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          minWidth: 0,
          backgroundColor: 'var(--bg-main)',
        }}
      >
        {/* Header & Modes Selector */}
        <div
          style={{
            padding: '12px 20px',
            backgroundColor: 'var(--surface-primary)',
            borderBottom: '1px solid var(--border-default)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            overflowX: 'auto',
          }}
        >
          <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 500, marginRight: '4px', whiteSpace: 'nowrap' }}>
            Mode:
          </span>
          {TUTOR_MODES.map((mode) => {
            const isSelected = selectedMode === mode;
            return (
              <button
                key={mode}
                onClick={() => setSelectedMode(mode)}
                style={{
                  padding: '5px 11px',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '12px',
                  fontWeight: isSelected ? 600 : 400,
                  backgroundColor: isSelected ? 'var(--accent-subtle)' : 'var(--surface-secondary)',
                  color: isSelected ? 'var(--accent-light)' : 'var(--text-secondary)',
                  border: '1px solid',
                  borderColor: isSelected ? 'var(--accent-border)' : 'var(--border-default)',
                  whiteSpace: 'nowrap',
                  transition: 'all var(--transition-fast)',
                }}
              >
                {mode}
              </button>
            );
          })}
        </div>

        {/* Message Log */}
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '24px 28px',
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
          }}
        >
          {messages.map((msg) => {
            const isAssistant = msg.role === 'assistant';
            return (
              <div
                key={msg.id}
                style={{
                  display: 'flex',
                  gap: '14px',
                  alignItems: 'flex-start',
                  maxWidth: isAssistant ? '880px' : '720px',
                  alignSelf: isAssistant ? 'flex-start' : 'flex-end',
                }}
              >
                {isAssistant && (
                  <div
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '8px',
                      backgroundColor: 'var(--surface-elevated)',
                      border: '1px solid var(--border-strong)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'var(--accent-primary)',
                      flexShrink: 0,
                    }}
                  >
                    <Sparkles size={16} />
                  </div>
                )}

                <div
                  style={{
                    backgroundColor: isAssistant ? 'var(--surface-primary)' : 'var(--surface-elevated)',
                    border: '1px solid',
                    borderColor: isAssistant ? 'var(--border-default)' : 'var(--border-strong)',
                    borderRadius: 'var(--radius-lg)',
                    padding: '16px 20px',
                    color: 'var(--text-primary)',
                    fontSize: '14px',
                    lineHeight: 1.6,
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                  }}
                >
                  {/* Attachment Preview if present */}
                  {msg.attachment && (
                    <div
                      style={{
                        marginBottom: '12px',
                        padding: '10px 12px',
                        backgroundColor: 'var(--surface-secondary)',
                        borderRadius: 'var(--radius-md)',
                        border: '1px solid var(--border-default)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                      }}
                    >
                      <ImageIcon size={16} style={{ color: 'var(--accent-primary)' }} />
                      <span style={{ fontSize: '12px', fontWeight: 500, color: 'var(--text-primary)' }}>
                        {msg.attachment.name}
                      </span>
                    </div>
                  )}

                  {/* Body Content */}
                  <div style={{ whiteSpace: 'pre-line' }}>
                    {msg.content}
                  </div>

                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'flex-end',
                      gap: '8px',
                      marginTop: '8px',
                      fontSize: '11px',
                      color: 'var(--text-muted)',
                    }}
                  >
                    {msg.mode && <span>[{msg.mode}]</span>}
                    <span>{msg.timestamp}</span>
                  </div>
                </div>

                {!isAssistant && (
                  <div
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      backgroundColor: 'var(--accent-subtle)',
                      border: '1px solid var(--accent-border)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'var(--accent-primary)',
                      flexShrink: 0,
                      fontSize: '12px',
                      fontWeight: 600,
                    }}
                  >
                    A
                  </div>
                )}
              </div>
            );
          })}

          {/* AI Thinking understated loading state */}
          {isAiThinking && (
            <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '8px',
                  backgroundColor: 'var(--surface-elevated)',
                  border: '1px solid var(--border-strong)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--accent-primary)',
                }}
              >
                <Sparkles size={16} />
              </div>
              <div
                style={{
                  padding: '10px 16px',
                  backgroundColor: 'var(--surface-primary)',
                  border: '1px solid var(--border-default)',
                  borderRadius: 'var(--radius-md)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '13px',
                  color: 'var(--text-secondary)',
                }}
              >
                <div
                  style={{
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--accent-primary)',
                    animation: 'pulse 1s infinite alternate',
                  }}
                />
                <span>STELLAR is reasoning through your query...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Attachment Pending Preview Bar */}
        {attachedImage && (
          <div
            style={{
              padding: '8px 24px',
              backgroundColor: 'var(--surface-secondary)',
              borderTop: '1px solid var(--border-default)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ImageIcon size={15} style={{ color: 'var(--accent-primary)' }} />
              <span style={{ fontSize: '12px', color: 'var(--text-primary)', fontWeight: 500 }}>
                {attachedImage.name}
              </span>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>(Ready to solve)</span>
            </div>
            <button
              onClick={() => setAttachedImage(null)}
              style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center' }}
            >
              <X size={15} />
            </button>
          </div>
        )}

        {/* Bottom Composer */}
        <div
          style={{
            padding: '16px 24px 20px 24px',
            backgroundColor: 'var(--surface-primary)',
            borderTop: '1px solid var(--border-default)',
          }}
        >
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
            {/* Attachment Button */}
            <button
              onClick={handleSimulateImageUpload}
              title="Attach diagram, handwritten problem, or textbook photo"
              style={{
                color: attachedImage ? 'var(--accent-primary)' : 'var(--text-secondary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '4px',
              }}
            >
              <Paperclip size={18} />
            </button>

            {/* Hidden real file input */}
            <input
              type="file"
              ref={fileInputRef}
              style={{ display: 'none' }}
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  setAttachedImage({
                    name: e.target.files[0].name,
                    url: '',
                  });
                }
              }}
            />

            {/* Input Textarea / Input */}
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder="Ask anything... (or attach a doubt photo with 📎)"
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

            {/* Voice Dictation Button */}
            <button
              onClick={() => setIsListeningVoice(!isListeningVoice)}
              title="Voice dictation"
              style={{
                color: isListeningVoice ? 'var(--color-danger)' : 'var(--text-secondary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '4px',
              }}
            >
              <Mic size={18} />
            </button>

            {/* Send Button */}
            <button
              onClick={() => handleSend()}
              disabled={(!inputMessage.trim() && !attachedImage) || isAiThinking}
              style={{
                width: '30px',
                height: '30px',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: (inputMessage.trim() || attachedImage) ? 'var(--accent-primary)' : 'var(--surface-elevated)',
                color: (inputMessage.trim() || attachedImage) ? '#09090b' : 'var(--text-muted)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all var(--transition-fast)',
                cursor: (inputMessage.trim() || attachedImage) ? 'pointer' : 'default',
              }}
              aria-label="Send message"
            >
              <ArrowUp size={16} strokeWidth={2.5} />
            </button>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '8px', padding: '0 4px' }}>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
              STELLAR AI Tutor • Grounded in your enrolled subjects & syllabus documents
            </span>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={() => handleSend('Explain 3NF vs BCNF in simple terms')}
                style={{ fontSize: '11px', color: 'var(--accent-light)', background: 'none' }}
              >
                Quick prompt: 3NF vs BCNF
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
