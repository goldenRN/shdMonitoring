'use client';
import DashboardCard from '@/components/dashboard/DashboardCard';
import AnalyticsChart from '@/components/dashboard/AnalyticsChart';
import { Building2, FolderArchive, FolderMinus, FolderOpen, Newspaper, ShieldCheck, Workflow } from 'lucide-react';
import { useEffect, useState } from 'react';

interface CountResponse {
  totalPosts: number;
}

interface RawPost {
  newsId?: number;
  newsid?: number;
  title?: string;
  createdAt?: string;
  createdat?: string;
  updatedAt?: string;
  updatedat?: string;
}

interface PostRecord {
  id: number;
  title: string;
  status: 'Идэвхтэй' | 'Архив';
  date: string;
}

export default function DashboardLayout() {
  const [allCount, setAllCount] = useState(0);
  const [activeCount, setActiveCount] = useState(0);
  const [archiveCount, setArchiveCount] = useState(0);
  const [khorooCount, setKhorooCount] = useState(0);
  const [sourceCount, setSourceCount] = useState(0);
  const [branchCount, setBranchCount] = useState(0);
  const [wpCount, setWpCount] = useState(0);
  const [svCount, setSvCount] = useState(0);
  const [records, setRecords] = useState<PostRecord[]>([]);

  useEffect(() => {
    const normalizePost = (post: RawPost, status: PostRecord['status']): PostRecord | null => {
      const id = post.newsId ?? post.newsid;
      if (!id || !post.title) return null;

      const date = post.updatedAt ?? post.updatedat ?? post.createdAt ?? post.createdat ?? '';
      return { id, title: post.title, status, date };
    };

    const fetchDashboardData = async () => {
      const [allRes, activeRes, archiveRes, activePostsRes, archivePostsRes, khorooRes, sourceRes, branchRes, wpRes, svRes] = await Promise.all([
        fetch('https://shdmonitoring.ub.gov.mn/api/posts/count/all'),
        fetch('https://shdmonitoring.ub.gov.mn/api/posts/count/active'),
        fetch('https://shdmonitoring.ub.gov.mn/api/posts/count/archive'),
        fetch('https://shdmonitoring.ub.gov.mn/api/posts'),
        fetch('https://shdmonitoring.ub.gov.mn/api/posts/archive'),
        fetch('https://shdmonitoring.ub.gov.mn/api/khoroo/count'),
        fetch('https://shdmonitoring.ub.gov.mn/api/source/count'),
        fetch('https://shdmonitoring.ub.gov.mn/api/branch/count'),
        fetch('https://shdmonitoring.ub.gov.mn/api/workprogress/count'),
        fetch('https://shdmonitoring.ub.gov.mn/api/supervisor/count')
      ]);

      const [allJson, activeJson, archiveJson, activePostsJson, archivePostsJson, khorooJson, sourceJson, branchJson, wpJson, svJson] = await Promise.all([
        allRes.json() as Promise<CountResponse>,
        activeRes.json() as Promise<CountResponse>,
        archiveRes.json() as Promise<CountResponse>,
        activePostsRes.json() as Promise<{ data: RawPost[] }>,
        archivePostsRes.json() as Promise<RawPost[]>,
        khorooRes.json() as Promise<{ totalKhoroos?: number }>,
        sourceRes.json() as Promise<{ totalsource?: number }>,
        branchRes.json() as Promise<{ totalbranch?: number }>,
        wpRes.json() as Promise<{ totalwp?: number }>,
        svRes.json() as Promise<{ totals?: number }>
      ]);

      setAllCount(allJson.totalPosts ?? 0);
      setActiveCount(activeJson.totalPosts ?? 0);
      setArchiveCount(archiveJson.totalPosts ?? 0);
      setKhorooCount(khorooJson.totalKhoroos ?? 0);
      setSourceCount(sourceJson.totalsource ?? 0);
      setBranchCount(branchJson.totalbranch ?? 0);
      setWpCount(wpJson.totalwp ?? 0);
      setSvCount(svJson.totals ?? 0);

      const activeList = (activePostsJson.data ?? [])
        .map((item) => normalizePost(item, 'Идэвхтэй'))
        .filter((item): item is PostRecord => item !== null);

      const archiveList = (archivePostsJson ?? [])
        .map((item) => normalizePost(item, 'Архив'))
        .filter((item): item is PostRecord => item !== null);

      const merged = [...activeList, ...archiveList]
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 12);

      setRecords(merged);
    };

    fetchDashboardData();
  }, []);

  return (
    <div className='space-y-6'>
      <div className='rounded-2xl border border-slate-200 bg-gradient-to-r from-sky-50 via-white to-amber-50 p-4 md:p-5'>
        <div className='mb-3 text-base font-semibold text-slate-700'>Удирдлагын хэсэг</div>
        <div className='grid grid-cols-1 gap-3 md:grid-cols-3'>
          <div className='rounded-xl bg-orange-100/80 px-4 py-3'>
            <div className='text-xs text-slate-600'>Нийт мэдээлэл</div>
            <div className='mt-1 text-2xl font-bold text-slate-800'>{allCount}</div>
          </div>
          <div className='rounded-xl bg-emerald-100/80 px-4 py-3'>
            <div className='text-xs text-slate-600'>Active мэдээлэл</div>
            <div className='mt-1 text-2xl font-bold text-slate-800'>{activeCount}</div>
          </div>
          <div className='rounded-xl bg-amber-100/80 px-4 py-3'>
            <div className='text-xs text-slate-600'>Archive мэдээлэл</div>
            <div className='mt-1 text-2xl font-bold text-slate-800'>{archiveCount}</div>
          </div>
        </div>
      </div>

      <AnalyticsChart />

      <div className='flex flex-col md:flex-row gap-5 mb-5'>
        <div className="w-full md:w-1/3 h-100 bg-orange-200 p-4 rounded"><DashboardCard
          title='НИЙТ МЭДЭЭЛЭЛ'
          count={allCount}
          icon={<FolderMinus className='text-slate-800' size={60} />}
        /></div>
        <div className="w-full md:w-1/3 h-100 bg-red-200 p-4 rounded"><DashboardCard
          title='ХОРОО БҮРТГЭЛ'
          count={khorooCount}
          icon={<Building2 className='text-slate-800' size={60} />}
        /></div>
        <div className="w-full md:w-1/3 h-100 bg-green-200 p-4 rounded"><DashboardCard
          title='САЛБАР БҮРТГЭЛ'
          count={branchCount}
          icon={<Building2 className='text-slate-800' size={60} />}
        /></div>
      </div>

      <div className='flex flex-col md:flex-row gap-5 mb-5'>
        <div className="w-full md:w-1/3 h-100 bg-blue-200 p-4 rounded"><DashboardCard
          title='ЭХ ҮҮСВЭР БҮРТГЭЛ'
          count={sourceCount}
          icon={<Newspaper className='text-slate-800' size={60} />}
        /></div>
        <div className="w-full md:w-1/3 h-100 bg-orange-200 p-4 rounded"><DashboardCard
          title='АЖЛЫН ЯВЦ ТОО'
          count={wpCount}
          icon={<Workflow className='text-slate-800' size={60} />}
        /></div>
        <div className="w-full md:w-1/3 h-100 bg-red-200 p-4 rounded"><DashboardCard
          title='ХЯНАЛТЫН БАЙГУУЛЛАГА'
          count={svCount}
          icon={<ShieldCheck className='text-slate-800' size={60} />}
        /></div>
      </div>

      <div className='rounded border bg-white p-4 shadow-sm'>
        <h3 className='text-sm font-semibold mb-3'>Сүүлийн бүртгэлүүд</h3>
        <div className='space-y-2'>
          {records.map((item) => (
            <div key={`${item.status}-${item.id}`} className='flex items-center justify-between rounded bg-slate-50 px-3 py-2 text-xs'>
              <div className='truncate pr-3'>{item.title}</div>
              <div className='flex items-center gap-2 shrink-0'>
                <span className={`rounded px-2 py-0.5 ${item.status === 'Архив' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'}`}>
                  {item.status}
                </span>
                <span className='text-slate-500'>{item.date ? new Date(item.date).toLocaleDateString('mn-MN') : '-'}</span>
              </div>
            </div>
          ))}
          {records.length === 0 && (
            <div className='text-xs text-slate-500'>Бүртгэл олдсонгүй.</div>
          )}
        </div>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
        <div className='rounded-xl border bg-emerald-50 px-4 py-3'>
          <div className='flex items-center gap-2 text-sm font-medium text-emerald-700'>
            <FolderOpen size={16} /> Active мэдээлэл
          </div>
          <div className='mt-1 text-xl font-semibold text-emerald-800'>{activeCount}</div>
        </div>
        <div className='rounded-xl border bg-amber-50 px-4 py-3'>
          <div className='flex items-center gap-2 text-sm font-medium text-amber-700'>
            <FolderArchive size={16} /> Archive мэдээлэл
          </div>
          <div className='mt-1 text-xl font-semibold text-amber-800'>{archiveCount}</div>
        </div>
      </div>
    </div>
  );
}
