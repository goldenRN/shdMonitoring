
'use client';

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FolderArchive } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import DashboardCard from './DashboardCard';

const availableFilters = [
  { value: "mt", label: "Мэдээний тоогоор" },
  { value: "dh", label: "Дундаж хувиар" },
];

interface SourceAveragePrecent {
  sc_status: number;
  average_precent: number;
  total_posts: number;
}
interface SourceNewsCount {
  sc_status: number;
  news_count: number;
}

const statusMap: { [key: number]: string } = {
  1: 'Улсын',
  2: 'Нийслэлийн',
  3: 'Дүүргийн'
};

export default function AnalyticsChart() {
  const [selection, setSelection] = useState("mt");
  const [stats, setStats] = useState<{ status: string; count: number }[]>([]);
  const [avg, setAvg] = useState<{ status: string; average: number; count: number }[]>([]);

  useEffect(() => {
    const fetchStats = async () => {
      const res = await fetch('https://shdmonitoring.ub.gov.mn/api/posts/source-news-count');
      const data = await res.json();

      const formatted = (data as SourceNewsCount[]).map((item) => ({
        status: statusMap[item.sc_status] || 'Тодорхойгүй',
        count: item.news_count
      }));

      setStats(formatted);
    };

    const fetchAverage = async () => {
      const res = await fetch('https://shdmonitoring.ub.gov.mn/api/posts/source-average-precent');
      const json = await res.json();

      const data1 = Array.isArray(json) ? json : json.data;

      if (!Array.isArray(data1)) {
        console.error("Unexpected API response:", json);
        return;
      }

      const formatted1 = data1.map(item => ({
        status: statusMap[item.sc_status] || 'Тодорхойгүй',
        average: item.average_precent,
        count: item.total_posts
      }));

      setAvg(formatted1);

      // const res = await fetch('https://shdmonitoring.ub.gov.mn/api/posts/source-average-precent');
      // const data1: SourceAveragePrecent[] = await res.json();

      // const formatted1 = data1.map(item => ({
      //   status: statusMap[item.sc_status] || 'Тодорхойгүй',
      //   average: item.average_precent,
      //   count: item.total_posts
    // }));

  // setAvg(formatted1);
};

fetchStats();
fetchAverage();
  }, []);

const getCountByStatus = (statusName: string) => {
  return stats.find((item) => item.status === statusName)?.count ?? 0;
};

const chartData = useMemo(() => {
  return ['Улсын', 'Нийслэлийн', 'Дүүргийн'].map((name) => {
    const avgItem = avg.find((item) => item.status === name);
    return {
      name,
      mt: getCountByStatus(name),
      dh: avgItem?.average ?? 0,
    };
  });
}, [stats, avg]);

return (
  <Card>
    <CardHeader>
      <CardTitle>Хөрөнгө оруулалтын эх үүсвэрүүдийн мэдээллийн шинжилгээ</CardTitle>
      <div className='pt-5 pb-5 flex flex-col md:flex-row gap-5 mb-5'>
        {['Улсын', 'Нийслэлийн', 'Дүүргийн'].map((type, i) => (
          <div key={i} className="w-1/3 h-100 p-4 rounded"
            style={{ backgroundColor: ['#fecaca', '#bbf7d0', '#bfdbfe'][i] }}>
            <DashboardCard
              title={`${type} ТӨСВИЙН ХӨРӨНГӨ ОРУУЛАЛТ`}
              count={getCountByStatus(type)}
              icon={<FolderArchive className='text-slate-800' size={60} />}
            />
          </div>
        ))}
      </div>
      <CardDescription>Хөрөнгө оруулалтын төрлөөр ангилсан</CardDescription>
      <Select onValueChange={setSelection} defaultValue="mt">
        <SelectTrigger className="w-64 h-9 mt-3">
          <SelectValue placeholder="Төрөл сонгох" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {availableFilters.map((filter) => (
              <SelectItem key={filter.value} value={filter.value}>
                {filter.label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </CardHeader>

    <CardContent>
      <div style={{ width: '90%', height: 300 }}>
        <ResponsiveContainer>
          <LineChart data={chartData}>
            <Line type='monotone' dataKey={selection} stroke='#3b82f6' strokeWidth={4} />
            <CartesianGrid stroke='#ccc' strokeDasharray="5 5" />
            <XAxis dataKey='name' />
            {/* <YAxis /> */}
            <YAxis
              domain={[0, 110]}
            // tickFormatter={(value) => `${value}`}
            />
            <Tooltip />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </CardContent>
  </Card>
);
}
