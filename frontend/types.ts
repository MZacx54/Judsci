
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
  type: 'Annual Report' | 'Newsletter' | 'Other';
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
  ABOUT = 'about'
}

export interface Booking {
  id: number;
  name: string;
  email: string;
  phone: string;
  date: string;
  time: string;
  reason: string;
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED';
  created_at: string;
}

export interface Donation {
  id: number;
  amount: string; // DecimalField comes as string or number depending on serializer
  email: string;
  donor_name: string;
  reference: string;
  project_category: string;
  status: 'PENDING' | 'SUCCESS' | 'FAILED';
  created_at: string;
}
