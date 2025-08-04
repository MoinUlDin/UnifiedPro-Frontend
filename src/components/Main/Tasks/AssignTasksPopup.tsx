import React, { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import EmployeeServices from '../../../services/EmployeeServices';
import TaskServices from '../../../services/TaskServices';
import { EmployeeType } from '../../../constantTypes/Types';
import { TaskType } from '../../../constantTypes/TasksTypes';
import { MultiSelect } from '@mantine/core';
import toast from 'react-hot-toast';

interface AssignFormProps {
    initialData?: {
        employee: number;
        co_workers: number[];
        tasks: number[];
    };
    onSubmit: (payload: { employee: number; co_workers: number[]; tasks: number[] }) => void;
    onClose: () => void;
}

const AssignTasksPopup: React.FC<AssignFormProps> = ({ initialData = { employee: 0, co_workers: [], tasks: [] }, onSubmit, onClose }) => {
    const {
        register,
        handleSubmit,
        control,
        watch,
        setValue,
        formState: { errors },
    } = useForm({
        defaultValues: initialData,
    });

    const [employees, setEmployees] = useState<EmployeeType[]>([]);
    const [allTasks, setAllTasks] = useState<TaskType[]>([]);
    const [deptCoWorkers, setDeptCoWorkers] = useState<EmployeeType[]>([]);
    const [deptTasks, setDeptTasks] = useState<{ id: number; task_name: string; assigned_to: string }[]>([]);

    const selectedEmployee = watch('employee');
    const dispatch = useDispatch();

    // 1) Load all employees once
    useEffect(() => {
        EmployeeServices.FetchEmployees(dispatch)
            .then((users) => {
                setEmployees(users);
            })
            .catch(() => toast.error('Could not load employees'));

        // fetching all tasks
        TaskServices.FetchTasks()
            .then((tasks) => {
                setAllTasks(tasks);
                setValue('tasks', []);
            })
            .catch(() => toast.error('Could not load tasks'));
    }, [dispatch]);

    // 2) When employee changes, filter co‑workers and load tasks
    useEffect(() => {
        if (!selectedEmployee) {
            setDeptCoWorkers([]);
            setDeptTasks([]);
            return;
        }

        const emp = employees.find((e) => e.id === Number(selectedEmployee));
        if (!emp) return;

        // filter co-workers in same department (excluding the employee themself)
        const coworkers = employees.filter((u) => u.department.id === emp.department.id && u.id !== emp.id && !u.is_terminated);
        setDeptCoWorkers(coworkers);
        setValue('co_workers', []);

        const filteredTasks = allTasks.filter((t: TaskType) => t.department_id === emp.department.id);
        setDeptTasks(filteredTasks);
    }, [selectedEmployee, employees, setValue]);

    const submit = (data: any) => {
        onSubmit({
            employee: Number(data.employee),
            co_workers: (data.co_workers || []).map((v: string) => Number(v)),
            tasks: data.tasks.map((v: string) => Number(v)),
        });
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <h2 className="text-xl font-semibold mb-4">Assign Tasks</h2>
                <form onSubmit={handleSubmit(submit)} className="grid grid-cols-1 gap-4">
                    {/* Employee */}
                    <div>
                        <label className="block text-sm font-medium">Employee</label>
                        <select {...register('employee', { required: 'Employee is required' })} className="mt-1 block w-full form-select">
                            <option value="">Select employee</option>
                            {employees.map((emp) => (
                                <option key={emp.id} value={emp.id}>
                                    {emp.first_name} {emp.last_name} ({emp.department.name})
                                </option>
                            ))}
                        </select>
                        {errors.employee && <p className="text-red-500 text-sm">{errors.employee.message}</p>}
                    </div>

                    {/* Co‑Workers */}
                    <div>
                        <label className="block text-sm font-medium">Co‑Workers</label>
                        <Controller
                            control={control}
                            name="co_workers"
                            render={({ field }) => {
                                const { value, onChange, onBlur, name, ref } = field;
                                return (
                                    <select
                                        name={name}
                                        multiple
                                        ref={ref as any}
                                        value={(value as number[]).map((v) => String(v))} // 1) number[] → string[]
                                        onBlur={onBlur}
                                        onChange={(e) => {
                                            // 2) string[] → number[]
                                            const selectedNumbers = Array.from(e.target.selectedOptions).map((opt) => Number(opt.value));
                                            onChange(selectedNumbers);
                                        }}
                                        className="mt-1 block w-full form-multiselect h-32"
                                    >
                                        {deptCoWorkers.map((u) => (
                                            <option key={u.id} value={u.id}>
                                                {u.first_name} {u.last_name}
                                            </option>
                                        ))}
                                    </select>
                                );
                            }}
                        />
                        {selectedEmployee && <h4 className="text-[12px] text-end text-gray-800">Ctrl + Click to select multiple</h4>}
                    </div>

                    {/* Tasks */}
                    <div>
                        <label className="block text-sm font-medium">Tasks to Assign</label>
                        <Controller
                            name="tasks"
                            control={control}
                            rules={{ required: true }}
                            render={({ field }) => {
                                // field.value is number[]; map to string[] for Mantine
                                const valueStrings = (field.value || []).map(String);

                                return (
                                    <MultiSelect
                                        data={deptTasks.map((t) => ({
                                            value: String(t.id),
                                            label: t.task_name,
                                            // pass assignedTo along so we can render it in itemComponent
                                            assignedTo: t.assigned_to,
                                        }))}
                                        value={valueStrings}
                                        onChange={(vals) => {
                                            // Mantine gives you string[], turn into number[] and call RHF
                                            field.onChange(vals.map(Number));
                                        }}
                                        placeholder="Select tasks..."
                                        nothingFound="No tasks found"
                                        error={!!errors.tasks}
                                        itemComponent={({ value, label, assignedTo, ...others }) => (
                                            <div {...others} className="flex items-center gap-2 px-2 py-1 hover:cursor-pointer">
                                                <span>{label}</span>
                                                {assignedTo && <span className="bg-blue-400 text-white px-2 py-0.5 rounded text-xs">{assignedTo}</span>}
                                                {!assignedTo && <span className="bg-gray-600 text-white px-2 py-0.5 rounded text-xs">UnAssigned</span>}
                                            </div>
                                        )}
                                        // optional styling
                                        styles={{
                                            dropdown: { maxHeight: 300, overflowY: 'auto' },
                                            item: { whiteSpace: 'nowrap' },
                                        }}
                                    />
                                );
                            }}
                        />
                        {errors.tasks && <p className="text-red-500 text-sm">Please select at least one task</p>}
                    </div>

                    {/* Actions */}
                    <div className="flex justify-end gap-2 mt-4">
                        <button type="button" onClick={onClose} className="px-4 py-2 border rounded">
                            Cancel
                        </button>
                        <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded">
                            Assign
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AssignTasksPopup;
