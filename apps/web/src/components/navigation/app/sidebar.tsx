'use client';
import type { ReactNode } from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';
import { AppSidebar } from './app-sidebar';

export const Sidebar = ({ children }: { children: ReactNode }) => {
  return (
    <SidebarProvider defaultOpen={true}>
      <AppSidebar />
      <div
        className={cn(
          'fkex ml-auto w-full max-w-full flex-col gap-4 px-2 py-4',
          'peer-data-[state=collapsed]:w-[calc(100%-var(--sidebar-width-icon)-1rem)]',
          'peer-data-[state=expanded]:w-[calc(100%-var(--sidebar-width))]',
          'sm:transition-[width] sm:duration-200 sm:ease-linear',
          'h-svh',
          'group-data-[scroll-locked=1]/body:h-full',
          'has-[main.fixed-main]:group-data-[scroll-locked=1]/body:h-svh'
        )}
        id="content"
      >
        {children}
      </div>
    </SidebarProvider>
  );
};
