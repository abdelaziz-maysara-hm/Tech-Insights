const fs = require('fs');

const baseTitles = [
    ['كيف تحمي حساباتك من الاختراق في 2024', 'How to protect your accounts from hacking in 2024', 'cybersecurity'],
    ['أفضل برامج مكافحة الفيروسات المجانية', 'Best free antivirus software', 'cybersecurity'],
    ['ما هو الـ VPN ولماذا تحتاجه', 'What is a VPN and why do you need it', 'cybersecurity'],
    ['كيف تكتشف إذا كان هاتفك مخترقاً', 'How to detect if your phone is hacked', 'cybersecurity'],
    ['حماية شبكة الواي فاي المنزلية', 'Securing your home WiFi network', 'cybersecurity'],
    ['أخطر 5 تهديدات إلكترونية في 2024', '5 most dangerous cyber threats in 2024', 'cybersecurity'],
    ['كيف تصنع كلمات مرور لا يمكن اختراقها', 'How to create unbreakable passwords', 'cybersecurity'],
    ['ما هو التصيد الإلكتروني وكيف تتجنبه', 'What is phishing and how to avoid it', 'cybersecurity'],
    ['هجمات الفدية: كيف تحمي ملفاتك', 'Ransomware attacks: How to protect your files', 'cybersecurity'],
    ['أمان الأجهزة الذكية في المنزل', 'Smart home device security', 'cybersecurity'],
    ['خطورة شبكات الواي فاي العامة', 'The danger of public WiFi networks', 'cybersecurity'],
    ['إعداد المصادقة الثنائية خطوة بخطوة', 'Setting up two-factor authentication step by step', 'cybersecurity'],
    ['أفضل مديري كلمات المرور', 'Best password managers', 'cybersecurity'],
    ['ما هو Dark Web وكيف يعمل', 'What is the Dark Web and how it works', 'cybersecurity'],
    ['حماية أطفالك على الإنترنت', 'Protecting your children online', 'cybersecurity'],
    ['كيف تتحقق من أمان أي موقع إلكتروني', 'How to verify the security of any website', 'cybersecurity'],
    ['أمن البيانات في التخزين السحابي', 'Data security in cloud storage', 'cybersecurity'],
    ['الهندسة الاجتماعية: أخطر أسلحة الهاكر', 'Social engineering: hacker\'s most dangerous weapon', 'cybersecurity'],
    ['كيف يسرق الهاكر بيانات بطاقتك البنكية', 'How hackers steal your credit card data', 'cybersecurity'],
    ['نصائح لأمان حسابات السوشيال ميديا', 'Social media account security tips', 'cybersecurity'],

    ['مراجعة iPhone 16 الكاملة', 'Full iPhone 16 review', 'mobile'],
    ['أفضل هواتف أندرويد في 2024', 'Best Android phones in 2024', 'mobile'],
    ['مراجعة Google Pixel 8 Pro', 'Google Pixel 8 Pro review', 'mobile'],
    ['مقارنة بين سامسونج وهواوي', 'Samsung vs Huawei comparison', 'mobile'],
    ['هاتف OnePlus 12 المفاجأة الجميلة', 'OnePlus 12 - the pleasant surprise', 'mobile'],
    ['مراجعة Xiaomi 14 Ultra', 'Xiaomi 14 Ultra review', 'mobile'],
    ['أفضل هواتف للتصوير في 2024', 'Best phones for photography in 2024', 'mobile'],
    ['هواتف تحت 300 دولار تستحق الشراء', 'Phones under $300 worth buying', 'mobile'],
    ['مقارنة كاميرات الهواتف الرئيسية', 'Comparing main smartphone cameras', 'mobile'],
    ['مراجعة Samsung Galaxy Z Fold 6', 'Samsung Galaxy Z Fold 6 review', 'mobile'],
    ['أفضل هاتف للألعاب في 2024', 'Best gaming phone in 2024', 'mobile'],
    ['تطور الهواتف القابلة للطي', 'Evolution of foldable phones', 'mobile'],
    ['مراجعة OPPO Find X7 Ultra', 'OPPO Find X7 Ultra review', 'mobile'],
    ['هاتف Sony Xperia 1 VI المميز', 'Sony Xperia 1 VI special review', 'mobile'],
    ['أسرار الاستفادة من كاميرا هاتفك', 'Secrets to getting the most from your phone camera', 'mobile'],
    ['كيف تطيل عمر بطارية هاتفك', 'How to extend your phone battery life', 'mobile'],
    ['تحديثات iOS 18 الجديدة', 'New iOS 18 updates', 'mobile'],
    ['مميزات Android 15 الكاملة', 'Full Android 15 features', 'mobile'],
    ['هل الهاتف المطوي يستحق سعره', 'Is a foldable phone worth its price', 'mobile'],
    ['أفضل إكسسوارات الهاتف في 2024', 'Best phone accessories in 2024', 'mobile'],

    ['مراجعة MacBook Pro M3 Max', 'MacBook Pro M3 Max review', 'laptops'],
    ['أفضل لابتوبات للمبرمجين', 'Best laptops for programmers', 'laptops'],
    ['مراجعة Dell XPS 15 2024', 'Dell XPS 15 2024 review', 'laptops'],
    ['لابتوب Lenovo ThinkPad X1 للأعمال', 'Lenovo ThinkPad X1 for business', 'laptops'],
    ['أفضل لابتوبات للطلاب بأسعار معقولة', 'Best affordable student laptops', 'laptops'],
    ['مراجعة ASUS ROG Zephyrus G14', 'ASUS ROG Zephyrus G14 review', 'laptops'],
    ['لابتوبات المبدعين والمصممين', 'Laptops for creators and designers', 'laptops'],
    ['مراجعة HP Spectre x360 14', 'HP Spectre x360 14 review', 'laptops'],
    ['لماذا يستحق Framework Laptop الشراء', 'Why the Framework Laptop is worth buying', 'laptops'],
    ['مقارنة لابتوبات الألعاب في 2024', 'Gaming laptops comparison 2024', 'laptops'],
    ['كيف تختار الرام المناسبة للابتوب', 'How to choose the right RAM for your laptop', 'laptops'],
    ['مراجعة Microsoft Surface Pro 10', 'Microsoft Surface Pro 10 review', 'laptops'],
    ['لابتوبات تحت 500 دولار تستحق', 'Laptops under $500 worth buying', 'laptops'],
    ['ترقية SSD في اللابتوب: الدليل الكامل', 'Upgrading laptop SSD: complete guide', 'laptops'],
    ['أفضل لابتوبات AMD Ryzen في 2024', 'Best AMD Ryzen laptops in 2024', 'laptops'],
    ['كيف تنظف لابتوبك من الداخل', 'How to clean your laptop internally', 'laptops'],
    ['مشاكل اللابتوب الشائعة وحلولها', 'Common laptop problems and solutions', 'laptops'],
    ['مقارنة Windows vs macOS للمستخدم العادي', 'Windows vs macOS for regular users', 'laptops'],
    ['أفضل حقائب ولوازم اللابتوب', 'Best laptop bags and accessories', 'laptops'],
    ['متى يجب تبديل اللابتوب القديم', 'When to replace an old laptop', 'laptops'],

    ['كيف تسترد الملفات المحذوفة', 'How to recover deleted files', 'howto'],
    ['حل مشكلة الكمبيوتر البطيء', 'Fix a slow computer', 'howto'],
    ['كيف تضبط الراوتر للحصول على إنترنت أسرع', 'How to configure router for faster internet', 'howto'],
    ['إصلاح شاشة اللابتوب الميتة', 'Fixing a dead laptop screen', 'howto'],
    ['كيف تنقل البيانات من هاتف قديم لجديد', 'How to transfer data from old to new phone', 'howto'],
    ['حل مشاكل الطابعة الشائعة', 'Fix common printer problems', 'howto'],
    ['كيف تحمي بياناتك بالنسخ الاحتياطي', 'How to protect data with backups', 'howto'],
    ['إصلاح مشاكل الصوت في الكمبيوتر', 'Fix computer audio problems', 'howto'],
    ['كيف تضغط الصور دون فقدان الجودة', 'How to compress images without quality loss', 'howto'],
    ['تسريع تحميل المواقع الإلكترونية', 'Speed up website loading', 'howto'],
    ['كيف تنشئ شبكة VPN منزلية', 'How to create a home VPN network', 'howto'],
    ['إصلاح ملفات النظام التالفة في ويندوز', 'Fix corrupted system files in Windows', 'howto'],
    ['كيف تحول ملفات PDF بسهولة', 'How to convert PDF files easily', 'howto'],
    ['نصائح لتنظيم ملفاتك الرقمية', 'Tips for organizing your digital files', 'howto'],
    ['كيف تجعل واتساب أكثر أماناً', 'How to make WhatsApp more secure', 'howto'],
    ['حل مشاكل اتصال الإنترنت', 'Fix internet connection problems', 'howto'],
    ['كيف تصنع صورة GIF من فيديو', 'How to create a GIF from video', 'howto'],
    ['تحسين دقة الكاميرا في أي هاتف', 'Improve camera quality on any phone', 'howto'],
    ['كيف تعطي أولوية لعبتك في الشبكة', 'How to prioritize your game on the network', 'howto'],
    ['تنظيف الكمبيوتر من البرامج الضارة', 'Cleaning computer from malware', 'howto'],

    ['كيف يمكن للذكاء الاصطناعي تغيير وظيفتك', 'How AI can change your job', 'ai'],
    ['أفضل أدوات الذكاء الاصطناعي للإنتاجية', 'Best AI productivity tools', 'ai'],
    ['تجربة Copilot في ويندوز 11', 'Testing Copilot in Windows 11', 'ai'],
    ['كيف تستخدم ChatGPT للعمل والدراسة', 'How to use ChatGPT for work and study', 'ai'],
    ['Midjourney: دليل إنشاء الصور بالذكاء الاصطناعي', 'Midjourney: AI image generation guide', 'ai'],
    ['مستقبل الذكاء الاصطناعي في الوطن العربي', 'Future of AI in the Arab world', 'ai'],
    ['مقارنة أقوى نماذج GPT-4 و Gemini Ultra', 'Comparing GPT-4 and Gemini Ultra', 'ai'],
    ['أدوات الذكاء الاصطناعي للتصميم الجرافيكي', 'AI tools for graphic design', 'ai'],
    ['كيف يعمل نموذج اللغة الكبير LLM', 'How large language models work', 'ai'],
    ['الذكاء الاصطناعي في الطب والرعاية الصحية', 'AI in medicine and healthcare', 'ai'],
    ['هل يمكن للذكاء الاصطناعي الإبداع حقاً', 'Can AI truly be creative', 'ai'],
    ['Stable Diffusion: دليل المبتدئين', 'Stable Diffusion beginner\'s guide', 'ai'],
    ['أخلاقيات الذكاء الاصطناعي ومخاطره', 'AI ethics and risks', 'ai'],
    ['كيف يساعد AI في تعلم اللغات', 'How AI helps in language learning', 'ai'],
    ['أدوات AI للكتابة والترجمة', 'AI tools for writing and translation', 'ai'],
    ['مستقبل رقائق الذكاء الاصطناعي', 'Future of AI chips', 'ai'],
    ['كيف تبني روبوت محادثة بسيط', 'How to build a simple chatbot', 'ai'],
    ['تأثير الذكاء الاصطناعي على الفن الرقمي', 'Impact of AI on digital art', 'ai'],
    ['هل الذكاء الاصطناعي سيستبدل المبرمجين', 'Will AI replace programmers', 'ai'],
    ['أدوات AI المجانية الأفضل في 2024', 'Best free AI tools in 2024', 'ai'],

    ['مراجعة Apple Watch Series 10', 'Apple Watch Series 10 review', 'reviews'],
    ['تقييم سماعات Sony WH-1000XM5', 'Sony WH-1000XM5 headphones review', 'reviews'],
    ['مراجعة iPad Pro M4', 'iPad Pro M4 review', 'reviews'],
    ['تقييم PlayStation 5 Slim بعد سنة', 'PlayStation 5 Slim review after one year', 'reviews'],
    ['مراجعة DJI Mini 4 Pro', 'DJI Mini 4 Pro review', 'reviews'],
    ['تقييم شاشة Samsung Odyssey G9', 'Samsung Odyssey G9 monitor review', 'reviews'],
    ['مراجعة حامل القلم Apple Pencil Pro', 'Apple Pencil Pro review', 'reviews'],
    ['تقييم ساعة Samsung Galaxy Watch 7', 'Samsung Galaxy Watch 7 review', 'reviews'],
    ['مراجعة سماعات AirPods Max 2', 'AirPods Max 2 review', 'reviews'],
    ['تقييم Logitech MX Master 3S', 'Logitech MX Master 3S review', 'reviews'],
    ['مراجعة شاشة LG UltraWide 34"', 'LG UltraWide 34" monitor review', 'reviews'],
    ['تقييم كاميرا Sony A7 V', 'Sony A7 V camera review', 'reviews'],
    ['مراجعة يد تحكم Xbox Series X الجديدة', 'New Xbox Series X controller review', 'reviews'],
    ['تقييم مكبر الصوت Sonos Era 300', 'Sonos Era 300 speaker review', 'reviews'],
    ['مراجعة كيبورد Keychron Q1 Pro', 'Keychron Q1 Pro keyboard review', 'reviews'],
    ['تقييم طابعة Bambu Lab X1 Carbon', 'Bambu Lab X1 Carbon 3D printer review', 'reviews'],
    ['مراجعة روبوت التنظيف Roomba j9+', 'Roomba j9+ robot vacuum review', 'reviews'],
    ['تقييم شاشة المراقبة Ring Doorbell Pro', 'Ring Doorbell Pro review', 'reviews'],
    ['مراجعة GoPro Hero 13 Black', 'GoPro Hero 13 Black review', 'reviews'],
    ['تقييم جهاز Stream Deck XL', 'Stream Deck XL review', 'reviews'],

    ['دليل شامل لويندوز 11 للمبتدئين', 'Complete Windows 11 guide for beginners', 'windows'],
    ['أفضل إعدادات ويندوز 11 للأداء', 'Best Windows 11 settings for performance', 'windows'],
    ['كيف تفعّل ميزات ويندوز 11 الخفية', 'How to activate hidden Windows 11 features', 'windows'],
    ['مشاكل ويندوز 11 وحلولها', 'Windows 11 problems and solutions', 'windows'],
    ['كيف تنظف ويندوز من الملفات غير الضرورية', 'How to clean Windows from unnecessary files', 'windows'],
    ['أفضل برامج ويندوز المجانية', 'Best free Windows software', 'windows'],
    ['كيف تضبط ويندوز للألعاب', 'How to optimize Windows for gaming', 'windows'],
    ['كيف تستعيد ويندوز بعد الأعطال', 'How to restore Windows after failures', 'windows'],
    ['ميزات Microsoft 365 التي لا تعرفها', 'Microsoft 365 features you don\'t know', 'windows'],
    ['كيف تشغل لينكس بجانب ويندوز', 'How to run Linux alongside Windows', 'windows'],
    ['تحسين أداء ويندوز على الأجهزة القديمة', 'Improving Windows performance on old devices', 'windows'],
    ['إدارة ذاكرة الوصول العشوائي في ويندوز', 'RAM management in Windows', 'windows'],
    ['مميزات WSL: لينكس داخل ويندوز', 'WSL features: Linux inside Windows', 'windows'],
    ['تأمين ويندوز ضد الاختراق', 'Securing Windows against hacking', 'windows'],
    ['كيف تنقل ويندوز لـ SSD جديد', 'How to migrate Windows to a new SSD', 'windows'],
    ['أدوات ويندوز المدمجة التي لا تستخدمها', 'Built-in Windows tools you\'re not using', 'windows'],
    ['كيف تعالج الشاشة الزرقاء BSOD', 'How to fix the blue screen BSOD', 'windows'],
    ['ويندوز 11 vs ويندوز 10 الفروق الكاملة', 'Windows 11 vs Windows 10 complete differences', 'windows'],
    ['كيف تفعّل الوضع الداكن في ويندوز', 'How to enable dark mode in Windows', 'windows'],
    ['تنظيم سطح مكتب ويندوز للإنتاجية', 'Organizing Windows desktop for productivity', 'windows'],

    ['مقارنة iPhone 15 Pro و Galaxy S24', 'iPhone 15 Pro vs Galaxy S24 comparison', 'comparisons'],
    ['أيهما تختار: MacBook Air أم Dell XPS 13', 'Which to choose: MacBook Air or Dell XPS 13', 'comparisons'],
    ['مقارنة PS5 و Xbox Series X في 2024', 'PS5 vs Xbox Series X comparison in 2024', 'comparisons'],
    ['صراع الساعات: Apple Watch 9 vs Galaxy Watch 6', 'Clash of watches: Apple Watch 9 vs Galaxy Watch 6', 'comparisons'],
    ['مقارنة الكاميرات: Sony A7 IV vs Canon R6', 'Camera comparison: Sony A7 IV vs Canon R6', 'comparisons'],
    ['أفضل نظام: iOS 17 vs Android 14', 'Best OS: iOS 17 vs Android 14', 'comparisons'],
    ['سماعات العزل: AirPods Pro 2 vs Sony WF-1000XM5', 'ANC earbuds: AirPods Pro 2 vs Sony WF-1000XM5', 'comparisons'],
    ['مقارنة المعالجات: Apple M3 vs Intel Core Ultra', 'Processors comparison: Apple M3 vs Intel Core Ultra', 'comparisons'],
    ['الأجهزة اللوحية: iPad Air vs Galaxy Tab S9', 'Tablets: iPad Air vs Galaxy Tab S9', 'comparisons'],
    ['منصات الألعاب المحمولة: Steam Deck vs ROG Ally', 'Handheld consoles: Steam Deck vs ROG Ally', 'comparisons'],
    ['مقارنة البطاقات الرسومية: RTX 4080 vs RX 7900 XTX', 'GPU comparison: RTX 4080 vs RX 7900 XTX', 'comparisons'],
    ['أي نظام سحابي تختار: Google Drive vs OneDrive', 'Which cloud: Google Drive vs OneDrive', 'comparisons'],
    ['منصات الذكاء الاصطناعي: ChatGPT Plus vs Claude Pro', 'AI platforms: ChatGPT Plus vs Claude Pro', 'comparisons'],
    ['مقارنة متصفحات الويب: Chrome vs Edge vs Brave', 'Web browsers: Chrome vs Edge vs Brave', 'comparisons'],
    ['برامج المونتاج: Premiere Pro vs Final Cut Pro', 'Video editors: Premiere Pro vs Final Cut Pro', 'comparisons'],
    ['أيهما أفضل للمنزل: Alexa vs Google Assistant', 'Best for home: Alexa vs Google Assistant', 'comparisons'],
    ['خدمات الموسيقى: Spotify vs Apple Music', 'Music services: Spotify vs Apple Music', 'comparisons'],
    ['أفضل واجهة تلفزيون: Apple TV 4K vs Chromecast', 'Best TV UI: Apple TV 4K vs Chromecast', 'comparisons'],
    ['برامج المحادثة الآمنة: Signal vs Telegram', 'Secure chat: Signal vs Telegram', 'comparisons'],
    ['مقارنة شاشات الألعاب: OLED vs Mini LED', 'Gaming monitors: OLED vs Mini LED', 'comparisons']
];

const cats = ['cybersecurity', 'mobile', 'laptops', 'howto', 'ai', 'reviews', 'windows', 'comparisons'];
const extraTitles = [];
for (let i = 0; i < 40; i++) {
    const cat = cats[i % 8];
    extraTitles.push([`موضوع إضافي وتقني عن ${cat} رقم ${i}`, `Additional tech topic about ${cat} number ${i}`, cat]);
}

const allTitles = [...baseTitles, ...extraTitles];

const youtubeVideoIds = ['TX9qSaGXFyg', 'jfKfPfyJRdk', 'DC9cFkSnKz8', '8aGhZQkoFbQ', 'CquRUrFT6Zk', 'ysEN5RaKOlA', 'UquP3gK1AuQ', 'hvjmvJPCNpA', 'zQnBQ4tB3ZA', 'BhCAgweSKs0', 'kKSCDOSk4lk', 'eIho2S0ZahI', '_Ql9cA5jF0I', 'jfKfPfyJRdk', 'TX9qSaGXFyg'];
const authorNamesAr = ['أحمد محمود', 'سارة خالد', 'عمر طارق', 'نور أحمد', 'كريم حسن', 'ليلى سامي', 'خالد عبد الله'];
const authorNamesEn = ['Ahmed Mahmoud', 'Sarah Khaled', 'Omar Tarek', 'Nour Ahmed', 'Karim Hassan', 'Laila Sami', 'Khaled Abdallah'];

let output = "import { Article } from './mockData';\nimport { fullBody, Category } from './mockData';\n\nexport const extendedArticles: Article[] = [\n";

for (let i = 0; i < allTitles.length; i++) {
    const t = allTitles[i];
    const aid = 100 + i;
    const slug = `article-${aid}-${t[1].toLowerCase().replace(/[^a-z0-9]/g, '-')}`;
    const cat = t[2];
    const arTitle = t[0].replace(/'/g, "\\'");
    const enTitle = t[1].replace(/'/g, "\\'");
    
    const hasVideo = (i % 10 < 4);
    const videoId = hasVideo ? youtubeVideoIds[i % youtubeVideoIds.length] : null;
    
    const readTime = 3 + (i % 10);
    
    const start = new Date(2023, 0, 1).getTime();
    const end = new Date(2024, 5, 30).getTime();
    const date_ts = start + (end - start) * (i / 200);
    const date_str = new Date(date_ts).toISOString().split('T')[0];
    
    const authorIdx = i % authorNamesAr.length;
    const authorAr = authorNamesAr[authorIdx];
    const authorEn = authorNamesEn[authorIdx];
    const avatar = `https://i.pravatar.cc/150?img=${(i % 70) + 1}`;
    
    const isFeatured = i % 30 === 0 ? "true" : "false";
    const isTrending = i % 25 === 0 ? "true" : "false";
    
    const videoStr = videoId ? `\n    youtubeVideoId: '${videoId}',` : "";
    
    output += `  {
    id: '${aid}',
    slug: '${slug}',
    title: { ar: '${arTitle}', en: '${enTitle}' },
    excerpt: { 
      ar: 'اكتشف كل ما يخص ${arTitle} وأهم التفاصيل التقنية.', 
      en: 'Discover everything about ${enTitle} and the most important tech details.' 
    },
    body: fullBody,
    categoryId: '${cat}' as Category,
    author: {
      name: { ar: '${authorAr}', en: '${authorEn}' },
      avatar: '${avatar}'
    },
    date: '${date_str}',
    readTime: ${readTime},
    heroImage: 'https://picsum.photos/seed/${slug}/800/450',
    tags: ['Tech', '${cat.charAt(0).toUpperCase() + cat.slice(1)}', '2024'],${videoStr}
    isFeatured: ${isFeatured},
    isTrending: ${isTrending}
  },
`;
}

output += "];\n";

fs.writeFileSync("artifacts/techpulse-ar/src/data/articlesData.ts", output, "utf-8");
