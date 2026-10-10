import React, { useEffect, useState } from 'react';
import { employeesApi, messagesApi } from '../services/api';
import { Employee, Message } from '../types';
import { MessageSquare, Send } from 'lucide-react';

export const CommunicationWorkspace: React.FC<{ currentUserId?: number }> = ({ currentUserId }) => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [selectedUser, setSelectedUser] = useState<Employee | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [text, setText] = useState('');

  const activeUserId = currentUserId || 1;

  useEffect(() => {
    loadEmployees();
  }, []);

  useEffect(() => {
    if (selectedUser) {
      loadConversation(selectedUser.id);
    }
  }, [selectedUser]);

  const loadEmployees = async () => {
    try {
      const list = await employeesApi.getAll();
      const filtered = list.filter((e) => e.id !== activeUserId);
      setEmployees(filtered);
      if (filtered.length > 0) setSelectedUser(filtered[0]);
    } catch (err) {
      console.error(err);
    }
  };

  const loadConversation = async (otherUserId: number) => {
    try {
      const conv = await messagesApi.getConversation(activeUserId, otherUserId);
      setMessages(conv);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim() || !selectedUser) return;

    try {
      await messagesApi.send(activeUserId, selectedUser.id, text);
      setText('');
      loadConversation(selectedUser.id);
    } catch (err) {
      alert('Failed to send message');
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="pb-4 border-b border-slate-200">
        <h2 className="text-2xl font-bold font-heading text-slate-900 flex items-center gap-2">
          <MessageSquare className="w-6 h-6 text-indigo-600" />
          <span>Communication Workspace</span>
        </h2>
        <p className="text-xs text-slate-500">Employee directory and functional direct-message chat threads</p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-[580px]">
        {/* Directory Sidebar */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 flex flex-col space-y-3 overflow-hidden shadow-xs">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider px-2">Employee Directory</h3>
          <div className="flex-1 overflow-y-auto space-y-1.5">
            {employees.map((emp) => (
              <div
                key={emp.id}
                onClick={() => setSelectedUser(emp)}
                className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center gap-3 ${
                  selectedUser?.id === emp.id
                    ? 'bg-indigo-50 border-indigo-200 shadow-xs'
                    : 'border-transparent hover:bg-slate-50'
                }`}
              >
                <div className="w-9 h-9 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold text-xs">
                  {emp.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-slate-900 truncate">{emp.name}</h4>
                    <span className="text-[9px] px-1.5 py-0.2 rounded bg-slate-100 font-bold text-slate-700">{emp.role}</span>
                  </div>
                  <p className="text-[11px] text-slate-500 truncate">{emp.position || emp.department}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chat Thread */}
        <div className="md:col-span-2 bg-white rounded-2xl border border-slate-200 flex flex-col overflow-hidden shadow-xs">
          {selectedUser ? (
            <>
              {/* Chat Header */}
              <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold text-xs">
                    {selectedUser.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-slate-900 font-heading">{selectedUser.name}</h3>
                    <p className="text-[10px] text-slate-500">{selectedUser.email} • {selectedUser.department}</p>
                  </div>
                </div>
                <span className="text-[10px] px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 font-bold border border-emerald-200">
                  Direct Message Thread
                </span>
              </div>

              {/* Messages Content */}
              <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50/40 text-xs">
                {messages.map((m) => {
                  const isMine = m.sender.id === activeUserId;
                  return (
                    <div key={m.id} className={`flex flex-col ${isMine ? 'items-end' : 'items-start'}`}>
                      <div
                        className={`max-w-[75%] p-3 rounded-2xl ${
                          isMine
                            ? 'bg-indigo-600 text-white rounded-tr-none'
                            : 'bg-white border border-slate-200 text-slate-900 shadow-xs rounded-tl-none'
                        }`}
                      >
                        <p className="leading-relaxed">{m.content}</p>
                        <span className={`text-[9px] block mt-1 ${isMine ? 'text-indigo-200' : 'text-slate-400'}`}>
                          {m.timestamp ? new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                        </span>
                      </div>
                    </div>
                  );
                })}
                {messages.length === 0 && (
                  <p className="text-center text-xs text-slate-400 py-12">No messages yet. Send a message to start the conversation!</p>
                )}
              </div>

              {/* Input Form */}
              <form onSubmit={handleSend} className="p-3 border-t border-slate-200 bg-white flex items-center gap-2">
                <input
                  type="text"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder={`Message ${selectedUser.name}...`}
                  className="flex-1 px-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/30 text-slate-900"
                />
                <button
                  type="submit"
                  disabled={!text.trim()}
                  className="p-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 disabled:opacity-50 transition-colors"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-xs text-slate-400">
              Select an employee from the directory to open conversation
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
