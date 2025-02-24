// src/pages/EngagementEvaluation.tsx

import { useState, Fragment, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '../../../store/themeConfigSlice';
import CommonTable from '../Common_Table';
import FormComponent from '../Common_Popup';

// Define the evaluation type
interface Evaluation {
    id: number;
    Name: string;
    Department: string;
}

const Submit_Engmnt_Eval = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(setPageTitle('Engagement Evaluation'));
    }, [dispatch]);

    const [evaluatedEngagements, setEvaluatedEngagements] = useState<Evaluation[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [currentEditId, setCurrentEditId] = useState<number | null>(null);

    const initialFormFields = {
        id: 0,
        Name: '',
        Department: '',
    };

    const [formData, setFormData] = useState(initialFormFields);

    const columns = [
        { accessor: 'id', title: 'ID' },
        { accessor: 'Name', title: 'Name' },
        { accessor: 'Department', title: 'Department' },
    ];

    const formFields = [
        { id: 'Name', label: 'Name', type: 'text', value: formData.Name },
        {
            id: 'Department',
            label: 'Department',
            type: 'select',
            options: [
                { value: '', label: 'Select Department' },
                { value: 'HR', label: 'HR' },
                { value: 'Finance', label: 'Finance' },
                { value: 'IT', label: 'IT' },
                { value: 'Marketing', label: 'Marketing' },
            ],
            value: formData.Department,
        },
    ];

    const handleAddOrEditEngagement = (submittedData: typeof formData) => {
        if (isEditMode && currentEditId !== null) {
            setEvaluatedEngagements((prev) => prev.map((Engagement) => (Engagement.id === currentEditId ? { ...Engagement, ...submittedData } : Engagement)));
            setIsEditMode(false);
            setCurrentEditId(null);
        } else {
            const newEngagement = {
                id: evaluatedEngagements.length + 1,
                Name: submittedData.Name,
                Department: submittedData.Department,
            };
            setEvaluatedEngagements((prev) => [...prev, newEngagement]);
        }
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
            <CommonTable heading="Engagement Evaluation" buttonLabel="Evaluation" formFields={formFields} columns={columns} data={evaluatedEngagements} />

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
                                <Dialog.Panel className="w-full max-w-md p-6 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-xl">
                                    <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">
                                        {isEditMode ? 'Edit Evaluation' : 'Add Evaluation'}
                                    </Dialog.Title>
                                    <div className="mt-2">
                                        <FormComponent fields={formFields} onSubmit={handleAddOrEditEngagement} onCancel={closeModal} />
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>
        </div>
    );
};

export default Submit_Engmnt_Eval;
