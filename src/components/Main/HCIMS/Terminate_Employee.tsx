import React, { useState } from 'react';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

// SweetAlert instance with React content
const MySwal = withReactContent(Swal);

// Define the Customer Type
type Customer = {
    id: number;
    cnic: number;
    department: string;
    cell_phone: number;
    marital_status: string;
};

// Initial Dummy Data
const initialEmployees: Customer[] = [
    { id: 1, cnic: 3110218570431, department: 'Technical', cell_phone: 3014971047, marital_status: 'Single' },
    { id: 2, cnic: 3110218570432, department: 'Engineering', cell_phone: 3014971048, marital_status: 'Married' },
    { id: 3, cnic: 3110218570433, department: 'Software', cell_phone: 3014971049, marital_status: 'Married' },
    { id: 4, cnic: 3110218570434, department: 'Sales', cell_phone: 3014971050, marital_status: 'Single' },
];

const Terminate_Employee: React.FC = () => {
    const [employees, setEmployees] = useState<Customer[]>(initialEmployees);
    const [search, setSearch] = useState<string>('');

    // Handle search input change
    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
    };

    // Handle delete action with SweetAlert2 confirmation
    const handleDelete = (index: number) => {
        MySwal.fire({
            title: 'Are you sure?',
            text: 'Do you want to terminate this employee?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, terminate',
            cancelButtonText: 'No, cancel',
        }).then((result) => {
            if (result.isConfirmed) {
                setEmployees(employees.filter((_, i) => i !== index));
                MySwal.fire('Terminated!', 'Employee has been terminated.', 'success');
            }
        });
    };

    // Filter employees based on search query
    const filteredEmployees = employees.filter((employee) =>
        employee.department.toLowerCase().includes(search.toLowerCase())
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
                            <th>CNIC</th>
                            <th>Department</th>
                            <th>Cell Phone</th>
                            <th>Marital Status</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredEmployees.map((employee, index) => (
                            <tr key={employee.id}>
                                <td>{employee.cnic}</td>
                                <td>{employee.department}</td>
                                <td>{employee.cell_phone}</td>
                                <td>{employee.marital_status}</td>
                                <td className="text-center">
                                    <button onClick={() => handleDelete(index)} className="btn btn-danger">
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
