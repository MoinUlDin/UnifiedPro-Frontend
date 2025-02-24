import React, { useState } from 'react';

const Performance_Matric = () => {
    const [metrics, setMetrics] = useState({
        managerPercentage: '',
        punctualityPercentage: '',
        regularityPercentage: '',
        taskPercentage: '',
        multiRaterPercentage: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setMetrics({ ...metrics, [name]: value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Updated Metrics:', metrics);
        // Add logic for submitting data to the server
    };

    return (
        <div className="p-6 mx-auto bg-white dark:bg-[#1c232f] dark:text-gray-200 shadow-md rounded-lg">
            <h2 className="text-start text-2xl font-semibolds mb-6">Update Performance Metrics for None</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label className="dark:text-gray-300 block text-sm font-medium text-gray-700">Manager percentage:</label>
                        <input
                            type="number"
                            name="managerPercentage"
                            value={metrics.managerPercentage}
                            onChange={handleChange}
                            className="dark:bg-gray-600 border mt-1 w-full p-2 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                    <div>
                        <label className="dark:text-gray-300 block text-sm font-medium text-gray-700">Punctuality percentage:</label>
                        <input
                            type="number"
                            name="punctualityPercentage"
                            value={metrics.punctualityPercentage}
                            onChange={handleChange}
                            className="dark:bg-gray-600 border mt-1 w-full p-2 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label className="dark:text-gray-300 block text-sm font-medium text-gray-700">Regularity percentage:</label>
                        <input
                            type="number"
                            name="regularityPercentage"
                            value={metrics.regularityPercentage}
                            onChange={handleChange}
                            className="dark:bg-gray-600 border mt-1 w-full p-2 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                    <div>
                        <label className="dark:text-gray-300 block text-sm font-medium text-gray-700">Task percentage:</label>
                        <input
                            type="number"
                            name="taskPercentage"
                            value={metrics.taskPercentage}
                            onChange={handleChange}
                            className="dark:bg-gray-600 border mt-1 w-full p-2 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                </div>
                <div>
                    <label className="dark:text-gray-300 block text-sm font-medium text-gray-700">Multi rater percentage:</label>
                    <input
                        type="number"
                        name="multiRaterPercentage"
                        value={metrics.multiRaterPercentage}
                        onChange={handleChange}
                        className="dark:bg-gray-600 border mt-1 w-full p-2 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>
                <div className="flex justify-center items-center">
                    <button
                        type="submit"
                        className="py-3 px-4 bg-blue-500 text-white font-medium text-sm rounded-md shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                        Update
                    </button>
                </div>
            </form>
        </div>
    );
};

export default Performance_Matric;
