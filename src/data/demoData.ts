import { LearningModule, AchievementItem, UserProfile, BudgetData, FinancialGoal } from '../types';

export const financialTermTooltips: Record<string, string> = {
  'ინფლაცია': 'ფასების საერთო დონის ზრდა დროთა განმავლობაში, რაც ამცირებს ფულის მსყიდველობით უნარს.',
  'რთული პროცენტი': 'პროცენტის დარიცხვა როგორც საწყის თანხაზე, ისე უკვე დაგროვილ პროცენტზე („პროცენტი პროცენტზე“).',
  'რეალური შემოსავლიანობა': 'საპროცენტო სარგებელი ინფლაციის გამოკლების შემდეგ — აჩვენებს მსყიდველობითი ძალის რეალურ ზრდას.',
  'დივერსიფიკაცია': 'თანხის გადანაწილება სხვადასხვა ტიპის აქტივებში რისკის შესამცირებლად („არ ჩადო ყველა კვერცხი ერთ კალათში“).',
  'საგანგებო ფონდი': '3–6 თვის აუცილებელი ხარჯების რეზერვი გაუთვალისწინებელი შემთხვევებისთვის, შენახული უსაფრთხო და ხელმისაწვდომ ანგარიშზე.',
  '50/30/20 წესი': 'ბიუჯეტის მართვის მეთოდი: 50% აუცილებელ ხარჯებს, 30% სურვილებს, 20% დანაზოგსა და მიზნებს.',
  'ობლიგაცია': 'ფასიანი ქაღალდი, რომლითაც სესხულობთ თანხას სახელმწიფოს ან კომპანიას ფიქსირებული სარგებლის სანაცვლოდ.',
};

export const learningPathModules: LearningModule[] = [
  {
    id: 'module-1',
    number: 1,
    titleKa: 'ფინანსური საფუძვლები',
    titleEn: 'Financial Fundamentals',
    descriptionKa: 'პირადი ფინანსების საფუძვლები: შემოსავლის, ხარჯისა და პირველი ბიუჯეტის მართვა.',
    nodes: [
      {
        id: 'm1-n1',
        moduleId: 'module-1',
        titleKa: 'შემოსავალი, ხარჯი და დანაზოგი',
        titleEn: 'Income, Expenses & Savings',
        summaryKa: 'როგორ მუშაობს პირადი ფულადი ნაკადი და რატომ იწყება დანაზოგი ხარჯების აღრიცხვით.',
        summaryEn: 'How personal cash flow works and why saving starts with tracking expenses.',
        level: 'Beginner',
        topic: 'ბიუჯეტირება',
        nodeType: 'lesson',
        defaultStatus: 'completed',
        readTimeMinutes: 3,
        xpReward: 20,
        recommendedCalculator: 'savings',
        stages: {
          explanationKa: 'პირადი ფინანსების მართვა სამ ძირითად სვეტს ეფუძნება: შემოსავალი (რაც შემოგდით), ხარჯი (რასაც გასცემთ) და დანაზოგი (რაც გრჩებათ მომავალი მიზნებისთვის). მთავარი პრინციპია: ჯერ გადადეთ მცირე თანხა დანაზოგისთვის და შემდეგ დაგეგმეთ მიმდინარე ხარჯები.',
          explanationEn: 'Personal finance relies on three pillars: income, expenses, and savings. Pay yourself first before spending.',
          exampleKa: 'თუ გიორგის ყოველთვიური შემოსავალი 2,000 ლარია და ხელფასის ჩარიცხვისთანავე 200 ლარს ცალკე შემნახველ ანგარიშზე გადარიცხავს, წლის ბოლოს მას უკვე 2,400 ლარის საწყისი რეზერვი ექნება.',
          exampleEn: 'If Giorgi earns 2,000 GEL and automatically moves 200 GEL to savings on payday, he builds 2,400 GEL in a year.',
          question: {
            questionKa: 'რომელი მიდგომაა ყველაზე ეფექტური სტაბილური დანაზოგის შესაქმნელად?',
            questionEn: 'Which approach is most effective for building consistent savings?',
            optionsKa: [
              'შემოსავლის მიღებისთანავე წინასწარ განსაზღვრული ნაწილის გადადება',
              'თვის ბოლოს მხოლოდ იმის შენახვა, რაც შემთხვევით მორჩება',
              'დანაზოგის დაწყება მხოლოდ მაშინ, როცა ხელფასი გაორმაგდება',
              'ყველა ხარჯის ზეპირად დამახსოვრება'
            ],
            optionsEn: [
              'Setting aside a planned portion right when income arrives',
              'Saving only whatever happens to be left at month end',
              'Waiting until salary doubles',
              'Memorizing expenses mentally'
            ],
            correctIndex: 0,
            feedbackKa: 'სწორია! ხელფასის მიღებისთანავე თანხის გადადება („გადაუხადე საკუთარ თავს პირველმა“) დანაზოგს ჩვევად აქცევს.',
            feedbackEn: 'Correct! Paying yourself first builds automatic discipline.'
          },
          practiceExercise: {
            promptKa: 'დავუშვათ, ყოველთვიურად ზოგავთ თანხას. ნახეთ, რამდენი დაგიგროვდებათ წლების განმავლობაში:',
            promptEn: 'Adjust your monthly savings to see how much accumulates:',
            scenarioLabelKa: 'ყოველთვიური დანაზოგის სიმულაცია',
            defaultAmount: 200,
            defaultRate: 8,
            defaultInflation: 4,
            defaultYears: 3,
            takeawayKa: 'მცირე, მაგრამ რეგულარული ყოველთვიური შენატანი ქმნის მყარ ფინანსურ ბალიშს.'
          },
          achievementProgressTitleKa: 'პირველი ნაბიჯი'
        }
      },
      {
        id: 'm1-n2',
        moduleId: 'module-1',
        titleKa: '50/30/20 წესი',
        titleEn: 'The 50/30/20 Rule',
        summaryKa: 'შემოსავლის მარტივი განაწილება აუცილებელ ხარჯებს, სურვილებსა და დანაზოგს შორის.',
        summaryEn: 'Simple allocation between needs, wants, and savings.',
        level: 'Beginner',
        topic: 'ბიუჯეტირება',
        nodeType: 'lesson',
        defaultStatus: 'completed',
        readTimeMinutes: 4,
        xpReward: 20,
        recommendedCalculator: 'savings',
        stages: {
          explanationKa: '50/30/20 წესი გვეხმარება შემოსავალი მარტივად დავყოთ სამ ნაწილად: 50% აუცილებელი საჭიროებები (ბინა, კომუნალური, საკვები, ტრანსპორტი), 30% პირადი სურვილები (დასვენება, გართობა) და 20% დანაზოგი და ფინანსური მიზნები.',
          explanationEn: 'The 50/30/20 rule divides take-home pay into 50% needs, 30% wants, and 20% savings.',
          exampleKa: '2,500 ლარის შემოსავლის შემთხვევაში: 1,250 ლარი ხმარდება აუცილებელ ხარჯებს, 750 ლარი — ცხოვრების სტილსა და სურვილებს, ხოლო 500 ლარი — საგანგებო ფონდსა და მიზნებს.',
          exampleEn: 'On 2,500 GEL income: 1,250 GEL for needs, 750 GEL for wants, and 500 GEL for savings.',
          question: {
            questionKa: '50/30/20 წესის მიხედვით, შემოსავლის რა ნაწილია რეკომენდებული დანაზოგისა და ფინანსური მიზნებისთვის?',
            questionEn: 'Under the 50/30/20 rule, what share goes to savings and goals?',
            optionsKa: [
              '20%',
              '5%',
              '50%',
              '30%'
            ],
            optionsEn: ['20%', '5%', '50%', '30%'],
            correctIndex: 0,
            feedbackKa: 'სწორია! 20%-ის რეგულარული გადადება უზრუნველყოფს როგორც საგანგებო რეზერვის შექმნას, ისე გრძელვადიანი მიზნების მიღწევას.',
            feedbackEn: 'Correct! 20% builds both your safety buffer and long-term goals.'
          },
          practiceExercise: {
            promptKa: 'შეიყვანეთ თქვენი ყოველთვიური დანაზოგი (შემოსავლის 20%) და ნახეთ 5-წლიანი შედეგი:',
            promptEn: 'Simulate saving 20% of your monthly income over 5 years:',
            scenarioLabelKa: '20%-იანი დანაზოგის გეგმა',
            defaultAmount: 400,
            defaultRate: 9,
            defaultInflation: 4,
            defaultYears: 5,
            takeawayKa: '50/30/20 ბალანსი გაძლევთ საშუალებას იცხოვროთ კომფორტულად დღეს და ამავე დროს დაიცვათ მომავალი.'
          },
          achievementProgressTitleKa: 'ბიუჯეტის დამგეგმავი'
        }
      },
      {
        id: 'm1-n3',
        moduleId: 'module-1',
        titleKa: 'ბიუჯეტის შექმნა',
        titleEn: 'Building a Budget',
        summaryKa: 'როგორ დავაჯგუფოთ ფიქსირებული და ცვალებადი ხარჯები ზედმეტი სტრესის გარეშე.',
        summaryEn: 'Grouping fixed and variable expenses without stress.',
        level: 'Beginner',
        topic: 'ბიუჯეტირება',
        nodeType: 'practice',
        defaultStatus: 'completed',
        readTimeMinutes: 4,
        xpReward: 20,
        recommendedCalculator: 'goal',
        stages: {
          explanationKa: 'რეალისტური ბიუჯეტი არ ნიშნავს მკაცრ აკრძალვებს. ის ყოფს ხარჯებს ფიქსირებულ (ქირა, სესხი, ინტერნეტი) და ცვალებად (კაფეები, შოპინგი) კატეგორიებად, რათა ნათლად დაინახოთ, სად მიდის თქვენი თანხა.',
          explanationEn: 'A realistic budget separates fixed bills from flexible lifestyle spending.',
          exampleKa: 'როდესაც ნინომ აღრიცხა მცირე ყოველდღიური ხარჯები, აღმოაჩინა, რომ თვეში 180 ლარი იმპულსურ შენაძენებზე მიდიოდა. ამ თანხის ნახევრის დაზოგვით მან 1 წელში 1,080 ლარი შეაგროვა.',
          exampleEn: 'Tracking small daily purchases helped Nino redirect 90 GEL/month into savings.',
          question: {
            questionKa: 'ჩამოთვლილთაგან რომელია ფიქსირებული ყოველთვიური ხარჯი?',
            questionEn: 'Which of the following is a fixed monthly expense?',
            optionsKa: [
              'ბინის ქირა ან იპოთეკური სესხის გადასახადი',
              'რესტორანში სადილი მეგობრებთან',
              'საჩუქრების შეძენა',
              'კინოს ბილეთები'
            ],
            optionsEn: [
              'Rent or mortgage payment',
              'Dining out with friends',
              'Buying gifts',
              'Movie tickets'
            ],
            correctIndex: 0,
            feedbackKa: 'სწორია! ბინის ქირა და სესხის შენატანი ყოველთვიურად წინასწარ განსაზღვრული და აუცილებელი ფიქსირებული ვალდებულებაა.',
            feedbackEn: 'Correct! Rent and loan payments are predictable fixed obligations.'
          },
          practiceExercise: {
            promptKa: 'გამოთვალეთ, როგორ აისახება დაზოგილი 150–300 ლარი თქვენს რეზერვზე:',
            promptEn: 'See how redirecting 150–300 GEL per month grows your reserve:',
            scenarioLabelKa: 'ოპტიმიზებული ბიუჯეტის ეფექტი',
            defaultAmount: 250,
            defaultRate: 8.5,
            defaultInflation: 4,
            defaultYears: 4,
            takeawayKa: 'მცირე ცვალებადი ხარჯების კონტროლი ყველაზე სწრაფი გზაა თავისუფალი თანხის გამოსათავისუფლებლად.'
          },
          achievementProgressTitleKa: 'ბიუჯეტის დამგეგმავი'
        }
      },
      {
        id: 'm1-n4',
        moduleId: 'module-1',
        titleKa: 'მოკლე შემაჯამებელი ტესტი',
        titleEn: 'Module 1 Summary Quiz',
        summaryKa: 'შეამოწმეთ ფინანსური საფუძვლებისა და ბიუჯეტირების ცოდნა.',
        summaryEn: 'Check your mastery of financial fundamentals.',
        level: 'Beginner',
        topic: 'ბიუჯეტირება',
        nodeType: 'quiz',
        defaultStatus: 'available',
        readTimeMinutes: 3,
        xpReward: 30,
        recommendedCalculator: 'savings',
        stages: {
          explanationKa: 'პირველი მოდულის შეჯამება: თქვენ უკვე იცით შემოსავლისა და ხარჯის ბალანსი, 50/30/20 წესი და ფიქსირებული/ცვალებადი ხარჯების გამიჯვნა.',
          explanationEn: 'Module 1 recap: Cash flow balance, the 50/30/20 framework, and expense categorization.',
          exampleKa: 'თუ ოჯახის შემოსავალი 3,000 ლარია, 20%-იანი წესით თვეში 600 ლარი მიემართება ფინანსური უსაფრთხოებისა და მიზნებისკენ.',
          exampleEn: 'With 3,000 GEL family income, 20% puts 600 GEL/month toward financial security.',
          question: {
            questionKa: 'თუ თქვენი თვიური შემოსავალია 3,000 ლარი, ფიქსირებული ხარჯი 1,400 ლარი, ხოლო სურვილებზე ხარჯავთ 900 ლარს, რამდენი გრჩებათ დანაზოგისთვის?',
            questionEn: 'If income is 3,000 GEL, fixed costs 1,400 GEL, and wants 900 GEL, how much remains for savings?',
            optionsKa: [
              '700 ლარი (დაახლოებით 23%)',
              '300 ლარი (10%)',
              '1,400 ლარი',
              '0 ლარი'
            ],
            optionsEn: ['700 GEL (~23%)', '300 GEL (10%)', '1,400 GEL', '0 GEL'],
            correctIndex: 0,
            feedbackKa: 'შესანიშნავია! 3,000 - 1,400 - 900 = 700 ლარი, რაც შემოსავლის 23.3%-ია და აღემატება რეკომენდებულ 20%-იან ნიშნულს.',
            feedbackEn: 'Spot on! 700 GEL is 23.3% of income, beating the 20% target.'
          },
          practiceExercise: {
            promptKa: 'ნახეთ, რა თანხად იქცევა თვეში 700 ლარის დაზოგვა 5 წელიწადში:',
            promptEn: 'See what 700 GEL/month becomes in 5 years:',
            scenarioLabelKa: 'მოდული 1-ის შემაჯამებელი სიმულაცია',
            defaultAmount: 700,
            defaultRate: 9,
            defaultInflation: 4,
            defaultYears: 5,
            takeawayKa: 'თქვენ წარმატებით დაასრულეთ „ფინანსური საფუძვლების“ მოდული!'
          },
          achievementProgressTitleKa: 'ბიუჯეტის დამგეგმავი'
        }
      }
    ]
  },
  {
    id: 'module-2',
    number: 2,
    titleKa: 'დანაზოგი და ინფლაცია',
    titleEn: 'Savings & Inflation',
    descriptionKa: 'როგორ დავიცვათ დანაზოგი გაუფასურებისგან და როგორ მუშაობს რთული პროცენტი.',
    nodes: [
      {
        id: 'm2-n1',
        moduleId: 'module-2',
        titleKa: 'რატომ კარგავს ფული მსყიდველობით ძალას?',
        titleEn: 'How Does Inflation Affect Savings?',
        summaryKa: 'როგორ მოქმედებს ინფლაცია დანაზოგზე და რას ნიშნავს რეალური ღირებულება.',
        summaryEn: 'How inflation erodes purchasing power and what real return means.',
        level: 'Beginner',
        topic: 'ინფლაცია',
        nodeType: 'lesson',
        defaultStatus: 'current',
        readTimeMinutes: 4,
        xpReward: 20,
        recommendedCalculator: 'inflation',
        stages: {
          explanationKa: 'ინფლაცია ნიშნავს ფასების საერთო დონის ზრდას. თუ დანაზოგის ზრდა ინფლაციაზე დაბალია, თანხის მსყიდველობითი ძალა მცირდება.',
          explanationEn: 'Inflation is the general rise in prices. If your savings grow slower than inflation, your purchasing power shrinks.',
          exampleKa: 'თუ დღეს 100 ლარით გარკვეული რაოდენობის პროდუქტის შეძენა შეგიძლია, ფასების ზრდის შემდეგ იმავე თანხით ნაკლებს შეიძენ.',
          exampleEn: 'If 100 GEL buys a full basket of groceries today, after price increases the same 100 GEL buys fewer items.',
          question: {
            questionKa: 'თუ დეპოზიტის წლიური სარგებელი 8%-ია, ხოლო ინფლაცია 5%, დაახლოებით რა ხდება თანხის რეალურ ღირებულებასთან?',
            questionEn: 'If a deposit pays 8% annually and inflation is 5%, what happens to the real value of your money?',
            optionsKa: [
              'იზრდება დაახლოებით 3%-ით',
              'იზრდება ზუსტად 8%-ით',
              'მცირდება 5%-ით',
              'უცვლელი რჩება'
            ],
            optionsEn: [
              'Increases by approximately 3%',
              'Increases by exactly 8%',
              'Decreases by 5%',
              'Stays unchanged'
            ],
            correctIndex: 0,
            feedbackKa: 'სწორია! რეალური სარგებელი დაახლოებით უდრის ნომინალურ პროცენტს (8%) გამოკლებული ინფლაცია (5%), ანუ მსყიდველობითი ძალა იზრდება დაახლოებით 3%-ით.',
            feedbackEn: 'Correct! Real return is roughly nominal rate (8%) minus inflation (5%), so real purchasing power grows by ~3%.'
          },
          practiceExercise: {
            promptKa: 'შეადარეთ ნომინალური და რეალური (ინფლაციით კორექტირებული) ზრდა:',
            promptEn: 'Compare nominal growth with inflation-adjusted real value:',
            scenarioLabelKa: 'ინფლაციისა და დეპოზიტის შედარება',
            defaultAmount: 300,
            defaultRate: 8,
            defaultInflation: 5,
            defaultYears: 5,
            takeawayKa: 'ყოველთვის შეაფასეთ არა მხოლოდ ნომინალური პროცენტი, არამედ რეალური სარგებელი ინფლაციის გათვალისწინებით.'
          },
          achievementProgressTitleKa: 'ინფლაციის საფუძვლები'
        }
      },
      {
        id: 'm2-n2',
        moduleId: 'module-2',
        titleKa: 'მარტივი და რთული პროცენტი',
        titleEn: 'Simple vs Compound Interest',
        summaryKa: 'რა განსხვავებაა მარტივ და რთულ პროცენტს შორის გრძელვადიან დაგროვებაში.',
        summaryEn: 'The difference between simple and compound interest over time.',
        level: 'Beginner',
        topic: 'დანაზოგი',
        nodeType: 'lesson',
        defaultStatus: 'available',
        readTimeMinutes: 4,
        xpReward: 20,
        recommendedCalculator: 'compound',
        stages: {
          explanationKa: 'მარტივი პროცენტის დროს სარგებელი ერიცხება მხოლოდ საწყის თანხას. რთული პროცენტის დროს კი დარიცხული სარგებელი ემატება ძირ თანხას და მომდევნო პერიოდში პროცენტი უკვე გაზრდილ თანხაზე იანგარიშება.',
          explanationEn: 'Simple interest applies only to principal. Compound interest earns interest on previously accumulated interest.',
          exampleKa: '1,000 ლარი 10%-იანი რთული პროცენტით 1 წელში ხდება 1,100 ლარი, ხოლო მეორე წელს 10% ერიცხება უკვე 1,100 ლარს და ხდება 1,210 ლარი.',
          exampleEn: '1,000 GEL at 10% compound interest becomes 1,100 GEL in year 1, and 1,210 GEL in year 2.',
          question: {
            questionKa: 'რატომ იზრდება დანაზოგი უფრო სწრაფად რთული პროცენტის დროს?',
            questionEn: 'Why does savings grow faster with compound interest?',
            optionsKa: [
              'დაგროვილი პროცენტი თავადაც იწყებს ახალი პროცენტის გამომუშავებას',
              'ბანკი ყოველწლიურად აორმაგებს საპროცენტო განაკვეთს',
              'ინფლაცია ნულდება',
              'სახელმწიფო აზღვევს სავალუტო რისკს'
            ],
            optionsEn: [
              'Accumulated interest starts earning interest of its own',
              'The bank doubles the interest rate each year',
              'Inflation drops to zero',
              'Currency risk disappears'
            ],
            correctIndex: 0,
            feedbackKa: 'სწორია! სარგებლის რეინვესტირება ქმნის „თოვლის გუნდის ეფექტს“, რომელიც დროთა განმავლობაში აჩქარებს კაპიტალის ზრდას.',
            feedbackEn: 'Correct! Reinvested interest creates a snowball effect over longer periods.'
          },
          practiceExercise: {
            promptKa: 'გამოსცადეთ რთული პროცენტის ძალა სხვადასხვა ვადის შემთხვევაში:',
            promptEn: 'Test compound growth across different time horizons:',
            scenarioLabelKa: 'რთული პროცენტის სიმულაცია',
            defaultAmount: 250,
            defaultRate: 10,
            defaultInflation: 4,
            defaultYears: 10,
            takeawayKa: 'რაც უფრო ადრე იწყებთ დაგროვებას, მით უფრო დიდ სამუშაოს ასრულებს რთული პროცენტი თქვენს სასარგებლოდ.'
          },
          achievementProgressTitleKa: 'ინფლაციის მცოდნე'
        }
      },
      {
        id: 'm2-n3',
        moduleId: 'module-2',
        titleKa: 'დეპოზიტის რეალური შემოსავლიანობა',
        titleEn: 'Real Yield of Bank Deposits',
        summaryKa: 'როგორ შევაფასოთ ანაბრის პირობები, ვალუტა და რეალური სარგებელი.',
        summaryEn: 'Evaluating deposit terms, currency, and real yield.',
        level: 'Intermediate',
        topic: 'დანაზოგი',
        nodeType: 'lesson',
        defaultStatus: 'available',
        readTimeMinutes: 4,
        xpReward: 20,
        recommendedCalculator: 'deposit',
        stages: {
          explanationKa: 'საბანკო დეპოზიტის არჩევისას მნიშვნელოვანია ყურადღება მიაქციოთ ეფექტურ საპროცენტო განაკვეთს, დეპოზიტის ტიპს (ვადიანი თუ შეგროვებადი) და ინფლაციის დონეს.',
          explanationEn: 'When choosing a deposit, examine the effective interest rate, deposit type, and inflation.',
          exampleKa: 'თუ ვადიან დეპოზიტზე წლიური განაკვეთია 10.5%, ხოლო წლიური ინფლაცია 4%, თქვენი დანაზოგის რეალური მსყიდველობითი ძალა წელიწადში დაახლოებით 6.25%-ით იზრდება.',
          exampleEn: 'At 10.5% nominal deposit rate and 4% inflation, real purchasing power grows ~6.25% per year.',
          question: {
            questionKa: 'რა შემთხვევაში იზრდება დეპოზიტზე განთავსებული თანხის რეალური მსყიდველობითი ძალა?',
            questionEn: 'When does the real purchasing power of a deposit increase?',
            optionsKa: [
              'როდესაც დეპოზიტის წმინდა სარგებელი აღემატება ინფლაციის მაჩვენებელს',
              'როდესაც ინფლაცია დეპოზიტის პროცენტზე მაღალია',
              'ნებისმიერ შემთხვევაში, თუ თანხა ბანკში დევს',
              'მხოლოდ მაშინ, როცა თანხა ნაღდი სახით ინახება'
            ],
            optionsEn: [
              'When net deposit yield exceeds the inflation rate',
              'When inflation is higher than deposit yield',
              'Always, regardless of rates',
              'Only when kept in physical cash'
            ],
            correctIndex: 0,
            feedbackKa: 'სწორია! რეალური ზრდა მიიღწევა მაშინ, როცა სარგებელი აჭარბებს ფასების ზრდის ტემპს.',
            feedbackEn: 'Correct! Real wealth grows when yield outpaces inflation.'
          },
          practiceExercise: {
            promptKa: 'შეადარეთ დეპოზიტის ნომინალური და რეალური შედეგი:',
            promptEn: 'Compare nominal and real deposit outcomes:',
            scenarioLabelKa: 'დეპოზიტის რეალური სარგებელი',
            defaultAmount: 300,
            defaultRate: 10,
            defaultInflation: 4.5,
            defaultYears: 5,
            takeawayKa: 'შეგროვებადი ანაბარი იდეალური ინსტრუმენტია საგანგებო ფონდისა და მოკლევადიანი მიზნებისთვის.'
          },
          achievementProgressTitleKa: 'ინფლაციის მცოდნე'
        }
      },
      {
        id: 'm2-n4',
        moduleId: 'module-2',
        titleKa: 'ინფლაციის პრაქტიკული სიმულაცია',
        titleEn: 'Practical Inflation Simulation',
        summaryKa: 'პრაქტიკული სავარჯიშო: სახლში შენახული ფული vs ანაბარი.',
        summaryEn: 'Hands-on simulation: Cash at home vs interest-bearing account.',
        level: 'Beginner',
        topic: 'ინფლაცია',
        nodeType: 'practice',
        defaultStatus: 'locked',
        readTimeMinutes: 4,
        xpReward: 25,
        recommendedCalculator: 'inflation',
        stages: {
          explanationKa: 'საქართველოში მოსახლეობის მნიშვნელოვანი ნაწილი დანაზოგს კვლავ ნაღდი ფულის სახით ინახავს. პრაქტიკული შედარება გვიჩვენებს, რა სხვაობას ქმნის თუნდაც კონსერვატიული საპროცენტო სარგებელი 5–10 წლის განმავლობაში.',
          explanationEn: 'Comparing idle cash against an interest-bearing deposit over 5–10 years reveals a dramatic gap.',
          exampleKa: '10,000 ლარი სახლში 6%-იანი ინფლაციის დროს 5 წელში რეალურად უტოლდება ~7,473 ლარის მსყიდველობით ძალას, მაშინ როცა 9%-იან ანაბარზე ის ნომინალურად 15,386 ლარი ხდება.',
          exampleEn: '10,000 GEL in cash loses ~25% buying power over 5 years at 6% inflation.',
          question: {
            questionKa: 'რა არის მთავარი ფინანსური დანაკარგი თანხის სახლში უმოქმედოდ შენახვისას?',
            questionEn: 'What is the main financial loss of keeping idle cash at home?',
            optionsKa: [
              'მსყიდველობითი ძალის კლება ინფლაციის გამო და მიუღებელი საპროცენტო სარგებელი',
              'ბანკის საკომისიოს გადახდა',
              'საშემოსავლო გადასახადის ზრდა',
              'საკრედიტო ქულის შემცირება'
            ],
            optionsEn: [
              'Loss of purchasing power to inflation plus missed interest',
              'Paying bank fees',
              'Higher income tax',
              'Lower credit score'
            ],
            correctIndex: 0,
            feedbackKa: 'სწორია! უმოქმედო ნაღდი ფული ერთდროულად კარგავს მსყიდველობით ძალას და გაშვებულ სარგებელს (ალტერნატიულ დანახარჯს).',
            feedbackEn: 'Correct! Idle cash suffers both inflation erosion and opportunity cost.'
          },
          practiceExercise: {
            promptKa: 'შეცვალეთ ინფლაციისა და სარგებლის მაჩვენებლები შედეგის სანახავად:',
            promptEn: 'Adjust inflation and return rates to observe the real impact:',
            scenarioLabelKa: 'ინფლაციის პრაქტიკული მოდელირება',
            defaultAmount: 500,
            defaultRate: 9.5,
            defaultInflation: 5.5,
            defaultYears: 6,
            takeawayKa: 'ინფლაციისგან დაცვის პირველი ნაბიჯი ფულის უსაფრთხო სარგებლიან ინსტრუმენტში განთავსებაა.'
          },
          achievementProgressTitleKa: 'ინფლაციის მცოდნე'
        }
      },
      {
        id: 'm2-n5',
        moduleId: 'module-2',
        titleKa: 'მოდულის ტესტი',
        titleEn: 'Module 2 Quiz',
        summaryKa: 'შეამოწმეთ დანაზოგისა და ინფლაციის მოდულში მიღებული ცოდნა.',
        summaryEn: 'Test your knowledge of savings and inflation.',
        level: 'Intermediate',
        topic: 'ინფლაცია',
        nodeType: 'quiz',
        defaultStatus: 'locked',
        readTimeMinutes: 3,
        xpReward: 30,
        recommendedCalculator: 'compound',
        stages: {
          explanationKa: 'მეორე მოდულის შეჯამება: ინფლაცია, რეალური შემოსავლიანობა და რთული პროცენტის მექანიზმი.',
          explanationEn: 'Module 2 summary: Inflation, real return, and compound interest.',
          exampleKa: 'თუ ნომინალური სარგებელია 11%, ხოლო ინფლაცია 4%, რეალური ზრდა დადებითია და თქვენი კაპიტალი რეალურად იზრდება.',
          exampleEn: 'With 11% nominal return and 4% inflation, your real wealth expands.',
          question: {
            questionKa: 'რომელი ფორმულა ასახავს სწორად რეალური შემოსავლიანობის არსს?',
            questionEn: 'Which concept accurately captures real return?',
            optionsKa: [
              'ნომინალური სარგებელი კორექტირებული ინფლაციის მაჩვენებლით',
              'მხოლოდ ბანკის მიერ რეკლამირებული პროცენტი',
              'ინფლაციას დამატებული საბანკო საკომისიო',
              'საწყისი თანხა გაყოფილი თვეების რაოდენობაზე'
            ],
            optionsEn: [
              'Nominal return adjusted for inflation',
              'Only the advertised bank rate',
              'Inflation plus bank fees',
              'Principal divided by months'
            ],
            correctIndex: 0,
            feedbackKa: 'სწორია! რეალური შემოსავლიანობა ითვალისწინებს ინფლაციის გავლენას: ((1 + ნომინალური) / (1 + ინფლაცია)) - 1.',
            feedbackEn: 'Correct! Real return adjusts nominal return for inflation.'
          },
          practiceExercise: {
            promptKa: 'გადაამოწმეთ თქვენი 10-წლიანი გეგმა რეალურ გამოხატულებაში:',
            promptEn: 'Verify a 10-year plan in real inflation-adjusted terms:',
            scenarioLabelKa: 'მოდული 2-ის ფინალური სიმულაცია',
            defaultAmount: 350,
            defaultRate: 10,
            defaultInflation: 4,
            defaultYears: 10,
            takeawayKa: 'გილოცავთ! თქვენ დაეუფლეთ დანაზოგისა და ინფლაციის ძირითად პრინციპებს.'
          },
          achievementProgressTitleKa: 'ინფლაციის მცოდნე'
        }
      }
    ]
  },
  {
    id: 'module-3',
    number: 3,
    titleKa: 'რისკი და ინვესტირება',
    titleEn: 'Risk & Investing',
    descriptionKa: 'რისკისა და სარგებლის კავშირი, აქციები, ობლიგაციები და დივერსიფიკაცია.',
    nodes: [
      {
        id: 'm3-n1',
        moduleId: 'module-3',
        titleKa: 'რისკი და მოსალოდნელი შემოსავალი',
        titleEn: 'Risk & Expected Return',
        summaryKa: 'რატომ უკავშირდება მაღალი პოტენციური სარგებელი უფრო მაღალ მერყეობას.',
        summaryEn: 'Why higher potential return comes with higher volatility.',
        level: 'Intermediate',
        topic: 'ინვესტირება',
        nodeType: 'lesson',
        defaultStatus: 'locked',
        readTimeMinutes: 4,
        xpReward: 25,
        recommendedCalculator: 'compound',
        stages: {
          explanationKa: 'ფინანსურ ბაზრებზე რისკი და მოსალოდნელი სარგებელი პირდაპირ კავშირშია. დაბალრისკიანი ინსტრუმენტები (მაგ. დეპოზიტი, სახელმწიფო ობლიგაცია) გვთავაზობს სტაბილურ, მაგრამ ზომიერ სარგებელს, ხოლო მაღალრისკიანი აქტივები — მეტ მერყეობას.',
          explanationEn: 'Risk and expected return go hand in hand in financial markets.',
          exampleKa: 'თუ თანხა 6 თვეში გჭირდებათ სწავლის საფასურისთვის, მაღალი რისკის აღება საფრთხეს უქმნის მიზანს.',
          exampleEn: 'Money needed in 6 months for tuition should not be exposed to stock market swings.',
          question: {
            questionKa: 'რა ოქროს წესი მოქმედებს რისკსა და მოსალოდნელ სარგებელს შორის?',
            questionEn: 'What fundamental rule links risk and expected return?',
            optionsKa: [
              'უფრო მაღალი მოსალოდნელი სარგებელი, როგორც წესი, დაკავშირებულია უფრო მაღალ რისკთან',
              'მაღალი სარგებელი ყოველთვის უriskოა',
              'რისკი საერთოდ არ ახდენს გავლენას შედეგზე',
              'დაბალი რისკი ნიშნავს გარანტირებულ 50%-იან მოგებას'
            ],
            optionsEn: [
              'Higher potential return generally entails higher risk',
              'High returns are always risk-free',
              'Risk has no relation to return',
              'Low risk guarantees 50% profit'
            ],
            correctIndex: 0,
            feedbackKa: 'სწორია! ნებისმიერი დაპირება „მაღალ და გარანტირებულ უriskო სარგებელზე“ საფრთხის ნიშანია.',
            feedbackEn: 'Correct! High return promises with "zero risk" are a major warning sign.'
          },
          practiceExercise: {
            promptKa: 'შეადარეთ კონსერვატიული და ზომიერი ზრდის სცენარი:',
            promptEn: 'Compare conservative vs moderate growth scenarios:',
            scenarioLabelKa: 'რისკისა და სარგებლის სიმულაცია',
            defaultAmount: 300,
            defaultRate: 9,
            defaultInflation: 4,
            defaultYears: 7,
            takeawayKa: 'ინსტრუმენტის რისკი ყოველთვის უნდა შეესაბამებოდეს თქვენი მიზნის ვადას.'
          },
          achievementProgressTitleKa: 'ინფლაციის მცოდნე'
        }
      },
      {
        id: 'm3-n2',
        moduleId: 'module-3',
        titleKa: 'აქციები და ობლიგაციები',
        titleEn: 'Stocks & Bonds',
        summaryKa: 'რა განსხვავებაა კომპანიის წილსა (აქცია) და სესხის ფასიან ქაღალდს (ობლიგაცია) შორის.',
        summaryEn: 'The difference between equity ownership (stocks) and debt instruments (bonds).',
        level: 'Intermediate',
        topic: 'ინვესტირება',
        nodeType: 'lesson',
        defaultStatus: 'locked',
        readTimeMinutes: 5,
        xpReward: 25,
        recommendedCalculator: 'compound',
        stages: {
          explanationKa: 'ობლიგაცია არის სესხის ფასიანი ქაღალდი — თქვენ ასესხებთ თანხას სახელმწიფოს ან კომპანიას და იღებთ წინასწარ ცნობილ კუპონს (პროცენტს). აქცია კი კომპანიის საკუთრების მცირე წილია, რომლის ფასიც კომპანიის წარმატებასთან ერთად იცვლება.',
          explanationEn: 'A bond is a loan paying fixed interest; a stock represents partial ownership in a company.',
          exampleKa: 'სახელმწიფო სახაზინო ობლიგაცია იძლევა პროგნოზირებად სარგებელს, ხოლო მსოფლიო საფონდო ინდექსის (ETF) ფლობა გაძლევთ წილს ასობით კომპანიაში.',
          exampleEn: 'Treasury bonds offer predictable income, while broad index ETFs offer long-term equity growth.',
          question: {
            questionKa: 'რა არის ძირითადი განსხვავება აქციასა და ობლიგაციას შორის?',
            questionEn: 'What is the main difference between a stock and a bond?',
            optionsKa: [
              'აქცია კომპანიის წილია, ხოლო ობლიგაცია — სასესხო ვალდებულება ფიქსირებული პირობით',
              'აქცია საბანკო ანაბარია, ობლიგაცია კი — ნაღდი ფული',
              'ორივე ზუსტად ერთი და იგივეა',
              'ობლიგაციას მხოლოდ მაღაზიები უშვებენ'
            ],
            optionsEn: [
              'A stock is company ownership; a bond is a debt instrument',
              'A stock is a bank deposit; a bond is cash',
              'They are identical',
              'Only grocery stores issue bonds'
            ],
            correctIndex: 0,
            feedbackKa: 'სწორია! ობლიგაცია სტაბილურობას მატებს პორტფელს, ხოლო აქცია — გრძელვადიანი ზრდის პოტენციალს.',
            feedbackEn: 'Correct! Bonds provide stability while equities drive long-term growth.'
          },
          practiceExercise: {
            promptKa: 'ნახეთ დაბალანსებული პორტფელის გრძელვადიანი პროგნოზი:',
            promptEn: 'Simulate a balanced portfolio over time:',
            scenarioLabelKa: 'ობლიგაციებისა და აქციების ბალანსი',
            defaultAmount: 400,
            defaultRate: 9.5,
            defaultInflation: 4,
            defaultYears: 10,
            takeawayKa: 'აქციებისა და ობლიგაციების შეხამება აბალანსებს რისკსა და სტაბილურობას.'
          },
          achievementProgressTitleKa: 'ინფლაციის მცოდნე'
        }
      },
      {
        id: 'm3-n3',
        moduleId: 'module-3',
        titleKa: 'დივერსიფიკაცია',
        titleEn: 'Diversification',
        summaryKa: 'როგორ ამცირებს თანხის გადანაწილება ერთი კონკრეტული აქტივის რისკს.',
        summaryEn: 'How spreading capital across assets reduces concentration risk.',
        level: 'Intermediate',
        topic: 'ინვესტირება',
        nodeType: 'lesson',
        defaultStatus: 'locked',
        readTimeMinutes: 4,
        xpReward: 25,
        recommendedCalculator: 'compound',
        stages: {
          explanationKa: 'დივერსიფიკაცია ნიშნავს დანაზოგის გადანაწილებას სხვადასხვა ინსტრუმენტსა და დარგში. თუ ერთი მიმართულება დროებით შემცირდება, სხვა სტაბილური აქტივები აბალანსებს მთლიან შედეგს.',
          explanationEn: 'Diversification spreads capital across different asset types so one setback does not sink everything.',
          exampleKa: 'მთელი თანხის ერთ კომპანიაში ჩადების ნაცვლად, გონივრულია გადანაწილება ანაბარზე, სახელმწიფო ობლიგაციებსა და მრავალფეროვან ინდექსურ ფონდში.',
          exampleEn: 'Instead of betting on a single stock, spread savings across deposits, bonds, and broad funds.',
          question: {
            questionKa: 'რას ემსახურება საინვესტიციო პორტფელის დივერსიფიკაცია?',
            questionEn: 'What is the primary goal of portfolio diversification?',
            optionsKa: [
              'რისკის შემცირებას თანხის სხვადასხვა აქტივში გადანაწილებით',
              'ყველა დანაზოგის ერთ აქციაში დაბანდებას',
              'საბანკო გადასახადების თავიდან არიდებას',
              'სწრაფ გამდიდრებას 1 კვირაში'
            ],
            optionsEn: [
              'Reducing risk by spreading money across diverse assets',
              'Putting all money into one stock',
              'Avoiding bank fees',
              'Getting rich in one week'
            ],
            correctIndex: 0,
            feedbackKa: 'სწორია! დივერსიფიკაცია იცავს თქვენს კაპიტალს ერთი კონკრეტული აქტივის ვარდნისგან.',
            feedbackEn: 'Correct! Diversification shields your wealth from single-asset shocks.'
          },
          practiceExercise: {
            promptKa: 'გამოთვალეთ დივერსიფიცირებული დანაზოგის სტაბილური ზრდა:',
            promptEn: 'Calculate steady growth of a diversified plan:',
            scenarioLabelKa: 'დივერსიფიცირებული დაგროვება',
            defaultAmount: 350,
            defaultRate: 9,
            defaultInflation: 4,
            defaultYears: 8,
            takeawayKa: 'დივერსიფიკაცია არის ყველაზე მარტივი და უფასო დაზღვევა ფინანსებში.'
          },
          achievementProgressTitleKa: 'ინფლაციის მცოდნე'
        }
      },
      {
        id: 'm3-n4',
        moduleId: 'module-3',
        titleKa: 'საინვესტიციო პორტფელის საფუძვლები',
        titleEn: 'Portfolio Fundamentals',
        summaryKa: 'როგორ იქმნება დაბალანსებული პორტფელი ასაკისა და მიზნების მიხედვით.',
        summaryEn: 'Constructing a balanced portfolio based on horizon and goals.',
        level: 'Advanced',
        topic: 'ინვესტირება',
        nodeType: 'practice',
        defaultStatus: 'locked',
        readTimeMinutes: 5,
        xpReward: 25,
        recommendedCalculator: 'compound',
        stages: {
          explanationKa: 'პორტფელი არის თქვენი ყველა ფინანსური აქტივის ერთობლიობა. მისი სტრუქტურა დამოკიდებულია თქვენს დროის ჰორიზონტსა და რისკის მიმღებლობაზე.',
          explanationEn: 'A portfolio is your complete collection of financial assets tailored to your horizon.',
          exampleKa: 'მოკლევადიანი მიზნისთვის (1–2 წელი) პორტფელის უდიდესი ნაწილი ლიკვიდურ ანაბარზეა, ხოლო 15-წლიანი საპენსიო მიზნისთვის — მზარდ ინსტრუმენტებში.',
          exampleEn: 'Short-term goals stay in liquid deposits; 15-year goals can include growth assets.',
          question: {
            questionKa: 'რა ფაქტორია ყველაზე მნიშვნელოვანი საინვესტიციო პორტფელის შედგენისას?',
            questionEn: 'What factor is most important when structuring a portfolio?',
            optionsKa: [
              'მიზნის ვადა (დროის ჰორიზონტი) და პირადი რისკის მიმღებლობა',
              'მეზობლის რჩევა',
              'სოციალურ ქსელში ნანახი რეკლამა',
              'მხოლოდ გუშინდელი ფასის ცვლილება'
            ],
            optionsEn: [
              'Goal time horizon and personal risk tolerance',
              'A neighbor’s tip',
              'Social media ads',
              'Yesterday’s price movement'
            ],
            correctIndex: 0,
            feedbackKa: 'სწორია! პორტფელი ყოველთვის თქვენს პირად ვადებსა და სიმშვიდეზე უნდა იყოს მორგებული.',
            feedbackEn: 'Correct! Your timeline and risk comfort always dictate allocation.'
          },
          practiceExercise: {
            promptKa: 'გამოსცადეთ გრძელვადიანი პორტფელის სიმულაცია:',
            promptEn: 'Simulate a long-term portfolio:',
            scenarioLabelKa: 'პორტფელის სიმულაცია',
            defaultAmount: 500,
            defaultRate: 10,
            defaultInflation: 4,
            defaultYears: 12,
            takeawayKa: 'გაზრდილი ჰორიზონტი ამცირებს მოკლევადიანი რყევების გავლენას.'
          },
          achievementProgressTitleKa: 'ინფლაციის მცოდნე'
        }
      },
      {
        id: 'm3-n5',
        moduleId: 'module-3',
        titleKa: 'მოდულის ტესტი',
        titleEn: 'Module 3 Quiz',
        summaryKa: 'შეამოწმეთ რისკისა და ინვესტირების მოდულის ცოდნა.',
        summaryEn: 'Check your understanding of risk and investing.',
        level: 'Intermediate',
        topic: 'ინვესტირება',
        nodeType: 'quiz',
        defaultStatus: 'locked',
        readTimeMinutes: 3,
        xpReward: 30,
        recommendedCalculator: 'compound',
        stages: {
          explanationKa: 'მესამე მოდულის შეჯამება: რისკისა და სარგებლის ბალანსი, აქციები, ობლიგაციები და დივერსიფიკაცია.',
          explanationEn: 'Module 3 recap: Risk/return trade-off, stocks, bonds, and diversification.',
          exampleKa: 'გონიერი ინვესტორი არასდროს დებს საგანგებო ფონდს სარისკო აქტივებში.',
          exampleEn: 'A prudent investor never puts emergency reserves into volatile assets.',
          question: {
            questionKa: 'თუ თანხა გჭირდებათ 1 წელიწადში აუცილებელი მიზნისთვის, რომელი გადაწყვეტილებაა ყველაზე გონივრული?',
            questionEn: 'If you need money in 1 year for an essential goal, what is wisest?',
            optionsKa: [
              'დაბალრისკიანი საბანკო დეპოზიტი ან მოკლევადიანი სახაზინო ვალდებულება',
              'მაღალი მერყეობის აქციები',
              'უცნობი კრიპტო-პროექტი',
              'სესხის აღება ინვესტირებისთვის'
            ],
            optionsEn: [
              'Low-risk bank deposit or short-term treasury',
              'High-volatility stocks',
              'Unknown crypto tokens',
              'Borrowing money to trade'
            ],
            correctIndex: 0,
            feedbackKa: 'სწორია! მოკლევადიანი მიზნებისთვის მთავარია კაპიტალის გარანტირებული შენარჩუნება.',
            feedbackEn: 'Correct! Short horizons prioritize principal preservation.'
          },
          practiceExercise: {
            promptKa: 'შეაფასეთ მოკლევადიანი და გრძელვადიანი გეგმა:',
            promptEn: 'Evaluate your plan:',
            scenarioLabelKa: 'მოდული 3-ის შეჯამება',
            defaultAmount: 400,
            defaultRate: 9.5,
            defaultInflation: 4,
            defaultYears: 6,
            takeawayKa: 'თქვენ წარმატებით დაასრულეთ რისკისა და ინვესტირების მოდული!'
          },
          achievementProgressTitleKa: 'ინფლაციის მცოდნე'
        }
      }
    ]
  },
  {
    id: 'module-4',
    number: 4,
    titleKa: 'გრძელვადიანი დაგეგმვა',
    titleEn: 'Long-Term Planning',
    descriptionKa: 'საგანგებო ფონდი, დაგროვებითი საპენსიო სისტემა და ფინანსური მიზნების მიღწევა.',
    nodes: [
      {
        id: 'm4-n1',
        moduleId: 'module-4',
        titleKa: 'ფინანსური მიზნების დაგეგმვა',
        titleEn: 'Planning Financial Goals',
        summaryKa: 'როგორ ვაქციოთ სურვილი გაზომვად ფინანსურ გეგმად (თანხა, ვადა, თვიური შენატანი).',
        summaryEn: 'Turning wishes into measurable targets with clear timelines.',
        level: 'Beginner',
        topic: 'დაგეგმვა',
        nodeType: 'lesson',
        defaultStatus: 'locked',
        readTimeMinutes: 4,
        xpReward: 20,
        recommendedCalculator: 'goal',
        stages: {
          explanationKa: 'ფინანსური მიზანი უნდა იყოს კონკრეტული და გაზომვადი: ზუსტი სამიზნე თანხა, მკაფიო ვადა და ყოველთვიურად გადასადები თანხა.',
          explanationEn: 'A financial goal needs an exact target amount, deadline, and monthly contribution.',
          exampleKa: '„მინდა თანხის შეგროვება“ სურვილია, ხოლო „24 თვეში მჭირდება 12,000 ლარი, ამიტომ თვეში გადავდებ 500 ლარს“ — უკვე ფინანსური გეგმაა.',
          exampleEn: 'Saving 500 GEL/month for 24 months to reach 12,000 GEL is a concrete plan.',
          question: {
            questionKa: 'რა აქცევს ფინანსურ სურვილს რეალურ გეგმად?',
            questionEn: 'What turns a financial wish into an actionable plan?',
            optionsKa: [
              'კონკრეტული სამიზნე თანხის, ვადის და ყოველთვიური შენატანის განსაზღვრა',
              'მხოლოდ სურვილის ჩაწერა ბლოკნოტში',
              'ლატარიის ბილეთის შეძენა',
              'დაგროვების გადადება მომავალი წლისთვის'
            ],
            optionsEn: [
              'Defining exact target amount, timeline, and monthly contribution',
              'Writing a wish in a notebook',
              'Buying a lottery ticket',
              'Postponing until next year'
            ],
            correctIndex: 0,
            feedbackKa: 'სწორია! როცა დიდი მიზანი ყოველთვიურ მცირე ნაბიჯებად იშლება, მისი მიღწევა ბევრად მარტივდება.',
            feedbackEn: 'Correct! Breaking a big goal into monthly steps makes it achievable.'
          },
          practiceExercise: {
            promptKa: 'გამოთვალეთ თქვენი მიზნის მისაღწევად საჭირო ყოველთვიური ტემპი:',
            promptEn: 'Simulate reaching your financial goal:',
            scenarioLabelKa: 'მიზნის დაგეგმვის სიმულაცია',
            defaultAmount: 500,
            defaultRate: 9,
            defaultInflation: 4,
            defaultYears: 3,
            takeawayKa: 'მკაფიო გეგმა ანახევრებს გზას მიზნამდე.'
          },
          achievementProgressTitleKa: 'მიზნების შემქმნელი'
        }
      },
      {
        id: 'm4-n2',
        moduleId: 'module-4',
        titleKa: 'დაგროვებითი საპენსიო სისტემა',
        titleEn: 'Accumulative Pension System',
        summaryKa: 'როგორ მუშაობს 2% + 2% + 2% მოდელი და რატომ არის თანადაფინანსება მნიშვნელოვანი.',
        summaryEn: 'How the 2+2+2 matching model works in Georgia.',
        level: 'Intermediate',
        topic: 'დაგეგმვა',
        nodeType: 'lesson',
        defaultStatus: 'locked',
        readTimeMinutes: 4,
        xpReward: 25,
        recommendedCalculator: 'pension',
        stages: {
          explanationKa: 'დაგროვებით საპენსიო სისტემაში დასაქმებულის ხელფასიდან მიემართება 2%, რასაც ემატება დამსაქმებლის 2% და სახელმწიფოს თანამონაწილეობა (1–2%). შედეგად, თქვენს პირად შენატანს მაშინვე ემატება თანადაფინანსება.',
          explanationEn: 'Your 2% salary contribution is matched by 2% from your employer and up to 2% from the state.',
          exampleKa: 'თუ თქვენი პირადი შენატანი თვეში 50 ლარია, დამსაქმებლისა და სახელმწიფოს თანამონაწილეობით ანგარიშზე ყოველთვიურად 150 ლარი გროვდება და რთული პროცენტით იზრდება.',
          exampleEn: 'A 50 GEL personal contribution becomes 150 GEL/month into your pension account.',
          question: {
            questionKa: 'რა არის დაგროვებითი საპენსიო სისტემის (2+2+2) მთავარი ფინანსური უპირატესობა?',
            questionEn: 'What is the main financial advantage of the 2+2+2 pension scheme?',
            optionsKa: [
              'დამსაქმებლისა და სახელმწიფოს თანადაფინანსება + გრძელვადიანი რთული პროცენტი',
              'თანხის ყოველდღიური განაღდება ბანკომატიდან',
              'საბანკო სესხების განულება',
              'უფასო სამოგზაურო დაზღვევა'
            ],
            optionsEn: [
              'Employer and state co-funding plus long-term compounding',
              'Daily ATM cash withdrawals',
              'Automatic loan forgiveness',
              'Free travel insurance'
            ],
            correctIndex: 0,
            feedbackKa: 'სწორია! თანადაფინანსება ნიშნავს, რომ თქვენს ყოველ დაზოგილ ლარს დამატებით ემატება დამსაქმებლისა და სახელმწიფოს წილი.',
            feedbackEn: 'Correct! Matching contributions multiply your personal savings rate from day one.'
          },
          practiceExercise: {
            promptKa: 'ნახეთ საპენსიო დანაზოგის გრძელვადიანი ზრდა:',
            promptEn: 'Simulate long-term pension accumulation:',
            scenarioLabelKa: 'საპენსიო დაგროვების სიმულაცია',
            defaultAmount: 180,
            defaultRate: 8,
            defaultInflation: 4,
            defaultYears: 20,
            takeawayKa: 'გრძელვადიანი ჰორიზონტი და თანადაფინანსება ქმნის საიმედო საპენსიო კაპიტალს.'
          },
          achievementProgressTitleKa: 'მიზნების შემქმნელი'
        }
      },
      {
        id: 'm4-n3',
        moduleId: 'module-4',
        titleKa: 'საგანგებო ფონდი',
        titleEn: 'Emergency Fund',
        summaryKa: 'რამდენი თვის ხარჯი უნდა შეინახოთ საგანგებო რეზერვში და სად განათავსოთ ის.',
        summaryEn: 'How many months of expenses to hold in your emergency buffer.',
        level: 'Beginner',
        topic: 'დაგეგმვა',
        nodeType: 'lesson',
        defaultStatus: 'available',
        readTimeMinutes: 4,
        xpReward: 20,
        recommendedCalculator: 'savings',
        stages: {
          explanationKa: 'საგანგებო ფონდი არის თქვენი ფინანსური უსაფრთხოების ბალიში. რეკომენდებულია მასში ინახებოდეს 3-დან 6 თვემდე აუცილებელი საცხოვრებელი ხარჯის ოდენობა, რათა გაუთვალისწინებელ დროს არ დაგჭირდეთ ძვირი სესხის აღება.',
          explanationEn: 'An emergency fund holds 3 to 6 months of essential living expenses in a safe, liquid account.',
          exampleKa: 'თუ თქვენი აუცილებელი თვიური ხარჯი 1,500 ლარია, 3-თვიანი საგანგებო ფონდი 4,500 ლარია, ხოლო 6-თვიანი — 9,000 ლარი.',
          exampleEn: 'If essential monthly costs are 1,500 GEL, a 3-month buffer is 4,500 GEL.',
          question: {
            questionKa: 'რამდენი თვის აუცილებელი ხარჯის შენახვაა რეკომენდებული საგანგებო ფონდში?',
            questionEn: 'How many months of essential expenses are recommended in an emergency fund?',
            optionsKa: [
              '3-დან 6 თვემდე აუცილებელი ხარჯი',
              'მხოლოდ 1 კვირის ხარჯი',
              '10 წლის სრული ხელფასი',
              'საგანგებო ფონდი საჭირო არ არის'
            ],
            optionsEn: [
              '3 to 6 months of essential expenses',
              'Only 1 week of expenses',
              '10 years of salary',
              'No emergency fund is needed'
            ],
            correctIndex: 0,
            feedbackKa: 'სწორია! 3–6 თვის აუცილებელი ხარჯების რეზერვი გიცავთ ფინანსური სტრესისა და დაუგეგმავი ვალებისგან.',
            feedbackEn: 'Correct! A 3–6 month reserve protects you from unexpected shocks.'
          },
          practiceExercise: {
            promptKa: 'გამოთვალეთ, რა დროში შეივსება თქვენი საგანგებო ფონდი:',
            promptEn: 'See how quickly your emergency fund builds up:',
            scenarioLabelKa: 'საგანგებო ფონდის შევსება',
            defaultAmount: 400,
            defaultRate: 9,
            defaultInflation: 4,
            defaultYears: 2,
            takeawayKa: 'საგანგებო ფონდი უნდა ინახებოდეს უსაფრთხო და ადვილად ხელმისაწვდომ შემნახველ ანგარიშზე.'
          },
          achievementProgressTitleKa: 'მიზნების შემქმნელი'
        }
      },
      {
        id: 'm4-n4',
        moduleId: 'module-4',
        titleKa: 'გრძელვადიანი ფინანსური გეგმა',
        titleEn: 'Long-Term Financial Roadmap',
        summaryKa: 'როგორ დავაკავშიროთ მოკლე, საშუალო და გრძელვადიანი მიზნები ერთიან სისტემაში.',
        summaryEn: 'Connecting short-, medium-, and long-term milestones.',
        level: 'Intermediate',
        topic: 'დაგეგმვა',
        nodeType: 'practice',
        defaultStatus: 'locked',
        readTimeMinutes: 5,
        xpReward: 25,
        recommendedCalculator: 'goal',
        stages: {
          explanationKa: 'გრძელვადიანი გეგმა აერთიანებს სამ ჰორიზონტს: 1) მოკლევადიანი უსაფრთხოება (საგანგებო ფონდი), 2) საშუალოვადიანი მიზნები (განათლება, უძრავი ქონება) და 3) გრძელვადიანი დამოუკიდებლობა (საპენსიო კაპიტალი).',
          explanationEn: 'A complete roadmap aligns short-term safety, medium-term milestones, and long-term retirement.',
          exampleKa: 'როცა საგანგებო ფონდი შევსებულია, ყოველთვიური დანაზოგის ნაწილი გადადის საშუალო და გრძელვადიან მიზნებზე.',
          exampleEn: 'Once the emergency buffer is funded, monthly savings flow into multi-year goals.',
          question: {
            questionKa: 'რომელი ნაბიჯით უნდა დაიწყოს გრძელვადიანი ფინანსური დაგეგმვა?',
            questionEn: 'What is the foundational first step of long-term financial planning?',
            optionsKa: [
              'ბიუჯეტის მოწესრიგებით და საგანგებო ფონდის შექმნით',
              'მაღალრისკიანი აქციების სესხით შეძენით',
              'მხოლოდ 30 წლის შემდგომი გეგმით მიმდინარე რეზერვის გარეშე',
              'ყველა დანაზოგის დახარჯვით'
            ],
            optionsEn: [
              'Organizing the budget and establishing an emergency fund',
              'Buying risky stocks on margin',
              'Ignoring short-term reserves',
              'Spending all savings'
            ],
            correctIndex: 0,
            feedbackKa: 'სწორია! საგანგებო ფონდი არის საძირკველი, რომელზეც შენდება ყველა მომდევნო ფინანსური მიზანი.',
            feedbackEn: 'Correct! A solid emergency reserve is the foundation for all longer-term investing.'
          },
          practiceExercise: {
            promptKa: 'დაგეგმეთ 10-წლიანი კაპიტალის ზრდა:',
            promptEn: 'Model a 10-year wealth plan:',
            scenarioLabelKa: '10-წლიანი ფინანსური გეგმა',
            defaultAmount: 450,
            defaultRate: 9.5,
            defaultInflation: 4,
            defaultYears: 10,
            takeawayKa: 'თანმიმდევრულობა ბევრად მნიშვნელოვანია, ვიდრე ერთჯერადი დიდი შენატანი.'
          },
          achievementProgressTitleKa: 'მიზნების შემქმნელი'
        }
      },
      {
        id: 'm4-n5',
        moduleId: 'module-4',
        titleKa: 'საბოლოო ცოდნის შეფასება',
        titleEn: 'Final Knowledge Assessment',
        summaryKa: 'შემაჯამებელი ტესტი მთლიანი სასწავლო გზის შესაფასებლად.',
        summaryEn: 'Comprehensive final assessment across all four modules.',
        level: 'Advanced',
        topic: 'დაგეგმვა',
        nodeType: 'quiz',
        defaultStatus: 'locked',
        readTimeMinutes: 5,
        xpReward: 40,
        recommendedCalculator: 'compound',
        stages: {
          explanationKa: 'საბოლოო შეფასება აერთიანებს ბიუჯეტირებას, ინფლაციისგან დაცვას, რთულ პროცენტს, დივერსიფიკაციასა და გრძელვადიან დაგეგმვას.',
          explanationEn: 'Final assessment covering budgeting, inflation protection, compounding, and goal planning.',
          exampleKa: 'ინფორმირებული გადაწყვეტილება ეფუძნება გათვლას, რეალურ სარგებელსა და რისკების გააზრებას.',
          exampleEn: 'Informed decisions rely on real math, inflation awareness, and diversification.',
          question: {
            questionKa: 'რა არის ფინანსურად ყველაზე გამართული თანმიმდევრობა დამწყებისთვის?',
            questionEn: 'What is the soundest financial sequence for a beginner?',
            optionsKa: [
              '1) ბიუჯეტის აღრიცხვა -> 2) საგანგებო ფონდი -> 3) მიზნების დაგეგმვა და დივერსიფიცირებული დაგროვება',
              '1) სესხის აღება -> 2) ერთ აქციაში ჩადება -> 3) ბიუჯეტის შედგენა',
              'მთელი დანაზოგის სახლში ნაღდი სახით შენახვა 20 წლით',
              'ფინანსური მიზნების გარეშე სპონტანური ხარჯვა'
            ],
            optionsEn: [
              '1) Budget tracking -> 2) Emergency fund -> 3) Goal planning & diversified saving',
              '1) Borrow money -> 2) Bet on one stock -> 3) Make a budget',
              'Keep all cash under a mattress for 20 years',
              'Spend spontaneously without goals'
            ],
            correctIndex: 0,
            feedbackKa: 'ბრწყინვალეა! თქვენ წარმატებით გაიარეთ AGNO-ს ფინანსური განათლების სრული კურსი.',
            feedbackEn: 'Outstanding! You have mastered the core principles of personal finance.'
          },
          practiceExercise: {
            promptKa: 'შექმენით თქვენი პირადი 15-წლიანი სიმულაცია:',
            promptEn: 'Run your 15-year financial simulation:',
            scenarioLabelKa: 'სრული ფინანსური სიმულაცია',
            defaultAmount: 500,
            defaultRate: 10,
            defaultInflation: 4,
            defaultYears: 15,
            takeawayKa: 'ცოდნა + მოქმედება = გრძელვადიან ფინანსურ სიმშვიდეს.'
          },
          achievementProgressTitleKa: 'ინფლაციის მცოდნე'
        }
      }
    ]
  }
];

export const demoAchievements: AchievementItem[] = [
  {
    id: 'first-step',
    titleKa: 'პირველი ნაბიჯი',
    titleEn: 'First Step',
    descriptionKa: 'პირველი გაკვეთილის დასრულება',
    descriptionEn: 'Complete your first lesson',
    requirementKa: 'დაასრულეთ ნებისმიერი 1 გაკვეთილი სასწავლო გზაზე.',
    xpBonus: 20,
    iconName: 'Compass',
    progressCurrent: 1,
    progressTarget: 1,
  },
  {
    id: 'budget-planner',
    titleKa: 'ბიუჯეტის დამგეგმავი',
    titleEn: 'Budget Planner',
    descriptionKa: 'ბიუჯეტის მოდულის დასრულება',
    descriptionEn: 'Complete the Budgeting module',
    requirementKa: 'დაასრულეთ მოდული 1-ის 4-ვე ეტაპი („ფინანსური საფუძვლები“).',
    xpBonus: 40,
    iconName: 'Wallet',
    progressCurrent: 3,
    progressTarget: 4,
  },
  {
    id: 'inflation-master',
    titleKa: 'ინფლაციის მცოდნე',
    titleEn: 'Inflation Expert',
    descriptionKa: 'ინფლაციის ტესტში 80%+',
    descriptionEn: 'Score 80%+ on inflation lessons',
    requirementKa: 'წარმატებით უპასუხეთ ინფლაციის გაკვეთილის ინტერაქციულ კითხვას.',
    xpBonus: 30,
    iconName: 'Flame',
    progressCurrent: 1,
    progressTarget: 2,
  },
  {
    id: 'streak-7',
    titleKa: '7-დღიანი Streak',
    titleEn: '7-Day Streak',
    descriptionKa: '7 დღე ზედიზედ სწავლა',
    descriptionEn: 'Maintain a 7-day learning streak',
    requirementKa: 'შეასრულეთ მინიმუმ 1 სასწავლო აქტივობა 7 დღის განმავლობაში.',
    xpBonus: 50,
    iconName: 'Zap',
    progressCurrent: 4,
    progressTarget: 7,
  },
  {
    id: 'goal-creator',
    titleKa: 'მიზნების შემქმნელი',
    titleEn: 'Goal Creator',
    descriptionKa: 'პირველი ფინანსური მიზნის დამატება',
    descriptionEn: 'Create your first financial goal',
    requirementKa: 'დაამატეთ ან დაგეგმეთ მინიმუმ 1 ფინანსური მიზანი „მიზნების“ გვერდზე.',
    xpBonus: 25,
    iconName: 'Target',
    progressCurrent: 1,
    progressTarget: 1,
  },
];

export const PRESENTATION_DEMO_USER: UserProfile = {
  name: 'დავითი',
  age: 45,
  knowledgeLevel: 'Beginner',
  riskTolerance: 'Moderate',
  language: 'ka',
  currency: 'GEL',
  xp: 340,
  level: 2,
  levelTitle: 'Beginner II',
  nextLevelTitle: 'Intermediate I',
  nextLevelXp: 500,
  streak: 4,
  dailyCompletedActivities: 1,
  dailyTargetActivities: 2,
  weeklyCompletedLessons: 3,
  weeklyTargetLessons: 5,
  usedCalculatorThisWeek: true,
  completedLessons: ['m1-n1', 'm1-n2', 'm1-n3', 'lesson-inflation'],
  unlockedBadges: ['first-step', 'goal-creator'],
  isPro: false,
  onboardingCompleted: true,
  isDemoMode: true,
  learningProfile: {
    knowledgeLevel: 'Beginner',
    interests: ['ბიუჯეტირება', 'დანაზოგი', 'ინფლაცია'],
    primaryGoal: 'საგანგებო ფონდი',
    preferredExplanation: 'მარტივად, ყოველდღიური მაგალითებით',
    dailyGoalLessons: 1,
    weeklyFrequencyDays: 5,
    notificationFrequency: 'ყოველდღიური შეხსენება',
  },
};

export const PRESENTATION_DEMO_BUDGET: BudgetData = {
  income: 3200,
  fixedExpenses: 1350,
  discretionaryExpenses: 700,
  debtPayments: 0,
  monthlySavings: 1150,
  currentLiquidSavings: 8500,
  currentInvestments: 12000,
};

export const PRESENTATION_DEMO_GOALS: FinancialGoal[] = [
  {
    id: 'g-1',
    title: 'საგანგებო ფონდი და რეზერვი',
    category: 'emergency',
    categoryLabelKa: 'უსაფრთხოების რეზერვი',
    targetAmount: 15000,
    currentAmount: 8500,
    targetYears: 2,
    targetDateKa: 'დეკემბერი, 2028',
    monthlyContribution: 300,
    statusLabelKa: 'მიზანზე წინ',
    priority: 'high',
  },
  {
    id: 'g-2',
    title: 'საპენსიო კაპიტალი',
    category: 'retirement',
    categoryLabelKa: 'გრძელვადიანი კაპიტალი',
    targetAmount: 60000,
    currentAmount: 12000,
    targetYears: 15,
    targetDateKa: 'ნოემბერი, 2041',
    monthlyContribution: 350,
    statusLabelKa: 'გეგმის მიხედვით',
    priority: 'high',
  },
  {
    id: 'g-3',
    title: 'შვილის განათლების ფონდი',
    category: 'education',
    categoryLabelKa: 'განათლება',
    targetAmount: 25000,
    currentAmount: 3200,
    targetYears: 6,
    targetDateKa: 'სექტემბერი, 2032',
    monthlyContribution: 250,
    statusLabelKa: 'მცირე ჩამორჩენა',
    priority: 'medium',
  },
];
