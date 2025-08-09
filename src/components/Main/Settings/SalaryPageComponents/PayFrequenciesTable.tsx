import React, { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { PayFrequencyType } from '../../../../constantTypes/SalaryTypes';
import SalaryServices from '../../../../services/SalaryServices';
import toast, { Toaster } from 'react-hot-toast';
import FrequencyPopup from './FrequencyPopup';
import Swal from 'sweetalert2';

function captureDate(data: string) {
    return data.split('T')[0];
}

export default function PayFrequenciesTable() {
    const [payFrequency, setPayFrequency] = useState<PayFrequencyType[]>([]);
    const [openpayFrequency, setOpenpayFrequency] = useState<boolean>(false);

    const [init, setInit] = useState<any>(null);

    const fetchpayFrequency = () => {
        SalaryServices.FetchPayFrequencies()
            .then((r) => {
                setPayFrequency(r);
            })
            .catch((e) => {
                toast.error(e.message);
            });
    };
    useEffect(() => {
        fetchpayFrequency();
    }, []);

    const handleNew = () => {
        setInit(null);
        setOpenpayFrequency(true);
    };
    const handleEdit = (data: any) => {
        console.log('data: ', data);
        setInit(data);
        setOpenpayFrequency(true);
    };

    const hanldeResponse = (r: string) => {
        fetchpayFrequency();
    };

    const handleDelete = (id: number) => {
        if (!id) return;
        Swal.fire({
            title: 'Are you sure?',
            text: 'Do you really want to delete this payFrequency? This action is irreversible!',
            icon: 'warning',
            showCancelButton: true, // ← enable the cancel button
            confirmButtonText: 'Yes, Delete',
            cancelButtonText: 'Cancel', // ← customize its label
            timer: 8000,
            timerProgressBar: true,
            showCloseButton: true,
            reverseButtons: true, // ← optional: swap positions
        }).then((result) => {
            if (result.isConfirmed) {
                SalaryServices.DeletePayFrequency(id)
                    .then(() => {
                        toast.success('Component Deleted Successfully', { duration: 4000 });
                        fetchpayFrequency();
                    })
                    .catch((e) => {
                        toast.error(e.message);
                    });
            }
        });
    };
    return (
        <div className="bg-white rounded-lg shadow p-6 space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row gap-2 items-center justify-center sm:justify-between">
                <div>
                    <h2 className="text-xl font-semibold text-gray-900">Pay Frequencies</h2>
                    <p className="text-gray-600">Manage payment schedules and frequencies</p>
                </div>
                <button onClick={handleNew} className="inline-flex text-[12px] sm:text-sm items-center gap-2 py-1 px-2 sm:px-4 sm:py-2 bg-gray-900 text-white rounded hover:bg-indigo-700">
                    <Plus className="w-4 h-4" />
                    Add Frequency
                </button>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="min-w-full text-left">
                    <thead className="">
                        <tr className="border-b ">
                            <th className="py-3 px-4 text-sm font-semibold bg-white text-gray-800">Frequency Name</th>
                            <th className="py-3 px-4 text-sm font-semibold bg-white text-gray-800">Period Days</th>
                            <th className="py-3 px-4 text-sm font-semibold bg-white text-gray-800">Status</th>
                            <th className="py-3 px-4 text-sm font-semibold bg-white text-gray-800">Created At</th>
                            <th className="py-3 px-4 text-sm font-semibold bg-white text-gray-800">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y">
                        {payFrequency.map((job) => (
                            <tr key={job.id}>
                                <td className="py-3 px-4">{job.name}</td>
                                <td className="py-3 px-4 ">{job.period_day}</td>
                                <td className="py-3 px-4">
                                    <span className="px-2 py-1 bg-gray-950 text-white text-[12px] rounded-lg shadow">Active</span>
                                </td>
                                <td className="py-3 px-4">{captureDate(job.created_at)}</td>
                                <td className="py-3 px-4 space-x-4">
                                    <button onClick={() => handleEdit(job)} className="text-gray-600 hover:text-indigo-600" aria-label="Edit">
                                        <Edit2 className="w-4 h-4" />
                                    </button>
                                    <button onClick={() => handleDelete(job.id)} className="text-gray-600 hover:text-red-600" aria-label="Delete">
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {payFrequency.length === 0 && (
                            <tr>
                                <td colSpan={5} className="py-6 px-4 text-center text-gray-500">
                                    No job types found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
            {openpayFrequency && <FrequencyPopup initialData={init} show={openpayFrequency} onClose={() => setOpenpayFrequency(false)} sendResponse={hanldeResponse} />}
        </div>
    );
}
