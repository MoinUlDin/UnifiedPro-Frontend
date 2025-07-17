import { useEffect, useState, Fragment } from 'react';
import { DataTable } from 'mantine-datatable';
import SettingServices from '../../../services/SettingServices';
import { Dialog, Transition } from '@headlessui/react';
import { format } from 'date-fns';
import toast, { Toaster } from 'react-hot-toast';
import ConfirmActionModal from '../../ConfirmActionModel';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';

interface Department {
    id: number;
    name: string;
    expected_arrival_time: string | null;
    parent: number | null;
}

export default function DepartmentsTable() {
    const [departments, setDepartments] = useState<Department[]>([]);
    const storedDepartments = useSelector((s: any) => s.settings.departmentList);
    const [page, setPage] = useState(1);
    const [recordsPerPage, setRecordsPerPage] = useState(10);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [openConfirmationModal, setOpenConfirmationModal] = useState(false);
    const [departmentToDelete, setDepartmentToDelete] = useState<number | null>(null);
    const [formData, setFormData] = useState({ id: 0, name: '', expected_arrival_time: '' });

    const pagedData = departments.slice((page - 1) * recordsPerPage, page * recordsPerPage);

    const dispatch = useDispatch();
    const fetchDepartments = () => {
        SettingServices.fetchDepartments(dispatch)
            .then((res) => {
                setDepartments(res);
            })
            .catch((err) => console.error(err));
    };

    useEffect(() => {
        fetchDepartments();
    }, []);
    useEffect(() => {
        if (!storedDepartments) return;
        setDepartments(storedDepartments);
    }, [storedDepartments]);

    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const payload = {
            name: formData.name,
            expected_arrival_time: formData.expected_arrival_time || null,
        };

        try {
            if (isEditMode) {
                await SettingServices.UpdateDepartment(formData.id, payload);
                toast.success('Department Updated Successfully');
            } else {
                await SettingServices.AddDepartment(payload);
                toast.success('Department Added Successfully');
            }
            fetchDepartments();
            closeModal();
        } catch (err) {
            console.error(err);
        }
    };

    const openModal = (department?: Department) => {
        if (department) {
            setFormData({
                id: department.id,
                name: department.name,
                expected_arrival_time: department.expected_arrival_time ?? '',
            });
            setIsEditMode(true);
        } else {
            setFormData({ id: 0, name: '', expected_arrival_time: '' });
            setIsEditMode(false);
        }
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setFormData({ id: 0, name: '', expected_arrival_time: '' });
        setIsEditMode(false);
    };
    const handleConfirmDelete = async () => {
        if (!departmentToDelete) return;
        SettingServices.DeleteDepartment(departmentToDelete)
            .then(() => {
                toast.success('Department deleted successfully!');
                setDepartments((prev) => prev.filter((d) => d.id !== departmentToDelete));
            })
            .catch((e) => {
                console.error(e);
                toast.error('Error deleting department!');
            });
    };
    const handleDelete = async (department: Department) => {
        setDepartmentToDelete(department.id);
        setOpenConfirmationModal(true);
    };

    const columns = [
        { accessor: 'id', title: 'ID', width: 80 },
        { accessor: 'name', title: 'Name' },
        {
            accessor: 'expected_arrival_time',
            title: 'Arrival Time',
            render: ({ expected_arrival_time }: any) => (expected_arrival_time ? format(new Date(expected_arrival_time), 'yyyy-MM-dd') : '—'),
        },
        {
            accessor: 'actions',
            title: 'Actions',
            render: (row: Department) => (
                <div className="flex gap-2">
                    <button className="btn btn-sm btn-outline-primary" onClick={() => openModal(row)}>
                        Edit
                    </button>
                    <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(row)}>
                        Delete
                    </button>
                </div>
            ),
        },
    ];
    return (
        <div>
            <div>
                <div className="flex items-center justify-between my-3">
                    <h1 className="text-3xl mb-3 font-bold">Departments</h1>
                    <button onClick={() => openModal()} className="px-4 py-2 bg-blue-600 rounded text-white">
                        <span className="text-xl font-extrabold text-green-300">+</span> Add Department
                    </button>
                </div>

                <DataTable
                    records={pagedData}
                    columns={columns}
                    totalRecords={departments.length}
                    page={page}
                    recordsPerPage={recordsPerPage}
                    onPageChange={setPage}
                    onRecordsPerPageChange={setRecordsPerPage}
                    recordsPerPageOptions={[5, 10, 20, 50]}
                    minHeight={200}
                    paginationText={({ from, to, totalRecords }) => `Showing ${from} to ${to} of ${totalRecords}`}
                    striped
                    highlightOnHover
                    withBorder
                />
            </div>

            {/* Modal */}
            <Transition appear show={isModalOpen} as={Fragment}>
                <Dialog as="div" className="relative z-50" onClose={closeModal}>
                    <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
                        <div className="fixed inset-0 bg-black bg-opacity-35" />
                    </Transition.Child>

                    <div className="fixed inset-0 overflow-y-auto">
                        <div className="flex min-h-full items-center justify-center p-4">
                            <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded bg-white p-6 text-left align-middle shadow-xl transition-all">
                                <Dialog.Title className="text-lg font-medium leading-6 text-gray-900 mb-4">{isEditMode ? 'Edit Department' : 'Add Department'}</Dialog.Title>

                                <form onSubmit={handleFormSubmit} className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Department Name</label>
                                        <input
                                            type="text"
                                            placeholder="Department Name"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            className="mt-1 block w-full border-gray-500 px-3 py-1 "
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Expected Arrival Date</label>
                                        <input
                                            type="date"
                                            value={formData.expected_arrival_time ?? ''}
                                            onChange={(e) => setFormData({ ...formData, expected_arrival_time: e.target.value })}
                                            className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:ring focus:ring-blue-200"
                                        />
                                    </div>

                                    <div className="flex justify-end gap-2 mt-6">
                                        <button type="button" onClick={closeModal} className="px-4 py-2 bg-gray-200 rounded text-sm">
                                            Cancel
                                        </button>
                                        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded text-sm">
                                            {isEditMode ? 'Update' : 'Add'}
                                        </button>
                                    </div>
                                </form>
                            </Dialog.Panel>
                        </div>
                    </div>
                </Dialog>
            </Transition>
            <Toaster
                position="top-right"
                reverseOrder={false}
                toastOptions={{
                    duration: 4000, // Default 6 seconds for all toasts
                }}
            />
            <ConfirmActionModal
                opened={openConfirmationModal}
                onClose={() => setOpenConfirmationModal(false)}
                onConfirm={handleConfirmDelete}
                title="Confirm Deletion"
                message="Are you sure you want to delete this department?"
                btnText="Delete"
            />
        </div>
    );
}
