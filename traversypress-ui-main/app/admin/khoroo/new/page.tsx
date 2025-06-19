

import BackButton from '@/components/BackButton';
import dynamic from 'next/dynamic';

const KhorooForm = dynamic(() => import('@/components/khoroo/khorooForm'), {
  ssr: false,
});

export default function KhorooNewPage() {
  return (
    <div className='p-4'>
      <BackButton text='Буцах' link='/admin/khoroo' />
      <h3 className='text-2xl mb-4'>Хороо нэмэх</h3>
      <KhorooForm />
    </div>
  );
}
