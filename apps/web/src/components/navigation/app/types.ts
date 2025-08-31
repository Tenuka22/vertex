type BaseNavItem = {
  title: string;
  badge?: string;
  disabled?: boolean;
  icon?: React.ElementType;
};

export type NavLink = BaseNavItem & {
  url: string;
  items?: never;
};

export type NavCollapsible = BaseNavItem & {
  items: (BaseNavItem & { url: string })[];
  url?: never;
};

export type NavItem = NavCollapsible | NavLink;

export type AdminNavGroup = {
  title: string;
  items: NavItem[];
};
