import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { Subscription } from '@/types';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export async function requestNotificationPermissions(): Promise<boolean> {
  if (Platform.OS === 'web') return false;
  const { status: existing } = await Notifications.getPermissionsAsync();
  if (existing === 'granted') return true;
  const { status } = await Notifications.requestPermissionsAsync();
  return status === 'granted';
}

export async function scheduleRenewalReminder(
  sub: Subscription,
  daysBefore: number,
): Promise<string | null> {
  const renewalDate = new Date(sub.nextRenewalDate);
  const triggerDate = new Date(renewalDate);
  triggerDate.setDate(triggerDate.getDate() - daysBefore);
  triggerDate.setHours(9, 0, 0, 0);

  if (triggerDate <= new Date()) return null;

  const id = await Notifications.scheduleNotificationAsync({
    content: {
      title: 'Upcoming Renewal',
      body: `${sub.name} renews in ${daysBefore} day${daysBefore > 1 ? 's' : ''} (${sub.currency} ${sub.cost.toFixed(2)})`,
      data: { subscriptionId: sub.id },
    },
    trigger: { type: Notifications.SchedulableTriggerInputTypes.DATE, date: triggerDate },
  });
  return id;
}

export async function scheduleAllReminders(sub: Subscription): Promise<void> {
  for (const days of sub.reminderDays) {
    await scheduleRenewalReminder(sub, days);
  }
}

export async function cancelAllNotifications(): Promise<void> {
  await Notifications.cancelAllScheduledNotificationsAsync();
}

export async function rescheduleAllReminders(subs: Subscription[]): Promise<void> {
  await cancelAllNotifications();
  for (const sub of subs) {
    await scheduleAllReminders(sub);
  }
}
