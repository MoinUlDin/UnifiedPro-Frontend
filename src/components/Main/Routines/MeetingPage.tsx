// src/components/MeetingList.tsx
import React, { useState, useEffect } from 'react';
import { CalendarDays, Clock, MapPin, Users, Eye, Edit, Plus, Search, FileText, CheckCircle, Paperclip } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import MeetingDetail from './MeetingDetail';
import EmployeeServices from '../../../services/EmployeeServices';
import { useDispatch } from 'react-redux';
import MeetingModal from './MeetingModal';

interface MinutesOfMeeting {
    id: number;
    title: string;
    agenda: string;
    notes: string;
    meeting_date: string;
    start_time: string | null;
    end_time: string | null;
    location: string;
    attendees: number[];
    attendees_detail: { id: number; first_name: string; last_name: string }[];
    action_items: any[];
    attachments: any[];
    created_by: { id: number; first_name: string; last_name: string };
    created_at: string;
    updated_at: string;
    can_edit: boolean;
}

const MeetingPage: React.FC = () => {
    const navigate = useNavigate();
    const [meetings, setMeetings] = useState<MinutesOfMeeting[]>([]);
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState('All Meetings');
    const [selectedMeeting, setSelectedMeeting] = useState<any>(null);
    const [openModal, setOpenModal] = useState<boolean>(false);
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [initialData, setInitialData] = useState<any>(null);

    useEffect(() => {
        // Fetch from API
        fetchMeetings();
    }, []);

    const fetchMeetings = async () => {
        try {
            EmployeeServices.FetchMeetings()
                .then((r) => {
                    console.log('meetingData: ', r);
                    setMeetings(r);
                })
                .catch((e) => {
                    console.log(e);
                });
        } catch (error) {
            console.error('Failed to fetch meetings', error);
        }
    };

    const totalMeetings = meetings.length;
    const upcoming = meetings.filter((m) => new Date(m.meeting_date) > new Date()).length;
    const actionItems = meetings.reduce((sum, m) => sum + m.action_items.length, 0);
    const completed = meetings.reduce((sum, m) => sum + m.action_items.filter((ai) => ai.is_completed).length, 0); // Assume is_completed in data

    const filteredMeetings = meetings.filter((m) => m.title.toLowerCase().includes(search.toLowerCase()));
    const handleNewMeeting = () => {
        setIsEditing(false);
        setInitialData(null);
        setOpenModal(true);
    };
    const handleEdit = (data: any) => {
        setInitialData(data);
        setIsEditing(true);
        setOpenModal(true);
    };

    return (
        <div className="min-h-screen bg-white p-6">
            {selectedMeeting && <MeetingDetail fetchMeetings={fetchMeetings} onBack={setSelectedMeeting} details={selectedMeeting} />}
            {!selectedMeeting && (
                <div>
                    <div className="flex items-center justify-between mb-6">
                        <h1 className="text-2xl font-bold text-purple-800 flex items-center gap-2">
                            <div className="size-10 rounded-lg flex items-center justify-center text-white bg-gradient-to-r from-blue-600 to-purple-900 ">
                                <FileText className="w-6 h-6" />
                            </div>

                            <div>
                                <span>Meeting Minutes</span>
                                <p className="text-sm text-gray-500">Create, manage, and track meeting minutes and action items.</p>
                            </div>
                        </h1>
                        <button onClick={handleNewMeeting} className="bg-purple-600 text-white px-4 py-2 rounded-md flex items-center gap-2">
                            <Plus className="w-4 h-4" />
                            Create Meeting
                        </button>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                        <div className="bg-blue-500 text-white p-4 rounded-xl text-center">
                            <p className="text-lg font-bold">Total Meetings</p>
                            <p className="text-4xl">{totalMeetings}</p>
                        </div>
                        <div className="bg-green-500 text-white p-4 rounded-xl text-center">
                            <p className="text-lg font-bold">Upcoming</p>
                            <p className="text-4xl">{upcoming}</p>
                        </div>
                        <div className="bg-purple-500 text-white p-4 rounded-xl text-center">
                            <p className="text-lg font-bold">Action Items</p>
                            <p className="text-4xl">{actionItems}</p>
                        </div>
                        <div className="bg-orange-500 text-white p-4 rounded-xl text-center">
                            <p className="text-lg font-bold">Completed</p>
                            <p className="text-4xl">{completed}</p>
                        </div>
                    </div>

                    {/* Search and Filter */}
                    <div className="flex items-center gap-4 mb-4">
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-3 w-4 h-4 text-gray-500" />
                            <input
                                type="text"
                                placeholder="Search meetings..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 rounded-md border border-gray-200 focus:outline-none focus:border-purple-500"
                            />
                        </div>
                        <select value={filter} onChange={(e) => setFilter(e.target.value)} className="px-4 py-2 rounded-md border border-gray-200 focus:outline-none focus:border-purple-500">
                            <option>All Meetings</option>
                            {/* Add more options as needed */}
                        </select>
                        <p className="text-sm text-gray-500">
                            Showing {filteredMeetings.length} of {meetings.length} meetings
                        </p>
                    </div>

                    {/* Meeting List */}
                    <div className="space-y-4">
                        {filteredMeetings.map((meeting) => (
                            <div key={meeting.id} className="bg-white p-4 rounded-xl shadow-md border border-gray-100">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="text-sm font-bold">{meeting.title}</h3>
                                        <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
                                            <div className="flex items-center gap-1 text-[12px]">
                                                <CalendarDays className="w-4 h-4" />
                                                {meeting.meeting_date}
                                            </div>
                                            <div className="flex items-center gap-1 text-[12px]">
                                                <Clock className="w-4 h-4" />
                                                {meeting.start_time ? (
                                                    <span>
                                                        {meeting.start_time} - {meeting.end_time}
                                                    </span>
                                                ) : (
                                                    <span>N/A</span>
                                                )}
                                            </div>
                                            <div className="flex items-center gap-1 text-[12px]">
                                                <MapPin className="w-4 h-4" />
                                                {meeting.location ? <span>{meeting.location}</span> : <span>N/A</span>}
                                            </div>
                                        </div>
                                        <p className="text-[12px] mt-2 my-4">{meeting.agenda ? <span>{meeting.agenda}</span> : <span>N/A</span>}</p>
                                        <div className="flex gap-6 text-sm mt-2">
                                            <div className="flex items-center gap-1">
                                                <Users className="w-4 h-4 text-blue-500" />
                                                {meeting.attendees.length} attendees
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <CheckCircle className="w-4 h-4 text-purple-500" />
                                                {meeting.action_items.length} action items
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Paperclip className="w-4 h-4 text-pink-500" />
                                                {meeting.attachments.length} attachments
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex gap-2 text-[12px]">
                                        <button onClick={() => setSelectedMeeting(meeting)} className="bg-blue-100 text-blue-600 px-2 py-1 rounded-md flex items-center gap-1">
                                            <Eye className="w-3 h-3" />
                                            View
                                        </button>
                                        {meeting.can_edit && (
                                            <button onClick={() => handleEdit(meeting)} className="bg-green-100 text-green-600 px-2 py-1 rounded-md flex items-center gap-1">
                                                <Edit className="w-3 h-3" />
                                                Edit
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {openModal && <MeetingModal onSuccess={fetchMeetings} isEditing={isEditing} initialData={initialData} onClose={() => setOpenModal(false)} />}
        </div>
    );
};

export default MeetingPage;
