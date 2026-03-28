import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { ChevronRight } from 'lucide-react-native';
import { useTheme } from '@/store/theme-context';
import { Subscription, CATEGORIES, CURRENCIES } from '@/types';
import { formatDate, daysUntil, toMonthlyAmount } from '@/lib/date';
import CategoryIcon from './CategoryIcon';

interface SubscriptionCardProps {
  subscription: Subscription;
  onPress: () => void;
}

export default function SubscriptionCard({ subscription, onPress }: SubscriptionCardProps) {
  const { colors } = useTheme();
  const days = daysUntil(subscription.nextRenewalDate);
  const cat = CATEGORIES.find((c) => c.key === subscription.category);
  const curr = CURRENCIES.find((c) => c.code === subscription.currency);
  const symbol = curr?.symbol || subscription.currency;
  const monthly = toMonthlyAmount(subscription.cost, subscription.billingCycle);

  const urgencyColor =
    days < 0 ? colors.danger : days <= 3 ? colors.warning : days <= 7 ? colors.accent : colors.textSecondary;

  return (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.outline }]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={[styles.iconBox, { backgroundColor: subscription.color + '18' }]}>
        <CategoryIcon category={subscription.category} size={22} color={subscription.color} />
      </View>

      <View style={styles.info}>
        <Text style={[styles.name, { color: colors.textPrimary }]} numberOfLines={1}>
          {subscription.name}
        </Text>
        <Text style={[styles.meta, { color: colors.textSecondary }]}>
          {cat?.label} · {subscription.billingCycle}
        </Text>
      </View>

      <View style={styles.right}>
        <Text style={[styles.cost, { color: colors.textPrimary }]}>
          {symbol}{subscription.cost.toFixed(2)}
        </Text>
        <Text style={[styles.renewal, { color: urgencyColor }]}>
          {days < 0 ? 'Overdue' : days === 0 ? 'Today' : days === 1 ? 'Tomorrow' : `${days}d`}
        </Text>
      </View>

      <ChevronRight size={18} color={colors.textSecondary} style={{ marginLeft: 4 }} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    gap: 12,
  },
  iconBox: {
    width: 42,
    height: 42,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  info: { flex: 1, gap: 2 },
  name: { fontSize: 16, fontWeight: '600' },
  meta: { fontSize: 13 },
  right: { alignItems: 'flex-end', gap: 2 },
  cost: { fontSize: 16, fontWeight: '700' },
  renewal: { fontSize: 12, fontWeight: '500' },
});
