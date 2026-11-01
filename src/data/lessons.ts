import { Lesson } from '../types';

export const initialLessons: Lesson[] = [
  // BEGINNER
  {
    id: 'lesson-inflation',
    level: 'Beginner',
    titleKa: 'ინფლაცია — ფარული გადასახადი თქვენს დანაზოგზე',
    titleEn: 'Inflation: The Silent Tax on Your Savings',
    summaryKa: 'რატომ კარგავს სახლში შენახული ნაღდი ფული მსყიდველუნარიანობას ყოველწლიურად.',
    summaryEn: 'Why cash stored under the mattress loses real buying power each year.',
    readTimeMinutes: 3,
    xpReward: 50,
    recommendedCalculator: 'inflation',
    contentKa: `ინფლაცია არის ფასების საერთო დონის ზრდა დროთა განმავლობაში. როდესაც ფასები იზრდება, ერთი და იგივე თანხით ნაკლები საქონლისა და მომსახურების ყიდვა შეგიძლიათ.

### რატომ არის ეს კრიტიკული?
OECD-ს კვლევის თანახმად, საქართველოში მოქალაქეების 57% დანაზოგს ნაღდი ფულის სახით სახლში ინახავს. თუ თქვენ გაქვთ 10,000 ლარი და საშუალო წლიური ინფლაცია არის 5%, 5 წლის შემდეგ თქვენ ისევ გექნებათ 10,000 ლარი, მაგრამ მისი რეალური მსყიდველუნარიანობა დაეცემა დაახლოებით 7,835 ლარამდე!

### როგორ დავიცვათ თავი?
- **საბანკო ანაბრები:** მინიმუმ ნაწილობრივ ანაზღაურებს ინფლაციას.
- **ობლიგაციები და სახაზინო ვალდებულებები:** გვთავაზობს ფიქსირებულ საპროცენტო შემოსავალს.
- **დივერსიფიცირებული ინვესტიციები:** აქციები და ინდექსური ფონდები ისტორიულად ინფლაციას მნიშვნელოვნად აჭარბებს.`,
    contentEn: `Inflation is the gradual increase in prices across the economy. When prices rise, every unit of currency buys a smaller percentage of a good or service.

### Why is this urgent?
According to the OECD financial literacy study, 57% of adults in Georgia hold their savings in physical cash at home. If you keep $10,000 in cash at an average 5% inflation rate, in 5 years your nominal balance remains $10,000, but its actual purchasing power drops to roughly $7,835.

### How to protect your wealth:
- **High-Yield Deposits:** Cushion against price erosion.
- **Treasury Bills & Bonds:** Predictable fixed yield.
- **Equities & Broad ETFs:** Historically outpace inflation significantly over 5+ year horizons.`,
    quiz: {
      questionKa: 'თუ წლიური ინფლაცია 6%-ია, რა დაემართება სახლში შენახულ 10,000 ლარს 1 წელში?',
      questionEn: 'If annual inflation is 6%, what happens to $10,000 kept in cash after 1 year?',
      optionsKa: [
        'თანხა გახდება 10,600 ლარი',
        'ნომინალურად დარჩება 10,000 ლარი, მაგრამ რეალურად 9,434 ლარის საქონელს იყიდით',
        'თანხა უცვლელად შეინარჩუნებს იგივე ღირებულებას',
        'ბანკი დააკლებს 600 ლარს'
      ],
      optionsEn: [
        'The balance becomes $10,600',
        'Nominal cash remains $10,000, but real purchasing power drops to ~$9,434',
        'Purchasing power stays completely unchanged',
        'The bank subtracts $600 from your account'
      ],
      correctIndex: 1,
      explanationKa: 'ნომინალური თანხა არ იცვლება, თუმცა გაძვირებული ფასების გამო მისი მსყიდველობითი ძალა მცირდება.',
      explanationEn: 'The nominal bill count remains identical, but each dollar purchases fewer goods due to higher prices.'
    }
  },
  {
    id: 'lesson-compound-interest',
    level: 'Beginner',
    titleKa: 'რთული პროცენტი — სიმდიდრის ზრდის მამოძრავებელი',
    titleEn: 'The Magic of Compound Interest',
    summaryKa: 'როგორ ამრავლებს პროცენტზე დარიცხული პროცენტი თქვენს დანაზოგს ექსპონენციურად.',
    summaryEn: 'How interest earning interest accelerates your long-term wealth exponentially.',
    readTimeMinutes: 4,
    xpReward: 60,
    recommendedCalculator: 'compound',
    contentKa: `ალბერტ აინშტაინმა რთულ პროცენტს „მსოფლიოს მერვე საოცრება“ უწოდა. 

### მარტივი vs რთული პროცენტი
- **მარტივი პროცენტი:** პროცენტი ერიცხება მხოლოდ საწყის შენატანს.
- **რთული პროცენტი:** პროცენტი ერიცხება როგორც საწყის თანხას, ისე უკვე გამომუშავებულ წინა პროცენტს.

მაგალითად, თუ ყოველთვიურად დაზოგავთ 200 ლარს 8%-იანი საშუალო წლიური ამონაგებით:
- 10 წელში თქვენი შენატანი იქნება 24,000 ლარი, მაგრამ ჯამური თანხა მიაღწევს **36,589 ლარს**!
- 20 წელში შენატანი იქნება 48,000 ლარი, ხოლო საბოლოო კაპიტალი — **118,580 ლარი**!
დრო თქვენი ყველაზე ძლიერი მოკავშირეა.`,
    contentEn: `Compound interest is interest calculated on the initial principal, which also includes all the accumulated interest from previous periods.

### Simple vs Compound
- **Simple Interest:** Earns yield only on the original principal.
- **Compound Interest:** Yield earns yield on top of yield.

For example, saving $200/month at an 8% expected annual return:
- Over 10 years: Your contributions total $24,000, yet portfolio value hits **$36,589**!
- Over 20 years: Your contributions total $48,000, yet your capital surges to **$118,580**!
Starting early is the single most important wealth variable.`,
    quiz: {
      questionKa: 'რა ხდის რთულ პროცენტს განსაკუთრებულად მძლავრს გრძელვადიან პერიოდში?',
      questionEn: 'What makes compound interest so powerful over long periods?',
      optionsKa: [
        'ის მხოლოდ ერთხელ ერიცხება თანხას',
        'პროცენტი თავის მხრივ იწყებს ახალი პროცენტის გამომუშავებას',
        'ის არასდროს ექვემდებარება საბაზრო რყევებს',
        'საჭიროებს ყოველდღიურ ვაჭრობას'
      ],
      optionsEn: [
        'It is paid out only once at retirement',
        'Accumulated interest itself starts generating additional interest',
        'It eliminates all market volatility',
        'It requires active daily day trading'
      ],
      correctIndex: 1,
      explanationKa: 'დარიცხული პროცენტის ხელახალი ინვესტირება ქმნის თოვლის გუნდის ეფექტს (Snowball Effect).',
      explanationEn: 'Reinvested interest generates its own returns, compounding like a financial snowball.'
    }
  },
  {
    id: 'lesson-budget-503020',
    level: 'Beginner',
    titleKa: '50/30/20 წესი — პირადი ბიუჯეტის მარტივი ჩონჩხი',
    titleEn: 'The 50/30/20 Rule: Effortless Budget Balance',
    summaryKa: 'როგორ გადავანაწილოთ შემოსავალი ისე, რომ დანაზოგი ჩვევად იქცეს.',
    summaryEn: 'A battle-tested framework for balancing necessities, lifestyle, and wealth building.',
    readTimeMinutes: 3,
    xpReward: 50,
    recommendedCalculator: 'scenario',
    contentKa: `ფინანსური წარმატება იწყება არა იმით, რამდენს გამოიმუშავებთ, არამედ იმით, რამდენს ინარჩუნებთ.

### 50/30/20 განაწილება:
1. **50% — აუცილებელი ხარჯები (Needs):** ბინის ქირა/იპოთეკა, კომუნალურები, საბაზისო კვება, ტრანსპორტი, მედიკამენტები.
2. **30% — პირადი სურვილები (Wants):** რესტორნები, ჰობი, მოგზაურობა, გართობა, შოპინგი.
3. **20% — დანაზოგი და მომავალი (Savings & Investments):** საგანგებო ფონდი, საპენსიო შენატანი, საინვესტიციო პორტფელი.

თუ თქვენი ხელფასი 2,000 ლარია: 1,000 ლარი საჭიროებებს, 600 ლარი სურვილებს, 400 ლარი — თქვენს მომავალ ფინანსურ თავისუფლებას.`,
    contentEn: `Financial freedom is determined not just by how much you earn, but how much you consistently retain.

### The 50/30/20 Blueprint:
1. **50% Needs:** Rent/mortgage, utilities, baseline groceries, healthcare, transit.
2. **30% Wants:** Dining out, vacations, gadgets, entertainment.
3. **20% Savings & Debt Acceleration:** Emergency fund, retirement accounts, index investments.

On a $2,500 monthly income: $1,250 covers necessities, $750 finances lifestyle desires, and $500 compounds toward your financial freedom.`,
    quiz: {
      questionKa: '50/30/20 წესის მიხედვით, რა წილი უნდა მიემართოს დანაზოგებსა და ინვესტიციებში?',
      questionEn: 'According to the 50/30/20 guideline, what proportion should go to savings/investments?',
      optionsKa: ['5%', '10%', '20%', '50%'],
      optionsEn: ['5%', '10%', '20%', '50%'],
      correctIndex: 2,
      explanationKa: 'მინიმუმ 20% უზრუნველყოფს საიმედო უსაფრთხოების ბალიშსა და კაპიტალის ზრდას.',
      explanationEn: 'Allocating 20% guarantees both an emergency runway and long-term asset accumulation.'
    }
  },

  // INTERMEDIATE
  {
    id: 'lesson-deposit-vs-bonds-stocks',
    level: 'Intermediate',
    titleKa: 'დეპოზიტი, ობლიგაცია თუ აქცია? არჩევანი მიზნის მიხედვით',
    titleEn: 'Deposits, Bonds or Stocks: Aligning with Your Horizon',
    summaryKa: 'სხვადასხვა ფინანსური ინსტრუმენტის რისკი, ლიკვიდურობა და შემოსავლიანობა.',
    summaryEn: 'Evaluating risk, liquidity, and expected yields across standard asset classes.',
    readTimeMinutes: 5,
    xpReward: 75,
    recommendedCalculator: 'deposit',
    contentKa: `ხშირად დამწყებებს ჰგონიათ, რომ ინვესტიცია მხოლოდ აქციებით ვაჭრობაა. რეალურად არსებობს სამი ძირითადი ინსტრუმენტი:

| ინსტრუმენტი | რისკი | ლიკვიდურობა | მოსალოდნელი ამონაგები | მიზანი |
|---|---|---|---|---|
| **საბანკო დეპოზიტი** | მინიმალური | მაღალი/საშუალო | 8-11% (GEL) / 2-4% (USD) | 1-2 წლიანი მიზნები |
| **ობლიგაციები** | დაბალი/საშუალო | საშუალო | ფიქსირებული კუპონი | 3-5 წლიანი სტაბილურობა |
| **აქციები / ETF** | საშუალო/მაღალი | მაღალი | 8-12% საშუალო გრძელვადიანი | 5+ წლიანი ზრდა |

„არ ჩადოთ ყველა კვერცხი ერთ კალათში“ — ეს არის დივერსიფიკაციის ოქროს წესი.`,
    contentEn: `Beginners often confuse investing with speculative day trading. Prudent wealth building relies on three core asset classes:

| Instrument | Risk | Liquidity | Expected Yield | Ideal Horizon |
|---|---|---|---|---|
| **Bank Term Deposit** | Minimal | High/Medium | 8-11% (GEL) / 3-5% (USD) | Short-term (<2 yrs) |
| **Bonds (Gov/Corp)** | Low/Moderate | Medium | Fixed coupon yields | Medium-term (2-5 yrs) |
| **Equities / Broad ETFs** | Moderate/High | High | 8-10% historical CAGR | Long-term (5+ yrs) |

Asset selection must match your specific goal horizon, never short-term emotion.`,
    quiz: {
      questionKa: 'თუ მიზნის მიღწევა 1 წელიწადში გსურთ (მაგ. ბინის რემონტი), რომელი ინსტრუმენტია ყველაზე უსაფრთხო?',
      questionEn: 'If you need funds in 12 months for a home renovation, which vehicle is safest?',
      optionsKa: [
        'ტექნოლოგიური აქციები',
        'საბანკო ვადიანი დეპოზიტი ან მოკლევადიანი სახაზინო ვალდებულება',
        'კრიპტოვალუტა',
        'უძრავი ქონების მშენებლობის დაწყება'
      ],
      optionsEn: [
        'High-volatility growth stocks',
        'A fixed bank term deposit or short-term treasury bill',
        'Speculative crypto assets',
        'Illiquid ground-up real estate'
      ],
      correctIndex: 1,
      explanationKa: '1 წლიანი ჰორიზონტისთვის აქციების რყევა სარისკოა; დეპოზიტი გარანტირებულ კაპიტალს გინარჩუნებთ.',
      explanationEn: 'Short horizons cannot absorb market volatility; guaranteed principal vehicles are essential.'
    }
  },
  {
    id: 'lesson-pension-pillar2',
    level: 'Intermediate',
    titleKa: 'დაგროვებითი საპენსიო სისტემა (Pillar II) — როგორ მუშაობს?',
    titleEn: 'Accumulative Pension Systems: The 2+2+2 Compounding Engine',
    summaryKa: 'როგორ ამრავლებს დამსაქმებლისა და სახელმწიფოს თანამონაწილეობა თქვენს კაპიტალს.',
    summaryEn: 'How matched employer and state contributions create effortless compounding.',
    readTimeMinutes: 4,
    xpReward: 70,
    recommendedCalculator: 'pension',
    contentKa: `საქართველოს დაგროვებითი საპენსიო მოდელი ემყარება 2% + 2% + 2% ფორმულას:
- 2% — თქვენი ხელფასიდან (დაქვითვა)
- 2% — დამსაქმებლის თანამონაწილეობა (დამატებითი ბონუსი)
- 1-2% — სახელმწიფოს თანამონაწილეობა (თქვენი შემოსავლის მიხედვით)

ეს ნიშნავს, რომ ყოველ 100 ლარზე, რასაც თქვენ გამოყოფთ, თქვენს საპენსიო ანგარიშზე რეალურად ჯდება 200-300 ლარი!
ეს თანხა შემდეგ ინვესტირდება კონსერვატიულ, დაბალანსებულ ან დინამიკურ პორტფელში და წლების განმავლობაში რთული პროცენტით იზრდება.`,
    contentEn: `In matched retirement systems like Georgia's Accumulative Pension (Pillar II):
- 2% contributed by the employee from salary
- 2% contributed on top by the employer
- 1% to 2% contributed by the state (income tier dependent)

This means for every $100 deducted from your pocket, $200–$300 is deposited immediately into your compounding investment pool. The pension agency invests this across conservative, balanced, or dynamic portfolios.`,
    quiz: {
      questionKa: 'რა ხდის საპენსიო დაგროვებით სისტემას განსაკუთრებულად მომგებიანს?',
      questionEn: 'What provides an instant 100%+ guaranteed kick-start in matched pension schemes?',
      optionsKa: [
        'საპენსიო სააგენტო არ იხდის გადასახადებს',
        'დამსაქმებლისა და სახელმწიფოს მიერ თქვენი შენატანის გაორმაგება/გასამმაგება',
        'ფულის გამოტანა ნებისმიერ დღეს შეგიძლიათ ჯარიმის გარეშე',
        'ის მხოლოდ ოქროში დებს თანხას'
      ],
      optionsEn: [
        'Exemption from all worldly taxes',
        'Direct co-funding matching by employer and government',
        'Penalty-free daily withdrawals at local ATMs',
        '100% allocation into physical gold bullion'
      ],
      correctIndex: 1,
      explanationKa: 'დამსაქმებლისა და სახელმწიფოს შენატანები წარმოადგენს დაუყოვნებლივ 100%+ გარანტირებულ ამონაგებს თქვენს პირად შენატანზე.',
      explanationEn: 'Employer and government matching doubles or triples your capital before market returns even begin.'
    }
  },

  // ADVANCED
  {
    id: 'lesson-diversification-portfolio',
    level: 'Advanced',
    titleKa: 'პორტფელის დივერსიფიკაცია და რისკ-მენეჯმენტი',
    titleEn: 'Portfolio Diversification & Asset Correlation',
    summaryKa: 'აქტივების კორელაცია, შარპის კოეფიციენტი და რებალანსირების სტრატეგია.',
    summaryEn: 'Asset correlation, Sharpe ratio optimization, and programmatic rebalancing.',
    readTimeMinutes: 6,
    xpReward: 90,
    recommendedCalculator: 'scenario',
    contentKa: `ჭეშმარიტი დივერსიფიკაცია არ ნიშნავს 20 სხვადასხვა ტექნოლოგიური კომპანიის აქციის ფლობას. ეს არის აქტივების გადანაწილება ისეთ კლასებს შორის, რომლებსაც აქვთ დაბალი ან უარყოფითი კორელაცია.

### პორტფელის კლასიკური არქიტექტურა:
1. **აშშ & გლობალური ინდექსები (S&P 500, MSCI World):** გრძელვადიანი ზრდის ლოკომოტივი.
2. **სახელმწიფო ობლიგაციები (Bonds/Treasuries):** ამცირებს პორტფელის ვოლატილობას კრიზისებისას.
3. **ნაღდი ფული / მოკლევადიანი დეპოზიტი:** ლიკვიდურობა და ახალი შესაძლებლობების ათვისება.
4. **დამცავი აქტივები (ოქრო, რეალური უძრავი ქონება):** ინფლაციური შოკების ბუფერი.

რებალანსირება წელიწადში ერთხელ საშუალებას გაძლევთ გაყიდოთ ის, რაც გაძვირდა და იყიდოთ ის, რაც დროებით გაიაფდა.`,
    contentEn: `True diversification is not holding 20 different AI technology stocks. It is systematically allocating capital across asset classes with low or negative historical correlation.

### Robust All-Weather Pillars:
1. **Global Equities (Broad Market ETFs):** The primary engine of long-term real capital appreciation.
2. **Sovereign & Investment-Grade Bonds:** Volatility dampers that provide predictable cash flow.
3. **Cash / Liquid Cash Equivalents:** Dry powder for rebalancing opportunities during corrections.
4. **Real Assets / Commodities:** Strategic inflation and currency hedges.

Annual rebalancing systematically forces the discipline of "selling high and buying low" without emotional bias.`,
    quiz: {
      questionKa: 'რა არის პორტფელის პერიოდული რებალანსირების მთავარი მიზანი?',
      questionEn: 'What is the primary objective of systematic portfolio rebalancing?',
      optionsKa: [
        'ყოველდღიური სპეკულაციური მოგების გაზრდა',
        'საწყისი რისკის პროფილის აღდგენა და ძვირად გაყიდვა / იაფად ყიდვის დისციპლინა',
        'ყველა აქციის ერთდროულად გაყიდვა',
        'საბანკო გადარიცხვის საკომისიოების დაზოგვა'
      ],
      optionsEn: [
        'Maximizing intraday speculative turnover',
        'Restoring original risk targets and systematically locking gains into undervalued assets',
        'Liquidating 100% of holdings into fiat currency',
        'Minimizing checking account maintenance charges'
      ],
      correctIndex: 1,
      explanationKa: 'რებალანსირება უზრუნველყოფს, რომ პორტფელი ზედმეტად სარისკო არ გახდეს ერთი აქტივის ზრდის გამო.',
      explanationEn: 'Rebalancing prevents portfolio drift and resets risk back to your planned tolerance.'
    }
  }
];
