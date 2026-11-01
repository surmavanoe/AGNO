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
      language = 'en',
      monthlyIncome = 2500,
      monthlySavings = 500,
      riskTolerance = 'Moderate',
      goals = [],
      currency = 'USD'
    } = userContext || {};

    const apiKey = process.env.GEMINI_API_KEY;

    const systemPrompt = `You are the AGNO Financial AI Consultant, an expert financial educator and wealth analytics advisor for the FINEDU platform.
Brand ethos: Transform intimidating financial concepts into actionable, level-appropriate clarity.
User Literacy Level: ${knowledgeLevel} (Beginner: use simple everyday analogies like supermarket baskets, avoid jargon; Intermediate: explain mechanical trade-offs and risk/reward curves; Advanced: use exact quantitative concepts like CAGR, real yields, Sharpe ratio, tax optimization).
User Profile:
- Monthly Income: ${currency} ${monthlyIncome}
- Monthly Savings: ${currency} ${monthlySavings}
- Risk Profile: ${riskTolerance}
- Active Goals: ${JSON.stringify(goals)}
- Preferred Language: ${language === 'ka' ? 'Georgian (ქართული)' : 'English'}

Instructions:
1. Respond strictly in ${language === 'ka' ? 'Georgian (ქართული)' : 'English'}. Use clean Markdown formatting with clear bullet points, bold key figures, and concise takeaways.
2. Directly answer the user's inquiry, grounding it in their level (${knowledgeLevel}) and their financial context.
3. If they ask about saving or investing, calculate concrete scenarios using their numbers (e.g. at ${monthlySavings}/mo, after 5 years at 7% vs 3% deposit).
4. Emphasize the core FINEDU principle: "Knowledge + Action" (Learning concepts and putting them into practice). Mention relevant AGNO simulators (Compound interest, inflation calculator, pension simulator) when relevant.
5. Keep answers focused, insightful, encouraging, and under 300 words. Always include an educational disclaimer that this is financial education, not licensed individualized investment advice.`;

    if (!apiKey) {
      // Intelligent fallback when API key is not yet configured in local environment
      const isKa = language === 'ka';
      const fallbackKa = `**AGNO AI ფინანსური ასისტენტი (დემო რეჟიმი)**\n\nგმადლობთ შეკითხვისთვის! თქვენი ცოდნის დონეა **${knowledgeLevel}**, ხოლო ყოველთვიური დანაზოგი შეადგენს **${currency} ${monthlySavings}**-ს.\n\n### მთავარი რეკომენდაცია:\n- **უსაფრთხოების ბალიში:** პირველ რიგში შექმენით 3-6 თვის ხარჯების ოდენობის საგანგებო ფონდი მაღალპროცენტიან ანაბარზე.\n- **ინფლაციის დაცვა:** საქართველოში მოსახლეობის 57% ნაღდ ფულს ინახავს სახლში, რაც წელიწადში 4-8%-ით ამცირებს მსყიდველობით უნარს. გამოიყენეთ AGNO-ს ინფლაციის კალკულატორი.\n- **დივერსიფიკაცია:** თქვენი რისკის პროფილია **${riskTolerance}**, რაც გულისხმობს ბალანსს უსაფრთხო დეპოზიტებსა და ინდექსურ ფონდებს (ETF) შორის.\n\n*შენიშვნა: AI ასისტენტის სრული გენერაციული მოდელის გასააქტიურებლად მიუთითეთ GEMINI_API_KEY.*`;
      
      const fallbackEn = `**AGNO AI Financial Advisor (Demo Mode)**\n\nThank you for your question! Based on your **${knowledgeLevel}** level and monthly savings of **${currency} ${monthlySavings}**:\n\n### Key Takeaways:\n- **Emergency Cushion:** Secure 3 to 6 months of living expenses in an accessible high-yield savings account or flexible deposit before aggressive investing.\n- **Inflation Shield:** Holding cash idly erodes 4-8% purchasing power annually due to inflation. Leverage AGNO's Inflation Impact Simulator to project this exact drag.\n- **Strategy for ${riskTolerance} Profile:** Allocate a core pillar into diversified index funds / ETFs and defensive fixed income instruments.\n\n*Note: To unlock live conversational Gemini AI capabilities, set the GEMINI_API_KEY environment variable.*`;

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
