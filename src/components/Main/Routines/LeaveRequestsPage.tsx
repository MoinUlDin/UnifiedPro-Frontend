import React, { useEffect, useMemo, Fragment, useState } from 'react';
import { motion } from 'framer-motion';
import { useDispatch } from 'react-redux';
import toast from 'react-hot-toast';
import {
    CalendarDays,
    Clock,
    User,
    CheckCircle,
    XCircle,
    Plus,
    Edit,
    Trash2,
    Send,
    Users,
    Calendar as CalendarIcon,
    Filter,
    Search,
    MoreHorizontal,
    AlertCircle,
    ThumbsUp,
    ThumbsDown,
    Eye,
    Sparkles,
    Zap,
    Edit2,
} from 'lucide-react';
import EmployeeServices from '../../../services/EmployeeServices';
import { setPageTitle } from '../../../store/themeConfigSlice';
import Swal from 'sweetalert2';
import { LeaveRequestOwnerType } from '../../../constantTypes/EmployeeRelated';
import { CheckOwner } from '../../../utils/Common';
import { Dialog, Transition } from '@mantine/core';
import LeaveRequestPopup from './LeaveRequestPopup';

const leaveTypeLabel = (t: number | undefined) => {
    // map numeric leave_type to readable labels (adjust to your app's mapping)
    switch (t) {
        case 1:
            return { label: 'Annual Leave', color: 'bg-blue-100 text-blue-800' };
        case 2:
            return { label: 'Sick Leave', color: 'bg-red-100 text-red-800' };
        case 3:
            return { label: 'Personal Leave', color: 'bg-purple-100 text-purple-800' };
        default:
            return { label: 'Leave', color: 'bg-gray-100 text-gray-800' };
    }
};

const formatDate = (iso?: string) => {
    if (!iso) return '--';
    try {
        const d = new Date(iso);
        return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
    } catch {
        return iso;
    }
};

const formatCreatedAt = (iso?: string) => {
    if (!iso) return '--';
    try {
        const d = new Date(iso);
        return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) + ' • ' + d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch {
        return iso;
    }
};

export const LeaveRequestsPage: React.FC = () => {
    const dispatch = useDispatch();
    const [leaveRequests, setLeaveRequests] = useState<LeaveRequestOwnerType[]>([]);
    const [filtered, setFiltered] = useState<LeaveRequestOwnerType[]>([]);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
    const [loading, setLoading] = useState(false);
    const isOwner = CheckOwner();
    const [openLeavePopup, setOpenLeavePopup] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [initialData, setInitialData] = useState<any>(null);

    useEffect(() => {
        dispatch(setPageTitle('Leave Management'));
    }, [dispatch]);

    useEffect(() => {
        fetchRequests();
        // determine admin from your auth state/store if available
        // setIsAdmin(true/false)
    }, []);

    const fetchRequests = async () => {
        setLoading(true);
        try {
            const r = await EmployeeServices.FetchLeaveRequests();
            setLeaveRequests(r || []);
            setFiltered(r || []);
            console.log('Requests: ', r);
        } catch (e: any) {
            console.error(e);
            toast.error('Failed to fetch leave requests');
        } finally {
            setLoading(false);
        }
    };

    // counts
    const counts = useMemo(() => {
        const total = leaveRequests.length;
        const pending = leaveRequests.filter((l) => !l.is_approved && !l.rejected).length;
        const approved = leaveRequests.filter((l) => l.is_approved && !l.rejected).length;
        const rejected = leaveRequests.filter((l) => l.rejected).length;
        return { total, pending, approved, rejected };
    }, [leaveRequests]);

    // search + filter
    useEffect(() => {
        const q = search.trim().toLowerCase();
        let list = [...leaveRequests];
        if (statusFilter !== 'all') {
            list = list.filter((l) => {
                if (statusFilter === 'pending') return !l.is_approved && !l.rejected;
                if (statusFilter === 'approved') return l.is_approved && !l.rejected;
                if (statusFilter === 'rejected') return l.rejected;
                return true;
            });
        }
        if (q) {
            list = list.filter((l) => {
                return (
                    l.employee.name.toLowerCase().includes(q) ||
                    (l.employee.department || '').toLowerCase().includes(q) ||
                    (l.employee.designation || '').toLowerCase().includes(q) ||
                    (l.description || '').toLowerCase().includes(q)
                );
            });
        }
        setFiltered(list);
    }, [search, statusFilter, leaveRequests]);

    // action handlers (wire to real API)
    const handleApprove = async (id: number) => {
        Swal.fire({
            title: 'Are you sure?',
            text: 'Do you really want to approve this?',
            icon: 'warning',
            showCancelButton: true, // ← enable the cancel button
            confirmButtonText: 'Yes, Approve',
            cancelButtonText: 'Cancel', // ← customize its label
            timer: 8000,
            timerProgressBar: true,
            showCloseButton: true,
            reverseButtons: true, // ← optional: swap positions
        }).then((result) => {
            if (result.isConfirmed) {
                EmployeeServices.ApproveLeaveRequest(id, { is_approved: true })
                    .then(() => {
                        toast.success('Request approved successfully', { duration: 4000 });
                        fetchRequests();
                    })
                    .catch((e) => {
                        toast.error(e.message);
                    });
            }
        });
    };

    const handleReject = async (id: number) => {
        if (!id) return;
        Swal.fire({
            title: 'Are you sure?',
            text: 'Do you really want to Reject this request?',
            icon: 'warning',
            showCancelButton: true, // ← enable the cancel button
            confirmButtonText: 'Yes, Reject',
            cancelButtonText: 'Cancel', // ← customize its label
            timer: 8000,
            timerProgressBar: true,
            showCloseButton: true,
            reverseButtons: true, // ← optional: swap positions
        }).then((result) => {
            if (result.isConfirmed) {
                EmployeeServices.ApproveLeaveRequest(id, { rejected: true })
                    .then(() => {
                        toast.success('Request Rejected successfully', { duration: 4000 });
                        fetchRequests();
                    })
                    .catch((e) => {
                        toast.error(e.message);
                    });
            }
        });
    };

    const handleCreate = () => {
        // open modal to create leave - hook this up to your Form/Modal
        setInitialData(null);
        setIsEditMode(false);
        setOpenLeavePopup(true);
    };

    const handleEdit = (data: any) => {
        console.log('input Data: ', data);
        setInitialData(data);
        setIsEditMode(true);
        setOpenLeavePopup(true);
    };
    const handleDelete = (data: any) => {};
    return (
        <div className="min-h-screen p-6 bg-gradient-to-br from-violet-50 via-purple-50 to-blue-50">
            <div className="max-w-7xl mx-auto space-y-6">
                {/* Header */}
                <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-extrabold text-violet-700 flex items-center gap-3">
                            <CalendarDays className="w-6 h-6 text-violet-600" />
                            Leave Management
                        </h1>
                        <p className="text-sm text-gray-500">Manage employee leave requests</p>
                    </div>

                    <div className="flex items-center gap-3">
                        <button onClick={handleCreate} className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-violet-600 hover:bg-violet-700 text-white shadow">
                            <Plus className="w-4 h-4" />
                            Create Leave Request
                        </button>
                    </div>
                </motion.div>

                {/* Summary cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded-lg p-4 bg-gradient-to-r from-blue-400 to-blue-500 text-white shadow-lg">
                        <div className="flex justify-between items-start">
                            <div>
                                <div className="text-sm">Total Requests</div>
                                <div className="text-2xl font-bold">{counts.total}</div>
                            </div>
                            <div className="p-2 bg-white/20 rounded-md">
                                <Users className="w-6 h-6" />
                            </div>
                        </div>
                    </motion.div>

                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded-lg p-4 bg-gradient-to-r from-orange-400 to-orange-500 text-white shadow-lg">
                        <div className="flex justify-between items-start">
                            <div>
                                <div className="text-sm">Pending</div>
                                <div className="text-2xl font-bold">{counts.pending}</div>
                            </div>
                            <div className="p-2 bg-white/20 rounded-md">
                                <Clock className="w-6 h-6" />
                            </div>
                        </div>
                    </motion.div>

                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded-lg p-4 bg-gradient-to-r from-green-400 to-green-500 text-white shadow-lg">
                        <div className="flex justify-between items-start">
                            <div>
                                <div className="text-sm">Approved</div>
                                <div className="text-2xl font-bold">{counts.approved}</div>
                            </div>
                            <div className="p-2 bg-white/20 rounded-md">
                                <CheckCircle className="w-6 h-6" />
                            </div>
                        </div>
                    </motion.div>

                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded-lg p-4 bg-gradient-to-r from-pink-400 to-red-500 text-white shadow-lg">
                        <div className="flex justify-between items-start">
                            <div>
                                <div className="text-sm">Rejected</div>
                                <div className="text-2xl font-bold">{counts.rejected}</div>
                            </div>
                            <div className="p-2 bg-white/20 rounded-md">
                                <XCircle className="w-6 h-6" />
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Search + filter bar */}
                <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
                    <div className="flex items-center gap-3 w-full md:w-2/3">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <input
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search requests..."
                                className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 shadow-sm bg-white"
                            />
                        </div>

                        <div className="flex items-center gap-2">
                            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as any)} className="px-3 py-2 rounded-lg border border-gray-200 bg-white">
                                <option value="all">All Status</option>
                                <option value="pending">Pending</option>
                                <option value="approved">Approved</option>
                                <option value="rejected">Rejected</option>
                            </select>
                        </div>
                    </div>

                    <div className="text-sm text-gray-500 flex items-center gap-4">
                        <div className="flex items-center gap-2">
                            <Sparkles className="w-4 h-4 text-gray-400" />
                            <span>
                                Showing {filtered.length} of {leaveRequests.length} requests
                            </span>
                        </div>
                    </div>
                </div>

                {/* List */}
                <div className="space-y-4">
                    {loading && <div className="text-center py-8 text-gray-500">Loading...</div>}
                    {!loading && filtered.length === 0 && <div className="text-center py-8 text-gray-500">No leave requests found</div>}

                    {filtered.map((r) => {
                        const lt = leaveTypeLabel(r.leave_type);
                        const pending = !r.is_approved && !r.rejected;
                        const approved = r.is_approved && !r.rejected;
                        const rejected = r.rejected;
                        return (
                            <motion.div
                                key={r.id}
                                initial={{ opacity: 0, y: 6 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-white rounded-xl transition-all duration-300 hover:shadow-md p-5 border border-gray-100"
                            >
                                <div className="flex items-start justify-between">
                                    <div className="flex items-start gap-4">
                                        <div className="w-12 h-12 rounded-full overflow-hidden bg-gradient-to-r from-purple-400 to-blue-400 flex items-center justify-center text-white text-sm font-semibold">
                                            {r.profile_image ? (
                                                <img src={r.profile_image} alt={r.employee.name} className="w-full h-full object-cover" />
                                            ) : (
                                                r.employee.name
                                                    .split(' ')
                                                    .map((n) => n[0])
                                                    .join('')
                                                    .slice(0, 2)
                                            )}
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-3">
                                                <div>
                                                    <div className="text-sm font-semibold text-gray-900">{r.employee.name}</div>
                                                    <div className="text-xs text-gray-500">
                                                        {r.employee.designation} • {r.employee.department}
                                                    </div>
                                                </div>

                                                <div className={`self-start text-[10px] px-2  rounded-full ${lt.color} font-medium ml-3`}>{lt.label}</div>

                                                {/* status badge */}
                                                <div className="ml-3 self-start">
                                                    {pending && <div className="text-[10px] px-2  rounded-full bg-yellow-100 text-yellow-800 font-medium">Pending</div>}
                                                    {approved && <div className="text-[10px] px-2  rounded-full bg-green-100 text-green-800 font-medium">Approved</div>}
                                                    {rejected && <div className="text-[10px] px-2  rounded-full bg-red-100 text-red-800 font-medium">Rejected</div>}
                                                </div>
                                            </div>

                                            <div className="mt-3 text-sm text-gray-600">
                                                <div className="flex items-center gap-4">
                                                    <div className="flex items-center gap-2">
                                                        <CalendarIcon className="w-4 h-4 text-gray-400" />
                                                        <span>
                                                            {formatDate(r.start_date)} — {formatDate(r.end_date)}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <Clock className="w-4 h-4 text-gray-400" />
                                                        <span>{r.duration ?? '—'}</span>
                                                    </div>
                                                </div>

                                                {r.description && <p className="mt-3 text-gray-700">{r.description}</p>}
                                                {r.reason && <div className="mt-2 text-sm text-gray-500">Reason: {r.reason}</div>}
                                            </div>
                                        </div>
                                    </div>

                                    {/* right column: timestamp + actions */}
                                    <div className="flex flex-col items-end justify-between">
                                        <div className="text-xs text-gray-400">{formatCreatedAt(r.created_at)}</div>

                                        <div className="mt-4 flex items-center gap-2">
                                            {isOwner && pending && (
                                                <>
                                                    <button onClick={() => handleApprove(r.id)} className="btn btn-success btn-sm flex items-center gap-2">
                                                        <ThumbsUp className="w-3 h-3" />
                                                        Approve
                                                    </button>
                                                    <button onClick={() => handleReject(r.id)} className="btn btn-outline-danger btn-sm flex items-center gap-2">
                                                        <ThumbsDown className="w-3 h-3" />
                                                        Reject
                                                    </button>
                                                </>
                                            )}
                                            {!isOwner && pending && (
                                                <>
                                                    <button onClick={() => handleEdit(r)} className="btn btn-success btn-sm flex items-center gap-2">
                                                        <Edit2 className="w-3 h-3" />
                                                        Edit
                                                    </button>
                                                    <button onClick={() => handleDelete(r.id)} className="btn btn-outline-danger btn-sm flex items-center gap-2">
                                                        <Trash2 className="w-3 h-3" />
                                                        Delete
                                                    </button>
                                                </>
                                            )}

                                            {isOwner && approved && (
                                                <div className="px-3 py-1.5 rounded-md bg-green-50 text-green-800 border border-green-100 text-sm">
                                                    <CheckCircle className="w-4 h-4 inline-block mr-1" />
                                                    Approved
                                                </div>
                                            )}

                                            {isOwner && rejected && (
                                                <div className="px-3 py-1.5 rounded-md bg-red-50 text-red-800 border border-red-100 text-sm">
                                                    <XCircle className="w-4 h-4 inline-block mr-1" />
                                                    Rejected
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
            {openLeavePopup && <LeaveRequestPopup initialData={initialData} isEditing={isEditMode} onSuccess={fetchRequests} onClose={() => setOpenLeavePopup(false)} />}
        </div>
    );
};

export default LeaveRequestsPage;
