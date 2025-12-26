export enum RegistrationType {
  PLAYER = 'PLAYER',
  COACH = 'COACH',
  VOLUNTEER = 'VOLUNTEER'
}

export interface NewsArticle {
  title: string;
  category: string;
  content: string;
  date: string;
}

export interface GalleryItem {
  id: number;
  url: string;
  title: string;
  category: string;
}