'use client';
import DashboardCard from '@/components/dashboard/DashboardCard';
import PostsTable from '@/components/posts/PostsTable';
import AnalyticsChart from '@/components/dashboard/AnalyticsChart';
import { FolderArchive, MessageCircle, Newspaper, User, FolderMinus } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function DashboardLayout() {
  const [postsCount, setPostsCount] = useState<number | null>(null);
  const [khorooCount, setKhorooCount] = useState<number | null>(null);
  useEffect(() => {
    const fetchCounts = async () => {
      const postRes = await fetch('https://shdmonitoring.ub.gov.mn/api/posts/count');
      const postJson = await postRes.json();

      const khorooRes = await fetch('https://shdmonitoring.ub.gov.mn/api/khoroo/count');
      const khorooJson = await khorooRes.json();
      setPostsCount(postJson.totalPosts);
      setKhorooCount(khorooJson.totalKhoroos);

      console.log('Нийт мэдээ:', postJson.totalPosts);
      console.log('Нийт хороо:', khorooJson.totalKhoroos);
    };
    fetchCounts();
  }, [])
  return (
    <>

      <div className='flex flex-col md:flex-row gap-5 mb-5'>

        <div className="w-1/4 h-100 bg-orange-200 p-4 rounded"><DashboardCard
          title='НИЙТ МЭДЭЭЛЭЛИЙН ТОО'
          count={postsCount ?? 0}
          icon={<FolderMinus className='text-slate-/800' size={60} />}
        /></div>

        <div className="w-1/4 h-100 bg-red-200 p-4 rounded"><DashboardCard
          title='УЛСЫН ТӨСВИЙН ХӨРӨНГӨ ОРУУЛАЛТТАЙ '
          count={100}
          icon={<FolderMinus className='text-slate-/500' size={60} />}
        /></div>
        <div className="w-1/4 h-100 bg-green-200 p-4 rounded"><DashboardCard
          title='НИЙСЛЭЛИЙН ТӨСВИЙН ХӨРӨНГӨ ОРУУЛАЛТТАЙ '
          count={42}
          icon={<FolderMinus className='text-slate-800' size={60} />}
        /></div>
        <div className="w-1/4 h-100 bg-blue-200 p-4 rounded"><DashboardCard
          title='ДҮҮРГИЙН ТӨСВИЙН ХӨРӨНГӨ ОРУУЛАЛТ'
          count={1}
          icon={<FolderMinus className='text-slate-800' size={60} />}
        /></div>
      </div>
      <div className='flex flex-col md:flex-row gap-5 mb-5'>
        <div className="w-1/4 h-100 bg-blue-200 p-4 rounded"><DashboardCard
          title='БҮРТГЭЛТЭЙ ХОРООДЫН ТОО'
          count={khorooCount ?? 0}
          icon={<FolderMinus className='text-slate-800' size={60} />}
        /></div>
        <div className="w-1/4 h-100 bg-orange-200 p-4 rounded"><DashboardCard
          title='ДҮҮРГИЙН ЗДТГ-ЫН ХОТ ТОХИЖУУЛАХ ХӨРӨНГӨ ОРУУЛАЛТ'
          count={100}
          icon={<FolderMinus className='text-slate-800' size={60} />}
        /></div>
        <div className="w-1/4 h-100 bg-red-200 p-4 rounded"><DashboardCard
          title='НИЙСЛЭЛИЙН ОРОН НУТГИЙН ХӨГЖЛИЙН САНГИЙН ХӨРӨНГӨ ОРУУЛАЛТ'
          count={100}
          icon={<Newspaper className='text-slate-800' size={60} />}
        /></div>
        <div className="w-1/4 h-100 bg-green-200 p-4 rounded"><DashboardCard
          title='ДҮҮРГИЙН ОРОН НУТГИЙН ХӨГЖЛИЙН САНГИЙН ХӨРӨНГӨ ОРУУЛАЛТ'
          count={100}
          icon={<Newspaper className='text-slate-800' size={60} />}
        /></div>

      </div>
      <AnalyticsChart />
      {/* <PostsTable title='Сүүлд нэмэгдсэн' limit={5} /> */}
    </>
  );
}


