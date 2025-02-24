import { useState, Fragment, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '../../../store/themeConfigSlice';
import Common_Table from '../Common_Table';
import Common_Popup from '../Common_Popup';

interface TrainingAssignment {
    id: number;
    title: string;
    Description: string;
    createdAt: string;
    isCompleted: string;
    department: string;
}

const Assign_Train = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(setPageTitle('Assign Training'));
    }, [dispatch]);

    const [assignments, setAssignments] = useState<TrainingAssignment[]>([
        {
            id: 1,
            title: 'Basic Safety Training',
            Description: 'Introductory safety training module',
            createdAt: new Date().toLocaleDateString(),
            isCompleted: "yes",
            department: 'Safety'
        }
    ]);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [currentEditId, setCurrentEditId] = useState<number | null>(null);

    const initialFormFields: TrainingAssignment = {
        id: 0,
        title: '',
        Description: '',
        createdAt: new Date().toLocaleDateString(),
        isCompleted: "",
        department: ''
    };

    const [formData, setFormData] = useState<TrainingAssignment>(initialFormFields);

    const columns = [
        { accessor: 'title', title: 'Title' },
        { accessor: 'Description', title: 'Description' },
        { accessor: 'createdAt', title: 'Created At' },
        { accessor: 'isCompleted', title: 'Is Completed' },
        { accessor: 'department', title: 'Department' }
    ];

    const isCompletedOptions = [
      { value: '', label: '--------' }, // Default placeholder
      { value: 'Yes', label: 'Yes' },
      { value: 'No', label: 'No' },
  ];

    const formFields = [
        { id: 'title', label: 'Title', type: 'text', value: formData.title },
        { id: 'Description', label: 'Description', type: 'quil', value: formData.Description },
        { id: 'createdAt', label: 'Created At', type: 'date', value: formData.createdAt },
        { id: 'isCompleted', label: 'Is Completed', type: 'select', value: "-------", options: isCompletedOptions},
        { id: 'department', label: 'Department', type: 'text', value: formData.department }
    ];



    const handleAddOrEditAssignment = (submittedData: TrainingAssignment) => {
        if (isEditMode && currentEditId !== null) {
            setAssignments(prev =>
                prev.map(assignment =>
                    assignment.id === currentEditId ? { ...assignment, ...submittedData } : assignment
                )
            );
            setIsEditMode(false);
            setCurrentEditId(null);
        } else {
            const newAssignment = {
                ...submittedData,
                id: assignments.length + 1
            };
            setAssignments(prev => [...prev, newAssignment]);
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
            <Common_Table
                heading="Assigned Training"
                buttonLabel="Training"
                formFields={formFields}
                columns={columns}
                data={assignments}
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
                                        {isEditMode ? 'Edit Assignment' : 'Assign Training'}
                                    </Dialog.Title>
                                    <Common_Popup
                                        fields={formFields}
                                        onSubmit={handleAddOrEditAssignment}
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

export default Assign_Train;
