import React, { useState } from 'react';
import { Search, Bell, LogOut, Shield, Sparkles, Layers } from 'lucide-react';
import { Role } from '../types';

interface NavbarProps {
  currentUser: {
    name: string;
    email: string;
    role: Role;
    avatar?: string;
  } | null;
  onLogout: () => void;
  onRoleSwitch?: (role: Role) => void;
  currentTheme?: string;
  onThemeChange?: (theme: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  onLogout,
  onRoleSwitch,
  currentTheme = 'indigo',
  onThemeChange
}) => {
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between px-6 py-3.5 bg-white/95 backdrop-blur-md border-b border-slate-200/80">
      {/* Search Bar */}
      <div className="flex items-center gap-2.5 w-72 md:w-96 px-3.5 py-1.5 bg-slate-50 rounded-xl border border-slate-200 shadow-inner focus-within:bg-white focus-within:ring-2 focus-within:ring-indigo-500/30 transition-all">
        <Search className="w-4 h-4 text-slate-400" />
        <input
          type="text"
          placeholder="Search meetings, projects, technology paths..."
          className="w-full bg-transparent text-xs text-slate-900 outline-none placeholder:text-slate-400 font-medium"
        />
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3.5">
        {/* Development Theme Preset Selector */}
        {onThemeChange && (
          <div className="hidden lg:flex items-center gap-1.5 px-3 py-1 bg-slate-100/80 rounded-xl border border-slate-200 text-xs text-slate-600 font-medium">
            <Layers className="w-3.5 h-3.5 text-indigo-600" />
            <span className="text-[11px] font-semibold text-slate-500">Theme:</span>
            {[
              { id: 'indigo', label: 'Indigo' },
              { id: 'slate', label: 'Slate' },
              { id: 'midnight', label: 'Midnight' }
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => onThemeChange(t.id)}
                className={`px-2 py-0.5 rounded-lg text-[11px] font-semibold transition-all ${
                  currentTheme === t.id
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'hover:bg-slate-200 text-slate-600'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        )}

        {/* Development Role Switcher */}
        {onRoleSwitch && currentUser && (
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 bg-indigo-50/60 rounded-xl border border-indigo-100 text-xs font-medium text-indigo-950">
            <Shield className="w-3.5 h-3.5 text-indigo-600" />
            <span className="text-[11px] font-semibold text-slate-500">Role:</span>
            {(['ADMIN', 'MANAGER', 'EMPLOYEE', 'INTERN'] as Role[]).map((r) => (
              <button
                key={r}
                onClick={() => onRoleSwitch(r)}
                className={`px-2 py-0.5 rounded-lg transition-all text-[11px] ${
                  currentUser.role === r
                    ? 'bg-indigo-600 text-white font-semibold shadow-xs'
                    : 'hover:bg-indigo-100/60 text-slate-700'
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        )}

        {/* Notifications Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 rounded-xl hover:bg-slate-100 text-slate-600 transition-colors"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-indigo-600 rounded-full ring-2 ring-white"></span>
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-slate-200 p-4 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="flex items-center justify-between pb-2.5 border-b border-slate-100">
                <h4 className="text-xs font-bold text-slate-900 font-heading">Notifications</h4>
                <span className="text-[10px] text-indigo-600 font-semibold bg-indigo-50 px-2 py-0.5 rounded-full">
                  2 Unread
                </span>
              </div>
              <div className="mt-3 space-y-2 text-xs">
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                  <p className="font-semibold text-slate-900">Architecture Sync Scheduled</p>
                  <p className="text-[11px] text-slate-500">Tomorrow at 10:00 AM • Executive Room A</p>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                  <p className="font-semibold text-slate-900">Security Audit Task Assigned</p>
                  <p className="text-[11px] text-slate-500">Assigned by Engineering Lead</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Active Employee Profile */}
        {currentUser && (
          <div className="flex items-center gap-2.5 pl-3 border-l border-slate-200">
            <div className="w-8 h-8 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold text-xs shadow-xs">
              {currentUser.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
            </div>
            <div className="hidden lg:block text-left">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-slate-900">{currentUser.name}</span>
                <span className={`text-[9px] px-1.5 py-0.2 rounded font-bold ${
                  currentUser.role === 'ADMIN' ? 'bg-slate-900 text-white' :
                  currentUser.role === 'MANAGER' ? 'bg-amber-100 text-amber-800' :
                  'bg-slate-100 text-slate-700'
                }`}>
                  {currentUser.role}
                </span>
              </div>
              <p className="text-[10px] text-slate-500 font-medium">{currentUser.email}</p>
            </div>
            <button
              onClick={onLogout}
              className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-rose-600 transition-colors"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </header>
  );
};
