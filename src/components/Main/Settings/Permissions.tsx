// // src/components/CustomerTable.tsx

// import React, { useState } from 'react';
// import IconEdit from '../../Icon/IconEdit';
// import IconTrash from '../../Icon/IconTrash';

// // Define the Customer Type
// type Customer = {
//     id: number;
//     name: string;
//     phone: string;
//     alternative: number;
//     email: string;
//     address: string;
//     joining: string;
//     type: string;
// };

// // Initial Dummy Data
// const initialCustomers: Customer[] = [
//     {
//         id: 1,
//         name: 'Alexandra',
//         phone: '+1 (876) 492-3181',
//         alternative: 20,
//         email: 'Conjurica',
//         address: 'Magmina',
//         joining: '2023-10-10',
//         type: 'Type A',
//     },
//     {
//         id: 2,
//         name: 'Alvarado',
//         phone: '+1 (975) 468-3875',
//         alternative: 31,
//         email: 'Translink',
//         address: 'Magmina',
//         joining: '2023-07-15',
//         type: 'Type B',
//     },
//     {
//         id: 3,
//         name: 'Alvarado',
//         phone: '+1 (975) 468-3875',
//         alternative: 31,
//         email: 'Translink',
//         address: 'Magmina',
//         joining: '2023-07-15',
//         type: 'Type B',
//     },
//     {
//         id: 4,
//         name: 'Alvarado',
//         phone: '+1 (975) 468-3875',
//         alternative: 31,
//         email: 'Translink',
//         address: 'Magmina',
//         joining: '2023-07-15',
//         type: 'Type B',
//     },
//     {
//         id: 5,
//         name: 'Alvarado',
//         phone: '+1 (975) 468-3875',
//         alternative: 31,
//         email: 'Translink',
//         address: 'Magmina',
//         joining: '2023-07-15',
//         type: 'Type B',
//     },

//     // Add more dummy data
// ];

// const Permissions: React.FC = () => {
//     const [customers, setCustomers] = useState<Customer[]>(initialCustomers);
//     const [search, setSearch] = useState<string>('');
//     const [showPopup, setShowPopup] = useState<boolean>(false);
//     const [editing, setEditing] = useState<boolean>(false);
//     const [editIndex, setEditIndex] = useState<number | null>(null);
//     const [actionMenuIndex, setActionMenuIndex] = useState<number | null>(null);

//     // Initialize new customer
//     const initialCustomer = {
//         id: customers.length + 1,
//         name: '',
//         phone: '',
//         alternative: 0,
//         email: '',
//         address: '',
//         joining: '',
//         type: '',
//     };

//     const [newCustomer, setNewCustomer] = useState<Customer>(initialCustomer);

//     // Handle Search Input Change
//     const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
//         setSearch(e.target.value);
//     };

//     // Add New Customer Button Handler
//     const handleAddCustomer = () => {
//         setNewCustomer(initialCustomer); // Reset form to default for new customer
//         setShowPopup(true);
//         setEditing(false); // Indicate we're adding new, not editing
//     };

//     // Handle Popup Form Submit
//     const handleSubmit = (e: React.FormEvent) => {
//         e.preventDefault();
//         if (editing && editIndex !== null) {
//             // Update existing customer
//             const updatedCustomers = [...customers];
//             updatedCustomers[editIndex] = newCustomer;
//             setCustomers(updatedCustomers);
//         } else {
//             // Add new customer
//             setCustomers([...customers, { ...newCustomer, id: customers.length + 1 }]);
//         }
//         setShowPopup(false);
//     };

//     // Handle Action Menu Click (Toggle visibility of action menu)
//     const handleActionMenu = (index: number) => {
//         setActionMenuIndex(actionMenuIndex === index ? null : index);
//     };

//     // Handle Edit action
//     const handleEdit = (index: number) => {
//         setNewCustomer(customers[index]);
//         setEditIndex(index);
//         setEditing(true);
//         setShowPopup(true);
//         setActionMenuIndex(null); // Close menu after edit
//     };

//     // Handle Delete action
//     const handleDelete = (index: number) => {
//         const updatedCustomers = customers.filter((_, i) => i !== index);
//         setCustomers(updatedCustomers);
//         setActionMenuIndex(null); // Close menu after delete
//     };

//     // Filtered Customers Based on Search
//     const filteredCustomers = customers.filter((customer) => customer.name.toLowerCase().includes(search.toLowerCase()) || customer.email.toLowerCase().includes(search.toLowerCase()));

//     return (
//         <div className="w-full bg-white p-4">
//             <h1 className="text-left my-4 text-xl">Customers</h1>
//             <div className="flex justify-between items-center mb-3">
//                 <input type="text" placeholder={`Search: ${filteredCustomers.length} records`} className="form-control w-1/4 p-2 border" value={search} onChange={handleSearch} />
//                 <button onClick={handleAddCustomer} className="btn btn-primary">
//                     Add Customer
//                 </button>
//             </div>

//             <div className="overflow-auto">
//                 <table className="table-auto border-collapse w-full text-center">
//                     <thead>
//                         <tr>
//                             <th className="">Name</th>
//                             <th>Phone Number</th>
//                             <th>Alternative</th>
//                             <th>Email</th>
//                             <th>Address</th>
//                             <th>Joining</th>
//                             <th>Type</th>
//                             <th>Action</th>
//                         </tr>
//                     </thead>
//                     <tbody>
//                         {filteredCustomers.map((customer, index) => (
//                             <tr key={customer.id}>
//                                 <td>{customer.name}</td>
//                                 <td>{customer.phone}</td>
//                                 <td>{customer.alternative}</td>
//                                 <td>{customer.email}</td>
//                                 <td>{customer.address}</td>
//                                 <td>{customer.joining}</td>
//                                 <td>{customer.type}</td>
//                                 <td className="text-center">
//                                     <button onClick={() => handleActionMenu(index)} className="btn btn-outline-secondary">
//                                         <i className="bi bi-three-dots-vertical" />
//                                     </button>
//                                     {actionMenuIndex === index && (
//                                         <div className="absolute bg-white border shadow z-10 p-2">
//                                             <ul className="list-group">
//                                                 <li className="list-group-item cursor-pointer" onClick={() => handleEdit(index)}>
//                                                     Edit
//                                                     {/* <IconEdit /> */}
//                                                 </li>
//                                                 <li className="list-group-item cursor-pointer" onClick={() => handleDelete(index)}>
//                                                     Delete
//                                                     {/* <IconTrash /> */}
//                                                 </li>
//                                             </ul>
//                                         </div>
//                                     )}
//                                 </td>
//                             </tr>
//                         ))}
//                     </tbody>
//                 </table>
//             </div>

//             {/* Popup Modal */}
//             {showPopup && (
//                 <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
//                     <div className="bg-white rounded-lg w-full max-w-4xl">
//                         <div className="flex justify-between items-center p-4 border-b">
//                             <h5 className="text-lg font-semibold">{editing ? 'Edit Customer' : 'Add New Customer'}</h5>
//                             <button type="button" className="btn-close" onClick={() => setShowPopup(false)}></button>
//                         </div>
//                         <div className="p-4">
//                             <form onSubmit={handleSubmit}>
//                                 <div className="space-y-4">
//                                     {/* Name and Email in the first row */}
//                                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                                         <div>
//                                             <label className="block mb-1">Name</label>
//                                             <input
//                                                 type="text"
//                                                 className="form-input w-full"
//                                                 value={newCustomer.name}
//                                                 onChange={(e) =>
//                                                     setNewCustomer({
//                                                         ...newCustomer,
//                                                         name: e.target.value,
//                                                     })
//                                                 }
//                                                 required
//                                             />
//                                         </div>
//                                         <div>
//                                             <label className="block mb-1">Email</label>
//                                             <input
//                                                 type="email"
//                                                 className="form-input w-full"
//                                                 value={newCustomer.email}
//                                                 onChange={(e) =>
//                                                     setNewCustomer({
//                                                         ...newCustomer,
//                                                         email: e.target.value,
//                                                     })
//                                                 }
//                                                 required
//                                             />
//                                         </div>
//                                     </div>

//                                     {/* Phone and Alternative Number in the second row */}
//                                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                                         <div>
//                                             <label className="block mb-1">Phone Number</label>
//                                             <input
//                                                 type="text"
//                                                 className="form-input w-full"
//                                                 value={newCustomer.phone}
//                                                 onChange={(e) =>
//                                                     setNewCustomer({
//                                                         ...newCustomer,
//                                                         phone: e.target.value,
//                                                     })
//                                                 }
//                                                 required
//                                             />
//                                         </div>
//                                         <div>
//                                             <label className="block mb-1">Alternative</label>
//                                             <input
//                                                 type="number"
//                                                 className="form-input w-full"
//                                                 value={newCustomer.alternative}
//                                                 onChange={(e) =>
//                                                     setNewCustomer({
//                                                         ...newCustomer,
//                                                         alternative: Number(e.target.value),
//                                                     })
//                                                 }
//                                                 required
//                                             />
//                                         </div>
//                                     </div>

//                                     {/* Address and Joining Date in the third row */}
//                                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                                         <div>
//                                             <label className="block mb-1">Address</label>
//                                             <input
//                                                 type="text"
//                                                 className="form-input w-full"
//                                                 value={newCustomer.address}
//                                                 onChange={(e) =>
//                                                     setNewCustomer({
//                                                         ...newCustomer,
//                                                         address: e.target.value,
//                                                     })
//                                                 }
//                                                 required
//                                             />
//                                         </div>
//                                         <div>
//                                             <label className="block mb-1">Joining Date</label>
//                                             <input
//                                                 type="date"
//                                                 className="form-input w-full"
//                                                 value={newCustomer.joining}
//                                                 onChange={(e) =>
//                                                     setNewCustomer({
//                                                         ...newCustomer,
//                                                         joining: e.target.value,
//                                                     })
//                                                 }
//                                                 required
//                                             />
//                                         </div>
//                                     </div>

//                                     {/* Customer Type in the last row */}
//                                     <div>
//                                         <label className="block mb-1">Type</label>
//                                         <input
//                                             type="text"
//                                             className="form-input w-full"
//                                             value={newCustomer.type}
//                                             onChange={(e) =>
//                                                 setNewCustomer({
//                                                     ...newCustomer,
//                                                     type: e.target.value,
//                                                 })
//                                             }
//                                             required
//                                         />
//                                     </div>
//                                 </div>
//                                 <div className="flex justify-end mt-4 space-x-2">
//                                     <button type="button" className="btn btn-secondary" onClick={() => setShowPopup(false)}>
//                                         Close
//                                     </button>
//                                     <button type="submit" className="btn btn-primary">
//                                         {editing ? 'Update Customer' : 'Add Customer'}
//                                     </button>
//                                 </div>
//                             </form>
//                         </div>
//                     </div>
//                 </div>
//             )}
//         </div>
//     );
// };

// export default Permissions;

import React from 'react'

const Permissions = () => {
  return (
    <div>Permissions</div>
  )
}

export default Permissions