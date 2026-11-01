import React, { useState, useMemo, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  UserProfile,
  Lesson,
  KnowledgeLevel,
  PathLessonNode,
  PathNodeStatus,
  AchievementItem,
} from '../types';
import { initialLessons } from '../data/lessons';
import {
  learningPathModules,
  demoAchievements,
  financialTermTooltips,
} from '../data/demoData';
import { calculateCompoundProjection } from '../utils/financialCalculations';
import { translations, currencySymbols } from '../translations';
import {
  BookOpen,
  CheckCircle2,
  Clock,
  ArrowRight,
  Calculator,
  X,
  HelpCircle,
  Lock,
  Check,
  Flame,
  Award,
  Target,
  Zap,
  Compass,
  Wallet,
  Info,
  Play,
  Sparkles,
  Filter,
} from 'lucide-react';

interface FineduAcademyProps {
  user: UserProfile;
  setUser: React.Dispatch<React.SetStateAction<UserProfile>>;
  onOpenCalculator: (calcId: string) => void;
  initialLessonNodeId?: string | null;
  onClearInitialLessonNode?: () => void;
}

export const FineduAcademy: React.FC<FineduAcademyProps> = ({
  user,
  setUser,
  onOpenCalculator,
  initialLessonNodeId,
  onClearInitialLessonNode,
}) => {
  const t = translations[user.language];
  const curr = currencySymbols[user.currency] || '₾';

  // View toggle: 'path' ("სასწავლო გზა") or 'all' ("ყველა გაკვეთილი")
  const [viewMode, setViewMode] = useState<'path' | 'all'>('path');

  // Filters for "ყველა გაკვეთილი"
  const [difficultyFilter, setDifficultyFilter] = useState<string>('ALL');
  const [topicFilter, setTopicFilter] = useState<string>('ALL');

  // Active 5-Stage Path Lesson Modal
  const [activeNode, setActiveNode] = useState<PathLessonNode | null>(null);
  const [stageIndex, setStageIndex] = useState<number>(1); // 1..5
  const [selectedQuizOption, setSelectedQuizOption] = useState<number | null>(null);
  const [quizAnswered, setQuizAnswered] = useState<boolean>(false);
  const [xpAwardedThisSession, setXpAwardedThisSession] = useState<boolean>(false);

  // Interactive Practice Exercise state inside stage 4
  const [pracMonthly, setPracMonthly] = useState<number>(300);
  const [pracRate, setPracRate] = useState<number>(8);
  const [pracInflation, setPracInflation] = useState<number>(5);
  const [pracYears, setPracYears] = useState<number>(5);

  // Active Legacy Card Lesson Modal (for "ყველა გაკვეთილი" view)
  const [activeCardLesson, setActiveCardLesson] = useState<Lesson | null>(null);
  const [isCardQuizMode, setIsCardQuizMode] = useState(false);
  const [cardSelectedOption, setCardSelectedOption] = useState<number | null>(null);
  const [cardQuizSubmitted, setCardQuizSubmitted] = useState(false);

  // Active Achievement Detail Modal
  const [selectedAchievement, setSelectedAchievement] = useState<AchievementItem | null>(null);

  // Tooltip hover/click state
  const [activeTooltipTerm, setActiveTooltipTerm] = useState<string | null>(null);

  // Flatten all path nodes in order to compute unlocking progression
  const allPathNodes = useMemo(() => {
    return learningPathModules.flatMap(m => m.nodes);
  }, []);

  // Determine dynamic status for each node based on user.completedLessons
  const getNodeStatus = (node: PathLessonNode, indexInAll: number): PathNodeStatus => {
    if (user.completedLessons.includes(node.id)) {
      return 'completed';
    }
    // Check if it's the first uncompleted node in sequence
    const firstUncompletedIndex = allPathNodes.findIndex(
      n => !user.completedLessons.includes(n.id)
    );
    if (indexInAll === firstUncompletedIndex) {
      return 'current';
    }
    // Also keep originally available nodes accessible or the immediate next node after completed
    if (
      node.defaultStatus === 'available' ||
      node.defaultStatus === 'current' ||
      (indexInAll > 0 && user.completedLessons.includes(allPathNodes[indexInAll - 1].id))
    ) {
      return 'available';
    }
    return 'locked';
  };

  // Open a path node into the 5-stage modal
  const handleStartPathNode = (node: PathLessonNode) => {
    setActiveNode(node);
    setStageIndex(1);
    setSelectedQuizOption(null);
    setQuizAnswered(false);
    setXpAwardedThisSession(false);
    setPracMonthly(node.stages.practiceExercise.defaultAmount);
    setPracRate(node.stages.practiceExercise.defaultRate);
    setPracInflation(node.stages.practiceExercise.defaultInflation);
    setPracYears(node.stages.practiceExercise.defaultYears);
  };

  // Handle external trigger (e.g. from Dashboard "დღეს AGNO გირჩევს" or "გააგრძელე სწავლა")
  useEffect(() => {
    if (initialLessonNodeId) {
      const found = allPathNodes.find(n => n.id === initialLessonNodeId);
      if (found) {
        handleStartPathNode(found);
      }
      if (onClearInitialLessonNode) onClearInitialLessonNode();
    }
  }, [initialLessonNodeId, allPathNodes]);

  // Calculate practice projection in Stage 4
  const practiceProjection = useMemo(() => {
    return calculateCompoundProjection({
      initialPrincipal: 1000,
      monthlyContribution: pracMonthly,
      annualRatePercent: pracRate,
      annualInflationPercent: pracInflation,
      years: pracYears,
    });
  }, [pracMonthly, pracRate, pracInflation, pracYears]);

  // Complete quiz answer in Stage 3
  const handleConfirmStage3Question = () => {
    if (selectedQuizOption === null || !activeNode) return;
    setQuizAnswered(true);
  };

  // Transition to Stage 5 (Completion) and award XP once
  const handleFinishLessonToStage5 = () => {
    if (!activeNode) return;
    const alreadyCompleted = user.completedLessons.includes(activeNode.id);

    if (!alreadyCompleted) {
      try {
        confetti({ particleCount: 55, spread: 60, origin: { y: 0.65 } });
      } catch {
        // ignore
      }

      setXpAwardedThisSession(true);
      setUser(prev => {
        const nextXp = prev.xp + activeNode.xpReward;
        const nextCompleted = [...prev.completedLessons, activeNode.id];
        const nextBadges = [...prev.unlockedBadges];
        if (!nextBadges.includes('first-step')) nextBadges.push('first-step');
        if (activeNode.topic === 'ინფლაცია' && !nextBadges.includes('inflation-master')) {
          nextBadges.push('inflation-master');
        }
        return {
          ...prev,
          xp: nextXp,
          dailyCompletedActivities: Math.min(
            prev.dailyTargetActivities,
            prev.dailyCompletedActivities + 1
          ),
          weeklyCompletedLessons: Math.min(
            prev.weeklyTargetLessons,
            prev.weeklyCompletedLessons + 1
          ),
          completedLessons: nextCompleted,
          unlockedBadges: nextBadges,
        };
      });
    } else {
      setXpAwardedThisSession(false);
    }

    setStageIndex(5);
  };

  // Go to next available lesson from Stage 5 modal
  const handleNextLessonFromModal = () => {
    if (!activeNode) return;
    const idx = allPathNodes.findIndex(n => n.id === activeNode.id);
    if (idx >= 0 && idx + 1 < allPathNodes.length) {
      handleStartPathNode(allPathNodes[idx + 1]);
    } else {
      setActiveNode(null);
    }
  };

  // Legacy card quiz completion
  const handleCardCheckAnswer = () => {
    if (cardSelectedOption === null || !activeCardLesson) return;
    setCardQuizSubmitted(true);
    const isCorrect = cardSelectedOption === activeCardLesson.quiz.correctIndex;
    if (isCorrect && !user.completedLessons.includes(activeCardLesson.id)) {
      setUser(prev => ({
        ...prev,
        xp: prev.xp + 20,
        completedLessons: [...prev.completedLessons, activeCardLesson.id],
      }));
    }
  };

  // Combined lessons for "ყველა გაკვეთილი" grid with difficulty & topic filters
  const filteredAllLessons = useMemo(() => {
    return allPathNodes.filter(node => {
      const matchDiff = difficultyFilter === 'ALL' || node.level === difficultyFilter;
      const matchTopic = topicFilter === 'ALL' || node.topic === topicFilter;
      return matchDiff && matchTopic;
    });
  }, [allPathNodes, difficultyFilter, topicFilter]);

  // Overall progress percentage (default 62% in demo mode or computed)
  const completedPathCount = allPathNodes.filter(n =>
    user.completedLessons.includes(n.id)
  ).length;
  const progressPercent = user.isDemoMode && completedPathCount === 3
    ? 62
    : Math.min(100, Math.round((completedPathCount / allPathNodes.length) * 100));

  // Find current active node for "გააგრძელე სწავლა" button
  const currentActiveNode = useMemo(() => {
    return (
      allPathNodes.find(n => n.id === 'm2-n1' && !user.completedLessons.includes('m2-n1')) ||
      allPathNodes.find(n => !user.completedLessons.includes(n.id)) ||
      allPathNodes[0]
    );
  }, [allPathNodes, user.completedLessons]);

  const sevenDayLabels = ['ორშ', 'სამ', 'ოთხ', 'ხუთ', 'პარ', 'შაბ', 'კვი'];

  return (
    <div className="space-y-6">
      {/* Top Header & View Switcher */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center space-x-3">
            <BookOpen className="w-8 h-8 text-[#1F64FF]" />
            <span>ჩემი სასწავლო გზა</span>
          </h1>
          <p className="text-sm sm:text-base text-slate-600 mt-1">
            ყოველდღე ერთი მცირე ნაბიჯი ფინანსური ცოდნის გასაუმჯობესებლად
          </p>
        </div>

        {/* Two View Controls: 1. სასწავლო გზა | 2. ყველა გაკვეთილი */}
        <div className="inline-flex p-1 rounded-xl bg-slate-200/80 border border-slate-300/80 self-start md:self-auto">
          <button
            onClick={() => setViewMode('path')}
            className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all ${
              viewMode === 'path'
                ? 'bg-[#1F64FF] text-white shadow-xs'
                : 'text-slate-700 hover:text-slate-900'
            }`}
          >
            სასწავლო გზა
          </button>
          <button
            onClick={() => setViewMode('all')}
            className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all ${
              viewMode === 'all'
                ? 'bg-[#1F64FF] text-white shadow-xs'
                : 'text-slate-700 hover:text-slate-900'
            }`}
          >
            ყველა გაკვეთილი
          </button>
        </div>
      </div>

      {/* Compact Learning Status Panel (Section 2) */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-5 sm:p-6 shadow-xs">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 items-center">
          {/* 1. Current Level */}
          <div className="p-3 rounded-xl bg-blue-50/60 border border-blue-100">
            <span className="text-[11px] font-bold text-slate-500 block">მიმდინარე დონე</span>
            <span className="text-base font-black text-[#1F64FF]">{user.knowledgeLevel}</span>
          </div>

          {/* 2. Knowledge Score */}
          <div className="p-3 rounded-xl bg-blue-50/60 border border-blue-100">
            <span className="text-[11px] font-bold text-slate-500 block">ცოდნის ქულა</span>
            <span className="text-base font-black text-slate-900">{user.xp} XP</span>
          </div>

          {/* 3. Current Streak */}
          <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200/60">
            <span className="text-[11px] font-bold text-amber-800 block">სწავლის Streak</span>
            <span className="text-base font-black text-amber-700 flex items-center">
              <Flame className="w-4 h-4 mr-1 fill-amber-500 text-amber-500" />
              {user.streak} დღე
            </span>
          </div>

          {/* 4. Weekly Goal */}
          <div className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-200/60">
            <span className="text-[11px] font-bold text-emerald-800 block">კვირის მიზანი</span>
            <span className="text-base font-black text-emerald-800">
              {user.weeklyCompletedLessons}/{user.weeklyTargetLessons} გაკვეთილი
            </span>
          </div>

          {/* 5. Current Module */}
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 col-span-2 sm:col-span-1">
            <span className="text-[11px] font-bold text-slate-500 block">მიმდინარე მოდული</span>
            <span className="text-xs font-black text-slate-900 line-clamp-1" title="პირადი ფინანსების საფუძვლები">
              პირადი ფინანსების საფუძვლები
            </span>
          </div>

          {/* 6. Small Progress Ring (62%) */}
          <div className="flex items-center justify-center sm:justify-end space-x-3">
            <div className="relative w-14 h-14 flex items-center justify-center">
              <svg className="w-14 h-14 -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-slate-200"
                  strokeWidth="3.5"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className="text-[#1F64FF]"
                  strokeDasharray={`${progressPercent}, 100`}
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <span className="absolute text-xs font-black text-slate-900">
                {progressPercent}%
              </span>
            </div>
            <div className="text-left">
              <span className="text-xs font-bold text-slate-800 block">მოდულის</span>
              <span className="text-[11px] text-slate-500">პროგრესი</span>
            </div>
          </div>
        </div>

        {/* Helpful Financial Glossary Tooltips Bar */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-slate-500 flex items-center mr-1">
            <Info className="w-3.5 h-3.5 mr-1 text-[#1F64FF]" />
            ფინანსური ტერმინების განმარტება:
          </span>
          {Object.keys(financialTermTooltips).map(term => (
            <div key={term} className="relative">
              <button
                type="button"
                onClick={() =>
                  setActiveTooltipTerm(prev => (prev === term ? null : term))
                }
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold border transition-colors flex items-center space-x-1 ${
                  activeTooltipTerm === term
                    ? 'bg-[#1F64FF] text-white border-[#1F64FF]'
                    : 'bg-slate-50 hover:bg-blue-50 text-slate-700 border-slate-200'
                }`}
              >
                <span>{term}</span>
                <Info className="w-3 h-3 opacity-75" />
              </button>
              {activeTooltipTerm === term && (
                <div className="absolute left-0 top-9 z-30 w-64 p-3 rounded-xl bg-slate-900 text-white text-xs shadow-lg leading-relaxed">
                  <div className="font-bold text-blue-300 mb-1">{term}</div>
                  {financialTermTooltips[term]}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* VIEW 1: DUOLINGO-INSPIRED LEARNING PATH ("სასწავლო გზა") */}
      {viewMode === 'path' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          {/* Left 2 Columns: Finite Connected Learning Path across 4 Modules */}
          <div className="lg:col-span-2 space-y-6">
            {learningPathModules.map(module => {
              const moduleCompletedCount = module.nodes.filter(n =>
                user.completedLessons.includes(n.id)
              ).length;

              return (
                <div
                  key={module.id}
                  className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs"
                >
                  {/* Module Header Banner */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 mb-6 border-b border-slate-100">
                    <div>
                      <span className="text-xs font-bold uppercase tracking-wider text-[#1F64FF]">
                        მოდული {module.number}
                      </span>
                      <h2 className="text-lg sm:text-xl font-black text-slate-900">
                        {module.titleKa}
                      </h2>
                      <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
                        {module.descriptionKa}
                      </p>
                    </div>
                    <div className="self-start sm:self-center px-3 py-1.5 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold shrink-0">
                      {moduleCompletedCount} / {module.nodes.length} დასრულებული
                    </div>
                  </div>

                  {/* Connected Circular Nodes Path */}
                  <div className="relative flex flex-col items-center space-y-5 py-2">
                    {module.nodes.map((node, idx) => {
                      const globalIndex = allPathNodes.findIndex(n => n.id === node.id);
                      const status = getNodeStatus(node, globalIndex);
                      const isLocked = status === 'locked';
                      const isCompleted = status === 'completed';
                      const isCurrent = status === 'current';

                      // Slight horizontal curve offset for visual path rhythm
                      const offsets = [
                        'sm:translate-x-0',
                        'sm:translate-x-6',
                        'sm:translate-x-0',
                        'sm:-translate-x-6',
                        'sm:translate-x-0',
                      ];
                      const offsetClass = offsets[idx % offsets.length];

                      // Node Circle Styling per Section 2 specification
                      let circleClass =
                        'w-14 h-14 border-2 bg-white border-[#1F64FF] text-[#1F64FF] hover:bg-blue-50';
                      let statusBadgeText = 'ხელმისაწვდომი';
                      let statusBadgeStyle = 'bg-blue-50 text-[#1F64FF] border-blue-200';

                      if (isCompleted) {
                        circleClass =
                          'w-14 h-14 bg-emerald-600 border-2 border-emerald-600 text-white shadow-sm';
                        statusBadgeText = 'დასრულებული';
                        statusBadgeStyle =
                          'bg-emerald-50 text-emerald-700 border-emerald-200';
                      } else if (isCurrent) {
                        circleClass =
                          'w-16 h-16 bg-[#1F64FF] border-4 border-blue-200 text-white shadow-md ring-4 ring-blue-500/20';
                        statusBadgeText = 'მიმდინარე';
                        statusBadgeStyle =
                          'bg-[#1F64FF] text-white border-[#1F64FF]';
                      } else if (isLocked) {
                        circleClass =
                          'w-14 h-14 bg-slate-100 border-2 border-slate-300 text-slate-400 cursor-not-allowed';
                        statusBadgeText = 'დაბლოკილი';
                        statusBadgeStyle =
                          'bg-slate-100 text-slate-500 border-slate-200';
                      } else if (node.nodeType === 'quiz') {
                        circleClass =
                          'w-14 h-14 bg-purple-600 border-2 border-purple-300 text-white shadow-xs';
                        statusBadgeText = 'ტესტი';
                        statusBadgeStyle =
                          'bg-purple-50 text-purple-700 border-purple-200';
                      } else if (node.nodeType === 'practice') {
                        circleClass =
                          'w-14 h-14 bg-amber-500 border-2 border-amber-300 text-white shadow-xs';
                        statusBadgeText = 'პრაქტიკული';
                        statusBadgeStyle =
                          'bg-amber-50 text-amber-800 border-amber-200';
                      }

                      return (
                        <div
                          key={node.id}
                          className={`w-full max-w-lg flex flex-col items-center ${offsetClass} transition-transform`}
                        >
                          {/* Connector line from previous node */}
                          {idx > 0 && (
                            <div
                              className={`w-1 h-5 -mt-5 mb-2 rounded-full ${
                                isCompleted || isCurrent
                                  ? 'bg-emerald-500'
                                  : 'bg-slate-200'
                              }`}
                            />
                          )}

                          {/* Interactive Node Row Card */}
                          <div
                            onClick={() => {
                              if (!isLocked) handleStartPathNode(node);
                            }}
                            role="button"
                            tabIndex={isLocked ? -1 : 0}
                            aria-disabled={isLocked}
                            onKeyDown={e => {
                              if (!isLocked && (e.key === 'Enter' || e.key === ' ')) {
                                e.preventDefault();
                                handleStartPathNode(node);
                              }
                            }}
                            className={`w-full flex items-center space-x-4 p-3.5 rounded-2xl border transition-all ${
                              isCurrent
                                ? 'bg-blue-50/50 border-[#1F64FF] shadow-xs cursor-pointer'
                                : isLocked
                                ? 'bg-slate-50/70 border-slate-200 opacity-75 cursor-not-allowed'
                                : 'bg-white hover:bg-slate-50 border-slate-200/90 hover:border-blue-300 cursor-pointer'
                            }`}
                          >
                            {/* Circular Node Icon */}
                            <div
                              className={`rounded-full flex items-center justify-center shrink-0 transition-transform ${circleClass}`}
                            >
                              {isCompleted ? (
                                <Check className="w-6 h-6 stroke-[2.5]" />
                              ) : isLocked ? (
                                <Lock className="w-5 h-5" />
                              ) : node.nodeType === 'quiz' ? (
                                <HelpCircle className="w-6 h-6" />
                              ) : node.nodeType === 'practice' ? (
                                <Calculator className="w-6 h-6" />
                              ) : (
                                <BookOpen className="w-6 h-6" />
                              )}
                            </div>

                            {/* Node Details */}
                            <div className="flex-1 min-w-0">
                              <div className="flex flex-wrap items-center gap-1.5 mb-1">
                                <span
                                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${statusBadgeStyle}`}
                                >
                                  {statusBadgeText}
                                </span>
                                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                                  {node.level}
                                </span>
                                <span className="text-[11px] text-slate-500 font-medium flex items-center">
                                  <Clock className="w-3 h-3 mr-1" />
                                  {node.readTimeMinutes} წთ • +{node.xpReward} XP
                                </span>
                              </div>

                              <h3 className="text-sm sm:text-base font-black text-slate-900 truncate">
                                {node.titleKa}
                              </h3>
                              <p className="text-xs text-slate-600 line-clamp-1 mt-0.5">
                                {node.summaryKa}
                              </p>
                            </div>

                            {/* Action Indicator */}
                            {!isLocked && (
                              <div className="shrink-0">
                                <span
                                  className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center space-x-1 ${
                                    isCurrent
                                      ? 'bg-[#1F64FF] text-white'
                                      : isCompleted
                                      ? 'bg-emerald-50 text-emerald-700'
                                      : 'bg-slate-100 text-slate-700'
                                  }`}
                                >
                                  <span>
                                    {isCompleted
                                      ? 'გამეორება'
                                      : isCurrent
                                      ? 'დაწყება'
                                      : 'გახსნა'}
                                  </span>
                                  <ArrowRight className="w-3.5 h-3.5" />
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right 1 Column: Duolingo-Style Motivation Cards (Section 4) */}
          <div className="space-y-5">
            {/* A. Daily Learning Goal ("დღიური მიზანი") */}
            <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-black text-slate-900 flex items-center space-x-2">
                  <Target className="w-5 h-5 text-[#1F64FF]" />
                  <span>დღიური მიზანი</span>
                </h3>
                <span className="text-xs font-bold text-[#1F64FF] bg-blue-50 px-2.5 py-0.5 rounded-full">
                  {user.dailyCompletedActivities}/{user.dailyTargetActivities} აქტივობა შესრულებულია
                </span>
              </div>

              <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                <div
                  className="bg-[#1F64FF] h-3 rounded-full transition-all duration-500"
                  style={{
                    width: `${Math.min(
                      100,
                      Math.round(
                        (user.dailyCompletedActivities /
                          Math.max(1, user.dailyTargetActivities)) *
                          100
                      )
                    )}%`,
                  }}
                />
              </div>

              <button
                onClick={() => handleStartPathNode(currentActiveNode)}
                className="w-full py-2.5 px-4 rounded-xl bg-[#1F64FF] hover:bg-blue-700 text-white font-bold text-xs sm:text-sm flex items-center justify-center space-x-2 shadow-xs transition-colors"
              >
                <Play className="w-4 h-4" />
                <span>გააგრძელე სწავლა</span>
              </button>
            </div>

            {/* B. Learning Streak ("სწავლის უწყვეტობა") */}
            <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-black text-slate-900 flex items-center space-x-2">
                  <Flame className="w-5 h-5 text-amber-500 fill-amber-500" />
                  <span>სწავლის უწყვეტობა</span>
                </h3>
                <span className="text-sm font-black text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                  {user.streak} დღე
                </span>
              </div>

              {/* 7-Day Calendar Row */}
              <div className="grid grid-cols-7 gap-1.5 pt-1">
                {sevenDayLabels.map((day, idx) => {
                  const isCompletedDay = idx < user.streak;
                  const isCurrentDay = idx === user.streak - 1;
                  return (
                    <div
                      key={day}
                      className="flex flex-col items-center space-y-1"
                    >
                      <span className="text-[10px] font-bold text-slate-500">
                        {day}
                      </span>
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border transition-all ${
                          isCurrentDay
                            ? 'bg-[#1F64FF] border-[#1F64FF] text-white ring-2 ring-blue-300'
                            : isCompletedDay
                            ? 'bg-emerald-600 border-emerald-600 text-white'
                            : 'bg-slate-100 border-slate-200 text-slate-400'
                        }`}
                      >
                        {isCompletedDay ? <Check className="w-4 h-4" /> : idx + 1}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* C. XP and Level ("XP და დონე") */}
            <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-slate-500 block">
                    მიმდინარე საფეხური
                  </span>
                  <h3 className="text-base font-black text-slate-900">
                    {user.levelTitle || 'Beginner II'}
                  </h3>
                </div>
                <div className="text-right">
                  <span className="text-sm font-black text-[#1F64FF]">
                    {user.xp} / {user.nextLevelXp || 500} XP
                  </span>
                  <span className="text-[11px] text-slate-500 block">
                    შემდეგი დონე: {user.nextLevelTitle || 'Intermediate I'}
                  </span>
                </div>
              </div>

              <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                <div
                  className="bg-emerald-600 h-2.5 rounded-full transition-all duration-500"
                  style={{
                    width: `${Math.min(
                      100,
                      Math.round((user.xp / (user.nextLevelXp || 500)) * 100)
                    )}%`,
                  }}
                />
              </div>
            </div>

            {/* E. Weekly Challenge ("კვირის გამოწვევა") */}
            <div className="bg-gradient-to-br from-purple-50 to-blue-50 border border-purple-200/80 rounded-2xl p-5 shadow-xs space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase tracking-wider text-purple-800 flex items-center">
                  <Sparkles className="w-4 h-4 mr-1 text-purple-600" />
                  კვირის გამოწვევა
                </span>
                <span className="text-xs font-black px-2.5 py-0.5 rounded-full bg-purple-600 text-white">
                  +50 XP
                </span>
              </div>
              <p className="text-xs sm:text-sm font-bold text-slate-900 leading-snug">
                დაასრულე 3 გაკვეთილი და გამოიყენე ერთი კალკულატორი
              </p>
              <div className="flex items-center justify-between text-xs text-slate-600 pt-1">
                <span>
                  გაკვეთილები: <strong>{Math.min(3, user.weeklyCompletedLessons)}/3</strong>
                </span>
                <span>
                  კალკულატორი:{' '}
                  <strong className={user.usedCalculatorThisWeek ? 'text-emerald-700' : ''}>
                    {user.usedCalculatorThisWeek ? '1/1 ✓' : '0/1'}
                  </strong>
                </span>
              </div>
            </div>

            {/* D. Achievements ("მიღწევები") */}
            <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-black text-slate-900 flex items-center space-x-2">
                  <Award className="w-5 h-5 text-[#1F64FF]" />
                  <span>მიღწევები</span>
                </h3>
                <span className="text-xs text-slate-500 font-semibold">
                  დააწკაპუნეთ დეტალებისთვის
                </span>
              </div>

              <div className="space-y-2">
                {demoAchievements.map(ach => {
                  const isUnlocked =
                    user.unlockedBadges.includes(ach.id) ||
                    ach.progressCurrent >= ach.progressTarget;
                  return (
                    <button
                      key={ach.id}
                      type="button"
                      onClick={() => setSelectedAchievement(ach)}
                      className={`w-full text-left p-3 rounded-xl border transition-all flex items-center justify-between ${
                        isUnlocked
                          ? 'bg-emerald-50/50 border-emerald-200 hover:border-emerald-300 text-slate-900'
                          : 'bg-slate-50 border-slate-200 text-slate-500 opacity-75 hover:opacity-100'
                      }`}
                    >
                      <div className="flex items-center space-x-3 min-w-0">
                        <div
                          className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                            isUnlocked
                              ? 'bg-emerald-600 text-white'
                              : 'bg-slate-200 text-slate-500'
                          }`}
                        >
                          {ach.iconName === 'Compass' && <Compass className="w-4 h-4" />}
                          {ach.iconName === 'Wallet' && <Wallet className="w-4 h-4" />}
                          {ach.iconName === 'Flame' && <Flame className="w-4 h-4" />}
                          {ach.iconName === 'Zap' && <Zap className="w-4 h-4" />}
                          {ach.iconName === 'Target' && <Target className="w-4 h-4" />}
                        </div>
                        <div className="min-w-0">
                          <h4 className="text-xs sm:text-sm font-black truncate">
                            {ach.titleKa}
                          </h4>
                          <p className="text-[11px] text-slate-500 truncate">
                            {ach.descriptionKa}
                          </p>
                        </div>
                      </div>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ml-2 ${
                          isUnlocked
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-slate-200 text-slate-600'
                        }`}
                      >
                        {isUnlocked
                          ? 'მიღწეულია'
                          : `${ach.progressCurrent}/${ach.progressTarget}`}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* VIEW 2: ALL LESSONS GRID ("ყველა გაკვეთილი") with Difficulty & Topic Filters */
        <div className="space-y-5">
          {/* Filter Bar */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold text-slate-600 flex items-center mr-1">
                <Filter className="w-3.5 h-3.5 mr-1 text-[#1F64FF]" />
                სირთულე:
              </span>
              {(['ALL', 'Beginner', 'Intermediate', 'Advanced'] as const).map(lvl => (
                <button
                  key={lvl}
                  onClick={() => setDifficultyFilter(lvl)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                    difficultyFilter === lvl
                      ? 'bg-[#1F64FF] text-white'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {lvl === 'ALL' ? 'ყველა დონე' : lvl}
                </button>
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold text-slate-600">თემა:</span>
              {(
                ['ALL', 'ბიუჯეტირება', 'დანაზოგი', 'ინფლაცია', 'ინვესტირება', 'დაგეგმვა'] as const
              ).map(top => (
                <button
                  key={top}
                  onClick={() => setTopicFilter(top)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                    topicFilter === top
                      ? 'bg-blue-100 text-[#1F64FF] border border-blue-300'
                      : 'bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {top === 'ALL' ? 'ყველა თემა' : top}
                </button>
              ))}
            </div>
          </div>

          {/* Lesson Cards Grid (Only "გაკვეთილის წაკითხვა" button on cards per user rule) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredAllLessons.map(node => {
              const isDone = user.completedLessons.includes(node.id);
              return (
                <div
                  key={node.id}
                  className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs flex flex-col justify-between hover:border-slate-300 transition-all"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3 text-xs">
                      <span className="flex items-center text-slate-500 font-semibold">
                        <Clock className="w-3.5 h-3.5 mr-1 text-slate-400" />
                        {node.readTimeMinutes} წუთი • +{node.xpReward} XP
                      </span>

                      {isDone ? (
                        <span className="flex items-center space-x-1 text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full font-bold">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>{t.completedTag}</span>
                        </span>
                      ) : (
                        <span className="text-[#1F64FF] font-bold bg-blue-50 px-2.5 py-0.5 rounded-full">
                          {node.level}
                        </span>
                      )}
                    </div>

                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                      {node.topic}
                    </span>
                    <h3 className="text-lg font-black text-slate-900 mb-2 leading-snug">
                      {node.titleKa}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 line-clamp-3 leading-relaxed mb-4">
                      {node.summaryKa}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-slate-100">
                    <button
                      onClick={() => handleStartPathNode(node)}
                      className="w-full py-2.5 px-4 rounded-xl bg-[#1F64FF] hover:bg-blue-700 text-white font-bold text-xs sm:text-sm flex items-center justify-center space-x-1.5 shadow-xs transition-colors"
                    >
                      <span>{isDone ? 'თავიდან წაკითხვა' : 'გაკვეთილის წაკითხვა'}</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 5-STAGE COMPLETE LESSON EXPERIENCE MODAL (Section 3) */}
      {activeNode && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto"
          role="dialog"
          aria-modal="true"
        >
          <div className="relative w-full max-w-2xl bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 max-h-[92vh] overflow-y-auto shadow-xl space-y-6">
            <button
              onClick={() => setActiveNode(null)}
              aria-label="დახურვა"
              className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-800 rounded-lg hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Stage Progress Stepper Header */}
            <div>
              <div className="flex items-center space-x-2 text-xs font-bold text-[#1F64FF] mb-1">
                <span>{activeNode.level}</span>
                <span>•</span>
                <span>{activeNode.topic}</span>
                <span>•</span>
                <span>ეტაპი {stageIndex} / 5</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 pr-8">
                {activeNode.titleKa}
              </h2>

              {/* 5 Stage Pills */}
              <div className="grid grid-cols-5 gap-1.5 mt-4">
                {[
                  { num: 1, label: '1. მოკლე ახსნა' },
                  { num: 2, label: '2. მაგალითი' },
                  { num: 3, label: '3. კითხვა' },
                  { num: 4, label: '4. სავარჯიშო' },
                  { num: 5, label: '5. შედეგი' },
                ].map(st => (
                  <button
                    key={st.num}
                    type="button"
                    disabled={st.num === 5 && stageIndex < 5}
                    onClick={() => {
                      if (st.num < 5) setStageIndex(st.num);
                    }}
                    className={`py-1.5 px-2 rounded-lg text-[11px] font-bold text-center transition-all ${
                      stageIndex === st.num
                        ? 'bg-[#1F64FF] text-white'
                        : stageIndex > st.num
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    {st.label}
                  </button>
                ))}
              </div>
            </div>

            {/* STAGE 1: მოკლე ახსნა */}
            {stageIndex === 1 && (
              <div className="space-y-5">
                <div className="p-5 sm:p-6 rounded-2xl bg-slate-50 border border-slate-200/90 space-y-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#1F64FF] block">
                    ეტაპი 1: მოკლე ახსნა
                  </span>
                  <p className="text-sm sm:text-base text-slate-800 leading-relaxed font-medium">
                    {activeNode.stages.explanationKa}
                  </p>
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={() => setStageIndex(2)}
                    className="px-6 py-2.5 rounded-xl bg-[#1F64FF] hover:bg-blue-700 text-white font-bold text-sm flex items-center space-x-2"
                  >
                    <span>შემდეგი: ყოველდღიური მაგალითი</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STAGE 2: ყოველდღიური მაგალითი */}
            {stageIndex === 2 && (
              <div className="space-y-5">
                <div className="p-5 sm:p-6 rounded-2xl bg-blue-50/70 border border-blue-200 space-y-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#1F64FF] block">
                    ეტაპი 2: ყოველდღიური მაგალითი
                  </span>
                  <p className="text-sm sm:text-base text-slate-900 leading-relaxed font-medium">
                    {activeNode.stages.exampleKa}
                  </p>
                </div>

                <div className="flex items-center justify-between">
                  <button
                    onClick={() => setStageIndex(1)}
                    className="text-xs font-bold text-slate-500 hover:text-slate-800"
                  >
                    უკან
                  </button>
                  <button
                    onClick={() => setStageIndex(3)}
                    className="px-6 py-2.5 rounded-xl bg-[#1F64FF] hover:bg-blue-700 text-white font-bold text-sm flex items-center space-x-2"
                  >
                    <span>შემდეგი: ინტერაქციული კითხვა</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STAGE 3: ინტერაქციული კითხვა */}
            {stageIndex === 3 && (
              <div className="space-y-5">
                <div className="p-4 rounded-xl bg-purple-50 border border-purple-200">
                  <span className="text-xs font-bold text-purple-800 block mb-1">
                    ეტაპი 3: ინტერაქციული კითხვა
                  </span>
                  <p className="text-base font-black text-slate-900">
                    {activeNode.stages.question.questionKa}
                  </p>
                </div>

                <div className="space-y-2.5">
                  {activeNode.stages.question.optionsKa.map((opt, idx) => {
                    const isSelected = selectedQuizOption === idx;
                    const isCorrect = idx === activeNode.stages.question.correctIndex;
                    let optStyle =
                      'bg-white border-slate-200 hover:border-slate-300 text-slate-800';

                    if (quizAnswered) {
                      if (isCorrect) {
                        optStyle =
                          'bg-emerald-50 border-emerald-500 text-emerald-950 font-bold';
                      } else if (isSelected) {
                        optStyle =
                          'bg-rose-50 border-rose-500 text-rose-950';
                      }
                    } else if (isSelected) {
                      optStyle =
                        'bg-blue-50 border-[#1F64FF] text-[#1F64FF] font-bold ring-2 ring-blue-500/20';
                    }

                    return (
                      <button
                        key={idx}
                        type="button"
                        disabled={quizAnswered}
                        onClick={() => setSelectedQuizOption(idx)}
                        className={`w-full text-left p-4 rounded-xl border text-sm transition-all flex items-start space-x-3 ${optStyle}`}
                      >
                        <span className="w-6 h-6 rounded-full border border-slate-300 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                          {String.fromCharCode(65 + idx)}
                        </span>
                        <span>{opt}</span>
                      </button>
                    );
                  })}
                </div>

                {quizAnswered && (
                  <div
                    className={`p-4 rounded-xl border text-xs sm:text-sm leading-relaxed ${
                      selectedQuizOption === activeNode.stages.question.correctIndex
                        ? 'bg-emerald-50 border-emerald-200 text-emerald-950'
                        : 'bg-amber-50 border-amber-200 text-amber-950'
                    }`}
                  >
                    <p className="font-black mb-1">
                      {selectedQuizOption === activeNode.stages.question.correctIndex
                        ? '✓ სწორი პასუხია!'
                        : 'განმარტება:'}
                    </p>
                    <p>{activeNode.stages.question.feedbackKa}</p>
                  </div>
                )}

                <div className="flex items-center justify-between pt-2">
                  <button
                    onClick={() => setStageIndex(2)}
                    className="text-xs font-bold text-slate-500 hover:text-slate-800"
                  >
                    უკან
                  </button>
                  {!quizAnswered ? (
                    <button
                      onClick={handleConfirmStage3Question}
                      disabled={selectedQuizOption === null}
                      className="px-6 py-2.5 rounded-xl bg-[#1F64FF] hover:bg-blue-700 disabled:opacity-50 text-white font-bold text-sm"
                    >
                      პასუხის შემოწმება
                    </button>
                  ) : (
                    <button
                      onClick={() => setStageIndex(4)}
                      className="px-6 py-2.5 rounded-xl bg-[#1F64FF] hover:bg-blue-700 text-white font-bold text-sm flex items-center space-x-2"
                    >
                      <span>შემდეგი: პრაქტიკული სავარჯიშო</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* STAGE 4: პრაქტიკული სავარჯიშო */}
            {stageIndex === 4 && (
              <div className="space-y-5">
                <div className="p-5 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-4">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-amber-800 block">
                      ეტაპი 4: პრაქტიკული სავარჯიშო — {activeNode.stages.practiceExercise.scenarioLabelKa}
                    </span>
                    <p className="text-xs sm:text-sm text-slate-800 mt-1">
                      {activeNode.stages.practiceExercise.promptKa}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="bg-white p-3 rounded-xl border border-slate-200">
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">
                        თვიური შენატანი ({curr})
                      </label>
                      <input
                        type="number"
                        min="0"
                        max="50000"
                        step="50"
                        value={pracMonthly}
                        onChange={e =>
                          setPracMonthly(Math.max(0, Number(e.target.value) || 0))
                        }
                        className="w-full font-black text-slate-900 text-sm border border-slate-300 rounded-lg px-2.5 py-1.5"
                      />
                    </div>

                    <div className="bg-white p-3 rounded-xl border border-slate-200">
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">
                        წლიური სარგებელი (%)
                      </label>
                      <input
                        type="number"
                        min="0"
                        max="50"
                        step="0.5"
                        value={pracRate}
                        onChange={e =>
                          setPracRate(
                            Math.min(50, Math.max(0, Number(e.target.value) || 0))
                          )
                        }
                        className="w-full font-black text-slate-900 text-sm border border-slate-300 rounded-lg px-2.5 py-1.5"
                      />
                    </div>

                    <div className="bg-white p-3 rounded-xl border border-slate-200">
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">
                        ინფლაცია (%)
                      </label>
                      <input
                        type="number"
                        min="0"
                        max="50"
                        step="0.5"
                        value={pracInflation}
                        onChange={e =>
                          setPracInflation(
                            Math.min(50, Math.max(0, Number(e.target.value) || 0))
                          )
                        }
                        className="w-full font-black text-slate-900 text-sm border border-slate-300 rounded-lg px-2.5 py-1.5"
                      />
                    </div>
                  </div>

                  {/* Deterministic Result Summary */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-white p-4 rounded-xl border border-amber-200">
                    <div>
                      <span className="text-[11px] text-slate-500 block">
                        ნომინალური თანხა ({pracYears} წ.)
                      </span>
                      <span className="text-lg font-black text-slate-900">
                        {curr}
                        {practiceProjection.finalNominalValue.toLocaleString()}
                      </span>
                    </div>
                    <div>
                      <span className="text-[11px] text-slate-500 block">
                        რეალური ღირებულება (ინფლაციით)
                      </span>
                      <span className="text-lg font-black text-[#1F64FF]">
                        {curr}
                        {practiceProjection.finalRealValue.toLocaleString()}
                      </span>
                    </div>
                    <div>
                      <span className="text-[11px] text-slate-500 block">
                        რეალური წლიური ზრდა
                      </span>
                      <span className="text-lg font-black text-emerald-700">
                        {practiceProjection.realAnnualReturnPercent}%
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-700 font-medium">
                    💡 {activeNode.stages.practiceExercise.takeawayKa}
                  </p>
                </div>

                <div className="flex items-center justify-between">
                  <button
                    onClick={() => setStageIndex(3)}
                    className="text-xs font-bold text-slate-500 hover:text-slate-800"
                  >
                    უკან
                  </button>
                  <button
                    onClick={handleFinishLessonToStage5}
                    className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm flex items-center space-x-2 shadow-xs"
                  >
                    <span>გაკვეთილის დასრულება</span>
                    <Check className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STAGE 5: შედეგი ("გაკვეთილი დასრულებულია!") */}
            {stageIndex === 5 && (
              <div className="text-center space-y-6 py-2">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-10 h-10" />
                </div>

                <div>
                  <h3 className="text-2xl font-black text-slate-900">
                    გაკვეთილი დასრულებულია!
                  </h3>
                  <p className="text-sm text-slate-600 mt-1">
                    თქვენ წარმატებით გაიარეთ „{activeNode.titleKa}“
                  </p>
                </div>

                {/* Reward Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-left">
                  <div className="p-4 rounded-xl bg-blue-50 border border-blue-200">
                    <span className="text-[11px] font-bold text-slate-500 block">
                      მიღებული ქულა
                    </span>
                    <span className="text-lg font-black text-[#1F64FF]">
                      {xpAwardedThisSession
                        ? `+${activeNode.xpReward} XP`
                        : `+0 XP (უკვე მიღებულია)`}
                    </span>
                  </div>

                  <div className="p-4 rounded-xl bg-purple-50 border border-purple-200">
                    <span className="text-[11px] font-bold text-slate-500 block">
                      მიღწევის პროგრესი
                    </span>
                    <span className="text-sm font-black text-purple-900">
                      „ინფლაციის საფუძვლები“
                    </span>
                  </div>

                  <div className="p-4 rounded-xl bg-amber-50 border border-amber-200">
                    <span className="text-[11px] font-bold text-slate-500 block">
                      სწავლის უწყვეტობა
                    </span>
                    <span className="text-lg font-black text-amber-700 flex items-center">
                      <Flame className="w-4 h-4 mr-1 fill-amber-500" />
                      {user.streak} დღე Streak
                    </span>
                  </div>
                </div>

                {/* Required Completion Buttons */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                  <button
                    onClick={handleNextLessonFromModal}
                    className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#1F64FF] hover:bg-blue-700 text-white font-bold text-sm flex items-center justify-center space-x-2 shadow-xs"
                  >
                    <span>შემდეგი გაკვეთილი</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => {
                      const calcId = activeNode.recommendedCalculator || 'inflation';
                      setActiveNode(null);
                      onOpenCalculator(calcId);
                    }}
                    className="w-full sm:w-auto px-6 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-sm flex items-center justify-center space-x-2 border border-slate-300"
                  >
                    <Calculator className="w-4 h-4 text-[#1F64FF]" />
                    <span>ცოდნის გამოყენება კალკულატორში</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Achievement Detail Modal */}
      {selectedAchievement && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4"
          role="dialog"
          aria-modal="true"
        >
          <div className="relative w-full max-w-md bg-white rounded-2xl border border-slate-200 p-6 shadow-xl space-y-4">
            <button
              onClick={() => setSelectedAchievement(null)}
              aria-label="დახურვა"
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-800 rounded-lg hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-[#1F64FF] flex items-center justify-center">
                <Award className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs font-bold text-[#1F64FF] uppercase">
                  მიღწევის დეტალები
                </span>
                <h3 className="text-lg font-black text-slate-900">
                  {selectedAchievement.titleKa}
                </h3>
              </div>
            </div>

            <p className="text-sm text-slate-700 leading-relaxed">
              {selectedAchievement.requirementKa}
            </p>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs font-bold">
              <span className="text-slate-600">
                პროგრესი: {selectedAchievement.progressCurrent} /{' '}
                {selectedAchievement.progressTarget}
              </span>
              <span className="text-[#1F64FF]">
                ჯილდო: +{selectedAchievement.xpBonus} XP
              </span>
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => setSelectedAchievement(null)}
                className="px-5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold"
              >
                დახურვა
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Legacy Reader Modal if triggered */}
      {activeCardLesson && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-white rounded-2xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto shadow-xl">
            <button
              onClick={() => setActiveCardLesson(null)}
              className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-800 rounded-lg hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>
            <h2 className="text-xl font-black text-slate-900 mb-4">
              {activeCardLesson.titleKa}
            </h2>
            {!isCardQuizMode ? (
              <div className="space-y-4">
                <p className="text-sm text-slate-700 whitespace-pre-line">
                  {activeCardLesson.contentKa}
                </p>
                <button
                  onClick={() => setIsCardQuizMode(true)}
                  className="px-5 py-2.5 rounded-xl bg-[#1F64FF] text-white font-bold text-xs"
                >
                  {t.takeSimpleQuiz}
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="font-bold text-slate-900">
                  {activeCardLesson.quiz.questionKa}
                </p>
                {activeCardLesson.quiz.optionsKa.map((o, i) => (
                  <button
                    key={i}
                    onClick={() => setCardSelectedOption(i)}
                    className="block w-full text-left p-3 rounded-xl border border-slate-200 text-xs"
                  >
                    {o}
                  </button>
                ))}
                {!cardQuizSubmitted && (
                  <button
                    onClick={handleCardCheckAnswer}
                    className="px-5 py-2 rounded-xl bg-[#1F64FF] text-white text-xs font-bold"
                  >
                    პასუხის შემოწმება
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
