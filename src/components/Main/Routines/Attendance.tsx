import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useNavigate } from 'react-router-dom';
import IconSearch from '../../../components/Icon/IconSearch';
import IconCalendar from '../../../components/Icon/IconCalendar';
import IconUser from '../../../components/Icon/IconUser';
import IconDownload from '../../../components/Icon/IconDownload';

interface AttendanceRecord {
    date: string;
    status: 'present' | 'absent' | 'late' | 'leave';
    checkIn?: string;
    checkOut?: string;
}

interface Employee {
    id: number;
    name: string;
    designation: string;
    department: string;
    avatar: string;
    records: AttendanceRecord[];
}

const Attendance = () => {
    const [view, setView] = useState<'card' | 'list'>('list');
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);

    const [filters, setFilters] = useState({
        designation: '',
        department: '',
        manager: '',
        startDate: new Date(),
        endDate: new Date(),
        searchTerm: '',
    });

    const [attendance, setAttendance] = useState<Employee[]>([
        {
            id: 1,
            name: 'Jeremy Hawkins',
            designation: 'Senior Developer',
            department: 'IT',
            avatar: '/assets/images/user-profile.jpeg',
            records: [
                { date: '2024-01-15', status: 'present', checkIn: '09:00', checkOut: '17:00' },
                { date: '2024-01-16', status: 'late', checkIn: '10:15', checkOut: '17:30' },
                { date: '2024-01-17', status: 'present', checkIn: '08:45', checkOut: '17:00' },
            ],
        },
        {
            id: 2,
            name: 'Lucy Hunter',
            designation: 'UI Designer',
            department: 'Design',
            avatar: '/assets/images/user-profile.jpeg',
            records: [
                { date: '2024-01-15', status: 'present', checkIn: '08:45', checkOut: '17:15' },
                { date: '2024-01-16', status: 'present', checkIn: '09:00', checkOut: '17:00' },
                { date: '2024-01-17', status: 'leave', checkIn: undefined, checkOut: undefined },
            ],
        },
    ]);

    const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFilters({ ...filters, [name]: value });
    };

    const handleExport = () => {
        try {
            const headers = ['Date', 'Employee', 'Department', 'Status', 'Check In', 'Check Out'];
            const csvData = [
                headers.join(','),
                ...attendance.flatMap((emp) => emp.records.map((record) => [record.date, emp.name, emp.department, record.status, record.checkIn || '', record.checkOut || ''].join(','))),
            ].join('\n');

            const blob = new Blob([csvData], { type: 'text/csv' });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `attendance_report_${new Date().toISOString().split('T')[0]}.csv`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (error) {
            console.error('Export failed:', error);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'present':
                return 'bg-success/20 text-success';
            case 'absent':
                return 'bg-danger/20 text-danger';
            case 'late':
                return 'bg-warning/20 text-warning';
            case 'leave':
                return 'bg-info/20 text-info';
            default:
                return 'bg-gray-100 text-gray-500';
        }
    };

    const getAttendanceStats = () => {
        let total = 0,
            present = 0,
            late = 0,
            absent = 0;

        attendance.forEach((emp) => {
            emp.records.forEach((record) => {
                total++;
                if (record.status === 'present') present++;
                if (record.status === 'late') late++;
                if (record.status === 'absent') absent++;
            });
        });

        return { total, present, late, absent };
    };

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold">Staff Attendance</h2>
                    <p className="text-gray-500 mt-1">Track and manage employee attendance</p>
                </div>

                <div className="flex items-center gap-3">
                    <button onClick={() => navigate('/mark_holidays')} className="btn btn-success gap-2">
                        <IconCalendar className="w-5 h-5" />
                        Mark Holiday
                    </button>
                    <button onClick={() => navigate('/view-marked-holidays')} className="btn btn-danger gap-2">
                        <IconCalendar className="w-5 h-5" />
                        View Holidays
                    </button>

                    <div className="flex items-center bg-white dark:bg-[#1c232f] rounded-lg shadow-sm p-1">
                        <button onClick={() => setView('list')} className={`p-2 ${view === 'list' ? 'bg-primary/10 text-primary' : 'text-gray-500'} rounded transition-colors`}>
                            <IconUser className="w-5 h-5" />
                        </button>
                        <button onClick={() => setView('card')} className={`p-2 ${view === 'card' ? 'bg-primary/10 text-primary' : 'text-gray-500'} rounded transition-colors`}>
                            <IconCalendar className="w-5 h-5" />
                        </button>
                    </div>

                    <button onClick={handleExport} className="btn btn-primary gap-2">
                        <IconDownload className="w-5 h-5" />
                        Export
                    </button>
                </div>
            </div>

            {/* Search and Filters */}
            <div className="bg-white dark:bg-[#1c232f] rounded-lg shadow-sm p-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search employee..."
                            value={filters.searchTerm}
                            onChange={(e) => setFilters({ ...filters, searchTerm: e.target.value })}
                            className="form-input pl-10"
                        />
                        <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    </div>

                    <select name="department" value={filters.department} onChange={handleFilterChange} className="form-select">
                        <option value="">All Departments</option>
                        <option value="IT">IT</option>
                        <option value="Design">Design</option>
                        <option value="HR">HR</option>
                    </select>

                    <DatePicker selected={filters.startDate} onChange={(date: Date) => setFilters({ ...filters, startDate: date })} className="form-input" placeholderText="Select date" />
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {[
                    { label: 'Total', value: getAttendanceStats().total, color: 'text-primary' },
                    { label: 'Present', value: getAttendanceStats().present, color: 'text-success' },
                    { label: 'Late', value: getAttendanceStats().late, color: 'text-warning' },
                    { label: 'Absent', value: getAttendanceStats().absent, color: 'text-danger' },
                ].map((stat) => (
                    <div key={stat.label} className="bg-white dark:bg-[#1c232f] rounded-lg shadow-sm p-4">
                        <div className="text-gray-500 mb-2">{stat.label}</div>
                        <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
                        <div className="text-gray-400 text-sm mt-1">{((stat.value / getAttendanceStats().total) * 100).toFixed(1)}%</div>
                    </div>
                ))}
            </div>

            {view === 'list' ? (
                // List View
                <div className="bg-white dark:bg-[#1c232f] rounded-lg shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b dark:border-gray-700">
                                    <th className="text-left p-4">Employee</th>
                                    <th className="text-left p-4">Department</th>
                                    <th className="text-center p-4">Status</th>
                                    <th className="text-center p-4">Check In</th>
                                    <th className="text-center p-4">Check Out</th>
                                    <th className="text-center p-4">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {attendance.map((emp) => (
                                    <tr key={emp.id} className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                                        <td className="p-4">
                                            <div className="flex items-center gap-3">
                                                <img src={emp.avatar} alt={emp.name} className="w-10 h-10 rounded-full object-cover" />
                                                <div>
                                                    <div className="font-medium">{emp.name}</div>
                                                    <div className="text-gray-500 text-sm">{emp.designation}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4">{emp.department}</td>
                                        <td className="p-4">
                                            {emp.records[0] && <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(emp.records[0].status)}`}>{emp.records[0].status}</span>}
                                        </td>
                                        <td className="p-4 text-center">{emp.records[0]?.checkIn || '-'}</td>
                                        <td className="p-4 text-center">{emp.records[0]?.checkOut || '-'}</td>
                                        <td className="p-4 text-center">
                                            <button className="text-primary hover:text-primary-dark">View Details</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            ) : (
                // Card View
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {attendance.map((emp) => (
                        <div key={emp.id} className="bg-white dark:bg-[#1c232f] rounded-lg shadow-sm p-4">
                            <div className="flex items-center gap-4 mb-4">
                                <img src={emp.avatar} alt={emp.name} className="w-12 h-12 rounded-full object-cover" />
                                <div>
                                    <h3 className="font-medium">{emp.name}</h3>
                                    <p className="text-gray-500 text-sm">{emp.designation}</p>
                                </div>
                            </div>

                            <div className="space-y-3">
                                {emp.records.map((record, idx) => (
                                    <div key={idx} className="flex items-center justify-between p-2 rounded-lg border dark:border-gray-700">
                                        <div>
                                            <div className="text-sm text-gray-500">{record.date}</div>
                                            <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium mt-1 ${getStatusColor(record.status)}`}>{record.status}</span>
                                        </div>
                                        {record.checkIn && (
                                            <div className="text-right">
                                                <div className="text-xs text-gray-500">Check In</div>
                                                <div className="font-medium">{record.checkIn}</div>
                                            </div>
                                        )}
                                        {record.checkOut && (
                                            <div className="text-right">
                                                <div className="text-xs text-gray-500">Check Out</div>
                                                <div className="font-medium">{record.checkOut}</div>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Attendance;
