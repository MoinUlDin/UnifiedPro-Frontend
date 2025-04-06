import { useState, Fragment, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '../../../store/themeConfigSlice';
import CommonTable from '../Common_Table';
import FormComponent from '../Common_Popup';

// Define the interface for form data (excluding the 'id')
interface FormData {
    Title: string;
    CreatedBy: string;
    MeetingType: string;
    Notes: string;
}

// Define the interface for meetings that includes the 'id'
interface Meeting extends FormData {
    id: number;
}

const Create_Min = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(setPageTitle('Meetings'));
    }, [dispatch]);

    // Use the Meeting type here, which includes the 'id' field
    const [meetings, setMeetings] = useState<Meeting[]>([
        { id: 1, Title: 'Meeting', CreatedBy: 'COO', MeetingType: 'Financial', Notes: 'Follow Guidelines' },
        { id: 2, Title: 'Project Meeting', CreatedBy: 'IT', MeetingType: 'Functional Requirement', Notes: 'Follow Guidelines' },
    ]);

    const [isModalOpen, setIsModalOpen] = useState(false);

    const initialFormFields: FormData = { Title: '', CreatedBy: '--------', MeetingType: '--------', Notes: '' };
    const [formData, setFormData] = useState<FormData>(initialFormFields);

    const columns = [
        { accessor: 'id', title: 'ID' },
        { accessor: 'Title', title: 'Title' },
        { accessor: 'CreatedBy', title: 'Created By' },
        { accessor: 'MeetingType', title: 'Meeting Type' },
        { accessor: 'Notes', title: 'Notes' },
    ];

    const formFields = [
        { id: 'Title', label: 'Meeting Title', type: 'text', value: '' },
        {
            id: 'CreatedBy',
            label: 'Created By',
            type: 'select',
            value: '--------',
            options: [
                { value: '--------', label: '--------' },
                { value: 'Lucy Hunter', label: 'Lucy Hunter' },
                { value: 'Ali Raza', label: 'Ali Raza' },
            ],
        },
        {
            id: 'MeetingType',
            label: 'Meeting Type',
            type: 'select',
            value: '--------',
            options: [
                { value: '--------', label: '--------' },
                { value: 'Daily', label: 'Daily' },
                { value: 'Weekly', label: 'Weekly' },
                { value: 'Monthly', label: 'Monthly' },
            ],
        },
        { id: 'Notes', label: 'Notes', type: 'textarea', value: '' },
    ];

    // Use the FormData type for formData parameter
    const handleAddMeeting = (formData: FormData) => {
        // Create a new meeting with an 'id' based on the length of the meetings array
        const newMeeting: Meeting = {
            id: meetings.length + 1, // generate an id
            Title: formData.Title,
            CreatedBy: formData.CreatedBy,
            MeetingType: formData.MeetingType,
            Notes: formData.Notes,
        };
        setMeetings((prev) => [...prev, newMeeting]);
        setIsModalOpen(false);
    };

    const closeModal = () => setIsModalOpen(false);
    const openModal = () => setIsModalOpen(true);

    return (
        <div>
            <CommonTable heading="Meeting" onButtonClick={openModal} buttonLabel="Meeting" formFields={formFields} columns={columns} data={meetings} />

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
                                        Add Meeting
                                    </Dialog.Title>
                                    <FormComponent fields={formFields} onSubmit={handleAddMeeting} onCancel={closeModal} />
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>
        </div>
    );
};

export default Create_Min;
