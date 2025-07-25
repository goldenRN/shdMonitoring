'use client';

import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    ResponsiveContainer,
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
import { useEffect, useMemo, useState } from 'react';

const COLORS = ['#60a5fa', '#facc15', '#f87171'];

const availableFilters = [
    { value: "mt", label: "Мэдээний тоо" },
    { value: "dh", label: "Дундаж хувь" },
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

export default function PieChartAnalytics() {
    const [selection, setSelection] = useState("mt");
    const [stats, setStats] = useState<{ status: string; count: number }[]>([]);
    const [avg, setAvg] = useState<{ status: string; average: number; count: number }[]>([]);

    useEffect(() => {
        const fetchStats = async () => {
            const res = await fetch('https://shdmonitoring.ub.gov.mn/api/posts/source-news-count');
            const data = await res.json();
            const formatted = (data as SourceNewsCount[]).map((item) => ({
                status: statusMap[item.sc_status] || 'Тодорхойгүй',
                count: item.news_count,
            }));
            setStats(formatted);
        };

        const fetchAverage = async () => {
            const res = await fetch('https://shdmonitoring.ub.gov.mn/api/posts/source-average-precent');
            const data1: SourceAveragePrecent[] = await res.json();
            if (data1 != null) {
                const formatted1 = data1.map(item => ({
                    status: statusMap[item.sc_status] || 'Тодорхойгүй',
                    average: item.average_precent,
                    count: item.total_posts,
                }));
                setAvg(formatted1);
            }

        };

        fetchStats();
        fetchAverage();
    }, []);

    // ✅ PieChart-д ашиглах өгөгдлийг бэлдэнэ
    const pieData = useMemo(() => {
        if (selection === 'mt') {
            return stats.map((item) => ({
                name: item.status,
                value: item.count,
            }));
        } else {
            return avg.map((item) => ({
                name: item.status,
                value: item.average,
            }));
        }
    }, [selection, stats, avg]);

    return (
        <Card>
            <CardHeader>
                <CardTitle>Хөрөнгө оруулалтын төрөл бүрийн харьцуулалт (PieChart)</CardTitle>
                <CardDescription>Сонгосон төрлөөр харуулах</CardDescription>
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
                <div style={{ width: '100%', height: 300 }}>
                    <ResponsiveContainer>
                        <PieChart>
                            <Pie
                                data={pieData}
                                dataKey="value"
                                nameKey="name"
                                outerRadius={110}
                                label
                            >
                                {pieData.map((_, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
}
