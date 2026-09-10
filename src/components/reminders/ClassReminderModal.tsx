import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import {
  Bell,
  Calendar,
  Clock,
  BookOpen,
  AlertCircle,
  FileCheck,
  CheckCircle2,
  GraduationCap,
  FlaskConical,
  MessageSquare
} from 'lucide-react';
import { ClassReminder, ClassReminderType, PriorOffsetType, Priority } from '../../types';
import { COURSE_CATALOG } from '../../data/timetableData';
import { useToast } from '../common/Toast';

interface ClassReminderModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultCourseCode?: string;
  onSaveReminder: (reminder: Omit<ClassReminder, 'id' | 'createdAt'>) => void;
}

export const ClassReminderModal: React.FC<ClassReminderModalProps> = ({
  isOpen,
  onClose,
  defaultCourseCode,
  onSaveReminder,
}) => {
  const [selectedCourseCode, setSelectedCourseCode] = useState<string>(
    defaultCourseCode || COURSE_CATALOG[0]?.code || 'AIML334'
  );
  const [reminderType, setReminderType] = useState<ClassReminderType>('submission');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [dueTime, setDueTime] = useState('09:00');
  const [priorOffset, setPriorOffset] = useState<PriorOffsetType>('1day');
  const [priority, setPriority] = useState<Priority>('high');
  const { showToast } = useToast();

  useEffect(() => {
    if (defaultCourseCode) {
      setSelectedCourseCode(defaultCourseCode);
    }
    // Set default due date to tomorrow
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dateStr = tomorrow.toISOString().split('T')[0];
    setDueDate(dateStr);
  }, [defaultCourseCode, isOpen]);

  const selectedCourse = COURSE_CATALOG.find((c) => c.code === selectedCourseCode) || {
    code: selectedCourseCode,
    name: selectedCourseCode,
  };

  const reminderTypes: { type: ClassReminderType; label: string; icon: React.ElementType; color: string }[] = [
    { type: 'submission', label: 'Submission / Assignment', icon: FileCheck, color: 'var(--color-warning)' },
    { type: 'exam', label: 'CIA / Exam / Test', icon: GraduationCap, color: 'var(--color-danger)' },
    { type: 'quiz', label: 'Quiz / MCQ', icon: AlertCircle, color: 'var(--accent-primary)' },
    { type: 'lab_report', label: 'Lab Record / Practical', icon: FlaskConical, color: 'var(--color-info)' },
    { type: 'viva', label: 'Viva Voce', icon: MessageSquare, color: 'var(--color-purple)' },
    { type: 'reading', label: 'Pre-Class Reading', icon: BookOpen, color: 'var(--text-secondary)' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      showToast('Validation error', 'Please enter a reminder title.', 'warning');
      return;
    }
    if (!dueDate) {
      showToast('Validation error', 'Please select a due date.', 'warning');
      return;
    }

    onSaveReminder({
      courseCode: selectedCourse.code,
      courseName: selectedCourse.name,
      type: reminderType,
      title: title.trim(),
      description: description.trim(),
      dueDate,
      dueTime,
      priorOffset,
      completed: false,
      priority,
    });

    showToast(
      'Reminder Scheduled',
      `Alert set for ${selectedCourse.code}: "${title}" with ${priorOffset} advance notice.`,
      'success'
    );

    // Reset & close
    setTitle('');
    setDescription('');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="540px">
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              backgroundColor: 'var(--surface-elevated)',
              border: '1px solid var(--border-strong)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--accent-primary)',
            }}
          >
            <Bell size={20} />
          </div>
          <div>
            <h3 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--text-primary)' }}>
              Add Class Reminder &amp; Alert
            </h3>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
              Set advance notifications for submissions, exams, quizzes, and viva.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Target Course */}
          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
              Target Subject / Course
            </label>
            <select
              value={selectedCourseCode}
              onChange={(e) => setSelectedCourseCode(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: 'var(--surface-primary)',
                border: '1px solid var(--border-strong)',
                color: 'var(--text-primary)',
                fontSize: '13px',
              }}
            >
              {COURSE_CATALOG.map((course) => (
                <option key={course.code} value={course.code}>
                  {course.code} — {course.name} ({course.faculty})
                </option>
              ))}
            </select>
          </div>

          {/* Reminder Category Pills */}
          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
              Reminder Type
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '8px' }}>
              {reminderTypes.map((t) => {
                const Icon = t.icon;
                const isSelected = reminderType === t.type;
                return (
                  <button
                    key={t.type}
                    type="button"
                    onClick={() => setReminderType(t.type)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '8px 10px',
                      borderRadius: 'var(--radius-sm)',
                      backgroundColor: isSelected ? 'var(--surface-elevated)' : 'var(--surface-primary)',
                      border: `1px solid ${isSelected ? 'var(--accent-primary)' : 'var(--border-default)'}`,
                      color: isSelected ? 'var(--text-primary)' : 'var(--text-secondary)',
                      fontSize: '12px',
                      fontWeight: isSelected ? 600 : 400,
                      cursor: 'pointer',
                      textAlign: 'left',
                    }}
                  >
                    <Icon size={14} style={{ color: t.color, flexShrink: 0 }} />
                    <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {t.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Title */}
          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
              Reminder Title / Topic *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Unit 2 Assignment Hard Copy / Mid-Sem Theory CIA"
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: 'var(--surface-primary)',
                border: '1px solid var(--border-default)',
                color: 'var(--text-primary)',
                fontSize: '13px',
              }}
            />
          </div>

          {/* Due Date & Time */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                Due Date *
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type="date"
                  required
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 10px',
                    borderRadius: 'var(--radius-sm)',
                    backgroundColor: 'var(--surface-primary)',
                    border: '1px solid var(--border-default)',
                    color: 'var(--text-primary)',
                    fontSize: '13px',
                  }}
                />
              </div>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                Class / Target Time
              </label>
              <input
                type="time"
                value={dueTime}
                onChange={(e) => setDueTime(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 10px',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: 'var(--surface-primary)',
                  border: '1px solid var(--border-default)',
                  color: 'var(--text-primary)',
                  fontSize: '13px',
                }}
              />
            </div>
          </div>

          {/* Prior Advance Notice Offset */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                Alert Timing (Prior)
              </label>
              <select
                value={priorOffset}
                onChange={(e) => setPriorOffset(e.target.value as PriorOffsetType)}
                style={{
                  width: '100%',
                  padding: '9px 10px',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: 'var(--surface-primary)',
                  border: '1px solid var(--border-default)',
                  color: 'var(--text-primary)',
                  fontSize: '13px',
                }}
              >
                <option value="15min">15 minutes before class</option>
                <option value="1hour">1 hour before</option>
                <option value="1day">1 day prior (Recommended)</option>
                <option value="2days">2 days prior (For Exams)</option>
                <option value="1week">1 week prior</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                Priority Level
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as Priority)}
                style={{
                  width: '100%',
                  padding: '9px 10px',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: 'var(--surface-primary)',
                  border: '1px solid var(--border-default)',
                  color: 'var(--text-primary)',
                  fontSize: '13px',
                }}
              >
                <option value="urgent">🔴 Urgent (Mandatory)</option>
                <option value="high">🟠 High (Graded)</option>
                <option value="medium">🔵 Medium (Standard)</option>
                <option value="low">⚪ Low (Optional Review)</option>
              </select>
            </div>
          </div>

          {/* Optional Notes */}
          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
              Notes / Instructions (Optional)
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. Bring scientific calculator and signed observation notebook."
              style={{
                width: '100%',
                padding: '8px 10px',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: 'var(--surface-primary)',
                border: '1px solid var(--border-default)',
                color: 'var(--text-primary)',
                fontSize: '13px',
                resize: 'none',
              }}
            />
          </div>

          {/* Submit Button */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '8px' }}>
            <button
              type="button"
              onClick={onClose}
              className="btn btn-ghost"
              style={{ padding: '8px 16px', fontSize: '13px' }}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-accent-solid"
              style={{ padding: '8px 20px', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <CheckCircle2 size={15} />
              <span>Save Class Reminder</span>
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
};
