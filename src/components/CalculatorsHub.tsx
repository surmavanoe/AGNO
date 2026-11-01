import React, { useState, useMemo, useEffect } from 'react';
import { UserProfile } from '../types';
import {
  calculateCompoundProjection,
  calculateInflationImpact,
  calculateGoalMonthlyRequirement,
  sanitizeMoney,
  sanitizeRatePercent,
  sanitizeYears,
} from '../utils/financialCalculations';
import { translations, currencySymbols } from '../translations';
import {
  Calculator,
  TrendingUp,
  Flame,
  Percent,
  Coins,
  Target,
  PiggyBank,
  Sparkles,
  Clock,
  Info,
  HelpCircle,
  BookOpen,
} from 'lucide-react';

interface CalculatorsHubProps {
  user: UserProfile;
  setUser?: React.Dispatch<React.SetStateAction<UserProfile>>;
  initialCalc?: string;
  onNavigateToAcademy?: (lessonNodeId?: string) => void;
  onAskAiWithContext?: (prompt: string) => void;
}

interface CalcCardMeta {
  id: string;
  titleKa: string;
  descriptionKa: string;
  requiredInputsKa: string;
  estimatedTimeKa: string;
  howItWorksKa: string;
  isDemoBadge?: boolean;
  icon: any;
  relatedLessonId: string;
}

const CALCULATOR_CARDS: CalcCardMeta[] = [
  {
    id: 'savings',
    titleKa: '1. დანაზოგის კალკულატორი',
    descriptionKa: 'ითვლის, რა თანხას დააგროვებთ ყოველთვიური რეგულარული შენატანებით.',
    requiredInputsKa: 'საწყისი თანხა, თვიური შენატანი, წლიური სარგებელი, ვადა',
    estimatedTimeKa: '1 წუთი',
    howItWorksKa:
      'კალკულატორი აჯამებს თქვენს საწყის დანაზოგს და ყოველთვიურ შენატანებს, რომლებსაც ყოველთვიურად ერიცხება საპროცენტო სარგებელი.',
    icon: PiggyBank,
    relatedLessonId: 'm1-n1',
  },
  {
    id: 'compound',
    titleKa: '2. რთული პროცენტის კალკულატორი',
    descriptionKa: 'აჩვენებს, როგორ იზრდება კაპიტალი, როცა დარიცხული პროცენტი თავადაც გამოიმუშავებს სარგებელს.',
    requiredInputsKa: 'საწყისი კაპიტალი, თვიური დამატება, წლიური %, ინფლაცია, წლები',
    estimatedTimeKa: '1 წუთი',
    howItWorksKa:
      'გამოიყენება ფორმულა FV = P(1 + r/n)^(nt) და ანუიტეტის მომავალი ღირებულება. პარალელურად ითვლება ინფლაციით კორექტირებული რეალური ღირებულება.',
    icon: TrendingUp,
    relatedLessonId: 'm2-n2',
  },
  {
    id: 'inflation',
    titleKa: '3. ინფლაციის გავლენის კალკულატორი',
    descriptionKa: 'ითვლის, რამდენად მცირდება უმოქმედოდ შენახული ფულის რეალური მსყიდველობითი ძალა.',
    requiredInputsKa: 'მიმდინარე თანხა, წლიური ინფლაციის %, წლების რაოდენობა',
    estimatedTimeKa: '45 წამი',
    howItWorksKa:
      'თანხის რეალური ღირებულება იყოფა (1 + ინფლაცია)^წლები კოეფიციენტზე, რაც აჩვენებს დღევანდელ ფასებში მის მსყიდველობით უნარს.',
    icon: Flame,
    relatedLessonId: 'm2-n1',
  },
  {
    id: 'deposit',
    titleKa: '4. დეპოზიტის შემოსავლიანობა',
    descriptionKa: 'ადარებს ვადიანი და შეგროვებადი დეპოზიტის ნომინალურ და რეალურ სარგებელს.',
    requiredInputsKa: 'დეპოზიტის თანხა, თვიური შევსება, წლიური სარგებელი %, ინფლაცია %',
    estimatedTimeKa: '1 წუთი',
    howItWorksKa:
      'ითვლის დეპოზიტზე დარიცხულ სარგებელს და აკორექტირებს ინფლაციის მაჩვენებლით: რეალური სარგებელი = ((1 + ნომინალური) / (1 + ინფლაცია)) - 1.',
    icon: Percent,
    relatedLessonId: 'm2-n3',
  },
  {
    id: 'goal',
    titleKa: '5. ფინანსური მიზნის კალკულატორი',
    descriptionKa: 'ადგენს, რამდენი უნდა გადადოთ ყოველთვიურად სასურველი სამიზნე თანხის მისაღწევად.',
    requiredInputsKa: 'სამიზნე თანხა, უკვე დაგროვილი თანხა, სასურველი ვადა, სარგებელი %',
    estimatedTimeKa: '1 წუთი',
    howItWorksKa:
      'სამიზნე თანხას აკლდება უკვე არსებული დანაზოგის მომავალი ღირებულება და იყოფა დარჩენილ თვეებზე საპროცენტო სარგებლის გათვალისწინებით.',
    icon: Target,
    relatedLessonId: 'm4-n1',
  },
  {
    id: 'pension',
    titleKa: '6. საპენსიო დანაზოგის სიმულატორი',
    descriptionKa: 'აჩვენებს დაგროვებითი პენსიის (2% + 2% + 2%) გრძელვადიან საილუსტრაციო ზრდას.',
    requiredInputsKa: 'თვიური ხელფასი, დაგროვების წლები, საილუსტრაციო წლიური სარგებელი',
    estimatedTimeKa: '1 წუთი',
    howItWorksKa:
      'ითვალისწინებს დასაქმებულის 2%-იან შენატანს, დამსაქმებლის 2%-სა და სახელმწიფოს თანამონაწილეობას რთული პროცენტის ეფექტით.',
    isDemoBadge: true,
    icon: Coins,
    relatedLessonId: 'm4-n2',
  },
];

export const CalculatorsHub: React.FC<CalculatorsHubProps> = ({
  user,
  setUser,
  initialCalc = 'compound',
  onNavigateToAcademy,
  onAskAiWithContext,
}) => {
  const t = translations[user.language];
  const curr = currencySymbols[user.currency] || '₾';

  const [activeCalcId, setActiveCalcId] = useState<string>(initialCalc || 'compound');
  const [howItWorksOpenId, setHowItWorksOpenId] = useState<string | null>(null);

  useEffect(() => {
    if (initialCalc && CALCULATOR_CARDS.some(c => c.id === initialCalc)) {
      setActiveCalcId(initialCalc);
    }
  }, [initialCalc]);

  // Shared validated inputs for calculators
  const [initialAmount, setInitialAmount] = useState<number>(2000);
  const [monthlyAddition, setMonthlyAddition] = useState<number>(300);
  const [annualRate, setAnnualRate] = useState<number>(9.5);
  const [inflationRate, setInflationRate] = useState<number>(4.5);
  const [yearsHorizon, setYearsHorizon] = useState<number>(5);

  // Specific inputs for Goal Calculator
  const [goalTarget, setGoalTarget] = useState<number>(15000);
  const [goalCurrent, setGoalCurrent] = useState<number>(3000);

  // Specific inputs for Pension Simulator
  const [pensionSalary, setPensionSalary] = useState<number>(2500);
  const [pensionYears, setPensionYears] = useState<number>(20);

  // Mark weekly calculator usage when user interacts
  const markCalculatorUsed = () => {
    if (setUser && !user.usedCalculatorThisWeek) {
      setUser(prev => ({ ...prev, usedCalculatorThisWeek: true }));
    }
  };

  // Deterministic Calculation Results
  const compoundOrSavingsResult = useMemo(() => {
    return calculateCompoundProjection({
      initialPrincipal: sanitizeMoney(initialAmount, 0),
      monthlyContribution: sanitizeMoney(monthlyAddition, 0),
      annualRatePercent: sanitizeRatePercent(annualRate, 0),
      annualInflationPercent: sanitizeRatePercent(inflationRate, 0),
      years: sanitizeYears(yearsHorizon, 1),
    });
  }, [initialAmount, monthlyAddition, annualRate, inflationRate, yearsHorizon]);

  const inflationResult = useMemo(() => {
    return calculateInflationImpact({
      amount: sanitizeMoney(initialAmount, 1000),
      annualInflationPercent: sanitizeRatePercent(inflationRate, 5),
      years: sanitizeYears(yearsHorizon, 5),
    });
  }, [initialAmount, inflationRate, yearsHorizon]);

  const goalCalcResult = useMemo(() => {
    const months = Math.max(1, Math.round(sanitizeYears(yearsHorizon, 2) * 12));
    const req = calculateGoalMonthlyRequirement({
      targetAmount: sanitizeMoney(goalTarget, 5000),
      currentAmount: sanitizeMoney(goalCurrent, 0),
      months,
      annualReturnPercent: sanitizeRatePercent(annualRate, 0),
    });
    const proj = calculateCompoundProjection({
      initialPrincipal: sanitizeMoney(goalCurrent, 0),
      monthlyContribution: req.requiredMonthly,
      annualRatePercent: sanitizeRatePercent(annualRate, 0),
      annualInflationPercent: sanitizeRatePercent(inflationRate, 0),
      years: sanitizeYears(yearsHorizon, 2),
    });
    return { ...req, proj };
  }, [goalTarget, goalCurrent, yearsHorizon, annualRate, inflationRate]);

  const pensionResult = useMemo(() => {
    const validSalary = sanitizeMoney(pensionSalary, 1500);
    const validYears = sanitizeYears(pensionYears, 15);
    const myMonthly = Math.round(validSalary * 0.02);
    const matchedMonthly = Math.round(validSalary * 0.04); // 2% employer + 2% state
    const totalMonthly = myMonthly + matchedMonthly;

    const proj = calculateCompoundProjection({
      initialPrincipal: 0,
      monthlyContribution: totalMonthly,
      annualRatePercent: sanitizeRatePercent(annualRate, 7.5),
      annualInflationPercent: sanitizeRatePercent(inflationRate, 4),
      years: validYears,
    });

    const myPersonalContrib = myMonthly * Math.round(validYears * 12);
    const coFundingTotal = matchedMonthly * Math.round(validYears * 12);

    return {
      myMonthly,
      matchedMonthly,
      myPersonalContrib,
      coFundingTotal,
      proj,
    };
  }, [pensionSalary, pensionYears, annualRate, inflationRate]);

  const activeCardMeta =
    CALCULATOR_CARDS.find(c => c.id === activeCalcId) || CALCULATOR_CARDS[1];

  // Build pre-calculated summary text to send to Gemini (Section 7: Gemini only explains numbers calculated by frontend)
  const handleExplainWithAi = () => {
    markCalculatorUsed();
    let summaryPrompt = '';

    if (activeCalcId === 'inflation') {
      summaryPrompt = `გთხოვ მარტივად ამიხსნა ინფლაციის კალკულატორის ეს უკვე გამოთვლილი შედეგი: საწყისი თანხა ${curr}${inflationResult.nominalAmount.toLocaleString()}, წლიური ინფლაცია ${sanitizeRatePercent(inflationRate)}%, პერიოდი ${sanitizeYears(yearsHorizon)} წელი. რეალური მსყიდველობითი ძალა მცირდება ${curr}${inflationResult.realPurchasingPower.toLocaleString()}-მდე (დანაკარგი -${inflationResult.lossPercentage}%).`;
    } else if (activeCalcId === 'goal') {
      summaryPrompt = `გთხოვ მარტივად ამიხსნა ფინანსური მიზნის კალკულატორის ეს უკვე გამოთვლილი შედეგი: სამიზნე თანხა ${curr}${sanitizeMoney(goalTarget).toLocaleString()}, უკვე დაგროვილი ${curr}${sanitizeMoney(goalCurrent).toLocaleString()}, ვადა ${sanitizeYears(yearsHorizon)} წელი, წლიური სარგებელი ${sanitizeRatePercent(annualRate)}%. მიზნის მისაღწევად საჭირო ყოველთვიური შენატანია ${curr}${goalCalcResult.requiredMonthly.toLocaleString()}.`;
    } else if (activeCalcId === 'pension') {
      summaryPrompt = `გთხოვ მარტივად ამიხსნა საპენსიო სიმულატორის (დემო) ეს უკვე გამოთვლილი შედეგი: ხელფასი ${curr}${sanitizeMoney(pensionSalary).toLocaleString()}, დასაქმებულის პირადი შენატანი (2%) სულ ${curr}${pensionResult.myPersonalContrib.toLocaleString()}, დამსაქმებლისა და სახელმწიფოს თანამონაწილეობა ${curr}${pensionResult.coFundingTotal.toLocaleString()}, საბოლოო პროგნოზირებული თანხა ${sanitizeYears(pensionYears)} წელში ${curr}${pensionResult.proj.finalNominalValue.toLocaleString()} (ინფლაციით კორექტირებული რეალური ღირებულება ${curr}${pensionResult.proj.finalRealValue.toLocaleString()}).`;
    } else {
      summaryPrompt = `გთხოვ მარტივად ამიხსნა კალკულატორის („${activeCardMeta.titleKa}“) ეს უკვე გამოთვლილი შედეგი: საწყისი თანხა ${curr}${sanitizeMoney(initialAmount).toLocaleString()}, ყოველთვიური შენატანი ${curr}${sanitizeMoney(monthlyAddition).toLocaleString()}, წლიური სარგებელი ${sanitizeRatePercent(annualRate)}%, ინფლაცია ${sanitizeRatePercent(inflationRate)}%, პერიოდი ${sanitizeYears(yearsHorizon)} წელი. ჯამური პირადი შენატანია ${curr}${compoundOrSavingsResult.totalPrincipal.toLocaleString()}, დარიცხული ზრდა +${curr}${compoundOrSavingsResult.totalInterestEarned.toLocaleString()}, საბოლოო ნომინალური თანხა ${curr}${compoundOrSavingsResult.finalNominalValue.toLocaleString()}, ხოლო ინფლაციით კორექტირებული რეალური ღირებულება ${curr}${compoundOrSavingsResult.finalRealValue.toLocaleString()}.`;
    }

    if (onAskAiWithContext) {
      onAskAiWithContext(summaryPrompt);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center space-x-3">
          <Calculator className="w-8 h-8 text-[#1F64FF]" />
          <span>{t.calcHeaderTitle}</span>
        </h1>
        <p className="text-sm sm:text-base text-slate-600 mt-1">
          აირჩიეთ სასურველი კალკულატორი, შეცვალეთ მონაცემები და ნახეთ ზუსტი გათვლა.
        </p>
      </div>

      {/* 6 Calculator Cards Grid (Section 7) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {CALCULATOR_CARDS.map(card => {
          const Icon = card.icon;
          const isSelected = activeCalcId === card.id;
          const isHowOpen = howItWorksOpenId === card.id;

          return (
            <div
              key={card.id}
              className={`rounded-2xl p-5 border transition-all flex flex-col justify-between ${
                isSelected
                  ? 'bg-blue-50/70 border-2 border-[#1F64FF] shadow-sm'
                  : 'bg-white border-slate-200/90 hover:border-slate-300 shadow-xs'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                      isSelected
                        ? 'bg-[#1F64FF] text-white'
                        : 'bg-blue-50 text-[#1F64FF]'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>

                  <div className="flex items-center space-x-1.5">
                    {card.isDemoBadge && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
                        დემო
                      </span>
                    )}
                    <span className="text-[11px] font-semibold text-slate-500 flex items-center bg-slate-100 px-2 py-0.5 rounded-full">
                      <Clock className="w-3 h-3 mr-1" />
                      {card.estimatedTimeKa}
                    </span>
                  </div>
                </div>

                <h3 className="text-base font-black text-slate-900 mb-1">
                  {card.titleKa}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed mb-3">
                  {card.descriptionKa}
                </p>

                <div className="text-[11px] text-slate-500 bg-slate-50 p-2.5 rounded-xl border border-slate-200/70 mb-3">
                  <strong className="text-slate-700">საჭირო მონაცემები:</strong>{' '}
                  {card.requiredInputsKa}
                </div>

                {isHowOpen && (
                  <div className="p-3 rounded-xl bg-white border border-blue-200 text-xs text-slate-700 leading-relaxed mb-3">
                    <strong className="text-[#1F64FF] block mb-0.5">
                      როგორ მუშაობს:
                    </strong>
                    {card.howItWorksKa}
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-slate-200/70 flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() =>
                    setHowItWorksOpenId(prev => (prev === card.id ? null : card.id))
                  }
                  className="text-xs font-bold text-slate-600 hover:text-[#1F64FF] underline"
                >
                  გაიგე როგორ მუშაობს
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setActiveCalcId(card.id);
                    markCalculatorUsed();
                  }}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
                    isSelected
                      ? 'bg-[#1F64FF] text-white'
                      : 'bg-slate-900 hover:bg-[#1F64FF] text-white'
                  }`}
                >
                  გამოთვლა
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* ACTIVE CALCULATOR WORKSPACE & DETERMINISTIC RESULTS (Section 7) */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-xl font-black text-slate-900">
                {activeCardMeta.titleKa}
              </h2>
              {activeCardMeta.isDemoBadge && (
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
                  დემო სიმულატორი
                </span>
              )}
            </div>
            <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
              {activeCardMeta.descriptionKa}
            </p>
          </div>

          {onNavigateToAcademy && (
            <button
              type="button"
              onClick={() => onNavigateToAcademy(activeCardMeta.relatedLessonId)}
              className="px-3.5 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-[#1F64FF] text-xs font-bold flex items-center space-x-1.5 self-start sm:self-auto"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>დაკავშირებული გაკვეთილი</span>
            </button>
          )}
        </div>

        {/* Dynamic Inputs Based on Selected Calculator */}
        {activeCalcId === 'inflation' ? (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
              <label className="block text-xs font-bold text-slate-700 mb-1">
                მიმდინარე თანხა ({curr})
              </label>
              <input
                type="number"
                min="0"
                max="10000000"
                step="500"
                value={initialAmount}
                onChange={e =>
                  setInitialAmount(sanitizeMoney(Number(e.target.value), 0))
                }
                className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-base font-black text-slate-900"
              />
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
              <label className="block text-xs font-bold text-slate-700 mb-1">
                წლიური ინფლაცია (0%–50%)
              </label>
              <input
                type="number"
                min="0"
                max="50"
                step="0.5"
                value={inflationRate}
                onChange={e =>
                  setInflationRate(sanitizeRatePercent(Number(e.target.value), 0))
                }
                className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-base font-black text-slate-900"
              />
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
              <label className="block text-xs font-bold text-slate-700 mb-1">
                პერიოდი (წლები: 1–50)
              </label>
              <input
                type="number"
                min="1"
                max="50"
                step="1"
                value={yearsHorizon}
                onChange={e =>
                  setYearsHorizon(sanitizeYears(Number(e.target.value), 1))
                }
                className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-base font-black text-slate-900"
              />
            </div>
          </div>
        ) : activeCalcId === 'goal' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
              <label className="block text-xs font-bold text-slate-700 mb-1">
                სამიზნე თანხა ({curr})
              </label>
              <input
                type="number"
                min="100"
                step="500"
                value={goalTarget}
                onChange={e =>
                  setGoalTarget(sanitizeMoney(Number(e.target.value), 1000))
                }
                className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-base font-black text-slate-900"
              />
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
              <label className="block text-xs font-bold text-slate-700 mb-1">
                უკვე დაგროვილი ({curr})
              </label>
              <input
                type="number"
                min="0"
                step="200"
                value={goalCurrent}
                onChange={e =>
                  setGoalCurrent(sanitizeMoney(Number(e.target.value), 0))
                }
                className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-base font-black text-slate-900"
              />
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
              <label className="block text-xs font-bold text-slate-700 mb-1">
                ვადა (წლები: 1–50)
              </label>
              <input
                type="number"
                min="1"
                max="50"
                value={yearsHorizon}
                onChange={e =>
                  setYearsHorizon(sanitizeYears(Number(e.target.value), 1))
                }
                className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-base font-black text-slate-900"
              />
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
              <label className="block text-xs font-bold text-slate-700 mb-1">
                წლიური სარგებელი (0%–50%)
              </label>
              <input
                type="number"
                min="0"
                max="50"
                step="0.5"
                value={annualRate}
                onChange={e =>
                  setAnnualRate(sanitizeRatePercent(Number(e.target.value), 0))
                }
                className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-base font-black text-slate-900"
              />
            </div>
          </div>
        ) : activeCalcId === 'pension' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
              <label className="block text-xs font-bold text-slate-700 mb-1">
                თვიური ხელფასი ({curr})
              </label>
              <input
                type="number"
                min="100"
                step="100"
                value={pensionSalary}
                onChange={e =>
                  setPensionSalary(sanitizeMoney(Number(e.target.value), 500))
                }
                className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-base font-black text-slate-900"
              />
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
              <label className="block text-xs font-bold text-slate-700 mb-1">
                დაგროვების წლები (1–50)
              </label>
              <input
                type="number"
                min="1"
                max="50"
                value={pensionYears}
                onChange={e =>
                  setPensionYears(sanitizeYears(Number(e.target.value), 10))
                }
                className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-base font-black text-slate-900"
              />
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
              <label className="block text-xs font-bold text-slate-700 mb-1">
                წლიური სარგებელი (0%–50%)
              </label>
              <input
                type="number"
                min="0"
                max="50"
                step="0.5"
                value={annualRate}
                onChange={e =>
                  setAnnualRate(sanitizeRatePercent(Number(e.target.value), 7.5))
                }
                className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-base font-black text-slate-900"
              />
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
              <label className="block text-xs font-bold text-slate-700 mb-1">
                წლიური ინფლაცია (0%–50%)
              </label>
              <input
                type="number"
                min="0"
                max="50"
                step="0.5"
                value={inflationRate}
                onChange={e =>
                  setInflationRate(sanitizeRatePercent(Number(e.target.value), 4))
                }
                className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-base font-black text-slate-900"
              />
            </div>
          </div>
        ) : (
          /* Default Inputs for Savings, Compound, Deposit */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                საწყისი თანხა ({curr})
              </label>
              <input
                type="number"
                min="0"
                step="500"
                value={initialAmount}
                onChange={e =>
                  setInitialAmount(sanitizeMoney(Number(e.target.value), 0))
                }
                className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm font-black text-slate-900"
              />
            </div>

            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                თვიური შენატანი ({curr})
              </label>
              <input
                type="number"
                min="0"
                step="50"
                value={monthlyAddition}
                onChange={e =>
                  setMonthlyAddition(sanitizeMoney(Number(e.target.value), 0))
                }
                className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm font-black text-slate-900"
              />
            </div>

            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                წლიური სარგებელი (%)
              </label>
              <input
                type="number"
                min="0"
                max="50"
                step="0.5"
                value={annualRate}
                onChange={e =>
                  setAnnualRate(sanitizeRatePercent(Number(e.target.value), 0))
                }
                className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm font-black text-slate-900"
              />
            </div>

            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                წლიური ინფლაცია (%)
              </label>
              <input
                type="number"
                min="0"
                max="50"
                step="0.5"
                value={inflationRate}
                onChange={e =>
                  setInflationRate(sanitizeRatePercent(Number(e.target.value), 0))
                }
                className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm font-black text-slate-900"
              />
            </div>

            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                ვადა (წლები: 1–50)
              </label>
              <input
                type="number"
                min="1"
                max="50"
                value={yearsHorizon}
                onChange={e =>
                  setYearsHorizon(sanitizeYears(Number(e.target.value), 1))
                }
                className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm font-black text-slate-900"
              />
            </div>
          </div>
        )}

        {/* OUTPUT METRICS SUMMARY (Section 7: Input summary, Total personal contributions, Estimated growth, Final projected amount, Inflation-adjusted value) */}
        {activeCalcId === 'inflation' ? (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-xs font-bold text-slate-500 block">
                ნომინალური თანხა
              </span>
              <span className="text-2xl font-black text-slate-900">
                {curr}
                {inflationResult.nominalAmount.toLocaleString()}
              </span>
            </div>
            <div className="p-4 rounded-xl bg-rose-50 border border-rose-200">
              <span className="text-xs font-bold text-rose-800 block">
                ინფლაციით კორექტირებული რეალური ღირებულება
              </span>
              <span className="text-2xl font-black text-rose-800">
                {curr}
                {inflationResult.realPurchasingPower.toLocaleString()}
              </span>
            </div>
            <div className="p-4 rounded-xl bg-amber-50 border border-amber-200">
              <span className="text-xs font-bold text-amber-900 block">
                მსყიდველობითი ძალის დანაკარგი
              </span>
              <span className="text-2xl font-black text-amber-900">
                -{inflationResult.lossPercentage}% (-{curr}
                {inflationResult.purchasingPowerLost.toLocaleString()})
              </span>
            </div>
          </div>
        ) : activeCalcId === 'goal' ? (
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-blue-50 border border-blue-200">
              <span className="text-xs font-bold text-[#1F64FF] block">
                საჭირო თვიური შენატანი
              </span>
              <span className="text-2xl font-black text-[#1F64FF]">
                {curr}
                {goalCalcResult.requiredMonthly.toLocaleString()}/თვე
              </span>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-xs font-bold text-slate-500 block">
                ჯამური პირადი შენატანი
              </span>
              <span className="text-xl font-black text-slate-900">
                {curr}
                {goalCalcResult.proj.totalPrincipal.toLocaleString()}
              </span>
            </div>
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200">
              <span className="text-xs font-bold text-emerald-800 block">
                სავარაუდო საპროცენტო ზრდა
              </span>
              <span className="text-xl font-black text-emerald-800">
                +{curr}
                {goalCalcResult.proj.totalInterestEarned.toLocaleString()}
              </span>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-xs font-bold text-slate-500 block">
                საბოლოო პროგნოზირებული თანხა
              </span>
              <span className="text-xl font-black text-slate-900">
                {curr}
                {goalCalcResult.proj.finalNominalValue.toLocaleString()}
              </span>
            </div>
          </div>
        ) : activeCalcId === 'pension' ? (
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-xs font-bold text-slate-500 block">
                თქვენი პირადი შენატანი (2%)
              </span>
              <span className="text-xl font-black text-slate-900">
                {curr}
                {pensionResult.myPersonalContrib.toLocaleString()}
              </span>
            </div>
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200">
              <span className="text-xs font-bold text-emerald-800 block">
                თანადაფინანსება + ზრდა
              </span>
              <span className="text-xl font-black text-emerald-800">
                +{curr}
                {(
                  pensionResult.coFundingTotal +
                  pensionResult.proj.totalInterestEarned
                ).toLocaleString()}
              </span>
            </div>
            <div className="p-4 rounded-xl bg-blue-50 border border-blue-200">
              <span className="text-xs font-bold text-[#1F64FF] block">
                საბოლოო პროგნოზირებული თანხა
              </span>
              <span className="text-2xl font-black text-[#1F64FF]">
                {curr}
                {pensionResult.proj.finalNominalValue.toLocaleString()}
              </span>
            </div>
            <div className="p-4 rounded-xl bg-purple-50 border border-purple-200">
              <span className="text-xs font-bold text-purple-800 block">
                ინფლაციით კორექტირებული
              </span>
              <span className="text-xl font-black text-purple-900">
                {curr}
                {pensionResult.proj.finalRealValue.toLocaleString()}
              </span>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-xs font-bold text-slate-500 block">
                ჯამური პირადი შენატანი
              </span>
              <span className="text-xl font-black text-slate-900">
                {curr}
                {compoundOrSavingsResult.totalPrincipal.toLocaleString()}
              </span>
            </div>
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200">
              <span className="text-xs font-bold text-emerald-800 block">
                სავარაუდო ზრდა (სარგებელი)
              </span>
              <span className="text-xl font-black text-emerald-800">
                +{curr}
                {compoundOrSavingsResult.totalInterestEarned.toLocaleString()}
              </span>
            </div>
            <div className="p-4 rounded-xl bg-blue-50 border border-blue-200">
              <span className="text-xs font-bold text-[#1F64FF] block">
                საბოლოო პროგნოზირებული თანხა
              </span>
              <span className="text-2xl font-black text-[#1F64FF]">
                {curr}
                {compoundOrSavingsResult.finalNominalValue.toLocaleString()}
              </span>
            </div>
            <div className="p-4 rounded-xl bg-purple-50 border border-purple-200">
              <span className="text-xs font-bold text-purple-800 block">
                ინფლაციით კორექტირებული ღირებულება
              </span>
              <span className="text-xl font-black text-purple-900">
                {curr}
                {compoundOrSavingsResult.finalRealValue.toLocaleString()}
              </span>
            </div>
          </div>
        )}

        {/* Simple Visual Chart */}
        <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-bold text-slate-700">
            <span>წლიური დინამიკის გრაფიკი</span>
            <div className="flex items-center space-x-4">
              <span className="flex items-center">
                <span className="w-3 h-3 rounded-xs bg-[#1F64FF] mr-1.5" />
                ნომინალური
              </span>
              <span className="flex items-center">
                <span className="w-3 h-3 rounded-xs bg-emerald-500 mr-1.5" />
                რეალური (ინფლაციით)
              </span>
            </div>
          </div>

          <div className="h-40 flex items-end space-x-2 pt-4">
            {(activeCalcId === 'inflation'
              ? inflationResult.yearlySeries.map(s => ({
                  year: s.year,
                  nominalTotal: inflationResult.nominalAmount,
                  realTotal: s.realValue,
                }))
              : activeCalcId === 'pension'
              ? pensionResult.proj.yearlyBreakdown
              : activeCalcId === 'goal'
              ? goalCalcResult.proj.yearlyBreakdown
              : compoundOrSavingsResult.yearlyBreakdown
            )
              .slice(0, 20)
              .map(pt => {
                const maxVal = Math.max(pt.nominalTotal, initialAmount, 1);
                const nomH = Math.min(
                  100,
                  Math.max(10, Math.round((pt.nominalTotal / maxVal) * 100))
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
                        title={`წელი ${pt.year}: ${curr}${pt.nominalTotal.toLocaleString()}`}
                      />
                      <div
                        className="w-1/2 bg-emerald-500 rounded-t-sm transition-all duration-300"
                        style={{ height: `${realH}%` }}
                        title={`რეალური წელი ${pt.year}: ${curr}${pt.realTotal.toLocaleString()}`}
                      />
                    </div>
                    <span className="text-[10px] font-bold text-slate-500 mt-1">
                      წ.{pt.year}
                    </span>
                  </div>
                );
              })}
          </div>
        </div>

        {/* Assumptions, Educational Explanation & "აუხსენი AI-ის დახმარებით" Button */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-center bg-blue-50/50 border border-blue-200/80 rounded-2xl p-5">
          <div className="lg:col-span-2 space-y-1.5 text-xs sm:text-sm text-slate-700">
            <div className="font-black text-slate-900 flex items-center space-x-1.5">
              <Info className="w-4 h-4 text-[#1F64FF]" />
              <span>დაშვებები და საგანმანათლებლო განმარტება:</span>
            </div>
            <p className="leading-relaxed">
              გამოთვლა ეფუძნება მუდმივ საილუსტრაციო წლიურ განაკვეთს ({sanitizeRatePercent(annualRate)}%) და ინფლაციას ({sanitizeRatePercent(inflationRate)}%). რეალური საბაზრო და საბანკო პირობები დროთა განმავლობაში იცვლება.
            </p>
          </div>

          <div className="flex justify-start lg:justify-end">
            <button
              type="button"
              onClick={handleExplainWithAi}
              className="w-full sm:w-auto px-5 py-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs sm:text-sm flex items-center justify-center space-x-2 shadow-xs transition-colors"
            >
              <Sparkles className="w-4 h-4" />
              <span>აუხსენი AI-ის დახმარებით</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
