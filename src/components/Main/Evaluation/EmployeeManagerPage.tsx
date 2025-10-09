// EmployeeManagerPage.tsx
import { Lock, Eye, Calendar, User, Activity, CircleCheck, CheckCircle } from 'lucide-react';
import React, { useEffect, useMemo, useState } from 'react';
import EvaluationServices from '../../../services/EvaluationServices';
import SubmitAssigmentPopup from './Popups/SubmitAssigmentPopup';
import LoadingSpinner from '../../LoadingSpinner';
import toast from 'react-hot-toast';
import { getAbbrivation } from '../../../utils/Common';
import { type EmployeeManagerTypeAggregated } from '../../../constantTypes/ManagerEvaluation';
import EmployeeManagerAggregatedDetail from './EmployeeManagerAggregatedDetail';

type Subject = {
    allusers_id: number;
    user_id?: number;
    name: string;
    email?: string;
    designation?: { id: number; name: string } | null;
    department?: { id: number; name: string } | null;
    profile_image?: string | null;
    employee_id?: string | null;
    status?: 'submitted' | 'pending';
    submitted_at?: string;
};

type EmpManagerAssignment = {
    id: number;
    template_version?: number;
    assigned_by?: { id: number; name?: string } | null;
    target_type?: string;
    subject?: Subject | null;
    respondents?: any[];
    target_department?: number | null;
    start_date?: string | null;
    end_date?: string | null;
    anonymity?: boolean;
    include_system_metrics?: boolean;
    recurrence?: string | null;
    period?: string | null;
    created_at?: string;
    form_type?: string;
    form_name?: string;
    status: 'submitted' | 'pending';
    submitted_at: string | null;
    score: number | null;
};

export default function EmployeeManagerPage() {
    const [tabs, setTabs] = useState<number>(1);
    const [loading, setLoading] = useState<boolean>(false);
    const [apiData, setApiData] = useState<EmpManagerAssignment[] | null>(null);
    const [aggregated, setAggregated] = useState<EmployeeManagerTypeAggregated[] | null>(null);
    const [selectedDetails, setSelectedDetails] = useState<EmployeeManagerTypeAggregated | null>(null);

    // popup state for starting evaluation
    const [openPopup, setOpenPopup] = useState(false);
    const [assignId, setAssignId] = useState<number | null>(null);
    const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);

    const fetchassignments = () => {
        setLoading(true);
        EvaluationServices.getEmployeeMangerAssignments()
            .then((r: any) => {
                // ensure array
                console.log('employee manger: ', r);
                setApiData(Array.isArray(r) ? r : []);
            })
            .catch((e: any) => {
                console.error('Failed to load employee→manager assignments', e);
                toast.error('Failed to load assignments');
                setApiData([]);
            })
            .finally(() => setLoading(false));
    };
    const fetchAggregaetdResults = () => {
        setLoading(true);
        EvaluationServices.fetchAggregatedResults('employee_manager')
            .then((r: any) => {
                // ensure array
                console.log('employee manger Aggregated: ', r);
                setAggregated(r?.results);
            })
            .catch((e: any) => {
                console.error('Failed to load employee→manager assignments', e);
                toast.error('Failed to load assignments');
            })
            .finally(() => setLoading(false));
    };
    useEffect(() => {
        fetchassignments();
    }, []);
    useEffect(() => {
        if (tabs === 2 && !aggregated) {
            fetchAggregaetdResults();
        }
    }, [tabs]);

    const fmtDate = (d?: string | null) => {
        if (!d) return '-';
        try {
            return new Date(d).toLocaleDateString();
        } catch {
            return d;
        }
    };

    const isDraft = (a?: EmpManagerAssignment) => !!a?.start_date && new Date(a!.start_date!) > new Date();
    const isActive = (a?: EmpManagerAssignment) => {
        if (!a) return false;
        const start = a.start_date ? new Date(a.start_date) : null;
        const end = a.end_date ? new Date(a.end_date) : null;
        const started = !start || start <= new Date();
        const notEnded = !end || end >= new Date();
        // treat assignment active if within window
        return started && notEnded;
    };

    const handleStartEvaluation = (assignmentId: number, subject: Subject | null) => {
        if (!assignmentId) return toast.error('Assignment id missing');
        setAssignId(assignmentId);
        setSelectedSubject(subject);
        setOpenPopup(true);
    };

    const assignments = apiData ?? [];

    if (selectedDetails) {
        return <EmployeeManagerAggregatedDetail data={selectedDetails} onClose={() => setSelectedDetails(null)} />;
    }
    return (
        <div className="p-6">
            {/* header Text */}
            <div className="mb-4">
                <h1 className="text-3xl font-bold">Employee → Manager Evaluations</h1>
                <p className="text-gray-500">Anonymous feedback about management effectiveness and leadership</p>
            </div>

            <div className="border p-4 rounded-lg mt-2 bg-white">
                <div className="flex items-center gap-3">
                    <Lock size={45} className="text-gray-600" />
                    <div>
                        <h3 className="font-bold">Strictly Confidential:</h3>
                        <p className="text-gray-600">
                            Employee→Manager evaluations are completely anonymous. Individual responses cannot be traced back to specific employees. Only authorized senior staff can view aggregated
                            results.
                        </p>
                    </div>
                </div>
            </div>

            {/* tabs */}
            <div className="flex items-center justify-center gap-2 p-1 bg-gray-200 rounded-full mt-6">
                <button onClick={() => setTabs(1)} className={`flex-1 py-1 rounded-full ${tabs === 1 && 'bg-white'}`}>
                    My Evaluations
                </button>
                <button onClick={() => setTabs(2)} className={`flex-1 py-1 rounded-full ${tabs === 2 && 'bg-white'}`}>
                    Reports (Restricted)
                </button>
                <button onClick={() => setTabs(3)} className={`flex-1 py-1 rounded-full ${tabs === 3 && 'bg-white'}`}>
                    Leadership Analytics
                </button>
            </div>

            {/* Main Content */}
            <div className="border p-4 rounded-xl mt-4 bg-white min-h-[200px]">
                {tabs === 1 && (
                    <div className="space-y-4">
                        <div>
                            <h3 className="font-bold">Evaluate Your Manager</h3>
                            <p className="text-gray-500">Provide anonymous feedback to help improve management effectiveness</p>
                        </div>

                        {loading ? (
                            <div className="py-10">
                                <LoadingSpinner />
                            </div>
                        ) : assignments.length === 0 ? (
                            <div className="text-gray-500 py-8">No manager evaluations assigned to you at the moment.</div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                                {assignments.map((a) => {
                                    const subj = a.subject ?? null;
                                    const active = isActive(a);
                                    const draft = isDraft(a);
                                    const submitted = a.status === 'submitted';
                                    // use id as key
                                    return (
                                        <div key={a.id} className="bg-white rounded-lg p-4 border shadow-sm flex flex-col gap-4">
                                            <div className="flex items-start justify-between">
                                                <div className="flex items-start gap-4">
                                                    <img src={subj?.profile_image ?? '/static/default-avatar.png'} alt={subj?.name ?? 'Manager'} className="w-14 h-14 rounded-full object-cover" />
                                                    <div>
                                                        <div className="font-medium text-lg">{subj?.name ?? 'Unknown Manager'}</div>
                                                        <div className="text-xs text-gray-500 mt-1">{subj?.designation?.name ?? subj?.department?.name ?? subj?.email}</div>
                                                        <div className="text-xs text-gray-400 mt-2">
                                                            Assigned by: <span className="font-medium text-gray-700">{a.assigned_by?.name ?? '—'}</span>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="flex flex-col items-end gap-2">
                                                    <div className="text-sm text-gray-500">{a.form_name ?? a.template_version}</div>
                                                    <div className="flex items-center gap-2">
                                                        {draft && <div className="text-xs px-2 py-1 bg-yellow-50 text-yellow-700 rounded">Draft</div>}
                                                        {active ? (
                                                            <div className="text-xs px-2 py-1 bg-blue-50 text-blue-700 rounded">Active</div>
                                                        ) : (
                                                            <div className="text-xs px-2 py-1 bg-red-50 text-red-700 rounded">Closed</div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex items-center justify-between text-sm text-gray-600">
                                                <div className="flex items-center gap-2">
                                                    <Calendar className="w-4 h-4 text-gray-400" />
                                                    <span>{`Due Date: ${fmtDate(a.end_date)}`}</span>
                                                </div>

                                                <div className="flex items-center gap-2">
                                                    <User className="w-4 h-4 text-gray-400" />
                                                    <span>{a.period ?? 'one-off'}</span>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-3 mt-2">
                                                <div className="flex-1">
                                                    <button
                                                        className={`${!submitted ? 'bg-black text-white' : 'bg-gray-400 text-white'} w-full px-4 py-2 rounded-md font-medium`}
                                                        onClick={() => handleStartEvaluation(a.id, subj)}
                                                        disabled={submitted}
                                                    >
                                                        {submitted ? 'Completed' : 'Start Evaluation'}
                                                    </button>
                                                </div>

                                                <div>
                                                    <button className="p-2 rounded border bg-white" onClick={() => {}}>
                                                        <Eye className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                )}

                {tabs === 2 &&
                    (loading ? (
                        <LoadingSpinner />
                    ) : (
                        <div>
                            <div>
                                <h3 className="font-bold">Reports (Restricted)</h3>
                                <p className="text-gray-500">Leadership reports are restricted. You can see self and your subordinates results</p>
                            </div>
                            {aggregated?.map((item) => {
                                const name = item?.manager_aggregate.manager.name;
                                const res_count = item?.manager_aggregate?.responded_count;
                                const pen_count = item?.manager_aggregate?.pending_count;
                                const invited_count = item?.manager_aggregate?.invited_count;
                                const isDisabled = item?.manager_aggregate.responded_count === 0;
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
                                            <span className={`font-extrabold text-fuchsia-800 text-lg`}>{item?.manager_aggregate.average_score?.toPrecision(3) || 0}/10</span>
                                        </div>
                                        <div className="flex flex-col items-center gap-2 ">
                                            <div className="flex gap-2 items-center text-green-700">
                                                <CheckCircle size={14} />
                                                <span>Completed</span>
                                            </div>
                                            <button
                                                disabled={isDisabled}
                                                className={`flex items-center gap-3 border px-2 whitespace-nowrap py-0.5 ${!isDisabled ? 'hover:bg-gray-200' : 'text-gray-400'}  rounded`}
                                                onClick={() => setSelectedDetails(item)}
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

                {tabs === 3 && (
                    <div>
                        <h3 className="font-bold">Leadership Analytics</h3>
                        <p className="text-gray-500">Insights from anonymous employee feedback will appear here.</p>
                    </div>
                )}
            </div>

            {/* popup for submitting evaluation */}
            {openPopup && (
                <SubmitAssigmentPopup
                    assignmentId={assignId!}
                    targetUser={selectedSubject!}
                    open={openPopup}
                    onClose={() => setOpenPopup(false)}
                    onSuccess={() => {
                        setOpenPopup(false);
                        fetchassignments();
                    }}
                />
            )}
        </div>
    );
}
