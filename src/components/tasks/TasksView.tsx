import React, { useState } from 'react';
import {
  CheckSquare,
  Plus,
  Clock,
  Calendar,
  AlertCircle,
  CheckCircle2,
  Filter,
  Trash2
} from 'lucide-react';
import { Task, Priority } from '../../types';
import { Modal } from '../common/Modal';

interface TasksViewProps {
  tasks: Task[];
  onToggleTask: (taskId: string) => void;
  onAddTask: (task: Omit<Task, 'id' | 'completed' | 'section'>) => void;
  onDeleteTask?: (taskId: string) => void;
}

export const TasksView: React.FC<TasksViewProps> = ({
  tasks,
  onToggleTask,
  onAddTask,
  onDeleteTask,
}) => {
  const [activeTab, setActiveTab] = useState<'today' | 'upcoming' | 'overdue' | 'completed'>('today');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New task form state
  const [newTitle, setNewTitle] = useState('');
  const [newSubject, setNewSubject] = useState('DBMS');
  const [newPriority, setNewPriority] = useState<Priority>('medium');
  const [newDeadline, setNewDeadline] = useState('Due tomorrow');
  const [newDuration, setNewDuration] = useState('30 min');

  const filteredTasks = tasks.filter((t) => {
    if (activeTab === 'today') return t.section === 'today' && !t.completed;
    if (activeTab === 'upcoming') return t.section === 'upcoming' && !t.completed;
    if (activeTab === 'overdue') return t.section === 'overdue' && !t.completed;
    if (activeTab === 'completed') return t.completed;
    return true;
  });

  const completedCount = tasks.filter((t) => t.completed).length;
  const todayTasksCount = tasks.filter((t) => t.section === 'today').length;
  const progressPct = Math.round((completedCount / (tasks.length || 1)) * 100);

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    onAddTask({
      title: newTitle.trim(),
      subject: newSubject,
      priority: newPriority,
      deadline: newDeadline,
      estimatedDuration: newDuration,
    });

    setNewTitle('');
    setIsAddModalOpen(false);
  };

  const getPriorityBadge = (priority: Priority) => {
    switch (priority) {
      case 'urgent':
        return <span className="badge badge-danger">Urgent</span>;
      case 'high':
        return <span className="badge badge-warning">High</span>;
      case 'medium':
        return <span className="badge badge-info">Medium</span>;
      case 'low':
        return <span className="badge badge-neutral">Low</span>;
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px', maxWidth: '1000px', margin: '0 auto' }}>
      {/* Header & Quick Action */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Workflow & Focus</span>
            <span style={{ color: 'var(--border-strong)' }}>•</span>
            <span style={{ fontSize: '12px', color: 'var(--accent-primary)', fontWeight: 500 }}>
              {completedCount} of {tasks.length} total completed ({progressPct}%)
            </span>
          </div>
          <h2 style={{ fontSize: '28px', fontWeight: 600, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
            Tasks & Commitments
          </h2>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="btn btn-accent-solid"
          style={{ padding: '9px 16px' }}
        >
          <Plus size={16} />
          <span>New Task</span>
        </button>
      </div>

      {/* Progress Bar Container */}
      <div
        style={{
          padding: '16px 20px',
          backgroundColor: 'var(--surface-primary)',
          border: '1px solid var(--border-default)',
          borderRadius: 'var(--radius-lg)',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
          <span style={{ color: 'var(--text-secondary)' }}>Daily Completion Progress</span>
          <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{progressPct}% Completed</span>
        </div>
        <div
          style={{
            height: '6px',
            backgroundColor: 'var(--surface-secondary)',
            borderRadius: '3px',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              height: '100%',
              width: `${progressPct}%`,
              backgroundColor: 'var(--accent-primary)',
              transition: 'width var(--transition-normal)',
            }}
          />
        </div>
      </div>

      {/* Filter Tabs (Today, Upcoming, Overdue, Completed) */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          borderBottom: '1px solid var(--border-default)',
          paddingBottom: '12px',
        }}
      >
        {(['today', 'upcoming', 'overdue', 'completed'] as const).map((tab) => {
          const isSelected = activeTab === tab;
          const count = tasks.filter((t) => {
            if (tab === 'today') return t.section === 'today' && !t.completed;
            if (tab === 'upcoming') return t.section === 'upcoming' && !t.completed;
            if (tab === 'overdue') return t.section === 'overdue' && !t.completed;
            return t.completed;
          }).length;

          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '6px 14px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: isSelected ? 'var(--surface-elevated)' : 'transparent',
                border: '1px solid',
                borderColor: isSelected ? 'var(--border-strong)' : 'transparent',
                color: isSelected ? 'var(--text-primary)' : 'var(--text-secondary)',
                fontSize: '13px',
                fontWeight: isSelected ? 600 : 400,
                textTransform: 'capitalize',
              }}
            >
              <span>{tab}</span>
              <span
                style={{
                  fontSize: '11px',
                  padding: '1px 6px',
                  borderRadius: '10px',
                  backgroundColor: isSelected ? 'var(--accent-subtle)' : 'var(--surface-secondary)',
                  color: isSelected ? 'var(--accent-primary)' : 'var(--text-muted)',
                }}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Task List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {filteredTasks.length === 0 ? (
          <div
            style={{
              padding: '48px 20px',
              textAlign: 'center',
              backgroundColor: 'var(--surface-primary)',
              borderRadius: 'var(--radius-lg)',
              border: '1px dashed var(--border-default)',
            }}
          >
            <CheckCircle2 size={32} style={{ color: 'var(--text-muted)', margin: '0 auto 12px auto' }} />
            <div style={{ fontSize: '15px', fontWeight: 500, color: 'var(--text-primary)' }}>
              No tasks in this section
            </div>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '4px' }}>
              You're completely clear. Use the button above or Command Center to add tasks.
            </p>
          </div>
        ) : (
          filteredTasks.map((task) => (
            <div
              key={task.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '14px 18px',
                borderRadius: 'var(--radius-lg)',
                backgroundColor: 'var(--surface-primary)',
                border: '1px solid var(--border-default)',
                transition: 'all var(--transition-fast)',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'var(--border-strong)')}
              onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'var(--border-default)')}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flex: 1, minWidth: 0 }}>
                {/* Interactive Animated Checkbox */}
                <button
                  onClick={() => onToggleTask(task.id)}
                  aria-label={task.completed ? 'Mark task as incomplete' : 'Mark task as complete'}
                  style={{
                    width: '20px',
                    height: '20px',
                    borderRadius: '5px',
                    border: '1.5px solid',
                    borderColor: task.completed ? 'var(--accent-primary)' : 'var(--border-strong)',
                    backgroundColor: task.completed ? 'var(--accent-primary)' : 'transparent',
                    color: '#09090b',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    transition: 'all var(--transition-fast)',
                  }}
                >
                  {task.completed && <CheckCircle2 size={15} strokeWidth={2.5} />}
                </button>

                {/* Title & Metadata */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      fontSize: '14px',
                      fontWeight: 500,
                      color: task.completed ? 'var(--text-muted)' : 'var(--text-primary)',
                      textDecoration: task.completed ? 'line-through' : 'none',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {task.title}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '3px' }}>
                    <span
                      style={{
                        fontSize: '11px',
                        padding: '1px 6px',
                        borderRadius: '3px',
                        backgroundColor: 'var(--surface-secondary)',
                        color: 'var(--text-secondary)',
                        border: '1px solid var(--border-subtle)',
                      }}
                    >
                      {task.subject}
                    </span>
                    <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                      {task.deadline}
                    </span>
                    <span style={{ color: 'var(--border-default)' }}>•</span>
                    <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                      {task.estimatedDuration}
                    </span>
                  </div>
                </div>
              </div>

              {/* Priority Badge & Actions */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                {getPriorityBadge(task.priority)}
                {onDeleteTask && (
                  <button
                    onClick={() => onDeleteTask(task.id)}
                    style={{ color: 'var(--text-muted)', padding: '4px' }}
                    title="Delete task"
                  >
                    <Trash2 size={14} />
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add Task Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Create New Academic Task"
        subtitle="Add a syllabus assignment, revision block, or deadline"
      >
        <form onSubmit={handleCreateTask} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: 'var(--text-secondary)', marginBottom: '6px' }}>
              Task Title
            </label>
            <input
              type="text"
              required
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="e.g. Complete DBMS Normalization Assignment"
              style={{ width: '100%' }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                Subject
              </label>
              <select
                value={newSubject}
                onChange={(e) => setNewSubject(e.target.value)}
                style={{ width: '100%' }}
              >
                <option value="DBMS">DBMS</option>
                <option value="AI/ML">AI/ML</option>
                <option value="OS">OS</option>
                <option value="Mathematics">Mathematics</option>
                <option value="Personal">Personal</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                Priority
              </label>
              <select
                value={newPriority}
                onChange={(e) => setNewPriority(e.target.value as Priority)}
                style={{ width: '100%' }}
              >
                <option value="urgent">Urgent</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                Deadline
              </label>
              <input
                type="text"
                value={newDeadline}
                onChange={(e) => setNewDeadline(e.target.value)}
                placeholder="e.g. Due tomorrow at 11:59 PM"
                style={{ width: '100%' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                Estimated Duration
              </label>
              <input
                type="text"
                value={newDuration}
                onChange={(e) => setNewDuration(e.target.value)}
                placeholder="e.g. 45 min"
                style={{ width: '100%' }}
              />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
            <button
              type="button"
              onClick={() => setIsAddModalOpen(false)}
              className="btn btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-accent-solid"
            >
              Save Task
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
