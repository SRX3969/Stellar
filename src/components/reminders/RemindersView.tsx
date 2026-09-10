import React, { useState } from 'react';
import {
  Bell,
  Clock,
  Plus,
  Calendar,
  Repeat,
  CheckCircle2,
  Trash2,
  Dumbbell,
  BookOpen,
  Phone,
  Sparkles
} from 'lucide-react';
import { Modal } from '../common/Modal';
import { useToast } from '../common/Toast';

export interface SmartReminder {
  id: string;
  title: string;
  time: string;
  frequency: 'one-time' | 'recurring';
  category: 'academic' | 'personal';
  tag: 'Gym' | 'Assignment' | 'Revision' | 'Call' | 'Event';
  active: boolean;
}

const INITIAL_REMINDERS: SmartReminder[] = [
  { id: 'rem-1', title: 'Submit Mathematics Problem Set 4', time: 'Tomorrow at 11:00 PM', frequency: 'one-time', category: 'academic', tag: 'Assignment', active: true },
  { id: 'rem-2', title: 'DBMS 3NF & BCNF Targeted Flashcard Revision', time: 'Daily at 06:30 PM', frequency: 'recurring', category: 'academic', tag: 'Revision', active: true },
  { id: 'rem-3', title: 'Evening Campus Gym Workout', time: 'Mon, Wed, Fri at 05:30 PM', frequency: 'recurring', category: 'personal', tag: 'Gym', active: true },
  { id: 'rem-4', title: 'Call Academic Advisor regarding course credit transfer', time: 'Sep 12 at 04:00 PM', frequency: 'one-time', category: 'personal', tag: 'Call', active: true },
  { id: 'rem-5', title: 'Tech Symposium Registration Deadline', time: 'Sep 15 at 02:00 PM', frequency: 'one-time', category: 'academic', tag: 'Event', active: true },
];

export const RemindersView: React.FC = () => {
  const [reminders, setReminders] = useState<SmartReminder[]>(INITIAL_REMINDERS);
  const [filterCategory, setFilterCategory] = useState<'all' | 'academic' | 'personal'>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // New reminder form
  const [title, setTitle] = useState('');
  const [time, setTime] = useState('');
  const [frequency, setFrequency] = useState<'one-time' | 'recurring'>('one-time');
  const [category, setCategory] = useState<'academic' | 'personal'>('academic');
  const [tag, setTag] = useState<SmartReminder['tag']>('Revision');

  const { showToast } = useToast();

  const filtered = reminders.filter((r) => {
    if (filterCategory === 'all') return true;
    return r.category === filterCategory;
  });

  const handleToggleActive = (id: string) => {
    setReminders((prev) =>
      prev.map((r) => (r.id === id ? { ...r, active: !r.active } : r))
    );
    showToast('Reminder updated', 'Schedule synchronized with calendar.', 'info');
  };

  const handleDelete = (id: string) => {
    setReminders((prev) => prev.filter((r) => r.id !== id));
    showToast('Reminder deleted', undefined, 'warning');
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newReminder: SmartReminder = {
      id: `rem-${Date.now()}`,
      title: title.trim(),
      time: time.trim() || 'Today at 08:00 PM',
      frequency,
      category,
      tag,
      active: true,
    };

    setReminders((prev) => [newReminder, ...prev]);
    setTitle('');
    setTime('');
    setIsModalOpen(false);
    showToast('Reminder scheduled', 'STELLAR will notify you at the specified interval.', 'success');
  };

  const getTagIcon = (tag: SmartReminder['tag']) => {
    switch (tag) {
      case 'Gym':
        return <Dumbbell size={14} style={{ color: 'var(--color-success)' }} />;
      case 'Assignment':
        return <BookOpen size={14} style={{ color: 'var(--color-warning)' }} />;
      case 'Revision':
        return <Sparkles size={14} style={{ color: 'var(--accent-primary)' }} />;
      case 'Call':
        return <Phone size={14} style={{ color: 'var(--color-info)' }} />;
      case 'Event':
        return <Calendar size={14} style={{ color: 'var(--accent-light)' }} />;
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px', maxWidth: '960px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Proactive Signal Engine</span>
            <span style={{ color: 'var(--border-strong)' }}>•</span>
            <span style={{ fontSize: '12px', color: 'var(--accent-primary)', fontWeight: 500 }}>Calm &amp; Timely</span>
          </div>
          <h2 style={{ fontSize: '28px', fontWeight: 600, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
            Smart Reminders
          </h2>
          <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginTop: '4px' }}>
            One-time and recurring cues for revision checkpoints, workouts, and deadlines.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="btn btn-accent-solid"
        >
          <Plus size={16} />
          <span>New Reminder</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid var(--border-default)', paddingBottom: '12px' }}>
        {(['all', 'academic', 'personal'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setFilterCategory(tab)}
            style={{
              padding: '6px 14px',
              borderRadius: 'var(--radius-md)',
              fontSize: '13px',
              fontWeight: filterCategory === tab ? 600 : 400,
              backgroundColor: filterCategory === tab ? 'var(--surface-elevated)' : 'transparent',
              color: filterCategory === tab ? 'var(--text-primary)' : 'var(--text-secondary)',
              border: '1px solid',
              borderColor: filterCategory === tab ? 'var(--border-strong)' : 'transparent',
              textTransform: 'capitalize',
            }}
          >
            {tab === 'all' ? 'All Reminders' : tab === 'academic' ? 'Academic Signals' : 'Personal Reminders'}
          </button>
        ))}
      </div>

      {/* Reminders List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {filtered.map((reminder) => (
          <div
            key={reminder.id}
            className="card-base"
            style={{
              padding: '16px 20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              opacity: reminder.active ? 1 : 0.5,
              transition: 'opacity var(--transition-fast)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '8px',
                  backgroundColor: 'var(--surface-secondary)',
                  border: '1px solid var(--border-subtle)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {getTagIcon(reminder.tag)}
              </div>

              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>
                    {reminder.title}
                  </span>
                  <span className="badge badge-neutral" style={{ fontSize: '10px' }}>
                    {reminder.tag}
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '12px', color: 'var(--text-muted)', marginTop: '3px' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Clock size={12} /> {reminder.time}
                  </span>
                  <span>•</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    {reminder.frequency === 'recurring' ? <Repeat size={12} /> : <Calendar size={12} />}
                    <span style={{ textTransform: 'capitalize' }}>{reminder.frequency}</span>
                  </span>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <button
                onClick={() => handleToggleActive(reminder.id)}
                className={`btn ${reminder.active ? 'btn-secondary' : 'btn-ghost'}`}
                style={{ fontSize: '12px', padding: '5px 10px' }}
              >
                {reminder.active ? 'Active' : 'Paused'}
              </button>

              <button
                onClick={() => handleDelete(reminder.id)}
                style={{ color: 'var(--text-muted)', padding: '4px' }}
                title="Delete reminder"
              >
                <Trash2 size={15} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Create Reminder Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Create Smart Reminder"
        subtitle="Set a one-time or recurring cue for revision, assignment, gym or call"
      >
        <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: 'var(--text-secondary)', marginBottom: '6px' }}>
              Reminder Title
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Review OS Semaphore Simulation"
              style={{ width: '100%' }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                Tag / Type
              </label>
              <select
                value={tag}
                onChange={(e) => setTag(e.target.value as SmartReminder['tag'])}
                style={{ width: '100%' }}
              >
                <option value="Revision">Revision</option>
                <option value="Assignment">Assignment</option>
                <option value="Gym">Gym</option>
                <option value="Call">Call</option>
                <option value="Event">Event</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                Frequency
              </label>
              <select
                value={frequency}
                onChange={(e) => setFrequency(e.target.value as 'one-time' | 'recurring')}
                style={{ width: '100%' }}
              >
                <option value="one-time">One-time</option>
                <option value="recurring">Recurring</option>
              </select>
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: 'var(--text-secondary)', marginBottom: '6px' }}>
              Schedule Time
            </label>
            <input
              type="text"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              placeholder="e.g. Tomorrow at 08:30 PM or Daily at 07:00 AM"
              style={{ width: '100%' }}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="btn btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-accent-solid"
            >
              Save Reminder
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
