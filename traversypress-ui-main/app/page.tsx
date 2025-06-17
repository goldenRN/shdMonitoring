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
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
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
  createdat: Date
  updatedat: Date
  khoroo: string
}



export default async function Home() {
  const [postsData, setPostsData] = useState<Posts[]>([])
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch(`http://localhost:4000/api/posts`)
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
    <main>
      <div className="grid grid-cols-3 gap-5 ml-5 mt-5">
        {postsData.map(post => (
          <Card key={post.newsid} className="flex flex-col justify-between">
            <CardHeader className="flex-row gap-4 items-center">

              <div>
                <CardTitle>
                  {post.title}
                  {/* <Badge variant="secondary">{post.title}</Badge> */}
                </CardTitle>
                <CardDescription>
                  {post.updatedat == null
                    ? `Бүртгэсэн огноо: ${new Date(post.createdat).toLocaleDateString()}`
                    : `Сүүлд шинэчлэгдсэн огноо: ${new Date(post.updatedat).toLocaleDateString()}`}
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="flex justify-between items-center">
              {/* <span>Захирамж №:</span> */}
              <Badge variant="secondary">Захирамж №:</Badge>
              <Badge variant="outline">{post.contractor}</Badge>
            </CardContent>
            <CardContent className="flex justify-between items-center">
              {/* <span>Эх үүсвэр:</span> */}
              <Badge variant="secondary">Эх үүсвэр:</Badge>
              <Badge variant="outline">{post.source}</Badge>
            </CardContent>
            <CardContent className="flex justify-between items-center">
              {/* <span>Хороо:</span> */}
              <Badge variant="secondary">Хороо:</Badge>
              <Badge variant="outline">{post.khoroo}</Badge>
              {/* <span>{post.khoroo} </span> */}
            </CardContent>
            <CardContent className="flex justify-between items-center">
              {/* <span>Төсөвт өртөг:</span> */}
              <Badge variant="secondary">Төсөвт өртөг:</Badge>
              <Badge variant="outline">{post.totalcost}</Badge>
              {/* <span>{post.totalcost} </span> */}
            </CardContent>
            <CardContent className="flex justify-between items-center">
              {/* <span>Гүйцэтгэгч:</span> */}
              <Badge variant="secondary">Гүйцэтгэгч:</Badge>
              <Badge variant="outline">{post.contractor}</Badge>
              {/* <span>{post.contractor} </span> */}
            </CardContent>
            <CardContent className="flex justify-between items-center">
              {/* <span>Гэрээний дүн (₮):</span> */}
              <Badge variant="secondary">Гэрээний дүн (₮):</Badge>
              <Badge variant="outline">{post.contractcost}</Badge>
              {/* <span>{post.contractcost}₮ </span> */}
            </CardContent>
            <CardContent className="flex justify-between items-center">
              {/* <span>Хариуцсан инженер:</span> */}
              <Badge variant="secondary">Хариуцсан инженер:</Badge>
              <Badge variant="outline">{post.engener}</Badge>
              {/* <span>{post.engener} </span> */}
            </CardContent>
            <CardContent className="flex justify-between items-center">
              {/* <span>Гэрээний хугацаа:</span> */}
              <Badge variant="secondary">Гэрээний хугацаа:</Badge>
              <Badge variant="outline">{`${new Date(post.startdate).toLocaleDateString()}-${new Date(post.enddate).toLocaleDateString()}`}</Badge>
            </CardContent>
            <CardContent className="flex justify-between items-center">
              <Badge variant="secondary">Хэрэгжилтийн үе шат:</Badge>
              <Badge variant="outline">{post.impphase}</Badge>
              {/* <span>{post.impphase} </span> */}
            </CardContent>
            <CardContent className="flex justify-between items-center">
              <Badge variant="secondary">Хэрэгжилтийн хувь:</Badge>
              <Badge variant="outline">{post.imppercent}%</Badge>
              {/* <span>{post.imppercent}% </span> */}
            </CardContent>
            <CardFooter className="flex justify-end">
              <Link href={`/detail/${post.newsid}`}>
                {/* <Button>Дэлгэрэнгүй харах</Button> */}
                <Badge variant="default">Дэлгэрэнгүй</Badge>

              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>
    </main>
  )
}
