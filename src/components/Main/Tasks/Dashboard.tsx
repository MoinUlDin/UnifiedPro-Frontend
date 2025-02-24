import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import ReactApexChart from 'react-apexcharts';
import CountUp from 'react-countup';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import Dropdown from '../../../components/Dropdown';
import IconBell from '../../../components/Icon/IconBell';
import IconCalendar from '../../../components/Icon/IconCalendar';
import IconClock from '../../../components/Icon/IconClock';
import IconCircleCheck from '../../../components/Icon/IconCircleCheck';
import IconTrendingUp from '../../../components/Icon/IconTrendingUp';
import IconUsers from '../../../components/Icon/IconUsers';
import IconSearch from '../../../components/Icon/IconSearch';
import IconPencilPaper from '../../../components/Icon/IconPencilPaper';
import IconInfoTriangle from '../../../components/Icon/IconInfoTriangle';
import IconFlag from '../../../components/Icon/IconFlag';
import IconHorizontalDots from '../../../components/Icon/IconHorizontalDots';
import IconPlus from '../../../components/Icon/IconPlus';
import themeConfig from '../../../theme.config';

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

interface Notification {
    id: string;
    type: 'deadline' | 'update' | 'mention' | 'alert';
    message: string;
    priority: 'low' | 'medium' | 'high';
    timestamp: string;
    read: boolean;
    relatedTaskId?: string;
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
            department: 'Design'
        },
        startDate: '2024-12-05T09:00:00',
        description: 'Redesign the user dashboard with modern UI elements',
        tags: ['design', 'frontend']
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
            department: 'Development'
        },
        startDate: '2024-12-10T09:00:00',
        description: 'Create API documentation for the new feature',
        tags: ['api', 'backend']
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
            department: 'Testing'
        },
        startDate: '2024-12-05T09:00:00',
        completedDate: '2024-12-07T16:00:00',
        description: 'Review code changes for the new feature',
        tags: ['code-review', 'testing']
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
            department: 'Security'
        },
        startDate: '2024-12-08T09:00:00',
        description: 'Fix security vulnerabilities in the application',
        tags: ['security', 'vulnerabilities']
    }
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
                currentLoad: 5
            },
            {
                id: 'emp2',
                name: 'Jane Doe',
                tasksCompleted: 15,
                currentLoad: 3
            }
        ]
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
                currentLoad: 4
            },
            {
                id: 'emp4',
                name: 'Alice Johnson',
                tasksCompleted: 12,
                currentLoad: 6
            }
        ]
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
                currentLoad: 2
            },
            {
                id: 'emp6',
                name: 'Emily Davis',
                tasksCompleted: 8,
                currentLoad: 3
            }
        ]
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
                currentLoad: 4
            },
            {
                id: 'emp8',
                name: 'Sophia Kim',
                tasksCompleted: 10,
                currentLoad: 5
            }
        ]
    }
];

// Utility functions for task analysis
const getTaskMetrics = () => {
    const now = new Date();
    const sevenDaysFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    
    return {
        pending: mockTasks.filter(t => t.status !== 'Completed').length,
        completed: mockTasks.filter(t => t.status === 'Completed').length,
        overdue: mockTasks.filter(t => new Date(t.deadline) < now && t.status !== 'Completed').length,
        upcoming: mockTasks.filter(t => {
            const deadline = new Date(t.deadline);
            return deadline <= sevenDaysFromNow && deadline > now;
        }).length,
        inProgress: mockTasks.filter(t => t.status === 'In Progress').length,
        notStarted: mockTasks.filter(t => t.status === 'Not Started').length,
        onHold: mockTasks.filter(t => t.status === 'On Hold').length
    };
};

const generateTaskReport = () => {
    const metrics = getTaskMetrics();
    const teamStats = teamPerformance.map(team => ({
        teamName: team.teamName,
        performance: {
            tasksCompleted: team.tasksCompleted,
            averageCompletionTime: team.averageCompletionTime,
            productivityScore: team.productivityScore
        }
    }));

    const report = {
        generatedAt: new Date().toISOString(),
        overview: {
            totalTasks: mockTasks.length,
            ...metrics
        },
        teamPerformance: teamStats,
        taskDistribution: {
            byPriority: {
                high: mockTasks.filter(t => t.priority === 'High').length,
                medium: mockTasks.filter(t => t.priority === 'Medium').length,
                low: mockTasks.filter(t => t.priority === 'Low').length
            },
            byDepartment: mockTasks.reduce((acc, task) => {
                const dept = task.assignedTo.department;
                acc[dept] = (acc[dept] || 0) + 1;
                return acc;
            }, {} as Record<string, number>)
        }
    };

    // Convert to CSV and trigger download
    const csv = convertToCSV(report);
    downloadCSV(csv, `task-report-${new Date().toISOString().split('T')[0]}.csv`);
    
    // Also return JSON for potential API integration
    return report;
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
        ...report.teamPerformance.map((t: any) => [
            t.teamName,
            t.performance.tasksCompleted,
            t.performance.averageCompletionTime,
            t.performance.productivityScore
        ]),
        [''],
        ['Task Distribution by Priority'],
        ['High', report.taskDistribution.byPriority.high],
        ['Medium', report.taskDistribution.byPriority.medium],
        ['Low', report.taskDistribution.byPriority.low]
    ];

    return rows.map(row => row.join(',')).join('\n');
};

const downloadCSV = (csv: string, filename: string) => {
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (navigator.msSaveBlob) {
        navigator.msSaveBlob(blob, filename);
    } else {
        link.href = URL.createObjectURL(blob);
        link.setAttribute('download', filename);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
};

const taskCompletionOptions = {
    chart: {
        height: 325,
        type: 'area',
        fontFamily: 'Nunito, sans-serif',
        zoom: { enabled: false },
        toolbar: { show: false },
    },
    dataLabels: { enabled: false },
    stroke: {
        width: [2, 2],
        curve: 'smooth',
    },
    colors: ['#4361ee', '#1abc9c'],
    grid: {
        borderColor: themeConfig.theme === 'dark' ? '#191e3a' : '#e0e6ed',
        padding: { top: 5, right: 20, bottom: 5, left: 20 },
    },
    xaxis: {
        categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    },
};

const taskCompletionSeries = [
    {
        name: 'Completed Tasks',
        data: [28, 29, 33, 36, 32, 32, 33],
    },
    {
        name: 'New Tasks',
        data: [12, 11, 14, 18, 17, 13, 13],
    },
];

const taskDistributionOptions = {
    chart: {
        type: 'donut',
        height: 300,
        zoom: { enabled: false },
    },
    labels: ['Completed', 'In Progress', 'On Hold', 'Not Started'],
    colors: ['#00ab55', '#4361ee', '#e7515a', '#ffa600'],
    stroke: { show: false },
    legend: {
        position: 'bottom',
        horizontalAlign: 'center',
        fontSize: '14px',
        markers: {
            width: 10,
            height: 10,
            offsetX: -2,
        },
    },
};

const taskDistributionSeries = [44, 55, 13, 33];

const teamPerformanceOptions = {
    chart: {
        type: 'bar',
        height: 350,
        stacked: true,
        toolbar: { show: false },
    },
    plotOptions: {
        bar: {
            horizontal: false,
            borderRadius: 10,
            columnWidth: '35%',
        },
    },
    xaxis: {
        categories: ['Team A', 'Team B', 'Team C', 'Team D', 'Team E', 'Team F'],
    },
    legend: {
        position: 'top',
        horizontalAlign: 'right',
        offsetY: -10,
    },
    fill: { opacity: 1 },
    colors: ['#00ab55', '#4361ee', '#e7515a'],
};

const teamPerformanceSeries = [
    {
        name: 'Completed',
        data: [44, 55, 41, 67, 22, 43],
    },
    {
        name: 'In Progress',
        data: [13, 23, 20, 8, 13, 27],
    },
    {
        name: 'On Hold',
        data: [11, 17, 15, 15, 21, 14],
    },
];

// Simple Avatar Component
const Avatar = ({ name = '', className = '' }: { name: string; className?: string }) => {
    const initials = name
        .split(' ')
        .map(word => word[0])
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
    const [selectedPeriod, setSelectedPeriod] = useState<'daily' | 'weekly' | 'monthly'>('daily');
    const [showNotifications, setShowNotifications] = useState(false);
    const [showDelegationModal, setShowDelegationModal] = useState(false);
    const [selectedTasks, setSelectedTasks] = useState<string[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterPriority, setFilterPriority] = useState<'all' | 'High' | 'Medium' | 'Low'>('all');
    const [filterStatus, setFilterStatus] = useState<'all' | Task['status']>('all');
    const isDark = document.documentElement.classList.contains('dark');

    // Utility Functions
    const getTaskMetrics = (): DashboardMetrics['tasks'] => {
        const now = new Date();
        const upcoming = new Date();
        upcoming.setDate(now.getDate() + 7);

        return {
            total: mockTasks.length,
            pending: mockTasks.filter(t => t.status !== 'Completed').length,
            completed: mockTasks.filter(t => t.status === 'Completed').length,
            overdue: mockTasks.filter(t => new Date(t.deadline) < now && t.status !== 'Completed').length,
            upcoming: mockTasks.filter(t => {
                const deadline = new Date(t.deadline);
                return deadline > now && deadline <= upcoming && t.status !== 'Completed';
            }).length,
            inProgress: mockTasks.filter(t => t.status === 'In Progress').length,
            notStarted: mockTasks.filter(t => t.status === 'Not Started').length,
            onHold: mockTasks.filter(t => t.status === 'On Hold').length
        };
    };

    const getPerformanceMetrics = (): DashboardMetrics['performance'] => {
        const completedTasks = mockTasks.filter(t => t.status === 'Completed');
        const avgTime = completedTasks.reduce((acc, task) => {
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
            productivityTrend: [65, 70, 75, 80, 85, 82, 85] // Mock trend data
        };
    };

    const getDistributionMetrics = (): DashboardMetrics['distribution'] => {
        const byTeam: Record<string, number> = {};
        const byDepartment: Record<string, number> = {};
        const byPriority: Record<string, number> = {};

        mockTasks.forEach(task => {
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
                actionable: true
            },
            {
                type: 'priority',
                title: 'High Priority Task Assigned',
                message: 'New UI Design Review assigned to your team',
                time: '4 hours ago',
                actionable: true
            },
            {
                type: 'update',
                title: 'Task Status Updated',
                message: 'Backend Integration moved to In Progress',
                time: '6 hours ago',
                actionable: false
            }
        ];
    };

    const getRecentUpdates = () => {
        return [
            {
                user: 'John Doe',
                action: 'completed the API Documentation task',
                time: '30 minutes ago'
            },
            {
                user: 'Jane Smith',
                action: 'started working on UI Components',
                time: '1 hour ago'
            },
            {
                user: 'Mike Johnson',
                action: 'added comments to Code Review',
                time: '2 hours ago'
            }
        ];
    };

    // Chart Options
    const chartOptions = useMemo(() => ({
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
        colors: ['#4f46e5', '#06b6d4', '#10b981'],  // Indigo, Cyan, Emerald
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
                stops: [45, 100]
            },
        },
    }), [isDark]);

    const donutOptions = useMemo(() => ({
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
                            formatter: () => `${getPerformanceMetrics().completionRate}%`
                        }
                    }
                }
            }
        },
        legend: { show: false },
        dataLabels: { enabled: false },
    }), [isDark]);

    const distributionOptions = useMemo(() => ({
        ...chartOptions,
        chart: {
            type: 'bar',
            height: 250,
            stacked: true,
            stackType: '100%'
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
    }), [isDark]);

    const taskCompletionSeries = useMemo(() => [{
        name: 'Completion Rate',
        data: getPerformanceMetrics().productivityTrend
    }], []);

    const donutSeries = useMemo(() => {
        const metrics = getTaskMetrics();
        return [metrics.completed, metrics.inProgress, metrics.notStarted];
    }, []);

    const distributionSeries = useMemo(() => [
        {
            name: 'High',
            data: [getTaskMetrics().pending, getTaskMetrics().completed, getTaskMetrics().overdue]
        },
        {
            name: 'Medium',
            data: [getTaskMetrics().upcoming, getTaskMetrics().inProgress, getTaskMetrics().notStarted]
        },
        {
            name: 'Low',
            data: [getTaskMetrics().onHold, getTaskMetrics().total - getTaskMetrics().onHold, 0]
        }
    ], []);

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
    };

    const handlePriorityFilter = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setFilterPriority(e.target.value);
    };

    const handleStatusFilter = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setFilterStatus(e.target.value);
    };

    const handlePeriodChange = (period: 'daily' | 'weekly' | 'monthly') => {
        setSelectedPeriod(period);
    };

    const renderStatusBadge = (status: Task['status']) => {
        const statusClasses = {
            'Not Started': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-500',
            'In Progress': 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-500',
            'On Hold': 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-500',
            'Completed': 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-500'
        };

        return (
            <span className={`px-2.5 py-0.5 text-xs font-medium rounded-full ${statusClasses[status]}`}>
                {status}
            </span>
        );
    };

    // Filter and Search Tasks
    const filteredTasks = useMemo(() => {
        return mockTasks.filter(task => {
            const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                task.description.toLowerCase().includes(searchQuery.toLowerCase());
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
                type: "spring",
                stiffness: 100,
                damping: 15
            }
        }
    };

    // Notification badge animation
    const pulseAnimation = {
        scale: [1, 1.1, 1],
        transition: {
            duration: 1,
            repeat: Infinity,
            ease: "easeInOut"
        }
    };

    const handleDragEnd = (result: DropResult) => {
        if (!result.destination) return;
        // Handle drag and drop logic here
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-200">
            <div className="p-6 space-y-6">
                {/* Header with Period Selection */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Tasks Dashboard</h1>
                        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                            Track and manage your team's tasks and performance
                        </p>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="flex rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700">
                            {(['daily', 'weekly', 'monthly'] as const).map((period) => (
                                <button
                                    key={period}
                                    onClick={() => setSelectedPeriod(period)}
                                    className={`px-4 py-2 text-sm font-medium ${
                                        selectedPeriod === period
                                            ? 'bg-primary-500 text-white'
                                            : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700'
                                    } transition-colors duration-200`}
                                >
                                    {period.charAt(0).toUpperCase() + period.slice(1)}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Overview Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {/* Pending Tasks */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className="bg-white dark:bg-slate-800 rounded-xl shadow-lg overflow-hidden"
                    >
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
                                    <IconPencilPaper className="w-6 h-6 text-amber-600 dark:text-amber-500" />
                                </div>
                                <span className="text-sm font-medium text-amber-600 dark:text-amber-500">
                                    Pending
                                </span>
                            </div>
                            <div className="flex items-baseline gap-2">
                                <p className="text-3xl font-bold text-slate-900 dark:text-white">
                                    <CountUp end={getTaskMetrics().pending} duration={2} />
                                </p>
                                <span className="text-sm text-slate-600 dark:text-slate-400">tasks</span>
                            </div>
                            <div className="mt-4">
                                <div className="h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-amber-500 rounded-full transition-all duration-500"
                                        style={{
                                            width: `${(getTaskMetrics().pending / getTaskMetrics().total) * 100}%`
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Completed Tasks */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: 0.1 }}
                        className="bg-white dark:bg-slate-800 rounded-xl shadow-lg overflow-hidden"
                    >
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                                    <IconCircleCheck className="w-6 h-6 text-green-600 dark:text-green-500" />
                                </div>
                                <span className="text-sm font-medium text-green-600 dark:text-green-500">
                                    Completed
                                </span>
                            </div>
                            <div className="flex items-baseline gap-2">
                                <p className="text-3xl font-bold text-slate-900 dark:text-white">
                                    <CountUp end={getTaskMetrics().completed} duration={2} />
                                </p>
                                <span className="text-sm text-slate-600 dark:text-slate-400">tasks</span>
                            </div>
                            <div className="mt-4">
                                <div className="h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-green-500 rounded-full transition-all duration-500"
                                        style={{
                                            width: `${(getTaskMetrics().completed / getTaskMetrics().total) * 100}%`
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Overdue Tasks */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: 0.2 }}
                        className="bg-white dark:bg-slate-800 rounded-xl shadow-lg overflow-hidden"
                    >
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
                                    <IconClock className="w-6 h-6 text-red-600 dark:text-red-500" />
                                </div>
                                <span className="text-sm font-medium text-red-600 dark:text-red-500">
                                    Overdue
                                </span>
                            </div>
                            <div className="flex items-baseline gap-2">
                                <p className="text-3xl font-bold text-slate-900 dark:text-white">
                                    <CountUp end={getTaskMetrics().overdue} duration={2} />
                                </p>
                                <span className="text-sm text-slate-600 dark:text-slate-400">tasks</span>
                            </div>
                            <div className="mt-4">
                                <div className="h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-red-500 rounded-full transition-all duration-500"
                                        style={{
                                            width: `${(getTaskMetrics().overdue / getTaskMetrics().total) * 100}%`
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Upcoming Tasks */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: 0.3 }}
                        className="bg-white dark:bg-slate-800 rounded-xl shadow-lg overflow-hidden"
                    >
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                                    <IconCalendar className="w-6 h-6 text-blue-600 dark:text-blue-500" />
                                </div>
                                <span className="text-sm font-medium text-blue-600 dark:text-blue-500">
                                    Upcoming
                                </span>
                            </div>
                            <div className="flex items-baseline gap-2">
                                <p className="text-3xl font-bold text-slate-900 dark:text-white">
                                    <CountUp end={getTaskMetrics().upcoming} duration={2} />
                                </p>
                                <span className="text-sm text-slate-600 dark:text-slate-400">tasks</span>
                            </div>
                            <div className="mt-4">
                                <div className="h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-blue-500 rounded-full transition-all duration-500"
                                        style={{
                                            width: `${(getTaskMetrics().upcoming / getTaskMetrics().total) * 100}%`
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Performance Metrics Section */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                    {/* Average Completion Time */}
                    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg overflow-hidden">
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                <p className="text-small font-semibold text-slate-900 dark:text-white">
                                    Average Completion Time
                                </p>
                                <div className="p-2 bg-primary-100 dark:bg-primary-900/30 rounded-lg">
                                    <IconClock className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                                </div>
                            </div>
                            <div className="flex items-baseline gap-2 mb-2">
                                <span className="text-4xl font-bold text-slate-900 dark:text-white">
                                    <CountUp 
                                        end={getPerformanceMetrics().averageCompletionTime} 
                                        duration={2}
                                        decimals={1}
                                    />
                                </span>
                                <span className="text-small text-slate-600 dark:text-slate-400">days</span>
                            </div>
                            <p className="text-sm text-slate-600 dark:text-slate-400">
                                Average time to complete tasks
                            </p>
                        </div>
                    </div>

                    {/* Task Completion Rate */}
                    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg overflow-hidden">
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                <p className="text-small font-semibold text-slate-900 dark:text-white">
                                    Task Completion Rate
                                </p>
                                <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                                    <IconCircleCheck className="w-5 h-5 text-green-600 dark:text-green-400" />
                                </div>
                            </div>
                            <div className="flex items-baseline gap-2 mb-2">
                                <span className="text-4xl font-bold text-slate-900 dark:text-white">
                                    <CountUp 
                                        end={getPerformanceMetrics().completionRate} 
                                        duration={2}
                                    />
                                </span>
                                <span className="text-small text-slate-600 dark:text-slate-400">%</span>
                            </div>
                            <p className="text-sm text-slate-600 dark:text-slate-400">
                                Tasks completed vs total tasks
                            </p>
                        </div>
                    </div>

                    {/* Productivity Trend */}
                    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg overflow-hidden">
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                <p className="text-small font-semibold text-slate-900 dark:text-white">
                                    Productivity Trend
                                </p>
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
                                                enabled: true
                                            }
                                        },
                                        stroke: {
                                            curve: 'smooth',
                                            width: 2
                                        },
                                        colors: ['#3b82f6'],
                                        tooltip: {
                                            fixed: {
                                                enabled: false
                                            },
                                            x: {
                                                show: false
                                            },
                                            y: {
                                                title: {
                                                    formatter: () => 'Productivity'
                                                }
                                            },
                                            marker: {
                                                show: false
                                            }
                                        }
                                    }}
                                    series={[{
                                        name: 'Productivity',
                                        data: getPerformanceMetrics().productivityTrend
                                    }]}
                                    type="line"
                                    height="100%"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Charts Grid */}
                <div className="grid grid-cols-12 gap-6 mb-6">
                    {/* Left Column - 70% */}
                    <div className="col-span-12 lg:col-span-8 grid grid-cols-1 gap-6">
                        {/* Productivity Trend */}
                        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg overflow-hidden">
                            <div className="p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <p className="text-small font-semibold text-slate-900 dark:text-white">
                                        Productivity Trend
                                    </p>
                                    <div className="p-2 bg-cyan-100 dark:bg-cyan-900/30 rounded-lg">
                                        <IconTrendingUp className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
                                    </div>
                                </div>
                                <div className="h-[300px]">
                                    <ReactApexChart
                                        options={{
                                            ...chartOptions,
                                            chart: {
                                                ...chartOptions.chart,
                                                type: 'area'
                                            },
                                            stroke: {
                                                curve: 'smooth',
                                                width: 3
                                            },
                                            markers: {
                                                size: 4,
                                                strokeWidth: 2,
                                                hover: { size: 6 }
                                            }
                                        }}
                                        series={taskCompletionSeries}
                                        type="area"
                                        height="100%"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Task Distribution */}
                        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg overflow-hidden">
                            <div className="p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <p className="text-small font-semibold text-slate-900 dark:text-white">
                                        Task Distribution
                                    </p>
                                    <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
                                        <IconUsers className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                                    </div>
                                </div>
                                <div className="h-[250px]">
                                    <ReactApexChart
                                        options={distributionOptions}
                                        series={distributionSeries}
                                        type="bar"
                                        height="100%"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - 30% */}
                    <div className="col-span-12 lg:col-span-4 space-y-6">
                        {/* Task Completion Rate */}
                        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg overflow-hidden">
                            <div className="p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <p className="text-small font-semibold text-slate-900 dark:text-white">
                                        Task Completion
                                    </p>
                                    <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                                        <IconCircleCheck className="w-5 h-5 text-green-600 dark:text-green-400" />
                                    </div>
                                </div>
                                <div className="h-[250px]">
                                    <ReactApexChart
                                        options={donutOptions}
                                        series={donutSeries}
                                        type="donut"
                                        height="100%"
                                    />
                                </div>
                                <div className="grid grid-cols-1 gap-3 mt-4">
                                    <div className="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                                        <div className="flex items-center gap-2">
                                            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                                            <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Completed</span>
                                        </div>
                                        <span className="text-sm font-semibold text-green-600 dark:text-green-400">
                                            {getTaskMetrics().completed}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                                        <div className="flex items-center gap-2">
                                            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                                            <span className="text-sm font-medium text-slate-600 dark:text-slate-400">In Progress</span>
                                        </div>
                                        <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                                            {getTaskMetrics().inProgress}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                                        <div className="flex items-center gap-2">
                                            <div className="w-3 h-3 bg-slate-500 rounded-full"></div>
                                            <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Not Started</span>
                                        </div>
                                        <span className="text-sm font-semibold text-slate-600 dark:text-slate-400">
                                            {getTaskMetrics().notStarted}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Quick Stats */}
                        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg overflow-hidden">
                            <div className="p-6">
                                <p className="text-small font-semibold text-slate-900 dark:text-white mb-4">
                                    Quick Stats
                                </p>
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-slate-600 dark:text-slate-400">Total Tasks</span>
                                        <span className="text-small font-semibold text-slate-900 dark:text-white">
                                            {getTaskMetrics().total}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-slate-600 dark:text-slate-400">Overdue</span>
                                        <span className="text-small font-semibold text-red-600 dark:text-red-400">
                                            {getTaskMetrics().overdue}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-slate-600 dark:text-slate-400">Upcoming</span>
                                        <span className="text-small font-semibold text-blue-600 dark:text-blue-400">
                                            {getTaskMetrics().upcoming}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Notifications & Alerts Section */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                    <div className="lg:col-span-2">
                        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg overflow-hidden">
                            <div className="p-6">
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-small font-semibold text-slate-900 dark:text-white">Task Alerts</h2>
                                    <button className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300">
                                        View All
                                    </button>
                                </div>
                                <div className="space-y-4">
                                    {getTaskAlerts().map((alert, index) => (
                                        <div 
                                            key={index}
                                            className={`flex items-start gap-4 p-4 rounded-lg ${
                                                alert.type === 'deadline' ? 'bg-red-50 dark:bg-red-900/20' :
                                                alert.type === 'priority' ? 'bg-amber-50 dark:bg-amber-900/20' :
                                                'bg-blue-50 dark:bg-blue-900/20'
                                            }`}
                                        >
                                            <div className={`p-2 rounded-full ${
                                                alert.type === 'deadline' ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400' :
                                                alert.type === 'priority' ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400' :
                                                'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                                            }`}>
                                                {alert.type === 'deadline' ? <IconInfoTriangle className="w-5 h-5" /> :
                                                alert.type === 'priority' ? <IconPencilPaper className="w-5 h-5" /> :
                                                <IconBell className="w-5 h-5" />}
                                            </div>
                                            <div className="flex-1">
                                                <p className={`text-sm font-medium ${
                                                    alert.type === 'deadline' ? 'text-red-900 dark:text-red-300' :
                                                    alert.type === 'priority' ? 'text-amber-900 dark:text-amber-300' :
                                                    'text-blue-900 dark:text-blue-300'
                                                }`}>
                                                    {alert.title}
                                                </p>
                                                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                                                    {alert.message}
                                                </p>
                                                <div className="flex items-center gap-4 mt-2">
                                                    <span className="text-xs text-slate-500 dark:text-slate-400">
                                                        {alert.time}
                                                    </span>
                                                    {alert.actionable && (
                                                        <button className={`text-xs font-medium ${
                                                            alert.type === 'deadline' ? 'text-red-600 dark:text-red-400' :
                                                            alert.type === 'priority' ? 'text-amber-600 dark:text-amber-400' :
                                                            'text-blue-600 dark:text-blue-400'
                                                        }`}>
                                                            Take Action
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-1">
                        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg overflow-hidden">
                            <div className="p-6">
                                <h2 className="text-small font-semibold text-slate-900 dark:text-white mb-6">Recent Updates</h2>
                                <div className="space-y-4">
                                    {getRecentUpdates().map((update, index) => (
                                        <div key={index} className="flex items-start gap-4">
                                            <Avatar name={update.user} className="w-8 h-8" />
                                            <div className="flex-1">
                                                <p className="text-sm text-slate-900 dark:text-white">
                                                    <span className="font-medium">{update.user}</span>
                                                    {' '}{update.action}
                                                </p>
                                                <span className="text-xs text-slate-500 dark:text-slate-400">
                                                    {update.time}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Task List */}
                <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg transition-all duration-200">
                    <div className="p-6 border-b border-slate-200 dark:border-slate-700">
                        <div className="flex items-center justify-between">
                            <h2 className="text-small font-semibold text-slate-900 dark:text-white">Current Tasks</h2>
                            <button className="text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors duration-200">
                                View All
                            </button>
                        </div>
                    </div>
                    
                    <div className="p-6">
                        <DragDropContext onDragEnd={handleDragEnd}>
                            <Droppable droppableId="taskList">
                                {(provided) => (
                                    <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-4">
                                        {mockTasks.map((task, index) => (
                                            <Draggable key={task.id} draggableId={task.id} index={index}>
                                                {(provided) => (
                                                    <motion.div
                                                        ref={provided.innerRef}
                                                        {...provided.draggableProps}
                                                        {...provided.dragHandleProps}
                                                        whileHover={{ scale: 1.01 }}
                                                        className="group bg-slate-50 dark:bg-slate-700/50 rounded-lg p-4 border border-slate-200 dark:border-slate-600 hover:shadow-lg transition-all duration-200"
                                                    >
                                                        <div className="flex items-center justify-between">
                                                            <div>
                                                                <p className="text-base font-medium text-slate-900 dark:text-white">
                                                                    {task.title}
                                                                </p>
                                                                <div className="mt-1 flex items-center gap-4 text-sm text-slate-600 dark:text-slate-300">
                                                                    <span className="flex items-center">
                                                                        <IconCalendar className="w-4 h-4 mr-1" />
                                                                        {task.deadline}
                                                                    </span>
                                                                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium transition-colors duration-200 ${
                                                                        task.priority === 'High' ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400' :
                                                                        task.priority === 'Medium' ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400' :
                                                                        'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                                                                    }`}>
                                                                        {task.priority}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                            <div className="flex items-center gap-3">
                                                                <div className="w-32">
                                                                    <div className="h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden transition-colors duration-200">
                                                                        <div
                                                                            className={`h-1.5 rounded-full transition-all duration-500 ${
                                                                                task.progress >= 80 ? 'bg-green-500 dark:bg-green-400' :
                                                                                task.progress >= 40 ? 'bg-primary-500 dark:bg-primary-400' :
                                                                                'bg-yellow-500 dark:bg-yellow-400'
                                                                            }`}
                                                                            style={{ width: `${task.progress}%` }}
                                                                        ></div>
                                                                    </div>
                                                                    <span className="mt-1 text-xs text-slate-600 dark:text-slate-300">
                                                                        {task.progress}% Complete
                                                                    </span>
                                                                </div>
                                                                <button className="p-1 text-slate-400 dark:text-slate-500 hover:text-slate-500 dark:hover:text-slate-400 transition-colors duration-200">
                                                                    <IconHorizontalDots className="w-5 h-5" />
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </motion.div>
                                                )}
                                            </Draggable>
                                        ))}
                                        {provided.placeholder}
                                    </div>
                                )}
                            </Droppable>
                        </DragDropContext>
                    </div>
                </div>

                {/* Task List and Delegation Section */}
                <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg overflow-hidden">
                    <div className="p-6">
                        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                            <h2 className="text-small font-semibold text-slate-900 dark:text-white">Task List</h2>
                            <div className="flex items-center gap-4">
                                {/* Search */}
                                <div className="relative">
                                    <input
                                        type="text"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        placeholder="Search tasks..."
                                        className="w-64 px-4 py-2 pl-10 text-sm text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400"
                                    />
                                    <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500" />
                                </div>

                                {/* Filters */}
                                <select
                                    value={filterPriority}
                                    onChange={(e) => setFilterPriority(e.target.value as typeof filterPriority)}
                                    className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white px-3 py-2"
                                >
                                    <option value="">Select Priority</option>
                                    <option value="High">High Priority</option>
                                    <option value="Medium">Medium Priority</option>
                                    <option value="Low">Low Priority</option>
                                </select>

                                <select
                                    value={filterStatus}
                                    onChange={(e) => setFilterStatus(e.target.value as typeof filterStatus)}
                                    className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white px-3 py-2"
                                >
                                    <option value="">Select Status</option>
                                    <option value="Not Started">Not Started</option>
                                    <option value="In Progress">In Progress</option>
                                    <option value="On Hold">On Hold</option>
                                    <option value="Completed">Completed</option>
                                </select>
  {/* Delegation Button */}
  <button
                                    onClick={() => setShowDelegationModal(true)}
                                    className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-primary-600 dark:bg-primary-500 rounded-lg hover:bg-primary-700 dark:hover:bg-primary-600"
                                >
                                    <IconUsers className="w-4 h-4 mr-2" />
                                    Delegate Tasks
                                </button>
                            </div>
                        </div>

                        {/* Task List */}
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-slate-200 dark:border-slate-700">
                                        <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Task</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Assigned To</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Status</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Priority</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Deadline</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Progress</th>
                                        <th className="px-4 py-3 text-right text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                                    {filteredTasks.map((task) => (
                                        <tr key={task.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50">
                                            <td className="px-4 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedTasks.includes(task.id)}
                                                        onChange={(e) => {
                                                            if (e.target.checked) {
                                                                setSelectedTasks([...selectedTasks, task.id]);
                                                            } else {
                                                                setSelectedTasks(selectedTasks.filter(id => id !== task.id));
                                                            }
                                                        }}
                                                        className="h-4 w-4 text-primary-600 border-slate-300 rounded"
                                                    />
                                                    <div className="ml-4">
                                                        <div className="text-sm font-medium text-slate-900 dark:text-white">{task.title}</div>
                                                        <div className="text-sm text-slate-500 dark:text-slate-400">{task.description}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-4 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <Avatar name={task.assignedTo.name} />
                                                    <div className="ml-3">
                                                        <div className="text-sm font-medium text-slate-900 dark:text-white">{task.assignedTo.name}</div>
                                                        <div className="text-sm text-slate-500 dark:text-slate-400">{task.assignedTo.team}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-4 py-4 whitespace-nowrap">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                    task.status === 'Completed' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
                                                    task.status === 'In Progress' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' :
                                                    task.status === 'On Hold' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' :
                                                    'bg-slate-100 text-slate-800 dark:bg-slate-900/30 dark:text-slate-400'
                                                }`}>
                                                    {task.status}
                                                </span>
                                            </td>
                                            <td className="px-4 py-4 whitespace-nowrap">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                    task.priority === 'High' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' :
                                                    task.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' :
                                                    'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                                                }`}>
                                                    {task.priority}
                                                </span>
                                            </td>
                                            <td className="px-4 py-4 whitespace-nowrap">
                                                <div className="text-sm text-slate-900 dark:text-white">
                                                    {new Date(task.deadline).toLocaleDateString()}
                                                </div>
                                                <div className="text-sm text-slate-500 dark:text-slate-400">
                                                    {new Date(task.deadline).toLocaleTimeString()}
                                                </div>
                                            </td>
                                            <td className="px-4 py-4 whitespace-nowrap">
                                                <div className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full">
                                                    <div
                                                        className="h-full rounded-full bg-primary-500"
                                                        style={{ width: `${task.progress}%` }}
                                                    />
                                                </div>
                                                <div className="text-xs text-slate-500 dark:text-slate-400 mt-1 text-right">
                                                    {task.progress}%
                                                </div>
                                            </td>
                                            <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <button className="text-primary-600 hover:text-primary-900 dark:text-primary-400 dark:hover:text-primary-300">
                                                    Edit
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Delegation Modal */}
                {showDelegationModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white dark:bg-slate-800 rounded-lg p-6 max-w-2xl w-full mx-4">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Task Delegation</h2>
                                <button
                                    onClick={() => setShowDelegationModal(false)}
                                    className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300"
                                >
                                    <IconClose className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="space-y-6">
                                {/* Selected Tasks */}
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                        Selected Tasks ({selectedTasks.length})
                                    </label>
                                    <div className="max-h-48 overflow-y-auto space-y-2 bg-slate-50 dark:bg-slate-700/50 rounded-lg p-4">
                                        {selectedTasks.map(taskId => {
                                            const task = mockTasks.find(t => t.id === taskId);
                                            return task ? (
                                                <div key={task.id} className="flex items-center justify-between">
                                                    <span className="text-sm text-slate-900 dark:text-white">{task.title}</span>
                                                    <button
                                                        onClick={() => setSelectedTasks(selectedTasks.filter(id => id !== task.id))}
                                                        className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                                                    >
                                                        <IconClose className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            ) : null;
                                        })}
                                    </div>
                                </div>

                                {/* Assignee Selection */}
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                        Assign To
                                    </label>
                                    <select className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white px-3 py-2">
                                        <option value="">Select Team Member</option>
                                        {mockTeamMembers.map(member => (
                                            <option key={member.id} value={member.id}>
                                                {member.name} - {member.team}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex justify-end gap-3">
                                    <button
                                        onClick={() => setShowDelegationModal(false)}
                                        className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-600"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={() => {
                                            // Handle delegation
                                            setShowDelegationModal(false);
                                            setSelectedTasks([]);
                                        }}
                                        className="px-4 py-2 text-sm font-medium text-white bg-primary-600 dark:bg-primary-500 rounded-lg hover:bg-primary-700 dark:hover:bg-primary-600"
                                    >
                                        Assign Tasks
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Dashboard;
                              