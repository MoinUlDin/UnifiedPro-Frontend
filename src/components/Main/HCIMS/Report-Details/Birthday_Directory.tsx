import React, { useState } from 'react';

type BirthdayEmployee = {
    id: number;
    name: string;
    birthdate: string;
    department: string;
    designation: string;
};

// Dummy data for Birthday Directory
const initialBirthdays: BirthdayEmployee[] = [
    { id: 1, name: 'Alice Johnson', birthdate: '1990-01-15', department: 'HR', designation: 'HR Manager' },
    { id: 2, name: 'David Smith', birthdate: '1985-05-23', department: 'Technical', designation: 'Software Engineer' },
    { id: 3, name: 'Emily Brown', birthdate: '1993-08-09', department: 'Marketing', designation: 'Marketing Specialist' },
    { id: 4, name: 'Chris Wilson', birthdate: '1988-12-19', department: 'Engineering', designation: 'Project Engineer' },
    { id: 5, name: 'Sophia White', birthdate: '1995-03-17', department: 'Technical', designation: 'Frontend Developer' },
];

const Birthday_Directory: React.FC = () => {
    const [birthdays, setBirthdays] = useState<BirthdayEmployee[]>(initialBirthdays);
    const [search, setSearch] = useState<string>('');
    const [selectedDepartment, setSelectedDepartment] = useState<string>('All Departments');
    const [selectedDesignation, setSelectedDesignation] = useState<string>('All Designations');

    // Extract unique departments and designations from the data
    const departments = ['All Departments', ...new Set(initialBirthdays.map((employee) => employee.department))];
    const designations = ['All Designations', ...new Set(initialBirthdays.map((employee) => employee.designation))];

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

    // Filter employees based on search query, department, and designation selection
    const filteredBirthdays = birthdays.filter((employee) => {
        const matchesSearch =
            employee.name.toLowerCase().includes(search.toLowerCase()) ||
            employee.designation.toLowerCase().includes(search.toLowerCase());

        const matchesDepartment =
            selectedDepartment === 'All Departments' || employee.department === selectedDepartment;

        const matchesDesignation =
            selectedDesignation === 'All Designations' || employee.designation === selectedDesignation;

        return matchesSearch && matchesDepartment && matchesDesignation;
    });

    return (
        <div className="w-full bg-white p-4 dark:bg-black">
            <h1 className="text-left my-4 text-xl font-semibold">Birthday Directory</h1>
            <div className="flex justify-between items-center mb-3 gap-4">
                {/* Search Input */}
                <input
                    type="text"
                    placeholder={`Search employees: ${filteredBirthdays.length} records`}
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
                            <th>Employee Name</th>
                            <th>Birthdate</th>
                            <th>Department</th>
                            <th>Designation</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredBirthdays.map((employee) => (
                            <tr key={employee.id}>
                                <td>{employee.name}</td>
                                <td>{employee.birthdate}</td>
                                <td>{employee.department}</td>
                                <td>{employee.designation}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Birthday_Directory;