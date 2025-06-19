
import AdminPage from './page';

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <div className='flex'>
        <AdminPage>{children}</AdminPage>
        {/* <div className='p-5 w-full md:max-w-[1140px]'>{children}</div> */}
      </div>
    </>
  );
};

export default MainLayout;
