import { useEffect, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';

interface CompanyFormData {
    name: string;
    email: string;
    website: string;
    phone_number: string;
    working_time: string;
    office_open_time: string;
    office_close_time: string;
    break_start_time: string;
    break_end_time: string;
}

interface Props {
    isOpen: boolean;
    initialData: CompanyFormData;
    onClose: () => void;
    onSubmit: (data: CompanyFormData) => void;
}

const CompanyInfoPopup = ({ isOpen, initialData, onClose, onSubmit }: Props) => {
    const [formData, setFormData] = useState<CompanyFormData>(initialData);

    useEffect(() => {
        setFormData(initialData); // Update if props change
        console.log('got it right bro');
    }, [initialData]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setFormData((prev) => ({ ...prev, [id]: value }));
    };

    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-10" onClose={onClose}>
                <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
                    <div className="fixed inset-0 bg-black bg-opacity-25" />
                </Transition.Child>

                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-8 text-center">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <Dialog.Panel className="w-full max-w-lg transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                                <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900 mb-4">
                                    Update Company Info
                                </Dialog.Title>
                                <form onSubmit={handleFormSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {[
                                        { id: 'name', label: 'Name', type: 'text' },
                                        { id: 'email', label: 'Email', type: 'email' },
                                        { id: 'website', label: 'Website', type: 'text' },
                                        { id: 'phone_number', label: 'Phone Number', type: 'text' },
                                        { id: 'working_time', label: 'Working Time', type: 'text' },
                                        { id: 'office_open_time', label: 'Office Open Time', type: 'time' },
                                        { id: 'office_close_time', label: 'Office Close Time', type: 'time' },
                                        { id: 'break_start_time', label: 'Break Start Time', type: 'time' },
                                        { id: 'break_end_time', label: 'Break End Time', type: 'time' },
                                    ].map(({ id, label, type }) => (
                                        <div key={id}>
                                            <label htmlFor={id} className="block text-sm font-medium text-gray-700">
                                                {label}
                                            </label>
                                            <input id={id} type={type} value={(formData as any)[id]} onChange={handleChange} className="form-input mt-1 w-full" />
                                        </div>
                                    ))}

                                    <div className="mt-6 flex justify-end gap-2">
                                        <button type="button" className="btn btn-outline-secondary" onClick={onClose}>
                                            Cancel
                                        </button>
                                        <button type="submit" className="btn btn-primary">
                                            Save
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

export default CompanyInfoPopup;
