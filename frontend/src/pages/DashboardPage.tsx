import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AdaptiveCustomizer } from '../components/AdaptiveCustomizer';
import { meetingsApi, projectsApi, studyApi, analyticsApi } from '../services/api';
import { Meeting, Project, LearningProgress, AnalyticsSummary } from '../types';
import {
  Calendar,
  Briefcase,
  BookOpen,
  MessageSquare,
  BarChart3,
  ArrowRight,
  Clock,
  TrendingUp
} from 'lucide-react';

export const DashboardPage: React.FC<{ employeeId?: number }> = ({ employeeId }) => {
  const [workspaceOrder, setWorkspaceOrder] = useState<string[]>([
    'PROJECTS',
    'STUDY',
    'MEETINGS',
    'COMMUNICATION',
    'ANALYTICS'
  ]);
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [learning, setLearning] = useState<LearningProgress[]>([]);
  const [analytics, setAnalytics] = useState<AnalyticsSummary | null>(null);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [m, p, l, a] = await Promise.allSettled([
          meetingsApi.getAll(),
          projectsApi.getAll(),
          studyApi.getProgress(employeeId || 1),
          analyticsApi.getSummary()
        ]);

        if (m.status === 'fulfilled') setMeetings(m.value);
        if (p.status === 'fulfilled') setProjects(p.value);
        if (l.status === 'fulfilled') setLearning(l.value);
        if (a.status === 'fulfilled') setAnalytics(a.value);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [employeeId]);

  const handleCustomized = (newOrder: string[]) => {
    setWorkspaceOrder(newOrder);
  };

  const renderCard = (key: string) => {
    switch (key) {
      case 'MEETINGS':
        return (
          <div key="MEETINGS" className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs hover:shadow-md transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold font-heading text-slate-900">Upcoming Meetings</h3>
                  <p className="text-[10px] text-slate-500">Scheduled syncs & agendas</p>
                </div>
              </div>
              <button onClick={() => navigate('/app/meetings')} className="text-xs text-indigo-600 font-semibold hover:underline flex items-center gap-1">
                View All <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            <div className="space-y-3">
              {meetings.slice(0, 2).map((m) => (
                <div key={m.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200/60 flex items-start justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">{m.title}</h4>
                    <p className="text-[11px] text-slate-500 mt-0.5">{m.date} at {m.time} • {m.location}</p>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 font-bold border border-indigo-100">
                    {m.status}
                  </span>
                </div>
              ))}
              {meetings.length === 0 && <p className="text-xs text-slate-400 py-2">No meetings found.</p>}
            </div>
          </div>
        );

      case 'COMMUNICATION':
        return (
          <div key="COMMUNICATION" className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs hover:shadow-md transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold font-heading text-slate-900">Communication</h3>
                  <p className="text-[10px] text-slate-500">Employee Directory & Direct Chat</p>
                </div>
              </div>
              <button onClick={() => navigate('/app/communication')} className="text-xs text-indigo-600 font-semibold hover:underline flex items-center gap-1">
                Open Chat <ArrowRight className="w-3 h-3" />
              </button>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Connect directly with colleagues across Engineering, Executive, Product, and AI teams.
            </p>
            <div className="mt-4 p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-700">Active Directory: 4 Teammates</span>
              <span className="text-[10px] bg-emerald-600 text-white px-2 py-0.5 rounded-full font-bold">Online</span>
            </div>
          </div>
        );

      case 'STUDY':
        return (
          <div key="STUDY" className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs hover:shadow-md transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold font-heading text-slate-900">Study & Technology Learning</h3>
                  <p className="text-[10px] text-slate-500">Emerging tech paths & notes</p>
                </div>
              </div>
              <button onClick={() => navigate('/app/study')} className="text-xs text-indigo-600 font-semibold hover:underline flex items-center gap-1">
                Start Path <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            <div className="space-y-3">
              {learning.slice(0, 2).map((lp) => (
                <div key={lp.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200/60">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-900">
                    <span>{lp.resource.title}</span>
                    <span className="text-indigo-600 font-semibold">{lp.progressPercentage}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-200 rounded-full mt-2 overflow-hidden">
                    <div className="h-full bg-indigo-600" style={{ width: `${lp.progressPercentage}%` }}></div>
                  </div>
                </div>
              ))}
              {learning.length === 0 && <p className="text-xs text-slate-400 py-2">Explore tech resources to track progress.</p>}
            </div>
          </div>
        );

      case 'PROJECTS':
        return (
          <div key="PROJECTS" className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs hover:shadow-md transition-all col-span-1 md:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600">
                  <Briefcase className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold font-heading text-slate-900">Project Management & Tasks</h3>
                  <p className="text-[10px] text-slate-500">Active projects & completion status</p>
                </div>
              </div>
              <button onClick={() => navigate('/app/projects')} className="text-xs text-indigo-600 font-semibold hover:underline flex items-center gap-1">
                Manage Projects <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {projects.slice(0, 2).map((p) => (
                <div key={p.id} className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-900">{p.name}</span>
                    <span className="text-[10px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                      {p.status}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600 line-clamp-2">{p.description}</p>
                  <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                    <span>Progress: <strong>{p.completionPercentage}%</strong></span>
                    <span>Manager: <strong>{p.manager?.name}</strong></span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'ANALYTICS':
        return (
          <div key="ANALYTICS" className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs hover:shadow-md transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600">
                  <BarChart3 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold font-heading text-slate-900">Data Analytics & KPIs</h3>
                  <p className="text-[10px] text-slate-500">Real-time business performance</p>
                </div>
              </div>
              <button onClick={() => navigate('/app/analytics')} className="text-xs text-indigo-600 font-semibold hover:underline flex items-center gap-1">
                View Charts <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2 text-center text-xs">
              <div className="p-3 bg-indigo-50 rounded-xl border border-indigo-100">
                <p className="text-lg font-bold text-indigo-900">{analytics ? `${analytics.taskCompletionRate}%` : '78.5%'}</p>
                <p className="text-[10px] text-slate-600 font-medium">Task Completion</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <p className="text-lg font-bold text-slate-900">{analytics ? analytics.activeProjectsCount : 3}</p>
                <p className="text-[10px] text-slate-600 font-medium">Active Projects</p>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h2 className="text-2xl font-bold font-heading text-slate-900">
            Nexora Dashboard
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">Unified enterprise company workspace</p>
        </div>
        <div className="px-3.5 py-1.5 bg-slate-100 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700">
          Enterprise SaaS UI • Spring Boot + MySQL
        </div>
      </div>

      {/* Natural Language Adaptive Customizer */}
      <AdaptiveCustomizer employeeId={employeeId} onCustomized={handleCustomized} />

      {/* Dynamic Grid Reordered by Preference */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {workspaceOrder.map((key) => renderCard(key))}
      </div>
    </div>
  );
};
