import React, { useState } from 'react';
import { useWorkspace } from '../context/WorkspaceContext';
import { meetingsApi } from '../api/meetingsApi';
import { Avatar } from '../components/ui/Avatar';
import {
  Calendar,
  Clock,
  User,
  Users,
  CheckSquare,
  Square,
  Plus,
  Sparkles,
  Building,
  CheckCircle2,
  FileText,
  AlertCircle,
  Share2,
  MapPin,
  ChevronRight,
} from 'lucide-react';
import { Meeting } from '../types';

export const MeetingWorkspacePage: React.FC = () => {
  const {
    meetings,
    selectedMeetingId,
    setSelectedMeetingId,
    updateMeetingNotes,
    toggleMeetingChecklist,
    toggleMeetingAgenda,
    toggleActionItem,
    addMeeting,
    activeAdaptiveConfig,
  } = useWorkspace();

  const currentMeeting =
    meetings.find((m) => m.id === selectedMeetingId) || meetings[0];

  const [notesText, setNotesText] = useState(currentMeeting?.notes || '');
  const [isSynthesizing, setIsSynthesizing] = useState(false);
  const [summaryResult, setSummaryResult] = useState<string | null>(null);

  // Modal State
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newClient, setNewClient] = useState('');
  const [newCompany, setNewCompany] = useState('');
  const [newTime, setNewTime] = useState('03:00 PM - 03:45 PM');
  const [newDate, setNewDate] = useState('2026-10-12');
  const [newLocation, setNewLocation] = useState('Conference Room Beta');

  // New Action Item Input
  const [newActionText, setNewActionText] = useState('');
  const [newActionAssignee, setNewActionAssignee] = useState('You');

  const handleNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNotesText(e.target.value);
    if (currentMeeting) {
      updateMeetingNotes(currentMeeting.id, e.target.value);
    }
  };

  const handleGenerateSummary = async () => {
    if (!currentMeeting) return;
    setIsSynthesizing(true);
    try {
      const summary = await meetingsApi.generateMeetingSummary(currentMeeting);
      setSummaryResult(summary);
    } catch {
      setSummaryResult('Could not generate summary.');
    } finally {
      setIsSynthesizing(false);
    }
  };

  const handleCreateMeeting = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newCompany.trim()) return;

    const created: Meeting = {
      id: `meet-${Date.now()}`,
      title: newTitle,
      client: newClient || 'Client Lead',
      company: newCompany,
      date: newDate,
      time: newTime,
      durationMinutes: 45,
      location: newLocation,
      attendees: ['You', newClient || 'Client Lead'],
      agenda: [
        { id: `ag-${Date.now()}-1`, title: 'Introductions and Scope Definition', durationMinutes: 15, completed: false },
        { id: `ag-${Date.now()}-2`, title: 'Core Requirements Walkthrough', durationMinutes: 30, completed: false },
      ],
      notes: 'Initial kick-off notes.',
      actionItems: [],
      checklist: [{ id: `chk-${Date.now()}`, item: 'Prepare kickoff deck', done: false }],
      isToday: newDate === '2026-10-11',
    };

    addMeeting(created);
    setIsCreateModalOpen(false);
    setNewTitle('');
    setNewCompany('');
    setNewClient('');
  };

  const isHighlighted = (widgetId: string) => {
    if (!activeAdaptiveConfig) return false;
    const w = activeAdaptiveConfig.widgets.find((x) => x.id === widgetId);
    return w?.highlighted;
  };

  return (
    <div className="space-y-6">
      {/* Top Header Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold text-indigo-600 uppercase tracking-wider block mb-1">
            Meeting Workspace
          </span>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Schedule & Executive Briefings
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Prepare agendas, capture meeting minutes, track sign-offs, and generate instant summaries.
          </p>
        </div>

        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Meeting</span>
        </button>
      </div>

      {/* Main Grid: Meeting Selector Sidebar + Detailed Meeting Brief */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Meetings List (4 cols) */}
        <div className="lg:col-span-4 space-y-3">
          <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
              Upcoming Schedule ({meetings.length})
            </h3>
            <div className="space-y-2">
              {meetings.map((m) => {
                const isSelected = m.id === currentMeeting?.id;
                return (
                  <div
                    key={m.id}
                    onClick={() => {
                      setSelectedMeetingId(m.id);
                      setNotesText(m.notes);
                      setSummaryResult(null);
                    }}
                    className={`p-3.5 rounded-xl border text-xs cursor-pointer transition-all ${
                      isSelected
                        ? 'border-indigo-600 bg-indigo-50/60 shadow-xs'
                        : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900">{m.company}</span>
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                        m.isToday ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-100 text-slate-600'
                      }`}>
                        {m.isToday ? 'Today' : m.date}
                      </span>
                    </div>
                    <h4 className="text-xs font-medium text-slate-700 mt-1 line-clamp-1">{m.title}</h4>
                    <div className="flex items-center gap-2 mt-2 text-[11px] text-slate-400">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{m.time}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Active Meeting Detail & Dynamic Widgets (8 cols) */}
        {currentMeeting && (
          <div className="lg:col-span-8 space-y-6">
            {/* Header Card */}
            <div className={`bg-white rounded-2xl border p-5 shadow-xs transition-all ${
              isHighlighted('w-agenda') ? 'border-indigo-500 ring-2 ring-indigo-100' : 'border-slate-200'
            }`}>
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-4 mb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md">
                      {currentMeeting.company}
                    </span>
                    <span className="text-xs text-slate-500 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      {currentMeeting.location}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mt-1">
                    {currentMeeting.title}
                  </h3>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleGenerateSummary}
                    disabled={isSynthesizing}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white text-xs font-medium rounded-lg shadow-xs transition-all active:scale-95 disabled:opacity-50"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{isSynthesizing ? 'Synthesizing...' : 'Synthesize AI Summary'}</span>
                  </button>
                </div>
              </div>

              {/* Stakeholder and Attendee strip */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-3.5 rounded-xl bg-slate-50/70 border border-slate-200/80">
                  <span className="text-[11px] font-semibold text-slate-400 block mb-1.5 uppercase tracking-wider">
                    Primary Client Contact
                  </span>
                  <div className="flex items-center gap-2.5">
                    <Avatar name={currentMeeting.client} size="sm" />
                    <div>
                      <span className="font-bold text-slate-900 block leading-tight">{currentMeeting.client}</span>
                      <span className="text-[11px] text-slate-400">{currentMeeting.company}</span>
                    </div>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50/70 border border-slate-200/80">
                  <span className="text-[11px] font-semibold text-slate-400 block mb-1.5 uppercase tracking-wider">
                    Confirmed Attendees ({currentMeeting.attendees.length})
                  </span>
                  <div className="flex items-center gap-2">
                    <div className="flex -space-x-1.5 overflow-hidden">
                      {currentMeeting.attendees.slice(0, 4).map((att, i) => (
                        <Avatar key={i} name={att} size="xs" className="ring-2 ring-white" />
                      ))}
                    </div>
                    <span className="text-[11px] text-slate-600 font-medium truncate">
                      {currentMeeting.attendees.join(', ')}
                    </span>
                  </div>
                </div>
              </div>

              {/* AI Summary Banner (if generated) */}
              {summaryResult && (
                <div className="mt-4 p-4 rounded-xl bg-indigo-50/80 border border-indigo-200 text-xs text-indigo-950 animate-in fade-in">
                  <div className="flex items-center gap-2 font-bold text-indigo-900 mb-2">
                    <Sparkles className="w-4 h-4 text-indigo-600" />
                    <span>AI Executive Synthesis</span>
                  </div>
                  <pre className="whitespace-pre-wrap font-sans text-xs leading-relaxed text-indigo-900">
                    {summaryResult}
                  </pre>
                </div>
              )}
            </div>

            {/* Agenda & Readiness Checklist */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Meeting Agenda */}
              <div className={`bg-white rounded-2xl border p-5 shadow-xs transition-all ${
                isHighlighted('w-agenda') ? 'border-indigo-500 ring-2 ring-indigo-100' : 'border-slate-200'
              }`}>
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5 uppercase tracking-wider">
                    <FileText className="w-3.5 h-3.5 text-indigo-600" />
                    Meeting Agenda
                  </h4>
                  <span className="text-[11px] text-slate-400">
                    {currentMeeting.agenda.filter((a) => a.completed).length}/{currentMeeting.agenda.length} completed
                  </span>
                </div>

                <div className="space-y-2 text-xs">
                  {currentMeeting.agenda.map((ag) => (
                    <div
                      key={ag.id}
                      onClick={() => toggleMeetingAgenda(currentMeeting.id, ag.id)}
                      className="p-2.5 rounded-lg border border-slate-200 hover:bg-slate-50 cursor-pointer flex items-start gap-2.5 transition-colors"
                    >
                      {ag.completed ? (
                        <CheckSquare className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                      ) : (
                        <Square className="w-4 h-4 text-slate-300 mt-0.5 shrink-0" />
                      )}
                      <div className="flex-1">
                        <span className={ag.completed ? 'line-through text-slate-400' : 'text-slate-800 font-medium'}>
                          {ag.title}
                        </span>
                        <span className="text-[10px] text-slate-400 block mt-0.5">
                          {ag.durationMinutes} mins
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Pre-Meeting Checklist */}
              <div className={`bg-white rounded-2xl border p-5 shadow-xs transition-all ${
                isHighlighted('w-prep-checklist') ? 'border-indigo-500 ring-2 ring-indigo-100' : 'border-slate-200'
              }`}>
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5 uppercase tracking-wider">
                    <CheckCircle2 className="w-3.5 h-3.5 text-teal-600" />
                    Readiness Checklist
                  </h4>
                  <span className="text-[11px] text-slate-400">
                    {currentMeeting.checklist.filter((c) => c.done).length}/{currentMeeting.checklist.length} done
                  </span>
                </div>

                <div className="space-y-2 text-xs">
                  {currentMeeting.checklist.map((chk) => (
                    <div
                      key={chk.id}
                      onClick={() => toggleMeetingChecklist(currentMeeting.id, chk.id)}
                      className="p-2.5 rounded-lg border border-slate-200 hover:bg-slate-50 cursor-pointer flex items-center gap-2.5 transition-colors"
                    >
                      {chk.done ? (
                        <CheckSquare className="w-4 h-4 text-teal-600 shrink-0" />
                      ) : (
                        <Square className="w-4 h-4 text-slate-300 shrink-0" />
                      )}
                      <span className={chk.done ? 'line-through text-slate-400' : 'text-slate-800'}>
                        {chk.item}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Action Items & Meeting Notes */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Action Items */}
              <div className={`bg-white rounded-2xl border p-5 shadow-xs transition-all ${
                isHighlighted('w-actions') ? 'border-indigo-500 ring-2 ring-indigo-100' : 'border-slate-200'
              }`}>
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    Open Action Items
                  </h4>
                  <span className="text-[11px] text-slate-400">
                    {currentMeeting.actionItems.length} deliverables
                  </span>
                </div>

                <div className="space-y-2 text-xs mb-3">
                  {currentMeeting.actionItems.map((act) => (
                    <div
                      key={act.id}
                      onClick={() => toggleActionItem(currentMeeting.id, act.id)}
                      className="p-2.5 rounded-lg border border-slate-200 hover:bg-slate-50 cursor-pointer flex items-start justify-between gap-2 transition-colors"
                    >
                      <div className="flex items-start gap-2">
                        {act.completed ? (
                          <CheckSquare className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                        ) : (
                          <Square className="w-4 h-4 text-slate-300 mt-0.5 shrink-0" />
                        )}
                        <div>
                          <span className={act.completed ? 'line-through text-slate-400' : 'text-slate-800 font-medium'}>
                            {act.task}
                          </span>
                          <span className="text-[10px] text-slate-400 block mt-0.5">
                            Assignee: {act.assignee} • Due: {act.dueDate}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Add Action Item Mini Input */}
                <div className="pt-2 border-t border-slate-100 flex gap-2">
                  <input
                    type="text"
                    value={newActionText}
                    onChange={(e) => setNewActionText(e.target.value)}
                    placeholder="Add action item..."
                    className="flex-1 px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-500"
                  />
                  <button
                    onClick={() => {
                      if (!newActionText.trim()) return;
                      currentMeeting.actionItems.push({
                        id: `act-${Date.now()}`,
                        task: newActionText,
                        assignee: newActionAssignee,
                        dueDate: '2026-10-14',
                        completed: false,
                      });
                      setNewActionText('');
                    }}
                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-900 text-white text-xs font-semibold rounded-lg"
                  >
                    Add
                  </button>
                </div>
              </div>

              {/* Editable Meeting Notes */}
              <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    Meeting Minutes & Notes
                  </h4>
                  <span className="text-[10px] text-emerald-600 font-medium bg-emerald-50 px-2 py-0.5 rounded">
                    Auto-saved
                  </span>
                </div>
                <textarea
                  value={notesText}
                  onChange={handleNotesChange}
                  rows={6}
                  placeholder="Capture key insights, decisions, and technical commitments..."
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-indigo-500 focus:bg-white resize-none leading-relaxed"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Create Meeting Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-md w-full p-6 animate-in fade-in duration-150">
            <h3 className="text-base font-bold text-slate-900 mb-1">Schedule New Meeting</h3>
            <p className="text-xs text-slate-500 mb-4">
              Add discussion agenda and participant details to your calendar.
            </p>

            <form onSubmit={handleCreateMeeting} className="space-y-3.5 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Meeting Title</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Architecture Alignment & Cloud Migration"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Company</label>
                  <input
                    type="text"
                    required
                    value={newCompany}
                    onChange={(e) => setNewCompany(e.target.value)}
                    placeholder="e.g. Acme Corp"
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Client Contact</label>
                  <input
                    type="text"
                    value={newClient}
                    onChange={(e) => setNewClient(e.target.value)}
                    placeholder="e.g. David Vance"
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Date</label>
                  <input
                    type="date"
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Time Slot</label>
                  <input
                    type="text"
                    value={newTime}
                    onChange={(e) => setNewTime(e.target.value)}
                    placeholder="10:00 AM - 11:00 AM"
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Location / Room</label>
                <input
                  type="text"
                  value={newLocation}
                  onChange={(e) => setNewLocation(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-3 py-2 text-slate-600 hover:text-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl"
                >
                  Save Meeting
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
