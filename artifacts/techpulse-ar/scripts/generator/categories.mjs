/** Categories aligned with the live site */
export const ARTICLE_CATEGORIES = [
  'cybersecurity', 'mobile', 'laptops', 'howto', 'ai', 'reviews', 'windows', 'comparisons', 'technology',
];

export const VIDEO_TOPICS = [
  { topic: 'AI', categoryId: 'ai', subcategoryId: 'concepts' },
  { topic: 'Programming', categoryId: 'howto', subcategoryId: 'guides-tips' },
  { topic: 'Networking', categoryId: 'cybersecurity', subcategoryId: 'concepts' },
  { topic: 'Cybersecurity', categoryId: 'cybersecurity', subcategoryId: 'guides-tips' },
  { topic: 'Linux', categoryId: 'howto', subcategoryId: 'guides-tips' },
  { topic: 'Windows', categoryId: 'windows', subcategoryId: 'guides-tips' },
  { topic: 'Docker', categoryId: 'howto', subcategoryId: 'guides-tips' },
  { topic: 'Kubernetes', categoryId: 'howto', subcategoryId: 'guides-tips' },
  { topic: 'AWS', categoryId: 'technology', subcategoryId: 'concepts' },
  { topic: 'Azure', categoryId: 'technology', subcategoryId: 'concepts' },
  { topic: 'Cloud', categoryId: 'technology', subcategoryId: 'concepts' },
  { topic: 'Databases', categoryId: 'howto', subcategoryId: 'concepts' },
  { topic: 'Git', categoryId: 'howto', subcategoryId: 'guides-tips' },
  { topic: 'GitHub', categoryId: 'howto', subcategoryId: 'guides-tips' },
  { topic: 'React', categoryId: 'howto', subcategoryId: 'guides-tips' },
  { topic: 'Next.js', categoryId: 'howto', subcategoryId: 'guides-tips' },
  { topic: 'Node.js', categoryId: 'howto', subcategoryId: 'guides-tips' },
  { topic: 'Python', categoryId: 'howto', subcategoryId: 'guides-tips' },
  { topic: 'JavaScript', categoryId: 'howto', subcategoryId: 'guides-tips' },
  { topic: 'TypeScript', categoryId: 'howto', subcategoryId: 'guides-tips' },
];

/** Each pair is bound to the correct subcategory — never rotate randomly */
export const COMPARISON_CATALOG = [
  { d1: 'iPhone 16', d2: 'Galaxy S25', sub: 'phones', img1: 'phone', img2: 'phone' },
  { d1: 'Pixel 9', d2: 'Nothing Phone 3', sub: 'phones', img1: 'phone', img2: 'phone' },
  { d1: 'Android', d2: 'iPhone', sub: 'phones', img1: 'phone', img2: 'phone' },
  { d1: 'AirPods Pro 2', d2: 'Galaxy Buds 3', sub: 'phones', img1: 'audio', img2: 'audio' },
  { d1: 'MacBook Air M3', d2: 'Dell XPS 13', sub: 'laptops-pcs', img1: 'laptop', img2: 'laptop' },
  { d1: 'ThinkPad X1', d2: 'HP EliteBook', sub: 'laptops-pcs', img1: 'laptop', img2: 'laptop' },
  { d1: 'SSD NVMe', d2: 'HDD 7200RPM', sub: 'laptops-pcs', img1: 'storage', img2: 'storage' },
  { d1: 'Windows 11', d2: 'macOS Sequoia', sub: 'laptops-pcs', img1: 'laptop', img2: 'laptop' },
  { d1: 'Laptop', d2: 'Tablet', sub: 'laptops-pcs', img1: 'laptop', img2: 'tablet' },
  { d1: 'Ryzen 7 7800X3D', d2: 'Core i7-14700K', sub: 'laptops-pcs', img1: 'cpu', img2: 'cpu' },
  { d1: 'RTX 4070', d2: 'RX 7800 XT', sub: 'gaming-consoles', img1: 'gpu', img2: 'gpu' },
  { d1: 'PS5', d2: 'Xbox Series X', sub: 'gaming-consoles', img1: 'console', img2: 'console' },
  { d1: 'Steam Deck', d2: 'ROG Ally', sub: 'gaming-consoles', img1: 'console', img2: 'console' },
  { d1: 'Apple Watch 10', d2: 'Galaxy Watch 7', sub: 'wearables', img1: 'watch', img2: 'watch' },
  { d1: 'Fitbit Charge', d2: 'Xiaomi Band', sub: 'wearables', img1: 'watch', img2: 'watch' },
  { d1: 'ChatGPT', d2: 'Claude', sub: 'software-services', img1: 'ai', img2: 'ai' },
  { d1: 'GitHub Copilot', d2: 'Cursor', sub: 'software-services', img1: 'ai', img2: 'ai' },
  { d1: 'Chrome', d2: 'Firefox', sub: 'software-services', img1: 'browser', img2: 'browser' },
  { d1: 'Google Drive', d2: 'OneDrive', sub: 'software-services', img1: 'cloud', img2: 'cloud' },
  { d1: 'PostgreSQL', d2: 'MySQL', sub: 'software-services', img1: 'db', img2: 'db' },
  { d1: 'MongoDB', d2: 'PostgreSQL', sub: 'software-services', img1: 'db', img2: 'db' },
  { d1: 'AWS', d2: 'Azure', sub: 'software-services', img1: 'cloud', img2: 'cloud' },
  { d1: 'Vercel', d2: 'Netlify', sub: 'software-services', img1: 'cloud', img2: 'cloud' },
  { d1: 'Ubuntu', d2: 'Fedora', sub: 'software-services', img1: 'linux', img2: 'linux' },
  { d1: 'NordVPN', d2: 'Proton VPN', sub: 'software-services', img1: 'security', img2: 'security' },
  { d1: '1Password', d2: 'Bitwarden', sub: 'software-services', img1: 'security', img2: 'security' },
  { d1: 'Bitdefender', d2: 'Malwarebytes', sub: 'software-services', img1: 'security', img2: 'security' },
  { d1: 'VS Code', d2: 'JetBrains IDEs', sub: 'software-services', img1: 'dev', img2: 'dev' },
  { d1: 'Wi-Fi 6 Router', d2: 'Wi-Fi 5 Router', sub: 'general', img1: 'network', img2: 'network' },
  { d1: 'Power Bank 20000mAh', d2: 'Power Bank 10000mAh', sub: 'general', img1: 'power', img2: 'power' },
];

export const COMPARISON_SUBCATEGORIES = [
  'phones', 'laptops-pcs', 'software-services', 'gaming-consoles', 'wearables', 'general',
];
