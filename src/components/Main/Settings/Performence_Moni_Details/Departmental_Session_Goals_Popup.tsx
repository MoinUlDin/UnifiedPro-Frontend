import { useState, Fragment, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import IconX from '../../../Icon/IconX';
import { useSelector } from 'react-redux';
import DepartmentGoalServices from '../../../../services/DepartmentGoalServices';
import SessionalGoalServices from '../../../../services/SessionalGoalServices';
import { SessionalGoalType } from '../../../../constantTypes/Types';

export interface EditedData {
    id?: number | null;
    department_goals: string;
    goal_text: string;
    session: string;
    target: string;
    weight: string;
}
export interface Props {
    closeModel: () => void;
    onSubmit: (data: EditedData) => void;
    initialData?: SessionalGoalType | null;
    isEditing: boolean;
}
interface departmentGoalType {
    id: string;
    goal_text: string;
}
interface AllowedSessionType {
    key: '2025-04';
    label: 'April 2025';
}

const Departmental_session_Goals_Popup = ({ closeModel, onSubmit, initialData, isEditing = false }: Props) => {
    const [departmentsGoals, setDepartmentsGoals] = useState<departmentGoalType[]>([]);
    const [allowedSessions, setAllowedSessions] = useState<AllowedSessionType[]>([]);
    const [rWeight, setrWeight] = useState<number>(100);
    const [rwError, setRwError] = useState<string | null>(null);
    const [params, setParams] = useState<EditedData>({
        department_goals: '',
        session: '',
        goal_text: '',
        target: '',
        weight: '',
    });

    // track validation errors
    const [errors, setErrors] = useState<Partial<Record<keyof EditedData, string>>>({});

    // initialize for editing
    useEffect(() => {
        if (initialData) {
            setParams({
                department_goals: String(initialData.department_goals.id),
                session: initialData.session,
                goal_text: initialData.goal_text,
                target: String(initialData.target),
                weight: String(initialData.weight),
            });
        }
    }, [initialData]);

    // fetch options
    useEffect(() => {
        DepartmentGoalServices.FetchGoals()
            .then((r) => setDepartmentsGoals(r.map((g: any) => ({ id: String(g.id), goal_text: g.goal_text }))))
            .catch(console.error);
    }, []);

    const changeValue = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement | HTMLTextAreaElement>) => {
        const { id, value } = e.target;
        setParams((p) => ({ ...p, [id]: value }));
        // clear error on change
        setErrors((err) => ({ ...err, [id]: undefined }));
    };
    const fetchAllwoedSessions = () => {
        SessionalGoalServices.FetchAllowedSessions()
            .then((r) => {
                setAllowedSessions(r);
            })
            .catch((e) => {
                console.log(e);
            });
    };
    useEffect(() => {
        fetchAllwoedSessions();
    }, []);

    // remaining weight Logic
    const initialWeight = initialData?.weight || 0;
    useEffect(() => {
        if (!params.session) return;
        console.log('session Changed:', params.session);

        SessionalGoalServices.FetchRemainingWeight({ session: params.session })
            .then((r) => {
                setrWeight(r.remaining_weight);
            })
            .catch((e) => {
                console.log(e);
            });
        setParams((prev) => ({ ...prev, weight: String(initialWeight) }));
    }, [params.session]);
    // seting error if weight is > then remaning weight
    useEffect(() => {
        if (Number(params.weight) > rWeight + initialWeight) {
            setRwError(`Allowed remaining weight: ${rWeight + initialWeight}`);
        } else {
            setRwError(null);
        }
    }, [params.weight]);

    const validate = (): boolean => {
        const errs: typeof errors = {};
        if (!params.department_goals) errs.department_goals = 'Please select a department goal.';
        if (!params.goal_text.trim()) errs.goal_text = 'Goal text is required.';
        if (!params.session) errs.session = 'Please select a session.';
        if (!params.target) errs.target = 'Target is required.';
        else if (Number(params.target) <= 0) errs.target = 'Target must be > 0.';
        if (!params.weight) errs.weight = 'Weight is required.';
        else if (Number(params.weight) <= 0) errs.weight = 'Weight must be > 0.';
        setErrors(errs);
        return Object.keys(errs).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;
        onSubmit({
            ...params,
            department_goals: Number(params.department_goals).toString(),
            target: params.target,
            weight: params.weight,
        });
        closeModel();
    };

    // form is valid if no errors and all fields nonempty
    const isFormValid = Object.values(params).every((v) => v !== '') && Number(params.target) > 0 && Number(params.weight) > 0;

    return (
        <Transition appear show as={Fragment}>
            <Dialog as="div" className="relative z-50" onClose={closeModel}>
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
                            <Dialog.Panel className="bg-white dark:bg-gray-800 rounded-lg shadow-lg w-full max-w-xl p-6 relative">
                                <button type="button" onClick={closeModel} className="absolute top-4 right-4 text-gray-500 hover:text-gray-800">
                                    <IconX />
                                </button>
                                <h2 className="text-xl font-semibold mb-4">{isEditing ? 'Update Departmental Session Goal' : 'Create Departmental Session Goal'}</h2>

                                <form onSubmit={handleSubmit} noValidate>
                                    {/* Department Goal */}
                                    <div className="mb-4">
                                        <label htmlFor="department_goals" className="block mb-1">
                                            Department Goal
                                        </label>
                                        <select id="department_goals" value={params.department_goals} onChange={changeValue} className="form-input w-full">
                                            <option value="" disabled>
                                                ---Select Goal---
                                            </option>
                                            {departmentsGoals.map((gg) => (
                                                <option key={gg.id} value={gg.id}>
                                                    {gg.goal_text}
                                                </option>
                                            ))}
                                        </select>
                                        {errors.department_goals && <p className="mt-1 text-sm text-red-600">{errors.department_goals}</p>}
                                    </div>

                                    {/* Session */}
                                    <div className="mb-6">
                                        <label htmlFor="session" className="block mb-1">
                                            Session
                                        </label>
                                        <select id="session" value={params.session} onChange={changeValue} className="form-input w-full">
                                            <option value="" disabled>
                                                ---Select Session---
                                            </option>
                                            {allowedSessions &&
                                                allowedSessions.map((item) => (
                                                    <option key={item.key} value={item.key}>
                                                        {item.label}
                                                    </option>
                                                ))}
                                        </select>
                                        {errors.session && <p className="mt-1 text-sm text-red-600">{errors.session}</p>}
                                    </div>

                                    {/* Goal Text */}
                                    <div className="mb-4">
                                        <label htmlFor="goal_text" className="block mb-1">
                                            Goal Text
                                        </label>
                                        <textarea id="goal_text" value={params.goal_text} onChange={changeValue} className="form-input w-full" rows={3} />
                                        {errors.goal_text && <p className="mt-1 text-sm text-red-600">{errors.goal_text}</p>}
                                    </div>

                                    {/* Target & Weight */}
                                    <div className="flex gap-4 mb-4">
                                        <div className="flex-1">
                                            <label htmlFor="target" className="block mb-1">
                                                Target
                                            </label>
                                            <input id="target" type="number" value={params.target} onChange={changeValue} className="form-input w-full" />
                                            {errors.target && <p className="mt-1 text-sm text-red-600">{errors.target}</p>}
                                        </div>
                                        <div className="flex-1">
                                            <label htmlFor="weight" className="block mb-1">
                                                Weight
                                            </label>
                                            <input id="weight" type="number" value={params.weight} onChange={changeValue} className="form-input w-full" />
                                            {errors.weight && <p className="mt-1 text-sm text-red-600">{errors.weight}</p>}
                                            {rwError && <p className="mt-1 text-sm text-red-600">{rwError}</p>}
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex justify-end space-x-3">
                                        <button type="button" className="btn btn-outline-danger" onClick={closeModel}>
                                            Cancel
                                        </button>
                                        <button type="submit" className="btn btn-primary" disabled={!isFormValid}>
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

export default Departmental_session_Goals_Popup;
