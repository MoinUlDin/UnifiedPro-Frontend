import React, { useState } from 'react';
import IconEdit from '../../Icon/IconEdit';
import IconTrash from '../../Icon/IconTrash';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2'; // Import SweetAlert2

// Define the Customer Type
type Customer = {
    id: number;
    task_name: string;
    summary: string;
    status: string;
    deadline: string;
    file: string;
};

// Initial Dummy Data
const initialCustomers: Customer[] = [
    { id: 1, task_name: 'Alexandra', summary: 'Available', status: 'Process', deadline: '2023-10-10', file: 'Yes' },
    { id: 2, task_name: 'John', summary: 'Pending', status: 'New', deadline: '2023-10-12', file: 'No' },
    { id: 3, task_name: 'Emma', summary: 'Completed', status: 'Done', deadline: '2023-09-15', file: 'Yes' },
    { id: 4, task_name: 'James', summary: 'In Progress', status: 'Process', deadline: '2023-11-01', file: 'No' },
    { id: 5, task_name: 'Sophia', summary: 'Review', status: 'Pending', deadline: '2023-12-05', file: 'Yes' },
];

const View_Tasks: React.FC = () => {
    const [customers, setCustomers] = useState<Customer[]>(initialCustomers);
    const [search, setSearch] = useState<string>('');
    const [showPopup, setShowPopup] = useState<boolean>(false);
    const [editing, setEditing] = useState<boolean>(false);
    const [editIndex, setEditIndex] = useState<number | null>(null);
    const [actionMenuIndex, setActionMenuIndex] = useState<number | null>(null);

    const navigate = useNavigate();

    // Initialize new customer
    const initialCustomer = {
        id: customers.length + 1,
        task_name: '',
        summary: '',
        status: '',
        deadline: '',
        file: '',
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
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (editing && editIndex !== null) {
            // Update existing customer
            const updatedCustomers = [...customers];
            updatedCustomers[editIndex] = newCustomer;
            setCustomers(updatedCustomers);

            // Show SweetAlert2 confirmation for successful edit
            Swal.fire({
                title: 'Success!',
                text: 'The task has been updated.',
                icon: 'success',
                confirmButtonText: 'OK',
            });
        } else {
            // Add new customer
            setCustomers([...customers, { ...newCustomer, id: customers.length + 1 }]);

            // Show SweetAlert2 confirmation for new addition
            Swal.fire({
                title: 'Task Added!',
                text: 'The new task has been added successfully.',
                icon: 'success',
                confirmButtonText: 'OK',
            });
        }

        setShowPopup(false); // Close the popup after saving
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

    return (
        <div className="w-full bg-white p-4">
            <h1 className="text-left my-4 text-xl font-semibold">Assigned Tasks</h1>
            <div className="flex justify-between items-center mb-3">
                <input type="text" placeholder={`Search: ${filteredCustomers.length} records`} className="form-control w-1/4 p-2 border" value={search} onChange={handleSearch} />
                <button className="btn btn-primary" onClick={handleAddCustomer}>Add Task</button>
            </div>

            <div className="overflow-auto">
                <table className="table-auto border-collapse w-full text-center">
                    <thead>
                        <tr>
                            <th className="">Task Name</th>
                            <th>Summary</th>
                            <th>Status</th>
                            <th>Deadline</th>
                            <th>File</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredCustomers.map((customer, index) => (
                            <tr key={customer.id}>
                                <td>{customer.task_name}</td>
                                <td>{customer.summary}</td>
                                <td>{customer.status}</td>
                                <td>{customer.deadline}</td>
                                <td>{customer.file}</td>

                                <td className="text-center">
                                    <button onClick={() => handleActionMenu(index)} className="btn btn-outline-secondary">
                                        <i className="bi bi-three-dots-vertical" />
                                    </button>
                                    {actionMenuIndex === index && (
                                        <div className="absolute bg-white border shadow z-10">
                                            <ul className="list-group">
                                                <li className="list-group-item cursor-pointer" onClick={() => handleEdit(index)}>
                                                    Edit
                                                </li>
                                                <li className="list-group-item cursor-pointer" onClick={() => handleDelete(index)}>
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
                                <input type="text" className="form-control w-full p-2 mb-2" placeholder="Task Name" value={newCustomer.task_name} onChange={(e) => setNewCustomer({ ...newCustomer, task_name: e.target.value })} required />
                                <input type="text" className="form-control w-full p-2 mb-2" placeholder="Summary" value={newCustomer.summary} onChange={(e) => setNewCustomer({ ...newCustomer, summary: e.target.value })} required />
                                <input type="text" className="form-control w-full p-2 mb-2" placeholder="Status" value={newCustomer.status} onChange={(e) => setNewCustomer({ ...newCustomer, status: e.target.value })} required />
                                <input type="text" className="form-control w-full p-2 mb-2" placeholder="Deadline" value={newCustomer.deadline} onChange={(e) => setNewCustomer({ ...newCustomer, deadline: e.target.value })} required />
                                <input type="text" className="form-control w-full p-2 mb-2" placeholder="File" value={newCustomer.file} onChange={(e) => setNewCustomer({ ...newCustomer, file: e.target.value })} required />
                                <div className="flex justify-end">
                                    <button type="submit" className="btn btn-primary">{editing ? 'Save Changes' : 'Add Task'}</button>
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
