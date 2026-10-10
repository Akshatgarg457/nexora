import React, { useEffect, useState } from 'react';
import { studyApi } from '../services/api';
import { LearningResource, LearningProgress } from '../types';
import { BookOpen, Sparkles, CheckCircle2, FileText, Cpu, Server, Cloud, Shield, BarChart } from 'lucide-react';

export const StudyWorkspace: React.FC<{ currentUserId?: number }> = ({ currentUserId }) => {
  const [resources, setResources] = useState<LearningResource[]>([]);
  const [progresses, setProgresses] = useState<LearningProgress[]>([]);
  const [selectedResource, setSelectedResource] = useState<LearningResource | null>(null);
  const [videoNotes, setVideoNotes] = useState('');
  const [aiSummary, setAiSummary] = useState<string | null>(null);
  const [loadingAi, setLoadingAi] = useState(false);

  const activeUserId = currentUserId || 1;

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [resList, progList] = await Promise.all([
        studyApi.getResources(),
        studyApi.getProgress(activeUserId)
      ]);
      setResources(resList);
      setProgresses(progList);
      if (resList.length > 0) {
        setSelectedResource(resList[0]);
        const matched = progList.find((p) => p.resource.id === resList[0].id);
        if (matched) {
          setVideoNotes(matched.videoNotes || '');
          setAiSummary(matched.aiSummary || null);
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const getProgressForResource = (resId: number) => {
    return progresses.find((p) => p.resource.id === resId);
  };

  const handleUpdateProgress = async (pct: number) => {
    if (!selectedResource) return;
    try {
      await studyApi.updateProgress({
        employeeId: activeUserId,
        resourceId: selectedResource.id,
        progressPercentage: pct,
        videoNotes
      });
      loadData();
    } catch (err) {
      alert('Error updating progress');
    }
  };

  const handleGenerateSummary = async () => {
    if (!selectedResource) return;
    setLoadingAi(true);
    try {
      const updated = await studyApi.updateProgress({
        employeeId: activeUserId,
        resourceId: selectedResource.id,
        videoNotes,
        generateAiSummary: true
      });
      setAiSummary(updated.aiSummary || null);
    } catch (err) {
      alert('Error generating summary');
    } finally {
      setLoadingAi(false);
    }
  };

  const getCategoryIcon = (category: string) => {
    if (category.toLowerCase().includes('agent') || category.toLowerCase().includes('ai')) return Cpu;
    if (category.toLowerCase().includes('boot') || category.toLowerCase().includes('spring')) return Server;
    if (category.toLowerCase().includes('cloud')) return Cloud;
    if (category.toLowerCase().includes('cyber') || category.toLowerCase().includes('security')) return Shield;
    return BarChart;
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="pb-4 border-b border-slate-200">
        <h2 className="text-2xl font-bold font-heading text-slate-900 flex items-center gap-2">
          <BookOpen className="w-6 h-6 text-indigo-600" />
          <span>Study & Emerging Tech Workspace</span>
        </h2>
        <p className="text-xs text-slate-500">Discover technology paths, track learning progress, and summarize video notes</p>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Resource Cards List */}
        <div className="lg:col-span-1 space-y-3">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider px-1">Available Tech Paths</h3>
          {resources.map((res) => {
            const Icon = getCategoryIcon(res.category);
            const prog = getProgressForResource(res.id);
            const isSelected = selectedResource?.id === res.id;

            return (
              <div
                key={res.id}
                onClick={() => {
                  setSelectedResource(res);
                  setVideoNotes(prog?.videoNotes || '');
                  setAiSummary(prog?.aiSummary || null);
                }}
                className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-indigo-50/70 border-indigo-200 shadow-xs'
                    : 'bg-white border-slate-200 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-indigo-600 text-white">
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                      {res.category}
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-500 font-medium">{res.estimatedTime}</span>
                </div>
                <h4 className="text-xs font-bold text-slate-900">{res.title}</h4>
                <div className="mt-3 flex items-center justify-between text-[11px]">
                  <span className="text-slate-500">Progress: <strong>{prog?.progressPercentage || 0}%</strong></span>
                  <span className="text-indigo-600 font-semibold">{prog?.status || 'NOT_STARTED'}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Learning Detail & Video Notes Interface */}
        <div className="lg:col-span-2 space-y-6">
          {selectedResource ? (
            <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-6">
              <div className="border-b border-slate-100 pb-4 flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider">{selectedResource.category} • {selectedResource.level}</span>
                  <h3 className="text-xl font-bold font-heading text-slate-900 mt-1">{selectedResource.title}</h3>
                  <p className="text-xs text-slate-600 mt-1">{selectedResource.description}</p>
                </div>
                <button
                  onClick={() => handleUpdateProgress(100)}
                  className="px-3.5 py-1.5 bg-emerald-600 text-white rounded-xl text-xs font-bold flex items-center gap-1 hover:bg-emerald-700 transition-colors"
                >
                  <CheckCircle2 className="w-4 h-4" /> Mark Complete
                </button>
              </div>

              {/* Progress Setter */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-slate-900">
                  <span>Track Learning Progress</span>
                  <span className="text-indigo-600">{getProgressForResource(selectedResource.id)?.progressPercentage || 0}% Completed</span>
                </div>
                <div className="flex items-center gap-2">
                  {[25, 50, 75, 100].map((pct) => (
                    <button
                      key={pct}
                      onClick={() => handleUpdateProgress(pct)}
                      className="flex-1 py-1.5 text-xs font-bold rounded-xl border border-slate-200 hover:bg-indigo-50 hover:text-indigo-600 text-slate-700 transition-colors bg-white"
                    >
                      {pct}%
                    </button>
                  ))}
                </div>
              </div>

              {/* Course Transcript */}
              {selectedResource.sampleTranscript && (
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <h4 className="text-xs font-bold text-slate-900 mb-1 flex items-center gap-1">
                    <FileText className="w-4 h-4 text-indigo-600" /> Course Transcript
                  </h4>
                  <p className="text-xs text-slate-700 leading-relaxed italic">"{selectedResource.sampleTranscript}"</p>
                </div>
              )}

              {/* Video Notes */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-900 font-heading">Personal Study & Video Notes</label>
                  <button
                    onClick={handleGenerateSummary}
                    disabled={loadingAi}
                    className="px-3 py-1 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl flex items-center gap-1 transition-colors disabled:opacity-50"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{loadingAi ? 'Summarizing...' : 'Summarize Notes with AI'}</span>
                  </button>
                </div>
                <textarea
                  rows={4}
                  value={videoNotes}
                  onChange={(e) => setVideoNotes(e.target.value)}
                  placeholder="Take notes while watching the course video..."
                  className="w-full p-3.5 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/30 text-slate-900 font-medium"
                />
              </div>

              {/* AI Summary Output */}
              {aiSummary && (
                <div className="p-4 bg-indigo-50 border border-indigo-100 rounded-xl space-y-1 text-xs text-indigo-950 animate-in fade-in">
                  <div className="flex items-center gap-1.5 font-bold text-indigo-900">
                    <Sparkles className="w-4 h-4 text-indigo-600" />
                    <span>Generated AI Summary</span>
                  </div>
                  <p className="whitespace-pre-line leading-relaxed mt-2 text-slate-800 font-medium">{aiSummary}</p>
                </div>
              )}
            </div>
          ) : (
            <div className="p-12 text-center text-xs text-slate-400 bg-white rounded-2xl border border-slate-200">
              Select a learning path to view video course material
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
