import { BadgeCheck, ChevronsUpDown, LogOut } from 'lucide-react';
import Link from 'next/link';
import { Muted, Small } from '@/components/design/typography';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';
import { authClient } from '@/lib/auth-client';

const UserLayout = ({
  user,
}: {
  user: { name: string; email: string; image?: string | null };
}) => {
  return (
    <div className="flex flex-row items-start justify-center gap-3">
      <Avatar className="h-8 w-8 rounded-lg">
        <AvatarImage alt={user?.name} src={user?.image ?? undefined} />
        <AvatarFallback className="rounded-lg">
          {user?.email.substring(0, 2)}
        </AvatarFallback>
      </Avatar>
      <div className="grid grid-rows-2 gap-2">
        <Small>{user?.name}</Small>
        <Muted className="truncate">
          <Small>{user?.email}</Small>
        </Muted>
      </div>
    </div>
  );
};

export const NavUser = () => {
  const { isMobile } = useSidebar();
  const { data: userSession } = authClient.useSession();

  const user = userSession?.user;

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
              size="lg"
            >
              <UserLayout
                user={
                  user ?? {
                    email: 'user@govi-plus.co',
                    name: 'Govi User',
                    image: '',
                  }
                }
              />
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? 'bottom' : 'right'}
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0.5 font-normal">
              <UserLayout
                user={
                  user ?? {
                    email: 'user@govi-plus.co',
                    name: 'Govi User',
                    image: '',
                  }
                }
              />
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem asChild>
                <Link href="/app/profile/user">
                  <BadgeCheck />
                  Profile
                </Link>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <LogOut />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
};
