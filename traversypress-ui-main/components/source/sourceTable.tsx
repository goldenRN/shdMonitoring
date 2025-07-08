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

interface Source {
  sc_id: number;
  sc_name: string;
  sc_status: string;
}

interface SourceTableProps {
  limit?: number;
  title?: string;
}

const SourceTable = ({ limit, title }: SourceTableProps) => {
  const [sources, setSources] = useState<Source[]>([]);
  const status = [
    { sc_id: 1, sc_name: 'Улсын' },
    { sc_id: 2, sc_name: 'Нийслэлийн' },
    { sc_id: 3, sc_name: 'Дүүргийн' },
  ];
  useEffect(() => {
    const fetchSources = async () => {
      try {
        const res = await fetch('https://shdmonitoring.ub.gov.mn/api/source');
        const data = await res.json();
        console.log('data:', data);
        setSources(limit ? data.slice(0, limit) : data);
      } catch (err) {
        console.error('Алдаа:', err);
      }
    };

    fetchSources();
  }, [limit]);
  const deleteSource = async (id: number) => {
    try {
      const res = await fetch(`https://shdmonitoring.ub.gov.mn/api/source/${id}`, {
        method: 'DELETE',
      });

      const data = await res.json();
      setSources((prevData) => prevData.filter(pst => pst.sc_id !== id));
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
        <TableCaption>Хөрөнгө оруулалтын эх үүсвэр мэдээлэл</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead >Хөрөнгө оруулалтын эх үүсвэр</TableHead>
            <TableHead >эх үүсвэр төрөл</TableHead>
            <TableHead>Үйлдэл</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.isArray(sources) && sources.length > 0 ? (

            sources.map((source) => (


              <TableRow key={source.sc_id}>
                <TableCell>{source.sc_name}</TableCell>
                <TableCell>{

                  status.find((sts) => sts.sc_id === Number(source.sc_status))?.sc_name || 'Тодорхойгүй'

                }</TableCell>
                <TableCell>
                  <div className='flex justify'><div>
                    <Link href={`/admin/source/edit/${source.sc_id}?sc_name=${source.sc_name}`}>

                      <button className="bg-orange-200 hover:bg-orange-500 text-white font-bold py-2 px-4 rounded text-xs">
                        {<Pencil className='text-slate-800' size={20} />}
                      </button>
                    </Link>
                  </div>
                    <div className='ml-5'>
                      <button className="bg-red-200 hover:bg-red-500 text-white font-bold py-2 px-4 rounded text-xs"
                        onClick={async () => {
                          const confirmed = window.confirm(`Та "${source.sc_name}" Хөрөнгө оруулалтын эх үүсвэр-г устгахдаа итгэлтэй байна уу?`);
                          if (!confirmed) return;
                          deleteSource(source.sc_id)
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

export default SourceTable;