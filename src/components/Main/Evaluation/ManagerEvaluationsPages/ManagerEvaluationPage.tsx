import React, { useEffect, useMemo, useState } from 'react';
import { Download, Plus, Search, Eye, Calendar, User, Lock, Activity, CircleCheck, NotepadTextDashed, CheckCircle } from 'lucide-react';
import EvaluationServices from '../../../../services/EvaluationServices';
import SubmitAssigmentPopup from '../Popups/SubmitAssigmentPopup';
import LoadingSpinner from '../../../LoadingSpinner';
import toast from 'react-hot-toast';
import { type Assignee, type Evaluatee, type Assignment, type ManagerSubmittedType } from '../../../../constantTypes/ManagerEvaluation';
import { formatDateOnly, getAbbrivation } from '../../../../utils/Common';
import SubmissionDetailPage from '../SubmissionDetailPage';

export default function ManagerEvaluationPage() {
    const [tabs, setTabs] = useState<number>(1);
    const [loading, setLoading] = useState<boolean>(false);
    const [apiData, setApiData] = useState<Assignment[] | null>(null);
    const [submitted, setSumitted] = useState<ManagerSubmittedType[] | null>(null);
    const [query, setQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<string | 'all'>('all');
    const [aggregatedResult, setAggregatedResult] = useState(null);
    const [openPopup, setOpenPopup] = useState<boolean>(false);
    const [assignId, setAssignId] = useState<number | null>(null);
    const [selectedEvaluatee, setSelectedEvaluatee] = useState<Evaluatee | null>(null);
    const [selectedSubmission, setSelectedSubmission] = useState<ManagerSubmittedType | null>(null);

    const fetchAssignments = () => {
        setLoading(true);
        EvaluationServices.getManagerAssignments()
            .then((r: any) => {
                console.log('manager: ', r);
                setApiData(r || []);
            })
            .catch((e: any) => {
                console.error('Failed to fetch assignments', e);
                setApiData([]);
            })
            .finally(() => setLoading(false));
    };
    const fetchSubmittedList = () => {
        setLoading(true);
        EvaluationServices.fetchManagerSubmitted()
            .then((r: any) => {
                console.log('Submitted Manager: ', r);
                setSumitted(r || []);
            })
            .catch((e: any) => {
                console.error('Failed to fetch assignments', e);
                setApiData([]);
            })
            .finally(() => setLoading(false));
    };
    const fetchAggregattedResults = () => {
        setLoading(true);
        EvaluationServices.fetchAggregatedResults('manager')
            .then((r: any) => {
                console.log('Aggregated Manager: ', r);
                setAggregatedResult(r || []);
            })
            .catch((e: any) => {
                console.error('Failed to fetch assignments', e);
                setApiData([]);
            })
            .finally(() => setLoading(false));
    };
    useEffect(() => {
        fetchAssignments();
    }, []);
    useEffect(() => {
        if (tabs === 2 && !submitted) {
            fetchSubmittedList();
        }
        if (tabs === 3 && !aggregatedResult) {
            fetchAggregattedResults();
        }
    }, [tabs]);

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

    const totals = useMemo(() => {
        const items = apiData || [];
        const total = items.length;
        const completed = items.filter((i) => isCompleted(i)).length;
        const drafts = items.filter((i) => isDraft(i)).length;
        const scored = items.filter((i) => typeof i.avg_score === 'number');
        const avgScore = scored.length > 0 ? scored.reduce((s, x) => s + (x.avg_score || 0), 0) / scored.length : null;
        return { total, completed, drafts, avgScore };
    }, [apiData]);

    const filtered = useMemo(() => {
        if (!apiData) return [];
        return apiData.filter((a) => {
            const term = query.trim().toLowerCase();
            if (term) {
                const name = a.form_name || '';
                const by = a.assigned_by?.name || '';
                if (!(name.toLowerCase().includes(term) || by.toLowerCase().includes(term))) return false;
            }
            if (statusFilter === 'all') return true;
            if (statusFilter === 'active') return isActive(a);
            if (statusFilter === 'completed') return isCompleted(a);
            if (statusFilter === 'inActive') return !isActive(a);
            return true;
        });
    }, [apiData, query, statusFilter]);

    const fmtDate = (d?: string | null) => {
        if (!d) return '-';
        const dt = new Date(d);
        return dt.toLocaleDateString();
    };

    const handleStartEvaluation = (assignmentId: number, evaluatee: Evaluatee) => {
        if (!assignmentId) return toast.error('No assignment id found', { duration: 3000 });
        setAssignId(assignmentId);
        setSelectedEvaluatee(evaluatee);
        setOpenPopup(true);
    };

    // Flattened list: each item represents a single target (assignment + evaluatee)
    const targets = useMemo(() => {
        const list: { assignment: Assignment; evaluatee: Evaluatee }[] = [];
        (filtered || []).forEach((a) => {
            const evs: Evaluatee[] = (a.to_evaluate as any) || (a.subjects as any) || [];
            if (Array.isArray(evs) && evs.length > 0) {
                evs.forEach((e) => list.push({ assignment: a, evaluatee: e }));
            } else {
                // If there are no evaluatees, still show a placeholder card for the assignment
                list.push({ assignment: a, evaluatee: null as any });
            }
        });
        return list;
    }, [filtered]);

    if (selectedSubmission) {
        return <SubmissionDetailPage submission={selectedSubmission} formType={selectedSubmission.assignment?.template_form_type ?? 'self'} onBack={() => setSelectedSubmission(null)} />;
    }
    return (
        <div className="p-6">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-3xl font-semibold">Manager Evaluations</h1>
                    <p className="text-sm text-gray-500">Pick a person to evaluate — each card below represents one target.</p>
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
                        <input className="pl-10 pr-3 py-2 w-full rounded-lg border bg-gray-50 text-sm" placeholder="Search assignments..." value={query} onChange={(e) => setQuery(e.target.value)} />
                        <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                    </div>

                    <select className="py-2 px-3 rounded-lg border bg-white text-sm" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                        <option value="all">All Status</option>
                        <option value="active">Active</option>
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
                    Completed Evaluations
                </button>
                <button onClick={() => setTabs(3)} className={`flex-1 py-1 rounded-full ${tabs === 3 && 'bg-white'}`}>
                    Team Analytics
                </button>
            </div>
            {tabs === 1 &&
                (loading ? (
                    <LoadingSpinner />
                ) : (
                    <div className="mt-2 gap-4">
                        {loading && <div className="text-center py-8 text-gray-500 col-span-full">Loading...</div>}

                        {!loading && targets.length === 0 && <div className="text-center py-8 text-gray-500 col-span-full">No targets found.</div>}

                        {!loading &&
                            targets.map(({ assignment, evaluatee }, idx) => {
                                const completed = evaluatee.status === 'submitted';
                                const draft = isDraft(assignment);
                                const active = isActive(assignment);

                                // safe ids
                                const uid = evaluatee ? evaluatee.user_id ?? evaluatee.allusers_id : null;
                                const key = `${assignment.id}-${uid ?? 'na'}-${idx}`;

                                return (
                                    <div key={key} className="bg-white rounded-lg p-4 border shadow-sm flex flex-col gap-4">
                                        <div className="flex items-start justify-between">
                                            <div>
                                                {evaluatee && (
                                                    <div className="flex items-center gap-3 mt-3">
                                                        <img src={evaluatee.profile_image ?? '/static/default-avatar.png'} alt={evaluatee.name} className="w-12 h-12 rounded-full object-cover" />
                                                        <div className="flex-1">
                                                            <div className="font-medium">{evaluatee.name}</div>
                                                            <div className="text-xs text-gray-500">{evaluatee.designation?.name ?? evaluatee.department?.name ?? evaluatee.email}</div>
                                                        </div>
                                                    </div>
                                                )}
                                                <div className="text-sm text-gray-500 mt-1 flex gap-2 items-center">
                                                    <span>
                                                        Assigned by: <span className="text-gray-700 font-medium">{assignment.assigned_by?.name ?? '—'}</span>
                                                    </span>
                                                    <span>• Version: {assignment.template_version}</span>
                                                    <span>• Period: {assignment.period ?? '—'}</span>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-3">
                                                {completed && (
                                                    <div className="flex items-center gap-2 text-xs bg-green-50 text-green-700 px-2 py-1 rounded">
                                                        <CircleCheck size={12} />
                                                        <span>Completed</span>
                                                    </div>
                                                )}
                                                {active ? (
                                                    <div className="flex items-center gap-2 text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded">
                                                        <Activity size={12} />
                                                        <span>Active</span>
                                                    </div>
                                                ) : (
                                                    <div className="flex items-center gap-2 text-xs bg-blue-50 text-red-700 px-2 py-1 rounded">
                                                        <Activity size={12} />
                                                        <span>Over Due</span>
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
                                                <span>Due: {fmtDate(assignment.end_date)}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <User className="w-4 h-4 text-gray-400" />
                                                <span>Target: {assignment.target_department ? 'department' : assignment.target_type}</span>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2 mt-2">
                                            <div className="flex-1">
                                                <button
                                                    disabled={completed}
                                                    className={`${completed ? 'bg-gray-400' : 'bg-black'}  w-full text-white px-4 py-2 rounded-md font-medium`}
                                                    onClick={() => handleStartEvaluation(assignment.id, evaluatee)}
                                                >
                                                    {completed ? 'Completed' : 'Start Evaluation'}
                                                </button>
                                            </div>
                                            <button className="p-2 ml-2 rounded border bg-white">
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
                        {submitted?.map((item) => {
                            const name = item.target_user.name;
                            return (
                                <div key={`manager-submitted${item.id}`} className="bg-white shadow-sm rounded-lg px-6 py-4 grid grid-cols-8 gap-4 mt-3">
                                    <div className="col-span-3 md:col-span-5 flex items-center gap-3">
                                        <div className="flex items-center justify-center rounded-full bg-gray-300 p-2 text-[12px] size-12">{getAbbrivation(name)}</div>
                                        <div className="flex-1 pr-8">
                                            <h2 className="text-xl">
                                                {item.target_user.name} <span className="text-[12px] text-gray-700">By: {item.respondent.name}</span>
                                            </h2>
                                            <div className="flex flex-col md:flex-row items-center gap-3 text-gray-500 text-[12px] mt-2">
                                                <div className="flex items-center gap-1">
                                                    <span className="size-1 bg-blue-600 inline-block rounded-full"></span> Evaluated: {formatDateOnly(item.submitted_at)}
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <span className="size-1 bg-blue-600 inline-block rounded-full"></span>responses: {item.comment_count}
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <span className="size-1 bg-blue-600 inline-block rounded-full"></span>Template: {item.assignment.template_name}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex col-span-3 md:col-span-2 flex-col gap-2">
                                        <span>Overall Score</span>
                                        <span className={`font-extrabold text-green-600 text-lg`}>{item.computed_score.toPrecision(3)}/10</span>
                                    </div>
                                    <div className="flex flex-col items-center gap-2 ">
                                        <div className="flex gap-2 items-center text-green-700">
                                            <CheckCircle size={14} />
                                            <span>Completed</span>
                                        </div>

                                        <button
                                            onClick={() => setSelectedSubmission(item)}
                                            className="flex md:col-span-2 items-center gap-3 border px-2 whitespace-nowrap py-0.5 hover:bg-gray-300 rounded"
                                        >
                                            <Eye size={14} />
                                            View Report
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ))}
            {tabs === 3 && (loading ? <LoadingSpinner /> : <div></div>)}
            {openPopup && <SubmitAssigmentPopup assignmentId={assignId!} targetUser={selectedEvaluatee!} open={openPopup} onClose={() => setOpenPopup(false)} onSuccess={fetchAssignments} />}
        </div>
    );
}
