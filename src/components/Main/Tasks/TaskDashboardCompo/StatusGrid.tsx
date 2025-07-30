// StatsGrid.tsx
import React, { useEffect, useState } from 'react';
import StatsCard from './StatsCard';
import IconCalendar from '../../../../components/Icon/IconCalendar';
import IconClock from '../../../../components/Icon/IconClock';
import IconCircleCheck from '../../../../components/Icon/IconCircleCheck';
import IconPencilPaper from '../../../../components/Icon/IconPencilPaper';
import { TaskAnalyticsType } from '../../../../constantTypes/AnalyticsTypes';

interface StatsGridProps {
    metrics: TaskAnalyticsType;
    period: string;
}

const StatsGrid: React.FC<StatsGridProps> = ({ metrics, period }) => {
    if (!metrics) return <div>No Data</div>;
    const [showMe, setShowMe] = useState<any>();
    console.log('We got Metrics: ', metrics);

    useEffect(() => {
        if (period === 'daily') {
            setShowMe(metrics.today);
        } else if (period === 'weekly') {
            setShowMe(metrics.this_week);
        } else if (period === 'monthly') {
            setShowMe(metrics.this_month);
        } else if (period === 'yearly') {
            setShowMe(metrics.this_year);
        }
    });

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatsCard
                label="Pending"
                count={showMe?.status_counts?.Pending || 0}
                total={showMe?.total}
                icon={<IconPencilPaper className="w-6 h-6 text-amber-600 dark:text-amber-500" />}
                bgColor="bg-amber-100 dark:bg-amber-900/30"
                textColor="text-amber-600 dark:text-amber-500"
                barColor="bg-amber-500"
            />
            <StatsCard
                label="Completed"
                count={showMe?.status_counts?.Completed || 0}
                total={showMe?.total}
                icon={<IconCircleCheck className="w-6 h-6 text-green-600 dark:text-green-500" />}
                bgColor="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg"
                textColor="text-green-600 dark:text-green-500"
                barColor="bg-green-500"
            />
            <StatsCard
                label="OverDue"
                count={showMe?.status_counts?.Overdue || 0}
                total={showMe?.total}
                icon={<IconClock className="w-6 h-6 text-red-600 dark:text-red-500" />}
                bgColor="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg"
                textColor="text-red-600 dark:text-red-500"
                barColor="bg-red-500"
            />
            <StatsCard
                label="Up Comping"
                count={showMe?.status_counts?.Upcoming || 0}
                total={showMe?.total}
                icon={<IconCalendar className="w-6 h-6 text-blue-600 dark:text-blue-500" />}
                bgColor="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg"
                textColor="text-blue-600 dark:text-blue-500"
                barColor="bg-blue-500"
            />
        </div>
    );
};

export default StatsGrid;
