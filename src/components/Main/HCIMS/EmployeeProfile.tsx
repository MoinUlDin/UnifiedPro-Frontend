import React, { useEffect, useState } from 'react';
import { User, Edit2, Calendar, Target, CheckCircle, Trophy, Clock, PieChart, MapPin, Phone, Mail, Award, Building, Building2, Calendar1, Info } from 'lucide-react';
import EmployeeServices from '../../../services/EmployeeServices';
import { useParams } from 'react-router-dom';
import { formatDateOnly, capitalizeName } from '../../../utils/Common';

// NOTE: this component expects EmployeeManagementService.fetchProfileData(id)
// to be available in the runtime (as you described). It calls that function
// and renders the two tab views shown in the images (Overview + Profile).
interface task {
    id: number;
    task_name: string;
    priority: string;
    weight: number;
    status: string;
    progress: number;
    start_date: string;
    due_date: string;
    time_taken: null;
    report_kpi_value: null;
    assigned_by: {
        id: number;
        name: string;
    };
    submitted_by: null;
    completion_date: string;
    on_time: boolean;
}
type EmployeeProfileData = {
    id: string | number;
    initials?: string;
    name?: string;
    title?: string;
    department?: string;
    employee_code?: string;
    joined_at?: string;
    status?: string;
    performance_score?: number; // e.g. 88
    task_completion?: number; // e.g. 50
    dept_ranking?: string; // e.g. "#3"
    attendance?: number; // e.g. 96
    tasks: task[];
    month_metrics?: {
        assigned?: number;
        completed?: number;
        pending?: number;
        overdue?: number;
        goal_achievement?: number; // percent
    };
    achievements?: Array<{ title: string; subtitle?: string; date?: string }>;
    personal?: {
        first_name?: string;
        last_name?: string;
        email?: string;
        phone?: string;
        location?: string;
        profile_image: string;
    };
    employment?: {
        position?: string;
        department?: string;
        manager?: string;
        employment_type?: string;
        work_schedule?: string;
        join_date?: string;
    };
    skills?: string[];
    emergency?: { name?: string; relation?: string; phone?: string };
    address?: { street?: string; city?: string; state?: string; zip?: string; country?: string };
};

export default function EmployeeProfile() {
    const { id } = useParams();
    const [data, setData] = useState<EmployeeProfileData | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<'overview' | 'tasks' | 'performance' | 'profile'>('overview');

    useEffect(() => {
        if (!id) return;
        let mounted = true;
        setLoading(true);
        setError(null);
        // calling the API as the user requested
        // EmployeeManagementService.fetchProfileData(id).then(...)
        // we assume the global service exists
        // you can adapt this to your own import
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        EmployeeServices.fetchProfileData(id)
            .then((r: any) => {
                if (!mounted) return;
                // assume API returns r.data or r
                const payload = r?.data ?? r;
                setData(normalize(payload));
                console.log('Profile Data: ', r);
            })
            .catch((e: any) => {
                if (!mounted) return;
                console.error(e);
                setError('Failed to load profile');
            })
            .finally(() => {
                if (!mounted) return;
                setLoading(false);
            });

        return () => {
            mounted = false;
        };
    }, [id]);

    function normalize(payload: any): EmployeeProfileData {
        // Extract shape used by this component. You can adapt fields to match your API.
        return {
            id: payload?.id ?? id,
            initials: payload?.initials ?? getInitials(payload?.name ?? payload?.first_name ?? ''),
            name: payload?.name ?? (payload?.first_name && payload?.last_name ? `${payload.first_name} ${payload.last_name}` : 'Sarah Johnson'),
            title: payload?.title ?? payload?.position ?? 'Senior Frontend Developer',
            department: payload?.department ?? 'Information Technology',
            employee_code: payload?.employee_code ?? 'EMP-001',
            joined_at: payload?.joined_at ?? 'March 15, 2023',
            status: payload?.status ?? 'Active',
            performance_score: payload?.performance_score ?? 88,
            task_completion: payload?.task_completion ?? 50,
            dept_ranking: payload?.dept_ranking ?? '#3',
            attendance: payload?.attendance ?? 96,
            month_metrics: payload?.month_metrics ?? { assigned: 8, completed: 6, pending: 1, overdue: 1, goal_achievement: 75 },
            achievements: payload?.achievements ?? [
                { title: 'Employee of the Month', subtitle: 'Outstanding performance and dedication in October 2024', date: '10/31/2024' },
                { title: '100% Task Completion', subtitle: 'Completed all assigned tasks on time for 3 consecutive months', date: '10/15/2024' },
                { title: 'React Certification', subtitle: 'Completed Advanced React Developer Certification', date: '9/22/2024' },
            ],
            personal: payload?.personal ?? { first_name: 'Sarah', last_name: 'Johnson', email: 'sarah.johnson@company.com', phone: '+1 (555) 123-4567', location: 'New York Office' },
            employment: payload?.employment ?? {
                position: 'Senior Frontend Developer',
                department: 'Information Technology',
                manager: 'David Wilson',
                employment_type: 'Full Time',
                work_schedule: 'Monday - Friday, 9:00 AM - 6:00 PM',
                join_date: 'March 15, 2023',
            },
            tasks: payload.tasks,
            skills: payload?.skills ?? ['React', 'TypeScript', 'Node.js', 'Python', 'UI/UX Design', 'Agile'],
            emergency: payload?.emergency ?? { name: 'Michael Johnson', relation: 'Spouse', phone: '+1 (555) 987-6543' },
            address: payload?.address ?? { street: '123 Main Street, Apt 4B', city: 'New York', state: 'NY', zip: '10001', country: 'United States' },
        };
    }

    function getInitials(name: string) {
        if (!name) return 'SJ';
        return name
            .split(' ')
            .map((s) => s[0])
            .slice(0, 2)
            .join('')
            .toUpperCase();
    }

    if (loading) {
        return (
            <div className="p-6">
                <div className="animate-pulse space-y-4">
                    <div className="h-6 w-3/12 bg-gray-200 rounded" />
                    <div className="h-64 bg-gray-100 rounded" />
                </div>
            </div>
        );
    }

    if (error) {
        return <div className="p-6 text-red-600">{error}</div>;
    }

    if (!data) return null;

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div className="bg-gradient-to-r from-white to-purple-50 border rounded-2xl p-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-4">
                            {data?.personal?.profile_image ? (
                                <img
                                    src={data?.personal?.profile_image}
                                    alt="Profile"
                                    className="w-20 h-20 rounded-full bg-white border flex items-center justify-center text-xl font-semibold text-gray-700 shadow"
                                />
                            ) : (
                                <div className="w-20 h-20 rounded-full bg-white border flex items-center justify-center text-xl font-semibold text-gray-700 shadow">{data.initials}</div>
                            )}

                            <div>
                                <h2 className="text-2xl font-extrabold">{data.name}</h2>
                                <div className="text-sm text-gray-500">{data.title}</div>
                                <div className="text-xs text-gray-400 mt-2 flex items-center gap-3">
                                    <span className="flex items-center gap-1">
                                        <User className="w-4 h-4" /> {data.employee_code}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <Calendar className="w-4 h-4" /> Joined {data.joined_at}
                                    </span>
                                    <span className="ml-2 inline-block bg-green-100 text-green-700 px-2 py-1 text-xs rounded">{data.status}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <button className="flex items-center gap-2 border rounded px-3 py-2 text-sm hover:shadow">
                            <Edit2 className="w-4 h-4" /> Edit Profile
                        </button>
                    </div>
                </div>

                {/* metrics row */}
                <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
                    <CardSmall label="Performance Score" value={`${data.performance_score}%`} icon={<Target className="w-6 h-6" />} />
                    <CardSmall label="Task Completion" value={`${data.task_completion}%`} icon={<CheckCircle className="w-6 h-6" />} />
                    <CardSmall label="Dept. Ranking" value={String(data.dept_ranking)} icon={<Trophy className="w-6 h-6" />} />
                    <CardSmall label="Attendance" value={`${data.attendance}%`} icon={<Clock className="w-6 h-6" />} />
                </div>
            </div>

            {/* Tabs */}
            <div className="flex items-center gap-4 border w-fit bg-gray-100 px-1 py-0.5 rounded-full">
                <Tab label="Overview" active={activeTab === 'overview'} onClick={() => setActiveTab('overview')} />
                <Tab label="Tasks" active={activeTab === 'tasks'} onClick={() => setActiveTab('tasks')} />
                <Tab label="Performance" active={activeTab === 'performance'} onClick={() => setActiveTab('performance')} />
                <Tab label="Profile" active={activeTab === 'profile'} onClick={() => setActiveTab('profile')} />
            </div>

            {/* Content area */}
            {activeTab === 'overview' && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="col-span-2 space-y-6">
                        <div className="bg-white border rounded-lg p-6">
                            <h3 className="font-semibold">Current Month Performance</h3>
                            <p className="text-xs text-gray-400">November 2024 metrics and goals</p>
                            <div className="mt-4 grid grid-cols-2 gap-4">
                                <div>
                                    <div className="text-sm text-gray-500">Tasks Assigned</div>
                                    <div className="text-2xl font-bold">{data.month_metrics?.assigned}</div>
                                </div>
                                <div>
                                    <div className="text-sm text-gray-500">Tasks Completed</div>
                                    <div className="text-2xl font-bold">{data.month_metrics?.completed}</div>
                                </div>
                            </div>

                            <div className="mt-6 border-t pt-4">
                                <div className="text-sm text-gray-500">Goal Achievement</div>
                                <div className="w-full bg-gray-200 rounded-full h-3 mt-2">
                                    <div className="h-3 rounded-full" style={{ width: `${data.month_metrics?.goal_achievement ?? 0}%`, background: '#0f172a' }} />
                                </div>
                                <div className="text-xs text-gray-400 mt-2">
                                    {data.month_metrics?.goal_achievement}% — {data.month_metrics?.completed} of {data.month_metrics?.assigned} goals achieved
                                </div>
                            </div>
                        </div>

                        <div className="bg-white border rounded-lg p-6">
                            <h3 className="font-semibold">Recent Achievements</h3>
                            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                                {data.achievements?.map((a, i) => (
                                    <div key={i} className="border rounded p-4">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <div className="font-semibold">{a.title}</div>
                                                <div className="text-xs text-gray-500">{a.subtitle}</div>
                                            </div>
                                            <div className="text-xs text-gray-400">{a.date}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="bg-white border rounded-lg p-6 h-full">
                            <h3 className="font-semibold">Task Status Distribution</h3>
                            <p className="text-xs text-gray-400">Current task breakdown</p>
                            <div className="flex items-center justify-center mt-6">
                                <SmallPie />
                            </div>
                        </div>

                        <div className="bg-white border rounded-lg p-6">
                            <h3 className="font-semibold">Quick Stats</h3>
                            <div className="grid grid-cols-2 gap-4 mt-4">
                                <StatLabel label="Pending" value={String(data.month_metrics?.pending ?? 0)} />
                                <StatLabel label="Overdue" value={String(data.month_metrics?.overdue ?? 0)} />
                                <StatLabel label="Completed" value={String(data.month_metrics?.completed ?? 0)} />
                                <StatLabel label="Assigned" value={String(data.month_metrics?.assigned ?? 0)} />
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'profile' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="space-y-6">
                        <div className="bg-white border rounded-lg p-6">
                            <h4 className="font-semibold flex items-center gap-2">
                                <User className="w-4 h-4" /> Personal Information
                            </h4>
                            <div className="mt-4 grid grid-cols-2 gap-4">
                                <div>
                                    <div className="text-xs text-gray-400">First Name</div>
                                    <div className="font-medium">{data.personal?.first_name}</div>
                                </div>
                                <div>
                                    <div className="text-xs text-gray-400">Last Name</div>
                                    <div className="font-medium">{data.personal?.last_name}</div>
                                </div>
                                <div>
                                    <div className="text-xs text-gray-400">Email</div>
                                    <div className="font-medium flex items-center gap-2">
                                        <Mail className="w-4 h-4" />
                                        {data.personal?.email}
                                    </div>
                                </div>
                                <div>
                                    <div className="text-xs text-gray-400">Phone</div>
                                    <div className="font-medium flex items-center gap-2">
                                        <Phone className="w-4 h-4" />
                                        {data.personal?.phone}
                                    </div>
                                </div>
                                <div className="col-span-2">
                                    <div className="text-xs text-gray-400">Location</div>
                                    <div className="font-medium flex items-center gap-2">
                                        <MapPin className="w-4 h-4" />
                                        {data.personal?.location}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white border rounded-lg p-6">
                            <h4 className="font-semibold">Skills & Expertise</h4>
                            <div className="mt-4 flex flex-wrap gap-2">
                                {data.skills?.map((s, i) => (
                                    <span key={i} className="px-3 py-1 border rounded-full text-xs">
                                        {s}
                                    </span>
                                ))}
                            </div>
                        </div>

                        <div className="bg-white border rounded-lg p-6">
                            <h4 className="font-semibold">Address</h4>
                            <div className="mt-4 grid grid-cols-2 gap-4">
                                <div>
                                    <div className="text-xs text-gray-400">Street</div>
                                    <div className="font-medium">{data.address?.street}</div>
                                </div>
                                <div>
                                    <div className="text-xs text-gray-400">City</div>
                                    <div className="font-medium">{data.address?.city}</div>
                                </div>
                                <div>
                                    <div className="text-xs text-gray-400">State</div>
                                    <div className="font-medium">{data.address?.state}</div>
                                </div>
                                <div>
                                    <div className="text-xs text-gray-400">ZIP Code</div>
                                    <div className="font-medium">{data.address?.zip}</div>
                                </div>
                                <div className="col-span-2">
                                    <div className="text-xs text-gray-400">Country</div>
                                    <div className="font-medium">{data.address?.country}</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="bg-white border rounded-lg p-6">
                            <h4 className="font-semibold">Employment Details</h4>
                            <div className="mt-4 grid grid-cols-1 gap-3">
                                <div>
                                    <div className="text-xs text-gray-400">Position</div>
                                    <div className="font-medium">{data.employment?.position}</div>
                                </div>
                                <div>
                                    <div className="text-xs text-gray-400">Department</div>
                                    <div className="font-medium">{data.employment?.department}</div>
                                </div>
                                <div>
                                    <div className="text-xs text-gray-400">Manager</div>
                                    <div className="font-medium">{data.employment?.manager}</div>
                                </div>
                                <div>
                                    <div className="text-xs text-gray-400">Employment Type</div>
                                    <div className="font-medium">{data.employment?.employment_type}</div>
                                </div>
                                <div>
                                    <div className="text-xs text-gray-400">Work Schedule</div>
                                    <div className="font-medium">{data.employment?.work_schedule}</div>
                                </div>
                                <div>
                                    <div className="text-xs text-gray-400">Join Date</div>
                                    <div className="font-medium">{data.employment?.join_date}</div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white border rounded-lg p-6">
                            <h4 className="font-semibold">Emergency Contact</h4>
                            <div className="mt-4">
                                <div className="text-xs text-gray-400">Name</div>
                                <div className="font-medium">{data.emergency?.name}</div>
                                <div className="text-xs text-gray-400 mt-3">Relationship</div>
                                <div className="font-medium">{data.emergency?.relation}</div>
                                <div className="text-xs text-gray-400 mt-3">Phone</div>
                                <div className="font-medium">{data.emergency?.phone}</div>
                            </div>
                        </div>

                        <div className="bg-white border rounded-lg p-6">
                            <h4 className="font-semibold">Quick Summary</h4>
                            <div className="mt-3 text-sm text-gray-600">
                                Performance <span className="font-semibold">{data.performance_score}%</span> • Task Completion <span className="font-semibold">{data.task_completion}%</span> •
                                Attendance <span className="font-semibold">{data.attendance}%</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'tasks' && (
                <div className="border bg-white rounded-lg p-6">
                    <div className="flex items-start gap-2 font-medium">
                        <Building2 size={14} className="mt-1" />
                        <span>
                            <h2>Task Management</h2>
                            <p className="text-sm text-gray-600">All assigned tasks and their current status</p>
                        </span>
                    </div>
                    <div>
                        {data.tasks?.map((t) => {
                            const color = t.status === 'Completed' ? 'green' : t.status === 'Pending' ? 'yellow' : 'red';
                            console.log('Item : ', t);
                            const size = 3;
                            return (
                                <div className="w-full border py-2 px-3 rounded mb-3" key={`tasks-${t.id}`}>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <div className={`bg-${color}-500 size-${size} rounded-full `}></div>
                                            <h4>{t.task_name} </h4>
                                        </div>
                                        <div className={`text-[12px] py-0.5 px-1 bg-${color}-500 rounded text-white`}>{t.status}</div>
                                    </div>
                                    <p className={`px-${size}`}></p>
                                    <div className="flex gap-3 mt-3">
                                        <div className="flex items-center gap-2 ">
                                            <Calendar1 size={14} />
                                            <span className="mt-0.5 text-[10px] text-gray-500">Due: {formatDateOnly(t.due_date)}</span>
                                        </div>
                                        <div className={`flex items-center gap-2 text-${color}-700`}>
                                            <Info size={14} />
                                            <span className={`mt-0.5 text-[10px] `}>{capitalizeName(t.priority)} Priority</span>
                                        </div>
                                        <div className="flex items-center gap-2 ">
                                            <User size={14} />
                                            <span className="mt-0.5 text-[10px] text-gray-500">{t.assigned_by.name}</span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
            {/* simple fallback for other tabs */}
            {activeTab === 'performance' && <div className="bg-white border rounded-lg p-6">This tab is a placeholder; wire it to your tasks/performance data as needed.</div>}
        </div>
    );
}

/* --- small helper components --- */

function Tab({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
    return (
        <button onClick={onClick} className={` px-3 py-1 rounded-full text-sm ${active ? 'bg-white border' : 'bg-gray-100  text-gray-600'}`}>
            {label}
        </button>
    );
}

function CardSmall({ label, value, icon }: { label: string; value: string | number; icon?: React.ReactNode }) {
    return (
        <div className="bg-white border rounded-lg p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-md bg-gray-50 flex items-center justify-center">{icon}</div>
            <div>
                <div className="text-xs text-gray-400">{label}</div>
                <div className="font-semibold text-lg">{value}</div>
            </div>
        </div>
    );
}

function StatLabel({ label, value }: { label: string; value: string }) {
    return (
        <div className="border rounded p-3 text-center">
            <div className="text-xs text-gray-400">{label}</div>
            <div className="font-semibold">{value}</div>
        </div>
    );
}

function SmallPie() {
    // simple static pie placeholder using SVG
    return (
        <svg width="140" height="140" viewBox="0 0 32 32">
            <circle r="16" cx="16" cy="16" fill="#e6f7f0" />
            <path d="M16 16 L32 16 A16 16 0 0 0 16 0 z" fill="#10b981" />
            <path d="M16 16 L16 0 A16 16 0 0 0 4.7 28.2 z" fill="#3b82f6" />
            <path d="M16 16 L4.7 28.2 A16 16 0 0 0 22 30 z" fill="#f59e0b" />
            <circle cx="16" cy="16" r="7" fill="white" />
        </svg>
    );
}
