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
  HelpCircle
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
  const [tempExpenses, setTempExpenses] = useState(budget.fixedExpenses + budget.discretionaryExpenses);
  const [tempLiquid, setTempLiquid] = useState(budget.currentLiquidSavings);

  const totalExpenses = budget.fixedExpenses + budget.discretionaryExpenses;
  const netSavings = Math.max(0, budget.income - totalExpenses);
  const savingsRate = budget.income > 0 ? Math.round((netSavings / budget.income) * 100) : 0;
  const runwayMonths = totalExpenses > 0 ? (budget.currentLiquidSavings / totalExpenses).toFixed(1) : '0';

  const handleSaveBudget = () => {
    setBudget(prev => ({
      ...prev,
      income: tempIncome,
      fixedExpenses: Math.round(tempExpenses * 0.65),
      discretionaryExpenses: Math.round(tempExpenses * 0.35),
      currentLiquidSavings: tempLiquid,
      monthlySavings: Math.max(0, tempIncome - tempExpenses),
    }));
    setIsEditingBudget(false);
  };

  return (
    <div className="space-y-6">
      
      {/* Friendly Top Welcome Card */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-7 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{user.language === 'ka' ? 'მარტივი ფინანსური მართვა' : 'Effortless Money Guide'}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              {t.helloUser}, {user.name} 👋
            </h1>
            <p className="text-sm sm:text-base text-slate-600 mt-1">
              {t.quickOverviewDesc}
            </p>
          </div>

          <button
            onClick={() => setIsEditingBudget(!isEditingBudget)}
            className="self-start sm:self-auto px-4 py-2.5 rounded-xl border border-slate-200 hover:border-slate-300 bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold text-xs flex items-center space-x-2 transition-all"
          >
            <Edit3 className="w-4 h-4 text-slate-500" />
            <span>{isEditingBudget ? t.cancelBtn : (user.language === 'ka' ? 'შემოსავლის შეცვლა' : 'Edit My Numbers')}</span>
          </button>
        </div>

        {/* Inline Quick Editor if toggled */}
        {isEditingBudget && (
          <div className="mt-6 pt-6 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {t.monthlyIncomeLabel} ({curr})
              </label>
              <input
                type="number"
                min="0"
                step="100"
                value={tempIncome}
                onChange={e => setTempIncome(Number(e.target.value))}
                className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-base font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                onChange={e => setTempExpenses(Number(e.target.value))}
                className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-base font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {user.language === 'ka' ? 'ნაღდი დანაზოგი' : 'Liquid Savings'} ({curr})
              </label>
              <input
                type="number"
                min="0"
                step="100"
                value={tempLiquid}
                onChange={e => setTempLiquid(Number(e.target.value))}
                className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-base font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="sm:col-span-3 flex justify-end">
              <button
                onClick={handleSaveBudget}
                className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm flex items-center space-x-2 shadow-xs transition-colors"
              >
                <Check className="w-4 h-4" />
                <span>{t.saveBtn}</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 3 Core Big Numbers for easy readability */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Income Card */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">{t.monthlyIncomeLabel}</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <ArrowUpRight className="w-4 h-4" />
            </div>
          </div>
          <div>
            <span className="text-3xl font-black text-slate-900 tracking-tight">
              {curr}{budget.income.toLocaleString()}
            </span>
            <span className="text-xs text-slate-500 block mt-1">
              {user.language === 'ka' ? 'ხელზე ასაღები თვეში' : 'Take-home per month'}
            </span>
          </div>
        </div>

        {/* Expenses Card */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">{t.monthlyExpensesLabel}</span>
            <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
              <ArrowDownRight className="w-4 h-4" />
            </div>
          </div>
          <div>
            <span className="text-3xl font-black text-slate-900 tracking-tight">
              {curr}{totalExpenses.toLocaleString()}
            </span>
            <span className="text-xs text-slate-500 block mt-1">
              {user.language === 'ka' ? 'კომუნალურები, კვება და სხვა' : 'Bills, food & living'}
            </span>
          </div>
        </div>

        {/* Free Cash / Savings Card */}
        <div className="bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200 rounded-2xl p-6 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-emerald-700 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">{t.monthlyFreeMoney}</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <PiggyBank className="w-4 h-4" />
            </div>
          </div>
          <div>
            <span className="text-3xl font-black text-emerald-800 tracking-tight">
              +{curr}{netSavings.toLocaleString()}
            </span>
            <div className="flex items-center space-x-1.5 mt-1">
              <span className="text-xs font-bold text-emerald-700">
                {savingsRate}% {user.language === 'ka' ? 'შემოსავლიდან' : 'savings rate'}
              </span>
              <span className="text-xs text-slate-500">• {runwayMonths} {t.monthsCount} {user.language === 'ka' ? 'მარაგი' : 'runway'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Georgia 57% Cash Alert in Plain Friendly Words */}
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

      {/* Goals Preview Section */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-7 shadow-xs">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-lg font-black text-slate-900 flex items-center space-x-2">
              <Target className="w-5 h-5 text-blue-600" />
              <span>{t.goalsTitle}</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              {t.goalsSubtitle}
            </p>
          </div>

          <button
            onClick={() => onNavigate('goals')}
            className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center space-x-1.5 shadow-xs transition-colors"
          >
            <PlusCircle className="w-4 h-4" />
            <span>{user.language === 'ka' ? 'მიზნის დამატება' : 'Manage Goals'}</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {goals.map(goal => {
            const pct = Math.min(100, Math.round((goal.currentAmount / goal.targetAmount) * 100));
            const remaining = Math.max(0, goal.targetAmount - goal.currentAmount);
            const monthsLeft = netSavings > 0 ? Math.ceil(remaining / netSavings) : 99;

            return (
              <div 
                key={goal.id} 
                onClick={() => onNavigate('goals')}
                className="p-5 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 hover:border-blue-300 transition-all cursor-pointer group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
                      {goal.category}
                    </span>
                    <span className="text-xs font-bold text-slate-700">
                      {pct}%
                    </span>
                  </div>

                  <h4 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                    {goal.title}
                  </h4>

                  <div className="mt-3 flex items-baseline justify-between text-xs text-slate-600">
                    <span>{curr}{goal.currentAmount.toLocaleString()}</span>
                    <span className="font-bold text-slate-800">{curr}{goal.targetAmount.toLocaleString()}</span>
                  </div>

                  {/* Clean progress bar */}
                  <div className="w-full bg-slate-200 rounded-full h-2.5 mt-1.5 overflow-hidden">
                    <div 
                      className="bg-blue-600 h-2.5 rounded-full transition-all duration-500" 
                      style={{ width: `${pct}%` }} 
                    />
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-200/80 text-xs text-slate-500">
                  {monthsLeft < 99 ? (
                    <span className="text-emerald-700 font-semibold">
                      ✓ ~{monthsLeft} {t.monthsCount} {user.language === 'ka' ? 'მიღწევამდე' : 'until goal is reached'}
                    </span>
                  ) : (
                    <span className="text-amber-700 font-medium">
                      {user.language === 'ka' ? 'მოითხოვს დანაზოგის გაზრდას' : 'Needs higher savings'}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Friendly Bottom Banner: Ask AI without fear */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-6 sm:p-7 text-white shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-black tracking-tight">
            {user.language === 'ka' ? 'გაქვთ შეკითხვა თქვენს ფინანსებზე?' : 'Have a question about your money?'}
          </h3>
          <p className="text-xs sm:text-sm text-blue-100 mt-1 max-w-xl leading-relaxed">
            {user.language === 'ka' 
              ? 'ჩვენი AI აგიხსნით ყველაფერს ჩვეულებრივი, მარტივი ენით — საბანკო ტერმინებისა და სირთულეების გარეშე.' 
              : 'Our AI helper explains any banking topic in plain English, with zero confusing financial jargon.'}
          </p>
        </div>
        <button
          onClick={() => onNavigate('advisor')}
          className="px-5 py-3 rounded-xl bg-white text-blue-700 hover:bg-blue-50 font-black text-sm whitespace-nowrap shadow-sm transition-all"
        >
          {user.language === 'ka' ? 'შეკითხვის დასმა' : 'Ask AI Helper'}
        </button>
      </div>

    </div>
  );
};
