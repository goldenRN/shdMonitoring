

import BackButton from '@/components/BackButton';
import dynamic from 'next/dynamic';

const WorkprogesForm = dynamic(() => import('@/components/workprogres/workprogresForm'), {
  ssr: false,
});

export default function WorkprogesNewPage() {
  return (
    <div className='p-4'>
      <BackButton text='Буцах' link='/admin/workprogres' />
      <h3 className='text-2xl mb-4'>Ажлын явц нэмэх</h3>
      <WorkprogesForm />
    </div>
  );
}
