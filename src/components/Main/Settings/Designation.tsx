import { useState, Fragment, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '../../../store/themeConfigSlice';
import CommonTable from '../Common_Table';
import FormComponent, { FormField } from '../Common_Popup';
import SettingServices from '../../../services/SettingServices';
import toast, { Toaster } from 'react-hot-toast';
import ConfirmActionModal from '../../ConfirmActionModel';
import DesignationForm from './DesignationForm';

interface Designation {
    id: number;
    name: string;
    department: number;
    department_name: string;
    parent: number | null;
    parent_name?: string;
}

const Create_Design = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setPageTitle('Designations'));
    }, [dispatch]);

    const [designations, setDesignations] = useState<Designation[]>([]);
    const [departments, setDepartments] = useState<{ value: number; label: string }[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [currentEditId, setCurrentEditId] = useState<number | null>(null);
    const [openConfirmActionModel, setOpenConfirmActionModel] = useState(false);
    const [selectedId, setSelectedId] = useState<number | null>(null);
    const [parentOptions, setParentOptions] = useState<Designation[]>([]);
    const [parentOpen, setParentOpen] = useState(false);
    const [parentSearch, setParentSearch] = useState('');

    // form
    const initialFormData = { name: '', department: '', parent: null as number | null };
    const [formData, setFormData] = useState<any>(initialFormData);

    useEffect(() => {
        SettingServices.fetchParentDepartments()
            .then((list) => {
                setDepartments(list.map((d: any) => ({ value: d.id, label: d.name })));
            })
            .catch(console.error);

        SettingServices.fetchDesignations()
            .then((list) => {
                console.log('list: ', list);
                setDesignations(list);
            })
            .catch(console.error);
    }, []);

    const columns = [
        { accessor: 'id', title: 'ID' },
        { accessor: 'name', title: 'Name' },
        { accessor: 'department_name', title: 'Department' },
        { accessor: 'parent_name', title: 'Reports To' },
    ];

    const formFields: FormField[] = [
        { id: 'name', label: 'Designation Name', type: 'text', value: formData?.name },
        {
            id: 'department',
            label: 'Department',
            type: 'select',
            options: departments,
            value: formData.department,
        },
    ];

    const openModal = () => {
        setIsEditMode(false);
        setCurrentEditId(null);
        setFormData({
            department: null,
            name: null,
            parent: null,
        });
        setIsModalOpen(true);
    };
    const closeModal = () => {
        setIsModalOpen(false);
        setIsEditMode(false);
        setCurrentEditId(null);
    };

    const handleAddOrEditDesignation = async (data: any) => {
        if (isEditMode && currentEditId) {
            await SettingServices.updateDesignation(currentEditId, data)
                .then(() => {
                    toast.success('Designation updated!');
                    SettingServices.fetchDesignations().then((fresh) => {
                        setDesignations(fresh);
                        closeModal();
                    });
                })
                .catch((e) => {
                    toast.error(e.message);
                });
        } else {
            await SettingServices.createDesignation(data)
                .then(() => {
                    toast.success('Designation created!');
                    SettingServices.fetchDesignations().then((fresh) => {
                        setDesignations(fresh);
                        closeModal();
                    });
                })
                .catch((e) => {
                    toast.error('Error completing your action');
                });
        }
    };

    const handleEdit = (row: Designation) => {
        setFormData({
            department: row.department,
            name: row.name,
            parent: row.parent,
        });

        setCurrentEditId(row.id);
        setIsEditMode(true);
        setParentSearch('');
        setIsModalOpen(true);
    };

    const handleConfirmDelete = () => {
        if (!selectedId) return toast.error('No designation selected!');
        SettingServices.deleteDesignation(selectedId)
            .then(() => {
                setDesignations((ds) => ds.filter((d) => d.id !== selectedId));
                toast.success('Deleted!');
            })
            .catch(console.error);
    };
    const handleDelete = (id: number) => {
        setSelectedId(id);
        setOpenConfirmActionModel(true);
    };

    return (
        <div>
            <CommonTable buttonLabel="Add" columns={columns} formFields={formFields} data={designations} onButtonClick={openModal} onEdit={handleEdit} onDelete={handleDelete} />

            {/* Create edit Designation */}
            <Transition appear show={isModalOpen} as={Fragment}>
                <Dialog as="div" className="relative z-50" onClose={closeModal}>
                    <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
                        <div className="fixed inset-0 bg-black bg-opacity-25" />
                    </Transition.Child>

                    <div className="fixed inset-0 overflow-y-auto">
                        <div className="flex min-h-full items-center justify-center p-4 text-center">
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 scale-95"
                                enterTo="opacity-100 scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 scale-100"
                                leaveTo="opacity-0 scale-95"
                            >
                                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                                    <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">
                                        {isEditMode ? 'Edit' : 'Add'} Designation
                                    </Dialog.Title>

                                    <div className="mt-2">
                                        <DesignationForm onSubmit={handleAddOrEditDesignation} onCancel={() => setIsModalOpen(false)} initialValues={formData} />
                                    </div>
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
                message="Are you sure you want to delete this designation? This cannot be undone."
                btnText="Delete"
            />
        </div>
    );
};

export default Create_Design;
