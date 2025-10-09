// Evaluations360Page.tsx
import React, { useEffect, useMemo, useState } from 'react';
import { Download, Plus, Search, Eye, Calendar, User, Lock, Activity, CircleCheck, NotepadTextDashed, CheckCircle } from 'lucide-react';
import EvaluationServices from '../../../../services/EvaluationServices';
import SubmitAssigmentPopup from '../Popups/SubmitAssigmentPopup';
import LoadingSpinner from '../../../LoadingSpinner';
import toast from 'react-hot-toast';
import { formatDateOnly, getAbbrivation } from '../../../../utils/Common';
import SubmissionDetailPage from '../SubmissionDetailPage';
import { type type360Evaluation, type type360aggregatedsingle } from '../../../../constantTypes/Evaluation360Types';
import { type Evaluatee } from '../../../../constantTypes/ManagerEvaluation';
interface subject {
    allusers_id: number;
    user_id: number;
    name: string;
    email: string;
    designation: {
        id: number;
        name: string;
    };
    department: {
        id: number;
        name: string;
    };
    profile_image: string;
    employee_id?: null;
}
export default function Evaluations360Page() {
    const [tabs, setTabs] = useState<number>(1);
    const [loading, setLoading] = useState<boolean>(false);
    const [apiData, setApiData] = useState<type360Evaluation[] | null>(null);
    // submitted list (kept generic because manager/other endpoints may return different shapes)
    const [submitted, setSumitted] = useState<any[] | null>(null);
    const [query, setQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<string | 'all'>('all');
    const [aggregatedResult, setAggregatedResult] = useState<type360aggregatedsingle[] | null>(null);
    const [openPopup, setOpenPopup] = useState<boolean>(false);
    const [assignId, setAssignId] = useState<number | null>(null);
    // selected subject for starting evaluation (360 subject)
    const [selectedEvaluatee, setSelectedEvaluatee] = useState<type360Evaluation['subject'] | null>(null);
    // selected submission to show detail (kept `any` so it can accept manager/360 submission shapes)
    const [selectedSubmission, setSelectedSubmission] = useState<any | null>(null);

    const fetchAssignments = () => {
        setLoading(true);
        EvaluationServices.get360Assignments()
            .then((r: any) => {
                console.log('360: ', r);
                setApiData(r || []);
            })
            .catch((e: any) => {
                console.error('Failed to fetch assignments', e);
                setApiData([]);
            })
            .finally(() => setLoading(false));
    };

    const EmployeeMangerAssignments = () => {
        setLoading(true);
        EvaluationServices.getEmployeeMangerAssignments()
            .then((r: any) => {
                console.log('Employee Manger: ', r);
                setSumitted(r || []);
            })
            .catch((e: any) => {
                console.error('Failed to fetch submitted list', e);
                setSumitted([]);
            })
            .finally(() => setLoading(false));
    };

    const fetchAggregattedResults = () => {
        setLoading(true);
        EvaluationServices.fetchAggregatedResults('360')
            .then((r: any) => {
                console.log('Aggregated 360: ', r);
                setAggregatedResult(r.results || []);
            })
            .catch((e: any) => {
                console.error('Failed to fetch aggregated results', e);
                setAggregatedResult(null);
            })
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        fetchAssignments();
        EmployeeMangerAssignments(); // delete this later
    }, []);

    useEffect(() => {
        if (tabs === 2 && !aggregatedResult) {
            fetchAggregattedResults();
        }
    }, [tabs]);

    const isDraft = (a: type360Evaluation) => false; // 360 payload doesn't include start_date in the sample
    const isActive = (a: type360Evaluation) => a.status === 'pending' || a.status === 'in_progress';

    const totals = useMemo(() => {
        const items = apiData || [];
        const total = items.length;
        const completed = items.filter((i) => i.status === 'submitted' || i.status === 'completed').length;
        const drafts = items.filter((i) => isDraft(i)).length;
        const scored = items.filter((i) => typeof (i as any).score === 'number');
        const avgScore = scored.length > 0 ? scored.reduce((s, x) => s + ((x as any).score || 0), 0) / scored.length : null;
        return { total, completed, drafts, avgScore };
    }, [apiData]);

    const filtered = useMemo(() => {
        if (!apiData) return [];
        const term = query.trim().toLowerCase();
        return apiData.filter((a) => {
            // search by template_name or subject.name
            if (term) {
                const name = (a.template_name ?? '').toLowerCase();
                const subj = (a.subject?.name ?? '').toLowerCase();
                if (!(name.includes(term) || subj.includes(term))) return false;
            }

            if (statusFilter === 'all') return true;
            if (statusFilter === 'active') return a.status === 'pending' || a.status === 'in_progress';
            if (statusFilter === 'completed') return a.status === 'submitted' || a.status === 'completed';
            if (statusFilter === 'inActive' || statusFilter === 'overdue') return a.status === 'overdue' || a.status === 'over_due';
            return true;
        });
    }, [apiData, query, statusFilter]);

    const fmtDate = (d?: string | null) => {
        if (!d) return '-';
        const dt = new Date(d);
        return dt.toLocaleDateString();
    };

    const handleStartEvaluation = (assignmentId: number, evaluatee: type360Evaluation['subject'] | null) => {
        if (!assignmentId) return toast.error('No assignment id found', { duration: 3000 });
        setAssignId(assignmentId);
        setSelectedEvaluatee(evaluatee);
        setOpenPopup(true);
    };

    // IMPORTANT: keep the early-return as requested
    if (selectedSubmission) {
        return <SubmissionDetailPage submission={selectedSubmission} formType={selectedSubmission.assignment?.template_form_type ?? 'self'} onBack={() => setSelectedSubmission(null)} />;
    }

    return (
        <div className="p-6">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-3xl font-semibold">360 Evaluations</h1>
                    <p className="text-sm text-gray-500">Assign and run 360 reviews — each card below represents one subject to evaluate.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="inline-flex items-center gap-2 px-4 py-2 rounded border border-gray-200 text-sm hover:bg-gray-50">
                        <Download className="w-4 h-4" />
                        Export Data
                    </button>
                    <button className="inline-flex items-center gap-2 px-4 py-2 rounded bg-black text-white text-sm">
                        <Plus className="w-4 h-4" />
                        Create Assignment
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-lg p-4 shadow-sm border mb-4">
                <div className="flex items-center gap-2 w-full">
                    <div className="relative flex-1">
                        <input
                            className="pl-10 pr-3 py-2 w-full rounded-lg border bg-gray-50 text-sm"
                            placeholder="Search evaluations or subject..."
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                        />
                        <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                    </div>

                    <select className="py-2 px-3 rounded-lg border bg-white text-sm" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                        <option value="all">All Status</option>
                        <option value="active">Pending</option>
                        <option value="completed">Completed</option>
                        <option value="inActive">Over Due</option>
                    </select>
                </div>
            </div>

            {/* tabs */}
            <div className="flex items-center justify-center gap-2 p-1 bg-gray-200 rounded-full mt-2">
                <button onClick={() => setTabs(1)} className={`flex-1 py-1 rounded-full ${tabs === 1 && 'bg-white'}`}>
                    Pending Evaluations
                </button>
                <button onClick={() => setTabs(2)} className={`flex-1 py-1 rounded-full ${tabs === 2 && 'bg-white'}`}>
                    Aggregated Results
                </button>
            </div>

            {/* Tab content */}
            {tabs === 1 &&
                (loading ? (
                    <LoadingSpinner />
                ) : (
                    <div className="mt-2 gap-4">
                        {loading && <div className="text-center py-8 text-gray-500 col-span-full">Loading...</div>}

                        {!loading && filtered.length === 0 && <div className="text-center py-8 text-gray-500 col-span-full">No targets found.</div>}

                        {!loading &&
                            filtered.map((item, idx) => {
                                const subject = item.subject;
                                const completed = item.status === 'submitted' || item.status === 'completed';
                                const active = item.status === 'pending' || item.status === 'in_progress';

                                const uid = subject ? subject.user_id ?? subject.allusers_id : null;
                                const key = `${item.assignment_id}-${uid ?? 'na'}-${idx}`;

                                return (
                                    <div key={key} className="bg-white rounded-lg p-4 border shadow-sm flex flex-col gap-4">
                                        <div className="flex items-start justify-between">
                                            <div>
                                                {subject && (
                                                    <div className="flex items-center gap-3 mt-3">
                                                        <img src={subject.profile_image ?? '/static/default-avatar.png'} alt={subject.name} className="w-12 h-12 rounded-full object-cover" />
                                                        <div className="flex-1">
                                                            <div className="font-medium">{subject.name}</div>
                                                            <div className="text-xs text-gray-500">{subject.designation?.name ?? subject.department?.name ?? subject.email}</div>
                                                        </div>
                                                    </div>
                                                )}
                                                <div className="text-sm text-gray-500 mt-1 flex gap-2 items-center">
                                                    <span>
                                                        Template: <span className="text-gray-700 font-medium">{item.template_name ?? '—'}</span>
                                                    </span>
                                                    <span>• Version: {item.template_version}</span>
                                                    <span>• Type: {item.form_type ?? '360'}</span>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-3">
                                                {completed && (
                                                    <div className="flex items-center gap-2 text-xs bg-green-50 text-green-700 px-2 py-1 rounded">
                                                        <CircleCheck size={12} />
                                                        <span>Completed</span>
                                                    </div>
                                                )}
                                                {active && (
                                                    <div className="flex items-center gap-2 text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded">
                                                        <Activity size={12} />
                                                        <span>Pending</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        <div className="mt-2 flex items-center gap-3 text-sm text-gray-600">
                                            <div className="flex items-center gap-2">
                                                <Lock className="w-4 h-4 text-gray-400" />
                                                <span>1 assignees</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Calendar className="w-4 h-4 text-gray-400" />
                                                <span>Submitted: {item.submitted_at ? new Date(item.submitted_at).toLocaleDateString() : '-'}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <User className="w-4 h-4 text-gray-400" />
                                                <span>Target: {item.form_type ?? '360'}</span>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2 mt-2">
                                            <div className="flex-1">
                                                <button
                                                    disabled={completed}
                                                    className={`${completed ? 'bg-gray-400' : 'bg-black'}  w-full text-white px-4 py-2 rounded-md font-medium`}
                                                    onClick={() => {
                                                        setAssignId(item.assignment_id);
                                                        setSelectedEvaluatee(subject ?? null);
                                                        setOpenPopup(true);
                                                    }}
                                                >
                                                    {completed ? 'Completed' : 'Start Evaluation'}
                                                </button>
                                            </div>
                                            <button
                                                className="p-2 ml-2 rounded border bg-white"
                                                onClick={() => {
                                                    // optional: for completed items you might fetch the submission and show details
                                                    if (item.status === 'submitted') {
                                                    } else {
                                                        toast('No report available for pending item');
                                                    }
                                                }}
                                            >
                                                <Eye className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                    </div>
                ))}

            {tabs === 2 &&
                (loading ? (
                    <LoadingSpinner />
                ) : (
                    <div>
                        {aggregatedResult?.map((item) => {
                            const name = item.target.target_user.name;
                            const res_count = item.target.responded_count;
                            const pen_count = item.target.pending_count;
                            const invited_count = pen_count + res_count || 0;
                            return (
                                <div key={`manager-submitted${item.assignment_id}`} className="bg-white shadow-sm rounded-lg px-6 py-4 grid grid-cols-8 gap-4 mt-3">
                                    <div className="col-span-3 md:col-span-5 flex items-center gap-3">
                                        <div className="flex items-center justify-center rounded-full bg-gray-300 p-2 text-[12px] size-12">{getAbbrivation(name)}</div>
                                        <div className="flex-1 pr-8">
                                            <h2 className="text-xl">
                                                {name} <span className="text-[12px] text-gray-700">By: {res_count} responds</span>
                                            </h2>
                                            <div className="flex flex-col md:flex-row items-center gap-3 text-gray-500 text-[12px] mt-2">
                                                <div className="flex items-center gap-1">
                                                    <span className="size-1 bg-blue-600 inline-block rounded-full"></span>Anonymus responses: {res_count}
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <span className="size-1 bg-blue-600 inline-block rounded-full"></span>Pending: {pen_count}
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <span className="size-1 bg-blue-600 inline-block rounded-full"></span>Invited: {invited_count}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex col-span-3 md:col-span-2 flex-col gap-2">
                                        <span>Average Score</span>
                                        <span className={`font-extrabold text-fuchsia-800 text-lg`}>{item?.target?.average_score?.toPrecision(3)}/10</span>
                                    </div>
                                    <div className="flex flex-col items-center gap-2 ">
                                        <div className="flex gap-2 items-center text-green-700">
                                            <CheckCircle size={14} />
                                            <span>Completed</span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ))}

            {/* keep popup rendering as requested */}
            {openPopup && <SubmitAssigmentPopup assignmentId={assignId!} targetUser={selectedEvaluatee} open={openPopup} onClose={() => setOpenPopup(false)} onSuccess={fetchAssignments} />}
        </div>
    );
}
