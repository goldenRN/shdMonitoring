import { Card, CardContent } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';

interface DashboardCardProps {
  title: string;
  count: number;
  icon: React.ReactElement<LucideIcon>;
}

const DashboardCard = ({ title, count, icon }: DashboardCardProps) => {
  return (
    <Card className='border border-slate-200/70 bg-white p-4 shadow-sm transition-shadow hover:shadow-md'>
      <CardContent className='p-2'>
        <h3 className='text-sm text-center mb-4 font-semibold tracking-wide text-slate-600'>
          {title}
        </h3>
        <div className='flex gap-6 justify-center items-center'>
          {icon}
          <h3 className='text-3xl md:text-4xl font-bold text-slate-700'>
            {count}
          </h3>
        </div>
      </CardContent>
    </Card>
  );
};

export default DashboardCard;
