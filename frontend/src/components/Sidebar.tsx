import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Calendar,
  MessageSquare,
  BookOpen,
  Briefcase,
  BarChart3,
  Users,
  Home,
  Hexagon
} from 'lucide-react';
import { Role } from '../types';

interface SidebarProps {
  userRole?: Role;
}

export const Sidebar: React.FC<SidebarProps> = ({ userRole }) => {
  const navItems = [
    { label: 'Dashboard', path: '/app', icon: LayoutDashboard },
    { label: 'Meetings Workspace', path: '/app/meetings', icon: Calendar },
    { label: 'Communication', path: '/app/communication', icon: MessageSquare },
    { label: 'Study Workspace', path: '/app/study', icon: BookOpen },
    { label: 'Project Management', path: '/app/projects', icon: Briefcase },
    { label: 'Data Analytics', path: '/app/analytics', icon: BarChart3 },
  ];

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 border-r border-slate-800 flex flex-col justify-between h-screen sticky top-0 z-20">
      <div>
        {/* Nexora Enterprise Brand Header */}
        <div className="flex items-center gap-3 px-6 py-5 border-b border-slate-800">
          <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-900/40">
            <Hexagon className="w-5 h-5 fill-indigo-600 text-white stroke-[2.5]" />
          </div>
          <div>
            <h1 className="text-lg font-extrabold text-white font-heading tracking-tight">Nexora</h1>
            <p className="text-[10px] text-indigo-400 font-bold tracking-wider uppercase">Enterprise Workspace</p>
          </div>
        </div>

        {/* Workspace Nav Items */}
        <div className="px-3.5 py-4 space-y-1">
          <p className="px-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">
            Workspaces
          </p>

          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === '/app'}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'text-slate-400 hover:bg-slate-800/80 hover:text-white'
                  }`
                }
              >
                <Icon className="w-4 h-4 text-slate-400" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}

          {/* Admin Protected Employee Management Link */}
          {userRole === 'ADMIN' && (
            <div className="pt-4 mt-4 border-t border-slate-800">
              <p className="px-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                Administration
              </p>
              <NavLink
                to="/app/admin/employees"
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'text-indigo-400 hover:bg-slate-800 hover:text-indigo-300'
                  }`
                }
              >
                <Users className="w-4 h-4" />
                <span>Employee Directory & Roles</span>
              </NavLink>
            </div>
          )}
        </div>
      </div>

      {/* Footer Link to Landing Page */}
      <div className="p-4 border-t border-slate-800">
        <NavLink
          to="/"
          className="flex items-center justify-center gap-2 w-full py-2 px-3 rounded-xl bg-slate-800 text-xs font-semibold text-slate-300 hover:bg-slate-700 hover:text-white transition-colors border border-slate-700"
        >
          <Home className="w-4 h-4" />
          <span>Public Landing Page</span>
        </NavLink>
      </div>
    </aside>
  );
};
