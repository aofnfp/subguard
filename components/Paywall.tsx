import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Modal,
} from 'react-native';
import { X, Crown, Check } from 'lucide-react-native';
import { useTheme } from '@/store/theme-context';
import { usePremiumStore } from '@/store/premium-store';

interface PaywallProps {
  visible: boolean;
  onClose: () => void;
}

const FEATURES = [
  'Unlimited subscriptions',
  'Advanced analytics & charts',
  'CSV export',
  'Price-change alerts',
  'Family sharing',
  'No ads',
];

export default function Paywall({ visible, onClose }: PaywallProps) {
  const { colors } = useTheme();
  const { buyMonthly, buyAnnual, restore, isLoading } = usePremiumStore();

  const handleBuy = async (type: 'monthly' | 'annual') => {
    const success = type === 'monthly' ? await buyMonthly() : await buyAnnual();
    if (success) onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={[styles.overlay, { backgroundColor: 'rgba(0,0,0,0.5)' }]}>
        <View style={[styles.sheet, { backgroundColor: colors.surface }]}>
          <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
            <X size={24} color={colors.textSecondary} />
          </TouchableOpacity>

          <Crown size={40} color={colors.accent} style={{ alignSelf: 'center' }} />
          <Text style={[styles.title, { color: colors.textPrimary }]}>SubGuard Premium</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            Take full control of your subscriptions
          </Text>

          <View style={styles.features}>
            {FEATURES.map((f) => (
              <View key={f} style={styles.featureRow}>
                <Check size={18} color={colors.success} />
                <Text style={[styles.featureText, { color: colors.textPrimary }]}>{f}</Text>
              </View>
            ))}
          </View>

          {isLoading ? (
            <ActivityIndicator color={colors.primary} style={{ marginVertical: 20 }} />
          ) : (
            <View style={styles.buttons}>
              <TouchableOpacity
                style={[styles.primaryBtn, { backgroundColor: colors.primary }]}
                onPress={() => handleBuy('annual')}
              >
                <Text style={[styles.primaryBtnText, { color: colors.onPrimary }]}>
                  Annual — $19.99/yr
                </Text>
                <Text style={[styles.savingsText, { color: colors.onPrimary }]}>Save 44%</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.secondaryBtn, { borderColor: colors.outline }]}
                onPress={() => handleBuy('monthly')}
              >
                <Text style={[styles.secondaryBtnText, { color: colors.textPrimary }]}>
                  Monthly — $2.99/mo
                </Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => restore()}>
                <Text style={[styles.restoreText, { color: colors.textSecondary }]}>
                  Restore Purchases
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, justifyContent: 'flex-end' },
  sheet: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 40,
  },
  closeBtn: { alignSelf: 'flex-end', padding: 4 },
  title: { fontSize: 24, fontWeight: '700', textAlign: 'center', marginTop: 12 },
  subtitle: { fontSize: 15, textAlign: 'center', marginTop: 6 },
  features: { marginTop: 24, gap: 12 },
  featureRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  featureText: { fontSize: 15 },
  buttons: { marginTop: 28, gap: 12, alignItems: 'center' },
  primaryBtn: {
    width: '100%',
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
  },
  primaryBtnText: { fontSize: 17, fontWeight: '600' },
  savingsText: { fontSize: 13, marginTop: 2, opacity: 0.8 },
  secondaryBtn: {
    width: '100%',
    paddingVertical: 14,
    borderRadius: 14,
    borderWidth: 1.5,
    alignItems: 'center',
  },
  secondaryBtnText: { fontSize: 16, fontWeight: '600' },
  restoreText: { fontSize: 14, marginTop: 8 },
});
