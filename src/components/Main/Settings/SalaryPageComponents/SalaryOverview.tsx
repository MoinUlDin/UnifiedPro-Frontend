// src/components/SalaryOverview.tsx
import React from 'react';
import { ClipboardList, TrendingUp, Calculator, Calendar, Percent, Users, Building2, Clock } from 'lucide-react';

const sections = [
    { key: 'jobTypes', label: 'Job Types', icon: <ClipboardList className="w-6 h-6 text-purple-500" /> },
    { key: 'payGrades', label: 'Pay Grades', icon: <TrendingUp className="w-6 h-6 text-orange-500" /> },
    { key: 'components', label: 'Components', icon: <Calculator className="w-6 h-6 text-teal-500" /> },
    { key: 'frequencies', label: 'Frequencies', icon: <Calendar className="w-6 h-6 text-indigo-500" /> },
    { key: 'deductions', label: 'Deductions', icon: <Percent className="w-6 h-6 text-red-500" /> },
    { key: 'profiles', label: 'Profiles', icon: <Users className="w-6 h-6 text-green-500" /> },
    { key: 'structures', label: 'Structures', icon: <Building2 className="w-6 h-6 text-blue-500" /> },
    { key: 'leaveInfo', label: 'Leave Info', icon: <Clock className="w-6 h-6 text-yellow-500" /> },
];

export default function SalaryOverview({ onSectionClick }: { onSectionClick?: (key: string) => void }) {
    return (
        <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Quick Access</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {sections.map(({ key, label, icon }) => (
                    <button key={key} onClick={() => onSectionClick?.(key)} className="flex flex-col items-center justify-center p-4 bg-gray-50 rounded hover:bg-gray-100 transition">
                        <div className="p-2 bg-white rounded-full shadow-sm mb-2">{icon}</div>
                        <span className="text-sm font-medium text-gray-700">{label}</span>
                    </button>
                ))}
            </div>
        </div>
    );
}
