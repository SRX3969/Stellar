// Admin — Student Management

import React, { useState } from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { UserPlus, Search, Power, X } from 'lucide-react';
import { useToast } from '../common/Toast';

import { INSTITUTIONAL_STUDENTS } from '../../data/institutionalData';

export const StudentManagement: React.FC = () => {
  const queryStudents = (useQuery(api.users.getUsersByRole, { role: 'student' }) || []);
  const createUser = useMutation(api.users.createUser);
  const toggleActive = useMutation(api.users.toggleUserActive);
  const { showToast } = useToast();

  const fallbackStudents = INSTITUTIONAL_STUDENTS.map(s => ({
    _id: s.id,
    fullName: s.fullName,
    email: s.email,
    studentId: s.studentId,
    batch: s.batch,
    semester: s.semester,
    course: s.course,
    department: s.department,
    isActive: true,
  }));

  const students = queryStudents.length > 0 ? queryStudents : fallbackStudents;

  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState('');
  const [form, setForm] = useState({ fullName: '', email: '', password: '', department: '', studentId: '', semester: 'III Sem', course: 'B.Tech AI & Data Science', batch: 'B1', phone: '' });

  const filtered = students.filter(s =>
    s.fullName.toLowerCase().includes(search.toLowerCase()) ||
    s.email.toLowerCase().includes(search.toLowerCase()) ||
    (s.studentId || '').toLowerCase().includes(search.toLowerCase())
  );

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await createUser({ ...form, role: 'student' });
    if (result.success) {
      showToast('Student Created', `${form.fullName} added successfully.`, 'success');
      setShowForm(false);
      setForm({ fullName: '', email: '', password: '', department: '', studentId: '', semester: 'III Sem', course: 'B.Tech AI & Data Science', batch: 'B1', phone: '' });
    } else {
      showToast('Error', result.error || 'Failed to create student.', 'error');
    }
  };

  const handleToggle = async (userId: any, currentActive: boolean) => {
    await toggleActive({ userId, isActive: !currentActive });
    showToast(currentActive ? 'Deactivated' : 'Activated', `Student account ${currentActive ? 'deactivated' : 'activated'}.`, 'info');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '1100px', margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h2 style={{ fontSize: '24px', fontWeight: 600, marginBottom: '4px' }}>Student Management</h2>
          <p style={{ fontSize: '14px', color: 'var(--text-muted)' }}>{students.length} students registered</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="btn btn-accent-solid" style={{ gap: '6px' }}>
          <UserPlus size={15} /> Add Student
        </button>
      </div>

      {showForm && (
        <div className="card-base" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 600 }}>New Student</h3>
            <button onClick={() => setShowForm(false)} style={{ color: 'var(--text-muted)' }}><X size={18} /></button>
          </div>
          <form onSubmit={handleCreate} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '14px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '4px' }}>Full Name *</label>
              <input required value={form.fullName} onChange={e => setForm(p => ({ ...p, fullName: e.target.value }))} placeholder="Student name" style={{ width: '100%' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '4px' }}>Email *</label>
              <input required type="email" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} placeholder="student@gmail.com" style={{ width: '100%' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '4px' }}>Password *</label>
              <input required type="password" value={form.password} onChange={e => setForm(p => ({ ...p, password: e.target.value }))} placeholder="Min 8 characters" style={{ width: '100%' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '4px' }}>Student ID</label>
              <input value={form.studentId} onChange={e => setForm(p => ({ ...p, studentId: e.target.value }))} placeholder="AI24-BTECH-XXX" style={{ width: '100%' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '4px' }}>Batch</label>
              <select value={form.batch} onChange={e => setForm(p => ({ ...p, batch: e.target.value }))} style={{ width: '100%' }}>
                <option value="B1">B1</option>
                <option value="B2">B2</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '4px' }}>Semester</label>
              <input value={form.semester} onChange={e => setForm(p => ({ ...p, semester: e.target.value }))} style={{ width: '100%' }} />
            </div>
            <div style={{ gridColumn: '1 / -1' }}>
              <button type="submit" className="btn btn-accent-solid" style={{ marginTop: '8px' }}>Create Student Account</button>
            </div>
          </form>
        </div>
      )}

      <div style={{ position: 'relative' }}>
        <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name, email, or student ID..." style={{ width: '100%', paddingLeft: '36px' }} />
      </div>

      <div className="card-base" style={{ padding: '0', overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-default)', backgroundColor: 'var(--surface-secondary)' }}>
                <th style={{ textAlign: 'left', padding: '10px 16px', color: 'var(--text-muted)', fontWeight: 500 }}>Name</th>
                <th style={{ textAlign: 'left', padding: '10px 16px', color: 'var(--text-muted)', fontWeight: 500 }}>Student ID</th>
                <th style={{ textAlign: 'left', padding: '10px 16px', color: 'var(--text-muted)', fontWeight: 500 }}>Email</th>
                <th style={{ textAlign: 'left', padding: '10px 16px', color: 'var(--text-muted)', fontWeight: 500 }}>Batch</th>
                <th style={{ textAlign: 'left', padding: '10px 16px', color: 'var(--text-muted)', fontWeight: 500 }}>Semester</th>
                <th style={{ textAlign: 'left', padding: '10px 16px', color: 'var(--text-muted)', fontWeight: 500 }}>Status</th>
                <th style={{ textAlign: 'right', padding: '10px 16px', color: 'var(--text-muted)', fontWeight: 500 }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={7} style={{ padding: '32px', textAlign: 'center', color: 'var(--text-muted)' }}>No students found.</td></tr>
              ) : filtered.map(s => (
                <tr key={s._id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                  <td style={{ padding: '12px 16px', fontWeight: 500 }}>{s.fullName}</td>
                  <td style={{ padding: '12px 16px', color: 'var(--accent-primary)', fontWeight: 600, fontSize: '12px' }}>{s.studentId || '—'}</td>
                  <td style={{ padding: '12px 16px', color: 'var(--text-secondary)' }}>{s.email}</td>
                  <td style={{ padding: '12px 16px', color: 'var(--text-secondary)' }}>{s.batch || '—'}</td>
                  <td style={{ padding: '12px 16px', color: 'var(--text-secondary)' }}>{s.semester || '—'}</td>
                  <td style={{ padding: '12px 16px' }}>
                    <span className={`badge ${s.isActive ? 'badge-success' : 'badge-danger'}`}>{s.isActive ? 'Active' : 'Inactive'}</span>
                  </td>
                  <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                    <button onClick={() => handleToggle(s._id, s.isActive)} className="btn btn-ghost" style={{ padding: '4px 8px', fontSize: '12px' }}>
                      <Power size={13} /> {s.isActive ? 'Deactivate' : 'Activate'}
                    </button>
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
