import React, { useEffect, useState } from 'react';
import { meetingsApi, employeesApi } from '../services/api';
import { Meeting, Employee } from '../types';
import { Calendar, Plus, Clock, MapPin, Users, FileText, CheckCircle, X } from 'lucide-react';

export const MeetingsWorkspace: React.FC<{ currentUserId?: number }> = ({ currentUserId }) => {
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [selectedMeeting, setSelectedMeeting] = useState<Meeting | null>(null);
  const [showModal, setShowModal] = useState(false);

  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [location, setLocation] = useState('Executive Conference Room A');
  const [selectedParticipants, setSelectedParticipants] = useState<number[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [mList, eList] = await Promise.all([meetingsApi.getAll(), employeesApi.getAll()]);
      setMeetings(mList);
      setEmployees(eList);
      if (mList.length > 0) setSelectedMeeting(mList[0]);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateMeeting = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !date || !time) return;

    try {
      await meetingsApi.create({
        title,
        description,
        date,
        time,
        location,
        organizerId: currentUserId || 1,
        participantIds: selectedParticipants,
        agenda: '1. Topic Discussion\n2. Q&A',
        notes: 'Prepared notes'
      });
      setShowModal(false);
      setTitle('');
      setDescription('');
      loadData();
    } catch (err) {
      alert('Error creating meeting');
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-200">
        <div>
          <h2 className="text-2xl font-bold font-heading text-slate-900 flex items-center gap-2">
            <Calendar className="w-6 h-6 text-indigo-600" />
            <span>Meeting Workspace</span>
          </h2>
          <p className="text-xs text-slate-500">Schedule meetings, invite employees, and manage agendas</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl shadow-xs flex items-center gap-1.5 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Schedule Meeting</span>
        </button>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Meetings List */}
        <div className="lg:col-span-1 space-y-3">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider px-1">Upcoming & Past Syncs</h3>
          {meetings.map((m) => (
            <div
              key={m.id}
              onClick={() => setSelectedMeeting(m)}
              className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                selectedMeeting?.id === m.id
                  ? 'bg-indigo-50/70 border-indigo-200 shadow-xs'
                  : 'bg-white border-slate-200 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <h4 className="text-xs font-bold text-slate-900">{m.title}</h4>
                <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-800">
                  {m.status}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 flex items-center gap-1">
                <Clock className="w-3 h-3 text-indigo-600" />
                {m.date} at {m.time}
              </p>
            </div>
          ))}
        </div>

        {/* Selected Meeting Details */}
        <div className="lg:col-span-2">
          {selectedMeeting ? (
            <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-6">
              <div className="flex items-start justify-between border-b border-slate-100 pb-4">
                <div>
                  <h3 className="text-xl font-bold font-heading text-slate-900">{selectedMeeting.title}</h3>
                  <p className="text-xs text-slate-600 mt-1">{selectedMeeting.description}</p>
                </div>
                <span className="px-3 py-1 rounded-full bg-indigo-50 text-indigo-800 font-bold text-xs border border-indigo-100">
                  {selectedMeeting.status}
                </span>
              </div>

              {/* Info Chips */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <p className="text-[10px] text-slate-500 font-bold uppercase">Date & Time</p>
                  <p className="font-semibold text-slate-900 mt-0.5">{selectedMeeting.date} ({selectedMeeting.time})</p>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <p className="text-[10px] text-slate-500 font-bold uppercase">Location / Link</p>
                  <p className="font-semibold text-slate-900 mt-0.5">{selectedMeeting.location}</p>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <p className="text-[10px] text-slate-500 font-bold uppercase">Organizer</p>
                  <p className="font-semibold text-slate-900 mt-0.5">{selectedMeeting.organizer?.name || 'Admin'}</p>
                </div>
              </div>

              {/* Participants */}
              <div>
                <h4 className="text-xs font-bold text-slate-900 font-heading mb-2 flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-indigo-600" /> Invited Participants
                </h4>
                <div className="flex flex-wrap gap-2">
                  {selectedMeeting.participants?.map((p) => (
                    <span key={p.id} className="px-3 py-1 bg-slate-100 border border-slate-200 text-slate-800 rounded-full text-xs font-semibold">
                      {p.name} ({p.role})
                    </span>
                  ))}
                </div>
              </div>

              {/* Agenda & Notes */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <h4 className="text-xs font-bold text-slate-900 mb-1">Agenda</h4>
                  <p className="text-xs text-slate-700 whitespace-pre-line leading-relaxed">{selectedMeeting.agenda || 'Standard sync agenda.'}</p>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <h4 className="text-xs font-bold text-slate-900 mb-1">Meeting Notes</h4>
                  <p className="text-xs text-slate-700 whitespace-pre-line leading-relaxed">{selectedMeeting.notes || 'No notes taken.'}</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-12 text-center text-xs text-slate-400 bg-white rounded-2xl border border-slate-200">
              Select a meeting from the list to view details
            </div>
          )}
        </div>
      </div>

      {/* Schedule Meeting Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 border border-slate-200 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200">
              <h3 className="text-base font-bold font-heading text-slate-900">Schedule New Meeting</h3>
              <button onClick={() => setShowModal(false)}><X className="w-5 h-5 text-slate-400 hover:text-slate-600" /></button>
            </div>

            <form onSubmit={handleCreateMeeting} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold mb-1 text-slate-700">Meeting Title</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Sprint Architecture Sync"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-500/30 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold mb-1 text-slate-700">Date</label>
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-500/30 outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1 text-slate-700">Time</label>
                  <input
                    type="time"
                    required
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-500/30 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1 text-slate-700">Location / Room</label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-500/30 outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1 text-slate-700">Invite Employees</label>
                <div className="max-h-32 overflow-y-auto space-y-1 p-2 border border-slate-200 rounded-xl bg-slate-50">
                  {employees.map((emp) => (
                    <label key={emp.id} className="flex items-center gap-2 text-xs text-slate-700">
                      <input
                        type="checkbox"
                        checked={selectedParticipants.includes(emp.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedParticipants([...selectedParticipants, emp.id]);
                          } else {
                            setSelectedParticipants(selectedParticipants.filter((id) => id !== emp.id));
                          }
                        }}
                      />
                      <span>{emp.name} ({emp.role} - {emp.department})</span>
                    </label>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-colors"
              >
                Schedule & Invite
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
