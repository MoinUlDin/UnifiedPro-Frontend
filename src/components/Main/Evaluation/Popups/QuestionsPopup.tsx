import React, { useEffect, useState } from 'react';
import { X, Save, ToggleLeft, AlertCircle } from 'lucide-react';

interface QuestionType {
    key: string;
    label: string;
}

export interface AddQuestionModalProps {
    onSave: (data: { id: string; text: string; type: string; required: boolean; weight: number }) => void;
    onClose: () => void;
    questionTypes: QuestionType[];
    isEditing: boolean;
    initQuestion: any;
}

const QuestionsPopup: React.FC<AddQuestionModalProps> = ({ onSave, onClose, questionTypes, isEditing = false, initQuestion = null }) => {
    const [text, setText] = useState('');
    const [type, setType] = useState(questionTypes?.[0]?.key);
    const [required, setRequired] = useState(true);
    const [weight, setWeight] = useState(1);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!initQuestion || !isEditing) return;
        setText(initQuestion.text);
        setRequired(initQuestion.isRequired);
        setWeight(initQuestion.weight);
        setType(initQuestion.type);
    }, [initQuestion]);

    const handleSubmit = () => {
        if (!text.trim()) {
            setError('Question text is required');
            return;
        }
        if (!type) {
            setError('Question type is required');
            return;
        }
        setError('');
        const id = initQuestion?.id ?? Date.now().toString();
        onSave({ id, text: text.trim(), type, required, weight });

        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 p-6 relative">
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors">
                    <X className="w-5 h-5" />
                </button>

                <h2 className="text-xl font-semibold text-gray-900 mb-1">{isEditing ? 'Update' : 'Add New'} Question</h2>
                <p className="text-sm text-gray-500 mb-6">Configure the question details and settings</p>

                {error && (
                    <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg flex items-center gap-2 text-sm">
                        <AlertCircle className="w-4 h-4" />
                        {error}
                    </div>
                )}

                <div className="space-y-5">
                    {/* Question Text */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Question Text</label>
                        <input
                            type="text"
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            placeholder="Enter your question here"
                            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-300 transition-all"
                        />
                    </div>

                    {/* Question Type */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Question Type</label>
                        <select
                            value={type}
                            onChange={(e) => setType(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-300 transition-all"
                        >
                            <option value="">Select Type</option>
                            {questionTypes.map((qt) => (
                                <option key={qt.key} value={qt.key}>
                                    {qt.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Required Toggle */}
                    <div className="flex items-center justify-between">
                        <div className="">
                            <label className="block text-sm font-medium text-gray-700">Required</label>
                            <p className="text-[12px] text-gray-500 -mt-2">Mark this question as mandatory</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" checked={required} onChange={(e) => setRequired(e.target.checked)} className="sr-only peer" />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-indigo-300 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-indigo-600"></div>
                        </label>
                    </div>

                    {/* Weight */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Weight</label>
                        <input
                            type="number"
                            value={weight}
                            onChange={(e) => setWeight(Number(e.target.value))}
                            min={1}
                            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-300 transition-all"
                        />
                    </div>
                </div>

                <div className="mt-8 flex justify-end gap-3">
                    <button onClick={onClose} className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                        Cancel
                    </button>
                    <button onClick={handleSubmit} className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-900 text-white rounded-lg hover:bg-indigo-800 transition-colors">
                        <Save className="w-4 h-4" />
                        {isEditing ? 'Update' : 'Add'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default QuestionsPopup;
