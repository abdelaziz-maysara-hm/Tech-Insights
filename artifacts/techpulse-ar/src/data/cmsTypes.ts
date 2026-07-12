import { BilingualText } from './mockData';

export interface CmsVideo {
  id: string;
  title: BilingualText;
  description: BilingualText;
  youtubeId: string;
  date: string;
}

export interface CmsPage {
  id: string;
  slug: string;
  title: BilingualText;
  content: BilingualText;
  updatedAt: string;
  showInFooter?: boolean;
}
