'use client';
import {
  Table,
} from '@/components/ui/table';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { format } from 'date-fns';
import ImageUploadModal from './ImageUploadmodal';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Plus, RefreshCcw } from 'lucide-react'

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
  const [search, setSearch] = useState('')
  const [percentFilter, setPercentFilter] = useState('all')
  const [sortField, setSortField] = useState<keyof Posts>("title");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [loading, setLoading] = useState(false);
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

  const filteredPosts = postsData.filter(post => {

    const matchesSearch =
      post.title.toLowerCase().includes(search.toLowerCase()) ||
      post.contractor.toLowerCase().includes(search.toLowerCase())
    return matchesSearch
  })
  const sortedPosts = [...filteredPosts].sort((a, b) => {
    const aVal = a[sortField]
    const bVal = b[sortField]

    if (aVal == null) return 1
    if (bVal == null) return -1

    // String
    if (typeof aVal === "string" && typeof bVal === "string") {
      return sortOrder === "asc"
        ? aVal.localeCompare(bVal)
        : bVal.localeCompare(aVal)
    }

    // Number / Date
    if (aVal > bVal) return sortOrder === "asc" ? 1 : -1
    if (aVal < bVal) return sortOrder === "asc" ? -1 : 1

    return 0
  })
  const handleSort = (field: keyof Posts) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };
  const handleUpload = (file: File) => {
    console.log('Зураг файл:', file);
    // API-р илгээх бол энд бичнэ
  };


  return (
    <div >
      <CardHeader className="flex flex-col md:flex-row justify-between items-center gap-4">
        <h2 className="text-xl font-semibold text-gray-800">Мэдээллийн жагсаалт</h2>
        <div className="flex gap-2 w-full md:w-auto">
          <Input
            placeholder="Гарчиг, гүйцэтгэгч..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="max-w-xs"
          />

          {/* 🔄 Refresh */}
          <Button
            variant="outline"
            className="bg-blue-900 text-white"
            onClick={() => window.location.reload()}
          >
            <RefreshCcw size={16} />
          </Button>
          <Link href="/admin/posts/new">
            <Button

              className="flex gap-2 items-center bg-blue-500"
            >
              <Plus size={18} />  Шинэ мэдээлэл
            </Button>
          </Link>
        </div>
      </CardHeader>

      <Card>

        <CardContent className="overflow-auto">
          <Table>

            <thead>
              <tr className="bg-blue-500 text-left text-white">
                {[
                  { key: "newsid", label: "№" },
                  { key: "title", label: "Гарчиг" },
                  { key: "khoroos", label: "Хороо" },
                  { key: "engener", label: "Хяналтын байгууллага" },
                  { key: "contractor", label: "Гүйцэтгэгч" },
                  { key: "source", label: "Эх үүсвэр" },
                  { key: "imppercent", label: "Хувь" },
                  { key: "branch", label: "Салбар" },
                  { key: "updatedat", label: "Шинэчлэгдсэн огноо" },
                ].map((col) => (
                  <th
                    key={col.key}
                    onClick={() => handleSort(col.key as keyof Posts)}
                    className="py-3 px-4 cursor-pointer hover:bg-blue-400 whitespace-nowrap text-xs"
                  >
                    {col.label}{" "}
                    {sortField === col.key && (sortOrder === "asc" ? "▲" : "▼")}
                  </th>
                ))}
                <th className="py-3 px-4 text-center text-xs">Үйлдэл</th>
              </tr>
            </thead>
            <tbody>
              {sortedPosts.length > 0 ? (
                sortedPosts.map((p, index) => (
                  <tr key={p.newsid} className="border-b hover:bg-gray-50">
                    <td className="py-2 px-4 text-xs">{index + 1}</td>
                    <td className="pt-2 px-4 line-clamp-4 text-xs">{p.title}</td>
                    <td className="py-2 px-4 text-xs">
                      {Array.isArray(p.khoroos) && p.khoroos.length > 0 ? (
                        p.khoroos.map((khr, index) => (
                          <div key={index}>{khr.name}</div>
                        ))
                      ) : (
                        <div className="text-gray-500 text-xs">Хороо байхгүй</div>
                      )}</td>
                    <td className="py-2 px-4 text-xs">{p.engener}</td>
                    <td className="py-2 px-4 text-xs">{p.contractor}</td>
                    <td className="py-2 px-4 text-xs">{p.source}</td>
                    <td className="py-2 px-4 text-xs"> {p.imppercent.toLocaleString()}%</td>
                    <td className="py-2 px-4 text-xs">{p.branch}</td>
                    <td className="py-2 px-4 text-xs">
                      {new Date(p.updatedat).toLocaleDateString()}
                    </td>

                    <td className="py-2 px-2 text-center">
                      <div className="flex justify-center gap-2">
                        {/* ✔ VARIANT НЭМЭХ */}
                        <div className='flex justify-between'>
                          <Link href={`/admin/posts/edit/${p.newsid}`}>
                            <button className="bg-orange-200 hover:bg-orange-500 text-white font-bold py-2 px-2 rounded text-xs">
                              {<Pencil className='text-slate-800' size={16} />}
                            </button>
                          </Link>
                        </div>

                        <div className='ml-3'>
                          <button className="bg-blue-200 hover:bg-blue-500 text-white font-bold py-2 px-2 rounded text-xs"
                            onClick={() => { setSelectedNewsId(p.newsid); setOpen(true) }}>
                            <ImagePlus className='text-slate-800' size={16} />
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

                        <div className='ml-3'>
                          <button className="bg-red-200 hover:bg-red-500 text-white font-bold py-2 px-2 rounded text-xs"
                            onClick={async () => {
                              const confirmed = window.confirm(`Та "${p.title}" мэдээллийг устгахдаа итгэлтэй байна уу?`);
                              if (!confirmed) return;
                              deletePost(p.newsid)
                            }}>
                            <Trash className='text-slate-800' size={16} />
                          </button>
                        </div>

                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={11} className="text-center py-6 text-gray-500">
                    {loading ? "Уншиж байна..." : "Мэдээлэл олдсонгүй."}
                  </td>
                </tr>
              )}
            </tbody>

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
        </CardContent>
      </Card>

    </div>
  );

};


export default PostsTable;



