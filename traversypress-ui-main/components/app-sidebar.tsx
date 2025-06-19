import * as React from "react"

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
  User,
  LogOut,
} from 'lucide-react';
import Link from 'next/link';
// This is sample data.


export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <VersionSwitcher
        />
        {/* <SearchForm /> */}
      </SidebarHeader>
      <SidebarContent>
        {/* We create a SidebarGroup for each parent. */}
        {/* {data.navMain.map((item) => (
          <SidebarGroup key={item.title}>
            <SidebarGroupLabel>{item.title}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {item.items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={item.isActive}>
                      <a href={item.url}>{item.title}</a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ) */}
        {/* )} */}
        <Command >
          <CommandInput placeholder='Хайлт...' />
          <CommandList>
            <CommandEmpty>Хайлт олдсонгүй.</CommandEmpty>
            <CommandGroup heading='Нүүр хуудас'>
              <CommandItem>
                <LayoutDashboard className='mr-2 h-8 w-4' />
                <Link href='/admin/dashboard'>Удирдлагын хэсэг</Link>
              </CommandItem>
              <CommandItem>
                <Newspaper className='mr-2 h-8 w-4' />
                <Link href='/admin/posts'>Мэдээлэл</Link>
              </CommandItem>
              {/* <CommandItem>
            
            <Link href='#'></Link>
          </CommandItem> */}
            </CommandGroup>
            <CommandSeparator />
            <CommandGroup heading='Бүртгэл'>
              <CommandItem>
                <Folders className='mr-2 h-8 w-4' />
                <Link href='/admin/khoroo'>Хороо бүртгэл</Link>
                {/* <CommandShortcut>⌘P</CommandShortcut> */}
              </CommandItem>
              <CommandItem>
                <User className='mr-2 h-8 w-4' />

                <span>Хувийн мэдээлэл</span>
                {/* <CommandShortcut>⌘B</CommandShortcut> */}
              </CommandItem>
              <CommandItem>
                <LogOut className='mr-2 h-8 w-4' />
                <Link href='/auth'>Гарах</Link>
                {/* <span>Гарах</span> */}
                {/* <CommandShortcut>⌘S</CommandShortcut> */}
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  )
}
