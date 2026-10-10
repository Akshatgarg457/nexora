import React, { useState } from 'react';
import { useWorkspace } from '../context/WorkspaceContext';
import {
  GraduationCap,
  Flame,
  Award,
  CheckCircle2,
  CheckSquare,
  Square,
  HelpCircle,
  RotateCw,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';

export const StudyWorkspacePage: React.FC = () => {
  const {
    courses,
    selectedCourseId,
    setSelectedCourseId,
    toggleTopicCompletion,
    activeAdaptiveConfig,
  } = useWorkspace();

  const currentCourse =
    courses.find((c) => c.id === selectedCourseId) || courses[0];

  // Quiz State
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [quizScore, setQuizScore] = useState<{ [qId: string]: boolean }>({});

  // Flashcard State
  const [flashcardIndex, setFlashcardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  const currentQuestion = currentCourse.quizzes[currentQuizIndex] || currentCourse.quizzes[0];
  const currentCard = currentCourse.flashcards[flashcardIndex] || currentCourse.flashcards[0];

  const handleSelectAnswer = (optionIdx: number) => {
    if (showExplanation) return;
    setSelectedOption(optionIdx);
    setShowExplanation(true);
    const isCorrect = optionIdx === currentQuestion.correctIndex;
    setQuizScore((prev) => ({ ...prev, [currentQuestion.id]: isCorrect }));
  };

  const handleNextQuestion = () => {
    setSelectedOption(null);
    setShowExplanation(false);
    if (currentQuizIndex < currentCourse.quizzes.length - 1) {
      setCurrentQuizIndex(currentQuizIndex + 1);
    } else {
      setCurrentQuizIndex(0);
    }
  };

  const handleCycleFlashcard = (direction: 'next' | 'prev') => {
    setIsFlipped(false);
    if (direction === 'next') {
      setFlashcardIndex((prev) => (prev + 1) % currentCourse.flashcards.length);
    } else {
      setFlashcardIndex((prev) =>
        prev === 0 ? currentCourse.flashcards.length - 1 : prev - 1
      );
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold text-teal-600 uppercase tracking-wider block mb-1">
            Study Workspace
          </span>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Active Recall & Exam Mastery
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Target high-yield concepts with spaced repetition flashcards and diagnostic self-assessment tests.
          </p>
        </div>

        {/* Streak & Score Counter */}
        <div className="flex items-center gap-3">
          <div className="px-3.5 py-2 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 flex items-center gap-2">
            <Flame className="w-5 h-5 text-amber-500 fill-amber-500 animate-pulse" />
            <div>
              <span className="text-xs font-bold block leading-none">
                {currentCourse.streakDays} Day Streak!
              </span>
              <span className="text-[10px] text-amber-700">Top 5% Consistency</span>
            </div>
          </div>
        </div>
      </div>

      {/* Course Switcher Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        {courses.map((course) => (
          <button
            key={course.id}
            onClick={() => {
              setSelectedCourseId(course.id);
              setCurrentQuizIndex(0);
              setSelectedOption(null);
              setShowExplanation(false);
              setFlashcardIndex(0);
              setIsFlipped(false);
            }}
            className={`px-4 py-2.5 rounded-xl font-semibold transition-all border flex items-center gap-2.5 shrink-0 ${
              course.id === currentCourse.id
                ? 'bg-slate-950 text-white border-slate-950 shadow-xs'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>{course.title}</span>
            <span aria-hidden="true" className={course.id === currentCourse.id ? 'text-slate-500' : 'text-slate-300'}>·</span>
            <span className="font-mono tabular-nums text-xs">
              {course.progressPercent}%
            </span>
          </button>
        ))}
      </div>

      {/* Main Grid: Interactive Quiz (2 Cols) + Flashcards & Topics (1 Col) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Interactive Quiz Component (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-teal-600" />
                <h3 className="text-sm font-bold text-slate-900">
                  Diagnostic Quiz — Question {currentQuizIndex + 1} of {currentCourse.quizzes.length}
                </h3>
              </div>
              <span className="text-xs font-semibold text-slate-500">
                Score: {Object.values(quizScore).filter(Boolean).length} / {Object.keys(quizScore).length}
              </span>
            </div>

            {/* Question Text */}
            <h4 className="text-sm font-semibold text-slate-800 leading-snug mb-5">
              {currentQuestion.question}
            </h4>

            {/* Answer Options */}
            <div className="space-y-2.5 text-xs">
              {currentQuestion.options.map((opt, idx) => {
                const isSelected = selectedOption === idx;
                const isCorrect = idx === currentQuestion.correctIndex;

                let btnStyle = 'border-slate-200 bg-slate-50/50 hover:bg-slate-100 text-slate-700';

                if (showExplanation) {
                  if (isCorrect) {
                    btnStyle = 'border-emerald-500 bg-emerald-50 text-emerald-900 font-semibold ring-1 ring-emerald-400';
                  } else if (isSelected) {
                    btnStyle = 'border-rose-400 bg-rose-50 text-rose-800 font-semibold';
                  } else {
                    btnStyle = 'border-slate-200 bg-slate-50 opacity-60 text-slate-500';
                  }
                }

                return (
                  <button
                    key={idx}
                    onClick={() => handleSelectAnswer(idx)}
                    disabled={showExplanation}
                    className={`w-full p-3 rounded-xl border text-left transition-all flex items-start gap-3 ${btnStyle}`}
                  >
                    <span className="w-5 h-5 rounded-md bg-white border border-slate-200 flex items-center justify-center font-bold text-[11px] shrink-0">
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span className="flex-1 leading-relaxed">{opt}</span>
                  </button>
                );
              })}
            </div>

            {/* Explanation Display */}
            {showExplanation && (
              <div className="mt-5 p-4 rounded-xl bg-teal-50/80 border border-teal-200 text-xs animate-in fade-in">
                <div className="flex items-center gap-1.5 font-bold text-teal-900 mb-1">
                  <Sparkles className="w-4 h-4 text-teal-600" />
                  <span>
                    {selectedOption === currentQuestion.correctIndex
                      ? 'Correct Answer!'
                      : 'Incorrect — Key Insight:'}
                  </span>
                </div>
                <p className="text-teal-950 leading-relaxed">
                  {currentQuestion.explanation}
                </p>

                <div className="mt-3 pt-2 flex justify-end">
                  <button
                    onClick={handleNextQuestion}
                    className="px-3.5 py-1.5 bg-teal-700 hover:bg-teal-800 text-white rounded-lg font-semibold text-xs flex items-center gap-1"
                  >
                    <span>Next Question</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Progress Tracker Bar */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="font-bold text-slate-800">Syllabus Mastery Progress</span>
              <span className="font-bold text-teal-700">{currentCourse.progressPercent}%</span>
            </div>
            <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-teal-600 rounded-full transition-all duration-500"
                style={{ width: `${currentCourse.progressPercent}%` }}
              />
            </div>
            <div className="mt-3 flex items-center justify-between text-[11px] text-slate-400">
              <span>Next Assessment: {currentCourse.nextAssessmentDate}</span>
              <span>
                {currentCourse.topics.filter((t) => t.completed).length} / {currentCourse.topics.length} topics finished
              </span>
            </div>
          </div>
        </div>

        {/* Right Column: Active Recall Flashcard + Topics Checklist (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Interactive Flashcard */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <RotateCw className="w-3.5 h-3.5 text-teal-600" />
                Active Recall Flashcards
              </h4>
              <span className="text-[11px] text-slate-400">
                Card {flashcardIndex + 1} of {currentCourse.flashcards.length}
              </span>
            </div>

            {/* Flashcard Box */}
            <div
              onClick={() => setIsFlipped(!isFlipped)}
              className="min-h-48 rounded-2xl bg-gradient-to-br from-slate-900 to-indigo-950 text-white p-6 flex flex-col justify-between cursor-pointer shadow-md select-none transition-transform active:scale-[0.99]"
            >
              <div className="flex items-center justify-between text-[11px] text-teal-300">
                <span>{currentCard.category}</span>
                <span className="text-slate-400 italic">Click card to flip</span>
              </div>

              <div className="my-auto py-2">
                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block mb-1">
                  {isFlipped ? 'Answer Key' : 'Recall Prompt'}
                </span>
                <p className="text-sm font-semibold whitespace-pre-wrap leading-relaxed text-slate-100">
                  {isFlipped ? currentCard.back : currentCard.front}
                </p>
              </div>

              <div className="text-[10px] text-slate-400 text-center border-t border-white/10 pt-2">
                {isFlipped ? 'Great recall! Tap to flip back.' : 'Try to state the answer out loud.'}
              </div>
            </div>

            {/* Flashcard Controls */}
            <div className="flex items-center justify-between mt-3 pt-1">
              <button
                onClick={() => handleCycleFlashcard('prev')}
                className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600 text-xs flex items-center gap-1"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                <span>Previous</span>
              </button>

              <button
                onClick={() => setIsFlipped(!isFlipped)}
                className="px-3 py-1.5 bg-teal-50 hover:bg-teal-100 text-teal-700 rounded-lg text-xs font-semibold"
              >
                {isFlipped ? 'Show Question' : 'Reveal Answer'}
              </button>

              <button
                onClick={() => handleCycleFlashcard('next')}
                className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600 text-xs flex items-center gap-1"
              >
                <span>Next</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Topic Completion Checklist */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-teal-600" />
              Topic Syllabus Checklist
            </h4>

            <div className="space-y-2 text-xs">
              {currentCourse.topics.map((t) => (
                <div
                  key={t.id}
                  onClick={() => toggleTopicCompletion(currentCourse.id, t.id)}
                  className="p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer flex items-center justify-between transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    {t.completed ? (
                      <CheckSquare className="w-4 h-4 text-teal-600 shrink-0" />
                    ) : (
                      <Square className="w-4 h-4 text-slate-300 shrink-0" />
                    )}
                    <span className={t.completed ? 'line-through text-slate-400' : 'text-slate-800 font-medium'}>
                      {t.title}
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-400 shrink-0">{t.durationEst}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
