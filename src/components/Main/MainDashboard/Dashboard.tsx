import React from 'react';
import { motion } from 'framer-motion';
import ReactApexChart from 'react-apexcharts';
import CountUp from 'react-countup';
import IconUsers from '../../../components/Icon/IconUsers';
import IconTrendingUp from '../../../components/Icon/IconTrendingUp';
import IconCalendar from '../../../components/Icon/IconCalendar';
import IconPencilPaper from '../../../components/Icon/IconPencilPaper';
import IconPlus from '../../../components/Icon/IconPlus';
import IconCircleCheck from '../../../components/Icon/IconCircleCheck';
import IconInfoTriangle from '../../../components/Icon/IconInfoTriangle';

const MainDashboard = () => {
    const isDark = document.documentElement.classList.contains('dark');

    // Animation variants for staggered animations
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const cardVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                type: "spring",
                stiffness: 100,
                damping: 10
            }
        }
    };

    const chartVariants = {
        hidden: { opacity: 0, scale: 0.8 },
        visible: {
            opacity: 1,
            scale: 1,
            transition: {
                type: "spring",
                stiffness: 100,
                damping: 15
            }
        }
    };

    const slideVariants = {
        hidden: { opacity: 0, x: -20 },
        visible: {
            opacity: 1,
            x: 0,
            transition: {
                type: "spring",
                stiffness: 100
            }
        }
    };

    // Mock data
    const attendanceData = {
        totalEmployees: 150,
        presentEmployees: 120,
        absentEmployees: 20,
        onLeave: 10,
    };

    const appraisalData = {
        pendingAppraisals: 15,
        upcomingAppraisals: 8,
        nextReviews: [
            { date: '2024-12-15', name: 'John Doe' },
            { date: '2024-12-18', name: 'Jane Smith' },
            { date: '2024-12-20', name: 'Mike Johnson' },
        ],
    };

    const kpiData = {
        companyPerformance: 85,
        departmentalPerformance: {
            HR: 88,
            IT: 92,
            Finance: 85,
            Marketing: 78,
            Operations: 82,
        },
        individualPerformance: {
            metrics: ['Goals', 'Skills', 'Attendance', 'Projects', 'Leadership'],
            values: [85, 78, 90, 88, 75],
        },
    };

    const trainingData = {
        totalEmployees: 150,
        assigned: 125,
        completed: 95,
        inProgress: 30,
        assignedPercentage: 83,
        completionPercentage: 76,
    };

    // Add more detailed HR metrics
    const hrMetrics = {
        recruitment: {
            openPositions: 12,
            activeApplications: 45,
            interviewsScheduled: 8,
            offersPending: 3,
            timeToHire: 25, // in days
            costPerHire: 2500,
        },
        employeeEngagement: {
            satisfactionScore: 85,
            lastSurveyParticipation: 92,
            employeeTurnover: 4.2,
            averageTenure: 3.2, // in years
        },
        compensation: {
            averageSalary: 65000,
            payrollCost: 850000,
            benefitsCost: 150000,
            compensationRatio: 28, // percentage of revenue
        },
        development: {
            trainingBudgetUsed: 75, // percentage
            certifications: 45,
            skillGapIndex: 82,
            promotions: 12,
        },
        compliance: {
            documentsExpiringSoon: 8,
            mandatoryTrainingCompletion: 94,
            incidentReports: 2,
            policyAcknowledgments: 98,
        }
    };

    return (
        <motion.div 
            className="dashboard-container p-6 max-w-[1920px] mx-auto"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
        >
            {/* Header with Quick Actions */}
            <motion.div 
                className="flex flex-col md:flex-row justify-between items-center mb-8"
                variants={slideVariants}
            >
                <div>
                    <h1 className="text-3xl font-bold text-gray-800 dark:text-white bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        HR Dashboard
                    </h1>
                    <p className="text-gray-500 mt-1">Real-time overview of your organization</p>
                </div>
                <div className="flex gap-4">
                    <motion.button 
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="btn-primary px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-lg hover:shadow-xl"
                    >
                        <IconPlus className="w-4 h-4 inline-block mr-2" />
                        New Employee
                    </motion.button>
                    <motion.button 
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="btn-secondary px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-800 transition-all duration-300 shadow-md hover:shadow-lg"
                    >
                        <IconCalendar className="w-4 h-4 inline-block mr-2" />
                        Generate Report
                    </motion.button>
                </div>
            </motion.div>

            {/* Main Stats Grid - 70% width */}
            <div className="grid grid-cols-12 gap-6 mb-6">
                {/* Key Metrics - 70% width */}
                <motion.div 
                    className="col-span-12 lg:col-span-8"
                    variants={containerVariants}
                >
                    <div className="grid md:grid-cols-4 grid-cols-1  gap-4">
                        {/* Attendance Cards with hover effects */}
                        <motion.div
                            variants={cardVariants}
                            whileHover={{ 
                                scale: 1.02,
                                transition: { type: "spring", stiffness: 400 }
                            }}
                            className="col-span-1 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border-l-4 border-blue-500 hover:shadow-xl transition-all duration-300"
                        >
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="text-sm text-gray-500 mb-1">Total Employees</p>
                                    <h3 className="text-2xl font-bold text-gray-800 dark:text-white">
                                        <CountUp end={attendanceData.totalEmployees} duration={2} />
                                    </h3>
                                </div>
                                <div className="p-3 bg-blue-100 rounded-lg">
                                    <IconUsers className="w-6 h-6 text-blue-600" />
                                </div>
                            </div>
                        </motion.div>

                        <motion.div
                            variants={cardVariants}
                            whileHover={{ 
                                scale: 1.02,
                                transition: { type: "spring", stiffness: 400 }
                            }}
                            transition={{ delay: 0.1 }}
                            className="col-span-1 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border-l-4 border-green-500 hover:shadow-xl transition-all duration-300"
                        >
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="text-sm text-gray-500 mb-1">Present Today</p>
                                    <h3 className="text-2xl font-bold text-gray-800 dark:text-white">
                                        <CountUp end={attendanceData.presentEmployees} duration={2} />
                                    </h3>
                                </div>
                                <div className="p-3 bg-green-100 rounded-lg">
                                    <IconCircleCheck className="w-6 h-6 text-green-600" />
                                </div>
                            </div>
                        </motion.div>

                        <motion.div
                            variants={cardVariants}
                            whileHover={{ 
                                scale: 1.02,
                                transition: { type: "spring", stiffness: 400 }
                            }}
                            transition={{ delay: 0.2 }}
                            className="col-span-1 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border-l-4 border-red-500 hover:shadow-xl transition-all duration-300"
                        >
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="text-sm text-gray-500 mb-1">Absent Today</p>
                                    <h3 className="text-2xl font-bold text-gray-800 dark:text-white">
                                        <CountUp end={attendanceData.absentEmployees} duration={2} />
                                    </h3>
                                </div>
                                <div className="p-3 bg-red-100 rounded-lg">
                                    <IconInfoTriangle className="w-6 h-6 text-red-600" />
                                </div>
                            </div>
                        </motion.div>

                        <motion.div
                            variants={cardVariants}
                            whileHover={{ 
                                scale: 1.02,
                                transition: { type: "spring", stiffness: 400 }
                            }}
                            transition={{ delay: 0.3 }}
                            className="col-span-1 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border-l-4 border-yellow-500 hover:shadow-xl transition-all duration-300"
                        >
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="text-sm text-gray-500 mb-1">On Leave</p>
                                    <h3 className="text-2xl font-bold text-gray-800 dark:text-white">
                                        <CountUp end={attendanceData.onLeave} duration={2} />
                                    </h3>
                                </div>
                                <div className="p-3 bg-yellow-100 rounded-lg">
                                    <IconCalendar className="w-6 h-6 text-yellow-600" />
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* Performance Charts with animations */}
                    <motion.div
                        variants={chartVariants}
                        className="mt-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300"
                    >
                        <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-6 flex items-center">
                            <IconTrendingUp className="w-6 h-6 mr-2 text-blue-600" />
                            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                Performance Overview
                            </span>
                        </h2>
                        <ReactApexChart
                            options={{
                                chart: {
                                    type: 'bar',
                                    toolbar: {
                                        show: false
                                    },
                                    background: 'transparent'
                                },
                                plotOptions: {
                                    bar: {
                                        horizontal: false,
                                        columnWidth: '55%',
                                        borderRadius: 8
                                    },
                                },
                                dataLabels: {
                                    enabled: false
                                },
                                grid: {
                                    borderColor: isDark ? '#374151' : '#E5E7EB',
                                    strokeDashArray: 4
                                },
                                xaxis: {
                                    categories: Object.keys(kpiData.departmentalPerformance),
                                    labels: {
                                        style: {
                                            colors: isDark ? '#9CA3AF' : '#6B7280'
                                        }
                                    }
                                },
                                yaxis: {
                                    labels: {
                                        style: {
                                            colors: isDark ? '#9CA3AF' : '#6B7280'
                                        }
                                    }
                                },
                                theme: {
                                    mode: isDark ? 'dark' : 'light'
                                }
                            }}
                            series={[{
                                name: 'Performance',
                                data: Object.values(kpiData.departmentalPerformance)
                            }]}
                            type="bar"
                            height={350}
                        />
                    </motion.div>
                </motion.div>

                {/* Side Stats - 30% width */}
                <motion.div 
                    className="col-span-12 lg:col-span-4 space-y-6"
                    variants={containerVariants}
                >
                    {/* Recruitment Summary with hover effects */}
                    <motion.div
                        variants={cardVariants}
                        whileHover={{ 
                            scale: 1.02,
                            transition: { type: "spring", stiffness: 400 }
                        }}
                        className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300"
                    >
                        <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
                            <IconUsers className="w-5 h-5 inline-block mr-2" />
                            Recruitment Pipeline
                        </h2>
                        <ReactApexChart
                            options={{
                                chart: {
                                    type: 'donut',
                                    background: 'transparent'
                                },
                                labels: ['Open', 'In Progress', 'Offered', 'Closed'],
                                colors: ['#3B82F6', '#10B981', '#F59E0B', '#6366F1'],
                                legend: {
                                    position: 'bottom',
                                    labels: {
                                        colors: isDark ? '#9CA3AF' : '#6B7280'
                                    }
                                },
                                theme: {
                                    mode: isDark ? 'dark' : 'light'
                                }
                            }}
                            series={[
                                hrMetrics.recruitment.openPositions,
                                hrMetrics.recruitment.activeApplications,
                                hrMetrics.recruitment.offersPending,
                                8 // closed positions
                            ]}
                            type="donut"
                            height={300}
                        />
                    </motion.div>

                    {/* Employee Engagement Metrics with animations */}
                    <motion.div
                        variants={cardVariants}
                        whileHover={{ 
                            scale: 1.02,
                            transition: { type: "spring", stiffness: 400 }
                        }}
                        transition={{ delay: 0.2 }}
                        className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300"
                    >
                        <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
                            <IconTrendingUp className="w-5 h-5 inline-block mr-2" />
                            Employee Engagement
                        </h2>
                        <div className="space-y-4">
                            {/* Satisfaction Score */}
                            <div>
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-sm text-gray-500">Satisfaction</span>
                                    <span className="text-sm font-semibold">{hrMetrics.employeeEngagement.satisfactionScore}%</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div
                                        className="bg-green-500 h-2 rounded-full transition-all duration-500"
                                        style={{ width: `${hrMetrics.employeeEngagement.satisfactionScore}%` }}
                                    ></div>
                                </div>
                            </div>
                            {/* Survey Participation */}
                            <div>
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-sm text-gray-500">Survey Participation</span>
                                    <span className="text-sm font-semibold">{hrMetrics.employeeEngagement.lastSurveyParticipation}%</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div
                                        className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                                        style={{ width: `${hrMetrics.employeeEngagement.lastSurveyParticipation}%` }}
                                    ></div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            </div>

            {/* Bottom Section with staggered animations */}
            <motion.div 
                className="grid grid-cols-1 lg:grid-cols-3 gap-6"
                variants={containerVariants}
            >
                {/* Training Progress with hover effects */}
                <motion.div
                    variants={cardVariants}
                    whileHover={{ 
                        scale: 1.02,
                        transition: { type: "spring", stiffness: 400 }
                    }}
                    className="col-span-1 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300"
                >
                    <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-6">
                        <IconPencilPaper className="w-5 h-5 inline-block mr-2" />
                        Training Progress
                    </h2>
                    <ReactApexChart
                        options={{
                            chart: {
                                type: 'radialBar',
                                background: 'transparent'
                            },
                            plotOptions: {
                                radialBar: {
                                    hollow: {
                                        size: '70%',
                                    },
                                    track: {
                                        background: isDark ? '#374151' : '#E5E7EB',
                                    },
                                    dataLabels: {
                                        name: {
                                            color: isDark ? '#9CA3AF' : '#6B7280'
                                        },
                                        value: {
                                            color: isDark ? '#FFFFFF' : '#111827',
                                            fontSize: '30px',
                                            fontWeight: 600
                                        }
                                    }
                                }
                            },
                            labels: ['Completion'],
                            colors: ['#10B981'],
                            theme: {
                                mode: isDark ? 'dark' : 'light'
                            }
                        }}
                        series={[hrMetrics.compliance.mandatoryTrainingCompletion]}
                        type="radialBar"
                        height={300}
                    />
                </motion.div>

                {/* Compliance Overview with animations */}
                <motion.div
                    variants={cardVariants}
                    whileHover={{ 
                        scale: 1.02,
                        transition: { type: "spring", stiffness: 400 }
                    }}
                    transition={{ delay: 0.1 }}
                    className="col-span-1 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300"
                >
                    <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-6">
                        <IconPlus className="w-5 h-5 inline-block mr-2" />
                        Compliance Overview
                    </h2>
                    <div className="grid grid-cols-2 gap-4 mb-6">
                        <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-4">
                            <p className="text-sm text-gray-500">Expiring Docs</p>
                            <p className="text-2xl font-bold text-red-600">{hrMetrics.compliance.documentsExpiringSoon}</p>
                        </div>
                        <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-4">
                            <p className="text-sm text-gray-500">Training Complete</p>
                            <p className="text-2xl font-bold text-orange-600">{hrMetrics.compliance.mandatoryTrainingCompletion}%</p>
                        </div>
                    </div>
                    <div className="mb-4">
                        <div className="flex items-center justify-between text-sm mb-2">
                            <span>Policy Acknowledgments</span>
                            <span className="font-semibold">{hrMetrics.compliance.policyAcknowledgments}%</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                            <span>Incident Reports</span>
                            <span className="font-semibold">{hrMetrics.compliance.incidentReports}</span>
                        </div>
                    </div>
                </motion.div>

                {/* Employee Development with animations */}
                <motion.div
                    variants={cardVariants}
                    whileHover={{ 
                        scale: 1.02,
                        transition: { type: "spring", stiffness: 400 }
                    }}
                    transition={{ delay: 0.2 }}
                    className="col-span-1 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300"
                >
                    <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-6">
                        <IconPencilPaper className="w-5 h-5 inline-block mr-2" />
                        Employee Development
                    </h2>
                    <div className="grid grid-cols-2 gap-4 mb-6">
                        <div className="bg-teal-50 dark:bg-teal-900/20 rounded-lg p-4">
                            <p className="text-sm text-gray-500">Budget Used</p>
                            <p className="text-2xl font-bold text-teal-600">{hrMetrics.development.trainingBudgetUsed}%</p>
                        </div>
                        <div className="bg-cyan-50 dark:bg-cyan-900/20 rounded-lg p-4">
                            <p className="text-sm text-gray-500">Certifications</p>
                            <p className="text-2xl font-bold text-cyan-600">{hrMetrics.development.certifications}</p>
                        </div>
                    </div>
                    <div className="mb-4">
                        <div className="flex items-center justify-between text-sm mb-2">
                            <span>Skill Gap Index</span>
                            <span className="font-semibold">{hrMetrics.development.skillGapIndex}%</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                            <span>Recent Promotions</span>
                            <span className="font-semibold">{hrMetrics.development.promotions}</span>
                        </div>
                    </div>
                </motion.div>
            </motion.div>

            {/* Add glass-morphism effect to cards */}
            <style jsx>{`
                .dashboard-container {
                    background: linear-gradient(to bottom right, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05));
                }
                .card {
                    backdrop-filter: blur(10px);
                    background: rgba(255, 255, 255, 0.1);
                }
                .dark .card {
                    background: rgba(17, 24, 39, 0.8);
                }
            `}</style>
        </motion.div>
    );
};

export default MainDashboard;
