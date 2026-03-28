import React, { useState } from 'react';
import {
  View, Text, ScrollView, StyleSheet, TextInput,
  TouchableOpacity, RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Plus, Search, ArrowUpDown } from 'lucide-react-native';
import { useTheme } from '@/store/theme-context';
import { useSubscriptionStore } from '@/store/subscription-store';
import { usePremiumStore } from '@/store/premium-store';
import { SortField, SortOrder, CURRENCIES } from '@/types';
import SubscriptionCard from '@/components/SubscriptionCard';
import AdBanner from '@/components/AdBanner';
import Paywall from '@/components/Paywall';

const SORT_OPTIONS: { field: SortField; label: string }[] = [
  { field: 'nextRenewalDate', label: 'Renewal' },
  { field: 'cost', label: 'Cost' },
  { field: 'name', label: 'Name' },
  { field: 'category', label: 'Category' },
];

export default function SubscriptionsScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const {
    isLoading, load, searchQuery, setSearch,
    sortField, sortOrder, setSort, getFiltered, canAddFree,
  } = useSubscriptionStore();
  const isPremium = usePremiumStore((s) => s.isPremium);

  const [showPaywall, setShowPaywall] = useState(false);
  const filtered = getFiltered();

  const handleAdd = () => {
    if (!canAddFree(isPremium)) {
      setShowPaywall(true);
      return;
    }
    router.push('/edit');
  };

  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSort(field, sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSort(field, 'asc');
    }
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.heading, { color: colors.textPrimary }]}>Subscriptions</Text>
        <TouchableOpacity
          style={[styles.addBtn, { backgroundColor: colors.primary }]}
          onPress={handleAdd}
        >
          <Plus size={22} color={colors.onPrimary} />
        </TouchableOpacity>
      </View>

      {/* Search */}
      <View style={[styles.searchBox, { backgroundColor: colors.surface, borderColor: colors.outline }]}>
        <Search size={18} color={colors.textSecondary} />
        <TextInput
          style={[styles.searchInput, { color: colors.textPrimary }]}
          placeholder="Search subscriptions..."
          placeholderTextColor={colors.textSecondary}
          value={searchQuery}
          onChangeText={setSearch}
        />
      </View>

      {/* Sort chips */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.sortRow}>
        {SORT_OPTIONS.map((opt) => {
          const active = sortField === opt.field;
          return (
            <TouchableOpacity
              key={opt.field}
              style={[
                styles.sortChip,
                { borderColor: active ? colors.primary : colors.outline },
                active && { backgroundColor: colors.primary + '12' },
              ]}
              onPress={() => toggleSort(opt.field)}
            >
              <Text
                style={[
                  styles.sortChipText,
                  { color: active ? colors.primary : colors.textSecondary },
                ]}
              >
                {opt.label}
              </Text>
              {active && (
                <ArrowUpDown size={12} color={colors.primary} />
              )}
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      <ScrollView
        contentContainerStyle={styles.list}
        refreshControl={<RefreshControl refreshing={isLoading} onRefresh={load} />}
      >
        {filtered.length === 0 ? (
          <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
            {searchQuery ? 'No matches found' : 'No subscriptions yet. Tap + to add one.'}
          </Text>
        ) : (
          filtered.map((sub) => (
            <SubscriptionCard
              key={sub.id}
              subscription={sub}
              onPress={() => router.push(`/edit?id=${sub.id}`)}
            />
          ))
        )}

        <AdBanner style={{ marginTop: 12 }} />
      </ScrollView>

      <Paywall visible={showPaywall} onClose={() => setShowPaywall(false)} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 20, paddingTop: 12,
  },
  heading: { fontSize: 28, fontWeight: '800' },
  addBtn: {
    width: 40, height: 40, borderRadius: 12,
    alignItems: 'center', justifyContent: 'center',
  },
  searchBox: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    marginHorizontal: 20, marginTop: 16, paddingHorizontal: 14,
    paddingVertical: 10, borderRadius: 12, borderWidth: 1,
  },
  searchInput: { flex: 1, fontSize: 15, padding: 0 },
  sortRow: { paddingHorizontal: 20, marginTop: 12, maxHeight: 40 },
  sortChip: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    paddingHorizontal: 14, paddingVertical: 7, borderRadius: 20,
    borderWidth: 1, marginRight: 8,
  },
  sortChipText: { fontSize: 13, fontWeight: '600' },
  list: { padding: 20, gap: 8, paddingBottom: 40 },
  emptyText: { fontSize: 15, textAlign: 'center', marginTop: 40 },
});
