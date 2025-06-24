

import BackButton from '@/components/BackButton';
import dynamic from 'next/dynamic';

const SourceForm = dynamic(() => import('@/components/source/sourceForm'), {
  ssr: false,
});

export default function SourceNewPage() {
  return (
    <div className='p-4'>
      <BackButton text='Буцах' link='/admin/source' />
      <h3 className='text-2xl mb-4'>Хөрөнгө оруулалтын эх үүсвэр нэмэх</h3>
      <SourceForm />
    </div>
  );
}
