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

interface Supervisor {
  s_id: number;
  s_name: string;
}

interface SupervisorTableProps {
  limit?: number;
  title?: string;
}

const SupervisorTable = ({ limit, title }: SupervisorTableProps) => {
  const [supervisors, setSupervisors] = useState<Supervisor[]>([]);

  useEffect(() => {
    const fetchSupervisors = async () => {
      try {
        const res = await fetch('https://shdmonitoring.ub.gov.mn/api/supervisor');
        const data = await res.json();
        setSupervisors(limit ? data.slice(0, limit) : data);
      } catch (err) {
        console.error('Алдаа:', err);
      }
    };

    fetchSupervisors();
  }, [limit]);
 const deleteSupervisor=async(id: number) => {
    try {
      const res = await fetch(`https://shdmonitoring.ub.gov.mn/api/supervisor/${id}`, {
        method: 'DELETE',
      });

      const data = await res.json();
      setSupervisors((prevData) => prevData.filter(pst => pst.s_id !== id));
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
        <TableCaption>Захиалагчын хяналтын байгууллагын мэдээлэл</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead >Захиалагчын хяналтын байгууллагын нэр</TableHead>
            <TableHead>Үйлдэл</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
           {Array.isArray(supervisors) && supervisors.length > 0 ? (
          supervisors.map((supervisor) => (
            <TableRow key={supervisor.s_id}>
              <TableCell>{supervisor.s_name}</TableCell>
              <TableCell>
                <div className='flex justify'><div>
                  <Link href={`/admin/supervisor/edit/${supervisor.s_id}?s_name=${supervisor.s_name}`}>

                    <button className="bg-orange-200 hover:bg-orange-500 text-white font-bold py-2 px-4 rounded text-xs">
                      {<Pencil className='text-slate-800' size={20} />}
                    </button>
                  </Link>
                </div>
                  <div className='ml-5'>
                    <button className="bg-red-200 hover:bg-red-500 text-white font-bold py-2 px-4 rounded text-xs"
                      onClick={async () => {
                        const confirmed = window.confirm(`Та "${supervisor.s_name}" -г устгахдаа итгэлтэй байна уу?`);
                        if (!confirmed) return;
                        deleteSupervisor(supervisor.s_id)
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

export default SupervisorTable;