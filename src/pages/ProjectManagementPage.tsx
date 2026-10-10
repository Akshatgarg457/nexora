import React, { useState } from 'react';
import { useWorkspace } from '../context/WorkspaceContext';
import {
  KanbanSquare,
  Plus,
  AlertTriangle,
  Clock,
  User,
  CheckCircle2,
  Filter,
  Search,
  ArrowRight,
  ShieldAlert,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';
import { ProjectTask, TaskStatus, PriorityLevel } from '../types';
import { initialTeamMembers } from '../mocks/projects';
import { Avatar } from '../components/ui/Avatar';

export const ProjectManagementPage: React.FC = () => {
  const {
    projects,
    tasks,
    updateTaskStatus,
    updateTaskPriority,
    addTask,
    activeAdaptiveConfig,
  } = useWorkspace();

  const [searchFilter, setSearchFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [isCreateTaskOpen, setIsCreateTaskOpen] = useState(false);

  // New task form state
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDesc, setTaskDesc] = useState('');
  const [taskProject, setTaskProject] = useState(projects[0].id);
  const [taskPriority, setTaskPriority] = useState<PriorityLevel>('high');
  const [taskAssignee, setTaskAssignee] = useState(initialTeamMembers[0].id);
  const [taskDueDate, setTaskDueDate] = useState('2026-10-18');

  // Filter tasks
  const filteredTasks = tasks.filter((t) => {
    if (priorityFilter !== 'all' && t.priority !== priorityFilter) return false;
    if (searchFilter) {
      const q = searchFilter.toLowerCase();
      return (
        t.title.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q) ||
        t.projectName.toLowerCase().includes(q) ||
        t.assignee.name.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const todoTasks = filteredTasks.filter((t) => t.status === 'todo');
  const inProgressTasks = filteredTasks.filter((t) => t.status === 'in_progress');
  const doneTasks = filteredTasks.filter((t) => t.status === 'done');
  const overdueTasks = tasks.filter((t) => t.isOverdue);

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskTitle.trim()) return;

    const proj = projects.find((p) => p.id === taskProject) || projects[0];
    const assignee = initialTeamMembers.find((m) => m.id === taskAssignee) || initialTeamMembers[0];

    const newTask: ProjectTask = {
      id: `task-${Date.now()}`,
      title: taskTitle,
      description: taskDesc,
      projectId: proj.id,
      projectName: proj.name,
      status: 'todo',
      priority: taskPriority,
      assignee,
      dueDate: taskDueDate,
      isOverdue: false,
      tags: ['Engineering', 'Sprint 24'],
    };

    addTask(newTask);
    setIsCreateTaskOpen(false);
    setTaskTitle('');
    setTaskDesc('');
  };

  const getPriorityBadge = (p: PriorityLevel) => {
    switch (p) {
      case 'urgent':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-700">Urgent</span>;
      case 'high':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800">High</span>;
      case 'medium':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-700">Medium</span>;
      default:
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-600">Low</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold text-amber-600 uppercase tracking-wider block mb-1">
            Project Management
          </span>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Sprint Kanban & Blocker Triage
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Orchestrate deliverables across teams, balance workloads, and unblock overdue critical paths.
          </p>
        </div>

        <button
          onClick={() => setIsCreateTaskOpen(true)}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Task</span>
        </button>
      </div>

      {/* Critical Overdue Blockers Warning Banner (Crucial for Scenario 4) */}
      {overdueTasks.length > 0 && (
        <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 sm:p-5 shadow-xs animate-in fade-in">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-rose-600 shrink-0" />
              <div>
                <h3 className="text-xs font-bold text-rose-900 uppercase tracking-wider">
                  Critical Overdue Deliverables ({overdueTasks.length})
                </h3>
                <p className="text-xs text-rose-700">
                  Tasks requiring immediate unblocking to prevent enterprise milestone slippage.
                </p>
              </div>
            </div>
            <button
              onClick={() => setPriorityFilter('urgent')}
              className="text-xs font-semibold text-rose-700 hover:text-rose-900 bg-rose-100/70 hover:bg-rose-100 px-3 py-1.5 rounded-lg transition-colors"
            >
              Filter Urgent Only
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            {overdueTasks.map((ot) => (
              <div
                key={ot.id}
                className="bg-white p-3.5 rounded-xl border border-rose-200 flex flex-col justify-between shadow-2xs"
              >
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-slate-900">{ot.title}</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-700">
                      Due: {ot.dueDate}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 mb-2">{ot.description}</p>
                  {ot.blockerNotes && (
                    <div className="p-2 rounded bg-amber-50 border border-amber-200 text-[11px] text-amber-900 font-medium">
                      ⚠️ Blocker: {ot.blockerNotes}
                    </div>
                  )}
                </div>

                <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                  <span className="text-slate-500">
                    Assignee: <strong>{ot.assignee.name}</strong>
                  </span>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => updateTaskStatus(ot.id, 'in_progress')}
                      className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded font-medium"
                    >
                      In Progress
                    </button>
                    <button
                      onClick={() => updateTaskStatus(ot.id, 'done')}
                      className="px-2 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded font-medium"
                    >
                      Mark Done
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-3.5 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 flex-1 max-w-sm">
          <Search className="w-4 h-4 text-slate-400 shrink-0" />
          <input
            type="text"
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            placeholder="Search tasks by name, assignee..."
            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-slate-400 font-medium">Priority:</span>
          {['all', 'urgent', 'high', 'medium'].map((p) => (
            <button
              key={p}
              onClick={() => setPriorityFilter(p)}
              className={`px-3 py-1 rounded-lg capitalize font-medium transition-colors ${
                priorityFilter === p
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Kanban Board Columns: To Do, In Progress, Done */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* TO DO COLUMN */}
        <div className="bg-slate-100/70 rounded-2xl p-4 border border-slate-200/80 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-slate-400" />
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                To Do ({todoTasks.length})
              </h3>
            </div>
            <button
              onClick={() => setIsCreateTaskOpen(true)}
              className="p-1 text-slate-400 hover:text-slate-700 hover:bg-white rounded"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {todoTasks.map((t) => (
              <div
                key={t.id}
                className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs text-xs space-y-2 hover:border-indigo-300 transition-all"
              >
                <div className="flex items-start justify-between gap-2">
                  <span className="font-bold text-slate-900 leading-snug">{t.title}</span>
                  {getPriorityBadge(t.priority)}
                </div>
                <p className="text-[11px] text-slate-500 line-clamp-2">{t.description}</p>
                <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-[11px]">
                  <div className="flex items-center gap-1.5 text-slate-600">
                    <Avatar name={t.assignee.name} size="xs" />
                    <span className="truncate max-w-[85px] font-medium">{t.assignee.name}</span>
                  </div>
                  <button
                    onClick={() => updateTaskStatus(t.id, 'in_progress')}
                    className="text-indigo-600 hover:text-indigo-800 font-semibold flex items-center gap-0.5"
                  >
                    <span>Start</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* IN PROGRESS COLUMN */}
        <div className="bg-indigo-50/40 rounded-2xl p-4 border border-indigo-100 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-indigo-100">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
              <h3 className="text-xs font-bold text-indigo-900 uppercase tracking-wider">
                In Progress ({inProgressTasks.length})
              </h3>
            </div>
          </div>

          <div className="space-y-3">
            {inProgressTasks.map((t) => (
              <div
                key={t.id}
                className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs text-xs space-y-2 hover:border-indigo-300 transition-all"
              >
                <div className="flex items-start justify-between gap-2">
                  <span className="font-bold text-slate-900 leading-snug">{t.title}</span>
                  {getPriorityBadge(t.priority)}
                </div>
                <p className="text-[11px] text-slate-500 line-clamp-2">{t.description}</p>

                {t.blockerNotes && (
                  <div className="p-1.5 rounded bg-amber-50 text-[10px] text-amber-900 border border-amber-200">
                    ⚠️ {t.blockerNotes}
                  </div>
                )}

                <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-[11px]">
                  <div className="flex items-center gap-1.5 text-slate-600">
                    <Avatar name={t.assignee.name} size="xs" />
                    <span className="truncate max-w-[85px] font-medium">{t.assignee.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateTaskStatus(t.id, 'todo')}
                      className="text-slate-400 hover:text-slate-600 text-[10px]"
                    >
                      Back
                    </button>
                    <button
                      onClick={() => updateTaskStatus(t.id, 'done')}
                      className="px-2 py-0.5 bg-emerald-600 text-white rounded font-medium text-[10px] hover:bg-emerald-700"
                    >
                      Done
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* DONE COLUMN */}
        <div className="bg-emerald-50/30 rounded-2xl p-4 border border-emerald-100 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-emerald-100">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <h3 className="text-xs font-bold text-emerald-900 uppercase tracking-wider">
                Done ({doneTasks.length})
              </h3>
            </div>
          </div>

          <div className="space-y-3">
            {doneTasks.map((t) => (
              <div
                key={t.id}
                className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs text-xs space-y-2 opacity-85 hover:opacity-100 transition-opacity"
              >
                <div className="flex items-start justify-between gap-2">
                  <span className="font-bold text-slate-900 leading-snug line-through text-slate-500">
                    {t.title}
                  </span>
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-[11px] text-slate-400">
                  <span>{t.projectName}</span>
                  <button
                    onClick={() => updateTaskStatus(t.id, 'in_progress')}
                    className="text-slate-500 hover:text-slate-700 text-[10px]"
                  >
                    Reopen
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Create Task Modal */}
      {isCreateTaskOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-md w-full p-6 animate-in fade-in duration-150">
            <h3 className="text-base font-bold text-slate-900 mb-1">Create Kanban Task</h3>
            <p className="text-xs text-slate-500 mb-4">
              Add task deliverables, set priority, and designate team assignees.
            </p>

            <form onSubmit={handleCreateTask} className="space-y-3.5 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Task Title</label>
                <input
                  type="text"
                  required
                  value={taskTitle}
                  onChange={(e) => setTaskTitle(e.target.value)}
                  placeholder="e.g. Implement Spring Boot OAuth Bearer token interceptor"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Description</label>
                <textarea
                  rows={3}
                  value={taskDesc}
                  onChange={(e) => setTaskDesc(e.target.value)}
                  placeholder="Task scope and validation acceptance criteria..."
                  className="w-full p-3 border border-slate-200 rounded-xl bg-slate-50 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Project</label>
                  <select
                    value={taskProject}
                    onChange={(e) => setTaskProject(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 focus:outline-none focus:border-indigo-500"
                  >
                    {projects.map((p) => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Priority</label>
                  <select
                    value={taskPriority}
                    onChange={(e) => setTaskPriority(e.target.value as PriorityLevel)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 focus:outline-none focus:border-indigo-500"
                  >
                    <option value="urgent">Urgent</option>
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Assignee</label>
                  <select
                    value={taskAssignee}
                    onChange={(e) => setTaskAssignee(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 focus:outline-none focus:border-indigo-500"
                  >
                    {initialTeamMembers.map((m) => (
                      <option key={m.id} value={m.id}>{m.name} ({m.role})</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Due Date</label>
                  <input
                    type="date"
                    value={taskDueDate}
                    onChange={(e) => setTaskDueDate(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsCreateTaskOpen(false)}
                  className="px-3 py-2 text-slate-600 hover:text-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl"
                >
                  Create Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
