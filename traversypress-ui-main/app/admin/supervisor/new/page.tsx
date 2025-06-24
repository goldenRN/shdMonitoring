

import BackButton from '@/components/BackButton';
import dynamic from 'next/dynamic';

const SupervisorForm = dynamic(() => import('@/components/supervisor/supervisorForm'), {
  ssr: false,
});

export default function SupervisorNewPage() {
  return (
    <div className='p-4'>
      <BackButton text='Буцах' link='/admin/supervisor' />
      <h3 className='text-2xl mb-4'>Захиалагчын хяналтын байгууллага нэмэх</h3>
      <SupervisorForm />
    </div>
  );
}
