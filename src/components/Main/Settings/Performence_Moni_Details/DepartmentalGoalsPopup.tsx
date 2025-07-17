import { useState, useEffect, Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import IconX from '../../../Icon/IconX';
import IconCaretDown from '../../../Icon/IconCaretDown';
import { DepartmentGoalType, Props } from '../../../../constantTypes/Types';
import CompanyGoalServices from '../../../../services/CompanyGoalServices';
import SettingServices from '../../../../services/SettingServices';
import { useDispatch } from 'react-redux';

interface FormPayload {
    company_goal: number;
    department: number;
    goal_text: string;
    target: number;
    weight: number;
}

export default function DepartmentalGoalsPopup({ initialData, closeModel, onSubmit, isEditing }: Props) {
    // payload-shaped state
    const [loading, setloading] = useState<boolean>(false);
    const [companyGoals, setCompanyGoals] = useState<any>();
    const [departments, setDepartments] = useState<any>();
    const dispatch = useDispatch();
    const [payload, setPayload] = useState<FormPayload>({
        company_goal: 0,
        department: 0,
        goal_text: '',
        target: 0,
        weight: 0,
    });

    useEffect(() => {
        try {
            setloading(true);
            CompanyGoalServices.FetchGoals(dispatch).then((g) => {
                console.log('companyGaols: ', g);
                setCompanyGoals(g);
            });
            SettingServices.fetchDepartments(dispatch).then((d) => {
                console.log('Departments: ', d);
                setDepartments(d);
            });
        } catch (e) {
            console.log(e);
        } finally {
            setloading(false);
        }
    }, []);

    useEffect(() => {
        if (!departments || !companyGoals) return;
        setPayload({
            ...payload,
            company_goal: companyGoals[0].id,
            department: departments[0].id,
        });
    }, [departments, companyGoals]);

    // seed from initialData
    useEffect(() => {
        if (!initialData) return;
        // if initialData comes in DepartmentGoalType shape
        const d = initialData as DepartmentGoalType;
        setPayload({
            company_goal: d.company_goal.id,
            department: d.department.id,
            goal_text: d.goal_text,
            target: d.target,
            weight: d.weight,
        });
    }, [initialData]);

    const changeValue = (e: any) => {
        const { id, value } = e.target;
        setPayload(
            (p) =>
                ({
                    ...p,
                    // for number fields, parseInt
                    [id]: id === 'company_goal' || id === 'department' ? parseInt(value, 10) : id === 'target' || id === 'weight' ? Number(value) : value,
                } as any)
        );
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault(); // no reload
        console.log('sending Payload', payload);
        onSubmit(payload); // send to parent
        closeModel();
    };

    return (
        <Transition appear show as={Fragment}>
            <Dialog as="div" open onClose={closeModel} className="relative z-[51]">
                <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
                    <div className="fixed inset-0 bg-black/60" />
                </Transition.Child>

                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center px-4 py-8">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <Dialog.Panel className="panel border-0 p-0 rounded-lg overflow-hidden w-full max-w-xl text-black dark:text-white-dark">
                                <button type="button" onClick={closeModel} className="absolute top-4 right-4 text-gray-400 hover:text-gray-800">
                                    <IconX />
                                </button>

                                <h1 className="text-lg font-medium bg-[#fbfbfb] dark:bg-[#121c2c] px-5 py-3">{isEditing ? 'Update Department Goal' : 'Create Departmental Goal'}</h1>

                                <div className="p-5">
                                    <form onSubmit={handleSubmit}>
                                        {/* Department */}
                                        <div className="mb-5">
                                            <label htmlFor="department">Department</label>
                                            <div className="relative">
                                                <select id="department" className="form-input appearance-none pr-10" value={payload.department} onChange={changeValue} required>
                                                    <option value="" disabled>
                                                        —— select ——
                                                    </option>
                                                    {departments?.map((dd: any) => (
                                                        <option key={`D-${dd.id}`} value={dd.id}>
                                                            {dd.name}
                                                        </option>
                                                    ))}
                                                </select>
                                                <IconCaretDown className="absolute top-1/2 right-2 -translate-y-1/2 pointer-events-none" />
                                            </div>
                                        </div>

                                        {/* Company Goal */}
                                        <div className="mb-5">
                                            <label htmlFor="company_goal">Company Goal</label>
                                            <div className="relative">
                                                <select id="company_goal" className="form-input appearance-none pr-10" value={payload.company_goal} onChange={changeValue} required>
                                                    <option value="" disabled>
                                                        —— select ——
                                                    </option>
                                                    {companyGoals?.map((gg: any) => (
                                                        <option key={`Goal-${gg.id}`} className="block max-w-12 px-3" value={gg.id}>
                                                            {gg.goal_text}
                                                        </option>
                                                    ))}
                                                </select>
                                                <IconCaretDown className="absolute top-1/2 right-2 -translate-y-1/2 pointer-events-none" />
                                            </div>
                                        </div>

                                        {/* Goal Text */}
                                        <div className="mb-5">
                                            <label htmlFor="goal_text">Goal Text</label>
                                            <textarea id="goal_text" className="form-input" value={payload.goal_text} onChange={changeValue} required />
                                        </div>

                                        {/* Target & Weight */}
                                        <div className="flex gap-4">
                                            <div className="mb-5 w-[48%]">
                                                <label htmlFor="target">Target</label>
                                                <input id="target" type="number" className="form-input" value={payload.target} onChange={changeValue} required />
                                            </div>
                                            <div className="mb-5 w-[48%]">
                                                <label htmlFor="weight">Weight</label>
                                                <input id="weight" type="number" className="form-input" value={payload.weight} onChange={changeValue} required />
                                            </div>
                                        </div>

                                        {/* Actions */}
                                        <div className="flex justify-end items-center mt-8 space-x-4">
                                            <button type="button" className="btn btn-outline-danger" onClick={closeModel}>
                                                Cancel
                                            </button>
                                            <button type="submit" className="btn btn-primary">
                                                {isEditing ? 'Update' : 'Create'}
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
}
