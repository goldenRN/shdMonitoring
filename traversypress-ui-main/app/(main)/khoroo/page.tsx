
import BackButton from '@/components/BackButton';
import KhorooTable from '@/components/khoroo/KhorooTable';
import KhorooPagination from '@/components/khoroo/KhorooPagination';

const KhorooPage = () => {
    return (
        <>
            <BackButton text='Буцах' link='/' />
            <KhorooTable />
            <KhorooPagination />
        </>
    );
};

export default KhorooPage;
