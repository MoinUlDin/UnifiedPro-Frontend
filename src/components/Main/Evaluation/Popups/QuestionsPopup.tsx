// src/components/QuestionsPopup.tsx
import React, { useEffect, useState } from 'react';
import { X, Save, AlertCircle, Plus, Trash2 } from 'lucide-react';

export type QuestionTypeChoice = { key: string; label: string };
type QuestionPayload = {
    text: string;
    type: string;
    required: boolean;
    weight: number;
    meta?: any;
};

type Props = {
    questionTypes: QuestionTypeChoice[];
    onSave: (payload: QuestionPayload) => void;
    onClose: () => void;
    isEditing?: boolean;
    initQuestion?: any | null;
};

type ChoiceOption = { key: string; label: string; score: number };

const makeKey = (pref = 'opt_') => `${pref}${Math.random().toString(36).slice(2, 9)}`;

export default function QuestionsPopup({ questionTypes, onSave, onClose, isEditing = false, initQuestion = null }: Props) {
    const [text, setText] = useState('');
    const [type, setType] = useState<string>(questionTypes?.[0]?.key || '');
    const [required, setRequired] = useState(true);
    const [weight, setWeight] = useState<number>(1);
    const [error, setError] = useState<string>('');

    // choice options state
    const [options, setOptions] = useState<ChoiceOption[]>([]);

    useEffect(() => {
        if (!initQuestion) return;
        setText(initQuestion.text ?? '');
        setType(initQuestion.type ?? questionTypes?.[0]?.key ?? '');
        setRequired(initQuestion.required ?? true);
        setWeight(initQuestion.weight ?? 1);

        // load choices if present in meta (support both meta.choices as [{key,label,score}] or [{key,label}] with mapping)
        const metaChoices = initQuestion.meta?.choices ?? initQuestion.meta?.options ?? null;
        if (metaChoices && Array.isArray(metaChoices)) {
            // normalize
            const normalized: ChoiceOption[] = metaChoices.map((c: any) => ({
                key: c.key ?? makeKey(),
                label: c.label ?? String(c.key ?? ''),
                score: typeof c.score === 'number' ? c.score : typeof c.value === 'number' ? c.value : (c.score && Number(c.score)) || 0,
            }));
            setOptions(normalized);
        }
    }, [initQuestion, questionTypes]);

    // ensure when switching to choice type we at least have one blank option ready
    useEffect(() => {
        if (type === 'choice' && options.length === 0) {
            setOptions([{ key: makeKey(), label: '', score: 0 }]);
        }
    }, [type, options.length]);

    const addOption = () => {
        setOptions((s) => [...s, { key: makeKey(), label: '', score: 0 }]);
    };

    const updateOptionLabel = (key: string, label: string) => {
        setOptions((s) => s.map((o) => (o.key === key ? { ...o, label } : o)));
    };

    const updateOptionScore = (key: string, score: number) => {
        setOptions((s) => s.map((o) => (o.key === key ? { ...o, score } : o)));
    };

    const removeOption = (key: string) => {
        setOptions((s) => s.filter((o) => o.key !== key));
    };

    const handleSubmit = () => {
        if (!text.trim()) {
            setError('Question text is required');
            return;
        }
        if (!type) {
            setError('Question type is required');
            return;
        }

        if (type === 'choice') {
            if (!options.length) {
                setError('At least one choice option is required');
                return;
            }
            // validate each option
            for (let i = 0; i < options.length; i++) {
                const o = options[i];
                if (!o.label || !String(o.label).trim()) {
                    setError(`Option ${i + 1} label is required`);
                    return;
                }
                if (Number.isNaN(Number(o.score))) {
                    setError(`Option ${i + 1} score must be a number`);
                    return;
                }
            }
        }

        setError('');
        const meta = type === 'choice' ? { choices: options.map((o) => ({ key: o.key, label: o.label, score: Number(o.score) })) } : {};
        onSave({ text, type, required, weight, meta });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/40" onClick={onClose} />
            <div className="relative max-h-[36rem] overflow-auto w-full max-w-2xl bg-white rounded-2xl p-6 z-10 shadow-lg">
                <button className="absolute top-4 right-4 text-gray-500" onClick={onClose} aria-label="close">
                    <X />
                </button>
                <h2 className="text-lg font-semibold">{isEditing ? 'Edit' : 'Add'} Question</h2>
                <p className="text-sm text-gray-500 mb-4">Configure the question</p>

                {error && (
                    <div className="mb-3 text-sm text-red-700 bg-red-50 p-2 rounded flex items-center gap-2">
                        <AlertCircle className="w-4 h-4" />
                        {error}
                    </div>
                )}

                <div className="space-y-4">
                    <div>
                        <label className="text-xs block mb-1">Question Text</label>
                        <input value={text} onChange={(e) => setText(e.target.value)} className="form-input w-full p-2 border rounded" />
                    </div>

                    <div>
                        <label className="text-xs block mb-1">Question Type</label>
                        <select value={type} onChange={(e) => setType(e.target.value)} className="form-input w-full p-2 border rounded">
                            <option disabled value="">
                                Select Type
                            </option>
                            {questionTypes.map((qt) => (
                                <option key={qt.key} value={qt.key}>
                                    {qt.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="flex items-center justify-between">
                        <div>
                            <label className="text-xs block">Required</label>
                            <input type="checkbox" checked={required} onChange={(e) => setRequired(e.target.checked)} />
                        </div>
                        <div className="w-[40%]">
                            <label className="text-xs block mb-1">Weight</label>
                            <input type="number" min={0} value={weight} onChange={(e) => setWeight(Number(e.target.value || 0))} className="form-input w-full p-2 border rounded" />
                        </div>
                    </div>

                    {/* Choice options editor */}
                    {type === 'choice' && (
                        <div className="border rounded p-3 bg-gray-50">
                            <div className="flex items-center justify-between mb-3">
                                <div>
                                    <div className="font-medium text-sm">Options</div>
                                    <div className="text-xs text-gray-500">Each option needs a label and numeric score used for scoring.</div>
                                </div>
                                <button onClick={addOption} className="inline-flex items-center gap-2 px-3 py-1.5 border rounded text-sm">
                                    <Plus className="w-4 h-4" /> Add option
                                </button>
                            </div>

                            <div className="space-y-2">
                                {options.map((opt, i) => (
                                    <div key={opt.key} className="flex items-center gap-2">
                                        <div className="w-[60%]">
                                            <label className="text-xs block mb-1">Label</label>
                                            <input
                                                value={opt.label}
                                                onChange={(e) => updateOptionLabel(opt.key, e.target.value)}
                                                className="form-input w-full p-2 border rounded"
                                                placeholder={`Option ${i + 1} label`}
                                            />
                                        </div>

                                        <div className="w-[25%]">
                                            <label className="text-xs block mb-1">Score</label>
                                            <input
                                                type="number"
                                                step="0.1"
                                                value={opt.score}
                                                onChange={(e) => updateOptionScore(opt.key, Number(e.target.value || 0))}
                                                className="form-input w-full p-2 border rounded"
                                            />
                                        </div>

                                        <div className="w-[15%] flex items-end mt-5">
                                            <button onClick={() => removeOption(opt.key)} className="p-2 border rounded text-red-600 flex items-center gap-2" title="Remove option">
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="flex justify-end gap-2 mt-4">
                        <button onClick={onClose} className="px-4 py-2 border rounded">
                            Cancel
                        </button>
                        <button onClick={handleSubmit} className="px-4 py-2 bg-indigo-700 text-white rounded inline-flex items-center gap-2">
                            <Save className="w-4 h-4" /> {isEditing ? 'Update' : 'Add'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
