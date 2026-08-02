/** Deterministic hero/device images (no people avatars) */
const HERO = [
  'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&h=450&q=80',
  'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=800&h=450&q=80',
  'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&h=450&q=80',
  'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=800&h=450&q=80',
  'https://images.unsplash.com/photo-1629654297299-c458eeae83c2?auto=format&fit=crop&w=800&h=450&q=80',
  'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=800&h=450&q=80',
  'https://images.unsplash.com/photo-1555949963-aa79dcee981c?auto=format&fit=crop&w=800&h=450&q=80',
  'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=800&h=450&q=80',
];

const DEVICE = [
  'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=400&h=500&q=80',
  'https://images.unsplash.com/photo-1592890288564-76628a46a1ca?auto=format&fit=crop&w=400&h=500&q=80',
  'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=400&h=500&q=80',
  'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=400&h=500&q=80',
];

export function heroImage(index) {
  return HERO[index % HERO.length];
}

export function deviceImage(index, slot = 0) {
  return DEVICE[(index + slot) % DEVICE.length];
}
