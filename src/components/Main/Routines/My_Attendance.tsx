// src/components/AttendancePanel.tsx
import React, { useEffect, useMemo, useState } from 'react';
import { Clock, LogIn, LogOut, CheckCircle, XCircle, ArrowRightCircle, User, LogInIcon } from 'lucide-react';
import toast from 'react-hot-toast';
import EmployeeServices from '../../../services/EmployeeServices';

type EmployeeMini = {
    id: number;
    name: string;
    department?: string | null;
    designation?: string | null;
};

type AttendanceItem = {
    id: number;
    employee: EmployeeMini;
    date: string; // YYYY-MM-DD
    clock_in_time: string | null; // ISO
    clock_out_time: string | null; // ISO
    late_minutes?: number | null;
    is_absent: boolean;
    is_late: boolean;
    is_present: boolean;
    is_holiday: boolean;
    profile_image?: string | null;
};

function formatLateMinutes(mins?: number | null) {
    if (mins == null) return null;
    const m = Math.max(0, Math.floor(mins));
    if (m >= 60) {
        const hr = Math.floor(m / 60);
        const rem = m % 60;
        return rem ? `${hr}:${String(rem).padStart(2, '0')} hr` : `${hr} hr`;
    }
    return `${m} minutes`;
}

function formatTimeFromIso(iso?: string | null) {
    if (!iso) return '--:--';
    try {
        const d = new Date(iso);
        return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch {
        return '--:--';
    }
}

function formatDurationFromMinutes(totalMinutes: number | null) {
    if (totalMinutes == null) return null;
    const m = Math.max(0, Math.round(totalMinutes));
    if (m >= 60) {
        const hr = Math.floor(m / 60);
        const rem = m % 60;
        return rem ? `${hr}:${String(rem).padStart(2, '0')} hr` : `${hr} hr`;
    }
    return `${m} minutes`;
}

/**
 * Compute working-hours between inIso and outIso.
 * If outIso is null, uses `now` (JS Date) to compute current running duration.
 * Returns formatted string like "1:30 hr" or "40 minutes" or null if no in time.
 */
function computeWorkingHours(inIso?: string | null, outIso?: string | null, now?: Date): string | null {
    if (!inIso) return null;
    try {
        const a = new Date(inIso).getTime();
        const b = outIso ? new Date(outIso).getTime() : now?.getTime();
        if (!b || isNaN(a) || isNaN(b) || b <= a) {
            // if out is earlier than in, show 0
            if (b && b > a) {
                // handled above, but fallback:
                return formatDurationFromMinutes(Math.max(0, (b - a) / 60000));
            }
            return formatDurationFromMinutes(0);
        }
        const mins = (b - a) / 60000;
        return formatDurationFromMinutes(mins);
    } catch {
        return null;
    }
}

export default function AttendancePanel(): JSX.Element {
    const [attendanceData, setAttendanceData] = useState<AttendanceItem[] | null>(null);
    const [loading, setLoading] = useState(false);
    const [actionLoading, setActionLoading] = useState(false);

    const [now, setNow] = useState<Date>(new Date());

    const FetchAttendence = () => {
        setLoading(true);
        EmployeeServices.FetchAttendence()
            .then((a) => setAttendanceData(a))
            .catch((e: any) => {
                console.error(e);
                toast.error(e?.message || 'Failed to fetch attendance');
            })
            .finally(() => setLoading(false));
    };
    useEffect(() => {
        FetchAttendence();
    }, []);

    // ticking clock in header (keeps "now" updated every second)
    useEffect(() => {
        const t = setInterval(() => setNow(new Date()), 1000);
        return () => clearInterval(t);
    }, []);

    // pick today's attendance first (assumes attendanceData contains recent days)
    const todays = useMemo(() => {
        if (!attendanceData || attendanceData.length === 0) return null;
        const todayISODate = new Date().toISOString().slice(0, 10);
        return attendanceData.find((it) => it.date === todayISODate) ?? attendanceData[0];
    }, [attendanceData]);

    // recent history (exclude today's entry if present)
    const recent = useMemo(() => {
        if (!attendanceData) return [];
        const todayISODate = new Date().toISOString().slice(0, 10);
        return attendanceData.filter((it) => it.date !== todayISODate).slice(0, 6);
    }, [attendanceData]);

    const handleClockIn = async () => {
        setActionLoading(true);
        EmployeeServices.MarkClockIn()
            .then(() => {
                FetchAttendence();
                toast.success('Clock In action successful.');
            })
            .catch((e) => {
                toast.error(e?.message || 'Clock In failed');
            })
            .finally(() => setActionLoading(false));
    };
    const handleClockOut = async () => {
        setActionLoading(true);
        EmployeeServices.MarkClockOut()
            .then(() => {
                FetchAttendence();
                toast.success('Clock out action successful.');
            })
            .catch((e) => {
                toast.error(e?.message || 'Clock out failed');
            })
            .finally(() => setActionLoading(false));
    };

    // header working hours should update in real time (depends on `now`)
    const headerWorkingHours = useMemo(() => {
        if (!todays) return '0h';
        const wh = computeWorkingHours(todays.clock_in_time, todays.clock_out_time, now);
        return wh ?? (todays.clock_in_time ? '—' : '0h');
    }, [todays, now]);

    // decide which action button to show (only one or none)
    const actionButton = useMemo(() => {
        if (!todays) return { type: 'in' as const };
        const hasIn = Boolean(todays.clock_in_time);
        const hasOut = Boolean(todays.clock_out_time);
        if (!hasIn) return { type: 'in' as const };
        if (hasIn && !hasOut) return { type: 'out' as const };
        return { type: 'none' as const };
    }, [todays]);

    return (
        <div className="max-w-6xl mx-auto space-y-8 p-6">
            <div className="text-center">
                <h1 className="text-3xl font-extrabold text-purple-700">Employee Attendance</h1>
                <p className="text-sm text-gray-500 mt-1">Track your daily attendance and working hours</p>
            </div>

            {/* Current time card */}
            <div className="flex justify-center">
                <div className="rounded-xl shadow-2xl px-8 py-6 bg-gradient-to-r from-indigo-500 to-purple-600 text-white w-full max-w-2xl">
                    <div className="text-center">
                        <div className="text-xs uppercase opacity-80 flex items-center justify-center gap-2">
                            <Clock className="w-4 h-4" />
                            <span>Current Time</span>
                        </div>
                        <div className="text-3xl md:text-4xl font-bold mt-2">{now.toLocaleTimeString()}</div>
                        <div className="text-xs opacity-90 mt-2">{now.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</div>
                    </div>
                </div>
            </div>

            {/* Today's Attendance summary */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
                <div className="flex flex-col items-center justify-between gap-6">
                    <div className="flex-1 grid w-full grid-cols-2 md:grid-cols-4 gap-4">
                        {/* Clock In */}
                        <div className="flex flex-col items-center">
                            <div className="bg-green-50 rounded-full p-3">
                                <LogIn className="w-5 h-5 text-green-600" />
                            </div>
                            <div className="mt-3 text-sm text-gray-600">Clock In</div>
                            <div className="text-lg font-medium">{todays ? formatTimeFromIso(todays.clock_in_time) : '--:--'}</div>
                            {todays?.is_late && todays.late_minutes ? (
                                <div className="text-xs text-red-600 mt-1 flex items-center gap-2">
                                    <XCircle className="w-3 h-3" />
                                    <span>Late by {formatLateMinutes(todays.late_minutes)}</span>
                                </div>
                            ) : null}
                        </div>

                        {/* Clock Out */}
                        <div className="flex flex-col items-center">
                            <div className="bg-gray-100 rounded-full p-3">
                                <LogOut className="w-5 h-5 text-gray-600" />
                            </div>
                            <div className="mt-3 text-sm text-gray-600">Clock Out</div>
                            <div className="text-lg font-medium">{todays ? formatTimeFromIso(todays.clock_out_time) : '--:--'}</div>
                        </div>

                        {/* Working Hours */}
                        <div className="flex flex-col items-center">
                            <div className="bg-blue-50 rounded-full p-3">
                                <ArrowRightCircle className="w-5 h-5 text-blue-600" />
                            </div>
                            <div className="mt-3 text-sm text-gray-600">Working Hours</div>
                            <div className="text-lg font-medium">{headerWorkingHours}</div>
                        </div>

                        {/* Status */}
                        <div className="flex flex-col items-center">
                            <div className="bg-green-50 rounded-full p-3">
                                <CheckCircle className="w-5 h-5 text-green-600" />
                            </div>
                            <div className="mt-3 text-sm text-gray-600">Status</div>
                            <div className="text-lg font-medium">
                                {todays ? (
                                    todays.is_holiday ? (
                                        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-50 text-yellow-700 text-xs">Holiday</span>
                                    ) : todays.is_present ? (
                                        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-50 text-green-700 text-xs">Present</span>
                                    ) : todays.is_absent ? (
                                        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-50 text-red-700 text-xs">Absent</span>
                                    ) : (
                                        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gray-50 text-gray-700 text-xs">—</span>
                                    )
                                ) : (
                                    <span className="text-gray-500">—</span>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* single action button (max one) */}
                    <div className="flex-shrink-0">
                        {actionButton.type === 'in' && (
                            <button
                                onClick={handleClockIn}
                                disabled={actionLoading}
                                className="bg-gradient-to-r from-green-500 to-green-800 hover:from-green-600 hover:to-green-900 text-white px-5 py-3 rounded-full shadow flex items-center"
                            >
                                <LogIn className="inline-block w-4 h-4 mr-2" />
                                {actionLoading ? 'Working...' : 'Clock In'}
                            </button>
                        )}
                        {actionButton.type === 'out' && (
                            <button
                                onClick={handleClockOut}
                                disabled={actionLoading}
                                className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-5 py-3 rounded-full shadow flex items-center"
                            >
                                <LogOut className="inline-block w-4 h-4 mr-2" />
                                {actionLoading ? 'Working...' : 'Clock Out'}
                            </button>
                        )}
                        {/* if 'none' -> show nothing */}
                    </div>
                </div>
            </div>

            {/* Recent Attendance History */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Attendance History</h3>

                {loading && <div className="text-sm text-gray-500">Loading...</div>}

                {!loading && recent.length === 0 && <div className="text-sm text-gray-500">No recent attendance records.</div>}

                <div className="space-y-4">
                    {recent.map((rec) => {
                        // compute working hours using `now` if out missing (real-time)
                        const working = computeWorkingHours(rec.clock_in_time, rec.clock_out_time, now);
                        return (
                            <div key={rec.id} className="flex items-center justify-between bg-gray-50 rounded-lg p-4 border">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-700 font-semibold">
                                        <User className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <div className="font-medium text-gray-800">{new Date(rec.date).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}</div>
                                        <div className="text-xs text-gray-500">
                                            {rec.employee.name} • {rec.employee.department ?? '—'}
                                        </div>
                                        {rec.is_late && rec.late_minutes ? <div className="text-xs text-red-600 mt-1">Late by {formatLateMinutes(rec.late_minutes)}</div> : null}
                                        {rec.is_holiday ? <div className="text-xs text-yellow-700 mt-1">Holiday</div> : null}
                                    </div>
                                </div>

                                <div className="text-right grid grid-cols-3 items-center gap-5">
                                    <div className="text-sm text-gray-500 flex flex-col text-center">
                                        <span className="font-medium">In</span> <span className="text-gray-800">{formatTimeFromIso(rec.clock_in_time)}</span>
                                    </div>
                                    <div className="text-sm text-gray-500 text-center flex flex-col">
                                        <span className="font-medium">Out</span> <span className="text-gray-800">{formatTimeFromIso(rec.clock_out_time)}</span>
                                    </div>
                                    <div className="text-sm text-gray-500 mt-1 flex flex-col items-center text-center">
                                        <span className="font-medium">Hours</span>{' '}
                                        <span className="text-gray-800">{rec.clock_in_time && rec.clock_out_time ? computeWorkingHours(rec.clock_in_time, rec.clock_out_time) : '--:--'}</span>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
