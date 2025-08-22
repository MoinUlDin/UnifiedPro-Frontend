import { useState, Fragment, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '../../../../store/themeConfigSlice';
import CommonTable from '../../Common_Table';
import CommonPopup from '../../Common_Popup';

interface WorkingDay {
    id: number;
    DayName: string;
    StartTime: string;
    EndTime: string;
}

// Define the FormField type
interface FormField {
    id: string;
    label: string;
    type: string;
    value: string;
    options?: { value: string; label: string }[]; // Adjusted to match the expected type
}

const WorkingDays = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(setPageTitle('Working Days'));
    }, [dispatch]);

    const [workingDays, setWorkingDays] = useState<WorkingDay[]>([
        {
            id: 1,
            DayName: 'Monday',
            StartTime: '09:00',
            EndTime: '17:00',
        },
    ]);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [currentEditId, setCurrentEditId] = useState<number | null>(null);

    const initialFormFields: WorkingDay = {
        id: 0,
        DayName: '',
        StartTime: '',
        EndTime: '',
    };

    const [formData, setFormData] = useState<WorkingDay>(initialFormFields);

    const columns = [
        { accessor: 'id', title: 'ID' },
        { accessor: 'DayName', title: 'Day Name' },
        { accessor: 'StartTime', title: 'Start Time' },
        { accessor: 'EndTime', title: 'End Time' },
    ];

    const formFields: FormField[] = [
        { id: 'DayName', label: 'Day Name', type: 'text', value: formData.DayName },
        { id: 'StartTime', label: 'Start Time', type: 'time', value: formData.StartTime },
        { id: 'EndTime', label: 'End Time', type: 'time', value: formData.EndTime },
    ];

    const handleAddOrEditWorkingDay = (submittedData: WorkingDay) => {
        if (isEditMode && currentEditId !== null) {
            setWorkingDays((prev) => prev.map((day) => (day.id === currentEditId ? { ...day, ...submittedData } : day)));
            setIsEditMode(false);
            setCurrentEditId(null);
        } else {
            const newWorkingDay = {
                ...submittedData,
                id: workingDays.length + 1,
            };
            setWorkingDays((prev) => [...prev, newWorkingDay]);
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
            <CommonTable heading="Working Day" buttonLabel="Working Day" formFields={formFields} columns={columns} data={workingDays} />
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
                                    <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900 mb-4">
                                        {isEditMode ? 'Edit Working Day' : 'Add Working Day'}
                                    </Dialog.Title>
                                    <CommonPopup fields={formFields} onSubmit={handleAddOrEditWorkingDay} onCancel={closeModal} />
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>
        </div>
    );
};

export default WorkingDays;
