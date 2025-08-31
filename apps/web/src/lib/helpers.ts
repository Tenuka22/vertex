import type { expenseCategoryEnum } from '@repo/db/schema/enums';
import type { ExpenseCategory } from '@repo/db/schema/primary';
import {
  Car,
  Gamepad2,
  GraduationCap,
  Heart,
  Home,
  type LucideIcon,
  Plus,
  ShoppingBag,
  Utensils,
} from 'lucide-react';

const ExpenseCategoryMeta: Record<
  (typeof expenseCategoryEnum.enumValues)[number],
  { name: string; icon: LucideIcon; color: string }
> = {
  VEHICLE: {
    name: 'Vehicle',
    icon: Car,
    color: 'bg-blue-500',
  },
  HOUSING: {
    name: 'Housing',
    icon: Home,
    color: 'bg-green-500',
  },
  FOOD: {
    name: 'Food & Dining',
    icon: Utensils,
    color: 'bg-orange-500',
  },
  SHOPPING: {
    name: 'Shopping',
    icon: ShoppingBag,
    color: 'bg-purple-500',
  },
  ENTERTAINMENT: {
    name: 'Entertainment',
    icon: Gamepad2,
    color: 'bg-pink-500',
  },
  EDUCATION: {
    name: 'Education',
    icon: GraduationCap,
    color: 'bg-indigo-500',
  },
  HEALTHCARE: {
    name: 'Healthcare',
    icon: Heart,
    color: 'bg-red-500',
  },
  OPTIONAL: {
    name: 'Other',
    icon: Plus,
    color: 'bg-gray-500',
  },
};

export const getCategoryMeta = (categry: ExpenseCategory) =>
  ExpenseCategoryMeta[categry.name];
