import React, { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2, Percent } from 'lucide-react';
import { SalaryStructureType, LeaveTypes } from '../../../../constantTypes/SalaryTypes';
import SalaryServices from '../../../../services/SalaryServices';
import toast, { Toaster } from 'react-hot-toast';
import DeductionPopup from './DeductionPopup';
import LeavePopup from './LeavePopup';
import Swal from 'sweetalert2';
import { captureDate } from '../../../../utils/Common';

export default function LeaveInfoTable() {
    const [openLeavePopup, setopenLeavePopup] = useState<boolean>(false);
    const [initialData, setInitialData] = useState<any>(null);
    const [Leaves, setLeaves] = useState<LeaveTypes[]>([]);

    const fetchLeaveTypes = () => {
        SalaryServices.FetchLeaveTypes()
            .then((r) => {
                setLeaves(r);
            })
            .catch((e) => {
                console.log('error Leave: ', e);
            });
    };

    useEffect(() => {
        fetchLeaveTypes();
    }, []);

    const handleNew = () => {
        setInitialData(null);
        setopenLeavePopup(true);
    };
    const handleEdit = (data: LeaveTypes) => {
        const payload = {
            id: data.id,
            name: data.name,
            department: data.department.id,
            annual_allowance: data.annual_allowance,
            from_date: data.from_date,
            to_date: data.to_date,
        };

        console.log('data: ', data, 'sending Data: ', payload);
        setInitialData(payload);
        setopenLeavePopup(true);
    };

    const hanldeResponse = () => {
        fetchLeaveTypes();
    };

    const handleDelete = (id: number) => {
        if (!id) return;
        Swal.fire({
            title: 'Are you sure?',
            text: 'Do you really want to delete this Leave Type? This action is irreversible!',
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
                SalaryServices.DeleteLeaveTypes(id)
                    .then(() => {
                        toast.success('Leave Type Deleted Successfully', { duration: 4000 });
                        fetchLeaveTypes();
                    })
                    .catch((e) => {
                        toast.error(e.message);
                    });
            }
        });
    };

    return (
        <div className="bg-white rounded-lg shadow p-6 space-y-6 ">
            {/* Header */}
            <div className="flex flex-col sm:flex-row gap-2 items-center justify-center sm:justify-between">
                <div>
                    <h2 className="text-xl font-semibold text-gray-900">Leave Types</h2>
                    <p className="text-gray-600">Manage Leave Types & Allowance</p>
                </div>
                <button onClick={handleNew} className="inline-flex text-[12px] sm:text-sm items-center gap-2 py-1 px-2 sm:px-4 sm:py-2 bg-gray-900 text-white rounded hover:bg-indigo-700">
                    <Plus className="w-4 h-4" />
                    Add Leave Type
                </button>
            </div>

            {/* Table */}
            <div className="overflow-x-auto ">
                <table className="min-w-full text-left">
                    <thead className="">
                        <tr className="border-b ">
                            <th className="py-3 px-4 text-sm font-semibold bg-white text-gray-800">Name</th>
                            <th className="py-3 px-4 text-sm font-semibold bg-white text-gray-800">Department</th>
                            <th className="py-3 px-4 text-sm font-semibold bg-white text-gray-800">Annual Allowance</th>
                            <th className="py-3 px-4 text-sm font-semibold bg-white text-gray-800">From</th>
                            <th className="py-3 px-4 text-sm font-semibold bg-white text-gray-800">To</th>
                            <th className="py-3 px-4 text-sm font-semibold bg-white text-gray-800">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y">
                        {Leaves.map((leave) => (
                            <tr key={leave.id}>
                                <td className="py-3 px-4">{leave.name ?? '--'}</td>
                                <td className="py-3 px-4 flex items-center gap-1">{leave.department.name}</td>

                                <td className="py-3 px-4">{Number(leave.annual_allowance).toLocaleString()}</td>
                                <td className="py-3 px-4">{captureDate(leave.from_date)}</td>
                                <td className="py-3 px-4">{captureDate(leave.to_date)}</td>

                                <td className="py-3 px-4 space-x-4">
                                    <button onClick={() => handleEdit(leave)} className="text-gray-600 hover:text-indigo-600" aria-label="Edit">
                                        <Edit2 className="w-4 h-4" />
                                    </button>
                                    <button onClick={() => handleDelete(leave.id)} className="text-gray-600 hover:text-red-600" aria-label="Delete">
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {Leaves.length === 0 && (
                            <tr>
                                <td colSpan={5} className="py-6 px-4 text-center text-gray-500">
                                    No job types found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
            {openLeavePopup && <LeavePopup onSubmit={hanldeResponse} initialData={initialData} isOpen={openLeavePopup} onClose={() => setopenLeavePopup(false)} />}
        </div>
    );
}
