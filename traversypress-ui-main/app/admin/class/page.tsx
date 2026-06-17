import BackButton from '@/components/BackButton';
import ClassTable from '@/components/class/classTable';

export default function ClassPage() {
  return (
    <div className='space-y-4'>
      <BackButton text='Буцах' link='/admin/dashboard' />
      <ClassTable />
    </div>
  );
}
