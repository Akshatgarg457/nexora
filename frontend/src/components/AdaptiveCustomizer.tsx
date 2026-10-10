import React, { useState } from 'react';
import { Sparkles, Sliders, CheckCircle2 } from 'lucide-react';
import { preferencesApi } from '../services/api';

interface AdaptiveCustomizerProps {
  employeeId?: number;
  onCustomized: (workspaces: string[], explanation: string) => void;
}

export const AdaptiveCustomizer: React.FC<AdaptiveCustomizerProps> = ({ employeeId, onCustomized }) => {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [explanation, setExplanation] = useState<string | null>(null);

  const presets = [
    "Customize my workspace for project management and technology learning.",
    "Prioritize upcoming meeting schedules and direct team chat.",
    "Focus my dashboard on company business analytics and KPIs."
  ];

  const handleCustomize = async (customText?: string) => {
    const textToSubmit = customText || prompt;
    if (!textToSubmit.trim() || loading) return;

    setLoading(true);
    try {
      const res = await preferencesApi.customize(employeeId || 1, textToSubmit);
      setExplanation(res.explanationText);
      onCustomized(res.prioritizedWorkspaces, res.explanationText);
    } catch {
      const fallbackExplanation = "Your workspace prioritizes project tracking and technology learning based on your selected goals.";
      const fallbackOrder = ["PROJECTS", "STUDY", "MEETINGS", "COMMUNICATION", "ANALYTICS"];
      setExplanation(fallbackExplanation);
      onCustomized(fallbackOrder, fallbackExplanation);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs mb-6">
      <div className="flex items-center gap-2.5 mb-2">
        <div className="p-1.5 rounded-lg bg-indigo-600 text-white">
          <Sliders className="w-4 h-4" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-slate-900 font-heading">Adaptive Workspace Personalization</h3>
          <p className="text-[11px] text-slate-500">Reorder main dashboard cards using natural language intents</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-2.5 mt-3">
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleCustomize()}
          placeholder='e.g., "Customize my workspace for project management and technology learning."'
          className="flex-1 px-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/30 text-slate-900 font-medium"
        />
        <button
          onClick={() => handleCustomize()}
          disabled={loading || !prompt.trim()}
          className="px-5 py-2.5 bg-indigo-600 text-white text-xs font-semibold rounded-xl hover:bg-indigo-700 disabled:opacity-50 flex items-center justify-center gap-2 shrink-0 transition-colors"
        >
          <Sparkles className="w-4 h-4" />
          <span>{loading ? 'Adapting...' : 'Personalize Layout'}</span>
        </button>
      </div>

      {/* Quick Presets */}
      <div className="mt-2.5 flex flex-wrap gap-2">
        {presets.map((preset, i) => (
          <button
            key={i}
            onClick={() => {
              setPrompt(preset);
              handleCustomize(preset);
            }}
            className="text-[10px] px-2.5 py-1 bg-slate-50 border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-100 font-medium transition-colors"
          >
            "{preset}"
          </button>
        ))}
      </div>

      {/* Explanation Banner */}
      {explanation && (
        <div className="mt-3 p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-start gap-2.5 text-xs text-emerald-900 animate-in fade-in duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
          <p className="font-medium">{explanation}</p>
        </div>
      )}
    </div>
  );
};
