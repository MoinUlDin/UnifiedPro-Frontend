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
    const headerRef = useRef<HTMLDivElement>(null);
    const [selectedId, setSelectedId] = useState<number | null>(null);

    const reports: Omit<ReportPanelProps, 'onClick'>[] = [
        {
            id: 1,
            title: 'Employee Details',
            description: 'View and manage detailed employee records.',
            icon: 'bi-person-vcard-fill',
            color: '#4B89DC',
        },
        {
            id: 2,
            title: 'Department Analysis',
            description: 'Explore department-wise employee data.',
            icon: 'bi-diagram-3-fill',
            color: '#E9573F',
        },
        {
            id: 3,
            title: 'Contact Directory',
            description: 'Access the employee contact directory.',
            icon: 'bi-journal-text',
            color: '#37BC9B',
        },
        {
            id: 4,
            title: 'Birthday Calendar',
            description: 'View upcoming birthdays of employees.',
            icon: 'bi-calendar-heart-fill',
            color: '#967ADC',
        },
        {
            id: 5,
            title: 'Termination Stats',
            description: 'Analyze termination rates and reasons.',
            icon: 'bi-pie-chart-fill',
            color: '#F6BB42',
        },
        {
            id: 6,
            title: 'Recruitment Pipeline',
            description: 'Track recruitment progress and metrics.',
            icon: 'bi-kanban-fill',
            color: '#DA4453',
        },
        {
            id: 7,
            title: 'Time Metrics',
            description: 'Analyze employee time and attendance.',
            icon: 'bi-clock-history',
            color: '#79ab05',
        },
        {
            id: 8,
            title: 'Performance Reviews',
            description: 'View employee performance metrics.',
            icon: 'bi-graph-up-arrow',
            color: '#f0b111',
        }
    ];

    const handlePanelClick = (id: number) => {
        const routes = {
            1: '/report-employee-details',
            3: '/employee_contact_directory',
            4: '/birthday_directory',
        };
        navigate(routes[id] || '/');
    };

    return (
        <div className="min-h-screen bg-transparent overflow-hidden">
            <div className="max-w-8xl mx-auto relative">
                {/* Decorative Elements */}
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                    <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
                </div>

                <div ref={headerRef} className="relative text-center mb-20 space-y-6">
                    <motion.h1 
                        className="text-4xl font-black tracking-tight bg-gradient-to-r from-gray-900 via-gray-700 to-gray-900 
                                 dark:from-white dark:via-gray-300 dark:to-white bg-clip-text text-transparent leading-tight"
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                    >
                        HCIMS Reports
                    </motion.h1>
                    <motion.p 
                        className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                    >
                        Access comprehensive HR insights and analytics through our enterprise-grade reporting system
                    </motion.p>
                </div>

                <motion.div 
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6 mt-16"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                >
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
                                    onClick={() => {
                                        setSelectedId(report.id);
                                        handlePanelClick(report.id);
                                    }}
                                />
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </motion.div>
            </div>
        </div>
    );
};

export default Reports;
