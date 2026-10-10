import React, { useState } from 'react';
import { useWorkspace } from '../context/WorkspaceContext';
import { communicationApi } from '../api/communicationApi';
import { Avatar } from '../components/ui/Avatar';
import {
  MessageSquare,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  Sparkles,
  Send,
  Wand2,
  Plus,
  AlertCircle,
  Tag,
  Mail,
  User,
  BellRing,
  RotateCcw,
} from 'lucide-react';
import { MessageItem } from '../types';

export const CommunicationWorkspacePage: React.FC = () => {
  const {
    messages,
    selectedMessageId,
    setSelectedMessageId,
    markMessageRead,
    addMessage,
    activeAdaptiveConfig,
  } = useWorkspace();

  const [filterMode, setFilterMode] = useState<'all' | 'unread' | 'urgent'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [draftReply, setDraftReply] = useState('');
  const [isRewriting, setIsRewriting] = useState(false);
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [summarySnippet, setSummarySnippet] = useState<string | null>(null);
  const [reminderSaved, setReminderSaved] = useState(false);

  // Compose Modal State
  const [isComposeOpen, setIsComposeOpen] = useState(false);
  const [composeTo, setComposeTo] = useState('David Vance');
  const [composeEmail, setComposeEmail] = useState('david.vance@acmecorp.com');
  const [composeSubject, setComposeSubject] = useState('');
  const [composeBody, setComposeBody] = useState('');

  const currentMessage =
    messages.find((m) => m.id === selectedMessageId) || messages[0];

  // Filtering
  const filteredMessages = messages.filter((msg) => {
    if (filterMode === 'unread' && msg.isRead) return false;
    if (filterMode === 'urgent' && msg.priority !== 'urgent' && msg.priority !== 'high') return false;
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      return (
        msg.sender.toLowerCase().includes(q) ||
        msg.subject.toLowerCase().includes(q) ||
        msg.snippet.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleRewrite = async (tone: 'executive' | 'concise' | 'friendly') => {
    if (!draftReply.trim()) return;
    setIsRewriting(true);
    try {
      const polished = await communicationApi.rewriteMessage(draftReply, tone);
      setDraftReply(polished);
    } catch {
      // fallback
    } finally {
      setIsRewriting(false);
    }
  };

  const handleSummarizeThread = async () => {
    if (!currentMessage) return;
    setIsSummarizing(true);
    setTimeout(() => {
      setSummarySnippet(
        `Thread Summary: ${currentMessage.sender} is asking for SLA commitments & DR documentation ahead of tomorrow's 10:00 AM architecture review. Recommended action: acknowledge and attach Frankfurt 18ms latency metrics.`
      );
      setIsSummarizing(false);
    }, 450);
  };

  const handleSendReply = () => {
    if (!draftReply.trim() || !currentMessage) return;
    // Simulate sending reply
    markMessageRead(currentMessage.id, true);
    setDraftReply('');
    alert(`Reply dispatched to ${currentMessage.sender}! (Simulated REST response)`);
  };

  const handleCreateNewMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!composeSubject.trim() || !composeBody.trim()) return;

    const newMsg: MessageItem = {
      id: `msg-${Date.now()}`,
      sender: 'You',
      senderEmail: 'alex.rivera@nexora.io',
      senderRole: 'Fullstack Lead',
      subject: composeSubject,
      snippet: composeBody.slice(0, 80) + '...',
      body: composeBody,
      timestamp: 'Just now',
      isRead: true,
      priority: 'high',
      tag: 'client',
      threadCount: 1,
    };

    addMessage(newMsg);
    setIsComposeOpen(false);
    setComposeSubject('');
    setComposeBody('');
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider block mb-1">
            Communication Workspace
          </span>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Unified Inbox & Executive Triage
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Organize high-priority stakeholder communications with automated tone enhancement and thread summaries.
          </p>
        </div>

        <button
          onClick={() => setIsComposeOpen(true)}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Compose Message</span>
        </button>
      </div>

      {/* Main Layout: Inbox Column (5 cols) + Conversation & Composer (7 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Inbox List */}
        <div className="lg:col-span-5 space-y-3">
          <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs space-y-3">
            {/* Search and Filters */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search messages by sender, title..."
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="flex items-center gap-1.5 border-b border-slate-100 pb-2 text-xs">
              <button
                onClick={() => setFilterMode('all')}
                className={`px-3 py-1 rounded-lg font-medium transition-colors ${
                  filterMode === 'all'
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                All ({messages.length})
              </button>
              <button
                onClick={() => setFilterMode('unread')}
                className={`px-3 py-1 rounded-lg font-medium transition-colors ${
                  filterMode === 'unread'
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Unread ({messages.filter((m) => !m.isRead).length})
              </button>
              <button
                onClick={() => setFilterMode('urgent')}
                className={`px-3 py-1 rounded-lg font-medium transition-colors ${
                  filterMode === 'urgent'
                    ? 'bg-rose-600 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Urgent Priority
              </button>
            </div>

            {/* Message List */}
            <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
              {filteredMessages.map((msg) => {
                const isSelected = msg.id === currentMessage?.id;
                return (
                  <div
                    key={msg.id}
                    onClick={() => {
                      setSelectedMessageId(msg.id);
                      markMessageRead(msg.id, true);
                      setSummarySnippet(null);
                    }}
                    className={`p-3.5 rounded-xl border text-xs cursor-pointer transition-all ${
                      isSelected
                        ? 'border-indigo-500 bg-indigo-50/50 shadow-xs'
                        : msg.isRead
                        ? 'border-slate-200 hover:bg-slate-50'
                        : 'border-blue-200 bg-blue-50/40 hover:bg-blue-50/70 font-semibold'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <Avatar name={msg.sender} size="xs" />
                        <span className="font-bold text-slate-900 truncate">
                          {msg.sender}
                        </span>
                        {!msg.isRead && (
                          <span className="w-1.5 h-1.5 rounded-full bg-blue-600 shrink-0" />
                        )}
                      </div>
                      <span className="text-[10px] text-slate-400 font-mono tabular-nums">{msg.timestamp}</span>
                    </div>

                    <h4 className="text-xs text-slate-900 font-semibold line-clamp-1 mb-1">
                      {msg.subject}
                    </h4>

                    <p className="text-[11px] text-slate-500 line-clamp-2 font-normal">
                      {msg.snippet}
                    </p>

                    <div className="flex items-center gap-2 mt-2 pt-1 text-[10px] text-slate-500">
                      <span className="font-semibold uppercase tracking-wider text-slate-700">{msg.tag}</span>
                      <span aria-hidden="true" className="text-slate-300">·</span>
                      {msg.priority === 'urgent' ? (
                        <span className="font-bold text-rose-600">Urgent Priority</span>
                      ) : msg.priority === 'high' ? (
                        <span className="font-bold text-amber-700">High Priority</span>
                      ) : (
                        <span>Standard</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Selected Thread & AI Assisted Composer */}
        {currentMessage && (
          <div className="lg:col-span-7 space-y-6">
            {/* Conversation Header & Body */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
              <div className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-100 pb-4 mb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                      {currentMessage.tag.toUpperCase()}
                    </span>
                    <span className="text-xs text-slate-400">{currentMessage.timestamp}</span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900 mt-1">
                    {currentMessage.subject}
                  </h3>
                  <div className="flex items-center gap-2 mt-1 text-xs text-slate-500">
                    <User className="w-3.5 h-3.5 text-slate-400" />
                    <span>
                      From: <strong>{currentMessage.sender}</strong> ({currentMessage.senderEmail})
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleSummarizeThread}
                    disabled={isSummarizing}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-medium rounded-lg border border-blue-200 transition-colors"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                    <span>{isSummarizing ? 'Summarizing...' : 'Summarize Thread'}</span>
                  </button>

                  <button
                    onClick={() => {
                      setReminderSaved(true);
                      setTimeout(() => setReminderSaved(false), 2500);
                    }}
                    className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                    title="Set Follow-Up Reminder"
                  >
                    <BellRing className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Summary Snippet banner if generated */}
              {summarySnippet && (
                <div className="mb-4 p-3.5 rounded-xl bg-blue-50/80 border border-blue-200 text-xs text-blue-900">
                  <span className="font-bold block mb-1">AI Context Digest:</span>
                  <p>{summarySnippet}</p>
                </div>
              )}

              {reminderSaved && (
                <div className="mb-4 p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Follow-up reminder set for tomorrow 09:00 AM!</span>
                </div>
              )}

              {/* Message Body Content */}
              <div className="text-xs text-slate-700 whitespace-pre-wrap leading-relaxed bg-slate-50/40 p-4 rounded-xl border border-slate-100">
                {currentMessage.body}
              </div>

              {currentMessage.suggestedFollowUp && (
                <div className="mt-4 p-3 rounded-xl bg-amber-50/60 border border-amber-200 text-xs text-amber-900 flex items-start gap-2">
                  <Sparkles className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
                  <div>
                    <span className="font-semibold block">Suggested Next Action:</span>
                    <span>{currentMessage.suggestedFollowUp}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Assisted Reply Composer */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                  <Wand2 className="w-3.5 h-3.5 text-indigo-600" />
                  Reply with AI Assistance
                </h4>
                <div className="flex items-center gap-1 text-xs">
                  <span className="text-slate-400 mr-1 text-[11px]">Tone Rewriter:</span>
                  <button
                    onClick={() => handleRewrite('executive')}
                    disabled={isRewriting || !draftReply}
                    className="px-2.5 py-1 bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 text-slate-700 rounded-lg text-[11px] font-medium transition-colors"
                  >
                    Executive
                  </button>
                  <button
                    onClick={() => handleRewrite('concise')}
                    disabled={isRewriting || !draftReply}
                    className="px-2.5 py-1 bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 text-slate-700 rounded-lg text-[11px] font-medium transition-colors"
                  >
                    Concise
                  </button>
                  <button
                    onClick={() => handleRewrite('friendly')}
                    disabled={isRewriting || !draftReply}
                    className="px-2.5 py-1 bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 text-slate-700 rounded-lg text-[11px] font-medium transition-colors"
                  >
                    Friendly
                  </button>
                </div>
              </div>

              <textarea
                value={draftReply}
                onChange={(e) => setDraftReply(e.target.value)}
                rows={4}
                placeholder="Type your response draft, or click an AI tone button above to polish automatically..."
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-indigo-500 focus:bg-white resize-none leading-relaxed"
              />

              <div className="flex items-center justify-between mt-3 pt-2">
                <button
                  type="button"
                  onClick={() =>
                    setDraftReply(
                      `Hi ${currentMessage.sender.split(' ')[0]},\n\nThank you for the update. We have finalized the architecture document and verified our European cluster round-trip latency at 18ms. Looking forward to our discussion tomorrow.\n\nBest,\nAlex Rivera`
                    )
                  }
                  className="text-xs text-indigo-600 hover:text-indigo-800 font-medium"
                >
                  Insert template reply
                </button>

                <button
                  onClick={handleSendReply}
                  disabled={!draftReply.trim()}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send Response</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Compose Message Modal */}
      {isComposeOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-lg w-full p-6 animate-in fade-in duration-150">
            <h3 className="text-base font-bold text-slate-900 mb-1">New Message</h3>
            <p className="text-xs text-slate-500 mb-4">
              Compose a message to your team or external enterprise partners.
            </p>

            <form onSubmit={handleCreateNewMessage} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Recipient Name</label>
                  <input
                    type="text"
                    required
                    value={composeTo}
                    onChange={(e) => setComposeTo(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    value={composeEmail}
                    onChange={(e) => setComposeEmail(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Subject</label>
                <input
                  type="text"
                  required
                  value={composeSubject}
                  onChange={(e) => setComposeSubject(e.target.value)}
                  placeholder="e.g. Frankfurt Cluster Latency Benchmarks"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Message Body</label>
                <textarea
                  rows={5}
                  required
                  value={composeBody}
                  onChange={(e) => setComposeBody(e.target.value)}
                  placeholder="Type message content..."
                  className="w-full p-3 border border-slate-200 rounded-xl bg-slate-50 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsComposeOpen(false)}
                  className="px-3 py-2 text-slate-600 hover:text-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl"
                >
                  Send Message
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
