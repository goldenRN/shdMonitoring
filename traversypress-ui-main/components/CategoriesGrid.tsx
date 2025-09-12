"use client"
import { useEffect, useState } from 'react'
import { School, Building2, Car, Cable, Trees, Grid3x3 } from "lucide-react"
import { Card } from './ui/card'
import Link from 'next/link'
interface Category {
  icon: React.ReactNode
  name: string
  subCategories: string[]
}

const categories: Category[] = [
  {
    icon: <School className="w-10 h-10 text-orange-600" />,
    name: "Сургууль, цэцэрлэг",
    subCategories: [
      "Сургууль", "цэцэрлэг"
    ],
  },
  {
    icon: <Car className="w-10 h-10 text-blue-600" />,
    name: "Авто зам болон зогсоол",
    subCategories: ["Авто зам", "Авто зогсоол"],
  },
  {
    icon: <Building2 className="w-10 h-10 text-red-600" />,
    name: "Барилга байгууламж",
    subCategories: [
      "Хорооны цогцолбор",
      "Худаг",
      "Фасад засвар",
      "Дээвэр засвар",
    ],
  },

  {
    icon: <Trees className="w-10 h-10 text-emerald-600" />,
    name: "Тохижилт, ногоон байгууламж",
    subCategories: ["Тоглоомын талбай", "Явган зам", "Ногоон зам"],
  },
  {
    icon: <Cable className="w-10 h-10 text-purple-600" />,
    name: "Инженерийн шугам сүлжээ",
    subCategories: ["Цахилгаан хангамж", "Гэрэлтүүлэг", "Камер"],
  },
]
interface Classes {
  class_id: number
  class_name: string
  description: string
}
export default function CategoriesGrid() {
  const [classData, setClassData] = useState<Classes[]>([])
  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const res = await fetch(`https://shdmonitoring.ub.gov.mn/api/class`)
        const json = await res.json()
        console.log("classsss", json)
        setClassData(json)
        // setTotalPages(json.total)
      } catch (err) {
        console.error('Алдаа:', err)
      }
    }
    fetchClasses()
  },)
  return (
    <>
      <main className=" py-12">
        <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-5 gap-6 min-w-7xl mx-auto px-4">
          {categories.map((cat, idx) => (
            <Link
              key={idx + 1}
              href={`/news/${idx + 1}?icon=${cat.icon}&name=${cat.name}&desc=${cat.subCategories}`}>

              <div

                className=" rounded-xl border-red-100 shadow hover:shadow-xl hover:scale-[1.02] transition duration-300 p-5 min-h-[450px] flex flex-col items-center justify-center text-center"
              >

                <div className="p-4 rounded-full bg-blue-50 mb-10">
                  {cat.icon}
                </div>
                <h3 className="text-lg font-semibold mb-5">{cat.name}</h3>

                {cat.subCategories.length > 0 ? (
                  <ul className="mt-2 text-sm text-gray-600 list-disc list-inside text-left">
                    {cat.subCategories.map((sub, subIdx) => (
                      <li key={subIdx}>{sub}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-2 text-sm italic text-gray-400">
                    { }
                  </p>
                )}

                {/* <div className="w-full mb-4 flex items-center justify-between">
                  <span className="text-xs text-blue/80">12 мэдээлэл</span>
                  <span className="inline-flex items-center gap-2 text-sm font-medium text-blue/90">
                  </span>
                </div> */}

              </div>
            </Link>

          ))}
        </div>
      </main>
    </>
  )
}
