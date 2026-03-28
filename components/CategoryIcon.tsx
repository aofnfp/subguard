import React from 'react';
import {
  Tv,
  Briefcase,
  Cloud,
  PlayCircle,
  Gamepad2,
  Dumbbell,
  Newspaper,
  Wrench,
  CircleDot,
} from 'lucide-react-native';
import { Category } from '@/types';

const ICON_MAP: Record<Category, React.ComponentType<{ size?: number; color?: string }>> = {
  entertainment: Tv,
  productivity: Briefcase,
  cloud_storage: Cloud,
  streaming: PlayCircle,
  gaming: Gamepad2,
  fitness: Dumbbell,
  news: Newspaper,
  utilities: Wrench,
  other: CircleDot,
};

interface Props {
  category: Category;
  size?: number;
  color?: string;
}

export default function CategoryIcon({ category, size = 20, color }: Props) {
  const Icon = ICON_MAP[category] || CircleDot;
  return <Icon size={size} color={color} />;
}
