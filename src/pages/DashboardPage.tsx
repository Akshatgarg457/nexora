import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useWorkspace } from '../context/WorkspaceContext';
import {
  Calendar,
  MessageSquare,
  GraduationCap,
  KanbanSquare,
  BarChart3,
  Bot,
  Clock,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  TrendingUp,
  Sparkles,
  ChevronRight,
  Flame,
  Layers,
} from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    currentUser,
    meetings,
    messages,
    tasks,
    courses,
    adaptWorkspace,
  } = useWorkspace();

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  const unreadMessagesCount = messages.filter((m) => !m.isRead).length;
  const overdueTasksCount = tasks.filter((t) => t.isOverdue).length;
  const todayMeetings = meetings.filter((m) => m.isToday);
  const activeCourse = courses[0];

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-indigo-600 uppercase tracking-wider mb-1">
            <Sparkles className="w-4 h-4 text-indigo-500" />
            <span>Unified Intelligence Center</span>
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Welcome back, {currentUser.name}
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Today is <span className="font-medium text-slate-700">{today}</span>. Nexora is standing by to adapt around your goals.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => adaptWorkspace("Prepare for tomorrow's client meeting.")}
            className="px-3.5 py-2 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-medium border border-indigo-200 transition-colors flex items-center gap-1.5"
          >
            <Calendar className="w-3.5 h-3.5 text-indigo-600" />
            <span>Prep Meeting</span>
          </button>
          <button
            onClick={() => adaptWorkspace('Review overdue project tasks.')}
            className="px-3.5 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 text-xs font-medium border border-amber-200 transition-colors flex items-center gap-1.5"
          >
            <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
            <span>Triage Blockers</span>
          </button>
        </div>
      </div>

      {/* Quick Statistics Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div
          onClick={() => navigate('/app/meetings')}
          className="bg-white p-5 rounded-2xl border border-slate-200/90 hover:border-slate-400 hover:shadow-card transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider text-[11px]">Today's Meetings</span>
            <div className="p-2 rounded-xl bg-slate-100 text-slate-900 group-hover:scale-105 transition-transform">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-950 font-mono tabular-nums">{todayMeetings.length}</span>
            <span className="text-xs text-slate-400">sessions</span>
          </div>
          <div className="text-xs text-slate-600 font-medium mt-2 flex items-center gap-1.5">
            <span>Next: 10:00 AM</span>
            <span aria-hidden="true" className="text-slate-300">·</span>
            <span className="text-slate-900 font-semibold truncate">Acme Corp</span>
          </div>
        </div>

        <div
          onClick={() => navigate('/app/communication')}
          className="bg-white p-5 rounded-2xl border border-slate-200/90 hover:border-slate-400 hover:shadow-card transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider text-[11px]">Priority Inbox</span>
            <div className="p-2 rounded-xl bg-slate-100 text-slate-900 group-hover:scale-105 transition-transform">
              <MessageSquare className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-950 font-mono tabular-nums">{unreadMessagesCount}</span>
            <span className="text-xs text-rose-600 font-semibold">1 urgent</span>
          </div>
          <div className="text-xs text-slate-600 font-medium mt-2 flex items-center gap-1.5 truncate">
            <span>David Vance</span>
            <span aria-hidden="true" className="text-slate-300">·</span>
            <span className="text-slate-500 truncate">DR topology request</span>
          </div>
        </div>

        <div
          onClick={() => navigate('/app/projects')}
          className="bg-white p-5 rounded-2xl border border-slate-200/90 hover:border-slate-400 hover:shadow-card transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider text-[11px]">Sprint Deliverables</span>
            <div className="p-2 rounded-xl bg-slate-100 text-slate-900 group-hover:scale-105 transition-transform">
              <KanbanSquare className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-950 font-mono tabular-nums">{tasks.length}</span>
            <span className="text-xs text-amber-700 font-semibold">{overdueTasksCount} overdue</span>
          </div>
          <div className="text-xs text-slate-600 font-medium mt-2 flex items-center gap-1.5 truncate">
            <span>Frankfurt latency</span>
            <span aria-hidden="true" className="text-slate-300">·</span>
            <span className="text-amber-700 font-semibold">Blocker</span>
          </div>
        </div>

        <div
          onClick={() => navigate('/app/study')}
          className="bg-white p-5 rounded-2xl border border-slate-200/90 hover:border-slate-400 hover:shadow-card transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider text-[11px]">Active Study Streak</span>
            <div className="p-2 rounded-xl bg-slate-100 text-slate-900 group-hover:scale-105 transition-transform">
              <Flame className="w-4 h-4 text-amber-500" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-950 font-mono tabular-nums">{activeCourse.streakDays}</span>
            <span className="text-xs text-slate-400">days active</span>
          </div>
          <div className="text-xs text-slate-600 font-medium mt-2 flex items-center gap-1.5">
            <span className="font-mono tabular-nums font-semibold text-teal-700">{activeCourse.progressPercent}%</span>
            <span aria-hidden="true" className="text-slate-300">·</span>
            <span className="text-slate-600">OS Architecture</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Upcoming Schedule & Priority Tasks */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upcoming Meetings (2 Cols) */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-indigo-600" />
              <h3 className="text-sm font-bold text-slate-900">Today's Schedule</h3>
            </div>
            <button
              onClick={() => navigate('/app/meetings')}
              className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold flex items-center gap-1"
            >
              <span>Open Meetings Workspace</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {todayMeetings.map((m) => (
              <div
                key={m.id}
                onClick={() => navigate('/app/meetings')}
                className="p-3.5 rounded-xl border border-slate-200 hover:border-indigo-300 hover:bg-slate-50/60 transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700">
                      {m.time}
                    </span>
                    <span className="text-xs font-semibold text-slate-800">{m.company}</span>
                  </div>
                  <h4 className="text-xs font-medium text-slate-700 mt-1">{m.title}</h4>
                  <div className="flex items-center gap-3 mt-1 text-[11px] text-slate-400">
                    <span>Lead: {m.client}</span>
                    <span>•</span>
                    <span>{m.agenda.length} agenda topics</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      adaptWorkspace(`Prepare for ${m.company} meeting`);
                    }}
                    className="px-2.5 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-medium shadow-xs"
                  >
                    Adapt Focus
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Overdue / High Priority Tasks (1 Col) */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <KanbanSquare className="w-4 h-4 text-amber-500" />
              <h3 className="text-sm font-bold text-slate-900">Critical Action Items</h3>
            </div>
            <button
              onClick={() => navigate('/app/projects')}
              className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold flex items-center gap-1"
            >
              <span>Kanban</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-2.5">
            {tasks.slice(0, 3).map((t) => (
              <div
                key={t.id}
                onClick={() => navigate('/app/projects')}
                className={`p-3 rounded-xl border text-xs cursor-pointer transition-all ${
                  t.isOverdue
                    ? 'border-rose-200 bg-rose-50/40'
                    : 'border-slate-200 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <span className="font-semibold text-slate-800 leading-snug">{t.title}</span>
                  {t.isOverdue && (
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-700 shrink-0">
                      Overdue
                    </span>
                  )}
                </div>
                <div className="flex items-center justify-between mt-2 text-[11px] text-slate-400">
                  <span>{t.projectName}</span>
                  <span className="font-medium text-slate-600">{t.assignee.name}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Workspace Quick Launchers */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
          Explore Workspaces
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <button
            onClick={() => navigate('/app/meetings')}
            className="p-3 rounded-xl border border-slate-200 hover:border-indigo-400 hover:bg-indigo-50/30 transition-all text-left group"
          >
            <Calendar className="w-5 h-5 text-indigo-600 mb-2 group-hover:scale-105 transition-transform" />
            <span className="text-xs font-bold text-slate-900 block">Meetings</span>
            <span className="text-[10px] text-slate-400">Agendas & Notes</span>
          </button>

          <button
            onClick={() => navigate('/app/communication')}
            className="p-3 rounded-xl border border-slate-200 hover:border-blue-400 hover:bg-blue-50/30 transition-all text-left group"
          >
            <MessageSquare className="w-5 h-5 text-blue-600 mb-2 group-hover:scale-105 transition-transform" />
            <span className="text-xs font-bold text-slate-900 block">Communication</span>
            <span className="text-[10px] text-slate-400">Triage & Replies</span>
          </button>

          <button
            onClick={() => navigate('/app/study')}
            className="p-3 rounded-xl border border-slate-200 hover:border-teal-400 hover:bg-teal-50/30 transition-all text-left group"
          >
            <GraduationCap className="w-5 h-5 text-teal-600 mb-2 group-hover:scale-105 transition-transform" />
            <span className="text-xs font-bold text-slate-900 block">Study Center</span>
            <span className="text-[10px] text-slate-400">Quizzes & Flashcards</span>
          </button>

          <button
            onClick={() => navigate('/app/projects')}
            className="p-3 rounded-xl border border-slate-200 hover:border-amber-400 hover:bg-amber-50/30 transition-all text-left group"
          >
            <KanbanSquare className="w-5 h-5 text-amber-600 mb-2 group-hover:scale-110 transition-transform" />
            <span className="text-xs font-bold text-slate-900 block">Projects</span>
            <span className="text-[10px] text-slate-400">Kanban & Sprints</span>
          </button>

          <button
            onClick={() => navigate('/app/analytics')}
            className="p-3 rounded-xl border border-slate-200 hover:border-purple-400 hover:bg-purple-50/30 transition-all text-left group"
          >
            <BarChart3 className="w-5 h-5 text-purple-600 mb-2 group-hover:scale-105 transition-transform" />
            <span className="text-xs font-bold text-slate-900 block">Analytics</span>
            <span className="text-[10px] text-slate-400">Metrics & Funnels</span>
          </button>

          <button
            onClick={() => navigate('/app/assistant')}
            className="p-3 rounded-xl border border-slate-200 hover:border-rose-400 hover:bg-rose-50/30 transition-all text-left group"
          >
            <Bot className="w-5 h-5 text-rose-600 mb-2 group-hover:scale-105 transition-transform" />
            <span className="text-xs font-bold text-slate-900 block">AI Assistant</span>
            <span className="text-[10px] text-slate-400">Agent Chat</span>
          </button>
        </div>
      </div>
    </div>
  );
};
