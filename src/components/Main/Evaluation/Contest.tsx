import { useState, Fragment, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '../../../store/themeConfigSlice';
import CommonTable from '../Common_Table';
import FormComponent from '../Common_Popup';
import Tippy from '@tippyjs/react';

const Contest = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(setPageTitle('Contests'));
    }, [dispatch]);

    const [Contests, setContests] = useState([
        {
            id: 1, // id is a number
            Company: 'Vista',
            name: 'Software Engineer',
            Objective: 'To provide Solutions',
            Description: 'Description',
            AssignTo: 'John Doe',
            Department: 'IT',
            LaunchDate: '2024-10-01',
            DueDate: '2024-11-01',
        },
        {
            id: 2, // id is a number
            Company: 'FinanceCorp',
            name: 'Accountant',
            Objective: 'Manage financial records',
            Description: 'Responsible for managing financial accounts',
            AssignTo: 'Jane Smith',
            Department: 'Finance',
            LaunchDate: '2024-09-15',
            DueDate: '2024-10-15',
        },
    ]);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [currentEditId, setCurrentEditId] = useState<number | null>(null);

    const initialFormFields = {
        id: 0, // id should be a number
        Company: '',
        name: '',
        Objective: '',
        Description: '',
        AssignTo: '',
        Department: '',
        LaunchDate: '',
        DueDate: '',
    };

    const [formData, setFormData] = useState(initialFormFields);

    const columns = [
        { accessor: 'id', title: 'ID' },
        { accessor: 'Company', title: 'Company' },
        { accessor: 'name', title: 'Name' },
        { accessor: 'Objective', title: 'Objective' },
        { accessor: 'Description', title: 'Description' },
        { accessor: 'AssignTo', title: 'Assign To' },
        { accessor: 'Department', title: 'Department' },
        { accessor: 'LaunchDate', title: 'Launch Date' },
        { accessor: 'DueDate', title: 'Due Date' },
    ];

    // Form fields definition
    const formFields = [
        { id: 'Company', label: 'Company', type: 'text', value: formData.Company },
        { id: 'name', label: 'Name', type: 'text', value: formData.name },
        { id: 'Objective', label: 'Objective', type: 'text', value: formData.Objective },
        { id: 'Description', label: 'Description', type: 'textarea', value: formData.Description },
        { id: 'AssignTo', label: 'Assign To', type: 'text', value: formData.AssignTo },
        {
            id: 'Department',
            label: 'Department',
            type: 'select',
            value: formData.Department,
            options: [
                { value: 'IT', label: 'IT' },
                { value: 'Finance', label: 'Finance' },
                // Add more department options as needed
            ],
        },
        { id: 'LaunchDate', label: 'Launch Date', type: 'date', value: formData.LaunchDate }, // Date input type
        { id: 'DueDate', label: 'Due Date', type: 'date', value: formData.DueDate }, // Date input type
    ];

    // Handle form submission for adding or updating contests
    const handleAddOrEditContest = (submittedData: typeof formData) => {
        if (isEditMode && currentEditId !== null) {
            // Edit mode: Update existing contest
            setContests((prev) => prev.map((Contests) => (Contests.id === currentEditId ? { ...Contests, ...submittedData } : Contests)));
            setIsEditMode(false); // Reset to add mode
            setCurrentEditId(null); // Clear editing ID
        } else {
            // Add mode: Add new contest
            const newContests = {
                id: Contests.length + 1, // Assign new ID based on current length
                Company: submittedData.Company,
                name: submittedData.name,
                Objective: submittedData.Objective,
                Description: submittedData.Description,
                AssignTo: submittedData.AssignTo,
                Department: submittedData.Department,
                LaunchDate: submittedData.LaunchDate,
                DueDate: submittedData.DueDate,
            };

            setContests((prev) => [...prev, newContests]); // Update the state with the new contest
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
            <CommonTable heading="Contest" buttonLabel="Contest" formFields={formFields} columns={columns} data={Contests} />

            {/* Modal Popup for Form */}
            <Transition appear show={isModalOpen} as={Fragment}>
                <Dialog as="div" className="relative z-10 " onClose={closeModal}>
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
                                        onSubmit={handleAddOrEditContest} // Call to handleAddOrEditDesignation
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

export default Contest;
