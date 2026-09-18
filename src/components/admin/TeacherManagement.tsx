// Admin — Teacher Management

import React, { useState } from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { UserPlus, Search, Edit3, Power, X } from 'lucide-react';
import { useToast } from '../common/Toast';

export const TeacherManagement: React.FC = () => {
  const queryTeachers = (useQuery(api.users.getUsersByRole, { role: 'teacher' }) || []);
  const createUser = useMutation(api.users.createUser);
  const toggleActive = useMutation(api.users.toggleUserActive);
  const { showToast } = useToast();

  const fallbackTeachers = [
    {
      _id: 't-1',
      fullName: 'Prof. Swati Raj',
      email: 'swati.raj@stellar.edu',
      department: 'Department of AI and Data Science Engineering',
      designation: 'Assistant Professor',
      specialization: 'Database Management Systems',
      phone: '+91 98451 22310',
      employeeId: 'FAC-2026-001',
      isActive: true,
    },
    {
      _id: 't-2',
      fullName: 'Dr. Ammani Kuttan B',
      email: 'ammani.kuttan@stellar.edu',
      department: 'Department of AI and Data Science Engineering',
      designation: 'Professor',
      specialization: 'Mathematical Foundations for AI',
      phone: '+91 98451 22311',
      employeeId: 'FAC-2026-002',
      isActive: true,
    },
    {
      _id: 't-3',
      fullName: 'Dr. Florance G',
      email: 'florance.g@stellar.edu',
      department: 'Department of Computer Science and Engineering',
      designation: 'Associate Professor',
      specialization: 'Data Structures & Algorithms',
      phone: '+91 98451 22312',
      employeeId: 'FAC-2026-003',
      isActive: true,
    },
    {
      _id: 't-4',
      fullName: 'Dr. Santhrupth B C',
      email: 'santhrupth.bc@stellar.edu',
      department: 'Department of AI and Data Science Engineering',
      designation: 'Assistant Professor',
      specialization: 'Design Thinking & UX',
      phone: '+91 98451 22313',
      employeeId: 'FAC-2026-004',
      isActive: true,
    },
  ];

  const teachers = queryTeachers.length > 0 ? queryTeachers : fallbackTeachers;

  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState('');
  const [form, setForm] = useState({ fullName: '', email: '', password: '', department: '', designation: '', specialization: '', phone: '', employeeId: '' });

  const filtered = teachers.filter(t =>
    t.fullName.toLowerCase().includes(search.toLowerCase()) ||
    t.email.toLowerCase().includes(search.toLowerCase()) ||
    (t.department || '').toLowerCase().includes(search.toLowerCase())
  );

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await createUser({ ...form, role: 'teacher' });
    if (result.success) {
      showToast('Teacher Created', `${form.fullName} added successfully.`, 'success');
      setShowForm(false);
      setForm({ fullName: '', email: '', password: '', department: '', designation: '', specialization: '', phone: '', employeeId: '' });
    } else {
      showToast('Error', result.error || 'Failed to create teacher.', 'error');
    }
  };

  const handleToggle = async (userId: any, currentActive: boolean) => {
    await toggleActive({ userId, isActive: !currentActive });
    showToast(currentActive ? 'Deactivated' : 'Activated', `Teacher account ${currentActive ? 'deactivated' : 'activated'}.`, 'info');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '1100px', margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h2 style={{ fontSize: '24px', fontWeight: 600, marginBottom: '4px' }}>Teacher Management</h2>
          <p style={{ fontSize: '14px', color: 'var(--text-muted)' }}>{teachers.length} teachers registered</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="btn btn-accent-solid" style={{ gap: '6px' }}>
          <UserPlus size={15} /> Add Teacher
        </button>
      </div>

      {/* Create Form */}
      {showForm && (
        <div className="card-base" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 600 }}>New Teacher</h3>
            <button onClick={() => setShowForm(false)} style={{ color: 'var(--text-muted)' }}><X size={18} /></button>
          </div>
          <form onSubmit={handleCreate} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '14px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '4px' }}>Full Name *</label>
              <input required value={form.fullName} onChange={e => setForm(p => ({ ...p, fullName: e.target.value }))} placeholder="Prof. Jane Smith" style={{ width: '100%' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '4px' }}>Email *</label>
              <input required type="email" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} placeholder="jane@stellar.edu" style={{ width: '100%' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '4px' }}>Password *</label>
              <input required type="password" value={form.password} onChange={e => setForm(p => ({ ...p, password: e.target.value }))} placeholder="Min 8 characters" style={{ width: '100%' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '4px' }}>Department</label>
              <input value={form.department} onChange={e => setForm(p => ({ ...p, department: e.target.value }))} placeholder="Dept. of AI & DS" style={{ width: '100%' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '4px' }}>Designation</label>
              <input value={form.designation} onChange={e => setForm(p => ({ ...p, designation: e.target.value }))} placeholder="Assistant Professor" style={{ width: '100%' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '4px' }}>Employee ID</label>
              <input value={form.employeeId} onChange={e => setForm(p => ({ ...p, employeeId: e.target.value }))} placeholder="FAC-2026-002" style={{ width: '100%' }} />
            </div>
            <div style={{ gridColumn: '1 / -1' }}>
              <button type="submit" className="btn btn-accent-solid" style={{ marginTop: '8px' }}>Create Teacher Account</button>
            </div>
          </form>
        </div>
      )}

      {/* Search */}
      <div style={{ position: 'relative' }}>
        <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
        <input
          value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Search teachers by name, email, or department..."
          style={{ width: '100%', paddingLeft: '36px' }}
        />
      </div>

      {/* Table */}
      <div className="card-base" style={{ padding: '0', overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-default)', backgroundColor: 'var(--surface-secondary)' }}>
                <th style={{ textAlign: 'left', padding: '10px 16px', color: 'var(--text-muted)', fontWeight: 500 }}>Name</th>
                <th style={{ textAlign: 'left', padding: '10px 16px', color: 'var(--text-muted)', fontWeight: 500 }}>Email</th>
                <th style={{ textAlign: 'left', padding: '10px 16px', color: 'var(--text-muted)', fontWeight: 500 }}>Department</th>
                <th style={{ textAlign: 'left', padding: '10px 16px', color: 'var(--text-muted)', fontWeight: 500 }}>Designation</th>
                <th style={{ textAlign: 'left', padding: '10px 16px', color: 'var(--text-muted)', fontWeight: 500 }}>Status</th>
                <th style={{ textAlign: 'right', padding: '10px 16px', color: 'var(--text-muted)', fontWeight: 500 }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={6} style={{ padding: '32px', textAlign: 'center', color: 'var(--text-muted)' }}>No teachers found.</td></tr>
              ) : filtered.map(t => (
                <tr key={t._id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                  <td style={{ padding: '12px 16px', fontWeight: 500 }}>{t.fullName}</td>
                  <td style={{ padding: '12px 16px', color: 'var(--text-secondary)' }}>{t.email}</td>
                  <td style={{ padding: '12px 16px', color: 'var(--text-secondary)' }}>{t.department || '—'}</td>
                  <td style={{ padding: '12px 16px', color: 'var(--text-secondary)' }}>{t.designation || '—'}</td>
                  <td style={{ padding: '12px 16px' }}>
                    <span className={`badge ${t.isActive ? 'badge-success' : 'badge-danger'}`}>{t.isActive ? 'Active' : 'Inactive'}</span>
                  </td>
                  <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                    <button onClick={() => handleToggle(t._id, t.isActive)} className="btn btn-ghost" style={{ padding: '4px 8px', fontSize: '12px' }}>
                      <Power size={13} /> {t.isActive ? 'Deactivate' : 'Activate'}
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
