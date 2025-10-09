import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Clock, LogIn, LogOut, CheckCircle, Calendar, Target, Trophy, Users, TrendingUp, Activity, AlertTriangle, Star, ArrowRight, Zap } from 'lucide-react';
import EmployeeServices from '../../../services/EmployeeServices';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

type BackendTask = {
    id: number;
    task_name: string;
    instructions: string | null;
    priority: 'high' | 'medium' | 'low' | string;
    progress: number;
    status: string; // e.g. "In_Progress", "Completed"
    start_date?: string | null;
    due_date?: string | null;
    assigned_by?: { id: number; name: string } | null;
    employee?: number | null;
    // other fields omitted...
};

type BackendDashboard = {
    employeeData?: {
        name?: string;
        role?: string;
        department?: string;
        avatar?: string | null;
        employeeId?: number | string | null;
    };
    attendanceStatus?: {
        isCheckedIn?: boolean;
        clockInTime?: string | null;
        clockOutTime?: string | null;
        workingHours?: number;
        status?: 'present' | 'absent' | 'late' | string;
        lateMinutes?: number | null;
    };
    recentTasks?: BackendTask[];
    performanceMetrics?: {
        tasksCompleted?: number;
        tasksInProgress?: number;
        averageRating?: number | null;
        attendanceRate?: number | null;
        goalsAchieved?: number | null;
        totalGoals?: number | null;
    };
};

interface Task {
    id: string;
    title: string;
    description: string;
    priority: 'high' | 'medium' | 'low';
    status: 'pending' | 'in-progress' | 'completed' | 'overdue' | string;
    progress: number;
    dueDate: string;
    assignedBy: string;
}

interface AttendanceState {
    isCheckedIn: boolean;
    clockInTime: string | null; // hh:mm
    clockOutTime: string | null; // hh:mm
    workingHours: number;
    status: 'present' | 'absent' | 'late' | string;
    lateMinutes?: number | null;
}

export const EmployeeDashboard: React.FC = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    // dashboardData is populated by your existing FetchEmployeesDashboard call
    const dashboardData: BackendDashboard | null = useSelector((s: any) => s.employee?.employeeDashBoard ?? null);
    const [currentTime, setCurrentTime] = useState<Date>(new Date());
    const [employeeData, setEmployeeData] = useState({
        name: '—',
        role: '—',
        department: '—',
        avatar: '',
        employeeId: '',
    });

    const [attendanceStatus, setAttendanceStatus] = useState<AttendanceState>({
        isCheckedIn: false,
        clockInTime: null,
        clockOutTime: null,
        workingHours: 0,
        status: 'absent',
        lateMinutes: null,
    });

    const [recentTasks, setRecentTasks] = useState<Task[]>([]);
    const [performanceMetrics, setPerformanceMetrics] = useState({
        tasksCompleted: 0,
        tasksInProgress: 0,
        averageRating: null as number | null,
        attendanceRate: 0,
        goalsAchieved: 0,
        totalGoals: 0,
    });

    // fetch once (you already had this, keep it)
    const FetchDashboardData = () => {
        EmployeeServices.FetchEmployeesDashboard(dispatch)
            .then((r: any) => {
                console.log('Emp DashboarData: ', r);
            })
            .catch(() => {
                toast.error('Error fetching dashboard');
            });
    };
    useEffect(() => {
        FetchDashboardData();
    }, []);

    // map backend dashboardData into local state whenever it changes
    useEffect(() => {
        if (!dashboardData) return;

        // employee data
        const e = dashboardData.employeeData ?? {};
        setEmployeeData({
            name: e.name ?? '—',
            role: e.role ?? '—',
            department: e.department ?? '—',
            avatar: e.avatar ?? '',
            employeeId: String(e.employeeId) ?? '',
        });

        // attendance
        const a = dashboardData.attendanceStatus ?? {};
        // Convert ISO datetime to hh:mm local string if present
        const parseTime = (iso?: string | null) => {
            if (!iso) return null;
            const d = new Date(iso);
            if (Number.isNaN(d.getTime())) return null;
            // locale time hh:mm
            return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        };

        setAttendanceStatus({
            isCheckedIn: Boolean(a.isCheckedIn),
            clockInTime: parseTime(a.clockInTime ?? null),
            clockOutTime: parseTime(a.clockOutTime ?? null),
            workingHours: typeof a.workingHours === 'number' ? a.workingHours : 0,
            status: a.status ?? 'absent',
            lateMinutes: a.lateMinutes ?? null,
        });

        // tasks: map backend shape to UI shape
        const backendTasks = dashboardData.recentTasks ?? [];
        const mapped: Task[] = backendTasks.map((t) => {
            // Normalize status from backend (e.g. "In_Progress" or "In Progress") to UI values
            const s = String(t.status ?? '')
                .toLowerCase()
                .replace(/\s+/g, '-')
                .replace(/_+/g, '-');
            let uiStatus: Task['status'] = 'pending';
            if (s.includes('in-progress') || s.includes('in-progress') || s.includes('in-progress')) uiStatus = 'in-progress';
            if (s.includes('completed')) uiStatus = 'completed';
            if (s.includes('pending')) uiStatus = 'pending';
            // if overdue; we don't have direct info - keep backend status
            if (s.includes('overdue')) uiStatus = 'overdue';

            const dueDateIso = t.due_date ?? t.start_date ?? null;
            const dueDate = dueDateIso ? new Date(dueDateIso).toISOString() : '';

            return {
                id: String(t.id),
                title: t.task_name ?? 'Untitled Task',
                description: t.instructions ?? '',
                priority: (t.priority as any) ?? 'medium',
                status: uiStatus,
                progress: typeof t.progress === 'number' ? t.progress : 0,
                dueDate: dueDate,
                assignedBy: (t.assigned_by && t.assigned_by.name) || '—',
            };
        });
        setRecentTasks(mapped);

        // performance metrics
        const pm = dashboardData.performanceMetrics ?? {};
        setPerformanceMetrics({
            tasksCompleted: pm.tasksCompleted ?? 0,
            tasksInProgress: pm.tasksInProgress ?? 0,
            averageRating: pm.averageRating ?? null,
            attendanceRate: pm.attendanceRate ?? 0,
            goalsAchieved: pm.goalsAchieved ?? 0,
            totalGoals: pm.totalGoals ?? 0,
        });
    }, [dashboardData]);

    // live clock and update working hours if checked in (use backend clockInTime if provided)
    useEffect(() => {
        const tick = () => setCurrentTime(new Date());
        const t = setInterval(tick, 1000);

        // If backend provided clockInTime (ISO), compute elapsed and update workingHours
        if (attendanceStatus.isCheckedIn && dashboardData?.attendanceStatus?.clockInTime) {
            const clockInIso = dashboardData.attendanceStatus.clockInTime!;
            const clockInDate = new Date(clockInIso);
            if (!Number.isNaN(clockInDate.getTime())) {
                const diffMs = Date.now() - clockInDate.getTime();
                const hours = diffMs / (1000 * 60 * 60);
                setAttendanceStatus((prev) => ({ ...prev, workingHours: parseFloat(hours.toFixed(2)) }));
            }
        }

        return () => clearInterval(t);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [attendanceStatus.isCheckedIn, dashboardData?.attendanceStatus?.clockInTime]);

    // local handlers for demo clock in/out (you can wire these to real endpoints later)
    const handleClockIn = () => {
        EmployeeServices.MarkClockIn()
            .then(() => {
                toast.success('Clocked in');
                FetchDashboardData();

                // Update locally for instant review
                const now = new Date();
                const timeString = now.toTimeString().slice(0, 5);
                const standardTime = new Date();
                standardTime.setHours(9, 0, 0, 0);
                const isLate = now > standardTime;
                const lateMinutes = isLate ? Math.floor((now.getTime() - standardTime.getTime()) / (1000 * 60)) : 0;
                setAttendanceStatus({
                    isCheckedIn: true,
                    clockInTime: timeString,
                    clockOutTime: null,
                    workingHours: 0,
                    status: isLate ? 'late' : 'present',
                    lateMinutes,
                });
            })
            .catch((e) => {
                toast.error('Error occured while marking you clocked in');
            });
    };

    const handleClockOut = () => {
        EmployeeServices.MarkClockOut()
            .then(() => {
                toast.success('Clocked Out');
                FetchDashboardData();
                const now = new Date();
                const timeString = now.toTimeString().slice(0, 5);
                setAttendanceStatus((prev) => ({ ...prev, isCheckedIn: false, clockOutTime: timeString }));
            })
            .catch((e) => {
                toast.error('Error occured while marking you clocked Out');
            });
    };

    const formatTime = (time: Date) => time.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });

    const formatDate = (date: Date) => date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'high':
                return 'bg-red-100 text-red-700 border-red-200';
            case 'medium':
                return 'bg-yellow-100 text-yellow-700 border-yellow-200';
            case 'low':
                return 'bg-green-100 text-green-700 border-green-200';
            default:
                return 'bg-gray-100 text-gray-700 border-gray-200';
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'completed':
                return 'bg-green-500';
            case 'in-progress':
                return 'bg-blue-500';
            case 'pending':
                return 'bg-gray-400';
            case 'overdue':
                return 'bg-red-500';
            default:
                return 'bg-gray-400';
        }
    };

    const completedTasks = recentTasks.filter((t) => t.status === 'completed');
    const inProgressTasks = recentTasks.filter((t) => t.status === 'in-progress');

    return (
        <div className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-blue-50 p-6">
            <div className="max-w-7xl mx-auto space-y-6">
                {/* Header */}
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-full overflow-hidden ring-4 ring-white shadow-lg">
                            {/* Use avatar (may be relative path from backend) */}
                            <img src={employeeData.avatar || '/api/placeholder/100/100'} alt="avatar" className="w-full h-full object-cover" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600">
                                Welcome back, {String(employeeData.name).split(' ')[0] || 'User'}! <span className="ml-1">👋</span>
                            </h1>
                            <p className="text-sm text-gray-600">
                                {employeeData.role} • {employeeData.department}
                            </p>
                        </div>
                    </div>

                    <div className="text-right">
                        <div className="text-2xl font-bold text-gray-900">{formatTime(currentTime)}</div>
                        <div className="text-sm text-gray-600">{formatDate(currentTime)}</div>
                    </div>
                </motion.div>

                {/* Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {/* Clock Card */}
                    <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.05 }}>
                        <div className="rounded-xl p-5 shadow-xl bg-gradient-to-br from-green-500 to-emerald-600 text-white">
                            <div className="flex items-start justify-between">
                                <div className="p-2 bg-white/20 rounded-lg">
                                    <Clock className="w-6 h-6" />
                                </div>
                                <div
                                    className={`px-2 py-1 rounded text-xs ${
                                        attendanceStatus.status === 'present'
                                            ? 'bg-green-200 text-green-800'
                                            : attendanceStatus.status === 'late'
                                            ? 'bg-orange-200 text-orange-800'
                                            : 'bg-gray-200 text-gray-800'
                                    }`}
                                >
                                    {attendanceStatus.status === 'late'
                                        ? `Late ${attendanceStatus.lateMinutes ?? 0}m`
                                        : String(attendanceStatus.status).charAt(0).toUpperCase() + String(attendanceStatus.status).slice(1)}
                                </div>
                            </div>

                            <div className="mt-4 space-y-3">
                                <div className="flex justify-between text-sm">
                                    <span className="text-white/80">Clock In:</span>
                                    <span className="font-medium">{attendanceStatus.clockInTime || '--:--'}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-white/80">Clock Out:</span>
                                    <span className="font-medium">{attendanceStatus.clockOutTime || '--:--'}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-white/80">Hours:</span>
                                    <span className="font-medium">{attendanceStatus.workingHours?.toFixed?.(1) ?? '0.0'}h</span>
                                </div>
                            </div>

                            <div className="mt-4">
                                {!attendanceStatus.isCheckedIn ? (
                                    <button onClick={handleClockIn} className="w-full px-4 py-2 rounded-md bg-white/20 hover:bg-white/30 flex items-center justify-center gap-2">
                                        <LogIn className="w-4 h-4" />
                                        Clock In
                                    </button>
                                ) : (
                                    <button onClick={handleClockOut} className="w-full px-4 py-2 rounded-md bg-white/20 hover:bg-white/30 flex items-center justify-center gap-2">
                                        <LogOut className="w-4 h-4" />
                                        Clock Out
                                    </button>
                                )}
                            </div>
                        </div>
                    </motion.div>

                    {/* Tasks Card */}
                    <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.12 }}>
                        <div className="rounded-xl p-5 shadow-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white">
                            <div className="flex items-start justify-between">
                                <div className="p-2 bg-white/20 rounded-lg">
                                    <CheckCircle className="w-6 h-6" />
                                </div>
                                <div className="text-right">
                                    <div className="text-2xl font-bold">{completedTasks.length}</div>
                                    <div className="text-xs text-white/80">Completed</div>
                                </div>
                            </div>

                            <div className="mt-4 space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-white/80">In Progress:</span>
                                    <span className="font-medium">{inProgressTasks.length}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-white/80">Total Tasks:</span>
                                    <span className="font-medium">{recentTasks.length}</span>
                                </div>
                                <div className="mt-3">
                                    <div className="flex justify-between text-xs mb-1">
                                        <span>Progress</span>
                                        <span>{Math.round((completedTasks.length / Math.max(1, recentTasks.length)) * 100)}%</span>
                                    </div>
                                    <div className="w-full h-2 bg-white/20 rounded-full overflow-hidden">
                                        <div className="h-full bg-white" style={{ width: `${(completedTasks.length / Math.max(1, recentTasks.length)) * 100}%` }} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Performance Card */}
                    <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.18 }}>
                        <div className="rounded-xl p-5 shadow-xl bg-gradient-to-br from-purple-500 to-pink-600 text-white">
                            <div className="flex items-start justify-between">
                                <div className="p-2 bg-white/20 rounded-lg">
                                    <Trophy className="w-6 h-6" />
                                </div>
                                <div className="text-right">
                                    <div className="flex items-center gap-1 justify-end">
                                        <Star className="w-4 h-4" />
                                        <span className="text-2xl font-bold">{performanceMetrics.averageRating ?? '—'}</span>
                                    </div>
                                    <div className="text-xs text-white/80">Avg Rating</div>
                                </div>
                            </div>

                            <div className="mt-4 space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-white/80">Goals:</span>
                                    <span className="font-medium">
                                        {performanceMetrics.goalsAchieved ?? 0}/{performanceMetrics.totalGoals ?? 0}
                                    </span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-white/80">Attendance:</span>
                                    <span className="font-medium">{performanceMetrics.attendanceRate ?? 0}%</span>
                                </div>

                                <div className="mt-3">
                                    <div className="flex justify-between text-xs mb-1">
                                        <span>Goal Achievement</span>
                                        <span>{performanceMetrics.totalGoals ? Math.round((performanceMetrics.goalsAchieved / performanceMetrics.totalGoals) * 100) : 0}%</span>
                                    </div>
                                    <div className="w-full h-2 bg-white/20 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-white"
                                            style={{ width: `${performanceMetrics.totalGoals ? (performanceMetrics.goalsAchieved / performanceMetrics.totalGoals) * 100 : 0}%` }}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Quick Stats Card */}
                    <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.24 }}>
                        <div className="rounded-xl p-5 shadow-xl bg-gradient-to-br from-orange-500 to-red-600 text-white">
                            <div className="flex items-start justify-between">
                                <div className="p-2 bg-white/20 rounded-lg">
                                    <Activity className="w-6 h-6" />
                                </div>
                                <div className="text-right">
                                    <div className="text-2xl font-bold">{performanceMetrics.tasksCompleted}</div>
                                    <div className="text-xs text-white/80">This Month</div>
                                </div>
                            </div>

                            <div className="mt-4 space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-white/80">Active:</span>
                                    <span className="font-medium">{performanceMetrics.tasksInProgress}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-white/80">Efficiency:</span>
                                    <span className="font-medium">98.2%</span>
                                </div>
                                <div className="mt-3 flex items-center gap-2 text-xs">
                                    <TrendingUp className="w-4 h-4" />
                                    <span>+12% from last month</span>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Recent Tasks */}
                <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                    <div className="rounded-xl bg-white/80 backdrop-blur-sm p-6 shadow-xl">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-blue-50 rounded-lg">
                                    <Zap className="w-5 h-5 text-blue-600" />
                                </div>
                                <h2 className="text-2xl font-semibold">Recent Tasks</h2>
                            </div>

                            <button className="flex items-center gap-2 px-3 py-2 border rounded-md hover:bg-gray-50">
                                View All Tasks <ArrowRight className="w-4 h-4" />
                            </button>
                        </div>

                        <div className="space-y-4">
                            {recentTasks.slice(0, 4).map((task, idx) => (
                                <motion.div
                                    key={task.id}
                                    initial={{ opacity: 0, x: -8 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: idx * 0.06 }}
                                    className="flex items-center gap-4 p-4 bg-white rounded-lg border border-gray-100 hover:shadow-md transition-all duration-200"
                                >
                                    <div className={`w-3 h-3 rounded-full ${getStatusColor(task.status)}`} />
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <h3 className="font-medium">{task.title}</h3>
                                            <div className={`text-xs px-2 py-0.5 rounded-md ${getPriorityColor(task.priority)}`}>{task.priority}</div>
                                        </div>
                                        <p className="text-sm text-gray-500 mb-2">{task.description}</p>
                                        <div className="flex items-center gap-4 text-xs text-gray-400">
                                            <span>Due: {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : '—'}</span>
                                            <span>By: {task.assignedBy}</span>
                                        </div>
                                    </div>

                                    <div className="text-right">
                                        <div className="text-sm font-medium mb-1">{task.progress}%</div>
                                        <div className="w-28 h-2 bg-gray-100 rounded-full overflow-hidden">
                                            <div className="h-full bg-black" style={{ width: `${task.progress}%` }} />
                                        </div>
                                    </div>

                                    {task.status === 'completed' && <CheckCircle className="w-5 h-5 text-green-500" />}
                                    {task.status === 'overdue' && <AlertTriangle className="w-5 h-5 text-red-500" />}
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </motion.div>

                {/* Quick Links */}
                <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.36 }} className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div onClick={() => navigate('/staff_attendence')} className="rounded-xl bg-white/80 backdrop-blur-sm p-6 shadow-lg hover:shadow-xl transition cursor-pointer text-center group">
                        <div className="p-3 bg-blue-50 rounded-full w-fit mx-auto mb-4 group-hover:bg-blue-100 transition">
                            <Calendar className="w-6 h-6 text-blue-600" />
                        </div>
                        <h3 className="font-semibold mb-2">View Attendance</h3>
                        <p className="text-sm text-gray-500">Check your attendance history and patterns</p>
                    </div>

                    <div onClick={() => navigate('/view_tasks')} className="rounded-xl bg-white/80 backdrop-blur-sm p-6 shadow-lg hover:shadow-xl transition cursor-pointer text-center group">
                        <div className="p-3 bg-green-50 rounded-full w-fit mx-auto mb-4 group-hover:bg-green-100 transition">
                            <Target className="w-6 h-6 text-green-600" />
                        </div>
                        <h3 className="font-semibold mb-2">Manage Tasks</h3>
                        <p className="text-sm text-gray-500">Update task progress and manage deadlines</p>
                    </div>

                    <div className="rounded-xl bg-white/80 backdrop-blur-sm p-6 shadow-lg hover:shadow-xl transition cursor-pointer text-center group">
                        <div className="p-3 bg-purple-50 rounded-full w-fit mx-auto mb-4 group-hover:bg-purple-100 transition">
                            <Users className="w-6 h-6 text-purple-600" />
                        </div>
                        <h3 className="font-semibold mb-2">Team Updates</h3>
                        <p className="text-sm text-gray-500">Stay updated with team announcements</p>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default EmployeeDashboard;
