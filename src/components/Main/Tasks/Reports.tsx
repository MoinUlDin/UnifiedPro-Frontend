import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface ReportPanelProps {
    id: number;
    title: string;
    description: string;
    icon: string;
    color: string;
    onClick: () => void;
}

const ReportPanel: React.FC<ReportPanelProps> = ({ title, description, icon, color, onClick }) => {
    const panelRef = useRef<HTMLDivElement>(null);
    const [isHovered, setIsHovered] = useState(false);

    useEffect(() => {
        if (panelRef.current) {
            gsap.fromTo(
                panelRef.current,
                { 
                    opacity: 0,
                    rotateY: -30,
                    scale: 0.8
                },
                {
                    opacity: 1,
                    rotateY: 0,
                    scale: 1,
                    duration: 1,
                    ease: "power4.out",
                    scrollTrigger: {
                        trigger: panelRef.current,
                        start: 'top 85%',
                    },
                }
            );
        }
    }, []);

    return (
        <motion.div
            ref={panelRef}
            className="relative group perspective-1000"
            onHoverStart={() => setIsHovered(true)}
            onHoverEnd={() => setIsHovered(false)}
            onClick={onClick}
        >
            <motion.div
                className={`w-full p-6 rounded-xl backdrop-blur-md bg-white/90 dark:bg-gray-800/90 
                          shadow-lg border border-white/20 cursor-pointer transition-all duration-500
                          hover:shadow-2xl hover:scale-[1.02] overflow-hidden`}
                style={{
                    transform: isHovered ? 'rotateY(10deg)' : 'rotateY(0deg)',
                    transformStyle: 'preserve-3d',
                }}
            >
                <div className="flex items-start space-x-4">
                    <div 
                        className={`flex items-center justify-center p-4 rounded-xl text-white`}
                        style={{ backgroundColor: color }}
                    >
                        <i className={`${icon} text-2xl`} aria-hidden="true"></i>
                    </div>
                    <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                            {title}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-300">
                            {description}
                        </p>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
};

const Reports: React.FC = () => {
    const navigate = useNavigate();
    const [selectedId, setSelectedId] = useState<number | null>(null);

    const reports: Omit<ReportPanelProps, 'onClick'>[] = [
        {
            id: 1,
            title: 'Personal Task Report',
            description: 'View and manage your personal task assignments and progress.',
            icon: 'bi-person-workspace',
            color: '#E9573F',
        },
        {
            id: 2,
            title: 'Subordinate Task Report',
            description: 'Monitor and track tasks assigned to your team members.',
            icon: 'bi-people-fill',
            color: '#4B89DC',
        },
        {
            id: 3,
            title: 'Task Progress & Completion',
            description: 'Analyze task completion rates and overall progress metrics.',
            icon: 'bi-graph-up-arrow',
            color: '#eb3471',
        },
        {
            id: 4,
            title: 'View All Announcements',
            description: 'Access all task-related announcements and updates.',
            icon: 'bi-megaphone-fill',
            color: '#4ceb34',
        }
    ];

    const handlePanelClick = (id: number) => {
        setSelectedId(id);
        switch (id) {
            case 1:
                navigate('/personal_tasks_reports');
                break;
            case 2:
                navigate('/subordinate_tasks_reports');
                break;
            case 3:
                navigate('/task_progress_reports');
                break;
            case 4:
                navigate('/announcements');
                break;
            default:
                navigate('/');
        }
    };

    return (
        <div className="min-h-screen bg-transparent overflow-hidden">
    <div className="max-w-8xl mx-auto relative">
                {/* Decorative Elements */}
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                    <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
                </div>

                {/* Content */}
                <motion.div className="relative z-10">
                    <h1 className="text-4xl font-black text-gray-900 dark:text-white mb-12 text-center">
                        Task Management Reports
                    </h1>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <AnimatePresence>
                            {reports.map((report) => (
                                <motion.div
                                    key={report.id}
                                    layoutId={`report-${report.id}`}
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.8 }}
                                    transition={{ duration: 0.5 }}
                                >
                                    <ReportPanel
                                        {...report}
                                        onClick={() => handlePanelClick(report.id)}
                                    />
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default Reports;