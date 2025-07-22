import { useState, Fragment, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '../../../store/themeConfigSlice';
import CommonTable from '../Common_Table';
import FormComponent, { FormField } from '../Common_Popup';
import SettingServices from '../../../services/SettingServices';
import toast, { Toaster } from 'react-hot-toast';
import ConfirmActionModal from '../../ConfirmActionModel';

interface Designation {
    id: number;
    name: string;
    department: number; // FK
    department_name: string; // label
}

const Create_Design = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setPageTitle('Designations'));
    }, [dispatch]);

    // state
    const [designations, setDesignations] = useState<Designation[]>([]);
    const [departments, setDepartments] = useState<{ value: number; label: string }[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [currentEditId, setCurrentEditId] = useState<number | null>(null);
    const [openConfirmActionModel, setOpenConfirmActionModel] = useState<boolean>(false);
    const [selectedId, setSelectedId] = useState<number | null>(null);
    // form state
    const initialFormData = { name: '', department: '' };
    const [formData, setFormData] = useState<Record<string, any>>(initialFormData);

    // on mount, fetch both lists
    useEffect(() => {
        // departments for the dropdown
        SettingServices.fetchParentDepartments()
            .then((list) => {
                // service returns response.data (an array of {id,name,...})
                setDepartments(list.map((d: any) => ({ value: d.id, label: d.name })));
            })
            .catch(console.error);

        // existing designations for the table
        SettingServices.fetchDesignations()
            .then((list) => {
                // service returns response.data (array of Designation)
                setDesignations(list);
                console.log('designation List: ', list);
            })
            .catch(console.error);
    }, []);

    // table columns
    const columns = [
        { accessor: 'id', title: 'ID' },
        { accessor: 'name', title: 'Name' },
        { accessor: 'department_name', title: 'Department' },
    ];

    // fields for the form
    const formFields: FormField[] = [
        { id: 'name', label: 'Designation Name', type: 'text', value: formData.name },
        {
            id: 'department',
            label: 'Department',
            type: 'select',
            options: departments,
        },
    ];

    const openModal = () => {
        setFormData(initialFormData);
        setIsEditMode(false);
        setIsModalOpen(true);
    };
    const closeModal = () => {
        setIsModalOpen(false);
        setFormData(initialFormData);
        setIsEditMode(false);
        setCurrentEditId(null);
    };

    // create or update
    const handleAddOrEditDesignation = async (data: any) => {
        try {
            if (isEditMode && currentEditId) {
                await SettingServices.updateDesignation(currentEditId, data).then(() => {
                    toast.success('Designation Added Successfuly', { duration: 4000 });
                });
            } else {
                await SettingServices.createDesignation(data);
                toast.success('Designation Updated Successfuly', { duration: 4000 });
            }
            // re-fetch table data
            const fresh = await SettingServices.fetchDesignations();
            setDesignations(fresh);
            closeModal();
        } catch (err) {
            console.error(err);
            toast.error('Error Completing you action', { duration: 4000 });
        }
    };

    // start editing
    const handleEdit = (initailValues: any) => {
        console.log('Edit Called with Data:', initailValues);
        setFormData({ name: initailValues.name, department: initailValues.department });
        setCurrentEditId(initailValues.id);
        setIsEditMode(true);
        openModal();
    };

    // delete
    const handleConfirmDelete = () => {
        if (!selectedId) {
            toast.error('No Selected Id found, System Error');
            return;
        }
        try {
            SettingServices.deleteDesignation(selectedId);
            toast.success('Designation Deleted Successfuly', { duration: 4000 });
            setDesignations((prev) => prev.filter((d) => d.id !== selectedId));
        } catch (err) {
            console.error(err);
        }
    };
    const handleDelete = async (id: number) => {
        setSelectedId(id);
        setOpenConfirmActionModel(true);
    };

    return (
        <div>
            <CommonTable
                heading="Designations"
                buttonLabel="Add"
                columns={columns}
                formFields={formFields}
                data={designations || []} // guard against undefined
                onButtonClick={openModal}
                onEdit={handleEdit}
                onDelete={handleDelete}
            />

            <Transition appear show={isModalOpen} as={Fragment}>
                <Dialog as="div" className="relative z-50" onClose={closeModal}>
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
                                <Dialog.Panel className="w-full max-w-md p-6 bg-white rounded-xl shadow-xl">
                                    <Dialog.Title className="text-lg font-medium mb-4">{isEditMode ? 'Edit' : 'Add'} Designation</Dialog.Title>
                                    <FormComponent initialValues={formData} fields={formFields} onSubmit={handleAddOrEditDesignation} onCancel={closeModal} />
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>
            <Toaster position="top-right" reverseOrder={false} />
            <ConfirmActionModal
                opened={openConfirmActionModel}
                onClose={() => setOpenConfirmActionModel(false)}
                onConfirm={handleConfirmDelete}
                title="Confirm Deletion"
                message="Are you sure you want to delete this Designation? <br/> This Action will not be reversable <br/>Continue?"
                btnText="Delete"
            />
        </div>
    );
};

export default Create_Design;
