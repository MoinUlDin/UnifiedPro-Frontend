import { useState, Fragment, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '../../../store/themeConfigSlice';
import CommonTable from '../Common_Table';
import FormComponent from '../Common_Popup';


const Submit_Mngr_Eval = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(setPageTitle('Submit Manager Evaluation'));
    }, [dispatch]);

    const [evaluatedManagers, setEvaluatedManagers] = useState([
        {
            id: 1,
            Employee: 'Lucy Hunter',
            Department: 'Not specified',
            Designation: 'Not specified',
            TotalForms: 0,
            SubmittedForms: 0,
        },
        {
            id: 2,
            Employee: 'Ali Raza',
            Department: 'Not specified',
            Designation: 'Not specified',
            TotalForms: 0,
            SubmittedForms: 0,
        },
    ]);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [currentEditId, setCurrentEditId] = useState<number | null>(null);

    const initialFormFields = {
        id: 0,
        Employee: 'Lucy Perks', // Default user
        Department: '',
        Designation: '',
        TotalForms: 0,
        SubmittedForms: 0,
    };

    const [formData, setFormData] = useState(initialFormFields);

    const columns = [
        { accessor: 'id', title: 'ID' },
        { accessor: 'Employee', title: 'Employee' },
        { accessor: 'Department', title: 'Department' },
        { accessor: 'Designation', title: 'Designation' },
        { accessor: 'TotalForms', title: 'Total Forms' },
        { accessor: 'SubmittedForms', title: 'Submitted Forms' },
        // Removed View Submissions column
    ];

    const formFields = [
        {
            id: 'Employee',
            label: 'Employee',
            type: 'select',
            options: [
                { value: '--------', label: '--------' },
                { value: 'Lucy Perks', label: 'Lucy Perks' }, // Only one option for user
            ],
            value: formData.Employee,
        },
        {
            id: 'Department',
            label: 'Department',
            type: 'select',
            options: [
                { value: '--------', label: '--------' },
                { value: 'Chase Perks', label: 'Chase Perks' },
                { value: 'Paul Jenson', label: 'Paul Jenson' },
                { value: 'Stella Nicholson', label: 'Stella Nicholson' },
            ],
            value: formData.Department,
        },
        {
            id: 'Designation',
            label: 'Designation',
            type: 'select',
            options: [
                { value: '--------', label: '--------' },
                { value: 'Manager', label: 'Manager' }, // Add your designation options here
                { value: 'Senior Manager', label: 'Senior Manager' },
                { value: 'Team Lead', label: 'Team Lead' },
            ],
            value: formData.Designation,
        },
        { id: 'TotalForms', label: 'Total Forms', type: 'number', value: formData.TotalForms },
        { id: 'SubmittedForms', label: 'Submitted Forms', type: 'number', value: formData.SubmittedForms },
    ];

    const handleAddOrEditManager = (submittedData: typeof formData) => {
        const newManager = {
            id: evaluatedManagers.length + 1,
            Employee: submittedData.Employee,
            Department: submittedData.Department,
            Designation: submittedData.Designation,
            TotalForms: submittedData.TotalForms,
            SubmittedForms: submittedData.SubmittedForms,
        };

        if (isEditMode && currentEditId !== null) {
            setEvaluatedManagers(prev =>
                prev.map(manager =>
                    manager.id === currentEditId
                        ? { ...manager, ...submittedData }
                        : manager
                )
            );
            setIsEditMode(false);
            setCurrentEditId(null);
        } else {
            setEvaluatedManagers(prev => [...prev, newManager]);
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
                heading="Evaluated Manager"
                buttonLabel="Manager Evaluation"
                formFields={formFields}
                columns={columns}
                data={evaluatedManagers}
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
                                        {isEditMode ? 'Edit Manager Evaluation' : 'Add Manager Evaluation'}
                                    </Dialog.Title>
                                    <div className="mt-2">
                                        <FormComponent 
                                            fields={formFields}
                                            onSubmit={handleAddOrEditManager}
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

export default Submit_Mngr_Eval;