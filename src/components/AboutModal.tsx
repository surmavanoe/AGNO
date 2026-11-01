import React from 'react';
import { UserProfile } from '../types';
import { translations } from '../translations';
import { 
  X, 
  Users, 
  BookOpen, 
  Sparkles, 
  Cpu, 
  Target, 
  ShieldAlert, 
  CheckCircle2 
} from 'lucide-react';

interface AboutModalProps {
  user: UserProfile;
  isOpen: boolean;
  onClose: () => void;
}

export const AboutModal: React.FC<AboutModalProps> = ({
  user,
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  const isKa = user.language === 'ka';

  const team = [
    {
      name: isKa ? 'ნოე სურმავა' : 'Noe Surmava',
      role: isKa ? 'AI და გაყიდვები' : 'AI & Sales Strategy',
      initials: 'NS',
    },
    {
      name: isKa ? 'გიორგი ღვინჯილია' : 'Giorgi Gvinjilia',
      role: isKa ? 'პროდუქტი და ფინანსები' : 'Product & Finance',
      initials: 'GG',
    },
    {
      name: isKa ? 'ოთარ კანტიძე' : 'Otar Kantidze',
      role: isKa ? 'მთავარი პროგრამისტი' : 'Lead Engineer',
      initials: 'OK',
    },
    {
      name: isKa ? 'არჩილ კენკიშვილი' : 'Archil Kenkishvili',
      role: isKa ? 'კრეატიული დირექტორი' : 'Creative Director',
      initials: 'AK',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto shadow-xl space-y-6">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-800 rounded-lg hover:bg-slate-100"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Brand Header */}
        <div className="flex items-center space-x-3 border-b border-slate-100 pb-5">
          <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center text-white font-black shadow-xs">
            <svg className="w-7 h-7" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2L2 12L12 22L22 12L12 2Z" fill="currentColor" fillOpacity="0.15" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
              <path d="M12 7V17M12 7L8 11M12 7L16 11" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              AGNO FINEDU
            </h2>
            <p className="text-xs sm:text-sm text-blue-600 font-semibold">
              {isKa ? 'სწავლა + მოქმედება • ფინანსური განათლების პლატფორმა' : 'Learn + Act • Financial Education & Intelligence'}
            </p>
          </div>
        </div>

        {/* The Core Mission & Problem */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
            <span className="text-xs font-bold text-amber-700 block mb-1">
              {isKa ? 'პრობლემა: უმოქმედო კაპიტალი' : 'The Challenge: Idle Cash'}
            </span>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
              {isKa
                ? 'OECD-ის კვლევით, საქართველოში მოსახლეობის 57% დანაზოგს სახლში ნაღდი ფულით ინახავს, რაც ინფლაციის გამო ყოველწლიურად უფასურდება.'
                : 'According to OECD research, 57% of adults in Georgia store savings in physical cash at home, losing value every year to inflation.'}
            </p>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
            <span className="text-xs font-bold text-blue-700 block mb-1">
              {isKa ? 'გამოსავალი: AGNO' : 'The Solution: AGNO'}
            </span>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
              {isKa
                ? 'ერთიანი მარტივი სივრცე: მოკლე 3-წუთიანი გაკვეთილები, ინტერაქციული კალკულატორები და პერსონალიზებული AI ასისტენტი.'
                : 'A calm, unified hub: 3-minute lessons, visual simulators, and an approachable AI assistant that adapts to your level.'}
            </p>
          </div>
        </div>

        {/* 3 Pillars */}
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
            {isKa ? 'პლატფორმის 3 მთავარი პრინციპი:' : '3 Guiding Principles:'}
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-4 rounded-xl border border-slate-200 bg-white">
              <BookOpen className="w-5 h-5 text-blue-600 mb-2" />
              <h4 className="text-sm font-bold text-slate-900 mb-1">
                {isKa ? '1. სწავლა + მოქმედება' : '1. Learn + Act'}
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                {isKa ? 'ისწავლით ცნებას და მაშინვე ითვლით კალკულატორში.' : 'Grasp a concept and immediately test your own numbers.'}
              </p>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 bg-white">
              <Sparkles className="w-5 h-5 text-amber-600 mb-2" />
              <h4 className="text-sm font-bold text-slate-900 mb-1">
                {isKa ? '2. პირადი მრჩეველი' : '2. Personal Guide'}
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                {isKa ? 'პასუხები მორგებულია თქვენს პირად ბიუჯეტზე.' : 'Guidance adapted specifically to your goals and pace.'}
              </p>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 bg-white">
              <Cpu className="w-5 h-5 text-emerald-600 mb-2" />
              <h4 className="text-sm font-bold text-slate-900 mb-1">
                {isKa ? '3. ჰიბრიდული AI' : '3. Hybrid AI'}
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                {isKa ? 'მარტივი და გასაგები ახსნა ნებისმიერი ასაკისთვის.' : 'Clear, transparent explanations with zero confusing jargon.'}
              </p>
            </div>
          </div>
        </div>

        {/* Founding Team (from slide 9) */}
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center">
            <Users className="w-4 h-4 mr-1.5 text-blue-600" />
            {isKa ? 'AGNO-ს გუნდი:' : 'Founding Team:'}
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {team.map((m, idx) => (
              <div key={idx} className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/70 text-center">
                <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 font-black text-xs flex items-center justify-center mx-auto mb-2">
                  {m.initials}
                </div>
                <h4 className="text-xs font-bold text-slate-900">{m.name}</h4>
                <p className="text-[11px] text-slate-500 mt-0.5">{m.role}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs"
          >
            {isKa ? 'დახურვა' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
};
