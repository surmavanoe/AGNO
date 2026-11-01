import React, { useState } from 'react';
import { UserProfile, Lesson, KnowledgeLevel } from '../types';
import { initialLessons } from '../data/lessons';
import { translations } from '../translations';
import { 
  BookOpen, 
  CheckCircle2, 
  Clock, 
  ArrowRight, 
  Calculator, 
  X,
  HelpCircle,
  Sparkles
} from 'lucide-react';

interface FineduAcademyProps {
  user: UserProfile;
  setUser: React.Dispatch<React.SetStateAction<UserProfile>>;
  onOpenCalculator: (calcId: string) => void;
}

export const FineduAcademy: React.FC<FineduAcademyProps> = ({
  user,
  setUser,
  onOpenCalculator,
}) => {
  const t = translations[user.language];
  const isKa = user.language === 'ka';

  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);
  const [isQuizMode, setIsQuizMode] = useState(false);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const handleOpenLesson = (lesson: Lesson) => {
    setActiveLesson(lesson);
    setIsQuizMode(false);
    setSelectedOption(null);
    setHasSubmitted(false);
  };

  const handleCheckAnswer = () => {
    if (selectedOption === null || !activeLesson) return;
    setHasSubmitted(true);

    const isCorrect = selectedOption === activeLesson.quiz.correctIndex;
    if (isCorrect && !user.completedLessons.includes(activeLesson.id)) {
      setUser(prev => ({
        ...prev,
        xp: prev.xp + 50,
        completedLessons: [...prev.completedLessons, activeLesson.id],
      }));
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Title */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center space-x-3">
          <BookOpen className="w-8 h-8 text-blue-600" />
          <span>{t.learnTitle}</span>
        </h1>
        <p className="text-sm sm:text-base text-slate-600 mt-1">
          {t.learnSubtitle}
        </p>
      </div>

      {/* Clean Lesson Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {initialLessons.map(lesson => {
          const isDone = user.completedLessons.includes(lesson.id);
          const title = isKa ? lesson.titleKa : lesson.titleEn;
          const summary = isKa ? lesson.summaryKa : lesson.summaryEn;

          return (
            <div 
              key={lesson.id}
              className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs flex flex-col justify-between hover:border-slate-300 transition-all"
            >
              <div>
                <div className="flex items-center justify-between mb-3 text-xs">
                  <span className="flex items-center text-slate-500 font-semibold">
                    <Clock className="w-3.5 h-3.5 mr-1 text-slate-400" />
                    {lesson.readTimeMinutes} {isKa ? 'წუთი' : 'min'}
                  </span>

                  {isDone ? (
                    <span className="flex items-center space-x-1 text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full font-bold">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{t.completedTag}</span>
                    </span>
                  ) : (
                    <span className="text-blue-600 font-bold bg-blue-50 px-2.5 py-0.5 rounded-full">
                      {lesson.level}
                    </span>
                  )}
                </div>

                <h3 className="text-lg font-black text-slate-900 mb-2 leading-snug">
                  {title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 line-clamp-3 leading-relaxed mb-4">
                  {summary}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100">
                <button
                  onClick={() => handleOpenLesson(lesson)}
                  className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm flex items-center justify-center space-x-1.5 shadow-xs transition-colors"
                >
                  <span>{isDone ? (isKa ? 'თავიდან წაკითხვა' : 'Read Again') : (isKa ? 'გაკვეთილის წაკითხვა' : 'Read Lesson')}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Reader Modal */}
      {activeLesson && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-white rounded-2xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto shadow-xl">
            <button
              onClick={() => setActiveLesson(null)}
              className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-800 rounded-lg hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="mb-6">
              <span className="text-xs font-bold text-blue-600 uppercase tracking-wider block mb-1">
                FINEDU • {activeLesson.readTimeMinutes} {isKa ? 'წუთიანი საკითხავი' : 'minute read'}
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                {isKa ? activeLesson.titleKa : activeLesson.titleEn}
              </h2>
            </div>

            {!isQuizMode ? (
              <div className="space-y-6">
                <div className="prose prose-slate max-w-none text-sm sm:text-base text-slate-700 leading-relaxed whitespace-pre-line bg-slate-50 p-6 rounded-2xl border border-slate-200/80">
                  {isKa ? activeLesson.contentKa : activeLesson.contentEn}
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                  <button
                    onClick={() => setActiveLesson(null)}
                    className="text-xs font-bold text-slate-500 hover:text-slate-800"
                  >
                    {t.closeBtn}
                  </button>

                  <button
                    onClick={() => setIsQuizMode(true)}
                    className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm flex items-center space-x-2 shadow-xs transition-colors"
                  >
                    <HelpCircle className="w-4 h-4" />
                    <span>{t.takeSimpleQuiz}</span>
                  </button>
                </div>
              </div>
            ) : (
              /* Simple Quiz Mode */
              <div className="space-y-6">
                <div className="p-4 rounded-xl bg-blue-50 border border-blue-200">
                  <span className="text-xs font-bold text-blue-700 block mb-1">
                    {isKa ? 'შემოწმების მარტივი კითხვა:' : 'Quick Knowledge Check:'}
                  </span>
                  <p className="text-base font-bold text-slate-900">
                    {isKa ? activeLesson.quiz.questionKa : activeLesson.quiz.questionEn}
                  </p>
                </div>

                <div className="space-y-2.5">
                  {(isKa ? activeLesson.quiz.optionsKa : activeLesson.quiz.optionsEn).map((opt, idx) => {
                    const isSelected = selectedOption === idx;
                    const isCorrect = idx === activeLesson.quiz.correctIndex;
                    let style = 'bg-white border-slate-200 hover:border-slate-300 text-slate-700';

                    if (hasSubmitted) {
                      if (isCorrect) style = 'bg-emerald-50 border-emerald-500 text-emerald-900 font-bold';
                      else if (isSelected) style = 'bg-rose-50 border-rose-500 text-rose-900';
                    } else if (isSelected) {
                      style = 'bg-blue-50 border-blue-600 text-blue-900 font-bold ring-2 ring-blue-500/20';
                    }

                    return (
                      <button
                        key={idx}
                        disabled={hasSubmitted}
                        onClick={() => setSelectedOption(idx)}
                        className={`w-full text-left p-4 rounded-xl border text-sm transition-all flex items-start space-x-3 ${style}`}
                      >
                        <span className="w-6 h-6 rounded-full border border-slate-300 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                          {String.fromCharCode(65 + idx)}
                        </span>
                        <span className="leading-snug">{opt}</span>
                      </button>
                    );
                  })}
                </div>

                {hasSubmitted && (
                  <div className={`p-4 rounded-xl border text-xs sm:text-sm leading-relaxed ${
                    selectedOption === activeLesson.quiz.correctIndex
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                      : 'bg-rose-50 border-rose-200 text-rose-900'
                  }`}>
                    <p className="font-bold mb-1">
                      {selectedOption === activeLesson.quiz.correctIndex
                        ? (isKa ? '✓ სწორია! ყოჩაღ!' : '✓ Correct! Well done!')
                        : (isKa ? 'არ არის სწორი. განმარტება:' : 'Incorrect. Here is why:')}
                    </p>
                    <p>{isKa ? activeLesson.quiz.explanationKa : activeLesson.quiz.explanationEn}</p>
                  </div>
                )}

                <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                  <button
                    onClick={() => setIsQuizMode(false)}
                    className="text-xs font-bold text-slate-500 hover:text-slate-800"
                  >
                    {isKa ? 'მასალაზე დაბრუნება' : 'Back to Reading'}
                  </button>

                  {!hasSubmitted ? (
                    <button
                      onClick={handleCheckAnswer}
                      disabled={selectedOption === null}
                      className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold text-sm shadow-xs transition-colors"
                    >
                      {isKa ? 'პასუხის შემოწმება' : 'Check Answer'}
                    </button>
                  ) : (
                    <button
                      onClick={() => setActiveLesson(null)}
                      className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-xs transition-colors"
                    >
                      {t.closeBtn}
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
};
