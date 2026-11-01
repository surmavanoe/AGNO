import React, { useState } from 'react';
import { UserProfile, FinancialGoal, BudgetData } from '../types';
import { translations, currencySymbols } from '../translations';
import {
  ArrowUpRight,
  ArrowDownRight,
  PiggyBank,
  ShieldAlert,
  Target,
  Sparkles,
  ArrowRight,
  Edit3,
  Check,
  PlusCircle,
  BookOpen,
  Info,
  Flame,
  Award,
  Activity,
  HelpCircle,
} from 'lucide-react';

interface DashboardProps {
  user: UserProfile;
  setUser: React.Dispatch<React.SetStateAction<UserProfile>>;
  budget: BudgetData;
  setBudget: React.Dispatch<React.SetStateAction<BudgetData>>;
  goals: FinancialGoal[];
  onNavigate: (tab: string, meta?: any) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  user,
  setUser,
  budget,
  setBudget,
  goals,
  onNavigate,
}) => {
  const t = translations[user.language];
  const curr = currencySymbols[user.currency] || '₾';

  const [isEditingBudget, setIsEditingBudget] = useState(false);
  const [tempIncome, setTempIncome] = useState(budget.income);
  const [tempExpenses, setTempExpenses] = useState(
    budget.fixedExpenses + budget.discretionaryExpenses
  );
  const [tempLiquid, setTempLiquid] = useState(budget.currentLiquidSavings);
  const [showWhyRecommendation, setShowWhyRecommendation] = useState(false);

  const totalExpenses = budget.fixedExpenses + budget.discretionaryExpenses;
  const netSavings = Math.max(0, budget.income - totalExpenses);
  const savingsRate =
    budget.income > 0 ? Math.round((netSavings / budget.income) * 100) : 0;
  const runwayMonths =
    totalExpenses > 0
      ? (budget.currentLiquidSavings / totalExpenses).toFixed(1)
      : '0';

  const handleSaveBudget = () => {
    const safeIncome = Math.max(0, Number(tempIncome) || 0);
    const safeExpenses = Math.max(0, Number(tempExpenses) || 0);
    const safeLiquid = Math.max(0, Number(tempLiquid) || 0);

    setBudget(prev => ({
      ...prev,
      income: safeIncome,
      fixedExpenses: Math.round(safeExpenses * 0.65),
      discretionaryExpenses: Math.round(safeExpenses * 0.35),
      currentLiquidSavings: safeLiquid,
      monthlySavings: Math.max(0, safeIncome - safeExpenses),
    }));
    setIsEditingBudget(false);
  };

  return (
    <div className="space-y-6">
      {/* NEW TOP SECTION: "დღეს AGNO გირჩევს" + 3 Small Status Cards (Section 5) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Card: დღეს AGNO გირჩევს (2 cols) */}
        <div className="lg:col-span-2 bg-gradient-to-br from-blue-50/90 via-white to-indigo-50/60 border border-blue-200 rounded-2xl p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-xl bg-[#1F64FF] text-white flex items-center justify-center">
                  <Sparkles className="w-4 h-4" />
                </div>
                <h2 className="text-lg font-black text-slate-900">
                  დღეს AGNO გირჩევს
                </h2>
              </div>

              <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-purple-50 text-purple-700 border border-purple-200">
                დემო პერსონალიზაცია
              </span>
            </div>

            <p className="text-sm sm:text-base text-slate-800 leading-relaxed font-medium">
              შენი დანაზოგის მიზნებიდან{' '}
              <strong className="text-[#1F64FF]">
                {user.learningProfile?.primaryGoal || 'საგანგებო ფონდი'}
              </strong>{' '}
              ყველაზე ახლოსაა შესრულებასთან. დღევანდელი 4-წუთიანი გაკვეთილი
              დაგეხმარება გაიგო, რამდენი თვის ხარჯი უნდა შეინახო საგანგებო
              ფონდში.
            </p>

            {/* Expandable explanation when "რატომ ეს რეკომენდაცია?" is clicked */}
            {showWhyRecommendation && (
              <div className="mt-3 p-3.5 rounded-xl bg-white border border-blue-200 text-xs sm:text-sm text-slate-700 flex items-start space-x-2">
                <Info className="w-4 h-4 text-[#1F64FF] shrink-0 mt-0.5" />
                <span>
                  რეკომენდაცია ეფუძნება შენს არჩეულ მიზნებს, სასწავლო დონესა (
                  <strong>{user.knowledgeLevel}</strong>) და დემო-პროფილში
                  ნაჩვენებ პროგრესს.
                </span>
              </div>
            )}
          </div>

          <div className="mt-5 pt-4 border-t border-blue-100/80 flex flex-wrap items-center gap-3">
            <button
              onClick={() => onNavigate('learn', { openLessonNodeId: 'm4-n3' })}
              className="px-5 py-2.5 rounded-xl bg-[#1F64FF] hover:bg-blue-700 text-white font-bold text-xs sm:text-sm flex items-center space-x-2 shadow-xs transition-colors"
            >
              <BookOpen className="w-4 h-4" />
              <span>გაკვეთილის დაწყება</span>
            </button>

            <button
              onClick={() => setShowWhyRecommendation(prev => !prev)}
              className="px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 font-bold text-xs sm:text-sm flex items-center space-x-1.5 transition-colors"
            >
              <HelpCircle className="w-4 h-4 text-[#1F64FF]" />
              <span>რატომ ეს რეკომენდაცია?</span>
            </button>
          </div>
        </div>

        {/* Three Small Status Cards (1 col stacked) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 gap-3">
          <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-xs flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-slate-500 block">
                ცოდნის დონე
              </span>
              <span className="text-base font-black text-slate-900">
                {user.knowledgeLevel}
              </span>
            </div>
            <span className="px-2.5 py-1 rounded-lg bg-blue-50 text-[#1F64FF] text-xs font-black">
              {user.xp} XP
            </span>
          </div>

          <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-xs flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-slate-500 block">
                სასწავლო Streak
              </span>
              <span className="text-base font-black text-slate-900">
                {user.streak} დღე
              </span>
            </div>
            <span className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Flame className="w-5 h-5 fill-amber-500" />
            </span>
          </div>

          <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-xs flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-slate-500 block">
                ამ კვირის პროგრესი
              </span>
              <span className="text-base font-black text-slate-900">
                {user.weeklyCompletedLessons}/{user.weeklyTargetLessons}
              </span>
            </div>
            <button
              onClick={() => onNavigate('learn')}
              className="text-xs font-bold text-[#1F64FF] hover:underline flex items-center"
            >
              <span>სწავლა</span>
              <ArrowRight className="w-3.5 h-3.5 ml-0.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Friendly Welcome & Quick Budget Edit Card */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              {t.helloUser}, {user.name}
            </h1>
            <p className="text-sm text-slate-600 mt-0.5">{t.quickOverviewDesc}</p>
          </div>

          <button
            onClick={() => setIsEditingBudget(!isEditingBudget)}
            className="self-start sm:self-auto px-4 py-2 rounded-xl border border-slate-200 hover:border-slate-300 bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold text-xs flex items-center space-x-2 transition-all"
          >
            <Edit3 className="w-4 h-4 text-slate-500" />
            <span>
              {isEditingBudget ? t.cancelBtn : 'შემოსავლისა და ხარჯის შეცვლა'}
            </span>
          </button>
        </div>

        {/* Inline Quick Editor if toggled */}
        {isEditingBudget && (
          <div className="mt-5 pt-5 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {t.monthlyIncomeLabel} ({curr})
              </label>
              <input
                type="number"
                min="0"
                step="100"
                value={tempIncome}
                onChange={e =>
                  setTempIncome(Math.max(0, Number(e.target.value) || 0))
                }
                className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-base font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#1F64FF]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {t.monthlyExpensesLabel} ({curr})
              </label>
              <input
                type="number"
                min="0"
                step="100"
                value={tempExpenses}
                onChange={e =>
                  setTempExpenses(Math.max(0, Number(e.target.value) || 0))
                }
                className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-base font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#1F64FF]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                ნაღდი დანაზოგი ({curr})
              </label>
              <input
                type="number"
                min="0"
                step="100"
                value={tempLiquid}
                onChange={e =>
                  setTempLiquid(Math.max(0, Number(e.target.value) || 0))
                }
                className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-base font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#1F64FF]"
              />
            </div>
            <div className="sm:col-span-3 flex justify-end">
              <button
                onClick={handleSaveBudget}
                className="px-6 py-2.5 rounded-xl bg-[#1F64FF] hover:bg-blue-700 text-white font-bold text-sm flex items-center space-x-2 shadow-xs transition-colors"
              >
                <Check className="w-4 h-4" />
                <span>{t.saveBtn}</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 3 Core Big Numbers (Preserved) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Income Card */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">
              {t.monthlyIncomeLabel}
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <ArrowUpRight className="w-4 h-4" />
            </div>
          </div>
          <div>
            <span className="text-3xl font-black text-slate-900 tracking-tight">
              {curr}
              {budget.income.toLocaleString()}
            </span>
            <span className="text-xs text-slate-500 block mt-1">
              ხელზე ასაღები თვიური შემოსავალი
            </span>
          </div>
        </div>

        {/* Expenses Card */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">
              {t.monthlyExpensesLabel}
            </span>
            <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
              <ArrowDownRight className="w-4 h-4" />
            </div>
          </div>
          <div>
            <span className="text-3xl font-black text-slate-900 tracking-tight">
              {curr}
              {totalExpenses.toLocaleString()}
            </span>
            <span className="text-xs text-slate-500 block mt-1">
              აუცილებელი და ცვალებადი ხარჯები
            </span>
          </div>
        </div>

        {/* Free Cash / Savings Card */}
        <div className="bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200 rounded-2xl p-6 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-emerald-700 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">
              {t.monthlyFreeMoney}
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <PiggyBank className="w-4 h-4" />
            </div>
          </div>
          <div>
            <span className="text-3xl font-black text-emerald-800 tracking-tight">
              +{curr}
              {netSavings.toLocaleString()}
            </span>
            <div className="flex items-center space-x-1.5 mt-1">
              <span className="text-xs font-bold text-emerald-700">
                {savingsRate}% შემოსავლიდან
              </span>
              <span className="text-xs text-slate-500">
                • {runwayMonths} {t.monthsCount} მარაგი
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* NEW SECTION: "ჩემი ფინანსური ჯანმრთელობა" (Section 5) */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-[#1F64FF] flex items-center justify-center">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-slate-900">
                ჩემი ფინანსური ჯანმრთელობა
              </h2>
              <p className="text-xs text-slate-500">
                დემო შეფასება — არ წარმოადგენს საკრედიტო ან საინვესტიციო შეფასებას
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3 self-start sm:self-center">
            <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
              დემო შეფასება
            </span>
            <div className="px-3.5 py-1.5 rounded-xl bg-blue-50 border border-blue-200 text-right">
              <span className="text-xl font-black text-[#1F64FF]">68/100</span>
            </div>
          </div>
        </div>

        {/* 4 Breakdown Pillars */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-200/80">
            <span className="text-xs font-bold text-slate-600 block mb-1">
              ბიუჯეტირება
            </span>
            <span className="text-base font-black text-emerald-800">კარგი</span>
            <p className="text-[11px] text-slate-600 mt-1">
              შემოსავალი სტაბილურად აჭარბებს ხარჯებს
            </p>
          </div>

          <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200/80">
            <span className="text-xs font-bold text-slate-600 block mb-1">
              საგანგებო ფონდი
            </span>
            <span className="text-base font-black text-amber-800">
              გასაუმჯობესებელი
            </span>
            <p className="text-[11px] text-slate-600 mt-1">
              მიზნამდე დარჩენილია რეზერვის შევსება
            </p>
          </div>

          <div className="p-4 rounded-xl bg-blue-50/60 border border-blue-200/80">
            <span className="text-xs font-bold text-slate-600 block mb-1">
              დანაზოგის ჩვევა
            </span>
            <span className="text-base font-black text-[#1F64FF]">საშუალო</span>
            <p className="text-[11px] text-slate-600 mt-1">
              ყოველთვიური რეგულარული გადადება
            </p>
          </div>

          <div className="p-4 rounded-xl bg-purple-50/60 border border-purple-200/80">
            <span className="text-xs font-bold text-slate-600 block mb-1">
              ფინანსური ცოდნა
            </span>
            <span className="text-base font-black text-purple-800">
              იზრდება
            </span>
            <p className="text-[11px] text-slate-600 mt-1">
              {user.xp} XP • {user.streak}-დღიანი Streak
            </p>
          </div>
        </div>
      </div>

      {/* Preserved Inflation Warning */}
      <div className="bg-amber-50/80 border border-amber-200/80 rounded-2xl p-5 sm:p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-start space-x-3.5">
          <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0 mt-0.5">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-amber-950">
              {t.cashWarningTitle}
            </h3>
            <p className="text-xs sm:text-sm text-amber-900/80 mt-1 leading-relaxed max-w-2xl">
              {t.cashWarningText}
            </p>
          </div>
        </div>
        <button
          onClick={() => onNavigate('calculator', { defaultMode: 'inflation' })}
          className="px-4 py-2.5 rounded-xl bg-amber-700 hover:bg-amber-800 text-white font-bold text-xs sm:text-sm whitespace-nowrap shadow-xs flex items-center space-x-1.5 transition-colors self-end md:self-auto"
        >
          <span>{t.seeHowToProtect}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Preserved Financial Goals Section */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-7 shadow-xs">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-lg font-black text-slate-900 flex items-center space-x-2">
              <Target className="w-5 h-5 text-[#1F64FF]" />
              <span>{t.goalsTitle}</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              {t.goalsSubtitle}
            </p>
          </div>

          <button
            onClick={() => onNavigate('goals')}
            className="px-3.5 py-2 rounded-xl bg-[#1F64FF] hover:bg-blue-700 text-white font-bold text-xs flex items-center space-x-1.5 shadow-xs transition-colors"
          >
            <PlusCircle className="w-4 h-4" />
            <span>ყველა მიზანი და სიმულაცია</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {goals.map(goal => {
            const pct = Math.min(
              100,
              Math.round((goal.currentAmount / Math.max(1, goal.targetAmount)) * 100)
            );
            const remaining = Math.max(0, goal.targetAmount - goal.currentAmount);
            const monthsLeft =
              netSavings > 0 ? Math.ceil(remaining / netSavings) : 99;

            return (
              <div
                key={goal.id}
                onClick={() => onNavigate('goals')}
                className="p-5 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 hover:border-blue-300 transition-all cursor-pointer group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-[#1F64FF] uppercase tracking-wider">
                      {goal.categoryLabelKa || goal.category}
                    </span>
                    <span className="text-xs font-bold text-slate-700">
                      {pct}%
                    </span>
                  </div>

                  <h4 className="text-base font-bold text-slate-900 group-hover:text-[#1F64FF] transition-colors">
                    {goal.title}
                  </h4>

                  <div className="mt-3 flex items-baseline justify-between text-xs text-slate-600">
                    <span>
                      {curr}
                      {goal.currentAmount.toLocaleString()}
                    </span>
                    <span className="font-bold text-slate-800">
                      {curr}
                      {goal.targetAmount.toLocaleString()}
                    </span>
                  </div>

                  <div className="w-full bg-slate-200 rounded-full h-2.5 mt-1.5 overflow-hidden">
                    <div
                      className="bg-[#1F64FF] h-2.5 rounded-full transition-all duration-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-200/80 flex items-center justify-between text-xs">
                  <span className="text-emerald-700 font-semibold">
                    {goal.statusLabelKa ||
                      (monthsLeft < 99
                        ? `~${monthsLeft} თვე მიღწევამდე`
                        : 'საჭიროებს დაგეგმვას')}
                  </span>
                  <span className="text-[#1F64FF] font-bold">გეგმის ნახვა →</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
