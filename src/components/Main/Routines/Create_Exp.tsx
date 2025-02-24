import { useState, Fragment, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '../../../store/themeConfigSlice';
import CommonTable from '../Common_Table';
import FormComponent from '../Common_Popup';

const Create_Exp = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(setPageTitle('Expense Claims'));
    }, [dispatch]);

    const [expenseClaims, setExpenseClaims] = useState([
        {
            id: 1,
            ClaimDate: '2024-10-01',
            Description: 'Office Supplies',
            Amount: 150,
        },
        {
            id: 2,
            ClaimDate: '2024-10-10',
            Description: 'Travel Expenses',
            Amount: 200,
        },
    ]);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [currentEditId, setCurrentEditId] = useState<number | null>(null);

    const initialFormFields = {
        id: 0,
        ClaimDate: '',
        Description: '',
        Amount: '', // Keep as string for form handling
    };

    const [formData, setFormData] = useState(initialFormFields);

    const columns = [
        { accessor: 'id', title: 'ID' },
        { accessor: 'ClaimDate', title: 'Claim Date' },
        { accessor: 'Description', title: 'Description' },
        { accessor: 'Amount', title: 'Amount' },
    ];

    const formFields = [
        { id: 'ClaimDate', label: 'Claim Date', type: 'date', value: formData.ClaimDate },
        { id: 'Description', label: 'Description', type: 'text', value: formData.Description },
        { id: 'Amount', label: 'Amount', type: 'number', value: formData.Amount },
    ];

    const handleAddOrEditClaim = (submittedData: typeof formData) => {
        const newClaim = {
            id: expenseClaims.length + 1,
            ClaimDate: submittedData.ClaimDate,
            Description: submittedData.Description,
            Amount: Number(submittedData.Amount), // Convert to number
        };

        if (isEditMode && currentEditId !== null) {
            setExpenseClaims((prev) =>
                prev.map((claim) =>
                    claim.id === currentEditId
                        ? { ...claim, ...submittedData, Amount: Number(submittedData.Amount) } // Convert when editing
                        : claim
                )
            );
            setIsEditMode(false);
            setCurrentEditId(null);
        } else {
            setExpenseClaims((prev) => [...prev, newClaim]);
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
            <CommonTable heading="Expense Claim" buttonLabel="Claim" formFields={formFields} columns={columns} data={expenseClaims} />

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
                                    <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">
                                        {isEditMode ? 'Edit Expense Claim' : 'Add Expense Claim'}
                                    </Dialog.Title>
                                    <div className="mt-2">
                                        <FormComponent fields={formFields} onSubmit={handleAddOrEditClaim} onCancel={closeModal} />
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>
        </div>
    );
};

export default Create_Exp;
