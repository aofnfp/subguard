import { create } from 'zustand';
import { Subscription, SortField, SortOrder, Category, BillingCycle } from '@/types';
import { storage } from '@/lib/storage';
import { toMonthlyAmount, daysUntil } from '@/lib/date';
import { rescheduleAllReminders } from '@/lib/notifications';

const FREE_LIMIT = 15;

interface SubscriptionStore {
  subscriptions: Subscription[];
  currency: string;
  searchQuery: string;
  sortField: SortField;
  sortOrder: SortOrder;
  isLoading: boolean;

  // Actions
  load: () => Promise<void>;
  add: (sub: Omit<Subscription, 'id' | 'createdAt' | 'updatedAt'>) => Promise<boolean>;
  update: (id: string, data: Partial<Subscription>) => Promise<void>;
  remove: (id: string) => Promise<void>;
  setCurrency: (code: string) => Promise<void>;
  setSearch: (q: string) => void;
  setSort: (field: SortField, order: SortOrder) => void;

  // Computed
  canAddFree: (isPremium: boolean) => boolean;
  getMonthlyTotal: () => number;
  getAnnualTotal: () => number;
  getUpcoming: (days: number) => Subscription[];
  getByCategory: () => Record<string, { count: number; monthly: number }>;
  getFiltered: () => Subscription[];
}

export const useSubscriptionStore = create<SubscriptionStore>((set, get) => ({
  subscriptions: [],
  currency: 'USD',
  searchQuery: '',
  sortField: 'nextRenewalDate',
  sortOrder: 'asc',
  isLoading: false,

  load: async () => {
    set({ isLoading: true });
    const [subscriptions, currency] = await Promise.all([
      storage.getSubscriptions(),
      storage.getCurrency(),
    ]);
    set({ subscriptions, currency, isLoading: false });
  },

  add: async (data) => {
    const subs = get().subscriptions;
    const now = new Date().toISOString();
    const newSub: Subscription = {
      ...data,
      id: `sub_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      createdAt: now,
      updatedAt: now,
    };
    const updated = [...subs, newSub];
    set({ subscriptions: updated });
    await storage.saveSubscriptions(updated);
    await rescheduleAllReminders(updated);
    return true;
  },

  update: async (id, data) => {
    const updated = get().subscriptions.map((s) =>
      s.id === id ? { ...s, ...data, updatedAt: new Date().toISOString() } : s,
    );
    set({ subscriptions: updated });
    await storage.saveSubscriptions(updated);
    await rescheduleAllReminders(updated);
  },

  remove: async (id) => {
    const updated = get().subscriptions.filter((s) => s.id !== id);
    set({ subscriptions: updated });
    await storage.saveSubscriptions(updated);
    await rescheduleAllReminders(updated);
  },

  setCurrency: async (code) => {
    set({ currency: code });
    await storage.saveCurrency(code);
  },

  setSearch: (q) => set({ searchQuery: q }),

  setSort: (field, order) => set({ sortField: field, sortOrder: order }),

  canAddFree: (isPremium) => {
    if (isPremium) return true;
    return get().subscriptions.length < FREE_LIMIT;
  },

  getMonthlyTotal: () => {
    return get().subscriptions.reduce(
      (sum, s) => sum + toMonthlyAmount(s.cost, s.billingCycle),
      0,
    );
  },

  getAnnualTotal: () => {
    return get().getMonthlyTotal() * 12;
  },

  getUpcoming: (days) => {
    return get()
      .subscriptions.filter((s) => {
        const d = daysUntil(s.nextRenewalDate);
        return d >= 0 && d <= days;
      })
      .sort((a, b) => new Date(a.nextRenewalDate).getTime() - new Date(b.nextRenewalDate).getTime());
  },

  getByCategory: () => {
    const result: Record<string, { count: number; monthly: number }> = {};
    for (const sub of get().subscriptions) {
      if (!result[sub.category]) {
        result[sub.category] = { count: 0, monthly: 0 };
      }
      result[sub.category].count++;
      result[sub.category].monthly += toMonthlyAmount(sub.cost, sub.billingCycle);
    }
    return result;
  },

  getFiltered: () => {
    const { subscriptions, searchQuery, sortField, sortOrder } = get();
    let filtered = [...subscriptions];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          s.category.toLowerCase().includes(q),
      );
    }

    filtered.sort((a, b) => {
      let cmp = 0;
      switch (sortField) {
        case 'name':
          cmp = a.name.localeCompare(b.name);
          break;
        case 'cost':
          cmp = toMonthlyAmount(a.cost, a.billingCycle) - toMonthlyAmount(b.cost, b.billingCycle);
          break;
        case 'nextRenewalDate':
          cmp = new Date(a.nextRenewalDate).getTime() - new Date(b.nextRenewalDate).getTime();
          break;
        case 'category':
          cmp = a.category.localeCompare(b.category);
          break;
      }
      return sortOrder === 'asc' ? cmp : -cmp;
    });

    return filtered;
  },
}));
