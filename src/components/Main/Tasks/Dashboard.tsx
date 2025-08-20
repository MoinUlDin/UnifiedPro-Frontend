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

const Dashboard = () => {
    // State Management
    const [selectedPeriod, setSelectedPeriod] = useState<'daily' | 'weekly' | 'monthly' | 'yearly'>('yearly');
    const isDark = document.documentElement.classList.contains('dark');

    const [taskAnalytics, setTaskAnalytics] = useState<TaskAnalyticsType>();

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
