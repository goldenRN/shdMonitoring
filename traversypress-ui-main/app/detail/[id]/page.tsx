
'use client';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useEffect, useMemo, useState } from 'react';
import AutoImageSlider from '@/components/autoslider';

interface PostData {
  newsid: number;
  title: string;
  ordernum: string;
  contractor: string;
  contractcost: number;
  engener: string;
  startdate: string;
  enddate: string;
  impphase: string;
  imppercent: number;
  source: string;
  totalcost: number;
  news: string;
  branch: string;
  createdat: string;
  updatedat: string | null;
  khoroos: { name: string }[];
}
interface RawPostData {
  newsid?: number;
  newsId?: number;
  title?: string;
  ordernum?: string;
  orderNum?: string;
  contractor?: string;
  contractcost?: number | string;
  contractCost?: number | string;
  engener?: string;
  supervisor?: string;
  startdate?: string;
  startDate?: string;
  enddate?: string;
  endDate?: string;
  impphase?: string;
  impPhase?: string;
  imppercent?: number | string;
  impPercent?: number | string;
  source?: string;
  totalcost?: number | string;
  totalCost?: number | string;
  branch?: string;
  createdat?: string;
  createdAt?: string;
  updatedat?: string | null;
  updatedAt?: string | null;
  khoroos?: { name?: string }[];
  news?: string;
}
interface Image {
  id: number;
  imagepath: string;
  imageid: number;
}

const toNumber = (value: unknown) => {
  if (typeof value === 'number') return value;
  if (typeof value === 'string') {
    const parsed = Number(value);
    return Number.isNaN(parsed) ? 0 : parsed;
  }
  return 0;
};

const normalizePost = (raw: RawPostData): PostData => ({
  newsid: raw.newsid ?? raw.newsId ?? 0,
  title: raw.title ?? '',
  ordernum: raw.ordernum ?? raw.orderNum ?? '',
  contractor: raw.contractor ?? '',
  contractcost: toNumber(raw.contractcost ?? raw.contractCost),
  engener: raw.engener ?? raw.supervisor ?? '',
  startdate: raw.startdate ?? raw.startDate ?? '',
  enddate: raw.enddate ?? raw.endDate ?? '',
  impphase: raw.impphase ?? raw.impPhase ?? '',
  imppercent: toNumber(raw.imppercent ?? raw.impPercent),
  source: raw.source ?? '',
  totalcost: toNumber(raw.totalcost ?? raw.totalCost),
  news: raw.news ?? '',
  branch: raw.branch ?? '',
  createdat: raw.createdat ?? raw.createdAt ?? '',
  updatedat: raw.updatedat ?? raw.updatedAt ?? null,
  khoroos: Array.isArray(raw.khoroos)
    ? raw.khoroos.map((item) => ({ name: item?.name ?? '-' }))
    : [],
});

const formatDate = (value?: string | null) => {
  if (!value) return '-';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '-';
  return date.toLocaleDateString('mn-MN');
};

const formatMoney = (value?: number | null) => {
  if (typeof value !== 'number' || Number.isNaN(value)) return '-';
  return `${value.toLocaleString('mn-MN')}₮`;
};

const getProgressColor = (percent: number) => {
  if (percent < 50) return 'bg-red-500';
  if (percent < 80) return 'bg-amber-500';
  return 'bg-emerald-500';
};

const Detail = ({ params }: { params: { id: string } }) => {
  const id = params.id;
  const [isLoaded, setIsLoaded] = useState(false);
  const [postData, setPostData] = useState<PostData | null>(null);
  const [images, setImages] = useState<Image[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setError(null);
        setIsLoaded(false);

        const [imageResult, postRes] = await Promise.all([
          fetch(`https://shdmonitoring.ub.gov.mn/api/image/${id}`)
            .then(async (res) => {
              if (!res.ok) return { images: [] };
              return res.json();
            })
            .catch(() => ({ images: [] })),
          fetch('https://shdmonitoring.ub.gov.mn/api/posts/detail', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json; charset=utf-8' },
            body: JSON.stringify({ id }),
          })
        ]);

        setImages(Array.isArray(imageResult.images) ? imageResult.images : []);

        if (postRes.ok) {
          const postJson = await postRes.json();
          setPostData(postJson?.data ? normalizePost(postJson.data as RawPostData) : null);
          return;
        }

        // detail endpoint нь зөвхөн active мэдээлэл буцаах үед 404 бол архивоос хайна
        if (postRes.status === 404) {
          const archiveRes = await fetch('https://shdmonitoring.ub.gov.mn/api/posts/archive');
          if (archiveRes.ok) {
            const archiveJson = await archiveRes.json();
            const found =
              Array.isArray(archiveJson)
                ? archiveJson.find((item: RawPostData) => Number(item.newsid ?? item.newsId) === Number(id))
                : null;
            if (found) {
              setPostData(normalizePost(found));
              return;
            }
          }
        }

        throw new Error('Дэлгэрэнгүй мэдээлэл олдсонгүй.');
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Серверийн алдаа.');
      } finally {
        setIsLoaded(true);
      }
    };

    fetchData();
  }, [id]);

  const khorooText = useMemo(() => {
    if (!postData?.khoroos?.length) return 'Хороо байхгүй';
    return postData.khoroos.map((khr) => khr.name).join(', ');
  }, [postData]);

  const percent = Math.max(0, Math.min(100, Number(postData?.imppercent ?? 0)));

  return (
    <main className='min-h-screen bg-slate-50 p-4 md:p-6'>
      <div className='mx-auto max-w-6xl'>
        <Card className='overflow-hidden border-slate-200 shadow-sm'>
          <CardHeader className='space-y-2 border-b border-slate-100 bg-white'>
            <CardTitle className='text-xl md:text-2xl font-bold text-slate-800'>{postData?.title ?? 'Дэлгэрэнгүй'}</CardTitle>
            <CardDescription className='text-sm text-slate-500'>
              {postData?.updatedat
                ? `Сүүлд шинэчилсэн: ${formatDate(postData.updatedat)}`
                : `Бүртгэсэн: ${formatDate(postData?.createdat)}`}
            </CardDescription>
          </CardHeader>

          {!error && <AutoImageSlider images={images} isLoaded={isLoaded} />}

          {error && (
            <div className='p-6 text-sm text-red-700 bg-red-50 border-y border-red-100'>{error}</div>
          )}

          {postData?.news && (
            <CardFooter className='border-b border-slate-100 bg-slate-50 px-6 py-4 text-sm text-slate-700'>
              {postData.news}
            </CardFooter>
          )}

          <CardContent className='space-y-4 p-4 md:p-6'>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
              <InfoItem label='Захирамж №' value={postData?.ordernum || '-'} />
              <InfoItem label='Эх үүсвэр' value={postData?.source || '-'} />
              <InfoItem label='Хороо' value={khorooText} />
              <InfoItem label='Салбар' value={postData?.branch || '-'} />
              <InfoItem label='Гүйцэтгэгч' value={postData?.contractor || '-'} />
              <InfoItem label='Хяналтын байгууллага' value={postData?.engener || '-'} />
              <InfoItem label='Төсөвт өртөг' value={formatMoney(postData?.totalcost)} />
              <InfoItem label='Гэрээний дүн' value={formatMoney(postData?.contractcost)} />
              <InfoItem
                label='Гэрээний хугацаа'
                value={`${formatDate(postData?.startdate)} - ${formatDate(postData?.enddate)}`}
              />
              <InfoItem label='Ажлын явц' value={postData?.impphase || '-'} />
            </div>

            <div className='rounded-lg border border-slate-200 bg-white p-3'>
              <div className='mb-2 flex items-center justify-between text-sm'>
                <span className='font-medium text-slate-600'>Гүйцэтгэлийн хувь</span>
                <span className='font-semibold text-slate-800'>{percent}%</span>
              </div>
              <div className='h-2.5 w-full rounded-full bg-slate-200'>
                <div className={`h-2.5 rounded-full ${getProgressColor(percent)}`} style={{ width: `${percent}%` }} />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
};

const InfoItem = ({ label, value }: { label: string; value?: React.ReactNode }) => (
  <div className='flex items-start justify-between gap-3 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5'>
    <span className='text-sm text-slate-500'>{label}</span>
    <span className='text-right text-sm font-medium text-slate-800'>{value}</span>
  </div>
);

export default Detail;
