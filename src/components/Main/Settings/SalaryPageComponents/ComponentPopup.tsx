import React, { useState, useEffect } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { X, DollarSign } from 'lucide-react'; // Optional icons
import { PayGradeType } from '../../../../constantTypes/SalaryTypes';
import SalaryServices from '../../../../services/SalaryServices';

interface AllowanceDeductionData {
    id?: number;
    name: string;
    category: string;
    minimum_salary: number;
    maximum_salary: number;
    pay_grade?: number;
}

interface AllowanceDeductionPopupProps {
    show: boolean;
    initialData?: AllowanceDeductionData | null;
    onClose: () => void;
    sendResponse?: (data: any) => void;
}

export default function ComponentPopup({ show, initialData, onClose, sendResponse }: AllowanceDeductionPopupProps) {
    const [name, setName] = useState('');
    const [category, setCategory] = useState('');
    const [payGradeList, setPayGradeList] = useState<PayGradeType[]>([]);
    const [minimumSalary, setMinimumSalary] = useState('');
    const [maximumSalary, setMaximumSalary] = useState('');
    const [payGrade, setPayGrade] = useState('');

    useEffect(() => {
        if (initialData) {
            setName(initialData.name);
            setCategory(initialData.category);
            setMinimumSalary(initialData.minimum_salary.toString());
            setMaximumSalary(initialData.maximum_salary.toString());
            setPayGrade(initialData.pay_grade ? initialData.pay_grade.toString() : '');
        } else {
            setName('');
            setCategory('');
            setMinimumSalary('');
            setMaximumSalary('');
            setPayGrade('');
        }
    }, [initialData, show]);
    useEffect(() => {
        SalaryServices.FetchPayGrade()
            .then((r) => {
                setPayGradeList(r);
            })
            .catch((e) => {
                console.log(e);
            });
    }, []);

    if (!show) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name || !minimumSalary || !maximumSalary) {
            toast.error('Please fill all required fields');
            return;
        }
        const minSal = Number(minimumSalary);
        const maxSal = Number(maximumSalary);
        const payGrd = payGrade ? Number(payGrade) : undefined;

        if (isNaN(minSal) || isNaN(maxSal) || (payGrade && isNaN(payGrd!))) {
            toast.error('Salary and pay grade must be valid numbers');
            return;
        }
        if (minSal > maxSal) {
            toast.error('Minimum salary cannot exceed maximum salary');
            return;
        }

        const data: AllowanceDeductionData = {
            name: name.trim(),
            category: category,
            minimum_salary: minSal,
            maximum_salary: maxSal,
            pay_grade: payGrd,
        };

        if (initialData && initialData.id) {
            SalaryServices.UpdateSalaryComponent(initialData.id, data)
                .then(() => {
                    toast.success('Component Updated Successfully', { duration: 4000 });
                    sendResponse?.('Component Updated Successfully');
                    onClose();
                })
                .catch((e) => toast.error(e.message, { duration: 4000 }));
        } else {
            SalaryServices.AddSalaryComponent(data)
                .then(() => {
                    toast.success('Component Added Successfully', { duration: 4000 });
                    sendResponse?.('Component Added Successfully');
                    onClose();
                })
                .catch((e) => {
                    toast.error(e.message, { duration: 4000 });
                    console.log(e);
                });
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-md mx-4">
                <div className="px-6 py-4 border-b flex justify-between items-center">
                    <h2 className="text-lg font-semibold text-gray-800">{initialData ? 'Edit Component' : 'New Component'}</h2>
                    <button onClick={onClose} className="text-gray-600 hover:text-gray-800">
                        <X size={20} />
                    </button>
                </div>
                <form className="px-6 py-4 space-y-4" onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                            Name
                        </label>
                        <input
                            id="name"
                            type="text"
                            placeholder="e.g., Basic Salary"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                        />
                    </div>
                    <div>
                        <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                            Category
                        </label>
                        <input
                            id="category"
                            type="text"
                            placeholder="e.g., allowance, Basic Salary"
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            required
                            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                        />
                    </div>
                    <div>
                        <label htmlFor="minimum_salary" className="text-sm font-medium text-gray-700 mb-1 flex items-center">
                            Minimum Salary
                        </label>
                        <input
                            id="minimum_salary"
                            type="number"
                            value={minimumSalary}
                            onChange={(e) => setMinimumSalary(e.target.value)}
                            required
                            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                        />
                    </div>
                    <div>
                        <label htmlFor="maximum_salary" className="text-sm font-medium text-gray-700 mb-1 flex items-center">
                            Maximum Salary
                        </label>
                        <input
                            id="maximum_salary"
                            type="number"
                            value={maximumSalary}
                            onChange={(e) => setMaximumSalary(e.target.value)}
                            required
                            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                        />
                    </div>
                    <div>
                        <label htmlFor="pay_grade" className="block text-sm font-medium text-gray-700 mb-1">
                            Pay Grade (Optional)
                        </label>
                        <select
                            id="pay_grade"
                            value={payGrade}
                            onChange={(e) => setPayGrade(e.target.value)}
                            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                        >
                            <option key={'un2'} value="">
                                --Select Pay Grade--
                            </option>
                            {payGradeList?.map((item) => (
                                <option key={item.id} value={item.id}>
                                    {item.name}
                                </option>
                            ))}
                        </select>
                    </div>
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
        </div>
    );
}
