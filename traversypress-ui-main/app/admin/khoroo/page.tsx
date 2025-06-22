
import BackButton from '@/components/BackButton';
import KhorooTable from '@/components/khoroo/KhorooTable';
import KhorooPagination from '@/components/khoroo/KhorooPagination';
import { Sidebar } from '@/components/ui/sidebar';

const KhorooPage = () => {
    return (
        <>
            <BackButton text='Буцах' link='/admin/dashboard' />
            <KhorooTable />
            {/* <KhorooPagination /> */}
        </>
    );
};

export default KhorooPage;
