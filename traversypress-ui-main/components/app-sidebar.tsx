// import * as React from "react"

// import { SearchForm } from "@/components/search-form"
// import { VersionSwitcher } from "@/components/version-switcher"
// import {
//   Sidebar,
//   SidebarContent,
//   SidebarGroup,
//   SidebarGroupContent,
//   SidebarGroupLabel,
//   SidebarHeader,
//   SidebarMenu,
//   SidebarMenuButton,
//   SidebarMenuItem,
//   SidebarRail,
// } from "@/components/ui/sidebar"
// import {
//   Command,
//   CommandDialog,
//   CommandEmpty,
//   CommandGroup,
//   CommandInput,
//   CommandItem,
//   CommandList,
//   CommandSeparator,
//   CommandShortcut,
// } from '@/components/ui/command';
// import {
//   LayoutDashboard,
//   Newspaper,
//   Folders,
//   ListPlus,
//   Wallet,
//   Hotel,
//   User,
//   LogOut,
// } from 'lucide-react';
// import Link from 'next/link';
// import { useAuth } from '@/app/context/AuthContext';
// // This is sample data.


// export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
//   const { logout } = useAuth();
//   return (
//     <Sidebar {...props}>
//       <SidebarHeader>
//         <VersionSwitcher
//         />
//         {/* <SearchForm /> */}
//       </SidebarHeader>
//       <SidebarContent>
//         {/* We create a SidebarGroup for each parent. */}
//         {/* {data.navMain.map((item) => (
//           <SidebarGroup key={item.title}>
//             <SidebarGroupLabel>{item.title}</SidebarGroupLabel>
//             <SidebarGroupContent>
//               <SidebarMenu>
//                 {item.items.map((item) => (
//                   <SidebarMenuItem key={item.title}>
//                     <SidebarMenuButton asChild isActive={item.isActive}>
//                       <a href={item.url}>{item.title}</a>
//                     </SidebarMenuButton>
//                   </SidebarMenuItem>
//                 ))}
//               </SidebarMenu>
//             </SidebarGroupContent>
//           </SidebarGroup>
//         ) */}
//         {/* )} */}
//         <Command >
//           <CommandInput placeholder='Хайлт...' />
//           <CommandList>
//             <CommandEmpty>Хайлт олдсонгүй.</CommandEmpty>
//             <CommandGroup heading='Нүүр хуудас'>
//               <CommandItem>
//                 <LayoutDashboard className='mr-2 h-8 w-4' />
//                 <Link href='/admin/dashboard'>Удирдлагын хэсэг</Link>
//               </CommandItem>
//               <CommandItem>
//                 <Newspaper className='mr-2 h-8 w-4' />
//                 <Link href='/admin/posts'>Мэдээлэл</Link>
//               </CommandItem>
//               {/* <CommandItem>

//             <Link href='#'></Link>
//           </CommandItem> */}
//             </CommandGroup>
//             <CommandSeparator />
//             <CommandGroup heading='Бүртгэл'>
//               <CommandItem>
//                 <Folders className='mr-2 h-8 w-4' />
//                 <Link href='/admin/khoroo'>Хороо бүртгэл</Link>
//                 {/* <CommandShortcut>⌘P</CommandShortcut> */}
//               </CommandItem>
//               <CommandItem>
//                 <ListPlus className='mr-2 h-8 w-4' />
//                 <Link href='/admin/salbar'>Салбар бүртгэл</Link>
//                 {/* <CommandShortcut>⌘P</CommandShortcut> */}
//               </CommandItem>
//               <CommandItem>
//                 <Folders className='mr-2 h-8 w-4' />
//                 <Link href='/admin/workprogres'>Ажлын явц</Link>
//                 {/* <CommandShortcut>⌘P</CommandShortcut> */}
//               </CommandItem>
//               <CommandItem>
//                 <Wallet className='mr-2 h-8 w-4' />
//                 <Link href='/admin/source'>Хөрөнгө оруулалтын эх үүсвэр бүртгэл</Link>
//                 {/* <CommandShortcut>⌘P</CommandShortcut> */}
//               </CommandItem>
//               <CommandItem>
//                 <Hotel className='mr-2 h-8 w-4' />
//                 <Link href='/admin/supervisor'>Захиалагчын хяналтын байгууллага</Link>
//                 {/* <CommandShortcut>⌘P</CommandShortcut> */}
//               </CommandItem>
//               {/* <CommandItem>
//                 <User className='mr-2 h-8 w-4' />

//                 <span>Хувийн мэдээлэл</span>
//                 <CommandShortcut>⌘B</CommandShortcut>
//               </CommandItem> */}
//               <CommandItem onSelect={logout}>
//                 <LogOut className='mr-2 h-8 w-4' />
//                 <span>Гарах</span>
//               </CommandItem>
//             </CommandGroup>
//           </CommandList>
//         </Command>
//       </SidebarContent>
//       <SidebarRail />
//     </Sidebar>
//   )
// }
'use client';

import * as React from "react"
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { useAuth } from '@/app/context/AuthContext';
import { SearchForm } from "@/components/search-form"
import { VersionSwitcher } from "@/components/version-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarFooter,
} from "@/components/ui/sidebar"
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from '@/components/ui/command';
import {
  LayoutDashboard,
  Newspaper,
  Folders,
  ListPlus,
  Wallet,
  Hotel,
  User,
  ClipboardPen,
  Settings,
  LogOut,
} from 'lucide-react';

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { logout, user } = useAuth();
  const pathname = usePathname();

  const isActive = (href: string) => pathname === href;

  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <VersionSwitcher />
      </SidebarHeader>

      <SidebarContent>
        <Command>
          <CommandInput placeholder='Хайлт...' />
          <CommandList>
            <CommandEmpty>Хайлт олдсонгүй.</CommandEmpty>

            <CommandGroup heading='Нүүр хуудас'>
              <CommandItem className={isActive('/admin/dashboard') ? 'bg-muted text-blue-600' : ''}>
                <LayoutDashboard className='mr-2 h-8 w-4' />
                <Link href='/admin/dashboard'>Удирдлагын хэсэг</Link>
              </CommandItem>
              <CommandItem className={isActive('/admin/posts') ? 'bg-muted text-blue-600' : ''}>
                <Newspaper className='mr-2 h-8 w-4' />
                <Link href='/admin/posts'>Мэдээлэл</Link>
              </CommandItem>
            </CommandGroup>

            <CommandSeparator />

            <CommandGroup heading='Бүртгэл'>
              <CommandItem className={isActive('/admin/khoroo') ? 'bg-muted text-blue-600' : ''}>
                <Folders className='mr-2 h-8 w-4' />
                <Link href='/admin/khoroo'>Хороо бүртгэл</Link>
              </CommandItem>
              <CommandItem className={isActive('/admin/salbar') ? 'bg-muted text-blue-600' : ''}>
                <ListPlus className='mr-2 h-8 w-4' />
                <Link href='/admin/salbar'>Салбар бүртгэл</Link>
              </CommandItem>
              <CommandItem className={isActive('/admin/workprogres') ? 'bg-muted text-blue-600' : ''}>
                <Folders className='mr-2 h-8 w-4' />
                <Link href='/admin/workprogres'>Ажлын явц</Link>
              </CommandItem>
              <CommandItem className={isActive('/admin/class') ? 'bg-muted text-blue-600' : ''}>
                <ClipboardPen className='mr-2 h-8 w-4' />
                <Link href='/admin/class'>Бүлэг бүртгэл</Link>
              </CommandItem>
              <CommandItem className={isActive('/admin/source') ? 'bg-muted text-blue-600' : ''}>
                <Wallet className='mr-2 h-8 w-4' />
                <Link href='/admin/source'>Хөрөнгө оруулалтын эх үүсвэр бүртгэл</Link>
              </CommandItem>
              <CommandItem className={isActive('/admin/supervisor') ? 'bg-muted text-blue-600' : ''}>
                <Hotel className='mr-2 h-8 w-4' />
                <Link href='/admin/supervisor'>Захиалагчийн хяналтын байгууллага</Link>
              </CommandItem>
            </CommandGroup>

            <CommandSeparator />

            <CommandGroup heading='Тохиргоо'>
              <CommandItem className={isActive('/admin/settings') ? 'bg-muted text-blue-600' : ''}>
                <Settings className='mr-2 h-8 w-4' />
                 <Link href='/admin/settings'>Нууц үг солих</Link>
              </CommandItem>

              <CommandItem onSelect={logout}>
                <LogOut className='mr-2 h-8 w-4' />
                <span>Гарах</span>
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </SidebarContent>

      <SidebarRail />

      <SidebarFooter>
        <div className="flex items-center justify-between px-4 py-2 text-sm text-muted-foreground border-t">
          <div className="flex items-center space-x-2">
            <User className="h-4 w-4" />
            <span>{user?.username || 'Хэрэглэгч'}</span>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
