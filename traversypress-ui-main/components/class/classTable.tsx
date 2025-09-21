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

interface Classes {
  class_id: number;
  class_name: string;
  description: string;
}

interface ClassTableProps {
  limit?: number;
  title?: string;
}

const ClassTable = ({ limit, title }: ClassTableProps) => {
  const [classs, setClasss] = useState<Classes[]>([]);

  useEffect(() => {
    const fetchClasss = async () => {
      try {
        const res = await fetch('https://shdmonitoring.ub.gov.mn/api/class');
        const data = await res.json();
        setClasss(limit ? data.slice(0, limit) : data);
        console.error('classs:', classs);
      } catch (err) {
        console.error('Алдаа:', err);
      }
    };

    fetchClasss();
  }, [limit]);
  const deleteClass = async (id: number) => {
    try {
      const res = await fetch(`https://shdmonitoring.ub.gov.mn/api/class/${id}`, {
        method: 'DELETE',
      });

      const data = await res.json();
      setClasss((prevData) => prevData.filter(pst => pst.class_id !== id));
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
        <TableCaption>Бүлгийн мэдээлэл</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead >Бүлэг</TableHead>
            <TableHead >Тайлбар</TableHead>
            {/* <TableHead>Үйлдэл</TableHead> */}
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.isArray(classs) && classs.length > 0 ? (
            classs.map((classes) => (
              <TableRow key={classes.class_id}>
                <TableCell>{classes.class_name}</TableCell>
                <TableCell>{classes.description}</TableCell>
                {/* <TableCell>
                  <div className='flex justify'><div>
                    <Link href={`/admin/class/edit/${classes.class_id}?class_name=${classes.class_name}&description=${classes.description}`}>

                      <button className="bg-orange-200 hover:bg-orange-500 text-white font-bold py-2 px-4 rounded text-xs">
                        {<Pencil className='text-slate-800' size={20} />}
                      </button>
                    </Link>
                  </div>
                    <div className='ml-5'>
                      <button className="bg-red-200 hover:bg-red-500 text-white font-bold py-2 px-4 rounded text-xs"
                        onClick={async () => {
                          const confirmed = window.confirm(`Та "${classes.class_name}" салбар-г устгахдаа итгэлтэй байна уу?`);
                          if (!confirmed) return;
                          deleteClass(classes.class_id)
                        }}>
                        <Trash className='text-slate-800' size={20} />
                      </button>
                    </div>
                  </div>
                </TableCell> */}
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

export default ClassTable;