import React, { useEffect, useMemo, useState } from 'react';
import TaskServices from '../../../services/TaskServices';
import toast from 'react-hot-toast';
import { CheckCircle, CloudDownload, Clock, Tag } from 'lucide-react';

/**
 * Expected backend format (an array of tasks) — example from your message:
 * [
 *  {
 *    "id": 1,
 *    "company": 1,
 *    "task_name": "Task 1",
 *    "frequency": "at_once",
 *    "instructions": "",
 *    "progress": 0,
 *    "status": "In_Progress",
 *    "start_date": "2025-08-12T14:20:00",
 *    "due_date": "2025-08-13T14:25:00",
 *    "task_file": "http://.../showme.png",
 *    "employee": 3,
 *    "priority": "medium",
 *    "assigned_by": { "id": 1, "name": "Jam Ali" },
 *    "co_worker": [],
 *    "department_kpi": null,
 *    "weight": 30,
 *    "assigned_to": "Waqs Qadir",
 *    "profile": "http://.../profile.png"
 *  },
 *  ...
 * ]
 */

/* ---------- Utilities ---------- */
function formatDate(dateStr?: string | null) {
    if (!dateStr) return '—';
    const d = new Date(dateStr);
    return d.toLocaleString();
}

function isOverdue(task: any) {
    if (!task.due_date) return false;
    if ((task.status || '').toLowerCase() === 'completed') return false;
    return new Date(task.due_date) < new Date();
}

/* ---------- Component: TaskCard ---------- */
function TaskCard({ task, onProgressChange, onMarkComplete }: { task: any; onProgressChange: (id: number, progress: number) => Promise<void>; onMarkComplete: (id: number) => Promise<void> }) {
    const progress = task.progress ?? 0;

    const priorityColor = task.priority === 'high' ? 'bg-red-500' : task.priority === 'low' ? 'bg-green-400' : 'bg-yellow-400';

    return (
        <div className="bg-white rounded-xl shadow-sm border p-5 flex flex-col justify-between min-h-[220px]">
            <div>
                <div className="flex justify-between items-start gap-3">
                    <div>
                        <h3 className="text-lg font-semibold text-slate-800">{task.task_name}</h3>
                        <p className="text-sm text-slate-500 mt-1 line-clamp-2">{task.instructions || 'No description'}</p>
                    </div>
                    <div className={`px-2 py-1 rounded text-xs font-semibold text-white ${priorityColor} self-start`}>{task.priority?.toUpperCase() ?? 'MEDIUM'}</div>
                </div>

                {/* progress bar */}
                <div className="mt-4">
                    <div className="text-xs text-slate-500 mb-2">Progress</div>
                    <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                        <div className="h-2 bg-gradient-to-r from-indigo-600 to-pink-500" style={{ width: `${progress}%` }} />
                    </div>
                    <div className="flex items-center justify-between mt-2 gap-3">
                        <div className="flex items-center gap-2">
                            <select
                                className="text-sm form-select min-w-24 px-2 py-1 rounded bg-white border"
                                value={String(progress)}
                                onChange={(e) => onProgressChange(task.id, Number(e.target.value))}
                            >
                                <option value="0">0%</option>
                                <option value="10">10%</option>
                                <option value="25">25%</option>
                                <option value="30">30%</option>
                                <option value="40">40%</option>
                                <option value="50">50%</option>
                                <option value="60">60%</option>
                                <option value="70">70%</option>
                                <option value="75">75%</option>
                                <option value="80">80%</option>
                                <option value="90">90%</option>
                                <option value="100">100%</option>
                            </select>
                            {/* <div className="text-xs text-slate-500">({progress}%)</div> */}
                        </div>

                        <div className="text-sm text-slate-400">{task.weight ? `Weight: ${task.weight}%` : null}</div>
                    </div>
                </div>

                {/* meta row */}
                <div className="mt-4 flex items-center justify-between text-sm text-slate-500 gap-3">
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2">
                            <img src={task.profile} alt={task.assigned_to} className="w-7 h-7 rounded-full object-cover" />
                            <div>
                                <div className="text-sm text-slate-700">{task.assigned_to}</div>
                                <div className="text-xs text-slate-400">By: {task.assigned_by?.name ?? '—'}</div>
                            </div>
                        </div>
                    </div>

                    <div className="text-xs text-slate-400 text-right">
                        <div>
                            Due: <span className={`${isOverdue(task) ? 'text-red-500 font-semibold' : ''}`}>{formatDate(task.due_date)}</span>
                        </div>
                        <div className="mt-1">Start: {formatDate(task.start_date)}</div>
                    </div>
                </div>
            </div>

            {/* bottom row: actions and attachments */}
            <div className="mt-4 flex items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                    {task.task_file ? (
                        <a href={task.task_file} target="_blank" rel="noreferrer" download className="inline-flex items-center gap-2 text-sm px-3 py-1 rounded-md border hover:bg-slate-50">
                            <CloudDownload size={16} /> Download
                        </a>
                    ) : (
                        <div className="text-xs text-slate-400">No attachment</div>
                    )}
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={() => onMarkComplete(task.id)}
                        className="inline-flex items-center gap-2 bg-green-600 text-white px-3 py-1 rounded-md text-sm hover:bg-green-700"
                        title="Mark Complete"
                    >
                        <CheckCircle size={16} /> Mark Complete
                    </button>
                </div>
            </div>
        </div>
    );
}

/* ---------- Main page component ---------- */
export default function EmployeeTasksPage() {
    const [tasks, setTasks] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [filter, setFilter] = useState<'all' | 'completed' | 'in_progress'>('all');

    useEffect(() => {
        load();
    }, []);

    function load() {
        setLoading(true);
        TaskServices.fetchEmployeeTasks(3)
            .then((r) => {
                setTasks(r);
            })
            .catch((e) => {
                console.error(e);
                toast.error('Failed to load tasks');
            })
            .finally(() => {
                setLoading(false);
            });
    }

    const stats = useMemo(() => {
        const total = tasks.length;
        const completed = tasks.filter((t) => (t.status || '').toLowerCase() === 'completed').length;
        const inProgress = tasks.filter((t) => (t.status || '').toLowerCase() === 'in_progress' || (t.status || '').toLowerCase() === 'in-progress').length;
        const overdue = tasks.filter(isOverdue).length;
        const avgProgress = total ? Math.round(tasks.reduce((s, t) => s + (t.progress || 0), 0) / total) : 0;
        return { total, completed, inProgress, overdue, avgProgress };
    }, [tasks]);

    async function handleProgressChange(id: number, newProgress: number) {
        // optimistic update
        const prev = tasks.slice();
        setTasks((t) => t.map((x) => (x.id === id ? { ...x, progress: newProgress, status: newProgress === 100 ? 'Completed' : x.status } : x)));

        const payload: any = { progress: newProgress };
        if (newProgress === 100) payload.status = 'Completed';
        TaskServices.UpdateTaskProgress(id, payload)
            .then(() => {
                toast.success('Progress updated');
            })
            .catch((e) => {
                setTasks(prev);
                toast.error(e.message || 'Failed to update progress');
            });
    }

    async function handleMarkComplete(id: number) {
        const prev = tasks.slice();
        setTasks((t) => t.map((x) => (x.id === id ? { ...x, progress: 100, status: 'Completed' } : x)));
        try {
            TaskServices.UpdateTask(id, { progress: 100, status: 'Completed' });
            toast.success('Task marked complete');
        } catch (err) {
            console.error(err);
            setTasks(prev);
            toast.error('Failed to mark complete');
        }
    }

    const filteredTasks = tasks.filter((t) => {
        if (filter === 'all') return true;
        if (filter === 'completed') return (t.status || '').toLowerCase() === 'completed';
        if (filter === 'in_progress') return (t.status || '').toLowerCase().includes('progress');
        return true;
    });

    return (
        <div className="p-6 min-h-screen bg-gradient-to-b from-emerald-50 to-white">
            {/* header */}
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-6">
                    <h1 className="text-3xl font-extrabold text-emerald-700">My Tasks</h1>
                    <p className="text-sm text-slate-500">Manage your assigned tasks and track progress</p>
                </div>

                {/* stat cards */}
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
                    <StatCard label="Total Tasks" value={stats.total} />
                    <StatCard label="Completed" value={stats.completed} />
                    <StatCard label="In Progress" value={stats.inProgress} />
                    <StatCard label="Overdue" value={stats.overdue} />
                    <StatCard label="Avg Progress" value={`${stats.avgProgress}%`} />
                </div>

                {/* filters */}
                <div className="flex items-center justify-between gap-4 mb-6">
                    <div className="flex items-center gap-3">
                        <select value={filter} onChange={(e) => setFilter(e.target.value as any)} className="form-select">
                            <option value="all">All Tasks</option>
                            <option value="in_progress">In Progress</option>
                            <option value="completed">Completed</option>
                        </select>
                        <select className="form-select">
                            <option>Due Date</option>
                            <option>Priority</option>
                            <option>Progress</option>
                        </select>
                    </div>
                    <div className="text-sm text-slate-500">
                        Showing {filteredTasks.length} of {tasks.length} tasks
                    </div>
                </div>

                {/* tasks grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {loading ? (
                        <div className="col-span-full text-center text-slate-500 py-10">Loading tasks...</div>
                    ) : filteredTasks.length === 0 ? (
                        <div className="col-span-full text-center text-slate-500 py-10">No tasks found.</div>
                    ) : (
                        filteredTasks.map((task) => <TaskCard key={task.id} task={task} onProgressChange={handleProgressChange} onMarkComplete={handleMarkComplete} />)
                    )}
                </div>
            </div>
        </div>
    );
}

/* ---------- small StatCard helper ---------- */
function StatCard({ label, value }: { label: string; value: React.ReactNode }) {
    return (
        <div className="bg-white rounded-xl p-4 shadow-sm border">
            <div className="text-xs text-slate-400">{label}</div>
            <div className="text-2xl font-bold text-slate-800 mt-2">{value}</div>
        </div>
    );
}
