
import AdminPage from './page';
import { ProtectedRoute } from '@/components/ProtectedRoute';

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <ProtectedRoute>
        <div className='flex'>
          <AdminPage>{children}</AdminPage>
          {/* <div className='p-5 w-full md:max-w-[1140px]'>{children}</div> */}
        </div>
      </ProtectedRoute>
    </>
  );
};

export default MainLayout;
