import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addHoliday } from '../../../store/holidaySlice';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import axios from 'axios';

interface Holiday {
    date: Date;
    type: string;
    remarks: string;
}

const MarkHoliday = () => {
    const [selectedDates, setSelectedDates] = useState<Date[]>([]);
    const [holidayType, setHolidayType] = useState('public');
    const [remarks, setRemarks] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const holidayTypes = [
        { id: 'public', label: 'Public Holiday', icon: '📅' },
        { id: 'religious', label: 'Religious Holiday', icon: '🕌' },
        { id: 'special', label: 'Special Holiday', icon: '🎉' },
        { id: 'other', label: 'Other', icon: '📝' },
    ];

    const handleDateChange = (date: Date) => {
        setSelectedDates((prev) => {
            const dateExists = prev.find((d) => d.toDateString() === date.toDateString());
            if (dateExists) {
                return prev.filter((d) => d.toDateString() !== date.toDateString());
            }
            return [...prev, date];
        });
    };

    const validateForm = () => {
        if (selectedDates.length === 0) {
            setError('Please select at least one date');
            return false;
        }
        if (!holidayType) {
            setError('Please select a holiday type');
            return false;
        }
        if (!remarks.trim()) {
            setError('Please enter remarks');
            return false;
        }
        return true;
    };

    const handleSubmit = async () => {
        setError('');
        setSuccess('');

        if (!validateForm()) return;

        setLoading(true);
        try {
            const holidays: Holiday[] = selectedDates.map((date) => ({
                date,
                type: holidayType,
                remarks,
            }));

            const response = await axios.post(
                'https://success365-backend-86f1c1-145db9-65-108-245-140.traefik.me/routine-tasks/holidays/',
                {
                    holiday_dates: ['2025-03-29'],
                },
                {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}`, 'Content-Type': 'application/json' },
                }
            );
            dispatch(addHoliday(holidays));

            setSuccess('Holidays marked successfully!');
            setTimeout(() => {
                navigate('/staff_attendence');
            }, 1500);
        } catch (err) {
            setError('Failed to mark holidays. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="panel p-6 mx-auto max-w-7xl">
            {/* Header Section */}
            <div className="flex flex-col items-center justify-center  mb-8 relative">
                <div className="  absolute left-0 top-0">
                    <button onClick={() => navigate('/staff_attendence')} className="btn btn-outline-primary p-2 rounded-full">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </button>
                </div>
                <h2 className="text-3xl font-bold mb-2">Mark Holiday</h2>
                <p className="text-gray-500 dark:text-gray-400">Manage and schedule holidays for your organization</p>
            </div>

            {/* Main Content */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left Column - Calendar */}
                <div className="space-y-3">
                    <div className="bg-white dark:bg-[#1c232f] flex items-center justify-center flex-col md:block rounded-lg shadow-md p-6">
                        <h3 className="text-lg font-semibold mb-4 flex items-center">
                            <span className="mr-2">📅</span>
                            Select Dates
                        </h3>
                        <DatePicker selected={null} onChange={handleDateChange} highlightDates={selectedDates} inline minDate={new Date()} calendarClassName="border-0 " className="w-full" />
                    </div>

                    {selectedDates.length > 0 && (
                        <div className="bg-white dark:bg-[#1c232f] rounded-lg shadow-md p-6">
                            <h3 className="text-lg font-semibold mb-4 flex items-center">
                                <span className="mr-2">✨</span>
                                Selected Dates
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {selectedDates.map((date) => (
                                    <span key={date.toISOString()} className="bg-primary/10 text-primary px-3 py-1.5 rounded-full text-sm font-medium">
                                        {date.toLocaleDateString(undefined, {
                                            weekday: 'short',
                                            month: 'short',
                                            day: 'numeric',
                                        })}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Right Column - Form */}
                <div className="space-y-6">
                    {/* Messages */}
                    {error && (
                        <div className="bg-red-50 dark:bg-red-500/20 border-l-4 border-red-500 p-4 rounded-lg">
                            <div className="flex">
                                <div className="flex-shrink-0">
                                    <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                                        <path
                                            fillRule="evenodd"
                                            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                </div>
                                <div className="ml-3">
                                    <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {success && (
                        <div className="bg-green-50 dark:bg-green-500/20 border-l-4 border-green-500 p-4 rounded-lg">
                            <div className="flex">
                                <div className="flex-shrink-0">
                                    <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                                        <path
                                            fillRule="evenodd"
                                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                </div>
                                <div className="ml-3">
                                    <p className="text-sm text-green-800 dark:text-green-200">{success}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Holiday Type */}
                    <div className="bg-white dark:bg-[#1c232f]  rounded-lg shadow-md p-6">
                        <h3 className="text-lg font-semibold mb-4">Holiday Type</h3>
                        <div className="grid md:grid-cols-2 grid-cols-1 gap-4">
                            {holidayTypes.map((type) => (
                                <label
                                    key={type.id}
                                    className={`flex items-center p-4 rounded-lg border-2 transition-all duration-300 ${
                                        holidayType === type.id ? 'border-primary bg-primary/5 dark:bg-primary/10' : 'border-gray-200 dark:border-gray-700 hover:border-primary/50'
                                    } cursor-pointer`}
                                >
                                    <input type="radio" name="holidayType" value={type.id} checked={holidayType === type.id} onChange={(e) => setHolidayType(e.target.value)} className="hidden" />
                                    <span className="text-2xl mr-3">{type.icon}</span>
                                    <span className={`text-sm font-medium ${holidayType === type.id ? 'text-primary' : 'text-gray-600 dark:text-gray-400'}`}>{type.label}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Remarks */}
                    <div className="bg-white dark:bg-[#1c232f] rounded-lg shadow-md p-6">
                        <h3 className="text-lg font-semibold mb-4">Holiday Description</h3>
                        <textarea
                            value={remarks}
                            onChange={(e) => setRemarks(e.target.value)}
                            placeholder="Enter holiday description or any additional notes..."
                            className="form-textarea w-full bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded-lg"
                            rows={4}
                        />
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-end gap-4 mt-6">
                        <button type="button" onClick={() => navigate('/staff_attendence')} className="btn btn-outline-danger px-6">
                            Cancel
                        </button>
                        <button onClick={handleSubmit} disabled={loading} className={`btn btn-primary px-6 ${loading ? 'opacity-75 cursor-not-allowed' : ''}`}>
                            {loading ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path
                                            className="opacity-75"
                                            fill="currentColor"
                                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                        ></path>
                                    </svg>
                                    Processing...
                                </>
                            ) : (
                                'Mark Holidays'
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MarkHoliday;
