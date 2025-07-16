import { useState, Fragment, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '../../../../store/themeConfigSlice';
import CommonTable from '../../Common_Table';
import CommonPopup from '../../Common_Popup';

// Define the standard type to match the shape of standard objects
interface Standard {
    id?: number;
    currency?: string;
    tax_id?: string;
    tax_percentage?: string;
}

const CompanyStandards = ({ id, currency, tax_id, tax_percentage }: Standard) => {
    const dispatch = useDispatch();

    useEffect(() => {
        console.log('Id: ', id, 'currency: ', currency, 'tax_id', tax_id, 'tax_percentage', tax_percentage);

        if (id && currency && tax_id && tax_percentage) {
            setStandards([
                {
                    id,
                    currency,
                    tax_id,
                    tax_percentage,
                },
            ]);
        }

        dispatch(setPageTitle('Company Standards'));
    }, [id, currency, tax_id, tax_percentage, dispatch]);

    const [standards, setStandards] = useState<Standard[]>([
        {
            id: id,
            currency: currency,
            tax_id: tax_id,
            tax_percentage: tax_percentage,
        },
    ]);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [currentEditId, setCurrentEditId] = useState<number | null>(null);

    const initialFormFields: Standard = {
        id: 0,
        currency: '',
        tax_id: '',
        tax_percentage: '',
    };

    const [formData, setFormData] = useState<Standard>(initialFormFields);

    const columns = [
        { accessor: 'id', title: 'ID' },
        { accessor: 'currency', title: 'Currency' },
        { accessor: 'tax_id', title: 'Tax ID' },
        { accessor: 'tax_percentage', title: 'Tax Percentage' },
    ];

    const formFields = [
        { id: 'currency', label: 'currency', type: 'text', value: formData.currency },
        { id: 'tax_id', label: 'Tax ID', type: 'text', value: formData.tax_id },
        { id: 'tax_percentage', label: 'Tax Percentage', type: 'text', value: formData.tax_percentage },
    ];

    const handleAddOrEditStandard = (submittedData: Standard) => {
        if (isEditMode && currentEditId !== null) {
            setStandards((prev) => prev.map((standard) => (standard.id === currentEditId ? { ...standard, ...submittedData } : standard)));
            setIsEditMode(false);
            setCurrentEditId(null);
        } else {
            const newStandard = {
                ...submittedData,
                id: standards.length + 1,
            };
            setStandards((prev) => [...prev, newStandard]);
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
            <CommonTable heading="Company Standard" buttonLabel="Update" formFields={formFields} columns={columns} data={standards} onButtonClick={openModal} />

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
                                        {isEditMode ? 'Edit Standard' : 'Add Standard'}
                                    </Dialog.Title>
                                    <CommonPopup fields={formFields} onSubmit={handleAddOrEditStandard} onCancel={closeModal} />
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
