import { useState, Fragment, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '../../../store/themeConfigSlice';
import CommonTable from '../Common_Table';
import FormComponent from '../Common_Popup';

const Whistle = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(setPageTitle('Whistleblower Reports'));
    }, [dispatch]);

    const [reports, setReports] = useState([
        {
            id: 1,
            Subject: 'Financial Misconduct',
            Description: 'Reported mismanagement of funds in the finance department.',
        },
        {
            id: 2,
            Subject: 'Safety Violation',
            Description: 'Report of safety violations in the manufacturing unit.',
        },
    ]);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [currentEditId, setCurrentEditId] = useState<number | null>(null);

    const initialFormFields = {
        id: 0,
        Subject: '',
        Description: '',
    };
    const [formData, setFormData] = useState(initialFormFields);

    const columns = [
        { accessor: 'id', title: 'ID' },
        { accessor: 'Subject', title: 'Subject' },
        { accessor: 'Description', title: 'Description' },
    ];

    const formFields = [
        { id: 'Subject', label: 'Subject', type: 'text', value: formData.Subject },
        { id: 'Description', label: 'Description', type: 'text', value: formData.Description },
    ];

    const handleAddOrEditReport = (submittedData: any) => {
        if (isEditMode && currentEditId !== null) {
            setReports((prev) => prev.map((report) => (report.id === currentEditId ? { ...report, ...submittedData } : report)));
            setIsEditMode(false);
            setCurrentEditId(null);
        } else {
            const newReport = {
                ...submittedData,
                id: reports.length + 1,
            };
            setReports((prev) => [...prev, newReport]);
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
            <CommonTable heading="Whistle Report" buttonLabel="Report" formFields={formFields} columns={columns} data={reports} />

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
                                        {isEditMode ? 'Edit Report' : 'Add Report'}
                                    </Dialog.Title>
                                    <FormComponent fields={formFields} onSubmit={handleAddOrEditReport} onCancel={closeModal} />
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>
        </div>
    );
};

export default Whistle;
