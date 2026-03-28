import React from 'react';
import { ScrollView, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { TouchableOpacity } from 'react-native';
import { ArrowLeft } from 'lucide-react-native';
import { useTheme } from '@/store/theme-context';

export default function PrivacyScreen() {
  const { colors } = useTheme();
  const router = useRouter();

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
      <TouchableOpacity onPress={() => router.back()} style={styles.back}>
        <ArrowLeft size={24} color={colors.textPrimary} />
        <Text style={[styles.backText, { color: colors.textPrimary }]}>Back</Text>
      </TouchableOpacity>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={[styles.title, { color: colors.textPrimary }]}>Privacy Policy</Text>
        <Text style={[styles.updated, { color: colors.textSecondary }]}>
          Last updated: March 2026
        </Text>

        <Text style={[styles.heading, { color: colors.textPrimary }]}>Our Promise</Text>
        <Text style={[styles.body, { color: colors.textSecondary }]}>
          SubGuard is built with privacy at its core. We do not collect, store, or transmit
          your personal data to any server. All your subscription data stays on your device.
        </Text>

        <Text style={[styles.heading, { color: colors.textPrimary }]}>Data Storage</Text>
        <Text style={[styles.body, { color: colors.textSecondary }]}>
          All subscription information is stored locally on your device using AsyncStorage.
          We never access your bank accounts, financial institutions, or payment methods.
        </Text>

        <Text style={[styles.heading, { color: colors.textPrimary }]}>Advertising</Text>
        <Text style={[styles.body, { color: colors.textSecondary }]}>
          The free version of SubGuard displays non-personalized banner ads via Google AdMob.
          Premium subscribers see no ads. We request non-personalized ads only.
        </Text>

        <Text style={[styles.heading, { color: colors.textPrimary }]}>In-App Purchases</Text>
        <Text style={[styles.body, { color: colors.textSecondary }]}>
          Premium subscriptions are processed through Apple App Store or Google Play Store.
          We use RevenueCat to manage subscription status. No payment information is stored
          within the app.
        </Text>

        <Text style={[styles.heading, { color: colors.textPrimary }]}>Notifications</Text>
        <Text style={[styles.body, { color: colors.textSecondary }]}>
          SubGuard may send local push notifications for renewal reminders. These are
          scheduled locally on your device and do not involve any server communication.
        </Text>

        <Text style={[styles.heading, { color: colors.textPrimary }]}>Contact</Text>
        <Text style={[styles.body, { color: colors.textSecondary }]}>
          If you have questions about this privacy policy, please contact us at
          privacy@abrahamoladotunfoundation.org
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  back: { flexDirection: 'row', alignItems: 'center', gap: 8, padding: 16 },
  backText: { fontSize: 16, fontWeight: '500' },
  scroll: { padding: 20, paddingBottom: 40 },
  title: { fontSize: 28, fontWeight: '800', marginBottom: 4 },
  updated: { fontSize: 14, marginBottom: 24 },
  heading: { fontSize: 18, fontWeight: '700', marginTop: 20, marginBottom: 8 },
  body: { fontSize: 15, lineHeight: 22 },
});
