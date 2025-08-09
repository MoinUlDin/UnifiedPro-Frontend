// src/components/PayGradePopup.tsx
import React, { useState, useEffect } from 'react';
import SalaryServices from '../../../../services/SalaryServices';
import toast, { Toaster } from 'react-hot-toast';

interface PayGradeData {
    id: number;
    name: string;
    description?: string;
}

interface PayGradeModalProps {
    show: boolean;
    initialData?: PayGradeData | null;
    onClose: () => void;
    sendResponse?: (data: any) => void;
}

export default function FrequencyPopup({ show, initialData, onClose, sendResponse }: PayGradeModalProps) {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [namelist, setNameList] = useState<string[]>([]);
    const [loading, setLoding] = useState<boolean>(false);

    useEffect(() => {
        setLoding(true);
        SalaryServices.FetchPayFrequenciesNames()
            .then((r) => {
                setNameList(r.choices);
            })
            .catch((e) => {
                console.log(e);
            })
            .finally(() => {
                setLoding(false);
            });
    }, []);
    // Populate fields when editing
    useEffect(() => {
        if (initialData) {
            setName(initialData.name);
            setDescription(initialData.description || '');
        } else {
            setName('');
            setDescription('');
        }
    }, [initialData, show]);

    if (!show) return null;

    const handleSubmit = async () => {
        // simple front-end validation
        if (!name.trim()) {
            toast.error('Name is required');
            return;
        }

        const payload: any = {
            name: name.trim(),
        };
        if (description.trim()) {
            payload.description = description.trim();
        }

        try {
            if (initialData?.id) {
                console.log('Id: ', initialData.id, 'payLoad: ', payload);

                await SalaryServices.UpdatePayFrequency(initialData.id, payload);
                toast.success('Pay Grade updated', { duration: 4000 });
                sendResponse?.('Pay Grade updated');
            } else {
                await SalaryServices.AddPayFrequency(payload);
                toast.success('Pay Grade Created', { duration: 4000 });
                sendResponse?.('Pay grade created');
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
                        <select
                            id="pg-name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                        >
                            <option key="un12" disabled value="">
                                --Select Name--
                            </option>
                            {namelist?.map((n) => (
                                <option key={n} value={n}>
                                    {n.replace('_', ' ')}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Description (optional) */}
                    <div>
                        <label htmlFor="pg-desc" className="block text-sm font-medium text-gray-700 mb-1">
                            Description <span className="text-gray-400">(optional)</span>
                        </label>
                        <textarea
                            id="pg-desc"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows={3}
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
