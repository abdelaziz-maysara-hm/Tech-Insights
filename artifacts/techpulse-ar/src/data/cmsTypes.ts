import { BilingualText, TranslationStatus } from './mockData';

export interface CmsVideo {
  id: string;
  title: BilingualText;
  description: BilingualText;
  youtubeId: string;
  youtubePlaylistId?: string;
  heroImage?: string;
  date: string;
  categoryId?: string;
  subcategoryId?: string;
}

export interface CmsPage {
  id: string;
  slug: string;
  title: BilingualText;
  content: BilingualText;
  updatedAt: string;
  showInFooter?: boolean;
  translationStatus?: TranslationStatus;
}
