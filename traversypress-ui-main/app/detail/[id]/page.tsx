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
import { useToast } from '@/components/ui/use-toast';
import Image from 'next/image';
interface postsDatas {
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


const Detail = ({ params }: { params: { id: string } }) => {
  const { toast } = useToast();

  const id = params.id
  // export default async function Home() {
  const [postsData, setpostsData] = useState<postsDatas | null>(null);
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const imageUrl = "https://images.unsplash.com/photo-1506744038136-46273834b3fb";

  useEffect(() => {
    const fetchpostsDatas = async () => {
      try {
        const res = await fetch('http://localhost:4000/api/posts/detail', {
          method: 'post',
          headers: {
            'Content-Type': 'application/json; charset=utf-8',
          },
          body: JSON.stringify({ "id": id }),
        });
        // const res = await fetch(`http://localhost:4000/api/postsDatas/detail`)

        if (!res.ok) {
          throw new Error('Амжилтгүй');
        }

        const json = await res.json()
        console.log("json", json)
        setpostsData(json.data)
        // setTotalPages(json.total)
      } catch (err) {
        console.error('Алдаа:', err)
      }
    }
    fetchpostsDatas()
  }, [id])
  return (
    <main>
      {/* <div className="grid grid-cols-1 gap-5 ml-5 mt-5"> */}
      <div className="grid grid-cols-6 gap-6">
        {/* Дунд 2 баганад байрлана: 2-р баганаас эхэлж 2 багана эзэлнэ */}
        <div className="col-start-2 col-span-4 bg-gray-100 p-4 text-center">
          <Card key={postsData?.newsid} className="flex flex-col justify-between">
            <CardHeader className="flex-row gap-4 items-center">
              <div>
                <CardTitle>
                  {postsData?.title}
                  {/* <Badge variant="secondary">{postsData?.title}</Badge> */}
                </CardTitle>
                <CardDescription>
                  {postsData?.updatedat
                    ? `Сүүлд шинэчлэгдсэн огноо: ${new Date(postsData.updatedat).toLocaleDateString()}`
                    : postsData?.createdat
                      ? `Бүртгэсэн огноо: ${new Date(postsData.createdat).toLocaleDateString()}`
                      : 'Огноо олдсонгүй'}
                  {/* </CardDescription> */}
                  {/* {postsData?.updatedat == null
                    ? `Бүртгэсэн огноо: ${new Date(postsData?.createdat).toLocaleDateString()}`
                    : `Сүүлд шинэчлэгдсэн огноо: ${new Date(postsData?.updatedat).toLocaleDateString()}`} */}
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <Image
                src={imageUrl}
                alt="Жишээ зураг"
                width={800}
                height={450}
                className="rounded-lg"
                style={{ objectFit: 'cover' }}
              />
            </CardContent>
            <CardContent className="flex justify-between items-center">
              {/* <span>Захирамж №:</span> */}
              <Badge variant="secondary">Захирамж №:</Badge>
              <Badge variant="outline">{postsData?.contractor}</Badge>
            </CardContent>
            <CardContent className="flex justify-between items-center">
              {/* <span>Эх үүсвэр:</span> */}
              <Badge variant="secondary">Эх үүсвэр:</Badge>
              <Badge variant="outline">{postsData?.source}</Badge>
            </CardContent>
            <CardContent className="flex justify-between items-center">
              {/* <span>Хороо:</span> */}
              <Badge variant="secondary">Хороо:</Badge>
              <Badge variant="outline">{postsData?.khoroo}</Badge>
              {/* <span>{postsData?.khoroo} </span> */}
            </CardContent>
            <CardContent className="flex justify-between items-center">
              {/* <span>Төсөвт өртөг:</span> */}
              <Badge variant="secondary">Төсөвт өртөг:</Badge>
              <Badge variant="outline">{postsData?.totalcost}</Badge>
              {/* <span>{postsData?.totalcost} </span> */}
            </CardContent>
            <CardContent className="flex justify-between items-center">
              {/* <span>Гүйцэтгэгч:</span> */}
              <Badge variant="secondary">Гүйцэтгэгч:</Badge>
              <Badge variant="outline">{postsData?.contractor}</Badge>
              {/* <span>{postsData?.contractor} </span> */}
            </CardContent>
            <CardContent className="flex justify-between items-center">
              {/* <span>Гэрээний дүн (₮):</span> */}
              <Badge variant="secondary">Гэрээний дүн (₮):</Badge>
              <Badge variant="outline">{postsData?.contractcost}</Badge>
              {/* <span>{postsData?.contractcost}₮ </span> */}
            </CardContent>
            <CardContent className="flex justify-between items-center">
              {/* <span>Хариуцсан инженер:</span> */}
              <Badge variant="secondary">Хариуцсан инженер:</Badge>
              <Badge variant="outline">{postsData?.engener}</Badge>
              {/* <span>{postsData?.engener} </span> */}
            </CardContent>
            <CardContent className="flex justify-between items-center">
              {/* <span>Гэрээний хугацаа:</span> */}
              <Badge variant="secondary">Гэрээний хугацаа:</Badge>
              <Badge variant="outline">
                {postsData?.startdate
                  ? `${new Date(postsData.startdate).toLocaleDateString()} - ${postsData?.enddate ? new Date(postsData.enddate).toLocaleDateString() : '...'}`
                  : 'Огноо байхгүй'}
              </Badge>

              {/* <Badge variant="outline">{`${new Date(postsData?.startdate).toLocaleDateString()}-${new Date(postsData?.enddate).toLocaleDateString()}`}</Badge> */}
            </CardContent>
            <CardContent className="flex justify-between items-center">
              <Badge variant="secondary">Хэрэгжилтийн үе шат:</Badge>
              <Badge variant="outline">{postsData?.impphase}</Badge>
              {/* <span>{postsData?.impphase} </span> */}
            </CardContent>
            <CardContent className="flex justify-between items-center">
              <Badge variant="secondary">Хэрэгжилтийн хувь:</Badge>
              <Badge variant="outline">{postsData?.imppercent}%</Badge>
              {/* <span>{postsData?.imppercent}% </span> */}
            </CardContent>
            <CardFooter className="flex justify-end">
              {/* <CardContent className="text-center"> */}
              {postsData?.news}
              {/* </CardContent> */}
            </CardFooter>
          </Card>
        </div>
      </div>


    </main>
  )
}
export default Detail;
