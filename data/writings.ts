import { WritingItem } from "../types/writing";

export interface WritingLink {
  id: string;
  title: {
    en: string;
    ko: string;
  };
  url: {
    en: string;
    ko: string;
  };
  date: string;
  category: string[];
  hideInEnglish?: boolean;
}

// 원본 데이터 배열
const originalData = [
  {
    id: "1",
    title: {
      en: "Teach Other to Grow Myself",
      ko: "이미 알고 있지만 하기 어려운 것, 성장하고 싶다면 남을 가르쳐라",
    },
    url: {
      en: "https://doeon.substack.com/p/teach-other-to-grow-myself",
      ko: "https://kwondoeon.substack.com/p/teach-other-to-grow-myself",
    },
    date: "2022-07-27",
    category: ["essay"],
  },
  {
    id: "2",
    title: {
      en: "Future of Internet, Algorithm, Network : Why Disquiet?",
      ko: "Future of Internet, Algorithm, Network : Why Disquiet?",
    },
    url: {
      en: "https://doeon.substack.com/p/future-of-the-internet-algorithms-and-networks-why-disquiet",
      ko: "https://kwondoeon.substack.com/p/future-of-internet-algorithm-network",
    },
    date: "2022-10-15",
    category: ["essay"],
  },
  {
    id: "3",
    title: {
      en: "Assets to build and opportunities to seek going forward",
      ko: "앞으로 쌓아갈 자산과 찾고자 하는 기회",
    },
    url: {
      en: "https://doeon.substack.com/p/assets-to-build-and-opportunities-to-seek-going-forward",
      ko: "https://kwondoeon.substack.com/p/asset-chance",
    },
    date: "2023-01-28",
    category: ["essay"],
  },
  {
    id: "4",
    title: {
      en: "The wrong kind of community to build",
      ko: "만들면 안되는 커뮤니티",
    },
    url: {
      en: "https://doeon.substack.com/p/the-wrong-kind-of-community-to-build",
      ko: "https://kwondoeon.substack.com/p/community-that-cannot-be-created",
    },
    date: "2023-02-14",
    category: ["essay"],
  },
  {
    id: "5",
    title: {
      en: "Characteristics of the most powerful nations throughout history",
      ko: "시대별 가장 강력했던 국가의 특징",
    },
    url: {
      en: "https://doeon.substack.com/p/characteristics-of-the-most-powerful-nations-throughout-history",
      ko: "https://kwondoeon.substack.com/p/characteristics-of-the-most-powerful-nation-by-period",
    },
    date: "2023-02-20",
    category: ["essay"],
  },
  {
    id: "6",
    title: {
      en: "How to put your brain into a hypersensitive state",
      ko: "뇌를 초감각 상태로 만드는 법",
    },
    url: {
      en: "https://doeon.substack.com/p/how-to-put-your-brain-into-a-hypersensitive-state",
      ko: "https://kwondoeon.substack.com/p/how-to-make-your-brain-super-sensitive",
    },
    date: "2023-03-15",
    category: ["essay"],
  },
  {
    id: "7",
    title: {
      en: "After Reading Bae Ki-hong's 'Antisocial Animal'",
      ko: "배기홍 파트너님의 '반사회적 동물'을 읽고",
    },
    url: {
      en: "https://doeon.substack.com/p/after-reading-bae-ki-hongs-antisocial-animal",
      ko: "https://kwondoeon.substack.com/p/baegihong",
    },
    date: "2023-03-16",
    category: ["inspired"],
  },
  {
    id: "8",
    title: {
      en: "Inspired #1 | Consumer Social, Vertical Data, Authentic and Intimate Communication, Escaping Algorithms, Skills to Build in the Gen AI Era, Antisocial Animal-Diversity, Non-Alcoholic Whiskey",
      ko: "Inspired #1 | Consumer social, 버티컬 데이터, 진실되고 친밀한 소통이 중요, 알고리즘에서 벗어나는 법, Gen AI 시대 키워야 할 능력, 반사회적 동물-다양성, 논알콜 위스키(feat. 일론 머스크)",
    },
    url: {
      en: "https://doeon.substack.com/p/inspired-1-consumer-social-vertical",
      ko: "https://kwondoeon.substack.com/p/1",
    },
    date: "2023-03-18",
    category: ["inspired"],
  },
  {
    id: "9",
    title: {
      en: "Inspired #2 | How ADHD Focuses, Healthy Social Products, Availability Cascade, Artifact, Nexon, Microstress, Substack's New Economic Engine for Culture, Non-Exclusive Networks, Facebook's Strategy",
      ko: "Inspired #2 | ADHD가 집중하는 법, 건강한 소셜 프로덕트, 가용성 캐스케이드, Artifact, 넥슨, 마이크로스트레스, Substack's new economic engine for culture, 비배타적 네트워크, 페이스북의 전략 등",
    },
    url: {
      en: "https://doeon.substack.com/p/inspired-2-how-adhd-focuses-healthy",
      ko: "https://kwondoeon.substack.com/p/2",
    },
    date: "2023-03-25",
    category: ["inspired"],
  },
  {
    id: "10",
    title: {
      en: "Inspired #3 | Substack, New Globalization, Finding Ideas, The Humanity of Genius, High Interest Rates and the Rise of Great Startups",
      ko: "Inspired #3 | Substack, 새로운 세계화, 아이디어 찾는 법, 천재의 인간다움, 고금리와 훌륭한 스타트업의 등장",
    },
    url: {
      en: "https://doeon.substack.com/p/inspired-3-substack-new-globalization",
      ko: "https://kwondoeon.substack.com/p/3",
    },
    date: "2023-04-01",
    category: ["inspired"],
  },
  {
    id: "11",
    title: {
      en: "Inspired #4 | Recommendation Algorithms, Changes in Social Media, Meta's Decentralized Social Network, AI and Content, Will Humans Be Replaced, AI and iOS, Rituals, Social Graphs, Vertical Communities",
      ko: "Inspired #4 | 추천 알고리즘, 소셜 미디어의 변화, 탈중앙화 소셜 네트워크를 만드는 Meta, AI와 컨텐츠, 인간은 대체될 것인가, AI와 iOS, 리추얼, 소셜 그래프, 수직 커뮤니티, 야망과 디스콰이엇",
    },
    url: {
      en: "https://doeon.substack.com/p/inspired-4-recommendation-algorithms",
      ko: "https://kwondoeon.substack.com/p/what-i-read-this-week-4",
    },
    date: "2023-04-08",
    category: ["inspired"],
  },
  {
    id: "12",
    title: {
      en: "Inspired #5 | Maslow's Hierarchy, Teens' TikTok Addiction, Turning Knowledge into Income, Repetitive Tasks and the Future of Work, No Compromises on Product Quality, AI, Steve Jobs",
      ko: "Inspired #5 | 메슬로우 욕구 피라미드, 청소년들의 틱톡 중독, 내 지식을 수익으로 만드는 법, 반복 작업과 노동의 미래, 제품 퀄리티에 타협하지 않기, AI, 스티브 잡스",
    },
    url: {
      en: "https://doeon.substack.com/p/inspired-5-maslows-hierarchy-teens",
      ko: "https://kwondoeon.substack.com/p/what-i-read-this-week-5",
    },
    date: "2023-04-16",
    category: ["inspired"],
  },
  {
    id: "13",
    title: {
      en: "Reading Make Something Wonderful",
      ko: "Make something wonderful을 읽고",
    },
    url: {
      en: "https://doeon.substack.com/p/reading-make-something-wonderful",
      ko: "https://kwondoeon.substack.com/p/make-something-wonderful",
    },
    date: "2023-04-16",
    category: ["inspired"],
  },
  {
    id: "14",
    title: {
      en: "My Mindset While Building Disquiet",
      ko: "디스콰이엇을 만들면서 갖고 있는 마음가짐",
    },
    url: {
      en: "https://doeon.substack.com/p/my-mindset-while-building-disquiet",
      ko: "https://kwondoeon.substack.com/p/78a",
    },
    date: "2023-04-21",
    category: ["essay"],
  },
  {
    id: "15",
    title: {
      en: "Inspired #6 | Make Something Wonderful, Too Many Ideas Cancel Each Other Out, Social Media Homogenization, What Is Intelligence, Gen Z, LinkedIn 20-Year Journey, Longevity Startups",
      ko: "Inspired #6 | Make something wonderful, 너무 많은 아이디어는 서로를 상쇄한다, 소셜 미디어의 획일화, 지능에 대하여, Gen Z, 링크드인 일대기, 수명 연장 스타트업",
    },
    url: {
      en: "https://doeon.substack.com/p/inspired-6-make-something-wonderful",
      ko: "https://kwondoeon.substack.com/p/what-i-read-this-week-6",
    },
    date: "2023-04-22",
    category: ["inspired"],
  },
  {
    id: "16",
    title: {
      en: "Inspired #7 | The Status Trap, The Age of Average, AI Pop Culture, Writing, High-Quality Products, Repeatable Greatness, Vertical Hiring Markets, American Society, Traits of Intangible Assets",
      ko: "Inspired #7 | 지위 함정, 평균의 시대, AI 팝 컬쳐, 글쓰기, 훌륭한 퀄리티의 프로덕트, 반복할 수 있는 훌륭함, 버티컬 채용 시장, 미국 사회, 무형 자산의 특징",
    },
    url: {
      en: "https://doeon.substack.com/p/inspired-7-the-status-trap-the-age",
      ko: "https://kwondoeon.substack.com/p/what-i-read-this-week-7",
    },
    date: "2023-04-29",
    category: ["inspired"],
  },
  {
    id: "17",
    title: {
      en: "Why Authenticity and Transparency Matter in the AI Era",
      ko: "AI 시대, 우리에게 진정성과 투명성이 필요한 이유",
    },
    url: {
      en: "https://doeon.substack.com/p/why-authenticity-and-transparency",
      ko: "https://kwondoeon.substack.com/p/in-the-age-of-ai-why-we-need-authenticity-and-tr",
    },
    date: "2023-05-17",
    category: ["essay"],
  },
  {
    id: "18",
    title: {
      en: "Inspired #8 | Talent Scarcity, Gamification, BeReal, AI Interfaces, Human-Centered Products, India Rise, Gen Z, 10 Cool Things, Singapore and Air Conditioning",
      ko: "Inspired #8 | Talent scarcity, 게이미피케이션, BeReal, AI 인터페이스, 인간중심 제품, 성장하는 인도, GenZ, 10 cool things, 싱가폴과 에어컨",
    },
    url: {
      en: "https://doeon.substack.com/p/inspired-8-talent-scarcity-gamification",
      ko: "https://kwondoeon.substack.com/p/what-i-read-this-week-8",
    },
    date: "2023-06-03",
    category: ["inspired"],
  },
  {
    id: "19",
    title: {
      en: "Staying Energized",
      ko: "지치지 않기",
    },
    url: {
      en: "https://doeon.substack.com/p/staying-energized",
      ko: "https://kwondoeon.substack.com/p/avoid-burnout",
    },
    date: "2023-06-10",
    category: ["essay"],
  },
  {
    id: "20",
    title: {
      en: "Inspired #9 | Unbundling Facebook, Free 55-Inch TVs, Community-Driven Fundraising, Execution, Ultramarathon Mindset, AI and Education/Jobs, Happy Career Advice",
      ko: "Inspired #9 | 페이스북 언번들링, 공짜 55인치 TV, 커뮤니티스러운 자금 조달, 실행력, 울트라마라톤 마인드셋, AI와 교육/일자리, 행복한 커리어 조언",
    },
    url: {
      en: "https://doeon.substack.com/p/inspired-9-unbundling-facebook-free",
      ko: "https://kwondoeon.substack.com/p/what-i-read-this-week-9",
    },
    date: "2023-06-25",
    category: ["inspired"],
  },
  {
    id: "21",
    title: {
      en: '"Come for the Content, Stay for the Network" - Why Build Disquiet?',
      ko: "Come to contents, stay for the network",
    },
    url: {
      en: "https://doeon.substack.com/p/come-for-the-content-stay-for-the",
      ko: "https://kwondoeon.substack.com/p/come-to-contents-stay-for-the-network",
    },
    date: "2023-08-27",
    category: ["essay"],
  },
  {
    id: "22",
    title: {
      en: "Inspired #10 | Maker Renaissance and Network Effects, AI Interfaces, AI-Native Products/Teams/Individuals, The Hardship of Creation—No Impact Without Risk, Building a Talented Team",
      ko: "Inspired #10 | 메이커 르네상스와 네트워크 효과, AI 인터페이스, AI-native 제품/팀/개인, 창작의 어려움-리스크 없이는 임팩트도 없다, 재능있는 팀 만들기, REM/Deep 수면 잘하기",
    },
    url: {
      en: "https://doeon.substack.com/p/inspired-10-maker-renaissance-and",
      ko: "https://kwondoeon.substack.com/p/inspired-10",
    },
    date: "2023-11-15",
    category: ["essay"],
  },
  {
    id: "23",
    title: {
      en: "2023 Lookback: Life Is a Series of Problem-Solving",
      ko: "2023 회고, 삶은 문제 해결의 연속이다",
    },
    url: {
      en: "https://doeon.substack.com/p/2023-lookback-life-is-a-series-of",
      ko: "https://kwondoeon.substack.com/p/2023-lookback",
    },
    date: "2023-12-21",
    category: ["reflection"],
  },
  {
    id: "24",
    title: {
      en: "Tokyo Trip with Brother: 趣味を発견する",
      ko: "동생과 함께 한 도쿄 여행: 趣味を発견する",
    },
    url: {
      en: "https://kwondoeon.substack.com/p/tokyo-trip-with-brother",
      ko: "https://kwondoeon.substack.com/p/tokyo-trip-with-brother",
    },
    date: "2024-01-14",
    category: ["travel"],
    hideInEnglish: true,
  },
  {
    id: "25",
    title: {
      en: "What I Learned About My Gaps, Desires, Tastes, and Curiosity After a Month-Long Sabbatical",
      ko: "한 달의 안식월 이후 알게 된 나의 결핍, 욕망, 취향, 호기심에 대하여",
    },
    url: {
      en: "https://doeon.substack.com/p/what-i-learned-about-my-gaps-desires",
      ko: "https://kwondoeon.substack.com/p/discoveries-after-a-month-off",
    },
    date: "2024-01-25",
    category: ["reflection"],
  },
  {
    id: "26",
    title: {
      en: "What Makes a Great Team and Leader (feat. Joe Hisaishi Film Music Concert)",
      ko: "좋은 팀, 리더란 (feat. 히사이시 조 영화음악 콘서트)",
    },
    url: {
      en: "https://doeon.substack.com/p/what-makes-a-great-team-and-leader",
      ko: "https://kwondoeon.substack.com/p/great-team-leader",
    },
    date: "2024-03-04",
    category: ["inspired"],
  },
  {
    id: "27",
    title: {
      en: "Thoughts on the Taste of Work",
      ko: "Taste of work에 대한 고민",
    },
    url: {
      en: "https://doeon.substack.com/p/thoughts-on-the-taste-of-work",
      ko: "https://kwondoeon.substack.com/p/taste-of-work",
    },
    date: "2024-03-18",
    category: ["essay"],
  },
  {
    id: "28",
    title: {
      en: "Q1 2024 Reflection - Lessons from Chasing PMF, Keys to Steady Performance, New Team and Roles, Rest and Writing This Quarter",
      ko: "2024 1분기 회고 - PMF 찾는 과정에서 배운 것, 일관적인 퍼포먼스를 내기 위해 필요한 것, 새로운 팀과 역할, 이번 분기의 휴식과 글",
    },
    url: {
      en: "https://doeon.substack.com/p/q1-2024-reflection-lessons-from-chasing",
      ko: "https://kwondoeon.substack.com/p/2024-1-pmf",
    },
    date: "2024-04-01",
    category: ["reflection"],
  },
  {
    id: "29",
    title: {
      en: "Can Long-Term Thinking Change the World?",
      ko: "장기적 사고로 세상을 바꿀 수 있을까",
    },
    url: {
      en: "https://doeon.substack.com/p/can-long-term-thinking-change-the",
      ko: "https://kwondoeon.substack.com/p/3af",
    },
    date: "2024-05-27",
    category: ["essay"],
  },
  {
    id: "30",
    title: {
      en: "Middle Way, Loneliness and Recognition, Living a Life of Creating Value for Others",
      ko: "중용, 외로움과 인정, 남에게 가치있는 것을 만드는 삶",
    },
    url: {
      en: "https://doeon.substack.com/p/middle-way-loneliness-and-recognition",
      ko: "https://kwondoeon.substack.com/p/e8f",
    },
    date: "2024-07-01",
    category: ["essay"],
  },
  {
    id: "31",
    title: {
      en: "How Will Product Design Evolve? Thoughts on Multimodal Products and Generative UI",
      ko: "앞으로 제품 디자인은 어떻게 바뀔까?",
    },
    url: {
      en: "https://doeon.substack.com/p/how-will-product-design-evolve-thoughts",
      ko: "https://kwondoeon.substack.com/p/ui",
    },
    date: "2024-07-04",
    category: ["essay"],
  },
  {
    id: "32",
    title: {
      en: "Thinking Small",
      ko: "작게 생각하기",
    },
    url: {
      en: "https://doeon.substack.com/p/thinking-small",
      ko: "https://kwondoeon.substack.com/p/bc4",
    },
    date: "2024-07-08",
    category: ["essay"],
  },
  {
    id: "33",
    title: {
      en: "Korea is All About Talent—What is Next?",
      ko: "인재가 전부인 한국은 앞으로 어떻게 해야될까?",
    },
    url: {
      en: "https://doeon.substack.com/p/koreas-all-about-talentwhats-next",
      ko: "https://kwondoeon.substack.com/p/b30",
    },
    date: "2024-07-09",
    category: ["essay"],
  },
  {
    id: "34",
    title: {
      en: "Reading The Gifts of 40 by Julie Zhuo, Sundial Co-Founder",
      ko: "Sundial의 co-founder인 Julie Zhuo의 The gifts of 40를 읽고",
    },
    url: {
      en: "https://doeon.substack.com/p/reading-the-gifts-of-40-by-julie",
      ko: "https://kwondoeon.substack.com/p/sundial-co-founder-julie-zhuo-the",
    },
    date: "2024-07-11",
    category: ["inspired"],
  },
  {
    id: "35",
    title: {
      en: "밖으로 나가기",
      ko: "밖으로 나가기",
    },
    url: {
      en: "https://kwondoeon.substack.com/p/aec",
      ko: "https://kwondoeon.substack.com/p/aec",
    },
    date: "2024-08-26",
    category: ["essay"],
    hideInEnglish: true,
  },
  {
    id: "36",
    title: {
      en: "지지 않는 게임",
      ko: "지지 않는 게임",
    },
    url: {
      en: "https://kwondoeon.substack.com/p/37c",
      ko: "https://kwondoeon.substack.com/p/37c",
    },
    date: "2024-08-27",
    category: ["essay"],
    hideInEnglish: true,
  },
  {
    id: "37",
    title: {
      en: "토요일에 슈타이들 전시를 보고 든 생각들",
      ko: "토요일에 슈타이들 전시를 보고 든 생각들",
    },
    url: {
      en: "https://kwondoeon.substack.com/p/f07",
      ko: "https://kwondoeon.substack.com/p/f07",
    },
    date: "2024-09-29",
    category: ["essay"],
    hideInEnglish: true,
  },
  {
    id: "38",
    title: {
      en: "What Changes When Product Development Costs Drop to Zero? Some Thoughts",
      ko: "제품개발 비용이 0으로 수렴하면서 바뀔 것들에 대한 생각",
    },
    url: {
      en: "https://doeon.substack.com/p/what-changes-when-product-development",
      ko: "https://kwondoeon.substack.com/p/0",
    },
    date: "2024-10-05",
    category: ["essay"],
  },
  {
    id: "39",
    title: {
      en: "Beautiful and Useful Things",
      ko: "아름답고 유용한 것",
    },
    url: {
      en: "https://doeon.substack.com/p/beautiful-and-useful-things",
      ko: "https://kwondoeon.substack.com/p/d82",
    },
    date: "2024-10-14",
    category: ["essay"],
  },
  {
    id: "40",
    title: {
      en: "Inspired #11 | Design, Trade-offs, AI as the New Plastic, World Building, Writer Cho Seung-yeon, Decision Models, and More",
      ko: "Inspired #11 | 디자인, Trade-off, AI is the new plastic, world building, 조승연 작가, 의사결정 모델 등",
    },
    url: {
      en: "https://doeon.substack.com/p/inspired-11-design-trade-offs-ai",
      ko: "https://kwondoeon.substack.com/p/inspired-11",
    },
    date: "2024-10-28",
    category: ["inspired"],
  },
  {
    id: "41",
    title: {
      en: "(Translation) Five New Mindsets for Working with AI",
      ko: "(번역) AI와 함께 일하기 위한 다섯 가지 새로운 사고방식",
    },
    url: {
      en: "https://kwondoeon.substack.com/p/ai-en",
      ko: "https://kwondoeon.substack.com/p/ai",
    },
    date: "2024-11-04",
    category: ["translation"],
    hideInEnglish: true,
  },
  {
    id: "42",
    title: {
      en: "Inspired #12 | Mixed-Use Cities, Creativity, Productivity and Growth, Founder-Market Fit, and More",
      ko: "Inspired #12 | 잡교 도시, 창작, 생산성과 성장, Founder-market fit 등",
    },
    url: {
      en: "https://doeon.substack.com/p/inspired-12-mixed-use-cities-creativity",
      ko: "https://kwondoeon.substack.com/p/inspired-12-founder-market-fit",
    },
    date: "2024-11-11",
    category: ["inspired"],
  },
  {
    id: "43",
    title: {
      en: "Inspired #13 | Building Global Products in Korea, Intelligence, Basquiat, Mass Goods vs. Craft, and More",
      ko: "Inspired #13 | 한국에서 글로벌 제품 빌딩, 지능, 바스키아, 공산품과 공예품 등",
    },
    url: {
      en: "https://doeon.substack.com/p/inspired-13-building-global-products",
      ko: "https://kwondoeon.substack.com/p/inspired-13",
    },
    date: "2024-11-20",
    category: ["inspired"],
  },
  {
    id: "44",
    title: {
      en: "관계빈곤",
      ko: "관계빈곤",
    },
    url: {
      en: "https://kwondoeon.substack.com/p/391",
      ko: "https://kwondoeon.substack.com/p/391",
    },
    date: "2024-12-06",
    category: ["essay"],
    hideInEnglish: true,
  },
  {
    id: "45",
    title: {
      en: "Inspired #14 | Self-Trust, Connection, Survival Instinct, Imperfection + Humor = A Good Life",
      ko: "Inspired #14 | 자기신뢰, 유대감, 생존 본능, 불완전함 + 유머 = 좋은 삶",
    },
    url: {
      en: "https://doeon.substack.com/p/inspired-14-self-trust-connection",
      ko: "https://kwondoeon.substack.com/p/inspired-14",
    },
    date: "2024-12-09",
    category: ["inspired"],
  },
  {
    id: "46",
    title: {
      en: "The full stack of society - conrad bastable을 읽고",
      ko: "The full stack of society - conrad bastable을 읽고",
    },
    url: {
      en: "https://kwondoeon.substack.com/p/the-full-stack-of-society-conrad",
      ko: "https://kwondoeon.substack.com/p/the-full-stack-of-society-conrad",
    },
    date: "2024-12-14",
    category: ["essay"],
    hideInEnglish: true,
  },
  {
    id: "47",
    title: {
      en: "Inspired #15 | The Next Wave, Religion → Games → Virtual Reality, Next Pixar & Blizzard, Do not Surround Yourself With Smarter People, What Keeps Me Alive, and More",
      ko: "Inspired #15 | 다음 웨이브, 종교 → 게임 → 가상 현실, next pixar & blizard, Do not Surround Yourself With Smarter People, 무엇이 나를 살아있게 만드는가 등",
    },
    url: {
      en: "https://doeon.substack.com/p/inspired-15-the-next-wave-religion",
      ko: "https://kwondoeon.substack.com/p/inspired-15-next-pixar-and-blizard",
    },
    date: "2024-12-19",
    category: ["inspired"],
  },
  {
    id: "48",
    title: {
      en: "Real Growth",
      ko: "진짜 성장",
    },
    url: {
      en: "https://doeon.substack.com/p/real-growth",
      ko: "https://kwondoeon.substack.com/p/538",
    },
    date: "2024-12-27",
    category: ["essay"],
  },
  {
    id: "49",
    title: {
      en: "Reflections on Disquiet",
      ko: "디스콰이엇에서의 3년 회고",
    },
    url: {
      en: "https://doeon.substack.com/p/reflections-on-disquiet",
      ko: "https://kwondoeon.substack.com/p/3-e43",
    },
    date: "2024-12-31",
    category: ["reflection"],
  },
  {
    id: "50",
    title: {
      en: "Inspired #16 | Agents, Virtual World Business, Minecraft, Nvidia, Yanagisawa Sho, The Refragmentation, Sam Altman on Choosing Projects/Creating Value/Finding Purpose, etc.",
      ko: "Inspired #16 | Agents, 가상 세계 비즈니스, 마인크래프트, 엔비디아, 야나기사와 쇼, The Refragmentation, Sam Altman on choosing projects/creating value/finding purpose etc.",
    },
    url: {
      en: "https://doeon.substack.com/p/inspired-16-agents-virtual-world",
      ko: "https://kwondoeon.substack.com/p/inspired-16-agents-the-refragmentation",
    },
    date: "2025-01-19",
    category: ["inspired"],
  },
  {
    id: "51",
    title: {
      en: "Inspired #17 | Google Titans, Gaming Industry, Wokeness, Deepseek is not a Sputnik Moment, 2050 Predictions, and More",
      ko: "Inspired #17 | 구글 Titans, Game 산업, Wokeness, Deepseek is not Sputnik moment, 2050 미래 예측 등",
    },
    url: {
      en: "https://doeon.substack.com/p/inspired-17-googles-titans-gaming",
      ko: "https://kwondoeon.substack.com/p/inspired-17-titans-game-wokeness",
    },
    date: "2025-02-04",
    category: ["inspired"],
  },
  {
    id: "52",
    title: {
      en: "Inspired #18 | Tech-Driven Science, AI Startups, Utility AI, Socratic Love, Growth Maze, Learning Routines, Director AI, Gaming Slump, The Age of Taste, Universe as Data, Strong Form AI Companies",
      ko: "Inspired #18 | 기술 주도 과학, AI 스타트업, Utility AI, 소크라테스적 사랑, Growth Maze, 학습 루틴, Director AI, 게이밍 슬럼프, Taste 시대, 우주=데이터, Strong Form AI Company, AI-네이티브 코딩, Pet Ideas, AI DAO, Selfish Software",
    },
    url: {
      en: "https://doeon.substack.com/p/inspired-18-tech-driven-science-ai",
      ko: "https://kwondoeon.substack.com/p/inspired-18-ai-utility-ai-growth",
    },
    date: "2025-02-16",
    category: ["inspired"],
  },
  {
    id: "53",
    title: {
      en: "The next Internet is 3D",
      ko: "The next Internet is 3D",
    },
    url: {
      en: "https://blog.0.space/p/the-next-internet-is-3d",
      ko: "https://kwondoeon.substack.com/p/the-next-internet-is-3d",
    },
    date: "2025-02-19",
    category: ["essay"],
  },
  {
    id: "54",
    title: {
      en: "Personal Reasons for Creating the Game + A Brief Reflection",
      ko: "게임을 만들게 된 개인적인 이유 + 짧막한 회고",
    },
    url: {
      en: "https://doeon.substack.com/p/personal-reasons-for-creating-the",
      ko: "https://kwondoeon.substack.com/p/37b",
    },
    date: "2025-02-25",
    category: ["reflection"],
  },
  {
    id: "55",
    title: {
      en: "Inspired #19 | 4월 회고와 피벗, AI가 정말로 바꾸고 있는 것들, 닌텐도 사장 사토루 이와타, 한국 게임의 역사, 게임 수학, 창의성, 컴퓨터 그래픽, AI 2027 , Scott Belsky 등",
      ko: "Inspired #19 | 4월 회고와 피벗, AI가 정말로 바꾸고 있는 것들, 닌텐도 사장 사토루 이와타, 한국 게임의 역사, 게임 수학, 창의성, 컴퓨터 그래픽, AI 2027 , Scott Belsky 등",
    },
    url: {
      en: "https://kwondoeon.substack.com/p/inspired-19-4-ai-ai-2027-scott-belsky",
      ko: "https://kwondoeon.substack.com/p/inspired-19-4-ai-ai-2027-scott-belsky",
    },
    date: "2025-05-20",
    category: ["inspired"],
    hideInEnglish: true,
  },
];

// date 기준으로 오름차순 정렬하고 id를 재할당
export const writingLinks: WritingLink[] = [...originalData]
  .sort((a, b) => {
    // date 문자열을 Date 객체로 변환하여 비교 (YYYY-MM-DD 형식)
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
    return dateA.getTime() - dateB.getTime(); // 오름차순 정렬 (과거 → 현재)
  })
  .map((writing, index) => ({
    ...writing,
    id: (index + 1).toString(), // id를 1부터 순차적으로 재할당
  }));

export default writingLinks;
