import React, { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, Users, X, Search, Save, FileText, Edit, Sparkles } from 'lucide-react';
import { useDispatch } from 'react-redux';
import EmployeeServices from '../../../services/EmployeeServices';
import { motion } from 'framer-motion'; // For animations if desired
import { EmployeeType } from '../../../constantTypes/Types';
import toast from 'react-hot-toast';

interface MeetingFormData {
    id?: number;
    title: string;
    meeting_date: string;
    location: string;
    start_time: string;
    end_time: string;
    attendees: number[]; // Array of employee IDs
    agenda: string;
    notes: string;
}

interface MeetingModalProps {
    onSuccess: () => void;
    isEditing: boolean;
    initialData: MeetingFormData | null;
    onClose: () => void;
}
function getFullName(employee: EmployeeType) {
    if (!employee) return '';
    return `${employee.first_name} ${employee.last_name}`;
}
const MeetingModal: React.FC<MeetingModalProps> = ({ onSuccess, isEditing, initialData, onClose }) => {
    const dispatch = useDispatch();
    const [formData, setFormData] = useState<MeetingFormData>({
        title: '',
        meeting_date: '',
        location: '',
        start_time: '',
        end_time: '',
        attendees: [],
        agenda: '',
        notes: '',
    });
    const [employees, setEmployees] = useState<EmployeeType[]>([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchEmployees();
        if (initialData) {
            setFormData(initialData);
        }
    }, [initialData]);

    const fetchEmployees = () => {
        console.log('isEditing: ', isEditing);
        setLoading(true);
        EmployeeServices.FetchEmployees(dispatch)
            .then((r) => {
                setEmployees(r);
                console.log('employees: ', r);
            })
            .catch((e) => {
                console.error(e);
            })
            .finally(() => {
                setLoading(false);
            });
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const toggleAttendee = (id: number) => {
        setFormData((prev) => ({
            ...prev,
            attendees: prev.attendees.includes(id) ? prev.attendees.filter((a) => a !== id) : [...prev.attendees, id],
        }));
    };

    const filteredEmployees = employees.filter((emp) => getFullName(emp)?.toLowerCase().includes(searchTerm.toLowerCase()));

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('formData: ', formData);
        if (!isEditing) {
            EmployeeServices.CreateMeetings(formData)
                .then(() => {
                    onSuccess();
                    toast.success('Meeting Created Successfully', { duration: 4000 });
                    onClose();
                })
                .catch((e) => {
                    toast.error(e.message || 'Error Creating Meeting', { duration: 4000 });
                });
        } else {
            const id = initialData?.id;
            if (!id) return toast.error('No Id found');
            EmployeeServices.UpdateMeetings(id, formData)
                .then(() => {
                    onSuccess();
                    toast.success('Meeting Updated Successfully', { duration: 4000 });
                    onClose();
                })
                .catch((e) => {
                    toast.error(e.message || 'Error Updating Meeting', { duration: 4000 });
                });
        }
    };

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl min-w-64 shadow-2xl w-full max-w-3xl mx-4 p-8 relative overflow-y-auto max-h-[90vh]">
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-700">
                    <X className="w-6 h-6" />
                </button>

                <h2 className="text-2xl font-bold text-purple-800 mb-6 flex items-center gap-2">
                    <Sparkles className="w-6 h-6" />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-800 to-blue-800">{isEditing ? 'Edit Meeting' : 'Create New Meeting'}</span>
                </h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Meeting Title */}
                    <div>
                        <label className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                            <Edit className="w-4 h-4 text-purple-600" />
                            Meeting Title
                        </label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            placeholder="Enter meeting title..."
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all"
                            required
                        />
                    </div>

                    {/* Date and Location */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                                <Calendar className="w-4 h-4 text-blue-600" />
                                Date
                            </label>
                            <input
                                type="date"
                                name="meeting_date"
                                value={formData.meeting_date}
                                onChange={handleChange}
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                                required
                            />
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                                <MapPin className="w-4 h-4 text-green-600" />
                                Location
                            </label>
                            <input
                                type="text"
                                name="location"
                                value={formData.location}
                                onChange={handleChange}
                                placeholder="Conference room, online, etc."
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all"
                            />
                        </div>
                    </div>

                    {/* Start and End Time */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                                <Clock className="w-4 h-4 text-indigo-600" />
                                Start Time
                            </label>
                            <input
                                type="time"
                                name="start_time"
                                value={formData.start_time}
                                onChange={handleChange}
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all"
                            />
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                                <Clock className="w-4 h-4 text-indigo-600" />
                                End Time
                            </label>
                            <input
                                type="time"
                                name="end_time"
                                value={formData.end_time}
                                onChange={handleChange}
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all"
                            />
                        </div>
                    </div>

                    {/* Attendees */}
                    <div>
                        <label className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                            <Users className="w-4 h-4 text-orange-600" />
                            Attendees
                        </label>
                        <div className="relative">
                            <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search employees..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-t-xl focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all"
                            />
                        </div>
                        <div className="max-h-48 overflow-y-auto border border-t-0 border-gray-300 rounded-b-xl bg-white p-2">
                            {loading ? (
                                <p className="text-center text-gray-500 py-4">Loading employees...</p>
                            ) : filteredEmployees.length === 0 ? (
                                <p className="text-center text-gray-500 py-4">No employees found</p>
                            ) : (
                                filteredEmployees.map((emp) => (
                                    <div key={emp.id} className="flex items-center gap-3 py-2 hover:bg-gray-50 px-2 rounded-md cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={formData.attendees.includes(emp.id)}
                                            onChange={() => toggleAttendee(emp.id)}
                                            className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
                                        />
                                        <span className="text-sm text-gray-700">{getFullName(emp)}</span>
                                    </div>
                                ))
                            )}
                        </div>
                        {formData.attendees.length > 0 && <div className="mt-2 text-sm text-gray-500">Selected: {formData.attendees.length} employees</div>}
                    </div>

                    {/* Agenda */}
                    <div>
                        <label className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                            <FileText className="w-4 h-4 text-purple-600" />
                            Agenda
                        </label>
                        <textarea
                            name="agenda"
                            value={formData.agenda}
                            onChange={handleChange}
                            placeholder="Meeting agenda and topics to discuss..."
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all min-h-[100px]"
                        />
                    </div>

                    {/* Notes */}
                    <div>
                        <label className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                            <FileText className="w-4 h-4 text-purple-600" />
                            Notes
                        </label>
                        <textarea
                            name="notes"
                            value={formData.notes}
                            onChange={handleChange}
                            placeholder="Meeting notes and key discussion points..."
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all min-h-[100px]"
                        />
                    </div>

                    {/* Submit Button */}
                    <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-xl font-medium flex items-center justify-center gap-2 hover:bg-blue-700 transition-all">
                        <Save className="w-5 h-5" />
                        {isEditing ? 'Update Meeting' : 'Create Meeting'}
                    </button>
                </form>
            </div>
        </motion.div>
    );
};

export default MeetingModal;
