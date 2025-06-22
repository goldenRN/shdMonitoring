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
import { Pencil, Trash } from 'lucide-react';

interface Khoroo {
  id: number;
  name: string;
  district: string;
}

interface KhorooTableProps {
  limit?: number;
  title?: string;
}

const KhorooTable = ({ limit, title }: KhorooTableProps) => {
  const [khoroos, setKhoroos] = useState<Khoroo[]>([]);

  useEffect(() => {
    const fetchKhoroos = async () => {
      try {
        const res = await fetch('https://shdmonitoring.ub.gov.mn/api/khoroo');
        const data = await res.json();
        setKhoroos(limit ? data.slice(0, limit) : data);
      } catch (err) {
        console.error('Алдаа:', err);
      }
    };

    fetchKhoroos();
  }, [limit]);

  return (
    <div className='mt-10'>
      <div className='flex justify-between'>
        <h3 className='text-2xl mb-4 font-semibold'>
          {title ? title : 'Хороод'}
        </h3>
        <Link href={`/admin/khoroo/new`}>
          <button className='bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded text-xs'>
            Нэмэх
          </button>
        </Link>
      </div>

      <Table>
        <TableCaption>Хорооны мэдээлэл</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Дүүрэг</TableHead>
            <TableHead >Хороо</TableHead>
            <TableHead>Үйлдэл</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {khoroos.map((khoroo) => (
            <TableRow key={khoroo.id}>
              <TableCell>{khoroo.district}</TableCell>
              <TableCell>{khoroo.name}</TableCell>
              <TableCell>
                <div className='flex justify'><div>
                  <Link href={`/admin/khoroo/edit/${khoroo.id}?name=${khoroo.name}&dist=${khoroo.district}`}>

                    <button className="bg-orange-200 hover:bg-orange-500 text-white font-bold py-2 px-4 rounded text-xs">
                      {<Pencil className='text-slate-800' size={20} />}
                    </button>
                  </Link>
                </div>
                  <div className='ml-5'>
                    <button className="bg-red-200 hover:bg-red-500 text-white font-bold py-2 px-4 rounded text-xs"
                      onClick={async () => {
                        const confirmed = window.confirm(`Та "${khoroo.name}" хороо-г устгахдаа итгэлтэй байна уу?`);
                        if (!confirmed) return;
                        try {
                          const res = await fetch(`https://shdmonitoring.ub.gov.mn/api/khoroo/${khoroo.id}`, {
                            method: 'DELETE',
                          });

                          const data = await res.json();

                          if (!res.ok) {
                            alert(data.error || 'Устгах үед алдаа гарлаа');
                          } else {
                            alert('Амжилттай устлаа');
                            // жагсаалтаа дахин ачаалах гэх мэт
                          }
                        } catch (err) {
                          alert('Холболтын алдаа');
                        }

                      }}>
                      <Trash className='text-slate-800' size={20} />
                    </button>
                  </div>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default KhorooTable;