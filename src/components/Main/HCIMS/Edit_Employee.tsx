import { useState, Fragment, useEffect, useMemo } from 'react';
import { DataTable } from 'mantine-datatable';
import { Dialog, Transition } from '@headlessui/react';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '../../../store/themeConfigSlice';
import Edit_Employee_Popup from './Edit_Employee_Popup';
import EmployeeServices from '../../../services/EmployeeServices';
import toast, { Toaster } from 'react-hot-toast';
import { EmployeeType } from '../../../constantTypes/Types';
import IconUser from '../../Icon/IconUser';
import TerminateEmployeeModal from '../Tasks/TerminateEmployeeModal';
import Swal from 'sweetalert2';
import { Edit, Edit2, Trash, Trash2, UserMinus, UserMinus2, UserRoundMinus, UserRoundX } from 'lucide-react';
import { Link } from 'react-router-dom';

const Edit_Employee = () => {
    const dispatch = useDispatch();
    const [employees, setEmployees] = useState<EmployeeType[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [selectedId, setSelectedId] = useState<number | null>(null);
    const [initailData, setInitialData] = useState<EmployeeType | null>(null);
    const [page, setPage] = useState(1);
    const [recordsPerPage, setRecordsPerPage] = useState(10);
    const [refresh, setRefresh] = useState<boolean>(false);
    const [terminateSelection, setTerminateSelection] = useState<any>();
    const [openTerminate, setOpenTerminate] = useState<boolean>(false);

    useEffect(() => {
        dispatch(setPageTitle('Create Employee'));
    }, [dispatch]);

    // fetching Employess
    useEffect(() => {
        EmployeeServices.FetchEmployees(dispatch)
            .then((response) => {
                console.log('Employess', response);
                setEmployees(response);
            })
            .catch((error) => {
                console.log(error);
            });
    }, [refresh]);

    const columns = [
        {
            accessor: 'first_name',
            title: 'Name',
            render: (row: any) => (
                <Link to={`/employees/${row.id}/profile`} className="flex items-cente gap-2">
                    {row.profile_image ? (
                        <img className="h-8 w-8 bg-cover rounded-full" src={row.profile_image} alt="" />
                    ) : (
                        <div className="border border-gray-300 dark:border-gray-800 rounded-full p-2 ltr:mr-2 rtl:ml-2">
                            <IconUser className="w-4.5 h-4.5" />
                        </div>
                    )}
                    <span>
                        {row.first_name} {row.last_name}
                    </span>
                </Link>
            ),
        },

        { accessor: 'department', title: 'department', render: (row: EmployeeType) => <div style={{ minWidth: 140 }}>{row.department?.name}</div> },
        { accessor: 'designation', title: 'designation', render: (row: EmployeeType) => row.designation?.name },
        { accessor: 'hire_date', title: 'Hire Date' },
        {
            accessor: 'actions',
            title: 'Actions',
            render: (row: any) => (
                <div className="flex gap-3">
                    <Edit
                        className="hover:cursor-pointer hover:text-blue-600 "
                        onClick={() => {
                            handleEditClick(row);
                        }}
                        size={16}
                    />
                    <UserRoundX onClick={() => handleTerminate(row)} className="hover:cursor-pointer hover:text-red-600 " size={16} />

                    <Trash2 className="hover:cursor-pointer hover:text-red-600 " size={16} onClick={() => handleDelete(row.id)} />
                </div>
            ),
        },
    ];

    // Compute only the records for the active page:
    const pagedRecords = useMemo(() => {
        const start = (page - 1) * recordsPerPage;
        return employees.slice(start, start + recordsPerPage);
    }, [employees, page, recordsPerPage]);

    const closeModal = () => {
        setIsModalOpen(false);
        setIsEditMode(false);
        setSelectedId(null);
    };
    useEffect(() => {
        setPage(1);
    }, [recordsPerPage]);

    const openModal = () => {
        setSelectedId(null);
        setInitialData(null);
        setIsEditMode(false);
        setIsModalOpen(true);
    };
    const handleEditClick = (data: any) => {
        console.log('Initial Data: ', data);
        setInitialData(data);
        setIsEditMode(true);
        setSelectedId(data.id);
        setIsModalOpen(true);
    };
    const handleDelete = (id: number) => {
        console.log(id);
        Swal.fire({
            title: '<strong>Are You Sure?</strong>',
            html: 'Do you really want to delete this Employee?<br><em>This action is irreversible.</em>',
            iconHtml: '<i class="bi bi-exclamation-triangle-fill text-yellow-500" style="font-size: 2rem;"></i>',

            showCancelButton: true,
            cancelButtonText: 'No, Cancel',
            confirmButtonText: 'Yes, Delete',
            buttonsStyling: false,
            timer: 8000,
            timerProgressBar: true,
            customClass: {
                actions: 'flex justify-end gap-6 mt-4',
                confirmButton: 'btn btn-outline-danger',
                cancelButton: 'btn btn-outline-success',
            },
        }).then((res) => {
            if (res.isConfirmed) {
                EmployeeServices.DeleteEmployee(id)
                    .then(() => {
                        toast.success('Employee Deleted Succcessfully', { duration: 4000 });
                        setEmployees(employees.filter((e) => e.id !== id));
                    })
                    .catch((e) => {
                        toast.error(e.message);
                    });
            }
        });
    };
    const handleResponse = (data: any) => {
        console.log('response', data);
        if (data.error) {
            toast.error(data.message, { duration: 4000 });
        } else {
            toast.success(data.message, { duration: 4000 });
            setRefresh((p) => !p);
        }
    };

    const handleTerminate = (row: any) => {
        console.log('row: ', row);
        const user = {
            id: row.id,
            name: `${row.first_name} ${row.last_name}`,
        };
        setTerminateSelection(user);
        setOpenTerminate(true);
    };
    const handleSuccess = () => {
        setRefresh((p) => !p);
    };
    return (
        <div>
            <div className="panel">
                <div className="flex justify-between items-center mb-5">
                    <h5 className="font-semibold text-lg dark:text-white-light">Employees</h5>
                    <button className="btn btn-primary" onClick={openModal}>
                        + Add Employee
                    </button>
                </div>

                <DataTable
                    records={pagedRecords}
                    columns={columns}
                    totalRecords={employees.length}
                    recordsPerPage={recordsPerPage}
                    page={page}
                    onPageChange={setPage}
                    onRecordsPerPageChange={setRecordsPerPage}
                    recordsPerPageOptions={[10, 20, 50]}
                    minHeight={200}
                    paginationText={({ from, to, totalRecords }) => `Showing ${from} to ${to} of ${totalRecords}`}
                />
            </div>

            {/* Modal Popup for Form */}
            <Transition appear show={isModalOpen} as={Fragment}>
                <Dialog as="div" className="relative z-10" onClose={closeModal}>
                    <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
                        <div className="fixed inset-0 bg-black bg-opacity-25" />
                    </Transition.Child>

                    <Edit_Employee_Popup response={handleResponse} initailData={initailData!} closeModal={closeModal} isEditMode={isEditMode} />
                </Dialog>
            </Transition>
            <TerminateEmployeeModal open={openTerminate} onClose={() => setOpenTerminate(false)} user={terminateSelection} onSuccess={handleSuccess} />
            <Toaster position="top-right" reverseOrder={false} />
        </div>
    );
};

export default Edit_Employee;
