import React from 'react';
import ReactApexChart from 'react-apexcharts';
import IconTrendingUp from '../../../../components/Icon/IconTrendingUp';

function LastOne() {
    return (
        <div>
            {/* Charts Grid */}
            <div className="grid grid-cols-12 gap-6 mb-6">
                {/* Left Column - 70% */}
                {/* <div className="col-span-12 lg:col-span-8 grid grid-cols-1 gap-6">
                    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg overflow-hidden">
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                <p className="text-small font-semibold text-slate-900 dark:text-white">Productivity Trend</p>
                                <div className="p-2 bg-cyan-100 dark:bg-cyan-900/30 rounded-lg">
                                    <IconTrendingUp className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
                                </div>
                            </div>
                            <div className="h-[300px]">
                                <ReactApexChart
                                    options={{
                                        ...chartOptions,
                                        chart: {
                                            ...chartOptions.chart,
                                            type: 'area',
                                        },
                                        stroke: {
                                            curve: 'smooth',
                                            width: 3,
                                        },
                                        markers: {
                                            size: 4,
                                            strokeWidth: 2,
                                            hover: { size: 6 },
                                        },
                                    }}
                                    series={taskCompletionSeries}
                                    type="area"
                                    height="100%"
                                />
                            </div>
                        </div>
                    </div>
                </div> */}

                {/* Right Column - 30%  Task Completion Rate*/}
                <div className="col-span-12 lg:col-span-4 space-y-6">
                    {/* <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg overflow-hidden">
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                <p className="text-small font-semibold text-slate-900 dark:text-white">Task Completion</p>
                                <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                                    <IconCircleCheck className="w-5 h-5 text-green-600 dark:text-green-400" />
                                </div>
                            </div>
                            <div className="h-[250px]">
                                <ReactApexChart options={donutOptions} series={donutSeries} type="donut" height="100%" />
                            </div>
                            <div className="grid grid-cols-1 gap-3 mt-4">
                                <div className="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                                    <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                                        <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Completed</span>
                                    </div>
                                    <span className="text-sm font-semibold text-green-600 dark:text-green-400">{getTaskMetrics().completed}</span>
                                </div>
                                <div className="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                                    <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                                        <span className="text-sm font-medium text-slate-600 dark:text-slate-400">In Progress</span>
                                    </div>
                                    <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">{getTaskMetrics().inProgress}</span>
                                </div>
                                <div className="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                                    <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 bg-slate-500 rounded-full"></div>
                                        <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Not Started</span>
                                    </div>
                                    <span className="text-sm font-semibold text-slate-600 dark:text-slate-400">{getTaskMetrics().notStarted}</span>
                                </div>
                            </div>
                        </div>
                    </div> */}
                </div>
            </div>
        </div>
    );
}

export default LastOne;
