// PerformanceSection.tsx
import React from 'react';
import CountUp from 'react-countup';
import ReactApexChart from 'react-apexcharts';

interface Perf {
    averageCompletionTime: number;
    completionRate: number;
    productivityTrend: number[];
}

interface PerformanceSectionProps {
    metrics: Perf;
}

const PerformanceSection: React.FC<PerformanceSectionProps> = ({ metrics }) => (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Average Completion Time card */}
        {/* Task Completion Rate card */}
        {/* Productivity Trend sparkline card */}
    </div>
);
export default PerformanceSection;
