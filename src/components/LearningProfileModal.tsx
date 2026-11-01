import React, { useState, useEffect } from 'react';
import { UserProfile, KnowledgeLevel, LearningProfileSettings } from '../types';
import { X, Sliders, Check, Sparkles, RotateCcw, Play } from 'lucide-react';

interface LearningProfileModalProps {
  user: UserProfile;
  setUser: React.Dispatch<React.SetStateAction<UserProfile>>;
  isOpen: boolean;
  onClose: () => void;
  onActivateDemo: () => void;
  onResetDemo: () => void;
}

const AVAILABLE_INTERESTS = [
  'ბიუჯეტირება',
  'დანაზოგი',
  'ინფლაცია',
  'დეპოზიტები',
  'ობლიგაციები და აქციები',
  'საპენსიო გეგმა',
];

const AVAILABLE_GOALS = [
  'საგანგებო ფონდი',
  'საპენსიო კაპიტალი',
  'შვილის განათლების ფონდი',
  'ბინის შენატანი / რემონტი',
];

const EXPLANATION_STYLES = [
  'მარტივად, ყოველდღიური მაგალითებით',
  'დეტალურად, ფორმულებითა და დაშვებებით',
  'მოკლე პრაქტიკული ნაბიჯებით',
];

export const LearningProfileModal: React.FC<LearningProfileModalProps> = ({
  user,
  setUser,
  isOpen,
  onClose,
  onActivateDemo,
  onResetDemo,
}) => {
  const [form, setForm] = useState<LearningProfileSettings>(user.learningProfile);

  useEffect(() => {
    setForm(user.learningProfile);
  }, [user.learningProfile, isOpen]);

  if (!isOpen) return null;

  const toggleInterest = (interest: string) => {
    setForm(prev => {
      const exists = prev.interests.includes(interest);
      const next = exists
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest];
      return { ...prev, interests: next.length > 0 ? next : [interest] };
    });
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setUser(prev => ({
      ...prev,
      knowledgeLevel: form.knowledgeLevel,
      dailyTargetActivities: form.dailyGoalLessons,
      weeklyTargetLessons: form.weeklyFrequencyDays,
      learningProfile: form,
    }));
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="learning-profile-title"
    >
      <div className="relative w-full max-w-xl bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 max-h-[90vh] overflow-y-auto shadow-xl space-y-6">
        <button
          onClick={onClose}
          aria-label="დახურვა"
          className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-800 rounded-lg hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-start space-x-3 border-b border-slate-100 pb-4">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#1F64FF] flex items-center justify-center shrink-0">
            <Sliders className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 id="learning-profile-title" className="text-xl font-black text-slate-900">
                ჩემი სასწავლო პროფილი
              </h2>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200">
                დემო პერსონალიზაცია
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
              ეს პარამეტრები ცვლის სასწავლო რეკომენდაციებს და AGNO AI დამხმარის ახსნის სტილს.
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSave} className="space-y-5">
          {/* 1. Knowledge Level */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-2">
              1. ცოდნის დონე
            </label>
            <div className="grid grid-cols-3 gap-2.5">
              {(['Beginner', 'Intermediate', 'Advanced'] as KnowledgeLevel[]).map(lvl => {
                const isSelected = form.knowledgeLevel === lvl;
                return (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => setForm(prev => ({ ...prev, knowledgeLevel: lvl }))}
                    className={`py-2.5 px-3 rounded-xl border text-xs sm:text-sm font-bold transition-all ${
                      isSelected
                        ? 'bg-[#1F64FF] border-[#1F64FF] text-white shadow-xs'
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {lvl}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. Interests */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-2">
              2. მთავარი ინტერესები
            </label>
            <div className="flex flex-wrap gap-2">
              {AVAILABLE_INTERESTS.map(interest => {
                const active = form.interests.includes(interest);
                return (
                  <button
                    key={interest}
                    type="button"
                    onClick={() => toggleInterest(interest)}
                    className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition-all flex items-center space-x-1.5 ${
                      active
                        ? 'bg-blue-50 border-[#1F64FF] text-[#1F64FF]'
                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {active && <Check className="w-3.5 h-3.5" />}
                    <span>{interest}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3. Primary Financial Goal */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              3. მიმდინარე ფინანსური მიზანი
            </label>
            <select
              value={form.primaryGoal}
              onChange={e => setForm(prev => ({ ...prev, primaryGoal: e.target.value }))}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#1F64FF]"
            >
              {AVAILABLE_GOALS.map(g => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </select>
          </div>

          {/* 4. Preferred Explanation Style */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              4. სასურველი ახსნის ფორმა
            </label>
            <select
              value={form.preferredExplanation}
              onChange={e => setForm(prev => ({ ...prev, preferredExplanation: e.target.value }))}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#1F64FF]"
            >
              {EXPLANATION_STYLES.map(s => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          {/* 5. Daily & Weekly Learning Goal + Notification Frequency */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                დღიური მიზანი
              </label>
              <select
                value={form.dailyGoalLessons}
                onChange={e => setForm(prev => ({ ...prev, dailyGoalLessons: Number(e.target.value) }))}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs sm:text-sm font-bold text-slate-900"
              >
                <option value={1}>1 გაკვეთილი</option>
                <option value={2}>2 გაკვეთილი</option>
                <option value={3}>3 გაკვეთილი</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                კვირაში სიხშირე
              </label>
              <select
                value={form.weeklyFrequencyDays}
                onChange={e => setForm(prev => ({ ...prev, weeklyFrequencyDays: Number(e.target.value) }))}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs sm:text-sm font-bold text-slate-900"
              >
                <option value={3}>3 დღე</option>
                <option value={5}>5 დღე</option>
                <option value={7}>7 დღე</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                შეტყობინებები (დემო)
              </label>
              <select
                value={form.notificationFrequency}
                onChange={e => setForm(prev => ({ ...prev, notificationFrequency: e.target.value }))}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs sm:text-sm font-bold text-slate-900"
              >
                <option value="ყოველდღიური შეხსენება">ყოველდღიური</option>
                <option value="კვირაში 3-ჯერ">კვირაში 3-ჯერ</option>
                <option value="გამორთულია">გამორთულია</option>
              </select>
            </div>
          </div>

          {/* Presentation Demo Controls Section */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-black text-slate-900 block">
                  პრეზენტაციის დემო რეჟიმი
                </span>
                <span className="text-[11px] text-slate-500">
                  ჩატვირთეთ სრული სადემონსტრაციო მონაცემები (340 XP, 4-დღიანი Streak, მიზნები) ან გაანულეთ პროგრესი.
                </span>
              </div>
              {user.isDemoMode && (
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 shrink-0">
                  დემო რეჟიმი
                </span>
              )}
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => {
                  onActivateDemo();
                  onClose();
                }}
                className="px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold flex items-center space-x-1.5 transition-colors"
              >
                <Play className="w-3.5 h-3.5" />
                <span>პრეზენტაციის დემო</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  onResetDemo();
                  onClose();
                }}
                className="px-3.5 py-2 rounded-xl bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 text-xs font-bold flex items-center space-x-1.5 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>დემოს განულება</span>
              </button>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end space-x-2 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-900"
            >
              გაუქმება
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-[#1F64FF] hover:bg-blue-700 text-white font-bold text-xs sm:text-sm shadow-xs transition-colors"
            >
              პროფილის შენახვა
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
