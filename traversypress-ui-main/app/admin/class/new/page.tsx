

import BackButton from '@/components/BackButton';
import dynamic from 'next/dynamic';

const ClassForm = dynamic(() => import('@/components/class/classForm'), {
  ssr: false,
});

export default function ClassNewPage() {
  return (
    <div className='p-4'>
      <BackButton text='Буцах' link='/admin/Class' />
      <h3 className='text-2xl mb-4'>Бүлэг нэмэх</h3>
      <ClassForm />
    </div>
  );
}
