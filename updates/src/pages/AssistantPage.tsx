import React, { useState } from 'react';
import { useWorkspace } from '../context/WorkspaceContext';
import { assistantApi } from '../api/assistantApi';
import {
  Bot,
  Send,
  Sparkles,
  RotateCcw,
  Compass,
  ArrowRight,
  Calendar,
  MessageSquare,
  GraduationCap,
  KanbanSquare,
  BarChart3,
  CheckCircle2,
} from 'lucide-react';

export const AssistantPage: React.FC = () => {
  const {
    chatMessages,
    addChatMessage,
    clearChat,
    adaptWorkspace,
  } = useWorkspace();

  const [inputVal, setInputVal] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const suggestedPrompts = [
    { label: 'Client Meeting Prep', prompt: "Prepare for tomorrow's client meeting.", icon: Calendar },
    { label: 'Summarize Messages', prompt: 'Summarize my unread messages and help me reply.', icon: MessageSquare },
    { label: 'Study Operating Systems', prompt: 'Help me study operating systems and deadlocks.', icon: GraduationCap },
    { label: 'Review Overdue Tasks', prompt: 'Show overdue project tasks and blockers.', icon: KanbanSquare },
    { label: 'Investigate Usage Drop', prompt: 'Investigate why active users have declined.', icon: BarChart3 },
    { label: 'Platform Guidance', prompt: 'How can Nexora help me manage my work?', icon: Bot },
  ];

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputVal.trim() || isLoading) return;

    const userText = inputVal.trim();
    setInputVal('');

    addChatMessage({
      id: `cm-${Date.now()}`,
      sender: 'user',
      content: userText,
      timestamp: 'Just now',
    });

    setIsLoading(true);
    try {
      const response = await assistantApi.sendMessage(userText);
      addChatMessage(response);
    } catch {
      addChatMessage({
        id: `cm-err-${Date.now()}`,
        sender: 'assistant',
        content: 'Failed to process request. Please try again.',
        timestamp: 'Just now',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold text-rose-600 uppercase tracking-wider block mb-1">
            AI Assistant Workspace
          </span>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Conversational Workspace Copilot
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Discuss priorities, generate executive drafts, analyze metrics, and trigger real-time workspace adaptations.
          </p>
        </div>

        <button
          onClick={clearChat}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium rounded-xl transition-colors self-start sm:self-auto"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Clear History</span>
        </button>
      </div>

      {/* Suggested Quick Starters Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {suggestedPrompts.map((sp, idx) => {
          const Icon = sp.icon;
          return (
            <button
              key={idx}
              onClick={() => {
                setInputVal(sp.prompt);
              }}
              className="p-3 bg-white hover:bg-slate-50 border border-slate-200 hover:border-indigo-300 rounded-xl text-left transition-all group"
            >
              <Icon className="w-4 h-4 text-indigo-600 mb-1.5 group-hover:scale-105 transition-transform" />
              <span className="text-xs font-bold text-slate-800 block truncate">
                {sp.label}
              </span>
              <span className="text-[10px] text-slate-400 block truncate mt-0.5">
                {sp.prompt}
              </span>
            </button>
          );
        })}
      </div>

      {/* Main Chat Conversation Container */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs flex flex-col h-[520px]">
        {/* Messages Scroll Area */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {chatMessages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 max-w-3xl ${
                msg.sender === 'user' ? 'ml-auto flex-row-reverse' : ''
              }`}
            >
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                  msg.sender === 'user'
                    ? 'bg-slate-800 text-white'
                    : 'bg-indigo-600 text-white shadow-xs'
                }`}
              >
                {msg.sender === 'user' ? (
                  <span className="text-xs font-bold">You</span>
                ) : (
                  <Bot className="w-4 h-4" />
                )}
              </div>

              <div className="space-y-1">
                <div
                  className={`p-4 rounded-2xl text-xs leading-relaxed whitespace-pre-wrap ${
                    msg.sender === 'user'
                      ? 'bg-indigo-600 text-white rounded-tr-xs'
                      : 'bg-slate-50 border border-slate-200/80 text-slate-800 rounded-tl-xs'
                  }`}
                >
                  {msg.content}
                </div>

                {/* Adaptive action trigger chip */}
                {msg.relatedWorkspace && (
                  <div className="pt-1">
                    <button
                      onClick={() => adaptWorkspace(msg.content.slice(0, 60))}
                      className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-medium rounded-lg border border-indigo-200 transition-colors"
                    >
                      <Compass className="w-3.5 h-3.5 text-indigo-600" />
                      <span>Reshape Interface for this Intent</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                )}

                <span className="text-[10px] text-slate-400 block px-1">
                  {msg.timestamp}
                </span>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex gap-3 max-w-lg">
              <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center">
                <Bot className="w-4 h-4" />
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-500 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-500 animate-spin" />
                <span>Nexora assistant is analyzing context...</span>
              </div>
            </div>
          )}
        </div>

        {/* Chat Input Bar */}
        <form
          onSubmit={handleSend}
          className="p-4 border-t border-slate-200 bg-slate-50/50 rounded-b-2xl"
        >
          <div className="flex items-center rounded-xl bg-white border border-slate-200 px-4 py-2.5 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-100 transition-all">
            <input
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              placeholder="Ask a question, request a draft, or describe what you want to achieve..."
              className="flex-1 bg-transparent text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none"
            />
            <button
              type="submit"
              disabled={!inputVal.trim() || isLoading}
              className="p-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white rounded-lg transition-colors ml-2"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
          <p className="text-[11px] text-slate-400 mt-2 text-center">
            Simulated AI assistant engine. Ready for Spring Boot REST AI endpoint streaming integration.
          </p>
        </form>
      </div>
    </div>
  );
};
