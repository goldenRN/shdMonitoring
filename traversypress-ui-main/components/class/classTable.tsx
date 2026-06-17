'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Pencil, Trash2, ImageIcon, Plus } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';

interface CategorySubcategory {
  subcategory_id?: number;
  name: string;
  sort_order?: number;
}

interface CategoryItem {
  class_id: number;
  class_name: string;
  description?: string;
  image_path?: string;
  sort_order?: number;
  subcategories?: CategorySubcategory[];
}

interface ClassTableProps {
  limit?: number;
  title?: string;
}

const API_BASE = 'https://shdmonitoring.ub.gov.mn';

export default function ClassTable({ limit, title }: ClassTableProps) {
  const { toast } = useToast();
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${API_BASE}/api/class`);
        const data = await res.json();
        setCategories(Array.isArray(data) ? (limit ? data.slice(0, limit) : data) : []);
      } catch (error) {
        console.error('Category fetch error:', error);
        toast({ title: 'Ангиллын мэдээлэл татахад алдаа гарлаа', variant: 'destructive' });
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, [limit, toast]);

  const deleteCategory = async (id: number, name: string) => {
    const confirmed = window.confirm(`Та "${name}" ангиллыг устгахдаа итгэлтэй байна уу?`);
    if (!confirmed) return;

    try {
      const res = await fetch(`${API_BASE}/api/class/${id}`, {
        method: 'DELETE',
      });
      const result = await res.json();

      if (!res.ok) {
        throw new Error(result?.error || 'Устгах үед алдаа гарлаа');
      }

      setCategories((prev) => prev.filter((item) => item.class_id !== id));
      toast({ title: 'Ангилал амжилттай устлаа' });
    } catch (error) {
      toast({
        title: error instanceof Error ? error.message : 'Серверийн алдаа',
        variant: 'destructive',
      });
    }
  };

  return (
    <Card className='border-slate-200 shadow-sm'>
      <CardHeader className='flex flex-row items-center justify-between'>
        <CardTitle className='text-xl text-slate-800'>{title ?? 'Нүүр хуудасны ангиллууд'}</CardTitle>
        <Link href='/admin/class/new'>
          <Button className='gap-2 bg-blue-600 hover:bg-blue-700'>
            <Plus className='h-4 w-4' />
            Ангилал нэмэх
          </Button>
        </Link>
      </CardHeader>

      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className='w-[72px]'>№</TableHead>
              <TableHead className='w-[140px]'>Зураг</TableHead>
              <TableHead>Нэр</TableHead>
              <TableHead>Дэд ангиллууд</TableHead>
              <TableHead className='w-[90px]'>Дараалал</TableHead>
              <TableHead className='w-[160px] text-right'>Үйлдэл</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories.length > 0 ? (
              categories.map((category, index) => (
                <TableRow key={category.class_id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>
                    {category.image_path ? (
                      <img
                        src={`${API_BASE}/${category.image_path}`}
                        alt={category.class_name}
                        className='h-20 w-28 rounded-lg object-cover'
                      />
                    ) : (
                      <div className='flex h-20 w-28 items-center justify-center rounded-lg border border-dashed border-slate-300 text-slate-400'>
                        <ImageIcon className='h-5 w-5' />
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className='font-medium text-slate-800'>{category.class_name}</div>
                    {category.description ? (
                      <div className='mt-1 line-clamp-2 text-xs text-slate-500'>{category.description}</div>
                    ) : null}
                  </TableCell>
                  <TableCell>
                    {Array.isArray(category.subcategories) && category.subcategories.length > 0 ? (
                      <div className='flex flex-wrap gap-2'>
                        {category.subcategories.map((subcategory, subIndex) => (
                          <span
                            key={`${category.class_id}-${subcategory.subcategory_id ?? subIndex}`}
                            className='rounded-full bg-slate-100 px-2.5 py-1 text-xs text-slate-600'
                          >
                            {subcategory.name}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <span className='text-sm text-slate-400'>Дэд ангилалгүй</span>
                    )}
                  </TableCell>
                  <TableCell>{category.sort_order ?? 0}</TableCell>
                  <TableCell>
                    <div className='flex justify-end gap-2'>
                      <Link href={`/admin/class/edit/${category.class_id}`}>
                        <Button variant='outline' size='icon'>
                          <Pencil className='h-4 w-4' />
                        </Button>
                      </Link>
                      <Button
                        variant='outline'
                        size='icon'
                        className='text-red-600 hover:text-red-700'
                        onClick={() => deleteCategory(category.class_id, category.class_name)}
                      >
                        <Trash2 className='h-4 w-4' />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className='py-12 text-center text-slate-500'>
                  {loading ? 'Ачаалж байна...' : 'Ангиллын мэдээлэл алга байна.'}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
