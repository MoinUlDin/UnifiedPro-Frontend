import React, { useState } from 'react';
import 'tailwindcss/tailwind.css';
// import feather from 'feather-icons';

// Component for Attendance Management
const My_Attendance: React.FC = () => {
    // State to manage date inputs
    const [fromDate, setFromDate] = useState('2024-10-23');
    const [toDate, setToDate] = useState('2024-10-30');

    // Functions for handling button clicks
    const handleExport = () => {
        alert('Exporting to Excel...');
    };

    const handleFilterApply = () => {
        alert('Applying filters...');
    };

    const handleActionClick = (action: string) => {
        alert(`${action} clicked`);
    };

    // Initialize Feather Icons after rendering
    // React.useEffect(() => {
    //     feather.replace();
    // }, []);

    return (
        <div className="container mx-auto max-w-7xl px-4 py-8 ">
            {/* Header */}
            <div className="header flex justify-between items-center mb-8 bg-white p-4 rounded-md shadow-sm dark:bg-[#0e1726]">
                <h1 className="text-lg font-bold ">Attendance Management</h1>
                <button className="btn btn-primary flex items-center gap-2" onClick={handleExport}>
                    <i className="bi bi-download"></i> Export to Excel
                </button>
            </div>

            {/* Summary Cards */}
            <div className="summary-cards grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8 ">
                {[
                    { title: 'Present Days', value: 22 },
                    { title: 'Absent Days', value: 3 },
                    { title: 'Late Arrivals', value: 2 },
                    { title: 'Leave Days', value: 1 },
                ].map((card, index) => (
                    <div key={index} className="card bg-white p-6 rounded-md shadow-sm dark:bg-[#0e1726]">
                        <div className="card-title text-sm text-gray-500 ">{card.title}</div>
                        <div className="card-value text-2xl font-semibold text-gray-800 dark:text-gray-500">{card.value}</div>
                    </div>
                ))}
            </div>

            {/* Filters */}
            <div className="filters flex gap-4 items-center justify-between bg-white p-4 rounded-md mb-4 shadow-sm dark:bg-[#0e1726]">
                <div className="date-filter flex items-center gap-2">
                    <label className="text-gray-600">From:</label>
                    <input type="date" className="border border-gray-300 rounded px-2 py-1 dark:bg-gray-700 dark:border-none" value={fromDate} onChange={(e) => setFromDate(e.target.value)} />
                    {/* </div>
                <div className="date-filter flex items-center gap-2"> */}
                    <label className="text-gray-600 ml-2">To:</label>
                    <input type="date" className="border border-gray-300 rounded px-2 py-1  dark:bg-gray-700 dark:border-none" value={toDate} onChange={(e) => setToDate(e.target.value)} />
                </div>
                <button className="btn btn-primary" onClick={handleFilterApply}>
                    Apply Filter
                </button>
            </div>

            {/* Attendance Table */}
            <div className="attendance-table bg-white rounded-md shadow-sm overflow-hidden dark:bg-[#0e1726] ">
                <table className="w-full border-collapse  dark:bg-gray-700">
                    <thead>
                        <tr>
                            {['Date', 'Employee', 'Mark In', 'Mark Out', 'Status', 'Working Hours', 'Actions'].map((header, index) => (
                                <th key={index} className="p-4 bg-gray-100 text-gray-600 dark:text-gray-400 text-left dark:bg-[#0e1726]">
                                    {header}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {[
                            { date: 'Oct 23, 2024', employee: 'Sharyar Nisar', markIn: '09:00 AM', markOut: '05:00 PM', status: 'Present', statusClass: 'status-present', hours: '8h 00m' },
                            { date: 'Oct 24, 2024', employee: 'Sharyar Nisar', markIn: '09:30 AM', markOut: '05:30 PM', status: 'Late', statusClass: 'status-late', hours: '8h 00m' },
                            { date: 'Oct 25, 2024', employee: 'Sharyar Nisar', markIn: '-', markOut: '-', status: 'Leave', statusClass: 'status-leave', hours: '-' },
                        ].map((row, index) => (
                            <tr key={index}>
                                <td className="p-4 border-b border-gray-200 dark:bg-[#0e1726] dark:border-none">{row.date}</td>
                                <td className="p-4 border-b border-gray-200 dark:bg-[#0e1726] dark:border-none">{row.employee}</td>
                                <td className="p-4 border-b border-gray-200  dark:bg-[#0e1726] dark:border-none">{row.markIn}</td>
                                <td className="p-4 border-b border-gray-200  dark:bg-[#0e1726] dark:border-none">{row.markOut}</td>
                                <td className="p-4 border-b border-gray-200 dark:bg-[#0e1726] dark:border-none">
                                    <span className={`status ${row.statusClass} px-3 py-1 rounded-full text-sm`}>{row.status}</span>
                                </td>
                                <td className="p-4 border-b border-gray-200 dark:bg-[#0e1726]  dark:border-none">{row.hours}</td>
                                <td className="p-4 border-b border-gray-200 dark:bg-[#0e1726] dark:border-none">
                                    <div className="actions flex gap-2">
                                        <button className="icon-btn bg-gray-100 p-2 rounded hover:bg-gray-200 dark:bg-[#0e1726]" title="Edit" onClick={() => handleActionClick('Edit')}>
                                            <i className="bi bi-pencil-square text-blue-500"></i>
                                        </button>
                                        <button className="icon-btn bg-gray-100 p-2 rounded hover:bg-gray-200 dark:bg-[#0e1726]" title="Delete" onClick={() => handleActionClick('Delete')}>
                                            <i className="bi bi-trash3-fill text-red-500 "></i>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default My_Attendance;
