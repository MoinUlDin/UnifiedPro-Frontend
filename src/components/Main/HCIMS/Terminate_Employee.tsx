import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { Delete, Search } from 'lucide-react';
import EmployeeServices from '../../../services/EmployeeServices';
import { useDispatch } from 'react-redux';
// SweetAlert instance with React content
const MySwal = withReactContent(Swal);

type Customer = {
    id: 13;
    user: 6;
    termination_date: '2025-08-13';
    is_terminated: true;
    reason: 'This is just for testing';
    user_name: 'Jameel Ahmed';
    department: 'Sales';
    email: 'jameel@gmail.com';
};

const Terminate_Employee: React.FC = () => {
    const [employees, setEmployees] = useState<Customer[]>([]);
    const [search, setSearch] = useState<string>('');
    const dispatch = useDispatch();
    const fetchTerminatedEmployees = () => {
        EmployeeServices.FetchTerminatedEmployees(dispatch)
            .then((r) => {
                setEmployees(r);
            })
            .catch((e) => {
                console.log(e);
            });
    };
    useEffect(() => {
        fetchTerminatedEmployees();
    }, []);
    // Handle search input change
    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
    };

    // andle delete action with SweetAlert2 confirmation
    const handleDelete = async (id: number) => {
        MySwal.fire({
            title: 'Are you sure?',
            text: 'Do you want to Delete this employee Record?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, terminate',
            cancelButtonText: 'No, cancel',
        }).then(async (result) => {
            if (result.isConfirmed) {
            }
        });
    };

    // Filter employees based on search query
    const filteredEmployees = employees.filter((employee) => employee.department?.toLowerCase().includes(search.toLowerCase()));

    return (
        <div className="w-full bg-white p-4 dark:bg-black">
            <h1 className="text-left my-4 text-xl font-semibold">Terminate Employee</h1>
            <div className="relative w-full md:w-1/3 mb-2">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" aria-hidden="true" />
                <input
                    type="text"
                    placeholder={`Search by departments`}
                    value={search}
                    onChange={handleSearch}
                    aria-label="Search employees"
                    className="w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                />
            </div>

            <div className="overflow-auto">
                <table className="table-auto border-collapse w-full text-center">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Department</th>
                            <th>Email</th>
                            <th>Term-Date</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredEmployees.map((employee, index) => (
                            <tr key={employee.id}>
                                <td>{employee.user_name}</td>
                                <td>{employee.department}</td>
                                <td>{employee.email}</td>
                                <td>{employee.termination_date}</td>
                                <td className="text-center">
                                    <Delete />
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
