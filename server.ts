import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// Financial AI Advisor endpoint
app.post('/api/advisor', async (req, res) => {
  try {
    const { message, userContext, history } = req.body;
    const {
      knowledgeLevel = 'Beginner',
      language = 'ka',
      monthlyIncome = 3200,
      monthlySavings = 1150,
      riskTolerance = 'Moderate',
      goals = [],
      currency = '₾',
      explanationMode = 'მარტივად',
      primaryGoal = 'საგანგებო ფონდი',
      interests = []
    } = userContext || {};

    const apiKey = process.env.GEMINI_API_KEY;

    const systemPrompt = `You are AGNO’s Georgian-language financial education assistant. Answer in clear, natural Georgian. Adapt the explanation to the selected level: Beginner, Intermediate or Advanced. Give educational explanations, practical examples and neutral scenario comparisons. Never promise returns. Never instruct the user to buy or sell a specific financial product. Never claim to know live market prices unless live data has actually been provided. If the user asks for personalized investment advice, explain the relevant financial concepts, risks and questions the user should consider instead of giving a direct recommendation. Clearly state assumptions. Keep normal answers concise unless the user selects detailed mode.

Active Context:
- Selected Level: ${knowledgeLevel}
- Selected Explanation Mode: ${explanationMode} (${explanationMode === 'მარტივად' ? 'Simple, concise everyday explanation' : explanationMode === 'დეტალურად' ? 'Detailed structured breakdown with assumptions and formulas' : 'Step-by-step practical real-life example with Georgian Lari (GEL) numbers'})
- User Primary Goal: ${primaryGoal}
- User Interests: ${Array.isArray(interests) ? interests.join(', ') : ''}
- User Monthly Income: ${currency}${monthlyIncome}, Monthly Free Savings: ${currency}${monthlySavings}
- Preferred Output Language: ${language === 'en' ? 'English' : 'Georgian (ქართული)'}`;

    if (!apiKey) {
      const isKa = language !== 'en';
      const fallbackKa = `**AGNO AI დამხმარე (${explanationMode})**\n\nთქვენი არჩეული დონეა **${knowledgeLevel}**, ხოლო მთავარი მიზანი — **${primaryGoal}**.\n\n- **ძირითადი პრინციპი:** ფინანსური გადაწყვეტილების მიღებისას გაითვალისწინეთ ინფლაცია და რეალური სარგებელი.\n- **პრაქტიკული მაგალითი:** თუ თვეში ზოგავთ **${currency}${monthlySavings}**-ს, პირველ რიგში შეავსეთ 3–6 თვის საგანგებო ფონდი უსაფრთხო ანაბარზე.\n- **დაშვება:** ეს არის საგანმანათლებლო განმარტება და არ წარმოადგენს პერსონალურ საინვესტიციო რეკომენდაციას.`;
      
      const fallbackEn = `**AGNO AI Assistant (${explanationMode})**\n\nBased on your **${knowledgeLevel}** level and primary goal (**${primaryGoal}**):\n\n- **Core Concept:** Always evaluate real inflation-adjusted returns rather than nominal numbers alone.\n- **Practical Example:** With **${currency}${monthlySavings}** monthly savings, prioritize a 3–6 month emergency buffer first.\n- **Disclaimer:** Educational explanation only, not individualized investment advice.`;

      return res.json({ text: isKa ? fallbackKa : fallbackEn });
    }

    const ai = new GoogleGenAI({ apiKey });
    
    // Build contents array including recent history if provided
    const contents: any[] = [];
    if (Array.isArray(history) && history.length > 0) {
      for (const h of history.slice(-6)) {
        contents.push({
          role: h.sender === 'user' ? 'user' : 'model',
          parts: [{ text: h.text }]
        });
      }
    }
    contents.push({
      role: 'user',
      parts: [{ text: message }]
    });

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents,
      config: {
        systemInstruction: systemPrompt,
        temperature: 0.7,
      }
    });

    return res.json({ text: response.text || 'No response generated.' });
  } catch (error: any) {
    console.error('Advisor API Error:', error);
    res.status(500).json({
      error: 'Failed to generate financial analysis',
      details: error?.message || 'Unknown server error'
    });
  }
});

// Deep Goal & Budget Analysis endpoint
app.post('/api/analyze-goals', async (req, res) => {
  try {
    const { budget, goals, riskProfile, language = 'en', currency = '$' } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      // Return structured fallback analysis
      const totalIncome = budget?.income || 2500;
      const totalExpense = (budget?.fixed || 1200) + (budget?.discretionary || 600);
      const netSavings = Math.max(0, totalIncome - totalExpense);
      const savingsRate = Math.round((netSavings / (totalIncome || 1)) * 100);

      const isKa = language === 'ka';
      return res.json({
        summary: isKa
          ? `თქვენი დანაზოგის მაჩვენებელი შეადგენს ${savingsRate}%-ს (${currency}${netSavings}/თვე). ეს ჯანსაღი საწყისია თქვენი მიზნების მისაღწევად.`
          : `Your current savings rate is ${savingsRate}% (${currency}${netSavings}/month). This provides a resilient foundation for your milestone targets.`,
        healthScore: Math.min(95, Math.max(40, savingsRate * 3 + 20)),
        riskAlignment: isKa
          ? `თქვენი პროფილი (${riskProfile}) შესაფერისია საშუალოვადიანი მიზნებისთვის. რეკომენდებულია 60% აქციები/ETF და 40% დეპოზიტები/ობლიგაციები.`
          : `Your ${riskProfile} risk profile balances stability and long-term capital compounding. We recommend a 60/40 allocation model across broad equity ETFs and fixed deposits.`,
        actionSteps: isKa ? [
          'საგანგებო ფონდის დასრულება (მინიმუმ 3 თვის ხარჯი)',
          'ინვესტიციის ავტომატიზაცია ყოველი ხელფასის ჩარიცხვისთანავე',
          'საპენსიო შენატანების მაქსიმიზაცია საგადასახადო შეღავათის მისაღებად'
        ] : [
          'Complete 3-month emergency buffer in liquid interest-bearing accounts',
          'Automate monthly investment transfer right on payday',
          'Optimize Pillar II pension contributions to harness compounding matching'
        ],
        goalFeasibility: (goals || []).map((g: any) => {
          const monthsRequired = netSavings > 0 ? Math.ceil((g.targetAmount - (g.currentAmount || 0)) / netSavings) : 999;
          const onTrack = monthsRequired <= (g.targetYears * 12);
          return {
            id: g.id,
            title: g.title,
            targetAmount: g.targetAmount,
            estimatedMonths: monthsRequired,
            onTrack,
            status: onTrack ? (isKa ? 'შესრულებადია' : 'On Track') : (isKa ? 'საჭიროებს კორექტირებას' : 'Needs Optimization')
          };
        })
      });
    }

    const ai = new GoogleGenAI({ apiKey });
    const prompt = `Analyze this user's budget and financial goals:
Budget: ${JSON.stringify(budget)}
Goals: ${JSON.stringify(goals)}
Risk Profile: ${riskProfile}
Currency: ${currency}
Language: ${language === 'ka' ? 'Georgian (ქართული)' : 'English'}

Provide a JSON response with:
{
  "summary": "Short empowering overview paragraph",
  "healthScore": 85 (0-100 score),
  "riskAlignment": "Paragraph assessing risk alignment to goals",
  "actionSteps": ["Actionable step 1", "Actionable step 2", "Actionable step 3"],
  "goalFeasibility": [
    {
      "id": "goal id",
      "title": "goal title",
      "targetAmount": number,
      "estimatedMonths": number,
      "onTrack": true/false,
      "status": "string status in selected language"
    }
  ]
}
Return ONLY valid JSON.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      }
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json(parsed);
  } catch (error: any) {
    console.error('Goal analysis error:', error);
    res.status(500).json({ error: 'Goal analysis failed', details: error?.message });
  }
});

// Setup Vite middlewares in development or static serving in production
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';
  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(port, () => {
    console.log(`AGNO FinEdu server listening on http://localhost:${port}`);
  });
}

startServer();
