import { Article } from './mockData';
import { fullBody, Category } from './mockData';

export const extendedArticles: Article[] = [
  {
    id: '100',
    slug: 'article-100-how-to-protect-your-accounts-from-hacking-in-2024',
    title: { ar: 'كيف تحمي حساباتك من الاختراق في 2024', en: 'How to protect your accounts from hacking in 2024' },
    excerpt: { 
      ar: 'اكتشف كل ما يخص كيف تحمي حساباتك من الاختراق في 2024 وأهم التفاصيل التقنية.', 
      en: 'Discover everything about How to protect your accounts from hacking in 2024 and the most important tech details.' 
    },
    body: fullBody,
    categoryId: 'cybersecurity' as Category,
    author: {
      name: { ar: 'أحمد محمود', en: 'Ahmed Mahmoud' },
      avatar: 'https://i.pravatar.cc/150?img=1'
    },
    date: '2023-01-01',
    readTime: 3,
    heroImage: 'https://picsum.photos/seed/article-100-how-to-protect-your-accounts-from-hacking-in-2024/800/450',
    tags: ['Tech', 'Cybersecurity', '2024'],
    isFeatured: true,
    isTrending: true
  },
  {
    id: '101',
    slug: 'article-101-best-free-antivirus-software',
    title: { ar: 'أفضل برامج مكافحة الفيروسات المجانية', en: 'Best free antivirus software' },
    excerpt: { 
      ar: 'اكتشف كل ما يخص أفضل برامج مكافحة الفيروسات المجانية وأهم التفاصيل التقنية.', 
      en: 'Discover everything about Best free antivirus software and the most important tech details.' 
    },
    body: fullBody,
    categoryId: 'cybersecurity' as Category,
    author: {
      name: { ar: 'سارة خالد', en: 'Sarah Khaled' },
      avatar: 'https://i.pravatar.cc/150?img=2'
    },
    date: '2023-01-03',
    readTime: 4,
    heroImage: 'https://picsum.photos/seed/article-101-best-free-antivirus-software/800/450',
    tags: ['Tech', 'Cybersecurity', '2024'],
    isFeatured: false,
    isTrending: false
  },
  {
    id: '102',
    slug: 'article-102-what-is-a-vpn-and-why-do-you-need-it',
    title: { ar: 'ما هو الـ VPN ولماذا تحتاجه', en: 'What is a VPN and why do you need it' },
    excerpt: { 
      ar: 'اكتشف كل ما يخص ما هو الـ VPN ولماذا تحتاجه وأهم التفاصيل التقنية.', 
      en: 'Discover everything about What is a VPN and why do you need it and the most important tech details.' 
    },
    body: fullBody,
    categoryId: 'cybersecurity' as Category,
    author: {
      name: { ar: 'عمر طارق', en: 'Omar Tarek' },
      avatar: 'https://i.pravatar.cc/150?img=3'
    },
    date: '2023-01-06',
    readTime: 5,
    heroImage: 'https://picsum.photos/seed/article-102-what-is-a-vpn-and-why-do-you-need-it/800/450',
    tags: ['Tech', 'Cybersecurity', '2024'],
    isFeatured: false,
    isTrending: false
  },
  {
    id: '103',
    slug: 'article-103-how-to-detect-if-your-phone-is-hacked',
    title: { ar: 'كيف تكتشف إذا كان هاتفك مخترقاً', en: 'How to detect if your phone is hacked' },
    excerpt: { 
      ar: 'اكتشف كل ما يخص كيف تكتشف إذا كان هاتفك مخترقاً وأهم التفاصيل التقنية.', 
      en: 'Discover everything about How to detect if your phone is hacked and the most important tech details.' 
    },
    body: fullBody,
    categoryId: 'cybersecurity' as Category,
    author: {
      name: { ar: 'نور أحمد', en: 'Nour Ahmed' },
      avatar: 'https://i.pravatar.cc/150?img=4'
    },
    date: '2023-01-09',
    readTime: 6,
    heroImage: 'https://picsum.photos/seed/article-103-how-to-detect-if-your-phone-is-hacked/800/450',
    tags: ['Tech', 'Cybersecurity', '2024'],
    isFeatured: false,
    isTrending: false
  },
  {
    id: '104',
    slug: 'article-104-securing-your-home-wifi-network',
    title: { ar: 'حماية شبكة الواي فاي المنزلية', en: 'Securing your home WiFi network' },
    excerpt: { 
      ar: 'اكتشف كل ما يخص حماية شبكة الواي فاي المنزلية وأهم التفاصيل التقنية.', 
      en: 'Discover everything about Securing your home WiFi network and the most important tech details.' 
    },
    body: fullBody,
    categoryId: 'cybersecurity' as Category,
    author: {
      name: { ar: 'كريم حسن', en: 'Karim Hassan' },
      avatar: 'https://i.pravatar.cc/150?img=5'
    },
    date: '2023-01-11',
    readTime: 7,
    heroImage: 'https://picsum.photos/seed/article-104-securing-your-home-wifi-network/800/450',
    tags: ['Tech', 'Cybersecurity', '2024'],
    isFeatured: false,
    isTrending: false
  },
  {
    id: '105',
    slug: 'article-105-5-most-dangerous-cyber-threats-in-2024',
    title: { ar: 'أخطر 5 تهديدات إلكترونية في 2024', en: '5 most dangerous cyber threats in 2024' },
    excerpt: { 
      ar: 'اكتشف كل ما يخص أخطر 5 تهديدات إلكترونية في 2024 وأهم التفاصيل التقنية.', 
      en: 'Discover everything about 5 most dangerous cyber threats in 2024 and the most important tech details.' 
    },
    body: fullBody,
    categoryId: 'cybersecurity' as Category,
    author: {
      name: { ar: 'ليلى سامي', en: 'Laila Sami' },
      avatar: 'https://i.pravatar.cc/150?img=6'
    },
    date: '2023-01-14',
    readTime: 8,
    heroImage: 'https://picsum.photos/seed/article-105-5-most-dangerous-cyber-threats-in-2024/800/450',
    tags: ['Tech', 'Cybersecurity', '2024'],
    isFeatured: false,
    isTrending: false
  },
  {
    id: '106',
    slug: 'article-106-how-to-create-unbreakable-passwords',
    title: { ar: 'كيف تصنع كلمات مرور لا يمكن اختراقها', en: 'How to create unbreakable passwords' },
    excerpt: { 
      ar: 'اكتشف كل ما يخص كيف تصنع كلمات مرور لا يمكن اختراقها وأهم التفاصيل التقنية.', 
      en: 'Discover everything about How to create unbreakable passwords and the most important tech details.' 
    },
    body: fullBody,
    categoryId: 'cybersecurity' as Category,
    author: {
      name: { ar: 'خالد عبد الله', en: 'Khaled Abdallah' },
      avatar: 'https://i.pravatar.cc/150?img=7'
    },
    date: '2023-01-17',
    readTime: 9,
    heroImage: 'https://picsum.photos/seed/article-106-how-to-create-unbreakable-passwords/800/450',
    tags: ['Tech', 'Cybersecurity', '2024'],
    isFeatured: false,
    isTrending: false
  },
  {
    id: '107',
    slug: 'article-107-what-is-phishing-and-how-to-avoid-it',
    title: { ar: 'ما هو التصيد الإلكتروني وكيف تتجنبه', en: 'What is phishing and how to avoid it' },
    excerpt: { 
      ar: 'اكتشف كل ما يخص ما هو التصيد الإلكتروني وكيف تتجنبه وأهم التفاصيل التقنية.', 
      en: 'Discover everything about What is phishing and how to avoid it and the most important tech details.' 
    },
    body: fullBody,
    categoryId: 'cybersecurity' as Category,
    author: {
      name: { ar: 'أحمد محمود', en: 'Ahmed Mahmoud' },
      avatar: 'https://i.pravatar.cc/150?img=8'
    },
    date: '2023-01-20',
    readTime: 10,
    heroImage: 'https://picsum.photos/seed/article-107-what-is-phishing-and-how-to-avoid-it/800/450',
    tags: ['Tech', 'Cybersecurity', '2024'],
    isFeatured: false,
    isTrending: false
  },
  {
    id: '108',
    slug: 'article-108-ransomware-attacks--how-to-protect-your-files',
    title: { ar: 'هجمات الفدية: كيف تحمي ملفاتك', en: 'Ransomware attacks: How to protect your files' },
    excerpt: { 
      ar: 'اكتشف كل ما يخص هجمات الفدية: كيف تحمي ملفاتك وأهم التفاصيل التقنية.', 
      en: 'Discover everything about Ransomware attacks: How to protect your files and the most important tech details.' 
    },
    body: fullBody,
    categoryId: 'cybersecurity' as Category,
    author: {
      name: { ar: 'سارة خالد', en: 'Sarah Khaled' },
      avatar: 'https://i.pravatar.cc/150?img=9'
    },
    date: '2023-01-22',
    readTime: 11,
    heroImage: 'https://picsum.photos/seed/article-108-ransomware-attacks--how-to-protect-your-files/800/450',
    tags: ['Tech', 'Cybersecurity', '2024'],
    isFeatured: false,
    isTrending: false
  },
  {
    id: '109',
    slug: 'article-109-smart-home-device-security',
    title: { ar: 'أمان الأجهزة الذكية في المنزل', en: 'Smart home device security' },
    excerpt: { 
      ar: 'اكتشف كل ما يخص أمان الأجهزة الذكية في المنزل وأهم التفاصيل التقنية.', 
      en: 'Discover everything about Smart home device security and the most important tech details.' 
    },
    body: fullBody,
    categoryId: 'cybersecurity' as Category,
    author: {
      name: { ar: 'عمر طارق', en: 'Omar Tarek' },
      avatar: 'https://i.pravatar.cc/150?img=10'
    },
    date: '2023-01-25',
    readTime: 12,
    heroImage: 'https://picsum.photos/seed/article-109-smart-home-device-security/800/450',
    tags: ['Tech', 'Cybersecurity', '2024'],
    isFeatured: false,
    isTrending: false
  },
  {
    id: '110',
    slug: 'article-110-the-danger-of-public-wifi-networks',
    title: { ar: 'خطورة شبكات الواي فاي العامة', en: 'The danger of public WiFi networks' },
    excerpt: { 
      ar: 'اكتشف كل ما يخص خطورة شبكات الواي فاي العامة وأهم التفاصيل التقنية.', 
      en: 'Discover everything about The danger of public WiFi networks and the most important tech details.' 
    },
    body: fullBody,
    categoryId: 'cybersecurity' as Category,
    author: {
      name: { ar: 'نور أحمد', en: 'Nour Ahmed' },
      avatar: 'https://i.pravatar.cc/150?img=11'
    },
    date: '2023-01-28',
    readTime: 3,
    heroImage: 'https://picsum.photos/seed/article-110-the-danger-of-public-wifi-networks/800/450',
    tags: ['Tech', 'Cybersecurity', '2024'],
    isFeatured: false,
    isTrending: false
  },
  {
    id: '111',
    slug: 'article-111-setting-up-two-factor-authentication-step-by-step',
    title: { ar: 'إعداد المصادقة الثنائية خطوة بخطوة', en: 'Setting up two-factor authentication step by step' },
    excerpt: { 
      ar: 'اكتشف كل ما يخص إعداد المصادقة الثنائية خطوة بخطوة وأهم التفاصيل التقنية.', 
      en: 'Discover everything about Setting up two-factor authentication step by step and the most important tech details.' 
    },
    body: fullBody,
    categoryId: 'cybersecurity' as Category,
    author: {
      name: { ar: 'كريم حسن', en: 'Karim Hassan' },
      avatar: 'https://i.pravatar.cc/150?img=12'
    },
    date: '2023-01-31',
    readTime: 4,
    heroImage: 'https://picsum.photos/seed/article-111-setting-up-two-factor-authentication-step-by-step/800/450',
    tags: ['Tech', 'Cybersecurity', '2024'],
    isFeatured: false,
    isTrending: false
  },
  {
    id: '112',
    slug: 'article-112-best-password-managers',
    title: { ar: 'أفضل مديري كلمات المرور', en: 'Best password managers' },
    excerpt: { 
      ar: 'اكتشف كل ما يخص أفضل مديري كلمات المرور وأهم التفاصيل التقنية.', 
      en: 'Discover everything about Best password managers and the most important tech details.' 
    },
    body: fullBody,
    categoryId: 'cybersecurity' as Category,
    author: {
      name: { ar: 'ليلى سامي', en: 'Laila Sami' },
      avatar: 'https://i.pravatar.cc/150?img=13'
    },
    date: '2023-02-02',
    readTime: 5,
    heroImage: 'https://picsum.photos/seed/article-112-best-password-managers/800/450',
    tags: ['Tech', 'Cybersecurity', '2024'],
    isFeatured: false,
    isTrending: false
  },
  {
    id: '113',
    slug: 'article-113-what-is-the-dark-web-and-how-it-works',
    title: { ar: 'ما هو Dark Web وكيف يعمل', en: 'What is the Dark Web and how it works' },
    excerpt: { 
      ar: 'اكتشف كل ما يخص ما هو Dark Web وكيف يعمل وأهم التفاصيل التقنية.', 
      en: 'Discover everything about What is the Dark Web and how it works and the most important tech details.' 
    },
    body: fullBody,
    categoryId: 'cybersecurity' as Category,
    author: {
      name: { ar: 'خالد عبد الله', en: 'Khaled Abdallah' },
      avatar: 'https://i.pravatar.cc/150?img=14'
    },
    date: '2023-02-05',
    readTime: 6,
    heroImage: 'https://picsum.photos/seed/article-113-what-is-the-dark-web-and-how-it-works/800/450',
    tags: ['Tech', 'Cybersecurity', '2024'],
    isFeatured: false,
    isTrending: false
  },
  {
    id: '114',
    slug: 'article-114-protecting-your-children-online',
    title: { ar: 'حماية أطفالك على الإنترنت', en: 'Protecting your children online' },
    excerpt: { 
      ar: 'اكتشف كل ما يخص حماية أطفالك على الإنترنت وأهم التفاصيل التقنية.', 
      en: 'Discover everything about Protecting your children online and the most important tech details.' 
    },
    body: fullBody,
    categoryId: 'cybersecurity' as Category,
    author: {
      name: { ar: 'أحمد محمود', en: 'Ahmed Mahmoud' },
      avatar: 'https://i.pravatar.cc/150?img=15'
    },
    date: '2023-02-08',
    readTime: 7,
    heroImage: 'https://picsum.photos/seed/article-114-protecting-your-children-online/800/450',
    tags: ['Tech', 'Cybersecurity', '2024'],
    isFeatured: false,
    isTrending: false
  },
  {
    id: '115',
    slug: 'article-115-how-to-verify-the-security-of-any-website',
    title: { ar: 'كيف تتحقق من أمان أي موقع إلكتروني', en: 'How to verify the security of any website' },
    excerpt: { 
      ar: 'اكتشف كل ما يخص كيف تتحقق من أمان أي موقع إلكتروني وأهم التفاصيل التقنية.', 
      en: 'Discover everything about How to verify the security of any website and the most important tech details.' 
    },
    body: fullBody,
    categoryId: 'cybersecurity' as Category,
    author: {
      name: { ar: 'سارة خالد', en: 'Sarah Khaled' },
      avatar: 'https://i.pravatar.cc/150?img=16'
    },
    date: '2023-02-10',
    readTime: 8,
    heroImage: 'https://picsum.photos/seed/article-115-how-to-verify-the-security-of-any-website/800/450',
    tags: ['Tech', 'Cybersecurity', '2024'],
    isFeatured: false,
    isTrending: false
  },
  {
    id: '116',
    slug: 'article-116-data-security-in-cloud-storage',
    title: { ar: 'أمن البيانات في التخزين السحابي', en: 'Data security in cloud storage' },
    excerpt: { 
      ar: 'اكتشف كل ما يخص أمن البيانات في التخزين السحابي وأهم التفاصيل التقنية.', 
      en: 'Discover everything about Data security in cloud storage and the most important tech details.' 
    },
    body: fullBody,
    categoryId: 'cybersecurity' as Category,
    author: {
      name: { ar: 'عمر طارق', en: 'Omar Tarek' },
      avatar: 'https://i.pravatar.cc/150?img=17'
    },
    date: '2023-02-13',
    readTime: 9,
    heroImage: 'https://picsum.photos/seed/article-116-data-security-in-cloud-storage/800/450',
    tags: ['Tech', 'Cybersecurity', '2024'],
    isFeatured: false,
    isTrending: false
  },
  {
    id: '117',
    slug: 'article-117-social-engineering--hacker-s-most-dangerous-weapon',
    title: { ar: 'الهندسة الاجتماعية: أخطر أسلحة الهاكر', en: 'Social engineering: hacker\'s most dangerous weapon' },
    excerpt: { 
      ar: 'اكتشف كل ما يخص الهندسة الاجتماعية: أخطر أسلحة الهاكر وأهم التفاصيل التقنية.', 
      en: 'Discover everything about Social engineering: hacker\'s most dangerous weapon and the most important tech details.' 
    },
    body: fullBody,
    categoryId: 'cybersecurity' as Category,
    author: {
      name: { ar: 'نور أحمد', en: 'Nour Ahmed' },
      avatar: 'https://i.pravatar.cc/150?img=18'
    },
    date: '2023-02-16',
    readTime: 10,
    heroImage: 'https://picsum.photos/seed/article-117-social-engineering--hacker-s-most-dangerous-weapon/800/450',
    tags: ['Tech', 'Cybersecurity', '2024'],
    isFeatured: false,
    isTrending: false
  },
  {
    id: '118',
    slug: 'article-118-how-hackers-steal-your-credit-card-data',
    title: { ar: 'كيف يسرق الهاكر بيانات بطاقتك البنكية', en: 'How hackers steal your credit card data' },
    excerpt: { 
      ar: 'اكتشف كل ما يخص كيف يسرق الهاكر بيانات بطاقتك البنكية وأهم التفاصيل التقنية.', 
      en: 'Discover everything about How hackers steal your credit card data and the most important tech details.' 
    },
    body: fullBody,
    categoryId: 'cybersecurity' as Category,
    author: {
      name: { ar: 'كريم حسن', en: 'Karim Hassan' },
      avatar: 'https://i.pravatar.cc/150?img=19'
    },
    date: '2023-02-19',
    readTime: 11,
    heroImage: 'https://picsum.photos/seed/article-118-how-hackers-steal-your-credit-card-data/800/450',
    tags: ['Tech', 'Cybersecurity', '2024'],
    isFeatured: false,
    isTrending: false
  },
  {
    id: '119',
    slug: 'article-119-social-media-account-security-tips',
    title: { ar: 'نصائح لأمان حسابات السوشيال ميديا', en: 'Social media account security tips' },
    excerpt: { 
      ar: 'اكتشف كل ما يخص نصائح لأمان حسابات السوشيال ميديا وأهم التفاصيل التقنية.', 
      en: 'Discover everything about Social media account security tips and the most important tech details.' 
    },
    body: fullBody,
    categoryId: 'cybersecurity' as Category,
    author: {
      name: { ar: 'ليلى سامي', en: 'Laila Sami' },
      avatar: 'https://i.pravatar.cc/150?img=20'
    },
    date: '2023-02-21',
    readTime: 12,
    heroImage: 'https://picsum.photos/seed/article-119-social-media-account-security-tips/800/450',
    tags: ['Tech', 'Cybersecurity', '2024'],
    isFeatured: false,
    isTrending: false
  },
  {
    id: '120',
    slug: 'article-120-full-iphone-16-review',
    title: { ar: 'مراجعة iPhone 16 الكاملة', en: 'Full iPhone 16 review' },
    excerpt: { 
      ar: 'اكتشف كل ما يخص مراجعة iPhone 16 الكاملة وأهم التفاصيل التقنية.', 
      en: 'Discover everything about Full iPhone 16 review and the most important tech details.' 
    },
    body: fullBody,
    categoryId: 'mobile' as Category,
    author: {
      name: { ar: 'خالد عبد الله', en: 'Khaled Abdallah' },
      avatar: 'https://i.pravatar.cc/150?img=21'
    },
    date: '2023-02-24',
    readTime: 3,
    heroImage: 'https://picsum.photos/seed/article-120-full-iphone-16-review/800/450',
    tags: ['Tech', 'Mobile', '2024'],
    isFeatured: false,
    isTrending: false
  },
  {
    id: '121',
    slug: 'article-121-best-android-phones-in-2024',
    title: { ar: 'أفضل هواتف أندرويد في 2024', en: 'Best Android phones in 2024' },
    excerpt: { 
      ar: 'اكتشف كل ما يخص أفضل هواتف أندرويد في 2024 وأهم التفاصيل التقنية.', 
      en: 'Discover everything about Best Android phones in 2024 and the most important tech details.' 
    },
    body: fullBody,
    categoryId: 'mobile' as Category,
    author: {
      name: { ar: 'أحمد محمود', en: 'Ahmed Mahmoud' },
      avatar: 'https://i.pravatar.cc/150?img=22'
    },
    date: '2023-02-27',
    readTime: 4,
    heroImage: 'https://picsum.photos/seed/article-121-best-android-phones-in-2024/800/450',
    tags: ['Tech', 'Mobile', '2024'],
    isFeatured: false,
    isTrending: false
  },
  {
    id: '122',
    slug: 'article-122-google-pixel-8-pro-review',
    title: { ar: 'مراجعة Google Pixel 8 Pro', en: 'Google Pixel 8 Pro review' },
    excerpt: { 
      ar: 'اكتشف كل ما يخص مراجعة Google Pixel 8 Pro وأهم التفاصيل التقنية.', 
      en: 'Discover everything about Google Pixel 8 Pro review and the most important tech details.' 
    },
    body: fullBody,
    categoryId: 'mobile' as Category,
    author: {
      name: { ar: 'سارة خالد', en: 'Sarah Khaled' },
      avatar: 'https://i.pravatar.cc/150?img=23'
    },
    date: '2023-03-02',
    readTime: 5,
    heroImage: 'https://picsum.photos/seed/article-122-google-pixel-8-pro-review/800/450',
    tags: ['Tech', 'Mobile', '2024'],
    isFeatured: false,
    isTrending: false
  },
  {
    id: '123',
    slug: 'article-123-samsung-vs-huawei-comparison',
    title: { ar: 'مقارنة بين سامسونج وهواوي', en: 'Samsung vs Huawei comparison' },
    excerpt: { 
      ar: 'اكتشف كل ما يخص مقارنة بين سامسونج وهواوي وأهم التفاصيل التقنية.', 
      en: 'Discover everything about Samsung vs Huawei comparison and the most important tech details.' 
    },
    body: fullBody,
    categoryId: 'mobile' as Category,
    author: {
      name: { ar: 'عمر طارق', en: 'Omar Tarek' },
      avatar: 'https://i.pravatar.cc/150?img=24'
    },
    date: '2023-03-04',
    readTime: 6,
    heroImage: 'https://picsum.photos/seed/article-123-samsung-vs-huawei-comparison/800/450',
    tags: ['Tech', 'Mobile', '2024'],
    isFeatured: false,
    isTrending: false
  },
  {
    id: '124',
    slug: 'article-124-oneplus-12---the-pleasant-surprise',
    title: { ar: 'هاتف OnePlus 12 المفاجأة الجميلة', en: 'OnePlus 12 - the pleasant surprise' },
    excerpt: { 
      ar: 'اكتشف كل ما يخص هاتف OnePlus 12 المفاجأة الجميلة وأهم التفاصيل التقنية.', 
      en: 'Discover everything about OnePlus 12 - the pleasant surprise and the most important tech details.' 
    },
    body: fullBody,
    categoryId: 'mobile' as Category,
    author: {
      name: { ar: 'نور أحمد', en: 'Nour Ahmed' },
      avatar: 'https://i.pravatar.cc/150?img=25'
    },
    date: '2023-03-07',
    readTime: 7,
    heroImage: 'https://picsum.photos/seed/article-124-oneplus-12---the-pleasant-surprise/800/450',
    tags: ['Tech', 'Mobile', '2024'],
    isFeatured: false,
    isTrending: false
  },
  {
    id: '125',
    slug: 'article-125-xiaomi-14-ultra-review',
    title: { ar: 'مراجعة Xiaomi 14 Ultra', en: 'Xiaomi 14 Ultra review' },
    excerpt: { 
      ar: 'اكتشف كل ما يخص مراجعة Xiaomi 14 Ultra وأهم التفاصيل التقنية.', 
      en: 'Discover everything about Xiaomi 14 Ultra review and the most important tech details.' 
    },
    body: fullBody,
    categoryId: 'mobile' as Category,
    author: {
      name: { ar: 'كريم حسن', en: 'Karim Hassan' },
      avatar: 'https://i.pravatar.cc/150?img=26'
    },
    date: '2023-03-10',
    readTime: 8,
    heroImage: 'https://picsum.photos/seed/article-125-xiaomi-14-ultra-review/800/450',
    tags: ['Tech', 'Mobile', '2024'],
    isFeatured: false,
    isTrending: true
  },
  {
    id: '126',
    slug: 'article-126-best-phones-for-photography-in-2024',
    title: { ar: 'أفضل هواتف للتصوير في 2024', en: 'Best phones for photography in 2024' },
    excerpt: { 
      ar: 'اكتشف كل ما يخص أفضل هواتف للتصوير في 2024 وأهم التفاصيل التقنية.', 
      en: 'Discover everything about Best phones for photography in 2024 and the most important tech details.' 
    },
    body: fullBody,
    categoryId: 'mobile' as Category,
    author: {
      name: { ar: 'ليلى سامي', en: 'Laila Sami' },
      avatar: 'https://i.pravatar.cc/150?img=27'
    },
    date: '2023-03-12',
    readTime: 9,
    heroImage: 'https://picsum.photos/seed/article-126-best-phones-for-photography-in-2024/800/450',
    tags: ['Tech', 'Mobile', '2024'],
    isFeatured: false,
    isTrending: false
  },
  {
    id: '127',
    slug: 'article-127-phones-under--300-worth-buying',
    title: { ar: 'هواتف تحت 300 دولار تستحق الشراء', en: 'Phones under $300 worth buying' },
    excerpt: { 
      ar: 'اكتشف كل ما يخص هواتف تحت 300 دولار تستحق الشراء وأهم التفاصيل التقنية.', 
      en: 'Discover everything about Phones under $300 worth buying and the most important tech details.' 
    },
    body: fullBody,
    categoryId: 'mobile' as Category,
    author: {
      name: { ar: 'خالد عبد الله', en: 'Khaled Abdallah' },
      avatar: 'https://i.pravatar.cc/150?img=28'
    },
    date: '2023-03-15',
    readTime: 10,
    heroImage: 'https://picsum.photos/seed/article-127-phones-under--300-worth-buying/800/450',
    tags: ['Tech', 'Mobile', '2024'],
    isFeatured: false,
    isTrending: false
  },
  {
    id: '128',
    slug: 'article-128-comparing-main-smartphone-cameras',
    title: { ar: 'مقارنة كاميرات الهواتف الرئيسية', en: 'Comparing main smartphone cameras' },
    excerpt: { 
      ar: 'اكتشف كل ما يخص مقارنة كاميرات الهواتف الرئيسية وأهم التفاصيل التقنية.', 
      en: 'Discover everything about Comparing main smartphone cameras and the most important tech details.' 
    },
    body: fullBody,
    categoryId: 'mobile' as Category,
    author: {
      name: { ar: 'أحمد محمود', en: 'Ahmed Mahmoud' },
      avatar: 'https://i.pravatar.cc/150?img=29'
    },
    date: '2023-03-18',
    readTime: 11,
    heroImage: 'https://picsum.photos/seed/article-128-comparing-main-smartphone-cameras/800/450',
    tags: ['Tech', 'Mobile', '2024'],
    isFeatured: false,
    isTrending: false
  },
  {
    id: '129',
    slug: 'article-129-samsung-galaxy-z-fold-6-review',
    title: { ar: 'مراجعة Samsung Galaxy Z Fold 6', en: 'Samsung Galaxy Z Fold 6 review' },
    excerpt: { 
      ar: 'اكتشف كل ما يخص مراجعة Samsung Galaxy Z Fold 6 وأهم التفاصيل التقنية.', 
      en: 'Discover everything about Samsung Galaxy Z Fold 6 review and the most important tech details.' 
    },
    body: fullBody,
    categoryId: 'mobile' as Category,
    author: {
      name: { ar: 'سارة خالد', en: 'Sarah Khaled' },
      avatar: 'https://i.pravatar.cc/150?img=30'
    },
    date: '2023-03-21',
    readTime: 12,
    heroImage: 'https://picsum.photos/seed/article-129-samsung-galaxy-z-fold-6-review/800/450',
    tags: ['Tech', 'Mobile', '2024'],
    isFeatured: false,
    isTrending: false
  },
  {
    id: '130',
    slug: 'article-130-best-gaming-phone-in-2024',
    title: { ar: 'أفضل هاتف للألعاب في 2024', en: 'Best gaming phone in 2024' },
    excerpt: { 
      ar: 'اكتشف كل ما يخص أفضل هاتف للألعاب في 2024 وأهم التفاصيل التقنية.', 
      en: 'Discover everything about Best gaming phone in 2024 and the most important tech details.' 
    },
    body: fullBody,
    categoryId: 'mobile' as Category,
    author: {
      name: { ar: 'عمر طارق', en: 'Omar Tarek' },
      avatar: 'https://i.pravatar.cc/150?img=31'
    },
    date: '2023-03-23',
    readTime: 3,
    heroImage: 'https://picsum.photos/seed/article-130-best-gaming-phone-in-2024/800/450',
    tags: ['Tech', 'Mobile', '2024'],
    isFeatured: true,
    isTrending: false
  },
  {
    id: '131',
    slug: 'article-131-evolution-of-foldable-phones',
    title: { ar: 'تطور الهواتف القابلة للطي', en: 'Evolution of foldable phones' },
    excerpt: { 
      ar: 'اكتشف كل ما يخص تطور الهواتف القابلة للطي وأهم التفاصيل التقنية.', 
      en: 'Discover everything about Evolution of foldable phones and the most important tech details.' 
    },
    body: fullBody,
    categoryId: 'mobile' as Category,
    author: {
      name: { ar: 'نور أحمد', en: 'Nour Ahmed' },
      avatar: 'https://i.pravatar.cc/150?img=32'
    },
    date: '2023-03-26',
    readTime: 4,
    heroImage: 'https://picsum.photos/seed/article-131-evolution-of-foldable-phones/800/450',
    tags: ['Tech', 'Mobile', '2024'],
    isFeatured: false,
    isTrending: false
  },
  {
    id: '132',
    slug: 'article-132-oppo-find-x7-ultra-review',
    title: { ar: 'مراجعة OPPO Find X7 Ultra', en: 'OPPO Find X7 Ultra review' },
    excerpt: { 
      ar: 'اكتشف كل ما يخص مراجعة OPPO Find X7 Ultra وأهم التفاصيل التقنية.', 
      en: 'Discover everything about OPPO Find X7 Ultra review and the most important tech details.' 
    },
    body: fullBody,
    categoryId: 'mobile' as Category,
    author: {
      name: { ar: 'كريم حسن', en: 'Karim Hassan' },
      avatar: 'https://i.pravatar.cc/150?img=33'
    },
    date: '2023-03-29',
    readTime: 5,
    heroImage: 'https://picsum.photos/seed/article-132-oppo-find-x7-ultra-review/800/450',
    tags: ['Tech', 'Mobile', '2024'],
    isFeatured: false,
    isTrending: false
  },
  {
    id: '133',
    slug: 'article-133-sony-xperia-1-vi-special-review',
    title: { ar: 'هاتف Sony Xperia 1 VI المميز', en: 'Sony Xperia 1 VI special review' },
    excerpt: { 
      ar: 'اكتشف كل ما يخص هاتف Sony Xperia 1 VI المميز وأهم التفاصيل التقنية.', 
      en: 'Discover everything about Sony Xperia 1 VI special review and the most important tech details.' 
    },
    body: fullBody,
    categoryId: 'mobile' as Category,
    author: {
      name: { ar: 'ليلى سامي', en: 'Laila Sami' },
      avatar: 'https://i.pravatar.cc/150?img=34'
    },
    date: '2023-04-01',
    readTime: 6,
    heroImage: 'https://picsum.photos/seed/article-133-sony-xperia-1-vi-special-review/800/450',
    tags: ['Tech', 'Mobile', '2024'],
    isFeatured: false,
    isTrending: false
  },
  {
    id: '134',
    slug: 'article-134-secrets-to-getting-the-most-from-your-phone-camera',
    title: { ar: 'أسرار الاستفادة من كاميرا هاتفك', en: 'Secrets to getting the most from your phone camera' },
    excerpt: { 
      ar: 'اكتشف كل ما يخص أسرار الاستفادة من كاميرا هاتفك وأهم التفاصيل التقنية.', 
      en: 'Discover everything about Secrets to getting the most from your phone camera and the most important tech details.' 
    },
    body: fullBody,
    categoryId: 'mobile' as Category,
    author: {
      name: { ar: 'خالد عبد الله', en: 'Khaled Abdallah' },
      avatar: 'https://i.pravatar.cc/150?img=35'
    },
    date: '2023-04-03',
    readTime: 7,
    heroImage: 'https://picsum.photos/seed/article-134-secrets-to-getting-the-most-from-your-phone-camera/800/450',
    tags: ['Tech', 'Mobile', '2024'],
    isFeatured: false,
    isTrending: false
  },
  {
    id: '135',
    slug: 'article-135-how-to-extend-your-phone-battery-life',
    title: { ar: 'كيف تطيل عمر بطارية هاتفك', en: 'How to extend your phone battery life' },
    excerpt: { 
      ar: 'اكتشف كل ما يخص كيف تطيل عمر بطارية هاتفك وأهم التفاصيل التقنية.', 
      en: 'Discover everything about How to extend your phone battery life and the most important tech details.' 
    },
    body: fullBody,
    categoryId: 'mobile' as Category,
    author: {
      name: { ar: 'أحمد محمود', en: 'Ahmed Mahmoud' },
      avatar: 'https://i.pravatar.cc/150?img=36'
    },
    date: '2023-04-06',
    readTime: 8,
    heroImage: 'https://picsum.photos/seed/article-135-how-to-extend-your-phone-battery-life/800/450',
    tags: ['Tech', 'Mobile', '2024'],
    isFeatured: false,
    isTrending: false
  },
  {
    id: '136',
    slug: 'article-136-new-ios-18-updates',
    title: { ar: 'تحديثات iOS 18 الجديدة', en: 'New iOS 18 updates' },
    excerpt: { 
      ar: 'اكتشف كل ما يخص تحديثات iOS 18 الجديدة وأهم التفاصيل التقنية.', 
      en: 'Discover everything about New iOS 18 updates and the most important tech details.' 
    },
    body: fullBody,
    categoryId: 'mobile' as Category,
    author: {
      name: { ar: 'سارة خالد', en: 'Sarah Khaled' },
      avatar: 'https://i.pravatar.cc/150?img=37'
    },
    date: '2023-04-09',
    readTime: 9,
    heroImage: 'https://picsum.photos/seed/article-136-new-ios-18-updates/800/450',
    tags: ['Tech', 'Mobile', '2024'],
    isFeatured: false,
    isTrending: false
  },
  {
    id: '137',
    slug: 'article-137-full-android-15-features',
    title: { ar: 'مميزات Android 15 الكاملة', en: 'Full Android 15 features' },
    excerpt: { 
      ar: 'اكتشف كل ما يخص مميزات Android 15 الكاملة وأهم التفاصيل التقنية.', 
      en: 'Discover everything about Full Android 15 features and the most important tech details.' 
    },
    body: fullBody,
    categoryId: 'mobile' as Category,
    author: {
      name: { ar: 'عمر طارق', en: 'Omar Tarek' },
      avatar: 'https://i.pravatar.cc/150?img=38'
    },
    date: '2023-04-12',
    readTime: 10,
    heroImage: 'https://picsum.photos/seed/article-137-full-android-15-features/800/450',
    tags: ['Tech', 'Mobile', '2024'],
    isFeatured: false,
    isTrending: false
  },
  {
    id: '138',
    slug: 'article-138-is-a-foldable-phone-worth-its-price',
    title: { ar: 'هل الهاتف المطوي يستحق سعره', en: 'Is a foldable phone worth its price' },
    excerpt: { 
      ar: 'اكتشف كل ما يخص هل الهاتف المطوي يستحق سعره وأهم التفاصيل التقنية.', 
      en: 'Discover everything about Is a foldable phone worth its price and the most important tech details.' 
    },
    body: fullBody,
    categoryId: 'mobile' as Category,
    author: {
      name: { ar: 'نور أحمد', en: 'Nour Ahmed' },
      avatar: 'https://i.pravatar.cc/150?img=39'
    },
    date: '2023-04-14',
    readTime: 11,
    heroImage: 'https://picsum.photos/seed/article-138-is-a-foldable-phone-worth-its-price/800/450',
    tags: ['Tech', 'Mobile', '2024'],
    isFeatured: false,
    isTrending: false
  },
  {
    id: '139',
    slug: 'article-139-best-phone-accessories-in-2024',
    title: { ar: 'أفضل إكسسوارات الهاتف في 2024', en: 'Best phone accessories in 2024' },
    excerpt: { 
      ar: 'اكتشف كل ما يخص أفضل إكسسوارات الهاتف في 2024 وأهم التفاصيل التقنية.', 
      en: 'Discover everything about Best phone accessories in 2024 and the most important tech details.' 
    },
    body: fullBody,
    categoryId: 'mobile' as Category,
    author: {
      name: { ar: 'كريم حسن', en: 'Karim Hassan' },
      avatar: 'https://i.pravatar.cc/150?img=40'
    },
    date: '2023-04-17',
    readTime: 12,
    heroImage: 'https://picsum.photos/seed/article-139-best-phone-accessories-in-2024/800/450',
    tags: ['Tech', 'Mobile', '2024'],
    isFeatured: false,
    isTrending: false
  },
  {
    id: '140',
    slug: 'article-140-macbook-pro-m3-max-review',
    title: { ar: 'مراجعة MacBook Pro M3 Max', en: 'MacBook Pro M3 Max review' },
    excerpt: { 
      ar: 'اكتشف كل ما يخص مراجعة MacBook Pro M3 Max وأهم التفاصيل التقنية.', 
      en: 'Discover everything about MacBook Pro M3 Max review and the most important tech details.' 
    },
    body: fullBody,
    categoryId: 'laptops' as Category,
    author: {
      name: { ar: 'ليلى سامي', en: 'Laila Sami' },
      avatar: 'https://i.pravatar.cc/150?img=41'
    },
    date: '2023-04-20',
    readTime: 3,
    heroImage: 'https://picsum.photos/seed/article-140-macbook-pro-m3-max-review/800/450',
    tags: ['Tech', 'Laptops', '2024'],
    isFeatured: false,
    isTrending: false
  },
  {
    id: '141',
    slug: 'article-141-best-laptops-for-programmers',
    title: { ar: 'أفضل لابتوبات للمبرمجين', en: 'Best laptops for programmers' },
    excerpt: { 
      ar: 'اكتشف كل ما يخص أفضل لابتوبات للمبرمجين وأهم التفاصيل التقنية.', 
      en: 'Discover everything about Best laptops for programmers and the most important tech details.' 
    },
    body: fullBody,
    categoryId: 'laptops' as Category,
    author: {
      name: { ar: 'خالد عبد الله', en: 'Khaled Abdallah' },
      avatar: 'https://i.pravatar.cc/150?img=42'
    },
    date: '2023-04-22',
    readTime: 4,
    heroImage: 'https://picsum.photos/seed/article-141-best-laptops-for-programmers/800/450',
    tags: ['Tech', 'Laptops', '2024'],
    isFeatured: false,
    isTrending: false
  },
  {
    id: '142',
    slug: 'article-142-dell-xps-15-2024-review',
    title: { ar: 'مراجعة Dell XPS 15 2024', en: 'Dell XPS 15 2024 review' },
    excerpt: { 
      ar: 'اكتشف كل ما يخص مراجعة Dell XPS 15 2024 وأهم التفاصيل التقنية.', 
      en: 'Discover everything about Dell XPS 15 2024 review and the most important tech details.' 
    },
    body: fullBody,
    categoryId: 'laptops' as Category,
    author: {
      name: { ar: 'أحمد محمود', en: 'Ahmed Mahmoud' },
      avatar: 'https://i.pravatar.cc/150?img=43'
    },
    date: '2023-04-25',
    readTime: 5,
    heroImage: 'https://picsum.photos/seed/article-142-dell-xps-15-2024-review/800/450',
    tags: ['Tech', 'Laptops', '2024'],
    isFeatured: false,
    isTrending: false
  },
  {
    id: '143',
    slug: 'article-143-lenovo-thinkpad-x1-for-business',
    title: { ar: 'لابتوب Lenovo ThinkPad X1 للأعمال', en: 'Lenovo ThinkPad X1 for business' },
    excerpt: { 
      ar: 'اكتشف كل ما يخص لابتوب Lenovo ThinkPad X1 للأعمال وأهم التفاصيل التقنية.', 
      en: 'Discover everything about Lenovo ThinkPad X1 for business and the most important tech details.' 
    },
    body: fullBody,
    categoryId: 'laptops' as Category,
    author: {
      name: { ar: 'سارة خالد', en: 'Sarah Khaled' },
      avatar: 'https://i.pravatar.cc/150?img=44'
    },
    date: '2023-04-28',
    readTime: 6,
    heroImage: 'https://picsum.photos/seed/article-143-lenovo-thinkpad-x1-for-business/800/450',
    tags: ['Tech', 'Laptops', '2024'],
    isFeatured: false,
    isTrending: false
  },
  {
    id: '144',
    slug: 'article-144-best-affordable-student-laptops',
    title: { ar: 'أفضل لابتوبات للطلاب بأسعار معقولة', en: 'Best affordable student laptops' },
    excerpt: { 
      ar: 'اكتشف كل ما يخص أفضل لابتوبات للطلاب بأسعار معقولة وأهم التفاصيل التقنية.', 
      en: 'Discover everything about Best affordable student laptops and the most important tech details.' 
    },
    body: fullBody,
    categoryId: 'laptops' as Category,
    author: {
      name: { ar: 'عمر طارق', en: 'Omar Tarek' },
      avatar: 'https://i.pravatar.cc/150?img=45'
    },
    date: '2023-05-01',
    readTime: 7,
    heroImage: 'https://picsum.photos/seed/article-144-best-affordable-student-laptops/800/450',
    tags: ['Tech', 'Laptops', '2024'],
    isFeatured: false,
    isTrending: false
  },
  {
    id: '145',
    slug: 'article-145-asus-rog-zephyrus-g14-review',
    title: { ar: 'مراجعة ASUS ROG Zephyrus G14', en: 'ASUS ROG Zephyrus G14 review' },
    excerpt: { 
      ar: 'اكتشف كل ما يخص مراجعة ASUS ROG Zephyrus G14 وأهم التفاصيل التقنية.', 
      en: 'Discover everything about ASUS ROG Zephyrus G14 review and the most important tech details.' 
    },
    body: fullBody,
    categoryId: 'laptops' as Category,
    author: {
      name: { ar: 'نور أحمد', en: 'Nour Ahmed' },
      avatar: 'https://i.pravatar.cc/150?img=46'
    },
    date: '2023-05-03',
    readTime: 8,
    heroImage: 'https://picsum.photos/seed/article-145-asus-rog-zephyrus-g14-review/800/450',
    tags: ['Tech', 'Laptops', '2024'],
    isFeatured: false,
    isTrending: false
  },
  {
    id: '146',
    slug: 'article-146-laptops-for-creators-and-designers',
    title: { ar: 'لابتوبات المبدعين والمصممين', en: 'Laptops for creators and designers' },
    excerpt: { 
      ar: 'اكتشف كل ما يخص لابتوبات المبدعين والمصممين وأهم التفاصيل التقنية.', 
      en: 'Discover everything about Laptops for creators and designers and the most important tech details.' 
    },
    body: fullBody,
    categoryId: 'laptops' as Category,
    author: {
      name: { ar: 'كريم حسن', en: 'Karim Hassan' },
      avatar: 'https://i.pravatar.cc/150?img=47'
    },
    date: '2023-05-06',
    readTime: 9,
    heroImage: 'https://picsum.photos/seed/article-146-laptops-for-creators-and-designers/800/450',
    tags: ['Tech', 'Laptops', '2024'],
    isFeatured: false,
    isTrending: false
  },
  {
    id: '147',
    slug: 'article-147-hp-spectre-x360-14-review',
    title: { ar: 'مراجعة HP Spectre x360 14', en: 'HP Spectre x360 14 review' },
    excerpt: { 
      ar: 'اكتشف كل ما يخص مراجعة HP Spectre x360 14 وأهم التفاصيل التقنية.', 
      en: 'Discover everything about HP Spectre x360 14 review and the most important tech details.' 
    },
    body: fullBody,
    categoryId: 'laptops' as Category,
    author: {
      name: { ar: 'ليلى سامي', en: 'Laila Sami' },
      avatar: 'https://i.pravatar.cc/150?img=48'
    },
    date: '2023-05-09',
    readTime: 10,
    heroImage: 'https://picsum.photos/seed/article-147-hp-spectre-x360-14-review/800/450',
    tags: ['Tech', 'Laptops', '2024'],
    isFeatured: false,
    isTrending: false
  },
  {
    id: '148',
    slug: 'article-148-why-the-framework-laptop-is-worth-buying',
    title: { ar: 'لماذا يستحق Framework Laptop الشراء', en: 'Why the Framework Laptop is worth buying' },
    excerpt: { 
      ar: 'اكتشف كل ما يخص لماذا يستحق Framework Laptop الشراء وأهم التفاصيل التقنية.', 
      en: 'Discover everything about Why the Framework Laptop is worth buying and the most important tech details.' 
    },
    body: fullBody,
    categoryId: 'laptops' as Category,
    author: {
      name: { ar: 'خالد عبد الله', en: 'Khaled Abdallah' },
      avatar: 'https://i.pravatar.cc/150?img=49'
    },
    date: '2023-05-12',
    readTime: 11,
    heroImage: 'https://picsum.photos/seed/article-148-why-the-framework-laptop-is-worth-buying/800/450',
    tags: ['Tech', 'Laptops', '2024'],
    isFeatured: false,
    isTrending: false
  },
  {
    id: '149',
    slug: 'article-149-gaming-laptops-comparison-2024',
    title: { ar: 'مقارنة لابتوبات الألعاب في 2024', en: 'Gaming laptops comparison 2024' },
    excerpt: { 
      ar: 'اكتشف كل ما يخص مقارنة لابتوبات الألعاب في 2024 وأهم التفاصيل التقنية.', 
      en: 'Discover everything about Gaming laptops comparison 2024 and the most important tech details.' 
    },
    body: fullBody,
    categoryId: 'laptops' as Category,
    author: {
      name: { ar: 'أحمد محمود', en: 'Ahmed Mahmoud' },
      avatar: 'https://i.pravatar.cc/150?img=50'
    },
    date: '2023-05-14',
    readTime: 12,
    heroImage: 'https://picsum.photos/seed/article-149-gaming-laptops-comparison-2024/800/450',
    tags: ['Tech', 'Laptops', '2024'],
    isFeatured: false,
    isTrending: false
  },
  {
    id: '150',
    slug: 'article-150-how-to-choose-the-right-ram-for-your-laptop',
    title: { ar: 'كيف تختار الرام المناسبة للابتوب', en: 'How to choose the right RAM for your laptop' },
    excerpt: { 
      ar: 'اكتشف كل ما يخص كيف تختار الرام المناسبة للابتوب وأهم التفاصيل التقنية.', 
      en: 'Discover everything about How to choose the right RAM for your laptop and the most important tech details.' 
    },
    body: fullBody,
    categoryId: 'laptops' as Category,
    author: {
      name: { ar: 'سارة خالد', en: 'Sarah Khaled' },
      avatar: 'https://i.pravatar.cc/150?img=51'
    },
    date: '2023-05-17',
    readTime: 3,
    heroImage: 'https://picsum.photos/seed/article-150-how-to-choose-the-right-ram-for-your-laptop/800/450',
    tags: ['Tech', 'Laptops', '2024'],
    isFeatured: false,
    isTrending: true
  },
  {
    id: '151',
    slug: 'article-151-microsoft-surface-pro-10-review',
    title: { ar: 'مراجعة Microsoft Surface Pro 10', en: 'Microsoft Surface Pro 10 review' },
    excerpt: { 
      ar: 'اكتشف كل ما يخص مراجعة Microsoft Surface Pro 10 وأهم التفاصيل التقنية.', 
      en: 'Discover everything about Microsoft Surface Pro 10 review and the most important tech details.' 
    },
    body: fullBody,
    categoryId: 'laptops' as Category,
    author: {
      name: { ar: 'عمر طارق', en: 'Omar Tarek' },
      avatar: 'https://i.pravatar.cc/150?img=52'
    },
    date: '2023-05-20',
    readTime: 4,
    heroImage: 'https://picsum.photos/seed/article-151-microsoft-surface-pro-10-review/800/450',
    tags: ['Tech', 'Laptops', '2024'],
    isFeatured: false,
    isTrending: false
  },
  {
    id: '152',
    slug: 'article-152-laptops-under--500-worth-buying',
    title: { ar: 'لابتوبات تحت 500 دولار تستحق', en: 'Laptops under $500 worth buying' },
    excerpt: { 
      ar: 'اكتشف كل ما يخص لابتوبات تحت 500 دولار تستحق وأهم التفاصيل التقنية.', 
      en: 'Discover everything about Laptops under $500 worth buying and the most important tech details.' 
    },
    body: fullBody,
    categoryId: 'laptops' as Category,
    author: {
      name: { ar: 'نور أحمد', en: 'Nour Ahmed' },
      avatar: 'https://i.pravatar.cc/150?img=53'
    },
    date: '2023-05-22',
    readTime: 5,
    heroImage: 'https://picsum.photos/seed/article-152-laptops-under--500-worth-buying/800/450',
    tags: ['Tech', 'Laptops', '2024'],
    isFeatured: false,
    isTrending: false
  },
  {
    id: '153',
    slug: 'article-153-upgrading-laptop-ssd--complete-guide',
    title: { ar: 'ترقية SSD في اللابتوب: الدليل الكامل', en: 'Upgrading laptop SSD: complete guide' },
    excerpt: { 
      ar: 'اكتشف كل ما يخص ترقية SSD في اللابتوب: الدليل الكامل وأهم التفاصيل التقنية.', 
      en: 'Discover everything about Upgrading laptop SSD: complete guide and the most important tech details.' 
    },
    body: fullBody,
    categoryId: 'laptops' as Category,
    author: {
      name: { ar: 'كريم حسن', en: 'Karim Hassan' },
      avatar: 'https://i.pravatar.cc/150?img=54'
    },
    date: '2023-05-25',
    readTime: 6,
    heroImage: 'https://picsum.photos/seed/article-153-upgrading-laptop-ssd--complete-guide/800/450',
    tags: ['Tech', 'Laptops', '2024'],
    isFeatured: false,
    isTrending: false
  },
  {
    id: '154',
    slug: 'article-154-best-amd-ryzen-laptops-in-2024',
    title: { ar: 'أفضل لابتوبات AMD Ryzen في 2024', en: 'Best AMD Ryzen laptops in 2024' },
    excerpt: { 
      ar: 'اكتشف كل ما يخص أفضل لابتوبات AMD Ryzen في 2024 وأهم التفاصيل التقنية.', 
      en: 'Discover everything about Best AMD Ryzen laptops in 2024 and the most important tech details.' 
    },
    body: fullBody,
    categoryId: 'laptops' as Category,
    author: {
      name: { ar: 'ليلى سامي', en: 'Laila Sami' },
      avatar: 'https://i.pravatar.cc/150?img=55'
    },
    date: '2023-05-28',
    readTime: 7,
    heroImage: 'https://picsum.photos/seed/article-154-best-amd-ryzen-laptops-in-2024/800/450',
    tags: ['Tech', 'Laptops', '2024'],
    isFeatured: false,
    isTrending: false
  },
  {
    id: '155',
    slug: 'article-155-how-to-clean-your-laptop-internally',
    title: { ar: 'كيف تنظف لابتوبك من الداخل', en: 'How to clean your laptop internally' },
    excerpt: { 
      ar: 'اكتشف كل ما يخص كيف تنظف لابتوبك من الداخل وأهم التفاصيل التقنية.', 
      en: 'Discover everything about How to clean your laptop internally and the most important tech details.' 
    },
    body: fullBody,
    categoryId: 'laptops' as Category,
    author: {
      name: { ar: 'خالد عبد الله', en: 'Khaled Abdallah' },
      avatar: 'https://i.pravatar.cc/150?img=56'
    },
    date: '2023-05-31',
    readTime: 8,
    heroImage: 'https://picsum.photos/seed/article-155-how-to-clean-your-laptop-internally/800/450',
    tags: ['Tech', 'Laptops', '2024'],
    isFeatured: false,
    isTrending: false
  },
  {
    id: '156',
    slug: 'article-156-common-laptop-problems-and-solutions',
    title: { ar: 'مشاكل اللابتوب الشائعة وحلولها', en: 'Common laptop problems and solutions' },
    excerpt: { 
      ar: 'اكتشف كل ما يخص مشاكل اللابتوب الشائعة وحلولها وأهم التفاصيل التقنية.', 
      en: 'Discover everything about Common laptop problems and solutions and the most important tech details.' 
    },
    body: fullBody,
    categoryId: 'laptops' as Category,
    author: {
      name: { ar: 'أحمد محمود', en: 'Ahmed Mahmoud' },
      avatar: 'https://i.pravatar.cc/150?img=57'
    },
    date: '2023-06-02',
    readTime: 9,
    heroImage: 'https://picsum.photos/seed/article-156-common-laptop-problems-and-solutions/800/450',
    tags: ['Tech', 'Laptops', '2024'],
    isFeatured: false,
    isTrending: false
  },
  {
    id: '157',
    slug: 'article-157-windows-vs-macos-for-regular-users',
    title: { ar: 'مقارنة Windows vs macOS للمستخدم العادي', en: 'Windows vs macOS for regular users' },
    excerpt: { 
      ar: 'اكتشف كل ما يخص مقارنة Windows vs macOS للمستخدم العادي وأهم التفاصيل التقنية.', 
      en: 'Discover everything about Windows vs macOS for regular users and the most important tech details.' 
    },
    body: fullBody,
    categoryId: 'laptops' as Category,
    author: {
      name: { ar: 'سارة خالد', en: 'Sarah Khaled' },
      avatar: 'https://i.pravatar.cc/150?img=58'
    },
    date: '2023-06-05',
    readTime: 10,
    heroImage: 'https://picsum.photos/seed/article-157-windows-vs-macos-for-regular-users/800/450',
    tags: ['Tech', 'Laptops', '2024'],
    isFeatured: false,
    isTrending: false
  },
  {
    id: '158',
    slug: 'article-158-best-laptop-bags-and-accessories',
    title: { ar: 'أفضل حقائب ولوازم اللابتوب', en: 'Best laptop bags and accessories' },
    excerpt: { 
      ar: 'اكتشف كل ما يخص أفضل حقائب ولوازم اللابتوب وأهم التفاصيل التقنية.', 
      en: 'Discover everything about Best laptop bags and accessories and the most important tech details.' 
    },
    body: fullBody,
    categoryId: 'laptops' as Category,
    author: {
      name: { ar: 'عمر طارق', en: 'Omar Tarek' },
      avatar: 'https://i.pravatar.cc/150?img=59'
    },
    date: '2023-06-08',
    readTime: 11,
    heroImage: 'https://picsum.photos/seed/article-158-best-laptop-bags-and-accessories/800/450',
    tags: ['Tech', 'Laptops', '2024'],
    isFeatured: false,
    isTrending: false
  },
  {
    id: '159',
    slug: 'article-159-when-to-replace-an-old-laptop',
    title: { ar: 'متى يجب تبديل اللابتوب القديم', en: 'When to replace an old laptop' },
    excerpt: { 
      ar: 'اكتشف كل ما يخص متى يجب تبديل اللابتوب القديم وأهم التفاصيل التقنية.', 
      en: 'Discover everything about When to replace an old laptop and the most important tech details.' 
    },
    body: fullBody,
    categoryId: 'laptops' as Category,
    author: {
      name: { ar: 'نور أحمد', en: 'Nour Ahmed' },
      avatar: 'https://i.pravatar.cc/150?img=60'
    },
    date: '2023-06-11',
    readTime: 12,
    heroImage: 'https://picsum.photos/seed/article-159-when-to-replace-an-old-laptop/800/450',
    tags: ['Tech', 'Laptops', '2024'],
    isFeatured: false,
    isTrending: false
  },
  {
    id: '160',
    slug: 'article-160-how-to-recover-deleted-files',
    title: { ar: 'كيف تسترد الملفات المحذوفة', en: 'How to recover deleted files' },
    excerpt: { 
      ar: 'اكتشف كل ما يخص كيف تسترد الملفات المحذوفة وأهم التفاصيل التقنية.', 
      en: 'Discover everything about How to recover deleted files and the most important tech details.' 
    },
    body: fullBody,
    categoryId: 'howto' as Category,
    author: {
      name: { ar: 'كريم حسن', en: 'Karim Hassan' },
      avatar: 'https://i.pravatar.cc/150?img=61'
    },
    date: '2023-06-13',
    readTime: 3,
    heroImage: 'https://picsum.photos/seed/article-160-how-to-recover-deleted-files/800/450',
    tags: ['Tech', 'Howto', '2024'],
    isFeatured: true,
    isTrending: false
  },
  {
    id: '161',
    slug: 'article-161-fix-a-slow-computer',
    title: { ar: 'حل مشكلة الكمبيوتر البطيء', en: 'Fix a slow computer' },
    excerpt: { 
      ar: 'اكتشف كل ما يخص حل مشكلة الكمبيوتر البطيء وأهم التفاصيل التقنية.', 
      en: 'Discover everything about Fix a slow computer and the most important tech details.' 
    },
    body: fullBody,
    categoryId: 'howto' as Category,
    author: {
      name: { ar: 'ليلى سامي', en: 'Laila Sami' },
      avatar: 'https://i.pravatar.cc/150?img=62'
    },
    date: '2023-06-16',
    readTime: 4,
    heroImage: 'https://picsum.photos/seed/article-161-fix-a-slow-computer/800/450',
    tags: ['Tech', 'Howto', '2024'],
    isFeatured: false,
    isTrending: false
  },
  {
    id: '162',
    slug: 'article-162-how-to-configure-router-for-faster-internet',
    title: { ar: 'كيف تضبط الراوتر للحصول على إنترنت أسرع', en: 'How to configure router for faster internet' },
    excerpt: { 
      ar: 'اكتشف كل ما يخص كيف تضبط الراوتر للحصول على إنترنت أسرع وأهم التفاصيل التقنية.', 
      en: 'Discover everything about How to configure router for faster internet and the most important tech details.' 
    },
    body: fullBody,
    categoryId: 'howto' as Category,
    author: {
      name: { ar: 'خالد عبد الله', en: 'Khaled Abdallah' },
      avatar: 'https://i.pravatar.cc/150?img=63'
    },
    date: '2023-06-19',
    readTime: 5,
    heroImage: 'https://picsum.photos/seed/article-162-how-to-configure-router-for-faster-internet/800/450',
    tags: ['Tech', 'Howto', '2024'],
    isFeatured: false,
    isTrending: false
  },
  {
    id: '163',
    slug: 'article-163-fixing-a-dead-laptop-screen',
    title: { ar: 'إصلاح شاشة اللابتوب الميتة', en: 'Fixing a dead laptop screen' },
    excerpt: { 
      ar: 'اكتشف كل ما يخص إصلاح شاشة اللابتوب الميتة وأهم التفاصيل التقنية.', 
      en: 'Discover everything about Fixing a dead laptop screen and the most important tech details.' 
    },
    body: fullBody,
    categoryId: 'howto' as Category,
    author: {
      name: { ar: 'أحمد محمود', en: 'Ahmed Mahmoud' },
      avatar: 'https://i.pravatar.cc/150?img=64'
    },
    date: '2023-06-21',
    readTime: 6,
    heroImage: 'https://picsum.photos/seed/article-163-fixing-a-dead-laptop-screen/800/450',
    tags: ['Tech', 'Howto', '2024'],
    isFeatured: false,
    isTrending: false
  },
  {
    id: '164',
    slug: 'article-164-how-to-transfer-data-from-old-to-new-phone',
    title: { ar: 'كيف تنقل البيانات من هاتف قديم لجديد', en: 'How to transfer data from old to new phone' },
    excerpt: { 
      ar: 'اكتشف كل ما يخص كيف تنقل البيانات من هاتف قديم لجديد وأهم التفاصيل التقنية.', 
      en: 'Discover everything about How to transfer data from old to new phone and the most important tech details.' 
    },
    body: fullBody,
    categoryId: 'howto' as Category,
    author: {
      name: { ar: 'سارة خالد', en: 'Sarah Khaled' },
      avatar: 'https://i.pravatar.cc/150?img=65'
    },
    date: '2023-06-24',
    readTime: 7,
    heroImage: 'https://picsum.photos/seed/article-164-how-to-transfer-data-from-old-to-new-phone/800/450',
    tags: ['Tech', 'Howto', '2024'],
    isFeatured: false,
    isTrending: false
  },
  {
    id: '165',
    slug: 'article-165-fix-common-printer-problems',
    title: { ar: 'حل مشاكل الطابعة الشائعة', en: 'Fix common printer problems' },
    excerpt: { 
      ar: 'اكتشف كل ما يخص حل مشاكل الطابعة الشائعة وأهم التفاصيل التقنية.', 
      en: 'Discover everything about Fix common printer problems and the most important tech details.' 
    },
    body: fullBody,
    categoryId: 'howto' as Category,
    author: {
      name: { ar: 'عمر طارق', en: 'Omar Tarek' },
      avatar: 'https://i.pravatar.cc/150?img=66'
    },
    date: '2023-06-27',
    readTime: 8,
    heroImage: 'https://picsum.photos/seed/article-165-fix-common-printer-problems/800/450',
    tags: ['Tech', 'Howto', '2024'],
    isFeatured: false,
    isTrending: false
  },
  {
    id: '166',
    slug: 'article-166-how-to-protect-data-with-backups',
    title: { ar: 'كيف تحمي بياناتك بالنسخ الاحتياطي', en: 'How to protect data with backups' },
    excerpt: { 
      ar: 'اكتشف كل ما يخص كيف تحمي بياناتك بالنسخ الاحتياطي وأهم التفاصيل التقنية.', 
      en: 'Discover everything about How to protect data with backups and the most important tech details.' 
    },
    body: fullBody,
    categoryId: 'howto' as Category,
    author: {
      name: { ar: 'نور أحمد', en: 'Nour Ahmed' },
      avatar: 'https://i.pravatar.cc/150?img=67'
    },
    date: '2023-06-30',
    readTime: 9,
    heroImage: 'https://picsum.photos/seed/article-166-how-to-protect-data-with-backups/800/450',
    tags: ['Tech', 'Howto', '2024'],
    isFeatured: false,
    isTrending: false
  },
  {
    id: '167',
    slug: 'article-167-fix-computer-audio-problems',
    title: { ar: 'إصلاح مشاكل الصوت في الكمبيوتر', en: 'Fix computer audio problems' },
    excerpt: { 
      ar: 'اكتشف كل ما يخص إصلاح مشاكل الصوت في الكمبيوتر وأهم التفاصيل التقنية.', 
      en: 'Discover everything about Fix computer audio problems and the most important tech details.' 
    },
    body: fullBody,
    categoryId: 'howto' as Category,
    author: {
      name: { ar: 'كريم حسن', en: 'Karim Hassan' },
      avatar: 'https://i.pravatar.cc/150?img=68'
    },
    date: '2023-07-02',
    readTime: 10,
    heroImage: 'https://picsum.photos/seed/article-167-fix-computer-audio-problems/800/450',
    tags: ['Tech', 'Howto', '2024'],
    isFeatured: false,
    isTrending: false
  },
  {
    id: '168',
    slug: 'article-168-how-to-compress-images-without-quality-loss',
    title: { ar: 'كيف تضغط الصور دون فقدان الجودة', en: 'How to compress images without quality loss' },
    excerpt: { 
      ar: 'اكتشف كل ما يخص كيف تضغط الصور دون فقدان الجودة وأهم التفاصيل التقنية.', 
      en: 'Discover everything about How to compress images without quality loss and the most important tech details.' 
    },
    body: fullBody,
    categoryId: 'howto' as Category,
    author: {
      name: { ar: 'ليلى سامي', en: 'Laila Sami' },
      avatar: 'https://i.pravatar.cc/150?img=69'
    },
    date: '2023-07-05',
    readTime: 11,
    heroImage: 'https://picsum.photos/seed/article-168-how-to-compress-images-without-quality-loss/800/450',
    tags: ['Tech', 'Howto', '2024'],
    isFeatured: false,
    isTrending: false
  },
  {
    id: '169',
    slug: 'article-169-speed-up-website-loading',
    title: { ar: 'تسريع تحميل المواقع الإلكترونية', en: 'Speed up website loading' },
    excerpt: { 
      ar: 'اكتشف كل ما يخص تسريع تحميل المواقع الإلكترونية وأهم التفاصيل التقنية.', 
      en: 'Discover everything about Speed up website loading and the most important tech details.' 
    },
    body: fullBody,
    categoryId: 'howto' as Category,
    author: {
      name: { ar: 'خالد عبد الله', en: 'Khaled Abdallah' },
      avatar: 'https://i.pravatar.cc/150?img=70'
    },
    date: '2023-07-08',
    readTime: 12,
    heroImage: 'https://picsum.photos/seed/article-169-speed-up-website-loading/800/450',
    tags: ['Tech', 'Howto', '2024'],
    isFeatured: false,
    isTrending: false
  },
  {
    id: '170',
    slug: 'article-170-how-to-create-a-home-vpn-network',
    title: { ar: 'كيف تنشئ شبكة VPN منزلية', en: 'How to create a home VPN network' },
    excerpt: { 
      ar: 'اكتشف كل ما يخص كيف تنشئ شبكة VPN منزلية وأهم التفاصيل التقنية.', 
      en: 'Discover everything about How to create a home VPN network and the most important tech details.' 
    },
    body: fullBody,
    categoryId: 'howto' as Category,
    author: {
      name: { ar: 'أحمد محمود', en: 'Ahmed Mahmoud' },
      avatar: 'https://i.pravatar.cc/150?img=1'
    },
    date: '2023-07-11',
    readTime: 3,
    heroImage: 'https://picsum.photos/seed/article-170-how-to-create-a-home-vpn-network/800/450',
    tags: ['Tech', 'Howto', '2024'],
    isFeatured: false,
    isTrending: false
  },
  {
    id: '171',
    slug: 'article-171-fix-corrupted-system-files-in-windows',
    title: { ar: 'إصلاح ملفات النظام التالفة في ويندوز', en: 'Fix corrupted system files in Windows' },
    excerpt: { 
      ar: 'اكتشف كل ما يخص إصلاح ملفات النظام التالفة في ويندوز وأهم التفاصيل التقنية.', 
      en: 'Discover everything about Fix corrupted system files in Windows and the most important tech details.' 
    },
    body: fullBody,
    categoryId: 'howto' as Category,
    author: {
      name: { ar: 'سارة خالد', en: 'Sarah Khaled' },
      avatar: 'https://i.pravatar.cc/150?img=2'
    },
    date: '2023-07-13',
    readTime: 4,
    heroImage: 'https://picsum.photos/seed/article-171-fix-corrupted-system-files-in-windows/800/450',
    tags: ['Tech', 'Howto', '2024'],
    isFeatured: false,
    isTrending: false
  },
  {
    id: '172',
    slug: 'article-172-how-to-convert-pdf-files-easily',
    title: { ar: 'كيف تحول ملفات PDF بسهولة', en: 'How to convert PDF files easily' },
    excerpt: { 
      ar: 'اكتشف كل ما يخص كيف تحول ملفات PDF بسهولة وأهم التفاصيل التقنية.', 
      en: 'Discover everything about How to convert PDF files easily and the most important tech details.' 
    },
    body: fullBody,
    categoryId: 'howto' as Category,
    author: {
      name: { ar: 'عمر طارق', en: 'Omar Tarek' },
      avatar: 'https://i.pravatar.cc/150?img=3'
    },
    date: '2023-07-16',
    readTime: 5,
    heroImage: 'https://picsum.photos/seed/article-172-how-to-convert-pdf-files-easily/800/450',
    tags: ['Tech', 'Howto', '2024'],
    isFeatured: false,
    isTrending: false
  },
  {
    id: '173',
    slug: 'article-173-tips-for-organizing-your-digital-files',
    title: { ar: 'نصائح لتنظيم ملفاتك الرقمية', en: 'Tips for organizing your digital files' },
    excerpt: { 
      ar: 'اكتشف كل ما يخص نصائح لتنظيم ملفاتك الرقمية وأهم التفاصيل التقنية.', 
      en: 'Discover everything about Tips for organizing your digital files and the most important tech details.' 
    },
    body: fullBody,
    categoryId: 'howto' as Category,
    author: {
      name: { ar: 'نور أحمد', en: 'Nour Ahmed' },
      avatar: 'https://i.pravatar.cc/150?img=4'
    },
    date: '2023-07-19',
    readTime: 6,
    heroImage: 'https://picsum.photos/seed/article-173-tips-for-organizing-your-digital-files/800/450',
    tags: ['Tech', 'Howto', '2024'],
    isFeatured: false,
    isTrending: false
  },
  {
    id: '174',
    slug: 'article-174-how-to-make-whatsapp-more-secure',
    title: { ar: 'كيف تجعل واتساب أكثر أماناً', en: 'How to make WhatsApp more secure' },
    excerpt: { 
      ar: 'اكتشف كل ما يخص كيف تجعل واتساب أكثر أماناً وأهم التفاصيل التقنية.', 
      en: 'Discover everything about How to make WhatsApp more secure and the most important tech details.' 
    },
    body: fullBody,
    categoryId: 'howto' as Category,
    author: {
      name: { ar: 'كريم حسن', en: 'Karim Hassan' },
      avatar: 'https://i.pravatar.cc/150?img=5'
    },
    date: '2023-07-22',
    readTime: 7,
    heroImage: 'https://picsum.photos/seed/article-174-how-to-make-whatsapp-more-secure/800/450',
    tags: ['Tech', 'Howto', '2024'],
    isFeatured: false,
    isTrending: false
  },
  {
    id: '175',
    slug: 'article-175-fix-internet-connection-problems',
    title: { ar: 'حل مشاكل اتصال الإنترنت', en: 'Fix internet connection problems' },
    excerpt: { 
      ar: 'اكتشف كل ما يخص حل مشاكل اتصال الإنترنت وأهم التفاصيل التقنية.', 
      en: 'Discover everything about Fix internet connection problems and the most important tech details.' 
    },
    body: fullBody,
    categoryId: 'howto' as Category,
    author: {
      name: { ar: 'ليلى سامي', en: 'Laila Sami' },
      avatar: 'https://i.pravatar.cc/150?img=6'
    },
    date: '2023-07-24',
    readTime: 8,
    heroImage: 'https://picsum.photos/seed/article-175-fix-internet-connection-problems/800/450',
    tags: ['Tech', 'Howto', '2024'],
    isFeatured: false,
    isTrending: true
  },
  {
    id: '176',
    slug: 'article-176-how-to-create-a-gif-from-video',
    title: { ar: 'كيف تصنع صورة GIF من فيديو', en: 'How to create a GIF from video' },
    excerpt: { 
      ar: 'اكتشف كل ما يخص كيف تصنع صورة GIF من فيديو وأهم التفاصيل التقنية.', 
      en: 'Discover everything about How to create a GIF from video and the most important tech details.' 
    },
    body: fullBody,
    categoryId: 'howto' as Category,
    author: {
      name: { ar: 'خالد عبد الله', en: 'Khaled Abdallah' },
      avatar: 'https://i.pravatar.cc/150?img=7'
    },
    date: '2023-07-27',
    readTime: 9,
    heroImage: 'https://picsum.photos/seed/article-176-how-to-create-a-gif-from-video/800/450',
    tags: ['Tech', 'Howto', '2024'],
    isFeatured: false,
    isTrending: false
  },
  {
    id: '177',
    slug: 'article-177-improve-camera-quality-on-any-phone',
    title: { ar: 'تحسين دقة الكاميرا في أي هاتف', en: 'Improve camera quality on any phone' },
    excerpt: { 
      ar: 'اكتشف كل ما يخص تحسين دقة الكاميرا في أي هاتف وأهم التفاصيل التقنية.', 
      en: 'Discover everything about Improve camera quality on any phone and the most important tech details.' 
    },
    body: fullBody,
    categoryId: 'howto' as Category,
    author: {
      name: { ar: 'أحمد محمود', en: 'Ahmed Mahmoud' },
      avatar: 'https://i.pravatar.cc/150?img=8'
    },
    date: '2023-07-30',
    readTime: 10,
    heroImage: 'https://picsum.photos/seed/article-177-improve-camera-quality-on-any-phone/800/450',
    tags: ['Tech', 'Howto', '2024'],
    isFeatured: false,
    isTrending: false
  },
  {
    id: '178',
    slug: 'article-178-how-to-prioritize-your-game-on-the-network',
    title: { ar: 'كيف تعطي أولوية لعبتك في الشبكة', en: 'How to prioritize your game on the network' },
    excerpt: { 
      ar: 'اكتشف كل ما يخص كيف تعطي أولوية لعبتك في الشبكة وأهم التفاصيل التقنية.', 
      en: 'Discover everything about How to prioritize your game on the network and the most important tech details.' 
    },
    body: fullBody,
    categoryId: 'howto' as Category,
    author: {
      name: { ar: 'سارة خالد', en: 'Sarah Khaled' },
      avatar: 'https://i.pravatar.cc/150?img=9'
    },
    date: '2023-08-01',
    readTime: 11,
    heroImage: 'https://picsum.photos/seed/article-178-how-to-prioritize-your-game-on-the-network/800/450',
    tags: ['Tech', 'Howto', '2024'],
    isFeatured: false,
    isTrending: false
  },
  {
    id: '179',
    slug: 'article-179-cleaning-computer-from-malware',
    title: { ar: 'تنظيف الكمبيوتر من البرامج الضارة', en: 'Cleaning computer from malware' },
    excerpt: { 
      ar: 'اكتشف كل ما يخص تنظيف الكمبيوتر من البرامج الضارة وأهم التفاصيل التقنية.', 
      en: 'Discover everything about Cleaning computer from malware and the most important tech details.' 
    },
    body: fullBody,
    categoryId: 'howto' as Category,
    author: {
      name: { ar: 'عمر طارق', en: 'Omar Tarek' },
      avatar: 'https://i.pravatar.cc/150?img=10'
    },
    date: '2023-08-04',
    readTime: 12,
    heroImage: 'https://picsum.photos/seed/article-179-cleaning-computer-from-malware/800/450',
    tags: ['Tech', 'Howto', '2024'],
    isFeatured: false,
    isTrending: false
  },
  {
    id: '180',
    slug: 'article-180-how-ai-can-change-your-job',
    title: { ar: 'كيف يمكن للذكاء الاصطناعي تغيير وظيفتك', en: 'How AI can change your job' },
    excerpt: { 
      ar: 'اكتشف كل ما يخص كيف يمكن للذكاء الاصطناعي تغيير وظيفتك وأهم التفاصيل التقنية.', 
      en: 'Discover everything about How AI can change your job and the most important tech details.' 
    },
    body: fullBody,
    categoryId: 'ai' as Category,
    author: {
      name: { ar: 'نور أحمد', en: 'Nour Ahmed' },
      avatar: 'https://i.pravatar.cc/150?img=11'
    },
    date: '2023-08-07',
    readTime: 3,
    heroImage: 'https://picsum.photos/seed/article-180-how-ai-can-change-your-job/800/450',
    tags: ['Tech', 'Ai', '2024'],
    isFeatured: false,
    isTrending: false
  },
  {
    id: '181',
    slug: 'article-181-best-ai-productivity-tools',
    title: { ar: 'أفضل أدوات الذكاء الاصطناعي للإنتاجية', en: 'Best AI productivity tools' },
    excerpt: { 
      ar: 'اكتشف كل ما يخص أفضل أدوات الذكاء الاصطناعي للإنتاجية وأهم التفاصيل التقنية.', 
      en: 'Discover everything about Best AI productivity tools and the most important tech details.' 
    },
    body: fullBody,
    categoryId: 'ai' as Category,
    author: {
      name: { ar: 'كريم حسن', en: 'Karim Hassan' },
      avatar: 'https://i.pravatar.cc/150?img=12'
    },
    date: '2023-08-10',
    readTime: 4,
    heroImage: 'https://picsum.photos/seed/article-181-best-ai-productivity-tools/800/450',
    tags: ['Tech', 'Ai', '2024'],
    isFeatured: false,
    isTrending: false
  },
  {
    id: '182',
    slug: 'article-182-testing-copilot-in-windows-11',
    title: { ar: 'تجربة Copilot في ويندوز 11', en: 'Testing Copilot in Windows 11' },
    excerpt: { 
      ar: 'اكتشف كل ما يخص تجربة Copilot في ويندوز 11 وأهم التفاصيل التقنية.', 
      en: 'Discover everything about Testing Copilot in Windows 11 and the most important tech details.' 
    },
    body: fullBody,
    categoryId: 'ai' as Category,
    author: {
      name: { ar: 'ليلى سامي', en: 'Laila Sami' },
      avatar: 'https://i.pravatar.cc/150?img=13'
    },
    date: '2023-08-12',
    readTime: 5,
    heroImage: 'https://picsum.photos/seed/article-182-testing-copilot-in-windows-11/800/450',
    tags: ['Tech', 'Ai', '2024'],
    isFeatured: false,
    isTrending: false
  },
  {
    id: '183',
    slug: 'article-183-how-to-use-chatgpt-for-work-and-study',
    title: { ar: 'كيف تستخدم ChatGPT للعمل والدراسة', en: 'How to use ChatGPT for work and study' },
    excerpt: { 
      ar: 'اكتشف كل ما يخص كيف تستخدم ChatGPT للعمل والدراسة وأهم التفاصيل التقنية.', 
      en: 'Discover everything about How to use ChatGPT for work and study and the most important tech details.' 
    },
    body: fullBody,
    categoryId: 'ai' as Category,
    author: {
      name: { ar: 'خالد عبد الله', en: 'Khaled Abdallah' },
      avatar: 'https://i.pravatar.cc/150?img=14'
    },
    date: '2023-08-15',
    readTime: 6,
    heroImage: 'https://picsum.photos/seed/article-183-how-to-use-chatgpt-for-work-and-study/800/450',
    tags: ['Tech', 'Ai', '2024'],
    isFeatured: false,
    isTrending: false
  },
  {
    id: '184',
    slug: 'article-184-midjourney--ai-image-generation-guide',
    title: { ar: 'Midjourney: دليل إنشاء الصور بالذكاء الاصطناعي', en: 'Midjourney: AI image generation guide' },
    excerpt: { 
      ar: 'اكتشف كل ما يخص Midjourney: دليل إنشاء الصور بالذكاء الاصطناعي وأهم التفاصيل التقنية.', 
      en: 'Discover everything about Midjourney: AI image generation guide and the most important tech details.' 
    },
    body: fullBody,
    categoryId: 'ai' as Category,
    author: {
      name: { ar: 'أحمد محمود', en: 'Ahmed Mahmoud' },
      avatar: 'https://i.pravatar.cc/150?img=15'
    },
    date: '2023-08-18',
    readTime: 7,
    heroImage: 'https://picsum.photos/seed/article-184-midjourney--ai-image-generation-guide/800/450',
    tags: ['Tech', 'Ai', '2024'],
    isFeatured: false,
    isTrending: false
  },
  {
    id: '185',
    slug: 'article-185-future-of-ai-in-the-arab-world',
    title: { ar: 'مستقبل الذكاء الاصطناعي في الوطن العربي', en: 'Future of AI in the Arab world' },
    excerpt: { 
      ar: 'اكتشف كل ما يخص مستقبل الذكاء الاصطناعي في الوطن العربي وأهم التفاصيل التقنية.', 
      en: 'Discover everything about Future of AI in the Arab world and the most important tech details.' 
    },
    body: fullBody,
    categoryId: 'ai' as Category,
    author: {
      name: { ar: 'سارة خالد', en: 'Sarah Khaled' },
      avatar: 'https://i.pravatar.cc/150?img=16'
    },
    date: '2023-08-21',
    readTime: 8,
    heroImage: 'https://picsum.photos/seed/article-185-future-of-ai-in-the-arab-world/800/450',
    tags: ['Tech', 'Ai', '2024'],
    isFeatured: false,
    isTrending: false
  },
  {
    id: '186',
    slug: 'article-186-comparing-gpt-4-and-gemini-ultra',
    title: { ar: 'مقارنة أقوى نماذج GPT-4 و Gemini Ultra', en: 'Comparing GPT-4 and Gemini Ultra' },
    excerpt: { 
      ar: 'اكتشف كل ما يخص مقارنة أقوى نماذج GPT-4 و Gemini Ultra وأهم التفاصيل التقنية.', 
      en: 'Discover everything about Comparing GPT-4 and Gemini Ultra and the most important tech details.' 
    },
    body: fullBody,
    categoryId: 'ai' as Category,
    author: {
      name: { ar: 'عمر طارق', en: 'Omar Tarek' },
      avatar: 'https://i.pravatar.cc/150?img=17'
    },
    date: '2023-08-23',
    readTime: 9,
    heroImage: 'https://picsum.photos/seed/article-186-comparing-gpt-4-and-gemini-ultra/800/450',
    tags: ['Tech', 'Ai', '2024'],
    isFeatured: false,
    isTrending: false
  },
  {
    id: '187',
    slug: 'article-187-ai-tools-for-graphic-design',
    title: { ar: 'أدوات الذكاء الاصطناعي للتصميم الجرافيكي', en: 'AI tools for graphic design' },
    excerpt: { 
      ar: 'اكتشف كل ما يخص أدوات الذكاء الاصطناعي للتصميم الجرافيكي وأهم التفاصيل التقنية.', 
      en: 'Discover everything about AI tools for graphic design and the most important tech details.' 
    },
    body: fullBody,
    categoryId: 'ai' as Category,
    author: {
      name: { ar: 'نور أحمد', en: 'Nour Ahmed' },
      avatar: 'https://i.pravatar.cc/150?img=18'
    },
    date: '2023-08-26',
    readTime: 10,
    heroImage: 'https://picsum.photos/seed/article-187-ai-tools-for-graphic-design/800/450',
    tags: ['Tech', 'Ai', '2024'],
    isFeatured: false,
    isTrending: false
  },
  {
    id: '188',
    slug: 'article-188-how-large-language-models-work',
    title: { ar: 'كيف يعمل نموذج اللغة الكبير LLM', en: 'How large language models work' },
    excerpt: { 
      ar: 'اكتشف كل ما يخص كيف يعمل نموذج اللغة الكبير LLM وأهم التفاصيل التقنية.', 
      en: 'Discover everything about How large language models work and the most important tech details.' 
    },
    body: fullBody,
    categoryId: 'ai' as Category,
    author: {
      name: { ar: 'كريم حسن', en: 'Karim Hassan' },
      avatar: 'https://i.pravatar.cc/150?img=19'
    },
    date: '2023-08-29',
    readTime: 11,
    heroImage: 'https://picsum.photos/seed/article-188-how-large-language-models-work/800/450',
    tags: ['Tech', 'Ai', '2024'],
    isFeatured: false,
    isTrending: false
  },
  {
    id: '189',
    slug: 'article-189-ai-in-medicine-and-healthcare',
    title: { ar: 'الذكاء الاصطناعي في الطب والرعاية الصحية', en: 'AI in medicine and healthcare' },
    excerpt: { 
      ar: 'اكتشف كل ما يخص الذكاء الاصطناعي في الطب والرعاية الصحية وأهم التفاصيل التقنية.', 
      en: 'Discover everything about AI in medicine and healthcare and the most important tech details.' 
    },
    body: fullBody,
    categoryId: 'ai' as Category,
    author: {
      name: { ar: 'ليلى سامي', en: 'Laila Sami' },
      avatar: 'https://i.pravatar.cc/150?img=20'
    },
    date: '2023-08-31',
    readTime: 12,
    heroImage: 'https://picsum.photos/seed/article-189-ai-in-medicine-and-healthcare/800/450',
    tags: ['Tech', 'Ai', '2024'],
    isFeatured: false,
    isTrending: false
  },
  {
    id: '190',
    slug: 'article-190-can-ai-truly-be-creative',
    title: { ar: 'هل يمكن للذكاء الاصطناعي الإبداع حقاً', en: 'Can AI truly be creative' },
    excerpt: { 
      ar: 'اكتشف كل ما يخص هل يمكن للذكاء الاصطناعي الإبداع حقاً وأهم التفاصيل التقنية.', 
      en: 'Discover everything about Can AI truly be creative and the most important tech details.' 
    },
    body: fullBody,
    categoryId: 'ai' as Category,
    author: {
      name: { ar: 'خالد عبد الله', en: 'Khaled Abdallah' },
      avatar: 'https://i.pravatar.cc/150?img=21'
    },
    date: '2023-09-03',
    readTime: 3,
    heroImage: 'https://picsum.photos/seed/article-190-can-ai-truly-be-creative/800/450',
    tags: ['Tech', 'Ai', '2024'],
    isFeatured: true,
    isTrending: false
  },
  {
    id: '191',
    slug: 'article-191-stable-diffusion-beginner-s-guide',
    title: { ar: 'Stable Diffusion: دليل المبتدئين', en: 'Stable Diffusion beginner\'s guide' },
    excerpt: { 
      ar: 'اكتشف كل ما يخص Stable Diffusion: دليل المبتدئين وأهم التفاصيل التقنية.', 
      en: 'Discover everything about Stable Diffusion beginner\'s guide and the most important tech details.' 
    },
    body: fullBody,
    categoryId: 'ai' as Category,
    author: {
      name: { ar: 'أحمد محمود', en: 'Ahmed Mahmoud' },
      avatar: 'https://i.pravatar.cc/150?img=22'
    },
    date: '2023-09-06',
    readTime: 4,
    heroImage: 'https://picsum.photos/seed/article-191-stable-diffusion-beginner-s-guide/800/450',
    tags: ['Tech', 'Ai', '2024'],
    isFeatured: false,
    isTrending: false
  },
  {
    id: '192',
    slug: 'article-192-ai-ethics-and-risks',
    title: { ar: 'أخلاقيات الذكاء الاصطناعي ومخاطره', en: 'AI ethics and risks' },
    excerpt: { 
      ar: 'اكتشف كل ما يخص أخلاقيات الذكاء الاصطناعي ومخاطره وأهم التفاصيل التقنية.', 
      en: 'Discover everything about AI ethics and risks and the most important tech details.' 
    },
    body: fullBody,
    categoryId: 'ai' as Category,
    author: {
      name: { ar: 'سارة خالد', en: 'Sarah Khaled' },
      avatar: 'https://i.pravatar.cc/150?img=23'
    },
    date: '2023-09-09',
    readTime: 5,
    heroImage: 'https://picsum.photos/seed/article-192-ai-ethics-and-risks/800/450',
    tags: ['Tech', 'Ai', '2024'],
    isFeatured: false,
    isTrending: false
  },
  {
    id: '193',
    slug: 'article-193-how-ai-helps-in-language-learning',
    title: { ar: 'كيف يساعد AI في تعلم اللغات', en: 'How AI helps in language learning' },
    excerpt: { 
      ar: 'اكتشف كل ما يخص كيف يساعد AI في تعلم اللغات وأهم التفاصيل التقنية.', 
      en: 'Discover everything about How AI helps in language learning and the most important tech details.' 
    },
    body: fullBody,
    categoryId: 'ai' as Category,
    author: {
      name: { ar: 'عمر طارق', en: 'Omar Tarek' },
      avatar: 'https://i.pravatar.cc/150?img=24'
    },
    date: '2023-09-11',
    readTime: 6,
    heroImage: 'https://picsum.photos/seed/article-193-how-ai-helps-in-language-learning/800/450',
    tags: ['Tech', 'Ai', '2024'],
    isFeatured: false,
    isTrending: false
  },
  {
    id: '194',
    slug: 'article-194-ai-tools-for-writing-and-translation',
    title: { ar: 'أدوات AI للكتابة والترجمة', en: 'AI tools for writing and translation' },
    excerpt: { 
      ar: 'اكتشف كل ما يخص أدوات AI للكتابة والترجمة وأهم التفاصيل التقنية.', 
      en: 'Discover everything about AI tools for writing and translation and the most important tech details.' 
    },
    body: fullBody,
    categoryId: 'ai' as Category,
    author: {
      name: { ar: 'نور أحمد', en: 'Nour Ahmed' },
      avatar: 'https://i.pravatar.cc/150?img=25'
    },
    date: '2023-09-14',
    readTime: 7,
    heroImage: 'https://picsum.photos/seed/article-194-ai-tools-for-writing-and-translation/800/450',
    tags: ['Tech', 'Ai', '2024'],
    isFeatured: false,
    isTrending: false
  },
  {
    id: '195',
    slug: 'article-195-future-of-ai-chips',
    title: { ar: 'مستقبل رقائق الذكاء الاصطناعي', en: 'Future of AI chips' },
    excerpt: { 
      ar: 'اكتشف كل ما يخص مستقبل رقائق الذكاء الاصطناعي وأهم التفاصيل التقنية.', 
      en: 'Discover everything about Future of AI chips and the most important tech details.' 
    },
    body: fullBody,
    categoryId: 'ai' as Category,
    author: {
      name: { ar: 'كريم حسن', en: 'Karim Hassan' },
      avatar: 'https://i.pravatar.cc/150?img=26'
    },
    date: '2023-09-17',
    readTime: 8,
    heroImage: 'https://picsum.photos/seed/article-195-future-of-ai-chips/800/450',
    tags: ['Tech', 'Ai', '2024'],
    isFeatured: false,
    isTrending: false
  },
  {
    id: '196',
    slug: 'article-196-how-to-build-a-simple-chatbot',
    title: { ar: 'كيف تبني روبوت محادثة بسيط', en: 'How to build a simple chatbot' },
    excerpt: { 
      ar: 'اكتشف كل ما يخص كيف تبني روبوت محادثة بسيط وأهم التفاصيل التقنية.', 
      en: 'Discover everything about How to build a simple chatbot and the most important tech details.' 
    },
    body: fullBody,
    categoryId: 'ai' as Category,
    author: {
      name: { ar: 'ليلى سامي', en: 'Laila Sami' },
      avatar: 'https://i.pravatar.cc/150?img=27'
    },
    date: '2023-09-20',
    readTime: 9,
    heroImage: 'https://picsum.photos/seed/article-196-how-to-build-a-simple-chatbot/800/450',
    tags: ['Tech', 'Ai', '2024'],
    isFeatured: false,
    isTrending: false
  },
  {
    id: '197',
    slug: 'article-197-impact-of-ai-on-digital-art',
    title: { ar: 'تأثير الذكاء الاصطناعي على الفن الرقمي', en: 'Impact of AI on digital art' },
    excerpt: { 
      ar: 'اكتشف كل ما يخص تأثير الذكاء الاصطناعي على الفن الرقمي وأهم التفاصيل التقنية.', 
      en: 'Discover everything about Impact of AI on digital art and the most important tech details.' 
    },
    body: fullBody,
    categoryId: 'ai' as Category,
    author: {
      name: { ar: 'خالد عبد الله', en: 'Khaled Abdallah' },
      avatar: 'https://i.pravatar.cc/150?img=28'
    },
    date: '2023-09-22',
    readTime: 10,
    heroImage: 'https://picsum.photos/seed/article-197-impact-of-ai-on-digital-art/800/450',
    tags: ['Tech', 'Ai', '2024'],
    isFeatured: false,
    isTrending: false
  },
  {
    id: '198',
    slug: 'article-198-will-ai-replace-programmers',
    title: { ar: 'هل الذكاء الاصطناعي سيستبدل المبرمجين', en: 'Will AI replace programmers' },
    excerpt: { 
      ar: 'اكتشف كل ما يخص هل الذكاء الاصطناعي سيستبدل المبرمجين وأهم التفاصيل التقنية.', 
      en: 'Discover everything about Will AI replace programmers and the most important tech details.' 
    },
    body: fullBody,
    categoryId: 'ai' as Category,
    author: {
      name: { ar: 'أحمد محمود', en: 'Ahmed Mahmoud' },
      avatar: 'https://i.pravatar.cc/150?img=29'
    },
    date: '2023-09-25',
    readTime: 11,
    heroImage: 'https://picsum.photos/seed/article-198-will-ai-replace-programmers/800/450',
    tags: ['Tech', 'Ai', '2024'],
    isFeatured: false,
    isTrending: false
  },
  {
    id: '199',
    slug: 'article-199-best-free-ai-tools-in-2024',
    title: { ar: 'أدوات AI المجانية الأفضل في 2024', en: 'Best free AI tools in 2024' },
    excerpt: { 
      ar: 'اكتشف كل ما يخص أدوات AI المجانية الأفضل في 2024 وأهم التفاصيل التقنية.', 
      en: 'Discover everything about Best free AI tools in 2024 and the most important tech details.' 
    },
    body: fullBody,
    categoryId: 'ai' as Category,
    author: {
      name: { ar: 'سارة خالد', en: 'Sarah Khaled' },
      avatar: 'https://i.pravatar.cc/150?img=30'
    },
    date: '2023-09-28',
    readTime: 12,
    heroImage: 'https://picsum.photos/seed/article-199-best-free-ai-tools-in-2024/800/450',
    tags: ['Tech', 'Ai', '2024'],
    isFeatured: false,
    isTrending: false
  },
  {
    id: '200',
    slug: 'article-200-apple-watch-series-10-review',
    title: { ar: 'مراجعة Apple Watch Series 10', en: 'Apple Watch Series 10 review' },
    excerpt: { 
      ar: 'اكتشف كل ما يخص مراجعة Apple Watch Series 10 وأهم التفاصيل التقنية.', 
      en: 'Discover everything about Apple Watch Series 10 review and the most important tech details.' 
    },
    body: fullBody,
    categoryId: 'reviews' as Category,
    author: {
      name: { ar: 'عمر طارق', en: 'Omar Tarek' },
      avatar: 'https://i.pravatar.cc/150?img=31'
    },
    date: '2023-10-01',
    readTime: 3,
    heroImage: 'https://picsum.photos/seed/article-200-apple-watch-series-10-review/800/450',
    tags: ['Tech', 'Reviews', '2024'],
    isFeatured: false,
    isTrending: true
  },
  {
    id: '201',
    slug: 'article-201-sony-wh-1000xm5-headphones-review',
    title: { ar: 'تقييم سماعات Sony WH-1000XM5', en: 'Sony WH-1000XM5 headphones review' },
    excerpt: { 
      ar: 'اكتشف كل ما يخص تقييم سماعات Sony WH-1000XM5 وأهم التفاصيل التقنية.', 
      en: 'Discover everything about Sony WH-1000XM5 headphones review and the most important tech details.' 
    },
    body: fullBody,
    categoryId: 'reviews' as Category,
    author: {
      name: { ar: 'نور أحمد', en: 'Nour Ahmed' },
      avatar: 'https://i.pravatar.cc/150?img=32'
    },
    date: '2023-10-03',
    readTime: 4,
    heroImage: 'https://picsum.photos/seed/article-201-sony-wh-1000xm5-headphones-review/800/450',
    tags: ['Tech', 'Reviews', '2024'],
    isFeatured: false,
    isTrending: false
  },
  {
    id: '202',
    slug: 'article-202-ipad-pro-m4-review',
    title: { ar: 'مراجعة iPad Pro M4', en: 'iPad Pro M4 review' },
    excerpt: { 
      ar: 'اكتشف كل ما يخص مراجعة iPad Pro M4 وأهم التفاصيل التقنية.', 
      en: 'Discover everything about iPad Pro M4 review and the most important tech details.' 
    },
    body: fullBody,
    categoryId: 'reviews' as Category,
    author: {
      name: { ar: 'كريم حسن', en: 'Karim Hassan' },
      avatar: 'https://i.pravatar.cc/150?img=33'
    },
    date: '2023-10-06',
    readTime: 5,
    heroImage: 'https://picsum.photos/seed/article-202-ipad-pro-m4-review/800/450',
    tags: ['Tech', 'Reviews', '2024'],
    isFeatured: false,
    isTrending: false
  },
  {
    id: '203',
    slug: 'article-203-playstation-5-slim-review-after-one-year',
    title: { ar: 'تقييم PlayStation 5 Slim بعد سنة', en: 'PlayStation 5 Slim review after one year' },
    excerpt: { 
      ar: 'اكتشف كل ما يخص تقييم PlayStation 5 Slim بعد سنة وأهم التفاصيل التقنية.', 
      en: 'Discover everything about PlayStation 5 Slim review after one year and the most important tech details.' 
    },
    body: fullBody,
    categoryId: 'reviews' as Category,
    author: {
      name: { ar: 'ليلى سامي', en: 'Laila Sami' },
      avatar: 'https://i.pravatar.cc/150?img=34'
    },
    date: '2023-10-09',
    readTime: 6,
    heroImage: 'https://picsum.photos/seed/article-203-playstation-5-slim-review-after-one-year/800/450',
    tags: ['Tech', 'Reviews', '2024'],
    isFeatured: false,
    isTrending: false
  },
  {
    id: '204',
    slug: 'article-204-dji-mini-4-pro-review',
    title: { ar: 'مراجعة DJI Mini 4 Pro', en: 'DJI Mini 4 Pro review' },
    excerpt: { 
      ar: 'اكتشف كل ما يخص مراجعة DJI Mini 4 Pro وأهم التفاصيل التقنية.', 
      en: 'Discover everything about DJI Mini 4 Pro review and the most important tech details.' 
    },
    body: fullBody,
    categoryId: 'reviews' as Category,
    author: {
      name: { ar: 'خالد عبد الله', en: 'Khaled Abdallah' },
      avatar: 'https://i.pravatar.cc/150?img=35'
    },
    date: '2023-10-11',
    readTime: 7,
    heroImage: 'https://picsum.photos/seed/article-204-dji-mini-4-pro-review/800/450',
    tags: ['Tech', 'Reviews', '2024'],
    isFeatured: false,
    isTrending: false
  },
  {
    id: '205',
    slug: 'article-205-samsung-odyssey-g9-monitor-review',
    title: { ar: 'تقييم شاشة Samsung Odyssey G9', en: 'Samsung Odyssey G9 monitor review' },
    excerpt: { 
      ar: 'اكتشف كل ما يخص تقييم شاشة Samsung Odyssey G9 وأهم التفاصيل التقنية.', 
      en: 'Discover everything about Samsung Odyssey G9 monitor review and the most important tech details.' 
    },
    body: fullBody,
    categoryId: 'reviews' as Category,
    author: {
      name: { ar: 'أحمد محمود', en: 'Ahmed Mahmoud' },
      avatar: 'https://i.pravatar.cc/150?img=36'
    },
    date: '2023-10-14',
    readTime: 8,
    heroImage: 'https://picsum.photos/seed/article-205-samsung-odyssey-g9-monitor-review/800/450',
    tags: ['Tech', 'Reviews', '2024'],
    isFeatured: false,
    isTrending: false
  },
  {
    id: '206',
    slug: 'article-206-apple-pencil-pro-review',
    title: { ar: 'مراجعة حامل القلم Apple Pencil Pro', en: 'Apple Pencil Pro review' },
    excerpt: { 
      ar: 'اكتشف كل ما يخص مراجعة حامل القلم Apple Pencil Pro وأهم التفاصيل التقنية.', 
      en: 'Discover everything about Apple Pencil Pro review and the most important tech details.' 
    },
    body: fullBody,
    categoryId: 'reviews' as Category,
    author: {
      name: { ar: 'سارة خالد', en: 'Sarah Khaled' },
      avatar: 'https://i.pravatar.cc/150?img=37'
    },
    date: '2023-10-17',
    readTime: 9,
    heroImage: 'https://picsum.photos/seed/article-206-apple-pencil-pro-review/800/450',
    tags: ['Tech', 'Reviews', '2024'],
    isFeatured: false,
    isTrending: false
  },
  {
    id: '207',
    slug: 'article-207-samsung-galaxy-watch-7-review',
    title: { ar: 'تقييم ساعة Samsung Galaxy Watch 7', en: 'Samsung Galaxy Watch 7 review' },
    excerpt: { 
      ar: 'اكتشف كل ما يخص تقييم ساعة Samsung Galaxy Watch 7 وأهم التفاصيل التقنية.', 
      en: 'Discover everything about Samsung Galaxy Watch 7 review and the most important tech details.' 
    },
    body: fullBody,
    categoryId: 'reviews' as Category,
    author: {
      name: { ar: 'عمر طارق', en: 'Omar Tarek' },
      avatar: 'https://i.pravatar.cc/150?img=38'
    },
    date: '2023-10-20',
    readTime: 10,
    heroImage: 'https://picsum.photos/seed/article-207-samsung-galaxy-watch-7-review/800/450',
    tags: ['Tech', 'Reviews', '2024'],
    isFeatured: false,
    isTrending: false
  },
  {
    id: '208',
    slug: 'article-208-airpods-max-2-review',
    title: { ar: 'مراجعة سماعات AirPods Max 2', en: 'AirPods Max 2 review' },
    excerpt: { 
      ar: 'اكتشف كل ما يخص مراجعة سماعات AirPods Max 2 وأهم التفاصيل التقنية.', 
      en: 'Discover everything about AirPods Max 2 review and the most important tech details.' 
    },
    body: fullBody,
    categoryId: 'reviews' as Category,
    author: {
      name: { ar: 'نور أحمد', en: 'Nour Ahmed' },
      avatar: 'https://i.pravatar.cc/150?img=39'
    },
    date: '2023-10-22',
    readTime: 11,
    heroImage: 'https://picsum.photos/seed/article-208-airpods-max-2-review/800/450',
    tags: ['Tech', 'Reviews', '2024'],
    isFeatured: false,
    isTrending: false
  },
  {
    id: '209',
    slug: 'article-209-logitech-mx-master-3s-review',
    title: { ar: 'تقييم Logitech MX Master 3S', en: 'Logitech MX Master 3S review' },
    excerpt: { 
      ar: 'اكتشف كل ما يخص تقييم Logitech MX Master 3S وأهم التفاصيل التقنية.', 
      en: 'Discover everything about Logitech MX Master 3S review and the most important tech details.' 
    },
    body: fullBody,
    categoryId: 'reviews' as Category,
    author: {
      name: { ar: 'كريم حسن', en: 'Karim Hassan' },
      avatar: 'https://i.pravatar.cc/150?img=40'
    },
    date: '2023-10-25',
    readTime: 12,
    heroImage: 'https://picsum.photos/seed/article-209-logitech-mx-master-3s-review/800/450',
    tags: ['Tech', 'Reviews', '2024'],
    isFeatured: false,
    isTrending: false
  },
  {
    id: '210',
    slug: 'article-210-lg-ultrawide-34--monitor-review',
    title: { ar: 'مراجعة شاشة LG UltraWide 34"', en: 'LG UltraWide 34" monitor review' },
    excerpt: { 
      ar: 'اكتشف كل ما يخص مراجعة شاشة LG UltraWide 34" وأهم التفاصيل التقنية.', 
      en: 'Discover everything about LG UltraWide 34" monitor review and the most important tech details.' 
    },
    body: fullBody,
    categoryId: 'reviews' as Category,
    author: {
      name: { ar: 'ليلى سامي', en: 'Laila Sami' },
      avatar: 'https://i.pravatar.cc/150?img=41'
    },
    date: '2023-10-28',
    readTime: 3,
    heroImage: 'https://picsum.photos/seed/article-210-lg-ultrawide-34--monitor-review/800/450',
    tags: ['Tech', 'Reviews', '2024'],
    isFeatured: false,
    isTrending: false
  },
  {
    id: '211',
    slug: 'article-211-sony-a7-v-camera-review',
    title: { ar: 'تقييم كاميرا Sony A7 V', en: 'Sony A7 V camera review' },
    excerpt: { 
      ar: 'اكتشف كل ما يخص تقييم كاميرا Sony A7 V وأهم التفاصيل التقنية.', 
      en: 'Discover everything about Sony A7 V camera review and the most important tech details.' 
    },
    body: fullBody,
    categoryId: 'reviews' as Category,
    author: {
      name: { ar: 'خالد عبد الله', en: 'Khaled Abdallah' },
      avatar: 'https://i.pravatar.cc/150?img=42'
    },
    date: '2023-10-31',
    readTime: 4,
    heroImage: 'https://picsum.photos/seed/article-211-sony-a7-v-camera-review/800/450',
    tags: ['Tech', 'Reviews', '2024'],
    isFeatured: false,
    isTrending: false
  },
  {
    id: '212',
    slug: 'article-212-new-xbox-series-x-controller-review',
    title: { ar: 'مراجعة يد تحكم Xbox Series X الجديدة', en: 'New Xbox Series X controller review' },
    excerpt: { 
      ar: 'اكتشف كل ما يخص مراجعة يد تحكم Xbox Series X الجديدة وأهم التفاصيل التقنية.', 
      en: 'Discover everything about New Xbox Series X controller review and the most important tech details.' 
    },
    body: fullBody,
    categoryId: 'reviews' as Category,
    author: {
      name: { ar: 'أحمد محمود', en: 'Ahmed Mahmoud' },
      avatar: 'https://i.pravatar.cc/150?img=43'
    },
    date: '2023-11-02',
    readTime: 5,
    heroImage: 'https://picsum.photos/seed/article-212-new-xbox-series-x-controller-review/800/450',
    tags: ['Tech', 'Reviews', '2024'],
    isFeatured: false,
    isTrending: false
  },
  {
    id: '213',
    slug: 'article-213-sonos-era-300-speaker-review',
    title: { ar: 'تقييم مكبر الصوت Sonos Era 300', en: 'Sonos Era 300 speaker review' },
    excerpt: { 
      ar: 'اكتشف كل ما يخص تقييم مكبر الصوت Sonos Era 300 وأهم التفاصيل التقنية.', 
      en: 'Discover everything about Sonos Era 300 speaker review and the most important tech details.' 
    },
    body: fullBody,
    categoryId: 'reviews' as Category,
    author: {
      name: { ar: 'سارة خالد', en: 'Sarah Khaled' },
      avatar: 'https://i.pravatar.cc/150?img=44'
    },
    date: '2023-11-05',
    readTime: 6,
    heroImage: 'https://picsum.photos/seed/article-213-sonos-era-300-speaker-review/800/450',
    tags: ['Tech', 'Reviews', '2024'],
    isFeatured: false,
    isTrending: false
  },
  {
    id: '214',
    slug: 'article-214-keychron-q1-pro-keyboard-review',
    title: { ar: 'مراجعة كيبورد Keychron Q1 Pro', en: 'Keychron Q1 Pro keyboard review' },
    excerpt: { 
      ar: 'اكتشف كل ما يخص مراجعة كيبورد Keychron Q1 Pro وأهم التفاصيل التقنية.', 
      en: 'Discover everything about Keychron Q1 Pro keyboard review and the most important tech details.' 
    },
    body: fullBody,
    categoryId: 'reviews' as Category,
    author: {
      name: { ar: 'عمر طارق', en: 'Omar Tarek' },
      avatar: 'https://i.pravatar.cc/150?img=45'
    },
    date: '2023-11-08',
    readTime: 7,
    heroImage: 'https://picsum.photos/seed/article-214-keychron-q1-pro-keyboard-review/800/450',
    tags: ['Tech', 'Reviews', '2024'],
    isFeatured: false,
    isTrending: false
  },
  {
    id: '215',
    slug: 'article-215-bambu-lab-x1-carbon-3d-printer-review',
    title: { ar: 'تقييم طابعة Bambu Lab X1 Carbon', en: 'Bambu Lab X1 Carbon 3D printer review' },
    excerpt: { 
      ar: 'اكتشف كل ما يخص تقييم طابعة Bambu Lab X1 Carbon وأهم التفاصيل التقنية.', 
      en: 'Discover everything about Bambu Lab X1 Carbon 3D printer review and the most important tech details.' 
    },
    body: fullBody,
    categoryId: 'reviews' as Category,
    author: {
      name: { ar: 'نور أحمد', en: 'Nour Ahmed' },
      avatar: 'https://i.pravatar.cc/150?img=46'
    },
    date: '2023-11-10',
    readTime: 8,
    heroImage: 'https://picsum.photos/seed/article-215-bambu-lab-x1-carbon-3d-printer-review/800/450',
    tags: ['Tech', 'Reviews', '2024'],
    isFeatured: false,
    isTrending: false
  },
  {
    id: '216',
    slug: 'article-216-roomba-j9--robot-vacuum-review',
    title: { ar: 'مراجعة روبوت التنظيف Roomba j9+', en: 'Roomba j9+ robot vacuum review' },
    excerpt: { 
      ar: 'اكتشف كل ما يخص مراجعة روبوت التنظيف Roomba j9+ وأهم التفاصيل التقنية.', 
      en: 'Discover everything about Roomba j9+ robot vacuum review and the most important tech details.' 
    },
    body: fullBody,
    categoryId: 'reviews' as Category,
    author: {
      name: { ar: 'كريم حسن', en: 'Karim Hassan' },
      avatar: 'https://i.pravatar.cc/150?img=47'
    },
    date: '2023-11-13',
    readTime: 9,
    heroImage: 'https://picsum.photos/seed/article-216-roomba-j9--robot-vacuum-review/800/450',
    tags: ['Tech', 'Reviews', '2024'],
    isFeatured: false,
    isTrending: false
  },
  {
    id: '217',
    slug: 'article-217-ring-doorbell-pro-review',
    title: { ar: 'تقييم شاشة المراقبة Ring Doorbell Pro', en: 'Ring Doorbell Pro review' },
    excerpt: { 
      ar: 'اكتشف كل ما يخص تقييم شاشة المراقبة Ring Doorbell Pro وأهم التفاصيل التقنية.', 
      en: 'Discover everything about Ring Doorbell Pro review and the most important tech details.' 
    },
    body: fullBody,
    categoryId: 'reviews' as Category,
    author: {
      name: { ar: 'ليلى سامي', en: 'Laila Sami' },
      avatar: 'https://i.pravatar.cc/150?img=48'
    },
    date: '2023-11-16',
    readTime: 10,
    heroImage: 'https://picsum.photos/seed/article-217-ring-doorbell-pro-review/800/450',
    tags: ['Tech', 'Reviews', '2024'],
    isFeatured: false,
    isTrending: false
  },
  {
    id: '218',
    slug: 'article-218-gopro-hero-13-black-review',
    title: { ar: 'مراجعة GoPro Hero 13 Black', en: 'GoPro Hero 13 Black review' },
    excerpt: { 
      ar: 'اكتشف كل ما يخص مراجعة GoPro Hero 13 Black وأهم التفاصيل التقنية.', 
      en: 'Discover everything about GoPro Hero 13 Black review and the most important tech details.' 
    },
    body: fullBody,
    categoryId: 'reviews' as Category,
    author: {
      name: { ar: 'خالد عبد الله', en: 'Khaled Abdallah' },
      avatar: 'https://i.pravatar.cc/150?img=49'
    },
    date: '2023-11-19',
    readTime: 11,
    heroImage: 'https://picsum.photos/seed/article-218-gopro-hero-13-black-review/800/450',
    tags: ['Tech', 'Reviews', '2024'],
    isFeatured: false,
    isTrending: false
  },
  {
    id: '219',
    slug: 'article-219-stream-deck-xl-review',
    title: { ar: 'تقييم جهاز Stream Deck XL', en: 'Stream Deck XL review' },
    excerpt: { 
      ar: 'اكتشف كل ما يخص تقييم جهاز Stream Deck XL وأهم التفاصيل التقنية.', 
      en: 'Discover everything about Stream Deck XL review and the most important tech details.' 
    },
    body: fullBody,
    categoryId: 'reviews' as Category,
    author: {
      name: { ar: 'أحمد محمود', en: 'Ahmed Mahmoud' },
      avatar: 'https://i.pravatar.cc/150?img=50'
    },
    date: '2023-11-21',
    readTime: 12,
    heroImage: 'https://picsum.photos/seed/article-219-stream-deck-xl-review/800/450',
    tags: ['Tech', 'Reviews', '2024'],
    isFeatured: false,
    isTrending: false
  },
  {
    id: '220',
    slug: 'article-220-complete-windows-11-guide-for-beginners',
    title: { ar: 'دليل شامل لويندوز 11 للمبتدئين', en: 'Complete Windows 11 guide for beginners' },
    excerpt: { 
      ar: 'اكتشف كل ما يخص دليل شامل لويندوز 11 للمبتدئين وأهم التفاصيل التقنية.', 
      en: 'Discover everything about Complete Windows 11 guide for beginners and the most important tech details.' 
    },
    body: fullBody,
    categoryId: 'windows' as Category,
    author: {
      name: { ar: 'سارة خالد', en: 'Sarah Khaled' },
      avatar: 'https://i.pravatar.cc/150?img=51'
    },
    date: '2023-11-24',
    readTime: 3,
    heroImage: 'https://picsum.photos/seed/article-220-complete-windows-11-guide-for-beginners/800/450',
    tags: ['Tech', 'Windows', '2024'],
    isFeatured: true,
    isTrending: false
  },
  {
    id: '221',
    slug: 'article-221-best-windows-11-settings-for-performance',
    title: { ar: 'أفضل إعدادات ويندوز 11 للأداء', en: 'Best Windows 11 settings for performance' },
    excerpt: { 
      ar: 'اكتشف كل ما يخص أفضل إعدادات ويندوز 11 للأداء وأهم التفاصيل التقنية.', 
      en: 'Discover everything about Best Windows 11 settings for performance and the most important tech details.' 
    },
    body: fullBody,
    categoryId: 'windows' as Category,
    author: {
      name: { ar: 'عمر طارق', en: 'Omar Tarek' },
      avatar: 'https://i.pravatar.cc/150?img=52'
    },
    date: '2023-11-27',
    readTime: 4,
    heroImage: 'https://picsum.photos/seed/article-221-best-windows-11-settings-for-performance/800/450',
    tags: ['Tech', 'Windows', '2024'],
    isFeatured: false,
    isTrending: false
  },
  {
    id: '222',
    slug: 'article-222-how-to-activate-hidden-windows-11-features',
    title: { ar: 'كيف تفعّل ميزات ويندوز 11 الخفية', en: 'How to activate hidden Windows 11 features' },
    excerpt: { 
      ar: 'اكتشف كل ما يخص كيف تفعّل ميزات ويندوز 11 الخفية وأهم التفاصيل التقنية.', 
      en: 'Discover everything about How to activate hidden Windows 11 features and the most important tech details.' 
    },
    body: fullBody,
    categoryId: 'windows' as Category,
    author: {
      name: { ar: 'نور أحمد', en: 'Nour Ahmed' },
      avatar: 'https://i.pravatar.cc/150?img=53'
    },
    date: '2023-11-30',
    readTime: 5,
    heroImage: 'https://picsum.photos/seed/article-222-how-to-activate-hidden-windows-11-features/800/450',
    tags: ['Tech', 'Windows', '2024'],
    isFeatured: false,
    isTrending: false
  },
  {
    id: '223',
    slug: 'article-223-windows-11-problems-and-solutions',
    title: { ar: 'مشاكل ويندوز 11 وحلولها', en: 'Windows 11 problems and solutions' },
    excerpt: { 
      ar: 'اكتشف كل ما يخص مشاكل ويندوز 11 وحلولها وأهم التفاصيل التقنية.', 
      en: 'Discover everything about Windows 11 problems and solutions and the most important tech details.' 
    },
    body: fullBody,
    categoryId: 'windows' as Category,
    author: {
      name: { ar: 'كريم حسن', en: 'Karim Hassan' },
      avatar: 'https://i.pravatar.cc/150?img=54'
    },
    date: '2023-12-02',
    readTime: 6,
    heroImage: 'https://picsum.photos/seed/article-223-windows-11-problems-and-solutions/800/450',
    tags: ['Tech', 'Windows', '2024'],
    isFeatured: false,
    isTrending: false
  },
  {
    id: '224',
    slug: 'article-224-how-to-clean-windows-from-unnecessary-files',
    title: { ar: 'كيف تنظف ويندوز من الملفات غير الضرورية', en: 'How to clean Windows from unnecessary files' },
    excerpt: { 
      ar: 'اكتشف كل ما يخص كيف تنظف ويندوز من الملفات غير الضرورية وأهم التفاصيل التقنية.', 
      en: 'Discover everything about How to clean Windows from unnecessary files and the most important tech details.' 
    },
    body: fullBody,
    categoryId: 'windows' as Category,
    author: {
      name: { ar: 'ليلى سامي', en: 'Laila Sami' },
      avatar: 'https://i.pravatar.cc/150?img=55'
    },
    date: '2023-12-05',
    readTime: 7,
    heroImage: 'https://picsum.photos/seed/article-224-how-to-clean-windows-from-unnecessary-files/800/450',
    tags: ['Tech', 'Windows', '2024'],
    isFeatured: false,
    isTrending: false
  },
  {
    id: '225',
    slug: 'article-225-best-free-windows-software',
    title: { ar: 'أفضل برامج ويندوز المجانية', en: 'Best free Windows software' },
    excerpt: { 
      ar: 'اكتشف كل ما يخص أفضل برامج ويندوز المجانية وأهم التفاصيل التقنية.', 
      en: 'Discover everything about Best free Windows software and the most important tech details.' 
    },
    body: fullBody,
    categoryId: 'windows' as Category,
    author: {
      name: { ar: 'خالد عبد الله', en: 'Khaled Abdallah' },
      avatar: 'https://i.pravatar.cc/150?img=56'
    },
    date: '2023-12-08',
    readTime: 8,
    heroImage: 'https://picsum.photos/seed/article-225-best-free-windows-software/800/450',
    tags: ['Tech', 'Windows', '2024'],
    isFeatured: false,
    isTrending: true
  },
  {
    id: '226',
    slug: 'article-226-how-to-optimize-windows-for-gaming',
    title: { ar: 'كيف تضبط ويندوز للألعاب', en: 'How to optimize Windows for gaming' },
    excerpt: { 
      ar: 'اكتشف كل ما يخص كيف تضبط ويندوز للألعاب وأهم التفاصيل التقنية.', 
      en: 'Discover everything about How to optimize Windows for gaming and the most important tech details.' 
    },
    body: fullBody,
    categoryId: 'windows' as Category,
    author: {
      name: { ar: 'أحمد محمود', en: 'Ahmed Mahmoud' },
      avatar: 'https://i.pravatar.cc/150?img=57'
    },
    date: '2023-12-10',
    readTime: 9,
    heroImage: 'https://picsum.photos/seed/article-226-how-to-optimize-windows-for-gaming/800/450',
    tags: ['Tech', 'Windows', '2024'],
    isFeatured: false,
    isTrending: false
  },
  {
    id: '227',
    slug: 'article-227-how-to-restore-windows-after-failures',
    title: { ar: 'كيف تستعيد ويندوز بعد الأعطال', en: 'How to restore Windows after failures' },
    excerpt: { 
      ar: 'اكتشف كل ما يخص كيف تستعيد ويندوز بعد الأعطال وأهم التفاصيل التقنية.', 
      en: 'Discover everything about How to restore Windows after failures and the most important tech details.' 
    },
    body: fullBody,
    categoryId: 'windows' as Category,
    author: {
      name: { ar: 'سارة خالد', en: 'Sarah Khaled' },
      avatar: 'https://i.pravatar.cc/150?img=58'
    },
    date: '2023-12-13',
    readTime: 10,
    heroImage: 'https://picsum.photos/seed/article-227-how-to-restore-windows-after-failures/800/450',
    tags: ['Tech', 'Windows', '2024'],
    isFeatured: false,
    isTrending: false
  },
  {
    id: '228',
    slug: 'article-228-microsoft-365-features-you-don-t-know',
    title: { ar: 'ميزات Microsoft 365 التي لا تعرفها', en: 'Microsoft 365 features you don\'t know' },
    excerpt: { 
      ar: 'اكتشف كل ما يخص ميزات Microsoft 365 التي لا تعرفها وأهم التفاصيل التقنية.', 
      en: 'Discover everything about Microsoft 365 features you don\'t know and the most important tech details.' 
    },
    body: fullBody,
    categoryId: 'windows' as Category,
    author: {
      name: { ar: 'عمر طارق', en: 'Omar Tarek' },
      avatar: 'https://i.pravatar.cc/150?img=59'
    },
    date: '2023-12-16',
    readTime: 11,
    heroImage: 'https://picsum.photos/seed/article-228-microsoft-365-features-you-don-t-know/800/450',
    tags: ['Tech', 'Windows', '2024'],
    isFeatured: false,
    isTrending: false
  },
  {
    id: '229',
    slug: 'article-229-how-to-run-linux-alongside-windows',
    title: { ar: 'كيف تشغل لينكس بجانب ويندوز', en: 'How to run Linux alongside Windows' },
    excerpt: { 
      ar: 'اكتشف كل ما يخص كيف تشغل لينكس بجانب ويندوز وأهم التفاصيل التقنية.', 
      en: 'Discover everything about How to run Linux alongside Windows and the most important tech details.' 
    },
    body: fullBody,
    categoryId: 'windows' as Category,
    author: {
      name: { ar: 'نور أحمد', en: 'Nour Ahmed' },
      avatar: 'https://i.pravatar.cc/150?img=60'
    },
    date: '2023-12-19',
    readTime: 12,
    heroImage: 'https://picsum.photos/seed/article-229-how-to-run-linux-alongside-windows/800/450',
    tags: ['Tech', 'Windows', '2024'],
    isFeatured: false,
    isTrending: false
  },
  {
    id: '230',
    slug: 'article-230-improving-windows-performance-on-old-devices',
    title: { ar: 'تحسين أداء ويندوز على الأجهزة القديمة', en: 'Improving Windows performance on old devices' },
    excerpt: { 
      ar: 'اكتشف كل ما يخص تحسين أداء ويندوز على الأجهزة القديمة وأهم التفاصيل التقنية.', 
      en: 'Discover everything about Improving Windows performance on old devices and the most important tech details.' 
    },
    body: fullBody,
    categoryId: 'windows' as Category,
    author: {
      name: { ar: 'كريم حسن', en: 'Karim Hassan' },
      avatar: 'https://i.pravatar.cc/150?img=61'
    },
    date: '2023-12-21',
    readTime: 3,
    heroImage: 'https://picsum.photos/seed/article-230-improving-windows-performance-on-old-devices/800/450',
    tags: ['Tech', 'Windows', '2024'],
    isFeatured: false,
    isTrending: false
  },
  {
    id: '231',
    slug: 'article-231-ram-management-in-windows',
    title: { ar: 'إدارة ذاكرة الوصول العشوائي في ويندوز', en: 'RAM management in Windows' },
    excerpt: { 
      ar: 'اكتشف كل ما يخص إدارة ذاكرة الوصول العشوائي في ويندوز وأهم التفاصيل التقنية.', 
      en: 'Discover everything about RAM management in Windows and the most important tech details.' 
    },
    body: fullBody,
    categoryId: 'windows' as Category,
    author: {
      name: { ar: 'ليلى سامي', en: 'Laila Sami' },
      avatar: 'https://i.pravatar.cc/150?img=62'
    },
    date: '2023-12-24',
    readTime: 4,
    heroImage: 'https://picsum.photos/seed/article-231-ram-management-in-windows/800/450',
    tags: ['Tech', 'Windows', '2024'],
    isFeatured: false,
    isTrending: false
  },
  {
    id: '232',
    slug: 'article-232-wsl-features--linux-inside-windows',
    title: { ar: 'مميزات WSL: لينكس داخل ويندوز', en: 'WSL features: Linux inside Windows' },
    excerpt: { 
      ar: 'اكتشف كل ما يخص مميزات WSL: لينكس داخل ويندوز وأهم التفاصيل التقنية.', 
      en: 'Discover everything about WSL features: Linux inside Windows and the most important tech details.' 
    },
    body: fullBody,
    categoryId: 'windows' as Category,
    author: {
      name: { ar: 'خالد عبد الله', en: 'Khaled Abdallah' },
      avatar: 'https://i.pravatar.cc/150?img=63'
    },
    date: '2023-12-27',
    readTime: 5,
    heroImage: 'https://picsum.photos/seed/article-232-wsl-features--linux-inside-windows/800/450',
    tags: ['Tech', 'Windows', '2024'],
    isFeatured: false,
    isTrending: false
  },
  {
    id: '233',
    slug: 'article-233-securing-windows-against-hacking',
    title: { ar: 'تأمين ويندوز ضد الاختراق', en: 'Securing Windows against hacking' },
    excerpt: { 
      ar: 'اكتشف كل ما يخص تأمين ويندوز ضد الاختراق وأهم التفاصيل التقنية.', 
      en: 'Discover everything about Securing Windows against hacking and the most important tech details.' 
    },
    body: fullBody,
    categoryId: 'windows' as Category,
    author: {
      name: { ar: 'أحمد محمود', en: 'Ahmed Mahmoud' },
      avatar: 'https://i.pravatar.cc/150?img=64'
    },
    date: '2023-12-30',
    readTime: 6,
    heroImage: 'https://picsum.photos/seed/article-233-securing-windows-against-hacking/800/450',
    tags: ['Tech', 'Windows', '2024'],
    isFeatured: false,
    isTrending: false
  },
  {
    id: '234',
    slug: 'article-234-how-to-migrate-windows-to-a-new-ssd',
    title: { ar: 'كيف تنقل ويندوز لـ SSD جديد', en: 'How to migrate Windows to a new SSD' },
    excerpt: { 
      ar: 'اكتشف كل ما يخص كيف تنقل ويندوز لـ SSD جديد وأهم التفاصيل التقنية.', 
      en: 'Discover everything about How to migrate Windows to a new SSD and the most important tech details.' 
    },
    body: fullBody,
    categoryId: 'windows' as Category,
    author: {
      name: { ar: 'سارة خالد', en: 'Sarah Khaled' },
      avatar: 'https://i.pravatar.cc/150?img=65'
    },
    date: '2024-01-01',
    readTime: 7,
    heroImage: 'https://picsum.photos/seed/article-234-how-to-migrate-windows-to-a-new-ssd/800/450',
    tags: ['Tech', 'Windows', '2024'],
    isFeatured: false,
    isTrending: false
  },
  {
    id: '235',
    slug: 'article-235-built-in-windows-tools-you-re-not-using',
    title: { ar: 'أدوات ويندوز المدمجة التي لا تستخدمها', en: 'Built-in Windows tools you\'re not using' },
    excerpt: { 
      ar: 'اكتشف كل ما يخص أدوات ويندوز المدمجة التي لا تستخدمها وأهم التفاصيل التقنية.', 
      en: 'Discover everything about Built-in Windows tools you\'re not using and the most important tech details.' 
    },
    body: fullBody,
    categoryId: 'windows' as Category,
    author: {
      name: { ar: 'عمر طارق', en: 'Omar Tarek' },
      avatar: 'https://i.pravatar.cc/150?img=66'
    },
    date: '2024-01-04',
    readTime: 8,
    heroImage: 'https://picsum.photos/seed/article-235-built-in-windows-tools-you-re-not-using/800/450',
    tags: ['Tech', 'Windows', '2024'],
    isFeatured: false,
    isTrending: false
  },
  {
    id: '236',
    slug: 'article-236-how-to-fix-the-blue-screen-bsod',
    title: { ar: 'كيف تعالج الشاشة الزرقاء BSOD', en: 'How to fix the blue screen BSOD' },
    excerpt: { 
      ar: 'اكتشف كل ما يخص كيف تعالج الشاشة الزرقاء BSOD وأهم التفاصيل التقنية.', 
      en: 'Discover everything about How to fix the blue screen BSOD and the most important tech details.' 
    },
    body: fullBody,
    categoryId: 'windows' as Category,
    author: {
      name: { ar: 'نور أحمد', en: 'Nour Ahmed' },
      avatar: 'https://i.pravatar.cc/150?img=67'
    },
    date: '2024-01-07',
    readTime: 9,
    heroImage: 'https://picsum.photos/seed/article-236-how-to-fix-the-blue-screen-bsod/800/450',
    tags: ['Tech', 'Windows', '2024'],
    isFeatured: false,
    isTrending: false
  },
  {
    id: '237',
    slug: 'article-237-windows-11-vs-windows-10-complete-differences',
    title: { ar: 'ويندوز 11 vs ويندوز 10 الفروق الكاملة', en: 'Windows 11 vs Windows 10 complete differences' },
    excerpt: { 
      ar: 'اكتشف كل ما يخص ويندوز 11 vs ويندوز 10 الفروق الكاملة وأهم التفاصيل التقنية.', 
      en: 'Discover everything about Windows 11 vs Windows 10 complete differences and the most important tech details.' 
    },
    body: fullBody,
    categoryId: 'windows' as Category,
    author: {
      name: { ar: 'كريم حسن', en: 'Karim Hassan' },
      avatar: 'https://i.pravatar.cc/150?img=68'
    },
    date: '2024-01-10',
    readTime: 10,
    heroImage: 'https://picsum.photos/seed/article-237-windows-11-vs-windows-10-complete-differences/800/450',
    tags: ['Tech', 'Windows', '2024'],
    isFeatured: false,
    isTrending: false
  },
  {
    id: '238',
    slug: 'article-238-how-to-enable-dark-mode-in-windows',
    title: { ar: 'كيف تفعّل الوضع الداكن في ويندوز', en: 'How to enable dark mode in Windows' },
    excerpt: { 
      ar: 'اكتشف كل ما يخص كيف تفعّل الوضع الداكن في ويندوز وأهم التفاصيل التقنية.', 
      en: 'Discover everything about How to enable dark mode in Windows and the most important tech details.' 
    },
    body: fullBody,
    categoryId: 'windows' as Category,
    author: {
      name: { ar: 'ليلى سامي', en: 'Laila Sami' },
      avatar: 'https://i.pravatar.cc/150?img=69'
    },
    date: '2024-01-12',
    readTime: 11,
    heroImage: 'https://picsum.photos/seed/article-238-how-to-enable-dark-mode-in-windows/800/450',
    tags: ['Tech', 'Windows', '2024'],
    isFeatured: false,
    isTrending: false
  },
  {
    id: '239',
    slug: 'article-239-organizing-windows-desktop-for-productivity',
    title: { ar: 'تنظيم سطح مكتب ويندوز للإنتاجية', en: 'Organizing Windows desktop for productivity' },
    excerpt: { 
      ar: 'اكتشف كل ما يخص تنظيم سطح مكتب ويندوز للإنتاجية وأهم التفاصيل التقنية.', 
      en: 'Discover everything about Organizing Windows desktop for productivity and the most important tech details.' 
    },
    body: fullBody,
    categoryId: 'windows' as Category,
    author: {
      name: { ar: 'خالد عبد الله', en: 'Khaled Abdallah' },
      avatar: 'https://i.pravatar.cc/150?img=70'
    },
    date: '2024-01-15',
    readTime: 12,
    heroImage: 'https://picsum.photos/seed/article-239-organizing-windows-desktop-for-productivity/800/450',
    tags: ['Tech', 'Windows', '2024'],
    isFeatured: false,
    isTrending: false
  },
  {
    id: '240',
    slug: 'article-240-iphone-15-pro-vs-galaxy-s24-comparison',
    title: { ar: 'مقارنة iPhone 15 Pro و Galaxy S24', en: 'iPhone 15 Pro vs Galaxy S24 comparison' },
    excerpt: { 
      ar: 'اكتشف كل ما يخص مقارنة iPhone 15 Pro و Galaxy S24 وأهم التفاصيل التقنية.', 
      en: 'Discover everything about iPhone 15 Pro vs Galaxy S24 comparison and the most important tech details.' 
    },
    body: fullBody,
    categoryId: 'comparisons' as Category,
    author: {
      name: { ar: 'أحمد محمود', en: 'Ahmed Mahmoud' },
      avatar: 'https://i.pravatar.cc/150?img=1'
    },
    date: '2024-01-18',
    readTime: 3,
    heroImage: 'https://picsum.photos/seed/article-240-iphone-15-pro-vs-galaxy-s24-comparison/800/450',
    tags: ['Tech', 'Comparisons', '2024'],
    isFeatured: false,
    isTrending: false
  },
  {
    id: '241',
    slug: 'article-241-which-to-choose--macbook-air-or-dell-xps-13',
    title: { ar: 'أيهما تختار: MacBook Air أم Dell XPS 13', en: 'Which to choose: MacBook Air or Dell XPS 13' },
    excerpt: { 
      ar: 'اكتشف كل ما يخص أيهما تختار: MacBook Air أم Dell XPS 13 وأهم التفاصيل التقنية.', 
      en: 'Discover everything about Which to choose: MacBook Air or Dell XPS 13 and the most important tech details.' 
    },
    body: fullBody,
    categoryId: 'comparisons' as Category,
    author: {
      name: { ar: 'سارة خالد', en: 'Sarah Khaled' },
      avatar: 'https://i.pravatar.cc/150?img=2'
    },
    date: '2024-01-20',
    readTime: 4,
    heroImage: 'https://picsum.photos/seed/article-241-which-to-choose--macbook-air-or-dell-xps-13/800/450',
    tags: ['Tech', 'Comparisons', '2024'],
    isFeatured: false,
    isTrending: false
  },
  {
    id: '242',
    slug: 'article-242-ps5-vs-xbox-series-x-comparison-in-2024',
    title: { ar: 'مقارنة PS5 و Xbox Series X في 2024', en: 'PS5 vs Xbox Series X comparison in 2024' },
    excerpt: { 
      ar: 'اكتشف كل ما يخص مقارنة PS5 و Xbox Series X في 2024 وأهم التفاصيل التقنية.', 
      en: 'Discover everything about PS5 vs Xbox Series X comparison in 2024 and the most important tech details.' 
    },
    body: fullBody,
    categoryId: 'comparisons' as Category,
    author: {
      name: { ar: 'عمر طارق', en: 'Omar Tarek' },
      avatar: 'https://i.pravatar.cc/150?img=3'
    },
    date: '2024-01-23',
    readTime: 5,
    heroImage: 'https://picsum.photos/seed/article-242-ps5-vs-xbox-series-x-comparison-in-2024/800/450',
    tags: ['Tech', 'Comparisons', '2024'],
    isFeatured: false,
    isTrending: false
  },
  {
    id: '243',
    slug: 'article-243-clash-of-watches--apple-watch-9-vs-galaxy-watch-6',
    title: { ar: 'صراع الساعات: Apple Watch 9 vs Galaxy Watch 6', en: 'Clash of watches: Apple Watch 9 vs Galaxy Watch 6' },
    excerpt: { 
      ar: 'اكتشف كل ما يخص صراع الساعات: Apple Watch 9 vs Galaxy Watch 6 وأهم التفاصيل التقنية.', 
      en: 'Discover everything about Clash of watches: Apple Watch 9 vs Galaxy Watch 6 and the most important tech details.' 
    },
    body: fullBody,
    categoryId: 'comparisons' as Category,
    author: {
      name: { ar: 'نور أحمد', en: 'Nour Ahmed' },
      avatar: 'https://i.pravatar.cc/150?img=4'
    },
    date: '2024-01-26',
    readTime: 6,
    heroImage: 'https://picsum.photos/seed/article-243-clash-of-watches--apple-watch-9-vs-galaxy-watch-6/800/450',
    tags: ['Tech', 'Comparisons', '2024'],
    isFeatured: false,
    isTrending: false
  },
  {
    id: '244',
    slug: 'article-244-camera-comparison--sony-a7-iv-vs-canon-r6',
    title: { ar: 'مقارنة الكاميرات: Sony A7 IV vs Canon R6', en: 'Camera comparison: Sony A7 IV vs Canon R6' },
    excerpt: { 
      ar: 'اكتشف كل ما يخص مقارنة الكاميرات: Sony A7 IV vs Canon R6 وأهم التفاصيل التقنية.', 
      en: 'Discover everything about Camera comparison: Sony A7 IV vs Canon R6 and the most important tech details.' 
    },
    body: fullBody,
    categoryId: 'comparisons' as Category,
    author: {
      name: { ar: 'كريم حسن', en: 'Karim Hassan' },
      avatar: 'https://i.pravatar.cc/150?img=5'
    },
    date: '2024-01-29',
    readTime: 7,
    heroImage: 'https://picsum.photos/seed/article-244-camera-comparison--sony-a7-iv-vs-canon-r6/800/450',
    tags: ['Tech', 'Comparisons', '2024'],
    isFeatured: false,
    isTrending: false
  },
  {
    id: '245',
    slug: 'article-245-best-os--ios-17-vs-android-14',
    title: { ar: 'أفضل نظام: iOS 17 vs Android 14', en: 'Best OS: iOS 17 vs Android 14' },
    excerpt: { 
      ar: 'اكتشف كل ما يخص أفضل نظام: iOS 17 vs Android 14 وأهم التفاصيل التقنية.', 
      en: 'Discover everything about Best OS: iOS 17 vs Android 14 and the most important tech details.' 
    },
    body: fullBody,
    categoryId: 'comparisons' as Category,
    author: {
      name: { ar: 'ليلى سامي', en: 'Laila Sami' },
      avatar: 'https://i.pravatar.cc/150?img=6'
    },
    date: '2024-01-31',
    readTime: 8,
    heroImage: 'https://picsum.photos/seed/article-245-best-os--ios-17-vs-android-14/800/450',
    tags: ['Tech', 'Comparisons', '2024'],
    isFeatured: false,
    isTrending: false
  },
  {
    id: '246',
    slug: 'article-246-anc-earbuds--airpods-pro-2-vs-sony-wf-1000xm5',
    title: { ar: 'سماعات العزل: AirPods Pro 2 vs Sony WF-1000XM5', en: 'ANC earbuds: AirPods Pro 2 vs Sony WF-1000XM5' },
    excerpt: { 
      ar: 'اكتشف كل ما يخص سماعات العزل: AirPods Pro 2 vs Sony WF-1000XM5 وأهم التفاصيل التقنية.', 
      en: 'Discover everything about ANC earbuds: AirPods Pro 2 vs Sony WF-1000XM5 and the most important tech details.' 
    },
    body: fullBody,
    categoryId: 'comparisons' as Category,
    author: {
      name: { ar: 'خالد عبد الله', en: 'Khaled Abdallah' },
      avatar: 'https://i.pravatar.cc/150?img=7'
    },
    date: '2024-02-03',
    readTime: 9,
    heroImage: 'https://picsum.photos/seed/article-246-anc-earbuds--airpods-pro-2-vs-sony-wf-1000xm5/800/450',
    tags: ['Tech', 'Comparisons', '2024'],
    isFeatured: false,
    isTrending: false
  },
  {
    id: '247',
    slug: 'article-247-processors-comparison--apple-m3-vs-intel-core-ultra',
    title: { ar: 'مقارنة المعالجات: Apple M3 vs Intel Core Ultra', en: 'Processors comparison: Apple M3 vs Intel Core Ultra' },
    excerpt: { 
      ar: 'اكتشف كل ما يخص مقارنة المعالجات: Apple M3 vs Intel Core Ultra وأهم التفاصيل التقنية.', 
      en: 'Discover everything about Processors comparison: Apple M3 vs Intel Core Ultra and the most important tech details.' 
    },
    body: fullBody,
    categoryId: 'comparisons' as Category,
    author: {
      name: { ar: 'أحمد محمود', en: 'Ahmed Mahmoud' },
      avatar: 'https://i.pravatar.cc/150?img=8'
    },
    date: '2024-02-06',
    readTime: 10,
    heroImage: 'https://picsum.photos/seed/article-247-processors-comparison--apple-m3-vs-intel-core-ultra/800/450',
    tags: ['Tech', 'Comparisons', '2024'],
    isFeatured: false,
    isTrending: false
  },
  {
    id: '248',
    slug: 'article-248-tablets--ipad-air-vs-galaxy-tab-s9',
    title: { ar: 'الأجهزة اللوحية: iPad Air vs Galaxy Tab S9', en: 'Tablets: iPad Air vs Galaxy Tab S9' },
    excerpt: { 
      ar: 'اكتشف كل ما يخص الأجهزة اللوحية: iPad Air vs Galaxy Tab S9 وأهم التفاصيل التقنية.', 
      en: 'Discover everything about Tablets: iPad Air vs Galaxy Tab S9 and the most important tech details.' 
    },
    body: fullBody,
    categoryId: 'comparisons' as Category,
    author: {
      name: { ar: 'سارة خالد', en: 'Sarah Khaled' },
      avatar: 'https://i.pravatar.cc/150?img=9'
    },
    date: '2024-02-09',
    readTime: 11,
    heroImage: 'https://picsum.photos/seed/article-248-tablets--ipad-air-vs-galaxy-tab-s9/800/450',
    tags: ['Tech', 'Comparisons', '2024'],
    isFeatured: false,
    isTrending: false
  },
  {
    id: '249',
    slug: 'article-249-handheld-consoles--steam-deck-vs-rog-ally',
    title: { ar: 'منصات الألعاب المحمولة: Steam Deck vs ROG Ally', en: 'Handheld consoles: Steam Deck vs ROG Ally' },
    excerpt: { 
      ar: 'اكتشف كل ما يخص منصات الألعاب المحمولة: Steam Deck vs ROG Ally وأهم التفاصيل التقنية.', 
      en: 'Discover everything about Handheld consoles: Steam Deck vs ROG Ally and the most important tech details.' 
    },
    body: fullBody,
    categoryId: 'comparisons' as Category,
    author: {
      name: { ar: 'عمر طارق', en: 'Omar Tarek' },
      avatar: 'https://i.pravatar.cc/150?img=10'
    },
    date: '2024-02-11',
    readTime: 12,
    heroImage: 'https://picsum.photos/seed/article-249-handheld-consoles--steam-deck-vs-rog-ally/800/450',
    tags: ['Tech', 'Comparisons', '2024'],
    isFeatured: false,
    isTrending: false
  },
  {
    id: '250',
    slug: 'article-250-gpu-comparison--rtx-4080-vs-rx-7900-xtx',
    title: { ar: 'مقارنة البطاقات الرسومية: RTX 4080 vs RX 7900 XTX', en: 'GPU comparison: RTX 4080 vs RX 7900 XTX' },
    excerpt: { 
      ar: 'اكتشف كل ما يخص مقارنة البطاقات الرسومية: RTX 4080 vs RX 7900 XTX وأهم التفاصيل التقنية.', 
      en: 'Discover everything about GPU comparison: RTX 4080 vs RX 7900 XTX and the most important tech details.' 
    },
    body: fullBody,
    categoryId: 'comparisons' as Category,
    author: {
      name: { ar: 'نور أحمد', en: 'Nour Ahmed' },
      avatar: 'https://i.pravatar.cc/150?img=11'
    },
    date: '2024-02-14',
    readTime: 3,
    heroImage: 'https://picsum.photos/seed/article-250-gpu-comparison--rtx-4080-vs-rx-7900-xtx/800/450',
    tags: ['Tech', 'Comparisons', '2024'],
    isFeatured: true,
    isTrending: true
  },
  {
    id: '251',
    slug: 'article-251-which-cloud--google-drive-vs-onedrive',
    title: { ar: 'أي نظام سحابي تختار: Google Drive vs OneDrive', en: 'Which cloud: Google Drive vs OneDrive' },
    excerpt: { 
      ar: 'اكتشف كل ما يخص أي نظام سحابي تختار: Google Drive vs OneDrive وأهم التفاصيل التقنية.', 
      en: 'Discover everything about Which cloud: Google Drive vs OneDrive and the most important tech details.' 
    },
    body: fullBody,
    categoryId: 'comparisons' as Category,
    author: {
      name: { ar: 'كريم حسن', en: 'Karim Hassan' },
      avatar: 'https://i.pravatar.cc/150?img=12'
    },
    date: '2024-02-17',
    readTime: 4,
    heroImage: 'https://picsum.photos/seed/article-251-which-cloud--google-drive-vs-onedrive/800/450',
    tags: ['Tech', 'Comparisons', '2024'],
    isFeatured: false,
    isTrending: false
  },
  {
    id: '252',
    slug: 'article-252-ai-platforms--chatgpt-plus-vs-claude-pro',
    title: { ar: 'منصات الذكاء الاصطناعي: ChatGPT Plus vs Claude Pro', en: 'AI platforms: ChatGPT Plus vs Claude Pro' },
    excerpt: { 
      ar: 'اكتشف كل ما يخص منصات الذكاء الاصطناعي: ChatGPT Plus vs Claude Pro وأهم التفاصيل التقنية.', 
      en: 'Discover everything about AI platforms: ChatGPT Plus vs Claude Pro and the most important tech details.' 
    },
    body: fullBody,
    categoryId: 'comparisons' as Category,
    author: {
      name: { ar: 'ليلى سامي', en: 'Laila Sami' },
      avatar: 'https://i.pravatar.cc/150?img=13'
    },
    date: '2024-02-19',
    readTime: 5,
    heroImage: 'https://picsum.photos/seed/article-252-ai-platforms--chatgpt-plus-vs-claude-pro/800/450',
    tags: ['Tech', 'Comparisons', '2024'],
    isFeatured: false,
    isTrending: false
  },
  {
    id: '253',
    slug: 'article-253-web-browsers--chrome-vs-edge-vs-brave',
    title: { ar: 'مقارنة متصفحات الويب: Chrome vs Edge vs Brave', en: 'Web browsers: Chrome vs Edge vs Brave' },
    excerpt: { 
      ar: 'اكتشف كل ما يخص مقارنة متصفحات الويب: Chrome vs Edge vs Brave وأهم التفاصيل التقنية.', 
      en: 'Discover everything about Web browsers: Chrome vs Edge vs Brave and the most important tech details.' 
    },
    body: fullBody,
    categoryId: 'comparisons' as Category,
    author: {
      name: { ar: 'خالد عبد الله', en: 'Khaled Abdallah' },
      avatar: 'https://i.pravatar.cc/150?img=14'
    },
    date: '2024-02-22',
    readTime: 6,
    heroImage: 'https://picsum.photos/seed/article-253-web-browsers--chrome-vs-edge-vs-brave/800/450',
    tags: ['Tech', 'Comparisons', '2024'],
    isFeatured: false,
    isTrending: false
  },
  {
    id: '254',
    slug: 'article-254-video-editors--premiere-pro-vs-final-cut-pro',
    title: { ar: 'برامج المونتاج: Premiere Pro vs Final Cut Pro', en: 'Video editors: Premiere Pro vs Final Cut Pro' },
    excerpt: { 
      ar: 'اكتشف كل ما يخص برامج المونتاج: Premiere Pro vs Final Cut Pro وأهم التفاصيل التقنية.', 
      en: 'Discover everything about Video editors: Premiere Pro vs Final Cut Pro and the most important tech details.' 
    },
    body: fullBody,
    categoryId: 'comparisons' as Category,
    author: {
      name: { ar: 'أحمد محمود', en: 'Ahmed Mahmoud' },
      avatar: 'https://i.pravatar.cc/150?img=15'
    },
    date: '2024-02-25',
    readTime: 7,
    heroImage: 'https://picsum.photos/seed/article-254-video-editors--premiere-pro-vs-final-cut-pro/800/450',
    tags: ['Tech', 'Comparisons', '2024'],
    isFeatured: false,
    isTrending: false
  },
  {
    id: '255',
    slug: 'article-255-best-for-home--alexa-vs-google-assistant',
    title: { ar: 'أيهما أفضل للمنزل: Alexa vs Google Assistant', en: 'Best for home: Alexa vs Google Assistant' },
    excerpt: { 
      ar: 'اكتشف كل ما يخص أيهما أفضل للمنزل: Alexa vs Google Assistant وأهم التفاصيل التقنية.', 
      en: 'Discover everything about Best for home: Alexa vs Google Assistant and the most important tech details.' 
    },
    body: fullBody,
    categoryId: 'comparisons' as Category,
    author: {
      name: { ar: 'سارة خالد', en: 'Sarah Khaled' },
      avatar: 'https://i.pravatar.cc/150?img=16'
    },
    date: '2024-02-28',
    readTime: 8,
    heroImage: 'https://picsum.photos/seed/article-255-best-for-home--alexa-vs-google-assistant/800/450',
    tags: ['Tech', 'Comparisons', '2024'],
    isFeatured: false,
    isTrending: false
  },
  {
    id: '256',
    slug: 'article-256-music-services--spotify-vs-apple-music',
    title: { ar: 'خدمات الموسيقى: Spotify vs Apple Music', en: 'Music services: Spotify vs Apple Music' },
    excerpt: { 
      ar: 'اكتشف كل ما يخص خدمات الموسيقى: Spotify vs Apple Music وأهم التفاصيل التقنية.', 
      en: 'Discover everything about Music services: Spotify vs Apple Music and the most important tech details.' 
    },
    body: fullBody,
    categoryId: 'comparisons' as Category,
    author: {
      name: { ar: 'عمر طارق', en: 'Omar Tarek' },
      avatar: 'https://i.pravatar.cc/150?img=17'
    },
    date: '2024-03-01',
    readTime: 9,
    heroImage: 'https://picsum.photos/seed/article-256-music-services--spotify-vs-apple-music/800/450',
    tags: ['Tech', 'Comparisons', '2024'],
    isFeatured: false,
    isTrending: false
  },
  {
    id: '257',
    slug: 'article-257-best-tv-ui--apple-tv-4k-vs-chromecast',
    title: { ar: 'أفضل واجهة تلفزيون: Apple TV 4K vs Chromecast', en: 'Best TV UI: Apple TV 4K vs Chromecast' },
    excerpt: { 
      ar: 'اكتشف كل ما يخص أفضل واجهة تلفزيون: Apple TV 4K vs Chromecast وأهم التفاصيل التقنية.', 
      en: 'Discover everything about Best TV UI: Apple TV 4K vs Chromecast and the most important tech details.' 
    },
    body: fullBody,
    categoryId: 'comparisons' as Category,
    author: {
      name: { ar: 'نور أحمد', en: 'Nour Ahmed' },
      avatar: 'https://i.pravatar.cc/150?img=18'
    },
    date: '2024-03-04',
    readTime: 10,
    heroImage: 'https://picsum.photos/seed/article-257-best-tv-ui--apple-tv-4k-vs-chromecast/800/450',
    tags: ['Tech', 'Comparisons', '2024'],
    isFeatured: false,
    isTrending: false
  },
  {
    id: '258',
    slug: 'article-258-secure-chat--signal-vs-telegram',
    title: { ar: 'برامج المحادثة الآمنة: Signal vs Telegram', en: 'Secure chat: Signal vs Telegram' },
    excerpt: { 
      ar: 'اكتشف كل ما يخص برامج المحادثة الآمنة: Signal vs Telegram وأهم التفاصيل التقنية.', 
      en: 'Discover everything about Secure chat: Signal vs Telegram and the most important tech details.' 
    },
    body: fullBody,
    categoryId: 'comparisons' as Category,
    author: {
      name: { ar: 'كريم حسن', en: 'Karim Hassan' },
      avatar: 'https://i.pravatar.cc/150?img=19'
    },
    date: '2024-03-07',
    readTime: 11,
    heroImage: 'https://picsum.photos/seed/article-258-secure-chat--signal-vs-telegram/800/450',
    tags: ['Tech', 'Comparisons', '2024'],
    isFeatured: false,
    isTrending: false
  },
  {
    id: '259',
    slug: 'article-259-gaming-monitors--oled-vs-mini-led',
    title: { ar: 'مقارنة شاشات الألعاب: OLED vs Mini LED', en: 'Gaming monitors: OLED vs Mini LED' },
    excerpt: { 
      ar: 'اكتشف كل ما يخص مقارنة شاشات الألعاب: OLED vs Mini LED وأهم التفاصيل التقنية.', 
      en: 'Discover everything about Gaming monitors: OLED vs Mini LED and the most important tech details.' 
    },
    body: fullBody,
    categoryId: 'comparisons' as Category,
    author: {
      name: { ar: 'ليلى سامي', en: 'Laila Sami' },
      avatar: 'https://i.pravatar.cc/150?img=20'
    },
    date: '2024-03-10',
    readTime: 12,
    heroImage: 'https://picsum.photos/seed/article-259-gaming-monitors--oled-vs-mini-led/800/450',
    tags: ['Tech', 'Comparisons', '2024'],
    isFeatured: false,
    isTrending: false
  },
  {
    id: '260',
    slug: 'article-260-additional-tech-topic-about-cybersecurity-number-0',
    title: { ar: 'موضوع إضافي وتقني عن cybersecurity رقم 0', en: 'Additional tech topic about cybersecurity number 0' },
    excerpt: { 
      ar: 'اكتشف كل ما يخص موضوع إضافي وتقني عن cybersecurity رقم 0 وأهم التفاصيل التقنية.', 
      en: 'Discover everything about Additional tech topic about cybersecurity number 0 and the most important tech details.' 
    },
    body: fullBody,
    categoryId: 'cybersecurity' as Category,
    author: {
      name: { ar: 'خالد عبد الله', en: 'Khaled Abdallah' },
      avatar: 'https://i.pravatar.cc/150?img=21'
    },
    date: '2024-03-12',
    readTime: 3,
    heroImage: 'https://picsum.photos/seed/article-260-additional-tech-topic-about-cybersecurity-number-0/800/450',
    tags: ['Tech', 'Cybersecurity', '2024'],
    isFeatured: false,
    isTrending: false
  },
  {
    id: '261',
    slug: 'article-261-additional-tech-topic-about-mobile-number-1',
    title: { ar: 'موضوع إضافي وتقني عن mobile رقم 1', en: 'Additional tech topic about mobile number 1' },
    excerpt: { 
      ar: 'اكتشف كل ما يخص موضوع إضافي وتقني عن mobile رقم 1 وأهم التفاصيل التقنية.', 
      en: 'Discover everything about Additional tech topic about mobile number 1 and the most important tech details.' 
    },
    body: fullBody,
    categoryId: 'mobile' as Category,
    author: {
      name: { ar: 'أحمد محمود', en: 'Ahmed Mahmoud' },
      avatar: 'https://i.pravatar.cc/150?img=22'
    },
    date: '2024-03-15',
    readTime: 4,
    heroImage: 'https://picsum.photos/seed/article-261-additional-tech-topic-about-mobile-number-1/800/450',
    tags: ['Tech', 'Mobile', '2024'],
    isFeatured: false,
    isTrending: false
  },
  {
    id: '262',
    slug: 'article-262-additional-tech-topic-about-laptops-number-2',
    title: { ar: 'موضوع إضافي وتقني عن laptops رقم 2', en: 'Additional tech topic about laptops number 2' },
    excerpt: { 
      ar: 'اكتشف كل ما يخص موضوع إضافي وتقني عن laptops رقم 2 وأهم التفاصيل التقنية.', 
      en: 'Discover everything about Additional tech topic about laptops number 2 and the most important tech details.' 
    },
    body: fullBody,
    categoryId: 'laptops' as Category,
    author: {
      name: { ar: 'سارة خالد', en: 'Sarah Khaled' },
      avatar: 'https://i.pravatar.cc/150?img=23'
    },
    date: '2024-03-18',
    readTime: 5,
    heroImage: 'https://picsum.photos/seed/article-262-additional-tech-topic-about-laptops-number-2/800/450',
    tags: ['Tech', 'Laptops', '2024'],
    isFeatured: false,
    isTrending: false
  },
  {
    id: '263',
    slug: 'article-263-additional-tech-topic-about-howto-number-3',
    title: { ar: 'موضوع إضافي وتقني عن howto رقم 3', en: 'Additional tech topic about howto number 3' },
    excerpt: { 
      ar: 'اكتشف كل ما يخص موضوع إضافي وتقني عن howto رقم 3 وأهم التفاصيل التقنية.', 
      en: 'Discover everything about Additional tech topic about howto number 3 and the most important tech details.' 
    },
    body: fullBody,
    categoryId: 'howto' as Category,
    author: {
      name: { ar: 'عمر طارق', en: 'Omar Tarek' },
      avatar: 'https://i.pravatar.cc/150?img=24'
    },
    date: '2024-03-20',
    readTime: 6,
    heroImage: 'https://picsum.photos/seed/article-263-additional-tech-topic-about-howto-number-3/800/450',
    tags: ['Tech', 'Howto', '2024'],
    isFeatured: false,
    isTrending: false
  },
  {
    id: '264',
    slug: 'article-264-additional-tech-topic-about-ai-number-4',
    title: { ar: 'موضوع إضافي وتقني عن ai رقم 4', en: 'Additional tech topic about ai number 4' },
    excerpt: { 
      ar: 'اكتشف كل ما يخص موضوع إضافي وتقني عن ai رقم 4 وأهم التفاصيل التقنية.', 
      en: 'Discover everything about Additional tech topic about ai number 4 and the most important tech details.' 
    },
    body: fullBody,
    categoryId: 'ai' as Category,
    author: {
      name: { ar: 'نور أحمد', en: 'Nour Ahmed' },
      avatar: 'https://i.pravatar.cc/150?img=25'
    },
    date: '2024-03-23',
    readTime: 7,
    heroImage: 'https://picsum.photos/seed/article-264-additional-tech-topic-about-ai-number-4/800/450',
    tags: ['Tech', 'Ai', '2024'],
    isFeatured: false,
    isTrending: false
  },
  {
    id: '265',
    slug: 'article-265-additional-tech-topic-about-reviews-number-5',
    title: { ar: 'موضوع إضافي وتقني عن reviews رقم 5', en: 'Additional tech topic about reviews number 5' },
    excerpt: { 
      ar: 'اكتشف كل ما يخص موضوع إضافي وتقني عن reviews رقم 5 وأهم التفاصيل التقنية.', 
      en: 'Discover everything about Additional tech topic about reviews number 5 and the most important tech details.' 
    },
    body: fullBody,
    categoryId: 'reviews' as Category,
    author: {
      name: { ar: 'كريم حسن', en: 'Karim Hassan' },
      avatar: 'https://i.pravatar.cc/150?img=26'
    },
    date: '2024-03-26',
    readTime: 8,
    heroImage: 'https://picsum.photos/seed/article-265-additional-tech-topic-about-reviews-number-5/800/450',
    tags: ['Tech', 'Reviews', '2024'],
    isFeatured: false,
    isTrending: false
  },
  {
    id: '266',
    slug: 'article-266-additional-tech-topic-about-windows-number-6',
    title: { ar: 'موضوع إضافي وتقني عن windows رقم 6', en: 'Additional tech topic about windows number 6' },
    excerpt: { 
      ar: 'اكتشف كل ما يخص موضوع إضافي وتقني عن windows رقم 6 وأهم التفاصيل التقنية.', 
      en: 'Discover everything about Additional tech topic about windows number 6 and the most important tech details.' 
    },
    body: fullBody,
    categoryId: 'windows' as Category,
    author: {
      name: { ar: 'ليلى سامي', en: 'Laila Sami' },
      avatar: 'https://i.pravatar.cc/150?img=27'
    },
    date: '2024-03-29',
    readTime: 9,
    heroImage: 'https://picsum.photos/seed/article-266-additional-tech-topic-about-windows-number-6/800/450',
    tags: ['Tech', 'Windows', '2024'],
    isFeatured: false,
    isTrending: false
  },
  {
    id: '267',
    slug: 'article-267-additional-tech-topic-about-comparisons-number-7',
    title: { ar: 'موضوع إضافي وتقني عن comparisons رقم 7', en: 'Additional tech topic about comparisons number 7' },
    excerpt: { 
      ar: 'اكتشف كل ما يخص موضوع إضافي وتقني عن comparisons رقم 7 وأهم التفاصيل التقنية.', 
      en: 'Discover everything about Additional tech topic about comparisons number 7 and the most important tech details.' 
    },
    body: fullBody,
    categoryId: 'comparisons' as Category,
    author: {
      name: { ar: 'خالد عبد الله', en: 'Khaled Abdallah' },
      avatar: 'https://i.pravatar.cc/150?img=28'
    },
    date: '2024-03-31',
    readTime: 10,
    heroImage: 'https://picsum.photos/seed/article-267-additional-tech-topic-about-comparisons-number-7/800/450',
    tags: ['Tech', 'Comparisons', '2024'],
    isFeatured: false,
    isTrending: false
  },
  {
    id: '268',
    slug: 'article-268-additional-tech-topic-about-cybersecurity-number-8',
    title: { ar: 'موضوع إضافي وتقني عن cybersecurity رقم 8', en: 'Additional tech topic about cybersecurity number 8' },
    excerpt: { 
      ar: 'اكتشف كل ما يخص موضوع إضافي وتقني عن cybersecurity رقم 8 وأهم التفاصيل التقنية.', 
      en: 'Discover everything about Additional tech topic about cybersecurity number 8 and the most important tech details.' 
    },
    body: fullBody,
    categoryId: 'cybersecurity' as Category,
    author: {
      name: { ar: 'أحمد محمود', en: 'Ahmed Mahmoud' },
      avatar: 'https://i.pravatar.cc/150?img=29'
    },
    date: '2024-04-03',
    readTime: 11,
    heroImage: 'https://picsum.photos/seed/article-268-additional-tech-topic-about-cybersecurity-number-8/800/450',
    tags: ['Tech', 'Cybersecurity', '2024'],
    isFeatured: false,
    isTrending: false
  },
  {
    id: '269',
    slug: 'article-269-additional-tech-topic-about-mobile-number-9',
    title: { ar: 'موضوع إضافي وتقني عن mobile رقم 9', en: 'Additional tech topic about mobile number 9' },
    excerpt: { 
      ar: 'اكتشف كل ما يخص موضوع إضافي وتقني عن mobile رقم 9 وأهم التفاصيل التقنية.', 
      en: 'Discover everything about Additional tech topic about mobile number 9 and the most important tech details.' 
    },
    body: fullBody,
    categoryId: 'mobile' as Category,
    author: {
      name: { ar: 'سارة خالد', en: 'Sarah Khaled' },
      avatar: 'https://i.pravatar.cc/150?img=30'
    },
    date: '2024-04-06',
    readTime: 12,
    heroImage: 'https://picsum.photos/seed/article-269-additional-tech-topic-about-mobile-number-9/800/450',
    tags: ['Tech', 'Mobile', '2024'],
    isFeatured: false,
    isTrending: false
  },
  {
    id: '270',
    slug: 'article-270-additional-tech-topic-about-laptops-number-10',
    title: { ar: 'موضوع إضافي وتقني عن laptops رقم 10', en: 'Additional tech topic about laptops number 10' },
    excerpt: { 
      ar: 'اكتشف كل ما يخص موضوع إضافي وتقني عن laptops رقم 10 وأهم التفاصيل التقنية.', 
      en: 'Discover everything about Additional tech topic about laptops number 10 and the most important tech details.' 
    },
    body: fullBody,
    categoryId: 'laptops' as Category,
    author: {
      name: { ar: 'عمر طارق', en: 'Omar Tarek' },
      avatar: 'https://i.pravatar.cc/150?img=31'
    },
    date: '2024-04-09',
    readTime: 3,
    heroImage: 'https://picsum.photos/seed/article-270-additional-tech-topic-about-laptops-number-10/800/450',
    tags: ['Tech', 'Laptops', '2024'],
    isFeatured: false,
    isTrending: false
  },
  {
    id: '271',
    slug: 'article-271-additional-tech-topic-about-howto-number-11',
    title: { ar: 'موضوع إضافي وتقني عن howto رقم 11', en: 'Additional tech topic about howto number 11' },
    excerpt: { 
      ar: 'اكتشف كل ما يخص موضوع إضافي وتقني عن howto رقم 11 وأهم التفاصيل التقنية.', 
      en: 'Discover everything about Additional tech topic about howto number 11 and the most important tech details.' 
    },
    body: fullBody,
    categoryId: 'howto' as Category,
    author: {
      name: { ar: 'نور أحمد', en: 'Nour Ahmed' },
      avatar: 'https://i.pravatar.cc/150?img=32'
    },
    date: '2024-04-11',
    readTime: 4,
    heroImage: 'https://picsum.photos/seed/article-271-additional-tech-topic-about-howto-number-11/800/450',
    tags: ['Tech', 'Howto', '2024'],
    isFeatured: false,
    isTrending: false
  },
  {
    id: '272',
    slug: 'article-272-additional-tech-topic-about-ai-number-12',
    title: { ar: 'موضوع إضافي وتقني عن ai رقم 12', en: 'Additional tech topic about ai number 12' },
    excerpt: { 
      ar: 'اكتشف كل ما يخص موضوع إضافي وتقني عن ai رقم 12 وأهم التفاصيل التقنية.', 
      en: 'Discover everything about Additional tech topic about ai number 12 and the most important tech details.' 
    },
    body: fullBody,
    categoryId: 'ai' as Category,
    author: {
      name: { ar: 'كريم حسن', en: 'Karim Hassan' },
      avatar: 'https://i.pravatar.cc/150?img=33'
    },
    date: '2024-04-14',
    readTime: 5,
    heroImage: 'https://picsum.photos/seed/article-272-additional-tech-topic-about-ai-number-12/800/450',
    tags: ['Tech', 'Ai', '2024'],
    isFeatured: false,
    isTrending: false
  },
  {
    id: '273',
    slug: 'article-273-additional-tech-topic-about-reviews-number-13',
    title: { ar: 'موضوع إضافي وتقني عن reviews رقم 13', en: 'Additional tech topic about reviews number 13' },
    excerpt: { 
      ar: 'اكتشف كل ما يخص موضوع إضافي وتقني عن reviews رقم 13 وأهم التفاصيل التقنية.', 
      en: 'Discover everything about Additional tech topic about reviews number 13 and the most important tech details.' 
    },
    body: fullBody,
    categoryId: 'reviews' as Category,
    author: {
      name: { ar: 'ليلى سامي', en: 'Laila Sami' },
      avatar: 'https://i.pravatar.cc/150?img=34'
    },
    date: '2024-04-17',
    readTime: 6,
    heroImage: 'https://picsum.photos/seed/article-273-additional-tech-topic-about-reviews-number-13/800/450',
    tags: ['Tech', 'Reviews', '2024'],
    isFeatured: false,
    isTrending: false
  },
  {
    id: '274',
    slug: 'article-274-additional-tech-topic-about-windows-number-14',
    title: { ar: 'موضوع إضافي وتقني عن windows رقم 14', en: 'Additional tech topic about windows number 14' },
    excerpt: { 
      ar: 'اكتشف كل ما يخص موضوع إضافي وتقني عن windows رقم 14 وأهم التفاصيل التقنية.', 
      en: 'Discover everything about Additional tech topic about windows number 14 and the most important tech details.' 
    },
    body: fullBody,
    categoryId: 'windows' as Category,
    author: {
      name: { ar: 'خالد عبد الله', en: 'Khaled Abdallah' },
      avatar: 'https://i.pravatar.cc/150?img=35'
    },
    date: '2024-04-20',
    readTime: 7,
    heroImage: 'https://picsum.photos/seed/article-274-additional-tech-topic-about-windows-number-14/800/450',
    tags: ['Tech', 'Windows', '2024'],
    isFeatured: false,
    isTrending: false
  },
  {
    id: '275',
    slug: 'article-275-additional-tech-topic-about-comparisons-number-15',
    title: { ar: 'موضوع إضافي وتقني عن comparisons رقم 15', en: 'Additional tech topic about comparisons number 15' },
    excerpt: { 
      ar: 'اكتشف كل ما يخص موضوع إضافي وتقني عن comparisons رقم 15 وأهم التفاصيل التقنية.', 
      en: 'Discover everything about Additional tech topic about comparisons number 15 and the most important tech details.' 
    },
    body: fullBody,
    categoryId: 'comparisons' as Category,
    author: {
      name: { ar: 'أحمد محمود', en: 'Ahmed Mahmoud' },
      avatar: 'https://i.pravatar.cc/150?img=36'
    },
    date: '2024-04-22',
    readTime: 8,
    heroImage: 'https://picsum.photos/seed/article-275-additional-tech-topic-about-comparisons-number-15/800/450',
    tags: ['Tech', 'Comparisons', '2024'],
    isFeatured: false,
    isTrending: true
  },
  {
    id: '276',
    slug: 'article-276-additional-tech-topic-about-cybersecurity-number-16',
    title: { ar: 'موضوع إضافي وتقني عن cybersecurity رقم 16', en: 'Additional tech topic about cybersecurity number 16' },
    excerpt: { 
      ar: 'اكتشف كل ما يخص موضوع إضافي وتقني عن cybersecurity رقم 16 وأهم التفاصيل التقنية.', 
      en: 'Discover everything about Additional tech topic about cybersecurity number 16 and the most important tech details.' 
    },
    body: fullBody,
    categoryId: 'cybersecurity' as Category,
    author: {
      name: { ar: 'سارة خالد', en: 'Sarah Khaled' },
      avatar: 'https://i.pravatar.cc/150?img=37'
    },
    date: '2024-04-25',
    readTime: 9,
    heroImage: 'https://picsum.photos/seed/article-276-additional-tech-topic-about-cybersecurity-number-16/800/450',
    tags: ['Tech', 'Cybersecurity', '2024'],
    isFeatured: false,
    isTrending: false
  },
  {
    id: '277',
    slug: 'article-277-additional-tech-topic-about-mobile-number-17',
    title: { ar: 'موضوع إضافي وتقني عن mobile رقم 17', en: 'Additional tech topic about mobile number 17' },
    excerpt: { 
      ar: 'اكتشف كل ما يخص موضوع إضافي وتقني عن mobile رقم 17 وأهم التفاصيل التقنية.', 
      en: 'Discover everything about Additional tech topic about mobile number 17 and the most important tech details.' 
    },
    body: fullBody,
    categoryId: 'mobile' as Category,
    author: {
      name: { ar: 'عمر طارق', en: 'Omar Tarek' },
      avatar: 'https://i.pravatar.cc/150?img=38'
    },
    date: '2024-04-28',
    readTime: 10,
    heroImage: 'https://picsum.photos/seed/article-277-additional-tech-topic-about-mobile-number-17/800/450',
    tags: ['Tech', 'Mobile', '2024'],
    isFeatured: false,
    isTrending: false
  },
  {
    id: '278',
    slug: 'article-278-additional-tech-topic-about-laptops-number-18',
    title: { ar: 'موضوع إضافي وتقني عن laptops رقم 18', en: 'Additional tech topic about laptops number 18' },
    excerpt: { 
      ar: 'اكتشف كل ما يخص موضوع إضافي وتقني عن laptops رقم 18 وأهم التفاصيل التقنية.', 
      en: 'Discover everything about Additional tech topic about laptops number 18 and the most important tech details.' 
    },
    body: fullBody,
    categoryId: 'laptops' as Category,
    author: {
      name: { ar: 'نور أحمد', en: 'Nour Ahmed' },
      avatar: 'https://i.pravatar.cc/150?img=39'
    },
    date: '2024-04-30',
    readTime: 11,
    heroImage: 'https://picsum.photos/seed/article-278-additional-tech-topic-about-laptops-number-18/800/450',
    tags: ['Tech', 'Laptops', '2024'],
    isFeatured: false,
    isTrending: false
  },
  {
    id: '279',
    slug: 'article-279-additional-tech-topic-about-howto-number-19',
    title: { ar: 'موضوع إضافي وتقني عن howto رقم 19', en: 'Additional tech topic about howto number 19' },
    excerpt: { 
      ar: 'اكتشف كل ما يخص موضوع إضافي وتقني عن howto رقم 19 وأهم التفاصيل التقنية.', 
      en: 'Discover everything about Additional tech topic about howto number 19 and the most important tech details.' 
    },
    body: fullBody,
    categoryId: 'howto' as Category,
    author: {
      name: { ar: 'كريم حسن', en: 'Karim Hassan' },
      avatar: 'https://i.pravatar.cc/150?img=40'
    },
    date: '2024-05-03',
    readTime: 12,
    heroImage: 'https://picsum.photos/seed/article-279-additional-tech-topic-about-howto-number-19/800/450',
    tags: ['Tech', 'Howto', '2024'],
    isFeatured: false,
    isTrending: false
  },
  {
    id: '280',
    slug: 'article-280-additional-tech-topic-about-ai-number-20',
    title: { ar: 'موضوع إضافي وتقني عن ai رقم 20', en: 'Additional tech topic about ai number 20' },
    excerpt: { 
      ar: 'اكتشف كل ما يخص موضوع إضافي وتقني عن ai رقم 20 وأهم التفاصيل التقنية.', 
      en: 'Discover everything about Additional tech topic about ai number 20 and the most important tech details.' 
    },
    body: fullBody,
    categoryId: 'ai' as Category,
    author: {
      name: { ar: 'ليلى سامي', en: 'Laila Sami' },
      avatar: 'https://i.pravatar.cc/150?img=41'
    },
    date: '2024-05-06',
    readTime: 3,
    heroImage: 'https://picsum.photos/seed/article-280-additional-tech-topic-about-ai-number-20/800/450',
    tags: ['Tech', 'Ai', '2024'],
    isFeatured: true,
    isTrending: false
  },
  {
    id: '281',
    slug: 'article-281-additional-tech-topic-about-reviews-number-21',
    title: { ar: 'موضوع إضافي وتقني عن reviews رقم 21', en: 'Additional tech topic about reviews number 21' },
    excerpt: { 
      ar: 'اكتشف كل ما يخص موضوع إضافي وتقني عن reviews رقم 21 وأهم التفاصيل التقنية.', 
      en: 'Discover everything about Additional tech topic about reviews number 21 and the most important tech details.' 
    },
    body: fullBody,
    categoryId: 'reviews' as Category,
    author: {
      name: { ar: 'خالد عبد الله', en: 'Khaled Abdallah' },
      avatar: 'https://i.pravatar.cc/150?img=42'
    },
    date: '2024-05-09',
    readTime: 4,
    heroImage: 'https://picsum.photos/seed/article-281-additional-tech-topic-about-reviews-number-21/800/450',
    tags: ['Tech', 'Reviews', '2024'],
    isFeatured: false,
    isTrending: false
  },
  {
    id: '282',
    slug: 'article-282-additional-tech-topic-about-windows-number-22',
    title: { ar: 'موضوع إضافي وتقني عن windows رقم 22', en: 'Additional tech topic about windows number 22' },
    excerpt: { 
      ar: 'اكتشف كل ما يخص موضوع إضافي وتقني عن windows رقم 22 وأهم التفاصيل التقنية.', 
      en: 'Discover everything about Additional tech topic about windows number 22 and the most important tech details.' 
    },
    body: fullBody,
    categoryId: 'windows' as Category,
    author: {
      name: { ar: 'أحمد محمود', en: 'Ahmed Mahmoud' },
      avatar: 'https://i.pravatar.cc/150?img=43'
    },
    date: '2024-05-11',
    readTime: 5,
    heroImage: 'https://picsum.photos/seed/article-282-additional-tech-topic-about-windows-number-22/800/450',
    tags: ['Tech', 'Windows', '2024'],
    isFeatured: false,
    isTrending: false
  },
  {
    id: '283',
    slug: 'article-283-additional-tech-topic-about-comparisons-number-23',
    title: { ar: 'موضوع إضافي وتقني عن comparisons رقم 23', en: 'Additional tech topic about comparisons number 23' },
    excerpt: { 
      ar: 'اكتشف كل ما يخص موضوع إضافي وتقني عن comparisons رقم 23 وأهم التفاصيل التقنية.', 
      en: 'Discover everything about Additional tech topic about comparisons number 23 and the most important tech details.' 
    },
    body: fullBody,
    categoryId: 'comparisons' as Category,
    author: {
      name: { ar: 'سارة خالد', en: 'Sarah Khaled' },
      avatar: 'https://i.pravatar.cc/150?img=44'
    },
    date: '2024-05-14',
    readTime: 6,
    heroImage: 'https://picsum.photos/seed/article-283-additional-tech-topic-about-comparisons-number-23/800/450',
    tags: ['Tech', 'Comparisons', '2024'],
    isFeatured: false,
    isTrending: false
  },
  {
    id: '284',
    slug: 'article-284-additional-tech-topic-about-cybersecurity-number-24',
    title: { ar: 'موضوع إضافي وتقني عن cybersecurity رقم 24', en: 'Additional tech topic about cybersecurity number 24' },
    excerpt: { 
      ar: 'اكتشف كل ما يخص موضوع إضافي وتقني عن cybersecurity رقم 24 وأهم التفاصيل التقنية.', 
      en: 'Discover everything about Additional tech topic about cybersecurity number 24 and the most important tech details.' 
    },
    body: fullBody,
    categoryId: 'cybersecurity' as Category,
    author: {
      name: { ar: 'عمر طارق', en: 'Omar Tarek' },
      avatar: 'https://i.pravatar.cc/150?img=45'
    },
    date: '2024-05-17',
    readTime: 7,
    heroImage: 'https://picsum.photos/seed/article-284-additional-tech-topic-about-cybersecurity-number-24/800/450',
    tags: ['Tech', 'Cybersecurity', '2024'],
    isFeatured: false,
    isTrending: false
  },
  {
    id: '285',
    slug: 'article-285-additional-tech-topic-about-mobile-number-25',
    title: { ar: 'موضوع إضافي وتقني عن mobile رقم 25', en: 'Additional tech topic about mobile number 25' },
    excerpt: { 
      ar: 'اكتشف كل ما يخص موضوع إضافي وتقني عن mobile رقم 25 وأهم التفاصيل التقنية.', 
      en: 'Discover everything about Additional tech topic about mobile number 25 and the most important tech details.' 
    },
    body: fullBody,
    categoryId: 'mobile' as Category,
    author: {
      name: { ar: 'نور أحمد', en: 'Nour Ahmed' },
      avatar: 'https://i.pravatar.cc/150?img=46'
    },
    date: '2024-05-20',
    readTime: 8,
    heroImage: 'https://picsum.photos/seed/article-285-additional-tech-topic-about-mobile-number-25/800/450',
    tags: ['Tech', 'Mobile', '2024'],
    isFeatured: false,
    isTrending: false
  },
  {
    id: '286',
    slug: 'article-286-additional-tech-topic-about-laptops-number-26',
    title: { ar: 'موضوع إضافي وتقني عن laptops رقم 26', en: 'Additional tech topic about laptops number 26' },
    excerpt: { 
      ar: 'اكتشف كل ما يخص موضوع إضافي وتقني عن laptops رقم 26 وأهم التفاصيل التقنية.', 
      en: 'Discover everything about Additional tech topic about laptops number 26 and the most important tech details.' 
    },
    body: fullBody,
    categoryId: 'laptops' as Category,
    author: {
      name: { ar: 'كريم حسن', en: 'Karim Hassan' },
      avatar: 'https://i.pravatar.cc/150?img=47'
    },
    date: '2024-05-22',
    readTime: 9,
    heroImage: 'https://picsum.photos/seed/article-286-additional-tech-topic-about-laptops-number-26/800/450',
    tags: ['Tech', 'Laptops', '2024'],
    isFeatured: false,
    isTrending: false
  },
  {
    id: '287',
    slug: 'article-287-additional-tech-topic-about-howto-number-27',
    title: { ar: 'موضوع إضافي وتقني عن howto رقم 27', en: 'Additional tech topic about howto number 27' },
    excerpt: { 
      ar: 'اكتشف كل ما يخص موضوع إضافي وتقني عن howto رقم 27 وأهم التفاصيل التقنية.', 
      en: 'Discover everything about Additional tech topic about howto number 27 and the most important tech details.' 
    },
    body: fullBody,
    categoryId: 'howto' as Category,
    author: {
      name: { ar: 'ليلى سامي', en: 'Laila Sami' },
      avatar: 'https://i.pravatar.cc/150?img=48'
    },
    date: '2024-05-25',
    readTime: 10,
    heroImage: 'https://picsum.photos/seed/article-287-additional-tech-topic-about-howto-number-27/800/450',
    tags: ['Tech', 'Howto', '2024'],
    isFeatured: false,
    isTrending: false
  },
  {
    id: '288',
    slug: 'article-288-additional-tech-topic-about-ai-number-28',
    title: { ar: 'موضوع إضافي وتقني عن ai رقم 28', en: 'Additional tech topic about ai number 28' },
    excerpt: { 
      ar: 'اكتشف كل ما يخص موضوع إضافي وتقني عن ai رقم 28 وأهم التفاصيل التقنية.', 
      en: 'Discover everything about Additional tech topic about ai number 28 and the most important tech details.' 
    },
    body: fullBody,
    categoryId: 'ai' as Category,
    author: {
      name: { ar: 'خالد عبد الله', en: 'Khaled Abdallah' },
      avatar: 'https://i.pravatar.cc/150?img=49'
    },
    date: '2024-05-28',
    readTime: 11,
    heroImage: 'https://picsum.photos/seed/article-288-additional-tech-topic-about-ai-number-28/800/450',
    tags: ['Tech', 'Ai', '2024'],
    isFeatured: false,
    isTrending: false
  },
  {
    id: '289',
    slug: 'article-289-additional-tech-topic-about-reviews-number-29',
    title: { ar: 'موضوع إضافي وتقني عن reviews رقم 29', en: 'Additional tech topic about reviews number 29' },
    excerpt: { 
      ar: 'اكتشف كل ما يخص موضوع إضافي وتقني عن reviews رقم 29 وأهم التفاصيل التقنية.', 
      en: 'Discover everything about Additional tech topic about reviews number 29 and the most important tech details.' 
    },
    body: fullBody,
    categoryId: 'reviews' as Category,
    author: {
      name: { ar: 'أحمد محمود', en: 'Ahmed Mahmoud' },
      avatar: 'https://i.pravatar.cc/150?img=50'
    },
    date: '2024-05-30',
    readTime: 12,
    heroImage: 'https://picsum.photos/seed/article-289-additional-tech-topic-about-reviews-number-29/800/450',
    tags: ['Tech', 'Reviews', '2024'],
    isFeatured: false,
    isTrending: false
  },
  {
    id: '290',
    slug: 'article-290-additional-tech-topic-about-windows-number-30',
    title: { ar: 'موضوع إضافي وتقني عن windows رقم 30', en: 'Additional tech topic about windows number 30' },
    excerpt: { 
      ar: 'اكتشف كل ما يخص موضوع إضافي وتقني عن windows رقم 30 وأهم التفاصيل التقنية.', 
      en: 'Discover everything about Additional tech topic about windows number 30 and the most important tech details.' 
    },
    body: fullBody,
    categoryId: 'windows' as Category,
    author: {
      name: { ar: 'سارة خالد', en: 'Sarah Khaled' },
      avatar: 'https://i.pravatar.cc/150?img=51'
    },
    date: '2024-06-02',
    readTime: 3,
    heroImage: 'https://picsum.photos/seed/article-290-additional-tech-topic-about-windows-number-30/800/450',
    tags: ['Tech', 'Windows', '2024'],
    isFeatured: false,
    isTrending: false
  },
  {
    id: '291',
    slug: 'article-291-additional-tech-topic-about-comparisons-number-31',
    title: { ar: 'موضوع إضافي وتقني عن comparisons رقم 31', en: 'Additional tech topic about comparisons number 31' },
    excerpt: { 
      ar: 'اكتشف كل ما يخص موضوع إضافي وتقني عن comparisons رقم 31 وأهم التفاصيل التقنية.', 
      en: 'Discover everything about Additional tech topic about comparisons number 31 and the most important tech details.' 
    },
    body: fullBody,
    categoryId: 'comparisons' as Category,
    author: {
      name: { ar: 'عمر طارق', en: 'Omar Tarek' },
      avatar: 'https://i.pravatar.cc/150?img=52'
    },
    date: '2024-06-05',
    readTime: 4,
    heroImage: 'https://picsum.photos/seed/article-291-additional-tech-topic-about-comparisons-number-31/800/450',
    tags: ['Tech', 'Comparisons', '2024'],
    isFeatured: false,
    isTrending: false
  },
  {
    id: '292',
    slug: 'article-292-additional-tech-topic-about-cybersecurity-number-32',
    title: { ar: 'موضوع إضافي وتقني عن cybersecurity رقم 32', en: 'Additional tech topic about cybersecurity number 32' },
    excerpt: { 
      ar: 'اكتشف كل ما يخص موضوع إضافي وتقني عن cybersecurity رقم 32 وأهم التفاصيل التقنية.', 
      en: 'Discover everything about Additional tech topic about cybersecurity number 32 and the most important tech details.' 
    },
    body: fullBody,
    categoryId: 'cybersecurity' as Category,
    author: {
      name: { ar: 'نور أحمد', en: 'Nour Ahmed' },
      avatar: 'https://i.pravatar.cc/150?img=53'
    },
    date: '2024-06-08',
    readTime: 5,
    heroImage: 'https://picsum.photos/seed/article-292-additional-tech-topic-about-cybersecurity-number-32/800/450',
    tags: ['Tech', 'Cybersecurity', '2024'],
    isFeatured: false,
    isTrending: false
  },
  {
    id: '293',
    slug: 'article-293-additional-tech-topic-about-mobile-number-33',
    title: { ar: 'موضوع إضافي وتقني عن mobile رقم 33', en: 'Additional tech topic about mobile number 33' },
    excerpt: { 
      ar: 'اكتشف كل ما يخص موضوع إضافي وتقني عن mobile رقم 33 وأهم التفاصيل التقنية.', 
      en: 'Discover everything about Additional tech topic about mobile number 33 and the most important tech details.' 
    },
    body: fullBody,
    categoryId: 'mobile' as Category,
    author: {
      name: { ar: 'كريم حسن', en: 'Karim Hassan' },
      avatar: 'https://i.pravatar.cc/150?img=54'
    },
    date: '2024-06-10',
    readTime: 6,
    heroImage: 'https://picsum.photos/seed/article-293-additional-tech-topic-about-mobile-number-33/800/450',
    tags: ['Tech', 'Mobile', '2024'],
    isFeatured: false,
    isTrending: false
  },
  {
    id: '294',
    slug: 'article-294-additional-tech-topic-about-laptops-number-34',
    title: { ar: 'موضوع إضافي وتقني عن laptops رقم 34', en: 'Additional tech topic about laptops number 34' },
    excerpt: { 
      ar: 'اكتشف كل ما يخص موضوع إضافي وتقني عن laptops رقم 34 وأهم التفاصيل التقنية.', 
      en: 'Discover everything about Additional tech topic about laptops number 34 and the most important tech details.' 
    },
    body: fullBody,
    categoryId: 'laptops' as Category,
    author: {
      name: { ar: 'ليلى سامي', en: 'Laila Sami' },
      avatar: 'https://i.pravatar.cc/150?img=55'
    },
    date: '2024-06-13',
    readTime: 7,
    heroImage: 'https://picsum.photos/seed/article-294-additional-tech-topic-about-laptops-number-34/800/450',
    tags: ['Tech', 'Laptops', '2024'],
    isFeatured: false,
    isTrending: false
  },
  {
    id: '295',
    slug: 'article-295-additional-tech-topic-about-howto-number-35',
    title: { ar: 'موضوع إضافي وتقني عن howto رقم 35', en: 'Additional tech topic about howto number 35' },
    excerpt: { 
      ar: 'اكتشف كل ما يخص موضوع إضافي وتقني عن howto رقم 35 وأهم التفاصيل التقنية.', 
      en: 'Discover everything about Additional tech topic about howto number 35 and the most important tech details.' 
    },
    body: fullBody,
    categoryId: 'howto' as Category,
    author: {
      name: { ar: 'خالد عبد الله', en: 'Khaled Abdallah' },
      avatar: 'https://i.pravatar.cc/150?img=56'
    },
    date: '2024-06-16',
    readTime: 8,
    heroImage: 'https://picsum.photos/seed/article-295-additional-tech-topic-about-howto-number-35/800/450',
    tags: ['Tech', 'Howto', '2024'],
    isFeatured: false,
    isTrending: false
  },
  {
    id: '296',
    slug: 'article-296-additional-tech-topic-about-ai-number-36',
    title: { ar: 'موضوع إضافي وتقني عن ai رقم 36', en: 'Additional tech topic about ai number 36' },
    excerpt: { 
      ar: 'اكتشف كل ما يخص موضوع إضافي وتقني عن ai رقم 36 وأهم التفاصيل التقنية.', 
      en: 'Discover everything about Additional tech topic about ai number 36 and the most important tech details.' 
    },
    body: fullBody,
    categoryId: 'ai' as Category,
    author: {
      name: { ar: 'أحمد محمود', en: 'Ahmed Mahmoud' },
      avatar: 'https://i.pravatar.cc/150?img=57'
    },
    date: '2024-06-19',
    readTime: 9,
    heroImage: 'https://picsum.photos/seed/article-296-additional-tech-topic-about-ai-number-36/800/450',
    tags: ['Tech', 'Ai', '2024'],
    isFeatured: false,
    isTrending: false
  },
  {
    id: '297',
    slug: 'article-297-additional-tech-topic-about-reviews-number-37',
    title: { ar: 'موضوع إضافي وتقني عن reviews رقم 37', en: 'Additional tech topic about reviews number 37' },
    excerpt: { 
      ar: 'اكتشف كل ما يخص موضوع إضافي وتقني عن reviews رقم 37 وأهم التفاصيل التقنية.', 
      en: 'Discover everything about Additional tech topic about reviews number 37 and the most important tech details.' 
    },
    body: fullBody,
    categoryId: 'reviews' as Category,
    author: {
      name: { ar: 'سارة خالد', en: 'Sarah Khaled' },
      avatar: 'https://i.pravatar.cc/150?img=58'
    },
    date: '2024-06-21',
    readTime: 10,
    heroImage: 'https://picsum.photos/seed/article-297-additional-tech-topic-about-reviews-number-37/800/450',
    tags: ['Tech', 'Reviews', '2024'],
    isFeatured: false,
    isTrending: false
  },
  {
    id: '298',
    slug: 'article-298-additional-tech-topic-about-windows-number-38',
    title: { ar: 'موضوع إضافي وتقني عن windows رقم 38', en: 'Additional tech topic about windows number 38' },
    excerpt: { 
      ar: 'اكتشف كل ما يخص موضوع إضافي وتقني عن windows رقم 38 وأهم التفاصيل التقنية.', 
      en: 'Discover everything about Additional tech topic about windows number 38 and the most important tech details.' 
    },
    body: fullBody,
    categoryId: 'windows' as Category,
    author: {
      name: { ar: 'عمر طارق', en: 'Omar Tarek' },
      avatar: 'https://i.pravatar.cc/150?img=59'
    },
    date: '2024-06-24',
    readTime: 11,
    heroImage: 'https://picsum.photos/seed/article-298-additional-tech-topic-about-windows-number-38/800/450',
    tags: ['Tech', 'Windows', '2024'],
    isFeatured: false,
    isTrending: false
  },
  {
    id: '299',
    slug: 'article-299-additional-tech-topic-about-comparisons-number-39',
    title: { ar: 'موضوع إضافي وتقني عن comparisons رقم 39', en: 'Additional tech topic about comparisons number 39' },
    excerpt: { 
      ar: 'اكتشف كل ما يخص موضوع إضافي وتقني عن comparisons رقم 39 وأهم التفاصيل التقنية.', 
      en: 'Discover everything about Additional tech topic about comparisons number 39 and the most important tech details.' 
    },
    body: fullBody,
    categoryId: 'comparisons' as Category,
    author: {
      name: { ar: 'نور أحمد', en: 'Nour Ahmed' },
      avatar: 'https://i.pravatar.cc/150?img=60'
    },
    date: '2024-06-27',
    readTime: 12,
    heroImage: 'https://picsum.photos/seed/article-299-additional-tech-topic-about-comparisons-number-39/800/450',
    tags: ['Tech', 'Comparisons', '2024'],
    isFeatured: false,
    isTrending: false
  },
];
