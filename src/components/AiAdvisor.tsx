import React, { useState, useRef, useEffect } from 'react';
import { UserProfile, BudgetData, FinancialGoal, ChatMessage } from '../types';
import { translations, currencySymbols } from '../translations';
import { 
  Send, 
  Bot, 
  User, 
  HelpCircle, 
  RotateCcw, 
  Copy, 
  Check, 
  Sparkles 
} from 'lucide-react';

interface AiAdvisorProps {
  user: UserProfile;
  budget: BudgetData;
  goals: FinancialGoal[];
  initialPrompt?: string;
  onClearInitialPrompt?: () => void;
}

export const AiAdvisor: React.FC<AiAdvisorProps> = ({
  user,
  budget,
  goals,
  initialPrompt,
  onClearInitialPrompt,
}) => {
  const t = translations[user.language];
  const curr = currencySymbols[user.currency] || '₾';
  const isKa = user.language === 'ka';

  const defaultGreeting = isKa
    ? `გამარჯობა ${user.name}! მე ვარ თქვენი პირადი ფინანსური ასისტენტი AGNO-ში. 
შეგიძლიათ დამისვათ ნებისმიერი კითხვა ფულზე, ანაბრებზე, ინფლაციაზე ან თქვენს მიზნებზე. მე აგიხსნით ყველაფერს მარტივად და გასაგებად.`
    : `Hello ${user.name}! I am your AGNO Financial Helper.
Feel free to ask me anything about your savings, deposits, inflation, or how to reach your goals. I'll explain everything in simple, friendly terms.`;

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-start',
      sender: 'model',
      text: defaultGreeting,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }
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

  const quickQuestions = isKa ? [
    'სად ჯობია შევინახო დანაზოგი — ბანკში თუ სახლში?',
    'რა არის ინფლაცია და რატომ მაკლებს ფულს?',
    'როგორ მუშაობს დაგროვებითი პენსია (2+2+2)?',
    'რა განსხვავებაა ანაბარსა და აქციებს შორის?',
    'როგორ გადავანაწილო ჩემი თვიური დანაზოგი?',
  ] : [
    'Where is it safer to keep savings — bank or home?',
    'What is inflation and why does cash lose value?',
    'How does the 2+2+2 accumulative pension work?',
    'What is the difference between a deposit and stocks?',
    'How should I divide my monthly savings across my goals?',
  ];

  const handleSend = async (textToSend?: string) => {
    const text = (textToSend || input).trim();
    if (!text || isLoading) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
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
            knowledgeLevel: user.knowledgeLevel,
            language: user.language,
            monthlyIncome: budget.income,
            monthlySavings: Math.max(0, budget.income - budget.fixedExpenses - budget.discretionaryExpenses),
            riskTolerance: user.riskTolerance,
            goals: goals.map(g => ({ title: g.title, target: g.targetAmount, current: g.currentAmount })),
            currency: curr,
          },
          history: messages.slice(-4),
        }),
      });

      if (!response.ok) throw new Error('Advisor request failed');
      const data = await response.json();

      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'model',
        text: data.text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages(prev => [...prev, aiMsg]);
    } catch (err) {
      console.error(err);
      const fallbackMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'model',
        text: isKa
          ? 'ბოდიშს გიხდით, დაფიქსირდა შეცდომა. გთხოვთ სცადოთ ხელახლა.'
          : 'I encountered a connection error. Please try asking again.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
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
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center space-x-3">
            <Bot className="w-8 h-8 text-blue-600" />
            <span>{t.advisorTitle}</span>
          </h1>
          <p className="text-sm sm:text-base text-slate-600 mt-1">
            {t.advisorSubtitle}
          </p>
        </div>

        <button
          onClick={() => setMessages([{ id: 'reset', sender: 'model', text: defaultGreeting, timestamp: '' }])}
          className="p-2.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition-colors"
          title="Reset Chat"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* Suggested Quick Question Pills */}
      <div>
        <span className="text-xs font-bold text-slate-500 block mb-2">
          {t.quickQuestions}
        </span>
        <div className="flex flex-wrap gap-2">
          {quickQuestions.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(q)}
              disabled={isLoading}
              className="px-3.5 py-2 rounded-xl bg-white border border-slate-200 hover:border-blue-400 hover:bg-blue-50/60 text-xs font-semibold text-slate-700 transition-all text-left shadow-2xs"
            >
              💬 {q}
            </button>
          ))}
        </div>
      </div>

      {/* Chat Container */}
      <div className="bg-white border border-slate-200/90 rounded-2xl shadow-xs flex flex-col h-[560px] overflow-hidden">
        
        {/* Messages scroll area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-slate-50/40">
          {messages.map(msg => {
            const isAi = msg.sender === 'model';
            return (
              <div 
                key={msg.id}
                className={`flex items-start space-x-3 ${isAi ? '' : 'flex-row-reverse space-x-reverse'}`}
              >
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                  isAi ? 'bg-blue-600 text-white shadow-xs' : 'bg-slate-800 text-white'
                }`}>
                  {isAi ? <Bot className="w-5 h-5" /> : <User className="w-5 h-5" />}
                </div>

                <div className={`max-w-[85%] rounded-2xl p-4 text-sm sm:text-base leading-relaxed ${
                  isAi
                    ? 'bg-white border border-slate-200/90 text-slate-800 shadow-2xs'
                    : 'bg-blue-600 text-white font-medium shadow-xs'
                }`}>
                  <div className="whitespace-pre-line">
                    {msg.text}
                  </div>

                  {isAi && (
                    <div className="flex items-center justify-between mt-3 pt-2 border-t border-slate-100 text-[11px] text-slate-400">
                      <span>{msg.timestamp}</span>
                      <button
                        onClick={() => handleCopy(msg.text, msg.id)}
                        className="hover:text-slate-700 flex items-center space-x-1"
                      >
                        {copiedId === msg.id ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                            <span className="text-emerald-700 font-bold">{isKa ? 'დაკოპირდა' : 'Copied'}</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>{isKa ? 'კოპირება' : 'Copy'}</span>
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {isLoading && (
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center">
                <Bot className="w-5 h-5 animate-pulse" />
              </div>
              <div className="bg-white border border-slate-200 rounded-2xl px-4 py-3 text-xs sm:text-sm text-slate-500 shadow-2xs flex items-center space-x-2">
                <div className="w-2 h-2 rounded-full bg-blue-600 animate-bounce" />
                <span>{isKa ? 'AGNO ფიქრობს პასუხზე...' : 'AGNO is preparing your answer...'}</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input box */}
        <div className="p-3 sm:p-4 bg-white border-t border-slate-200">
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
              className="flex-1 bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-sm sm:text-base text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold text-sm sm:text-base flex items-center space-x-2 shadow-xs transition-colors shrink-0"
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
