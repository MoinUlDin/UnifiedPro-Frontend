import React from 'react';
import { motion } from 'framer-motion';

interface HeaderProps {
    selectedPeriod: 'daily' | 'weekly' | 'monthly';
    setSelectedPeriod: (p: 'daily' | 'weekly' | 'monthly') => void;
}

const Header: React.FC<HeaderProps> = ({ selectedPeriod, setSelectedPeriod }) => (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Tasks Dashboard</h1>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">Track and manage your team's tasks and performance</p>
        </div>
        <div className="flex items-center gap-4">
            <div className="flex rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700">
                {(['daily', 'weekly', 'monthly'] as const).map((period) => (
                    <button
                        key={period}
                        onClick={() => setSelectedPeriod(period)}
                        className={`px-4 py-2 text-sm font-medium ${
                            selectedPeriod === period ? 'bg-primary-500 text-gray-600' : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700'
                        } transition-colors duration-200`}
                    >
                        {period.charAt(0).toUpperCase() + period.slice(1)}
                    </button>
                ))}
            </div>
        </div>
    </div>
);

export default Header;
