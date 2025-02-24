import { useState, Fragment, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '../../../store/themeConfigSlice';
import CommonTable from '../Common_Table';
import FormComponent from '../Common_Popup';
import Tippy from '@tippyjs/react';

const Create_Design = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(setPageTitle('Designations'));
    }, [dispatch]);

    const [designations, setDesignations] = useState([
        { id: 1, name: 'Software Engineer', ParentDesignation: 'IT' },
        { id: 2, name: 'Accountant', ParentDesignation: 'Finance' },
    ]);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [currentEditId, setCurrentEditId] = useState<number | null>(null);

    // Initial form fields state for adding/editing
    const initialFormFields = { name: '', ParentDesignation: '' };

    const [formData, setFormData] = useState(initialFormFields);

    const handleEdit = (id: number) => {
        const designationToEdit = designations.find((designation) => designation.id === id);
        if (designationToEdit) {
            setFormData(designationToEdit); // Pre-fill the form with the existing data
            setCurrentEditId(id); // Set current editing ID
            setIsEditMode(true); // Enable edit mode
            openModal(); // Open the modal
        }
    };

    const handleDelete = (id: number) => {
        setDesignations((prev) => prev.filter((designation) => designation.id !== id));
    };

    // Define the columns array with the "Action" column using buttons and tooltips
    const columns = [
        { accessor: 'id', title: 'ID' },
        { accessor: 'name', title: 'Name' },
        { accessor: 'ParentDesignation', title: 'Parent Designation' },
    ];

    // Define the form fields
    const formFields = [
        { id: 'name', label: 'Designation Name', type: 'text', value: formData.name },
        {
            id: 'ParentDesignation',
            label: 'Parent Designation',
            type: 'select',
            value: formData.ParentDesignation,
            options: [
                { value: 'IT', label: 'IT' },
                { value: 'Finance', label: 'Finance' },
            ],
        },
    ];

    // Handle form submission for adding or updating designations
    const handleAddOrEditDesignation = (submittedData: typeof formData) => {
        if (isEditMode && currentEditId !== null) {
            // Edit mode: Update existing designation
            setDesignations((prev) => prev.map((designation) => (designation.id === currentEditId ? { ...designation, ...submittedData } : designation)));
            setIsEditMode(false); // Reset to add mode
            setCurrentEditId(null); // Clear editing ID
        } else {
            const newDesignation = {
                id: designations.length + 1,
                name: submittedData.name,
                ParentDesignation: submittedData.ParentDesignation,
            };
            setDesignations((prev) => [...prev, newDesignation]);
        }

        setFormData(initialFormFields); // Reset form fields
        closeModal(); // Close the modal
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setFormData(initialFormFields); // Reset form when closing modal
        setIsEditMode(false); // Reset edit mode
        setCurrentEditId(null); // Clear editing ID
    };

    const openModal = () => setIsModalOpen(true);

    return (
        <div>
            <CommonTable heading="Designation" buttonLabel="Designation" formFields={formFields} columns={columns} data={designations} />

            {/* Modal Popup for Form */}
            <Transition appear show={isModalOpen} as={Fragment}>
                <Dialog as="div" className="relative z-10" onClose={closeModal}>
                    <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
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
                                <Dialog.Panel className="w-full max-w-3xl p-6 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-xl">
                                    <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900 mb-4">
                                        {isEditMode ? 'Edit Designation' : 'Add Designation'}
                                    </Dialog.Title>
                                    <FormComponent
                                        fields={formFields}
                                        onSubmit={handleAddOrEditDesignation} // Call to handleAddOrEditDesignation
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

export default Create_Design;
