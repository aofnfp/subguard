import React, { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ThemeProvider, useTheme } from '@/store/theme-context';
import { useSubscriptionStore } from '@/store/subscription-store';
import { usePremiumStore } from '@/store/premium-store';
import { initPurchases } from '@/lib/purchases';
import { preloadInterstitial } from '@/lib/ads';
import { requestNotificationPermissions } from '@/lib/notifications';

function AppInit() {
  const load = useSubscriptionStore((s) => s.load);
  const { loadStatus, startListening } = usePremiumStore();

  useEffect(() => {
    load();
    initPurchases().then(() => {
      loadStatus();
      startListening();
    });
    preloadInterstitial();
    requestNotificationPermissions();
  }, []);

  return null;
}

function InnerLayout() {
  const { colors } = useTheme();
  const isDark = colors.background === '#0F172A';

  return (
    <>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <AppInit />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.background },
        }}
      />
    </>
  );
}

export default function RootLayout() {
  return (
    <ThemeProvider>
      <InnerLayout />
    </ThemeProvider>
  );
}
