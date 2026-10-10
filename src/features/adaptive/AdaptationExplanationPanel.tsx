import React from 'react';
import { useWorkspace } from '../../context/WorkspaceContext';
import {
  Lightbulb,
  CheckCircle,
  Layers,
  ChevronUp,
  ArrowUpRight,
  ShieldCheck,
  Zap,
} from 'lucide-react';

export const AdaptationExplanationPanel: React.FC = () => {
  const {
    activeAdaptiveConfig,
    showExplanation,
    setShowExplanation,
    clearAdaptation,
    setIsAssistantOpen,
  } = useWorkspace();

  if (!activeAdaptiveConfig || !showExplanation) {
    return null;
  }

  const { detectedIntent, confidence, explanation, targetWorkspace } = activeAdaptiveConfig;

  return (
    <div className="w-full nx-card p-5 sm:p-6 shadow-card transition-all animate-in fade-in slide-in-from-top-1 duration-200 border-l-4 border-l-[var(--accent-primary)]">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-500 border border-amber-500/20 flex items-center justify-center shrink-0 shadow-xs mt-0.5">
            <Lightbulb className="w-4 h-4 text-amber-400" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1 text-xs font-medium">
              <span className="font-bold text-[var(--ink-primary)] uppercase tracking-wider text-[10px]">
                Adaptive Intent Rationale
              </span>
              <span aria-hidden="true" className="text-[var(--border-subtle)]">·</span>
              <span className="flex items-center gap-1 text-[var(--accent-primary)]">
                <ShieldCheck className="w-3.5 h-3.5" />
                Confidence: <strong className="font-mono tabular-nums">{Math.round(confidence * 100)}%</strong>
              </span>
              <span aria-hidden="true" className="text-[var(--border-subtle)]">·</span>
              <span className="text-[var(--ink-secondary)]">
                Target: <strong className="text-[var(--ink-primary)] capitalize">{targetWorkspace} Workspace</strong>
              </span>
            </div>
            <h3 className="text-base font-bold text-[var(--ink-primary)] tracking-tight leading-snug">
              {detectedIntent}
            </h3>
            <p className="text-xs text-[var(--ink-secondary)] mt-1 max-w-3xl leading-relaxed">
              {explanation.rationale}
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowExplanation(false)}
          className="p-1.5 text-[var(--ink-tertiary)] hover:text-[var(--ink-primary)] hover:bg-[var(--surface-secondary)] rounded-lg transition-colors shrink-0"
          title="Minimize explanation"
        >
          <ChevronUp className="w-4 h-4" />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5 pt-4 border-t border-[var(--border-subtle)] text-xs">
        {/* Prioritized Widgets */}
        <div className="bg-[var(--surface-secondary)] rounded-xl p-3.5 border border-[var(--border-subtle)]">
          <h4 className="font-bold text-[var(--ink-primary)] flex items-center gap-1.5 mb-2.5">
            <Layers className="w-3.5 h-3.5 text-[var(--accent-primary)]" />
            Widgets Brought Into Primary Focus
          </h4>
          <ul className="space-y-1.5 text-[var(--ink-secondary)]">
            {explanation.prioritizedWidgets.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <CheckCircle className="w-3.5 h-3.5 text-teal-500 mt-0.5 shrink-0" />
                <span className="font-medium text-[var(--ink-primary)]">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Suggested Next Steps */}
        <div className="bg-[var(--surface-secondary)] rounded-xl p-3.5 border border-[var(--border-subtle)]">
          <h4 className="font-bold text-[var(--ink-primary)] flex items-center gap-1.5 mb-2.5">
            <Zap className="w-3.5 h-3.5 text-amber-500" />
            Suggested Contextual Actions
          </h4>
          <ul className="space-y-1.5 text-[var(--ink-secondary)]">
            {explanation.suggestedNextSteps.map((step, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-primary)] mt-1.5 shrink-0" />
                <span>{step}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-4 pt-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs border-t border-[var(--border-subtle)]">
        <span className="text-[11px] text-[var(--ink-tertiary)]">
          Transparent AI: Nexora explains its adaptation decisions so you always retain full control.
        </span>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsAssistantOpen(true)}
            className="text-[var(--accent-primary)] hover:opacity-80 font-semibold inline-flex items-center gap-1"
          >
            <span>Ask Nexora Assistant</span>
            <ArrowUpRight className="w-3 h-3" />
          </button>
          <span className="text-[var(--border-subtle)]">·</span>
          <button
            onClick={clearAdaptation}
            className="text-[var(--ink-tertiary)] hover:text-[var(--ink-primary)]"
          >
            Dismiss
          </button>
        </div>
      </div>
    </div>
  );
};
