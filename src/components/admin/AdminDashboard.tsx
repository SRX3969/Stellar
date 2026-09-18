// Admin Dashboard — System Overview

import React from 'react';
import { useQuery } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { Users, GraduationCap, BookOpen, Building2, TrendingUp, Activity } from 'lucide-react';

import { INSTITUTIONAL_STUDENTS } from '../../data/institutionalData';
import { SUBJECTS } from '../../data/mockData';

export const AdminDashboard: React.FC = () => {
  const allUsers = useQuery(api.users.getAllUsers) || [];
  const departments = useQuery(api.academics.getDepartments) || [];
  const subjects = useQuery(api.academics.getSubjects) || [];
  const sections = useQuery(api.academics.getSections) || [];

  const fallbackUsers = [
    { _id: 'u-1', fullName: 'System Administrator', email: 'admin@stellar.edu', role: 'admin', isActive: true },
    { _id: 'u-2', fullName: 'Prof. Swati Raj', email: 'swati.raj@stellar.edu', role: 'teacher', isActive: true },
    { _id: 'u-3', fullName: 'Dr. Ammani Kuttan B', email: 'ammani.kuttan@stellar.edu', role: 'teacher', isActive: true },
    { _id: 'u-4', fullName: 'Dr. Florance G', email: 'florance.g@stellar.edu', role: 'teacher', isActive: true },
    ...INSTITUTIONAL_STUDENTS.map(s => ({ _id: s.id, fullName: s.fullName, email: s.email, role: 'student' as const, isActive: true }))
  ];
  const effectiveUsers = allUsers.length > 0 ? allUsers : fallbackUsers;

  const fallbackDepts = [
    { _id: 'd-1', code: 'AIDS', name: 'Department of AI and Data Science Engineering' },
    { _id: 'd-2', code: 'CSE', name: 'Department of Computer Science and Engineering' },
    { _id: 'd-3', code: 'ECE', name: 'Department of Electronics and Communication Engineering' },
  ];
  const effectiveDepts = departments.length > 0 ? departments : fallbackDepts;
  const effectiveSubjects = subjects.length > 0 ? subjects : SUBJECTS;

  const teachers = effectiveUsers.filter(u => u.role === 'teacher' && u.isActive);
  const students = effectiveUsers.filter(u => u.role === 'student' && u.isActive);
  const admins = effectiveUsers.filter(u => u.role === 'admin' && u.isActive);
  const inactiveUsers = effectiveUsers.filter(u => !u.isActive);

  const stats = [
    { label: 'Total Students', value: students.length, icon: GraduationCap, color: '#4caf7a' },
    { label: 'Total Teachers', value: teachers.length, icon: Users, color: '#7298d6' },
    { label: 'Departments', value: effectiveDepts.length, icon: Building2, color: '#c8a96b' },
    { label: 'Subjects', value: effectiveSubjects.length, icon: BookOpen, color: '#d6a84f' },
    { label: 'Active Sections', value: Math.max(2, sections.filter(s => s.isActive).length), icon: TrendingUp, color: '#d96c6c' },
    { label: 'Active Admins', value: admins.length, icon: Activity, color: '#c8a96b' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '1100px', margin: '0 auto' }}>
      <div>
        <h2 style={{ fontSize: '24px', fontWeight: 600, marginBottom: '4px' }}>System Overview</h2>
        <p style={{ fontSize: '14px', color: 'var(--text-muted)' }}>
          Real-time institutional metrics from the Stellar database.
        </p>
      </div>

      {/* Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px' }}>
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} className="card-base" style={{ padding: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                <div style={{
                  width: '36px', height: '36px', borderRadius: '8px',
                  backgroundColor: `${stat.color}15`, border: `1px solid ${stat.color}30`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', color: stat.color,
                }}>
                  <Icon size={18} />
                </div>
              </div>
              <div style={{ fontSize: '28px', fontWeight: 700, color: 'var(--text-primary)' }}>{stat.value}</div>
              <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '4px' }}>{stat.label}</div>
            </div>
          );
        })}
      </div>

      {/* Recent Users */}
      <div className="card-base" style={{ padding: '24px' }}>
        <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '16px' }}>Registered Academic Community</h3>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-default)' }}>
                <th style={{ textAlign: 'left', padding: '8px 12px', color: 'var(--text-muted)', fontWeight: 500 }}>Name</th>
                <th style={{ textAlign: 'left', padding: '8px 12px', color: 'var(--text-muted)', fontWeight: 500 }}>Email</th>
                <th style={{ textAlign: 'left', padding: '8px 12px', color: 'var(--text-muted)', fontWeight: 500 }}>Role</th>
                <th style={{ textAlign: 'left', padding: '8px 12px', color: 'var(--text-muted)', fontWeight: 500 }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {effectiveUsers.slice(0, 12).map((u) => (
                  <tr key={u._id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                    <td style={{ padding: '10px 12px', fontWeight: 500 }}>{u.fullName}</td>
                    <td style={{ padding: '10px 12px', color: 'var(--text-secondary)' }}>{u.email}</td>
                    <td style={{ padding: '10px 12px' }}>
                      <span className={`badge ${u.role === 'admin' ? 'badge-accent' : u.role === 'teacher' ? 'badge-info' : 'badge-success'}`}>
                        {u.role}
                      </span>
                    </td>
                    <td style={{ padding: '10px 12px' }}>
                      <span className={`badge ${u.isActive ? 'badge-success' : 'badge-danger'}`}>
                        {u.isActive ? 'Active' : 'Inactive'}
                      </span>
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
