import { useState, Fragment, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '../../../store/themeConfigSlice';
import CommonTable from '../Common_Table';
import FormComponent from '../Common_Popup';
import Edit_Employee_Popup from './Edit_Employee_Popup';
import axios from 'axios';
const Edit_Employee = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(setPageTitle('Create Employee'));
    }, [dispatch]);

    interface Employee {
        id: number;
        Email: string;
        Department: string;
        Designation: string;
        ReportTo: string;
        FirstName: string;
        LastName: string;
        HireDate: string;
    }

    const [employees, setEmployees] = useState<Employee[]>([]);

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
    { accessor: 'department', title: 'Department' }, 
    { accessor: 'designation', title: 'Designation' }, // ✅ Already correct
    { accessor: 'first_name', title: 'First Name' }, // ✅ Fixed
    { accessor: 'last_name', title: 'Last Name' }, // ✅ Fixed
    { accessor: 'hire_date', title: 'Hire Date' }, // ✅ Fixed
    ];

    const departmentOptions = [
        { value: '', label: '--------- (Select Department)' }, // Default placeholder
        { value: '1', label: 'HR' },
        { value: '2', label: 'Finance' },
        { value: '3', label: 'Engineering' },
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

    const handleAddOrEditEmployee = async (submittedData: typeof formData) => {
        const updatedEmployee = {
            id: submittedData.id || employees.length + 1, // Keep existing ID or generate new one
            Email: submittedData.Email,
            Department: submittedData.Department,
            Designation: submittedData.Designation,
            ReportTo: submittedData.ReportTo,
            FirstName: submittedData.FirstName,
            LastName: submittedData.LastName,
            HireDate: submittedData.HireDate,
        };
    
        if (isEditMode) {
            setEmployees(prev =>
                prev.map(emp => (emp.id === currentEditId ? updatedEmployee : emp))
            );
        } else {
            setEmployees(prev => [...prev, updatedEmployee]);
        }
    
        setIsModalOpen(false);
        setIsEditMode(false);
        setCurrentEditId(null);
        setFormData(initialFormFields);
    };
    const ImportEmployeeData = async () => {
        try {
            const response = await axios.get('https://success365-backend-86f1c1-145db9-65-108-245-140.traefik.me/auth/employees/', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                }
            });
    
            console.log("API Response:", response.data);
    
            const formattedEmployees = response.data.map((emp: { id: any; department: any; designation: any; first_name: any; last_name: any; hire_date: any; }) => ({
                id: emp.id,
                department: emp.department || "N/A", // Handle null values
                designation: emp.designation || "N/A",
                first_name: emp.first_name,
                last_name: emp.last_name,
                hire_date: emp.hire_date || "N/A",
            }));
    
            setEmployees(formattedEmployees);
        } catch (error) {
            console.error("Error fetching employee data:", error);
        }
    };
    
        useEffect(() => {
            ImportEmployeeData();
        }, []);
        
    const closeModal = () => {
        setIsModalOpen(false);
        setFormData(initialFormFields);
        setIsEditMode(false);
        setCurrentEditId(null);
    };

    const openModal = () => setIsModalOpen(true);

    return (
        <div >
            
            <CommonTable
                heading=" Create Employee"
                buttonLabel="Employee"
                formFields={formFields}
                columns={columns}
                data={employees}
                onButtonClick={openModal}
            />
           
            {/* Modal Popup for Form */}
            <Transition appear show={isModalOpen}  as={Fragment}>
                <Dialog as="div" className="relative z-10"  onClose={closeModal}> 
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

                    {/* <div className="fixed inset-0 overflow-y-auto">
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
                    </div>*/}
                    <Edit_Employee_Popup closeModal={closeModal} />
                </Dialog>
            </Transition>
        </div>
    );
};

export default Edit_Employee;
