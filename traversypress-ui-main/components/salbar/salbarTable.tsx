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

interface Salbar {
  b_id: number;
  b_name: string;
}

interface SalbarTableProps {
  limit?: number;
  title?: string;
}

const SalbarTable = ({ limit, title }: SalbarTableProps) => {
  const [salbars, setSalbars] = useState<Salbar[]>([]);

  useEffect(() => {
    const fetchSalbars = async () => {
      try {
        const res = await fetch('https://shdmonitoring.ub.gov.mn/api/branch');
        const data = await res.json();
        setSalbars(limit ? data.slice(0, limit) : data);
      } catch (err) {
        console.error('Алдаа:', err);
      }
    };

    fetchSalbars();
  }, [limit]);
 const deleteSalbar=async(id: number) => {
    try {
      const res = await fetch(`https://shdmonitoring.ub.gov.mn/api/branch/${id}`, {
        method: 'DELETE',
      });

      const data = await res.json();
      setSalbars((prevData) => prevData.filter(pst => pst.b_id !== id));
      if (!res.ok) {
        alert(data.error || 'Устгах үед алдаа гарлаа');
      } else {

        alert('Амжилттай устлаа');
        // жагсаалтаа дахин ачаалах гэх мэт
      }
    } catch (err) {
      alert('Холболтын алдаа');
    }

  };
  return (
    <div >
      <div className='flex justify-between'>
        <h3 className='text-2xl mb-4 font-semibold'>
          {title ? title : 'Нэршил бүртгэл'}
        </h3>
      </div>

      <Table>
        <TableCaption>Салбарын мэдээлэл</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead >Салбар</TableHead>
            <TableHead>Үйлдэл</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
           {Array.isArray(salbars) && salbars.length > 0 ? (
          salbars.map((salbar) => (
            <TableRow key={salbar.b_id}>
              <TableCell>{salbar.b_name}</TableCell>
              <TableCell>
                <div className='flex justify'><div>
                  <Link href={`/admin/salbar/edit/${salbar.b_id}?b_name=${salbar.b_name}`}>

                    <button className="bg-orange-200 hover:bg-orange-500 text-white font-bold py-2 px-4 rounded text-xs">
                      {<Pencil className='text-slate-800' size={20} />}
                    </button>
                  </Link>
                </div>
                  <div className='ml-5'>
                    <button className="bg-red-200 hover:bg-red-500 text-white font-bold py-2 px-4 rounded text-xs"
                      onClick={async () => {
                        const confirmed = window.confirm(`Та "${salbar.b_name}" салбар-г устгахдаа итгэлтэй байна уу?`);
                        if (!confirmed) return;
                        deleteSalbar(salbar.b_id)
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
      </Table>
    </div>
  );
};

export default SalbarTable;