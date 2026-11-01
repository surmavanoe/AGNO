/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { UserProfile, BudgetData, FinancialGoal } from './types';
import { Navbar } from './components/Navbar';
import { Dashboard } from './components/Dashboard';
import { BudgetGoalTracker } from './components/BudgetGoalTracker';
import { FineduAcademy } from './components/FineduAcademy';
import { CalculatorsHub } from './components/CalculatorsHub';
import { AiAdvisor } from './components/AiAdvisor';
import { AboutModal } from './components/AboutModal';
import { translations } from './translations';
import { ShieldCheck, Heart } from 'lucide-react';

export default function App() {
  // User Profile with simple accessible defaults
  const [user, setUser] = useState<UserProfile>({
    name: 'დავითი',
    age: 45,
    knowledgeLevel: 'Intermediate',
    riskTolerance: 'Moderate',
    language: 'ka', // defaults to Georgian matching the uploaded documents
    currency: 'GEL', // Georgian Lari default for familiar local numbers
    xp: 250,
    level: 2,
    streak: 6,
    completedLessons: ['lesson-inflation'],
    unlockedBadges: ['first-step'],
    isPro: false,
    onboardingCompleted: true,
  });

  // Budget Data
  const [budget, setBudget] = useState<BudgetData>({
    income: 3200,
    fixedExpenses: 1350,
    discretionaryExpenses: 700,
    debtPayments: 0,
    monthlySavings: 1150,
    currentLiquidSavings: 8500,
    currentInvestments: 12000,
  });

  // Goals Data
  const [goals, setGoals] = useState<FinancialGoal[]>([
    {
      id: 'g-1',
      title: 'საგანგებო ფონდი და რემონტი',
      category: 'emergency',
      targetAmount: 15000,
      currentAmount: 8500,
      targetYears: 2,
      priority: 'high',
    },
    {
      id: 'g-2',
      title: 'საპენსიო კაპიტალი (Pillar II)',
      category: 'retirement',
      targetAmount: 60000,
      currentAmount: 12000,
      targetYears: 15,
      priority: 'high',
    },
    {
      id: 'g-3',
      title: 'შვილის განათლების ფონდი',
      category: 'education',
      targetAmount: 25000,
      currentAmount: 3200,
      targetYears: 6,
      priority: 'medium',
    },
  ]);

  // Tab & Modal State
  const [currentTab, setCurrentTab] = useState<string>('overview');
  const [selectedCalc, setSelectedCalc] = useState<string>('compound');
  const [advisorInitialPrompt, setAdvisorInitialPrompt] = useState<string>('');
  const [isAboutOpen, setIsAboutOpen] = useState(false);

  const t = translations[user.language];

  const handleNavigate = (tab: string, meta?: any) => {
    setCurrentTab(tab);
    if (meta?.defaultMode) {
      setSelectedCalc(meta.defaultMode);
    }
  };

  const handleOpenCalculator = (calcId: string) => {
    setSelectedCalc(calcId);
    setCurrentTab('calculator');
  };

  const handleDiscussWithAi = (prompt: string) => {
    setAdvisorInitialPrompt(prompt);
    setCurrentTab('advisor');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-blue-600 selection:text-white antialiased">
      {/* Top Header */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        user={user}
        setUser={setUser}
        onOpenAbout={() => setIsAboutOpen(true)}
      />

      {/* Main Content */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {currentTab === 'overview' && (
          <Dashboard
            user={user}
            setUser={setUser}
            budget={budget}
            setBudget={setBudget}
            goals={goals}
            onNavigate={handleNavigate}
          />
        )}

        {currentTab === 'goals' && (
          <BudgetGoalTracker
            user={user}
            budget={budget}
            setBudget={setBudget}
            goals={goals}
            setGoals={setGoals}
            onDiscussWithAi={handleDiscussWithAi}
          />
        )}

        {currentTab === 'calculator' && (
          <CalculatorsHub
            user={user}
            initialCalc={selectedCalc}
            onNavigateToAcademy={() => setCurrentTab('learn')}
            onAskAiWithContext={handleDiscussWithAi}
          />
        )}

        {currentTab === 'learn' && (
          <FineduAcademy
            user={user}
            setUser={setUser}
            onOpenCalculator={handleOpenCalculator}
          />
        )}

        {currentTab === 'advisor' && (
          <AiAdvisor
            user={user}
            budget={budget}
            goals={goals}
            initialPrompt={advisorInitialPrompt}
            onClearInitialPrompt={() => setAdvisorInitialPrompt('')}
          />
        )}
      </main>

      {/* Clean Trustworthy Footer */}
      <footer className="border-t border-slate-200 bg-white py-8 px-4 text-xs text-slate-500">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 rounded-md bg-blue-600 text-white flex items-center justify-center font-bold text-xs">
              A
            </div>
            <span className="font-extrabold text-slate-900 tracking-tight text-sm">AGNO FINEDU</span>
            <span className="text-slate-300">•</span>
            <span className="text-slate-600">{user.language === 'ka' ? 'სწავლა + მოქმედება' : 'Learn + Act FinTech'}</span>
          </div>

          <p className="max-w-md text-[11px] text-slate-500">
            {user.language === 'ka'
              ? 'საგანმანათლებლო და ანალიტიკური პლატფორმა. ეხმარება მომხმარებელს ინფორმირებული ფინანსური გადაწყვეტილებების მიღებაში.'
              : 'Educational & analytics platform designed to make personal finance intuitive and accessible for all.'}
          </p>

          <div className="flex items-center space-x-3 text-slate-600 font-semibold">
            <button onClick={() => setIsAboutOpen(true)} className="hover:text-blue-600 transition-colors">
              {t.navAbout}
            </button>
          </div>
        </div>
      </footer>

      {/* About Modal */}
      <AboutModal
        user={user}
        isOpen={isAboutOpen}
        onClose={() => setIsAboutOpen(false)}
      />
    </div>
  );
}
