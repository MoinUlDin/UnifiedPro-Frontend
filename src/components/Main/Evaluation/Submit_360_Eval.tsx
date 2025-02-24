import { useState, Fragment, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '../../../store/themeConfigSlice';
import CommonTable from '../Common_Table';
import FormComponent from '../Common_Popup';

const Submit_360_Eval = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(setPageTitle('360 Evaluation Form'));
    }, [dispatch]);

    const [evaluations, setEvaluations] = useState([
        {
            id: 1,
            Name: 'John Doe',
            Department: 'HR',
            User: 'Lucy Perks',
        },
        {
            id: 2,
            Name: 'Jane Smith',
            Department: 'Finance',
            User: 'Lucy Perks',
        },
    ]);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [currentEditId, setCurrentEditId] = useState<number | null>(null);

    const initialFormFields = {
        id: 0,
        Name: '',
        Department: '',
        User: '',
    };

    const [formData, setFormData] = useState(initialFormFields);

    const columns = [
        { accessor: 'id', title: 'ID' },
        { accessor: 'Name', title: 'Name' },
        { accessor: 'Department', title: 'Department' },
        { accessor: 'User', title: 'User' },
    ];

    const departmentOptions = [
        { value: '', label: '--------- (Select Department)' }, // Default placeholder
        { value: 'Chase Perks', label: 'Chase Perks' },
        { value: 'Paul Jenson', label: 'Paul Jenson' },
        { value: 'Stella Nicholson', label: 'Stella Nicholson' },
    ];

    const userOptions = [
        { value: '', label: '--------- (Select User)' }, // Default placeholder
        { value: 'Lucy Perks', label: 'Lucy Perks' }, // Only one user option
    ];

    const formFields = [
        { id: 'Name', label: 'Name', type: 'text', value: formData.Name },
        {
            id: 'Department',
            label: 'Department',
            type: 'select', // Indicate this field is a dropdown
            options: departmentOptions,
            value: formData.Department,
        },
        {
            id: 'User',
            label: 'User',
            type: 'select', // Indicate this field is a dropdown
            options: userOptions,
            value: formData.User,
        },
    ];

    const handleAddOrEditEvaluation = (submittedData: typeof formData) => {
        const newEvaluation = {
            id: evaluations.length + 1,
            Name: submittedData.Name,
            Department: submittedData.Department,
            User: submittedData.User,
        };

        if (isEditMode && currentEditId !== null) {
            setEvaluations(prev =>
                prev.map(evaluation =>
                    evaluation.id === currentEditId
                        ? { ...evaluation, ...submittedData }
                        : evaluation
                )
            );
            setIsEditMode(false);
            setCurrentEditId(null);
        } else {
            setEvaluations(prev => [...prev, newEvaluation]);
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
                heading="360 Evaluation"
                buttonLabel="360 Evaluation Form"
                formFields={formFields}
                columns={columns}
                data={evaluations}
            />

            {/* Modal Popup for Form */}
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
                                <Dialog.Panel className="w-full max-w-3xl p-6 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-xl">
                                    <Dialog.Title
                                        as="h3"
                                        className="text-lg font-medium leading-6 text-gray-900"
                                    >
                                        {isEditMode ? 'Edit Evaluation Form' : 'Add Evaluation Form'}
                                    </Dialog.Title>
                                    <div className="mt-2">
                                        <FormComponent 
                                            fields={formFields}
                                            onSubmit={handleAddOrEditEvaluation}
                                            onCancel={closeModal}
                                        />
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

export default Submit_360_Eval;