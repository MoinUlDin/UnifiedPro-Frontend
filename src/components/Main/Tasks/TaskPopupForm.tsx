import React, { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import toast from 'react-hot-toast';
import TaskServices from '../../../services/TaskServices';
import { AllGoalsType, DepartmentGoalType, SessionalGoalType, KeyResultType, KPIType } from '../../../constantTypes/Types';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import CompanyGoalServices from '../../../services/CompanyGoalServices';

const priorities = ['low', 'medium', 'high'];
const frequencies = ['at_once', 'daily', 'weekly', 'monthly'];

export interface Props {
    closeModel: () => void;
    onSubmit: (data: any) => void;
    initialData?: any | null;
    isEditing: boolean;
}
const TaskPopupForm = ({ initialData = null, isEditing = false, onSubmit, closeModel }: Props) => {
    const allGoalsList: AllGoalsType = useSelector((s: any) => s.settings.allGoalsList || null);
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
            priority: 'medium',
            frequency: 'at_once',
            start_date: new Date().toISOString().slice(0, 16),
            task_file: null,
            ...initialData,
        },
    });

    const [departments, setDepartments] = useState<DepartmentGoalType[]>([]);
    const [sessionGoals, setSessionGoals] = useState<SessionalGoalType[]>([]);
    const [keyResults, setKeyResults] = useState<KeyResultType[]>([]);
    const [kpis, setKpis] = useState<KPIType[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    const selectedDepartment = watch('department_goal');
    const selectedSessionGoal = watch('departmental_session_goal');
    const selectedKeyResult = watch('key_result');

    const [filteredSessionGoals, setFilteredSessionGoals] = useState<SessionalGoalType[]>([]);
    const [filteredKeyResults, setFilteredKeyResults] = useState<KeyResultType[]>([]);
    const [filteredKpis, setFilteredKpis] = useState<KPIType[]>([]);
    const [loadingInitial, setLoadingInitail] = useState<boolean>(false);

    const dispatch = useDispatch();
    useEffect(() => {
        setLoading(true);
        CompanyGoalServices.FetchAllGoalsInOneGo(dispatch)
            .catch((e) => {
                console.log(e);
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);
    useEffect(() => {
        if (!allGoalsList) return;
        setLoading(true);
        console.log('All Goals: ', allGoalsList);
        setDepartments(allGoalsList.department_goals);
        setSessionGoals(allGoalsList.session_goals);
        setKeyResults(allGoalsList.key_results);
        setKpis(allGoalsList.kpis);
        setLoading(false);
    }, [allGoalsList]);

    // Filtering  Key Results when SessionalGaol  slected
    useEffect(() => {
        if (loadingInitial && initialData) return; // guard when laoding initail data
        if (!selectedSessionGoal) {
            setFilteredKeyResults([]);
            return;
        }
        const filtered = keyResults.filter((kr) => Number(kr.departmental_session_goal.id) === Number(selectedSessionGoal));
        setFilteredKeyResults(filtered);

        setValue('key_result', '');
        setValue('department_kpi', '');
    }, [selectedSessionGoal, keyResults]);

    // Filtering KPIs when Key Result slected
    useEffect(() => {
        if (loadingInitial) return; // guard when laoding initail data
        if (!selectedKeyResult) {
            setFilteredKpis([]);
            return;
        }
        const filtered = kpis.filter((k) => Number(k.key_result.id) === Number(selectedKeyResult));
        setFilteredKpis(filtered);
        setValue('department_kpi', '');
    }, [selectedKeyResult, kpis]);

    const handleFormSubmit = (data: any) => {
        const formData = new FormData();
        formData.append('priority', data.priority);
        formData.append('frequency', data.frequency);
        formData.append('start_date', data.start_date);
        formData.append('department_goal', data.department_goal);
        formData.append('departmental_session_goal', data.departmental_session_goal);
        formData.append('key_result', data.key_result);
        formData.append('department_kpi', data.department_kpi);
        formData.append('task_name', data.task_name);
        formData.append('weight', String(data.weight));
        formData.append('due_date', data.due_date);
        formData.append('instructions', data.instructions || '');

        // 2) FileList → single file
        const files: FileList = data.task_file;
        if (files && files.length > 0) {
            console.log('adding File now');
            formData.append('task_file', files[0]);
        }

        // Debug: inspect your FormData
        // for (let [key, val] of formData.entries()) {
        //   console.log(key, val);
        // }

        onSubmit(formData);
        reset();
        closeModel();
    };

    // Filtering  SessionalGaols when Department goal slected
    useEffect(() => {
        if (loadingInitial) return; // guard when laoding initail data
        if (!selectedDepartment) {
            setFilteredSessionGoals([]);
            return;
        }
        const filtered = sessionGoals.filter((sg) => Number(sg.department_goals.id) === Number(selectedDepartment));
        setFilteredSessionGoals(filtered);
        setValue('departmental_session_goal', '');
        setValue('key_result', '');
        setValue('department_kpi', '');
    }, [selectedDepartment, sessionGoals]);

    // loading initail Data. keep this at the end. Moin you know that order does matter.
    // because the state upate is done in bulk the guard class don't work if you put it on top of oter filtering logics
    useEffect(() => {
        if (loading || !initialData || !departments || !allGoalsList || !sessionGoals) return;
        setLoadingInitail(true);

        setValue('department_goal', initialData?.department_goal?.id);
        // sessional Goals
        const sgf = sessionGoals.filter((sg) => Number(sg.department_goals.id) === Number(initialData.department_goal?.id));
        setFilteredSessionGoals(sgf);
        setValue('departmental_session_goal', initialData.departmental_session_goal?.id);
        // Key Results
        const krf = keyResults.filter((kr) => Number(kr.departmental_session_goal.id) === Number(initialData.departmental_session_goal.id));
        setFilteredKeyResults(krf);
        setValue('key_result', initialData.key_result?.id);
        // KPIs
        const kpi = kpis.filter((k) => Number(k.key_result.id) === Number(initialData.key_result.id));
        setFilteredKpis(kpi);
        setValue('department_kpi', initialData.department_kpi?.id);

        setValue('frequency', initialData.frequency);
        setValue('frequency', initialData.frequency);

        setValue('start_date', initialData.start_date);
        setValue('due_date', initialData.due_date);

        setValue('task_file', null);
        setLoadingInitail(false);
    }, [loading, initialData, departments, keyResults, allGoalsList, kpis, sessionGoals]);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30 overflow-y-auto">
            {loading && (
                <div className="bg-black bg-opacity-30 absolute flex items-center h-full justify-center w-full z-50">
                    <span className="bg-white size-36 flex items-center justify-center text-3xl rounded-full animate-bounce">Loading...</span>
                </div>
            )}
            <div className="bg-white rounded-lg p-6 w-full max-w-4xl shadow-xl overflow-y-auto max-h-[90vh]">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold mb-4">{isEditing ? 'Edit Task' : 'Create Task'}</h2>
                    <button onClick={closeModel} className="btn btn-sm btn-danger">
                        Close
                    </button>
                </div>
                <form onSubmit={handleSubmit(handleFormSubmit)} className="grid relative grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label>Department</label>
                        <select {...register('department_goal', { required: true })} className="form-select">
                            <option value="">Select Department</option>
                            {departments.map((dep) => (
                                <option key={`DG-${dep.id}`} value={dep.id}>
                                    {dep.goal_text}
                                </option>
                            ))}
                        </select>
                        {errors.department_goal && <p className="text-red-500 text-sm">Department is required</p>}
                    </div>

                    <div>
                        <label>Session Goal</label>
                        <select {...register('departmental_session_goal', { required: true })} className="form-select">
                            <option value="">Select Session Goal</option>
                            {filteredSessionGoals.map((goal) => (
                                <option key={`SG-${goal.id}`} value={goal.id}>
                                    {goal.goal_text}
                                </option>
                            ))}
                        </select>
                        {errors.departmental_session_goal && <p className="text-red-500 text-sm">Session Goal is required</p>}
                    </div>

                    <div>
                        <label>Key Result</label>
                        <select {...register('key_result', { required: true })} className="form-select">
                            <option value="">Select Key Result</option>
                            {filteredKeyResults.map((kr) => (
                                <option key={`KR-${kr.id}`} value={kr.id}>
                                    {kr.key_results_text}
                                </option>
                            ))}
                        </select>
                        {errors.key_result && <p className="text-red-500 text-sm">Key Result is required</p>}
                    </div>

                    <div>
                        <label>KPI</label>
                        <select {...register('department_kpi', { required: true })} className="form-select">
                            <option value="">Select KPI</option>
                            {filteredKpis.map((kpi) => (
                                <option key={`KPI-${kpi.id}`} value={kpi.id}>
                                    {kpi.kpi_text}
                                </option>
                            ))}
                        </select>
                        {errors.department_kpi && <p className="text-red-500 text-sm">KPI is required</p>}
                    </div>

                    <div>
                        <label>Task Name</label>
                        <input type="text" {...register('task_name', { required: true })} className="form-input" />
                        {errors.task_name && <p className="text-red-500 text-sm">Task Name is required</p>}
                    </div>

                    <div>
                        <label>Weight</label>
                        <input type="number" {...register('weight', { required: true })} className="form-input" />
                        {errors.weight && <p className="text-red-500 text-sm">Weight is required</p>}
                    </div>

                    <div>
                        <label>Priority</label>
                        <select {...register('priority')} className="form-select">
                            {priorities.map((p) => (
                                <option key={p} value={p}>
                                    {p}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label>Frequency</label>
                        <select {...register('frequency')} className="form-select">
                            {frequencies.map((f) => (
                                <option key={f} value={f}>
                                    {f}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label>Start Date</label>
                        <input type="datetime-local" {...register('start_date')} className="form-input" />
                    </div>

                    <div>
                        <label>Due Date</label>
                        <input type="datetime-local" {...register('due_date', { required: true })} className="form-input" />
                        {errors.due_date && <p className="text-red-500 text-sm">Due Date is required</p>}
                    </div>

                    <div className="md:col-span-2">
                        <label>Instructions</label>
                        <textarea {...register('instructions')} className="form-textarea w-full"></textarea>
                    </div>

                    <div className="md:col-span-2">
                        <label>Attach File</label>
                        <Controller
                            name="task_file"
                            control={control}
                            render={({ field }) => (
                                <input
                                    type="file"
                                    onChange={(e) => {
                                        // field.onChange *will* register the FileList
                                        field.onChange(e.target.files);
                                    }}
                                    className="form-input"
                                />
                            )}
                        />
                    </div>

                    <div className="md:col-span-2 flex justify-end gap-4 mt-4">
                        <button type="button" onClick={closeModel} className="btn btn-secondary">
                            Cancel
                        </button>
                        <button type="submit" className="btn btn-primary">
                            {isEditing ? 'Update' : 'Create'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default TaskPopupForm;
