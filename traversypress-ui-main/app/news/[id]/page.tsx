
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
import { useToast } from '@/components/ui/use-toast'
import Image from 'next/image'
import AutoImageSlider from '@/components/autoslider';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
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


const Detail = ({ params }: { params: { id: string } }) => {
  const { toast } = useToast();
  const id = params.id
  const searchParams = useSearchParams();
  const name = searchParams.get('name');
  const desc = searchParams.get('desc');

  const [isLoaded, setIsLoaded] = useState(false);
  const [postsData, setPostsData] = useState<Posts[]>([])
  const getProgressColor = (percent: number) => {
    if (percent < 50) return 'bg-red-500';
    if (percent < 80) return 'bg-yellow-500';
    return 'bg-green-500';
  };
  // let imageUrl = ''; // API image URL

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch(`https://shdmonitoring.ub.gov.mn/api/posts`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json; charset=utf-8',
          },
          body: JSON.stringify({ id }),
        })
        const json = await res.json()
        console.log("json", json)
        setPostsData(json.data)
        // setTotalPages(json.total)
      } catch (err) {
        console.error('Алдаа:', err)
      }
    }
    fetchPosts()
  }, [])

  return (
    <>
      <main className="p-6 bg-gray-50 min-h-screen">
        <div className='flex'>
          <h3 className="text-lg font-semibold mb-10">{name}</h3>
          <ul className="ml-5 mt-1 text-sm text-gray-600 text-left">
            /{desc}/
          </ul>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.isArray(postsData) && postsData.length > 0 ? (
            postsData.map(post => (
              <Card key={post.newsid} className="bg-white border border-gray-200 rounded-xl shadow-sm 
             hover:shadow-lg hover:scale-[1.02] hover:border-blue-500 
             transition-all duration-300 ease-in-out 
             flex flex-col justify-between cursor-pointer">
                <Link href={`/detail/${post.newsid}`}>
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
                      <span className='text-right'>{post.ordernum}</span>
                    </div>
                    <div className="py-2 flex justify-between">
                      <span className="font-medium text-gray-600">Хөрөнгө оруулалтын эх үүсвэр</span>
                      <span className='text-right'>{post.source}</span>
                    </div>
                    <div className="py-2 flex justify-between">
                      <span className="font-medium text-gray-600">Хороо</span>
                      <span className='text-right'>
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
                      <span className='text-right'>{Number(post.totalcost).toLocaleString()}₮</span>
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
                      <span className="font-medium text-gray-600">Захиалагчийн хяналтын байгууллага</span>
                      <span className='text-right'>{post.engener}</span>
                    </div>
                    <div className="py-2 flex justify-between">
                      <span className="font-medium text-gray-600">Хугацаа</span>
                      <span className='text-right'>
                        {new Date(post.startdate).toLocaleDateString('ja-JP')} - {new Date(post.enddate).toLocaleDateString('ja-JP')}
                      </span>
                    </div>
                    <div className="py-2 flex justify-between">
                      <span className="font-medium text-gray-600">Ажлын явц</span>
                      <span className='text-right'>{post.impphase}</span>
                    </div>
                    <div className="py-2 flex justify-between">
                      <span className="font-medium text-gray-600">Салбар</span>
                      <span className='text-right'>{post.branch}</span>
                    </div>
                    <div className="py-2 flex justify-between">
                      <span className="font-medium text-gray-600">Гүйцэтгэлийн хувь</span>
                      <span className='text-right'>{post.imppercent}%</span>
                    </div>
                    <div className="mt-3 relative w-full bg-gray-300 rounded-full h-2">
                      <div
                        className={`absolute top-0 left-0 h-2 rounded-full ${getProgressColor(post.imppercent)}`}
                        style={{ width: `${post.imppercent}%` }}
                      ></div>
                    </div>
                  </CardContent>

                  <CardFooter className="flex justify-end p-4 pt-2 border-t border-gray-100">

                    <span className="text-sm font-medium text-blue-700 hover:underline hover:text-blue-900">
                      Дэлгэрэнгүй →
                    </span>

                  </CardFooter>
                </Link>
              </Card>
            ))

          ) : (
            <></>
          )}
        </div>
      </main>
    </>
  );
}

const InfoItem = ({ label, value }: { label: string; value?: React.ReactNode }) => (

  <div className="flex justify-between items-center p-2 border rounded-lg bg-gray-100">
    <span className="text-sm font-medium text-blue-600 ">{label}</span>
    <span className='text-right'>{value}</span>

  </div>
);

export default Detail;
