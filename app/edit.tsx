import React, { useState, useEffect } from 'react';
import {
  View, Text, ScrollView, StyleSheet, TextInput,
  TouchableOpacity, Alert, Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, Trash2, Check } from 'lucide-react-native';
import { useTheme } from '@/store/theme-context';
import { useSubscriptionStore } from '@/store/subscription-store';
import {
  Subscription, Category, BillingCycle,
  CATEGORIES, BILLING_CYCLES, CURRENCIES,
} from '@/types';
import CategoryIcon from '@/components/CategoryIcon';

const COLORS = [
  '#0EA5E9', '#8B5CF6', '#F59E0B', '#10B981', '#EF4444',
  '#EC4899', '#6366F1', '#14B8A6', '#F97316', '#64748B',
];

const DEFAULT_REMINDER_DAYS = [1, 3, 7];

export default function EditScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const params = useLocalSearchParams<{ id?: string }>();
  const { subscriptions, currency, add, update, remove } = useSubscriptionStore();

  const existing = params.id ? subscriptions.find((s) => s.id === params.id) : null;
  const isEditing = !!existing;

  const [name, setName] = useState(existing?.name || '');
  const [cost, setCost] = useState(existing ? existing.cost.toString() : '');
  const [billingCycle, setBillingCycle] = useState<BillingCycle>(existing?.billingCycle || 'monthly');
  const [category, setCategory] = useState<Category>(existing?.category || 'other');
  const [nextRenewalDate, setNextRenewalDate] = useState(
    existing?.nextRenewalDate || new Date().toISOString().split('T')[0],
  );
  const [color, setColor] = useState(existing?.color || COLORS[0]);
  const [notes, setNotes] = useState(existing?.notes || '');
  const [reminderDays] = useState(existing?.reminderDays || DEFAULT_REMINDER_DAYS);

  const curr = CURRENCIES.find((c) => c.code === currency);
  const symbol = curr?.symbol || currency;

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert('Missing name', 'Please enter a subscription name.');
      return;
    }
    const parsedCost = parseFloat(cost);
    if (isNaN(parsedCost) || parsedCost <= 0) {
      Alert.alert('Invalid cost', 'Please enter a valid amount.');
      return;
    }

    if (isEditing && existing) {
      await update(existing.id, {
        name: name.trim(),
        cost: parsedCost,
        billingCycle,
        category,
        nextRenewalDate,
        color,
        notes: notes.trim(),
        reminderDays,
        currency,
      });
    } else {
      await add({
        name: name.trim(),
        cost: parsedCost,
        currency,
        billingCycle,
        category,
        nextRenewalDate,
        color,
        notes: notes.trim(),
        reminderDays,
      });
    }
    router.back();
  };

  const handleDelete = () => {
    if (!existing) return;
    Alert.alert(
      'Delete Subscription',
      `Are you sure you want to delete "${existing.name}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            await remove(existing.id);
            router.back();
          },
        },
      ],
    );
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <ArrowLeft size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>
          {isEditing ? 'Edit' : 'Add'} Subscription
        </Text>
        <TouchableOpacity onPress={handleSave} style={[styles.saveBtn, { backgroundColor: colors.primary }]}>
          <Check size={20} color={colors.onPrimary} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.form}>
        {/* Name */}
        <Text style={[styles.label, { color: colors.textSecondary }]}>Name</Text>
        <TextInput
          style={[styles.input, { color: colors.textPrimary, backgroundColor: colors.surface, borderColor: colors.outline }]}
          placeholder="e.g. Netflix, Spotify"
          placeholderTextColor={colors.textSecondary}
          value={name}
          onChangeText={setName}
        />

        {/* Cost */}
        <Text style={[styles.label, { color: colors.textSecondary }]}>Cost ({symbol})</Text>
        <TextInput
          style={[styles.input, { color: colors.textPrimary, backgroundColor: colors.surface, borderColor: colors.outline }]}
          placeholder="9.99"
          placeholderTextColor={colors.textSecondary}
          value={cost}
          onChangeText={setCost}
          keyboardType="decimal-pad"
        />

        {/* Billing Cycle */}
        <Text style={[styles.label, { color: colors.textSecondary }]}>Billing Cycle</Text>
        <View style={styles.chipRow}>
          {BILLING_CYCLES.map((bc) => (
            <TouchableOpacity
              key={bc.key}
              style={[
                styles.chip,
                { borderColor: billingCycle === bc.key ? colors.primary : colors.outline },
                billingCycle === bc.key && { backgroundColor: colors.primary + '14' },
              ]}
              onPress={() => setBillingCycle(bc.key)}
            >
              <Text
                style={[
                  styles.chipText,
                  { color: billingCycle === bc.key ? colors.primary : colors.textSecondary },
                ]}
              >
                {bc.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Category */}
        <Text style={[styles.label, { color: colors.textSecondary }]}>Category</Text>
        <View style={styles.categoryGrid}>
          {CATEGORIES.map((cat) => (
            <TouchableOpacity
              key={cat.key}
              style={[
                styles.categoryItem,
                { borderColor: category === cat.key ? colors.primary : colors.outline },
                category === cat.key && { backgroundColor: colors.primary + '14' },
              ]}
              onPress={() => setCategory(cat.key)}
            >
              <CategoryIcon
                category={cat.key}
                size={18}
                color={category === cat.key ? colors.primary : colors.textSecondary}
              />
              <Text
                style={[
                  styles.categoryText,
                  { color: category === cat.key ? colors.primary : colors.textSecondary },
                ]}
                numberOfLines={1}
              >
                {cat.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Next Renewal Date */}
        <Text style={[styles.label, { color: colors.textSecondary }]}>Next Renewal Date</Text>
        <TextInput
          style={[styles.input, { color: colors.textPrimary, backgroundColor: colors.surface, borderColor: colors.outline }]}
          placeholder="YYYY-MM-DD"
          placeholderTextColor={colors.textSecondary}
          value={nextRenewalDate}
          onChangeText={setNextRenewalDate}
        />

        {/* Color */}
        <Text style={[styles.label, { color: colors.textSecondary }]}>Color</Text>
        <View style={styles.colorRow}>
          {COLORS.map((c) => (
            <TouchableOpacity
              key={c}
              style={[
                styles.colorDot,
                { backgroundColor: c },
                color === c && styles.colorDotActive,
              ]}
              onPress={() => setColor(c)}
            />
          ))}
        </View>

        {/* Notes */}
        <Text style={[styles.label, { color: colors.textSecondary }]}>Notes (optional)</Text>
        <TextInput
          style={[
            styles.input, styles.textArea,
            { color: colors.textPrimary, backgroundColor: colors.surface, borderColor: colors.outline },
          ]}
          placeholder="Any notes about this subscription..."
          placeholderTextColor={colors.textSecondary}
          value={notes}
          onChangeText={setNotes}
          multiline
          numberOfLines={3}
        />

        {/* Delete button */}
        {isEditing && (
          <TouchableOpacity style={[styles.deleteBtn, { borderColor: colors.danger }]} onPress={handleDelete}>
            <Trash2 size={18} color={colors.danger} />
            <Text style={[styles.deleteBtnText, { color: colors.danger }]}>Delete Subscription</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  header: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    paddingHorizontal: 16, paddingVertical: 12,
  },
  backBtn: { padding: 4 },
  headerTitle: { fontSize: 18, fontWeight: '700', flex: 1 },
  saveBtn: {
    width: 38, height: 38, borderRadius: 10,
    alignItems: 'center', justifyContent: 'center',
  },
  form: { padding: 20, paddingBottom: 40, gap: 4 },
  label: { fontSize: 13, fontWeight: '600', marginTop: 12, marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.5 },
  input: {
    fontSize: 16, paddingHorizontal: 14, paddingVertical: 12,
    borderRadius: 12, borderWidth: 1,
  },
  textArea: { minHeight: 80, textAlignVertical: 'top' },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: {
    paddingHorizontal: 16, paddingVertical: 9, borderRadius: 20, borderWidth: 1,
  },
  chipText: { fontSize: 14, fontWeight: '600' },
  categoryGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  categoryItem: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    paddingHorizontal: 12, paddingVertical: 9, borderRadius: 12, borderWidth: 1,
  },
  categoryText: { fontSize: 13, fontWeight: '500' },
  colorRow: { flexDirection: 'row', gap: 10, flexWrap: 'wrap' },
  colorDot: { width: 32, height: 32, borderRadius: 16 },
  colorDotActive: { borderWidth: 3, borderColor: '#FFFFFF', shadowColor: '#000', shadowOpacity: 0.3, shadowRadius: 4, shadowOffset: { width: 0, height: 2 }, elevation: 4 },
  deleteBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 8, padding: 14, borderRadius: 14, borderWidth: 1.5, marginTop: 24,
  },
  deleteBtnText: { fontSize: 16, fontWeight: '600' },
});
