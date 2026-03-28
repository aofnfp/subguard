import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '@/store/theme-context';

interface BarData {
  label: string;
  value: number;
  color: string;
}

interface SpendingChartProps {
  data: BarData[];
  maxValue?: number;
  height?: number;
}

export default function SpendingChart({ data, maxValue, height = 140 }: SpendingChartProps) {
  const { colors } = useTheme();
  const max = maxValue || Math.max(...data.map((d) => d.value), 1);

  if (data.length === 0) {
    return (
      <View style={[styles.empty, { height }]}>
        <Text style={{ color: colors.textSecondary, fontSize: 14 }}>No data yet</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { height }]}>
      <View style={styles.bars}>
        {data.map((d, i) => (
          <View key={i} style={styles.barCol}>
            <View style={styles.barTrack}>
              <View
                style={[
                  styles.barFill,
                  {
                    backgroundColor: d.color,
                    height: `${Math.max((d.value / max) * 100, 4)}%`,
                  },
                ]}
              />
            </View>
            <Text style={[styles.barLabel, { color: colors.textSecondary }]} numberOfLines={1}>
              {d.label}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { width: '100%' },
  empty: { alignItems: 'center', justifyContent: 'center' },
  bars: { flex: 1, flexDirection: 'row', alignItems: 'flex-end', gap: 8 },
  barCol: { flex: 1, alignItems: 'center', gap: 6 },
  barTrack: { width: '100%', flex: 1, justifyContent: 'flex-end' },
  barFill: { width: '100%', borderRadius: 6, minHeight: 4 },
  barLabel: { fontSize: 11, textAlign: 'center' },
});
