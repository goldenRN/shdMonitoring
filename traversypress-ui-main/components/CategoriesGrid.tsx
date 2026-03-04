"use client"
import { School, Building2, Car, Cable, Trees } from "lucide-react"
import barilga from '../img/barilga2.jpg';
import tsetserleg from '../img/tsetserleg.jpg';
import ingener from '../img/ingener.jpg';
import zam from '../img/zam.jpg';
import tohjilt from '../img/tohijilt.jpg';
import Link from 'next/link'
import Image from 'next/image';
import { StaticImageData } from "next/image";
interface Category {
  icon: React.ReactNode
  image: StaticImageData
  name: string
  subCategories: string[]
}

const categories: Category[] = [

  {
    icon: <Car className="w-5 h-5 text-blue-600" />,
    image: zam,
    name: "Авто зам болон зогсоол",
    subCategories: ["Авто зам", "Авто зогсоол"],
  },
  {
    icon: <School className="w-5 h-5 text-orange-600" />,
    image: tsetserleg,
    name: "Сургууль, цэцэрлэг",
    subCategories: [
      "Сургууль", "цэцэрлэг"
    ],
  },
  {
    icon: <Building2 className="w-5 h-5 text-red-600" />,
    image: barilga,
    name: "Барилга байгууламж",
    subCategories: [
      "Хорооны цогцолбор",
      "Худаг",
      "Фасад засвар",
      "Дээвэр засвар",
    ],
  },

  {
    icon: <Trees className="w-5 h-5 text-emerald-600" />,
    image: tohjilt,
    name: "Тохижилт, ногоон байгууламж",
    subCategories: ["Тоглоомын талбай", "Явган зам", "Ногоон зам"],
  },
  {
    icon: <Cable className="w-5 h-5 text-purple-600" />,
    image: ingener,
    name: "Инженерийн шугам сүлжээ",
    subCategories: ["Цахилгаан хангамж", "Гэрэлтүүлэг", "Камер"],
  },
]
export default function CategoriesGrid() {
  return (
    <>
      <main className="py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {categories.map((cat, idx) => (
            <Link
              key={idx + 1}
              href={`/news/${idx + 1}?icon=${cat.icon}&name=${cat.name}&desc=${cat.subCategories}`}
            >

              <div className="rounded-xl border border-gray-200 shadow hover:shadow-xl hover:scale-[1.02] transition duration-300 min-h-[450px] flex flex-col">

                {/* Зураг */}
                <div className="w-full h-1/2 mb-6 p-1">
                  <Image
                    src={cat.image}
                    alt={cat.name}
                    width={450}
                    height={300}
                    className="w-full h-full object-cover rounded-lg"
                  />
                </div>
                <div className='p-5'>{/* Дээрх текст хэсэг */}
                  <h3 className="text-lg font-bold mb-3 text-gray-800">{cat.name}</h3>

                  {cat.subCategories.length > 0 && (
                    <ul className="space-y-1 mb-6 text-sm text-gray-600 list-disc list-inside">
                      {cat.subCategories.map((sub, subIdx) => (
                        <li key={subIdx}>{sub}</li>
                      ))}
                    </ul>
                  )}</div>


                {/* {/* Доод icon + link хэсэг */}
                <div className="mt-auto flex items-center justify-between px-5 pb-4">
                  {/* Icon */}
                  <div className="p-2 rounded-full ">
                    {/* {cat.icon} */}
                  </div>
                  {/* Дэлгэрэнгүй */}
                  <div

                    className="text-xs font-medium text-blue-600 hover:text-blue-800 transition"
                  >
                    Дэлгэрэнгүй →
                  </div>
                </div>

              </div>

            </Link>
          ))}
          </div>
        </div>
      </main>


    </>
  )
}
