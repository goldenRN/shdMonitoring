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

const Sidebar = () => {
  return (
    <Command className='rounded-none border-r-2 border-zinc-600 '>
      <CommandInput placeholder='Хайлт...' />
      <CommandList>
        <CommandEmpty>Хайлт илгэцгүй.</CommandEmpty>
        <CommandGroup heading='Нүүр хуудас'>
          <CommandItem>
            <LayoutDashboard className='mr-2 h-8 w-4' />
            <Link href='/'>Удирдлагын хэсэг</Link>
          </CommandItem>
          <CommandItem>
            <Newspaper className='mr-2 h-8 w-4' />
            <Link href='/posts'>Мэдээлэл</Link>
          </CommandItem>
          {/* <CommandItem>
            
            <Link href='#'></Link>
          </CommandItem> */}
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading='Бүртгэл'>
          <CommandItem>
            <Folders className='mr-2 h-8 w-4' /> 
            <Link href='/khoroo'>Хороо бүртгэл</Link>
            {/* <CommandShortcut>⌘P</CommandShortcut> */}
          </CommandItem>
          <CommandItem>
            <User className='mr-2 h-8 w-4' />

            <span>Хувийн мэдээлэл</span>
            {/* <CommandShortcut>⌘B</CommandShortcut> */}
          </CommandItem>
          <CommandItem>
            <LogOut className='mr-2 h-8 w-4' />
            <span>Гарах</span>
            {/* <CommandShortcut>⌘S</CommandShortcut> */}
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </Command>
  );
};

export default Sidebar;
