import React, { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2, Percent } from 'lucide-react';
import { SalaryStructureType } from '../../../../constantTypes/SalaryTypes';
import SalaryServices from '../../../../services/SalaryServices';
import toast, { Toaster } from 'react-hot-toast';
import DeductionPopup from './DeductionPopup';
import SalaryStrucrePopup from './SalaryStrucrePopup';
import Swal from 'sweetalert2';

function captureDate(data: string) {
    return data.split('T')[0];
}

export default function SalaryStructureTable() {
    const [SalaryStructure, setSalaryStructure] = useState<SalaryStructureType[]>([]);
    const [openSalaryStructure, setOpenSalaryStructure] = useState<boolean>(false);
    const [initialData, setInitialData] = useState<any>(null);

    const fetchSalaryStructure = () => {
        SalaryServices.FetchSalaryStructure()
            .then((r) => {
                console.log('Salary Structure', r);
                setSalaryStructure(r);
            })
            .catch((e) => {
                toast.error(e.message);
            });
    };
    useEffect(() => {
        fetchSalaryStructure();
    }, []);

    const handleNew = () => {
        setInitialData(null);
        setOpenSalaryStructure(true);
    };
    const handleEdit = (data: any) => {
        console.log('data: ', data);
        setInitialData(data);
        setOpenSalaryStructure(true);
    };

    const hanldeResponse = (r: any) => {
        fetchSalaryStructure();
    };

    const handleDelete = (id: number) => {
        if (!id) return;
        Swal.fire({
            title: 'Are you sure?',
            text: 'Do you really want to delete this SalaryStructure? This action is irreversible!',
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
                SalaryServices.DeleteSalaryStructure(id)
                    .then(() => {
                        toast.success('Component Deleted Successfully', { duration: 4000 });
                        fetchSalaryStructure();
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
                    <h2 className="text-xl font-semibold text-gray-900">SalaryStructures</h2>
                    <p className="text-gray-600">Manage tax and SalaryStructure percentages</p>
                </div>
                <button onClick={handleNew} className="inline-flex text-[12px] sm:text-sm items-center gap-2 py-1 px-2 sm:px-4 sm:py-2 bg-gray-900 text-white rounded hover:bg-indigo-700">
                    <Plus className="w-4 h-4" />
                    Add SalaryStructure
                </button>
            </div>

            {/* Table */}
            <div className="overflow-x-auto ">
                <table className="min-w-full text-left">
                    <thead className="">
                        <tr className="border-b ">
                            <th className="py-3 px-4 text-sm font-semibold bg-white text-gray-800">Employee</th>
                            <th className="py-3 px-4 text-sm font-semibold bg-white text-gray-800">Component</th>
                            <th className="py-3 px-4 text-sm font-semibold bg-white text-gray-800">Paygrade</th>
                            <th className="py-3 px-4 text-sm font-semibold bg-white text-gray-800">Amount</th>
                            <th className="py-3 px-4 text-sm font-semibold bg-white text-gray-800">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y">
                        {SalaryStructure.map((job) => (
                            <tr key={job.id}>
                                <td className="py-3 px-4">{job.basic_profile?.name ? job.basic_profile?.name : '--'}</td>
                                <td className="py-3 px-4 flex items-center gap-1">{job.salary_component?.name}</td>
                                <td className="py-3 px-4">
                                    <span className="px-2 py-1 text-gray-800 text-[12px] rounded-lg shadow">{job.pay_grade?.name}</span>
                                </td>
                                <td className="py-3 px-4">{job.pay_amount}</td>

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
                        {SalaryStructure.length === 0 && (
                            <tr>
                                <td colSpan={5} className="py-6 px-4 text-center text-gray-500">
                                    No job types found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
            {openSalaryStructure && <SalaryStrucrePopup initialData={initialData} response={hanldeResponse} onClose={() => setOpenSalaryStructure(false)} />}
        </div>
    );
}
