import { useState, Fragment, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '../../../store/themeConfigSlice';
import CommonTable from '../Common_Table';
import FormComponent, { FormField } from '../Common_Popup';
import SettingServices from '../../../services/SettingServices';

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

    const openModal = () => setIsModalOpen(true);
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
                await SettingServices.updateDesignation(currentEditId, data);
            } else {
                await SettingServices.createDesignation(data);
            }
            // re-fetch table data
            const fresh = await SettingServices.fetchDesignations();
            setDesignations(fresh);
            closeModal();
        } catch (err) {
            console.error(err);
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
    const handleDelete = async (id: number) => {
        if (!window.confirm('Delete this designation?')) return;
        try {
            await SettingServices.deleteDesignation(id);
            setDesignations((prev) => prev.filter((d) => d.id !== id));
        } catch (err) {
            console.error(err);
        }
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
        </div>
    );
};

export default Create_Design;
