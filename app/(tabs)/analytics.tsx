import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PieChart, TrendingUp } from 'lucide-react-native';
import { useTheme } from '@/store/theme-context';
import { useSubscriptionStore } from '@/store/subscription-store';
import { CATEGORIES, CURRENCIES } from '@/types';
import { toMonthlyAmount } from '@/lib/date';
import SpendingChart from '@/components/SpendingChart';
import AdBanner from '@/components/AdBanner';

const CATEGORY_COLORS = [
  '#0EA5E9', '#8B5CF6', '#F59E0B', '#10B981',
  '#EF4444', '#EC4899', '#6366F1', '#14B8A6', '#64748B',
];

type Tab = 'category' | 'cycle';

export default function AnalyticsScreen() {
  const { colors } = useTheme();
  const { subscriptions, currency, getByCategory, getMonthlyTotal, getAnnualTotal } =
    useSubscriptionStore();
  const [tab, setTab] = useState<Tab>('category');

  const curr = CURRENCIES.find((c) => c.code === currency);
  const symbol = curr?.symbol || currency;
  const monthly = getMonthlyTotal();
  const annual = getAnnualTotal();
  const byCategory = getByCategory();

  const categoryData = CATEGORIES.filter((c) => byCategory[c.key]).map((c, i) => ({
    key: c.key,
    label: c.label,
    monthly: byCategory[c.key].monthly,
    count: byCategory[c.key].count,
    color: CATEGORY_COLORS[i % CATEGORY_COLORS.length],
  }));

  // Spending by billing cycle
  const byCycle: Record<string, number> = {};
  for (const sub of subscriptions) {
    const m = toMonthlyAmount(sub.cost, sub.billingCycle);
    byCycle[sub.billingCycle] = (byCycle[sub.billingCycle] || 0) + m;
  }
  const cycleData = Object.entries(byCycle).map(([cycle, value], i) => ({
    label: cycle.charAt(0).toUpperCase() + cycle.slice(0, 5),
    value,
    color: CATEGORY_COLORS[i % CATEGORY_COLORS.length],
  }));

  const chartData =
    tab === 'category'
      ? categoryData.map((d) => ({ label: d.label.slice(0, 6), value: d.monthly, color: d.color }))
      : cycleData;

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={[styles.heading, { color: colors.textPrimary }]}>Analytics</Text>

        {subscriptions.length === 0 ? (
          <View style={styles.emptyState}>
            <PieChart size={48} color={colors.textSecondary} />
            <Text style={[styles.emptyTitle, { color: colors.textPrimary }]}>
              No analytics yet
            </Text>
            <Text style={[styles.emptySubtitle, { color: colors.textSecondary }]}>
              Add some subscriptions to see your spending insights
            </Text>
          </View>
        ) : (
          <>
            {/* Totals */}
            <View style={[styles.totalsCard, { backgroundColor: colors.surface, borderColor: colors.outline }]}>
              <View style={styles.totalRow}>
                <Text style={[styles.totalLabel, { color: colors.textSecondary }]}>Monthly total</Text>
                <Text style={[styles.totalValue, { color: colors.textPrimary }]}>
                  {symbol}{monthly.toFixed(2)}
                </Text>
              </View>
              <View style={[styles.divider, { backgroundColor: colors.outline }]} />
              <View style={styles.totalRow}>
                <Text style={[styles.totalLabel, { color: colors.textSecondary }]}>Annual total</Text>
                <Text style={[styles.totalValue, { color: colors.textPrimary }]}>
                  {symbol}{annual.toFixed(2)}
                </Text>
              </View>
              <View style={[styles.divider, { backgroundColor: colors.outline }]} />
              <View style={styles.totalRow}>
                <Text style={[styles.totalLabel, { color: colors.textSecondary }]}>Avg per sub</Text>
                <Text style={[styles.totalValue, { color: colors.textPrimary }]}>
                  {symbol}{(monthly / subscriptions.length).toFixed(2)}/mo
                </Text>
              </View>
            </View>

            {/* Tab toggle */}
            <View style={[styles.tabRow, { backgroundColor: colors.surface, borderColor: colors.outline }]}>
              {(['category', 'cycle'] as Tab[]).map((t) => (
                <TouchableOpacity
                  key={t}
                  style={[styles.tab, tab === t && { backgroundColor: colors.primary + '14' }]}
                  onPress={() => setTab(t)}
                >
                  <Text
                    style={[
                      styles.tabText,
                      { color: tab === t ? colors.primary : colors.textSecondary },
                    ]}
                  >
                    {t === 'category' ? 'By Category' : 'By Cycle'}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Chart */}
            <View style={[styles.chartCard, { backgroundColor: colors.surface, borderColor: colors.outline }]}>
              <SpendingChart data={chartData} height={150} />
            </View>

            {/* Category breakdown */}
            {tab === 'category' && (
              <View style={styles.breakdown}>
                {categoryData
                  .sort((a, b) => b.monthly - a.monthly)
                  .map((d) => (
                    <View
                      key={d.key}
                      style={[styles.breakdownRow, { backgroundColor: colors.surface, borderColor: colors.outline }]}
                    >
                      <View style={[styles.colorDot, { backgroundColor: d.color }]} />
                      <Text style={[styles.breakdownLabel, { color: colors.textPrimary }]}>
                        {d.label}
                      </Text>
                      <Text style={[styles.breakdownCount, { color: colors.textSecondary }]}>
                        {d.count} sub{d.count > 1 ? 's' : ''}
                      </Text>
                      <Text style={[styles.breakdownValue, { color: colors.textPrimary }]}>
                        {symbol}{d.monthly.toFixed(2)}/mo
                      </Text>
                    </View>
                  ))}
              </View>
            )}
          </>
        )}

        <AdBanner style={{ marginTop: 16 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  scroll: { padding: 20, paddingBottom: 40 },
  heading: { fontSize: 28, fontWeight: '800', marginBottom: 20 },
  emptyState: { alignItems: 'center', marginTop: 60, gap: 10 },
  emptyTitle: { fontSize: 18, fontWeight: '700' },
  emptySubtitle: { fontSize: 14, textAlign: 'center', maxWidth: 260 },
  totalsCard: { borderRadius: 14, borderWidth: 1, padding: 16, marginBottom: 16, gap: 12 },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  totalLabel: { fontSize: 14 },
  totalValue: { fontSize: 18, fontWeight: '700' },
  divider: { height: 1 },
  tabRow: {
    flexDirection: 'row', borderRadius: 12, borderWidth: 1,
    overflow: 'hidden', marginBottom: 16,
  },
  tab: { flex: 1, paddingVertical: 10, alignItems: 'center' },
  tabText: { fontSize: 14, fontWeight: '600' },
  chartCard: { borderRadius: 14, borderWidth: 1, padding: 16, marginBottom: 16 },
  breakdown: { gap: 8 },
  breakdownRow: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    padding: 14, borderRadius: 12, borderWidth: 1,
  },
  colorDot: { width: 10, height: 10, borderRadius: 5 },
  breakdownLabel: { fontSize: 15, fontWeight: '600', flex: 1 },
  breakdownCount: { fontSize: 13 },
  breakdownValue: { fontSize: 15, fontWeight: '700' },
});
