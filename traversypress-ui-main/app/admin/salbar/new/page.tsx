

import BackButton from '@/components/BackButton';
import dynamic from 'next/dynamic';

const SalbarForm = dynamic(() => import('@/components/salbar/salbarForm'), {
  ssr: false,
});

export default function SalbarNewPage() {
  return (
    <div className='p-4'>
      <BackButton text='Буцах' link='/admin/salbar' />
      <h3 className='text-2xl mb-4'>Салбар нэмэх</h3>
      <SalbarForm />
    </div>
  );
}
