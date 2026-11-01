import React, { useState, useRef, useEffect } from 'react';
import {
  UserProfile,
  BudgetData,
  FinancialGoal,
  ChatMessage,
  ExplanationMode,
} from '../types';
import { translations, currencySymbols } from '../translations';
import {
  Send,
  Bot,
  User,
  RotateCcw,
  Copy,
  Check,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Info,
} from 'lucide-react';

interface AiAdvisorProps {
  user: UserProfile;
  budget: BudgetData;
  goals: FinancialGoal[];
  initialPrompt?: string;
  onClearInitialPrompt?: () => void;
}

const STARTER_QUESTION_CHIPS = [
  'როგორ მოქმედებს ინფლაცია ჩემს დანაზოგზე?',
  'რა განსხვავებაა დეპოზიტსა და ობლიგაციას შორის?',
  'როგორ დავგეგმო საგანგებო ფონდი?',
  'რას ნიშნავს დივერსიფიკაცია?',
  'ამიხსენი რთული პროცენტი მარტივად',
];

const EXPLANATION_MODES: ExplanationMode[] = [
  'მარტივად',
  'დეტალურად',
  'მაგალითით',
];

export const AiAdvisor: React.FC<AiAdvisorProps> = ({
  user,
  budget,
  goals,
  initialPrompt,
  onClearInitialPrompt,
}) => {
  const t = translations[user.language];
  const curr = currencySymbols[user.currency] || '₾';

  const [explanationMode, setExplanationMode] =
    useState<ExplanationMode>('მარტივად');
  const [expandedMetaId, setExpandedMetaId] = useState<string | null>(
    'msg-start'
  );

  const primaryGoalName =
    user.learningProfile?.primaryGoal || 'საგანგებო ფონდი';

  const defaultGreeting = `გამარჯობა ${user.name}! მე ვარ **AGNO AI დამხმარე**. 
შეგიძლიათ დამისვათ ნებისმიერი ფინანსური შეკითხვა ან აირჩიოთ ახსნის სასურველი რეჟიმი (**მარტივად**, **დეტალურად**, **მაგალითით**). მე ვუპასუხებ თქვენი ცოდნის დონის (${user.knowledgeLevel}) და მიზნის (${primaryGoalName}) გათვალისწინებით.`;

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-start',
      sender: 'model',
      text: defaultGreeting,
      timestamp: new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      }),
      meta: {
        level: user.knowledgeLevel,
        mode: 'მარტივად',
        goal: primaryGoalName,
        source: 'Gemini-ის ზოგადი ცოდნა — RAG ჯერ არ არის დაკავშირებული',
      },
    },
  ]);

  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  useEffect(() => {
    if (initialPrompt && initialPrompt.trim()) {
      handleSend(initialPrompt);
      if (onClearInitialPrompt) onClearInitialPrompt();
    }
  }, [initialPrompt]);

  const handleSend = async (textToSend?: string) => {
    const text = (textToSend || input).trim();
    if (!text || isLoading) return;

    const currentMode = explanationMode;
    const currentLevel = user.knowledgeLevel;
    const currentGoal = user.learningProfile?.primaryGoal || 'საგანგებო ფონდი';

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      }),
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/advisor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          userContext: {
            knowledgeLevel: currentLevel,
            language: user.language,
            monthlyIncome: budget.income,
            monthlySavings: Math.max(
              0,
              budget.income -
                budget.fixedExpenses -
                budget.discretionaryExpenses
            ),
            riskTolerance: user.riskTolerance,
            goals: goals.map(g => ({
              title: g.title,
              target: g.targetAmount,
              current: g.currentAmount,
            })),
            currency: curr,
            explanationMode: currentMode,
            primaryGoal: currentGoal,
            interests: user.learningProfile?.interests || [],
          },
          history: messages.slice(-4),
        }),
      });

      if (!response.ok) throw new Error('Advisor request failed');
      const data = await response.json();

      const newMsgId = `ai-${Date.now()}`;
      const aiMsg: ChatMessage = {
        id: newMsgId,
        sender: 'model',
        text: data.text,
        timestamp: new Date().toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        }),
        meta: {
          level: currentLevel,
          mode: currentMode,
          goal: currentGoal,
          source: 'Gemini-ის ზოგადი ცოდნა — RAG ჯერ არ არის დაკავშირებული',
        },
      };
      setMessages(prev => [...prev, aiMsg]);
      setExpandedMetaId(newMsgId);
    } catch {
      const fallbackId = `ai-${Date.now()}`;
      const fallbackMsg: ChatMessage = {
        id: fallbackId,
        sender: 'model',
        text: 'ბოდიშს გიხდით, დაფიქსირდა კავშირის შეფერხება. გთხოვთ სცადოთ ხელახლა.',
        timestamp: new Date().toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        }),
        meta: {
          level: currentLevel,
          mode: currentMode,
          goal: currentGoal,
          source: 'Gemini-ის ზოგადი ცოდნა — RAG ჯერ არ არის დაკავშირებული',
        },
      };
      setMessages(prev => [...prev, fallbackMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-5">
      {/* Header with "AGNO AI დამხმარე" & "Gemini-powered demo" tag */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2.5">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center space-x-3">
              <Bot className="w-8 h-8 text-[#1F64FF]" />
              <span>AGNO AI დამხმარე</span>
            </h1>
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-purple-50 text-purple-800 border border-purple-200 flex items-center space-x-1">
              <Sparkles className="w-3.5 h-3.5 text-purple-600" />
              <span>Gemini-powered demo</span>
            </span>
          </div>
          <p className="text-sm sm:text-base text-slate-600 mt-1">
            საგანმანათლებლო ფინანსური ასისტენტი მორგებული თქვენს ცოდნის დონესა და მიზნებზე.
          </p>
        </div>

        <button
          onClick={() =>
            setMessages([
              {
                id: 'reset',
                sender: 'model',
                text: defaultGreeting,
                timestamp: '',
                meta: {
                  level: user.knowledgeLevel,
                  mode: explanationMode,
                  goal: primaryGoalName,
                  source:
                    'Gemini-ის ზოგადი ცოდნა — RAG ჯერ არ არის დაკავშირებული',
                },
              },
            ])
          }
          className="p-2.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-600 hover:text-slate-900 self-start sm:self-auto transition-colors"
          title="საუბრის გასუფთავება"
          aria-label="საუბრის გასუფთავება"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* Explanation Mode Selector + Starter Question Chips (Section 8) */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-5 shadow-xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold text-slate-600">
              ახსნის რეჟიმი:
            </span>
            {EXPLANATION_MODES.map(mode => {
              const isSelected = explanationMode === mode;
              return (
                <button
                  key={mode}
                  type="button"
                  onClick={() => setExplanationMode(mode)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    isSelected
                      ? 'bg-[#1F64FF] text-white shadow-2xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {mode}
                </button>
              );
            })}
          </div>

          <div className="text-xs text-slate-500 font-semibold">
            აქტიური დონე:{' '}
            <strong className="text-slate-800">{user.knowledgeLevel}</strong> •
            მიზანი: <strong className="text-[#1F64FF]">{primaryGoalName}</strong>
          </div>
        </div>

        {/* Starter Question Chips */}
        <div>
          <span className="text-xs font-bold text-slate-500 block mb-2">
            სწრაფი კითხვები დასაწყებად:
          </span>
          <div className="flex flex-wrap gap-2">
            {STARTER_QUESTION_CHIPS.map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(q)}
                disabled={isLoading}
                className="px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 hover:border-[#1F64FF] hover:bg-blue-50/60 text-xs font-bold text-slate-700 hover:text-[#1F64FF] transition-all text-left"
              >
                💬 {q}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Chat Container */}
      <div className="bg-white border border-slate-200/90 rounded-2xl shadow-xs flex flex-col h-[560px] overflow-hidden">
        {/* Messages scroll area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-slate-50/40">
          {messages.map(msg => {
            const isAi = msg.sender === 'model';
            const isMetaOpen = expandedMetaId === msg.id;
            const meta = msg.meta || {
              level: user.knowledgeLevel,
              mode: explanationMode,
              goal: primaryGoalName,
              source:
                'Gemini-ის ზოგადი ცოდნა — RAG ჯერ არ არის დაკავშირებული',
            };

            return (
              <div
                key={msg.id}
                className={`flex items-start space-x-3 ${
                  isAi ? '' : 'flex-row-reverse space-x-reverse'
                }`}
              >
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                    isAi
                      ? 'bg-[#1F64FF] text-white shadow-xs'
                      : 'bg-slate-800 text-white'
                  }`}
                >
                  {isAi ? (
                    <Bot className="w-5 h-5" />
                  ) : (
                    <User className="w-5 h-5" />
                  )}
                </div>

                <div
                  className={`max-w-[85%] rounded-2xl p-4 text-sm sm:text-base leading-relaxed ${
                    isAi
                      ? 'bg-white border border-slate-200/90 text-slate-800 shadow-2xs'
                      : 'bg-[#1F64FF] text-white font-medium shadow-xs'
                  }`}
                >
                  <div className="whitespace-pre-line">{msg.text}</div>

                  {isAi && (
                    <div className="mt-3 pt-2.5 border-t border-slate-100 space-y-2">
                      <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-500">
                        <button
                          type="button"
                          onClick={() =>
                            setExpandedMetaId(prev =>
                              prev === msg.id ? null : msg.id
                            )
                          }
                          className="font-bold text-[#1F64FF] hover:underline flex items-center space-x-1"
                        >
                          <Info className="w-3.5 h-3.5" />
                          <span>როგორ შეიქმნა ეს პასუხი?</span>
                          {isMetaOpen ? (
                            <ChevronUp className="w-3.5 h-3.5" />
                          ) : (
                            <ChevronDown className="w-3.5 h-3.5" />
                          )}
                        </button>

                        <div className="flex items-center space-x-3">
                          <span>{msg.timestamp}</span>
                          <button
                            onClick={() => handleCopy(msg.text, msg.id)}
                            className="hover:text-slate-800 flex items-center space-x-1 font-semibold"
                          >
                            {copiedId === msg.id ? (
                              <>
                                <Check className="w-3.5 h-3.5 text-emerald-600" />
                                <span className="text-emerald-700 font-bold">
                                  დაკოპირდა
                                </span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3.5 h-3.5" />
                                <span>კოპირება</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>

                      {/* Expandable Panel: "როგორ შეიქმნა ეს პასუხი?" (Section 8) */}
                      {isMetaOpen && (
                        <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 space-y-1">
                          <div>
                            • <strong>გამოყენებული დონე:</strong> {meta.level}
                          </div>
                          <div>
                            • <strong>ახსნის რეჟიმი:</strong> {meta.mode}
                          </div>
                          <div>
                            • <strong>მომხმარებლის მიზანი:</strong> {meta.goal}
                          </div>
                          <div>
                            • <strong>მონაცემის წყარო:</strong> „{meta.source}“
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {isLoading && (
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-xl bg-[#1F64FF] text-white flex items-center justify-center">
                <Bot className="w-5 h-5 animate-pulse" />
              </div>
              <div className="bg-white border border-slate-200 rounded-2xl px-4 py-3 text-xs sm:text-sm text-slate-600 shadow-2xs flex items-center space-x-2">
                <div className="w-2 h-2 rounded-full bg-[#1F64FF] animate-bounce" />
                <span>
                  AGNO AI ამზადებს პასუხს ({explanationMode}, {user.knowledgeLevel})...
                </span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Mandatory Disclaimer Above Chat Input + Form (Section 8) */}
        <div className="p-3 sm:p-4 bg-white border-t border-slate-200 space-y-2.5">
          <div className="text-[11px] sm:text-xs font-semibold text-slate-600 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200/80 flex items-center space-x-1.5">
            <Info className="w-3.5 h-3.5 text-[#1F64FF] shrink-0" />
            <span>
              AGNO AI გაძლევს საგანმანათლებლო განმარტებებს და არა პერსონალურ საინვესტიციო რეკომენდაციებს.
            </span>
          </div>

          <form
            onSubmit={e => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center space-x-2"
          >
            <input
              type="text"
              placeholder={t.advisorInputPlaceholder}
              value={input}
              onChange={e => setInput(e.target.value)}
              disabled={isLoading}
              className="flex-1 bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-sm sm:text-base text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#1F64FF]"
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="px-5 py-3 rounded-xl bg-[#1F64FF] hover:bg-blue-700 disabled:opacity-50 text-white font-bold text-sm sm:text-base flex items-center space-x-2 shadow-xs transition-colors shrink-0"
            >
              <span>{t.sendText}</span>
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
