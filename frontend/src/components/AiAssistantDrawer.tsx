import React, { useState } from 'react';
import { Bot, Send, X, Sparkles, ChevronRight } from 'lucide-react';
import { aiApi } from '../services/api';
import { useNavigate } from 'react-router-dom';

interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  targetWorkspace?: string;
  isSimulated?: boolean;
}

export const AiAssistantDrawer: React.FC<{ currentEmployeeId?: number }> = ({ currentEmployeeId }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'ai',
      text: 'Hello! I am your Nexora AI Assistant. How can I assist your enterprise workspace today?',
      isSimulated: true
    }
  ]);

  const navigate = useNavigate();

  const prompts = [
    "Prepare me for my next meeting.",
    "Show overdue project tasks.",
    "Help me learn AI agents.",
    "Summarize the latest project status.",
    "Show our project completion metrics."
  ];

  const handleSend = async (customPrompt?: string) => {
    const textToSend = customPrompt || input;
    if (!textToSend.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: textToSend
    };
    setMessages((prev) => [...prev, userMsg]);
    if (!customPrompt) setInput('');
    setLoading(true);

    try {
      const res = await aiApi.query(textToSend, currentEmployeeId);
      const aiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: res.response,
        targetWorkspace: res.targetWorkspace,
        isSimulated: res.isSimulated
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          sender: 'ai',
          text: '[Nexora AI]: I encountered an error connecting to the backend service. Please check your connection.',
          isSimulated: true
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const navigateToWorkspace = (workspaceKey?: string) => {
    if (!workspaceKey) return;
    const paths: Record<string, string> = {
      MEETINGS: '/app/meetings',
      COMMUNICATION: '/app/communication',
      STUDY: '/app/study',
      PROJECTS: '/app/projects',
      ANALYTICS: '/app/analytics'
    };
    if (paths[workspaceKey]) {
      navigate(paths[workspaceKey]);
      setIsOpen(false);
    }
  };

  return (
    <>
      {/* Floating Action Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-full bg-slate-900 text-white font-bold text-xs shadow-xl hover:bg-indigo-600 transition-all"
      >
        <Bot className="w-5 h-5 text-indigo-400" />
        <span className="hidden sm:inline font-heading">Nexora AI</span>
      </button>

      {/* Chat Drawer */}
      {isOpen && (
        <div className="fixed bottom-20 right-6 z-50 w-96 max-w-[calc(100vw-3rem)] bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col h-[520px] animate-in slide-in-from-bottom-5 duration-200">
          {/* Header */}
          <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center font-bold">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <div>
                <h3 className="text-xs font-bold font-heading">Nexora AI Assistant</h3>
                <span className="text-[10px] text-slate-400 font-medium">Enterprise Assistant Service</span>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50/50 text-xs">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[85%] p-3 rounded-2xl ${
                    m.sender === 'user'
                      ? 'bg-indigo-600 text-white rounded-tr-none'
                      : 'bg-white border border-slate-200 text-slate-900 shadow-xs rounded-tl-none'
                  }`}
                >
                  <p className="whitespace-pre-line leading-relaxed">{m.text}</p>
                  {m.isSimulated && m.sender === 'ai' && (
                    <span className="inline-block mt-1.5 text-[9px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 font-semibold border border-slate-200">
                      Isolated Assistant Service
                    </span>
                  )}
                  {m.targetWorkspace && (
                    <button
                      onClick={() => navigateToWorkspace(m.targetWorkspace)}
                      className="mt-2 text-[11px] flex items-center gap-1 font-semibold text-indigo-600 hover:underline"
                    >
                      Open {m.targetWorkspace} Workspace <ChevronRight className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex items-center gap-2 text-xs text-indigo-600 font-medium p-2">
                <Sparkles className="w-4 h-4 animate-spin" />
                <span>Processing query...</span>
              </div>
            )}
          </div>

          {/* Example Prompt Chips */}
          <div className="px-3 py-2 bg-slate-100/80 border-t border-slate-200 overflow-x-auto whitespace-nowrap flex gap-1.5 scrollbar-none">
            {prompts.map((p, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(p)}
                className="text-[10px] px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 font-medium shrink-0 transition-colors"
              >
                {p}
              </button>
            ))}
          </div>

          {/* Input Box */}
          <div className="p-3 bg-white border-t border-slate-200 flex items-center gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask Nexora AI anything..."
              className="flex-1 px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/30 text-slate-900"
            />
            <button
              onClick={() => handleSend()}
              disabled={loading || !input.trim()}
              className="p-2 rounded-xl bg-indigo-600 text-white disabled:opacity-50 hover:bg-indigo-700 transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </>
  );
};
