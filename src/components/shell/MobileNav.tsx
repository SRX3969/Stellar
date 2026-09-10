import React from 'react';
import {
  LayoutDashboard,
  MessageSquareCode,
  Calendar,
  CheckSquare,
  Menu
} from 'lucide-react';
import { NavRoute } from './Sidebar';

interface MobileNavProps {
  currentRoute: NavRoute;
  onRouteChange: (route: NavRoute) => void;
  onOpenMoreMenu: () => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({
  currentRoute,
  onRouteChange,
  onOpenMoreMenu,
}) => {
  const items = [
    { route: 'dashboard' as NavRoute, label: 'Home', icon: LayoutDashboard },
    { route: 'ai' as NavRoute, label: 'AI', icon: MessageSquareCode },
    { route: 'calendar' as NavRoute, label: 'Calendar', icon: Calendar },
    { route: 'tasks' as NavRoute, label: 'Tasks', icon: CheckSquare },
  ];

  return (
    <div
      className="mobile-bottom-nav"
      style={{
        display: 'none', // Controlled via media queries in CSS
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        height: '60px',
        backgroundColor: 'var(--surface-primary)',
        borderTop: '1px solid var(--border-default)',
        zIndex: 90,
        justifyContent: 'space-around',
        alignItems: 'center',
        padding: '0 8px',
      }}
    >
      {items.map((item) => {
        const Icon = item.icon;
        const isActive = currentRoute === item.route;

        return (
          <button
            key={item.route}
            onClick={() => onRouteChange(item.route)}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '3px',
              padding: '6px 12px',
              borderRadius: 'var(--radius-sm)',
              color: isActive ? 'var(--accent-light)' : 'var(--text-secondary)',
              fontSize: '11px',
              fontWeight: isActive ? 600 : 400,
            }}
          >
            <Icon size={18} style={{ color: isActive ? 'var(--accent-primary)' : 'inherit' }} />
            <span>{item.label}</span>
          </button>
        );
      })}

      <button
        onClick={onOpenMoreMenu}
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '3px',
          padding: '6px 12px',
          borderRadius: 'var(--radius-sm)',
          color: 'var(--text-secondary)',
          fontSize: '11px',
        }}
      >
        <Menu size={18} />
        <span>More</span>
      </button>
    </div>
  );
};
