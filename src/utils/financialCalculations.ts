/**
 * Deterministic Financial Calculation Utilities for AGNO FINEDU
 * Validates all inputs to prevent NaN, Infinity, or negative balances.
 */

export function sanitizeMoney(value: number, fallback = 0): number {
  if (typeof value !== 'number' || Number.isNaN(value) || !Number.isFinite(value)) {
    return fallback;
  }
  return Math.max(0, Math.round(value * 100) / 100);
}

export function sanitizeRatePercent(ratePercent: number, fallback = 0): number {
  if (typeof ratePercent !== 'number' || Number.isNaN(ratePercent) || !Number.isFinite(ratePercent)) {
    return fallback;
  }
  return Math.min(50, Math.max(0, ratePercent));
}

export function sanitizeYears(years: number, fallback = 1): number {
  if (typeof years !== 'number' || Number.isNaN(years) || !Number.isFinite(years)) {
    return fallback;
  }
  // Between 1 month (1/12 year) and 50 years
  return Math.min(50, Math.max(1 / 12, years));
}

export function sanitizeMonths(months: number, fallback = 12): number {
  if (typeof months !== 'number' || Number.isNaN(months) || !Number.isFinite(months)) {
    return fallback;
  }
  return Math.min(600, Math.max(1, Math.round(months)));
}

/**
 * Simplified Real Return Formula:
 * ((1 + nominalRate) / (1 + inflationRate)) - 1
 */
export function calculateRealReturnRate(nominalRatePercent: number, inflationRatePercent: number): number {
  const nom = sanitizeRatePercent(nominalRatePercent) / 100;
  const inf = sanitizeRatePercent(inflationRatePercent) / 100;
  const real = (1 + nom) / (1 + inf) - 1;
  if (Number.isNaN(real) || !Number.isFinite(real)) return 0;
  return real * 100;
}

/**
 * Compound Growth & Future Value of an Annuity:
 * Lump Sum FV = P * (1 + r/n)^(n*t)
 * Monthly Annuity FV = PMT * (((1 + r/n)^(n*t) - 1) / (r/n))
 */
export interface CompoundProjectionResult {
  finalNominalValue: number;
  finalRealValue: number;
  totalPrincipal: number;
  totalInterestEarned: number;
  realAnnualReturnPercent: number;
  yearlyBreakdown: Array<{
    year: number;
    principal: number;
    nominalTotal: number;
    realTotal: number;
  }>;
}

export function calculateCompoundProjection(params: {
  initialPrincipal: number;
  monthlyContribution: number;
  annualRatePercent: number;
  annualInflationPercent?: number;
  years: number;
  compoundingFrequency?: number; // default 12 (monthly)
}): CompoundProjectionResult {
  const P = sanitizeMoney(params.initialPrincipal, 0);
  const PMT = sanitizeMoney(params.monthlyContribution, 0);
  const annualRate = sanitizeRatePercent(params.annualRatePercent, 0) / 100;
  const inflationRate = sanitizeRatePercent(params.annualInflationPercent ?? 0, 0) / 100;
  const tYears = sanitizeYears(params.years, 1);
  const n = params.compoundingFrequency && params.compoundingFrequency > 0 ? params.compoundingFrequency : 12;

  const totalMonths = Math.max(1, Math.round(tYears * 12));
  const totalYearsRounded = Math.max(1, Math.ceil(tYears));

  const computeAtYear = (yearFraction: number) => {
    const periods = n * yearFraction;
    const months = Math.round(yearFraction * 12);
    const totalContrib = P + PMT * months;

    let fvLump = P;
    let fvAnnuity = PMT * months;

    if (annualRate > 0) {
      const ratePerPeriod = annualRate / n;
      fvLump = P * Math.pow(1 + ratePerPeriod, periods);
      // Monthly contribution compounded monthly
      const monthlyRate = annualRate / 12;
      fvAnnuity = PMT * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate);
    }

    const nominal = fvLump + fvAnnuity;
    const real = inflationRate > 0 ? nominal / Math.pow(1 + inflationRate, yearFraction) : nominal;

    return {
      principal: Math.round(totalContrib),
      nominalTotal: Math.round(Number.isFinite(nominal) ? nominal : totalContrib),
      realTotal: Math.round(Number.isFinite(real) ? real : totalContrib),
    };
  };

  const yearlyBreakdown: CompoundProjectionResult['yearlyBreakdown'] = [];
  for (let y = 1; y <= totalYearsRounded; y++) {
    const snap = computeAtYear(y);
    yearlyBreakdown.push({
      year: y,
      principal: snap.principal,
      nominalTotal: snap.nominalTotal,
      realTotal: snap.realTotal,
    });
  }

  const finalSnap = computeAtYear(totalMonths / 12);
  const totalInterestEarned = Math.max(0, finalSnap.nominalTotal - finalSnap.principal);
  const realAnnualReturnPercent = Math.round(calculateRealReturnRate(params.annualRatePercent, params.annualInflationPercent ?? 0) * 100) / 100;

  return {
    finalNominalValue: finalSnap.nominalTotal,
    finalRealValue: finalSnap.realTotal,
    totalPrincipal: finalSnap.principal,
    totalInterestEarned,
    realAnnualReturnPercent,
    yearlyBreakdown,
  };
}

/**
 * Inflation Impact Calculation
 */
export interface InflationImpactResult {
  nominalAmount: number;
  realPurchasingPower: number;
  purchasingPowerLost: number;
  lossPercentage: number;
  futureEquivalentCost: number;
  yearlySeries: Array<{
    year: number;
    realValue: number;
  }>;
}

export function calculateInflationImpact(params: {
  amount: number;
  annualInflationPercent: number;
  years: number;
}): InflationImpactResult {
  const amount = sanitizeMoney(params.amount, 1000);
  const inf = sanitizeRatePercent(params.annualInflationPercent, 5) / 100;
  const years = Math.round(sanitizeYears(params.years, 5));

  const yearlySeries: Array<{ year: number; realValue: number }> = [];
  for (let y = 1; y <= years; y++) {
    const rv = amount / Math.pow(1 + inf, y);
    yearlySeries.push({
      year: y,
      realValue: Math.round(Number.isFinite(rv) ? rv : amount),
    });
  }

  const realPurchasingPower = yearlySeries[yearlySeries.length - 1]?.realValue ?? amount;
  const purchasingPowerLost = Math.max(0, amount - realPurchasingPower);
  const lossPercentage = amount > 0 ? Math.round((purchasingPowerLost / amount) * 1000) / 10 : 0;
  const futureEquivalentCost = Math.round(amount * Math.pow(1 + inf, years));

  return {
    nominalAmount: Math.round(amount),
    realPurchasingPower,
    purchasingPowerLost,
    lossPercentage,
    futureEquivalentCost: Number.isFinite(futureEquivalentCost) ? futureEquivalentCost : Math.round(amount),
    yearlySeries,
  };
}

/**
 * Goal Required Monthly Contribution Calculator
 */
export function calculateGoalMonthlyRequirement(params: {
  targetAmount: number;
  currentAmount: number;
  months: number;
  annualReturnPercent?: number;
}): {
  remainingAmount: number;
  requiredMonthly: number;
  projectedWithReturn: number;
} {
  const target = sanitizeMoney(params.targetAmount, 1000);
  const current = sanitizeMoney(params.currentAmount, 0);
  const months = sanitizeMonths(params.months, 12);
  const rate = sanitizeRatePercent(params.annualReturnPercent ?? 0, 0) / 100;

  const remainingAmount = Math.max(0, target - current);
  if (remainingAmount === 0) {
    return { remainingAmount: 0, requiredMonthly: 0, projectedWithReturn: current };
  }

  if (rate === 0) {
    const req = Math.ceil(remainingAmount / months);
    return { remainingAmount, requiredMonthly: req, projectedWithReturn: target };
  }

  const rMonthly = rate / 12;
  const futureCurrent = current * Math.pow(1 + rMonthly, months);
  const stillNeeded = Math.max(0, target - futureCurrent);
  const factor = (Math.pow(1 + rMonthly, months) - 1) / rMonthly;
  const requiredMonthly = factor > 0 ? Math.ceil(stillNeeded / factor) : Math.ceil(stillNeeded / months);

  return {
    remainingAmount: Math.round(remainingAmount),
    requiredMonthly: Number.isFinite(requiredMonthly) ? Math.max(0, requiredMonthly) : 0,
    projectedWithReturn: Math.round(target),
  };
}
