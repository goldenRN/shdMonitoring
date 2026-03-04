
'use client';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

interface RawPostItem {
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
}

interface PostItem {
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
  branch: string;
  createdat: string;
  updatedat: string | null;
  khoroos: { name: string }[];
}

const toNumber = (value: unknown) => {
  if (typeof value === 'number') return value;
  if (typeof value === 'string') {
    const parsed = Number(value);
    return Number.isNaN(parsed) ? 0 : parsed;
  }
  return 0;
};

const normalizePost = (raw: RawPostItem): PostItem => ({
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

export default function NewsListPage({ params }: { params: { id: string } }) {
  const id = params.id;
  const searchParams = useSearchParams();
  const name = searchParams.get('name') ?? 'Төслийн жагсаалт';
  const descRaw = searchParams.get('desc') ?? '';
  const descItems = useMemo(
    () => descRaw.split(',').map((item) => item.trim()).filter(Boolean),
    [descRaw]
  );

  const [postsData, setPostsData] = useState<PostItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch('https://shdmonitoring.ub.gov.mn/api/posts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json; charset=utf-8' },
          body: JSON.stringify({ id }),
        });

        if (!res.ok) {
          throw new Error('Мэдээлэл татах үед алдаа гарлаа.');
        }

        const json = await res.json();
        const normalized = Array.isArray(json.data)
          ? json.data.map((item: RawPostItem) => normalizePost(item))
          : [];
        setPostsData(normalized);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Серверийн алдаа.');
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [id]);

  return (
    <main className='min-h-screen bg-slate-50 p-4 md:p-6'>
      <div className='mx-auto max-w-7xl space-y-6'>
        <div className='rounded-2xl border border-slate-200 bg-white p-5 shadow-sm'>
          <h1 className='text-xl md:text-2xl font-bold text-slate-800'>{name}</h1>
          {descItems.length > 0 && (
            <div className='mt-3 flex flex-wrap gap-2'>
              {descItems.map((item) => (
                <span key={item} className='rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-600'>
                  {item}
                </span>
              ))}
            </div>
          )}
        </div>

        {loading && (
          <div className='rounded-xl border border-slate-200 bg-white p-6 text-sm text-slate-500'>
            Ачаалж байна...
          </div>
        )}

        {error && (
          <div className='rounded-xl border border-red-200 bg-red-50 p-6 text-sm text-red-700'>{error}</div>
        )}

        {!loading && !error && (
          <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5'>
            {postsData.map((post) => (
              <Card key={post.newsid} className='border-slate-200 bg-white shadow-sm transition hover:shadow-md'>
                <Link href={`/detail/${post.newsid}`}>
                  <CardHeader className='border-b border-slate-100 pb-3'>
                    <CardTitle className='text-base leading-snug text-slate-800'>{post.title}</CardTitle>
                    <CardDescription className='text-xs text-slate-500'>
                      {post.updatedat
                        ? `Сүүлд шинэчилсэн: ${formatDate(post.updatedat)}`
                        : `Бүртгэсэн огноо: ${formatDate(post.createdat)}`}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className='space-y-3 pt-4 text-sm'>
                    <InfoRow label='Захирамж №' value={post.ordernum || '-'} />
                    <InfoRow label='Эх үүсвэр' value={post.source || '-'} />
                    <InfoRow
                      label='Хороо'
                      value={
                        post.khoroos?.length
                          ? post.khoroos.map((k) => k.name).join(', ')
                          : 'Хороо байхгүй'
                      }
                    />
                    <InfoRow label='Төсөвт өртөг' value={formatMoney(post.totalcost)} />
                    <InfoRow label='Гэрээний дүн' value={formatMoney(post.contractcost)} />
                    <InfoRow
                      label='Хугацаа'
                      value={`${formatDate(post.startdate)} - ${formatDate(post.enddate)}`}
                    />
                    <InfoRow label='Ажлын явц' value={post.impphase || '-'} />
                    <InfoRow label='Гүйцэтгэл' value={`${post.imppercent ?? 0}%`} />
                    <div className='h-2 w-full rounded-full bg-slate-200'>
                      <div
                        className={`h-2 rounded-full ${getProgressColor(post.imppercent ?? 0)}`}
                        style={{ width: `${Math.max(0, Math.min(100, post.imppercent ?? 0))}%` }}
                      />
                    </div>
                  </CardContent>

                  <CardFooter className='justify-end border-t border-slate-100 pt-3 text-sm font-semibold text-blue-700'>
                    Дэлгэрэнгүй →
                  </CardFooter>
                </Link>
              </Card>
            ))}
          </div>
        )}

        {!loading && !error && postsData.length === 0 && (
          <div className='rounded-xl border border-slate-200 bg-white p-6 text-sm text-slate-500'>
            Мэдээлэл олдсонгүй.
          </div>
        )}
      </div>
    </main>
  );
}

const InfoRow = ({ label, value }: { label: string; value: string }) => (
  <div className='flex items-start justify-between gap-3 rounded-md bg-slate-50 px-3 py-2'>
    <span className='text-xs text-slate-500'>{label}</span>
    <span className='text-right text-xs font-medium text-slate-700'>{value}</span>
  </div>
);
