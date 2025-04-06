import React, { useState,useEffect } from 'react';
import IconEdit from '../../Icon/IconEdit';
import IconTrash from '../../Icon/IconTrash';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2'; // Import SweetAlert2
import axios from 'axios'
// Define the Customer Type
type Customer = {
    id: number;
    task_name: string;
    summary: string;
    status: string;
    deadline: string;
    file: string;
    frequency: "at_once" | "daily" | "weekly" | "monthly"; // Assuming limited options
    instructions: string;
    start_date: string; 
    designation: number;
    employee: number;
    priority: "low" | "medium" | "high"; //
    department: number; // Add department property
};
interface Designation {
    id: number;
    name: string;
    ParentDesignation: string;
    ChildDesignation: string;
}
interface Department {
    id: number;
    name: string;
    ParentDesignation: string;
    ChildDesignation: string;
}


// Initial Dummy Data
const initialCustomers: Customer[] = [];

const View_Tasks: React.FC = () => {
    const [customers, setCustomers] = useState<Customer[]>(initialCustomers);
    const [search, setSearch] = useState<string>('');
    const [showPopup, setShowPopup] = useState<boolean>(false);
    const [editing, setEditing] = useState<boolean>(false);
    const [editIndex, setEditIndex] = useState<number | null>(null);
    const [actionMenuIndex, setActionMenuIndex] = useState<number | null>(null);
    const [departments, setDepartments] = useState<Department[]>([]);
const [designations, setDesignations] = useState<Designation[]>([]);
    const navigate = useNavigate();

    // Initialize new customer
    const initialCustomer: Customer = {
        id: customers.length + 1,
        task_name: '',
        summary: '',
        status: '',
        deadline: '',
        file: '',
        frequency: 'at_once', // Default value
        instructions: '',
        start_date: '',
        designation: 0, // Default value
        employee: 0, // Default value
        priority: 'low',
        department: 0
    };

    const [newCustomer, setNewCustomer] = useState<Customer>(initialCustomer);

    // Handle Search Input Change
    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
    };

    // Add New Customer Button Handler
    const handleAddCustomer = () => {
        setNewCustomer(initialCustomer); // Reset form to default for new customer
        setShowPopup(true);
        setEditing(false); // Indicate we're adding new, not editing
    };

    // Handle Edit action
    const handleEdit = (index: number) => {
        setNewCustomer(customers[index]); // Set data of the selected customer for editing
        setEditIndex(index);
        setEditing(true);
        setShowPopup(true); // Open the popup for editing
        setActionMenuIndex(null); // Close menu after edit
    };

    // Handle Submit (Save Changes)
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
    
        const authToken = localStorage.getItem('token');
        if (!authToken) {
            navigate('/auth/boxed-signin');
            return;
        }
    
        try {
            if (editing && editIndex !== null) {
                // Update existing customer
                const updatedCustomers = [...customers];
                updatedCustomers[editIndex] = newCustomer;
                setCustomers(updatedCustomers);
            } else {
                // Add new customer
                const response = await axios.post("https://success365-backend-86f1c1-145db9-65-108-245-140.traefik.me/routine-tasks/task/", newCustomer, {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${authToken}`,
                    },
                });
                console.log(customers)
                setCustomers([...customers, response.data]); // Add new customer from API response
            }
            setShowPopup(false); // Close the popup
        } catch (error) {
            console.error("Error submitting customer:", error);
            if (axios.isAxiosError(error)) {
                console.error("Axios Error Response:", error.response?.data);
            }
        }
    };
    

    // Handle Action Menu Click (Toggle visibility of action menu)
    const handleActionMenu = (index: number) => {
        setActionMenuIndex(actionMenuIndex === index ? null : index);
    };

    // Handle Delete action with SweetAlert2
    const handleDelete = (index: number) => {
        Swal.fire({
            title: 'Are you sure?',
            text: 'You won’t be able to revert this!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!',
        }).then((result) => {
            if (result.isConfirmed) {
                const updatedCustomers = customers.filter((_, i) => i !== index);
                setCustomers(updatedCustomers);
                Swal.fire('Deleted!', 'Your task has been deleted.', 'success');
            }
        });
        setActionMenuIndex(null); // Close menu after delete
    };

    // Filtered Customers Based on Search
    const filteredCustomers = customers.filter((customer) => customer.task_name.toLowerCase().includes(search.toLowerCase()));
    const fetchDepartments = async () => {
            const API_BASE_URL = "https://success365-backend-86f1c1-145db9-65-108-245-140.traefik.me";
            const authToken = localStorage.getItem('token');
            if (!authToken) {
                navigate('/auth/boxed-signin');
                return;
            }
    
            try {
                const response = await axios.get(`${API_BASE_URL}/company-Setup/departments/`, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${authToken}`
                    }
                });
                setDepartments(response.data);
            } catch (err) {
                console.error('Failed to fetch departments:', err);
                setError('Failed to fetch departments');
            }
        };
       useEffect(() => {
         
        fetchDepartments()
       }, [])
    
       const fetchDesignation = async () => {
        const API_BASE_URL = "https://success365-backend-86f1c1-145db9-65-108-245-140.traefik.me";
        const authToken = localStorage.getItem('token');
        if (!authToken) {
            navigate('/auth/boxed-signin');
            return;
        }
        
        try {
            const response = await axios.get(`${API_BASE_URL}/company-Setup/designations/`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`
                }
            });
    
            setDesignations(response.data);
        } catch (err) {
            console.error('Failed to fetch designations:', err);
            setError('Failed to fetch designations');
        }
    };
    
    // ✅ Correct useEffect for fetching designations
    useEffect(() => {
        fetchDesignation();
    }, []);
    return (
        <div className="w-full bg-white p-4">
            <h1 className="text-left my-4 text-xl font-semibold">Assigned Tasks</h1>
            <div className="flex justify-between items-center mb-3">
                <input type="text" placeholder={`Search: ${filteredCustomers.length} records`} className="form-control w-1/4 p-2 border" value={search} onChange={handleSearch} />
                <button className="btn btn-primary" onClick={handleAddCustomer}>
                    Add Task
                </button>
            </div>

            <div className="overflow-auto">
                <table className="table-auto border-collapse w-full text-center">
                    <thead>
                        <tr>
                            <th>Task Name</th>
                            <th>Summary</th>
                            <th>Status</th>
                            <th>Deadline</th>
                            <th>File</th>
                            <th>Frequency</th>
                            <th>Instructions</th>
                            <th>Start Date</th>
                            <th>Designation</th>
                            <th>Employee</th>
                            <th>Priority</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredCustomers.map((customer, index) => (
                            <tr key={customer.id}>
                                <td>{customer.task_name}</td>
                                <td>{customer.summary}</td> {/* Displaying Summary */}
                                <td>{customer.status}</td>
                                <td>{customer.deadline}</td> {/* Displaying Deadline */}
                                <td>
                                    {customer.file ? (
                                        <a
                                            href={customer.file}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-blue-500 underline"
                                        >
                                            View File
                                        </a>
                                    ) : (
                                        "No File"
                                    )}
                                </td> {/* Displaying File */}
                                <td>{customer.frequency}</td>
                                <td>{customer.instructions}</td>
                                <td>{customer.start_date}</td>
                                <td>{customer.designation}</td>
                                <td>{customer.employee}</td>
                                <td>{customer.priority}</td>
                                <td className="text-center">
                                    <button
                                        onClick={() => handleActionMenu(index)}
                                        className="btn btn-outline-secondary"
                                    >
                                        <i className="bi bi-three-dots-vertical" />
                                    </button>
                                    {actionMenuIndex === index && (
                                        <div className="absolute bg-white border shadow z-10">
                                            <ul className="list-group">
                                                <li
                                                    className="list-group-item cursor-pointer"
                                                    onClick={() => handleEdit(index)}
                                                >
                                                    Edit
                                                </li>
                                                <li
                                                    className="list-group-item cursor-pointer"
                                                    onClick={() => handleDelete(index)}
                                                >
                                                    Delete
                                                </li>
                                            </ul>
                                        </div>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Popup Modal */}
            {showPopup && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white rounded-lg w-full max-w-4xl">
                        <div className="flex justify-between items-center p-4 border-b">
                            <h5 className="text-lg font-semibold">{editing ? 'Edit Task' : 'Add New Task'}</h5>
                            <button type="button" className="btn-close" onClick={() => setShowPopup(false)}></button>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="p-4">
                                {/* Input Fields for Task Details */}
                                <label htmlFor="TaskName" className="block mb-1">Task Name</label>
                                <input
                                    id='TaskName'
                                    type="text"
                                    className="form-control w-full p-2 mb-2"
                                    placeholder="Task Name"
                                    value={newCustomer.task_name}
                                    onChange={(e) => setNewCustomer({ ...newCustomer, task_name: e.target.value })}
                                    required
                                />
                                 <label htmlFor="summary" className="block mb-1">Summary</label>                                    
                                <input
                                    id='summary'
                                    type="text"
                                    className="form-control w-full p-2 mb-2"
                                    placeholder="Summary"
                                    value={newCustomer.summary}
                                    onChange={(e) => setNewCustomer({ ...newCustomer, summary: e.target.value })}
                                    required
                                />
                                 <label htmlFor="status" className="block mb-1">Status</label>
                                <select id='status' className="form-control w-full p-2 mb-2" value={newCustomer.status} onChange={(e) => setNewCustomer({ ...newCustomer, status: e.target.value })} required>
                                    <option value="">Select Status</option>
                                    <option value="pending">Pending</option>
                                    <option value="in_progress">In Progress</option>
                                    <option value="completed">Completed</option>
                                </select>



                                <label htmlFor="start_date" className="block mb-1">Start Date</label>                                
                                <input
                                    id='start_date'
                                    type="date"
                                    className="form-control w-full p-2 mb-2"
                                    value={newCustomer.start_date}
                                    onChange={(e) => setNewCustomer({ ...newCustomer, start_date: e.target.value })}
                                    required
                                />
                                    <label htmlFor="end_date" className="block mb-1">End Date</label>
                                <input
                                    id='end_date'
                                    type="date"
                                    className="form-control w-full p-2 mb-2"
                                    value={newCustomer.deadline}
                                    onChange={(e) => setNewCustomer({ ...newCustomer, deadline: e.target.value })}
                                    required
                                />
                                <label htmlFor="file" className="block mb-1">File</label>
                                <input
                                id='file'
                                    type="text"
                                    className="form-control w-full p-2 mb-2"
                                    placeholder="File"
                                    value={newCustomer.file}
                                    onChange={(e) => setNewCustomer({ ...newCustomer, file: e.target.value })}
                                    required
                                />
                                    <label htmlFor="frequency" className="block mb-1">Frequency</label>
                                <select
                                    id='frequency'
                                    className="form-control w-full p-2 mb-2"
                                    value={newCustomer.frequency}
                                    onChange={(e) => setNewCustomer({ ...newCustomer, frequency: e.target.value as 'at_once' | 'daily' | 'weekly' | 'monthly' })}
                                    required
                                >
                                    <option value="">Select Frequency</option>
                                    <option value="at_once">At Once</option>
                                    <option value="daily">Daily</option>
                                    <option value="weekly">Weekly</option>
                                    <option value="monthly">Monthly</option>
                                </select>



                                <label htmlFor="instructions" className="block mb-1">Instructions</label>
                                <textarea
                                    id='instructions'
                                    className="form-control w-full p-2 mb-2"
                                    placeholder="Instructions"
                                    value={newCustomer.instructions}
                                    onChange={(e) => setNewCustomer({ ...newCustomer, instructions: e.target.value })}
                                    required
                                />
                                 <label htmlFor="designation" className="block mb-1">Designation</label>
                                <select
                                id='designation'
                                    className="form-control w-full p-2 mb-2"
                                    value={newCustomer.designation}
                                    onChange={(e) => setNewCustomer({ ...newCustomer, designation: parseInt(e.target.value, 10) || 0 })}
                                    required
                                >
                                    <option value="">Select Designation</option>
                                    {designations.map((desig) => (
                                        <option key={desig.id} value={desig.id}>
                                            {desig.name}
                                        </option>
                                    ))}
                                </select>

                                {/* Department */}
                                <label htmlFor="department" className="block mb-1">Department</label>
                                <select
                                    id='department'
                                    className="form-control w-full p-2 mb-2"
                                    value={newCustomer.department}
                                    onChange={(e) => setNewCustomer({ ...newCustomer, department: parseInt(e.target.value, 10) || 0 })}
                                    required
                                >
                                    <option value="">Select Department</option>
                                    {departments.map((department) => (
                                        <option key={department.id} value={department.id}>
                                            {department.name}
                                        </option>
                                    ))}
                                </select>
                                <label htmlFor="employee" className="block mb-1">Employee ID</label>
                                <input
                                    id='employee'
                                    type="number"
                                    className="form-control w-full p-2 mb-2"
                                    placeholder="Employee ID"
                                    value={newCustomer.employee}
                                    onChange={(e) => setNewCustomer({ ...newCustomer, employee: parseInt(e.target.value, 10) || 0 })}
                                    required
                                />
                                <label htmlFor="priority" className="block mb-1">Priority</label>
                                <select
                                id='priority'
                                    className="form-control w-full p-2 mb-2"
                                    value={newCustomer.priority}
                                    onChange={(e) => setNewCustomer({ ...newCustomer, priority: e.target.value as 'low' | 'medium' | 'high' })}
                                    required
                                >
                                    <option value="">Select Priority</option>
                                    <option value="low">Low</option>
                                    <option value="medium">Medium</option>
                                    <option value="high">High</option>
                                </select>

                                <div className="flex justify-end">
                                    <button type="submit" className="btn btn-primary">
                                        {editing ? 'Save Changes' : 'Add Task'}
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default View_Tasks;
function setError(arg0: string) {
    throw new Error('Function not implemented.');
}

