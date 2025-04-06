import { useState, Fragment, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '../../../../store/themeConfigSlice';
import CommonTable from '../../Common_Table';
import CommonPopup from '../../Common_Popup';

// Define the standard type to match the shape of standard objects
interface Standard {
    id: number;
    Currency: string;
    TaxID: string;
    TaxPercentage: string;
}

const CompanyStandards = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(setPageTitle('Company Standards'));
    }, [dispatch]);

    const [standards, setStandards] = useState<Standard[]>([
        {
            id: 1,
            Currency: 'USD',
            TaxID: '123456',
            TaxPercentage: '10%'
        }
    ]);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [currentEditId, setCurrentEditId] = useState<number | null>(null);

    const initialFormFields: Standard = {
        id: 0,
        Currency: '',
        TaxID: '',
        TaxPercentage: ''
    };

    const [formData, setFormData] = useState<Standard>(initialFormFields);

    const columns = [
        { accessor: 'id', title: 'ID' },
        { accessor: 'Currency', title: 'Currency' },
        { accessor: 'TaxID', title: 'Tax ID' },
        { accessor: 'TaxPercentage', title: 'Tax Percentage' }
    ];

    const formFields = [
        { id: 'Currency', label: 'Currency', type: 'text', value: formData.Currency },
        { id: 'TaxID', label: 'Tax ID', type: 'text', value: formData.TaxID },
        { id: 'TaxPercentage', label: 'Tax Percentage', type: 'text', value: formData.TaxPercentage }
    ];

    const handleAddOrEditStandard = (submittedData: Standard) => {
        if (isEditMode && currentEditId !== null) {
            setStandards(prev =>
                prev.map(standard =>
                    standard.id === currentEditId
                        ? { ...standard, ...submittedData }
                        : standard
                )
            );
            setIsEditMode(false);
            setCurrentEditId(null);
        } else {
            const newStandard = {
                ...submittedData,
                id: standards.length + 1
            };
            setStandards(prev => [...prev, newStandard]);
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
            <CommonTable
                heading="Company Standard"
                buttonLabel="Standard"
                formFields={formFields}
                columns={columns}
                data={standards}
                onButtonClick={openModal}
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
                                        {isEditMode ? 'Edit Standard' : 'Add Standard'}
                                    </Dialog.Title>
                                    <CommonPopup
                                        fields={formFields}
                                        onSubmit={handleAddOrEditStandard}
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

export default CompanyStandards;