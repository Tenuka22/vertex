import type { ReactNode } from 'react';
import { Sidebar } from '@/components/navigation/app/sidebar';

const ROOT_LAYOUT = ({ children }: { children: ReactNode }) => {
  return <Sidebar>{children}</Sidebar>;
};

export default ROOT_LAYOUT;
