import { useState, Fragment, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '../../../store/themeConfigSlice';
import CommonTable from '../Common_Table';
import FormComponent from '../Common_Popup';

const Edit_Employee = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(setPageTitle('Create Employee'));
    }, [dispatch]);

    const [employees, setEmployees] = useState([
        {
            id: 1,
            Email: 'john.doe@example.com',
            Department: 'HR',
            Designation: 'HR Manager',
            ReportTo: 'Jane Smith',
            FirstName: 'John',
            LastName: 'Doe',
            HireDate: '01/15/2022',
        },
        // Add more employee objects as needed
    ]);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [currentEditId, setCurrentEditId] = useState<number | null>(null);

    const initialFormFields = {
        id: 0,
        Email: '',
        Password: '',
        ConfirmPassword: '',
        Department: '',
        Designation: '',
        ReportTo: '',
        FirstName: '',
        LastName: '',
        HireDate: '',
    };

    const [formData, setFormData] = useState(initialFormFields);

    const columns = [
        { accessor: 'id', title: 'ID' },
        { accessor: 'Email', title: 'Email' },
        { accessor: 'Department', title: 'Department' },
        { accessor: 'Designation', title: 'Designation' },
        { accessor: 'ReportTo', title: 'Report To' },
        { accessor: 'FirstName', title: 'First Name' },
        { accessor: 'LastName', title: 'Last Name' },
        { accessor: 'HireDate', title: 'Hire Date' },
    ];

    const departmentOptions = [
        { value: '', label: '--------- (Select Department)' }, // Default placeholder
        { value: 'HR', label: 'HR' },
        { value: 'Finance', label: 'Finance' },
        { value: 'Engineering', label: 'Engineering' },
        // Add more department options as needed
    ];

    const formFields = [
        { id: 'Email', label: 'Email', type: 'email', value: formData.Email },
        { id: 'Password', label: 'Password', type: 'password', value: formData.Password },
        { id: 'ConfirmPassword', label: 'Confirm Password', type: 'password', value: formData.ConfirmPassword },
        {
            id: 'Department',
            label: 'Department',
            type: 'select', // Indicate this field is a dropdown
            options: departmentOptions,
            value: formData.Department,
        },
        { id: 'Designation', label: 'Assign Designation', type: 'text', value: formData.Designation },
        { id: 'ReportTo', label: 'Report To', type: 'text', value: formData.ReportTo },
        { id: 'FirstName', label: 'First Name', type: 'text', value: formData.FirstName },
        { id: 'LastName', label: 'Last Name', type: 'text', value: formData.LastName },
        { id: 'HireDate', label: 'Hire Date', type: 'date', value: formData.HireDate },
    ];

    const handleAddOrEditEmployee = (submittedData: typeof formData) => {
        const newEmployee = {
            id: employees.length + 1,
            Email: submittedData.Email,
            Password: submittedData.Password,
            Department: submittedData.Department,
            Designation: submittedData.Designation,
            ReportTo: submittedData.ReportTo,
            FirstName: submittedData.FirstName,
            LastName: submittedData.LastName,
            HireDate: submittedData.HireDate,
        };

        if (isEditMode && currentEditId !== null) {
            setEmployees(prev =>
                prev.map(employee =>
                    employee.id === currentEditId
                        ? { ...employee, ...submittedData }
                        : employee
                )
            );
            setIsEditMode(false);
            setCurrentEditId(null);
        } else {
            setEmployees(prev => [...prev, newEmployee]);
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
                heading=" Create Employee"
                buttonLabel="Employee"
                formFields={formFields}
                columns={columns}
                data={employees}
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
                                        {isEditMode ? 'Edit Employee' : 'Add Employee'}
                                    </Dialog.Title>
                                    <div className="mt-2">
                                        <FormComponent
                                            fields={formFields}
                                            onSubmit={handleAddOrEditEmployee}
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

export default Edit_Employee;
