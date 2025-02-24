import { useState, Fragment, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '../../../store/themeConfigSlice';
import CommonTable from '../Common_Table';
import CommonPopup from '../Common_Popup';

const SubordinateTaskReports = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(setPageTitle('My Assigned Tasks'));
    }, [dispatch]);

    const [tasks, setTasks] = useState([
        { id: 1, taskName: 'Prepare Budget', assignedTo: 'John Doe', dueDate: '2024-11-20', submissionDate: '' },
        { id: 2, taskName: 'Develop Presentation', assignedTo: 'Jane Smith', dueDate: '2024-11-25', submissionDate: '2024-11-24' },
    ]);

    const [isModalOpen, setIsModalOpen] = useState(false);

    const initialFormFields = { taskName: '', assignedTo: '', dueDate: '', submissionDate: '' };
    const [formData, setFormData] = useState(initialFormFields);

    const columns = [
        { accessor: 'id', title: 'ID' },
        { accessor: 'taskName', title: 'Task Name' },
        { accessor: 'assignedTo', title: 'Assigned To' },
        { accessor: 'dueDate', title: 'Due Date' },
        { accessor: 'submissionDate', title: 'Submission Date' },
    ];

    const formFields = [
        { id: 'taskName', label: 'Task Name', type: 'text', value: '' },
        { id: 'assignedTo', label: 'Assigned To', type: 'text', value: '' },
        { id: 'dueDate', label: 'Due Date', type: 'date', value: '' },
        { id: 'submissionDate', label: 'Submission Date', type: 'date', value: '' },
    ];

    const handleAddTask = (formData:any) => {
        const newTask = {
            id: tasks.length + 1,
            taskName: formData.taskName,
            assignedTo: formData.assignedTo,
            dueDate: formData.dueDate,
            submissionDate: formData.submissionDate,
        };
        setTasks((prev) => [...prev, newTask]);
        setIsModalOpen(false);
    };

    const closeModal = () => setIsModalOpen(false);
    const openModal = () => setIsModalOpen(true);

    return (
        <div className="p-6">
            {/* Main Heading */}
            <h1 className="text-2xl font-semibold text-gray-800 mb-4">Subordinate Task Reports</h1>

            <CommonTable
                heading="My Assigned Task"
                buttonLabel="Task"
                formFields={formFields}
                columns={columns}
                data={tasks}
            />

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
                                        Add Assigned Task
                                    </Dialog.Title>
                                    <CommonPopup fields={formFields} onSubmit={handleAddTask} onCancel={closeModal} />
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>
            <div className="flex space-x-4 mt-4">
                    <button className="px-4 py-2 bg-green-500 text-white rounded">Download Excel</button>
                    <button className="px-4 py-2 bg-blue-500 text-white rounded">Download PDF</button>
                </div>
        </div>
    );
};

export default SubordinateTaskReports;