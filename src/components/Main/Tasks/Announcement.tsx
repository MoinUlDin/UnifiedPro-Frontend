// AnnouncementsPage.tsx
import React, { useState, useEffect, useMemo } from 'react';
import AnnouncementCard from './AnnouncementCard';
import { FaBullhorn, FaCheckCircle, FaClock, FaExclamation, FaSearch } from 'react-icons/fa';
import CompanySetupServices from '../../../services/CompanySetupServices';
import { useDispatch } from 'react-redux';
import { announcementType } from '../../../constantTypes/CompanySetupTypes';
import { useSelector } from 'react-redux';
import Announcement_Popup from './Announcement_Popup';
import toast, { Toaster } from 'react-hot-toast';

export default function AnnouncementsPage() {
    const announcementsList: announcementType[] = useSelector((s: any) => s.company.announcements);
    const [search, setSearch] = useState('');
    const [deptFilter, setDeptFilter] = useState('All Departments');
    const [prioFilter, setPrioFilter] = useState('All Priorities');
    const [activeOnly, setActiveOnly] = useState(false);
    const [openAnnouncementPopup, setOpenAnnouncementPopup] = useState<boolean>(false);
    const [refresh, setRefresh] = useState<boolean>(false);

    const dispatch = useDispatch();
    // simulate fetch
    useEffect(() => {
        CompanySetupServices.FetchAnnouncements(dispatch)
            .then((r) => {})
            .catch((e) => {
                console.log(e);
            });
    }, [refresh]);
    useEffect(() => {
        if (!announcementsList) return;
        console.log('announcements List: ', announcementsList);
    }, [announcementsList]);

    const departments = useMemo(() => Array.from(new Set(announcementsList?.map((a) => a.department))), [announcementsList]);
    const priorities = useMemo(() => Array.from(new Set(announcementsList?.map((a) => a.priority))), [announcementsList]);

    const filtered = useMemo(() => {
        return announcementsList?.filter((a) => {
            if (activeOnly && !a.is_active) return false;
            if (deptFilter !== 'All Departments' && a.department !== deptFilter) return false;
            if (prioFilter !== 'All Priorities' && a.priority !== prioFilter) return false;
            if (search && !a.title.toLowerCase().includes(search.toLowerCase())) return false;
            return true;
        });
    }, [announcementsList, search, deptFilter, prioFilter, activeOnly]);

    const stats = useMemo(() => {
        if (!announcementsList) return;
        const total = announcementsList?.length;
        const active = announcementsList?.filter((a) => a.is_active).length;
        const high = announcementsList.filter((a) => a.priority === 'High').length;
        const week = announcementsList.filter((a) => {
            const d = new Date(a.date);
            const now = new Date();
            return (now.getTime() - d.getTime()) / (1000 * 60 * 60 * 24) <= 7;
        }).length;
        return { total, active, high, week };
    }, [announcementsList]);

    const onSuccess = () => {
        setRefresh((p) => !p);
    };
    const handleNewCreation = () => {
        setOpenAnnouncementPopup(true);
    };
    return (
        <div className="max-w-6xl mx-auto py-8 px-4">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold">Company Announcements</h1>
                    <p className="text-gray-600">Manage and view company-wide announcements and department updates</p>
                </div>
                <button onClick={handleNewCreation} className="flex items-center bg-blue-600 hover:bg-blue-700 text-white text-sm px-3 py-1.5 rounded">
                    <span>+ New Announcement</span>
                </button>
            </div>

            {/* Toolbar */}
            <div className="flex items-center gap-4 mb-6">
                {/* Search */}
                <div className="relative flex-grow min-w-[50%]">
                    <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                    <input
                        type="text"
                        className="w-full pl-10 py-2 pr-3 border rounded focus:outline-blue-500"
                        placeholder="Search announcements..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>

                {/* Department filter */}
                <select className="border border-gray-300 rounded px-3 py-2 focus:ring-blue-500 focus:border-blue-500" value={deptFilter} onChange={(e) => setDeptFilter(e.target.value)}>
                    <option>All Departments</option>
                    {departments.map((d) => (
                        <option key={d}>{d}</option>
                    ))}
                </select>

                {/* Priority filter */}
                <select className="border border-gray-300 rounded px-3 py-2 focus:ring-blue-500 focus:border-blue-500" value={prioFilter} onChange={(e) => setPrioFilter(e.target.value)}>
                    <option>All Priorities</option>
                    {priorities.map((p) => (
                        <option key={p}>{p}</option>
                    ))}
                </select>

                {/* Active only switch */}
                <div className="flex items-center ml-auto">
                    <input className="form-checkbox size-4 mb-2 text-blue-600" type="checkbox" id="activeOnly" checked={activeOnly} onChange={(e) => setActiveOnly(e.target.checked)} />
                    <label htmlFor="activeOnly" className="ml-1 whitespace-nowrap text-gray-600">
                        Active only
                    </label>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-8">
                <div className="bg-white p-4 rounded-lg shadow flex items-center">
                    <div className="text-blue-500 text-2xl mr-4">
                        <FaBullhorn />
                    </div>
                    <div>
                        <div className="text-xl font-semibold">{stats?.total}</div>
                        <div className="text-gray-500">Total Announcements</div>
                    </div>
                </div>
                <div className="bg-white p-4 rounded-lg shadow flex items-center">
                    <div className="text-green-500 text-2xl mr-4">
                        <FaCheckCircle />
                    </div>
                    <div>
                        <div className="text-xl font-semibold">{stats?.active}</div>
                        <div className="text-gray-500">Active</div>
                    </div>
                </div>
                <div className="bg-white p-4 rounded-lg shadow flex items-center">
                    <div className="text-red-500 text-2xl mr-4">
                        <FaExclamation />
                    </div>
                    <div>
                        <div className="text-xl font-semibold">{stats?.high}</div>
                        <div className="text-gray-500">High Priority</div>
                    </div>
                </div>
                <div className="bg-white p-4 rounded-lg shadow flex items-center">
                    <div className="text-yellow-500 text-2xl mr-4">
                        <FaClock />
                    </div>
                    <div>
                        <div className="text-xl font-semibold">{stats?.week}</div>
                        <div className="text-gray-500">This Week</div>
                    </div>
                </div>
            </div>

            {/* List */}
            <div className="space-y-6">
                {filtered?.map((a) => (
                    <AnnouncementCard inputData={a} onSuccessOuter={onSuccess} />
                ))}
            </div>
            <Toaster position="top-right" reverseOrder={false} />
            {openAnnouncementPopup && <Announcement_Popup onSuccess={onSuccess} onClose={() => setOpenAnnouncementPopup(false)} />}
        </div>
    );
}
