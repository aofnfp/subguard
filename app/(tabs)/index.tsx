import React from 'react';
import { View, Text, ScrollView, StyleSheet, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { TrendingUp, TrendingDown, CalendarClock, AlertCircle } from 'lucide-react-native';
import { useTheme } from '@/store/theme-context';
import { useSubscriptionStore } from '@/store/subscription-store';
import { CURRENCIES, CATEGORIES } from '@/types';
import { daysUntil, formatDate, toMonthlyAmount } from '@/lib/date';
import SubscriptionCard from '@/components/SubscriptionCard';
import SpendingChart from '@/components/SpendingChart';

const CATEGORY_COLORS = [
  '#0EA5E9', '#8B5CF6', '#F59E0B', '#10B981',
  '#EF4444', '#EC4899', '#6366F1', '#14B8A6', '#64748B',
];

export default function Dashboard() {
  const { colors } = useTheme();
  const router = useRouter();
  const {
    subscriptions, currency, isLoading, load,
    getMonthlyTotal, getAnnualTotal, getUpcoming, getByCategory,
  } = useSubscriptionStore();

  const curr = CURRENCIES.find((c) => c.code === currency);
  const symbol = curr?.symbol || currency;
  const monthly = getMonthlyTotal();
  const annual = getAnnualTotal();
  const upcoming7 = getUpcoming(7);
  const upcoming30 = getUpcoming(30);
  const byCategory = getByCategory();

  const chartData = CATEGORIES.filter((c) => byCategory[c.key]).map((c, i) => ({
    label: c.label.slice(0, 6),
    value: byCategory[c.key].monthly,
    color: CATEGORY_COLORS[i % CATEGORY_COLORS.length],
  }));

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        refreshControl={<RefreshControl refreshing={isLoading} onRefresh={load} />}
      >
        <Text style={[styles.heading, { color: colors.textPrimary }]}>Dashboard</Text>

        {/* Spend Summary */}
        <View style={styles.summaryRow}>
          <View style={[styles.summaryCard, { backgroundColor: colors.surface, borderColor: colors.outline }]}>
            <View style={styles.summaryHeader}>
              <TrendingUp size={16} color={colors.accent} />
              <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>Monthly</Text>
            </View>
            <Text style={[styles.summaryValue, { color: colors.textPrimary }]}>
              {symbol}{monthly.toFixed(2)}
            </Text>
          </View>
          <View style={[styles.summaryCard, { backgroundColor: colors.surface, borderColor: colors.outline }]}>
            <View style={styles.summaryHeader}>
              <TrendingDown size={16} color={colors.primary} />
              <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>Annual</Text>
            </View>
            <Text style={[styles.summaryValue, { color: colors.textPrimary }]}>
              {symbol}{annual.toFixed(2)}
            </Text>
          </View>
        </View>

        {/* Subscriptions count */}
        <View style={[styles.countRow, { backgroundColor: colors.surface, borderColor: colors.outline }]}>
          <Text style={[styles.countLabel, { color: colors.textSecondary }]}>
            Active subscriptions
          </Text>
          <Text style={[styles.countValue, { color: colors.primary }]}>
            {subscriptions.length}
          </Text>
        </View>

        {/* Category Chart */}
        {chartData.length > 0 && (
          <View style={[styles.section, { backgroundColor: colors.surface, borderColor: colors.outline }]}>
            <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
              Spending by Category
            </Text>
            <SpendingChart data={chartData} height={130} />
          </View>
        )}

        {/* Upcoming 7 days */}
        <View style={styles.upcomingSection}>
          <View style={styles.sectionHeader}>
            <CalendarClock size={18} color={colors.accent} />
            <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
              Due in 7 days
            </Text>
            {upcoming7.length > 0 && (
              <Text style={[styles.badge, { color: colors.warning }]}>
                {upcoming7.length}
              </Text>
            )}
          </View>
          {upcoming7.length === 0 ? (
            <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
              No upcoming renewals
            </Text>
          ) : (
            <View style={styles.cardList}>
              {upcoming7.map((sub) => (
                <SubscriptionCard
                  key={sub.id}
                  subscription={sub}
                  onPress={() => router.push(`/edit?id=${sub.id}`)}
                />
              ))}
            </View>
          )}
        </View>

        {/* Empty state */}
        {subscriptions.length === 0 && (
          <View style={styles.emptyState}>
            <AlertCircle size={40} color={colors.textSecondary} />
            <Text style={[styles.emptyTitle, { color: colors.textPrimary }]}>
              No subscriptions yet
            </Text>
            <Text style={[styles.emptySubtitle, { color: colors.textSecondary }]}>
              Tap the + on the Subscriptions tab to add your first one
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  scroll: { padding: 20, paddingBottom: 40 },
  heading: { fontSize: 28, fontWeight: '800', marginBottom: 20 },
  summaryRow: { flexDirection: 'row', gap: 12, marginBottom: 12 },
  summaryCard: {
    flex: 1, padding: 16, borderRadius: 14, borderWidth: 1, gap: 8,
  },
  summaryHeader: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  summaryLabel: { fontSize: 13, fontWeight: '500' },
  summaryValue: { fontSize: 24, fontWeight: '800' },
  countRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    padding: 16, borderRadius: 14, borderWidth: 1, marginBottom: 16,
  },
  countLabel: { fontSize: 15 },
  countValue: { fontSize: 22, fontWeight: '800' },
  section: { padding: 16, borderRadius: 14, borderWidth: 1, marginBottom: 16, gap: 12 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  sectionTitle: { fontSize: 17, fontWeight: '700', flex: 1 },
  badge: { fontSize: 15, fontWeight: '700' },
  upcomingSection: { marginBottom: 16, gap: 10 },
  cardList: { gap: 8 },
  emptyText: { fontSize: 14, paddingLeft: 26 },
  emptyState: { alignItems: 'center', marginTop: 40, gap: 10 },
  emptyTitle: { fontSize: 18, fontWeight: '700' },
  emptySubtitle: { fontSize: 14, textAlign: 'center', maxWidth: 260 },
});
