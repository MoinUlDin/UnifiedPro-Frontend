// src/components/MeetingDetail.tsx
import React, { useEffect, useState } from 'react';
import { CalendarDays, Clock, MapPin, Users, Edit, Plus, CheckCircle, Circle, Paperclip, User, AlertCircle, DownloadCloud } from 'lucide-react';
import { useParams } from 'react-router-dom';
import EmployeeServices from '../../../services/EmployeeServices';
import { getAbbrivation } from '../../../utils/Common';
import toast from 'react-hot-toast';
import MeetingModal from './MeetingModal';

interface MinutesOfMeeting {
    id: number;
    title: string;
    agenda?: string;
    notes?: string;
    meeting_date: string;
    start_time?: string | null;
    end_time?: string | null;
    location?: string;
    attendees: number[];
    attendees_detail: { id: number; first_name: string; last_name: string }[];
    action_items: {
        id: number;
        description: string;
        assigned_to?: { id: number; first_name: string; last_name: string } | null;
        due_date?: string | null;
        is_completed: boolean;
        created_at?: string;
    }[];
    attachments: {
        id: number;
        file_name?: string;
        file_url?: string;
        uploaded_by?: { id: number; first_name: string; last_name: string } | null;
        uploaded_at?: string;
        file_size?: string | number;
    }[];
    created_by?: { id: number; first_name: string; last_name: string };
    created_at?: string;
    updated_at?: string;
}

interface Props {
    onBack: (data: any) => void;
    details?: MinutesOfMeeting | null; // incoming data (optional)
    fetchMeetings: () => void;
}

const MeetingDetail: React.FC<Props> = ({ onBack, details = null, fetchMeetings }) => {
    const params = useParams<{ id: string }>();
    const idParam = params.id ? Number(params.id) : undefined;
    const [meeting, setMeeting] = useState<MinutesOfMeeting | null>(details ?? null);
    const [loading, setLoading] = useState<boolean>(!details);
    const [savingIds, setSavingIds] = useState<number[]>([]); // optimistic saving indicator for checkboxes
    const [selectedMeeting, setSelectedMeeting] = useState<any>(null);
    const [openModal, setOpenModal] = useState<boolean>(false);
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [initialData, setInitialData] = useState<any>(null);

    useEffect(() => {
        // If parent passed details prop, use it; otherwise fetch by id param
        if (details) {
            setMeeting(details);
            console.log('Detailed Data: ', details);
            setLoading(false);
        } else if (idParam) {
            fetchMeetingDetail(idParam);
        }
    }, [details, idParam]);

    const fetchMeetingDetail = async (id: number) => {
        setLoading(true);
        try {
            // If you have EmployeeServices.FetchMeeting (by id) use it here.
            // For now, attempt to call the real service; if missing, fallback to existing mock.
            if (EmployeeServices && typeof EmployeeServices.FetchMeetingDetails === 'function') {
                const data = await EmployeeServices.FetchMeetingDetails(id);
                setMeeting(data);
            }
        } catch (err) {
            console.error('Failed to fetch meeting detail', err);
            setMeeting(null);
        } finally {
            setLoading(false);
        }
    };

    const toggleActionItem = async (actionId: number) => {
        if (!meeting) return;
        const item = meeting.action_items.find((ai) => ai.id === actionId);
        if (!item) return;

        // optimistic update
        const newItems = meeting.action_items.map((ai) => (ai.id === actionId ? { ...ai, is_completed: !ai.is_completed } : ai));
        setMeeting({ ...meeting, action_items: newItems });

        // show saving state
        setSavingIds((s) => [...s, actionId]);

        // try to patch to server if service exists
        try {
            EmployeeServices.ToggelActionItem(actionId)
                .then((r) => {
                    console.log(r);
                    toast.success('Toggled Successfully');
                })
                .catch((e) => {
                    toast.error(e.message);
                });
        } catch (err) {
            // rollback on error
            console.error('Failed to update action item', err);
            const rolledBack = meeting.action_items.map((ai) => (ai.id === actionId ? { ...ai, is_completed: item.is_completed } : ai));
            setMeeting({ ...meeting, action_items: rolledBack });
        } finally {
            setSavingIds((s) => s.filter((id) => id !== actionId));
        }
    };

    if (loading) return <div className="text-center py-8">Loading...</div>;
    if (!meeting) return <div className="text-center py-8">No meeting found</div>;

    const total = meeting.action_items.length;
    const completedCount = meeting.action_items.filter((ai) => ai.is_completed).length;
    const percent = total ? Math.round((completedCount / total) * 100) : 0;

    const formatDateLong = (iso?: string) => (iso ? new Date(iso).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }) : '');

    const handleEdit = () => {
        setInitialData(meeting);
        setIsEditing(true);
        setOpenModal(true);
    };
    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 p-6">
            <div className="max-w-7xl mx-auto space-y-6">
                <button onClick={() => onBack(null)} className="text-blue-600 hover:text-blue-800 flex items-center gap-1 mb-4">
                    ← Back to Meetings
                </button>

                <div className="flex justify-between items-start">
                    <div>
                        <h1 className="text-3xl font-extrabold text-purple-800">{meeting.title}</h1>
                        <p className="text-gray-500 mt-1">{formatDateLong(meeting.meeting_date)}</p>
                    </div>

                    <div className="flex gap-2">
                        <button onClick={handleEdit} className="bg-white border border-gray-200 px-4 py-2 rounded-md flex items-center gap-2 shadow-sm hover:shadow">
                            <Edit className="w-4 h-4 text-gray-700" />
                            Edit Meeting
                        </button>
                        <button className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-4 py-2 rounded-md flex items-center gap-2 shadow-lg">
                            <Plus className="w-4 h-4" />
                            Add Action Item
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Left column */}
                    <div className="md:col-span-2 space-y-6">
                        {/* Info card */}
                        <div className="bg-white p-6 rounded-2xl shadow-md border border-indigo-50">
                            <h2 className="text-lg font-semibold text-indigo-700 mb-4 flex items-center gap-3">
                                <CalendarDays className="w-5 h-5 text-indigo-500" />
                                Meeting Information
                            </h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                                <div className="flex items-center gap-3">
                                    <div className="bg-indigo-100 rounded-full p-2">
                                        <Clock className="w-4 h-4 text-indigo-600" />
                                    </div>
                                    <div>
                                        <div className="text-xs text-gray-400">Time</div>
                                        <div className="font-medium text-gray-700">{meeting.start_time ? `${meeting.start_time} - ${meeting.end_time ?? 'N/A'}` : 'N/A'}</div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <div className="bg-green-100 rounded-full p-2">
                                        <MapPin className="w-4 h-4 text-green-600" />
                                    </div>
                                    <div>
                                        <div className="text-xs text-gray-400">Location</div>
                                        <div className="font-medium text-gray-700">{meeting.location ?? 'N/A'}</div>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-6">
                                <h3 className="font-semibold text-sm text-gray-700">Agenda</h3>
                                <p className="mt-2 text-gray-600 bg-gray-50 p-3 rounded-md">{meeting.agenda ?? 'N/A'}</p>

                                <h3 className="font-semibold text-sm text-gray-700 mt-4">Meeting Notes</h3>
                                <p className="mt-2 text-gray-600 bg-gray-50 p-3 rounded-md">{meeting.notes ?? 'N/A'}</p>
                            </div>
                        </div>

                        {/* Action Items */}
                        <div className="bg-white p-6 rounded-2xl shadow-md border border-indigo-50">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-lg font-semibold flex items-center gap-2">
                                    <CheckCircle className="w-5 h-5 text-purple-600" />
                                    Action Items {total ? `(${total})` : ''}
                                </h2>

                                <div className="text-sm text-gray-500">
                                    <div className="font-medium">
                                        {completedCount} of {total} completed
                                    </div>
                                </div>
                            </div>

                            {/* progress bar */}
                            <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden mb-4">
                                <div className="h-2 rounded-full bg-purple-600 transition-all" style={{ width: `${percent}%` }} />
                            </div>

                            <div className="space-y-3">
                                {meeting.action_items.map((item) => {
                                    const saving = savingIds.includes(item.id);
                                    return (
                                        <div key={item.id} className={`flex items-start gap-3 p-3 rounded-lg border ${item.is_completed ? 'bg-gray-50 border-gray-200' : 'bg-white border-gray-100'}`}>
                                            <label className="flex-none">
                                                <input
                                                    type="checkbox"
                                                    checked={!!item.is_completed}
                                                    onChange={() => toggleActionItem(item.id)}
                                                    className="w-5 h-5 accent-purple-600"
                                                    disabled={saving}
                                                    aria-label={`toggle-action-${item.id}`}
                                                />
                                            </label>

                                            <div className="flex-1">
                                                <div className="flex items-center justify-between">
                                                    <div className={`text-sm ${item.is_completed ? 'line-through text-gray-400' : 'text-gray-800'}`}>{item.description}</div>
                                                    <div className="text-xs text-gray-400">{item.due_date ? new Date(item.due_date).toLocaleDateString() : ''}</div>
                                                </div>
                                                <div className="text-xs text-gray-500 mt-2 flex items-center gap-3">
                                                    {item.assigned_to ? (
                                                        <div className="flex items-center gap-2">
                                                            <div className="size-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-xs">
                                                                {getAbbrivation(`${item.assigned_to?.first_name} ${item.assigned_to?.last_name}`)}
                                                            </div>
                                                            <div>
                                                                {item.assigned_to.first_name} {item.assigned_to.last_name}
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <div className="text-gray-400">Unassigned</div>
                                                    )}

                                                    {saving && <div className="text-xs text-gray-400">Saving...</div>}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    {/* Right column */}
                    <div className="space-y-6">
                        {/* Attendees */}
                        <div className="bg-white p-6 rounded-2xl shadow-md border border-indigo-50">
                            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                <Users className="w-5 h-5 text-blue-600" />
                                Attendees {meeting.attendees_detail.length}
                            </h2>
                            <div className="grid grid-cols-1 gap-4">
                                {meeting.attendees_detail.map((attendee) => (
                                    <div key={attendee.id} className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-600 to-indigo-500 text-white flex items-center justify-center font-semibold">
                                            {attendee.first_name[0]}
                                            {attendee.last_name[0]}
                                        </div>
                                        <div>
                                            <div className="font-medium">
                                                {attendee.first_name} {attendee.last_name}
                                            </div>
                                            {/* optional department or title */}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Attachments */}
                        <div className="bg-white p-6 rounded-2xl shadow-md border border-indigo-50">
                            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                <Paperclip className="w-5 h-5 text-gray-600" />
                                Attachments {meeting.attachments.length}
                            </h2>

                            <div className="space-y-3">
                                {meeting.attachments.length === 0 && <p className="text-center text-gray-400">No attachments</p>}
                                {meeting.attachments.map((att) => (
                                    <div key={att.id} className="flex items-center justify-between gap-3 bg-gray-50 p-3 rounded-md">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-md bg-white border flex items-center justify-center text-sm font-medium text-gray-700">
                                                <FileIconPlaceholder />
                                            </div>
                                            <div>
                                                <div className="font-medium text-sm">{att.file_name ?? 'file'}</div>
                                                <div className="text-xs text-gray-400">
                                                    {att.file_size ?? ''} • {att.uploaded_by ? `${att.uploaded_by.first_name}` : ''}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <a href={att.file_url ?? '#'} className="text-sm text-indigo-600 hover:underline flex items-center gap-1" target="_blank" rel="noreferrer">
                                                <DownloadCloud className="w-4 h-4" />
                                                Download
                                            </a>
                                        </div>
                                    </div>
                                ))}
                                <button className="w-full bg-gray-100 text-gray-800 px-4 py-2 rounded-md mt-2 flex items-center justify-center gap-1">
                                    <Plus className="w-4 h-4" />
                                    Upload File
                                </button>
                            </div>
                        </div>

                        {/* Meeting details */}
                        <div className="bg-white p-6 rounded-2xl shadow-md border border-indigo-50">
                            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                <AlertCircle className="w-5 h-5 text-gray-600" />
                                Meeting Details
                            </h2>
                            <div className="space-y-2 text-sm text-gray-600">
                                <div className="flex items-center gap-2">
                                    <User className="w-4 h-4 text-gray-400" /> Created by:{' '}
                                    <span className="font-medium">
                                        {meeting.created_by?.first_name} {meeting.created_by?.last_name}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <CalendarDays className="w-4 h-4 text-gray-400" /> Created:{' '}
                                    <span className="font-medium">{meeting.created_at ? new Date(meeting.created_at).toLocaleDateString() : 'N/A'}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Clock className="w-4 h-4 text-gray-400" /> Updated:{' '}
                                    <span className="font-medium">{meeting.updated_at ? new Date(meeting.updated_at).toLocaleDateString() : 'N/A'}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {openModal && <MeetingModal onSuccess={fetchMeetings} isEditing={isEditing} initialData={initialData} onClose={() => setOpenModal(false)} />}
        </div>
    );
};

export default MeetingDetail;

/** small helper component for file icon placeholder (keeps code tidy) */
const FileIconPlaceholder = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-gray-600">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M14 2v6h6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);
