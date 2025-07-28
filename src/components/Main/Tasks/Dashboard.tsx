import React, { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import ReactApexChart from 'react-apexcharts';
import CountUp from 'react-countup';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import Dropdown from '../../../components/Dropdown';
import IconBell from '../../../components/Icon/IconBell';
import IconCalendar from '../../../components/Icon/IconCalendar';
import IconCircleCheck from '../../../components/Icon/IconCircleCheck';
import IconTrendingUp from '../../../components/Icon/IconTrendingUp';
import IconUsers from '../../../components/Icon/IconUsers';
import IconSearch from '../../../components/Icon/IconSearch';
import IconPencilPaper from '../../../components/Icon/IconPencilPaper';
import IconInfoTriangle from '../../../components/Icon/IconInfoTriangle';
// import IconFlag from '../../../components/Icon/IconFlag';
import IconHorizontalDots from '../../../components/Icon/IconHorizontalDots';
import IconPlus from '../../../components/Icon/IconPlus';
import themeConfig from '../../../theme.config';

// My imports
import Header from './TaskDashboardCompo/Header';
import StatsGrid from './TaskDashboardCompo/StatusGrid';
import TaskServices from '../../../services/TaskServices';
import { TaskAnalyticsType } from '../../../constantTypes/AnalyticsTypes';
import PerformanceSection from './TaskDashboardCompo/PerformanceSection';

// Interfaces
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

interface TeamPerformance {
    teamId: string;
    teamName: string;
    tasksCompleted: number;
    averageCompletionTime: number;
    productivityScore: number;
    members: {
        id: string;
        name: string;
        tasksCompleted: number;
        currentLoad: number;
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

const teamPerformance: TeamPerformance[] = [
    {
        teamId: 't1',
        teamName: 'UI/UX Team',
        tasksCompleted: 45,
        averageCompletionTime: 3.2, // days
        productivityScore: 85,
        members: [
            {
                id: 'emp1',
                name: 'John Doe',
                tasksCompleted: 10,
                currentLoad: 5,
            },
            {
                id: 'emp2',
                name: 'Jane Doe',
                tasksCompleted: 15,
                currentLoad: 3,
            },
        ],
    },
    {
        teamId: 't2',
        teamName: 'Backend Team',
        tasksCompleted: 30,
        averageCompletionTime: 4.5, // days
        productivityScore: 70,
        members: [
            {
                id: 'emp3',
                name: 'Bob Smith',
                tasksCompleted: 8,
                currentLoad: 4,
            },
            {
                id: 'emp4',
                name: 'Alice Johnson',
                tasksCompleted: 12,
                currentLoad: 6,
            },
        ],
    },
    {
        teamId: 't3',
        teamName: 'QA Team',
        tasksCompleted: 20,
        averageCompletionTime: 2.5, // days
        productivityScore: 90,
        members: [
            {
                id: 'emp5',
                name: 'Mike Brown',
                tasksCompleted: 6,
                currentLoad: 2,
            },
            {
                id: 'emp6',
                name: 'Emily Davis',
                tasksCompleted: 8,
                currentLoad: 3,
            },
        ],
    },
    {
        teamId: 't4',
        teamName: 'Security Team',
        tasksCompleted: 15,
        averageCompletionTime: 5.0, // days
        productivityScore: 80,
        members: [
            {
                id: 'emp7',
                name: 'David Lee',
                tasksCompleted: 5,
                currentLoad: 4,
            },
            {
                id: 'emp8',
                name: 'Sophia Kim',
                tasksCompleted: 10,
                currentLoad: 5,
            },
        ],
    },
];

// Utility functions for task analysis
const getTaskMetrics = () => {
    const now = new Date();
    const sevenDaysFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

    return {
        pending: mockTasks.filter((t) => t.status !== 'Completed').length,
        completed: mockTasks.filter((t) => t.status === 'Completed').length,
        overdue: mockTasks.filter((t) => new Date(t.deadline) < now && t.status !== 'Completed').length,
        upcoming: mockTasks.filter((t) => {
            const deadline = new Date(t.deadline);
            return deadline <= sevenDaysFromNow && deadline > now;
        }).length,
        inProgress: mockTasks.filter((t) => t.status === 'In Progress').length,
        notStarted: mockTasks.filter((t) => t.status === 'Not Started').length,
        onHold: mockTasks.filter((t) => t.status === 'On Hold').length,
    };
};

const convertToCSV = (report: any) => {
    // Implementation of CSV conversion
    const rows = [
        ['Task Management Report', `Generated on: ${report.generatedAt}`],
        [''],
        ['Overview'],
        ['Total Tasks', report.overview.totalTasks],
        ['Pending Tasks', report.overview.pending],
        ['Completed Tasks', report.overview.completed],
        ['Overdue Tasks', report.overview.overdue],
        ['Upcoming Tasks', report.overview.upcoming],
        [''],
        ['Team Performance'],
        ['Team', 'Tasks Completed', 'Avg Completion Time (days)', 'Productivity Score'],
        ...report.teamPerformance.map((t: any) => [t.teamName, t.performance.tasksCompleted, t.performance.averageCompletionTime, t.performance.productivityScore]),
        [''],
        ['Task Distribution by Priority'],
        ['High', report.taskDistribution.byPriority.high],
        ['Medium', report.taskDistribution.byPriority.medium],
        ['Low', report.taskDistribution.byPriority.low],
    ];

    return rows.map((row) => row.join(',')).join('\n');
};

// Simple Avatar Component
const Avatar = ({ name = '', className = '' }: { name: string; className?: string }) => {
    const initials = name
        .split(' ')
        .map((word) => word[0])
        .join('')
        .toUpperCase();

    return (
        <div className={`flex items-center justify-center rounded-full bg-primary-100 dark:bg-primary-900/30 ${className}`}>
            <span className="text-sm font-medium text-primary-700 dark:text-primary-400">{initials}</span>
        </div>
    );
};

const Dashboard = () => {
    // State Management
    const [selectedPeriod, setSelectedPeriod] = useState<'daily' | 'weekly' | 'monthly' | 'yearly'>('yearly');
    const [showDelegationModal, setShowDelegationModal] = useState(false);
    const [selectedTasks, setSelectedTasks] = useState<string[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterPriority, setFilterPriority] = useState<'all' | 'High' | 'Medium' | 'Low'>('all');
    const [filterStatus, setFilterStatus] = useState<'all' | Task['status']>('all');
    const isDark = document.documentElement.classList.contains('dark');

    // Relative states
    const [taskAnalytics, setTaskAnalytics] = useState<TaskAnalyticsType>();

    // Utility Functions
    const getTaskMetrics = (): DashboardMetrics['tasks'] => {
        const now = new Date();
        const upcoming = new Date();
        upcoming.setDate(now.getDate() + 7);

        return {
            total: mockTasks.length,
            pending: mockTasks.filter((t) => t.status !== 'Completed').length,
            completed: mockTasks.filter((t) => t.status === 'Completed').length,
            overdue: mockTasks.filter((t) => new Date(t.deadline) < now && t.status !== 'Completed').length,
            upcoming: mockTasks.filter((t) => {
                const deadline = new Date(t.deadline);
                return deadline > now && deadline <= upcoming && t.status !== 'Completed';
            }).length,
            inProgress: mockTasks.filter((t) => t.status === 'In Progress').length,
            notStarted: mockTasks.filter((t) => t.status === 'Not Started').length,
            onHold: mockTasks.filter((t) => t.status === 'On Hold').length,
        };
    };

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

    const getDistributionMetrics = (): DashboardMetrics['distribution'] => {
        const byTeam: Record<string, number> = {};
        const byDepartment: Record<string, number> = {};
        const byPriority: Record<string, number> = {};

        mockTasks.forEach((task) => {
            // Team distribution
            const team = task.assignedTo.team;
            byTeam[team] = (byTeam[team] || 0) + 1;

            // Department distribution
            const dept = task.assignedTo.department;
            byDepartment[dept] = (byDepartment[dept] || 0) + 1;

            // Priority distribution
            byPriority[task.priority] = (byPriority[task.priority] || 0) + 1;
        });

        return { byTeam, byDepartment, byPriority };
    };

    const getTaskAlerts = () => {
        return [
            {
                type: 'deadline',
                title: 'Task Deadline Approaching',
                message: 'Project Documentation due in 2 days',
                time: '2 hours ago',
                actionable: true,
            },
            {
                type: 'priority',
                title: 'High Priority Task Assigned',
                message: 'New UI Design Review assigned to your team',
                time: '4 hours ago',
                actionable: true,
            },
            {
                type: 'update',
                title: 'Task Status Updated',
                message: 'Backend Integration moved to In Progress',
                time: '6 hours ago',
                actionable: false,
            },
        ];
    };

    const getRecentUpdates = () => {
        return [
            {
                user: 'John Doe',
                action: 'completed the API Documentation task',
                time: '30 minutes ago',
            },
            {
                user: 'Jane Smith',
                action: 'started working on UI Components',
                time: '1 hour ago',
            },
            {
                user: 'Mike Johnson',
                action: 'added comments to Code Review',
                time: '2 hours ago',
            },
        ];
    };

    // Chart Options
    const chartOptions = useMemo(
        () => ({
            chart: {
                height: 350,
                type: 'area',
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

    const donutOptions = useMemo(
        () => ({
            ...chartOptions,
            chart: {
                type: 'donut',
                height: 250,
            },
            plotOptions: {
                pie: {
                    donut: {
                        size: '75%',
                        labels: {
                            show: true,
                            name: { show: true },
                            value: { show: true },
                            total: {
                                show: true,
                                label: 'Completion',
                                formatter: () => `${getPerformanceMetrics().completionRate}%`,
                            },
                        },
                    },
                },
            },
            legend: { show: false },
            dataLabels: { enabled: false },
        }),
        [isDark]
    );

    const distributionOptions = useMemo(
        () => ({
            ...chartOptions,
            chart: {
                type: 'bar',
                height: 250,
                stacked: true,
                stackType: '100%',
            },
            plotOptions: {
                bar: {
                    horizontal: true,
                    borderRadius: 4,
                },
            },
            legend: {
                position: 'top',
                horizontalAlign: 'left',
            },
        }),
        [isDark]
    );

    const taskCompletionSeries = useMemo(
        () => [
            {
                name: 'Completion Rate',
                data: getPerformanceMetrics().productivityTrend,
            },
        ],
        []
    );

    const donutSeries = useMemo(() => {
        const metrics = getTaskMetrics();
        return [metrics.completed, metrics.inProgress, metrics.notStarted];
    }, []);

    const distributionSeries = useMemo(
        () => [
            {
                name: 'High',
                data: [getTaskMetrics().pending, getTaskMetrics().completed, getTaskMetrics().overdue],
            },
            {
                name: 'Medium',
                data: [getTaskMetrics().upcoming, getTaskMetrics().inProgress, getTaskMetrics().notStarted],
            },
            {
                name: 'Low',
                data: [getTaskMetrics().onHold, getTaskMetrics().total - getTaskMetrics().onHold, 0],
            },
        ],
        []
    );

    const handlePeriodChange = (period: 'daily' | 'weekly' | 'monthly') => {
        setSelectedPeriod(period);
    };

    const renderStatusBadge = (status: Task['status']) => {
        const statusClasses = {
            'Not Started': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-500',
            'In Progress': 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-500',
            'On Hold': 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-500',
            Completed: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-500',
        };

        return <span className={`px-2.5 py-0.5 text-xs font-medium rounded-full ${statusClasses[status]}`}>{status}</span>;
    };

    // Filter and Search Tasks
    const filteredTasks = useMemo(() => {
        return mockTasks.filter((task) => {
            const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) || task.description.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesPriority = filterPriority === 'all' || task.priority === filterPriority;
            const matchesStatus = filterStatus === 'all' || task.status === filterStatus;
            return matchesSearch && matchesPriority && matchesStatus;
        });
    }, [searchQuery, filterPriority, filterStatus]);

    // Shimmer loading animation
    const shimmerAnimation = {
        hidden: { opacity: 0, x: -50 },
        visible: {
            opacity: 1,
            x: 0,
            transition: {
                type: 'spring',
                stiffness: 100,
                damping: 15,
            },
        },
    };

    // Notification badge animation
    const pulseAnimation = {
        scale: [1, 1.1, 1],
        transition: {
            duration: 1,
            repeat: Infinity,
            ease: 'easeInOut',
        },
    };

    const handleDragEnd = (result: DropResult) => {
        if (!result.destination) return;
        // Handle drag and drop logic here
    };

    const MM = {
        pending: 4,
        completed: 2,
        overdue: 1,
        upcoming: 1,
        total: 8,
    };
    // =================================================================
    // ================= My Coding starts from here ====================
    // =================================================================
    useEffect(() => {
        TaskServices.TaskAnalytics()
            .then((r) => {
                setTaskAnalytics(r);
            })
            .catch((e) => {
                console.log(e.message);
            });
    }, []);

    return (
        <div className="min-h-screen w-full overflow-x-hidden bg-slate-50 dark:bg-slate-900 transition-colors duration-200">
            <div className="p-6 space-y-6">
                {/* Header with Period Selection */}
                <Header selectedPeriod={selectedPeriod} setSelectedPeriod={setSelectedPeriod} />

                {/* Overview Stats Grid */}
                <StatsGrid period={selectedPeriod} metrics={taskAnalytics!} />

                {/* Performance Metrics Section */}
                {taskAnalytics && <PerformanceSection metrics={taskAnalytics} />}
            </div>
        </div>
    );
};

export default Dashboard;
