// PerformanceSection.tsx
import React, { useMemo } from 'react';
import CountUp from 'react-countup';
import ReactApexChart from 'react-apexcharts';
import IconClock from '../../../../components/Icon/IconClock';
import IconCircleCheck from '../../../../components/Icon/IconCircleCheck';
import IconTrendingUp from '../../../../components/Icon/IconTrendingUp';
import { TaskAnalyticsType } from '../../../../constantTypes/AnalyticsTypes';

interface PerformanceSectionProps {
    metrics: TaskAnalyticsType;
}
interface Task {
    id: string;
    title: string;
    description: string;
    deadline: string;
    status: 'Not Started' | 'In Progress' | 'Completed' | 'On Hold';
    priority: 'High' | 'Medium' | 'Low';
    progress: number;
    assignedTo: {
        id: string;
        name: string;
        team: string;
        department: string;
        avatar?: string;
    };
    startDate: string;
    completedDate?: string;
    tags: string[];
    dependencies?: string[];
    comments?: {
        id: string;
        userId: string;
        text: string;
        timestamp: string;
    }[];
}
interface DashboardMetrics {
    tasks: {
        total: number;
        pending: number;
        completed: number;
        overdue: number;
        upcoming: number;
        inProgress: number;
        notStarted: number;
        onHold: number;
    };
    performance: {
        averageCompletionTime: number;
        completionRate: number;
        productivityTrend: number[];
    };
    distribution: {
        byTeam: Record<string, number>;
        byDepartment: Record<string, number>;
        byPriority: Record<string, number>;
    };
}

// Extended Mock Data
const mockTasks: Task[] = [
    {
        id: '1',
        title: 'Update User Dashboard Design',
        deadline: '2024-12-08T14:00:00',
        status: 'In Progress',
        priority: 'High',
        progress: 65,
        assignedTo: {
            id: 'emp1',
            name: 'John Doe',
            team: 'UI/UX',
            department: 'Design',
        },
        startDate: '2024-12-05T09:00:00',
        description: 'Redesign the user dashboard with modern UI elements',
        tags: ['design', 'frontend'],
    },
    {
        id: '2',
        title: 'Create API Documentation',
        deadline: '2024-12-10T10:00:00',
        status: 'Not Started',
        priority: 'Medium',
        progress: 0,
        assignedTo: {
            id: 'emp2',
            name: 'Jane Doe',
            team: 'Backend',
            department: 'Development',
        },
        startDate: '2024-12-10T09:00:00',
        description: 'Create API documentation for the new feature',
        tags: ['api', 'backend'],
    },
    {
        id: '3',
        title: 'Review Code Changes',
        deadline: '2024-12-07T17:00:00',
        status: 'Completed',
        priority: 'Low',
        progress: 100,
        assignedTo: {
            id: 'emp3',
            name: 'Bob Smith',
            team: 'QA',
            department: 'Testing',
        },
        startDate: '2024-12-05T09:00:00',
        completedDate: '2024-12-07T16:00:00',
        description: 'Review code changes for the new feature',
        tags: ['code-review', 'testing'],
    },
    {
        id: '4',
        title: 'Fix Security Vulnerabilities',
        deadline: '2024-12-12T11:00:00',
        status: 'In Progress',
        priority: 'High',
        progress: 45,
        assignedTo: {
            id: 'emp4',
            name: 'Alice Johnson',
            team: 'Security',
            department: 'Security',
        },
        startDate: '2024-12-08T09:00:00',
        description: 'Fix security vulnerabilities in the application',
        tags: ['security', 'vulnerabilities'],
    },
];

const PerformanceSection: React.FC<PerformanceSectionProps> = ({ metrics }) => {
    const isDark = document.documentElement.classList.contains('dark');
    const getPerformanceMetrics = (): DashboardMetrics['performance'] => {
        const completedTasks = mockTasks.filter((t) => t.status === 'Completed');
        const avgTime =
            completedTasks.reduce((acc, task) => {
                if (task.completedDate && task.startDate) {
                    const start = new Date(task.startDate);
                    const end = new Date(task.completedDate);
                    return acc + (end.getTime() - start.getTime()) / (1000 * 3600 * 24);
                }
                return acc;
            }, 0) / (completedTasks.length || 1);

        return {
            averageCompletionTime: Number(avgTime.toFixed(1)),
            completionRate: Math.round((completedTasks.length / mockTasks.length) * 100),
            productivityTrend: [65, 70, 75, 80, 85, 82, 85], // Mock trend data
        };
    };

    // Chart Options

    const chartOptions = useMemo(
        () => ({
            chart: {
                height: 350,
                type: 'area' as const,
                fontFamily: 'Inter, sans-serif',
                zoom: { enabled: false },
                toolbar: { show: false },
                background: 'transparent',
            },
            dataLabels: { enabled: false },
            stroke: {
                curve: 'smooth',
                width: 2,
            },
            colors: ['#4f46e5', '#06b6d4', '#10b981'], // Indigo, Cyan, Emerald
            grid: {
                borderColor: isDark ? '#1e293b' : '#e2e8f0',
                strokeDashArray: 5,
                xaxis: { lines: { show: true } },
                yaxis: { lines: { show: true } },
                padding: { top: 0, right: 0, bottom: 0, left: 0 },
            },
            tooltip: {
                theme: isDark ? 'dark' : 'light',
                x: { show: true },
                y: {
                    formatter: (value: number) => `${value}%`,
                },
                style: {
                    fontSize: '12px',
                    fontFamily: 'Inter, sans-serif',
                },
            },
            xaxis: {
                categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                labels: {
                    style: {
                        colors: isDark ? '#94a3b8' : '#64748b',
                        fontSize: '12px',
                        fontFamily: 'Inter, sans-serif',
                    },
                },
                axisBorder: { show: false },
                axisTicks: { show: false },
            },
            yaxis: {
                labels: {
                    style: {
                        colors: isDark ? '#94a3b8' : '#64748b',
                        fontSize: '12px',
                        fontFamily: 'Inter, sans-serif',
                    },
                    formatter: (value: number) => `${value}%`,
                },
            },
            fill: {
                type: 'gradient',
                gradient: {
                    type: 'vertical',
                    shadeIntensity: 1,
                    inverseColors: false,
                    opacityFrom: 0.45,
                    opacityTo: 0.1,
                    stops: [45, 100],
                },
            },
        }),
        [isDark]
    );
    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            {/* Average Completion Time */}
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg overflow-hidden">
                <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                        <p className="text-small font-semibold text-slate-900 dark:text-white">Average Completion Time</p>
                        <div className="p-2 bg-primary-100 dark:bg-primary-900/30 rounded-lg">
                            <IconClock className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                        </div>
                    </div>
                    <div className="flex items-baseline gap-2 mb-2">
                        <span className="text-4xl font-bold text-slate-900 dark:text-white">
                            <CountUp end={getPerformanceMetrics().averageCompletionTime} duration={2} decimals={1} />
                        </span>
                        <span className="text-small text-slate-600 dark:text-slate-400">days</span>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Average time to complete tasks</p>
                </div>
            </div>

            {/* Task Completion Rate */}
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg overflow-hidden">
                <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                        <p className="text-small font-semibold text-slate-900 dark:text-white">Task Completion Rate</p>
                        <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                            <IconCircleCheck className="w-5 h-5 text-green-600 dark:text-green-400" />
                        </div>
                    </div>
                    <div className="flex items-baseline gap-2 mb-2">
                        <span className="text-4xl font-bold text-slate-900 dark:text-white">
                            <CountUp end={getPerformanceMetrics().completionRate} duration={2} />
                        </span>
                        <span className="text-small text-slate-600 dark:text-slate-400">%</span>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Tasks completed vs total tasks</p>
                </div>
            </div>

            {/* Productivity Trend */}
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg overflow-hidden">
                <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                        <p className="text-small font-semibold text-slate-900 dark:text-white">Productivity Trend</p>
                        <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                            <IconTrendingUp className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        </div>
                    </div>
                    <div className="h-[120px]">
                        <ReactApexChart
                            options={{
                                ...chartOptions,
                                chart: {
                                    ...chartOptions.chart,
                                    sparkline: {
                                        enabled: true,
                                    },
                                },
                                stroke: {
                                    curve: 'smooth',
                                    width: 2,
                                },
                                colors: ['#3b82f6'],
                                tooltip: {
                                    fixed: {
                                        enabled: false,
                                    },
                                    x: {
                                        show: false,
                                    },
                                    y: {
                                        title: {
                                            formatter: () => 'Productivity',
                                        },
                                    },
                                    marker: {
                                        show: false,
                                    },
                                },
                            }}
                            series={[
                                {
                                    name: 'Productivity',
                                    data: getPerformanceMetrics().productivityTrend,
                                },
                            ]}
                            type="line"
                            height="100%"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};
export default PerformanceSection;
