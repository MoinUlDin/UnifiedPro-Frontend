import React, { useState,useEffect } from 'react';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import axios from 'axios';
// SweetAlert instance with React content
const MySwal = withReactContent(Swal);

// Define the Customer Type
type Customer = {
    id: number;
    profile_image: string;
    first_name: string;
    last_name: string;
    email: string;
    department: string;
    designations: string;
    marital_status: string;
};

// // Initial Dummy Data
// const initialEmployees: Customer[] = [
//     { id: 1, cnic: 3110218570431, department: 'Technical', cell_phone: 3014971047, marital_status: 'Single' },
//     { id: 2, cnic: 3110218570432, department: 'Engineering', cell_phone: 3014971048, marital_status: 'Married' },
//     { id: 3, cnic: 3110218570433, department: 'Software', cell_phone: 3014971049, marital_status: 'Married' },
//     { id: 4, cnic: 3110218570434, department: 'Sales', cell_phone: 3014971050, marital_status: 'Single' },
// ];

const Terminate_Employee: React.FC = () => {
    const [employees, setEmployees] = useState<Customer[]>([]);
    const [search, setSearch] = useState<string>('');
    useEffect(() => {
        const fetchEmployees = async () => {
            try {
                const response = await axios.get(
                    'https://success365-backend-86f1c1-145db9-65-108-245-140.traefik.me/auth/employees/',
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem('token')}`,
                        },
                    }
                );
                setEmployees(response.data);
                console.log('Employees:', response.data);
            } catch (error) {
                console.error('Error fetching employees:', error);
            }
        };

        fetchEmployees();
    }, []);
    // Handle search input change
    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
    };
   
   
    
   
   
   // andle delete action with SweetAlert2 confirmation
   const handleDelete = async (id: number) => {
    MySwal.fire({
        title: 'Are you sure?',
        text: 'Do you want to terminate this employee?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, terminate',
        cancelButtonText: 'No, cancel',
    }).then(async (result) => {
        if (result.isConfirmed) {
            try {
                await axios.patch(
                    `https://success365-backend-86f1c1-145db9-65-108-245-140.traefik.me/company-Setup/terminate-employee/${id}/`,
                    { employee_id: id, is_terminated: true }, // Adjusted payload
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem('token')}`,
                        },
                    }
                );

                // Remove the employee from the UI after successful termination
                setEmployees((prev) => prev.filter((emp) => emp.id !== id));

                MySwal.fire('Terminated!', 'Employee has been terminated.', 'success');
            } catch (error) {
                console.error('Error terminating employee:', error);
                MySwal.fire('Error!', 'Failed to terminate employee.', 'error');
            }
        }
    });
};


    // Filter employees based on search query
    const filteredEmployees = employees.filter((employee) =>
        employee.department?.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="w-full bg-white p-4 dark:bg-black">
            <h1 className="text-left my-4 text-xl font-semibold">Terminate Employee</h1>
            <div className="flex justify-between items-center mb-3">
                <input
                    type="text"
                    placeholder={`Department: ${filteredEmployees.length} records`}
                    className="form-control w-1/4 p-2 dark:bg-black"
                    value={search}
                    onChange={handleSearch}
                />
            </div>

            <div className="overflow-auto">
                <table className="table-auto border-collapse w-full text-center">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Department</th>
                            <th>Designations</th>
                            <th>Email</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredEmployees.map((employee, index) => (
                            <tr key={employee.id}>
                                <td>{employee.first_name}</td>
                                <td>{employee.department}</td>
                                <td>{employee.designations}</td>
                                <td>{employee.email}</td>
                                <td className="text-center">
                                    <button onClick={() => handleDelete(employee.id)} className="btn btn-danger">
                                        Terminate
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Terminate_Employee;
