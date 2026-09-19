// Admin Portal Layout with Sidebar and Route Management

import React, { useState } from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  Building2,
  BookOpen,
  ScrollText,
  Settings,
  LogOut,
  Compass,
  UserPlus,
  Shield,
  ClipboardList,
  Menu,
  X,
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../common/Toast';

// Admin Page Components
import { AdminDashboard } from './AdminDashboard';
import { TeacherManagement } from './TeacherManagement';
import { StudentManagement } from './StudentManagement';
import { DepartmentManagement } from './DepartmentManagement';
import { SubjectManagement } from './SubjectManagement';
import { AuditLogs } from './AuditLogs';
import { AdminSettings } from './AdminSettings';

type AdminRoute = 'dashboard' | 'teachers' | 'students' | 'departments' | 'subjects' | 'audit-logs' | 'settings';

const navItems: { route: AdminRoute; label: string; icon: React.ElementType }[] = [
  { route: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { route: 'teachers', label: 'Teachers', icon: Users },
  { route: 'students', label: 'Students', icon: GraduationCap },
  { route: 'departments', label: 'Departments', icon: Building2 },
  { route: 'subjects', label: 'Subjects', icon: BookOpen },
  { route: 'audit-logs', label: 'Audit Logs', icon: ScrollText },
  { route: 'settings', label: 'Settings', icon: Settings },
];

export const AdminLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { showToast } = useToast();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const pathSegments = location.pathname.split('/').filter(Boolean);
  const currentRoute: AdminRoute = (pathSegments[1] || 'dashboard') as AdminRoute;

  const handleNavClick = (route: AdminRoute) => {
    navigate(`/admin/${route}`);
    setIsMobileOpen(false);
  };

  const handleLogout = async () => {
    await logout();
    showToast('Signed Out', 'Admin session ended.', 'info');
    navigate('/');
  };

  return (
    <div className="app-container">
      {/* Mobile backdrop */}
      {isMobileOpen && (
        <div
          onClick={() => setIsMobileOpen(false)}
          style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(9,9,11,0.8)', zIndex: 90, backdropFilter: 'blur(3px)' }}
        />
      )}

      {/* Admin Sidebar */}
      <aside
        className={`stellar-sidebar ${isMobileOpen ? 'mobile-open' : ''}`}
        style={{
          width: 'var(--sidebar-width)', backgroundColor: 'var(--surface-primary)',
          borderRight: '1px solid var(--border-default)', height: '100vh',
          display: 'flex', flexDirection: 'column', zIndex: 100,
          transition: 'transform var(--transition-panel)',
        }}
      >
        {/* Brand */}
        <div style={{
          height: 'var(--topbar-height)', padding: '0 20px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          borderBottom: '1px solid var(--border-subtle)',
        }}>
          <div onClick={() => handleNavClick('dashboard')} style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
            <div style={{
              width: '30px', height: '30px', borderRadius: '8px',
              background: 'linear-gradient(135deg, #7c3aed, #6d28d9)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white',
              boxShadow: '0 2px 8px rgba(124, 58, 237, 0.3)',
            }}>
              <Compass size={17} strokeWidth={2.2} />
            </div>
            <div>
              <span style={{ fontSize: '15px', fontWeight: 700, letterSpacing: '-0.01em', color: 'var(--text-primary)', display: 'block', lineHeight: 1.1 }}>Stellar</span>
              <span style={{ fontSize: '10px', color: 'var(--accent-light)', letterSpacing: '0.02em', fontWeight: 500 }}>Admin Portal</span>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav style={{ flex: 1, overflowY: 'auto', padding: '12px', display: 'flex', flexDirection: 'column', gap: '2px' }}>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentRoute === item.route;
            return (
              <button
                key={item.route}
                onClick={() => handleNavClick(item.route)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '10px',
                  width: '100%', padding: '8px 12px', borderRadius: 'var(--radius-md)',
                  backgroundColor: isActive ? 'var(--accent-subtle)' : 'transparent',
                  color: isActive ? 'var(--accent-primary)' : 'var(--text-secondary)',
                  fontWeight: isActive ? 500 : 400, fontSize: '13px',
                  border: `1px solid ${isActive ? 'var(--accent-border)' : 'transparent'}`,
                  transition: 'all var(--transition-fast)',
                }}
              >
                <Icon size={16} style={{ color: isActive ? 'var(--accent-primary)' : 'inherit' }} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Footer */}
        <div style={{ padding: '12px', borderTop: '1px solid var(--border-subtle)' }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 10px',
            borderRadius: 'var(--radius-md)', backgroundColor: 'var(--surface-secondary)',
            border: '1px solid var(--border-default)', marginBottom: '8px',
          }}>
            <div style={{
              width: '32px', height: '32px', borderRadius: '50%',
              backgroundColor: 'var(--accent-subtle)', border: '1px solid var(--accent-border)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'var(--accent-primary)', fontSize: '14px', fontWeight: 600,
            }}>
              <Shield size={16} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text-primary)' }}>{user?.fullName || 'Admin'}</div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>System Administrator</div>
            </div>
          </div>
          <button
            onClick={handleLogout}
            style={{
              width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center',
              gap: '6px', padding: '7px', borderRadius: 'var(--radius-sm)',
              backgroundColor: 'transparent', border: '1px solid var(--border-subtle)',
              color: 'var(--text-muted)', fontSize: '12px',
              transition: 'all var(--transition-fast)',
            }}
          >
            <LogOut size={13} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="main-viewport">
        {/* Top Bar */}
        <div style={{
          height: 'var(--topbar-height)', padding: '0 24px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          borderBottom: '1px solid var(--border-default)', backgroundColor: 'var(--surface-primary)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button
              className="mobile-menu-btn"
              onClick={() => setIsMobileOpen(true)}
              style={{ display: 'none', padding: '6px', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--surface-secondary)', border: '1px solid var(--border-default)' }}
            >
              <Menu size={18} />
            </button>
            <h1 style={{ fontSize: '18px', fontWeight: 600, textTransform: 'capitalize' }}>
              {currentRoute === 'audit-logs' ? 'Audit Logs' : currentRoute}
            </h1>
          </div>
          <span className="badge badge-accent">Admin</span>
        </div>

        {/* Route Content */}
        <main className="main-content-scrollable">
          <Routes>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="teachers" element={<TeacherManagement />} />
            <Route path="students" element={<StudentManagement />} />
            <Route path="departments" element={<DepartmentManagement />} />
            <Route path="subjects" element={<SubjectManagement />} />
            <Route path="audit-logs" element={<AuditLogs />} />
            <Route path="settings" element={<AdminSettings />} />
            <Route path="*" element={<Navigate to="dashboard" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};
