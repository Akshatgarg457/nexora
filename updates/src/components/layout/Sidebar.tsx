import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useWorkspace } from '../../context/WorkspaceContext';
import { Avatar } from '../ui/Avatar';
import {
  LayoutDashboard,
  Calendar,
  MessageSquare,
  GraduationCap,
  KanbanSquare,
  BarChart3,
  Bot,
  Settings,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Zap,
} from 'lucide-react';

interface SidebarProps {
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
  isMobileOpen: boolean;
  setIsMobileOpen: (open: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isCollapsed,
  setIsCollapsed,
  isMobileOpen,
  setIsMobileOpen,
}) => {
  const { currentUser, activeAdaptiveConfig } = useWorkspace();
  const navigate = useNavigate();

  const navItems = [
    { to: '/app', label: 'Dashboard', icon: LayoutDashboard, exact: true },
    { to: '/app/meetings', label: 'Meetings', icon: Calendar },
    { to: '/app/communication', label: 'Communication', icon: MessageSquare },
    { to: '/app/study', label: 'Study Workspace', icon: GraduationCap },
    { to: '/app/projects', label: 'Projects', icon: KanbanSquare },
    { to: '/app/analytics', label: 'Data Analytics', icon: BarChart3 },
    { to: '/app/assistant', label: 'AI Assistant', icon: Bot },
    { to: '/app/settings', label: 'Settings', icon: Settings },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs z-40 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 bg-[var(--surface)] border-r border-[var(--border-subtle)] transition-all duration-300 flex flex-col justify-between ${
          isMobileOpen ? 'translate-x-0 w-64' : '-translate-x-full lg:translate-x-0'
        } ${isCollapsed ? 'lg:w-20' : 'lg:w-64'}`}
      >
        {/* Brand / Logo */}
        <div>
          <div className="h-16 flex items-center justify-between px-4 border-b border-[var(--border-subtle)]">
            <NavLink
              to="/app"
              onClick={() => setIsMobileOpen(false)}
              className="flex items-center gap-3 group overflow-hidden"
            >
              <div className="w-9 h-9 rounded-xl nx-btn-primary flex items-center justify-center font-bold shadow-xs shrink-0">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              {(!isCollapsed || isMobileOpen) && (
                <div className="flex flex-col">
                  <span className="text-base font-bold text-[var(--ink-primary)] tracking-tight leading-none">
                    Nexora
                  </span>
                  <span className="text-[10px] font-medium text-[var(--ink-tertiary)] tracking-wider mt-1 uppercase">
                    Adaptive Workspace
                  </span>
                </div>
              )}
            </NavLink>

            {/* Desktop collapse toggle */}
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="hidden lg:flex p-1.5 text-[var(--ink-tertiary)] hover:text-[var(--ink-primary)] hover:bg-[var(--surface-secondary)] rounded-lg transition-colors"
              title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
            >
              {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </button>
          </div>

          {/* Active Adaptive Target Indicator */}
          {activeAdaptiveConfig && (!isCollapsed || isMobileOpen) && (
            <div className="mx-3 mt-3 p-2.5 bg-[var(--surface-secondary)] border border-[var(--border-subtle)] rounded-xl text-xs flex items-start gap-2 shadow-xs">
              <Zap className="w-3.5 h-3.5 text-[var(--accent-primary)] shrink-0 mt-0.5 animate-pulse" />
              <div className="overflow-hidden">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--accent-primary)] block">
                  Active Intent
                </span>
                <span className="text-xs font-semibold text-[var(--ink-primary)] truncate block mt-0.5">
                  {activeAdaptiveConfig.detectedIntent}
                </span>
              </div>
            </div>
          )}

          {/* Navigation Links */}
          <nav className="p-3 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.exact}
                  onClick={() => setIsMobileOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold tracking-tight transition-all whitespace-nowrap shrink-0 ${
                      isActive
                        ? 'nx-btn-primary shadow-xs ring-1 ring-white/10'
                        : 'text-[var(--ink-secondary)] hover:bg-[var(--surface-secondary)] hover:text-[var(--ink-primary)]'
                    }`
                  }
                  title={isCollapsed ? item.label : undefined}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  {(!isCollapsed || isMobileOpen) && <span>{item.label}</span>}
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* User Profile Footer */}
        <div className="p-3 border-t border-[var(--border-subtle)]">
          <div
            onClick={() => navigate('/app/settings')}
            className={`flex items-center gap-3 p-2 rounded-xl hover:bg-[var(--surface-secondary)] cursor-pointer transition-colors ${
              isCollapsed && !isMobileOpen ? 'justify-center' : ''
            }`}
          >
            <Avatar name={currentUser.name} size="sm" />
            {(!isCollapsed || isMobileOpen) && (
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-bold text-[var(--ink-primary)] truncate">
                  {currentUser.name}
                </span>
                <span className="text-[10px] text-[var(--ink-tertiary)] truncate">
                  {currentUser.role}
                </span>
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  );
};
