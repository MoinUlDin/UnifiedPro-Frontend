import React, { useState, useEffect } from 'react';
import SalaryServices from '../../../services/SalaryServices';
import EmployeeServices from '../../../services/EmployeeServices';
import toast from 'react-hot-toast';

interface LeaveType {
    id: number;
    name: string;
}

interface LeaveFormData {
    id?: number;
    leave_type: number | null;
    start_date: string;
    end_date: string;
    description: string;
}

interface LeaveFormModalProps {
    onClose: () => void;
    onSuccess: () => void;
    initialData: LeaveFormData | null;
    isEditing: boolean;
}
const toInputDatetime = (iso?: string | null) => {
    if (!iso) return '';
    const d = new Date(iso); // parse ISO (with timezone) into a Date
    const pad = (n: number) => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
};

const LeaveRequestPopup: React.FC<LeaveFormModalProps> = ({ onClose, onSuccess, initialData = null, isEditing = false }) => {
    const [leaveTypes, setLeaveTypes] = useState<LeaveType[]>([]);
    const [formData, setFormData] = useState<LeaveFormData>({
        leave_type: null,
        start_date: '',
        end_date: '',
        description: '',
    });

    const FetchLeaveTypes = () => {
        SalaryServices.FetchLeaveTypes()
            .then((r) => {
                setLeaveTypes(r);
            })
            .catch((e) => {
                console.log(e);
            });
    };
    useEffect(() => {
        FetchLeaveTypes();

        // Set initial data if editing
        if (initialData) {
            setFormData({
                leave_type: (initialData as any).leave_type ?? null,
                start_date: toInputDatetime((initialData as any).start_date ?? null),
                end_date: toInputDatetime((initialData as any).end_date ?? null),
                description: (initialData as any).description ?? '',
            });
        }
        console.log('initialData: ', initialData);
    }, [initialData]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('form: ', formData);
        const payload = {
            ...formData,
            start_date: formData.start_date ? new Date(formData.start_date).toISOString() : null,
            end_date: formData.end_date ? new Date(formData.end_date).toISOString() : null,
            leave_type: formData.leave_type,
            description: formData.description,
        };
        // return;
        if (!isEditing) {
            EmployeeServices.AddLeaveRequests(payload)
                .then(() => {
                    toast.success('Request Submitted Successfully', { duration: 4000 });
                    onSuccess(); // Call on success
                    onClose();
                })
                .catch((e) => {
                    toast.error('error Adding:', { duration: 4000 });
                });
        } else {
            const id = initialData?.id;
            if (!id) return;
            EmployeeServices.UpdateLeaveRequests(id, payload)
                .then(() => {
                    toast.success('Request Updated Successfully', { duration: 4000 });
                    onSuccess(); // Call on success
                    onClose();
                })
                .catch((e) => {
                    toast.error('error Updating:', { duration: 4000 });
                });
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm">
            <div className="w-full max-w-2xl mt-4 max-h-screen overflow-y-auto p-8 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl shadow-2xl border border-indigo-200 transform scale-100 transition-all duration-300">
                <h2 className="text-2xl font-bold text-indigo-800 mb-6 text-center">{isEditing ? 'Edit Leave Request' : 'New Leave Request'}</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Leave Type Dropdown */}
                    <div>
                        <label htmlFor="leave_type" className="block text-sm font-semibold text-indigo-700 mb-2">
                            Leave Type
                        </label>
                        <select
                            id="leave_type"
                            name="leave_type"
                            value={formData.leave_type || ''}
                            onChange={handleChange}
                            className="w-full px-4 py-3 bg-white border border-indigo-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent shadow-sm transition-all"
                            required
                        >
                            <option value="">Select Leave Type</option>
                            {leaveTypes.map((type) => (
                                <option key={type.id} value={type.id}>
                                    {type.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Start Date */}
                    <div>
                        <label htmlFor="start_date" className="block text-sm font-semibold text-indigo-700 mb-2">
                            Start Date & Time
                        </label>
                        <input
                            type="datetime-local"
                            id="start_date"
                            name="start_date"
                            value={formData.start_date}
                            onChange={handleChange}
                            className="w-full px-4 py-3 bg-white border border-indigo-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent shadow-sm transition-all"
                            required
                        />
                    </div>

                    {/* End Date */}
                    <div>
                        <label htmlFor="end_date" className="block text-sm font-semibold text-indigo-700 mb-2">
                            End Date & Time
                        </label>
                        <input
                            type="datetime-local"
                            id="end_date"
                            name="end_date"
                            value={formData.end_date}
                            onChange={handleChange}
                            className="w-full px-4 py-3 bg-white border border-indigo-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent shadow-sm transition-all"
                            required
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <label htmlFor="description" className="block text-sm font-semibold text-indigo-700 mb-2">
                            Description
                        </label>
                        <textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows={4}
                            className="w-full px-4 py-3 bg-white border border-indigo-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent shadow-sm transition-all resize-none"
                            placeholder="Provide details about your leave request..."
                        />
                    </div>

                    {/* Buttons */}
                    <div className="flex justify-end gap-4 mt-6">
                        <button type="button" onClick={onClose} className="px-6 py-3 bg-gray-200 text-gray-800 rounded-xl font-semibold hover:bg-gray-300 transition-all shadow-sm">
                            Cancel
                        </button>
                        <button type="submit" className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition-all shadow-sm">
                            {isEditing ? 'Update' : 'Submit'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default LeaveRequestPopup;
