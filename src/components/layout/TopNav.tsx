import React, { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useWorkspace } from '../../context/WorkspaceContext';
import { Avatar } from '../ui/Avatar';
import {
  Menu,
  Search,
  Bell,
  Bot,
  User,
  Settings,
  LogOut,
  RotateCcw,
  CheckCheck,
  ChevronRight,
  Sparkles,
  Calendar,
  MessageSquare,
  KanbanSquare,
  GraduationCap,
  Sun,
  Moon,
  Leaf,
} from 'lucide-react';

interface TopNavProps {
  isCollapsed: boolean;
  setIsMobileOpen: (open: boolean) => void;
}

export const TopNav: React.FC<TopNavProps> = ({ isCollapsed, setIsMobileOpen }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const {
    currentUser,
    notifications,
    markNotificationRead,
    isNotificationsOpen,
    setIsNotificationsOpen,
    isAssistantOpen,
    setIsAssistantOpen,
    resetDemoData,
    adaptWorkspace,
    theme,
    setTheme,
  } = useWorkspace();

  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [searchVal, setSearchVal] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const profileRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setIsProfileMenuOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setIsNotificationsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [setIsNotificationsOpen]);

  // Route title mapping
  const getPageTitle = () => {
    const path = location.pathname;
    if (path === '/app') return { title: 'Workspace Overview', breadcrumb: 'Dashboard' };
    if (path.startsWith('/app/meetings')) return { title: 'Meeting Workspace', breadcrumb: 'Meetings' };
    if (path.startsWith('/app/communication')) return { title: 'Communication Workspace', breadcrumb: 'Inbox & Triage' };
    if (path.startsWith('/app/study')) return { title: 'Study Workspace', breadcrumb: 'Active Recall' };
    if (path.startsWith('/app/projects')) return { title: 'Project Management', breadcrumb: 'Kanban & Tasks' };
    if (path.startsWith('/app/analytics')) return { title: 'Data Analytics', breadcrumb: 'Telemetry & Trends' };
    if (path.startsWith('/app/assistant')) return { title: 'AI Assistant', breadcrumb: 'Intelligent Agent' };
    if (path.startsWith('/app/settings')) return { title: 'Settings', breadcrumb: 'Preferences' };
    return { title: 'Nexora Platform', breadcrumb: 'Workspace' };
  };

  const { title, breadcrumb } = getPageTitle();
  const unreadNotifCount = notifications.filter((n) => n.unread).length;

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchVal.trim()) {
      adaptWorkspace(searchVal);
      setSearchVal('');
      setIsSearchFocused(false);
    }
  };

  return (
    <header
      className={`fixed top-0 right-0 z-30 h-16 border-b transition-all duration-300 backdrop-blur-md bg-[var(--surface-glass)] border-[var(--border-subtle)] text-[var(--ink-primary)] ${
        isCollapsed ? 'left-0 lg:left-20' : 'left-0 lg:left-64'
      }`}
    >
      <div className="h-full px-4 sm:px-6 flex items-center justify-between gap-4">
        {/* Left: Mobile hamburger + Page Title & Breadcrumb */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsMobileOpen(true)}
            className="p-2 text-[var(--ink-tertiary)] hover:text-[var(--ink-primary)] hover:bg-[var(--surface-secondary)] rounded-lg lg:hidden"
            aria-label="Open sidebar menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex flex-col">
            <div className="flex items-center gap-1.5 text-[11px] text-[var(--ink-tertiary)] font-medium">
              <span>Nexora</span>
              <ChevronRight className="w-3 h-3 text-[var(--ink-tertiary)]" />
              <span className="text-[var(--ink-primary)] font-semibold">{breadcrumb}</span>
            </div>
            <h1 className="text-base sm:text-lg font-bold tracking-tight leading-none mt-0.5 text-[var(--ink-primary)]">
              {title}
            </h1>
          </div>
        </div>

        {/* Center: Search Field */}
        <div className="hidden md:flex flex-1 max-w-md relative">
          <form onSubmit={handleSearchSubmit} className="w-full">
            <div className="relative flex items-center">
              <Search className="w-4 h-4 text-[var(--ink-tertiary)] absolute left-3 pointer-events-none" />
              <input
                type="text"
                value={searchVal}
                onChange={(e) => setSearchVal(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
                placeholder="Search workspaces or type goal to adapt..."
                className="w-full pl-9 pr-4 py-2 rounded-xl text-xs bg-[var(--surface-secondary)] border border-[var(--border-subtle)] text-[var(--ink-primary)] placeholder:text-[var(--ink-tertiary)] focus:outline-none focus:border-[var(--accent-primary)] focus:ring-1 focus:ring-[var(--accent-primary)] transition-all"
              />
            </div>
          </form>

          {/* Quick Search Suggestions */}
          {isSearchFocused && (
            <div className="absolute top-11 left-0 right-0 bg-[var(--surface)] border border-[var(--border-subtle)] rounded-xl shadow-xl p-2 z-50 text-xs">
              <span className="px-2 py-1 text-[11px] font-semibold text-[var(--ink-tertiary)] uppercase tracking-wider block">
                Quick Navigation & Goals
              </span>
              <button
                onMouseDown={() => adaptWorkspace("Prepare for tomorrow's client meeting.")}
                className="w-full text-left px-2.5 py-1.5 hover:bg-[var(--surface-secondary)] rounded-lg flex items-center gap-2 text-[var(--ink-primary)]"
              >
                <Calendar className="w-3.5 h-3.5 text-indigo-500" />
                <span>Prepare for tomorrow's client meeting</span>
              </button>
              <button
                onMouseDown={() => adaptWorkspace('Summarize my unread messages.')}
                className="w-full text-left px-2.5 py-1.5 hover:bg-[var(--surface-secondary)] rounded-lg flex items-center gap-2 text-[var(--ink-primary)]"
              >
                <MessageSquare className="w-3.5 h-3.5 text-blue-500" />
                <span>Summarize my unread messages</span>
              </button>
              <button
                onMouseDown={() => adaptWorkspace('Review overdue project tasks.')}
                className="w-full text-left px-2.5 py-1.5 hover:bg-[var(--surface-secondary)] rounded-lg flex items-center gap-2 text-[var(--ink-primary)]"
              >
                <KanbanSquare className="w-3.5 h-3.5 text-amber-500" />
                <span>Review overdue project tasks</span>
              </button>
            </div>
          )}
        </div>

        {/* Right: Actions & Theme Selector & User Menu */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* Aesthetic Theme Switcher with 4 Curated Palettes */}
          <div className="flex items-center rounded-xl p-0.5 border border-[var(--border-subtle)] bg-[var(--surface-secondary)] text-xs shadow-xs">
            <button
              onClick={() => setTheme('dark')}
              className={`p-1.5 rounded-lg transition-all flex items-center gap-1 ${
                theme === 'dark'
                  ? 'bg-slate-800 text-indigo-400 shadow-sm ring-1 ring-indigo-500/30'
                  : 'text-[var(--ink-tertiary)] hover:text-[var(--ink-primary)]'
              }`}
              title="Obsidian Dark Aesthetic"
            >
              <Moon className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setTheme('midnight')}
              className={`p-1.5 rounded-lg transition-all flex items-center gap-1 ${
                theme === 'midnight'
                  ? 'bg-indigo-950 text-indigo-200 shadow-sm ring-1 ring-indigo-400/40'
                  : 'text-[var(--ink-tertiary)] hover:text-[var(--ink-primary)]'
              }`}
              title="Cosmic Midnight Aesthetic"
            >
              <Sparkles className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setTheme('forest')}
              className={`p-1.5 rounded-lg transition-all flex items-center gap-1 ${
                theme === 'forest'
                  ? 'bg-emerald-950 text-emerald-300 shadow-sm ring-1 ring-emerald-500/40'
                  : 'text-[var(--ink-tertiary)] hover:text-[var(--ink-primary)]'
              }`}
              title="Emerald Atelier Aesthetic"
            >
              <Leaf className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setTheme('light')}
              className={`p-1.5 rounded-lg transition-all flex items-center gap-1 ${
                theme === 'light'
                  ? 'bg-white text-indigo-600 shadow-sm ring-1 ring-slate-300'
                  : 'text-[var(--ink-tertiary)] hover:text-[var(--ink-primary)]'
              }`}
              title="Editorial Light Aesthetic"
            >
              <Sun className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Quick AI Assistant Trigger */}
          <button
            onClick={() => setIsAssistantOpen(!isAssistantOpen)}
            className="flex items-center gap-1.5 px-3 py-1.5 nx-btn-primary text-xs font-semibold rounded-xl transition-all active:scale-95"
            title="Toggle Assistant"
          >
            <Bot className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Copilot</span>
          </button>

          {/* Notifications Dropdown */}
          <div className="relative" ref={notifRef}>
            <button
              onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
              className="p-2 text-[var(--ink-tertiary)] hover:text-[var(--ink-primary)] hover:bg-[var(--surface-secondary)] rounded-xl relative transition-colors"
              aria-label="View notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadNotifCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-[var(--surface)]" />
              )}
            </button>

            {isNotificationsOpen && (
              <div className="absolute right-0 top-12 w-80 bg-[var(--surface)] border border-[var(--border-subtle)] rounded-2xl shadow-xl z-50 overflow-hidden animate-in fade-in duration-150">
                <div className="p-3.5 border-b border-[var(--border-subtle)] flex items-center justify-between">
                  <span className="text-xs font-bold text-[var(--ink-primary)]">Notifications</span>
                  <span className="text-[11px] text-[var(--ink-tertiary)] font-mono tabular-nums">
                    {unreadNotifCount} unread
                  </span>
                </div>
                <div className="max-h-72 overflow-y-auto divide-y divide-[var(--border-subtle)]">
                  {notifications.map((n) => (
                    <div
                      key={n.id}
                      onClick={() => markNotificationRead(n.id)}
                      className={`p-3 text-xs hover:bg-[var(--surface-secondary)] cursor-pointer transition-colors ${
                        n.unread ? 'bg-[var(--surface-secondary)]/70' : ''
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <span className="font-semibold text-[var(--ink-primary)]">{n.title}</span>
                        <span className="text-[10px] text-[var(--ink-tertiary)] font-mono tabular-nums">{n.time}</span>
                      </div>
                      <p className="text-[11px] text-[var(--ink-secondary)] mt-1">{n.message}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* User Profile Menu */}
          <div className="relative" ref={profileRef}>
            <button
              onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
              className="flex items-center gap-2 p-1 rounded-xl hover:bg-[var(--surface-secondary)] transition-colors"
            >
              <Avatar name={currentUser.name} size="sm" />
            </button>

            {isProfileMenuOpen && (
              <div className="absolute right-0 top-12 w-60 bg-[var(--surface)] border border-[var(--border-subtle)] rounded-2xl shadow-xl z-50 p-2 animate-in fade-in duration-150 text-xs">
                <div className="px-3 py-2 border-b border-[var(--border-subtle)] mb-1">
                  <span className="font-bold text-[var(--ink-primary)] block truncate">
                    {currentUser.name}
                  </span>
                  <span className="text-[11px] text-[var(--ink-tertiary)] block truncate">
                    {currentUser.email}
                  </span>
                </div>

                <button
                  onClick={() => {
                    navigate('/app/settings');
                    setIsProfileMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 text-[var(--ink-secondary)] hover:text-[var(--ink-primary)] hover:bg-[var(--surface-secondary)] rounded-lg flex items-center gap-2"
                >
                  <Settings className="w-3.5 h-3.5 text-[var(--ink-tertiary)]" />
                  <span>Workspace Preferences</span>
                </button>

                <button
                  onClick={() => {
                    resetDemoData();
                    setIsProfileMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 text-amber-500 hover:bg-amber-500/10 rounded-lg flex items-center gap-2"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-amber-500" />
                  <span>Reset Demo State</span>
                </button>

                <div className="border-t border-[var(--border-subtle)] my-1" />

                <button
                  onClick={() => {
                    navigate('/login');
                    setIsProfileMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 text-rose-500 hover:bg-rose-500/10 rounded-lg flex items-center gap-2"
                >
                  <LogOut className="w-3.5 h-3.5 text-rose-500" />
                  <span>Sign Out</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
