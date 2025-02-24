import { useState, Fragment, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import IconX from '../../Icon/IconX';
import IconCaretDown from '../../Icon/IconCaretDown';

const Announcement_Popup = ({ closeModal }: { closeModal: () => void }) => {
    const [params, setParams] = useState({
        Department: '',
        Title: '',
        Priority: '',
        Details: '',
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
                                <div className="text-lg font-medium bg-[#fbfbfb] dark:bg-[#121c2c] ltr:pl-5 rtl:pr-5 py-3 ltr:pr-[50px] rtl:pl-[50px]">Create Annoucement</div>
                                <div className="p-5">
                                    <form>
                                        <div className="mb-4">
                                            <label htmlFor="full_name">Title:</label>
                                            <input id="full_name" type="text" placeholder="" className="form-input" value={params.Title} onChange={(e) => changeValue(e)} />
                                        </div>
                                        <div className="mb-4 relative">
                                            <label htmlFor="department">Department:</label>
                                            <select id="department" className="form-input pr-10" value={params.Department} onChange={(e) => changeValue(e)}>
                                                <option value=""></option>
                                                <option value="HR">HR</option>
                                                <option value="Engineering">Engineering</option>
                                                <option value="Marketing">Marketing</option>
                                            </select>
                                            <IconCaretDown className="absolute top-10 right-3 pointer-events-none" />
                                        </div>

                                        <div className="mb-4 relative">
                                            <label htmlFor="assign_designation">Priority:</label>
                                            <select id="assign_designation" className="form-input pr-10" value={params.Priority} onChange={(e) => changeValue(e)}>
                                                <option value=""></option>
                                                <option value="Manager">Manager</option>
                                                <option value="Developer">Developer</option>
                                                <option value="Designer">Designer</option>
                                            </select>
                                            <IconCaretDown className="absolute top-10 right-3 pointer-events-none" />
                                        </div>
                                        <div className="mb-4">
                                            <label className="block text-sm font-medium mb-2">Details:</label>
                                            <textarea
                                                name="person_address"
                                                rows={2}
                                                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-500"
                                                placeholder="Enter details here..."
                                            ></textarea>
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

export default Announcement_Popup;