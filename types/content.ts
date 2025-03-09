export interface ContentItem {
  id: string;
  title: {
    en: string;
    ko: string;
  };
  description: {
    en: string;
    ko: string;
  };
  imageUrl: string;
  videoUrl?: string;
  link: string;
  category: string;
  type: 'image' | 'video';
  date: string;
}
