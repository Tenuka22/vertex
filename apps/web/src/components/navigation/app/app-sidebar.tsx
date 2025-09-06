'use client';
import {
  BarChart3,
  Bell,
  Building2,
  CreditCard,
  DollarSign,
  FileText,
  Package,
  PiggyBank,
  Receipt,
  Target,
  TrendingUp,
  Users,
  Wallet,
} from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarRail,
} from '@/components/ui/sidebar';
import { NavGroup } from './nav-group';
import { NavUser } from './nav-user';
import type { AdminNavGroup } from './types';

export const AppSidebar = ({
  ...props
}: React.ComponentProps<typeof Sidebar>) => {
  const navGroups: AdminNavGroup[] = [
    {
      title: 'Dashboard',
      items: [
        {
          title: 'Overview',
          icon: BarChart3,
          url: '/app/dashboard',
          disabled: true,
        },
        {
          title: 'Analytics',
          icon: TrendingUp,
          url: '/app/analytics',
          disabled: true,
        },
      ],
    },
    {
      title: 'Financial Management',
      items: [
        {
          title: 'Finance Overview',
          icon: DollarSign,
          items: [
            {
              title: 'Cash Flow',
              url: '/app/finance/cash-flow',
            },
            {
              title: 'Profit & Loss',
              url: '/app/finance/profit-loss',
            },
            {
              title: 'Balance Sheet',
              url: '/app/finance/balance-sheet',
            },
            {
              title: 'Budget Planning',
              url: '/app/finance/budget',
            },
          ],
        },
        {
          title: 'Payments',
          icon: CreditCard,
          items: [
            {
              title: 'Payment Methods',
              url: '/app/payments/methods',
            },
            {
              title: 'Transaction History',
              url: '/app/payments/transactions',
            },
          ],
        },
        {
          title: 'Invoicing',
          icon: Receipt,
          items: [
            {
              title: 'Create Invoice',
              url: '/app/invoices/create',
              disabled: true,
            },
            {
              title: 'All Invoices',
              url: '/app/invoices',
            },
          ],
        },
        {
          title: 'Expenses',
          icon: Wallet,
          items: [
            {
              title: 'Track Expenses',
              disabled: true,
              url: '/app/expenses',
            },
            {
              title: 'Expense Categories',
              url: '/app/expenses/categories',
            },
            {
              title: 'Expense Reports',
              disabled: true,
              url: '/app/expenses/reports',
            },
          ],
        },
      ],
    },
    {
      title: 'Business Operations',
      items: [
        {
          title: 'Customer Management',
          icon: Users,
          items: [
            {
              title: 'All Customers',
              url: '/app/customers',
            },
            {
              title: 'Customer Analytics',
              disabled: true,
              url: '/app/customers/analytics',
            },
          ],
        },
        {
          title: 'Inventory',
          icon: Package,
          items: [
            {
              title: 'Products & Services',
              url: '/app/inventory/products',
            },
            {
              title: 'Stock Management',
              url: '/app/inventory/stock',
            },
            {
              title: 'Suppliers',
              url: '/app/inventory/suppliers',
            },
            {
              title: 'Purchase Orders',
              url: '/app/inventory/purchase-orders',
            },
          ],
        },
      ],
    },
    {
      title: 'Business Intelligence',
      items: [
        {
          title: 'Reports',
          icon: FileText,
          items: [
            {
              title: 'Financial Reports',
              url: '/app/reports/financial',
              disabled: true,
            },
            {
              title: 'Sales Reports',
              url: '/app/reports/sales',
              disabled: true,
            },
            {
              title: 'Customer Reports',
              url: '/app/reports/customers',
              disabled: true,
            },
            {
              title: 'Custom Reports',
              url: '/app/reports/custom',
              disabled: true,
            },
          ],
        },
        {
          title: 'Goals & KPIs',
          icon: Target,
          items: [
            {
              title: 'Business Goals',
              url: '/app/goals',
            },
            {
              title: 'Performance Metrics',
              url: '/app/goals/metrics',
              disabled: true,
            },
            {
              title: 'Benchmarking',
              url: '/app/goals/benchmarking',
              disabled: true,
            },
          ],
        },
        {
          title: 'Forecasting',
          icon: PiggyBank,
          items: [
            {
              title: 'Revenue Forecast',
              url: '/app/forecast/revenue',
              disabled: true,
            },
            {
              title: 'Cash Flow Forecast',
              url: '/app/forecast/cash-flow',
              disabled: true,
            },
            {
              title: 'Growth Projections',
              url: '/app/forecast/growth',
              disabled: true,
            },
          ],
        },
      ],
    },
    {
      title: 'Administration',
      items: [
        {
          title: 'Company Settings',
          icon: Building2,
          items: [
            {
              title: 'Business Information',
              url: '/app/settings/business',
            },
            {
              title: 'Business Locations',
              url: '/app/settings/business-locations',
            },
          ],
        },
        {
          title: 'Notifications',
          icon: Bell,
          items: [
            {
              title: 'Notification Center',
              url: '/app/notifications',
              disabled: true,
            },
            {
              title: 'Notification Settings',
              url: '/app/notifications/settings',
              disabled: true,
            },
            {
              title: 'Alert Rules',
              url: '/app/notifications/rules',
              disabled: true,
            },
          ],
        },
      ],
    },
  ];

  return (
    <Sidebar collapsible="icon" variant="floating" {...props}>
      <SidebarContent>
        {navGroups.map((group) => (
          <NavGroup key={group.title} {...group} />
        ))}
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
};
