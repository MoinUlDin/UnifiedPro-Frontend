import React, { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { PayGradeType } from '../../../../constantTypes/SalaryTypes';
import SalaryServices from '../../../../services/SalaryServices';
import toast, { Toaster } from 'react-hot-toast';
import JobPopup from './JobPopup';
import Swal from 'sweetalert2';
import PayGradePopup from './PayGradePopup';

function captureDate(data: string) {
    return data.split('T')[0];
}

export default function PayGradeDataTable() {
    const [payGrade, setPayGrade] = useState<PayGradeType[]>([]);
    const [openPayGrade, setOpenPayGrade] = useState<boolean>(false);
    const [init, setInit] = useState<any>(null);

    const fetchpayGrade = () => {
        SalaryServices.FetchPayGrade()
            .then((r) => {
                setPayGrade(r);
            })
            .catch((e) => {
                toast.error(e.message);
            });
    };
    useEffect(() => {
        fetchpayGrade();
    }, []);

    const handleNew = () => {
        setInit(null);
        setOpenPayGrade(true);
    };
    const handleEdit = (data: any) => {
        console.log('data: ', data);
        setInit(data);
        setOpenPayGrade(true);
    };

    const hanldeResponse = (r: string) => {
        fetchpayGrade();
    };

    const handleDelete = (id: number) => {
        if (!id) return;
        Swal.fire({
            title: 'Are you sure?',
            text: 'Do you really want to delete this PayGrade? This action is irreversible!',
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
                SalaryServices.DeletePayGrade(id)
                    .then(() => {
                        toast.success('Job Deleted Successfully', { duration: 4000 });
                        fetchpayGrade();
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
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-semibold text-gray-900">Pay Grades</h2>
                    <p className="text-gray-600">Manage salary ranges and grade levels</p>
                </div>
                <button onClick={handleNew} className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700">
                    <Plus className="w-4 h-4" />
                    Add Pay Grade
                </button>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="min-w-full text-left">
                    <thead>
                        <tr className="border-b">
                            <th className="py-3 px-4 text-sm font-medium text-gray-700">Name</th>
                            <th className="py-3 px-4 text-sm font-medium text-gray-700">Range</th>
                            <th className="py-3 px-4 text-sm font-medium text-gray-700">Description</th>
                            <th className="py-3 px-4 text-sm font-medium text-gray-700">Created</th>
                            <th className="py-3 px-4 text-sm font-medium text-gray-700">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y">
                        {payGrade.map((job) => (
                            <tr key={job.id}>
                                <td className="py-3 px-4">{job.name}</td>
                                <td className="py-3 px-4">{job.range}</td>
                                <td className="py-3 px-4">{job.description}</td>
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
                        {payGrade.length === 0 && (
                            <tr>
                                <td colSpan={5} className="py-6 px-4 text-center text-gray-500">
                                    No job types found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
            {openPayGrade && <PayGradePopup initialData={init} show={openPayGrade} onClose={() => setOpenPayGrade(false)} sendResponse={hanldeResponse} />}
        </div>
    );
}
