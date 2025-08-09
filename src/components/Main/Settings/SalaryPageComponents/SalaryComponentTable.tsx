import React, { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { SalaryComponentType } from '../../../../constantTypes/SalaryTypes';
import SalaryServices from '../../../../services/SalaryServices';
import toast, { Toaster } from 'react-hot-toast';
import ComponentPopup from './ComponentPopup';
import Swal from 'sweetalert2';

function captureDate(data: string) {
    return data.split('T')[0];
}

export default function SalaryComponentTable() {
    const [SalaryComponent, setSalaryComponent] = useState<SalaryComponentType[]>([]);
    const [openSalaryComponent, setOpenSalaryComponent] = useState<boolean>(false);

    const [init, setInit] = useState<any>(null);

    const fetchSalaryComponent = () => {
        SalaryServices.FetchSalaryComponent()
            .then((r) => {
                setSalaryComponent(r);
            })
            .catch((e) => {
                toast.error(e.message);
            });
    };
    useEffect(() => {
        fetchSalaryComponent();
    }, []);

    const handleNew = () => {
        setInit(null);
        setOpenSalaryComponent(true);
    };
    const handleEdit = (data: any) => {
        console.log('data: ', data);
        setInit(data);
        setOpenSalaryComponent(true);
    };

    const hanldeResponse = (r: string) => {
        fetchSalaryComponent();
    };

    const handleDelete = (id: number) => {
        if (!id) return;
        Swal.fire({
            title: 'Are you sure?',
            text: 'Do you really want to delete this SalaryComponent? This action is irreversible!',
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
                SalaryServices.DeleteSalaryComponent(id)
                    .then(() => {
                        toast.success('Component Deleted Successfully', { duration: 4000 });
                        fetchSalaryComponent();
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
                    <h2 className="text-xl font-semibold text-gray-900">Salary Components</h2>
                    <p className="text-gray-600">Manage salary components and allowances</p>
                </div>
                <button onClick={handleNew} className="inline-flex text-[12px] sm:text-sm items-center gap-2 py-1 px-2 sm:px-4 sm:py-2 bg-gray-900 text-white rounded hover:bg-indigo-700">
                    <Plus className="w-4 h-4" />
                    Add Salary Component
                </button>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="min-w-full text-left">
                    <thead>
                        <tr className="border-b">
                            <th className="py-3 px-4 text-sm font-medium text-gray-700">Name</th>
                            <th className="py-3 px-4 text-sm font-medium text-gray-700">Category</th>
                            <th className="py-3 px-4 text-sm font-medium text-gray-700">Range</th>
                            <th className="py-3 px-4 text-sm font-medium text-gray-700">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y">
                        {SalaryComponent.map((job) => (
                            <tr key={job.id}>
                                <td className="py-3 px-4">{job.name}</td>
                                <td className="py-3 px-4 ">{job.category ? <span className="px-1 text-[12px] rounded shadow">{job.category}</span> : '-'}</td>
                                <td className="py-3 px-4">{job.range}</td>
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
                        {SalaryComponent.length === 0 && (
                            <tr>
                                <td colSpan={5} className="py-6 px-4 text-center text-gray-500">
                                    No job types found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
            {openSalaryComponent && <ComponentPopup initialData={init} show={openSalaryComponent} onClose={() => setOpenSalaryComponent(false)} sendResponse={hanldeResponse} />}
        </div>
    );
}
