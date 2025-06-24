// 'use client';
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardFooter,
//   CardHeader,
//   CardTitle
// } from '@/components/ui/card'
// import { Badge } from '@/components/ui/badge'
// import { useEffect, useState } from 'react'
// import Link from 'next/link';
// import { useToast } from '@/components/ui/use-toast';
// import Image from 'next/image';
// interface postsDatas {
//   newsid: number
//   title: string
//   ordernum: string
//   contractor: string
//   contractcost: number
//   engener: string
//   startdate: Date
//   enddate: Date
//   impphase: string
//   imppercent: number
//   source: string
//   totalcost: number
//   news: String
//   createdat: Date
//   updatedat: Date
//   khoroo: string
// }


// const Detail = ({ params }: { params: { id: string } }) => {
//   const { toast } = useToast();

//   const id = params.id
//   // export default async function Home() {
//   const [postsData, setpostsData] = useState<postsDatas | null>(null);
//   const [page, setPage] = useState(1)
//   const [totalPages, setTotalPages] = useState(1)
//   const imageUrl = "https://images.unsplash.com/photo-1506744038136-46273834b3fb";

//   useEffect(() => {
//     const fetchpostsDatas = async () => {
//       try {
//         const res = await fetch('https://shdmonitoring.ub.gov.mn/api/posts/detail', {
//           method: 'post',
//           headers: {
//             'Content-Type': 'application/json; charset=utf-8',
//           },
//           body: JSON.stringify({ "id": id }),
//         });
//         // const res = await fetch(`http://localhost:4000/api/postsDatas/detail`)

//         if (!res.ok) {
//           throw new Error('Амжилтгүй');
//         }

//         const json = await res.json()
//         console.log("json", json)
//         setpostsData(json.data)
//         // setTotalPages(json.total)
//       } catch (err) {
//         console.error('Алдаа:', err)
//       }
//     }
//     fetchpostsDatas()
//   }, [id])
//   return (
//     <main>
//       {/* <div className="grid grid-cols-1 gap-5 ml-5 mt-5"> */}
//       <div className="grid grid-cols-6 gap-6">
//         {/* Дунд 2 баганад байрлана: 2-р баганаас эхэлж 2 багана эзэлнэ */}
//         <div className="col-start-2 col-span-4 bg-gray-100 p-4 text-center">
//           <Card key={postsData?.newsid} className="flex flex-col justify-between">
//             <CardHeader className="flex-row gap-4 items-center">
//               <div>
//                 <CardTitle>
//                   {postsData?.title}
//                   {/* <Badge variant="secondary">{postsData?.title}</Badge> */}
//                 </CardTitle>
//                 <CardDescription>
//                   {postsData?.updatedat
//                     ? `Сүүлд шинэчлэгдсэн огноо: ${new Date(postsData.updatedat).toLocaleDateString()}`
//                     : postsData?.createdat
//                       ? `Бүртгэсэн огноо: ${new Date(postsData.createdat).toLocaleDateString()}`
//                       : 'Огноо олдсонгүй'}
//                   {/* </CardDescription> */}
//                   {/* {postsData?.updatedat == null
//                     ? `Бүртгэсэн огноо: ${new Date(postsData?.createdat).toLocaleDateString()}`
//                     : `Сүүлд шинэчлэгдсэн огноо: ${new Date(postsData?.updatedat).toLocaleDateString()}`} */}
//                 </CardDescription>
//               </div>
//             </CardHeader>
//             <CardContent>
//               <Image
//                 src={imageUrl}
//                 alt="Жишээ зураг"
//                 width={800}
//                 height={450}
//                 className="rounded-lg"
//                 style={{ objectFit: 'cover' }}
//               />
//             </CardContent>
//             <CardContent className="flex justify-between items-center">
//               {/* <span>Захирамж №:</span> */}
//               <Badge variant="secondary">Захирамж №:</Badge>
//               <Badge variant="outline">{postsData?.contractor}</Badge>
//             </CardContent>
//             <CardContent className="flex justify-between items-center">
//               {/* <span>Эх үүсвэр:</span> */}
//               <Badge variant="secondary">Эх үүсвэр:</Badge>
//               <Badge variant="outline">{postsData?.source}</Badge>
//             </CardContent>
//             <CardContent className="flex justify-between items-center">
//               {/* <span>Хороо:</span> */}
//               <Badge variant="secondary">Хороо:</Badge>
//               <Badge variant="outline">{postsData?.khoroo}</Badge>
//               {/* <span>{postsData?.khoroo} </span> */}
//             </CardContent>
//             <CardContent className="flex justify-between items-center">
//               {/* <span>Төсөвт өртөг:</span> */}
//               <Badge variant="secondary">Төсөвт өртөг:</Badge>
//               <Badge variant="outline">{postsData?.totalcost}</Badge>
//               {/* <span>{postsData?.totalcost} </span> */}
//             </CardContent>
//             <CardContent className="flex justify-between items-center">
//               {/* <span>Гүйцэтгэгч:</span> */}
//               <Badge variant="secondary">Гүйцэтгэгч:</Badge>
//               <Badge variant="outline">{postsData?.contractor}</Badge>
//               {/* <span>{postsData?.contractor} </span> */}
//             </CardContent>
//             <CardContent className="flex justify-between items-center">
//               {/* <span>Гэрээний дүн (₮):</span> */}
//               <Badge variant="secondary">Гэрээний дүн (₮):</Badge>
//               <Badge variant="outline">{postsData?.contractcost}</Badge>
//               {/* <span>{postsData?.contractcost}₮ </span> */}
//             </CardContent>
//             <CardContent className="flex justify-between items-center">
//               {/* <span>Хариуцсан инженер:</span> */}
//               <Badge variant="secondary">Хариуцсан инженер:</Badge>
//               <Badge variant="outline">{postsData?.engener}</Badge>
//               {/* <span>{postsData?.engener} </span> */}
//             </CardContent>
//             <CardContent className="flex justify-between items-center">
//               {/* <span>Гэрээний хугацаа:</span> */}
//               <Badge variant="secondary">Гэрээний хугацаа:</Badge>
//               <Badge variant="outline">
//                 {postsData?.startdate
//                   ? `${new Date(postsData.startdate).toLocaleDateString()} - ${postsData?.enddate ? new Date(postsData.enddate).toLocaleDateString() : '...'}`
//                   : 'Огноо байхгүй'}
//               </Badge>

//               {/* <Badge variant="outline">{`${new Date(postsData?.startdate).toLocaleDateString()}-${new Date(postsData?.enddate).toLocaleDateString()}`}</Badge> */}
//             </CardContent>
//             <CardContent className="flex justify-between items-center">
//               <Badge variant="secondary">Хэрэгжилтийн үе шат:</Badge>
//               <Badge variant="outline">{postsData?.impphase}</Badge>
//               {/* <span>{postsData?.impphase} </span> */}
//             </CardContent>
//             <CardContent className="flex justify-between items-center">
//               <Badge variant="secondary">Хэрэгжилтийн хувь:</Badge>
//               <Badge variant="outline">{postsData?.imppercent}%</Badge>
//               {/* <span>{postsData?.imppercent}% </span> */}
//             </CardContent>
//             <CardFooter className="flex justify-end">
//               {/* <CardContent className="text-center"> */}
//               {postsData?.news}
//               {/* </CardContent> */}
//             </CardFooter>
//           </Card>
//         </div>
//       </div>


//     </main>
//   )
// }
// export default Detail;
// 'use client'
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardFooter,
//   CardHeader,
//   CardTitle
// } from '@/components/ui/card'
// import { Badge } from '@/components/ui/badge'
// import { useEffect, useState } from 'react'
// import { useToast } from '@/components/ui/use-toast'
// import Image from 'next/image'

// interface postsDatas {
//   newsid: number
//   title: string
//   ordernum: string
//   contractor: string
//   contractcost: number
//   engener: string
//   startdate: Date
//   enddate: Date
//   impphase: string
//   imppercent: number
//   source: string
//   totalcost: number
//   news: String
//   createdat: Date
//   updatedat: Date
//   khoroo: string
//   images?: string[] // олон зураг ирэх боломж
// }

// const Detail = ({ params }: { params: { id: string } }) => {
//   const { toast } = useToast()
//   const id = params.id
//   const [postsData, setpostsData] = useState<postsDatas | null>(null)

//   useEffect(() => {
//     const fetchpostsDatas = async () => {
//       try {
//         const res = await fetch('https://shdmonitoring.ub.gov.mn/api/posts/detail', {
//           method: 'POST',
//           headers: {
//             'Content-Type': 'application/json; charset=utf-8',
//           },
//           body: JSON.stringify({ id }),
//         })

//         if (!res.ok) throw new Error('Амжилтгүй')
//         const json = await res.json()
//         setpostsData(json.data)
//       } catch (err) {
//         console.error('Алдаа:', err)
//       }
//     }
//     fetchpostsDatas()
//   }, [id])

//   return (
//     <main className="p-6 bg-gray-50 min-h-screen">
//       <div className="grid grid-cols-1 md:grid-cols-6 gap-6">
//         <div className="md:col-start-2 md:col-span-4">
//           <Card className="shadow-xl rounded-2xl overflow-hidden border border-gray-200 bg-white transition hover:shadow-2xl">
//             <CardHeader className="space-y-2">
//               <CardTitle className="text-2xl font-bold text-gray-800">{postsData?.title}</CardTitle>
//               <CardDescription className="text-sm text-gray-500">
//                 {postsData?.updatedat
//                   ? `Сүүлд шинэчлэгдсэн: ${new Date(postsData.updatedat).toLocaleDateString()}`
//                   : postsData?.createdat
//                     ? `Бүртгэсэн: ${new Date(postsData.createdat).toLocaleDateString()}`
//                     : 'Огноо олдсонгүй'}
//               </CardDescription>
//             </CardHeader>

//             {/* --- 🖼️ Олон зурагтай гүйлгэдэг хэсэг --- */}
//             <div className="w-full overflow-x-auto whitespace-nowrap px-4 py-2 space-x-4 flex">
//               {(postsData?.images ?? ["https://images.unsplash.com/photo-1506744038136-46273834b3fb"]).map((img, index) => (
//                 <div
//                   key={index}
//                   className="inline-block min-w-[300px] md:min-w-[500px] relative h-[200px] md:h-[350px] rounded-lg overflow-hidden border shadow-sm"
//                 >
//                   <Image
//                     src={img}
//                     alt={`зураг-${index}`}
//                     fill
//                     className="object-cover"
//                   />
//                 </div>
//               ))}
//             </div>
//             {/* --- END images --- */}

//             <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
//               <InfoItem label="Захирамж №" value={postsData?.ordernum} />
//               <InfoItem label="Эх үүсвэр" value={postsData?.source} />
//               <InfoItem label="Хороо" value={postsData?.khoroo} />
//               <InfoItem label="Төсөвт өртөг" value={postsData?.totalcost + '₮'} />
//               <InfoItem label="Гүйцэтгэгч" value={postsData?.contractor} />
//               <InfoItem label="Гэрээний дүн" value={postsData?.contractcost + '₮'} />
//               <InfoItem label="Хариуцсан инженер" value={postsData?.engener} />
//               <InfoItem
//                 label="Гэрээний хугацаа"
//                 value={
//                   postsData?.startdate
//                     ? `${new Date(postsData.startdate).toLocaleDateString()} - ${postsData?.enddate ? new Date(postsData.enddate).toLocaleDateString() : '...'}`
//                     : 'Огноо байхгүй'
//                 }
//               />
//               <InfoItem label="Хэрэгжилтийн үе шат" value={postsData?.impphase} />
//               <InfoItem label="Хэрэгжилтийн хувь" value={`${postsData?.imppercent}%`} />
//             </CardContent>

//             {postsData?.news && (
//               <CardFooter className="text-sm text-gray-700 bg-gray-50 px-6 py-4">
//                 {postsData.news}
//               </CardFooter>
//             )}
//           </Card>
//         </div>
//       </div>
//     </main>
//   )
// }

// const InfoItem = ({ label, value }: { label: string, value?: string | number }) => (
//   <div className="flex justify-between items-center p-2 border rounded-lg bg-gray-100">
//     <span className="text-sm font-medium text-gray-600">{label}</span>
//     <Badge variant="outline" className="ml-2">{value ?? '...'}</Badge>
//   </div>
// )

// export default Detail

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
  news: string
  branch: string
  createdat: Date
  updatedat: Date
  khoroo: string
}

const Detail = ({ params }: { params: { id: string } }) => {
  const { toast } = useToast();
  const id = params.id
  const [postsData, setpostsData] = useState<postsDatas | null>(null);
  const getProgressColor = (percent: number) => {
    if (percent < 50) return 'bg-red-500';
    if (percent < 80) return 'bg-yellow-500';
    return 'bg-green-500';
  };
  const imageUrl = "https://images.unsplash.com/photo-1506744038136-46273834b3fb";

  useEffect(() => {
    const fetchpostsDatas = async () => {
      try {
        const res = await fetch('https://shdmonitoring.ub.gov.mn/api/posts/detail', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json; charset=utf-8',
          },
          body: JSON.stringify({ id }),
        });

        if (!res.ok) throw new Error('Амжилтгүй');
        const json = await res.json()
        setpostsData(json.data)
      } catch (err) {
        console.error('Алдаа:', err)
      }
    }
    fetchpostsDatas()
  }, [id]);

  return (
    <>
      <main className="p-6 bg-gray-50 min-h-screen">
        <div className="grid grid-cols-1 md:grid-cols-6 gap-6">
          <div className="md:col-start-2 md:col-span-4">
            <Card className="shadow-xl rounded-2xl overflow-hidden border border-gray-200 bg-white transition hover:shadow-2xl">
              <CardHeader className="space-y-2 text-blue-600">
                <CardTitle className="text-2xl font-bold text-gray-800">{postsData?.title}</CardTitle>
                <CardDescription className="text-sm text-gray-500">
                  {postsData?.updatedat
                    ? `Сүүлд шинэчлэгдсэн: ${new Date(postsData.updatedat).toLocaleDateString()}`
                    : postsData?.createdat
                      ? `Бүртгэсэн: ${new Date(postsData.createdat).toLocaleDateString()}`
                      : 'Огноо олдсонгүй'}
                </CardDescription>
              </CardHeader>

              <div className="relative h-[250px] md:h-[400px] w-full">
                <Image
                  src={imageUrl}
                  alt="Зураг"
                  fill
                  className="object-cover opacity-90"
                />
                <div className="absolute inset-0 bg-black bg-opacity-20" />
              </div>
              {postsData?.news && (
                <CardFooter className="text-sm text-gray-700 bg-gray-50 px-6 py-4">
                  {postsData.news}
                </CardFooter>
              )}

              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                <InfoItem label="Захирамж №" value={postsData?.ordernum} />
                <InfoItem label="Хөрөнгө оруулалтын эх үүсвэр" value={postsData?.source} />
                <InfoItem label="Хороо" value={postsData?.khoroo} />
                <InfoItem label="Төсөвт өртөг" value={Number(postsData?.totalcost).toLocaleString() + '₮'} />
                <InfoItem label="Гүйцэтгэгч" value={postsData?.contractor} />
                <InfoItem label="Гэрээний дүн" value={Number(postsData?.contractcost).toLocaleString() + '₮'} />
                <InfoItem label="Захиалагчын хяналтын байгууллага" value={postsData?.engener} />
                <InfoItem label="Салбар" value={postsData?.branch} />
                <InfoItem
                  label="Гэрээний хугацаа"
                  value={
                    postsData?.startdate
                      ? `${new Date(postsData.startdate).toLocaleDateString()} - ${postsData?.enddate ? new Date(postsData.enddate).toLocaleDateString() : '...'}`
                      : 'Огноо байхгүй'
                  }
                />
                <InfoItem label="Хэрэгжилтийн хувь" value={`${postsData?.imppercent}%`} />
                <InfoItem label="Хэрэгжилтийн үе шат" value={postsData?.impphase} />

                <div className="mt-3 relative w-full bg-gray-300 rounded-full h-2">
                  <div
                    className={`absolute top-0 left-0 h-2 rounded-full ${getProgressColor(Number(postsData?.imppercent))}`}
                    style={{ width: `${Number(postsData?.imppercent)}%` }}
                  ></div>
                </div>
              </CardContent>


            </Card>
          </div>
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

const InfoItem = ({ label, value }: { label: string, value?: string }) => (
  <div className="flex justify-between items-center p-2 border rounded-lg bg-gray-100">
    <span className="text-sm font-medium text-blue-600 ">{label}</span>
    {value}
  </div>
);

export default Detail;
