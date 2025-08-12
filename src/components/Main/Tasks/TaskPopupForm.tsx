// TaskPopupForm.tsx
import React, { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import toast from 'react-hot-toast';
import { UserPlus, ChevronDown, ChevronUp, Paperclip, X } from 'lucide-react';
import TaskServices from '../../../services/TaskServices';
import CompanyGoalServices from '../../../services/CompanyGoalServices';
import { useSelector, useDispatch } from 'react-redux';
import { AllGoalsType, DepartmentGoalType, SessionalGoalType, KeyResultType, KPIType } from '../../../constantTypes/Types';
import EmployeeServices from '../../../services/EmployeeServices';

const priorities = ['low', 'medium', 'high'];
const frequencies = ['at_once', 'daily', 'weekly', 'monthly'];

export interface Props {
    closeModel: () => void;
    onSubmit: (data: any) => void;
    initialData?: any | null;
    isEditing?: boolean;
}

const TaskPopupForm = ({ initialData = null, isEditing = false, onSubmit, closeModel }: Props) => {
    const allGoalsList: AllGoalsType = useSelector((s: any) => s.settings?.allGoalsList || null);
    const employees = useSelector((s: any) => s.employee?.employeesList || []); // adjust selector to your store shape
    const dispatch = useDispatch();

    const {
        register,
        handleSubmit,
        watch,
        setValue,
        reset,
        control,
        formState: { errors },
    } = useForm({
        defaultValues: {
            // order: Task Name, Weight, Priority, Frequency, Start Date, Due Date, Instructions, Attach File, assignee
            task_name: '',
            weight: 0,
            priority: 'medium',
            frequency: 'at_once',
            start_date: new Date().toISOString().slice(0, 16),
            due_date: '',
            instructions: '',
            task_file: null,
            assignee: '',

            // additional info (optional)
            department_goal: '',
            departmental_session_goal: '',
            key_result: '',
            department_kpi: '',
            ...initialData,
        },
    });

    const [departments, setDepartments] = useState<DepartmentGoalType[]>([]);
    const [sessionGoals, setSessionGoals] = useState<SessionalGoalType[]>([]);
    const [keyResults, setKeyResults] = useState<KeyResultType[]>([]);
    const [kpis, setKpis] = useState<KPIType[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [loadingInitial, setLoadingInitail] = useState<boolean>(false);

    const [showAdditional, setShowAdditional] = useState<boolean>(false);

    // filtered lists for dependent selects
    const selectedDepartment = watch('department_goal');
    const selectedSessionGoal = watch('departmental_session_goal');
    const selectedKeyResult = watch('key_result');

    const [filteredSessionGoals, setFilteredSessionGoals] = useState<SessionalGoalType[]>([]);
    const [filteredKeyResults, setFilteredKeyResults] = useState<KeyResultType[]>([]);
    const [filteredKpis, setFilteredKpis] = useState<KPIType[]>([]);

    // fetch all goals once
    useEffect(() => {
        setLoading(true);
        CompanyGoalServices.FetchAllGoalsInOneGo(dispatch)
            .catch((e) => console.log(e))
            .finally(() => setLoading(false));
    }, []);
    useEffect(() => {
        EmployeeServices.FetchEmployees(dispatch)
            .then((r) => {
                console.log('Employees: ', r);
            })
            .catch((e) => {
                console.log(e);
            });
    }, []);

    useEffect(() => {
        if (!allGoalsList) return;
        setDepartments(allGoalsList.department_goals || []);
        setSessionGoals(allGoalsList.session_goals || []);
        setKeyResults(allGoalsList.key_results || []);
        setKpis(allGoalsList.kpis || []);
    }, [allGoalsList]);

    // filters
    useEffect(() => {
        if (!selectedDepartment) {
            setFilteredSessionGoals([]);
            setValue('departmental_session_goal', '');
            return;
        }
        const filtered = sessionGoals.filter((sg) => Number(sg.department_goals.id) === Number(selectedDepartment));
        setFilteredSessionGoals(filtered);
        setValue('departmental_session_goal', '');
        setValue('key_result', '');
        setValue('department_kpi', '');
    }, [selectedDepartment, sessionGoals, setValue]);

    useEffect(() => {
        if (!selectedSessionGoal) {
            setFilteredKeyResults([]);
            setValue('key_result', '');
            return;
        }
        const filtered = keyResults.filter((kr) => Number(kr.departmental_session_goal.id) === Number(selectedSessionGoal));
        setFilteredKeyResults(filtered);
        setValue('key_result', '');
        setValue('department_kpi', '');
    }, [selectedSessionGoal, keyResults, setValue]);

    useEffect(() => {
        if (!selectedKeyResult) {
            setFilteredKpis([]);
            setValue('department_kpi', '');
            return;
        }
        const filtered = kpis.filter((k) => Number(k.key_result.id) === Number(selectedKeyResult));
        setFilteredKpis(filtered);
        setValue('department_kpi', '');
    }, [selectedKeyResult, kpis, setValue]);

    // prefill initial data (kept at end to ensure dependent filters are ready)
    useEffect(() => {
        if (!initialData) return;
        setLoadingInitail(true);

        // basic fields
        setValue('task_name', initialData.task_name ?? '');
        setValue('weight', initialData.weight ?? 0);
        setValue('priority', initialData.priority ?? 'medium');
        setValue('frequency', initialData.frequency ?? 'at_once');
        setValue('start_date', initialData.start_date ?? new Date().toISOString().slice(0, 16));
        setValue('due_date', initialData.due_date ?? '');
        setValue('instructions', initialData.instructions ?? '');
        setValue('assignee', initialData.assignee?.id ?? '');

        // additional info (optional)
        setValue('department_goal', initialData.department_goal?.id ?? '');
        const sgf = sessionGoals.filter((sg) => Number(sg.department_goals.id) === Number(initialData.department_goal?.id));
        setFilteredSessionGoals(sgf);
        setValue('departmental_session_goal', initialData.departmental_session_goal?.id ?? '');

        const krf = keyResults.filter((kr) => Number(kr.departmental_session_goal.id) === Number(initialData.departmental_session_goal?.id));
        setFilteredKeyResults(krf);
        setValue('key_result', initialData.key_result?.id ?? '');

        const kpi = kpis.filter((k) => Number(k.key_result.id) === Number(initialData.key_result?.id));
        setFilteredKpis(kpi);
        setValue('department_kpi', initialData.department_kpi?.id ?? '');

        setValue('task_file', null);
        setLoadingInitail(false);
    }, [initialData, setValue, sessionGoals, keyResults, kpis]);

    const handleFormSubmit = (data: any) => {
        const formData = new FormData();
        formData.append('task_name', data.task_name);
        formData.append('weight', String(data.weight ?? 0));
        formData.append('priority', data.priority);
        formData.append('frequency', data.frequency);
        if (data.start_date) formData.append('start_date', data.start_date);
        if (data.due_date) formData.append('due_date', data.due_date);
        formData.append('instructions', data.instructions ?? '');

        // Assignee (optional)
        if (data.assignee) formData.append('employee', data.assignee);

        // Additional Info (optional)
        if (data.department_goal) formData.append('department_goal', data.department_goal);
        if (data.departmental_session_goal) formData.append('departmental_session_goal', data.departmental_session_goal);
        if (data.key_result) formData.append('key_result', data.key_result);
        if (data.department_kpi) formData.append('department_kpi', data.department_kpi);

        // File
        const files: FileList = data.task_file;
        if (files && files.length > 0) {
            formData.append('task_file', files[0]);
        }

        console.log('Employee to submit', data.assignee);
        onSubmit(formData);
        reset();
        closeModel();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 overflow-y-auto p-4">
            <div className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl mt-3 h-screen overflow-auto">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-indigo-600 to-pink-500 text-white">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg bg-white/20 flex items-center justify-center text-lg font-semibold">
                            <UserPlus size={20} />
                        </div>
                        <div>
                            <div className="text-lg font-bold">{isEditing ? 'Edit Task' : 'Create Task'}</div>
                            <div className="text-sm opacity-90">Create and assign tasks quickly</div>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <button aria-label="Close" onClick={closeModel} className="p-2 rounded-md hover:bg-white/10 transition">
                            <X size={18} className="text-white" />
                        </button>
                    </div>
                </div>

                {/* Body */}
                <form onSubmit={handleSubmit(handleFormSubmit)} className="p-6 grid grid-cols-1 gap-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Task Name */}
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-slate-700 mb-1">Task Name</label>
                            <input type="text" {...register('task_name', { required: true })} className="form-input w-full" />
                            {errors.task_name && <p className="text-red-500 text-sm mt-1">Task Name is required</p>}
                        </div>

                        {/* Weight */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Weight</label>
                            <input type="number" {...register('weight', { required: true })} className="form-input w-full" />
                            {errors.weight && <p className="text-red-500 text-sm mt-1">Weight is required</p>}
                        </div>

                        {/* Priority */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Priority</label>
                            <select {...register('priority')} className="form-select w-full">
                                {priorities.map((p) => (
                                    <option key={p} value={p}>
                                        {p}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Frequency */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Frequency</label>
                            <select {...register('frequency')} className="form-select w-full">
                                {frequencies.map((f) => (
                                    <option key={f} value={f}>
                                        {f}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Start Date */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Start Date</label>
                            <input type="datetime-local" {...register('start_date')} className="form-input w-full" />
                        </div>

                        {/* Due Date */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Due Date</label>
                            <input type="datetime-local" {...register('due_date', { required: true })} className="form-input w-full" />
                            {errors.due_date && <p className="text-red-500 text-sm mt-1">Due Date is required</p>}
                        </div>

                        {/* Instructions */}
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-slate-700 mb-1">Instructions</label>
                            <textarea {...register('instructions')} className="form-textarea w-full" rows={4} />
                        </div>

                        {/* Attach File */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Attach File</label>
                            <Controller
                                name="task_file"
                                control={control}
                                render={({ field }) => (
                                    <div className="flex items-center gap-2">
                                        <input type="file" onChange={(e) => field.onChange(e.target.files)} className="form-input" />
                                        <Paperclip size={18} className="text-slate-500" />
                                    </div>
                                )}
                            />
                        </div>

                        {/* Assignee (optional, not in additional info) */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Assignee (optional)</label>
                            <select {...register('assignee')} className="form-select w-full">
                                <option value="">Unassigned</option>
                                {employees.map((emp: any) => (
                                    <option key={emp.id} value={emp.id}>
                                        {`${emp.first_name} ${emp.last_name} (${emp.department.name})`}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Additional Info toggle */}
                    <div className="mt-2">
                        <button type="button" onClick={() => setShowAdditional((s) => !s)} className="inline-flex items-center gap-2 text-sm font-medium text-indigo-600 hover:underline">
                            {showAdditional ? (
                                <>
                                    <ChevronUp size={16} /> Hide Additional Info
                                </>
                            ) : (
                                <>
                                    <ChevronDown size={16} /> Additional Info
                                </>
                            )}
                        </button>
                    </div>

                    {/* Additional Info - collapsible */}
                    <div className={`overflow-hidden transition-all duration-300 ${showAdditional ? 'max-h-[1000px] mt-3' : 'max-h-0'}`} aria-hidden={!showAdditional}>
                        <div className="p-4 bg-slate-50 rounded-lg border">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Department Goal (optional)</label>
                                    <select {...register('department_goal')} className="form-select w-full">
                                        <option value="">Select Department Goal</option>
                                        {departments.map((dep) => (
                                            <option key={`DG-${dep.id}`} value={dep.id}>
                                                {dep.goal_text}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Session Goal (optional)</label>
                                    <select {...register('departmental_session_goal')} className="form-select w-full">
                                        <option value="">Select Session Goal</option>
                                        {filteredSessionGoals.map((goal) => (
                                            <option key={`SG-${goal.id}`} value={goal.id}>
                                                {goal.goal_text}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Key Result (optional)</label>
                                    <select {...register('key_result')} className="form-select w-full">
                                        <option value="">Select Key Result</option>
                                        {filteredKeyResults.map((kr) => (
                                            <option key={`KR-${kr.id}`} value={kr.id}>
                                                {kr.key_results_text}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">KPI (optional)</label>
                                    <select {...register('department_kpi')} className="form-select w-full">
                                        <option value="">Select KPI</option>
                                        {filteredKpis.map((kpi) => (
                                            <option key={`KPI-${kpi.id}`} value={kpi.id}>
                                                {kpi.kpi_text}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-end gap-3 mt-4">
                        <button type="button" onClick={closeModel} className="px-4 py-2 rounded-md border hover:shadow-sm">
                            Cancel
                        </button>
                        <button type="submit" className="px-5 py-2 rounded-md bg-indigo-600 text-white font-semibold hover:bg-indigo-700 shadow">
                            {isEditing ? 'Update' : 'Create'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default TaskPopupForm;
