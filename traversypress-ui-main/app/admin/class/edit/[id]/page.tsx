import BackButton from '@/components/BackButton';
import dynamic from 'next/dynamic';

const ClassForm = dynamic(() => import('@/components/class/classForm'), {
  ssr: false,
});

export default function ClassEditPage({ params }: { params: { id: string } }) {
  return (
    <div className='space-y-4 p-1'>
      <BackButton text='Буцах' link='/admin/class' />
      <ClassForm mode='edit' classId={params.id} />
    </div>
  );
}
