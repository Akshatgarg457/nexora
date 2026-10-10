import React, { useState } from 'react';
import { useWorkspace } from '../../context/WorkspaceContext';
import { Sparkles, ArrowRight, X, Compass, CheckCircle2, RotateCcw } from 'lucide-react';

const SUGGESTED_PROMPTS = [
  "Prepare for tomorrow's client meeting.",
  "Summarize my unread messages.",
  "Help me study operating systems.",
  "Review overdue project tasks.",
  "Investigate declining product usage.",
];

export const AdaptiveIntentBar: React.FC = () => {
  const {
    currentIntentText,
    adaptWorkspace,
    activeAdaptiveConfig,
    clearAdaptation,
    isAdapting,
    showExplanation,
    setShowExplanation,
  } = useWorkspace();

  const [inputVal, setInputVal] = useState(currentIntentText || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputVal.trim()) {
      adaptWorkspace(inputVal);
    }
  };

  const handleSelectPrompt = (prompt: string) => {
    setInputVal(prompt);
    adaptWorkspace(prompt);
  };

  return (
    <div className="w-full nx-card p-5 sm:p-6 transition-all relative overflow-hidden shadow-card">
      {/* Micro accent top hairline */}
      <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[var(--accent-primary)] to-transparent opacity-60" />

      <div className="flex items-center justify-between gap-3 mb-3.5">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl nx-btn-primary flex items-center justify-center font-bold shadow-xs shrink-0">
            <Compass className="w-4 h-4 text-white" />
          </div>
          <div className="flex items-baseline gap-2">
            <h2 className="text-sm font-bold text-[var(--ink-primary)] tracking-tight">
              Adaptive Intent Engine
            </h2>
            {activeAdaptiveConfig && (
              <span className="text-[11px] font-semibold text-[var(--accent-primary)]">
                · Reshaped for "{activeAdaptiveConfig.detectedIntent}"
              </span>
            )}
          </div>
        </div>

        {activeAdaptiveConfig && (
          <div className="flex items-center gap-2 text-xs">
            <button
              onClick={() => setShowExplanation(!showExplanation)}
              className="font-semibold text-[var(--accent-primary)] hover:opacity-80 px-2.5 py-1 rounded-lg hover:bg-[var(--surface-secondary)] transition-colors"
            >
              {showExplanation ? 'Hide Rationale' : 'Why this workspace?'}
            </button>
            <span className="text-[var(--ink-tertiary)]" aria-hidden="true">·</span>
            <button
              onClick={() => {
                clearAdaptation();
                setInputVal('');
              }}
              title="Return to default overview"
              className="inline-flex items-center gap-1 text-[var(--ink-tertiary)] hover:text-[var(--ink-primary)] px-2 py-1 rounded-lg hover:bg-[var(--surface-secondary)] transition-colors"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="relative">
        <div className="relative flex items-center rounded-xl bg-[var(--surface-secondary)] border border-[var(--border-subtle)] focus-within:border-[var(--accent-primary)] focus-within:ring-2 focus-within:ring-[var(--accent-primary)]/20 transition-all">
          <Sparkles className="w-4 h-4 text-[var(--accent-primary)] ml-4 shrink-0" />
          <input
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            placeholder="What would you like to accomplish today?"
            className="w-full py-3.5 px-3 bg-transparent text-xs sm:text-sm font-medium text-[var(--ink-primary)] placeholder:text-[var(--ink-tertiary)] focus:outline-none"
          />

          {inputVal && (
            <button
              type="button"
              onClick={() => setInputVal('')}
              className="p-1 mr-1 text-[var(--ink-tertiary)] hover:text-[var(--ink-primary)] rounded-full"
            >
              <X className="w-4 h-4" />
            </button>
          )}

          <div className="pr-2 flex items-center gap-1.5">
            <button
              type="submit"
              disabled={isAdapting || !inputVal.trim()}
              className="inline-flex items-center gap-1.5 px-4 py-2 nx-btn-primary disabled:opacity-40 text-xs font-semibold rounded-lg shadow-xs transition-all active:scale-98 whitespace-nowrap shrink-0"
            >
              <span>{isAdapting ? 'Reshaping...' : 'Adapt Workspace'}</span>
              <ArrowRight className="w-3.5 h-3.5 text-white/80" />
            </button>
          </div>
        </div>
      </form>

      {/* Suggested prompts strip with clean segmented styling */}
      <div className="mt-3.5 flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        <span className="font-semibold text-[var(--ink-tertiary)] shrink-0 text-[11px] tracking-wide uppercase">
          Suggested Goals:
        </span>
        <div className="flex items-center gap-1.5 flex-nowrap">
          {SUGGESTED_PROMPTS.map((prompt, idx) => {
            const isSelected = currentIntentText === prompt;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => handleSelectPrompt(prompt)}
                className={`whitespace-nowrap px-3 py-1.5 rounded-lg border text-xs font-medium transition-all ${
                  isSelected
                    ? 'nx-btn-primary border-transparent shadow-xs'
                    : 'bg-[var(--surface-secondary)] hover:bg-[var(--surface-secondary)]/80 text-[var(--ink-secondary)] hover:text-[var(--ink-primary)] border-[var(--border-subtle)]'
                }`}
              >
                {prompt}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
