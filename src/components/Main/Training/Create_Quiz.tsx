import { useState, Fragment, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '../../../store/themeConfigSlice';
import Common_Table from '../Common_Table';
import Common_Popup from '../Common_Popup';

// Define the Quiz type
interface Quiz {
    id: number;
    department: string;
    name: string;
    description: string;
}

const Create_Quiz = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(setPageTitle('Create Quiz'));
    }, [dispatch]);

    const [quizzes, setQuizzes] = useState<Quiz[]>([
        {
            id: 1,
            department: 'Computer Science',
            name: 'JavaScript Basics',
            description: 'Introduction to basic JavaScript concepts.'
        }
    ]);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [currentEditId, setCurrentEditId] = useState<number | null>(null);

    const initialFormFields: Quiz = {
        id: 0,
        department: '',
        name: '',
        description: ''
    };

    const [formData, setFormData] = useState<Quiz>(initialFormFields);

    const columns = [
        { accessor: 'department', title: 'Department' },
        { accessor: 'name', title: 'Name' },
        { accessor: 'description', title: 'Description' },
    ];

    const formFields = [
        { id: 'department', label: 'Department', type: 'text', value: formData.department },
        { id: 'name', label: 'Name', type: 'text', value: formData.name },
        { id: 'description', label: 'Description', type: 'text', value: formData.description }
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

    const handleDelete = (id: number) => {
        setQuizzes(prev => prev.filter(quiz => quiz.id !== id));
    };

    const openEditModal = (quiz: Quiz) => {
        setFormData(quiz);
        setIsEditMode(true);
        setCurrentEditId(quiz.id);
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

export default Create_Quiz;
