// src/pages/FormBuilder.tsx
import React, { useEffect, useState } from 'react';
import { Plus, Save } from 'lucide-react';
import EvaluationServices from '../../../services/EvaluationServices';
import Modal from './Popups/Modal';
import QuestionsPopup, { AddQuestionModalProps } from './Popups/QuestionsPopup';
import DynamicFormRenderer, { SnapshotQuestion } from './DynamicFormRenderer';
import Spinner from '../../Spinner';

type Props = {
    templateId?: number | string | null;
    onClose?: () => void;
};

export default function FormBuilder({ templateId = null, onClose }: Props) {
    const [loading, setLoading] = useState(true);
    const [builderMeta, setBuilderMeta] = useState<any>(null);
    const [template, setTemplate] = useState<any>({ name: '', description: '', form_type: 'self', reusable: true });
    const [questions, setQuestions] = useState<SnapshotQuestion[]>([]);
    const [openQModal, setOpenQModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editIndex, setEditIndex] = useState<number | null>(null);

    useEffect(() => {
        setLoading(true);
        EvaluationServices.fetchFormCreation()
            .then((r) => setBuilderMeta(r))
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    const openAddQ = () => {
        setIsEditing(false);
        setEditIndex(null);
        setOpenQModal(true);
    };
    const handleSaveQuestion = (q: any) => {
        const snapshotQ: SnapshotQuestion = { id: `q-${Date.now()}`, text: q.text, qtype: q.type, weight: q.weight ?? 1, required: q.required, meta: q.meta ?? {} };
        if (isEditing && editIndex !== null) {
            setQuestions((s) => s.map((it, idx) => (idx === editIndex ? snapshotQ : it)));
        } else {
            setQuestions((s) => [...s, snapshotQ]);
        }
        setOpenQModal(false);
    };

    async function onCreateTemplate() {
        try {
            setLoading(true);
            const tpl = await EvaluationServices.createTemplate({
                name: template.name,
                description: template.description,
                form_type: template.form_type,
                default_visibility: {},
                reusable: template.reusable,
            });
            const snapshot = questions.map((q) => ({ id: q.id, text: q.text, qtype: q.qtype, weight: q.weight, required: q.required, meta: q.meta }));
            await EvaluationServices.createVersion({ template: tpl.id, version_number: 1, title: `${tpl.name} v1`, snapshot });
            alert('Template created');
            onClose?.();
        } catch (e) {
            console.error(e);
            alert('Failed to create template: ' + (e as Error).message);
        } finally {
            setLoading(false);
        }
    }

    if (loading)
        return (
            <div className="p-6">
                <Spinner />
            </div>
        );

    return (
        <div className="p-4">
            <div className="grid grid-cols-3 gap-6">
                <div className="col-span-2 bg-white p-4 rounded-lg shadow">
                    <label className="block text-sm">Form name</label>
                    <input className="form-input mt-2 mb-3" value={template.name} onChange={(e) => setTemplate({ ...template, name: e.target.value })} />

                    <label className="block text-sm">Description</label>
                    <textarea className="form-input mt-2 mb-3" value={template.description} onChange={(e) => setTemplate({ ...template, description: e.target.value })} />

                    <div className="flex items-center justify-between my-3">
                        <button className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded" onClick={openAddQ}>
                            <Plus /> Add Question
                        </button>
                        <div className="text-sm text-gray-500">Question types: {builderMeta?.question_types?.map((q: AddQuestionModalProps) => q.label).join(', ')}</div>
                    </div>

                    <div className="space-y-2">
                        {questions.length === 0 ? (
                            <div className="text-gray-500 p-6 border rounded">No questions yet</div>
                        ) : (
                            questions.map((q, idx) => (
                                <div key={q.id} className="p-3 border rounded flex justify-between items-center">
                                    <div>
                                        <div className="font-medium">{q.text}</div>
                                        <div className="text-xs text-gray-500">
                                            Type: {q.qtype} weight:{q.weight}
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => {
                                                setIsEditing(true);
                                                setEditIndex(idx);
                                                setOpenQModal(true);
                                            }}
                                            className="px-3 py-1 border rounded"
                                        >
                                            Edit
                                        </button>
                                        <button onClick={() => setQuestions((s) => s.filter((_, i) => i !== idx))} className="px-3 py-1 border rounded text-red-600">
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                <div className="col-span-1 bg-white p-4 rounded-lg shadow">
                    <div className="mb-3">
                        <label className="block text-sm">Form type</label>
                        <select className="form-input mt-1" value={template.form_type} onChange={(e) => setTemplate({ ...template, form_type: e.target.value })}>
                            {(builderMeta?.form_types ?? []).map((ft: any) => (
                                <option key={ft.key} value={ft.key}>
                                    {ft.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="mb-3">
                        <label className="block text-sm">Reusable</label>
                        <input type="checkbox" checked={template.reusable} onChange={(e) => setTemplate({ ...template, reusable: e.target.checked })} />
                    </div>

                    <div className="mt-6">
                        <button className="w-full px-4 py-2 bg-indigo-700 text-white rounded" onClick={onCreateTemplate}>
                            <Save /> Save
                        </button>
                    </div>
                </div>
            </div>

            <Modal open={openQModal} onClose={() => setOpenQModal(false)}>
                <QuestionsPopup
                    questionTypes={builderMeta?.question_types ?? []}
                    onSave={handleSaveQuestion}
                    onClose={() => setOpenQModal(false)}
                    isEditing={isEditing}
                    initQuestion={editIndex !== null ? questions[editIndex] : null}
                />
            </Modal>
        </div>
    );
}
