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
import WorkprogressEditPage from '@/app/admin/workprogres/edit/[id]/page';


interface Workprogres {
  wp_id: number;
  wp_name: string;
}

interface WorkprogresTableProps {
  limit?: number;
  title?: string;
}

const WorkprogresTable = ({ limit, title }: WorkprogresTableProps) => {
  const [workprogress, setWorkprogress] = useState<Workprogres[]>([]);

  useEffect(() => {
    const fetchWorkprogress = async () => {
      try {
        const res = await fetch('https://shdmonitoring.ub.gov.mn/api/workprogress');
        const data = await res.json();
        setWorkprogress(limit ? data.slice(0, limit) : data);
      } catch (err) {
        console.error('Алдаа:', err);
      }
    };

    fetchWorkprogress();
  }, [limit]);
 const deleteWorkprogres=async(id: number) => {
    try {
      const res = await fetch(`https://shdmonitoring.ub.gov.mn/api/workprogress/${id}`, {
        method: 'DELETE',
      });

      const data = await res.json();
      setWorkprogress((prevData) => prevData.filter(pst => pst.wp_id !== id));
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
        <TableCaption>Ажлын явцын мэдээлэл</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead >Ажлын явц</TableHead>
            <TableHead>Үйлдэл</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
           {Array.isArray(workprogress) && workprogress.length > 0 ? (
          workprogress.map((workprogres) => (
            <TableRow key={workprogres.wp_id}>
              <TableCell>{workprogres.wp_name}</TableCell>
              <TableCell>
                <div className='flex justify'><div>
                  <Link href={`/admin/workprogres/edit/${workprogres.wp_id}?wp_name=${workprogres.wp_name}`}>

                    <button className="bg-orange-200 hover:bg-orange-500 text-white font-bold py-2 px-4 rounded text-xs">
                      {<Pencil className='text-slate-800' size={20} />}
                    </button>
                  </Link>
                </div>
                  <div className='ml-5'>
                    <button className="bg-red-200 hover:bg-red-500 text-white font-bold py-2 px-4 rounded text-xs"
                      onClick={async () => {
                        const confirmed = window.confirm(`Та "${workprogres.wp_name}" салбар-г устгахдаа итгэлтэй байна уу?`);
                        if (!confirmed) return;
                        deleteWorkprogres(workprogres.wp_id)
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

export default WorkprogresTable;