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
import { format } from 'date-fns';
import ImageUploadModal from './ImageUploadmodal';
import { Button } from '@/components/ui/button';

interface Khoroo {
  id: number;
  name: string;
}
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
  branch: string
  createdat: Date
  updatedat: Date
  khoroos: { name: string }[];
}
import { Pencil, Trash, ImagePlus } from 'lucide-react';
import { toast } from '../ui/use-toast';

const PostsTable = () => {
  const [postsData, setPostsData] = useState<Posts[]>([])
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [open, setOpen] = useState(false);
  const [selectedNewsId, setSelectedNewsId] = useState<number | null>(null);
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch(`https://shdmonitoring.ub.gov.mn/api/posts`)
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
  const deletePost = async (id: number) => {
    try {
      const res = await fetch(`https://shdmonitoring.ub.gov.mn/api/posts/delete/${id}`, {
        method: 'DELETE',
      });

      const data = await res.json();

      if (res.ok) {
        toast({ title: 'Амжилттай устгалаа' });
        setPostsData((prevData) => prevData.filter(pst => pst.newsid !== id));

      } else {
        toast({ title: data.error || 'Алдаа гарлаа', variant: 'destructive' });
      }
    } catch (error) {
      console.error('Устгах үед алдаа:', error);
      toast({ title: 'Сервертэй холбогдож чадсангүй', variant: 'destructive' });
    }
  };
  const handleUpload = (file: File) => {
    console.log('Зураг файл:', file);
    // API-р илгээх бол энд бичнэ
  };
  return (
    <div >
      <div >
        <h3 className='text-2xl mb-4 font-semibold'>Мэдээлэл</h3>

      </div>
      <Table>
        <TableCaption>Сүүлд нэмэгдсэн</TableCaption>
        <TableHeader>
          <TableRow>
            {/* <TableHead>Захирамжын дугаар</TableHead> */}
             <TableHead>№</TableHead>
            <TableHead>Гарчиг</TableHead>
            {/* <TableHead>Агуулга</TableHead> */}
            <TableHead className='w-[200px]'>Хороо</TableHead>
            <TableHead>Хяналтын байгууллага</TableHead>
            <TableHead>Гүйцэтгэгч</TableHead>
            {/* <TableHead>Гэрээний дүн</TableHead> */}
            <TableHead>Эх үүсвэр</TableHead>
            {/* <TableHead>Төсөвт дүн</TableHead> */}
            {/* <TableHead>Ажлын явц</TableHead> */}
            <TableHead>Хувь</TableHead>
            <TableHead>Салбар</TableHead>
            <TableHead>Шинэчлэгдсэн огноо</TableHead>
            {/* <TableHead className='hidden md:table-cell text-right'>
              Гэрээний хугацаа
            </TableHead> */}
            <TableHead>Үйлдэл</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.isArray(postsData) && postsData.length > 0 ? (
            postsData.map((post,index) =>
            (
              

              <TableRow key={post.newsid}>
                <TableCell>{index + 1}</TableCell>
                {/* <TableCell>{post.ordernum}</TableCell>//Захирамжийн дугаар */}
                <TableCell className="max-w-[500px] line-clamp-2 text-sm font-medium">
                  {post.title}
                </TableCell>
                {/* <TableCell className="max-w-[250px] truncate font-semibold text-sm">
                  {post.news}
                </TableCell> */}
                <TableCell className="w-[200px] overflow-x-auto whitespace-nowrap">
                  {Array.isArray(post.khoroos) && post.khoroos.length > 0 ? (
                    post.khoroos.map((khr, index) => (
                      <div key={index}>{khr.name}</div>
                    ))
                  ) : (
                    <div className="text-gray-500 text-xs">Хороо байхгүй</div>
                  )}
                </TableCell> {/*Хороо*/}
                <TableCell>{post.engener}</TableCell>  {/*Захиалагчын хяналтын байгууллага*/}

                <TableCell className="max-w-[500px] line-clamp-2 text-sm font-medium">{post.contractor}</TableCell>{/*Гүйцэтгэгч*/}
                {/* <TableCell>{Number(post.totalcost).toLocaleString() + '₮'}</TableCell>//Гэрээний дүн */}
                <TableCell>{post.source}</TableCell> {/*Хөрөнгө оруулалтын эх үүсвэр*/}
                {/* <TableCell>{Number(post.contractcost).toLocaleString() + '₮'}</TableCell>//Төсөвт дүн */}

                {/* <TableCell>{post.impphase}</TableCell>  Ажлын явц*/}
                <TableCell className="text-right hidden md:table-cell">
                  {post.imppercent}%
                </TableCell> {/*Гүйцэтгэл хувь*/}
                <TableCell className="text-right hidden md:table-cell">
                  {post.branch}
                </TableCell> {/*Салбар*/}
                <TableCell>{format(new Date(post.updatedat), 'yyyy-MM-dd')} </TableCell> {/*Сүүлд шинэчлэгдсэн огноо*/}
                {/* <TableCell className="max-w-[250px] text-right hidden md:table-cell">
                  {post.startdate && post.enddate
                    ? `${format(new Date(post.startdate), 'yyyy-MM-dd')} 
                    - ${format(new Date(post.enddate), 'yyyy-MM-dd')}`
                    : 'Огноо байхгүй'}
                </TableCell> */}
                <TableCell>
                  <div className='flex justify-between'><div>
                    <Link href={`/admin/posts/edit/${post.newsid}`}>
                      <button className="bg-orange-200 hover:bg-orange-500 text-white font-bold py-2 px-4 rounded text-xs">
                        {<Pencil className='text-slate-800' size={20} />}
                      </button>
                    </Link>
                  </div>

                    <div className='ml-5'>
                      <button className="bg-blue-200 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded text-xs"
                        onClick={() => { setSelectedNewsId(post.newsid); setOpen(true) }}>
                        <ImagePlus className='text-slate-800' size={20} />
                      </button>
                      {/* <ImageUploadModal open={open} onClose={() => setOpen(false)} onUpload={handleUpload} /> */}
                      
                      {/* <ImageUploadModal
                        open={open}
                        onClose={() => {
                          setOpen(false);
                          setSelectedNewsId(null);
                        }}
                        newsId={selectedNewsId}
                      />
                     */}

                    </div>

                    <div className='ml-5'>
                      <button className="bg-red-200 hover:bg-red-500 text-white font-bold py-2 px-4 rounded text-xs"
                        onClick={async () => {
                          const confirmed = window.confirm(`Та "${post.title}" мэдээллийг устгахдаа итгэлтэй байна уу?`);
                          if (!confirmed) return;
                          deletePost(post.newsid)
                        }}>
                        <Trash className='text-slate-800' size={20} />
                      </button>
                    </div>

                  </div>
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
         {/* ✅ Ганц л modal - always mounted */}
      <ImageUploadModal
        open={open}
        onClose={() => {
          setOpen(false);
          setSelectedNewsId(null);
        }}
        newsId={selectedNewsId}
      />


      </Table>

      {/* <div className="flex gap-2 mt-4">
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
      </div> */}
    </div>
  );

};


export default PostsTable;


// 'use client';

// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
//   TableCaption,
// } from '@/components/ui/table';
// import Link from 'next/link';
// import { useEffect, useState } from 'react';
// import { format } from 'date-fns';
// import ImageUploadModal from './ImageUploadmodal';
// import { Pencil, Trash, ImagePlus } from 'lucide-react';
// import { toast } from '../ui/use-toast';

// interface Posts {
//   newsid: number;
//   title: string;
//   ordernum: string;
//   contractor: string;
//   contractcost: number;
//   engener: string;
//   startdate: Date;
//   enddate: Date;
//   impphase: string;
//   imppercent: number;
//   source: string;
//   totalcost: number;
//   branch: string;
//   createdat: Date;
//   updatedat: Date;
//   khoroos: { name: string }[];
// }

// const PostsTable = () => {
//   const [postsData, setPostsData] = useState<Posts[]>([]);
//   const [page, setPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);
//   const [open, setOpen] = useState(false);
//   const [selectedNewsId, setSelectedNewsId] = useState<number | null>(null);

//   useEffect(() => {
//     const fetchPosts = async () => {
//       try {
//         const res = await fetch(`https://shdmonitoring.ub.gov.mn/api/posts`);
//         const json = await res.json();
//         setPostsData(json.data);
//         setTotalPages(json.total);
//       } catch (err) {
//         console.error('Алдаа:', err);
//       }
//     };
//     fetchPosts();
//   }, [page]);

//   const deletePost = async (id: number) => {
//     try {
//       const res = await fetch(`https://shdmonitoring.ub.gov.mn/api/posts/delete/${id}`, {
//         method: 'DELETE',
//       });
//       const data = await res.json();
//       if (res.ok) {
//         toast({ title: 'Амжилттай устгалаа' });
//         setPostsData((prevData) => prevData.filter((pst) => pst.newsid !== id));
//       } else {
//         toast({ title: data.error || 'Алдаа гарлаа', variant: 'destructive' });
//       }
//     } catch (error) {
//       console.error('Устгах үед алдаа:', error);
//       toast({ title: 'Сервертэй холбогдож чадсангүй', variant: 'destructive' });
//     }
//   };

//   return (
//     <div>
//       <h3 className='text-2xl mb-4 font-semibold'>Мэдээлэл</h3>

//       <Table>
//         <TableCaption>Сүүлд нэмэгдсэн</TableCaption>
//         <TableHeader>
//           <TableRow>
//             <TableHead>Гарчиг</TableHead>
//             <TableHead className='w-[200px]'>Хороо</TableHead>
//             <TableHead>Захиалагч</TableHead>
//             <TableHead>Гүйцэтгэгч</TableHead>
//             <TableHead>Эх үүсвэр</TableHead>
//             <TableHead>Гүйцэтгэл %</TableHead>
//             <TableHead>Салбар</TableHead>
//             <TableHead>Шинэчлэлт</TableHead>
//             <TableHead>Үйлдэл</TableHead>
//           </TableRow>
//         </TableHeader>
//         <TableBody>
//           {Array.isArray(postsData) && postsData.length > 0 ? (
//             postsData.map((post) => (
//               <TableRow key={post.newsid}>
//                 <TableCell className="max-w-[500px] line-clamp-2 text-sm font-medium">
//                   {post.title}
//                 </TableCell>
//                 <TableCell className="w-[200px] overflow-x-auto whitespace-nowrap">
//                   {Array.isArray(post.khoroos) && post.khoroos.length > 0 ? (
//                     post.khoroos.map((khr, index) => (
//                       <div key={index}>{khr.name}</div>
//                     ))
//                   ) : (
//                     <div className="text-gray-500 text-xs">Хороо байхгүй</div>
//                   )}
//                 </TableCell>
//                 <TableCell>{post.engener}</TableCell>
//                 <TableCell className="max-w-[500px] line-clamp-2 text-sm font-medium">
//                   {post.contractor}
//                 </TableCell>
//                 <TableCell>{post.source}</TableCell>
//                 <TableCell className="text-right hidden md:table-cell">
//                   {post.imppercent}%
//                 </TableCell>
//                 <TableCell className="text-right hidden md:table-cell">
//                   {post.branch}
//                 </TableCell>
//                 <TableCell>{format(new Date(post.updatedat), 'yyyy-MM-dd')}</TableCell>
//                 <TableCell>
//                   <div className='flex items-center gap-2'>
//                     <Link href={`/admin/posts/edit/${post.newsid}`}>
//                       <button className="bg-orange-200 hover:bg-orange-500 text-white font-bold py-2 px-4 rounded text-xs">
//                         <Pencil className='text-slate-800' size={20} />
//                       </button>
//                     </Link>
//                     <button
//                       className="bg-blue-200 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded text-xs"
//                       onClick={() => {
//                         setSelectedNewsId(post.newsid);
//                         setOpen(true);
//                       }}
//                     >
//                       <ImagePlus className='text-slate-800' size={20} />
//                     </button>
//                     <button
//                       className="bg-red-200 hover:bg-red-500 text-white font-bold py-2 px-4 rounded text-xs"
//                       onClick={async () => {
//                         const confirmed = window.confirm(`Та "${post.title}" мэдээллийг устгахдаа итгэлтэй байна уу?`);
//                         if (!confirmed) return;
//                         deletePost(post.newsid);
//                       }}
//                     >
//                       <Trash className='text-slate-800' size={20} />
//                     </button>
//                   </div>
//                 </TableCell>
//               </TableRow>
//             ))
//           ) : (
//             <TableRow>
//               <TableCell colSpan={9} className="text-center">Мэдээлэл алга байна.</TableCell>
//             </TableRow>
//           )}
//         </TableBody>
//       </Table>

//       {/* ✅ Ганц л modal - always mounted */}
//       <ImageUploadModal
//         open={open}
//         onClose={() => {
//           setOpen(false);
//           setSelectedNewsId(null);
//         }}
//         newsId={selectedNewsId}
//       />
//     </div>
//   );
// };

// export default PostsTable;
