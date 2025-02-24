import { useState, Fragment, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
// import { useDispatch } from 'react-redux';
// import { setPageTitle } from '../../store/themeConfigSlice';
// import IconUserPlus from '../../components/Icon/IconUserPlus';
import IconX from '../../Icon/IconX';
import IconCaretDown from '../../Icon/IconCaretDown';
// import Edit from '../../../pages/Apps/Invoice/Edit';

const Edit_Employee_Popup = ({ closeModal }: { closeModal: () => void }) => {
    const [params, setParams] = useState({
        full_name: '',
        email: '',
        password: '',
        confirm_password: '',
        department: '',
        assign_designation: '',
        report_to: '',
        hire_date: '',
        employee_id: '',
    });

    const changeValue = (e: any) => {
        const { value, id } = e.target;
        setParams({ ...params, [id]: value });
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
                                <button type="button" onClick={closeModal} className="absolute top-4 ltr:right-4 rtl:left-4 text-gray-400 hover:text-gray-800 dark:hover:text-gray-600 outline-none">
                                    <IconX />
                                </button>
                                <div className="text-lg font-medium bg-[#fbfbfb] dark:bg-[#121c2c] ltr:pl-5 rtl:pr-5 py-3 ltr:pr-[50px] rtl:pl-[50px]">Add Employee</div>
                                <div className="p-5">
                                    <form>
                                        <div className="mb-5">
                                            <label htmlFor="full_name">Full Name:</label>
                                            <input id="full_name" type="text" placeholder="" className="form-input" value={params.full_name} onChange={(e) => changeValue(e)} />
                                        </div>
                                        <div className="mb-5 w-">
                                            <label htmlFor="email">Email:</label>
                                            <input id="email" type="email" placeholder="" className="form-input" value={params.email} onChange={(e) => changeValue(e)} />
                                        </div>
                                        <div className="flex gap-4">
                                            <div className="mb-5 w-[48%]">
                                                <label htmlFor="password">Password:</label>
                                                <input id="password" type="password" placeholder="" className="form-input" value={params.password} onChange={(e) => changeValue(e)} />
                                            </div>

                                            <div className="mb-5  w-[48%]">
                                                <label htmlFor="confirm_password">Confirm Password:</label>
                                                <input id="confirm_password" type="password" placeholder="" className="form-input" value={params.confirm_password} onChange={(e) => changeValue(e)} />
                                            </div>
                                        </div>
                                        <div className="mb-5">
                                            <label htmlFor="hire_date">Hire Date:</label>
                                            <input id="hire_date" type="date" placeholder="" className="form-input" value={params.hire_date} onChange={(e) => changeValue(e)} />
                                        </div>
                                        <div className="flex gap-4">
                                            {/* Department Select with Icon */}
                                            <div className="mb-5 w-[48%] relative">
                                                <label htmlFor="department">Department:</label>
                                                <select
                                                    id="department"
                                                    className="form-input pr-10" // Add padding-right to make space for the icon
                                                    value={params.department}
                                                    onChange={(e) => changeValue(e)}
                                                >
                                                    <option value=""></option>
                                                    <option value="HR">HR</option>
                                                    <option value="Engineering">Engineering</option>
                                                    <option value="Marketing">Marketing</option>
                                                </select>
                                                <IconCaretDown className="absolute top-10 right-3 pointer-events-none" /> {/* Position icon */}
                                            </div>

                                            {/* Assign Designation Select with Icon */}
                                            <div className="mb-5 w-[48%] relative">
                                                <label htmlFor="assign_designation">Assign designation:</label>
                                                <select id="assign_designation" className="form-input pr-10" value={params.assign_designation} onChange={(e) => changeValue(e)}>
                                                    <option value=""></option>
                                                    <option value="Manager">Manager</option>
                                                    <option value="Developer">Developer</option>
                                                    <option value="Designer">Designer</option>
                                                </select>
                                                <IconCaretDown className="absolute top-10 right-3 pointer-events-none" />
                                            </div>
                                        </div>

                                        <div className="flex gap-4">
                                            <div className="mb-5  w-[48%] relative">
                                                <label htmlFor="report_to">Report To:</label>

                                                <select id="report_to" className="form-input pr-10" value={params.report_to} onChange={(e) => changeValue(e)}>
                                                    <option value=""></option>
                                                    <option value="CEO">CEO</option>
                                                    <option value="CTO">CTO</option>
                                                    <option value="Manager">Manager</option>
                                                </select>
                                                <IconCaretDown className="absolute top-10 right-3 pointer-events-none" />
                                            </div>
                                            <div className="mb-5  w-[48%]">
                                                <label htmlFor="employee_id">Employee ID:</label>
                                                <input id="employee_id" type="text" placeholder="" className="form-input" value={params.employee_id} onChange={(e) => changeValue(e)} />
                                            </div>
                                        </div>

                                        <div className="flex justify-end items-center mt-8">
                                            <button type="button" className="btn btn-outline-danger" onClick={closeModal}>
                                                Cancel
                                            </button>
                                            <button type="submit" className="btn btn-primary ltr:ml-4 rtl:mr-4">
                                                Add
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

export default Edit_Employee_Popup;