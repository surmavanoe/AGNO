import React, { useState, useMemo } from 'react';
import { UserProfile, FinancialGoal, BudgetData, GoalAnalysisResult } from '../types';
import {
  calculateCompoundProjection,
  calculateGoalMonthlyRequirement,
  calculateRealReturnRate,
  sanitizeMoney,
  sanitizeRatePercent,
  sanitizeYears,
} from '../utils/financialCalculations';
import { translations, currencySymbols } from '../translations';
import {
  Target,
  Plus,
  Trash2,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Calendar,
  Sliders,
  FileText,
  X,
  Info,
  BookOpen,
} from 'lucide-react';

interface BudgetGoalTrackerProps {
  user: UserProfile;
  budget: BudgetData;
  setBudget: React.Dispatch<React.SetStateAction<BudgetData>>;
  goals: FinancialGoal[];
  setGoals: React.Dispatch<React.SetStateAction<FinancialGoal[]>>;
  onDiscussWithAi: (contextPrompt: string) => void;
  onStartRecommendedLesson?: (lessonNodeId: string) => void;
}

const CATEGORY_LABELS_KA: Record<FinancialGoal['category'], string> = {
  emergency: 'უსაფრთხოების რეზერვი',
  retirement: 'გრძელვადიანი კაპიტალი',
  education: 'განათლება',
  real_estate: 'უძრავი ქონება',
  business: 'ბიზნესი',
  other: 'სხვა მიზანი',
};

export const BudgetGoalTracker: React.FC<BudgetGoalTrackerProps> = ({
  user,
  budget,
  setBudget,
  goals,
  setGoals,
  onDiscussWithAi,
  onStartRecommendedLesson,
}) => {
  const t = translations[user.language];
  const curr = currencySymbols[user.currency] || '₾';

  // New goal form state
  const [isAddingGoal, setIsAddingGoal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<FinancialGoal['category']>('emergency');
  const [newTarget, setNewTarget] = useState(10000);
  const [newCurrent, setNewCurrent] = useState(1500);
  const [newYears, setNewYears] = useState(2);

  // Active Goal Modal: 'plan' ("გეგმის ნახვა") or 'simulate' ("სიმულაცია")
  const [activeGoal, setActiveGoal] = useState<FinancialGoal | null>(null);
  const [modalMode, setModalMode] = useState<'plan' | 'simulate'>('plan');

  // Simulation controls inside modal
  const [simMonthly, setSimMonthly] = useState<number>(350);
  const [simYears, setSimYears] = useState<number>(3);
  const [simAnnualReturn, setSimAnnualReturn] = useState<number>(9);
  const [simInflation, setSimInflation] = useState<number>(4);

  // AI Goal analysis state
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<GoalAnalysisResult | null>(null);

  const totalExpenses = budget.fixedExpenses + budget.discretionaryExpenses;
  const netSavings = Math.max(0, budget.income - totalExpenses);

  const openGoalModal = (goal: FinancialGoal, mode: 'plan' | 'simulate') => {
    const req = calculateGoalMonthlyRequirement({
      targetAmount: goal.targetAmount,
      currentAmount: goal.currentAmount,
      months: goal.targetYears * 12,
      annualReturnPercent: 0,
    });
    setActiveGoal(goal);
    setModalMode(mode);
    setSimMonthly(goal.monthlyContribution || req.requiredMonthly || 300);
    setSimYears(sanitizeYears(goal.targetYears, 2));
    setSimAnnualReturn(8.5);
    setSimInflation(4);
  };

  // Deterministic simulation calculation for activeGoal
  const simulationProjection = useMemo(() => {
    if (!activeGoal) return null;
    const validMonthly = sanitizeMoney(simMonthly, 0);
    const validYears = sanitizeYears(simYears, 1);
    const validReturn = sanitizeRatePercent(simAnnualReturn, 0);
    const validInflation = sanitizeRatePercent(simInflation, 0);

    const proj = calculateCompoundProjection({
      initialPrincipal: activeGoal.currentAmount,
      monthlyContribution: validMonthly,
      annualRatePercent: validReturn,
      annualInflationPercent: validInflation,
      years: validYears,
    });

    const realRate = calculateRealReturnRate(validReturn, validInflation);

    return {
      ...proj,
      validMonthly,
      validYears,
      validReturn,
      validInflation,
      realRate: Math.round(realRate * 100) / 100,
    };
  }, [activeGoal, simMonthly, simYears, simAnnualReturn, simInflation]);

  const handleAddGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const validTarget = sanitizeMoney(Number(newTarget), 1000);
    const validCurrent = sanitizeMoney(Number(newCurrent), 0);
    const validYears = Math.min(50, Math.max(1, Math.round(Number(newYears) || 1)));
    const targetYearNum = 2026 + validYears;

    const newGoal: FinancialGoal = {
      id: `goal-${Date.now()}`,
      title: newTitle.trim(),
      category: newCategory,
      categoryLabelKa: CATEGORY_LABELS_KA[newCategory],
      targetAmount: validTarget,
      currentAmount: validCurrent,
      targetYears: validYears,
      targetDateKa: `ნოემბერი, ${targetYearNum}`,
      monthlyContribution: Math.ceil(
        Math.max(0, validTarget - validCurrent) / (validYears * 12)
      ),
      statusLabelKa: 'გეგმის მიხედვით',
      priority: 'high',
    };

    setGoals(prev => [...prev, newGoal]);
    setNewTitle('');
    setIsAddingGoal(false);
  };

  const handleDeleteGoal = (id: string) => {
    setGoals(prev => prev.filter(g => g.id !== id));
  };

  const handleRunAnalysis = async () => {
    setIsAnalyzing(true);
    try {
      const response = await fetch('/api/analyze-goals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          budget,
          goals,
          riskProfile: user.riskTolerance,
          language: user.language,
          currency: curr,
        }),
      });
      if (!response.ok) throw new Error('Analysis error');
      const data = await response.json();
      setAnalysisResult(data);
    } catch {
      setAnalysisResult({
        summary: `თქვენი ყოველთვიური თავისუფალი თანხა შეადგენს ${curr}${netSavings}-ს. ეს გაძლევთ საშუალებას თანმიმდევრულად დააფინანსოთ სამივე მიზანი პრიორიტეტების მიხედვით.`,
        healthScore: 68,
        riskAlignment:
          'მოკლევადიანი რეზერვისთვის რეკომენდებულია ლიკვიდური შემნახველი ანაბარი, ხოლო გრძელვადიანი მიზნებისთვის — ინფლაციაზე მაღალი სარგებლის მქონე დივერსიფიცირებული ინსტრუმენტები.',
        actionSteps: [
          'პირველ რიგში სრულად შეავსეთ „საგანგებო ფონდი და რეზერვი“',
          'ჩართეთ ყოველთვიური ავტომატური გადარიცხვა მიზნობრივ ანგარიშებზე',
          'გადაამოწმეთ ინფლაციის გავლენა 6 და 15-წლიან მიზნებზე სიმულატორში',
        ],
        goalFeasibility: goals.map(g => ({
          id: g.id,
          title: g.title,
          targetAmount: g.targetAmount,
          estimatedMonths: g.targetYears * 12,
          onTrack: true,
          status: g.statusLabelKa || 'გეგმის მიხედვით',
        })),
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center space-x-3">
            <Target className="w-8 h-8 text-[#1F64FF]" />
            <span>{t.goalsTitle}</span>
          </h1>
          <p className="text-sm sm:text-base text-slate-600 mt-1">
            {t.goalsSubtitle}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setIsAddingGoal(true)}
            className="px-4 py-2.5 rounded-xl bg-[#1F64FF] hover:bg-blue-700 text-white font-bold text-xs sm:text-sm flex items-center space-x-2 shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>+ ახალი მიზანი</span>
          </button>

          <button
            onClick={handleRunAnalysis}
            disabled={isAnalyzing || goals.length === 0}
            className="px-4 py-2.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-800 border border-purple-200 font-bold text-xs sm:text-sm flex items-center space-x-2 transition-colors disabled:opacity-50"
          >
            <Sparkles className="w-4 h-4 text-purple-600" />
            <span>
              {isAnalyzing ? 'AI აანალიზებს...' : 'შეაფასე ჩემი მიზნები AI-ით'}
            </span>
          </button>
        </div>
      </div>

      {/* Recommended Next Learning Action Banner on Goals Page */}
      <div className="bg-blue-50/70 border border-blue-200 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-start space-x-3">
          <div className="w-9 h-9 rounded-xl bg-[#1F64FF] text-white flex items-center justify-center shrink-0 mt-0.5">
            <BookOpen className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#1F64FF] block">
              რეკომენდებული შემდეგი ნაბიჯი
            </span>
            <p className="text-xs sm:text-sm font-bold text-slate-900">
              გაიარეთ 4-წუთიანი გაკვეთილი „ფინანსური მიზნების დაგეგმვა“ და გაიგეთ, როგორ შეუსაბამოთ მიზნის ვადას სწორი საინვესტიციო ინსტრუმენტი.
            </p>
          </div>
        </div>
        {onStartRecommendedLesson && (
          <button
            onClick={() => onStartRecommendedLesson('m4-n1')}
            className="px-4 py-2 rounded-xl bg-white hover:bg-blue-50 text-[#1F64FF] border border-blue-200 font-bold text-xs whitespace-nowrap shrink-0 transition-colors"
          >
            გაკვეთილის გახსნა →
          </button>
        )}
      </div>

      {/* Add Goal Form */}
      {isAddingGoal && (
        <form
          onSubmit={handleAddGoal}
          className="bg-white border-2 border-[#1F64FF] rounded-2xl p-6 shadow-md space-y-5"
        >
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-base font-black text-slate-900">
              {t.addGoalTitle}
            </h3>
            <button
              type="button"
              onClick={() => setIsAddingGoal(false)}
              className="text-xs text-slate-500 hover:text-slate-800 font-bold"
            >
              ✕ {t.cancelBtn}
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {t.goalNameLabel}
              </label>
              <input
                type="text"
                required
                placeholder={t.goalNamePlaceholder}
                value={newTitle}
                onChange={e => setNewTitle(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-slate-900 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#1F64FF]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                კატეგორია
              </label>
              <select
                value={newCategory}
                onChange={e => setNewCategory(e.target.value as any)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-slate-900 text-sm font-semibold"
              >
                <option value="emergency">უსაფრთხოების რეზერვი</option>
                <option value="retirement">გრძელვადიანი კაპიტალი</option>
                <option value="education">განათლება</option>
                <option value="real_estate">უძრავი ქონება</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {t.targetYearsLabel}
              </label>
              <input
                type="number"
                min="1"
                max="50"
                required
                value={newYears}
                onChange={e =>
                  setNewYears(Math.min(50, Math.max(1, Number(e.target.value) || 1)))
                }
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-slate-900 text-sm font-semibold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {t.targetAmountLabel} ({curr})
              </label>
              <input
                type="number"
                min="100"
                step="500"
                required
                value={newTarget}
                onChange={e =>
                  setNewTarget(Math.max(0, Number(e.target.value) || 0))
                }
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-slate-900 text-sm font-semibold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {t.currentSavedLabel} ({curr})
              </label>
              <input
                type="number"
                min="0"
                step="100"
                value={newCurrent}
                onChange={e =>
                  setNewCurrent(Math.max(0, Number(e.target.value) || 0))
                }
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-slate-900 text-sm font-semibold"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-2">
            <button
              type="button"
              onClick={() => setIsAddingGoal(false)}
              className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-900"
            >
              {t.cancelBtn}
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-[#1F64FF] hover:bg-blue-700 text-white font-bold text-sm shadow-xs"
            >
              {t.saveBtn}
            </button>
          </div>
        </form>
      )}

      {/* Goal Cards Grid (Section 6) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {goals.map((goal, idx) => {
          const pct = Math.min(
            100,
            Math.round((goal.currentAmount / Math.max(1, goal.targetAmount)) * 100)
          );
          const monthsTotal = Math.max(1, goal.targetYears * 12);
          const reqInfo = calculateGoalMonthlyRequirement({
            targetAmount: goal.targetAmount,
            currentAmount: goal.currentAmount,
            months: monthsTotal,
            annualReturnPercent: 0,
          });

          const categoryLabel =
            goal.categoryLabelKa || CATEGORY_LABELS_KA[goal.category] || goal.category;
          const targetDateText =
            goal.targetDateKa || `ნოემბერი, ${2026 + goal.targetYears}`;

          // Status badge ("გეგმის მიხედვით" | "მცირე ჩამორჩენა" | "მიზანზე წინ")
          const defaultStatuses: Array<'მიზანზე წინ' | 'გეგმის მიხედვით' | 'მცირე ჩამორჩენა'> = [
            'მიზანზე წინ',
            'გეგმის მიხედვით',
            'მცირე ჩამორჩენა',
          ];
          const statusLabel = goal.statusLabelKa || defaultStatuses[idx % 3];

          let statusBadgeClass =
            'bg-emerald-50 text-emerald-800 border-emerald-200';
          if (statusLabel === 'მცირე ჩამორჩენა') {
            statusBadgeClass = 'bg-amber-50 text-amber-800 border-amber-200';
          } else if (statusLabel === 'გეგმის მიხედვით') {
            statusBadgeClass = 'bg-blue-50 text-[#1F64FF] border-blue-200';
          }

          return (
            <div
              key={goal.id}
              className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs flex flex-col justify-between hover:border-slate-300 transition-all"
            >
              <div>
                {/* Top Row: Category + Status Label + Delete */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#1F64FF] bg-blue-50 px-2.5 py-1 rounded-lg">
                    {categoryLabel}
                  </span>
                  <div className="flex items-center space-x-1.5">
                    <span
                      className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${statusBadgeClass}`}
                    >
                      {statusLabel}
                    </span>
                    <button
                      onClick={() => handleDeleteGoal(goal.id)}
                      className="text-slate-400 hover:text-rose-600 p-1 rounded-lg transition-colors"
                      title="მიზნის წაშლა"
                      aria-label="მიზნის წაშლა"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Title & Target Date */}
                <h3 className="text-lg font-black text-slate-900 mb-1">
                  {goal.title}
                </h3>
                <p className="text-xs text-slate-500 flex items-center mb-4">
                  <Calendar className="w-3.5 h-3.5 mr-1 text-slate-400" />
                  <span>სამიზნე თარიღი: {targetDateText}</span>
                </p>

                {/* Progress Percentage & Amounts */}
                <div className="flex justify-between items-baseline text-xs mb-1.5">
                  <span className="font-bold text-slate-700">
                    პროგრესი: {pct}%
                  </span>
                  <span className="font-black text-slate-900 text-sm">
                    {curr}
                    {goal.currentAmount.toLocaleString()}{' '}
                    <span className="text-slate-400 font-normal">
                      / {curr}
                      {goal.targetAmount.toLocaleString()}
                    </span>
                  </span>
                </div>

                <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden mb-4">
                  <div
                    className="bg-[#1F64FF] h-3 rounded-full transition-all duration-500"
                    style={{ width: `${pct}%` }}
                  />
                </div>

                {/* Required Monthly Contribution */}
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between text-xs">
                  <span className="text-slate-600 font-semibold">
                    საჭირო თვიური შენატანი:
                  </span>
                  <span className="text-sm font-black text-slate-900">
                    {curr}
                    {reqInfo.requiredMonthly.toLocaleString()} / თვე
                  </span>
                </div>
              </div>

              {/* Action Buttons: "გეგმის ნახვა" and "სიმულაცია" */}
              <div className="mt-5 pt-4 border-t border-slate-100 grid grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={() => openGoalModal(goal, 'plan')}
                  className="py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs flex items-center justify-center space-x-1.5 transition-colors"
                >
                  <FileText className="w-3.5 h-3.5 text-[#1F64FF]" />
                  <span>გეგმის ნახვა</span>
                </button>

                <button
                  type="button"
                  onClick={() => openGoalModal(goal, 'simulate')}
                  className="py-2.5 px-3 rounded-xl bg-[#1F64FF] hover:bg-blue-700 text-white font-bold text-xs flex items-center justify-center space-x-1.5 shadow-xs transition-colors"
                >
                  <Sliders className="w-3.5 h-3.5" />
                  <span>სიმულაცია</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* GOAL PLAN & INTERACTIVE SIMULATION MODAL (Section 6) */}
      {activeGoal && simulationProjection && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto"
          role="dialog"
          aria-modal="true"
        >
          <div className="relative w-full max-w-2xl bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 max-h-[92vh] overflow-y-auto shadow-xl space-y-6">
            <button
              onClick={() => setActiveGoal(null)}
              aria-label="დახურვა"
              className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-800 rounded-lg hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Header & Mode Tabs */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4 pr-8">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#1F64FF]">
                  {activeGoal.categoryLabelKa || CATEGORY_LABELS_KA[activeGoal.category]}
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                  {activeGoal.title}
                </h2>
              </div>

              <div className="inline-flex p-1 rounded-xl bg-slate-100 border border-slate-200 self-start">
                <button
                  type="button"
                  onClick={() => setModalMode('plan')}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    modalMode === 'plan'
                      ? 'bg-[#1F64FF] text-white'
                      : 'text-slate-700 hover:text-slate-900'
                  }`}
                >
                  გეგმის ნახვა
                </button>
                <button
                  type="button"
                  onClick={() => setModalMode('simulate')}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    modalMode === 'simulate'
                      ? 'bg-[#1F64FF] text-white'
                      : 'text-slate-700 hover:text-slate-900'
                  }`}
                >
                  სიმულაცია
                </button>
              </div>
            </div>

            {modalMode === 'plan' ? (
              /* MODE 1: გეგმის ნახვა */
              <div className="space-y-5">
                {(() => {
                  const remainingAmount = Math.max(
                    0,
                    activeGoal.targetAmount - activeGoal.currentAmount
                  );
                  const remainingMonths = Math.max(1, activeGoal.targetYears * 12);
                  const currentContrib =
                    activeGoal.monthlyContribution ||
                    Math.round(remainingAmount / remainingMonths);
                  const suggestedContrib = Math.ceil(
                    remainingAmount / remainingMonths
                  );

                  return (
                    <>
                      {/* Goal Summary Grid */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                          <span className="text-[11px] font-bold text-slate-500 block">
                            დარჩენილი თანხა
                          </span>
                          <span className="text-base font-black text-slate-900">
                            {curr}
                            {remainingAmount.toLocaleString()}
                          </span>
                        </div>
                        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                          <span className="text-[11px] font-bold text-slate-500 block">
                            დარჩენილი თვეები
                          </span>
                          <span className="text-base font-black text-slate-900">
                            {remainingMonths} თვე
                          </span>
                        </div>
                        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                          <span className="text-[11px] font-bold text-slate-500 block">
                            მიმდინარე შენატანი
                          </span>
                          <span className="text-base font-black text-slate-900">
                            {curr}
                            {currentContrib.toLocaleString()}/თვე
                          </span>
                        </div>
                        <div className="p-3.5 rounded-xl bg-blue-50 border border-blue-200">
                          <span className="text-[11px] font-bold text-[#1F64FF] block">
                            რეკომენდებული (დემო)
                          </span>
                          <span className="text-base font-black text-[#1F64FF]">
                            {curr}
                            {suggestedContrib.toLocaleString()}/თვე
                          </span>
                        </div>
                      </div>

                      {/* Simple Projected Progress Chart */}
                      <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                        <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                          <span>პროგნოზირებული დაგროვების გრაფიკი</span>
                          <span className="text-[#1F64FF]">
                            სამიზნე: {curr}
                            {activeGoal.targetAmount.toLocaleString()}
                          </span>
                        </div>

                        <div className="h-36 flex items-end space-x-2 pt-4">
                          {simulationProjection.yearlyBreakdown.map(pt => {
                            const maxVal = Math.max(
                              activeGoal.targetAmount,
                              simulationProjection.finalNominalValue,
                              1
                            );
                            const barHeight = Math.min(
                              100,
                              Math.max(10, Math.round((pt.nominalTotal / maxVal) * 100))
                            );
                            return (
                              <div
                                key={pt.year}
                                className="flex-1 flex flex-col items-center h-full justify-end"
                              >
                                <div className="w-full bg-slate-200/70 rounded-t-lg h-full flex items-end overflow-hidden">
                                  <div
                                    className="w-full bg-[#1F64FF] rounded-t-lg transition-all duration-300"
                                    style={{ height: `${barHeight}%` }}
                                    title={`წელი ${pt.year}: ${curr}${pt.nominalTotal.toLocaleString()}`}
                                  />
                                </div>
                                <span className="text-[10px] font-bold text-slate-500 mt-1">
                                  წ. {pt.year}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Assumptions Panel */}
                      <div className="p-4 rounded-xl bg-white border border-slate-200 space-y-1.5 text-xs text-slate-600">
                        <span className="font-black text-slate-900 block">
                          გამოთვლის დაშვებები:
                        </span>
                        <p>
                          • საწყისი თანხა: {curr}
                          {activeGoal.currentAmount.toLocaleString()} | სამიზნე თანხა:{' '}
                          {curr}
                          {activeGoal.targetAmount.toLocaleString()}
                        </p>
                        <p>
                          • თანაბარი ყოველთვიური შენატანი ({curr}
                          {suggestedContrib.toLocaleString()}) {remainingMonths} თვის განმავლობაში.
                        </p>
                      </div>

                      {/* Mandatory Educational Warning */}
                      <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-xs font-bold text-amber-900 flex items-center space-x-2">
                        <Info className="w-4 h-4 text-amber-700 shrink-0" />
                        <span>
                          ეს არის საგანმანათლებლო სიმულაცია და არა გარანტირებული ფინანსური შედეგი.
                        </span>
                      </div>

                      <div className="flex items-center justify-between pt-2">
                        <button
                          type="button"
                          onClick={() => setModalMode('simulate')}
                          className="px-5 py-2.5 rounded-xl bg-[#1F64FF] hover:bg-blue-700 text-white text-xs font-bold flex items-center space-x-1.5"
                        >
                          <Sliders className="w-3.5 h-3.5" />
                          <span>პარამეტრების სიმულაცია</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setActiveGoal(null)}
                          className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-900"
                        >
                          დახურვა
                        </button>
                      </div>
                    </>
                  );
                })()}
              </div>
            ) : (
              /* MODE 2: ინტერაქციული სიმულაცია (Deterministic JS formulas) */
              <div className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Monthly contribution */}
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      ყოველთვიური შენატანი ({curr})
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="100000"
                      step="50"
                      value={simMonthly}
                      onChange={e =>
                        setSimMonthly(sanitizeMoney(Number(e.target.value), 0))
                      }
                      className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm font-black text-slate-900"
                    />
                  </div>

                  {/* Time period (Years: 1 month to 50 years) */}
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      პერიოდი (წლები: 1–50)
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="50"
                      step="1"
                      value={simYears}
                      onChange={e =>
                        setSimYears(sanitizeYears(Number(e.target.value), 1))
                      }
                      className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm font-black text-slate-900"
                    />
                  </div>

                  {/* Illustrative Annual Return (0% - 50%) */}
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      საილუსტრაციო წლიური სარგებელი (0%–50%)
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="50"
                      step="0.5"
                      value={simAnnualReturn}
                      onChange={e =>
                        setSimAnnualReturn(
                          sanitizeRatePercent(Number(e.target.value), 0)
                        )
                      }
                      className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm font-black text-slate-900"
                    />
                  </div>

                  {/* Illustrative Inflation Rate (0% - 50%) */}
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      საილუსტრაციო წლიური ინფლაცია (0%–50%)
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="50"
                      step="0.5"
                      value={simInflation}
                      onChange={e =>
                        setSimInflation(
                          sanitizeRatePercent(Number(e.target.value), 0)
                        )
                      }
                      className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm font-black text-slate-900"
                    />
                  </div>
                </div>

                {/* Live Projected Values */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-3.5 rounded-xl bg-blue-50 border border-blue-200">
                    <span className="text-[11px] font-bold text-slate-600 block">
                      საბოლოო ნომინალური
                    </span>
                    <span className="text-base font-black text-[#1F64FF]">
                      {curr}
                      {simulationProjection.finalNominalValue.toLocaleString()}
                    </span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200">
                    <span className="text-[11px] font-bold text-emerald-800 block">
                      რეალური ღირებულება
                    </span>
                    <span className="text-base font-black text-emerald-800">
                      {curr}
                      {simulationProjection.finalRealValue.toLocaleString()}
                    </span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="text-[11px] font-bold text-slate-500 block">
                      სულ შენატანი
                    </span>
                    <span className="text-base font-black text-slate-900">
                      {curr}
                      {simulationProjection.totalPrincipal.toLocaleString()}
                    </span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-purple-50 border border-purple-200">
                    <span className="text-[11px] font-bold text-purple-800 block">
                      რეალური სარგებელი
                    </span>
                    <span className="text-base font-black text-purple-900">
                      {simulationProjection.realRate}% / წ.
                    </span>
                  </div>
                </div>

                {/* Live Updating Chart */}
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                    <span>
                      ლურჯი: ნომინალური ზრდა | მწვანე: რეალური მსყიდველობითი ძალა
                    </span>
                  </div>

                  <div className="h-36 flex items-end space-x-1.5 pt-3">
                    {simulationProjection.yearlyBreakdown
                      .slice(0, 20)
                      .map(pt => {
                        const maxVal = Math.max(
                          simulationProjection.finalNominalValue,
                          activeGoal.targetAmount,
                          1
                        );
                        const nomH = Math.min(
                          100,
                          Math.max(8, Math.round((pt.nominalTotal / maxVal) * 100))
                        );
                        const realH = Math.min(
                          100,
                          Math.max(6, Math.round((pt.realTotal / maxVal) * 100))
                        );

                        return (
                          <div
                            key={pt.year}
                            className="flex-1 flex flex-col items-center h-full justify-end"
                          >
                            <div className="w-full flex items-end justify-center space-x-0.5 h-full">
                              <div
                                className="w-1/2 bg-[#1F64FF] rounded-t-sm transition-all duration-300"
                                style={{ height: `${nomH}%` }}
                                title={`ნომინალური წ. ${pt.year}: ${curr}${pt.nominalTotal.toLocaleString()}`}
                              />
                              <div
                                className="w-1/2 bg-emerald-500 rounded-t-sm transition-all duration-300"
                                style={{ height: `${realH}%` }}
                                title={`რეალური წ. ${pt.year}: ${curr}${pt.realTotal.toLocaleString()}`}
                              />
                            </div>
                            <span className="text-[9px] font-bold text-slate-500 mt-1">
                              {pt.year}წ
                            </span>
                          </div>
                        );
                      })}
                  </div>
                </div>

                {/* Mandatory Warning */}
                <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-xs font-bold text-amber-900 flex items-center space-x-2">
                  <Info className="w-4 h-4 text-amber-700 shrink-0" />
                  <span>
                    ეს არის საგანმანათლებლო სიმულაცია და არა გარანტირებული ფინანსური შედეგი.
                  </span>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      const prompt = `გთხოვ ამიხსნა მარტივად ჩემი მიზნის („${activeGoal.title}“) სიმულაციის შედეგი: საწყისი თანხა ${curr}${activeGoal.currentAmount}, ყოველთვიური შენატანი ${curr}${simulationProjection.validMonthly}, პერიოდი ${simulationProjection.validYears} წელი, საილუსტრაციო წლიური სარგებელი ${simulationProjection.validReturn}%, ინფლაცია ${simulationProjection.validInflation}%. საბოლოო ნომინალური თანხაა ${curr}${simulationProjection.finalNominalValue}, ხოლო ინფლაციით კორექტირებული რეალური ღირებულება — ${curr}${simulationProjection.finalRealValue}.`;
                      setActiveGoal(null);
                      onDiscussWithAi(prompt);
                    }}
                    className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold flex items-center space-x-1.5"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>აუხსენი AI-ის დახმარებით</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveGoal(null)}
                    className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-900"
                  >
                    დახურვა
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* AI Strategy Report */}
      {analysisResult && (
        <div className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-7 shadow-xs space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#1F64FF] flex items-center justify-center">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-black text-slate-900">
                  AGNO AI-ს რეკომენდაციები
                </h3>
                <p className="text-xs text-slate-500">
                  საგანმანათლებლო შეფასება (დემო)
                </p>
              </div>
            </div>

            <button
              onClick={() =>
                onDiscussWithAi(
                  `განვიხილოთ ჩემი მიზნების გეგმა: ${analysisResult.summary}`
                )
              }
              className="px-4 py-2 rounded-xl bg-[#1F64FF] hover:bg-blue-700 text-white font-bold text-xs flex items-center space-x-1.5 self-start sm:self-auto"
            >
              <span>კითხვა AI-სთან</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <p className="text-sm sm:text-base text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-200/60">
            {analysisResult.summary}
          </p>

          <div className="space-y-2">
            {analysisResult.actionSteps.map((step, idx) => (
              <div
                key={idx}
                className="flex items-start space-x-3 text-xs sm:text-sm text-slate-800 bg-white p-3 rounded-xl border border-slate-200/80"
              >
                <span className="w-6 h-6 rounded-full bg-blue-100 text-[#1F64FF] font-bold flex items-center justify-center text-xs shrink-0 mt-0.5">
                  {idx + 1}
                </span>
                <span>{step}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
