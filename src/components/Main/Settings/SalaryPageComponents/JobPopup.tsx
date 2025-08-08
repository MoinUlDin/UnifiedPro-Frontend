// src/components/JobModal.tsx
import React, { useState, useEffect } from 'react';
import SalaryServices from '../../../../services/SalaryServices';
import toast, { Toaster } from 'react-hot-toast';
interface JobData {
    id: number;
    name: string;
    description: string;
}

interface JobModalProps {
    show: boolean;
    initialData?: JobData | null;
    onClose: () => void;
    sendResponse?: (data: any) => void;
}

export default function JobPopup({ show, initialData, onClose, sendResponse }: JobModalProps) {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');

    // whenever initialData changes (opening for edit), populate fields
    useEffect(() => {
        if (initialData) {
            setName(initialData.name);
            setDescription(initialData.description);
        } else {
            setName('');
            setDescription('');
        }
    }, [initialData, show]);

    if (!show) return null;

    const onSubmit = (data: any) => {
        if (initialData && initialData.id) {
            SalaryServices.UpdateJob(initialData.id, data)
                .then(() => {
                    sendResponse?.('job Updated Successfully');
                    onClose();
                })
                .catch((e) => {
                    toast.error(e.message, { duration: 4000 });
                });
        } else {
            SalaryServices.AddJob(data)
                .then(() => {
                    sendResponse?.('job Added Successfully');
                    onClose();
                })
                .catch((e) => {
                    toast.error(e.message, { duration: 4000 });
                    console.log(e);
                });
        }
    };

    return (
        // backdrop
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
            {/* modal panel */}
            <div className="bg-white rounded-lg shadow-lg w-full max-w-md mx-4">
                {/* header */}
                <div className="px-6 py-4 border-b">
                    <h2 className="text-lg font-semibold text-gray-800">{initialData ? 'Edit Job' : 'New Job'}</h2>
                </div>

                {/* body */}
                <form
                    className="px-6 py-4 space-y-4"
                    onSubmit={(e) => {
                        e.preventDefault();
                        onSubmit({ name: name.trim(), description: description.trim() });
                    }}
                >
                    {/* Name */}
                    <div>
                        <label htmlFor="job-name" className="block text-sm font-medium text-gray-700 mb-1">
                            Name
                        </label>
                        <input
                            id="job-name"
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <label htmlFor="job-desc" className="block text-sm font-medium text-gray-700 mb-1">
                            Description
                        </label>
                        <textarea
                            id="job-desc"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows={4}
                            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                        />
                    </div>

                    {/* buttons */}
                    <div className="flex justify-end space-x-3 pt-2 border-t">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-white border border-gray-300 rounded hover:bg-gray-50">
                            Cancel
                        </button>
                        <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700">
                            {initialData ? 'Update' : 'Create'}
                        </button>
                    </div>
                </form>
            </div>
            <Toaster position="top-right" reverseOrder={false} />
        </div>
    );
}
