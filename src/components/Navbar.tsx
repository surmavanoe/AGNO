import React, { useState } from 'react';
import { translations } from '../translations';
import { UserProfile, Currency } from '../types';
import {
  Wallet,
  Target,
  Calculator,
  BookOpen,
  MessageSquare,
  Globe,
  HelpCircle,
  Coins,
  Flame,
  Award,
  Sliders,
  Play,
  RotateCcw,
  Menu,
  X,
} from 'lucide-react';

interface NavbarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  user: UserProfile;
  setUser: React.Dispatch<React.SetStateAction<UserProfile>>;
  onOpenAbout: () => void;
  onOpenLearningProfile: () => void;
  onActivateDemo: () => void;
  onResetDemo: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  setCurrentTab,
  user,
  setUser,
  onOpenAbout,
  onOpenLearningProfile,
  onActivateDemo,
  onResetDemo,
}) => {
  const t = translations[user.language];
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [demoMenuOpen, setDemoMenuOpen] = useState(false);

  const toggleLanguage = () => {
    setUser(prev => ({
      ...prev,
      language: prev.language === 'ka' ? 'en' : 'ka',
    }));
  };

  const cycleCurrency = () => {
    const list: Currency[] = ['GEL', 'USD', 'EUR'];
    const nextIdx = (list.indexOf(user.currency) + 1) % list.length;
    setUser(prev => ({
      ...prev,
      currency: list[nextIdx],
    }));
  };

  const navItems = [
    { id: 'overview', label: t.navOverview, icon: Wallet },
    { id: 'goals', label: t.navGoals, icon: Target },
    { id: 'calculator', label: t.navCalculator, icon: Calculator },
    { id: 'learn', label: t.navLearn, icon: BookOpen },
    { id: 'advisor', label: t.navAdvisor, icon: MessageSquare },
  ];

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-slate-200 shadow-xs">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-18">
          {/* Logo & Platform Name */}
          <div className="flex items-center space-x-3">
            <div
              onClick={() => setCurrentTab('overview')}
              className="flex items-center space-x-3 cursor-pointer group select-none"
            >
              <div className="w-10 h-10 rounded-xl bg-[#1F64FF] flex items-center justify-center text-white shadow-xs group-hover:bg-blue-700 transition-colors">
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                  <path
                    d="M12 2L2 12L12 22L22 12L12 2Z"
                    fill="currentColor"
                    fillOpacity="0.15"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M12 7V17M12 7L8 11M12 7L16 11"
                    stroke="white"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-xl font-black tracking-tight text-slate-900">
                    AGNO
                  </span>
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-[#1F64FF] border border-blue-200/60">
                    FINEDU
                  </span>
                  {user.isDemoMode && (
                    <span className="hidden sm:inline-block text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
                      დემო რეჟიმი
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500 font-medium hidden sm:block">
                  {t.brandTagline}
                </p>
              </div>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1" aria-label="მთავარი ნავიგაცია">
            {navItems.map(item => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentTab(item.id)}
                  className={`px-3 py-2 rounded-xl text-sm font-semibold transition-all flex items-center space-x-1.5 focus:outline-none focus:ring-2 focus:ring-[#1F64FF] ${
                    isActive
                      ? 'bg-blue-50 text-[#1F64FF] shadow-2xs font-bold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-[#1F64FF]' : 'text-slate-500'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right utility controls */}
          <div className="flex items-center space-x-1.5 sm:space-x-2">
            {/* Compact Streak & XP pill */}
            <button
              onClick={() => setCurrentTab('learn')}
              className="hidden sm:flex items-center space-x-2 px-2.5 py-1.5 rounded-lg bg-slate-50 hover:bg-blue-50/60 border border-slate-200 text-xs font-bold transition-colors"
              title="სასწავლო პროგრესი"
            >
              <span className="flex items-center text-amber-600">
                <Flame className="w-3.5 h-3.5 mr-1 fill-amber-500 text-amber-500" />
                {user.streak} დღე
              </span>
              <span className="text-slate-300">|</span>
              <span className="flex items-center text-[#1F64FF]">
                <Award className="w-3.5 h-3.5 mr-1" />
                {user.xp} XP
              </span>
            </button>

            {/* Learning Profile button */}
            <button
              onClick={onOpenLearningProfile}
              className="px-2.5 py-1.5 text-xs font-bold rounded-lg bg-purple-50 hover:bg-purple-100 text-purple-800 border border-purple-200 transition-colors flex items-center space-x-1"
              title="ჩემი სასწავლო პროფილი"
              aria-label="ჩემი სასწავლო პროფილი"
            >
              <Sliders className="w-3.5 h-3.5 text-purple-600" />
              <span className="hidden md:inline">პროფილი</span>
            </button>

            {/* Currency switcher */}
            <button
              onClick={cycleCurrency}
              className="px-2.5 py-1.5 text-xs font-bold rounded-lg bg-slate-100 hover:bg-slate-200/80 text-slate-700 transition-colors flex items-center space-x-1"
              title="ვალუტის შეცვლა"
              aria-label="ვალუტის შეცვლა"
            >
              <Coins className="w-3.5 h-3.5 text-emerald-600" />
              <span>{user.currency}</span>
            </button>

            {/* Language Switcher */}
            <button
              onClick={toggleLanguage}
              className="px-2.5 py-1.5 text-xs font-bold rounded-lg bg-slate-100 hover:bg-slate-200/80 text-slate-700 transition-colors flex items-center space-x-1"
              title="ენის შეცვლა"
              aria-label="ენის შეცვლა"
            >
              <Globe className="w-3.5 h-3.5 text-[#1F64FF]" />
              <span>{user.language === 'ka' ? 'EN' : 'KA'}</span>
            </button>

            {/* Help & Presentation Demo Menu */}
            <div className="relative">
              <button
                onClick={() => setDemoMenuOpen(prev => !prev)}
                className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors border border-transparent hover:border-slate-200"
                title="პრეზენტაციის დემო და ინფორმაცია"
                aria-label="პრეზენტაციის დემო და ინფორმაცია"
              >
                <HelpCircle className="w-4 h-4" />
              </button>

              {demoMenuOpen && (
                <div className="absolute right-0 mt-2 w-60 bg-white rounded-xl shadow-lg border border-slate-200 py-2 z-50">
                  <div className="px-3 py-1.5 border-b border-slate-100 flex items-center justify-between">
                    <span className="text-[11px] font-bold text-slate-500 uppercase">
                      პრეზენტაცია და პროტოტიპი
                    </span>
                    {user.isDemoMode && (
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-100 text-amber-800">
                        დემო
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => {
                      onActivateDemo();
                      setDemoMenuOpen(false);
                    }}
                    className="w-full text-left px-3.5 py-2 text-xs font-bold text-purple-700 hover:bg-purple-50 flex items-center space-x-2"
                  >
                    <Play className="w-3.5 h-3.5" />
                    <span>პრეზენტაციის დემო</span>
                  </button>
                  <button
                    onClick={() => {
                      onResetDemo();
                      setDemoMenuOpen(false);
                    }}
                    className="w-full text-left px-3.5 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 flex items-center space-x-2"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>დემოს განულება</span>
                  </button>
                  <div className="border-t border-slate-100 my-1" />
                  <button
                    onClick={() => {
                      onOpenLearningProfile();
                      setDemoMenuOpen(false);
                    }}
                    className="w-full text-left px-3.5 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 flex items-center space-x-2"
                  >
                    <Sliders className="w-3.5 h-3.5 text-[#1F64FF]" />
                    <span>ჩემი სასწავლო პროფილი</span>
                  </button>
                  <button
                    onClick={() => {
                      onOpenAbout();
                      setDemoMenuOpen(false);
                    }}
                    className="w-full text-left px-3.5 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 flex items-center space-x-2"
                  >
                    <HelpCircle className="w-3.5 h-3.5 text-slate-500" />
                    <span>{t.navAbout}</span>
                  </button>
                </div>
              )}
            </div>

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(prev => !prev)}
              className="lg:hidden p-2 rounded-lg text-slate-700 hover:bg-slate-100"
              aria-label="მენიუს გახსნა"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Collapsible Mobile Navigation Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-3 border-t border-slate-100 space-y-2">
            <div className="grid grid-cols-2 gap-1.5">
              {navItems.map(item => {
                const Icon = item.icon;
                const isActive = currentTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setCurrentTab(item.id);
                      setMobileMenuOpen(false);
                    }}
                    className={`px-3 py-2.5 rounded-xl text-xs font-bold flex items-center space-x-2 ${
                      isActive
                        ? 'bg-[#1F64FF] text-white shadow-xs'
                        : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
              <div className="flex items-center space-x-3 font-bold text-slate-700">
                <span className="flex items-center text-amber-600">
                  <Flame className="w-3.5 h-3.5 mr-1 fill-amber-500" />
                  {user.streak} დღე
                </span>
                <span className="flex items-center text-[#1F64FF]">
                  <Award className="w-3.5 h-3.5 mr-1" />
                  {user.xp} XP
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => {
                    onActivateDemo();
                    setMobileMenuOpen(false);
                  }}
                  className="px-2.5 py-1 rounded-lg bg-purple-50 text-purple-700 font-bold text-[11px]"
                >
                  პრეზენტაციის დემო
                </button>
                <button
                  onClick={() => {
                    onResetDemo();
                    setMobileMenuOpen(false);
                  }}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-600 font-bold text-[11px]"
                >
                  დემოს განულება
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
