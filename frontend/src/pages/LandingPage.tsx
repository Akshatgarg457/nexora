import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Hexagon,
  Calendar,
  MessageSquare,
  BookOpen,
  Briefcase,
  BarChart3,
  Sparkles,
  ArrowRight,
  Shield,
  Zap,
  Sliders,
  CheckCircle2,
  ChevronRight
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  const workspaces = [
    {
      title: 'Meeting Workspace',
      description: 'Schedule company meetings, invite team members from the directory, track agendas, and maintain notes.',
      icon: Calendar,
      tag: 'Collaboration'
    },
    {
      title: 'Communication Workspace',
      description: 'Direct messaging thread between employees with status indicators and message history.',
      icon: MessageSquare,
      tag: 'Direct Messaging'
    },
    {
      title: 'Study Workspace',
      description: 'Discover emerging technology paths (AI Agents, Spring Boot, Cloud, Cybersecurity) with video notes and AI summaries.',
      icon: BookOpen,
      tag: 'Tech Growth'
    },
    {
      title: 'Project Management Workspace',
      description: 'Manage projects, track tasks (TODO, In Progress, Done), assign deadlines, and submit progress reports.',
      icon: Briefcase,
      tag: 'Task Execution'
    },
    {
      title: 'Data Analytics Workspace',
      description: 'Real-time company metrics, project completion charts, task status distribution, and performance insights.',
      icon: BarChart3,
      tag: 'Business KPIs'
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* Header / Nav */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200 px-8 py-4 flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-900/30">
            <Hexagon className="w-5 h-5 fill-indigo-600 text-white stroke-[2.5]" />
          </div>
          <span className="text-xl font-extrabold font-heading tracking-tight text-slate-900">Nexora</span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/login')}
            className="px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded-xl transition-colors border border-slate-200"
          >
            Sign In
          </button>
          <button
            onClick={() => navigate('/app')}
            className="px-5 py-2 text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-md transition-all flex items-center gap-1.5"
          >
            <span>Get Started</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-6 max-w-5xl mx-auto text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 text-xs font-bold text-indigo-900">
          <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
          <span>Unified Enterprise Workspace Platform</span>
        </div>

        <h1 className="text-4xl md:text-6xl font-extrabold font-heading text-slate-900 tracking-tight leading-tight">
          Your Workspace, <span className="text-indigo-600">Your Way.</span>
        </h1>

        <p className="text-base md:text-lg text-slate-600 max-w-3xl mx-auto leading-relaxed">
          Nexora unifies <strong>Meetings, Direct Messaging, Technology Learning, Project Tracking,</strong> and <strong>Business Analytics</strong> into one intelligent, adaptive company environment.
        </p>

        <div className="pt-4 flex flex-wrap justify-center gap-4">
          <button
            onClick={() => navigate('/app')}
            className="px-8 py-3.5 text-sm font-bold bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-xl shadow-indigo-500/20 hover:scale-105 transition-all flex items-center gap-2"
          >
            <span>Get Started</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            onClick={() => navigate('/login')}
            className="px-8 py-3.5 text-sm font-bold bg-white text-slate-800 border border-slate-200 rounded-xl shadow-xs hover:bg-slate-50 transition-colors"
          >
            Sign In
          </button>
        </div>

        {/* Feature Highlights Grid */}
        <div className="pt-12 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto text-left">
          <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs">
            <Sliders className="w-5 h-5 text-indigo-600 mb-2" />
            <h4 className="text-xs font-bold text-slate-900">Adaptive Workspace</h4>
            <p className="text-[11px] text-slate-500">Personalize dashboard cards with natural language</p>
          </div>
          <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs">
            <Bot className="w-5 h-5 text-indigo-600 mb-2" />
            <h4 className="text-xs font-bold text-slate-900">AI Assistant</h4>
            <p className="text-[11px] text-slate-500">Isolated assistant service for workspace queries</p>
          </div>
          <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs">
            <Shield className="w-5 h-5 text-indigo-600 mb-2" />
            <h4 className="text-xs font-bold text-slate-900">RBAC Security</h4>
            <p className="text-[11px] text-slate-500">Spring Security & JWT authority enforcement</p>
          </div>
          <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs">
            <Zap className="w-5 h-5 text-indigo-600 mb-2" />
            <h4 className="text-xs font-bold text-slate-900">Enterprise Database</h4>
            <p className="text-[11px] text-slate-500">MySQL integration with JPA Hibernate updates</p>
          </div>
        </div>
      </section>

      {/* 5 Workspaces Preview Section */}
      <section className="py-16 px-6 max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold font-heading text-slate-900">
            Five Workspaces Integrated Into One Platform
          </h2>
          <p className="text-xs text-slate-500 mt-2">Designed for corporate productivity and team execution.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {workspaces.map((ws, index) => {
            const Icon = ws.icon;
            return (
              <div
                key={index}
                className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs hover:shadow-md hover:border-indigo-300 transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                      {ws.tag}
                    </span>
                  </div>
                  <h3 className="text-base font-bold font-heading text-slate-900 mb-2">{ws.title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">{ws.description}</p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-indigo-600">
                  <span>Explore Workspace</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-slate-200 text-center text-xs text-slate-500">
        <p>Nexora — Enterprise Adaptive Company Workspace Platform • Powered by Spring Boot & React</p>
      </footer>
    </div>
  );
};

function Bot(props: any) {
  return (
    <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
      <rect x="3" y="11" width="18" height="10" rx="2" />
      <circle cx="12" cy="5" r="2" />
      <path d="M12 7v4" />
      <line x1="8" y1="15" x2="8" y2="15.01" />
      <line x1="16" y1="15" x2="16" y2="15.01" />
    </svg>
  );
}
