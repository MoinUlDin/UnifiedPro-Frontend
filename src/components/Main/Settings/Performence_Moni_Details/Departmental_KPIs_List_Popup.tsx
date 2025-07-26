import { useState, Fragment, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import IconX from '../../../Icon/IconX';
import IconCaretDown from '../../../Icon/IconCaretDown';
import CompanyGoalServices from '../../../../services/CompanyGoalServices';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { resourceUsage } from 'process';
import { set } from 'date-fns';
import { AllGoalsType, DepartmentGoalType, SessionalGoalType, KeyResultType, KPIType } from '../../../../constantTypes/Types';
import { all } from 'axios';

interface SubmitDataType {
    key_result: string;
    kpi_text: string;
    target: string;
    weight: string;
}

export interface Props {
    closeModel: () => void;
    onSubmit: (data: SubmitDataType) => void;
    initialData?: KPIType | null;
    isEditing: boolean;
}

const Departmental_KPIs_List_Popup = ({ closeModel, onSubmit, initialData = null, isEditing = false }: Props) => {
    const allGoalsList: AllGoalsType = useSelector((s: any) => s.settings.allGoalsList || null);
    const [DG, setDG] = useState<DepartmentGoalType[]>(); // Department Goals
    const [SG, setSG] = useState<SessionalGoalType[]>(); // Sessional Goals
    const [KR, setKR] = useState<KeyResultType[]>(); // Key Results Goals
    const [SGF, setSGF] = useState<SessionalGoalType[]>(); // Sessional Goals Filltered
    const [KRF, setKRF] = useState<KeyResultType[]>(); // Key Results Goals Filltered

    const [params, setParams] = useState<any>({
        key_result: '',
        kpi_text: '',
        target: 0,
        weight: 0,
    });
    const dispatch = useDispatch();
    useEffect(() => {
        CompanyGoalServices.FetchAllGoalsInOneGo(dispatch).catch((e) => {
            console.log(e);
        });
    }, []);

    useEffect(() => {
        if (!allGoalsList) return;
        setDG(allGoalsList.department_goals);

        setSG(allGoalsList.session_goals);
        setKR(allGoalsList.key_results);
        setParams({
            ...params,
            department_goal: allGoalsList.department_goals[0].id,
            sessional_goal: allGoalsList.session_goals[0].id,
        });
    }, [allGoalsList]);

    const changeValue = (e: any) => {
        const { id, value } = e.target;

        // If you’re picking a department, clear session & key_result immediately
        if (id === 'department_goal') {
            setParams((p: any) => ({
                ...p,
                department_goal: value,
                sessional_goal: '',
                key_result: '',
            }));
            return;
        }

        // If you’re picking a session, clear key_result
        if (id === 'sessional_goal') {
            setParams((p: any) => ({
                ...p,
                sessional_goal: value,
                key_result: '',
            }));
            return;
        }

        // Otherwise just set the field
        setParams((p: any) => ({ ...p, [id]: value }));
    };
    useEffect(() => {
        if (params.department_goal) {
            setSGF(SG?.filter((s) => Number(s.department_goals.id) === Number(params.department_goal)) ?? []);
        } else {
            setSGF([]);
        }
    }, [params.department_goal, SG]);

    // Filter key‑results for the chosen session
    useEffect(() => {
        if (params.sessional_goal) {
            setKRF(KR?.filter((k) => k.departmental_session_goal.id === Number(params.sessional_goal)) ?? []);
        } else {
            setKRF([]);
        }
    }, [params.sessional_goal, KR]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(params);
        closeModel();
    };

    useEffect(() => {
        if (!isEditing || !initialData) return;
        setParams((p: any) => ({
            ...p,
            department_goal: String(initialData.department_goal.id),
            sessional_goal: String(initialData.sessional_goal.id),
            key_result: String(initialData.key_result.id),
            kpi_text: initialData.kpi_text,
            target: initialData.target,
            weight: initialData.weight,
        }));
    }, [isEditing, initialData]);
    return (
        <Transition appear show={true} as={Fragment}>
            <Dialog as="div" open={true} onClose={closeModel} className="relative z-[51]">
                <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
                    <div className="fixed inset-0 bg-[black]/60" />
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
                                <button type="button" onClick={closeModel} className="absolute top-4 ltr:right-4 rtl:left-4 text-gray-400 hover:text-gray-800 dark:hover:text-gray-600 outline-none">
                                    <IconX />
                                </button>
                                <h1 className="text-lg font-medium bg-[#fbfbfb] dark:bg-[#121c2c] ltr:pl-5 rtl:pr-5 py-3 ltr:pr-[50px] rtl:pl-[50px]">
                                    {isEditing ? 'Update Departmental KPI' : 'Create Departmental KPI'}
                                </h1>
                                <div className="p-5">
                                    <form onSubmit={handleSubmit}>
                                        <div className="mb-5">
                                            <label htmlFor="department_goal">Department Goal</label>
                                            <div className="relative">
                                                <select id="department_goal" className="form-input appearance-none pr-10" value={params.department_goal} onChange={(e) => changeValue(e)}>
                                                    <option value="" disabled>
                                                        --------
                                                    </option>
                                                    {DG?.map((item: DepartmentGoalType) => (
                                                        <option key={`DG-${item.id}`} value={item.id}>
                                                            {item.goal_text}{' '}
                                                        </option>
                                                    ))}
                                                </select>
                                                <i className="bi bi-chevron-down absolute top-1/2 right-2 transform -translate-y-1/2 pointer-events-none"></i>
                                            </div>
                                        </div>

                                        <div className="mb-5 w-full">
                                            <label htmlFor="sessional_goal">Department Session Goal</label>
                                            <div className="relative">
                                                <select id="sessional_goal" className="form-input appearance-none pr-10" value={params.sessional_goal} onChange={(e) => changeValue(e)}>
                                                    <option value="" disabled>
                                                        --------
                                                    </option>
                                                    {SGF?.map((ssg: SessionalGoalType) => (
                                                        <option key={`SG-${ssg.id}`} value={ssg.id}>
                                                            {ssg.goal_text}
                                                        </option>
                                                    ))}
                                                </select>
                                                <i className="bi bi-chevron-down absolute top-1/2 right-2 transform -translate-y-1/2 pointer-events-none"></i>
                                            </div>
                                        </div>

                                        <div className="mb-5 w-full">
                                            <label htmlFor="key_result">Select Key Result</label>
                                            <div className="relative">
                                                <select id="key_result" className="form-input appearance-none pr-10" value={params.key_result} onChange={(e) => changeValue(e)}>
                                                    <option value="" disabled>
                                                        --------
                                                    </option>
                                                    {KRF?.map((item: KeyResultType) => (
                                                        <option key={`KR-${item.id}`} value={item.id}>
                                                            {item.key_results_text}
                                                        </option>
                                                    ))}
                                                </select>
                                                <i className="bi bi-chevron-down absolute top-1/2 right-2 transform -translate-y-1/2 pointer-events-none"></i>
                                            </div>
                                        </div>

                                        <div className="mb-5">
                                            <label htmlFor="kpi_text">KPI Text</label>
                                            <textarea id="kpi_text" placeholder="" className="form-input" value={params.kpi_text} onChange={(e) => changeValue(e)} />
                                        </div>
                                        <div className="flex gap-4">
                                            <div className="mb-5 w-[48%]">
                                                <label htmlFor="target">KPI Target</label>
                                                <input id="target" type="text" placeholder="" className="form-input" value={params.target} onChange={(e) => changeValue(e)} />
                                            </div>
                                            <div className="mb-5 w-[48%]">
                                                <label htmlFor="weight">Weight</label>
                                                <input id="weight" type="text" placeholder="" className="form-input" value={params.weight} onChange={(e) => changeValue(e)} />
                                            </div>
                                        </div>

                                        <div className="flex justify-end items-center mt-8">
                                            <button type="button" className="btn btn-outline-danger" onClick={closeModel}>
                                                Cancel
                                            </button>
                                            <button type="submit" className="btn btn-primary ltr:ml-4 rtl:mr-4">
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
};

export default Departmental_KPIs_List_Popup;
