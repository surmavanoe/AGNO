export type KnowledgeLevel = 'Beginner' | 'Intermediate' | 'Advanced';
export type RiskTolerance = 'Conservative' | 'Moderate' | 'Growth' | 'Aggressive';
export type Language = 'en' | 'ka';
export type Currency = 'USD' | 'GEL' | 'EUR';
export type ExplanationMode = 'მარტივად' | 'დეტალურად' | 'მაგალითით';

export interface FinancialGoal {
  id: string;
  title: string;
  category: 'retirement' | 'real_estate' | 'emergency' | 'education' | 'business' | 'other';
  categoryLabelKa?: string;
  targetAmount: number;
  currentAmount: number;
  targetYears: number;
  targetDateKa?: string;
  monthlyContribution?: number;
  statusLabelKa?: 'გეგმის მიხედვით' | 'მცირე ჩამორჩენა' | 'მიზანზე წინ';
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

export interface LearningProfileSettings {
  knowledgeLevel: KnowledgeLevel;
  interests: string[];
  primaryGoal: string;
  preferredExplanation: string;
  dailyGoalLessons: number;
  weeklyFrequencyDays: number;
  notificationFrequency: string;
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
  levelTitle: string;
  nextLevelTitle: string;
  nextLevelXp: number;
  streak: number;
  dailyCompletedActivities: number;
  dailyTargetActivities: number;
  weeklyCompletedLessons: number;
  weeklyTargetLessons: number;
  usedCalculatorThisWeek: boolean;
  completedLessons: string[];
  unlockedBadges: string[];
  isPro: boolean;
  onboardingCompleted: boolean;
  isDemoMode: boolean;
  learningProfile: LearningProfileSettings;
}

export type PathNodeType = 'lesson' | 'quiz' | 'practice';
export type PathNodeStatus = 'completed' | 'current' | 'available' | 'locked';

export interface PathLessonNode {
  id: string;
  moduleId: string;
  titleKa: string;
  titleEn: string;
  summaryKa: string;
  summaryEn: string;
  level: KnowledgeLevel;
  topic: 'ბიუჯეტირება' | 'დანაზოგი' | 'ინფლაცია' | 'ინვესტირება' | 'დაგეგმვა';
  nodeType: PathNodeType;
  defaultStatus: PathNodeStatus;
  readTimeMinutes: number;
  xpReward: number;
  recommendedCalculator?: string;
  // 5-stage complete lesson experience
  stages: {
    explanationKa: string;
    explanationEn: string;
    exampleKa: string;
    exampleEn: string;
    question: {
      questionKa: string;
      questionEn: string;
      optionsKa: string[];
      optionsEn: string[];
      correctIndex: number;
      feedbackKa: string;
      feedbackEn: string;
    };
    practiceExercise: {
      promptKa: string;
      promptEn: string;
      scenarioLabelKa: string;
      defaultAmount: number;
      defaultRate: number;
      defaultInflation: number;
      defaultYears: number;
      takeawayKa: string;
    };
    achievementProgressTitleKa: string;
  };
}

export interface LearningModule {
  id: string;
  number: number;
  titleKa: string;
  titleEn: string;
  descriptionKa: string;
  nodes: PathLessonNode[];
}

export interface AchievementItem {
  id: string;
  titleKa: string;
  titleEn: string;
  descriptionKa: string;
  descriptionEn: string;
  requirementKa: string;
  xpBonus: number;
  iconName: string;
  progressCurrent: number;
  progressTarget: number;
}

export interface Lesson {
  id: string;
  level: KnowledgeLevel;
  topic?: string;
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
  meta?: {
    level: KnowledgeLevel;
    mode: ExplanationMode;
    goal: string;
    source: string;
  };
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
