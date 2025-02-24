import { useState, Fragment, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '../../../store/themeConfigSlice';
import Common_Table from '../Common_Table';
import Common_Popup from '../Common_Popup';


// Define the Training type
interface Training {
    id: number;
    title: string;
    videoUrl: string;
    Description: string;
}

const Create_Train = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(setPageTitle('Create Training'));
    }, [dispatch]);

    const [trainings, setTrainings] = useState<Training[]>([
        {
            id: 1,
            title: 'Basic Safety Training',
            videoUrl: 'https://example.com/video1',
            Description: 'Introductory safety training module'
        }
    ]);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [currentEditId, setCurrentEditId] = useState<number | null>(null);

    const initialFormFields: Training = {
        id: 0,
        title: '',
        videoUrl: '',
        Description: ''
    };

    const [formData, setFormData] = useState<Training>(initialFormFields);

    const columns = [
        { accessor: 'title', title: 'Title' },
        { accessor: 'videoUrl', title: 'Video URL' },
        { accessor: 'Description', title: 'Description' }
    ];

    const formFields = [
        { id: 'title', label: 'Title', type: 'text', value: formData.title },
        { id: 'videoUrl', label: 'Video URL', type: 'text', value: formData.videoUrl },
        { id: 'Description', label: 'Description', type: 'quil', value: formData.Description }

    ];

    const handleAddOrEditTraining = (submittedData: Training) => {
        if (isEditMode && currentEditId !== null) {
            setTrainings(prev =>
                prev.map(training =>
                    training.id === currentEditId ? { ...training, ...submittedData } : training
                )
            );
            setIsEditMode(false);
            setCurrentEditId(null);
        } else {
            const newTraining = {
                ...submittedData,
                id: trainings.length + 1
            };
            setTrainings(prev => [...prev, newTraining]);
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
                heading="Training"
                buttonLabel="Training"
                formFields={formFields}
                columns={columns}
                data={trainings}
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
                                        {isEditMode ? 'Edit Training' : 'Add Training'}
                                    </Dialog.Title>
                                    <Common_Popup
                                        fields={formFields}
                                        onSubmit={(data) => handleAddOrEditTraining({ ...data, Description: formData.Description })}
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

export default Create_Train;