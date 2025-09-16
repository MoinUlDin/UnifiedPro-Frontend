// src/pages/TemplatesList.tsx
import React, { useEffect, useState } from 'react';
import { Plus, Edit } from 'lucide-react';
import EvaluationServices from '../../../services/EvaluationServices';
import Modal from './Popups/Modal';
import FormBuilder from './FormBuilder';

type Template = any;

export default function TemplatesList() {
    const [templates, setTemplates] = useState<Template[]>([]);
    const [loading, setLoading] = useState(true);
    const [openBuilder, setOpenBuilder] = useState(false);
    const [editingTemplate, setEditingTemplate] = useState<Template | null>(null);

    useEffect(() => {
        load();
    }, []);

    async function load() {
        setLoading(true);
        try {
            const r = await EvaluationServices.listTemplates();
            setTemplates(r);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="p-6 max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Evaluation Templates</h2>
                <div>
                    <button
                        onClick={() => {
                            setEditingTemplate(null);
                            setOpenBuilder(true);
                        }}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded"
                    >
                        <Plus /> Create Template
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-3 gap-6">
                {templates.map((t) => (
                    <div key={t.id} className="bg-white p-4 rounded-lg shadow-sm">
                        <div className="flex justify-between">
                            <div>
                                <div className="font-semibold">{t.name}</div>
                                <div className="text-xs text-gray-500 mt-1">{t.form_type}</div>
                            </div>
                            <div>
                                <button
                                    onClick={() => {
                                        setEditingTemplate(t);
                                        setOpenBuilder(true);
                                    }}
                                    className="px-2 py-1 border rounded"
                                >
                                    <Edit />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <Modal open={openBuilder} onClose={() => setOpenBuilder(false)} className="max-w-4xl">
                <FormBuilder templateId={editingTemplate?.id} onClose={() => setOpenBuilder(false)} />
            </Modal>
        </div>
    );
}
