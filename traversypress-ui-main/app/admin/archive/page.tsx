import ArchiveTable from '@/components/archive/ArchiveTable';
import BackButton from '@/components/BackButton';

const ArchivePage = () => {
  return (
    <>

      {/* <div className="w-[calc(100vw-300px)]"> */}
      <div className='overflow-x-auto'>

        <div className="overflow-x-auto">
          <ArchiveTable />
        </div>
        {/* <PostsPagination /> */}
      </div>
    </>
  );
};

export default ArchivePage;
