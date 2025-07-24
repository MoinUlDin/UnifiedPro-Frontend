// StatsCard.tsx
import React from 'react';
import { motion } from 'framer-motion';

interface StatsCardProps {
    label: string;
    count: number;
    total: number;
    icon: React.ReactNode;
    bgColor: string;
    textColor: string;
    barColor?: string;
}

const StatsCard: React.FC<StatsCardProps> = ({ label, count, total, icon, bgColor, textColor, barColor = 'bg-red-600' }) => {
    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="bg-white dark:bg-slate-800 rounded-xl shadow-lg overflow-hidden">
            <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                    <div className={`p-2 ${bgColor} rounded-lg`}>{icon}</div>
                    <span className={`text-sm font-medium ${textColor}`}>{label}</span>
                </div>
                <div className="flex items-baseline gap-2">
                    <p className="text-3xl font-bold text-slate-900 dark:text-white">{count}</p>
                    <span className="text-sm text-slate-600 dark:text-slate-400">tasks</span>
                </div>
                <div className="mt-4">
                    <div className="h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                        <div className={`h-full ${barColor} rounded-full transition-all duration-500`} style={{ width: `${(count / total) * 100}%` }} />
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default StatsCard;
