import { useState, Fragment, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '../../../store/themeConfigSlice';
import CommonTable from '../Common_Table';
import FormComponent from '../Common_Popup';

const Time_Req = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(setPageTitle('Leave Requests'));
    }, [dispatch]);

    const [leaveRequests, setLeaveRequests] = useState([
        {
            id: 1,
            Employee: 'John Doe',
            Department: 'IT',
            Designation: 'Software Engineer',
            StartDate: '2024-10-01',
            EndDate: '2024-10-07',
            TotalDays: 7,
            Status: 'Pending',
        },
        {
            id: 2,
            Employee: 'Jane Smith',
            Department: 'Finance',
            Designation: 'Accountant',
            StartDate: '2024-09-15',
            EndDate: '2024-09-20',
            TotalDays: 5,
            Status: 'Approved',
        },
    ]);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [currentEditId, setCurrentEditId] = useState<number | null>(null);

    const initialFormFields = {
        id: 0,
        Employee: '',
        Department: '',
        Designation: '',
        StartDate: '',
        EndDate: '',
        TotalDays: 0,
        Status: '',
    };
    const [formData, setFormData] = useState(initialFormFields);

    const columns = [
        { accessor: 'id', title: 'ID' },
        { accessor: 'Employee', title: 'Employee' },
        { accessor: 'Department', title: 'Department' },
        { accessor: 'Designation', title: 'Designation' },
        { accessor: 'StartDate', title: 'Start Date' },
        { accessor: 'EndDate', title: 'End Date' },
        { accessor: 'TotalDays', title: 'Total Days' },
        { accessor: 'Status', title: 'Status' },
    ];

    const formFields = [
        { id: 'Employee', label: 'Employee', type: 'text', value: formData.Employee },
        {
            id: 'Department',
            label: 'Department',
            type: 'select',
            value: formData.Department,
            options: [
                { value: 'IT', label: 'IT' },
                { value: 'Finance', label: 'Finance' },
                { value: 'HR', label: 'HR' },
            ],
        },
        { id: 'Designation', label: 'Designation', type: 'text', value: formData.Designation },
        { id: 'StartDate', label: 'Start Date', type: 'date', value: formData.StartDate },
        { id: 'EndDate', label: 'End Date', type: 'date', value: formData.EndDate },
        { id: 'TotalDays', label: 'Total Days', type: 'number', value: formData.TotalDays },
        {
            id: 'Status',
            label: 'Status',
            type: 'select',
            value: formData.Status,
            options: [
                { value: 'Pending', label: 'Pending' },
                { value: 'Approved', label: 'Approved' },
                { value: 'Rejected', label: 'Rejected' },
            ],
        },
    ];

    const handleAddOrEditLeaveRequest = (submittedData: any) => {
        if (isEditMode && currentEditId !== null) {
            setLeaveRequests((prev) => prev.map((request) => (request.id === currentEditId ? { ...request, ...submittedData } : request)));
            setIsEditMode(false);
            setCurrentEditId(null);
        } else {
            const newRequest = {
                ...submittedData,
                id: leaveRequests.length + 1,
            };
            setLeaveRequests((prev) => [...prev, newRequest]);
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
            <CommonTable heading="Leave Request" buttonLabel="Request" formFields={formFields} columns={columns} data={leaveRequests} />

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
                                        {isEditMode ? 'Edit Leave Request' : 'Add Leave Request'}
                                    </Dialog.Title>
                                    <FormComponent fields={formFields} onSubmit={handleAddOrEditLeaveRequest} onCancel={closeModal} />
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>
        </div>
    );
};

export default Time_Req;
