// SelfEvaluationPage.tsx
import React, { useEffect, useMemo, useState } from 'react';
import { Download, Plus, Search, Eye, Calendar, User, CheckCircle, Lock, Activity, CircleCheck, NotepadTextDashed } from 'lucide-react';
import EvaluationServices from '../../../../services/EvaluationServices';
import SubmitAssigmentPopup from '../Popups/SubmitAssigmentPopup';
import LoadingSpinner from '../../../LoadingSpinner';
import toast from 'react-hot-toast';
import { formatDateOnly, getAbbrivation } from '../../../../utils/Common';
import { type SelfEvaluationSubmitType } from '../../../../constantTypes/SelfEvaluationTypes';
import SubmissionDetailPage from '../SubmissionDetailPage';
type Assignee = {
    id: number;
    name?: string;
};

type Assignment = {
    id: number;
    template_version: number;
    assigned_by: Assignee | null;
    target_type: string;
    subjects: any[];
    respondents: any[];
    target_department: number | null;
    start_date: string | null;
    end_date: string | null;
    anonymity: boolean;
    include_system_metrics: boolean;
    recurrence: string | null;
    period: string | null;
    created_at: string;
    form_type: string;
    form_name: string;
    total_assignees: number;
    complete_count: number;
    completed_percentage: number;
    submitted: boolean;
    // optional fields you may have in future:
    avg_score?: number;
};

export default function SelfEvaluationPage() {
    const [tabs, setTabs] = useState<number>(1);
    const [loading, setLoading] = useState<boolean>(false);
    const [apiData, setApiData] = useState<Assignment[] | null>(null);
    const [query, setQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<string | 'all'>('all');
    const [selfSubmitted, setSelfSubmitted] = useState<SelfEvaluationSubmitType[] | null>(null);
    const [openPopup, setOpenPopup] = useState<boolean>(false);
    const [assignId, setAssignId] = useState<number | null>(null);
    const [selectedSubmission, setSelectedSubmission] = useState<SelfEvaluationSubmitType | null>(null);

    const fetchAssignments = () => {
        setLoading(true);
        EvaluationServices.getSelfAssignments()
            .then((r: any) => {
                setApiData(r);
                console.log('self: ', r);
            })
            .catch((e: any) => {
                console.error('Failed to fetch self assignments', e);
                setApiData([]);
            })
            .finally(() => setLoading(false));
    };

    const fetchSumittedSelfList = () => {
        setLoading(true);
        EvaluationServices.fetchSelfSubmitted()
            .then((r: any) => {
                setSelfSubmitted(r);
                console.log('self Submitted: ', r);
            })
            .catch((e: any) => {
                console.error('Failed to fetch self assignments', e);
                setApiData([]);
            })
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        fetchAssignments();
    }, []);
    useEffect(() => {
        if (tabs === 2 && !selfSubmitted) {
            fetchSumittedSelfList();
        }
    }, [tabs]);

    const now = useMemo(() => new Date(), []);

    const isCompleted = (a: Assignment) =>
        a.submitted === true ||
        (typeof a.completed_percentage === 'number' && a.completed_percentage >= 100) ||
        (typeof a.total_assignees === 'number' && a.total_assignees > 0 && a.complete_count >= a.total_assignees);

    const isDraft = (a: Assignment) => !!a.start_date && new Date(a.start_date) > new Date();

    const isActive = (a: Assignment) => {
        const start = a.start_date ? new Date(a.start_date) : null;
        const end = a.end_date ? new Date(a.end_date) : null;
        const started = !start || start <= new Date();
        const notEnded = !end || end >= new Date();
        return !isCompleted(a) && started && notEnded;
    };

    // Derived summary counts
    const totals = useMemo(() => {
        const items = apiData || [];
        const total = items.length;
        const completed = items.filter((i) => isCompleted(i)).length;
        const drafts = items.filter((i) => isDraft(i)).length;
        // avg score if present on items
        const scored = items.filter((i) => typeof i.avg_score === 'number');
        const avgScore = scored.length > 0 ? scored.reduce((s, x) => s + (x.avg_score || 0), 0) / scored.length : null;
        return { total, completed, drafts, avgScore };
    }, [apiData]);

    const filtered = useMemo(() => {
        if (!apiData) return [];
        return apiData.filter((a) => {
            // search by form_name or assigned_by.name
            const term = query.trim().toLowerCase();
            if (term) {
                const name = a.form_name || '';
                const by = a.assigned_by?.name || '';
                if (!(name.toLowerCase().includes(term) || by.toLowerCase().includes(term))) return false;
            }
            if (statusFilter === 'all') return true;
            if (statusFilter === 'active') return isActive(a);
            if (statusFilter === 'completed') return isCompleted(a);
            if (statusFilter === 'draft') return isDraft(a);
            return true;
        });
    }, [apiData, query, statusFilter]);

    const fmtDate = (d?: string | null) => {
        if (!d) return '-';
        const dt = new Date(d);
        return dt.toLocaleDateString();
    };

    const handleStartEvaluation = (id: number) => {
        console.log('Clicked in');
        if (!id) return toast.error('No Id found, system error', { duration: 4000 });
        console.log('Clicked');
        setAssignId(id);
        setOpenPopup(true);
    };

    if (loading) {
        return (
            <div className="inset-0 fixed flex z-50 bg-gray-700/30 items-center justify-center">
                <div className="size-16 border-b-4 border-l-4 border-amber-600 animate-spin rounded-full"></div>
            </div>
        );
    }
    if (selectedSubmission) {
        return <SubmissionDetailPage submission={selectedSubmission} formType={selectedSubmission.assignment?.template_form_type ?? 'self'} onBack={() => setSelectedSubmission(null)} />;
    }

    return (
        <div className="p-6">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-3xl font-semibold">Self-Evaluation Reports</h1>
                    <p className="text-sm text-gray-500">Manage self-evaluation assignments and review submissions</p>
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

            {/* Cards */}
            <div className="grid grid-cols-4 gap-4 mb-6">
                <div className="bg-white rounded-lg p-4 shadow-sm border">
                    <div className="text-xs text-gray-500">Total Assignments</div>
                    <div className="text-2xl font-bold mt-2">{totals.total}</div>
                </div>

                <div className="bg-white rounded-lg p-4 shadow-sm border">
                    <div className="text-xs text-gray-500">Completed</div>
                    <div className="text-2xl font-bold mt-2">{totals.completed}</div>
                </div>

                <div className="bg-white rounded-lg p-4 shadow-sm border">
                    <div className="text-xs text-gray-500">Drafts</div>
                    <div className="text-2xl font-bold mt-2">{totals.drafts}</div>
                </div>

                <div className="bg-white rounded-lg p-4 shadow-sm border">
                    <div className="text-xs text-gray-500">Avg Score</div>
                    <div className="text-2xl font-bold mt-2">{totals.avgScore !== null ? totals.avgScore.toFixed(1) : '-'}</div>
                </div>
            </div>

            <div className="bg-white rounded-lg p-4 shadow-sm border">
                <div className="flex items-center gap-2 w-full">
                    <div className="relative flex-1">
                        <input className="pl-10 pr-3 py-2 w-full rounded-lg border bg-gray-50 text-sm" placeholder="Search assignments..." value={query} onChange={(e) => setQuery(e.target.value)} />
                        <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                    </div>

                    <select className="py-2 px-3 rounded-lg border bg-white text-sm" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                        <option value="all">All Status</option>
                        <option value="active">Active</option>
                        <option value="completed">Completed</option>
                        <option value="draft">Drafts</option>
                    </select>
                </div>
            </div>
            {/* tabs */}
            <div className="flex items-center justify-center gap-2 p-1 bg-gray-200 rounded-full mt-2">
                <button onClick={() => setTabs(1)} className={`flex-1 py-1 rounded-full ${tabs === 1 && 'bg-white'}`}>
                    Active Assignments
                </button>
                <button onClick={() => setTabs(2)} className={`flex-1 py-1 rounded-full ${tabs === 2 && 'bg-white'}`}>
                    All Submissions
                </button>
            </div>
            {/* List */}
            {tabs === 1 && (
                <div className="space-y-4 mt-4">
                    {loading && <div className="text-center py-8 text-gray-500">Loading...</div>}

                    {!loading && filtered.length === 0 && <div className="text-center py-8 text-gray-500">No assignments found.</div>}

                    {!loading &&
                        filtered.map((item) => {
                            const completed = isCompleted(item);
                            const draft = isDraft(item);
                            const active = isActive(item);

                            return (
                                <div key={item.id} className="bg-white rounded-lg p-4 border shadow-sm flex flex-col gap-4">
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <h3 className="text-lg font-semibold">{item.form_name}</h3>
                                            <div className="text-sm text-gray-500 mt-1 flex gap-2 items-center">
                                                <span>
                                                    Assigned by: <span className="text-gray-700 font-medium">{item.assigned_by?.name ?? '—'}</span>
                                                </span>
                                                <span>• Version: {item.template_version}</span>
                                                <span>• Period: {item.period ?? '—'}</span>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3">
                                            {draft && (
                                                <div className="flex items-center gap-2 text-xs bg-yellow-50 text-yellow-700 px-2 py-1 rounded">
                                                    <NotepadTextDashed size={12} />
                                                    <span>Draft</span>
                                                </div>
                                            )}
                                            {completed && (
                                                <div className="flex items-center gap-2 text-xs bg-green-50 text-green-700 px-2 py-1 rounded">
                                                    <CircleCheck size={12} />
                                                    <span>Completed</span>
                                                </div>
                                            )}
                                            {active && (
                                                <div className="flex items-center gap-2 text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded">
                                                    <Activity size={12} />
                                                    <span>Active</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="mt-2 flex justify-between text-sm text-gray-600 pr-4 sm:pr-8">
                                        <div className="flex items-center gap-2">
                                            <Lock className="w-4 h-4 text-gray-400" />
                                            <span>{item.total_assignees ?? 0} assignees</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Calendar className="w-4 h-4 text-gray-400" />
                                            <span>Due: {fmtDate(item.end_date)}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <User className="w-4 h-4 text-gray-400" />
                                            <span>{item.target_department ? 'department' : item.target_type}</span>
                                        </div>
                                        <div className="hidden sm:block"></div>
                                    </div>

                                    <div className="flex items-center mt-2 ">
                                        <div className="flex-1">
                                            {completed ? (
                                                <div className="bg-gray-300 rounded-md text-center py-3 text-white font-medium">Completed</div>
                                            ) : (
                                                <button
                                                    className="bg-black w-full text-white px-4 py-2 rounded-md font-medium"
                                                    onClick={() => {
                                                        handleStartEvaluation(item.id);
                                                    }}
                                                >
                                                    Start Evaluation
                                                </button>
                                            )}
                                        </div>

                                        <div className="ml-3">
                                            <button className="p-2 rounded border bg-white">
                                                <Eye className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                </div>
            )}
            {tabs === 2 &&
                (loading ? (
                    <LoadingSpinner />
                ) : (
                    <div>
                        {selfSubmitted?.map((item) => {
                            const name = item.target_user.name;
                            return (
                                <div key={`manager-submitted${item.id}`} className="bg-white shadow-sm rounded-lg px-6 py-4 grid grid-cols-8 mt-3">
                                    <div className="col-span-5 flex items-center gap-3">
                                        <div className="flex items-center justify-center rounded-full bg-gray-300 p-2 text-[12px] size-12">{getAbbrivation(name)}</div>
                                        <div className="flex-1">
                                            <h2 className="text-xl">{item.target_user.name}</h2>
                                            <div className="flex items-center  gap-6 text-gray-500 text-[12px] mt-2">
                                                <div>Evaluated: {formatDateOnly(item.submitted_at)}</div>

                                                <div>Template: {item.assignment.template_name}</div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex col-span-2 flex-col gap-2">
                                        <span>Overall Score</span>
                                        <span className={`font-extrabold text-green-600 text-lg`}>{item.computed_score.toPrecision(3)}/10</span>
                                    </div>
                                    <div className="flex flex-col items-center gap-2 ">
                                        <div className="flex gap-2 items-center text-green-700">
                                            <CheckCircle size={14} />
                                            <span>Completed</span>
                                        </div>

                                        <button className="flex items-center gap-3 border px-2 whitespace-nowrap py-0.5 hover:bg-gray-300 rounded" onClick={() => setSelectedSubmission(item)}>
                                            <Eye size={14} />
                                            View Report
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ))}
            {/* render submission detail when selected */}

            {openPopup && <SubmitAssigmentPopup onSuccess={fetchAssignments} assignmentId={assignId!} open={openPopup} onClose={() => setOpenPopup(false)} />}
        </div>
    );
}
