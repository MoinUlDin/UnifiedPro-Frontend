import { useState, Fragment, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '../../../store/themeConfigSlice';
import Common_Table from '../Common_Table';
import Common_Popup from '../Common_Popup';

// Define the TrainingAssessment type
interface TrainingAssessment {
    id: number;
    title: string;
    videoUrl: string;
    description: string;
    createdAt: string;
    assignedBy: string;
}

const Train_Assess = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(setPageTitle('Training Assessment'));
    }, [dispatch]);

    const [assessments, setAssessments] = useState<TrainingAssessment[]>([
        {
            id: 1,
            title: 'Advanced Safety Protocols',
            videoUrl: 'https://example.com/video2',
            description: 'Detailed safety protocols training',
            createdAt: '2024-11-01',
            assignedBy: 'Manager A'
        }
    ]);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [currentEditId, setCurrentEditId] = useState<number | null>(null);

    const initialFormFields: TrainingAssessment = {
        id: 0,
        title: '',
        videoUrl: '',
        description: '',
        createdAt: '',
        assignedBy: ''
    };

    const [formData, setFormData] = useState<TrainingAssessment>(initialFormFields);

    const columns = [
        { accessor: 'title', title: 'Title' },
        { accessor: 'videoUrl', title: 'Video URL' },
        { accessor: 'description', title: 'Description' },
        { accessor: 'createdAt', title: 'Created At' },
        { accessor: 'assignedBy', title: 'Assigned By' },
        {
            accessor: 'watch',
            title: 'Watch',
            render: (row: TrainingAssessment) => (
                <button
                    className="text-blue-500 hover:underline"
                    onClick={() => handleWatch(row.videoUrl)}
                >
                    Watch
                </button>
            )
        }
    ];

    const formFields = [
        { id: 'title', label: 'Title', type: 'text', value: formData.title },
        { id: 'videoUrl', label: 'Video URL', type: 'text', value: formData.videoUrl },
        { id: 'description', label: 'Description', type: 'text', value: formData.description },
        { id: 'createdAt', label: 'Created At', type: 'date', value: formData.createdAt },
        { id: 'assignedBy', label: 'Assigned By', type: 'text', value: formData.assignedBy }
    ];

    const handleAddOrEditAssessment = (submittedData: TrainingAssessment) => {
        if (isEditMode && currentEditId !== null) {
            setAssessments(prev =>
                prev.map(assessment =>
                    assessment.id === currentEditId ? { ...assessment, ...submittedData } : assessment
                )
            );
            setIsEditMode(false);
            setCurrentEditId(null);
        } else {
            const newAssessment = {
                ...submittedData,
                id: assessments.length + 1
            };
            setAssessments(prev => [...prev, newAssessment]);
        }

        setFormData(initialFormFields);
        closeModal();
    };

    const handleWatch = (videoUrl: string) => {
        window.open(videoUrl, '_blank');
    };

    const openEditModal = (assessment: TrainingAssessment) => {
        setFormData(assessment);
        setIsEditMode(true);
        setCurrentEditId(assessment.id);
        setIsModalOpen(true);
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
                heading="Training Assessment"
                buttonLabel="Assessment"
                formFields={formFields}
                columns={columns}
                data={assessments}
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
                                        {isEditMode ? 'Edit Assessment' : 'Add Assessment'}
                                    </Dialog.Title>
                                    <Common_Popup
                                        fields={formFields}
                                        onSubmit={handleAddOrEditAssessment}
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

export default Train_Assess;
