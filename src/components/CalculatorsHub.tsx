import React, { useState, useMemo } from 'react';
import { UserProfile } from '../types';
import { translations, currencySymbols } from '../translations';
import { 
  Calculator, 
  TrendingUp, 
  Flame, 
  Percent, 
  Coins, 
  ShieldAlert, 
  ArrowRight,
  Plus,
  Minus,
  Sparkles
} from 'lucide-react';

interface CalculatorsHubProps {
  user: UserProfile;
  initialCalc?: string;
  onNavigateToAcademy?: () => void;
  onAskAiWithContext?: (prompt: string) => void;
}

export const CalculatorsHub: React.FC<CalculatorsHubProps> = ({
  user,
  initialCalc = 'compound',
  onNavigateToAcademy,
  onAskAiWithContext,
}) => {
  const t = translations[user.language];
  const curr = currencySymbols[user.currency] || '₾';
  const isKa = user.language === 'ka';

  const [activeMode, setActiveMode] = useState<string>(
    initialCalc === 'inflation' ? 'inflation' : initialCalc === 'pension' ? 'pension' : initialCalc === 'deposit' ? 'deposit' : 'compound'
  );

  // 1. Compound Interest State
  const [ciInitial, setCiInitial] = useState(1000);
  const [ciMonthly, setCiMonthly] = useState(200);
  const [ciRate, setCiRate] = useState(9); // %
  const [ciYears, setCiYears] = useState(10);

  // 2. Inflation State
  const [infCash, setInfCash] = useState(10000);
  const [infRate, setInfRate] = useState(6);
  const [infYears, setInfYears] = useState(5);

  // 3. Deposit vs Invest State
  const [depPrincipal, setDepPrincipal] = useState(5000);
  const [depMonthly, setDepMonthly] = useState(200);
  const [depYears, setDepYears] = useState(7);

  // 4. Pension State
  const [penSalary, setPenSalary] = useState(2000);
  const [penYears, setPenYears] = useState(25);

  // Compound calculations
  const compoundResult = useMemo(() => {
    const r = ciRate / 100 / 12;
    const months = ciYears * 12;
    let total = ciInitial;
    let deposited = ciInitial;

    for (let m = 1; m <= months; m++) {
      total = total * (1 + r) + ciMonthly;
      deposited += ciMonthly;
    }

    const interest = Math.max(0, total - deposited);
    return {
      total: Math.round(total),
      deposited: Math.round(deposited),
      interest: Math.round(interest),
    };
  }, [ciInitial, ciMonthly, ciRate, ciYears]);

  // Inflation calculations
  const inflationResult = useMemo(() => {
    const realValue = infCash / Math.pow(1 + infRate / 100, infYears);
    const lostValue = Math.max(0, infCash - realValue);
    const percentLost = Math.round((lostValue / infCash) * 100);
    return {
      realValue: Math.round(realValue),
      lostValue: Math.round(lostValue),
      percentLost,
    };
  }, [infCash, infRate, infYears]);

  // Deposit vs Invest
  const depVsInvestResult = useMemo(() => {
    const months = depYears * 12;
    // 9.5% bank deposit
    let bank = depPrincipal;
    for (let m = 1; m <= months; m++) bank = bank * (1 + 0.095 / 12) + depMonthly;

    // 11% diversified index
    let index = depPrincipal;
    for (let m = 1; m <= months; m++) index = index * (1 + 0.11 / 12) + depMonthly;

    const invested = depPrincipal + depMonthly * months;
    return {
      invested: Math.round(invested),
      bank: Math.round(bank),
      index: Math.round(index),
    };
  }, [depPrincipal, depMonthly, depYears]);

  // Pension (2% employee + 2% employer + 2% state)
  const pensionResult = useMemo(() => {
    const months = penYears * 12;
    const myShare = penSalary * 0.02;
    const employerShare = penSalary * 0.02;
    const stateShare = penSalary * 0.02;
    const monthlyTotal = myShare + employerShare + stateShare;

    let totalFund = 0;
    const r = 0.075 / 12; // 7.5% expected annual growth

    for (let m = 1; m <= months; m++) {
      totalFund = totalFund * (1 + r) + monthlyTotal;
    }

    const myDeposited = myShare * months;
    const bonusGiven = (employerShare + stateShare) * months;

    return {
      totalFund: Math.round(totalFund),
      myDeposited: Math.round(myDeposited),
      bonusGiven: Math.round(bonusGiven),
      monthlyPension: Math.round(totalFund / (15 * 12)),
    };
  }, [penSalary, penYears]);

  return (
    <div className="space-y-6">
      
      {/* Title */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center space-x-3">
          <Calculator className="w-8 h-8 text-blue-600" />
          <span>{t.calcHeaderTitle}</span>
        </h1>
        <p className="text-sm sm:text-base text-slate-600 mt-1">
          {t.calcHeaderSubtitle}
        </p>
      </div>

      {/* 4 Obvious Question Mode Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { id: 'compound', label: isKa ? 'რამდენი დამრჩება წლების შემდეგ?' : 'Future Wealth Calculator', icon: TrendingUp },
          { id: 'inflation', label: isKa ? 'რამდენს მაკლებს ინფლაცია?' : 'Inflation Drag on Cash', icon: Flame },
          { id: 'deposit', label: isKa ? 'ანაბარი თუ ინვესტიცია?' : 'Bank Deposit vs Stocks', icon: Percent },
          { id: 'pension', label: isKa ? 'დაგროვებითი პენსია (2+2+2)' : 'Pension Accumulator', icon: Coins },
        ].map(m => {
          const Icon = m.icon;
          const isActive = activeMode === m.id;
          return (
            <button
              key={m.id}
              onClick={() => setActiveMode(m.id)}
              className={`p-4 rounded-2xl border text-left font-bold text-xs sm:text-sm flex items-start space-x-3 transition-all ${
                isActive
                  ? 'bg-blue-600 border-blue-600 text-white shadow-sm'
                  : 'bg-white border-slate-200/90 text-slate-700 hover:border-slate-300'
              }`}
            >
              <div className={`p-2 rounded-xl shrink-0 ${isActive ? 'bg-white/20 text-white' : 'bg-blue-50 text-blue-600'}`}>
                <Icon className="w-5 h-5" />
              </div>
              <span className="mt-1 leading-snug">{m.label}</span>
            </button>
          );
        })}
      </div>

      {/* Mode 1: Compound Growth */}
      {activeMode === 'compound' && (
        <div className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h3 className="text-lg font-black text-slate-900">
              {isKa ? 'რთული პროცენტი: როგორ იზრდება თქვენი დანაზოგი' : 'Compound Interest: How Money Multiplies Over Time'}
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              {isKa ? 'შეიყვანეთ თანხები და ნახეთ საბოლოო შედეგი:' : 'Enter amounts to see your future balance:'}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Initial */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
              <span className="text-xs font-bold text-slate-600 block mb-1">
                {isKa ? 'საწყისი თანხა' : 'Starting Amount'}
              </span>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setCiInitial(Math.max(0, ciInitial - 500))}
                  className="w-8 h-8 rounded-lg bg-white border border-slate-300 flex items-center justify-center font-bold text-slate-700 hover:bg-slate-100"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="flex-1 text-center font-black text-slate-900 text-base">
                  {curr}{ciInitial.toLocaleString()}
                </span>
                <button
                  onClick={() => setCiInitial(ciInitial + 500)}
                  className="w-8 h-8 rounded-lg bg-white border border-slate-300 flex items-center justify-center font-bold text-slate-700 hover:bg-slate-100"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Monthly */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
              <span className="text-xs font-bold text-slate-600 block mb-1">
                {isKa ? 'თვიური შენატანი' : 'Monthly Savings'}
              </span>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setCiMonthly(Math.max(0, ciMonthly - 50))}
                  className="w-8 h-8 rounded-lg bg-white border border-slate-300 flex items-center justify-center font-bold text-slate-700 hover:bg-slate-100"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="flex-1 text-center font-black text-slate-900 text-base">
                  {curr}{ciMonthly.toLocaleString()}
                </span>
                <button
                  onClick={() => setCiMonthly(ciMonthly + 50)}
                  className="w-8 h-8 rounded-lg bg-white border border-slate-300 flex items-center justify-center font-bold text-slate-700 hover:bg-slate-100"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Rate */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
              <span className="text-xs font-bold text-slate-600 block mb-1">
                {isKa ? 'წლიური ზრდა / პროცენტი' : 'Annual Growth Rate'}
              </span>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setCiRate(Math.max(1, ciRate - 1))}
                  className="w-8 h-8 rounded-lg bg-white border border-slate-300 flex items-center justify-center font-bold text-slate-700 hover:bg-slate-100"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="flex-1 text-center font-black text-slate-900 text-base">
                  {ciRate}%
                </span>
                <button
                  onClick={() => setCiRate(ciRate + 1)}
                  className="w-8 h-8 rounded-lg bg-white border border-slate-300 flex items-center justify-center font-bold text-slate-700 hover:bg-slate-100"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Years */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
              <span className="text-xs font-bold text-slate-600 block mb-1">
                {isKa ? 'პერიოდი (წლები)' : 'Time Horizon'}
              </span>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setCiYears(Math.max(1, ciYears - 1))}
                  className="w-8 h-8 rounded-lg bg-white border border-slate-300 flex items-center justify-center font-bold text-slate-700 hover:bg-slate-100"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="flex-1 text-center font-black text-slate-900 text-base">
                  {ciYears} {isKa ? 'წელი' : 'yrs'}
                </span>
                <button
                  onClick={() => setCiYears(ciYears + 1)}
                  className="w-8 h-8 rounded-lg bg-white border border-slate-300 flex items-center justify-center font-bold text-slate-700 hover:bg-slate-100"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Big Clear Result Box */}
          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6 sm:p-7">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-blue-700 block mb-1">
                  {isKa ? 'თქვენი საბოლოო თანხა ' + ciYears + ' წელში:' : 'Your Total Future Wealth in ' + ciYears + ' Years:'}
                </span>
                <span className="text-3xl sm:text-4xl font-black text-blue-950 tracking-tight">
                  {curr}{compoundResult.total.toLocaleString()}
                </span>
              </div>
              <div className="text-left sm:text-right">
                <span className="text-xs text-slate-500 block">{isKa ? 'აქედან გამომუშავებული პროცენტი:' : 'Interest Earned from Compounding:'}</span>
                <span className="text-xl font-black text-emerald-700">
                  +{curr}{compoundResult.interest.toLocaleString()}
                </span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed bg-white/80 p-4 rounded-xl border border-blue-200/50">
              {isKa 
                ? `💡 მარტივად რომ ვთქვათ: თქვენ შეიტანთ სულ ${curr}${compoundResult.deposited.toLocaleString()}-ს, ხოლო რთული პროცენტის წყალობით დამატებით მიიღებთ კიდევ ${curr}${compoundResult.interest.toLocaleString()}-ს. დრო და რეგულარული დანაზოგი თქვენი მთავარი ძალაა!` 
                : `💡 In plain words: You deposit ${curr}${compoundResult.deposited.toLocaleString()} over ${ciYears} years, and compound interest generates an extra ${curr}${compoundResult.interest.toLocaleString()} on top. Consistent habits beat timing the market!`}
            </p>
          </div>
        </div>
      )}

      {/* Mode 2: Inflation Drag */}
      {activeMode === 'inflation' && (
        <div className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h3 className="text-lg font-black text-slate-900 flex items-center space-x-2">
              <ShieldAlert className="w-5 h-5 text-amber-600" />
              <span>{isKa ? 'რამდენს კარგავს სახლში შენახული ნაღდი ფული?' : 'How Much Does Idle Cash Lose at Home?'}</span>
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              {t.cashWarningText}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
              <span className="text-xs font-bold text-slate-600 block mb-1">
                {isKa ? 'ნაღდი თანხა' : 'Cash Amount'}
              </span>
              <input
                type="number"
                min="500"
                step="500"
                value={infCash}
                onChange={e => setInfCash(Number(e.target.value))}
                className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-base font-bold text-slate-900"
              />
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
              <span className="text-xs font-bold text-slate-600 block mb-1">
                {isKa ? 'წლიური ინფლაცია (%)' : 'Inflation Rate (%)'}
              </span>
              <input
                type="number"
                min="1"
                max="20"
                step="0.5"
                value={infRate}
                onChange={e => setInfRate(Number(e.target.value))}
                className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-base font-bold text-slate-900"
              />
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
              <span className="text-xs font-bold text-slate-600 block mb-1">
                {isKa ? 'პერიოდი (წლები)' : 'Years'}
              </span>
              <input
                type="number"
                min="1"
                max="20"
                value={infYears}
                onChange={e => setInfYears(Number(e.target.value))}
                className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-base font-bold text-slate-900"
              />
            </div>
          </div>

          {/* Result */}
          <div className="bg-rose-50 border border-rose-200 rounded-2xl p-6 sm:p-7">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
              <div>
                <span className="text-xs text-slate-500 block">{isKa ? 'ნომინალური ფული დარჩება:' : 'Nominal Cash Balance:'}</span>
                <span className="text-2xl font-black text-slate-900">{curr}{infCash.toLocaleString()}</span>
              </div>
              <div>
                <span className="text-xs text-rose-700 block font-bold">{isKa ? 'რეალური მსყიდველუნარიანობა:' : 'Real Buying Power Left:'}</span>
                <span className="text-2xl font-black text-rose-800">{curr}{inflationResult.realValue.toLocaleString()}</span>
              </div>
              <div>
                <span className="text-xs text-rose-700 block font-bold">{isKa ? 'დაკარგული მსყიდველობითი ძალა:' : 'Purchasing Power Lost:'}</span>
                <span className="text-2xl font-black text-rose-700">-{inflationResult.percentLost}%</span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-rose-950/80 leading-relaxed bg-white/90 p-4 rounded-xl border border-rose-200/60">
              {isKa
                ? `⚠️ თქვენი ${curr}${infCash.toLocaleString()} კვლავ იგივე რიცხვი იქნება, მაგრამ ფასების ზრდის გამო, ${infYears} წლის შემდეგ მისით მხოლოდ ${curr}${inflationResult.realValue.toLocaleString()}-ის ღირებულების საქონელს იყიდით. გამოსავალი: შეინახეთ საბანკო ანაბარზე ან საინვესტიციო ინდექსში.`
                : `⚠️ While you still have the same bills, their real worth drops by -${inflationResult.percentLost}% over ${infYears} years. Solution: Put idle money into high-yield deposits or broad index funds.`}
            </p>
          </div>
        </div>
      )}

      {/* Mode 3: Bank Deposit vs Investment */}
      {activeMode === 'deposit' && (
        <div className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h3 className="text-lg font-black text-slate-900">
              {isKa ? 'ბანკის ანაბარი თუ ინდექსური ინვესტიცია?' : 'Bank Deposit vs Index Investments'}
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              {isKa ? 'ნახეთ განსხვავება გარანტირებულ ანაბარსა და გრძელვადიან ზრდას შორის:' : 'Compare guaranteed bank yields with long-term compound growth:'}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Bank Deposit Box */}
            <div className="p-6 rounded-2xl bg-blue-50 border border-blue-200">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-700 block mb-2">
                {isKa ? '1. საბანკო ვადიანი დეპოზიტი (~9.5%)' : '1. Bank Term Deposit (~9.5%)'}
              </span>
              <span className="text-3xl font-black text-blue-950 block mb-2">
                {curr}{depVsInvestResult.bank.toLocaleString()}
              </span>
              <p className="text-xs text-slate-600 leading-relaxed">
                {isKa 
                  ? 'გარანტირებული დაცვა. იდეალურია 1-3 წლიანი მიზნებისთვის და საგანგებო მარაგისთვის.' 
                  : 'Guaranteed principal. Best for short-term goals (<3 years) and emergency cushions.'}
              </p>
            </div>

            {/* Investment Box */}
            <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 block mb-2">
                {isKa ? '2. დივერსიფიცირებული ინვესტიცია (~11%)' : '2. Broad Index ETF (~11%)'}
              </span>
              <span className="text-3xl font-black text-emerald-950 block mb-2">
                {curr}{depVsInvestResult.index.toLocaleString()}
              </span>
              <p className="text-xs text-slate-600 leading-relaxed">
                {isKa 
                  ? `დამატებით +${curr}${(depVsInvestResult.index - depVsInvestResult.bank).toLocaleString()} მეტი შემოსავალი. იდეალურია 5+ წლიანი გეგმებისთვის.` 
                  : `Generates +${curr}${(depVsInvestResult.index - depVsInvestResult.bank).toLocaleString()} extra wealth. Best for 5+ year horizons.`}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Mode 4: Pension 2+2+2 */}
      {activeMode === 'pension' && (
        <div className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h3 className="text-lg font-black text-slate-900">
              {isKa ? 'დაგროვებითი საპენსიო სისტემა (2+2+2)' : 'The 2+2+2 Pension Compounding Engine'}
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              {isKa ? 'თქვენ დებთ მხოლოდ 2%-ს, ხოლო დამსაქმებელი და სახელმწიფო ამ თანხას აორმაგებენ ან ასამმაგებენ!' : 'Your 2% contribution is doubled or tripled by employer and government matching!'}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
              <span className="text-xs font-bold text-slate-600 block mb-1">
                {isKa ? 'ყოველთვიური ხელფასი' : 'Gross Monthly Salary'} ({curr})
              </span>
              <input
                type="number"
                min="500"
                step="100"
                value={penSalary}
                onChange={e => setPenSalary(Number(e.target.value))}
                className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-base font-bold text-slate-900"
              />
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
              <span className="text-xs font-bold text-slate-600 block mb-1">
                {isKa ? 'დაგროვების წლები' : 'Years Until Retirement'}
              </span>
              <input
                type="number"
                min="5"
                max="40"
                value={penYears}
                onChange={e => setPenYears(Number(e.target.value))}
                className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-base font-bold text-slate-900"
              />
            </div>
          </div>

          {/* Result */}
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 sm:p-7">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
              <div>
                <span className="text-xs text-slate-600 block">{isKa ? 'საპენსიო კაპიტალი სულ:' : 'Total Pension Nest Egg:'}</span>
                <span className="text-3xl font-black text-emerald-950">{curr}{pensionResult.totalFund.toLocaleString()}</span>
              </div>
              <div>
                <span className="text-xs text-slate-600 block">{isKa ? 'აქედან თქვენი შენატანი (2%):' : 'Your 2% Contributions:'}</span>
                <span className="text-xl font-bold text-slate-800">{curr}{pensionResult.myDeposited.toLocaleString()}</span>
              </div>
              <div>
                <span className="text-xs text-emerald-700 block font-bold">{isKa ? 'დამსაქმებელი + სახელმწიფო:' : 'Matching Added for Free:'}</span>
                <span className="text-xl font-bold text-emerald-700">+{curr}{pensionResult.bonusGiven.toLocaleString()}</span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-emerald-950 leading-relaxed bg-white/90 p-4 rounded-xl border border-emerald-200/60">
              {isKa
                ? `🎉 საპენსიო სისტემაში თქვენ შეიტანთ მხოლოდ ${curr}${pensionResult.myDeposited.toLocaleString()}-ს, ხოლო საბოლოოდ გექნებათ ${curr}${pensionResult.totalFund.toLocaleString()} (დაახლოებით ${curr}${pensionResult.monthlyPension.toLocaleString()} თვეში 15 წლის განმავლობაში).`
                : `🎉 For contributing just ${curr}${pensionResult.myDeposited.toLocaleString()}, matching contributions and market compounding turn it into ${curr}${pensionResult.totalFund.toLocaleString()}.`}
            </p>
          </div>
        </div>
      )}

    </div>
  );
};
