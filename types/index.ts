export type BillingCycle = 'weekly' | 'monthly' | 'quarterly' | 'annual';

export type Category =
  | 'entertainment'
  | 'productivity'
  | 'cloud_storage'
  | 'streaming'
  | 'gaming'
  | 'fitness'
  | 'news'
  | 'utilities'
  | 'other';

export interface Subscription {
  id: string;
  name: string;
  cost: number;
  currency: string;
  billingCycle: BillingCycle;
  category: Category;
  nextRenewalDate: string; // ISO date string
  reminderDays: number[]; // e.g. [1, 3, 7]
  color: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export interface ThemeColors {
  primary: string;
  onPrimary: string;
  secondary: string;
  onSecondary: string;
  background: string;
  surface: string;
  textPrimary: string;
  textSecondary: string;
  accent: string;
  success: string;
  warning: string;
  danger: string;
  outline: string;
}

export interface Theme {
  id: string;
  name: string;
  colors: ThemeColors;
}

export type SortField = 'name' | 'cost' | 'nextRenewalDate' | 'category';
export type SortOrder = 'asc' | 'desc';

export const CATEGORIES: { key: Category; label: string; icon: string }[] = [
  { key: 'entertainment', label: 'Entertainment', icon: 'tv' },
  { key: 'productivity', label: 'Productivity', icon: 'briefcase' },
  { key: 'cloud_storage', label: 'Cloud Storage', icon: 'cloud' },
  { key: 'streaming', label: 'Streaming', icon: 'play-circle' },
  { key: 'gaming', label: 'Gaming', icon: 'gamepad-2' },
  { key: 'fitness', label: 'Fitness', icon: 'dumbbell' },
  { key: 'news', label: 'News', icon: 'newspaper' },
  { key: 'utilities', label: 'Utilities', icon: 'wrench' },
  { key: 'other', label: 'Other', icon: 'circle-dot' },
];

export const BILLING_CYCLES: { key: BillingCycle; label: string; monthlyMultiplier: number }[] = [
  { key: 'weekly', label: 'Weekly', monthlyMultiplier: 4.33 },
  { key: 'monthly', label: 'Monthly', monthlyMultiplier: 1 },
  { key: 'quarterly', label: 'Quarterly', monthlyMultiplier: 1 / 3 },
  { key: 'annual', label: 'Annual', monthlyMultiplier: 1 / 12 },
];

export const CURRENCIES = [
  { code: 'USD', symbol: '$', name: 'US Dollar' },
  { code: 'EUR', symbol: '€', name: 'Euro' },
  { code: 'GBP', symbol: '£', name: 'British Pound' },
  { code: 'NGN', symbol: '₦', name: 'Nigerian Naira' },
  { code: 'CAD', symbol: 'CA$', name: 'Canadian Dollar' },
  { code: 'AUD', symbol: 'A$', name: 'Australian Dollar' },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen' },
  { code: 'INR', symbol: '₹', name: 'Indian Rupee' },
  { code: 'BRL', symbol: 'R$', name: 'Brazilian Real' },
  { code: 'ZAR', symbol: 'R', name: 'South African Rand' },
];
