import React, { useState, useEffect, useRef } from 'react';
import { 
  Award, 
  X, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  Sparkles, 
  Code2, 
  Server, 
  Cpu, 
  Palette, 
  ChevronRight, 
  ChevronLeft,
  ArrowRight,
  ShieldCheck,
  AlertTriangle,
  RotateCcw
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { apiGetSkillCategories, apiGetSkillQuiz, apiSubmitSkillQuiz } from '../services/api';

export const SkillAssessmentModal = ({
  isOpen,
  onClose,
  currentUser,
  onBadgeEarned,
  showToast
}) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Active Quiz State
  const [activeQuizCategory, setActiveQuizCategory] = useState(null);
  const [quizQuestions, setQuizQuestions] = useState([]);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [userAnswers, setUserAnswers] = useState({}); // { 'rf-1': 1, ... }
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes in seconds
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizResults, setQuizResults] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const timerRef = useRef(null);

  // Load categories
  useEffect(() => {
    if (isOpen) {
      apiGetSkillCategories()
        .then(res => {
          if (Array.isArray(res) && res.length > 0) {
            setCategories(res);
          } else {
            // Fallback default categories
            setCategories([
              {
                id: 'react-frontend',
                name: 'React & Modern Frontend',
                icon: 'Code2',
                color: 'from-cyan-500 to-blue-600',
                description: 'Hooks, Virtual DOM, State Management (Redux/Zustand), SSR, and Component Lifecycle.',
                timeLimitMinutes: 10,
                passingScorePercent: 80,
                badgeName: 'React Certified Pro',
                questionCount: 10
              },
              {
                id: 'nodejs-backend',
                name: 'Node.js & Backend Architecture',
                icon: 'Server',
                color: 'from-emerald-500 to-teal-600',
                description: 'Event Loop, Express REST APIs, Mongoose MongoDB indexing, JWT Authentication, and Microservices.',
                timeLimitMinutes: 10,
                passingScorePercent: 80,
                badgeName: 'Node Backend Specialist',
                questionCount: 10
              },
              {
                id: 'python-ai',
                name: 'Python, AI & Data Engineering',
                icon: 'Cpu',
                color: 'from-amber-500 to-orange-600',
                description: 'FastAPI, Pandas Data Manipulation, Prompt Engineering, Vector Embeddings, and ML pipelines.',
                timeLimitMinutes: 10,
                passingScorePercent: 80,
                badgeName: 'Python & AI Specialist',
                questionCount: 10
              },
              {
                id: 'uiux-figma',
                name: 'UI/UX & Product Design',
                icon: 'Palette',
                color: 'from-pink-500 to-purple-600',
                description: 'Figma Auto-Layout, Design Systems, Typography Scale, WCAG Accessibility, and User Flow Prototyping.',
                timeLimitMinutes: 10,
                passingScorePercent: 80,
                badgeName: 'Certified UX/UI Designer',
                questionCount: 10
              }
            ]);
          }
        })
        .catch(err => {
          console.warn('Categories load fallback:', err.message);
        })
        .finally(() => setLoading(false));
    }
  }, [isOpen]);

  // Quiz Timer Countdown
  useEffect(() => {
    if (activeQuizCategory && !quizSubmitted && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            handleAutoSubmitOnTimeOut();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timerRef.current);
    }
  }, [activeQuizCategory, quizSubmitted, timeLeft]);

  // Start a Quiz
  const handleStartQuiz = async (cat) => {
    setLoading(true);
    try {
      const res = await apiGetSkillQuiz(cat.id);
      if (res && res.questions) {
        setActiveQuizCategory(cat);
        setQuizQuestions(res.questions);
        setCurrentQuestionIdx(0);
        setUserAnswers({});
        setTimeLeft((cat.timeLimitMinutes || 10) * 60);
        setQuizSubmitted(false);
        setQuizResults(null);
      }
    } catch (err) {
      if (showToast) showToast('Could not load quiz questions. Please try again.', 'warning');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectOption = (questionId, optionIdx) => {
    setUserAnswers(prev => ({
      ...prev,
      [questionId]: optionIdx
    }));
  };

  const handleAutoSubmitOnTimeOut = () => {
    if (showToast) showToast('Time is up! Submitting your answers...', 'warning');
    handleFinalSubmit();
  };

  const handleFinalSubmit = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    clearInterval(timerRef.current);

    const payload = {
      categoryId: activeQuizCategory.id,
      userId: currentUser?.id || currentUser?._id || 'guest',
      userEmail: currentUser?.email || 'talent@talentx.pk',
      answers: userAnswers
    };

    try {
      const res = await apiSubmitSkillQuiz(payload);
      setQuizResults(res);
      setQuizSubmitted(true);

      if (res.passed) {
        confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
        if (showToast) showToast(`Congratulations! You passed with ${res.scorePercent}% and earned the "${res.badgeEarned?.badgeName}" badge!`, 'success');
        if (onBadgeEarned) onBadgeEarned(res.badgeEarned);
      } else {
        if (showToast) showToast(`Score: ${res.scorePercent}%. You need ${activeQuizCategory.passingScorePercent}% to pass. You can retake the test!`, 'warning');
      }
    } catch (err) {
      if (showToast) showToast('Error evaluating quiz.', 'warning');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatTimer = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (!isOpen) return null;

  const currentQ = quizQuestions[currentQuestionIdx];
  const totalQ = quizQuestions.length;
  const answeredCount = Object.keys(userAnswers).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn" onClick={onClose}>
      <div 
        className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col" 
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-slate-800 bg-gradient-to-r from-indigo-950/40 via-slate-900 to-slate-900 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-indigo-500/15 text-indigo-400 border border-indigo-500/30">
              <Award size={24} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white">
                  {activeQuizCategory ? activeQuizCategory.name : 'Pakistan Pro Skill Assessment Center'}
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  MCQ CERTIFICATION
                </span>
              </div>
              <p className="text-xs text-slate-400">
                {activeQuizCategory ? `Score ${activeQuizCategory.passingScorePercent}%+ to unlock your official badge` : 'Take certified assessments to unlock verified badges on your profile'}
              </p>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* ============================================================
            VIEW 1: CATEGORY SELECTION
            ============================================================ */}
        {!activeQuizCategory && (
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            <div className="p-4 rounded-2xl bg-indigo-950/20 border border-indigo-500/20 flex items-center gap-3">
              <Sparkles size={20} className="text-indigo-400 shrink-0" />
              <p className="text-xs text-indigo-200 leading-relaxed">
                Passing a 10-question assessment unlocks a <strong>Verified Pro Badge</strong> on your profile and ranks you at the top of client search results.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {categories.map(cat => (
                <div 
                  key={cat.id}
                  className="p-5 rounded-2xl bg-slate-800/40 hover:bg-slate-800/70 border border-slate-700/60 hover:border-indigo-500/50 transition-all flex flex-col justify-between space-y-4 group"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className={`w-10 h-10 rounded-xl bg-gradient-to-tr ${cat.color || 'from-indigo-500 to-purple-600'} flex items-center justify-center text-white shadow-md`}>
                        {cat.id.includes('react') ? <Code2 size={20} /> : cat.id.includes('node') ? <Server size={20} /> : cat.id.includes('python') ? <Cpu size={20} /> : <Palette size={20} />}
                      </div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700 flex items-center gap-1">
                        <Clock size={11} /> {cat.timeLimitMinutes} Mins
                      </span>
                    </div>

                    <h4 className="text-sm font-bold text-white group-hover:text-indigo-300 transition-colors">
                      {cat.name}
                    </h4>
                    <p className="text-xs text-slate-400 line-clamp-2">
                      {cat.description}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-slate-700/40 flex items-center justify-between">
                    <span className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
                      <ShieldCheck size={12} /> {cat.badgeName}
                    </span>
                    <button
                      onClick={() => handleStartQuiz(cat)}
                      className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 shadow-md shadow-indigo-600/20 transition-all flex items-center gap-1 cursor-pointer"
                    >
                      <span>Take Test</span>
                      <ArrowRight size={13} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ============================================================
            VIEW 2: ACTIVE QUIZ RUNNER
            ============================================================ */}
        {activeQuizCategory && !quizSubmitted && currentQ && (
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Quiz Top Bar */}
            <div className="px-6 py-3 bg-slate-900/80 border-b border-slate-800 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-200">
                  Question {currentQuestionIdx + 1} of {totalQ}
                </span>
                <span className="text-slate-500">&bull;</span>
                <span className="text-slate-400">
                  {answeredCount}/{totalQ} Answered
                </span>
              </div>

              <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full font-mono font-bold text-xs border ${
                timeLeft < 120 
                  ? 'bg-rose-500/20 text-rose-400 border-rose-500/40 animate-pulse' 
                  : 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30'
              }`}>
                <Clock size={13} />
                <span>{formatTimer(timeLeft)}</span>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-slate-800 h-1">
              <div 
                className="bg-gradient-to-r from-indigo-500 to-purple-500 h-1 transition-all duration-300"
                style={{ width: `${((currentQuestionIdx + 1) / totalQ) * 100}%` }}
              />
            </div>

            {/* Question Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-5">
              <div className="space-y-2">
                <span className="text-[11px] font-bold text-indigo-400 uppercase tracking-wider">
                  Question #{currentQuestionIdx + 1}
                </span>
                <h4 className="text-base font-bold text-white leading-relaxed">
                  {currentQ.question}
                </h4>
              </div>

              {/* Options */}
              <div className="space-y-2.5">
                {currentQ.options.map((option, oIdx) => {
                  const isSelected = userAnswers[currentQ.id] === oIdx;
                  return (
                    <button
                      key={oIdx}
                      onClick={() => handleSelectOption(currentQ.id, oIdx)}
                      className={`w-full p-4 rounded-2xl border text-left transition-all flex items-start gap-3.5 cursor-pointer ${
                        isSelected 
                          ? 'bg-indigo-600/20 border-indigo-500 text-white shadow-md shadow-indigo-600/10' 
                          : 'bg-slate-800/40 border-slate-700/60 text-slate-300 hover:bg-slate-800 hover:border-slate-600'
                      }`}
                    >
                      <span className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 ${
                        isSelected ? 'bg-indigo-600 text-white' : 'bg-slate-700 text-slate-400'
                      }`}>
                        {String.fromCharCode(65 + oIdx)}
                      </span>
                      <span className="text-xs sm:text-sm font-medium leading-relaxed">
                        {option}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quiz Footer Navigation */}
            <div className="p-4 px-6 border-t border-slate-800 bg-slate-900/90 flex items-center justify-between">
              <button
                disabled={currentQuestionIdx === 0}
                onClick={() => setCurrentQuestionIdx(prev => Math.max(0, prev - 1))}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-40"
              >
                <ChevronLeft size={15} />
                <span>Previous</span>
              </button>

              <div className="flex items-center gap-2">
                {currentQuestionIdx < totalQ - 1 ? (
                  <button
                    onClick={() => setCurrentQuestionIdx(prev => Math.min(totalQ - 1, prev + 1))}
                    className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>Next Question</span>
                    <ChevronRight size={15} />
                  </button>
                ) : (
                  <button
                    onClick={handleFinalSubmit}
                    disabled={isSubmitting}
                    className="px-6 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 shadow-lg shadow-emerald-600/30 transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <CheckCircle2 size={15} />
                    <span>{isSubmitting ? 'Evaluating...' : 'Submit Assessment'}</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ============================================================
            VIEW 3: RESULTS & BADGE REVEAL
            ============================================================ */}
        {quizSubmitted && quizResults && (
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            <div className="text-center space-y-4">
              <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto border shadow-xl ${
                quizResults.passed 
                  ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40 shadow-emerald-500/20' 
                  : 'bg-amber-500/20 text-amber-400 border-amber-500/40 shadow-amber-500/20'
              }`}>
                {quizResults.passed ? <Award size={44} /> : <AlertTriangle size={40} />}
              </div>

              <div className="space-y-1.5">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Assessment Evaluation Complete
                </span>
                <h4 className="text-2xl font-black text-white">
                  {quizResults.passed ? 'Test Passed with Honors!' : 'Assessment Attempt Recorded'}
                </h4>
                <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto">
                  {quizResults.passed 
                    ? `Congratulations! You scored ${quizResults.scorePercent}% (${quizResults.correctCount}/${quizResults.totalQuestions} correct) and unlocked your official verified skill badge.`
                    : `You scored ${quizResults.scorePercent}% (${quizResults.correctCount}/${quizResults.totalQuestions} correct). Minimum required score is ${activeQuizCategory?.passingScorePercent || 80}%.`}
                </p>
              </div>

              {/* Awarded Badge Box */}
              {quizResults.passed && quizResults.badgeEarned && (
                <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-indigo-950/40 to-slate-900 border border-emerald-500/30 text-left flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                      <ShieldCheck size={24} />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-400">UNLOCKED BADGE:</div>
                      <div className="text-base font-black text-emerald-400">{quizResults.badgeEarned.badgeName}</div>
                    </div>
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    Score: {quizResults.scorePercent}%
                  </span>
                </div>
              )}
            </div>

            {/* Answer Explanations Review */}
            <div className="space-y-3 pt-2">
              <h5 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Detailed Question Review & Explanations:
              </h5>

              <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
                {quizResults.detailedReview?.map((rev, idx) => (
                  <div 
                    key={idx}
                    className={`p-3.5 rounded-xl border text-xs space-y-1.5 ${
                      rev.isCorrect 
                        ? 'bg-emerald-950/15 border-emerald-500/20' 
                        : 'bg-rose-950/15 border-rose-500/20'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className="font-semibold text-slate-200">
                        {idx + 1}. {rev.question}
                      </span>
                      {rev.isCorrect ? (
                        <span className="text-emerald-400 font-bold shrink-0 flex items-center gap-1">
                          <CheckCircle2 size={13} /> Correct
                        </span>
                      ) : (
                        <span className="text-rose-400 font-bold shrink-0 flex items-center gap-1">
                          <XCircle size={13} /> Incorrect
                        </span>
                      )}
                    </div>
                    <p className="text-slate-400 text-[11px] leading-relaxed">
                      <strong>Key Concept: </strong>{rev.explanation}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3 pt-3 border-t border-slate-800">
              <button
                onClick={() => {
                  setActiveQuizCategory(null);
                  setQuizSubmitted(false);
                  setQuizResults(null);
                }}
                className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-300 bg-slate-800 hover:bg-slate-700 transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <RotateCcw size={14} />
                <span>All Assessments</span>
              </button>

              <button
                onClick={onClose}
                className="flex-1 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-500 transition-colors text-center cursor-pointer shadow-lg shadow-indigo-600/25"
              >
                Done & Return to Profile
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
