// src/components/PayGradePopup.tsx
import { useState, useEffect } from 'react';
import SalaryServices from '../../../../services/SalaryServices';
import toast from 'react-hot-toast';
import { capitalizeName } from '../../../../utils/Common';

interface DeductionType {
    id: number;
    name: string;
    percentage: string;
    type: string;
}

interface PayGradeModalProps {
    show: boolean;
    initialData?: DeductionType | null;
    onClose: () => void;
    sendResponse?: (data: any) => void;
}

export default function DeductionPopup({ show, initialData, onClose, sendResponse }: PayGradeModalProps) {
    const [name, setName] = useState('');
    const [percentage, setPercentage] = useState('');
    const [type, setType] = useState('');

    // Populate fields when editing
    useEffect(() => {
        if (initialData) {
            setName(initialData.name);
            setPercentage(initialData.percentage || '');
        } else {
            setName('');
            setType('');
            setPercentage('');
        }
    }, [initialData, show]);

    if (!show) return null;

    const handleSubmit = async () => {
        // simple front-end validation
        if (!name.trim()) {
            toast.error('Name is required');
            return;
        }
        if (!percentage.trim()) {
            toast.error('Percentage is required');
            return;
        }
        if (!type.trim()) {
            toast.error('Type is required');
            return;
        }
        const ntype = capitalizeName(type);

        const payload: any = {
            name: name.trim(),
            percentage: percentage.trim(),
            type: ntype,
        };

        try {
            if (initialData?.id) {
                console.log('Id: ', initialData.id, 'payLoad: ', payload);

                await SalaryServices.UpdateDeduction(initialData.id, payload);
                toast.success('Deduction updated successfully', { duration: 4000 });
                sendResponse?.('Deduction updated successfully');
            } else {
                await SalaryServices.AddDeduction(payload);
                toast.success('Deduction Created Successfully', { duration: 4000 });
                sendResponse?.('Deduction updated successfully');
            }
            onClose();
        } catch (err: any) {
            toast.error(err.message || 'Something went wrong');
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-md mx-4">
                <div className="px-6 py-4 border-b">
                    <h2 className="text-lg font-semibold text-gray-800">{initialData ? 'Edit Frequency' : 'New Frequency'}</h2>
                </div>
                <form
                    className="px-6 py-4 space-y-4"
                    onSubmit={(e) => {
                        e.preventDefault();
                        handleSubmit();
                    }}
                >
                    {/* Name */}
                    <div>
                        <label htmlFor="pg-name" className="block text-sm font-medium text-gray-700 mb-1">
                            Name
                        </label>
                        <input
                            id="pg-name"
                            value={name}
                            placeholder="Social Security"
                            onChange={(e) => setName(e.target.value)}
                            required
                            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                        />
                    </div>
                    {/* Percentage */}
                    <div>
                        <label htmlFor="percentage" className="block text-sm font-medium text-gray-700 mb-1">
                            Percentage
                        </label>
                        <input
                            id="percentage"
                            type="number"
                            placeholder="e.g., 6.5"
                            value={percentage}
                            onChange={(e) => setPercentage(e.target.value)}
                            required
                            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                        />
                    </div>
                    {/* Percentage */}
                    <div>
                        <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
                            Type
                        </label>
                        <input
                            id="type"
                            type="text"
                            placeholder="Tax"
                            value={type}
                            onChange={(e) => setType(e.target.value)}
                            required
                            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                        />
                    </div>

                    {/* Buttons */}
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
