import { useState, Fragment, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
// import { useDispatch } from 'react-redux';
// import { setPageTitle } from '../../store/themeConfigSlice';
// import IconUserPlus from '../../components/Icon/IconUserPlus';
import IconX from '../../../Icon/IconX';
import IconCaretDown from '../../../Icon/IconCaretDown';
// import Edit from '../../../pages/Apps/Invoice/Edit';
// import Job_Type from './Job_Type';

const Company_Goals_List_Popup = ({ closeModal }: { closeModal: () => void }) => {
    const [params, setParams] = useState({
        Performance_Monitoring_Year: '',
        Goal_Text: '',
        Target: '',
        Weight: '',

        // email: '',
        // password: '',
        // confirm_password: '',
        // department: '',
        // assign_designation: '',
        // report_to: '',
        // hire_date: '',
        // employee_id: '',
    });

    const changeValue = (e: any) => {
        const { value, id } = e.target;
        setParams({ ...params, [id]: value });
    };

    return (
        <Transition appear show={true} as={Fragment}>
            <Dialog as="div" open={true} onClose={closeModal} className="relative z-[51]">
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
                                <button type="button" onClick={closeModal} className="absolute top-4 ltr:right-4 rtl:left-4 text-gray-400 hover:text-gray-800 dark:hover:text-gray-600 outline-none">
                                    <IconX />
                                </button>
                                <div className="text-lg font-medium bg-[#fbfbfb] dark:bg-[#121c2c] ltr:pl-5 rtl:pr-5 py-3 ltr:pr-[50px] rtl:pl-[50px]">Create Company Goal</div>
                                <div className="p-5">
                                    <form>
                                        <div className="mb-5">
                                            <label htmlFor="Performance_Monitoring_Year">Performance Monitoring Year</label>
                                            <div className="relative">
                                                <select
                                                    id="Performance_Monitoring_Year"
                                                    className="form-input appearance-none pr-10"
                                                    value={params.Performance_Monitoring_Year}
                                                    onChange={(e) => changeValue(e)}
                                                >
                                                    <option value="" disabled>
                                                        --------
                                                    </option>
                                                    <option value="Session 1">2012</option>
                                                    <option value="Session 2">2023</option>
                                                    <option value="Session 3">2019</option>
                                                </select>
                                                <i className="bi bi-chevron-down absolute top-1/2 right-2 transform -translate-y-1/2 pointer-events-none"></i>
                                            </div>
                                        </div>
                                        <div className="mb-5">
                                            <label htmlFor="Goal_Text">Goal Text</label>
                                            <textarea id="Goal_Text" placeholder="" className="form-input" value={params.Goal_Text} onChange={(e) => changeValue(e)} />
                                        </div>
                                        <div className="mb-5">
                                            <label htmlFor="Target">Target</label>
                                            <input id="Target" type="text" placeholder="" className="form-input" value={params.Target} onChange={(e) => changeValue(e)} />
                                        </div>
                                        <div className="mb-5">
                                            <label htmlFor="Weight">Weight</label>
                                            <input id="Weight" type="text" placeholder="" className="form-input" value={params.Weight} onChange={(e) => changeValue(e)} />
                                        </div>

                                        <div className="flex justify-end items-center mt-8">
                                            <button type="button" className="btn btn-outline-danger" onClick={closeModal}>
                                                Cancel
                                            </button>
                                            <button type="submit" className="btn btn-primary ltr:ml-4 rtl:mr-4">
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

export default Company_Goals_List_Popup;