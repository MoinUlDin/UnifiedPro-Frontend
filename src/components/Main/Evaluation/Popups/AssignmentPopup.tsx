// src/components/Evaluation/AssignmentPopup.tsx
import React, { useEffect, useMemo, useState } from 'react';
import { X, Users, Home, Layers, Search, ChevronDown, ChevronUp } from 'lucide-react';
import EvaluationServices from '../../../../services/EvaluationServices';
import { type AssignmentOptionsResponse, type DepartmentGroup, type EmployeeItem, type Props, type AssignmentPayload } from '../../../../constantTypes/EvaluationTypes';
import toast from 'react-hot-toast';

const periodOptions = [
    { key: 'one-off', label: 'One-time Assignment' },
    { key: 'monthly', label: 'Monthly' },
    { key: 'weekly', label: 'Weekly' },
    { key: 'quarterly', label: 'Quarterly' },
    { key: 'yearly', label: 'Yearly' },
];

const AssignmentPopup: React.FC<Props> = ({ versionId, open, initial = null, onClose, onSubmit }) => {
    const [loading, setLoading] = useState(false);
    const [groups, setGroups] = useState<DepartmentGroup[]>([]);
    const [totalEmployees, setTotalEmployees] = useState<number>(0);
    const [search, setSearch] = useState<string>('');
    const [tab, setTab] = useState<'users' | 'department' | 'company'>('users');

    // selection state
    const [selectedUserIds, setSelectedUserIds] = useState<number[]>([]);
    const [selectedDepartmentId, setSelectedDepartmentId] = useState<number | null>(null);

    // form state
    const [startDate, setStartDate] = useState<string>('');
    const [endDate, setEndDate] = useState<string | null>(null);
    const [period, setPeriod] = useState<AssignmentPayload['period']>('one-off');
    const [anonymity, setAnonymity] = useState<boolean>(false);
    const [includeMetrics, setIncludeMetrics] = useState<boolean>(true);

    // small UI helpers: expanded dept map
    const [expandedDepts, setExpandedDepts] = useState<Record<number, boolean>>({});

    // error
    const [error, setError] = useState<string | null>(null);

    // load assignment options (grouped by department) on open or version change
    useEffect(() => {
        if (!open) return;
        let cancelled = false;
        setLoading(true);
        setError(null);
        EvaluationServices.assignmentOptions(Number(versionId))
            .then((res: AssignmentOptionsResponse) => {
                if (cancelled) return;
                if (res.mode === 'grouped_by_department') {
                    setGroups(res.departments || []);
                    setTotalEmployees(res.total_employees || 0);
                } else {
                    if (Array.isArray((res as any).departments)) {
                        setGroups((res as any).departments);
                        setTotalEmployees(((res as any).total_employees || 0) as number);
                    } else {
                        setGroups([]);
                        setTotalEmployees(0);
                    }
                }
            })
            .catch((e: any) => {
                console.error(e);
                setError('Failed to fetch employee list.');
            })
            .finally(() => {
                if (!cancelled) setLoading(false);
            });
        return () => {
            cancelled = true;
        };
    }, [open, versionId]);

    // populate fields if editing
    useEffect(() => {
        if (!initial) return;
        if (initial.target_type) {
            setTab(initial.target_type === 'user' ? 'users' : initial.target_type === 'department' ? 'department' : 'company');
        }
        if (initial.target_users && initial.target_users.length) {
            setSelectedUserIds(initial.target_users.map((id) => Number(id)));
        }
        if (initial.target_department) setSelectedDepartmentId(initial.target_department);
        if (initial.start_date) setStartDate(initial.start_date);
        if (initial.end_date) setEndDate(initial.end_date ?? null);
        if (initial.period) setPeriod(initial.period);
        if (typeof initial.anonymity === 'boolean') setAnonymity(initial.anonymity);
        if (typeof initial.include_system_metrics === 'boolean') setIncludeMetrics(initial.include_system_metrics);
    }, [initial]);

    // search filter applied to groups -> memoized
    const filteredGroups = useMemo(() => {
        if (!search) return groups;
        const term = search.toLowerCase();
        return groups
            .map((g) => {
                const employees = g.employees.filter((e) => {
                    return e.full_name.toLowerCase().includes(term) || (e.email || '').toLowerCase().includes(term);
                });
                return { ...g, employees };
            })
            .filter((g) => g.employees.length > 0 || g.department_name.toLowerCase().includes(term));
    }, [groups, search]);

    // flatten selected count
    const selectedCount = selectedUserIds.length;

    const handleToggleUser = (u: EmployeeItem) => {
        if (!u.user_id) return;
        setSelectedUserIds((prev) => {
            if (prev.includes(u.user_id as number)) return prev.filter((id) => id !== (u.user_id as number));
            return [...prev, u.user_id as number];
        });
    };

    const handleToggleDepartmentExpansion = (deptId: number | null) => {
        if (deptId === null) return;
        setExpandedDepts((prev) => ({ ...prev, [deptId]: !prev[deptId] }));
    };

    // When a department is chosen in the "Department" tab, auto-select all employees in that department
    const handleSelectDepartment = (deptId: number | null) => {
        setSelectedDepartmentId(deptId);
        setSelectedUserIds([]); // reset then fill
        if (deptId === null) return;

        const dept = groups.find((d) => d.department_id === deptId);
        if (!dept) return;
        const ids = dept.employees.map((e) => e.user_id).filter(Boolean) as number[];
        setSelectedUserIds(ids);
    };

    const handleChooseCompany = () => {
        setTab('company');
        setSelectedDepartmentId(null);
        setSelectedUserIds([]);
    };

    const validateAndBuildPayload = (): AssignmentPayload | null => {
        setError(null);
        if (!startDate) {
            setError('Start date is required.');
            return null;
        }
        if (tab === 'users' && selectedUserIds.length === 0) {
            setError('Please select at least one target user.');
            return null;
        }
        if (tab === 'department' && selectedDepartmentId === null) {
            setError('Please select a target department.');
            return null;
        }

        const target_type: AssignmentPayload['target_type'] = tab === 'users' ? 'user' : tab === 'department' ? 'department' : 'company';

        const payload: AssignmentPayload = {
            template_version: versionId,
            target_type,
            start_date: startDate,
            end_date: endDate ?? null,
            period,
            anonymity,
            include_system_metrics: includeMetrics,
        };

        if (target_type === 'user') payload.target_users = selectedUserIds;
        if (target_type === 'department') payload.target_department = selectedDepartmentId ?? null;

        return payload;
    };

    const handleCreate = async () => {
        const payload = validateAndBuildPayload();
        if (!payload) return;
        EvaluationServices.createAssignment(payload)
            .then(() => {
                toast.success('Assignment successfull.', { duration: 4000 });
            })
            .catch((e) => {
                toast.error(e.message || 'Unkown Error');
            });
        onClose();
    };

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-4 px-4 ">
            <div className="absolute inset-0 bg-black/40" onClick={onClose} />
            <div className="relative h-[36rem] w-full max-w-3xl bg-white rounded-lg shadow-2xl z-50 overflow-auto">
                {/* Header */}
                <div className="flex items-center justify-between px-5 py-4 border-b">
                    <div className="flex items-center gap-3">
                        <Layers className="w-5 h-5 text-indigo-600" />
                        <div>
                            <div className="text-base font-semibold">Create Assignment</div>
                            <div className="text-sm text-slate-500">Version 1 • First One</div>
                        </div>
                    </div>
                    <button className="p-2 rounded hover:bg-slate-100" onClick={onClose}>
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="flex">
                    <div className="w-full p-5">
                        {/* Tabs */}
                        <div className="flex gap-3 mb-6 justify-evenly">
                            <button
                                onClick={() => setTab('users')}
                                className={`flex gap-2 items-center px-3 py-2 rounded-lg border ${tab === 'users' ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-slate-700'}`}
                            >
                                <Users className="w-4 h-4" />
                                Specific Users
                            </button>
                            <button
                                onClick={() => setTab('department')}
                                className={`flex gap-2 items-center px-3 py-2 rounded-lg border ${tab === 'department' ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-slate-700'}`}
                            >
                                <Home className="w-4 h-4" />
                                Department
                            </button>
                            <button
                                onClick={() => handleChooseCompany()}
                                className={`flex gap-2 items-center px-3 py-2 rounded-lg border ${tab === 'company' ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-slate-700'}`}
                            >
                                <Layers className="w-4 h-4" />
                                Company-wide
                            </button>
                        </div>

                        {/* Search + list or department selector */}
                        <div>
                            {tab === 'users' && (
                                <div>
                                    <label className="text-xs text-slate-500">Select Target Users to Evaluate</label>

                                    <div className="mt-2 flex items-center gap-2">
                                        <div className="relative flex-1">
                                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                                            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search employees..." className="w-full pl-10 pr-3 py-2 border rounded-md" />
                                        </div>
                                        <div className="text-sm text-slate-500">
                                            Selected: <span className="font-medium">{selectedCount} employees</span>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Department tab: render only department selector */}
                            {tab === 'department' && (
                                <div className="mt-4">
                                    <label className="text-xs text-slate-500">Choose Department (this will select all employees in that department)</label>
                                    <select
                                        className="w-full mt-2 p-2 border rounded"
                                        value={selectedDepartmentId ?? ''}
                                        onChange={(e) => {
                                            const v = e.target.value === '' ? null : Number(e.target.value);
                                            handleSelectDepartment(v);
                                        }}
                                    >
                                        <option value="">-- select department --</option>
                                        {groups.map((d) => (
                                            <option key={d.department_id ?? -1} value={d.department_id ?? ''}>
                                                {d.department_name} ({d.employee_count})
                                            </option>
                                        ))}
                                    </select>

                                    <div className="mt-3 text-xs text-slate-500">
                                        {selectedDepartmentId
                                            ? `Selected department will include ${groups.find((g) => g.department_id === selectedDepartmentId)?.employee_count ?? 0} employees.`
                                            : 'No department selected.'}
                                    </div>
                                </div>
                            )}

                            {/* Company tab: no list */}
                            {tab === 'company' && (
                                <div className="mt-4 p-3 border rounded bg-slate-50">
                                    <div className="text-sm text-slate-700">This assignment will be sent company-wide.</div>
                                    <div className="text-xs text-slate-500 mt-1">{totalEmployees} total employees</div>
                                </div>
                            )}

                            {/* Users tab: show grouped expandable list */}
                            {tab === 'users' && (
                                <div className="mt-3 h-48 overflow-y-auto border rounded-md p-2 bg-white">
                                    {loading && <div className="text-sm text-slate-400 p-4">Loading employees...</div>}
                                    {!loading && filteredGroups.length === 0 && <div className="text-sm text-slate-400 p-4">No employees found.</div>}

                                    {!loading &&
                                        filteredGroups.map((dept) => {
                                            const deptKey = dept.department_id ?? -1;
                                            const expanded = !!expandedDepts[dept.department_id ?? -1];
                                            return (
                                                <div key={deptKey} className="mb-2">
                                                    <div className="flex items-center justify-between px-2 py-1 bg-slate-50 rounded">
                                                        <div className="flex items-center gap-3">
                                                            <button onClick={() => handleToggleDepartmentExpansion(dept.department_id)} className="p-1 rounded hover:bg-slate-100">
                                                                {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                                                            </button>
                                                            <div>
                                                                <div className="text-sm font-medium">{dept.department_name}</div>
                                                                <div className="text-xs text-slate-400">{dept.employee_count} employees</div>
                                                            </div>
                                                        </div>

                                                        <div className="flex items-center gap-3">
                                                            {/* department select radio (in users tab this selects department as a convenience) */}
                                                            <label className="inline-flex items-center gap-2 text-sm cursor-pointer">
                                                                <input
                                                                    type="radio"
                                                                    name="dept-select"
                                                                    checked={selectedDepartmentId === dept.department_id}
                                                                    onChange={() => {
                                                                        // in users tab, selecting department radio will auto-select all users in that department
                                                                        handleSelectDepartment(dept.department_id);
                                                                    }}
                                                                />
                                                                <span className="text-xs text-slate-600">Select</span>
                                                            </label>
                                                        </div>
                                                    </div>

                                                    {expanded && (
                                                        <div className="pl-10 pt-2 pb-1">
                                                            {dept.employees.length === 0 && <div className="text-xs text-slate-400">No matching users.</div>}
                                                            {dept.employees.map((e) => {
                                                                const disabled = false; // you can add logic to mark not-authorized users
                                                                const checked = e.user_id ? selectedUserIds.includes(e.user_id) : false;
                                                                return (
                                                                    <div key={e.allusers_id} className="flex items-center justify-between py-2 border-b last:border-b-0">
                                                                        <div className="flex items-center gap-3">
                                                                            <div className="w-9 h-9 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 text-sm font-medium">
                                                                                {e.full_name
                                                                                    .split(' ')
                                                                                    .slice(0, 2)
                                                                                    .map((n) => n[0])
                                                                                    .join('')}
                                                                            </div>
                                                                            <div>
                                                                                <div className="text-sm">{e.full_name}</div>
                                                                                <div className="text-xs text-slate-400">{e.email}</div>
                                                                            </div>
                                                                        </div>

                                                                        <div className="flex items-center gap-3">
                                                                            {disabled && <div className="text-xs text-red-500">Not authorized</div>}
                                                                            <label className="inline-flex items-center gap-2">
                                                                                <input type="checkbox" checked={checked} onChange={() => handleToggleUser(e)} disabled={disabled || !e.user_id} />
                                                                            </label>
                                                                        </div>
                                                                    </div>
                                                                );
                                                            })}
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })}
                                </div>
                            )}

                            {/* Dates / options */}
                            <div className="mt-4 grid grid-cols-2 gap-3">
                                <div>
                                    <label className="text-xs text-slate-500">Start Date</label>
                                    <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="w-full mt-1 p-2 border rounded" />
                                </div>
                                <div>
                                    <label className="text-xs text-slate-500">End Date (Optional)</label>
                                    <input type="date" value={endDate ?? ''} onChange={(e) => setEndDate(e.target.value || null)} className="w-full mt-1 p-2 border rounded" />
                                </div>
                            </div>

                            <div className="mt-3 w-full flex items-start flex-col gap-3">
                                {/* Toggle: Anonymous Responses */}
                                <div className="flex items-center justify-between w-full">
                                    <div>
                                        <label className="text-xs text-slate-500">Anonymous Responses</label>
                                        <div className="text-xs text-slate-400">Individual responses cannot be traced back to respondents</div>
                                    </div>
                                    <div>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input type="checkbox" className="sr-only peer" checked={anonymity} onChange={() => setAnonymity((s) => !s)} />
                                            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:bg-indigo-600 relative">
                                                <span className={`absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform ${anonymity ? 'translate-x-5' : 'translate-x-0'}`} />
                                            </div>
                                        </label>
                                    </div>
                                </div>

                                {/* Toggle: Include System Metrics */}
                                <div className="flex items-center justify-between w-full">
                                    <div>
                                        <label className="text-xs text-slate-500">Include System Metrics</label>
                                        <div className="text-xs text-slate-400">Include objective performance data alongside evaluation</div>
                                    </div>
                                    <div>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input type="checkbox" className="sr-only peer" checked={includeMetrics} onChange={() => setIncludeMetrics((s) => !s)} />
                                            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:bg-indigo-600 relative">
                                                <span className={`absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform ${includeMetrics ? 'translate-x-5' : 'translate-x-0'}`} />
                                            </div>
                                        </label>
                                    </div>
                                </div>

                                <div className="flex-1 w-full">
                                    <label className="text-xs text-slate-500">Recurrence Period</label>
                                    <select className="w-full mt-1 p-2 border rounded" value={period} onChange={(e) => setPeriod(e.target.value as any)}>
                                        {periodOptions.map((p) => (
                                            <option key={p.key} value={p.key}>
                                                {p.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* Right: summary */}
                            <div className="w-full border rounded-xl p-5 mt-8">
                                <div className="mb-6">
                                    <div className="text-lg font-semibold">Assignment Summary</div>
                                </div>

                                <div className="space-y-3 text-sm">
                                    <div className="flex justify-between">
                                        <div className="text-slate-600">Form Type</div>
                                        <div className="font-medium text-slate-800">self</div>
                                    </div>
                                    <div className="flex justify-between">
                                        <div className="text-slate-600">Target</div>
                                        <div className="font-medium text-slate-800">{tab === 'users' ? 'User' : tab === 'department' ? 'Department' : 'Company'}</div>
                                    </div>
                                    <div className="flex justify-between">
                                        <div className="text-slate-600">Recipients</div>
                                        <div className="font-medium text-slate-800">{tab === 'company' ? `${totalEmployees} employees` : `${selectedCount} employees`}</div>
                                    </div>
                                    <div className="flex justify-between">
                                        <div className="text-slate-600">Questions</div>
                                        <div className="font-medium text-slate-800">5</div>
                                    </div>
                                    <div className="flex justify-between">
                                        <div className="text-slate-600">Anonymous</div>
                                        <div className="font-medium text-slate-800">{anonymity ? 'Yes' : 'No'}</div>
                                    </div>
                                </div>

                                <div className="mt-10">
                                    {error && <div className="text-sm text-red-600 mb-3">{error}</div>}

                                    <div className="flex flex-col gap-3 ">
                                        <button onClick={handleCreate} className="flex-1 px-4 py-2 bg-indigo-700 text-white rounded">
                                            Create Assignment
                                        </button>
                                        <button onClick={onClose} className="flex-1 px-4 py-2 border rounded text-slate-700">
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AssignmentPopup;
