import React, { useState, useEffect } from 'react';
import { Eye, Save, Plus, FileText, ToggleLeft, ToggleRight, Search, Edit, Delete, Trash2 } from 'lucide-react';
import EvaluationServices from '../../../services/EvaluationServices';
import toast from 'react-hot-toast';
import { FromBuilderChoiceType, CommonChoiceType } from '../../../constantTypes/EvaluationTypes';
import QuestionsPopup from './Popups/QuestionsPopup';

interface formType {
    name: '';
    description: '';
    evaluationType: '';
    anonymous: false;
    includeMetrics: false;
    onePerPeriod: '';
    questions?: any;
}
const FormBuilderPage: React.FC = () => {
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState<formType>({
        name: '',
        description: '',
        evaluationType: '',
        anonymous: false,
        includeMetrics: false,
        onePerPeriod: '',
        questions: null,
    });
    const [evaluationTypes, setEvaluationTypes] = useState<CommonChoiceType[]>([]);
    const [questionTypes, setQuestionTypes] = useState<CommonChoiceType[]>([]);
    const [periodTypes, setPeriodTypes] = useState<CommonChoiceType[]>([]);
    const [questions, setQuestions] = useState<any[]>([]); // Placeholder for questions; expand as needed
    const [searchTerm, setSearchTerm] = useState('');
    const [openQuestionPopup, setOpenQuestionPopup] = useState<boolean>(false);
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [qInEdit, setQInEdit] = useState<CommonChoiceType | null>(null);
    const [initQuestion, setInitQuestion] = useState<any>(null);

    useEffect(() => {
        fetchFormCreationData();
    }, []);

    const fetchFormCreationData = async () => {
        setLoading(true);
        EvaluationServices.fetchFormCreation()
            .then((r: FromBuilderChoiceType) => {
                console.log('builder Response: ', r);
                setEvaluationTypes(r.form_types || []);
                setQuestionTypes(r.question_types || []);
                setPeriodTypes(r.period_choices || []);
            })
            .catch((e) => {
                console.error(e);
                toast.error('Failed to load form creation data');
            })
            .finally(() => {
                setLoading(false);
            });
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type, checked } = e.target as any;
        setFormData((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleAddQuestion = () => {
        setInitQuestion(null);
        setIsEditing(false);
        setOpenQuestionPopup(true);
    };

    const handleSave = () => {
        // Save logic; call API
        console.log('From Data: ', formData);
        setFormData({ ...formData, questions });
        toast.success('Form saved!');
    };

    const handlePreview = () => {
        // Preview logic
        toast('Opening preview...');
    };
    useEffect(() => {
        console.log('Form Data updated: ', formData);
    }, [formData]);
    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            </div>
        );
    }
    const makeId = () => Date.now().toString();
    const handleAddEditQuestion = (data: any) => {
        console.log('Given Data:', data);
        setQuestions((prev) => {
            if (isEditing && initQuestion?.id) {
                return prev.map((q) => (q.id === data.id ? { ...q, ...data } : q));
            }
            // adding new: ensure it has an id
            const newItem = { ...data, id: data.id ?? makeId() };
            return [...prev, newItem];
        });
    };

    const handleEditQuestion = (question: any) => {
        if (!question) return;
        setInitQuestion(question);
        setIsEditing(true);
        setOpenQuestionPopup(true);
    };
    const handleDeleteQuestion = (question: any) => {
        if (!question?.id) return;
        setQuestions((prev) => prev.filter((q) => q.id !== question.id));
    };
    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-indigo-900 flex items-center gap-3">
                            <FileText className="w-8 h-8 text-indigo-600" />
                            Form Builder
                        </h1>
                        <p className="text-gray-600 mt-2">Create and manage evaluation forms for different assessment types.</p>
                    </div>
                    <div className="flex gap-4">
                        <button
                            onClick={handlePreview}
                            className="inline-flex items-center gap-2 px-3 py-1 text-sm bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                            <Eye size={12} />
                            Preview
                        </button>
                        <button onClick={handleSave} className="inline-flex items-center gap-2 px-3 py-1 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
                            <Save size={12} />
                            Save Form
                        </button>
                    </div>
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Create New Form */}
                    <div className="lg:col-span-1 bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                        <h2 className="text-xl font-semibold text-gray-900 mb-6 border-b pb-4">Create New Form</h2>

                        <div className="space-y-6">
                            {/* Form Name */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Form Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    placeholder="Enter form name"
                                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-200 transition-all"
                                />
                            </div>

                            {/* Description */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    placeholder="Describe the purpose of this evaluation"
                                    rows={3}
                                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-200 transition-all"
                                />
                            </div>

                            {/* Evaluation Type */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Evaluation Type</label>
                                <select
                                    name="evaluationType"
                                    value={formData.evaluationType}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-200 transition-all"
                                >
                                    <option value="">Select Type</option>
                                    {evaluationTypes.map((type) => (
                                        <option key={type.key} value={type.label}>
                                            {type.label}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Anonymous Responses */}
                            <div className="flex items-center justify-between">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Anonymous Responses</label>
                                    <p className="text-xs text-gray-500">Include anonymous responses</p>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input type="checkbox" name="anonymous" checked={formData.anonymous} onChange={handleInputChange} className="sr-only peer" />
                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-indigo-300 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-indigo-600"></div>
                                </label>
                            </div>

                            {/* Include System Metrics */}
                            {/* <div className="flex items-center justify-between">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Include System Metrics</label>
                                    <p className="text-xs text-gray-500">Include system metrics</p>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input type="checkbox" name="includeMetrics" checked={formData.includeMetrics} onChange={handleInputChange} className="sr-only peer" />
                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-indigo-300 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-indigo-600"></div>
                                </label>
                            </div> */}

                            {/* One Per Period */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">One Per Period</label>
                                <select
                                    name="onePerPeriod"
                                    value={formData.onePerPeriod}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-200 transition-all"
                                >
                                    <option value="">Select Period</option>
                                    {periodTypes.map((p) => (
                                        <option key={p.key} value={p.key}>
                                            {p.label}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Questions Section */}
                    <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                        <h2 className="text-xl font-semibold text-gray-900 mb-6 border-b pb-4">Questions</h2>

                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-medium text-gray-800">Build your evaluation questions</h3>
                            <button onClick={handleAddQuestion} className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
                                <Plus className="w-4 h-4" />
                                Add Question
                            </button>
                        </div>

                        {questions.length === 0 ? (
                            <div className="text-center py-12">
                                <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                                <h3 className="text-lg font-medium text-gray-900 mb-2">No questions added yet</h3>
                                <p className="text-gray-500 mb-6">Start building your evaluation form by adding questions</p>
                                <button onClick={handleAddQuestion} className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
                                    <Plus className="w-5 h-5" />
                                    Add Your First Question
                                </button>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {/* Render questions here; expand with actual question component */}
                                {questions.map((q) => (
                                    <div key={q.id} className="p-4 border border-gray-200 rounded-lg">
                                        <div className="flex justify-between items-center">
                                            <span>{q.text}</span>
                                            <div className="flex gap-4">
                                                <span className="py-0.5 px-2 text-[12px] bg-gray-200 border rounded-full">
                                                    {' '}
                                                    <span className="font-bold">Type:</span> {q.type}
                                                </span>
                                                <div className="flex gap-3">
                                                    <button onClick={() => handleEditQuestion(q)}>
                                                        <Edit size={16} />
                                                    </button>
                                                    <button onClick={() => handleDeleteQuestion(q)}>
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Existing Forms - Placeholder */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mt-8">
                    <h2 className="text-xl font-semibold text-gray-900 mb-6 border-b pb-4">Existing Forms</h2>

                    <div className="flex items-center gap-4 mb-6">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search forms..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-200 transition-all"
                            />
                        </div>
                    </div>

                    <div className="text-center py-12 text-gray-500">
                        {/* Placeholder; fetch and render existing forms here */}
                        No existing forms
                    </div>
                </div>
            </div>
            {openQuestionPopup && (
                <QuestionsPopup questionTypes={questionTypes} isEditing={isEditing} initQuestion={initQuestion} onClose={() => setOpenQuestionPopup(false)} onSave={handleAddEditQuestion} />
            )}
        </div>
    );
};

export default FormBuilderPage;
