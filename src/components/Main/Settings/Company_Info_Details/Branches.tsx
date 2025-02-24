import { useState, Fragment, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '../../../../store/themeConfigSlice';
import CommonTable from '../../Common_Table';
import CommonPopup from '../../Common_Popup';

interface Branch {
    id: number;
    branchName: string;
    location: string;
    contactNumber: string;
}

// Define the FormField type
interface FormField {
    id: string;
    label: string;
    type: string;
    value: string;
    options?: { value: string; label: string }[]; // Adjusted to match the expected type
}

const Branches = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(setPageTitle('Branches'));
    }, [dispatch]);

    const [branches, setBranches] = useState<Branch[]>([
        {
            id: 1,
            branchName: 'Main Branch',
            location: 'Downtown',
            contactNumber: '123-456-7890'
        }
    ]);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [currentEditId, setCurrentEditId] = useState<number | null>(null);

    const initialFormFields: Branch = {
        id: 0,
        branchName: '',
        location: '',
        contactNumber: ''
    };

    const [formData, setFormData] = useState<Branch>(initialFormFields);

    const columns = [
        { accessor: 'id', title: 'ID' },
        { accessor: 'branchName', title: 'Branch Name' },
        { accessor: 'location', title: 'Location' },
        { accessor: 'contactNumber', title: 'Contact Number' }
    ];

    const formFields: FormField[] = [
        { id: 'branchName', label: 'Branch Name', type: 'text', value: formData.branchName },
        { id: 'location', label: 'Location', type: 'text', value: formData.location },
        { id: 'contactNumber', label: 'Contact Number', type: 'text', value: formData.contactNumber }
    ];

    const handleAddOrEditBranch = (submittedData: Branch) => {
        if (isEditMode && currentEditId !== null) {
            setBranches(prev =>
                prev.map(branch =>
                    branch.id === currentEditId
                        ? { ...branch, ...submittedData }
                        : branch
                )
            );
            setIsEditMode(false);
            setCurrentEditId(null);
        } else {
            const newBranch = {
                ...submittedData,
                id: branches.length + 1
            };
            setBranches(prev => [...prev, newBranch]);
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
                heading="Branche"
                buttonLabel="Branch"
                formFields={formFields}
                columns={columns}
                data={branches}
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
                                        {isEditMode ? 'Edit Branch' : 'Add Branch'}
                                    </Dialog.Title>
                                    <CommonPopup
                                        fields={formFields}
                                        onSubmit={handleAddOrEditBranch}
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

export default Branches;