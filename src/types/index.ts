// Using an object with 'as const' instead of enum to fix TS1294
export const RegistrationType = {
  PLAYER: 'PLAYER',
  COACH: 'COACH',
  VOLUNTEER: 'VOLUNTEER'
} as const;

// This creates a type from the object above
export type RegistrationType = typeof RegistrationType[keyof typeof RegistrationType];

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

export interface IDCardData {
  idNo: string;
  name: string;
  fathersName: string;
  dob: string;
  bloodGroup: string;
  phone: string;
  address: string;
  photoUrl: string;
  transactionId: string;
}