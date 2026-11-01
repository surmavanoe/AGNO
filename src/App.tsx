/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { UserProfile, BudgetData, FinancialGoal } from './types';
import {
  PRESENTATION_DEMO_USER,
  PRESENTATION_DEMO_BUDGET,
  PRESENTATION_DEMO_GOALS,
} from './data/demoData';
import { Navbar } from './components/Navbar';
import { Dashboard } from './components/Dashboard';
import { BudgetGoalTracker } from './components/BudgetGoalTracker';
import { FineduAcademy } from './components/FineduAcademy';
import { CalculatorsHub } from './components/CalculatorsHub';
import { AiAdvisor } from './components/AiAdvisor';
import { AboutModal } from './components/AboutModal';
import { LearningProfileModal } from './components/LearningProfileModal';
import { translations } from './translations';

const STORAGE_KEYS = {
  USER: 'agno_finedu_user_v2',
  BUDGET: 'agno_finedu_budget_v2',
  GOALS: 'agno_finedu_goals_v2',
};

export default function App() {
  // Load or initialize UserProfile with localStorage persistence
  const [user, setUser] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.USER);
      if (saved) {
        const parsed = JSON.parse(saved);
        return { ...PRESENTATION_DEMO_USER, ...parsed };
      }
    } catch {
      // ignore storage errors
    }
    return PRESENTATION_DEMO_USER;
  });

  // Load or initialize BudgetData
  const [budget, setBudget] = useState<BudgetData>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.BUDGET);
      if (saved) {
        return { ...PRESENTATION_DEMO_BUDGET, ...JSON.parse(saved) };
      }
    } catch {
      // ignore
    }
    return PRESENTATION_DEMO_BUDGET;
  });

  // Load or initialize Financial Goals
  const [goals, setGoals] = useState<FinancialGoal[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.GOALS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // ignore
    }
    return PRESENTATION_DEMO_GOALS;
  });

  // Persist to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
    } catch {
      // ignore
    }
  }, [user]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.BUDGET, JSON.stringify(budget));
    } catch {
      // ignore
    }
  }, [budget]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.GOALS, JSON.stringify(goals));
    } catch {
      // ignore
    }
  }, [goals]);

  // Tab & Modal State
  const [currentTab, setCurrentTab] = useState<string>('overview');
  const [selectedCalc, setSelectedCalc] = useState<string>('compound');
  const [advisorInitialPrompt, setAdvisorInitialPrompt] = useState<string>('');
  const [initialLessonNodeId, setInitialLessonNodeId] = useState<string | null>(
    null
  );
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [isLearningProfileOpen, setIsLearningProfileOpen] = useState(false);

  const t = translations[user.language];

  // Activate Presentation Demo Mode (Section 10)
  const handleActivatePresentationDemo = () => {
    setUser(PRESENTATION_DEMO_USER);
    setBudget(PRESENTATION_DEMO_BUDGET);
    setGoals(PRESENTATION_DEMO_GOALS);
  };

  // Reset Demo Mode ("დემოს განულება")
  const handleResetDemo = () => {
    const freshUser: UserProfile = {
      ...PRESENTATION_DEMO_USER,
      xp: 0,
      level: 1,
      levelTitle: 'Beginner I',
      nextLevelTitle: 'Beginner II',
      nextLevelXp: 200,
      streak: 0,
      dailyCompletedActivities: 0,
      weeklyCompletedLessons: 0,
      usedCalculatorThisWeek: false,
      completedLessons: [],
      unlockedBadges: [],
      isDemoMode: false,
    };
    setUser(freshUser);
    setBudget(PRESENTATION_DEMO_BUDGET);
    setGoals(PRESENTATION_DEMO_GOALS);
  };

  const handleNavigate = (tab: string, meta?: any) => {
    setCurrentTab(tab);
    if (meta?.defaultMode) {
      setSelectedCalc(meta.defaultMode);
    }
    if (meta?.openLessonNodeId) {
      setInitialLessonNodeId(meta.openLessonNodeId);
    }
  };

  const handleOpenCalculator = (calcId: string) => {
    setSelectedCalc(calcId);
    setCurrentTab('calculator');
  };

  const handleStartRecommendedLesson = (lessonNodeId?: string) => {
    if (lessonNodeId) {
      setInitialLessonNodeId(lessonNodeId);
    }
    setCurrentTab('learn');
  };

  const handleDiscussWithAi = (prompt: string) => {
    setAdvisorInitialPrompt(prompt);
    setCurrentTab('advisor');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-[#1F64FF] selection:text-white antialiased">
      {/* Top Header */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        user={user}
        setUser={setUser}
        onOpenAbout={() => setIsAboutOpen(true)}
        onOpenLearningProfile={() => setIsLearningProfileOpen(true)}
        onActivateDemo={handleActivatePresentationDemo}
        onResetDemo={handleResetDemo}
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
            onStartRecommendedLesson={handleStartRecommendedLesson}
          />
        )}

        {currentTab === 'calculator' && (
          <CalculatorsHub
            user={user}
            setUser={setUser}
            initialCalc={selectedCalc}
            onNavigateToAcademy={handleStartRecommendedLesson}
            onAskAiWithContext={handleDiscussWithAi}
          />
        )}

        {currentTab === 'learn' && (
          <FineduAcademy
            user={user}
            setUser={setUser}
            onOpenCalculator={handleOpenCalculator}
            initialLessonNodeId={initialLessonNodeId}
            onClearInitialLessonNode={() => setInitialLessonNodeId(null)}
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
            <div className="w-6 h-6 rounded-md bg-[#1F64FF] text-white flex items-center justify-center font-bold text-xs">
              A
            </div>
            <span className="font-extrabold text-slate-900 tracking-tight text-sm">
              AGNO FINEDU
            </span>
            <span className="text-slate-300">•</span>
            <span className="text-slate-600">
              {user.language === 'ka' ? 'სწავლა + მოქმედება' : 'Learn + Act FinTech'}
            </span>
            {user.isDemoMode && (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900">
                პროტოტიპი / დემო
              </span>
            )}
          </div>

          <p className="max-w-md text-[11px] text-slate-500">
            {user.language === 'ka'
              ? 'საგანმანათლებლო და ანალიტიკური პროტოტიპი. არ წარმოადგენს ლიცენზირებულ ფინანსურ ან საინვესტიციო კონსულტაციას.'
              : 'Educational & analytics prototype designed to make personal finance intuitive and accessible.'}
          </p>

          <div className="flex items-center space-x-3 text-slate-600 font-semibold">
            <button
              onClick={() => setIsLearningProfileOpen(true)}
              className="hover:text-[#1F64FF] transition-colors"
            >
              სასწავლო პროფილი
            </button>
            <span>•</span>
            <button
              onClick={() => setIsAboutOpen(true)}
              className="hover:text-[#1F64FF] transition-colors"
            >
              {t.navAbout}
            </button>
          </div>
        </div>
      </footer>

      {/* Learning Profile & Presentation Demo Modal */}
      <LearningProfileModal
        user={user}
        setUser={setUser}
        isOpen={isLearningProfileOpen}
        onClose={() => setIsLearningProfileOpen(false)}
        onActivateDemo={handleActivatePresentationDemo}
        onResetDemo={handleResetDemo}
      />

      {/* About Modal */}
      <AboutModal
        user={user}
        isOpen={isAboutOpen}
        onClose={() => setIsAboutOpen(false)}
      />
    </div>
  );
}
