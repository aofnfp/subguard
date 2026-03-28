import { BillingCycle } from '@/types';

export function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export function daysUntil(dateStr: string): number {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const target = new Date(dateStr);
  target.setHours(0, 0, 0, 0);
  return Math.ceil((target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
}

export function getNextRenewalDate(current: string, cycle: BillingCycle): string {
  const d = new Date(current);
  switch (cycle) {
    case 'weekly':
      d.setDate(d.getDate() + 7);
      break;
    case 'monthly':
      d.setMonth(d.getMonth() + 1);
      break;
    case 'quarterly':
      d.setMonth(d.getMonth() + 3);
      break;
    case 'annual':
      d.setFullYear(d.getFullYear() + 1);
      break;
  }
  return d.toISOString().split('T')[0];
}

export function toMonthlyAmount(cost: number, cycle: BillingCycle): number {
  switch (cycle) {
    case 'weekly':
      return cost * 4.33;
    case 'monthly':
      return cost;
    case 'quarterly':
      return cost / 3;
    case 'annual':
      return cost / 12;
  }
}

export function toAnnualAmount(cost: number, cycle: BillingCycle): number {
  return toMonthlyAmount(cost, cycle) * 12;
}

export function isWithinDays(dateStr: string, days: number): boolean {
  const d = daysUntil(dateStr);
  return d >= 0 && d <= days;
}
