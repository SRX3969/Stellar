// Admin — Subject Management

import React, { useState } from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { BookOpen, Plus, X } from 'lucide-react';
import { useToast } from '../common/Toast';

export const SubjectManagement: React.FC = () => {
  const subjects = useQuery(api.academics.getSubjects) || [];
  const createSubject = useMutation(api.academics.createSubject);
  const { showToast } = useToast();

  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ code: '', name: '', credits: '4', category: 'theory' as const, semester: 'III Sem' });

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    await createSubject({
      code: form.code,
      name: form.name,
      credits: parseFloat(form.credits),
      category: form.category as any,
      semester: form.semester,
    });
    showToast('Subject Created', `${form.name} added.`, 'success');
    setShowForm(false);
    setForm({ code: '', name: '', credits: '4', category: 'theory', semester: 'III Sem' });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '1100px', margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h2 style={{ fontSize: '24px', fontWeight: 600, marginBottom: '4px' }}>Subjects</h2>
          <p style={{ fontSize: '14px', color: 'var(--text-muted)' }}>{subjects.length} subjects</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="btn btn-accent-solid" style={{ gap: '6px' }}>
          <Plus size={15} /> Add Subject
        </button>
      </div>

      {showForm && (
        <div className="card-base" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 600 }}>New Subject</h3>
            <button onClick={() => setShowForm(false)} style={{ color: 'var(--text-muted)' }}><X size={18} /></button>
          </div>
          <form onSubmit={handleCreate} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '4px' }}>Subject Code *</label>
              <input required value={form.code} onChange={e => setForm(p => ({ ...p, code: e.target.value }))} placeholder="CSE335" style={{ width: '100%' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '4px' }}>Name *</label>
              <input required value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} placeholder="Database Management Systems" style={{ width: '100%' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '4px' }}>Credits *</label>
              <input required type="number" step="0.5" value={form.credits} onChange={e => setForm(p => ({ ...p, credits: e.target.value }))} style={{ width: '100%' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '4px' }}>Category</label>
              <select value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value as any }))} style={{ width: '100%' }}>
                <option value="theory">Theory</option>
                <option value="lab">Lab</option>
                <option value="honours">Honours</option>
                <option value="aec">AEC</option>
                <option value="holistic">Holistic</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div style={{ gridColumn: '1 / -1' }}>
              <button type="submit" className="btn btn-accent-solid">Create Subject</button>
            </div>
          </form>
        </div>
      )}

      <div className="card-base" style={{ padding: '0', overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-default)', backgroundColor: 'var(--surface-secondary)' }}>
                <th style={{ textAlign: 'left', padding: '10px 16px', color: 'var(--text-muted)', fontWeight: 500 }}>Code</th>
                <th style={{ textAlign: 'left', padding: '10px 16px', color: 'var(--text-muted)', fontWeight: 500 }}>Name</th>
                <th style={{ textAlign: 'left', padding: '10px 16px', color: 'var(--text-muted)', fontWeight: 500 }}>Credits</th>
                <th style={{ textAlign: 'left', padding: '10px 16px', color: 'var(--text-muted)', fontWeight: 500 }}>Category</th>
                <th style={{ textAlign: 'left', padding: '10px 16px', color: 'var(--text-muted)', fontWeight: 500 }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {subjects.length === 0 ? (
                <tr><td colSpan={5} style={{ padding: '32px', textAlign: 'center', color: 'var(--text-muted)' }}>No subjects yet.</td></tr>
              ) : subjects.map(s => (
                <tr key={s._id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                  <td style={{ padding: '12px 16px', fontWeight: 600, color: 'var(--accent-primary)' }}>{s.code}</td>
                  <td style={{ padding: '12px 16px', fontWeight: 500 }}>{s.name}</td>
                  <td style={{ padding: '12px 16px', color: 'var(--text-secondary)' }}>{s.credits}</td>
                  <td style={{ padding: '12px 16px' }}><span className="badge badge-neutral" style={{ textTransform: 'capitalize' }}>{s.category}</span></td>
                  <td style={{ padding: '12px 16px' }}>
                    <span className={`badge ${s.isActive ? 'badge-success' : 'badge-danger'}`}>{s.isActive ? 'Active' : 'Inactive'}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
