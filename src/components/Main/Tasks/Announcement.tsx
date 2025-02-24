import React, { useState } from 'react';
import Swal from 'sweetalert2';
import Announcement_Popup from './Announcement_Popup';

type Customer = {
    id: number;
    department: string;
    title: string;
    detail: string;
    priority: string;
};

const initialCustomers: Customer[] = [
    { id: 1, department: 'Technichal', title: 'Creative', detail: 'Single', priority: 'None' },
    { id: 2, department: 'Engneering', title: 'Pridictive', detail: 'Marreid', priority: 'None' },
    { id: 3, department: 'Software', title: 'Creative', detail: 'Married', priority: 'None' },
    { id: 4, department: 'Sales Marketing', title: 'Creative', detail: 'Single', priority: 'None' },
    { id: 5, department: 'Technichal', title: 'Creative', detail: 'Single', priority: 'None' },
];

const Announcement: React.FC = () => {
    const [customers, setCustomers] = useState<Customer[]>(initialCustomers);
    const [search, setSearch] = useState<string>('');
    const [showPopup, setShowPopup] = useState<boolean>(false);
    const [editing, setEditing] = useState<boolean>(false);
    const [editIndex, setEditIndex] = useState<number | null>(null);
    const [actionMenuIndex, setActionMenuIndex] = useState<number | null>(null);
    const [annoucementModel, setAnnoucementModel] = useState(false);

    const announcementPopup = () => {
        setAnnoucementModel(true);
    };

    const initialCustomer = {
        id: customers.length + 1,
        department: '',
        title: '',
        detail: '',
        priority: '',
    };

    const [newCustomer, setNewCustomer] = useState<Customer>(initialCustomer);

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
    };

    const handleAddCustomer = () => {
        setNewCustomer(initialCustomer);
        setShowPopup(true);
        setEditing(false);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editing && editIndex !== null) {
                const updatedCustomers = [...customers];
                updatedCustomers[editIndex] = newCustomer;
                setCustomers(updatedCustomers);
            } else {
                setCustomers([...customers, { ...newCustomer, id: customers.length + 1 }]);
            }
            setShowPopup(false);

            // SweetAlert2 Success Message
            await Swal.fire({
                title: 'Success!',
                text: editing ? 'Announcement updated successfully!' : 'New announcement added successfully!',
                icon: 'success',
                confirmButtonText: 'Ok',
            });
        } catch (error) {
            // SweetAlert2 Error Message
            await Swal.fire({
                title: 'Error!',
                text: 'Something went wrong. Please try again.',
                icon: 'error',
                confirmButtonText: 'Try Again',
            });
        }
    };

    const handleActionMenu = (index: number) => {
        setActionMenuIndex(actionMenuIndex === index ? null : index);
    };

    const handleEdit = (index: number) => {
        setNewCustomer(customers[index]);
        setEditIndex(index);
        setEditing(true);
        setShowPopup(true);
        setActionMenuIndex(null);
    };

    const handleDelete = (index: number) => {
        // SweetAlert2 confirmation before delete
        Swal.fire({
            title: 'Are you sure?',
            text: 'Do you really want to delete this announcement?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'No, cancel!',
            reverseButtons: true,
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    // Delete the customer
                    const updatedCustomers = customers.filter((_, i) => i !== index);
                    setCustomers(updatedCustomers);

                    // Success alert
                    await Swal.fire({
                        title: 'Deleted!',
                        text: 'Announcement has been deleted.',
                        icon: 'success',
                        confirmButtonText: 'Ok',
                    });
                } catch (error) {
                    // Error alert
                    await Swal.fire({
                        title: 'Error!',
                        text: 'Could not delete the announcement. Please try again.',
                        icon: 'error',
                        confirmButtonText: 'Try Again',
                    });
                }
            }
        });
    };

    const filteredCustomers = customers.filter((customer) => customer.department.toLowerCase().includes(search.toLowerCase()));

    return (
        <div className="w-full bg-white p-4">
            <h1 className="text-left my-4 text-xl font-semibold">Announcement List</h1>
            <div className="flex justify-between items-center mb-3">
                <input
                    type="text"
                    placeholder={`Deparment: ${filteredCustomers.length} records`}
                    className="form-control w-1/4 p-2 border"
                    value={search}
                    onChange={handleSearch}
                />
                <button className="btn btn-primary" onClick={announcementPopup}>
                    Create Announcement
                </button>
            </div>

            <div className="overflow-auto">
                <table className="table-auto border-collapse w-full text-center">
                    <thead>
                        <tr>
                            <th className="">Department</th>
                            <th>Title </th>
                            <th>Detail</th>
                            <th>Priority</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredCustomers.map((customer, index) => (
                            <tr key={customer.id}>
                                <td>{customer.department}</td>
                                <td>{customer.title}</td>
                                <td>{customer.detail}</td>
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

            {showPopup && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white rounded-lg w-full max-w-4xl">
                        <div className="flex justify-between items-center p-4 border-b">
                            <h5 className="text-lg font-semibold">{editing ? 'Edit Announcement' : 'Add New Announcement'}</h5>
                            <button
                                type="button"
                                className="btn-close"
                                onClick={() => setShowPopup(false)}
                            ></button>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="p-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="form-group">
                                        <label htmlFor="department" className="form-label">
                                            Department
                                        </label>
                                        <input
                                            type="text"
                                            id="department"
                                            value={newCustomer.department}
                                            onChange={(e) =>
                                                setNewCustomer({
                                                    ...newCustomer,
                                                    department: e.target.value,
                                                })
                                            }
                                            className="form-control"
                                            required
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="title" className="form-label">
                                            Title
                                        </label>
                                        <input
                                            type="text"
                                            id="title"
                                            value={newCustomer.title}
                                            onChange={(e) =>
                                                setNewCustomer({
                                                    ...newCustomer,
                                                    title: e.target.value,
                                                })
                                            }
                                            className="form-control"
                                            required
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="detail" className="form-label">
                                            Detail
                                        </label>
                                        <input
                                            type="text"
                                            id="detail"
                                            value={newCustomer.detail}
                                            onChange={(e) =>
                                                setNewCustomer({
                                                    ...newCustomer,
                                                    detail: e.target.value,
                                                })
                                            }
                                            className="form-control"
                                            required
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="priority" className="form-label">
                                            Priority
                                        </label>
                                        <input
                                            type="text"
                                            id="priority"
                                            value={newCustomer.priority}
                                            onChange={(e) =>
                                                setNewCustomer({
                                                    ...newCustomer,
                                                    priority: e.target.value,
                                                })
                                            }
                                            className="form-control"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="flex justify-end space-x-4 mt-4">
                                    <button
                                        type="button"
                                        className="btn btn-secondary"
                                        onClick={() => setShowPopup(false)}
                                    >
                                        Cancel
                                    </button>
                                    <button type="submit" className="btn btn-primary">
                                        {editing ? 'Update' : 'Add'}
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

export default Announcement;
