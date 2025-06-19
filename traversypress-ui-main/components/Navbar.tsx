
import logo from '../img/logo.png';
import city from '../img/city.jpeg';
import Image from 'next/image';
import Link from 'next/link';
const Navbar = () => {

  return (
    <header className="bg-blue-900 text-white border-b-2 border-zinc-600 ">
      <div className="flex items-center justify-between px-4 py-2 text-sm">
        <div className="flex items-center space-x-4">
          <span>7017 3203</span>
          <span>songinokhairkhandistrict@gmail.com</span>


        </div>
        <div className="flex items-center space-x-3">
          {/* <span>7017 3203</span>
          <span>songinokhairkhandistrict@gmail.com</span> */}
          <Link href={`/auth`}>
            <button className='bg-white hover:bg-blue-500 text-blue-900 font-bold py-2 px-4 rounded text-xs'>
              Нэвтрэх
            </button>
          </Link>
        </div>
      </div>

      <div className="flex items-center justify-between bg-white px-6 py-4 text-blue-900">
        <div className="flex items-center space-x-4">
          <Image src={logo} alt="Logo" width={100} height={100} />
          <div>
            <h1 className="text-xl font-bold">СОНГИНОХАЙРХАН ДҮҮРГИЙН</h1>
            <p className="text-lg">ЗАСАГ ДАРГЫН ТАМГЫН ГАЗАР</p>
          </div>
        </div>
        <div className=" flex items-center justify-center">

          <Image src={city} alt="City" width={500} height={40} className="object-contain" />
        </div>

      </div>


    </header>
  );
}
export default Navbar;