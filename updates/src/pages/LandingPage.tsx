import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Sparkles,
  ArrowRight,
  Compass,
  Calendar,
  MessageSquare,
  GraduationCap,
  KanbanSquare,
  BarChart3,
  Bot,
  ShieldCheck,
  CheckCircle2,
  Cpu,
  Layers,
  Zap,
  Clock,
  ChevronRight,
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'meeting' | 'comm' | 'study' | 'projects' | 'analytics'>('meeting');

  const workspacePreviews = {
    meeting: {
      title: 'Meeting Workspace',
      intent: "Prepare for tomorrow's client meeting.",
      highlight: 'Prioritizes live agenda, client context, and 18ms latency SLA benchmarks.',
      badge: 'Client & Strategy Alignment',
    },
    comm: {
      title: 'Communication Workspace',
      intent: 'Summarize my unread messages.',
      highlight: 'Filters urgent inquiries and drafts executive-grade replies automatically.',
      badge: 'Inbox Triage & Tone Rewriting',
    },
    study: {
      title: 'Study Workspace',
      intent: 'Help me study operating systems.',
      highlight: 'Surfaces deadlock characterization, interactive flashcards, and diagnostic tests.',
      badge: 'Active Recall & Mastery',
    },
    projects: {
      title: 'Project Management',
      intent: 'Review overdue project tasks.',
      highlight: 'Isolates critical-path blockers, overdue sprints, and team capacity constraints.',
      badge: 'Kanban & Blocker Resolution',
    },
    analytics: {
      title: 'Data Analytics',
      intent: 'Investigate declining product usage.',
      highlight: 'Correlates 30-day telemetry trends and diagnoses mobile funnel dropoffs.',
      badge: 'Root-Cause Telemetry',
    },
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#172033] flex flex-col font-sans selection:bg-indigo-100 selection:text-indigo-900">
      {/* Navigation - Top Bar 3-Zone Contract */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
          {/* Zone 1: Wordmark Single Text Element */}
          <Link to="/" className="text-xl font-extrabold tracking-tight text-slate-950 whitespace-nowrap shrink-0">
            Nexora
          </Link>

          {/* Zone 2: 4 concise single-line text nav links */}
          <nav className="hidden md:flex items-center gap-7 text-xs font-semibold text-slate-600">
            <a href="#workspaces" className="hover:text-slate-950 transition-colors whitespace-nowrap shrink-0">Workspaces</a>
            <a href="#how-it-works" className="hover:text-slate-950 transition-colors whitespace-nowrap shrink-0">Adaptive Engine</a>
            <a href="#architecture" className="hover:text-slate-950 transition-colors whitespace-nowrap shrink-0">REST Architecture</a>
            <Link to="/login" className="hover:text-slate-950 transition-colors whitespace-nowrap shrink-0">Sign In</Link>
          </nav>

          {/* Zone 3: 1 primary action */}
          <div className="flex items-center gap-3 shrink-0">
            <Link
              to="/app"
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-950 hover:bg-indigo-950 text-white text-xs font-semibold rounded-lg shadow-xs transition-all active:scale-98 whitespace-nowrap shrink-0"
            >
              <span>Launch Workspace</span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-300" />
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-18 pb-20 overflow-hidden bg-white border-b border-slate-200/80 bg-grid-subtle">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center">
          {/* Unboxed Kicker Text - Zero-Pill Discipline */}
          <div className="flex items-center justify-center gap-2 text-xs font-semibold text-slate-500 mb-4 tracking-wide uppercase">
            <Compass className="w-3.5 h-3.5 text-indigo-600" />
            <span>Intent-to-Interface Technology</span>
            <span aria-hidden="true" className="text-slate-300">·</span>
            <span>Autonomous Workspace Alignment</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-950 tracking-tight leading-[1.12] max-w-4xl mx-auto text-balance">
            One Workspace.{' '}
            <span className="text-indigo-700">Every Possibility.</span>
          </h1>

          <p className="mt-5 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed text-balance">
            Meetings, communication, learning, projects, and analytics — unified in an intelligent workspace that reshapes itself around your current goal.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              to="/app"
              className="w-full sm:w-auto px-6 py-3 bg-slate-950 hover:bg-indigo-950 text-white font-semibold text-xs rounded-xl shadow-card transition-all flex items-center justify-center gap-2 active:scale-98"
            >
              <span>Open Adaptive Workspace</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <a
              href="#workspaces"
              className="w-full sm:w-auto px-6 py-3 bg-white hover:bg-slate-50 text-slate-800 font-semibold text-xs rounded-xl border border-slate-200 shadow-2xs transition-colors flex items-center justify-center gap-2"
            >
              <span>Explore All Workspaces</span>
            </a>
          </div>

          {/* Interactive Adaptive Demo Preview Window */}
          <div className="mt-14 max-w-5xl mx-auto bg-white rounded-2xl border border-slate-200/90 shadow-elevated overflow-hidden text-left">
            {/* Window Chrome */}
            <div className="h-10 bg-slate-900 text-slate-300 px-4 flex items-center justify-between text-xs font-mono">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-slate-700" />
                <span className="w-2.5 h-2.5 rounded-full bg-slate-700" />
                <span className="w-2.5 h-2.5 rounded-full bg-slate-700" />
                <span className="text-[11px] text-slate-400 font-sans ml-2">nexora.platform/adaptive-canvas</span>
              </div>
              <div className="text-[11px] text-indigo-300 hidden sm:block truncate max-w-md">
                Active Intent: "{workspacePreviews[activeTab].intent}"
              </div>
            </div>

            {/* Interactive Intent Switcher Toolbar */}
            <div className="p-3.5 sm:p-4 bg-slate-50/90 border-b border-slate-200 flex flex-wrap gap-2 items-center justify-between text-xs">
              <span className="font-semibold text-slate-500 uppercase tracking-wider text-[11px]">
                Simulate Goal:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {(['meeting', 'comm', 'study', 'projects', 'analytics'] as const).map((key) => (
                  <button
                    key={key}
                    onClick={() => setActiveTab(key)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      activeTab === key
                        ? 'bg-slate-950 text-white shadow-xs'
                        : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                    }`}
                  >
                    {key === 'meeting' && 'Client Meeting'}
                    {key === 'comm' && 'Inbox Triage'}
                    {key === 'study' && 'Study OS'}
                    {key === 'projects' && 'Overdue Tasks'}
                    {key === 'analytics' && 'Usage Dropoff'}
                  </button>
                ))}
              </div>
            </div>

            {/* Dynamic Preview Content */}
            <div className="p-6 bg-white space-y-4">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/90 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-xs text-indigo-700 font-semibold">
                    <span>{workspacePreviews[activeTab].badge}</span>
                    <span aria-hidden="true" className="text-slate-300">·</span>
                    <span className="text-slate-500 font-normal">Intent Evaluated</span>
                  </div>
                  <h3 className="text-base font-bold text-slate-950">
                    "{workspacePreviews[activeTab].intent}"
                  </h3>
                  <p className="text-xs text-slate-600">
                    {workspacePreviews[activeTab].highlight}
                  </p>
                </div>
                <button
                  onClick={() => navigate('/app')}
                  className="px-4 py-2 bg-slate-950 hover:bg-indigo-950 text-white text-xs font-semibold rounded-lg shrink-0 flex items-center gap-1.5 transition-colors self-start sm:self-auto"
                >
                  <span>Launch Workspace</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Grid Layout Preview */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50">
                  <span className="text-slate-400 font-medium block mb-1 text-[11px] uppercase tracking-wider">Prioritized Widget #1</span>
                  <span className="font-bold text-slate-900 block">
                    {activeTab === 'meeting' && 'Acme Rollout Agenda & Latency Benchmark'}
                    {activeTab === 'comm' && '3 Urgent Priority Messages Queue'}
                    {activeTab === 'study' && 'Deadlock & Memory Management Quiz'}
                    {activeTab === 'projects' && '2 Overdue Blocker Deliverables'}
                    {activeTab === 'analytics' && 'Active Users 30-Day Trendline'}
                  </span>
                </div>
                <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50">
                  <span className="text-slate-400 font-medium block mb-1 text-[11px] uppercase tracking-wider">Prioritized Widget #2</span>
                  <span className="font-bold text-slate-900 block">
                    {activeTab === 'meeting' && 'Client Context & 18ms SLA Agreement'}
                    {activeTab === 'comm' && 'Executive Tone Response Rewriter'}
                    {activeTab === 'study' && 'Active Recall Flashcards Deck'}
                    {activeTab === 'projects' && 'Sprint 24 Kanban Board'}
                    {activeTab === 'analytics' && 'Mobile Step 3 Dropoff Analysis'}
                  </span>
                </div>
                <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50">
                  <span className="text-slate-400 font-medium block mb-1 text-[11px] uppercase tracking-wider">Contextual Action</span>
                  <span className="font-bold text-indigo-700 block">
                    {activeTab === 'meeting' && 'Synthesize Executive Meeting Dossier'}
                    {activeTab === 'comm' && 'Draft 1-Click Executive Response'}
                    {activeTab === 'study' && 'Start Diagnostic Practice Exam'}
                    {activeTab === 'projects' && 'Rebalance Critical Path Blockers'}
                    {activeTab === 'analytics' && 'Filter Mobile Cohort Telemetry'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Section: 6 Workspaces */}
      <section id="workspaces" className="py-20 bg-white border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-600 mb-2">
              Comprehensive Domain Coverage
            </h2>
            <h3 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Six Purpose-Built Workspaces
            </h3>
            <p className="text-sm text-slate-600 mt-2">
              Each workspace provides specialized tooling, ready to adapt into the foreground when your workflow demands it.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* 1. Meeting Workspace */}
            <div className="p-6 rounded-2xl border border-slate-200 hover:border-indigo-300 hover:shadow-md transition-all bg-[#F8FAFC]/50 group">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 mb-4 group-hover:scale-110 transition-transform">
                <Calendar className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-slate-900 mb-2">Meeting Workspace</h4>
              <p className="text-xs text-slate-600 leading-relaxed mb-4">
                Prepare for high-stakes client reviews with live agendas, checklist tracking, attendee context, and automated AI synthesis from meeting notes.
              </p>
              <Link to="/app/meetings" className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 inline-flex items-center gap-1">
                <span>View Workspace</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* 2. Communication Workspace */}
            <div className="p-6 rounded-2xl border border-slate-200 hover:border-indigo-300 hover:shadow-md transition-all bg-[#F8FAFC]/50 group">
              <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 mb-4 group-hover:scale-110 transition-transform">
                <MessageSquare className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-slate-900 mb-2">Communication Workspace</h4>
              <p className="text-xs text-slate-600 leading-relaxed mb-4">
                Unified inbox triage, unread priority flags, thread summarization, and simulated tone rewriters to craft concise executive replies in seconds.
              </p>
              <Link to="/app/communication" className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 inline-flex items-center gap-1">
                <span>View Workspace</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* 3. Study Workspace */}
            <div className="p-6 rounded-2xl border border-slate-200 hover:border-indigo-300 hover:shadow-md transition-all bg-[#F8FAFC]/50 group">
              <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-100 flex items-center justify-center text-teal-600 mb-4 group-hover:scale-110 transition-transform">
                <GraduationCap className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-slate-900 mb-2">Study Workspace</h4>
              <p className="text-xs text-slate-600 leading-relaxed mb-4">
                Active recall curriculum for operating systems and cloud engineering with topic checklists, interactive flashcards, and instant-scoring quizzes.
              </p>
              <Link to="/app/study" className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 inline-flex items-center gap-1">
                <span>View Workspace</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* 4. Project Management */}
            <div className="p-6 rounded-2xl border border-slate-200 hover:border-indigo-300 hover:shadow-md transition-all bg-[#F8FAFC]/50 group">
              <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600 mb-4 group-hover:scale-110 transition-transform">
                <KanbanSquare className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-slate-900 mb-2">Project Management</h4>
              <p className="text-xs text-slate-600 leading-relaxed mb-4">
                Interactive Kanban boards across To Do, In Progress, and Done. Highlights overdue tasks, priority labels, assignee workloads, and critical blockers.
              </p>
              <Link to="/app/projects" className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 inline-flex items-center gap-1">
                <span>View Workspace</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* 5. Data Analytics */}
            <div className="p-6 rounded-2xl border border-slate-200 hover:border-indigo-300 hover:shadow-md transition-all bg-[#F8FAFC]/50 group">
              <div className="w-10 h-10 rounded-xl bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-600 mb-4 group-hover:scale-110 transition-transform">
                <BarChart3 className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-slate-900 mb-2">Data Analytics</h4>
              <p className="text-xs text-slate-600 leading-relaxed mb-4">
                Explore revenue trajectories, active user cohorts, conversion funnels, and automated AI root-cause insight cards with interactive Recharts.
              </p>
              <Link to="/app/analytics" className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 inline-flex items-center gap-1">
                <span>View Workspace</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* 6. AI Assistant */}
            <div className="p-6 rounded-2xl border border-slate-200 hover:border-indigo-300 hover:shadow-md transition-all bg-[#F8FAFC]/50 group">
              <div className="w-10 h-10 rounded-xl bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-600 mb-4 group-hover:scale-110 transition-transform">
                <Bot className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-slate-900 mb-2">AI Assistant</h4>
              <p className="text-xs text-slate-600 leading-relaxed mb-4">
                Intent-aware conversational partner available full-screen or as a persistent slide-over drawer to trigger immediate workspace reshaping.
              </p>
              <Link to="/app/assistant" className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 inline-flex items-center gap-1">
                <span>View Workspace</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* How Nexora Works */}
      <section id="how-it-works" className="py-20 bg-slate-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-600 mb-2">
              Intent-to-Interface Methodology
            </h2>
            <h3 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              How Nexora Reshapes Itself
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-xs">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs relative">
              <span className="w-6 h-6 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center text-[11px] mb-3">
                1
              </span>
              <h4 className="font-bold text-slate-900 text-sm mb-1">State Your Intent</h4>
              <p className="text-slate-600">
                Type what you need in natural language or click a quick prompt like "Prepare for tomorrow's client meeting."
              </p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs relative">
              <span className="w-6 h-6 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center text-[11px] mb-3">
                2
              </span>
              <h4 className="font-bold text-slate-900 text-sm mb-1">Classify & Route</h4>
              <p className="text-slate-600">
                The zero-latency classifier categorizes intent, weights confidence, and selects the matching workspace.
              </p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs relative">
              <span className="w-6 h-6 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center text-[11px] mb-3">
                3
              </span>
              <h4 className="font-bold text-slate-900 text-sm mb-1">Reorder Widgets</h4>
              <p className="text-slate-600">
                Irrelevant widgets hide while high-impact cards (agendas, blockers, quizzes) are prioritized at the top.
              </p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs relative">
              <span className="w-6 h-6 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center text-[11px] mb-3">
                4
              </span>
              <h4 className="font-bold text-slate-900 text-sm mb-1">Explain Rationale</h4>
              <p className="text-slate-600">
                The "Why this workspace?" panel gives transparent rationale and suggests immediate next actions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Architecture & Backend Readiness Section */}
      <section id="security" className="py-16 bg-white border-t border-slate-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="bg-gradient-to-br from-slate-900 to-indigo-950 text-white rounded-3xl p-8 sm:p-12 shadow-xl flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="space-y-4 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-indigo-300 text-xs font-medium">
                <Cpu className="w-3.5 h-3.5 text-indigo-400" />
                <span>Spring Boot REST Architecture</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                Designed for High-Performance Enterprise Backend Integration
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Nexora’s frontend features a decoupled API client layer pre-configured for Java Spring Boot REST microservices. Fallback mock handlers guarantee immediate offline execution, while standard HTTP interceptors provide bearer token authentication and OpenAPI contract parity.
              </p>
              <div className="flex flex-wrap gap-4 pt-2 text-xs text-indigo-200">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Fully decoupled mock service providers
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Typed Axios request & response DTOs
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" /> VITE_API_BASE_URL configuration
                </span>
              </div>
            </div>

            <div className="shrink-0">
              <Link
                to="/app"
                className="px-6 py-3.5 bg-indigo-500 hover:bg-indigo-600 text-white font-semibold text-xs rounded-xl shadow-lg transition-all inline-flex items-center gap-2"
              >
                <span>Enter Live Application</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-50 border-t border-slate-200 py-10 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold text-xs">
              <Sparkles className="w-3.5 h-3.5" />
            </div>
            <span className="font-bold text-slate-800">Nexora Platform</span>
            <span>— Your Intent. Your Workspace.</span>
          </div>

          <div className="flex items-center gap-6">
            <Link to="/login" className="hover:text-slate-800">Sign In</Link>
            <Link to="/register" className="hover:text-slate-800">Register</Link>
            <Link to="/app" className="hover:text-slate-800">Dashboard</Link>
            <Link to="/app/settings" className="hover:text-slate-800">API Config</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};
