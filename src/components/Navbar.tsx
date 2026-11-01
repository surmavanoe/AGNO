import React from 'react';
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
  Coins
} from 'lucide-react';

interface NavbarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  user: UserProfile;
  setUser: React.Dispatch<React.SetStateAction<UserProfile>>;
  onOpenAbout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  setCurrentTab,
  user,
  setUser,
  onOpenAbout,
}) => {
  const t = translations[user.language];

  const toggleLanguage = () => {
    setUser(prev => ({
      ...prev,
      language: prev.language === 'ka' ? 'en' : 'ka'
    }));
  };

  const cycleCurrency = () => {
    const list: Currency[] = ['GEL', 'USD', 'EUR'];
    const nextIdx = (list.indexOf(user.currency) + 1) % list.length;
    setUser(prev => ({
      ...prev,
      currency: list[nextIdx]
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
          <div 
            onClick={() => setCurrentTab('overview')} 
            className="flex items-center space-x-3 cursor-pointer group select-none"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-xs group-hover:bg-blue-700 transition-colors">
              {/* Clean geometric diamond with upward arrow */}
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2L2 12L12 22L22 12L12 2Z" fill="currentColor" fillOpacity="0.15" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
                <path d="M12 7V17M12 7L8 11M12 7L16 11" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xl font-black tracking-tight text-slate-900">
                  AGNO
                </span>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200/60">
                  FINEDU
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium hidden sm:block">
                {t.brandTagline}
              </p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navItems.map(item => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentTab(item.id)}
                  className={`px-3.5 py-2 rounded-xl text-sm font-semibold transition-all flex items-center space-x-2 ${
                    isActive
                      ? 'bg-blue-50 text-blue-700 shadow-2xs font-bold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-blue-600' : 'text-slate-500'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right utility buttons: Language, Currency, Info */}
          <div className="flex items-center space-x-2">
            {/* Currency switcher */}
            <button
              onClick={cycleCurrency}
              className="px-2.5 py-1.5 text-xs font-bold rounded-lg bg-slate-100 hover:bg-slate-200/80 text-slate-700 transition-colors flex items-center space-x-1"
              title="Change Currency"
            >
              <Coins className="w-3.5 h-3.5 text-emerald-600" />
              <span>{user.currency}</span>
            </button>

            {/* Language Switcher */}
            <button
              onClick={toggleLanguage}
              className="px-3 py-1.5 text-xs font-bold rounded-lg bg-slate-100 hover:bg-slate-200/80 text-slate-700 transition-colors flex items-center space-x-1.5"
              title="Switch Language"
            >
              <Globe className="w-3.5 h-3.5 text-blue-600" />
              <span>{user.language === 'ka' ? 'English' : 'ქართული'}</span>
            </button>

            {/* About Modal button */}
            <button
              onClick={onOpenAbout}
              className="p-2 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
              title={t.navAbout}
            >
              <HelpCircle className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Mobile Navigation Bar */}
        <div className="flex md:hidden overflow-x-auto py-2.5 border-t border-slate-100 space-x-1.5 scrollbar-none">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentTab(item.id)}
                className={`px-3 py-2 rounded-lg text-xs font-semibold whitespace-nowrap flex items-center space-x-1.5 ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

      </div>
    </header>
  );
};
