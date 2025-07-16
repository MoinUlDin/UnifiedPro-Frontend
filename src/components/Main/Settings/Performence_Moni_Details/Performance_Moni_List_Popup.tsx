import { useState, Fragment, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import IconX from '../../../Icon/IconX';
import IconCaretDown from '../../../Icon/IconCaretDown';
import axios from 'axios';
import Swal from 'sweetalert2';
import SettingServices from '../../../../services/SettingServices';

const Performance_Moni_List_Popup = ({ closeModal }: { closeModal: (isError: boolean) => void }) => {
    const [params, setParams] = useState({
        start_date: '', // lowercase key
        due_date: '', // lowercase key
        session_type: '',
    });
    const changeValue = (e: any) => {
        const { value, id } = e.target;
        setParams({ ...params, [id]: value });
    };
    const Submit = async (e: any) => {
        e.preventDefault();
        try {
            let response = await SettingServices.AddPM(params);
            console.log(response.data);
            Swal.fire({
                title: 'Successfull',
                text: 'Performance Monitoring Year created',
                timer: 5000,
            });
            closeModal(false);
        } catch {
            Swal.fire({
                title: 'Error',
                text: 'Failed to create Performance Monitoring Year',
                timer: 10000,
            });
            closeModal(true);
        }
    };

    return (
        <Transition appear show={true} as={Fragment}>
            <Dialog as="div" open={true} onClose={closeModal} className="   relative z-[51]">
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
                                <button
                                    type="button"
                                    onClick={() => closeModal(false)}
                                    className="absolute top-4 ltr:right-4 rtl:left-4 text-gray-400 hover:text-gray-800 dark:hover:text-gray-600 outline-none"
                                >
                                    <IconX />
                                </button>
                                <div className="text-lg font-medium bg-[#fbfbfb] dark:bg-[#121c2c] ltr:pl-5 rtl:pr-5 py-3 ltr:pr-[50px] rtl:pl-[50px]">Create Performance Monitoring Year</div>
                                <div className="p-5">
                                    <form>
                                        <div className="mb-5">
                                            <label htmlFor="start_date">Start Date</label>
                                            <input id="start_date" type="date" className="form-input" value={params.start_date} onChange={(e) => changeValue(e)} />
                                        </div>
                                        <div className="mb-5">
                                            <label htmlFor="end_date">End Date</label>
                                            <input id="due_date" type="date" className="form-input" value={params.due_date} onChange={(e) => changeValue(e)} />
                                        </div>

                                        <div className="mb-5 relative">
                                            <label htmlFor="session_type">Performance Monitoring Session</label>
                                            <div className="relative">
                                                <select id="session_type" className="form-input appearance-none pr-10" value={params.session_type} onChange={(e) => changeValue(e)}>
                                                    <option value="" disabled>
                                                        --------
                                                    </option>
                                                    <option value="monthly">Monthly</option>
                                                    <option value="quarterly">Quarterly</option>
                                                    <option value="yearly">Yearly</option>
                                                </select>
                                                <i className="bi bi-chevron-down absolute top-1/2 right-2 transform -translate-y-1/2 pointer-events-none"></i>
                                            </div>
                                        </div>
                                        <div className="flex justify-end items-center mt-8">
                                            <button type="button" className="btn btn-outline-danger" onClick={() => closeModal(false)}>
                                                Cancel
                                            </button>
                                            <button type="submit" onClick={Submit} className="btn btn-primary ltr:ml-4 rtl:mr-4">
                                                Create
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

export default Performance_Moni_List_Popup;
