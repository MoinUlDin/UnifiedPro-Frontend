import { useState, Fragment, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '../../../store/themeConfigSlice';
import CommonTable from '../Common_Table';
import FormComponent from '../Common_Popup';

const TaskProgressReports = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(setPageTitle('Task Progress and Completion Rates'));
    }, [dispatch]);

    const [tasks, setTasks] = useState([
        {
            id: 1,
            taskName: 'Develop Feature X',
            Description: 'Initial setup and configuration.',
            status: 'In Progress',
            progress: '50%',
            timeTaken: '5 hours',
        },
        {
            id: 2,
            taskName: 'Testing and QA',
            Description: 'Functional testing on all devices.',
            status: 'Completed',
            progress: '100%',
            timeTaken: '8 hours',
        },
    ]);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [currentEditId, setCurrentEditId] = useState<number | null>(null);

    const initialFormFields = {
        id: 0,
        taskName: '',
        Description: '',
        status: '',
        progress: '',
        timeTaken: '',
    };

    const [formData, setFormData] = useState(initialFormFields);

    const columns = [
        { accessor: 'id', title: 'ID' },
        { accessor: 'taskName', title: 'Task Name' },
        { accessor: 'Description', title: 'Description' },
        { accessor: 'status', title: 'Status' },
        { accessor: 'progress', title: 'Progress' },
        { accessor: 'timeTaken', title: 'Time Taken' },
    ];

    const formFields = [
        { id: 'taskName', label: 'Task Name', type: 'text', value: formData.taskName },
        { id: 'Description', label: 'Description', type: 'text', value: formData.Description},    
        { id: 'status', label: 'Status', type: 'select', value: formData.status, options: [
            { value: 'In Progress', label: 'In Progress' },
            { value: 'Completed', label: 'Completed' },
            { value: 'Pending', label: 'Pending' },
        ]},
        { id: 'progress', label: 'Progress', type: 'text', value: formData.progress },
        { id: 'timeTaken', label: 'Time Taken', type: 'text', value: formData.timeTaken },
    ];

    const handleAddOrEditTask = (submittedData:any) => {
        if (isEditMode && currentEditId !== null) {
            setTasks((prev) =>
                prev.map((task) =>
                    task.id === currentEditId
                        ? { ...task, ...submittedData }
                        : task
                )
            );
            setIsEditMode(false);
            setCurrentEditId(null);
        } else {
            const newTask = {
                ...submittedData,
                id: tasks.length + 1,
            };
            setTasks((prev) => [...prev, newTask]);
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
        <div className="p-6">
            {/* Main Heading */}
            <h1 className="text-2xl font-semibold text-gray-800 mb-4">Task Progress and Completion Rates</h1>

            <CommonTable
                heading="Task"
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
                                        {isEditMode ? 'Edit Task' : 'Add Task'}
                                    </Dialog.Title>
                                    
                                    {/* Form with Quill Editor */}
                                    <FormComponent
                                        fields={formFields}
                                        onSubmit={handleAddOrEditTask}
                                        onCancel={closeModal}
                                    />

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

export default TaskProgressReports;
