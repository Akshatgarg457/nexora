import React, { useState } from 'react';
import { useWorkspace } from '../../context/WorkspaceContext';
import { assistantApi } from '../../api/assistantApi';
import {
  X,
  Bot,
  Send,
  Sparkles,
  ArrowRight,
  Maximize2,
  RotateCcw,
  Compass,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const AssistantSlideOver: React.FC = () => {
  const {
    isAssistantOpen,
    setIsAssistantOpen,
    chatMessages,
    addChatMessage,
    clearChat,
    adaptWorkspace,
    activeWorkspace,
  } = useWorkspace();

  const [inputVal, setInputVal] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  if (!isAssistantOpen) return null;

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputVal.trim() || isLoading) return;

    const userText = inputVal.trim();
    setInputVal('');

    // Append user message
    addChatMessage({
      id: `cm-${Date.now()}`,
      sender: 'user',
      content: userText,
      timestamp: 'Just now',
    });

    setIsLoading(true);

    try {
      const response = await assistantApi.sendMessage(userText, activeWorkspace);
      addChatMessage(response);
    } catch {
      addChatMessage({
        id: `cm-err-${Date.now()}`,
        sender: 'assistant',
        content: 'I could not process that request. Let me know if you would like me to adapt your workspace instead.',
        timestamp: 'Just now',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickPrompt = (prompt: string) => {
    setInputVal(prompt);
  };

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-96 bg-[var(--surface)] border-l border-[var(--border-subtle)] shadow-2xl flex flex-col transition-all animate-in slide-in-from-right duration-200">
      {/* Header */}
      <div className="h-16 px-4 border-b border-[var(--border-subtle)] flex items-center justify-between bg-[var(--surface-secondary)]/70">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl nx-btn-primary flex items-center justify-center shadow-xs">
            <Bot className="w-4 h-4 text-white" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-[var(--ink-primary)] leading-none">
              Nexora AI Copilot
            </h3>
            <span className="text-[11px] text-[var(--ink-tertiary)] mt-1 block">
              Context-Aware Assistant
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => {
              setIsAssistantOpen(false);
              navigate('/app/assistant');
            }}
            title="Expand to Full Page"
            className="p-1.5 text-[var(--ink-tertiary)] hover:text-[var(--ink-primary)] hover:bg-[var(--surface-secondary)] rounded-lg transition-colors"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
          <button
            onClick={clearChat}
            title="Clear Chat"
            className="p-1.5 text-[var(--ink-tertiary)] hover:text-[var(--ink-primary)] hover:bg-[var(--surface-secondary)] rounded-lg transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          <button
            onClick={() => setIsAssistantOpen(false)}
            className="p-1.5 text-[var(--ink-tertiary)] hover:text-[var(--ink-primary)] hover:bg-[var(--surface-secondary)] rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3.5 text-xs">
        {chatMessages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${
              msg.sender === 'user' ? 'items-end' : 'items-start'
            }`}
          >
            <div
              className={`max-w-[88%] rounded-2xl p-3 leading-relaxed whitespace-pre-wrap ${
                msg.sender === 'user'
                  ? 'nx-btn-primary rounded-br-xs'
                  : 'bg-[var(--surface-secondary)] text-[var(--ink-primary)] rounded-bl-xs border border-[var(--border-subtle)]'
              }`}
            >
              {msg.content}
            </div>

            {/* Contextual Action Button if related to workspace */}
            {msg.relatedWorkspace && (
              <button
                onClick={() => {
                  adaptWorkspace(msg.content.slice(0, 50));
                  setIsAssistantOpen(false);
                }}
                className="mt-1.5 inline-flex items-center gap-1 text-[11px] font-semibold text-[var(--accent-primary)] hover:opacity-80 bg-[var(--surface-secondary)] px-2 py-1 rounded-md border border-[var(--border-subtle)]"
              >
                <Compass className="w-3 h-3" />
                <span>Adapt to this Goal</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            )}

            <span className="text-[10px] text-[var(--ink-tertiary)] mt-1 px-1">
              {msg.timestamp}
            </span>
          </div>
        ))}

        {isLoading && (
          <div className="flex items-center gap-2 p-3 bg-[var(--surface-secondary)] rounded-2xl max-w-[80%] text-[var(--ink-secondary)] border border-[var(--border-subtle)]">
            <Sparkles className="w-4 h-4 text-[var(--accent-primary)] animate-spin" />
            <span className="text-xs">Analyzing intent & synthesizing...</span>
          </div>
        )}
      </div>

      {/* Suggested chips */}
      <div className="px-3 pt-2 pb-1 border-t border-[var(--border-subtle)] flex items-center gap-1.5 overflow-x-auto text-[11px]">
        <button
          onClick={() => handleQuickPrompt("Prepare for tomorrow's client meeting.")}
          className="whitespace-nowrap px-2 py-1 rounded-md bg-[var(--surface-secondary)] hover:bg-[var(--surface-secondary)]/80 text-[var(--ink-secondary)] hover:text-[var(--ink-primary)] border border-[var(--border-subtle)]"
        >
          Meeting Prep
        </button>
        <button
          onClick={() => handleQuickPrompt('Summarize unread messages')}
          className="whitespace-nowrap px-2 py-1 rounded-md bg-[var(--surface-secondary)] hover:bg-[var(--surface-secondary)]/80 text-[var(--ink-secondary)] hover:text-[var(--ink-primary)] border border-[var(--border-subtle)]"
        >
          Triage Inbox
        </button>
        <button
          onClick={() => handleQuickPrompt('Review overdue tasks')}
          className="whitespace-nowrap px-2 py-1 rounded-md bg-[var(--surface-secondary)] hover:bg-[var(--surface-secondary)]/80 text-[var(--ink-secondary)] hover:text-[var(--ink-primary)] border border-[var(--border-subtle)]"
        >
          Check Tasks
        </button>
      </div>

      {/* Input Form */}
      <form onSubmit={handleSend} className="p-3 border-t border-[var(--border-subtle)] bg-[var(--surface)]">
        <div className="flex items-center rounded-xl bg-[var(--surface-secondary)] border border-[var(--border-subtle)] px-3 py-1.5 focus-within:border-[var(--accent-primary)] focus-within:ring-1 focus-within:ring-[var(--accent-primary)] transition-all">
          <input
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            placeholder="Ask Nexora or describe your intent..."
            className="flex-1 bg-transparent py-1.5 text-xs text-[var(--ink-primary)] placeholder:text-[var(--ink-tertiary)] focus:outline-none"
          />
          <button
            type="submit"
            disabled={!inputVal.trim() || isLoading}
            className="p-1.5 nx-btn-primary disabled:opacity-40 text-white rounded-lg transition-colors ml-1"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>
      </form>
    </div>
  );
};
