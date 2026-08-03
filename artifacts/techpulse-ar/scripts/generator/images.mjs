/** Theme-based images (product-relevant, no people avatars) */
const THEMES = {
  phone: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=400&h=500&q=80',
  laptop: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=400&h=500&q=80',
  tablet: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=400&h=500&q=80',
  storage: 'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?auto=format&fit=crop&w=400&h=500&q=80',
  cpu: 'https://images.unsplash.com/photo-1555617981-b634f1e85990?auto=format&fit=crop&w=400&h=500&q=80',
  gpu: 'https://images.unsplash.com/photo-1591488320449-011701bb6704?auto=format&fit=crop&w=400&h=500&q=80',
  console: 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?auto=format&fit=crop&w=400&h=500&q=80',
  watch: 'https://images.unsplash.com/photo-1434493789847-2f02dc269ee6?auto=format&fit=crop&w=400&h=500&q=80',
  audio: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=400&h=500&q=80',
  ai: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=400&h=500&q=80',
  browser: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=400&h=500&q=80',
  cloud: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a2?auto=format&fit=crop&w=400&h=500&q=80',
  db: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?auto=format&fit=crop&w=400&h=500&q=80',
  linux: 'https://images.unsplash.com/photo-1629654297299-c458eeae83c2?auto=format&fit=crop&w=400&h=500&q=80',
  security: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=400&h=500&q=80',
  dev: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?auto=format&fit=crop&w=400&h=500&q=80',
  network: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=400&h=500&q=80',
  power: 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?auto=format&fit=crop&w=400&h=500&q=80',
  tech: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&h=450&q=80',
};

// A same-category comparison (the common case: two phones, two laptops, two
// apps...) previously showed the SAME photo for both sides, since THEMES only
// has one image per theme. This is a fallback pairing so device1/device2
// always render two genuinely different, already-verified images even when
// they share a theme. Not a substitute for real per-product photography --
// see the note in comparisons.mjs -- but it stops comparisons from visibly
// showing an identical image for two different products, which is worse.
const FALLBACK_PARTNER = {
  phone: 'tablet', tablet: 'phone', laptop: 'cpu', cpu: 'laptop', gpu: 'cpu',
  console: 'audio', watch: 'audio', audio: 'watch', ai: 'dev', browser: 'cloud',
  cloud: 'browser', db: 'storage', storage: 'db', linux: 'dev', security: 'network',
  dev: 'ai', network: 'security', power: 'cpu', tech: 'dev',
};

export function themeImage(theme) {
  return THEMES[theme] || THEMES.tech;
}

const HERO_BY_SUB = {
  phones: THEMES.phone.replace('w=400&h=500', 'w=800&h=450'),
  'laptops-pcs': THEMES.laptop.replace('w=400&h=500', 'w=800&h=450'),
  'software-services': THEMES.dev.replace('w=400&h=500', 'w=800&h=450'),
  'gaming-consoles': THEMES.console.replace('w=400&h=500', 'w=800&h=450'),
  wearables: THEMES.watch.replace('w=400&h=500', 'w=800&h=450'),
  general: THEMES.tech,
};

/**
 * Like themeImage, but guarantees a different photo than `otherTheme` --
 * use this for the second item in any side-by-side comparison.
 */
export function themeImagePaired(theme, otherTheme) {
  if (theme !== otherTheme) return themeImage(theme);
  const partner = FALLBACK_PARTNER[theme] ?? 'tech';
  return themeImage(partner);
}

export function heroForSub(sub) {
  return HERO_BY_SUB[sub] || THEMES.tech;
}

export function heroImage(index) {
  const keys = Object.keys(HERO_BY_SUB);
  return HERO_BY_SUB[keys[index % keys.length]];
}

export function deviceImage(index, slot = 0) {
  const theme = slot === 0 ? 'phone' : 'laptop';
  const otherTheme = slot === 0 ? 'laptop' : 'phone';
  return themeImagePaired(theme, otherTheme);
}
