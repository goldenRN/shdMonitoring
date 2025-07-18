import PostsTable from '@/components/posts/PostsTable';
import BackButton from '@/components/BackButton';
import PostsPagination from '@/components/posts/PostsPagination';
import Link from 'next/link';
import { Plus } from 'lucide-react';

const PostsPage = () => {
  return (
    <>

      {/* <div className="w-[calc(100vw-300px)]"> */}
      <div className='overflow-x-auto'>
        {/* Top bar: always visible */}
        <div className="w-[calc(100vw-300px)] flex justify-between items-center px-4 py-2 bg-white  sticky top-0 z-10">
          <BackButton text="Буцах" link="/admin/dashboard" />
          <Link href="/admin/posts/new">

            <button className="bg-green-200 hover:bg-green-500 text-slate-800 font-bold py-2 px-4 rounded text-xs">
              <div className='flex justify-between'>
                <div>
                <Plus className='text-slate-800' size={15} />
                </div>
                <div className='ml-2'>
                  Нэмэх
                  </div>
              </div>
            </button>
          </Link>
        </div>

        {/* Scrollable table area */}
        <div className="overflow-x-auto">
          <PostsTable />
        </div>
        {/* <PostsPagination /> */}
      </div>
    </>
  );
};

export default PostsPage;
