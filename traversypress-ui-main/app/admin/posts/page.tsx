import PostsTable from '@/components/posts/PostsTable';
import BackButton from '@/components/BackButton';
import PostsPagination from '@/components/posts/PostsPagination';
import Link from 'next/link';

const PostsPage = () => {
  return (
    <>
      <div className='mr-250px w-screen flex justify-between'>
        <BackButton text='Буцах' link='/admin/dashboard' />
        <Link href={`/admin/posts/new`}>
          <button className='bg-green-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded text-xs'>
            Нэмэх
          </button>
        </Link>
      </div>
      <PostsTable />
      {/* <PostsPagination /> */}
    </>
  );
};

export default PostsPage;
