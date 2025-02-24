import React, { useState } from 'react';

type EmployeeContact = {
    id: number;
    department: string;
    designation: string;
    name: string;
    email: string;
    primaryPhone: string;
    alternatePhone: string;
    emergencyContactAddress: string;
};

// Dummy data for Employee Contact Directory
const initialContacts: EmployeeContact[] = [
    {
        id: 1,
        department: 'Technical',
        designation: 'Software Engineer',
        name: 'John Doe',
        email: 'johndoe@example.com',
        primaryPhone: '3014971047',
        alternatePhone: '3014971048',
        emergencyContactAddress: '123 Main St, City A',
    },
    {
        id: 2,
        department: 'Sales',
        designation: 'Sales Manager',
        name: 'Jane Smith',
        email: 'janesmith@example.com',
        primaryPhone: '3014971050',
        alternatePhone: '3014971051',
        emergencyContactAddress: '456 Elm St, City B',
    },
    {
        id: 3,
        department: 'Engineering',
        designation: 'Civil Engineer',
        name: 'Bob Johnson',
        email: 'bobjohnson@example.com',
        primaryPhone: '3014971052',
        alternatePhone: '3014971053',
        emergencyContactAddress: '789 Oak St, City C',
    },
];

const Employee_Contact_Directory: React.FC = () => {
    const [contacts, setContacts] = useState<EmployeeContact[]>(initialContacts);
    const [search, setSearch] = useState<string>('');
    const [selectedDepartment, setSelectedDepartment] = useState<string>('All Departments');
    const [selectedDesignation, setSelectedDesignation] = useState<string>('All Designations');

    // Extract unique departments and designations
    const departments = ['All Departments', ...new Set(initialContacts.map((contact) => contact.department))];
    const designations = ['All Designations', ...new Set(initialContacts.map((contact) => contact.designation))];

    // Handle search input
    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
    };

    // Handle department filter
    const handleDepartmentFilter = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedDepartment(e.target.value);
    };

    // Handle designation filter
    const handleDesignationFilter = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedDesignation(e.target.value);
    };

    // Filter contacts based on search query, department, and designation
    const filteredContacts = contacts.filter((contact) => {
        const matchesSearch =
            contact.department.toLowerCase().includes(search.toLowerCase()) ||
            contact.designation.toLowerCase().includes(search.toLowerCase()) ||
            contact.name.toLowerCase().includes(search.toLowerCase());

        const matchesDepartment =
            selectedDepartment === 'All Departments' || contact.department === selectedDepartment;

        const matchesDesignation =
            selectedDesignation === 'All Designations' || contact.designation === selectedDesignation;

        return matchesSearch && matchesDepartment && matchesDesignation;
    });

    return (
        <div className="w-full bg-white p-4 dark:bg-black">
            <h1 className="text-left my-4 text-xl font-semibold">Employee Contact Directory</h1>
            <div className="flex justify-between items-center mb-3 gap-4">
                {/* Search Input */}
                <input
                    type="text"
                    placeholder={`Search: ${filteredContacts.length} records`}
                    className="form-control w-1/3 p-2 dark:bg-black"
                    value={search}
                    onChange={handleSearch}
                />

                {/* Department Dropdown */}
                <select
                    className="form-select p-2 w-1/4 dark:bg-black"
                    value={selectedDepartment}
                    onChange={handleDepartmentFilter}
                >
                    {departments.map((dept, index) => (
                        <option key={index} value={dept}>
                            {dept}
                        </option>
                    ))}
                </select>

                {/* Designation Dropdown */}
                <select
                    className="form-select p-2 w-1/4 dark:bg-black"
                    value={selectedDesignation}
                    onChange={handleDesignationFilter}
                >
                    {designations.map((desg, index) => (
                        <option key={index} value={desg}>
                            {desg}
                        </option>
                    ))}
                </select>
            </div>

            <div className="overflow-auto">
                <table className="table-auto border-collapse w-full text-center">
                    <thead>
                        <tr>
                            <th>Department</th>
                            <th>Designation</th>
                            <th>Employee Name</th>
                            <th>Email</th>
                            <th>Primary Phone</th>
                            <th>Alternate Phone</th>
                            <th>Emergency Contact Address</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredContacts.map((contact) => (
                            <tr key={contact.id}>
                                <td>{contact.department}</td>
                                <td>{contact.designation}</td>
                                <td>{contact.name}</td>
                                <td>{contact.email}</td>
                                <td>{contact.primaryPhone}</td>
                                <td>{contact.alternatePhone}</td>
                                <td>{contact.emergencyContactAddress}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Employee_Contact_Directory;