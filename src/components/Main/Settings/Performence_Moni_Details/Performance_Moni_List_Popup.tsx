import { useState, useEffect, Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import IconX from '../../../Icon/IconX';
import IconCaretDown from '../../../Icon/IconCaretDown';
import Swal from 'sweetalert2';
import SettingServices from '../../../../services/SettingServices';

export interface PMFormData {
    id?: number;
    start_date: string; // "YYYY-MM-DD"
    end_date: string; // "YYYY-MM-DD"
    session_type: 'monthly' | 'quarterly' | 'yearly' | string;
}

interface Props {
    initialData?: PMFormData;
    closeModal: (isError: boolean) => void;
}

export default function Performance_Moni_List_Popup({ initialData, closeModal }: Props) {
    // initialize from initialData or blanks
    const [params, setParams] = useState<PMFormData>({
        start_date: '',
        end_date: '',
        session_type: '',
    });

    // when initialData arrives, seed the form
    useEffect(() => {
        if (initialData) {
            setParams(initialData);
        }
    }, [initialData]);

    const isEdit = Boolean(initialData && initialData.id != null);

    const changeValue = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { id, value } = e.target;
        setParams((p) => ({ ...p, [id]: value as any }));
    };

    const Submit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (isEdit) {
                // update existing
                await SettingServices.UpdatePM(params.id!, params);
                Swal.fire('Success', 'Performance Monitoring Year updated', 'success');
            } else {
                // create new
                await SettingServices.AddPM(params);
                Swal.fire('Success', 'Performance Monitoring Year created', 'success');
            }
            closeModal(false);
        } catch (err) {
            Swal.fire('Error', `Failed to ${isEdit ? 'update' : 'create'}`, 'error');
            closeModal(true);
        }
    };

    return (
        <Transition appear show as={Fragment}>
            <Dialog as="div" className="relative z-[51]" onClose={() => closeModal(false)}>
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
                                <button type="button" onClick={() => closeModal(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-800 dark:hover:text-gray-600">
                                    <IconX />
                                </button>
                                <div className="text-lg font-medium bg-[#fbfbfb] dark:bg-[#121c2c] px-5 py-3">{isEdit ? 'Edit Performance Monitoring' : 'Create Performance Monitoring'}</div>
                                <div className="p-5">
                                    <form onSubmit={Submit}>
                                        {/* Start */}
                                        <div className="mb-5">
                                            <label htmlFor="start_date">Start Date</label>
                                            <input id="start_date" type="date" className="form-input" value={params.start_date} onChange={changeValue} required />
                                        </div>

                                        {/* End */}
                                        <div className="mb-5">
                                            <label htmlFor="end_date">End Date</label>
                                            <input id="end_date" type="date" className="form-input" value={params.end_date} onChange={changeValue} required />
                                        </div>

                                        {/* Session */}
                                        <div className="mb-5">
                                            <label htmlFor="session_type">Performance Monitoring Session</label>
                                            <div className="relative">
                                                <select id="session_type" className="form-input appearance-none pr-10" value={params.session_type} onChange={changeValue} required>
                                                    <option value="" disabled>
                                                        — select —
                                                    </option>
                                                    <option value="monthly">Monthly</option>
                                                    <option value="quarterly">Quarterly</option>
                                                    <option value="yearly">Yearly</option>
                                                </select>
                                                <IconCaretDown className="absolute top-1/2 right-2 transform -translate-y-1/2 pointer-events-none" />
                                            </div>
                                        </div>

                                        {/* Buttons */}
                                        <div className="flex justify-end items-center mt-8 space-x-4">
                                            <button type="button" className="btn btn-outline-danger" onClick={() => closeModal(false)}>
                                                Cancel
                                            </button>
                                            <button type="submit" className="btn btn-primary">
                                                {isEdit ? 'Update' : 'Create'}
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
