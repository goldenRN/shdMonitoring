'use client';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useEffect, useState } from 'react'
import Link from 'next/link';

interface Posts {
  newsid: number
  title: string
  ordernum: string
  contractor: string
  contractcost: number
  engener: string
  startdate: Date
  enddate: Date
  impphase: string
  imppercent: number
  source: string
  totalcost: number
  news: String
  branch: string
  createdat: Date
  updatedat: Date
  khoroos: { name: string }[];
}



export default function Home() {
  const [postsData, setPostsData] = useState<Posts[]>([])
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const getProgressColor = (percent: number) => {
    if (percent < 50) return 'bg-red-500';
    if (percent < 80) return 'bg-yellow-500';
    return 'bg-green-500';
  };
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch(`https://shdmonitoring.ub.gov.mn/api/posts`)
        const json = await res.json()
        console.log("json", json)
        setPostsData(json.data)
        setTotalPages(json.total)
      } catch (err) {
        console.error('Алдаа:', err)
      }
    }
    fetchPosts()
  }, [page])
  return (
    <>
      <main className="p-6 bg-gray-50 min-h-screen">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.isArray(postsData) && postsData.length > 0 ? (

            postsData.map(post => (
              <Card key={post.newsid} className="bg-white border border-gray-200 rounded-xl shadow-sm 
             hover:shadow-lg hover:scale-[1.02] hover:border-blue-500 
             transition-all duration-300 ease-in-out 
             flex flex-col justify-between cursor-pointer">
                <CardHeader className="pb-2 border-b border-gray-100">
                  <CardTitle className="text-base font-semibold text-blue-800">
                    {post.title}
                  </CardTitle>
                  <CardDescription className="text-sm text-gray-500 text-right">
                    {post.updatedat == null
                      ? `Бүртгэсэн огноо: ${new Date(post.createdat).toLocaleDateString()}`
                      : `Шинэчилсэн: ${new Date(post.updatedat).toLocaleDateString()}`}
                  </CardDescription>
                </CardHeader>

                <CardContent className="divide-y divide-gray-100 text-sm text-gray-700">
                  <div className="py-2 flex justify-between">
                    <span className="font-medium text-gray-600  ">Захирамж №</span>
                    <span>{post.ordernum}</span>
                  </div>
                  <div className="py-2 flex justify-between">
                    <span className="font-medium text-gray-600">Хөрөнгө оруулалтын эх үүсвэр</span>
                    <span>{post.source}</span>
                  </div>
                  <div className="py-2 flex justify-between">
                    <span className="font-medium text-gray-600">Хороо</span>
                    <span>
                      {Array.isArray(post.khoroos) && post.khoroos.length > 0 ? (
                        post.khoroos.map((khr, index) => (
                          <div key={index}>{khr.name}</div>
                        ))
                      ) : (
                        <div className="text-gray-500 text-xs">Хороо байхгүй</div>
                      )}
                    </span>
                  </div>
                  <div className="py-2 flex justify-between">
                    <span className="font-medium text-gray-600">Төсөвт өртөг</span>
                    <span>{Number(post.totalcost).toLocaleString()}₮</span>
                  </div>
                  <div className="py-2 flex justify-between">
                    <span className="font-medium text-gray-600 ">Гүйцэтгэгч</span>
                    <span className=" text-gray-600 text-right  break-words">{post.contractor}</span>
                  </div>
                  <div className="py-2 flex justify-between">
                    <span className="font-medium text-gray-600">Гэрээний дүн</span>
                    <span>{Number(post.contractcost).toLocaleString()}₮</span>
                  </div>
                  <div className="py-2 flex justify-between">
                    <span className="font-medium text-gray-600">Захиалагчын хяналтын байгууллага</span>
                    <span>{post.engener}</span>
                  </div>
                  <div className="py-2 flex justify-between">
                    <span className="font-medium text-gray-600">Хугацаа</span>
                    <span>
                      {new Date(post.startdate).toLocaleDateString('ja-JP')} - {new Date(post.enddate).toLocaleDateString('ja-JP')}
                    </span>
                  </div>
                  <div className="py-2 flex justify-between">
                    <span className="font-medium text-gray-600">Ажлын явц</span>
                    <span>{post.impphase}</span>
                  </div>
                  <div className="py-2 flex justify-between">
                    <span className="font-medium text-gray-600">Салбар</span>
                    <span>{post.branch}</span>
                  </div>
                  <div className="py-2 flex justify-between">
                    <span className="font-medium text-gray-600">Гүйцэтгэлийн хувь</span>
                    <span>{post.imppercent}%</span>
                  </div>
                  <div className="mt-3 relative w-full bg-gray-300 rounded-full h-2">
                    <div
                      className={`absolute top-0 left-0 h-2 rounded-full ${getProgressColor(post.imppercent)}`}
                      style={{ width: `${post.imppercent}%` }}
                    ></div>
                  </div>
                </CardContent>

                <CardFooter className="flex justify-end p-4 pt-2 border-t border-gray-100">
                  <Link href={`/detail/${post.newsid}`}>
                    <span className="text-sm font-medium text-blue-700 hover:underline hover:text-blue-900">
                      Дэлгэрэнгүй →
                    </span>
                  </Link>
                </CardFooter>
              </Card>
            ))

          ) : (
            <></>
          )}
        </div>
      </main>


      <footer className="bg-blue-900 text-white py-6 mt-10">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-sm">
            &copy; {new Date().getFullYear()} Улаанбаатар хот. СонгиноХайрхан Дүүргийн Засаг даргын тамгын газар.
          </p>
        </div>
      </footer>


    </>

  );
}
