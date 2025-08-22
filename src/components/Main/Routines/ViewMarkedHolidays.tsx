import React, { useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useNavigate } from 'react-router-dom';
import EmployeeServices from '../../../services/EmployeeServices';
import { MarkedHolidaysType } from '../../../constantTypes/EmployeeRelated';

const ViewMarkedHolidays = () => {
    const navigate = useNavigate();
    const [holidays, setHolidays] = useState<MarkedHolidaysType[]>([]);
    const [filters, setFilters] = useState({
        startDate: new Date(),
        endDate: new Date(),
        searchTerm: '',
        holidayType: 'all',
    });
    const [isLoading, setIsLoading] = useState(false);

    const FetchHolidays = () => {
        EmployeeServices.FetchHolidays()
            .then((r) => {
                setHolidays(r);
            })
            .catch((e) => {
                console.log(e);
            });
    };
    useEffect(() => {
        FetchHolidays();
    }, []);
    const handleDateChange = (name: string, date: Date) => {
        setFilters({ ...filters, [name]: date });
    };

    const handleFilter = () => {
        setIsLoading(true);
        // Simulate API call
        setTimeout(() => {
            setIsLoading(false);
        }, 500);
    };

    const handleExport = () => {
        // Add export logic here
        console.log('Exporting data...');
    };

    const getStatusColor = (type: string) => {
        switch (type.toLowerCase()) {
            case 'public':
                return 'bg-success/20 text-success';
            case 'religious':
                return 'bg-warning/20 text-warning';
            case 'special':
                return 'bg-info/20 text-info';
            default:
                return 'bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-300';
        }
    };

    return (
        <div className="panel p-0">
            {/* Header */}
            <div className="mb-5 flex flex-wrap items-center justify-between gap-4 border-b border-[#e0e6ed] p-4 dark:border-[#1b2e4b]">
                <div>
                    <h2 className="text-xl font-bold">Marked Holidays</h2>
                    <p className="mt-1 text-gray-500 dark:text-gray-400">View and manage organization holidays</p>
                </div>
                <div className="flex items-center gap-3">
                    <button onClick={() => navigate('/mark_holidays')} className="btn btn-primary gap-2">
                        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 6V18M18 12H6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                        </svg>
                        Mark Holiday
                    </button>
                    <button onClick={handleExport} className="btn btn-outline-primary gap-2">
                        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 3V16M12 16L16 11M12 16L8 11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M3 21H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                        </svg>
                        Export
                    </button>
                </div>
            </div>

            {/* Filters */}
            <div className="p-4">
                <div className="mb-5 grid grid-cols-1 gap-4 lg:grid-cols-4">
                    <div>
                        <label className="mb-2 block text-sm font-medium">Start Date</label>
                        <DatePicker selected={filters.startDate} onChange={(date) => handleDateChange('startDate', date!)} className="form-input" placeholderText="Select start date" />
                    </div>
                    <div>
                        <label className="mb-2 block text-sm font-medium">End Date</label>
                        <DatePicker selected={filters.endDate} onChange={(date) => handleDateChange('endDate', date!)} className="form-input" placeholderText="Select end date" />
                    </div>
                    <div>
                        <label className="mb-2 block text-sm font-medium">Holiday Type</label>
                        <select value={filters.holidayType} onChange={(e) => setFilters({ ...filters, holidayType: e.target.value })} className="form-select">
                            <option value="all">All Types</option>
                            <option value="public">Public Holiday</option>
                            <option value="religious">Religious Holiday</option>
                            <option value="special">Special Holiday</option>
                        </select>
                    </div>
                    <div>
                        <label className="mb-2 block text-sm font-medium">Search</label>
                        <input
                            type="text"
                            placeholder="Search holidays..."
                            value={filters.searchTerm}
                            onChange={(e) => setFilters({ ...filters, searchTerm: e.target.value })}
                            className="form-input"
                        />
                    </div>
                </div>

                <button onClick={handleFilter} disabled={isLoading} className="btn btn-primary">
                    {isLoading ? (
                        <>
                            <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path
                                    className="opacity-75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                ></path>
                            </svg>
                            <span className="ml-2">Loading...</span>
                        </>
                    ) : (
                        'Apply Filters'
                    )}
                </button>
            </div>

            {/* Table */}
            <div className="p-4">
                <div className="mb-5 overflow-auto">
                    <table className="w-full table-auto">
                        <thead>
                            <tr className="bg-[#f7f7f7] dark:bg-[#1a2941]">
                                <th className="px-4 py-3 text-left text-sm font-semibold">Date</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold">Type</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold">Description</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {holidays.map((holiday, idx) => (
                                <tr key={idx} className="group border-b border-[#e0e6ed] dark:border-[#1b2e4b] hover:bg-[#f7f7f7] dark:hover:bg-[#1a2941]">
                                    <td className="px-4 py-3 text-sm">{holiday.date}</td>
                                    <td className="px-4 py-3 text-sm">
                                        <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusColor(holiday.holiday_type)}`}>{holiday.holiday_type}</span>
                                    </td>
                                    <td className="px-4 py-3 text-sm">{holiday.remarks}</td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-2">
                                            <button className="btn btn-sm btn-outline-primary">Edit</button>
                                            <button className="btn btn-sm btn-outline-danger">Delete</button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                        Showing 1 to {holidays.length} of {holidays.length} entries
                    </div>
                    <div className="flex items-center gap-1">
                        <button className="btn btn-outline-primary btn-sm disabled:opacity-60" disabled>
                            Previous
                        </button>
                        <button className="btn btn-outline-primary btn-sm">1</button>
                        <button className="btn btn-outline-primary btn-sm disabled:opacity-60" disabled>
                            Next
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ViewMarkedHolidays;
