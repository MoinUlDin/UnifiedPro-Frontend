import { useState, Fragment, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '../../../store/themeConfigSlice';
import Common_Table from '../Common_Table';
import Common_Popup from '../Common_Popup';

interface Question {
    id: number;
    title: string;
    videoUrl: string;
    Description: string;
    createdAt: string;
}

const Create_Ques = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(setPageTitle('Create Question'));
    }, [dispatch]);

    const [questions, setQuestions] = useState<Question[]>([
        {
            id: 1,
            title: 'Sample Training',
            videoUrl: 'https://example.com/video1',
            Description: 'Description of the training',
            createdAt: new Date().toLocaleDateString()
        }
    ]);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [currentEditId, setCurrentEditId] = useState<number | null>(null);

    const initialFormFields: Question = {
        id: 0,
        title: '',
        videoUrl: '',
        Description: '',
        createdAt: new Date().toLocaleDateString()
    };

    const [formData, setFormData] = useState<Question>(initialFormFields);

    const handleCreateQuestion = (id: number) => {
      // Logic for creating a question for the given training id
      console.log(`Create question for training ID: ${id}`);
  };

  const handleViewQuestions = (id: number) => {
      // Logic for viewing questions for the given training id
      console.log(`View questions for training ID: ${id}`);
  };

    const columns = [
        { accessor: 'title', title: 'Title' },
        { accessor: 'videoUrl', title: 'Video URL' },
        { accessor: 'Description', title: 'Description' },
        { accessor: 'createdAt', title: 'Created At' },
        { accessor: 'createQuestion', title: 'Create Question', isButton: true, onClick: handleCreateQuestion },
        { accessor: 'viewQuestions', title: 'View Questions', isButton: true, onClick: handleViewQuestions }
    ];

    const formFields = [
        { id: 'title', label: 'Title', type: 'text', value: formData.title },
        { id: 'videoUrl', label: 'Video URL', type: 'text', value: formData.videoUrl },
        { id: 'Description', label: 'Description', type: 'quil', value: formData.Description },
        { id: 'createdAt', label: 'Created At', type: 'date', value: formData.createdAt }
    ];

    const handleAddOrEditQuestion = (submittedData: Question) => {
        if (isEditMode && currentEditId !== null) {
            setQuestions(prev =>
                prev.map(question =>
                    question.id === currentEditId ? { ...question, ...submittedData } : question
                )
            );
            setIsEditMode(false);
            setCurrentEditId(null);
        } else {
            const newQuestion = {
                ...submittedData,
                id: questions.length + 1
            };
            setQuestions(prev => [...prev, newQuestion]);
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
                heading="Training Questions"
                buttonLabel="Create Question"
                formFields={formFields}
                columns={columns}
                data={questions}
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
                                        {isEditMode ? 'Edit Question' : 'Create New Question'}
                                    </Dialog.Title>
                                    <Common_Popup
                                        fields={formFields}
                                        onSubmit={handleAddOrEditQuestion}
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

export default Create_Ques;
