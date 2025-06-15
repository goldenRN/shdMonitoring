import DashboardCard from '@/components/dashboard/DashboardCard';
import PostsTable from '@/components/posts/PostsTable';
import AnalyticsChart from '@/components/dashboard/AnalyticsChart';
import { FolderArchive, MessageCircle, Newspaper, User } from 'lucide-react';

export default function Home() {
  return (
    <>
      <div className='flex flex-col md:flex-row gap-5 mb-5'>
        <DashboardCard
          title='Мэдээлэл'
          count={100}
          icon={<Newspaper className='text-slate-/800' size={60} />}
        />
        <DashboardCard
          title='Хороо'
          count={42}
          icon={<Newspaper className='text-slate-800' size={60} />}
        />
        <DashboardCard
          title='Дүүрэг'
          count={1}
          icon={<Newspaper className='text-slate-800' size={60} />}
        />
        <DashboardCard
          title='Хэрэгжсэн'
          count={20}
          icon={<MessageCircle className='text-slate-500' size={72} />}
        />
      </div>
      <AnalyticsChart />
      {/* <PostsTable title='Сүүлд нэмэгдсэн' limit={5} /> */}
    </>
  );
}
