'use client';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableCaption,
} from '@/components/ui/table';
import Link from 'next/link';
import { useEffect, useState } from 'react';

interface Posts {
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

const PostsTable = () => {

  const [postsData, setPostsData] = useState<Posts[]>([])
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch(`http://localhost:4000/api/posts`)
        const json = await res.json()
        console.log("json", json)
        setPostsData(json.data)
        setTotalPages(json.total)
      } catch (err) {
        console.error('Алдаа:', err)
      }
    }
    fetchPosts()
  }, [page])
  // Sort posts in dec order based on date
  // const sortedPosts: postsData[] = [...posts].sort(
  //   (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  // );

  // Filter posts to limit
  // const filteredPosts = limit ? sortedPosts.slice(0, limit) : sortedPosts;

  return (
    <div className='mt-10'>
      <div className='flex justify-between'>
        <h3 className='text-2xl mb-4 font-semibold'>{'Мэдээлэл'}</h3>
        <Link href={`/posts/new`}>
          <button className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded text-xs'>
            Нэмэх
          </button>
        </Link>
      </div>
      <Table>
        <TableCaption>Сүүлд нэмэгдсэн</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Захирамжын дугаар</TableHead>
            <TableHead>Гарчиг</TableHead>
            <TableHead>Агуулга</TableHead>
            <TableHead className='hidden md:table-cell'>Хороо</TableHead>
            <TableHead>Сүүлд шинэчлэгдсэн огноо</TableHead>
            <TableHead>Гүйцэтгэгч</TableHead>
            <TableHead>Гэрээний дүн</TableHead>
            <TableHead>Эх үүсвэр</TableHead>
            <TableHead>Төсөвт дүн</TableHead>
            <TableHead>Хариуцсан инженер</TableHead>
            <TableHead>Гүйцэтгэлийн үе шат</TableHead>
            <TableHead>Гүйцэтгэлийн хувь</TableHead>
            <TableHead className='hidden md:table-cell text-right'>
              Гэрээний хугацаа
            </TableHead>
            <TableHead>Үйлдэл</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.isArray(postsData) && postsData.length > 0 ? (
            postsData.map((post) => (
              <TableRow key={post.newsid}>
                <TableCell>{post.ordernum}</TableCell>
                <TableCell className="max-w-[250px] truncate font-semibold text-sm">
                  {post.title}
                </TableCell>
                <TableCell className="max-w-[250px] truncate font-semibold text-sm">
                  {post.news}
                </TableCell>
                <TableCell>{post.khoroo}</TableCell>
                <TableCell>{post.updatedat}</TableCell>
                <TableCell>{post.contractor}</TableCell>
                <TableCell>{post.totalcost}</TableCell>
                <TableCell>{post.source}</TableCell>
                <TableCell>{post.contractcost}</TableCell>
                <TableCell>{post.engener}</TableCell>
                <TableCell>{post.impphase}</TableCell>
                <TableCell className="text-right hidden md:table-cell">
                  {post.imppercent}%
                </TableCell>

                <TableCell className="max-w-[250px] text-right hidden md:table-cell">
                  {post.startdate && post.enddate
                    ? `${new Date(post.startdate).toLocaleDateString('mn-MN', {
                      year: 'numeric',
                      month: '2-digit',
                      day: '2-digit',
                    })} - ${new Date(post.enddate).toLocaleDateString('mn-MN', {
                      year: 'numeric',
                      month: '2-digit',
                      day: '2-digit',
                    })}`
                    : 'Огноо байхгүй'}
                </TableCell>
                <TableCell>
                  <Link href={`/posts/edit/${post.newsid}`}>
                    <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded text-xs">
                      Засах
                    </button>
                  </Link>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={14} className="text-center">
                Мэдээлэл алга байна.
              </TableCell>
            </TableRow>
          )}
        </TableBody>

      </Table>

      <div className="flex gap-2 mt-4">
        <button
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          disabled={page === 1}
          className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
        >
          Өмнөх
        </button>
        <span>{page} / {totalPages}</span>
        <button
          onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={page === totalPages}
          className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
        >
          Дараах
        </button>
      </div>
    </div>
  );
};

export default PostsTable;


// PostsTable дотор хамгийн доор
// const getFirstTwoSentences = (text: string) => {
//   const sentences = text.match(/[^.!?]+[.!?]+/g);
//   if (!sentences) return text;
//   return sentences.slice(0, 1).join(' ');
// };
