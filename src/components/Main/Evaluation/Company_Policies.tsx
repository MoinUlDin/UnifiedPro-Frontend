import { useState, Fragment, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '../../../store/themeConfigSlice';
import CommonTable from '../Common_Table';
import FormComponent from '../Common_Popup';

const Company_Policies = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(setPageTitle('Company Policies'));
    }, [dispatch]);

    const [companyPolicies, setCompanyPolicies] = useState([
        {
            id: 1,
            Department: 'HR',
            PolicyFieldName: 'Remote Work Policy',
            CompanyDescription: 'Guidelines for remote work.',
        },
        {
            id: 2,
            Department: 'Finance',
            PolicyFieldName: 'Expense Reimbursement Policy',
            CompanyDescription: 'Details on reimbursement for expenses.',
        },
    ]);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [currentEditId, setCurrentEditId] = useState<number | null>(null);

    const initialFormFields = {
        id: 0,
        Department: '',
        PolicyFieldName: '',
        CompanyDescription: '',
    };

    const [formData, setFormData] = useState(initialFormFields);

    const columns = [
        { accessor: 'id', title: 'ID' },
        { accessor: 'Department', title: 'Department' },
        { accessor: 'PolicyFieldName', title: 'Policy Field Name' },
        { accessor: 'CompanyDescription', title: 'Company Description' },
    ];

    const departmentOptions = [
        { value: '', label: '--------- (Select Department)' }, // Default placeholder
        { value: 'Chase Perks', label: 'Chase Perks' },
        { value: 'Paul Jenson', label: 'Paul Jenson' },
        { value: 'Stella Nicholson', label: 'Stella Nicholson' },
    ];

    const formFields = [
        {
            id: 'Department',
            label: 'Department',
            type: 'select', // Indicate this field is a dropdown
            options: departmentOptions,
            value: formData.Department,
        },
        { id: 'PolicyFieldName', label: 'Policy Field Name', type: 'text', value: formData.PolicyFieldName },
        { id: 'CompanyDescription', label: 'Company Description', type: 'text', value: formData.CompanyDescription },
    ];

    const handleAddOrEditPolicy = (submittedData: typeof formData) => {
        const newPolicy = {
            id: companyPolicies.length + 1,
            Department: submittedData.Department,
            PolicyFieldName: submittedData.PolicyFieldName,
            CompanyDescription: submittedData.CompanyDescription,
        };

        if (isEditMode && currentEditId !== null) {
            setCompanyPolicies(prev =>
                prev.map(policy =>
                    policy.id === currentEditId
                        ? { ...policy, ...submittedData }
                        : policy
                )
            );
            setIsEditMode(false);
            setCurrentEditId(null);
        } else {
            setCompanyPolicies(prev => [...prev, newPolicy]);
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
                heading="Company Policie"
                buttonLabel="Policy"
                formFields={formFields}
                columns={columns}
                data={companyPolicies}
            />

            {/* Modal Popup for Form */}
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
                                <Dialog.Panel className="w-full max-w-3xl p-6 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-xl">
                                    <Dialog.Title
                                        as="h3"
                                        className="text-lg font-medium leading-6 text-gray-900"
                                    >
                                        {isEditMode ? 'Edit Company Policy' : 'Add Company Policy'}
                                    </Dialog.Title>
                                    <div className="mt-2">
                                        <FormComponent 
                                            fields={formFields}
                                            onSubmit={handleAddOrEditPolicy}
                                            onCancel={closeModal}
                                        />
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

export default Company_Policies;