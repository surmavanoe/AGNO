import React, { useState } from 'react';
import { UserProfile, FinancialGoal, BudgetData, GoalAnalysisResult } from '../types';
import { translations, currencySymbols } from '../translations';
import { 
  Target, 
  Plus, 
  Trash2, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight,
  TrendingUp,
  ShieldCheck,
  Check
} from 'lucide-react';

interface BudgetGoalTrackerProps {
  user: UserProfile;
  budget: BudgetData;
  setBudget: React.Dispatch<React.SetStateAction<BudgetData>>;
  goals: FinancialGoal[];
  setGoals: React.Dispatch<React.SetStateAction<FinancialGoal[]>>;
  onDiscussWithAi: (contextPrompt: string) => void;
}

export const BudgetGoalTracker: React.FC<BudgetGoalTrackerProps> = ({
  user,
  budget,
  setBudget,
  goals,
  setGoals,
  onDiscussWithAi,
}) => {
  const t = translations[user.language];
  const curr = currencySymbols[user.currency] || '₾';

  const [isAddingGoal, setIsAddingGoal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<FinancialGoal['category']>('emergency');
  const [newTarget, setNewTarget] = useState(10000);
  const [newCurrent, setNewCurrent] = useState(1500);
  const [newYears, setNewYears] = useState(2);

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<GoalAnalysisResult | null>(null);

  const totalExpenses = budget.fixedExpenses + budget.discretionaryExpenses;
  const netSavings = Math.max(0, budget.income - totalExpenses);

  const presets = user.language === 'ka' ? [
    { title: 'საგანგებო უსაფრთხოების ფონდი', cat: 'emergency' as const, amount: 6000, years: 1 },
    { title: 'ბინის რემონტი / შენატანი', cat: 'real_estate' as const, amount: 20000, years: 3 },
    { title: 'საპენსიო კაპიტალი', cat: 'retirement' as const, amount: 50000, years: 10 },
  ] : [
    { title: 'Emergency Cushion', cat: 'emergency' as const, amount: 6000, years: 1 },
    { title: 'Home Down Payment', cat: 'real_estate' as const, amount: 20000, years: 3 },
    { title: 'Retirement Nest Egg', cat: 'retirement' as const, amount: 50000, years: 10 },
  ];

  const handleApplyPreset = (p: typeof presets[0]) => {
    setNewTitle(p.title);
    setNewCategory(p.cat);
    setNewTarget(p.amount);
    setNewYears(p.years);
  };

  const handleAddGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newGoal: FinancialGoal = {
      id: `goal-${Date.now()}`,
      title: newTitle.trim(),
      category: newCategory,
      targetAmount: Number(newTarget),
      currentAmount: Number(newCurrent),
      targetYears: Number(newYears),
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
    } catch (err) {
      console.error(err);
      setAnalysisResult({
        summary: user.language === 'ka'
          ? `თქვენ ყოველთვიურად გრჩებათ ${curr}${netSavings}. ეს შესანიშნავი საფუძველია მიზნების ეტაპობრივად მისაღწევად.`
          : `You have ${curr}${netSavings} left over each month. This provides a clear, reliable basis for your goals.`,
        healthScore: 82,
        riskAlignment: user.language === 'ka'
          ? `თქვენი პროფილი დაბალანსებულია. რეკომენდებულია უსაფრთხო საბანკო დეპოზიტებისა და გრძელვადიანი ინდექსების შეხამება.`
          : `Your risk approach is well balanced. Keep 3 months in liquid deposits and invest the remainder in diversified index funds.`,
        actionSteps: user.language === 'ka' ? [
          'დაასრულეთ 3 თვის საგანგებო მარაგი ბანკის ანაბარზე',
          'ჩართეთ ავტომატური გადარიცხვა ყოველი ხელფასის ჩარიცხვისას',
          'გამოიყენეთ საპენსიო სისტემა (2+2+2) დამსაქმებლის თანადაფინანსების მისაღებად'
        ] : [
          'Finish your 3-month safety buffer in an accessible high-yield account',
          'Automate monthly savings right when your salary arrives',
          'Leverage matched pension contributions for the 2+2+2 compounding engine'
        ],
        goalFeasibility: goals.map(g => {
          const needed = Math.max(0, g.targetAmount - g.currentAmount);
          const reqMo = Math.ceil(needed / (g.targetYears * 12));
          const onTrack = netSavings >= reqMo;
          return {
            id: g.id,
            title: g.title,
            targetAmount: g.targetAmount,
            estimatedMonths: Math.ceil(needed / (netSavings || 1)),
            onTrack,
            status: onTrack ? (user.language === 'ka' ? '✓ სრულად მიღწევადია' : '✓ On track') : (user.language === 'ka' ? 'მოითხოვს დანაზოგის გაზრდას' : 'Requires adjustment')
          };
        })
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Title & Description */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center space-x-3">
            <Target className="w-8 h-8 text-blue-600" />
            <span>{t.goalsTitle}</span>
          </h1>
          <p className="text-sm sm:text-base text-slate-600 mt-1">
            {t.goalsSubtitle}
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsAddingGoal(true)}
            className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm flex items-center space-x-2 shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>{user.language === 'ka' ? '+ ახალი მიზანი' : '+ Add Goal'}</span>
          </button>

          <button
            onClick={handleRunAnalysis}
            disabled={isAnalyzing || goals.length === 0}
            className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs sm:text-sm flex items-center space-x-2 transition-colors disabled:opacity-50"
          >
            <Sparkles className="w-4 h-4 text-blue-600" />
            <span>{isAnalyzing ? (user.language === 'ka' ? 'AI აანალიზებს...' : 'Analyzing...') : t.askAiAboutGoals}</span>
          </button>
        </div>
      </div>

      {/* Add Goal Form (Simple and clear) */}
      {isAddingGoal && (
        <form onSubmit={handleAddGoal} className="bg-white border-2 border-blue-500 rounded-2xl p-6 shadow-md space-y-5 animate-in fade-in duration-200">
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

          {/* Quick presets */}
          <div>
            <span className="text-xs font-bold text-slate-500 block mb-2">
              {user.language === 'ka' ? 'ან აირჩიეთ მზა შაბლონი:' : 'Or pick a quick template:'}
            </span>
            <div className="flex flex-wrap gap-2">
              {presets.map((p, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleApplyPreset(p)}
                  className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-blue-50 hover:text-blue-700 text-slate-700 text-xs font-semibold border border-slate-200 transition-colors"
                >
                  + {p.title} ({curr}{p.amount.toLocaleString()})
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {t.goalNameLabel}
              </label>
              <input
                type="text"
                required
                placeholder={t.goalNamePlaceholder}
                value={newTitle}
                onChange={e => setNewTitle(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-slate-900 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                onChange={e => setNewTarget(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-slate-900 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                onChange={e => setNewCurrent(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-slate-900 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {t.targetYearsLabel}
              </label>
              <input
                type="number"
                min="1"
                max="30"
                required
                value={newYears}
                onChange={e => setNewYears(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-slate-900 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-xs"
            >
              {t.saveBtn}
            </button>
          </div>
        </form>
      )}

      {/* Goals Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {goals.map(goal => {
          const pct = Math.min(100, Math.round((goal.currentAmount / goal.targetAmount) * 100));
          const needed = Math.max(0, goal.targetAmount - goal.currentAmount);
          const monthlyNeeded = Math.ceil(needed / (goal.targetYears * 12));
          const isEasilyFunded = netSavings >= monthlyNeeded;

          return (
            <div 
              key={goal.id} 
              className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs flex flex-col justify-between hover:border-slate-300 transition-all"
            >
              <div>
                <div className="flex items-start justify-between mb-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md">
                    {goal.category}
                  </span>
                  <button
                    onClick={() => handleDeleteGoal(goal.id)}
                    className="text-slate-400 hover:text-rose-600 p-1 rounded-lg transition-colors"
                    title="Delete Goal"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <h3 className="text-lg font-black text-slate-900 mb-1">
                  {goal.title}
                </h3>
                <p className="text-xs text-slate-500 mb-4">
                  {goal.targetYears} {user.language === 'ka' ? 'წლის პერიოდი' : 'year timeline'}
                </p>

                <div className="flex justify-between items-baseline text-xs mb-1">
                  <span className="text-slate-600">{t.goalProgress}:</span>
                  <span className="font-bold text-slate-900 text-sm">
                    {curr}{goal.currentAmount.toLocaleString()} <span className="text-slate-400 font-normal">/ {curr}{goal.targetAmount.toLocaleString()}</span>
                  </span>
                </div>

                <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                  <div 
                    className="bg-blue-600 h-3 rounded-full transition-all duration-500" 
                    style={{ width: `${pct}%` }} 
                  />
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 space-y-2">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-slate-500">{t.monthlyNeededToSave}</span>
                  <span className="text-base text-slate-900">{curr}{monthlyNeeded}/mo</span>
                </div>

                <div className={`p-2.5 rounded-xl text-xs font-bold flex items-center space-x-1.5 ${
                  isEasilyFunded 
                    ? 'bg-emerald-50 text-emerald-800' 
                    : 'bg-amber-50 text-amber-800'
                }`}>
                  {isEasilyFunded ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>{t.goalStatusGood}</span>
                    </>
                  ) : (
                    <>
                      <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                      <span>{t.goalStatusTight}</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* AI Strategy Report (Clean & Calm) */}
      {analysisResult && (
        <div className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-7 shadow-xs space-y-5 animate-in fade-in duration-300">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-black text-slate-900">
                  {user.language === 'ka' ? 'AGNO AI-ს რეკომენდაციები' : 'AGNO AI Strategic Summary'}
                </h3>
                <p className="text-xs text-slate-500">
                  {user.language === 'ka' ? 'თქვენს რეალურ შემოსავალსა და მიზნებზე მორგებული' : 'Tailored to your real income and milestones'}
                </p>
              </div>
            </div>

            <button
              onClick={() => onDiscussWithAi(`Help me optimize my financial goals: ${analysisResult.summary}`)}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center space-x-1.5 self-start sm:self-auto transition-colors"
            >
              <span>{user.language === 'ka' ? 'კითხვა AI-სთან' : 'Chat with AI'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <p className="text-sm sm:text-base text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-200/60">
            {analysisResult.summary}
          </p>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
              {user.language === 'ka' ? 'რეკომენდებული მარტივი ნაბიჯები:' : 'Recommended Action Steps:'}
            </h4>
            <div className="space-y-2">
              {analysisResult.actionSteps.map((step, idx) => (
                <div key={idx} className="flex items-start space-x-3 text-xs sm:text-sm text-slate-800 bg-white p-3 rounded-xl border border-slate-200/80">
                  <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center text-xs shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <span>{step}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
