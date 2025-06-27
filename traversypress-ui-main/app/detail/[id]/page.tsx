
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
interface Image {
  id: number;
  imagepath: string;
  imageid: number;
}

const Detail = ({ params }: { params: { id: string } }) => {
  const { toast } = useToast();
  const id = params.id
  const [isLoaded, setIsLoaded] = useState(false);
  const [postsData, setpostsData] = useState<postsDatas | null>(null);
  const [images, setImages] = useState<Image[]>([]);
  const getProgressColor = (percent: number) => {
    if (percent < 50) return 'bg-red-500';
    if (percent < 80) return 'bg-yellow-500';
    return 'bg-green-500';
  };
  let imageUrl = ''; // API image URL

  useEffect(() => {

    const fetchImages = async () => {
      try {
        const res = await fetch(`https://shdmonitoring.ub.gov.mn/api/image/${id}`);
        const data = await res.json();
        setImages(data.images);
        console.log("imge data", data)
      } catch (err) {
        console.error('Алдаа:', err)
      }
    };
    fetchImages();
    const fetchpostsDatas = async () => {
      try {

        const res = await fetch('https://shdmonitoring.ub.gov.mn/api/posts/detail', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json; charset=utf-8',
          },
          body: JSON.stringify({ id }),
        });
        imageUrl = res.url;
        setIsLoaded(true);
        console.log("res", res)
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
              <div className="relative w-[300px] h-[200px]">
                {!isLoaded && (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                    <span className="text-gray-400">Loading image...</span>
                  </div>
                )}
                {/* <img
                  src={imageUrl}
                  alt="Image"
                  className={`w-full h-full object-cover transition-opacity duration-500 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
                  onLoad={() => setIsLoaded(true)}
                  onError={() => console.log('Image load error')}
                /> */}
                {Array.isArray(images) && images.length > 0 ? (
                  <div className="grid grid-cols-2 gap-4">
                    {images.map((img) => (
                      <img
                        key={img.imageid}
                        src={`https://shdmonitoring.ub.gov.mn/${img.imagepath}`}
                        // src={`https://shdmonitoring.ub.gov.mn/${img.imagepath.split('/').pop()}`}

                        alt="uploaded"
                        className="w-full h-auto border rounded-md shadow"
                      />
                    ))}
                  </div>
                ) : (
                  <p>Зураг олдсонгүй</p>
                )}
                {/* <div className="grid grid-cols-2 gap-4">
                  {images.map((img) => (
                    <img
                      key={img.id}
                      src={`https://shdmonitoring.ub.gov.mn/${img.imagepath}`}
                      alt="uploaded"
                      className="w-full h-auto border rounded-md shadow"
                    />
                  ))}
                </div> */}
              </div>
              {/* <div className="relative h-[250px] md:h-[400px] w-full">
                <Image
                  src={imageUrl}
                  alt="Зураг"
                  fill
                  className="object-cover opacity-90"
                />
                <div className="absolute inset-0 bg-black bg-opacity-20" />
              </div> */}
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
                <InfoItem label="Ажлын явц" value={postsData?.impphase} />

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
