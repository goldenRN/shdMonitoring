import logo from '../img/logo.png'
import city from '../img/city.jpeg'
import Image from 'next/image'
import Link from 'next/link'

const Navbar = () => {
  return (
    <header className="bg-blue-900 text-white border-b border-zinc-600">

      {/* 🔹 TOP BAR */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-2 px-4 py-2 text-xs sm:text-sm">

        <div className="flex flex-col sm:flex-row items-center gap-1 sm:gap-4 text-center sm:text-left">
          <span>7017 3203</span>
          <span className="break-all">
            songinokhairkhandistrict@gmail.com
          </span>
        </div>

        <Link href="/auth">
          <button className="bg-white hover:bg-blue-500 hover:text-white transition text-blue-900 font-semibold py-1.5 px-4 rounded text-xs">
            Нэвтрэх
          </button>
        </Link>
      </div>

      {/* 🔹 MAIN HEADER */}
      <div className="flex flex-col md:flex-row items-center justify-between bg-white px-4 sm:px-6 py-4 text-blue-900 gap-4">

        {/* Logo + Title */}
        <div className="flex items-center gap-3 text-center md:text-left">
          <Image
            src={logo}
            alt="Logo"
            width={60}
            height={60}
            className="w-14 h-14 sm:w-16 sm:h-16"
          />
          <div>
            <h1 className="text-sm sm:text-lg md:text-xl font-bold leading-tight">
              СОНГИНОХАЙРХАН ДҮҮРГИЙН
            </h1>
            <p className="text-xs sm:text-base md:text-lg leading-tight">
              ЗАСАГ ДАРГЫН ТАМГЫН ГАЗАР
            </p>
          </div>
        </div>

        {/* City Image */}
        <div className="hidden lg:block">
          <Image
            src={city}
            alt="City"
            width={400}
            height={60}
            className="object-contain"
          />
        </div>

      </div>
    </header>
  )
}

export default Navbar