export type KnowledgeLevel = 'Beginner' | 'Intermediate' | 'Advanced';
export type RiskTolerance = 'Conservative' | 'Moderate' | 'Growth' | 'Aggressive';
export type Language = 'en' | 'ka';
export type Currency = 'USD' | 'GEL' | 'EUR';

export interface FinancialGoal {
  id: string;
  title: string;
  category: 'retirement' | 'real_estate' | 'emergency' | 'education' | 'business' | 'other';
  targetAmount: number;
  currentAmount: number;
  targetYears: number;
  priority: 'high' | 'medium' | 'low';
}

export interface BudgetData {
  income: number;
  fixedExpenses: number;
  discretionaryExpenses: number;
  debtPayments: number;
  monthlySavings: number;
  currentLiquidSavings: number;
  currentInvestments: number;
}

export interface UserProfile {
  name: string;
  age: number;
  knowledgeLevel: KnowledgeLevel;
  riskTolerance: RiskTolerance;
  language: Language;
  currency: Currency;
  xp: number;
  level: number;
  streak: number;
  completedLessons: string[];
  unlockedBadges: string[];
  isPro: boolean;
  onboardingCompleted: boolean;
}

export interface Lesson {
  id: string;
  level: KnowledgeLevel;
  titleKa: string;
  titleEn: string;
  summaryKa: string;
  summaryEn: string;
  readTimeMinutes: number;
  xpReward: number;
  contentKa: string;
  contentEn: string;
  recommendedCalculator?: 'compound' | 'inflation' | 'deposit' | 'pension' | 'scenario';
  quiz: {
    questionKa: string;
    questionEn: string;
    optionsKa: string[];
    optionsEn: string[];
    correctIndex: number;
    explanationKa: string;
    explanationEn: string;
  };
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'model';
  text: string;
  timestamp: string;
}

export interface GoalAnalysisResult {
  summary: string;
  healthScore: number;
  riskAlignment: string;
  actionSteps: string[];
  goalFeasibility: Array<{
    id: string;
    title: string;
    targetAmount: number;
    estimatedMonths: number;
    onTrack: boolean;
    status: string;
  }>;
}
