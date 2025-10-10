// src/components/PublishVersionModal.tsx
import React, { useEffect, useState } from 'react';
import { X, Save } from 'lucide-react';
import toast from 'react-hot-toast';
import EvaluationServices from '../../../../services/EvaluationServices';
import Modal from './Modal';

type QuestionLocal = {
    id: string | number;
    text: string;
    qtype: string;
    weight: number;
    required?: boolean;
    meta?: any;
};

type Props = {
    open: boolean;
    templateId?: number | string | null;
    questions?: QuestionLocal[];
    onClose: () => void;
    onPublished?: (version: any) => void;
    defaultVersionNumber?: number;
};

export default function PublishVersionModal({ open, templateId, questions = [], onClose, onPublished, defaultVersionNumber = 1 }: Props) {
    const [title, setTitle] = useState<string>('');
    const [versionNumber, setVersionNumber] = useState<number>(defaultVersionNumber);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (open) {
            setTitle('');
            setVersionNumber(defaultVersionNumber);
            setError(null);
            // Modal already handles backdrop; no body overflow handling here
        }
    }, [open, defaultVersionNumber]);

    const handlePublish = () => {
        if (!templateId) {
            setError('Template id missing.');
            return;
        }
        if (!title.trim()) {
            setError('Title is required.');
            return;
        }
        if (!versionNumber || Number(versionNumber) <= 0) {
            setError('Version number must be a positive integer.');
            return;
        }

        setError(null);
        setLoading(true);

        const payload = {
            template: templateId,
            version_number: Number(versionNumber),
            title: title.trim(),
            snapshot: (questions || []).map((q) => ({
                id: q.id,
                text: q.text,
                qtype: q.qtype,
                weight: q.weight,
                meta: q.meta || {},
            })),
        };

        // .then().catch() style per your preference
        EvaluationServices.createVersion(payload)
            .then((res) => {
                toast.success('Version published');
                if (onPublished) onPublished(res);
                onClose();
            })
            .catch((err: any) => {
                console.log('Error : ', err);
                const msg = err?.response?.data?.non_field_errors || 'Publish failed';
                setError(String(msg));
                toast.error('Failed to publish version: ' + msg);
            })
            .finally(() => {
                setLoading(false);
            });
    };

    return (
        <Modal open={open} onClose={onClose} className="max-w-md">
            <div className="flex items-start justify-between p-1 pb-3 border-b">
                <div>
                    <h3 id="publish-version-title" className="text-lg font-semibold">
                        Publish Template Snapshot
                    </h3>
                    <p className="text-sm text-gray-500">Create a version (snapshot) of the template and its questions.</p>
                </div>

                <button onClick={onClose} className="p-2 rounded-md text-gray-500 hover:bg-gray-100" title="Close">
                    <X />
                </button>
            </div>

            <div className="p-2 space-y-3">
                {error && <div className="p-2 bg-red-50 text-red-700 rounded text-sm">{error}</div>}

                <div>
                    <label className="text-xs block mb-1">Version Title</label>
                    <input className="w-full p-2 border rounded" placeholder="e.g. Q4 2025 Performance snapshot" value={title} onChange={(e) => setTitle(e.target.value)} />
                </div>

                <div>
                    <label className="text-xs block mb-1">Version Number</label>
                    <input type="number" min={1} className="w-32 p-2 border rounded" value={String(versionNumber)} onChange={(e) => setVersionNumber(Number(e.target.value || 0))} />
                    <div className="text-xs text-gray-500 mt-1">Must be a unique integer for this template (backend-enforced).</div>
                </div>

                <div>
                    <label className="text-xs block mb-1">Preview</label>
                    <div className="max-h-36 overflow-auto border rounded p-2 bg-gray-50 text-sm">
                        {questions && questions.length > 0 ? (
                            questions.map((q, i) => (
                                <div key={String(q.id)} className="mb-2">
                                    <div className="font-medium text-sm">
                                        {i + 1}. {q.text}
                                    </div>
                                    <div className="text-xs text-gray-500">
                                        Type: {q.qtype} • Weight: {q.weight}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-gray-500">No questions to snapshot.</div>
                        )}
                    </div>
                </div>

                <div className="flex items-center gap-3 justify-end pt-2">
                    <button onClick={onClose} disabled={loading} className="px-4 py-2 rounded-md border bg-white text-gray-700 hover:bg-gray-50">
                        Cancel
                    </button>

                    <button onClick={handlePublish} disabled={loading} className="inline-flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 disabled:opacity-60">
                        {loading ? (
                            <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                            </svg>
                        ) : (
                            <Save size={14} />
                        )}
                        Publish
                    </button>
                </div>
            </div>
        </Modal>
    );
}
