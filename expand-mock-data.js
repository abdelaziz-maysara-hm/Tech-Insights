const fs = require('fs');

const dataPath = 'artifacts/techpulse-ar/src/data/mockData.ts';
let content = fs.readFileSync(dataPath, 'utf-8');

// Generate 12 more articles
let newArticles = '';
for (let i = 9; i <= 21; i++) {
  const categories = ['cybersecurity', 'mobile', 'laptops', 'howto', 'ai', 'reviews', 'windows'];
  const cat = categories[i % categories.length];
  newArticles += `
  {
    id: '${i}',
    slug: 'article-${i}-tech-news',
    title: {
      ar: 'مقال تقني جديد ${i} - تحديثات وأخبار',
      en: 'New Tech Article ${i} - Updates and News'
    },
    excerpt: {
      ar: 'نظرة سريعة على أحدث التطورات في عالم التقنية وتأثيرها على حياتنا اليومية.',
      en: 'A quick look at the latest developments in the tech world and their impact on our daily lives.'
    },
    body: fullBody,
    categoryId: '${cat}',
    author: {
      name: { ar: 'كاتب ضيف', en: 'Guest Writer' },
      avatar: 'https://i.pravatar.cc/150?img=${i + 10}'
    },
    date: '2024-04-${String((i % 28) + 1).padStart(2, '0')}',
    readTime: ${(i % 5) + 3},
    heroImage: 'https://picsum.photos/seed/art${i}/800/450',
    tags: ['Tech', 'News', 'Update']
  },`;
}

// Replace the end of the mockArticles array
content = content.replace('  }\n];', '  },' + newArticles + '\n];');

// Generate 3 more comparisons
let newComparisons = '';
for (let i = 3; i <= 6; i++) {
  newComparisons += `
  {
    id: 'c${i}',
    slug: 'comparison-${i}-devices',
    title: {
      ar: 'مقارنة شاملة ${i}: أيهما يستحق الشراء؟',
      en: 'Comprehensive Comparison ${i}: Which is worth buying?'
    },
    excerpt: {
      ar: 'مقارنة تفصيلية بين أحدث الأجهزة في السوق لتحديد الخيار الأفضل لك.',
      en: 'A detailed comparison between the latest devices in the market to determine the best choice.'
    },
    device1Name: 'Device A Pro',
    device2Name: 'Device B Ultra',
    device1Image: 'https://picsum.photos/seed/devA${i}/400/500',
    device2Image: 'https://picsum.photos/seed/devB${i}/400/500',
    date: '2024-04-${String(i + 10).padStart(2, '0')}',
    categoryId: 'comparisons',
    heroImage: 'https://picsum.photos/seed/vsc${i}/800/450',
    overallWinner: ${i % 2 === 0 ? 1 : 2},
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
  },`;
}

// Replace the end of the mockComparisons array
content = content.replace('  }\n];', '  },' + newComparisons + '\n];');

fs.writeFileSync(dataPath, content);
console.log('Mock data expanded.');
