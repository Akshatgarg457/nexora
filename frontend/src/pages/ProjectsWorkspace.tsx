import React, { useEffect, useState } from 'react';
import { projectsApi, employeesApi } from '../services/api';
import { Project, ProjectTask, Employee, ProgressReport } from '../types';
import { Briefcase, Plus, AlertTriangle, FileCheck, X } from 'lucide-react';

export const ProjectsWorkspace: React.FC<{ currentUserId?: number; userRole?: string }> = ({ currentUserId, userRole }) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [tasks, setTasks] = useState<ProjectTask[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [reports, setReports] = useState<ProgressReport[]>([]);

  // Modals
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);

  // New Project Form
  const [projectName, setProjectName] = useState('');
  const [projectDesc, setProjectDesc] = useState('');
  const [projectCat, setProjectCat] = useState('Engineering');
  const [projectManager, setProjectManager] = useState<number>(1);

  // New Task Form
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDesc, setTaskDesc] = useState('');
  const [taskAssignee, setTaskAssignee] = useState<number>(1);
  const [taskPriority, setTaskPriority] = useState('MEDIUM');
  const [taskDueDate, setTaskDueDate] = useState('');

  // New Report Form
  const [reportSummary, setReportSummary] = useState('');
  const [reportPct, setReportPct] = useState(70);
  const [reportBlockers, setReportBlockers] = useState('');

  const activeUserId = currentUserId || 1;

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [pList, tList, eList] = await Promise.all([
        projectsApi.getAll(),
        projectsApi.getAllTasks(),
        employeesApi.getAll()
      ]);
      setProjects(pList);
      setTasks(tList);
      setEmployees(eList);
      if (pList.length > 0) {
        setSelectedProject(pList[0]);
        loadReports(pList[0].id);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const loadReports = async (pId: number) => {
    try {
      const rList = await projectsApi.getReports(pId);
      setReports(rList);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectName) return;
    try {
      await projectsApi.create({
        name: projectName,
        description: projectDesc,
        category: projectCat,
        status: 'IN_PROGRESS',
        managerId: projectManager,
        completionPercentage: 0
      });
      setShowProjectModal(false);
      setProjectName('');
      loadData();
    } catch (err) {
      alert('Error creating project');
    }
  };

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskTitle || !selectedProject) return;
    try {
      await projectsApi.createTask({
        projectId: selectedProject.id,
        title: taskTitle,
        description: taskDesc,
        assigneeId: taskAssignee,
        status: 'TODO',
        priority: taskPriority,
        dueDate: taskDueDate || new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0]
      });
      setShowTaskModal(false);
      setTaskTitle('');
      loadData();
    } catch (err) {
      alert('Error creating task');
    }
  };

  const handleUpdateTaskStatus = async (taskId: number, newStatus: string) => {
    try {
      await projectsApi.updateTaskStatus(taskId, newStatus);
      loadData();
    } catch (err) {
      alert('Error updating task status');
    }
  };

  const handleCreateReport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportSummary || !selectedProject) return;
    try {
      await projectsApi.createReport({
        projectId: selectedProject.id,
        authorId: activeUserId,
        summary: reportSummary,
        progressPercentage: reportPct,
        blockers: reportBlockers
      });
      setShowReportModal(false);
      setReportSummary('');
      loadData();
      if (selectedProject) loadReports(selectedProject.id);
    } catch (err) {
      alert('Error creating report');
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h2 className="text-2xl font-bold font-heading text-slate-900 flex items-center gap-2">
            <Briefcase className="w-6 h-6 text-indigo-600" />
            <span>Project Management Workspace</span>
          </h2>
          <p className="text-xs text-slate-500">Track projects, task statuses, deadlines, and submit progress reports</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowProjectModal(true)}
            className="px-4 py-2.5 bg-white border border-slate-200 text-slate-700 text-xs font-semibold rounded-xl hover:bg-slate-50 flex items-center gap-1 shadow-xs"
          >
            <Plus className="w-4 h-4" /> New Project
          </button>
          <button
            onClick={() => setShowTaskModal(true)}
            className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl shadow-xs flex items-center gap-1 transition-colors"
          >
            <Plus className="w-4 h-4" /> New Task
          </button>
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Project Selector List */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider px-1">Active Projects</h3>
          {projects.map((p) => (
            <div
              key={p.id}
              onClick={() => {
                setSelectedProject(p);
                loadReports(p.id);
              }}
              className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                selectedProject?.id === p.id
                  ? 'bg-indigo-50/70 border-indigo-200 shadow-xs'
                  : 'bg-white border-slate-200 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <h4 className="text-xs font-bold text-slate-900">{p.name}</h4>
                <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
                  {p.status}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 line-clamp-1">{p.description}</p>
              <div className="mt-3 flex items-center justify-between text-[11px]">
                <span className="text-slate-500">Progress: <strong>{p.completionPercentage}%</strong></span>
                <span className="text-slate-500">Manager: <strong>{p.manager?.name}</strong></span>
              </div>
            </div>
          ))}
        </div>

        {/* Selected Project Tasks & Kanban View */}
        <div className="md:col-span-2 space-y-6">
          {selectedProject ? (
            <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider">{selectedProject.category}</span>
                  <h3 className="text-xl font-bold font-heading text-slate-900 mt-0.5">{selectedProject.name}</h3>
                  <p className="text-xs text-slate-600 mt-0.5">{selectedProject.description}</p>
                </div>
                <button
                  onClick={() => setShowReportModal(true)}
                  className="px-3.5 py-2 bg-slate-50 border border-slate-200 text-slate-800 rounded-xl text-xs font-bold flex items-center gap-1 hover:bg-slate-100 transition-colors"
                >
                  <FileCheck className="w-4 h-4 text-indigo-600" /> Submit Report
                </button>
              </div>

              {/* Task Board */}
              <div>
                <h4 className="text-xs font-bold text-slate-900 font-heading mb-3">Project Tasks & Workflow</h4>
                <div className="space-y-3">
                  {tasks
                    .filter((t) => t.projectId === selectedProject.id)
                    .map((t) => (
                      <div
                        key={t.id}
                        className={`p-3.5 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                          t.isOverdue
                            ? 'bg-rose-50/70 border-rose-200'
                            : 'bg-slate-50 border-slate-200'
                        }`}
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <h5 className="text-xs font-bold text-slate-900">{t.title}</h5>
                            {t.isOverdue && (
                              <span className="text-[9px] px-2 py-0.5 bg-rose-600 text-white font-bold rounded-full flex items-center gap-1">
                                <AlertTriangle className="w-3 h-3" /> OVERDUE
                              </span>
                            )}
                            <span className="text-[9px] px-2 py-0.5 bg-slate-200 font-bold text-slate-700 rounded-full">
                              {t.priority}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-600">{t.description}</p>
                          <p className="text-[10px] text-slate-500">
                            Assignee: <strong>{t.assignee?.name || 'Unassigned'}</strong> • Due: {t.dueDate}
                          </p>
                        </div>

                        {/* Interactive Status Changer */}
                        <div className="flex items-center gap-1 shrink-0">
                          {(['TODO', 'IN_PROGRESS', 'REVIEW', 'DONE'] as const).map((st) => (
                            <button
                              key={st}
                              onClick={() => handleUpdateTaskStatus(t.id, st)}
                              className={`px-2.5 py-1 text-[10px] font-bold rounded-lg transition-all ${
                                t.status === st
                                  ? 'bg-indigo-600 text-white shadow-xs'
                                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                              }`}
                            >
                              {st}
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  {tasks.filter((t) => t.projectId === selectedProject.id).length === 0 && (
                    <p className="text-xs text-slate-400 py-4">No tasks found for this project. Click 'New Task' to add one.</p>
                  )}
                </div>
              </div>

              {/* Progress Reports History */}
              <div>
                <h4 className="text-xs font-bold text-slate-900 font-heading mb-2">Submitted Progress Reports</h4>
                <div className="space-y-2">
                  {reports.map((r) => (
                    <div key={r.id} className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs space-y-1">
                      <div className="flex items-center justify-between font-bold text-slate-900">
                        <span>Report by {r.author?.name}</span>
                        <span className="text-indigo-600">{r.progressPercentage}% Completed</span>
                      </div>
                      <p className="text-slate-700">{r.summary}</p>
                      {r.blockers && <p className="text-[11px] text-rose-600">Blockers: {r.blockers}</p>}
                    </div>
                  ))}
                  {reports.length === 0 && <p className="text-xs text-slate-400">No progress reports submitted yet.</p>}
                </div>
              </div>
            </div>
          ) : (
            <div className="p-12 text-center text-xs text-slate-400 bg-white rounded-2xl border border-slate-200">
              Select a project from the left panel
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      {showProjectModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <h3 className="text-sm font-bold font-heading text-slate-900">Create New Project</h3>
              <button onClick={() => setShowProjectModal(false)}><X className="w-5 h-5 text-slate-400" /></button>
            </div>
            <form onSubmit={handleCreateProject} className="space-y-3 text-xs">
              <input
                type="text"
                required
                placeholder="Project Name"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                className="w-full p-2.5 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-500/30 outline-none"
              />
              <textarea
                placeholder="Description"
                value={projectDesc}
                onChange={(e) => setProjectDesc(e.target.value)}
                className="w-full p-2.5 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-500/30 outline-none"
              />
              <select
                value={projectManager}
                onChange={(e) => setProjectManager(Number(e.target.value))}
                className="w-full p-2.5 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-500/30 outline-none"
              >
                {employees.map((e) => (
                  <option key={e.id} value={e.id}>{e.name} ({e.role})</option>
                ))}
              </select>
              <button type="submit" className="w-full py-2.5 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-colors">
                Create Project
              </button>
            </form>
          </div>
        </div>
      )}

      {showTaskModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <h3 className="text-sm font-bold font-heading text-slate-900">Create Task</h3>
              <button onClick={() => setShowTaskModal(false)}><X className="w-5 h-5 text-slate-400" /></button>
            </div>
            <form onSubmit={handleCreateTask} className="space-y-3 text-xs">
              <input
                type="text"
                required
                placeholder="Task Title"
                value={taskTitle}
                onChange={(e) => setTaskTitle(e.target.value)}
                className="w-full p-2.5 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-500/30 outline-none"
              />
              <textarea
                placeholder="Description"
                value={taskDesc}
                onChange={(e) => setTaskDesc(e.target.value)}
                className="w-full p-2.5 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-500/30 outline-none"
              />
              <div className="grid grid-cols-2 gap-2">
                <select
                  value={taskAssignee}
                  onChange={(e) => setTaskAssignee(Number(e.target.value))}
                  className="w-full p-2.5 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-500/30 outline-none"
                >
                  {employees.map((e) => (
                    <option key={e.id} value={e.id}>{e.name}</option>
                  ))}
                </select>
                <input
                  type="date"
                  value={taskDueDate}
                  onChange={(e) => setTaskDueDate(e.target.value)}
                  className="w-full p-2.5 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-500/30 outline-none"
                />
              </div>
              <button type="submit" className="w-full py-2.5 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-colors">
                Add Task
              </button>
            </form>
          </div>
        </div>
      )}

      {showReportModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <h3 className="text-sm font-bold font-heading text-slate-900">Submit Progress Report</h3>
              <button onClick={() => setShowReportModal(false)}><X className="w-5 h-5 text-slate-400" /></button>
            </div>
            <form onSubmit={handleCreateReport} className="space-y-3 text-xs">
              <textarea
                required
                placeholder="Summary of completed progress..."
                value={reportSummary}
                onChange={(e) => setReportSummary(e.target.value)}
                className="w-full p-2.5 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-500/30 outline-none"
              />
              <div>
                <label className="block font-semibold mb-1 text-slate-700">Completion Percentage ({reportPct}%)</label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={reportPct}
                  onChange={(e) => setReportPct(Number(e.target.value))}
                  className="w-full"
                />
              </div>
              <input
                type="text"
                placeholder="Blockers (if any)"
                value={reportBlockers}
                onChange={(e) => setReportBlockers(e.target.value)}
                className="w-full p-2.5 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-500/30 outline-none"
              />
              <button type="submit" className="w-full py-2.5 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-colors">
                Submit Report
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
