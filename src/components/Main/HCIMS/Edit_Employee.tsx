import { useState, Fragment, useEffect, useMemo } from 'react';
import { DataTable } from 'mantine-datatable';
import { Dialog, Transition } from '@headlessui/react';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '../../../store/themeConfigSlice';
import Edit_Employee_Popup from './Edit_Employee_Popup';
import EmployeeServices from '../../../services/EmployeeServices';
import { render } from '@fullcalendar/core/preact';
type FormData = {
    id: number;
    email?: string;
    department: string;
    designation: string;
    first_name: string;
    last_name: string;
    hire_date: string;
    password?: string;
    confirm_password?: string;
};

const Edit_Employee = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(setPageTitle('Create Employee'));
    }, [dispatch]);

    interface Employee {
        id: number;
        department: string;
        designation: string;
        first_name: string;
        last_name: string;
        hire_date: string;
    }

    const [employees, setEmployees] = useState<Employee[]>([]);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [currentEditId, setCurrentEditId] = useState<number | null>(null);
    const [page, setPage] = useState(1);
    const [recordsPerPage, setRecordsPerPage] = useState(10);

    const initialFormFields: FormData = {
        id: 0,
        department: '',
        designation: '',
        first_name: '',
        last_name: '',
        hire_date: '',
    };

    const [formData, setFormData] = useState(initialFormFields);

    const columns = [
        {
            accessor: 'first_name',
            title: 'Name',
            render: (row: any) => (
                <div>
                    {row.first_name} {row.last_name}
                </div>
            ),
        },

        { accessor: 'department', title: 'department', render: (row: any) => <div style={{ minWidth: 140 }}>{row.department}</div> },
        { accessor: 'designation', title: 'designation' },
        { accessor: 'hire_date', title: 'Hire Date' },
        {
            accessor: 'actions',
            title: 'Actions',
            render: (row: any) => (
                <div className="flex gap-2">
                    <button
                        className="btn btn-sm btn-outline-primary"
                        onClick={() => {
                            setIsEditMode(true);
                            setCurrentEditId(row.id);
                            setFormData({
                                id: row.id,
                                email: row.email,
                                department: row.department,
                                designation: row.designation,
                                first_name: row.first_name,
                                last_name: row.last_name,
                                hire_date: row.hire_date,
                            });
                            openModal();
                        }}
                    >
                        Edit
                    </button>
                    <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(row.id)}>
                        Delete
                    </button>
                </div>
            ),
        },
    ];

    const handleAddOrEditEmployee = async (submittedData: typeof formData) => {
        console.log('Submitted Data:', submittedData);
        const updatedEmployee = {
            id: submittedData.id,
            department: submittedData.department,
            designation: submittedData.designation,
            first_name: submittedData.first_name,
            last_name: submittedData.last_name,
            hire_date: submittedData.hire_date,
        };

        if (isEditMode) {
            setEmployees((prev) => prev.map((emp) => (emp.id === currentEditId ? updatedEmployee : emp)));
        } else {
            setEmployees((prev) => [...prev, updatedEmployee]);
        }

        setIsModalOpen(false);
        setIsEditMode(false);
        setCurrentEditId(null);
        setFormData(initialFormFields);
    };

    // Compute only the records for the active page:
    const pagedRecords = useMemo(() => {
        const start = (page - 1) * recordsPerPage;
        return employees.slice(start, start + recordsPerPage);
    }, [employees, page, recordsPerPage]);

    useEffect(() => {
        EmployeeServices.FetchEmployees()
            .then((response) => {
                console.log('Employess', response);
                const filtered = response.filter((emp: any) => emp.department != null && emp.designation != null);
                const formattedEmployees = filtered.map((emp: { id: any; department: any; designation: any; first_name: any; last_name: any; hire_date: any }) => ({
                    id: emp.id,
                    department: emp.department || 'N/A', // Handle null values
                    designation: emp.designation || 'N/A',
                    first_name: emp.first_name,
                    last_name: emp.last_name,
                    hire_date: emp.hire_date || 'N/A',
                }));

                setEmployees(formattedEmployees);
            })
            .catch((error) => {
                console.log(error);
            });
    }, []);

    const closeModal = () => {
        setIsModalOpen(false);
        setFormData(initialFormFields);
        setIsEditMode(false);
        setCurrentEditId(null);
    };
    useEffect(() => {
        setPage(1);
    }, [recordsPerPage]);

    const openModal = () => setIsModalOpen(true);
    const handleDelete = (id: number) => {};

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

                    <Edit_Employee_Popup initailData={formData} closeModal={closeModal} isEditMode={isEditMode} />
                </Dialog>
            </Transition>
        </div>
    );
};

export default Edit_Employee;
