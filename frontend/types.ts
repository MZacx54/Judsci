
export interface Program {
  id: string;
  title: string;
  slug: string;
  description: string;
  icon: string;
  color: string;
  image?: string;
}

export interface ImpactStat {
  label: string;
  value: number;
  suffix: string;
}

export interface Resource {
  id: string; // Django ID
  title: string;
  type: 'Annual Report' | 'Newsletter' | 'Legal Aid' | 'Other';
  date: string;
  file: string; // URL to PDF
  cover_image?: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  summary: string;
  body: string;
  category: string;
  author: string;
  published_date: string;
  image?: string;
}

export enum AppSection {
  HOME = 'home',
  PROGRAMS = 'programs',
  BOOKINGS = 'bookings',
  DONATIONS = 'donations',
  RESOURCES = 'resources',
  NEWS = 'news',
  NEWS_DETAIL = 'news_detail',
  ABOUT = 'about',
  ADMIN = 'admin'
}
