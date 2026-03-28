import AsyncStorage from '@react-native-async-storage/async-storage';
import { Subscription } from '@/types';

const KEYS = {
  subscriptions: 'subguard_subscriptions',
  themeId: 'subguard_theme_id',
  currency: 'subguard_currency',
  onboardingDone: 'subguard_onboarding_done',
};

export const storage = {
  async getSubscriptions(): Promise<Subscription[]> {
    const data = await AsyncStorage.getItem(KEYS.subscriptions);
    return data ? JSON.parse(data) : [];
  },

  async saveSubscriptions(subs: Subscription[]): Promise<void> {
    await AsyncStorage.setItem(KEYS.subscriptions, JSON.stringify(subs));
  },

  async getThemeId(): Promise<string | null> {
    return AsyncStorage.getItem(KEYS.themeId);
  },

  async saveThemeId(id: string): Promise<void> {
    await AsyncStorage.setItem(KEYS.themeId, id);
  },

  async getCurrency(): Promise<string> {
    const val = await AsyncStorage.getItem(KEYS.currency);
    return val || 'USD';
  },

  async saveCurrency(code: string): Promise<void> {
    await AsyncStorage.setItem(KEYS.currency, code);
  },

  async isOnboardingDone(): Promise<boolean> {
    const val = await AsyncStorage.getItem(KEYS.onboardingDone);
    return val === 'true';
  },

  async setOnboardingDone(): Promise<void> {
    await AsyncStorage.setItem(KEYS.onboardingDone, 'true');
  },
};
