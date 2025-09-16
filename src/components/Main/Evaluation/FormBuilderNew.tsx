import React, { useEffect, useState } from 'react';
import { Plus, Save, FileText, ArrowLeft } from 'lucide-react';
import Modal from '../components/Modal';
import EvaluationServices from '../../../services/EvaluationServices';
import QuestionsPopup from './Popups/QuestionsPopup';

export default function FormBuilder({ templateId, onBack }) {
    const [loading, setLoading] = useState(true);
    const [builderMeta, setBuilderMeta] = useState(null); // {form_types, question_types, period_choices}
    const [template, setTemplate] = useState({ name: '', description: '', form_type: 'self', default_visibility: {}, reusable: true });
    const [questions, setQuestions] = useState([]);
    const [openQModal, setOpenQModal] = useState(false);
    const [isEditing, setEditing] = useState(false);
    const [editIndex, setEditIndex] = useState(null);

    useEffect(() => {
        setLoading(true);
        EvaluationServices.fetchFormCreation()
            .then((r) => setBuilderMeta(r))
            .catch((e) => console.error(e))
            .finally(() => setLoading(false));
    }, []);

    useEffect(() => {
        if (!templateId) return;
        // fetch template details if editing (you may add an endpoint)
        // For now we assume parent passed `template` or you can call listTemplates() and find by id.
    }, [templateId]);

    const openAddQ = () => {
        setEditIndex(null);
        setEditing(false);
        setOpenQModal(true);
    };
    const onSaveQuestion = (q) => {
        if (isEditing && editIndex !== null) {
            setQuestions((qs) => qs.map((it, idx) => (idx === editIndex ? q : it)));
        } else {
            setQuestions((qs) => [...qs, { id: `tmp-${Date.now()}`, ...q }]);
        }
        setOpenQModal(false);
    };

    const onCreateTemplate = async () => {
        try {
            setLoading(true);
            const payload = {
                name: template.name,
                description: template.description,
                form_type: template.form_type,
                default_visibility: template.default_visibility,
                reusable: template.reusable,
            };
            const created = await EvaluationServices.createTemplate(payload);
            // create version snapshot from questions
            const snapshot = questions.map((q, i) => ({
                id: q.id || `q-${i + 1}`,
                text: q.text,
                qtype: q.type,
                weight: q.weight || 1,
                required: !!q.required,
                meta: q.meta || {},
            }));
            await EvaluationServices.createVersion({
                template: created.id,
                version_number: 1,
                title: `${created.name} v1`,
                snapshot,
            });
            toast && toast.success && toast.success('Template and version created');
        } catch (err) {
            console.error(err);
            alert('Failed to create template');
        } finally {
            setLoading(false);
        }
    };

    if (loading)
        return (
            <div className="p-8">
                <div className="flex items-center gap-3">
                    <Spinner /> Loading...
                </div>
            </div>
        );

    return (
        <div className="p-6 max-w-6xl mx-auto">
            <div className="mb-6 flex items-center gap-4">
                <button onClick={onBack} className="p-2 rounded hover:bg-gray-100">
                    <ArrowLeft />
                </button>
                <h2 className="text-2xl font-bold text-indigo-900">Form Builder</h2>
            </div>

            <div className="grid grid-cols-3 gap-6">
                <div className="col-span-2 bg-white rounded-xl p-6 shadow-sm">
                    <label className="text-sm">Form Name</label>
                    <input className="form-input mt-2 mb-4" value={template.name} onChange={(e) => setTemplate({ ...template, name: e.target.value })} />

                    <label className="text-sm">Description</label>
                    <textarea className="form-input mt-2 mb-4" value={template.description} onChange={(e) => setTemplate({ ...template, description: e.target.value })} />

                    <div className="flex items-center justify-between">
                        <div>
                            <button onClick={openAddQ} className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg">
                                <Plus /> Add Question
                            </button>
                        </div>
                        <div className="text-sm text-gray-500">Question types: {builderMeta?.question_types?.map((q) => q.label).join(', ')}</div>
                    </div>

                    <div className="mt-6">
                        {questions.length === 0 ? (
                            <div className="p-8 text-center text-gray-500 border rounded-lg">No questions added yet</div>
                        ) : (
                            <div className="space-y-3">
                                {questions.map((q, idx) => (
                                    <div key={q.id} className="p-4 border rounded-lg flex justify-between items-start">
                                        <div>
                                            <div className="text-sm font-medium">{q.text}</div>
                                            <div className="text-xs text-gray-500 mt-1">
                                                Type: {q.type} — Weight: {q.weight}
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => {
                                                    setEditIndex(idx);
                                                    setEditing(true);
                                                    setOpenQModal(true);
                                                }}
                                                className="px-3 py-1 border rounded"
                                            >
                                                Edit
                                            </button>
                                            <button onClick={() => setQuestions((qs) => qs.filter((_, i) => i !== idx))} className="px-3 py-1 border rounded text-red-600">
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                <div className="col-span-1 bg-white rounded-xl p-6 shadow-sm">
                    <h3 className="text-sm font-semibold mb-4">Options</h3>
                    <div className="space-y-3">
                        <div>
                            <label className="text-xs text-gray-600">Form Type</label>
                            <select value={template.form_type} onChange={(e) => setTemplate({ ...template, form_type: e.target.value })} className="form-input mt-1 w-full">
                                {builderMeta?.form_types?.map((ft) => (
                                    <option key={ft.key} value={ft.key}>
                                        {ft.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="text-xs text-gray-600">Reusable</label>
                            <div className="mt-1">
                                <label className="inline-flex items-center gap-2">
                                    <input type="checkbox" checked={template.reusable} onChange={(e) => setTemplate({ ...template, reusable: e.target.checked })} />
                                    <span className="text-sm">Reusable across periods</span>
                                </label>
                            </div>
                        </div>

                        <div>
                            <button className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 bg-indigo-700 text-white rounded-lg" onClick={onCreateTemplate}>
                                <Save /> Save template & create version
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <Modal open={openQModal} onClose={() => setOpenQModal(false)}>
                <QuestionsPopup
                    questionTypes={builderMeta?.question_types || []}
                    onSave={onSaveQuestion}
                    onClose={() => setOpenQModal(false)}
                    isEditing={isEditing}
                    initQuestion={editIndex !== null ? questions[editIndex] : null}
                />
            </Modal>
        </div>
    );
}
