import { useState, useEffect, Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import IconX from '../../../Icon/IconX';
import IconCaretDown from '../../../Icon/IconCaretDown';
import { Props, InputData } from '../../../../constantTypes/Types';
import CompanyGoalServices from '../../../../services/CompanyGoalServices';
import toast from 'react-hot-toast';

export default function Company_Goals_List_Popup({ closeModel, onSubmit, initialData = null, isEditing }: Props) {
    const [rW, setRW] = useState<number>(100);
    const [wError, setWError] = useState<string | null>(null);
    const [params, setParams] = useState<InputData>({
        goal_text: '',
        weight: 0,
    });

    useEffect(() => {
        CompanyGoalServices.FetchRemainingWeight()
            .then((r) => {
                console.log('remaining Weight is : ', r.remaining_weight);
                setRW(r.remaining_weight);
            })
            .catch((e) => {
                toast.error(e?.message || 'error fetching Remaining Weight ');
            });
        if (initialData) {
            setParams({
                id: initialData.id,
                goal_text: initialData.goal_text,
                weight: initialData.weight,
            });
        } else {
            setParams({ goal_text: '', weight: 0 });
        }
    }, [initialData]);

    // watch the numeric weight
    useEffect(() => {
        if (params.weight == null) {
            setWError(null);
            return;
        }
        console.log(`Expression: ${Number(params.weight)} > ${rW} `, Number(params.weight) > rW);
        if (Number(params.weight) > rW) {
            setWError(`Allowed remaining weight: ${rW}`);
        } else {
            setWError(null);
        }
    }, [params.weight, rW]);

    const changeValue = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        const { id, value } = e.target;
        setParams((p) => ({ ...p, [id]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault(); // <— prevent reload
        onSubmit(params); // send data back
        closeModel(); // close popup
    };

    return (
        <Transition appear show={true} as={Fragment}>
            <Dialog as="div" className="relative z-[51]" open={true} onClose={closeModel}>
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

                                <div className="text-lg font-medium bg-[#fbfbfb] px-5 py-3">{isEditing ? 'Edit Company Goal' : 'Create Company Goal'}</div>

                                <div className="p-5">
                                    <form onSubmit={handleSubmit}>
                                        <div className="mb-5">
                                            <label htmlFor="goal_text">Goal Text</label>
                                            <textarea id="goal_text" className="form-input" value={params.goal_text} onChange={changeValue} required />
                                        </div>

                                        <div className="mb-5">
                                            <label htmlFor="weight">Weight</label>
                                            <input id="weight" type="text" className="form-input" value={params.weight} onChange={changeValue} required />
                                            {wError && <p className="text-[12px] text-red-500 mt-1">{wError}</p>}
                                        </div>

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
