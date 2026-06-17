import BackButton from '@/components/BackButton';
import dynamic from 'next/dynamic';

const ClassForm = dynamic(() => import('@/components/class/classForm'), {
  ssr: false,
});

export default function ClassNewPage() {
  return (
    <div className='space-y-4 p-1'>
      <BackButton text='Буцах' link='/admin/class' />
      <ClassForm mode='create' />
    </div>
  );
}
