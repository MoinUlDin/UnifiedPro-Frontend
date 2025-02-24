import { useState, Fragment, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '../../../../store/themeConfigSlice';
import CommonTable from '../../Common_Table';
import CommonPopup from '../../Common_Popup';

// Define the SubCompany type
interface SubCompany {
    id: number;
    name: string;
    email: string;
    website: string;
    phoneNumber: string;
    workingTime: string; // Added working time
}

// Define the FormField type
interface FormField {
    id: string;
    label: string;
    type: string;
    value: string;
}

const SubCompanies = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(setPageTitle('Sub Companies'));
    }, [dispatch]);

    const [subCompanies, setSubCompanies] = useState<SubCompany[]>([
        {
            id: 1,
            name: 'Sub Company A',
            email: 'suba@example.com',
            website: 'www.subcompanya.com',
            phoneNumber: '123-456-7890',
            workingTime: '9 AM - 5 PM'
        }
    ]);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [currentEditId, setCurrentEditId] = useState<number | null>(null);

    const initialFormFields: SubCompany = {
        id: 0,
        name: '',
        email: '',
        website: '',
        phoneNumber: '',
        workingTime: ''
    };

    const [formData, setFormData] = useState<SubCompany>(initialFormFields);

    const columns = [
        { accessor: 'id', title: 'ID' },
        { accessor: 'name', title: 'Name' },
        { accessor: 'email', title: 'Email' },
        { accessor: 'website', title: 'Website' },
        { accessor: 'phoneNumber', title: 'Phone Number' },
        { accessor: 'workingTime', title: 'Working Time' }
    ];

    const formFields: FormField[] = [
        { id: 'name', label: 'Name', type: 'text', value: formData.name },
        { id: 'email', label: 'Email', type: 'email', value: formData.email },
        { id: 'website', label: 'Website', type: 'text', value: formData.website },
        { id: 'phoneNumber', label: 'Phone Number', type: 'text', value: formData.phoneNumber },
        { id: 'workingTime', label: 'Working Time', type: 'text', value: formData.workingTime }
    ];

    const handleAddOrEditSubCompany = (submittedData: SubCompany) => {
        if (isEditMode && currentEditId !== null) {
            setSubCompanies(prev =>
                prev.map(subCompany =>
                    subCompany.id === currentEditId
                        ? { ...subCompany, ...submittedData }
                        : subCompany
                )
            );
            setIsEditMode(false);
            setCurrentEditId(null);
        } else {
            const newSubCompany = {
                ...submittedData,
                id: subCompanies.length + 1
            };
            setSubCompanies(prev => [...prev, newSubCompany]);
        }

        setFormData(initialFormFields);
        closeModal();
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setFormData(initialFormFields);
        setIsEditMode(false);
        setCurrentEditId(null);
    };

    const openModal = () => setIsModalOpen(true);

    return (
        <div>
            <CommonTable
                heading="Sub Companie"
                buttonLabel="Sub Company"
                formFields={formFields}
                columns={columns}
                data={subCompanies}
            />

            <Transition appear show={isModalOpen} as={Fragment}>
                <Dialog as="div" className="relative z-10" onClose={closeModal}>
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-black bg-opacity-25" />
                    </Transition.Child>

                    <div className="fixed inset-0 overflow-y-auto">
                        <div className="flex items-center justify-center min-h-full p-4 text-center">
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 scale-95"
                                enterTo="opacity-100 scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 scale-100"
                                leaveTo="opacity-0 scale-95"
                            >
                                <Dialog.Panel className="w-full max-w-md p-6 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-xl">
                                    <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900 mb-4">
                                        {isEditMode ? 'Edit Sub Company' : 'Add Sub Company'}
                                    </Dialog.Title>
                                    <CommonPopup
                                        fields={formFields}
                                        onSubmit={handleAddOrEditSubCompany}
                                        onCancel={closeModal}
                                    />
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>
        </div>
    );
};

export default SubCompanies;