import React, { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { BasicProfileType } from '../../../../constantTypes/SalaryTypes';
import SalaryServices from '../../../../services/SalaryServices';
import toast, { Toaster } from 'react-hot-toast';
import BasicProfilePopup from './BasicProfilePopup';
import Swal from 'sweetalert2';

function captureDate(data: string) {
    return data.split('T')[0];
}

export default function BasicProfileTable() {
    const [BasicProfile, setBasicProfile] = useState<BasicProfileType[]>([]);
    const [openBasicProfile, setOpenBasicProfile] = useState<boolean>(false);

    const [init, setInit] = useState<any>(null);

    const fetchBasicProfile = () => {
        SalaryServices.FetchBasicProfile()
            .then((r) => {
                setBasicProfile(r);
            })
            .catch((e) => {
                toast.error(e.message);
            });
    };
    useEffect(() => {
        fetchBasicProfile();
    }, []);

    const handleNew = () => {
        setInit(null);
        setOpenBasicProfile(true);
    };
    const handleEdit = (data: any) => {
        console.log('data: ', data);
        setInit(data);
        setOpenBasicProfile(true);
    };

    const hanldeResponse = (r: string) => {
        fetchBasicProfile();
    };

    const handleDelete = (id: number) => {
        if (!id) return;
        Swal.fire({
            title: 'Are you sure?',
            text: 'Do you really want to delete this BasicProfile? This action is irreversible!',
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
                SalaryServices.DeleteBasicProfile(id)
                    .then(() => {
                        toast.success('Component Deleted Successfully', { duration: 4000 });
                        fetchBasicProfile();
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
                    <h2 className="text-xl font-semibold text-gray-900">Basic Profile</h2>
                    <p className="text-gray-600">Manage basic profiles</p>
                </div>
                <button onClick={handleNew} className="inline-flex text-[12px] sm:text-sm items-center gap-2 py-1 px-2 sm:px-4 sm:py-2 bg-gray-900 text-white rounded hover:bg-indigo-700">
                    <Plus className="w-4 h-4" />
                    Add Basic Profile
                </button>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="min-w-full text-left">
                    <thead>
                        <tr className="border-b">
                            <th className="py-3 px-4 text-sm font-medium text-gray-700">Employee</th>
                            <th className="py-3 px-4 text-sm font-medium text-gray-700">Department</th>
                            <th className="py-3 px-4 text-sm font-medium text-gray-700">Job Type</th>
                            <th className="py-3 px-4 text-sm font-medium text-gray-700">Pay Start Date</th>
                            <th className="py-3 px-4 text-sm font-medium text-gray-700">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y">
                        {BasicProfile.map((job) => (
                            <tr key={job.id}>
                                <td className="py-3 px-4">{job.employee ? job.employee?.name : '--'}</td>
                                <td className="py-3 px-4">{job.department?.name}</td>
                                <td className="py-3 px-4 ">{job.job_type?.name ? <span className="px-1 text-[12px] rounded shadow">{job.job_type.name}</span> : '-'}</td>
                                <td className="py-3 px-4">{captureDate(job.pay_start_date)}</td>
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
                        {BasicProfile.length === 0 && (
                            <tr>
                                <td colSpan={5} className="py-6 px-4 text-center text-gray-500">
                                    No job types found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
            {openBasicProfile && <BasicProfilePopup initialData={init} show={openBasicProfile} onClose={() => setOpenBasicProfile(false)} sendResponse={hanldeResponse} />}
        </div>
    );
}
