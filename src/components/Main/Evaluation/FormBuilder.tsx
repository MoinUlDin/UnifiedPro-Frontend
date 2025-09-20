// (Full component below — replace your current file content with this)

import React, { useEffect, useState } from 'react';
import { Eye, Save, Plus, Edit, Copy, Trash2, ArrowRight, User, Users, BrainCog, CheckCircle, X, Calendar, CheckLine } from 'lucide-react';
import toast from 'react-hot-toast';
import EvaluationServices from '../../../services/EvaluationServices';
import QuestionsPopup from './Popups/QuestionsPopup';
import Spinner from '../../Spinner';
import { ListTemplatesType, ListQuestionType } from '../../../constantTypes/EvaluationTypes';
import { CheckOwner, formatDateOnly } from '../../../utils/Common';
import DeleteTemplatePopup from './Popups/DeleteTemplatePopup';
import PublishVersionModal from './Popups/PublishVersionModal';

type FormType = 'self' | 'manager' | '360' | 'employee_manager';

type QuestionType = 'bool' | 'rating' | 'choice' | 'text';

type Question = {
    id: string | number; // local id (uuid or temp) or existing DB id (number or string)
    text: string;
    qtype: QuestionType;
    weight: number;
    required: boolean;
    meta?: any; // for choices: { choices: [{key,label}], mapping? } or rating range
};

type Template = {
    id?: number | string | null;
    name: string;
    description?: string;
    form_type: FormType;
    reusable: boolean;
    default_visibility: { [k: string]: boolean };
    versions?: any[]; // not used here, but returned by backend
};

// small util
const uid = (prefix = 'q_') => `${prefix}${Math.random().toString(36).slice(2, 9)}`;

export default function FormBuilder({ existingTemplate }: { existingTemplate?: Template | null }) {
    // Steps: 0 = info, 1 = questions, 2 = settings/review
    const [step, setStep] = useState<number>(0);
    const [listTemplates, setListTemplates] = useState<ListTemplatesType[]>([]);
    const [tempDeleteId, setTempDeleteId] = useState<number | null>(null);

    // Template state
    const [template, setTemplate] = useState<Template>(
        existingTemplate || {
            id: null,
            name: '',
            description: '',
            form_type: 'self',
            reusable: true,
            default_visibility: { show_to_employee: true, show_to_manager: true },
        }
    );

    // Questions snapshot (will be saved into version.snapshot)
    const [questions, setQuestions] = useState<Question[]>([]);
    const [deletedQuestions, setDeletedQuestions] = useState<(number | string)[]>([]);
    const [mainTab, setMainTab] = useState<number>(2);

    // popup state
    const [showQuestionForm, setShowQuestionForm] = useState(false);
    const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
    const [openDeleteModal, setOpenDeleteModal] = useState<boolean>(false);
    const [publishOpen, setPublishOpen] = useState(false);
    const [selectedTemplate, setSelectedTemplate] = useState<ListTemplatesType | null>(null);

    // builder choice data from backend
    const [evaluationTypes, setEvaluationTypes] = useState<{ key: string; label: string }[]>([]);
    const [questionTypes, setQuestionTypes] = useState<{ key: string; label: string }[]>([]);
    const [periodTypes, setPeriodTypes] = useState<{ key: string; label: string }[]>([]);
    const [loading, setLoading] = useState(false);

    // UX
    const [saving, setSaving] = useState(false);
    const [previewing, setPreviewing] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchFormCreationData();
    }, []);
    useEffect(() => {
        fetchExistingTemplates();
    }, []);

    const fetchExistingTemplates = () => {
        setLoading(true);
        EvaluationServices.listTemplates()
            .then((r) => {
                setListTemplates(r);
                console.log('List Template: ', r);
            })
            .catch((e) => {
                toast.error(e.message || 'Unkown Error');
            })
            .finally(() => {
                setLoading(false);
            });
    };
    const fetchFormCreationData = async () => {
        setLoading(true);
        try {
            const r: any = await EvaluationServices.fetchFormCreation();
            setEvaluationTypes(r.form_types || []);
            setQuestionTypes(r.question_types || []);
            setPeriodTypes(r.period_choices || []);
        } catch (e) {
            console.error(e);
            toast.error('Failed to load form creation data');
        } finally {
            setLoading(false);
        }
    };

    // -------------------------------
    // Question operations (using QuestionsPopup)
    // -------------------------------
    function openAddQuestion() {
        setEditingQuestion(null);
        setShowQuestionForm(true);
    }

    function editQuestionById(id: string | number) {
        const q = questions.find((x) => x.id === id);
        if (q) {
            setEditingQuestion({ ...q });
            setShowQuestionForm(true);
        }
    }

    function handleSaveQuestionFromPopup(payload: any) {
        // payload: { text, type, required, weight, meta }
        const q: Question = {
            id: editingQuestion?.id || uid(),
            text: payload.text,
            qtype: payload.type as QuestionType,
            weight: payload.weight,
            required: payload.required,
            meta: payload.meta || {},
        };

        setQuestions((prev) => {
            const exists = prev.find((p) => p.id === q.id);
            if (exists) {
                return prev.map((p) => (p.id === q.id ? q : p));
            }
            return [...prev, q];
        });

        setEditingQuestion(null);
        setShowQuestionForm(false);
    }

    function duplicateQuestion(id: string | number) {
        const q = questions.find((x) => x.id === id);
        if (q) {
            const copy = { ...q, id: uid(), text: q.text + ' (copy)' };
            setQuestions((prev) => [...prev, copy]);
        }
    }

    // NOTE: deleteQuestion now tracks deleted DB IDs for update payload
    function deleteQuestion(id: string | number) {
        // if id looks like a local new id (our uid prefix), just remove silently
        const isNewLocal = typeof id === 'string' && String(id).startsWith('q_');
        if (isNewLocal) {
            setQuestions((prev) => prev.filter((x) => x.id !== id));
            return;
        }

        // store deleted id for backend
        setDeletedQuestions((prev) => {
            // avoid duplicates
            if (prev.includes(id)) return prev;
            return [...prev, id];
        });

        // remove from UI
        setQuestions((prev) => prev.filter((x) => x.id !== id));
    }

    function moveQuestion(id: string | number, dir: 'up' | 'down') {
        setQuestions((prev) => {
            const idx = prev.findIndex((p) => p.id === id);
            if (idx === -1) return prev;
            const arr = [...prev];
            const newIdx = dir === 'up' ? idx - 1 : idx + 1;
            if (newIdx < 0 || newIdx >= arr.length) return prev;
            const tmp = arr[newIdx];
            arr[newIdx] = arr[idx];
            arr[idx] = tmp;
            return arr;
        });
    }

    // -------------------------------
    // API helpers (EvaluationServices)
    // -------------------------------
    async function saveTemplate(asDraft = false) {
        setSaving(true);
        setError(null);
        try {
            const payloadTemplate: any = {
                name: template.name,
                description: template.description,
                form_type: template.form_type,
                reusable: template.reusable,
                default_visibility: template.default_visibility,
                questions: questions.map((q) => {
                    // send qtype and keys backend expects: qtype, weight, required, meta, id if present
                    return {
                        id: q.id,
                        text: q.text,
                        qtype: q.qtype,
                        weight: q.weight,
                        required: q.required,
                        meta: q.meta || {},
                    };
                }),
            };

            // If editing existing template, signal backend and send deleted_questions
            if (template.id) {
                payloadTemplate.existing_id = template.id;
                // pass only numeric/string ids that were deleted (backend will ignore local uids)
                payloadTemplate.deleted_questions = deletedQuestions;
            }

            let templateResp: any;
            // call service (backend action handles new vs update based on existing_id)
            templateResp = await EvaluationServices.CreateUpdateTemplateWithQuestions(payloadTemplate);

            console.log('template Response: ', templateResp);
            // update local template id if backend returned one
            if (templateResp?.id) {
                setTemplate((t) => ({ ...t, id: templateResp.id }));
            }

            // refresh the list & reset deletedQuestions
            fetchExistingTemplates();
            setDeletedQuestions([]);
            setQuestions([]);
            setStep(0);
            setTemplate({
                id: null,
                name: '',
                description: '',
                form_type: 'self',
                reusable: true,
                default_visibility: { show_to_employee: true, show_to_manager: true },
            });

            toast.success(template.id ? 'Template updated successfully' : 'Template created successfully', { duration: 4000 });
            setMainTab(2);
        } catch (err: any) {
            console.error(err);
            const msg = err.message || String(err);
            setError(msg);
            toast.error('Failed to save template: ' + msg);
        } finally {
            setSaving(false);
        }
    }

    // -------------------------------
    // Render helpers
    // -------------------------------
    function renderStepContent() {
        switch (step) {
            case 0:
                return (
                    <div className="grid grid-cols-2 gap-6">
                        <div className="bg-white rounded-lg p-6 border">
                            <h3 className="text-lg font-semibold mb-2">Template Information</h3>
                            <p className="text-sm text-gray-500 mb-4">Basic template details and form type</p>

                            <label className="block text-sm font-medium text-gray-700">Template Name</label>
                            <input className="mt-1 p-3 border rounded w-full" value={template.name} onChange={(e) => setTemplate({ ...template, name: e.target.value })} placeholder="Template" />

                            <label className="block text-sm font-medium text-gray-700 mt-4">Description</label>
                            <textarea
                                className="mt-1 p-3 border rounded w-full h-28"
                                value={template.description}
                                onChange={(e) => setTemplate({ ...template, description: e.target.value })}
                                placeholder="Short description..."
                            />

                            <label className="block text-sm font-medium text-gray-700 mt-4">Form Type</label>
                            <div className="mt-2 space-y-2">
                                {(evaluationTypes.length
                                    ? evaluationTypes
                                    : [
                                          { key: 'self', label: 'Self-Evaluation' },
                                          { key: 'manager', label: 'Manager Evaluation' },
                                          { key: '360', label: '360° Evaluation' },
                                          { key: 'employee_manager', label: 'Employee→Manager' },
                                      ]
                                ).map((t) => (
                                    <button
                                        key={t.key}
                                        onClick={() => setTemplate({ ...template, form_type: t.key as FormType })}
                                        className={`w-full text-left p-3 rounded border ${template.form_type === t.key ? 'border-amber-600 bg-gray-50' : 'border-gray-200'}`}
                                    >
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <div className="font-medium">{t.label}</div>
                                                <div className="text-sm text-gray-500">{getFormTypeShortDesc(t.key as FormType)}</div>
                                            </div>
                                            {template.form_type === t.key && <CheckCircle className="text-blue-600" />}
                                        </div>
                                    </button>
                                ))}
                            </div>

                            <div className="flex items-center justify-between mt-4">
                                <div className="flex items-center gap-3">
                                    <input id="reusable" type="checkbox" checked={template.reusable} onChange={(e) => setTemplate({ ...template, reusable: e.target.checked })} />
                                    <label htmlFor="reusable" className="text-sm text-gray-700">
                                        Reusable Template
                                    </label>
                                </div>

                                <div className="space-x-2">
                                    <button className="px-4 py-2 border rounded" onClick={() => (previewing ? setPreviewing(false) : setPreviewing(true))}>
                                        Preview
                                    </button>
                                    <button
                                        className="px-4 py-2 bg-black text-white rounded"
                                        onClick={() => {
                                            if (!template.name) {
                                                window.scrollTo({ top: 100, behavior: 'smooth' });
                                                toast.error('Template name is required', { duration: 3000 });
                                                return setError('Template name is required');
                                            }
                                            setError(null);
                                            setStep(1);
                                        }}
                                    >
                                        Next
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-lg p-6 border">
                            <h3 className="text-lg font-semibold">Form Type Guidelines</h3>
                            <p className="text-sm text-gray-500 mb-4">Understanding different evaluation types</p>
                            <div className="space-y-3">
                                <div className="p-3 rounded border-l-4 border-blue-200 bg-blue-50">
                                    <div className="font-medium">Self-Evaluation</div>
                                    <div className="text-sm text-gray-600">Employee self-assessment forms. Results visible to employee and manager.</div>
                                </div>
                                <div className="p-3 rounded border-l-4 border-green-200 bg-green-50">
                                    <div className="font-medium">Manager Evaluation</div>
                                    <div className="text-sm text-gray-600">Manager evaluating team members. Includes system metrics integration.</div>
                                </div>
                                <div className="p-3 rounded border-l-4 border-purple-200 bg-purple-50">
                                    <div className="font-medium">360° Evaluation</div>
                                    <div className="text-sm text-gray-600">Multi-perspective feedback. Anonymous by default, one per period.</div>
                                </div>
                                <div className="p-3 rounded border-l-4 border-orange-200 bg-orange-50">
                                    <div className="font-medium">Employee→Manager</div>
                                    <div className="text-sm text-gray-600">Anonymous manager feedback from employees. Owner/higher manager only.</div>
                                </div>
                            </div>
                        </div>
                    </div>
                );

            case 1:
                return (
                    <div className="bg-white rounded-lg p-6 border">
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <h3 className="text-lg font-semibold">Build Questions</h3>
                                <p className="text-sm text-gray-500">Add and configure evaluation questions</p>
                            </div>
                            <div>
                                <button className="inline-flex items-center gap-2 px-4 py-2 rounded bg-black text-white" onClick={openAddQuestion}>
                                    <Plus size={16} /> Add Question
                                </button>
                            </div>
                        </div>

                        <div className="space-y-4">
                            {questions.length === 0 && <div className="p-6 border rounded text-gray-500">No questions yet — click "Add Question" to start building.</div>}

                            {questions.map((q, idx) => (
                                <div key={String(q.id)} className="border rounded p-4 bg-gray-50">
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2">
                                                <div className="text-sm text-gray-400">Q{idx + 1}</div>
                                                <div className="font-medium">{q.text || <em className="text-gray-400">(untitled)</em>}</div>
                                                <div className="ml-3 text-xs text-gray-500">{q.qtype}</div>
                                                <div className="ml-3 text-xs text-gray-500">Weight: {q.weight}</div>
                                                {q.required && <div className="ml-2 text-xs text-red-500">Required</div>}
                                            </div>
                                            <div className="mt-2 text-sm text-gray-600">{renderQuestionPreviewInline(q as Question & { id: string | number })}</div>
                                        </div>

                                        <div className="flex items-center gap-2 ml-4">
                                            <button onClick={() => moveQuestion(q.id, 'up')} className="p-2 border rounded" title="Move up">
                                                ▲
                                            </button>
                                            <button onClick={() => moveQuestion(q.id, 'down')} className="p-2 border rounded" title="Move down">
                                                ▼
                                            </button>
                                            <button onClick={() => editQuestionById(q.id)} className="p-2 border rounded" title="Edit">
                                                <Edit size={14} />
                                            </button>
                                            <button onClick={() => duplicateQuestion(q.id)} className="p-2 border rounded" title="Duplicate">
                                                <Copy size={14} />
                                            </button>
                                            <button onClick={() => deleteQuestion(q.id)} className="p-2 border rounded text-red-600" title="Delete">
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="flex items-center justify-between mt-6">
                            <button className="px-4 py-2 border rounded" onClick={() => setStep(0)}>
                                Previous
                            </button>
                            <div className="space-x-2">
                                <button className="px-4 py-2 border rounded" onClick={() => setStep(2)}>
                                    Next
                                </button>
                            </div>
                        </div>

                        {/* QuestionsPopup modal */}
                        {showQuestionForm && (
                            <QuestionsPopup
                                questionTypes={questionTypes.map((q) => ({ key: q.key, label: q.label }))}
                                onSave={handleSaveQuestionFromPopup}
                                onClose={() => {
                                    setShowQuestionForm(false);
                                    setEditingQuestion(null);
                                }}
                                isEditing={!!editingQuestion}
                                initQuestion={
                                    editingQuestion
                                        ? { text: editingQuestion.text, type: editingQuestion.qtype, required: editingQuestion.required, weight: editingQuestion.weight, meta: editingQuestion.meta }
                                        : null
                                }
                            />
                        )}
                    </div>
                );

            case 2:
                return (
                    <div className="grid grid-cols-2 gap-6">
                        <div className="bg-white rounded-lg p-6 border">
                            <h3 className="text-lg font-semibold">Visibility Settings</h3>
                            <p className="text-sm text-gray-500 mb-4">Configure who can see evaluation results</p>

                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <div className="font-medium">Show to Respondent</div>
                                        <div className="text-sm text-gray-500">Allow the evaluated employee to see results</div>
                                    </div>
                                    <input
                                        type="checkbox"
                                        checked={template.default_visibility.show_to_employee}
                                        onChange={(e) => setTemplate({ ...template, default_visibility: { ...template.default_visibility, show_to_employee: e.target.checked } })}
                                    />
                                </div>

                                <div className="flex items-center justify-between">
                                    <div>
                                        <div className="font-medium">Show to Manager</div>
                                        <div className="text-sm text-gray-500">Manager assigned to evaluate can view full results</div>
                                    </div>
                                    <input
                                        type="checkbox"
                                        checked={template.default_visibility.show_to_manager}
                                        onChange={(e) => setTemplate({ ...template, default_visibility: { ...template.default_visibility, show_to_manager: e.target.checked } })}
                                    />
                                </div>
                            </div>

                            <div className="mt-6">
                                <h4 className="font-semibold">Template Summary</h4>
                                <div className="text-sm text-gray-600 mt-2">Name: {template.name || '(untitled)'}</div>
                                <div className="text-sm text-gray-600">Form Type: {template.form_type}</div>
                                <div className="text-sm text-gray-600">Questions: {questions.length}</div>
                                <div className="text-sm text-gray-600">Reusable: {template.reusable ? 'Yes' : 'No'}</div>
                            </div>

                            <div className="flex items-center justify-between mt-6">
                                <button className="px-4 py-2 border rounded" onClick={() => setStep(1)}>
                                    Previous
                                </button>
                                <div className="space-x-2">
                                    <button
                                        className="px-4 py-2 border rounded"
                                        onClick={() => {
                                            setPreviewing(true);
                                        }}
                                    >
                                        Preview
                                    </button>

                                    <button className="px-4 py-2 bg-black text-white rounded" onClick={() => saveTemplate(false)}>
                                        {saving ? 'Saving...' : 'Save Template'}
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-lg p-6 border">
                            <h3 className="text-lg font-semibold">Template Summary</h3>
                            <p className="text-sm text-gray-500 mb-4">Review your template before saving</p>

                            <div className="space-y-2">
                                <div className="text-sm">
                                    <strong>Template Name</strong>
                                </div>
                                <div className="text-sm text-gray-600">{template.name || '(untitled)'}</div>

                                <div className="text-sm mt-2">
                                    <strong>Form Type</strong>
                                </div>
                                <div className="text-sm text-gray-600">{template.form_type}</div>

                                <div className="text-sm mt-2">
                                    <strong>Questions</strong>
                                </div>
                                <div className="text-sm text-gray-600">{questions.length} questions configured</div>

                                <div className="text-sm mt-2">
                                    <strong>Reusable</strong>
                                </div>
                                <div className="text-sm text-gray-600">{template.reusable ? 'Yes' : 'No'}</div>
                            </div>
                        </div>

                        {/* preview modal */}
                        {previewing && (
                            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                                <div className="bg-white rounded-lg p-6 w-[900px] h-[600px] overflow-auto">
                                    <div className="flex items-center justify-between mb-4">
                                        <h4 className="text-lg font-semibold">Preview — {template.name}</h4>
                                        <div className="flex items-center gap-2">
                                            <button className="px-3 py-2 border rounded" onClick={() => setPreviewing(false)}>
                                                Close
                                            </button>
                                            <button className="px-3 py-2 bg-black text-white rounded" onClick={() => setPreviewing(false)}>
                                                <Save size={14} /> Save
                                            </button>
                                        </div>
                                    </div>

                                    <div>
                                        {questions.map((q, i) => (
                                            <div key={String(q.id)} className="p-3 border-b">
                                                <div className="font-medium">
                                                    {i + 1}. {q.text}
                                                </div>
                                                <div className="text-sm mt-2">{renderQuestionPreviewInline(q as Question & { id: string | number })}</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                );

            default:
                return null;
        }
    }

    if (loading) {
        return <Spinner />;
    }

    // --------------------------------------------
    // Template Actions
    // --------------------------------------------
    const handleEditTemplate = (tt: ListTemplatesType) => {
        // Map server template -> local template state
        const mappedTemplate: Template = {
            id: tt.id,
            name: tt.name,
            description: tt.description || '',
            form_type: tt.form_type as FormType,
            reusable: !!tt.reusable,
            default_visibility: tt.default_visibility || { show_to_employee: true, show_to_manager: true },
        };

        // Map server questions to local Question shape.
        // Preserve DB IDs as-is (likely numbers) so we can track deletions.
        const mappedQuestions: Question[] = (tt.questions || []).map((q: ListQuestionType) => ({
            id: typeof q.id === 'number' ? q.id : String(q.id),
            text: q.text || '',
            qtype: (q.qtype || 'text') as QuestionType,
            weight: Number(q.weight || 1),
            required: !!q.required,
            meta: q.meta || {},
        }));

        // Prefill builder and switch to Create New Template tab & first step
        setTemplate(mappedTemplate);
        setQuestions(mappedQuestions);
        setDeletedQuestions([]);
        setMainTab(1);
        setStep(0);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };
    const hanldeCopyTemplate = (tt: ListTemplatesType) => {
        const copiedTemplate: Template = {
            id: null, // ensure backend will create new
            name: `${tt.name} (copy)`,
            description: tt.description || '',
            form_type: tt.form_type as FormType,
            reusable: !!tt.reusable,
            default_visibility: tt.default_visibility || { show_to_employee: true, show_to_manager: true },
        };

        // For questions, assign fresh local ids so backend treats them as new
        const copiedQuestions: Question[] = (tt.questions || []).map((q: ListQuestionType) => ({
            id: uid(),
            text: q.text || '',
            qtype: (q.qtype || 'text') as QuestionType,
            weight: Number(q.weight || 1),
            required: !!q.required,
            meta: q.meta || {},
        }));

        setTemplate(copiedTemplate);
        setQuestions(copiedQuestions);
        setDeletedQuestions([]);
        setMainTab(1);
        setStep(0);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };
    const handlePreviewClick = (tt: ListTemplatesType) => {
        setTemplate({
            id: tt.id,
            name: tt.name,
            description: tt.description || '',
            form_type: tt.form_type as FormType,
            reusable: !!tt.reusable,
            default_visibility: tt.default_visibility || { show_to_employee: true, show_to_manager: true },
        });
        setQuestions(
            (tt.questions || []).map((q: ListQuestionType) => ({
                id: typeof q.id === 'number' ? q.id : String(q.id),
                text: q.text || '',
                qtype: (q.qtype || 'text') as QuestionType,
                weight: Number(q.weight || 1),
                required: !!q.required,
                meta: q.meta || {},
            }))
        );
        setPreviewing(true);
    };
    const handleDeleteTemplate = async (questionIncluded: boolean) => {
        if (!tempDeleteId) return toast.error('No id found, System Error');
        let payload = null;
        if (questionIncluded) {
            payload = {
                include_questions: true,
            };
        }
        setLoading(true);
        EvaluationServices.deleteTemplate(tempDeleteId, payload)
            .then(() => {
                toast.success('Template Deleted Sucessfully', { duration: 4000 });
                fetchExistingTemplates();
            })
            .catch((e) => {
                toast.error(e.message || e.details || e.detail || 'Unkown Error');
            })
            .finally(() => setLoading(false));
    };
    const handlePublish = (tt: ListTemplatesType) => {
        if (!tt.id) return toast.error('No template id found, system Error');
        setSelectedTemplate(tt);
        setPublishOpen(true);
    };
    const handleDeleteClick = (id: number) => {
        if (id) {
            setTempDeleteId(id);
            setOpenDeleteModal(true);
        }
    };
    return (
        <div className="p-6 max-w-[1200px] mx-auto">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-3xl font-bold">Form Builder</h1>
                    <div className="text-sm text-gray-500">Create and manage evaluation form templates with versioning support</div>
                </div>

                <div className="flex items-center gap-3">
                    {mainTab === 1 && (
                        <button className="px-4 py-2 bg-black text-white rounded inline-flex items-center gap-2" onClick={() => saveTemplate(false)}>
                            <Save size={16} /> Save Template
                        </button>
                    )}
                </div>
            </div>
            {/* Main tabs */}
            <div className="border flex text-center mb-2 py-1 px-1 rounded-full bg-gray-200">
                <button onClick={() => setMainTab(1)} className={`flex-1 font-semibold ${mainTab === 1 && 'bg-white'} rounded-full py-0.5`}>
                    Create New Template
                </button>
                <button onClick={() => setMainTab(2)} className={`flex-1 font-semibold ${mainTab === 2 && 'bg-white'} rounded-full py-0.5`}>
                    Existing Templates
                </button>
            </div>
            {mainTab === 1 && (
                <div>
                    <div className="bg-white rounded-lg p-4 border mb-6 px-20">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className={`size-8 flex items-center justify-center rounded-full ${step === 0 ? 'bg-black text-white' : 'bg-gray-100'}`}>1</div>

                                <div className="flex-1 flex items-center gap-3">
                                    <span>Template Info</span>
                                </div>
                            </div>
                            <ArrowRight className="text-gray-500" size={16} />
                            <div className="flex items-center gap-3">
                                <div className={`size-8 flex items-center justify-center rounded-full ${step === 1 ? 'bg-black text-white' : 'bg-gray-100'}`}>2</div>
                                <div className="flex-1 flex items-center gap-3">Build Questions</div>
                            </div>
                            <ArrowRight className="text-gray-500" size={16} />
                            <div className="flex items-center gap-3">
                                <div className={`size-8 flex items-center justify-center rounded-full ${step === 2 ? 'bg-black text-white' : 'bg-gray-100'}`}>3</div>
                                <div className="flex-1 flex items-center gap-3">Settings & Review</div>
                            </div>
                        </div>
                    </div>

                    {error && <div className="mb-4 p-3 bg-red-50 text-red-700 border rounded">Error: {error}</div>}

                    {renderStepContent()}
                </div>
            )}
            {mainTab === 2 &&
                listTemplates &&
                listTemplates.map((tt) => {
                    const color = tt.form_type === 'self' ? 'green' : 'blue';
                    return (
                        <div key={`temp-${tt.id}`} className="border shadow hover:shadow-xl transition-all duration-300 p-6 mb-3 rounded-lg bg-white">
                            <div className="flex items-center gap-2">
                                <h1 className="text-lg font-semibold">{tt.name}</h1>

                                <span className={`text-[12px] bg-${color}-100 px-2 py-0 rounded-full`}>
                                    <span className="flex items-center gap-2">
                                        {tt.form_type === 'self' ? <User size={12} /> : <Users size={12} />} <span>{tt.form_type}</span>
                                    </span>
                                </span>
                            </div>
                            <p className="text-sm text-gray-500">{tt.description}</p>
                            {/* Info section */}
                            <div className="flex items-center justify-between pr-6 mt-4 text-[12px]">
                                <div className="flex gap-2 items-center">
                                    <BrainCog size={12} />
                                    <span>{tt.questions?.length || 0} Questions</span>
                                </div>
                                <div className="flex gap-2 items-center">
                                    {tt.reusable ? <CheckCircle size={12} /> : <X size={12} />}
                                    <span>reuseable</span>
                                </div>

                                <div className="flex gap-2 items-center">
                                    <User size={12} />
                                    <span>by {tt.created_by?.name}</span>
                                </div>
                                <div className="flex gap-2 items-center">
                                    <Calendar size={12} />
                                    <span>{formatDateOnly(tt.created_at)} </span>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex items-center gap-4 mt-6">
                                <button onClick={() => handleEditTemplate(tt)} className="hover:bg-blue-200 transition-all duration-200 text-[12px] border rounded px-3  flex items-center gap-2">
                                    <Edit size={12} />
                                    <span>Edit</span>
                                </button>
                                <button onClick={() => hanldeCopyTemplate(tt)} className="hover:bg-blue-200 transition-all duration-200 text-[12px] border rounded px-3  flex items-center gap-2">
                                    <Copy size={12} />
                                    <span>Duplicate</span>
                                </button>
                                <button onClick={() => handlePreviewClick(tt)} className="hover:bg-blue-200 transition-all duration-200 text-[12px] border rounded px-3  flex items-center gap-2">
                                    <Eye size={12} />
                                    <span>Preview</span>
                                </button>
                                <button onClick={() => handlePublish(tt)} className="hover:bg-green-200 transition-all duration-200 text-[12px] border rounded px-3  flex items-center gap-2">
                                    <CheckLine size={12} />
                                    <span>Publish</span>
                                </button>
                                <button onClick={() => handleDeleteClick(tt.id)} className="hover:bg-red-300 transition-all duration-200 text-[12px] border rounded px-3  flex items-center gap-2">
                                    <Trash2 size={12} />
                                    <span>Delete</span>
                                </button>
                            </div>
                        </div>
                    );
                })}

            {openDeleteModal && <DeleteTemplatePopup open={openDeleteModal} onClose={() => setOpenDeleteModal(false)} onConfirm={handleDeleteTemplate} />}
            <PublishVersionModal
                open={publishOpen}
                templateId={selectedTemplate?.id}
                questions={selectedTemplate?.questions || questions /* or pass local questions state if editing */}
                onClose={() => setPublishOpen(false)}
                onPublished={(ver) => {
                    // refresh list or versions
                    fetchExistingTemplates();
                    setPublishOpen(false);
                }}
            />
        </div>
    );
}

// -------------------------
// Small helper components
// -------------------------

function getFormTypeShortDesc(key: FormType) {
    switch (key) {
        case 'self':
            return 'Employee self-assessment forms.';
        case 'manager':
            return 'Manager evaluating team members.';
        case '360':
            return 'Multi-perspective feedback (anonymous).';
        case 'employee_manager':
            return 'Anonymous manager feedback from employees.';
        default:
            return '';
    }
}

function renderQuestionPreviewInline(q: Question) {
    switch (q.qtype) {
        case 'rating':
            const min = q.meta?.min ?? 0;
            const max = q.meta?.max ?? 10;
            return (
                <div className="mt-4">
                    <div className="text-xs text-gray-500 flex items-center justify-between">
                        <span>{min} - Poor</span>
                        <span>{max} - Excellent</span>
                    </div>
                    <div className="w-full h-2 bg-gray-200 rounded mt-1">
                        <div className="h-2 bg-black rounded" style={{ width: `40%` }} />
                    </div>
                </div>
            );
        case 'bool':
            return (
                <div className="mt-2 flex gap-3">
                    <label className="inline-flex items-center gap-2">
                        <input disabled type="radio" name={String(q.id)} /> Yes
                    </label>
                    <label className="inline-flex items-center gap-2">
                        <input disabled type="radio" name={String(q.id)} /> No
                    </label>
                </div>
            );
        case 'choice':
            return (
                <div className="mt-3 flex flex-col gap-1 items-start">
                    {(q.meta?.choices || []).map((c: any, i: number) => {
                        return (
                            <div key={i} className="inline-flex items-center gap-2">
                                <input disabled type="checkbox" /> {c.label || c}
                                <ArrowRight className="size-2 text-gray-400" />
                                <span className="py-0 px-2 text-[8px] rounded-lg border-gray-400 bg-gray-200">{c.score}</span>
                            </div>
                        );
                    })}
                </div>
            );
        case 'text':
            return <textarea disabled className="w-full min-h-12 max-h-20 p-2 border rounded mt-2" placeholder="Free Text response..." />;
        default:
            return null;
    }
}
