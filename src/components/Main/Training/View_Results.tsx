import { useState, Fragment, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '../../../store/themeConfigSlice';
import Common_Table from '../Common_Table';
import Common_Popup from '../Common_Popup';

interface Quiz {
    id: number;
    question: string;
    text: string;
    answer: string;
    training: string;
}

const View_Results = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(setPageTitle('View Quiz'));
    }, [dispatch]);

    const [quizzes, setQuizzes] = useState<Quiz[]>([
        {
            id: 1,
            question: 'What is React?',
            text: 'React is a JavaScript library for building user interfaces.',
            answer: 'A JavaScript library',
            training: 'Basic Web Development'
        }
    ]);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [currentEditId, setCurrentEditId] = useState<number | null>(null);

    const initialFormFields: Quiz = {
        id: 0,
        question: '',
        text: '',
        answer: '',
        training: ''
    };

    const [formData, setFormData] = useState<Quiz>(initialFormFields);

    const columns = [
        { accessor: 'question', title: 'Question' },
        { accessor: 'text', title: 'Text' },
        { accessor: 'answer', title: 'Answer' },
        { accessor: 'training', title: 'Training' }
    ];

    const formFields = [
        { id: 'question', label: 'Question', type: 'text', value: formData.question },
        { id: 'text', label: 'Text', type: 'text', value: formData.text },
        { id: 'answer', label: 'Answer', type: 'text', value: formData.answer },
        { id: 'training', label: 'Training', type: 'text', value: formData.training }
    ];

    const handleAddOrEditQuiz = (submittedData: Quiz) => {
        if (isEditMode && currentEditId !== null) {
            setQuizzes(prev =>
                prev.map(quiz =>
                    quiz.id === currentEditId ? { ...quiz, ...submittedData } : quiz
                )
            );
            setIsEditMode(false);
            setCurrentEditId(null);
        } else {
            const newQuiz = {
                ...submittedData,
                id: quizzes.length + 1
            };
            setQuizzes(prev => [...prev, newQuiz]);
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
                heading="Quiz"
                buttonLabel="Add Quiz"
                formFields={formFields}
                columns={columns}
                data={quizzes}
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
                                        {isEditMode ? 'Edit Quiz' : 'Add Quiz'}
                                    </Dialog.Title>
                                    <Common_Popup
                                        fields={formFields}
                                        onSubmit={handleAddOrEditQuiz}
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

export default View_Results;
