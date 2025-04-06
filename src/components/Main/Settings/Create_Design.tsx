import { useState, Fragment, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '../../../store/themeConfigSlice';
import CommonTable from '../Common_Table';
import FormComponent from '../Common_Popup';
import axios from 'axios';
import Tippy from '@tippyjs/react';

const Create_Design = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(setPageTitle('Designations'));
    }, [dispatch]);

    interface Designation {
        id: number;
        name: string;
        ParentDesignation: string;
        ChildDesignation: string;
    }

    const [designations, setDesignations] = useState<Designation[]>([]);
    const [parentDesignations, setParentDesignations] = useState([]);
    const [childDesignations, setChildDesignations] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [currentEditId, setCurrentEditId] = useState<number | null>(null);
    const token = localStorage.getItem("token");

    useEffect(() => {
        const fetchDesignations = async () => {
            try {
                const parentRes = await axios.get(
                    "https://success365-backend-86f1c1-145db9-65-108-245-140.traefik.me/company-Setup-fkf/parent-departments/",
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                setParentDesignations(parentRes.data.map((item: { id: any; name: any; }) => ({ value: item.id, label: item.name })));

                const childRes = await axios.get(
                    "https://success365-backend-86f1c1-145db9-65-108-245-140.traefik.me/company-Setup-fkf/child-departments/",
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                setChildDesignations(childRes.data.map((item: { id: any; name: any; }) => ({ value: item.id, label: item.name })));

                setDesignations(childRes.data);
            } catch (error) {
                console.error("Error fetching designations:", error);
            }
        };
        fetchDesignations();
    }, []);

    const initialFormFields = { name: '', ParentDesignation: '', ChildDesignation: '' };
    const [formData, setFormData] = useState(initialFormFields);

    const handleEdit = (id: number) => {
        const designationToEdit = designations.find((designation) => designation.id === id);
        if (designationToEdit) {
            setFormData(designationToEdit);
            setCurrentEditId(id);
            setIsEditMode(true);
            openModal();
        }
    };

 const handleDelete = async (id: number) => {
    try {
        setDesignations((prev) => prev.filter((designation) => designation.id !== id));
        await axios.delete(`https://success365-backend-86f1c1-145db9-65-108-245-140.traefik.me/company-Setup/designations/${id}/`,{
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,  // Replace with actual token
            },
        });
        // Remove from UI if needed
    } catch (error) {
        console.error('Error deleting item:', error);
    }
};
    
    const columns = [
        { accessor: 'id', title: 'ID' },
        { accessor: 'name', title: 'Name' },
        { accessor: 'ParentDesignation', title: 'Parent Designation' },
        { accessor: 'ChildDesignation', title: 'Child Designation' },
    ];

    const formFields = [
        { id: 'name', label: 'Designation Name', type: 'text', value: formData.name },
        {
            id: 'ParentDesignation',
            label: 'Parent Designation',
            type: 'select',
            value: formData.ParentDesignation,
            options: parentDesignations,
        },
        {
            id: 'ChildDesignation',
            label: 'Child Designation',
            type: 'select',
            value: formData.ChildDesignation,
            options: childDesignations,
        },
    ];

    const handleAddOrEditDesignation = async (submittedData: typeof formData) => {
        try {
            if (isEditMode && currentEditId !== null) {
                await axios.put(
                    `https://success365-backend-86f1c1-145db9-65-108-245-140.traefik.me/company-Setup/designations/${currentEditId}/`,
                    submittedData,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            "Content-Type": "application/json",
                        },
                    }
                );
            } else {
                await axios.post(
                    "https://success365-backend-86f1c1-145db9-65-108-245-140.traefik.me/company-Setup/designations/",
                    submittedData,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            "Content-Type": "application/json",
                        },
                    }
                );
            }
            closeModal();
        } catch (error) {
            console.error("Error submitting form:", error);
        }
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setFormData(initialFormFields);
        setIsEditMode(false);
        setCurrentEditId(null);
    };

    const openModal = () => setIsModalOpen(true);
    console.log(designations)
    return (
        <div>
            <CommonTable heading="Designation" buttonLabel="Designation" formFields={formFields} onDelete={handleDelete} onButtonClick={openModal} columns={columns} data={designations} />

            <Transition appear show={isModalOpen} as={Fragment}>
                <Dialog as="div" className="relative z-10" onClose={closeModal}>
                    <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
                        <div className="fixed inset-0 bg-black bg-opacity-25" />
                    </Transition.Child>

                    <div className="fixed inset-0 overflow-y-auto">
                        <div className="flex items-center justify-center min-h-full p-4 text-center">
                            <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0 scale-95" enterTo="opacity-100 scale-100" leave="ease-in duration-200" leaveFrom="opacity-100 scale-100" leaveTo="opacity-0 scale-95">
                                <Dialog.Panel className="w-full max-w-3xl p-6 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-xl">
                                    <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900 mb-4">
                                        {isEditMode ? 'Edit Designation' : 'Add Designation'}
                                    </Dialog.Title>
                                    <FormComponent fields={formFields} onSubmit={handleAddOrEditDesignation} onCancel={closeModal} />
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>
        </div>
    );
};

export default Create_Design;
