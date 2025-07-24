// StatsGrid.tsx
import React from 'react';
import StatsCard from './StatsCard';
import IconBell from '../../../../components/Icon/IconBell';
import IconCalendar from '../../../../components/Icon/IconCalendar';
import IconClock from '../../../../components/Icon/IconClock';
import IconCircleCheck from '../../../../components/Icon/IconCircleCheck';
import IconTrendingUp from '../../../../components/Icon/IconTrendingUp';
import IconUsers from '../../../../components/Icon/IconUsers';
import IconSearch from '../../../../components/Icon/IconSearch';
import IconPencilPaper from '../../../../components/Icon/IconPencilPaper';
import IconInfoTriangle from '../../../../components/Icon/IconInfoTriangle';
// IconCircleCheck

interface Metrics {
    pending: number;
    completed: number;
    overdue: number;
    upcoming: number;
    total: number;
}

interface StatsGridProps {
    metrics: Metrics;
}

const StatsGrid: React.FC<StatsGridProps> = ({ metrics }) => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatsCard
            label="Pending"
            count={metrics.pending}
            total={metrics.total}
            icon={<IconPencilPaper className="w-6 h-6 text-amber-600 dark:text-amber-500" />}
            bgColor="bg-amber-100 dark:bg-amber-900/30"
            textColor="text-amber-600 dark:text-amber-500"
            barColor="bg-amber-500"
        />
        <StatsCard
            label="Completed"
            count={metrics.completed}
            total={metrics.total}
            icon={<IconCircleCheck className="w-6 h-6 text-green-600 dark:text-green-500" />}
            bgColor="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg"
            textColor="text-green-600 dark:text-green-500"
            barColor="bg-green-500"
        />
        <StatsCard
            label="OverDue"
            count={metrics.overdue}
            total={metrics.total}
            icon={<IconClock className="w-6 h-6 text-red-600 dark:text-red-500" />}
            bgColor="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg"
            textColor="text-red-600 dark:text-red-500"
            barColor="bg-red-500"
        />
    </div>
);

export default StatsGrid;
