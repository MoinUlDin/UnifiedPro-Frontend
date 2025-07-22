import { useState, Fragment, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import IconX from '../../../Icon/IconX';
import DepartmentGoalServices from '../../../../services/DepartmentGoalServices';
import SessionalGoalServices from '../../../../services/SessionalGoalServices';

export interface EditedData {
    departmental_session_goal: { id: number; name: string };
    key_results_text: string;
    target: number | null;
    weight: number | null;
    department_goal: { id: number; goal_text: string };
}

export interface Props {
    closeModel: () => void;
    onSubmit: (data: KRtype) => void;
    initialData?: EditedData; // include dept id for init
    isEditing: boolean;
}

interface Dept {
    id: number;
    name: string;
}
interface Sess {
    id: number;
    name: string;
}
interface KRtype {
    department_goal_id?: number | null;
    departmental_session_goal: number | null;
    key_results_text: string;
    target: number;
    weight: number;
}

const Key_Results_List_Popup = ({ closeModel, onSubmit, initialData, isEditing }: Props) => {
    const [departments, setDepartments] = useState<Dept[]>([]);
    const [sessions, setSessions] = useState<Sess[]>([]);
    const [params, setParams] = useState<KRtype>({
        department_goal_id: null,
        departmental_session_goal: null,
        key_results_text: '',
        target: 0,
        weight: 0,
    });
    const [errors, setErrors] = useState<{
        department_goal_id?: string;
        departmental_session_goal?: string;
        key_results_text?: string;
        target?: string;
        weight?: string;
    }>({});

    // load all departments
    useEffect(() => {
        DepartmentGoalServices.FetchGoals()
            .then((r) => setDepartments(r.map((d: any) => ({ id: d.id, name: d.goal_text }))))
            .catch(console.error);
    }, []);

    // on edit, populate fields and load its sessions
    useEffect(() => {
        if (!initialData || !sessions) return;

        setParams({
            department_goal_id: initialData.department_goal.id,
            departmental_session_goal: initialData.departmental_session_goal.id,
            key_results_text: initialData.key_results_text,
            target: initialData.target!,
            weight: initialData.weight!,
        });
    }, [initialData, sessions]);

    // when department changes, fetch its sessional goals
    useEffect(() => {
        if (params.department_goal_id == null) {
            setSessions([]);
            setParams((p) => ({ ...p, departmental_session_goal: null }));
            return;
        }
        DepartmentGoalServices.FetchChildGoals(params.department_goal_id)
            .then((r: any) => setSessions(r.map((s: any) => ({ id: s.id, name: s.goal_text }))))
            .catch(console.error);
    }, [params.department_goal_id]);

    const changeValue = (e: any) => {
        const { id, value } = e.target;
        setParams((p) => ({ ...p, [id]: value }));
        // 2) Clear any existing error on that field
        setErrors((err) => ({
            ...err,
            [id]: undefined,
        }));
    };

    const validate = () => {
        const errs: typeof errors = {};
        if (!params.department_goal_id) errs.department_goal_id = 'Department is required.';
        if (!params.departmental_session_goal) errs.departmental_session_goal = 'Sessional goal is required.';
        if (!params.key_results_text.trim()) errs.key_results_text = 'Key result text is required.';
        else if (params.key_results_text.trim().length < 4) errs.key_results_text = 'Must be at least 4 characters.';
        if (!params.target) errs.target = 'Target is required.';
        else if (+params.target <= 0) errs.target = 'Must be greater than 0.';
        if (!params.weight) errs.weight = 'Weight is required.';
        else if (+params.weight <= 0) errs.weight = 'Must be greater than 0.';
        setErrors(errs);
        return Object.keys(errs).length === 0;
    };
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;
        onSubmit({
            departmental_session_goal: params.departmental_session_goal!,
            key_results_text: params.key_results_text.trim(),
            target: Number(params.target),
            weight: Number(params.weight),
        });
        closeModel();
    };

    return (
        <Transition appear show as={Fragment}>
            <Dialog onClose={closeModel} className="relative z-50">
                <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
                    <div className="fixed inset-0 bg-black/60" />
                </Transition.Child>
                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <Dialog.Panel className="bg-white rounded-lg shadow-lg w-full max-w-lg p-6 relative">
                                <button type="button" onClick={closeModel} className="absolute top-4 right-4 text-gray-500 hover:text-gray-800">
                                    <IconX />
                                </button>
                                <h2 className="text-xl font-semibold mb-4">{isEditing ? 'Edit Key Result' : 'Create Key Result'}</h2>
                                <form onSubmit={handleSubmit} noValidate>
                                    {/* 1) Department Goal */}
                                    <div className="mb-4">
                                        <label htmlFor="department_goal_id" className="block mb-1">
                                            Department Goal
                                        </label>
                                        <select id="department_goal_id" value={params.department_goal_id ?? ''} onChange={changeValue} className="form-input w-full" required>
                                            <option value="" disabled>
                                                -- Select Department --
                                            </option>
                                            {departments.map((d) => (
                                                <option key={d.id} value={d.id}>
                                                    {d.name}
                                                </option>
                                            ))}
                                        </select>
                                        {errors.department_goal_id && <p className="mt-1 text-sm text-red-600">{errors.department_goal_id}</p>}
                                    </div>

                                    {/* 2) Session Goal (dependent) */}
                                    <div className="mb-4">
                                        <label htmlFor="departmental_session_goal" className="block mb-1">
                                            Sessional Goal
                                        </label>
                                        <select id="departmental_session_goal" value={params.departmental_session_goal ?? ''} onChange={changeValue} className="form-input w-full" required>
                                            <option value="" disabled>
                                                -- Select Session Goal --
                                            </option>
                                            {sessions.map((s) => (
                                                <option key={s.id} value={s.id}>
                                                    {s.name}
                                                </option>
                                            ))}
                                        </select>
                                        {errors.departmental_session_goal && <p className="mt-1 text-sm text-red-600">{errors.departmental_session_goal}</p>}
                                    </div>

                                    {/* 3) Key Result Text */}
                                    <div className="mb-4">
                                        <label htmlFor="key_results_text" className="block mb-1">
                                            Key Result Text
                                        </label>
                                        <textarea id="key_results_text" value={params.key_results_text} onChange={changeValue} className="form-input w-full" rows={3} required />
                                        {errors.key_results_text && <p className="mt-1 text-sm text-red-600">{errors.key_results_text}</p>}
                                    </div>

                                    {/* 4) Target & Weight */}
                                    <div className="flex gap-4 mb-6">
                                        <div className="flex-1">
                                            <label htmlFor="target" className="block mb-1">
                                                Target
                                            </label>
                                            <input id="target" type="number" value={params.target} onChange={changeValue} className="form-input w-full" required min={0} />
                                            {errors.target && <p className="mt-1 text-sm text-red-600">{errors.target}</p>}{' '}
                                        </div>
                                        <div className="flex-1">
                                            <label htmlFor="weight" className="block mb-1">
                                                Weight
                                            </label>
                                            <input id="weight" type="number" value={params.weight} onChange={changeValue} className="form-input w-full" required min={0} />
                                            {errors.weight && <p className="mt-1 text-sm text-red-600">{errors.weight}</p>}
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex justify-end space-x-3">
                                        <button type="button" className="btn btn-outline-danger" onClick={closeModel}>
                                            Cancel
                                        </button>
                                        <button type="submit" className="btn btn-primary">
                                            {isEditing ? 'Update' : 'Create'}
                                        </button>
                                    </div>
                                </form>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
};

export default Key_Results_List_Popup;
