import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import CountUp from 'react-countup';
import ReactApexChart from 'react-apexcharts';
import { Users, CheckCircle, Clock, Layers, TrendingUp } from 'lucide-react';
import OwnerServices from '../../../services/OwnerServices';
import { CheckOwner } from '../../../utils/Common';
import EmployeeDashboard from './EmployeeDashboard';

type DepartmentItem = {
    id: number;
    name: string;
    performance: number | null;
    expected_arrival_time: string | null;
};

type TaskUser = { id: number; name: string } | null;

type RecentTask = {
    id: number;
    task_name: string;
    priority: string;
    progress: number;
    status: string;
    employee: TaskUser;
    assigned_by: TaskUser;
    submitted_by: TaskUser | null;
    completion_date: string | null;
    modified_at: string | null;
    on_time: boolean | null;
    completed_task_file: string | null;
};

type OwnerDashboardPayload = {
    company_performance?: number | null;
    emp_count: number;
    present_count: number;
    absent_count?: number | null;
    departments: DepartmentItem[];
    department_count: number;
    recent_completed_tasks: RecentTask[];
};

const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.08, ease: 'easeOut' } },
};
const cardVariants = { hidden: { opacity: 0, y: 8 }, visible: { opacity: 1, y: 0, transition: { duration: 0.35 } } };

const OwnerMainDashboard: React.FC = () => {
    const [data, setData] = useState<OwnerDashboardPayload | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const isOwner = CheckOwner();

    useEffect(() => {
        if (!isOwner) return;
        setLoading(true);
        OwnerServices.getOwnerDashboard()
            .then((r: OwnerDashboardPayload) => {
                setData(r);
                setError(null);
            })
            .catch((e) => {
                console.error('owner dashboard error', e);
                setError('Failed to load dashboard');
            })
            .finally(() => setLoading(false));
    }, [isOwner]);

    if (!isOwner) {
        return <EmployeeDashboard />;
    }

    // prepare chart data for departments
    const deptNames = (data?.departments || []).map((d) => d.name);
    const deptPerf = (data?.departments || []).map((d) => (d.performance == null ? 0 : Number(d.performance)));

    return (
        <motion.div className="max-w-6xl mx-auto p-6" initial="hidden" animate="visible" variants={containerVariants}>
            <header className="flex items-center justify-between mb-6 z-10">
                <div>
                    <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">Owner Dashboard</h1>
                    <p className="text-sm text-slate-500 mt-1">Overview — employees, attendance, departments & recent tasks</p>
                </div>
                <div className="text-right">
                    <div className="text-sm text-slate-500">Company Performance</div>
                    <div className="text-xl font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-emerald-500" />
                        <span>{data?.company_performance ?? '—'}</span>
                    </div>
                </div>
            </header>

            {loading ? (
                <div className="p-8 bg-white rounded-lg shadow text-center">Loading dashboard…</div>
            ) : error ? (
                <div className="p-4 bg-red-50 text-red-700 rounded">{error}</div>
            ) : (
                <>
                    {/* top KPI cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                        <motion.div variants={cardVariants} className="bg-white dark:bg-slate-800 rounded-xl shadow p-5 flex items-center gap-4">
                            <div className="p-3 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg">
                                <Users className="w-6 h-6 text-indigo-600" />
                            </div>
                            <div>
                                <div className="text-sm text-slate-500">Employees</div>
                                <div className="text-2xl font-bold text-slate-900 dark:text-white">
                                    <CountUp end={data!.emp_count} duration={1.5} />
                                </div>
                                <div className="text-xs text-slate-400 mt-1">Total employees in company</div>
                            </div>
                        </motion.div>

                        <motion.div variants={cardVariants} className="bg-white dark:bg-slate-800 rounded-xl shadow p-5 flex items-center gap-4">
                            <div className="p-3 bg-green-50 dark:bg-green-900/30 rounded-lg">
                                <CheckCircle className="w-6 h-6 text-green-600" />
                            </div>
                            <div>
                                <div className="text-sm text-slate-500">Present Today</div>
                                <div className="text-2xl font-bold text-slate-900 dark:text-white">
                                    <CountUp end={data!.present_count} duration={1.2} />
                                </div>
                                <div className="text-xs text-slate-400 mt-1">{data!.absent_count != null ? `${data!.absent_count} absent` : 'No absent data'}</div>
                            </div>
                        </motion.div>

                        <motion.div variants={cardVariants} className="bg-white dark:bg-slate-800 rounded-xl shadow p-5 flex items-center gap-4">
                            <div className="p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
                                <Layers className="w-6 h-6 text-amber-600" />
                            </div>
                            <div>
                                <div className="text-sm text-slate-500">Departments</div>
                                <div className="text-2xl font-bold text-slate-900 dark:text-white">
                                    <CountUp end={data!.department_count} duration={1.2} />
                                </div>
                                <div className="text-xs text-slate-400 mt-1">Department performances below</div>
                            </div>
                        </motion.div>
                    </div>

                    <div className="grid grid-cols-1 gap-6 mb-6">
                        {/* Department performance chart */}
                        <motion.div variants={cardVariants} className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-xl shadow p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-semibold text-slate-800 dark:text-white flex items-center gap-2">
                                    <TrendingUp className="w-5 h-5 text-blue-600" />
                                    Department Performance
                                </h3>
                                <div className="text-sm text-slate-500">Latest</div>
                            </div>

                            {deptPerf.length === 0 ? (
                                <div className="py-12 text-center text-slate-400">No department performance data</div>
                            ) : (
                                <ReactApexChart
                                    type="bar"
                                    height={260}
                                    series={[{ name: 'Performance', data: deptPerf }]}
                                    options={{
                                        chart: { toolbar: { show: false }, background: 'transparent' },
                                        plotOptions: { bar: { borderRadius: 6, horizontal: false, columnWidth: '60%' } },
                                        xaxis: { categories: deptNames, labels: { style: { colors: '#6B7280' } } },
                                        yaxis: { labels: { style: { colors: '#6B7280' } }, min: 0 },
                                        dataLabels: { enabled: false },
                                        theme: { mode: document.documentElement.classList.contains('dark') ? 'dark' : 'light' },
                                    }}
                                />
                            )}

                            {/* department list with performance */}
                            <div className="mt-4 grid gap-3">
                                {data!.departments.map((d) => (
                                    <div key={d.id} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-900 rounded">
                                        <div>
                                            <div className="text-sm font-medium text-slate-800 dark:text-white">{d.name}</div>
                                            <div className="text-xs text-slate-400">{d.expected_arrival_time ? `Arrival: ${d.expected_arrival_time}` : 'No schedule'}</div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-lg font-semibold">{d.performance == null ? '—' : `${d.performance}%`}</div>
                                            <div className="text-xs text-slate-400">Performance</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>

                        {/* Recent completed tasks */}
                        <motion.div variants={cardVariants} className="bg-white dark:bg-slate-800 rounded-xl shadow p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-semibold text-slate-800 dark:text-white flex items-center gap-2">
                                    <Clock className="w-5 h-5 text-indigo-600" />
                                    Recent Completed Tasks
                                </h3>
                                <div className="text-sm text-slate-500">Latest</div>
                            </div>

                            {data!.recent_completed_tasks.length === 0 ? (
                                <div className="py-8 text-center text-slate-400">No completed tasks yet</div>
                            ) : (
                                <ul className="space-y-3">
                                    {data!.recent_completed_tasks.map((t) => (
                                        <li key={t.id} className="flex items-start gap-3 p-3 rounded hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors">
                                            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                                                <CheckCircle className="w-5 h-5 text-green-600" />
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <div className="text-sm font-medium text-slate-800 dark:text-white">{t.task_name}</div>
                                                        <div className="text-xs text-slate-400">
                                                            {t.employee ? t.employee.name : '—'} • {t.assigned_by ? `Assigned by ${t.assigned_by.name}` : ''}
                                                        </div>
                                                    </div>

                                                    <div className="text-right">
                                                        <div className="text-sm font-semibold">
                                                            {t.on_time === null ? '—' : t.on_time ? <span className="text-green-600">On time</span> : <span className="text-amber-600">Late</span>}
                                                        </div>
                                                        <div className="text-xs text-slate-400">{t.completion_date ? new Date(t.completion_date).toLocaleString() : ''}</div>
                                                    </div>
                                                </div>

                                                <div className="mt-2 flex items-center gap-2">
                                                    <div className="text-xs px-2 py-1 rounded bg-slate-100 dark:bg-slate-900 text-slate-600">{t.priority}</div>
                                                    <div className="text-xs px-2 py-1 rounded bg-slate-100 dark:bg-slate-900 text-slate-600">Progress: {t.progress}%</div>
                                                </div>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </motion.div>
                    </div>
                </>
            )}
        </motion.div>
    );
};

export default OwnerMainDashboard;
