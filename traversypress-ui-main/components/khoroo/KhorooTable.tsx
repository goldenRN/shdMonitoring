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
        const res = await fetch('http://localhost:4000/api/khoroo');
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
            <TableHead className='hidden md:table-cell'>Хороо</TableHead>
            <TableHead>Засах</TableHead>
            <TableHead>Устгах</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {khoroos.map((khoroo) => (
            <TableRow key={khoroo.id}>
              <TableCell>{khoroo.district}</TableCell>
              <TableCell>{khoroo.name}</TableCell>
              <TableCell>
                <Link href={`/admin/khoroo/edit/${khoroo.id}?name=${khoroo.name}&dist=${khoroo.district}`}>
                  <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded text-xs">
                    Засах
                  </button>
                </Link>


              </TableCell>
              <TableCell>
                <Link href={`/admin/khoroo/edit/${khoroo.id}?name=${khoroo.name}&dist=${khoroo.district}`}>
                  <button className="bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded text-xs">
                    Устгах
                  </button>
                </Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default KhorooTable;