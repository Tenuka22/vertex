import type { ReactNode } from 'react';
import { Sidebar } from '@/components/navigation/app/sidebar';

const APP_LAYOUT = ({ children }: { children: ReactNode }) => {
  return <Sidebar>{children}</Sidebar>;
};

export default APP_LAYOUT;
