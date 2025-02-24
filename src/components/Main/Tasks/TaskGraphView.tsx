import React, { useMemo } from 'react';
import { Bar, Line, Pie } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend
);

interface TaskGraphViewProps {
    tasks: any[];
    viewType: 'status' | 'priority' | 'category' | 'timeline';
    timeRange?: 'day' | 'week' | 'month' | 'year';
}

const TaskGraphView: React.FC<TaskGraphViewProps> = ({ tasks, viewType, timeRange = 'month' }) => {
    // Memoized data processing
    const processedData = useMemo(() => {
        if (viewType === 'timeline') {
            // Process timeline data
            const timelineData = new Map();
            const today = new Date();
            const daysToShow = timeRange === 'day' ? 1 : timeRange === 'week' ? 7 : 30;

            // Initialize timeline with empty values
            for (let i = 0; i < daysToShow; i++) {
                const date = new Date(today);
                date.setDate(date.getDate() - i);
                timelineData.set(date.toISOString().split('T')[0], 0);
            }

            // Count tasks per day
            tasks.forEach(task => {
                const date = new Date(task.start).toISOString().split('T')[0];
                if (timelineData.has(date)) {
                    timelineData.set(date, timelineData.get(date) + 1);
                }
            });

            return {
                labels: Array.from(timelineData.keys()).reverse(),
                datasets: [{
                    label: 'Tasks',
                    data: Array.from(timelineData.values()).reverse(),
                    borderColor: 'rgb(75, 192, 192)',
                    tension: 0.1
                }]
            };
        } else {
            // Process categorical data
            const groupedData = tasks.reduce((acc: any, task: any) => {
                const key = task[viewType];
                if (!acc[key]) acc[key] = 0;
                acc[key]++;
                return acc;
            }, {});

            return {
                labels: Object.keys(groupedData),
                datasets: [{
                    label: 'Tasks',
                    data: Object.values(groupedData),
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.5)',
                        'rgba(54, 162, 235, 0.5)',
                        'rgba(255, 206, 86, 0.5)',
                        'rgba(75, 192, 192, 0.5)',
                        'rgba(153, 102, 255, 0.5)',
                    ],
                    borderColor: [
                        'rgba(255, 99, 132, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)',
                        'rgba(153, 102, 255, 1)',
                    ],
                    borderWidth: 1
                }]
            };
        }
    }, [tasks, viewType, timeRange]);

    const options = useMemo(() => ({
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top' as const,
            },
            title: {
                display: true,
                text: `Task Distribution by ${viewType.charAt(0).toUpperCase() + viewType.slice(1)}`,
            },
        },
        scales: viewType === 'timeline' ? {
            y: {
                beginAtZero: true,
                ticks: {
                    stepSize: 1
                }
            }
        } : undefined
    }), [viewType]);

    return (
        <div className="h-[400px] w-full">
            {viewType === 'timeline' ? (
                <Line data={processedData} options={options} />
            ) : viewType === 'status' ? (
                <Pie data={processedData} options={options} />
            ) : (
                <Bar data={processedData} options={options} />
            )}
        </div>
    );
};

export default TaskGraphView;
