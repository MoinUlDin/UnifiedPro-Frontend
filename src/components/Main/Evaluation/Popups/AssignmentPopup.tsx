// src/components/Evaluation/AssignmentPopup.tsx
// src/components/Evaluation/AssignmentPopup.tsx
import React, { useEffect, useMemo, useState } from 'react';
import { X, Users, Home, Layers, Search, ChevronDown, ChevronUp, Target, Info } from 'lucide-react';
import EvaluationServices from '../../../../services/EvaluationServices';
import toast from 'react-hot-toast';
import { type AssignmentOptionsResponse, type DepartmentGroup, type EmployeeItem, type Props, type AssignmentPayload } from '../../../../constantTypes/EvaluationTypes';

const periodOptions = [
    { key: 'one-off', label: 'One-time Assignment' },
    { key: 'monthly', label: 'Monthly' },
    { key: 'weekly', label: 'Weekly' },
    { key: 'quarterly', label: 'Quarterly' },
    { key: 'yearly', label: 'Yearly' },
];

const AssignmentPopup: React.FC<Props> = ({ versionId, open, initial = null, onClose, onSubmit, formType: parentFormType, qCount = 0 }) => {
    const [loading, setLoading] = useState(false);
    const [groups, setGroups] = useState<DepartmentGroup[]>([]);
    const [totalEmployees, setTotalEmployees] = useState<number>(0);
    const [search, setSearch] = useState<string>('');
    const [tab, setTab] = useState<'users' | 'department' | 'company'>('users');
    const [tab360, setTab360] = useState<number>(1);

    // form type: 'self' | 'manager' | '360' | 'employee_manager'
    const [formType, setFormType] = useState<string>(parentFormType ?? 'self');

    // selection state
    const [selectedUserIds, setSelectedUserIds] = useState<number[]>([]); // used mainly for respondent selection in 360 or specific users
    const [selectedDepartmentId, setSelectedDepartmentId] = useState<number | null>(null);

    // subject (single) for employee_manager / manager / 360
    const [selectedSubjectUserId, setSelectedSubjectUserId] = useState<number | null>(null);
    const [selectedSubjectAllUsersId, setSelectedSubjectAllUsersId] = useState<number | null>(null);
    const [derivedRespondentUserId, setDerivedRespondentUserId] = useState<number | null>(null);

    // form state
    const [startDate, setStartDate] = useState<string>('');
    const [endDate, setEndDate] = useState<string | null>(null);
    const [period, setPeriod] = useState<AssignmentPayload['period']>('one-off');
    const [includeMetrics, setIncludeMetrics] = useState<boolean>(true);

    // UI helpers
    const [expandedDepts, setExpandedDepts] = useState<Record<number, boolean>>({});

    // error
    const [error, setError] = useState<string | null>(null);

    // if parent provides a formType, keep state in sync
    useEffect(() => {
        if (parentFormType) setFormType(parentFormType);
    }, [parentFormType]);

    // load assignment options (grouped by department) on open or version change
    useEffect(() => {
        if (!open) return;
        let cancelled = false;
        setLoading(true);
        setError(null);

        EvaluationServices.assignmentOptions(Number(versionId))
            .then((res: AssignmentOptionsResponse) => {
                if (cancelled) return;
                if (res?.mode === 'grouped_by_department' || res?.mode === 'managers_grouped_by_department' || res?.mode === 'employee_manager') {
                    setGroups(res.departments || []);
                    setTotalEmployees(res.total_employees || 0);
                } else {
                    // fallback: if API changed, try to adapt
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

        // initial may include template info; don't overwrite formType if parent provided it
        if (!parentFormType && initial.target_type) {
            setTab(initial.target_type === 'user' ? 'users' : initial.target_type === 'department' ? 'department' : 'company');
        }
        if (initial.target_users && initial.target_users.length) {
            // if initial is an employee-manager or manager, target_users likely contain subject(s)
            setSelectedUserIds(initial.target_users.map((id: any) => Number(id)));
            // if exactly 1 subject, set selectedSubjectUserId
            if (Array.isArray(initial.target_users) && initial.target_users.length === 1) {
                setSelectedSubjectUserId(Number(initial.target_users[0]));
            }
        }
        if (initial.target_department) setSelectedDepartmentId(initial.target_department);
        if (initial.start_date) setStartDate(initial.start_date);
        if (initial.end_date) setEndDate(initial.end_date ?? null);
        if (initial.period) setPeriod(initial.period);
        if (typeof initial.include_system_metrics === 'boolean') setIncludeMetrics(initial.include_system_metrics);
    }, [initial, parentFormType]);

    // memoized filtered groups by search
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
            .filter((g) => g.employees.length > 0 || (g.department_name || '').toLowerCase().includes(term));
    }, [groups, search]);

    // selection helpers
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

    // When department selected (department tab or selecting dept radio), select all users in that dept
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

    // Subject selection helper (single select)
    const handleSelectSubject = (eItem: EmployeeItem) => {
        setSelectedSubjectUserId(eItem.user_id ?? null);
        setSelectedSubjectAllUsersId(eItem.allusers_id ?? null);
        // try derive respondent if available on employee item
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const asAny = eItem as any;
        if (asAny.manager_user_id) {
            setDerivedRespondentUserId(asAny.manager_user_id);
        } else if (asAny.manager_allusers_id) {
            setDerivedRespondentUserId(null);
        } else {
            setDerivedRespondentUserId(null);
        }
    };

    const validateAndBuildPayload = (): AssignmentPayload | null => {
        setError(null);
        if (!startDate) {
            setError('Start date is required.');
            return null;
        }

        // Build payload logic differs per formType
        // General payload base:
        const payloadBase: AssignmentPayload = {
            template_version: versionId,
            target_type: 'user', // we'll adjust below as needed
            start_date: startDate,
            end_date: endDate ?? null,
            period,
            include_system_metrics: includeMetrics,
        } as AssignmentPayload;

        if (formType === 'employee_manager') {
            // subject (manager) must be selected (single)
            if (!selectedSubjectUserId) {
                setError('Please select the manager (subject).');
                return null;
            }
            payloadBase.target_type = 'user';
            payloadBase.target_users = [selectedSubjectUserId];
            return payloadBase;
        }

        if (formType === 'manager') {
            if (!selectedSubjectUserId) {
                setError('Please select the subject (employee).');
                return null;
            }
            // create assignment targeted at the subject employee
            payloadBase.target_type = 'user';
            payloadBase.target_users = [selectedSubjectUserId];
            return payloadBase;
        }

        if (formType === '360') {
            // subject required
            if (!selectedSubjectUserId) {
                setError('Please select the subject (employee).');
                return null;
            }
            const built = { ...payloadBase };
            built.target_type = 'user';
            built.target_users = [selectedSubjectUserId];

            if (tab === 'users') {
                if (selectedUserIds.length === 0) {
                    setError('Please select at least one respondent (specific users).');
                    return null;
                }
                // @ts-ignore add ad-hoc key (backend must be updated to use this)
                (built as any).respondents = selectedUserIds;
                return built;
            }
            if (tab === 'department') {
                if (!selectedDepartmentId) {
                    setError('Please select a department for respondents.');
                    return null;
                }
                // @ts-ignore
                (built as any).respondent_department = selectedDepartmentId;
                return built;
            }
            if (tab === 'company') {
                // @ts-ignore
                (built as any).respondent_company_wide = true;
                return built;
            }
            return null;
        }

        // default 'self' behavior:
        if (tab === 'users') {
            if (selectedUserIds.length === 0) {
                setError('Please select at least one target user.');
                return null;
            }
            payloadBase.target_type = 'user';
            payloadBase.target_users = selectedUserIds;
            return payloadBase;
        }
        if (tab === 'department') {
            if (!selectedDepartmentId) {
                setError('Please select a target department.');
                return null;
            }
            payloadBase.target_type = 'department';
            payloadBase.target_department = selectedDepartmentId;
            // We keep target_users empty for department/company modes per your stated preference
            return payloadBase;
        }
        if (tab === 'company') {
            payloadBase.target_type = 'company';
            return payloadBase;
        }

        return null;
    };

    const handleCreate = async () => {
        const payload = validateAndBuildPayload();
        if (!payload) return;
        setLoading(true);
        try {
            await EvaluationServices.createAssignment(payload);
            toast.success('Assignment created', { duration: 4000 });
            onClose();
            if (onSubmit) {
                onSubmit(payload);
            }
        } catch (e: any) {
            console.error(e);
            toast.error(e.message || 'Failed to create assignment');
        } finally {
            setLoading(false);
        }
    };

    if (!open) return null;

    // small helper to render header text for formType
    const formTypeLabel = (() => {
        switch (formType) {
            case 'employee_manager':
                return 'Employee → Manager';
            case '360':
                return '360 Evaluation';
            case 'manager':
                return 'Manager Evaluation';
            default:
                return 'Self / Generic';
        }
    })();
    return (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-4 px-4 ">
            <div className="absolute inset-0 bg-black/40" onClick={onClose} />
            <div className="relative h-[36rem] w-full max-w-4xl bg-white rounded-lg shadow-2xl z-50 overflow-auto">
                {/* Header */}
                <div className="flex items-center justify-between px-5 py-4 border-b">
                    <div className="flex items-center gap-3">
                        <Layers className="w-5 h-5 text-indigo-600" />
                        <div>
                            <div className="text-base font-semibold">Create Assignment</div>
                            <div className="text-sm text-slate-500">
                                {formTypeLabel} • Version {versionId}
                            </div>
                        </div>
                    </div>
                    <button className="p-2 rounded hover:bg-slate-100" onClick={onClose}>
                        <X className="w-5 h-5" />
                    </button>
                </div>
                <div className="mx-5 mt-4 py-4 px-6 border rounded-xl bg-gray-200">
                    <div className="flex items-center gap-3 mb-3">
                        <Info className="text-yellow-800" size={18} />
                        <h1 className="font-bold">Assignment Mode</h1>
                    </div>
                    {formType === 'self' && <p>For self-evaluations, employees evaluate themselves. Select who should complete the evaluation.</p>}
                    {formType === 'manager' && <p>Select employees to be evaluated by their managers. Their direct managers will be automatically assigned as respondents.</p>}
                    {formType === '360' && <p>Select subjects (people being evaluated) and respondents (people providing feedback) separately for comprehensive 360° feedback.</p>}
                    {formType === 'employee_manager' && (
                        <p>This allows employees to provide anonymous feedback about their managers. Only owners or higher-level managers can create these assignments.</p>
                    )}
                </div>

                <div className="flex">
                    <div className="w-full p-5">
                        {/* Top controls change depending on formType */}
                        {formType === 'employee_manager' && (
                            <div className="mb-4">
                                <div className="text-sm font-medium mb-2">Select Subject (Manager)</div>
                                <div className="h-44 overflow-y-auto border rounded p-2">
                                    {loading && <div className="text-sm text-slate-400 p-4">Loading...</div>}
                                    {!loading && groups.length === 0 && <div className="text-sm text-slate-400 p-4">No managers found.</div>}
                                    {!loading &&
                                        groups.map((dept) => (
                                            <div key={dept.department_id ?? dept.department_name} className="mb-2">
                                                <div className="text-sm font-medium">
                                                    {dept.department_name} ({dept.employee_count})
                                                </div>
                                                <div className="pl-4 mt-2">
                                                    {dept.employees.map((e) => {
                                                        // managers endpoint returns managers grouped in `employees`
                                                        const checked = selectedSubjectUserId === e.user_id;
                                                        return (
                                                            <div key={e.allusers_id} className="flex items-center justify-between py-2 border-b last:border-b-0">
                                                                <div>
                                                                    <div className="text-sm">{e.full_name}</div>
                                                                    <div className="text-xs text-slate-400">{e.email}</div>
                                                                </div>
                                                                <div>
                                                                    <input type="radio" name="subject" checked={checked} onChange={() => handleSelectSubject(e)} />
                                                                </div>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        ))}
                                </div>
                            </div>
                        )}

                        {formType === 'manager' && (
                            <div className="mb-4">
                                <div className="text-sm font-medium mb-2">Select Subject (Employee)</div>
                                <div className="mt-2 flex items-center gap-2">
                                    <div className="relative flex-1">
                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                                        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search employees..." className="w-full pl-10 pr-3 py-2 border rounded-md" />
                                    </div>
                                </div>

                                <div className="mt-3 h-48 overflow-y-auto border rounded-md p-2">
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
                                                    </div>

                                                    {expanded && (
                                                        <div className="pl-10 pt-2 pb-1">
                                                            {dept.employees.map((e) => {
                                                                const checked = selectedSubjectUserId === e.user_id;
                                                                return (
                                                                    <div key={e.allusers_id} className="flex items-center justify-between py-2 border-b last:border-b-0">
                                                                        <div>
                                                                            <div className="text-sm">{e.full_name}</div>
                                                                            <div className="text-xs text-slate-400">{e.email}</div>
                                                                        </div>
                                                                        <div>
                                                                            <input type="radio" name="subject" checked={checked} onChange={() => handleSelectSubject(e)} />
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

                                <div className="mt-3 text-xs text-slate-500">
                                    {/* try to show derived respondent if possible */}
                                    {derivedRespondentUserId ? (
                                        <div>Derived respondent (manager) id: {derivedRespondentUserId} — this will be the respondent who evaluates the selected subject.</div>
                                    ) : (
                                        <div>
                                            If the system has manager info for this employee we will auto-assign the manager as responder. Otherwise, please ensure manager-level assignment flow is
                                            used.
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {formType === '360' && (
                            <div className="mb-4 gap-4 py-2">
                                <div className="flex items-center w-full p-1 gap-1 bg-gray-200 rounded-full mb-4">
                                    <button onClick={() => setTab360(1)} className={`flex gap-2 py-1 items-center justify-center flex-1 ${tab360 === 1 && 'bg-white'}  rounded-full`}>
                                        <Target size={16} />
                                        Subjects
                                    </button>
                                    <button onClick={() => setTab360(2)} className={`flex gap-2 py-1 items-center justify-center flex-1 ${tab360 === 2 && 'bg-white'} rounded-full`}>
                                        <Users size={16} />
                                        Respondents
                                    </button>
                                </div>
                                {tab360 === 1 && (
                                    <div>
                                        <div className="text-sm font-medium mb-2">Select Subject (Employee)</div>
                                        <div className="mt-2">
                                            <div className="relative">
                                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                                                <input
                                                    value={search}
                                                    onChange={(e) => setSearch(e.target.value)}
                                                    placeholder="Search employees..."
                                                    className="w-full pl-10 pr-3 py-2 border rounded-md"
                                                />
                                            </div>
                                            <div className="mt-3 h-40 overflow-y-auto border rounded p-2">
                                                {loading && <div className="text-sm text-slate-400 p-4">Loading...</div>}
                                                {!loading && filteredGroups.length === 0 && <div className="text-sm text-slate-400 p-4">No employees found.</div>}
                                                {!loading &&
                                                    filteredGroups.map((dept) => (
                                                        <div key={dept.department_id ?? dept.department_name} className="mb-2">
                                                            <div className="text-sm font-medium">{dept.department_name}</div>
                                                            <div className="pl-4 mt-2">
                                                                {dept.employees.map((e) => {
                                                                    const checked = selectedSubjectUserId === e.user_id;
                                                                    return (
                                                                        <div key={e.allusers_id} className="flex items-center justify-between py-1">
                                                                            <div>
                                                                                <div className="text-sm">{e.full_name}</div>
                                                                                <div className="text-xs text-slate-400">{e.email}</div>
                                                                            </div>
                                                                            <div>
                                                                                <input type="radio" name="subject360" checked={checked} onChange={() => handleSelectSubject(e)} />
                                                                            </div>
                                                                        </div>
                                                                    );
                                                                })}
                                                            </div>
                                                        </div>
                                                    ))}
                                            </div>
                                        </div>
                                    </div>
                                )}
                                {tab360 === 2 && (
                                    <div>
                                        <div className="text-sm font-medium mb-2">Select Respondents (who will answer about the subject)</div>

                                        <div className="flex gap-3 mb-3">
                                            <button
                                                onClick={() => setTab('users')}
                                                className={`flex gap-2 items-center px-3 py-2 rounded-lg border ${
                                                    tab === 'users' ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-slate-700'
                                                }`}
                                            >
                                                <Users className="w-4 h-4" />
                                                Specific Users
                                            </button>
                                            <button
                                                onClick={() => setTab('department')}
                                                className={`flex gap-2 items-center px-3 py-2 rounded-lg border ${
                                                    tab === 'department' ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-slate-700'
                                                }`}
                                            >
                                                <Home className="w-4 h-4" />
                                                Department
                                            </button>
                                            <button
                                                onClick={() => setTab('company')}
                                                className={`flex gap-2 items-center px-3 py-2 rounded-lg border ${
                                                    tab === 'company' ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-slate-700'
                                                }`}
                                            >
                                                <Layers className="w-4 h-4" />
                                                Company-wide
                                            </button>
                                        </div>

                                        {tab === 'users' && (
                                            <div className="h-40 overflow-y-auto border rounded p-2">
                                                {loading && <div className="text-sm text-slate-400 p-4">Loading...</div>}
                                                {!loading && filteredGroups.length === 0 && <div className="text-sm text-slate-400 p-4">No employees found.</div>}
                                                {!loading &&
                                                    filteredGroups.map((dept) => (
                                                        <div key={dept.department_id ?? dept.department_name} className="mb-2">
                                                            <div className="text-sm font-medium">{dept.department_name}</div>
                                                            <div className="pl-4 mt-2">
                                                                {dept.employees.map((e) => {
                                                                    const checked = e.user_id ? selectedUserIds.includes(e.user_id) : false;
                                                                    return (
                                                                        <div key={e.allusers_id} className="flex items-center justify-between py-1">
                                                                            <div>
                                                                                <div className="text-sm">{e.full_name}</div>
                                                                                <div className="text-xs text-slate-400">{e.email}</div>
                                                                            </div>
                                                                            <div>
                                                                                <input type="checkbox" checked={checked} onChange={() => handleToggleUser(e)} />
                                                                            </div>
                                                                        </div>
                                                                    );
                                                                })}
                                                            </div>
                                                        </div>
                                                    ))}
                                            </div>
                                        )}

                                        {tab === 'department' && (
                                            <div>
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
                                                <div className="text-xs text-slate-500 mt-2">Selecting department will include all employees from that department as respondents.</div>
                                            </div>
                                        )}

                                        {tab === 'company' && (
                                            <div className="p-3 border rounded bg-slate-50">
                                                <div className="text-sm">This will include company-wide respondents</div>
                                                <div className="text-xs text-slate-500 mt-1">{totalEmployees} total employees</div>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        )}

                        {formType === 'self' && (
                            <>
                                {/* tabs (Specific users / department / company) */}
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
                                        className={`flex gap-2 items-center px-3 py-2 rounded-lg border ${
                                            tab === 'department' ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-slate-700'
                                        }`}
                                    >
                                        <Home className="w-4 h-4" />
                                        Department
                                    </button>
                                    <button
                                        onClick={() => handleChooseCompany()}
                                        className={`flex gap-2 items-center px-3 py-2 rounded-lg border ${
                                            tab === 'company' ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-slate-700'
                                        }`}
                                    >
                                        <Layers className="w-4 h-4" />
                                        Company-wide
                                    </button>
                                </div>

                                {/* Search + list */}
                                {tab === 'users' && (
                                    <>
                                        <div className="mt-2 flex items-center gap-2">
                                            <div className="relative flex-1">
                                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                                                <input
                                                    value={search}
                                                    onChange={(e) => setSearch(e.target.value)}
                                                    placeholder="Search employees..."
                                                    className="w-full pl-10 pr-3 py-2 border rounded-md"
                                                />
                                            </div>
                                            <div className="text-sm text-slate-500">
                                                Selected: <span className="font-medium">{selectedCount} employees</span>
                                            </div>
                                        </div>

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
                                                                    <label className="inline-flex items-center gap-2 text-sm cursor-pointer">
                                                                        <input
                                                                            type="radio"
                                                                            name="dept-select"
                                                                            checked={selectedDepartmentId === dept.department_id}
                                                                            onChange={() => {
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
                                                                        const disabled = false;
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
                                                                                        <input
                                                                                            type="checkbox"
                                                                                            checked={checked}
                                                                                            onChange={() => handleToggleUser(e)}
                                                                                            disabled={disabled || !e.user_id}
                                                                                        />
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
                                    </>
                                )}

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

                                {tab === 'company' && (
                                    <div className="mt-4 p-3 border rounded bg-slate-50">
                                        <div className="text-sm text-slate-700">This assignment will be sent company-wide.</div>
                                        <div className="text-xs text-slate-500 mt-1">{totalEmployees} total employees</div>
                                    </div>
                                )}
                            </>
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

                        {formType === 'manager' && (
                            <div className="mt-3 w-full flex items-start flex-col gap-3">
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
                        )}

                        {/* Right: summary */}
                        <div className="w-full border rounded-xl p-5 mt-8">
                            <div className="mb-6">
                                <div className="text-lg font-semibold">Assignment Summary</div>
                            </div>

                            <div className="space-y-3 text-sm">
                                <div className="flex justify-between">
                                    <div className="text-slate-600">Form Type</div>
                                    <div className="font-medium text-slate-800">{formTypeLabel}</div>
                                </div>
                                <div className="flex justify-between">
                                    <div className="text-slate-600">Target</div>
                                    <div className="font-medium text-slate-800">
                                        {formType === 'employee_manager' ? 'Manager (subject)' : tab === 'users' ? 'User' : tab === 'department' ? 'Department' : 'Company'}
                                    </div>
                                </div>
                                <div className="flex justify-between">
                                    <div className="text-slate-600">Recipients</div>
                                    <div className="font-medium text-slate-800">
                                        {formType === 'employee_manager'
                                            ? selectedSubjectUserId
                                                ? 'Team of selected manager'
                                                : '—'
                                            : tab === 'company'
                                            ? `${totalEmployees} employees`
                                            : `${selectedCount || (selectedSubjectUserId ? 1 : 0)} employees`}
                                    </div>
                                </div>
                                <div className="flex justify-between">
                                    <div className="text-slate-600">Questions</div>
                                    <div className="font-medium text-slate-800">{qCount}</div>
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
    );
};

export default AssignmentPopup;
