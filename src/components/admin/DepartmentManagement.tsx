// Admin — Department Management

import React, { useState } from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { Building2, Plus, X } from 'lucide-react';
import { useToast } from '../common/Toast';

export const DepartmentManagement: React.FC = () => {
  const departments = useQuery(api.academics.getDepartments) || [];
  const createDept = useMutation(api.academics.createDepartment);
  const { showToast } = useToast();

  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', code: '', hodName: '' });

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    await createDept(form);
    showToast('Department Created', `${form.name} added.`, 'success');
    setShowForm(false);
    setForm({ name: '', code: '', hodName: '' });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '900px', margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h2 style={{ fontSize: '24px', fontWeight: 600, marginBottom: '4px' }}>Departments</h2>
          <p style={{ fontSize: '14px', color: 'var(--text-muted)' }}>{departments.length} departments</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="btn btn-accent-solid" style={{ gap: '6px' }}>
          <Plus size={15} /> Add Department
        </button>
      </div>

      {showForm && (
        <div className="card-base" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 600 }}>New Department</h3>
            <button onClick={() => setShowForm(false)} style={{ color: 'var(--text-muted)' }}><X size={18} /></button>
          </div>
          <form onSubmit={handleCreate} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '4px' }}>Name *</label>
              <input required value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} placeholder="Dept. of AI & Data Science" style={{ width: '100%' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '4px' }}>Code *</label>
              <input required value={form.code} onChange={e => setForm(p => ({ ...p, code: e.target.value }))} placeholder="ADS" style={{ width: '100%' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '4px' }}>HOD Name</label>
              <input value={form.hodName} onChange={e => setForm(p => ({ ...p, hodName: e.target.value }))} placeholder="Dr. Michael Moses T" style={{ width: '100%' }} />
            </div>
            <div style={{ gridColumn: '1 / -1' }}>
              <button type="submit" className="btn btn-accent-solid">Create Department</button>
            </div>
          </form>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
        {departments.length === 0 ? (
          <div className="card-base" style={{ padding: '40px', textAlign: 'center', gridColumn: '1 / -1' }}>
            <Building2 size={32} style={{ color: 'var(--text-muted)', marginBottom: '12px' }} />
            <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>No departments created yet.</p>
          </div>
        ) : departments.map(d => (
          <div key={d._id} className="card-base" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <span className="badge badge-accent">{d.code}</span>
              <span className={`badge ${d.isActive ? 'badge-success' : 'badge-danger'}`}>{d.isActive ? 'Active' : 'Inactive'}</span>
            </div>
            <h4 style={{ fontSize: '15px', fontWeight: 600, marginBottom: '4px' }}>{d.name}</h4>
            {d.hodName && <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>HOD: {d.hodName}</p>}
          </div>
        ))}
      </div>
    </div>
  );
};
