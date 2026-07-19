export type Category = 'cybersecurity' | 'mobile' | 'laptops' | 'howto' | 'ai' | 'reviews' | 'windows' | 'comparisons' | 'technology';

export interface BilingualText {
  ar: string;
  en: string;
}

export interface Article {
  id: string;
  slug: string;
  title: BilingualText;
  excerpt: BilingualText;
  body: BilingualText;
  categoryId: Category;
  subcategoryId?: string;
  author: {
    name: BilingualText;
    avatar: string;
  };
  date: string;
  readTime: number; // in minutes
  heroImage: string;
  tags: string[];
  youtubeVideoId?: string;
  isFeatured?: boolean;
  isTrending?: boolean;
}

export interface DeviceSpec {
  label: BilingualText;
  device1Value: BilingualText;
  device2Value: BilingualText;
  device1Score: number; // 0-10
  device2Score: number; // 0-10
  winner: 1 | 2 | 0; // 0 for tie
}

export interface Comparison {
  id: string;
  slug: string;
  title: BilingualText;
  excerpt: BilingualText;
  device1Name: string;
  device2Name: string;
  device1Image: string;
  device2Image: string;
  date: string;
  categoryId: Category;
  specs: {
    display: DeviceSpec;
    performance: DeviceSpec;
    battery: DeviceSpec;
    camera: DeviceSpec;
    price: DeviceSpec;
  };
  verdict: BilingualText;
  overallWinner: 1 | 2;
  heroImage: string;
}

export const p1 = {
  ar: `في عالم يتسارع فيه التطور التكنولوجي، أصبح من الصعب مواكبة كل ما هو جديد. لكن هنا في رؤى تقنية، نسعى جاهدين لنضعك في قلب الحدث. من خلال مراجعاتنا العميقة وتحليلاتنا الدقيقة، نضمن لك الحصول على المعلومة الصحيحة في الوقت المناسب. التكنولوجيا ليست مجرد أجهزة ذكية، بل هي أسلوب حياة يغير طريقة تواصلنا وعملنا وحتى ترفيهنا.`,
  en: `In a world where technological development is accelerating, it has become difficult to keep up with everything new. But here at Technical Insights, we strive to put you in the heart of the event. Through our deep reviews and careful analysis, we ensure you get the right information at the right time. Technology is not just smart devices, but a lifestyle that changes the way we communicate, work, and even entertain ourselves.`
};
export const p2 = {
  ar: `تعتبر الهواتف الذكية اليوم المركز العصبي لحياتنا الرقمية. لا يمكننا تخيل يوم واحد دون استخدام هذه الأجهزة المتطورة التي تجمع بين قوة الحوسبة، دقة التصوير، وذكاء البرمجيات. الشركات الكبرى تتنافس بشراسة لتقديم أفضل تجربة مستخدم ممكنة، وهذا التنافس يصب في مصلحة المستهلك في النهاية.`,
  en: `Smartphones today are the nerve center of our digital lives. We cannot imagine a single day without using these advanced devices that combine computing power, imaging accuracy, and software intelligence. Major companies compete fiercely to provide the best possible user experience, and this competition ultimately benefits the consumer.`
};
export const p3 = {
  ar: `ومع تطور الذكاء الاصطناعي، بدأت ملامح المستقبل تتشكل بوضوح أكبر. الأجهزة أصبحت تفهم سلوكنا، تتوقع احتياجاتنا، وتقدم حلولاً استباقية لم نكن نتخيلها من قبل. هذا التطور المذهل يفتح أبواباً جديدة للإبداع والابتكار في شتى المجالات.`,
  en: `With the development of artificial intelligence, the features of the future have begun to take shape more clearly. Devices now understand our behavior, anticipate our needs, and offer proactive solutions we could never have imagined before. This amazing development opens new doors for creativity and innovation in various fields.`
};
export const p4 = {
  ar: `لكن هذا التطور لا يخلو من التحديات، خاصة فيما يتعلق بأمن المعلومات وحماية الخصوصية. كلما زاد اعتمادنا على التكنولوجيا، زادت أهمية تأمين بياناتنا الشخصية. ولذلك، نحرص في تغطيتنا على تقديم نصائح وإرشادات لمساعدتك على البقاء آمناً في العالم الرقمي.`,
  en: `But this development is not without challenges, especially regarding information security and privacy protection. The more we rely on technology, the more important it becomes to secure our personal data. Therefore, in our coverage, we are keen to provide tips and guidelines to help you stay safe in the digital world.`
};
export const p5 = {
  ar: `في النهاية، الخيار الأفضل يعتمد دائماً على احتياجاتك الشخصية وميزانيتك. لا يوجد جهاز مثالي للجميع، ولكن هناك دائماً الجهاز المثالي لك. ندعوك لاستكشاف مراجعاتنا ومقارناتنا لمساعدتك في اتخاذ القرار الصحيح.`,
  en: `In the end, the best choice always depends on your personal needs and budget. There is no perfect device for everyone, but there is always the perfect device for you. We invite you to explore our reviews and comparisons to help you make the right decision.`
};

export const fullBody = {
  ar: `${p1.ar}\n\n## التطور السريع\n${p2.ar}\n\n## الذكاء الاصطناعي\n${p3.ar}\n\n## التحديات الأمنية\n${p4.ar}\n\n## الخلاصة\n${p5.ar}`,
  en: `${p1.en}\n\n## Rapid Evolution\n${p2.en}\n\n## Artificial Intelligence\n${p3.en}\n\n## Security Challenges\n${p4.en}\n\n## Conclusion\n${p5.en}`
};

export const mockArticles: Article[] = [
  {
    id: '1',
    slug: 'apple-vision-pro-review',
    title: {
      ar: 'مراجعة نظارة أبل Vision Pro: هل تستحق هذا السعر؟',
      en: 'Apple Vision Pro Review: Is it worth the price?'
    },
    excerpt: {
      ar: 'نظرة متعمقة على أحدث ابتكارات أبل في مجال الحوسبة المكانية وتأثيرها على مستقبل التكنولوجيا.',
      en: 'An in-depth look at Apple\'s latest spatial computing innovation and its impact on the future of tech.'
    },
    body: fullBody,
    categoryId: 'reviews',
    author: {
      name: { ar: 'فريق رؤى تقنية', en: 'Technical Insights Team' },
      avatar: 'https://i.pravatar.cc/150?img=11'
    },
    date: '2024-02-15',
    readTime: 8,
    heroImage: 'https://picsum.photos/seed/visionpro/800/450',
    tags: ['Apple', 'VR', 'AR', 'Vision Pro'],
    isFeatured: true
  },
  {
    id: '2',
    slug: 'galaxy-s24-ultra-ai-features',
    title: {
      ar: 'كيف يغير Galaxy S24 Ultra قواعد اللعبة بالذكاء الاصطناعي',
      en: 'How the Galaxy S24 Ultra changes the game with AI'
    },
    excerpt: {
      ar: 'اختبرنا ميزات الذكاء الاصطناعي الجديدة في هاتف سامسونج الرائد، والنتائج كانت مبهرة.',
      en: 'We tested the new AI features in Samsung\'s flagship phone, and the results are impressive.'
    },
    body: fullBody,
    categoryId: 'mobile',
    author: {
      name: { ar: 'فريق رؤى تقنية', en: 'Technical Insights Team' },
      avatar: 'https://i.pravatar.cc/150?img=5'
    },
    date: '2024-03-01',
    readTime: 6,
    heroImage: 'https://picsum.photos/seed/s24ultra/800/450',
    tags: ['Samsung', 'Android', 'AI', 'S24 Ultra'],
    isTrending: true
  },
  {
    id: '3',
    slug: 'top-10-cybersecurity-tips-2024',
    title: {
      ar: '10 نصائح هامة لأمنك الرقمي في 2024',
      en: '10 Essential Cybersecurity Tips for 2024'
    },
    excerpt: {
      ar: 'مع تزايد الهجمات السيبرانية، إليك الدليل الشامل لحماية بياناتك الشخصية وحساباتك البنكية.',
      en: 'With rising cyber attacks, here is your comprehensive guide to protecting personal data.'
    },
    body: fullBody,
    categoryId: 'cybersecurity',
    author: {
      name: { ar: 'فريق رؤى تقنية', en: 'Technical Insights Team' },
      avatar: 'https://i.pravatar.cc/150?img=33'
    },
    date: '2024-04-10',
    readTime: 5,
    heroImage: 'https://picsum.photos/seed/cyber/800/450',
    tags: ['Security', 'Privacy', 'Guide']
  },
  {
    id: '4',
    slug: 'macbook-air-m3-first-look',
    title: {
      ar: 'النظرة الأولى على MacBook Air M3: الأفضل للطلاب؟',
      en: 'MacBook Air M3 First Look: Best for Students?'
    },
    excerpt: {
      ar: 'هل يمثل معالج M3 الجديد ترقية حقيقية تستحق التحديث من الإصدارات السابقة؟',
      en: 'Does the new M3 chip represent a real upgrade worth updating from previous versions?'
    },
    body: fullBody,
    categoryId: 'laptops',
    author: {
      name: { ar: 'فريق رؤى تقنية', en: 'Technical Insights Team' },
      avatar: 'https://i.pravatar.cc/150?img=44'
    },
    date: '2024-03-20',
    readTime: 7,
    heroImage: 'https://picsum.photos/seed/macbookm3/800/450',
    tags: ['Apple', 'MacBook', 'M3', 'Laptop'],
    isTrending: true
  },
  {
    id: '5',
    slug: 'chatgpt-vs-gemini-vs-claude',
    title: {
      ar: 'المعركة الكبرى: ChatGPT ضد Gemini ضد Claude',
      en: 'The Great Battle: ChatGPT vs Gemini vs Claude'
    },
    excerpt: {
      ar: 'مقارنة شاملة بين أقوى نماذج الذكاء الاصطناعي التوليدي في السوق اليوم.',
      en: 'A comprehensive comparison between the most powerful generative AI models today.'
    },
    body: fullBody,
    categoryId: 'ai',
    author: {
      name: { ar: 'فريق رؤى تقنية', en: 'Technical Insights Team' },
      avatar: 'https://i.pravatar.cc/150?img=11'
    },
    date: '2024-04-05',
    readTime: 10,
    heroImage: 'https://picsum.photos/seed/aibattle/800/450',
    tags: ['AI', 'ChatGPT', 'Google Gemini', 'Claude'],
    isFeatured: true
  },
  {
    id: '6',
    slug: 'windows-12-leaks-rumors',
    title: {
      ar: 'كل ما نعرفه عن ويندوز 12 القادم',
      en: 'Everything we know about the upcoming Windows 12'
    },
    excerpt: {
      ar: 'تسريبات وتوقعات حول نظام التشغيل القادم من مايكروسوفت وتركيزه على الذكاء الاصطناعي.',
      en: 'Leaks and expectations about Microsoft\'s next OS and its focus on AI.'
    },
    body: fullBody,
    categoryId: 'windows',
    author: {
      name: { ar: 'فريق رؤى تقنية', en: 'Technical Insights Team' },
      avatar: 'https://i.pravatar.cc/150?img=59'
    },
    date: '2024-04-12',
    readTime: 4,
    heroImage: 'https://picsum.photos/seed/windows12/800/450',
    tags: ['Windows', 'Microsoft', 'OS']
  },
  {
    id: '7',
    slug: 'how-to-speed-up-old-laptop',
    title: {
      ar: 'كيف تسرع جهاز اللابتوب القديم بخطوات بسيطة',
      en: 'How to speed up an old laptop in simple steps'
    },
    excerpt: {
      ar: 'دليل عملي لتسريع اللابتوب القديم وإعادته للحياة دون الحاجة لشراء جهاز جديد.',
      en: 'A practical guide to speeding up an old laptop and bringing it back to life.'
    },
    body: fullBody,
    categoryId: 'howto',
    author: {
      name: { ar: 'فريق رؤى تقنية', en: 'Technical Insights Team' },
      avatar: 'https://i.pravatar.cc/150?img=5'
    },
    date: '2024-02-28',
    readTime: 6,
    heroImage: 'https://picsum.photos/seed/oldlaptop/800/450',
    tags: ['Guide', 'Hardware', 'Optimization']
  },
  {
    id: '8',
    slug: 'iphone-15-pro-max-review-6-months',
    title: {
      ar: 'مراجعة آيفون 15 برو ماكس بعد 6 أشهر من الاستخدام',
      en: 'iPhone 15 Pro Max Review after 6 months'
    },
    excerpt: {
      ar: 'هل ما زال آيفون 15 برو ماكس ملك الهواتف بعد نصف عام من إصداره؟',
      en: 'Is the iPhone 15 Pro Max still the king of phones half a year later?'
    },
    body: fullBody,
    categoryId: 'reviews',
    author: {
      name: { ar: 'فريق رؤى تقنية', en: 'Technical Insights Team' },
      avatar: 'https://i.pravatar.cc/150?img=33'
    },
    date: '2024-04-15',
    readTime: 8,
    heroImage: 'https://picsum.photos/seed/iphone15pro/800/450',
    tags: ['Apple', 'iPhone', 'Mobile'],
    isTrending: true
  },
  {
    id: '9',
    slug: 'article-9-tech-news',
    title: {
      ar: 'مقال تقني جديد 9 - تحديثات وأخبار',
      en: 'New Tech Article 9 - Updates and News'
    },
    excerpt: {
      ar: 'نظرة سريعة على أحدث التطورات في عالم التقنية وتأثيرها على حياتنا اليومية.',
      en: 'A quick look at the latest developments in the tech world and their impact on our daily lives.'
    },
    body: fullBody,
    categoryId: 'laptops',
    author: {
      name: { ar: 'فريق رؤى تقنية', en: 'Technical Insights Team' },
      avatar: 'https://i.pravatar.cc/150?img=19'
    },
    date: '2024-04-10',
    readTime: 7,
    heroImage: 'https://picsum.photos/seed/art9/800/450',
    tags: ['Tech', 'News', 'Update']
  },
  {
    id: '10',
    slug: 'article-10-tech-news',
    title: {
      ar: 'مقال تقني جديد 10 - تحديثات وأخبار',
      en: 'New Tech Article 10 - Updates and News'
    },
    excerpt: {
      ar: 'نظرة سريعة على أحدث التطورات في عالم التقنية وتأثيرها على حياتنا اليومية.',
      en: 'A quick look at the latest developments in the tech world and their impact on our daily lives.'
    },
    body: fullBody,
    categoryId: 'howto',
    author: {
      name: { ar: 'فريق رؤى تقنية', en: 'Technical Insights Team' },
      avatar: 'https://i.pravatar.cc/150?img=20'
    },
    date: '2024-04-11',
    readTime: 3,
    heroImage: 'https://picsum.photos/seed/art10/800/450',
    tags: ['Tech', 'News', 'Update']
  },
  {
    id: '11',
    slug: 'article-11-tech-news',
    title: {
      ar: 'مقال تقني جديد 11 - تحديثات وأخبار',
      en: 'New Tech Article 11 - Updates and News'
    },
    excerpt: {
      ar: 'نظرة سريعة على أحدث التطورات في عالم التقنية وتأثيرها على حياتنا اليومية.',
      en: 'A quick look at the latest developments in the tech world and their impact on our daily lives.'
    },
    body: fullBody,
    categoryId: 'ai',
    author: {
      name: { ar: 'فريق رؤى تقنية', en: 'Technical Insights Team' },
      avatar: 'https://i.pravatar.cc/150?img=21'
    },
    date: '2024-04-12',
    readTime: 4,
    heroImage: 'https://picsum.photos/seed/art11/800/450',
    tags: ['Tech', 'News', 'Update']
  },
  {
    id: '12',
    slug: 'article-12-tech-news',
    title: {
      ar: 'مقال تقني جديد 12 - تحديثات وأخبار',
      en: 'New Tech Article 12 - Updates and News'
    },
    excerpt: {
      ar: 'نظرة سريعة على أحدث التطورات في عالم التقنية وتأثيرها على حياتنا اليومية.',
      en: 'A quick look at the latest developments in the tech world and their impact on our daily lives.'
    },
    body: fullBody,
    categoryId: 'reviews',
    author: {
      name: { ar: 'فريق رؤى تقنية', en: 'Technical Insights Team' },
      avatar: 'https://i.pravatar.cc/150?img=22'
    },
    date: '2024-04-13',
    readTime: 5,
    heroImage: 'https://picsum.photos/seed/art12/800/450',
    tags: ['Tech', 'News', 'Update']
  },
  {
    id: '13',
    slug: 'article-13-tech-news',
    title: {
      ar: 'مقال تقني جديد 13 - تحديثات وأخبار',
      en: 'New Tech Article 13 - Updates and News'
    },
    excerpt: {
      ar: 'نظرة سريعة على أحدث التطورات في عالم التقنية وتأثيرها على حياتنا اليومية.',
      en: 'A quick look at the latest developments in the tech world and their impact on our daily lives.'
    },
    body: fullBody,
    categoryId: 'windows',
    author: {
      name: { ar: 'فريق رؤى تقنية', en: 'Technical Insights Team' },
      avatar: 'https://i.pravatar.cc/150?img=23'
    },
    date: '2024-04-14',
    readTime: 6,
    heroImage: 'https://picsum.photos/seed/art13/800/450',
    tags: ['Tech', 'News', 'Update']
  },
  {
    id: '14',
    slug: 'article-14-tech-news',
    title: {
      ar: 'مقال تقني جديد 14 - تحديثات وأخبار',
      en: 'New Tech Article 14 - Updates and News'
    },
    excerpt: {
      ar: 'نظرة سريعة على أحدث التطورات في عالم التقنية وتأثيرها على حياتنا اليومية.',
      en: 'A quick look at the latest developments in the tech world and their impact on our daily lives.'
    },
    body: fullBody,
    categoryId: 'cybersecurity',
    author: {
      name: { ar: 'فريق رؤى تقنية', en: 'Technical Insights Team' },
      avatar: 'https://i.pravatar.cc/150?img=24'
    },
    date: '2024-04-15',
    readTime: 7,
    heroImage: 'https://picsum.photos/seed/art14/800/450',
    tags: ['Tech', 'News', 'Update']
  },
  {
    id: '15',
    slug: 'article-15-tech-news',
    title: {
      ar: 'مقال تقني جديد 15 - تحديثات وأخبار',
      en: 'New Tech Article 15 - Updates and News'
    },
    excerpt: {
      ar: 'نظرة سريعة على أحدث التطورات في عالم التقنية وتأثيرها على حياتنا اليومية.',
      en: 'A quick look at the latest developments in the tech world and their impact on our daily lives.'
    },
    body: fullBody,
    categoryId: 'mobile',
    author: {
      name: { ar: 'فريق رؤى تقنية', en: 'Technical Insights Team' },
      avatar: 'https://i.pravatar.cc/150?img=25'
    },
    date: '2024-04-16',
    readTime: 3,
    heroImage: 'https://picsum.photos/seed/art15/800/450',
    tags: ['Tech', 'News', 'Update']
  },
  {
    id: '16',
    slug: 'article-16-tech-news',
    title: {
      ar: 'مقال تقني جديد 16 - تحديثات وأخبار',
      en: 'New Tech Article 16 - Updates and News'
    },
    excerpt: {
      ar: 'نظرة سريعة على أحدث التطورات في عالم التقنية وتأثيرها على حياتنا اليومية.',
      en: 'A quick look at the latest developments in the tech world and their impact on our daily lives.'
    },
    body: fullBody,
    categoryId: 'laptops',
    author: {
      name: { ar: 'فريق رؤى تقنية', en: 'Technical Insights Team' },
      avatar: 'https://i.pravatar.cc/150?img=26'
    },
    date: '2024-04-17',
    readTime: 4,
    heroImage: 'https://picsum.photos/seed/art16/800/450',
    tags: ['Tech', 'News', 'Update']
  },
  {
    id: '17',
    slug: 'article-17-tech-news',
    title: {
      ar: 'مقال تقني جديد 17 - تحديثات وأخبار',
      en: 'New Tech Article 17 - Updates and News'
    },
    excerpt: {
      ar: 'نظرة سريعة على أحدث التطورات في عالم التقنية وتأثيرها على حياتنا اليومية.',
      en: 'A quick look at the latest developments in the tech world and their impact on our daily lives.'
    },
    body: fullBody,
    categoryId: 'howto',
    author: {
      name: { ar: 'فريق رؤى تقنية', en: 'Technical Insights Team' },
      avatar: 'https://i.pravatar.cc/150?img=27'
    },
    date: '2024-04-18',
    readTime: 5,
    heroImage: 'https://picsum.photos/seed/art17/800/450',
    tags: ['Tech', 'News', 'Update']
  },
  {
    id: '18',
    slug: 'article-18-tech-news',
    title: {
      ar: 'مقال تقني جديد 18 - تحديثات وأخبار',
      en: 'New Tech Article 18 - Updates and News'
    },
    excerpt: {
      ar: 'نظرة سريعة على أحدث التطورات في عالم التقنية وتأثيرها على حياتنا اليومية.',
      en: 'A quick look at the latest developments in the tech world and their impact on our daily lives.'
    },
    body: fullBody,
    categoryId: 'ai',
    author: {
      name: { ar: 'فريق رؤى تقنية', en: 'Technical Insights Team' },
      avatar: 'https://i.pravatar.cc/150?img=28'
    },
    date: '2024-04-19',
    readTime: 6,
    heroImage: 'https://picsum.photos/seed/art18/800/450',
    tags: ['Tech', 'News', 'Update']
  },
  {
    id: '19',
    slug: 'article-19-tech-news',
    title: {
      ar: 'مقال تقني جديد 19 - تحديثات وأخبار',
      en: 'New Tech Article 19 - Updates and News'
    },
    excerpt: {
      ar: 'نظرة سريعة على أحدث التطورات في عالم التقنية وتأثيرها على حياتنا اليومية.',
      en: 'A quick look at the latest developments in the tech world and their impact on our daily lives.'
    },
    body: fullBody,
    categoryId: 'reviews',
    author: {
      name: { ar: 'فريق رؤى تقنية', en: 'Technical Insights Team' },
      avatar: 'https://i.pravatar.cc/150?img=29'
    },
    date: '2024-04-20',
    readTime: 7,
    heroImage: 'https://picsum.photos/seed/art19/800/450',
    tags: ['Tech', 'News', 'Update']
  },
  {
    id: '20',
    slug: 'article-20-tech-news',
    title: {
      ar: 'مقال تقني جديد 20 - تحديثات وأخبار',
      en: 'New Tech Article 20 - Updates and News'
    },
    excerpt: {
      ar: 'نظرة سريعة على أحدث التطورات في عالم التقنية وتأثيرها على حياتنا اليومية.',
      en: 'A quick look at the latest developments in the tech world and their impact on our daily lives.'
    },
    body: fullBody,
    categoryId: 'windows',
    author: {
      name: { ar: 'فريق رؤى تقنية', en: 'Technical Insights Team' },
      avatar: 'https://i.pravatar.cc/150?img=30'
    },
    date: '2024-04-21',
    readTime: 3,
    heroImage: 'https://picsum.photos/seed/art20/800/450',
    tags: ['Tech', 'News', 'Update']
  },
  {
    id: '21',
    slug: 'article-21-tech-news',
    title: {
      ar: 'مقال تقني جديد 21 - تحديثات وأخبار',
      en: 'New Tech Article 21 - Updates and News'
    },
    excerpt: {
      ar: 'نظرة سريعة على أحدث التطورات في عالم التقنية وتأثيرها على حياتنا اليومية.',
      en: 'A quick look at the latest developments in the tech world and their impact on our daily lives.'
    },
    body: fullBody,
    categoryId: 'cybersecurity',
    author: {
      name: { ar: 'فريق رؤى تقنية', en: 'Technical Insights Team' },
      avatar: 'https://i.pravatar.cc/150?img=31'
    },
    date: '2024-04-22',
    readTime: 4,
    heroImage: 'https://picsum.photos/seed/art21/800/450',
    tags: ['Tech', 'News', 'Update']
  },
];

export const mockComparisons: Comparison[] = [
  {
    id: 'c1',
    slug: 'iphone-15-pro-max-vs-s24-ultra',
    title: {
      ar: 'معركة العمالقة: آيفون 15 برو ماكس ضد جالاكسي S24 ألترا',
      en: 'Clash of Titans: iPhone 15 Pro Max vs Galaxy S24 Ultra'
    },
    excerpt: {
      ar: 'مقارنة تفصيلية بين أقوى هاتفين في السوق حالياً لتحديد من يستحق لقب ملك الهواتف.',
      en: 'A detailed comparison between the two most powerful phones on the market.'
    },
    device1Name: 'iPhone 15 Pro Max',
    device2Name: 'Galaxy S24 Ultra',
    device1Image: 'https://picsum.photos/seed/iphone15device/400/500',
    device2Image: 'https://picsum.photos/seed/s24device/400/500',
    date: '2024-03-10',
    categoryId: 'comparisons',
    heroImage: 'https://picsum.photos/seed/vs1/800/450',
    overallWinner: 2,
    specs: {
      display: {
        label: { ar: 'الشاشة', en: 'Display' },
        device1Value: { ar: '6.7 بوصة Super Retina XDR OLED, 120Hz', en: '6.7" Super Retina XDR OLED, 120Hz' },
        device2Value: { ar: '6.8 بوصة Dynamic AMOLED 2X, 120Hz', en: '6.8" Dynamic AMOLED 2X, 120Hz' },
        device1Score: 9,
        device2Score: 9.5,
        winner: 2
      },
      performance: {
        label: { ar: 'الأداء', en: 'Performance' },
        device1Value: { ar: 'Apple A17 Pro (3 nm)', en: 'Apple A17 Pro (3 nm)' },
        device2Value: { ar: 'Snapdragon 8 Gen 3 (4 nm)', en: 'Snapdragon 8 Gen 3 (4 nm)' },
        device1Score: 9.8,
        device2Score: 9.5,
        winner: 1
      },
      battery: {
        label: { ar: 'البطارية', en: 'Battery' },
        device1Value: { ar: '4441 mAh', en: '4441 mAh' },
        device2Value: { ar: '5000 mAh', en: '5000 mAh' },
        device1Score: 8.5,
        device2Score: 9.2,
        winner: 2
      },
      camera: {
        label: { ar: 'الكاميرا', en: 'Camera' },
        device1Value: { ar: '48MP رئيسية + 12MP تليفوتو (5x) + 12MP زاوية عريضة', en: '48MP Main + 12MP Tele (5x) + 12MP Ultra-wide' },
        device2Value: { ar: '200MP رئيسية + 50MP تليفوتو (5x) + 12MP زاوية عريضة', en: '200MP Main + 50MP Tele (5x) + 12MP Ultra-wide' },
        device1Score: 9.2,
        device2Score: 9.4,
        winner: 2
      },
      price: {
        label: { ar: 'السعر المبدئي', en: 'Starting Price' },
        device1Value: { ar: '1,199 دولار', en: '$1,199' },
        device2Value: { ar: '1,299 دولار', en: '$1,299' },
        device1Score: 8,
        device2Score: 7.5,
        winner: 1
      }
    },
    verdict: {
      ar: 'كلا الهاتفين يقدمان أداء استثنائياً. الجالاكسي يتفوق في الشاشة وتعدد استخدامات الكاميرا وميزات الذكاء الاصطناعي، بينما الآيفون يقدم أداء معالج أفضل وتكامل لا مثيل له مع بيئة أبل. الفائز الإجمالي هنا هو جالاكسي S24 ألترا بفارق ضئيل جداً لكونه يقدم حزمة أكثر تنوعاً.',
      en: 'Both phones offer exceptional performance. The Galaxy excels in display, camera versatility, and AI features, while the iPhone offers better processor performance and unmatched ecosystem integration. The overall winner here is the Galaxy S24 Ultra by a very narrow margin for offering a more versatile package.'
    }
  },
  {
    id: 'c2',
    slug: 'macbook-air-m3-vs-dell-xps-14',
    title: {
      ar: 'أفضل لابتوب للإنتاجية: MacBook Air M3 ضد Dell XPS 14',
      en: 'Best Productivity Laptop: MacBook Air M3 vs Dell XPS 14'
    },
    excerpt: {
      ar: 'مقارنة بين أنحف وأقوى حواسيب أبل المحمولة وأناقة ديل المتجددة.',
      en: 'A comparison between Apple\'s thinnest laptop and Dell\'s renewed elegance.'
    },
    device1Name: 'MacBook Air M3',
    device2Name: 'Dell XPS 14',
    device1Image: 'https://picsum.photos/seed/macbookdevice/400/500',
    device2Image: 'https://picsum.photos/seed/xpsdevice/400/500',
    date: '2024-03-25',
    categoryId: 'comparisons',
    heroImage: 'https://picsum.photos/seed/vs2/800/450',
    overallWinner: 1,
    specs: {
      display: {
        label: { ar: 'الشاشة', en: 'Display' },
        device1Value: { ar: '13.6" Liquid Retina', en: '13.6" Liquid Retina' },
        device2Value: { ar: '14.5" OLED Touch', en: '14.5" OLED Touch' },
        device1Score: 8.5,
        device2Score: 9.5,
        winner: 2
      },
      performance: {
        label: { ar: 'الأداء', en: 'Performance' },
        device1Value: { ar: 'Apple M3', en: 'Apple M3' },
        device2Value: { ar: 'Intel Core Ultra 7', en: 'Intel Core Ultra 7' },
        device1Score: 9.2,
        device2Score: 8.8,
        winner: 1
      },
      battery: {
        label: { ar: 'البطارية', en: 'Battery' },
        device1Value: { ar: '18 ساعة', en: '18 hours' },
        device2Value: { ar: '12 ساعة', en: '12 hours' },
        device1Score: 9.8,
        device2Score: 7.5,
        winner: 1
      },
      camera: {
        label: { ar: 'المنافذ', en: 'Ports' },
        device1Value: { ar: '2x Thunderbolt 4, MagSafe', en: '2x Thunderbolt 4, MagSafe' },
        device2Value: { ar: '3x Thunderbolt 4, MicroSD', en: '3x Thunderbolt 4, MicroSD' },
        device1Score: 7.5,
        device2Score: 8.5,
        winner: 2
      },
      price: {
        label: { ar: 'السعر المبدئي', en: 'Starting Price' },
        device1Value: { ar: '1,099 دولار', en: '$1,099' },
        device2Value: { ar: '1,699 دولار', en: '$1,699' },
        device1Score: 9,
        device2Score: 6,
        winner: 1
      }
    },
    verdict: {
      ar: 'على الرغم من أن شاشة XPS 14 وتصميمه المستقبلي مذهلان، إلا أن MacBook Air M3 يوفر قيمة أفضل بكثير بفضل أداء المعالج المتفوق، عمر البطارية الأسطوري، والسعر الأكثر منطقية. إذا كنت بحاجة إلى ويندوز، فديل خيار ممتاز، لكن الماك بوك هو الرابح لغالبية المستخدمين.',
      en: 'While the XPS 14 screen and futuristic design are stunning, the MacBook Air M3 provides much better value thanks to superior processor performance, legendary battery life, and a more reasonable price. If you need Windows, Dell is an excellent choice, but the MacBook is the winner for most users.'
    }
  },
  {
    id: 'c3',
    slug: 'comparison-3-devices',
    title: {
      ar: 'مقارنة شاملة 3: أيهما يستحق الشراء؟',
      en: 'Comprehensive Comparison 3: Which is worth buying?'
    },
    excerpt: {
      ar: 'مقارنة تفصيلية بين أحدث الأجهزة في السوق لتحديد الخيار الأفضل لك.',
      en: 'A detailed comparison between the latest devices in the market to determine the best choice.'
    },
    device1Name: 'Device A Pro',
    device2Name: 'Device B Ultra',
    device1Image: 'https://picsum.photos/seed/devA3/400/500',
    device2Image: 'https://picsum.photos/seed/devB3/400/500',
    date: '2024-04-13',
    categoryId: 'comparisons',
    heroImage: 'https://picsum.photos/seed/vsc3/800/450',
    overallWinner: 2,
    specs: {
      display: {
        label: { ar: 'الشاشة', en: 'Display' },
        device1Value: { ar: 'OLED 120Hz', en: 'OLED 120Hz' },
        device2Value: { ar: 'AMOLED 144Hz', en: 'AMOLED 144Hz' },
        device1Score: 8,
        device2Score: 9,
        winner: 2
      },
      performance: {
        label: { ar: 'الأداء', en: 'Performance' },
        device1Value: { ar: 'Gen 3 Processor', en: 'Gen 3 Processor' },
        device2Value: { ar: 'Bionic Chip', en: 'Bionic Chip' },
        device1Score: 9.5,
        device2Score: 9.0,
        winner: 1
      },
      battery: {
        label: { ar: 'البطارية', en: 'Battery' },
        device1Value: { ar: '4500 mAh', en: '4500 mAh' },
        device2Value: { ar: '5000 mAh', en: '5000 mAh' },
        device1Score: 8,
        device2Score: 9,
        winner: 2
      },
      camera: {
        label: { ar: 'الكاميرا', en: 'Camera' },
        device1Value: { ar: '50MP Triple', en: '50MP Triple' },
        device2Value: { ar: '108MP Dual', en: '108MP Dual' },
        device1Score: 9,
        device2Score: 8.5,
        winner: 1
      },
      price: {
        label: { ar: 'السعر', en: 'Price' },
        device1Value: { ar: '$999', en: '$999' },
        device2Value: { ar: '$899', en: '$899' },
        device1Score: 8,
        device2Score: 9,
        winner: 2
      }
    },
    verdict: {
      ar: 'كلا الجهازين يقدمان أداء ممتازا، لكن الخيار يعتمد على احتياجاتك الأساسية من الكاميرا أو البطارية.',
      en: 'Both devices offer excellent performance, but the choice depends on your primary needs for camera or battery.'
    }
  },
  {
    id: 'c4',
    slug: 'comparison-4-devices',
    title: {
      ar: 'مقارنة شاملة 4: أيهما يستحق الشراء؟',
      en: 'Comprehensive Comparison 4: Which is worth buying?'
    },
    excerpt: {
      ar: 'مقارنة تفصيلية بين أحدث الأجهزة في السوق لتحديد الخيار الأفضل لك.',
      en: 'A detailed comparison between the latest devices in the market to determine the best choice.'
    },
    device1Name: 'Device A Pro',
    device2Name: 'Device B Ultra',
    device1Image: 'https://picsum.photos/seed/devA4/400/500',
    device2Image: 'https://picsum.photos/seed/devB4/400/500',
    date: '2024-04-14',
    categoryId: 'comparisons',
    heroImage: 'https://picsum.photos/seed/vsc4/800/450',
    overallWinner: 1,
    specs: {
      display: {
        label: { ar: 'الشاشة', en: 'Display' },
        device1Value: { ar: 'OLED 120Hz', en: 'OLED 120Hz' },
        device2Value: { ar: 'AMOLED 144Hz', en: 'AMOLED 144Hz' },
        device1Score: 8,
        device2Score: 9,
        winner: 2
      },
      performance: {
        label: { ar: 'الأداء', en: 'Performance' },
        device1Value: { ar: 'Gen 3 Processor', en: 'Gen 3 Processor' },
        device2Value: { ar: 'Bionic Chip', en: 'Bionic Chip' },
        device1Score: 9.5,
        device2Score: 9.0,
        winner: 1
      },
      battery: {
        label: { ar: 'البطارية', en: 'Battery' },
        device1Value: { ar: '4500 mAh', en: '4500 mAh' },
        device2Value: { ar: '5000 mAh', en: '5000 mAh' },
        device1Score: 8,
        device2Score: 9,
        winner: 2
      },
      camera: {
        label: { ar: 'الكاميرا', en: 'Camera' },
        device1Value: { ar: '50MP Triple', en: '50MP Triple' },
        device2Value: { ar: '108MP Dual', en: '108MP Dual' },
        device1Score: 9,
        device2Score: 8.5,
        winner: 1
      },
      price: {
        label: { ar: 'السعر', en: 'Price' },
        device1Value: { ar: '$999', en: '$999' },
        device2Value: { ar: '$899', en: '$899' },
        device1Score: 8,
        device2Score: 9,
        winner: 2
      }
    },
    verdict: {
      ar: 'كلا الجهازين يقدمان أداء ممتازا، لكن الخيار يعتمد على احتياجاتك الأساسية من الكاميرا أو البطارية.',
      en: 'Both devices offer excellent performance, but the choice depends on your primary needs for camera or battery.'
    }
  },
  {
    id: 'c5',
    slug: 'comparison-5-devices',
    title: {
      ar: 'مقارنة شاملة 5: أيهما يستحق الشراء؟',
      en: 'Comprehensive Comparison 5: Which is worth buying?'
    },
    excerpt: {
      ar: 'مقارنة تفصيلية بين أحدث الأجهزة في السوق لتحديد الخيار الأفضل لك.',
      en: 'A detailed comparison between the latest devices in the market to determine the best choice.'
    },
    device1Name: 'Device A Pro',
    device2Name: 'Device B Ultra',
    device1Image: 'https://picsum.photos/seed/devA5/400/500',
    device2Image: 'https://picsum.photos/seed/devB5/400/500',
    date: '2024-04-15',
    categoryId: 'comparisons',
    heroImage: 'https://picsum.photos/seed/vsc5/800/450',
    overallWinner: 2,
    specs: {
      display: {
        label: { ar: 'الشاشة', en: 'Display' },
        device1Value: { ar: 'OLED 120Hz', en: 'OLED 120Hz' },
        device2Value: { ar: 'AMOLED 144Hz', en: 'AMOLED 144Hz' },
        device1Score: 8,
        device2Score: 9,
        winner: 2
      },
      performance: {
        label: { ar: 'الأداء', en: 'Performance' },
        device1Value: { ar: 'Gen 3 Processor', en: 'Gen 3 Processor' },
        device2Value: { ar: 'Bionic Chip', en: 'Bionic Chip' },
        device1Score: 9.5,
        device2Score: 9.0,
        winner: 1
      },
      battery: {
        label: { ar: 'البطارية', en: 'Battery' },
        device1Value: { ar: '4500 mAh', en: '4500 mAh' },
        device2Value: { ar: '5000 mAh', en: '5000 mAh' },
        device1Score: 8,
        device2Score: 9,
        winner: 2
      },
      camera: {
        label: { ar: 'الكاميرا', en: 'Camera' },
        device1Value: { ar: '50MP Triple', en: '50MP Triple' },
        device2Value: { ar: '108MP Dual', en: '108MP Dual' },
        device1Score: 9,
        device2Score: 8.5,
        winner: 1
      },
      price: {
        label: { ar: 'السعر', en: 'Price' },
        device1Value: { ar: '$999', en: '$999' },
        device2Value: { ar: '$899', en: '$899' },
        device1Score: 8,
        device2Score: 9,
        winner: 2
      }
    },
    verdict: {
      ar: 'كلا الجهازين يقدمان أداء ممتازا، لكن الخيار يعتمد على احتياجاتك الأساسية من الكاميرا أو البطارية.',
      en: 'Both devices offer excellent performance, but the choice depends on your primary needs for camera or battery.'
    }
  },
  {
    id: 'c6',
    slug: 'comparison-6-devices',
    title: {
      ar: 'مقارنة شاملة 6: أيهما يستحق الشراء؟',
      en: 'Comprehensive Comparison 6: Which is worth buying?'
    },
    excerpt: {
      ar: 'مقارنة تفصيلية بين أحدث الأجهزة في السوق لتحديد الخيار الأفضل لك.',
      en: 'A detailed comparison between the latest devices in the market to determine the best choice.'
    },
    device1Name: 'Device A Pro',
    device2Name: 'Device B Ultra',
    device1Image: 'https://picsum.photos/seed/devA6/400/500',
    device2Image: 'https://picsum.photos/seed/devB6/400/500',
    date: '2024-04-16',
    categoryId: 'comparisons',
    heroImage: 'https://picsum.photos/seed/vsc6/800/450',
    overallWinner: 1,
    specs: {
      display: {
        label: { ar: 'الشاشة', en: 'Display' },
        device1Value: { ar: 'OLED 120Hz', en: 'OLED 120Hz' },
        device2Value: { ar: 'AMOLED 144Hz', en: 'AMOLED 144Hz' },
        device1Score: 8,
        device2Score: 9,
        winner: 2
      },
      performance: {
        label: { ar: 'الأداء', en: 'Performance' },
        device1Value: { ar: 'Gen 3 Processor', en: 'Gen 3 Processor' },
        device2Value: { ar: 'Bionic Chip', en: 'Bionic Chip' },
        device1Score: 9.5,
        device2Score: 9.0,
        winner: 1
      },
      battery: {
        label: { ar: 'البطارية', en: 'Battery' },
        device1Value: { ar: '4500 mAh', en: '4500 mAh' },
        device2Value: { ar: '5000 mAh', en: '5000 mAh' },
        device1Score: 8,
        device2Score: 9,
        winner: 2
      },
      camera: {
        label: { ar: 'الكاميرا', en: 'Camera' },
        device1Value: { ar: '50MP Triple', en: '50MP Triple' },
        device2Value: { ar: '108MP Dual', en: '108MP Dual' },
        device1Score: 9,
        device2Score: 8.5,
        winner: 1
      },
      price: {
        label: { ar: 'السعر', en: 'Price' },
        device1Value: { ar: '$999', en: '$999' },
        device2Value: { ar: '$899', en: '$899' },
        device1Score: 8,
        device2Score: 9,
        winner: 2
      }
    },
    verdict: {
      ar: 'كلا الجهازين يقدمان أداء ممتازا، لكن الخيار يعتمد على احتياجاتك الأساسية من الكاميرا أو البطارية.',
      en: 'Both devices offer excellent performance, but the choice depends on your primary needs for camera or battery.'
    }
  },
];
