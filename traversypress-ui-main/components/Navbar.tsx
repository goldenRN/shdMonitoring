import Image from 'next/image';
import Link from 'next/link';
import logo from '../img/logo.png';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import ThemeToggler from '@/components/ThemeToggler';
import { CardTitle } from './ui/card';

const Navbar = () => {
  return (
    <div className='bg-slate-800 text-white py-2 px-5 flex justify-between border-b-2 border-zinc-600 flex justify-center items-center'>
      <Link href='/'>
        <Image src={logo} alt='TraversyPress' width={80} />
      </Link>
      <p className="text-align: justify">
        СОНГИНО ХАЙРХАН ДҮҮРГИЙН  ЗАСАГ ДАРГЫН ТАМГЫН ГАЗАР
      </p>



      <div className='flex items-center'>
        <ThemeToggler />
        <DropdownMenu>
          {/* <DropdownMenuTrigger className='focus:outline-none'>
            <Avatar>
              <AvatarImage src='https://github.com/shadcn.png' alt='@shadcn' />
              <AvatarFallback className='text-black'>BT</AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger> */}

          <Link href={`/auth`}>
            <button className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded text-xs'>
              Нэвтрэх
            </button>
          </Link>
          {/* <DropdownMenuContent>
            <DropdownMenuLabel>Миний бүртгэл</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Link href='/profile'>Хувийн мэдээлэл</Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link href='/auth'>Гарах</Link>
            </DropdownMenuItem>
          </DropdownMenuContent> */}
        </DropdownMenu>
      </div>
    </div>
  );
};

export default Navbar;
