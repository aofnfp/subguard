import React, { useState } from 'react';
import {
  View, Text, ScrollView, StyleSheet, TouchableOpacity,
  Alert, Modal, FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import {
  Palette, DollarSign, Crown, Shield, ChevronRight, X,
} from 'lucide-react-native';
import { useTheme } from '@/store/theme-context';
import { useSubscriptionStore } from '@/store/subscription-store';
import { usePremiumStore } from '@/store/premium-store';
import { CURRENCIES } from '@/types';
import Paywall from '@/components/Paywall';

export default function SettingsScreen() {
  const { colors, themes, currentTheme, applyTheme } = useTheme();
  const { currency, setCurrency } = useSubscriptionStore();
  const isPremium = usePremiumStore((s) => s.isPremium);
  const router = useRouter();

  const [showPaywall, setShowPaywall] = useState(false);
  const [showCurrency, setShowCurrency] = useState(false);

  const curr = CURRENCIES.find((c) => c.code === currency);

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={[styles.heading, { color: colors.textPrimary }]}>Settings</Text>

        {/* Premium */}
        {!isPremium && (
          <TouchableOpacity
            style={[styles.premiumBanner, { backgroundColor: colors.primary }]}
            onPress={() => setShowPaywall(true)}
          >
            <Crown size={22} color={colors.onPrimary} />
            <View style={{ flex: 1 }}>
              <Text style={[styles.premiumTitle, { color: colors.onPrimary }]}>
                Upgrade to Premium
              </Text>
              <Text style={[styles.premiumSub, { color: colors.onPrimary + 'CC' }]}>
                Unlimited subs, advanced analytics, no ads
              </Text>
            </View>
            <ChevronRight size={20} color={colors.onPrimary} />
          </TouchableOpacity>
        )}

        {/* Appearance */}
        <Text style={[styles.sectionLabel, { color: colors.textSecondary }]}>Appearance</Text>
        <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.outline }]}>
          {themes.map((t, i) => (
            <TouchableOpacity
              key={t.id}
              style={[
                styles.row,
                i < themes.length - 1 && { borderBottomWidth: 1, borderBottomColor: colors.outline },
              ]}
              onPress={() => applyTheme(t.id)}
            >
              <Palette size={20} color={t.colors.primary} />
              <Text style={[styles.rowText, { color: colors.textPrimary }]}>{t.name}</Text>
              {currentTheme.id === t.id && (
                <View style={[styles.activeDot, { backgroundColor: colors.primary }]} />
              )}
            </TouchableOpacity>
          ))}
        </View>

        {/* Currency */}
        <Text style={[styles.sectionLabel, { color: colors.textSecondary }]}>Preferences</Text>
        <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.outline }]}>
          <TouchableOpacity style={styles.row} onPress={() => setShowCurrency(true)}>
            <DollarSign size={20} color={colors.textSecondary} />
            <Text style={[styles.rowText, { color: colors.textPrimary }]}>Currency</Text>
            <Text style={[styles.rowValue, { color: colors.textSecondary }]}>
              {curr?.symbol} {currency}
            </Text>
            <ChevronRight size={18} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>

        {/* About */}
        <Text style={[styles.sectionLabel, { color: colors.textSecondary }]}>About</Text>
        <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.outline }]}>
          <TouchableOpacity style={styles.row} onPress={() => router.push('/privacy')}>
            <Shield size={20} color={colors.textSecondary} />
            <Text style={[styles.rowText, { color: colors.textPrimary }]}>Privacy Policy</Text>
            <ChevronRight size={18} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>

        <Text style={[styles.version, { color: colors.textSecondary }]}>
          SubGuard v1.0.0 · Privacy-first
        </Text>
      </ScrollView>

      {/* Currency picker */}
      <Modal visible={showCurrency} animationType="slide" transparent>
        <View style={[styles.modalOverlay, { backgroundColor: 'rgba(0,0,0,0.5)' }]}>
          <View style={[styles.modalSheet, { backgroundColor: colors.surface }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.textPrimary }]}>Select Currency</Text>
              <TouchableOpacity onPress={() => setShowCurrency(false)}>
                <X size={24} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>
            <FlatList
              data={CURRENCIES}
              keyExtractor={(c) => c.code}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.currencyRow,
                    currency === item.code && { backgroundColor: colors.primary + '12' },
                  ]}
                  onPress={() => {
                    setCurrency(item.code);
                    setShowCurrency(false);
                  }}
                >
                  <Text style={[styles.currencySymbol, { color: colors.textPrimary }]}>
                    {item.symbol}
                  </Text>
                  <Text style={[styles.currencyName, { color: colors.textPrimary }]}>
                    {item.name}
                  </Text>
                  <Text style={[styles.currencyCode, { color: colors.textSecondary }]}>
                    {item.code}
                  </Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>

      <Paywall visible={showPaywall} onClose={() => setShowPaywall(false)} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  scroll: { padding: 20, paddingBottom: 40 },
  heading: { fontSize: 28, fontWeight: '800', marginBottom: 20 },
  premiumBanner: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    padding: 16, borderRadius: 14, marginBottom: 24,
  },
  premiumTitle: { fontSize: 16, fontWeight: '700' },
  premiumSub: { fontSize: 13, marginTop: 2 },
  sectionLabel: { fontSize: 13, fontWeight: '600', marginBottom: 8, marginLeft: 4, textTransform: 'uppercase', letterSpacing: 0.5 },
  card: { borderRadius: 14, borderWidth: 1, marginBottom: 20, overflow: 'hidden' },
  row: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    paddingHorizontal: 16, paddingVertical: 14,
  },
  rowText: { fontSize: 15, fontWeight: '500', flex: 1 },
  rowValue: { fontSize: 14 },
  activeDot: { width: 8, height: 8, borderRadius: 4 },
  version: { fontSize: 13, textAlign: 'center', marginTop: 20 },
  modalOverlay: { flex: 1, justifyContent: 'flex-end' },
  modalSheet: { borderTopLeftRadius: 24, borderTopRightRadius: 24, maxHeight: '60%', paddingBottom: 30 },
  modalHeader: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    padding: 20, paddingBottom: 12,
  },
  modalTitle: { fontSize: 18, fontWeight: '700' },
  currencyRow: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    paddingHorizontal: 20, paddingVertical: 14,
  },
  currencySymbol: { fontSize: 18, fontWeight: '700', width: 32 },
  currencyName: { fontSize: 15, flex: 1 },
  currencyCode: { fontSize: 14 },
});
