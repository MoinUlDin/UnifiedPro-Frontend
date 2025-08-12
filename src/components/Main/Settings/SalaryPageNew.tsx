// src/components/SalaryManagementDashboard.tsx
import React, { useEffect, useState } from 'react';
import { DollarSign, Users, ClipboardList, TrendingUp, Calendar, Building2, Clock, Calculator, Percent, CheckCircle, Plus, Search, Filter } from 'lucide-react';
import JobPopup from './SalaryPageComponents/JobPopup';
import JobDataTable from './SalaryPageComponents/JobDataTable';
import PayGradeDataTable from './SalaryPageComponents/PayGradeDataTable';
import PayGradePopup from './SalaryPageComponents/PayGradePopup';
import SalaryComponentTable from './SalaryPageComponents/SalaryComponentTable';
import ComponentPopup from './SalaryPageComponents/ComponentPopup';
import PayFrequenciesTable from './SalaryPageComponents/PayFrequenciesTable';
import DeductionTable from './SalaryPageComponents/DeductionTable';
import DeductionPopup from './SalaryPageComponents/DeductionPopup';
import BasicProfileTable from './SalaryPageComponents/BasicProfileTable';
import BasicProfilePopup from './SalaryPageComponents/BasicProfilePopup';
import SalaryStructureTable from './SalaryPageComponents/SalaryStructureTable';
import toast, { Toaster } from 'react-hot-toast';

const tabs = [
    { key: 'overView', label: 'Over View', icon: <Building2 className="w-5 h-5" /> },
    { key: 'jobTypes', label: 'Job Types', icon: <ClipboardList className="w-5 h-5" /> },
    { key: 'payGrades', label: 'Pay Grades', icon: <TrendingUp className="w-5 h-5" /> },
    { key: 'components', label: 'Components', icon: <Calculator className="w-5 h-5" /> },
    { key: 'frequencies', label: 'Frequencies', icon: <Calendar className="w-5 h-5" /> },
    { key: 'deductions', label: 'Deductions', icon: <Percent className="w-5 h-5" /> },
    { key: 'profiles', label: 'Profiles', icon: <Users className="w-5 h-5" /> },
    { key: 'structures', label: 'Structures', icon: <Building2 className="w-5 h-5" /> },
    { key: 'leaveInfo', label: 'Leave Info', icon: <Clock className="w-5 h-5" /> },
];

export default function SalaryPageNew() {
    const [openJob, setOpenjob] = useState<boolean>(false);
    const [openPayGrade, setOpenPayGrade] = useState<boolean>(false);
    const [openComponent, setOpenComponent] = useState<boolean>(false);
    const [openBasicProfile, setOpenBasicProfile] = useState<boolean>(false);
    const [activeTab, setActiveTab] = useState<string>(tabs[0].key);

    useEffect(() => {
        console.log('activeTab: ', activeTab);
    }, [activeTab]);

    const hanldeResponse = (data: any) => {
        // toast.success(data, { duration: 4000 });
    };
    return (
        <div className="space-y-8 p-6 bg-gray-50 min-h-screen">
            {/* Header */}
            <div className="relative space-y-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold text-gray-900">Salary Management</h1>
                        <p className="text-gray-600">Comprehensive salary structure and component management</p>
                    </div>
                    <DollarSign className="w-8 h-8 text-green-500" />
                </div>
            </div>

            {/* Navigation Tabs */}
            <nav className="bg-ray-100 rounded-lg bg-gradient-to-br from-blue-400 to-green-800 p-3">
                <ul className="grid grid-cols-3 gap-3">
                    {tabs.map(({ key, label, icon }) => {
                        const isActive = key === activeTab;
                        return (
                            <li key={key} className="flex-1">
                                <button
                                    onClick={() => setActiveTab(key)}
                                    className={`
                                    w-full flex items-center gap-2
                                    px-4 py-2
                                    ${isActive ? 'bg-gradient-to-br from-orange-200 to bg-red-500' : 'bg-gray-100 text-gray-700 hover:bg-gray-700 hover:text-white'}
                                    rounded
                                    `}
                                >
                                    {React.cloneElement(icon, {
                                        className: isActive ? 'w-5 h-5 text-gray-600' : 'w-5 h-5 text-gray-500',
                                    })}
                                    <span className="text-sm font-medium">{label}</span>
                                </button>
                            </li>
                        );
                    })}
                </ul>
            </nav>

            {/* Search & Filter */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center border border-gray-300 rounded overflow-hidden">
                    <span className="px-2">
                        <Search className="w-4 h-4 text-gray-500" />
                    </span>
                    <input type="text" placeholder="Search across all sections..." className="px-2 py-1 outline-none w-64" />
                </div>
                <button className="flex items-center px-3 py-1 bg-white border border-gray-300 rounded hover:bg-gray-100">
                    <Filter className="w-4 h-4 mr-1 text-gray-600" /> Filter
                </button>
            </div>

            {/* Salary Overview child */}
            {activeTab === 'jobTypes' && <JobDataTable />}
            {activeTab === 'payGrades' && <PayGradeDataTable />}
            {activeTab === 'components' && <SalaryComponentTable />}
            {activeTab === 'frequencies' && <PayFrequenciesTable />}
            {activeTab === 'deductions' && <DeductionTable />}
            {activeTab === 'profiles' && <BasicProfileTable />}
            {activeTab === 'structures' && <SalaryStructureTable />}

            {/* Quick Actions / Recent Activity / Distribution */}
            {activeTab === 'overView' && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <section className="bg-white rounded-lg shadow p-4 space-y-4">
                        <h2 className="text-lg font-medium">Quick Actions</h2>
                        <button onClick={() => setOpenjob(true)} className="w-full text-left px-3 py-2 border border-gray-300 rounded flex items-center gap-2 hover:bg-gray-50">
                            <Plus className="w-5 h-5" /> New Job Type
                        </button>
                        <button onClick={() => setOpenPayGrade(true)} className="w-full text-left px-3 py-2 border border-gray-300 rounded flex items-center gap-2 hover:bg-gray-50">
                            <Plus className="w-5 h-5" /> New Pay Grade
                        </button>
                        <button onClick={() => setOpenComponent(true)} className="w-full text-left px-3 py-2 border border-gray-300 rounded flex items-center gap-2 hover:bg-gray-50">
                            <Plus className="w-5 h-5" /> New Component
                        </button>
                        <button onClick={() => setOpenBasicProfile(true)} className="w-full text-left px-3 py-2 border border-gray-300 rounded flex items-center gap-2 hover:bg-gray-50">
                            <Plus className="w-5 h-5" /> New Basic Profile
                        </button>
                        <button className="w-full text-left px-3 py-2 border border-gray-300 rounded flex items-center gap-2 hover:bg-gray-50">
                            <Plus className="w-5 h-5" /> New Salary Structure
                        </button>
                    </section>

                    <section className="bg-white rounded-lg shadow p-4">
                        <h2 className="text-lg font-medium mb-2">Recent Activity</h2>
                        <ul className="space-y-3">
                            <li className="flex items-start gap-2">
                                <CheckCircle className="w-5 h-5 text-green-500 mt-1" />
                                <div>
                                    <p>
                                        <strong>Salary structure updated</strong> for Sarah Johnson
                                    </p>
                                    <p className="text-xs text-gray-500">2 hours ago</p>
                                </div>
                            </li>
                            <li className="flex items-start gap-2">
                                <ClipboardList className="w-5 h-5 text-blue-500 mt-1" />
                                <div>
                                    <p>
                                        <strong>New pay grade “Director Level”</strong> created
                                    </p>
                                    <p className="text-xs text-gray-500">5 hours ago</p>
                                </div>
                            </li>
                            <li className="flex items-start gap-2">
                                <Percent className="w-5 h-5 text-red-500 mt-1" />
                                <div>
                                    <p>
                                        <strong>Deduction rate updated</strong> for Income Tax
                                    </p>
                                    <p className="text-xs text-gray-500">1 day ago</p>
                                </div>
                            </li>
                        </ul>
                    </section>

                    <section className="bg-white rounded-lg shadow p-4">
                        <h2 className="text-lg font-medium mb-2">Salary Distribution</h2>
                        <ul className="space-y-2">
                            {[
                                { label: 'Entry Level', count: 0 },
                                { label: 'Mid Level', count: 1 },
                                { label: 'Senior Level', count: 1 },
                                { label: 'Executive Level', count: 1 },
                                { label: 'Director Level', count: 0 },
                            ].map(({ label, count }) => (
                                <li key={label} className="space-y-1">
                                    <div className="flex justify-between text-sm">
                                        <span>{label}</span>
                                        <span>{count} employees</span>
                                    </div>
                                    <div className="h-2 bg-gray-200 rounded overflow-hidden">
                                        <div className="h-full bg-blue-500" style={{ width: `${(count / 5) * 100}%` }} />
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </section>
                </div>
            )}

            <Toaster position="top-right" reverseOrder={false} />
            {/* Popups */}
            {openJob && <JobPopup show={openJob} onClose={() => setOpenjob(false)} sendResponse={hanldeResponse} />}
            {openPayGrade && <PayGradePopup show={openPayGrade} onClose={() => setOpenPayGrade(false)} sendResponse={hanldeResponse} />}
            {openComponent && <ComponentPopup show={openComponent} onClose={() => setOpenComponent(false)} sendResponse={hanldeResponse} />}
            {openBasicProfile && <BasicProfilePopup show={openBasicProfile} onClose={() => setOpenBasicProfile(false)} sendResponse={hanldeResponse} />}
        </div>
    );
}

// small reusable stat card
function StatCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string | number }) {
    return (
        <div className="bg-white rounded-lg shadow p-4 flex items-center gap-4">
            <div className="p-2 bg-gray-100 rounded">{icon}</div>
            <div>
                <div className="text-gray-500 text-sm">{label}</div>
                <div className="font-semibold text-lg">{value}</div>
            </div>
        </div>
    );
}
