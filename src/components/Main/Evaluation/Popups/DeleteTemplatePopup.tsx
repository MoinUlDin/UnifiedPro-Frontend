// src/components/DeleteTemplatePopup.tsx
import React, { useEffect, useRef, useState } from 'react';
import { X, Trash2 } from 'lucide-react';

type Props = {
    open: boolean;
    templateName?: string;
    onConfirm: (includeQuestions: boolean) => void;
    onClose: () => void;
    defaultIncludeQuestions?: boolean;
    confirmLabel?: string;
};

export default function DeleteTemplatePopup({ open, templateName, onConfirm, onClose, defaultIncludeQuestions = true, confirmLabel = 'Delete' }: Props) {
    const [includeQuestions, setIncludeQuestions] = useState<boolean>(defaultIncludeQuestions);
    const [loading, setLoading] = useState(false);
    const overlayRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        setIncludeQuestions(defaultIncludeQuestions);
    }, [defaultIncludeQuestions, open]);

    useEffect(() => {
        function onKey(e: KeyboardEvent) {
            if (e.key === 'Escape') onClose();
        }
        if (open) {
            document.addEventListener('keydown', onKey);
            // trap scroll behind modal
            document.body.style.overflow = 'hidden';
        }
        return () => {
            document.removeEventListener('keydown', onKey);
            document.body.style.overflow = '';
        };
    }, [open, onClose]);

    if (!open) return null;

    const handleConfirm = () => {
        onConfirm(includeQuestions);
        onClose();
    };

    const backdropClick = (e: React.MouseEvent) => {
        if (e.target === overlayRef.current) {
            onClose();
        }
    };

    return (
        <div
            ref={overlayRef}
            onMouseDown={backdropClick}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
            aria-modal="true"
            role="dialog"
            aria-labelledby="delete-template-title"
        >
            <div className="relative w-full max-w-lg bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="flex items-start justify-between p-4 border-b">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center">
                            <Trash2 className="text-red-600" />
                        </div>
                        <div>
                            <h3 id="delete-template-title" className="text-lg font-semibold">
                                Delete template
                            </h3>
                            <p className="text-sm text-gray-500">
                                {templateName ? (
                                    <>
                                        Are you sure you want to delete <strong>{templateName}</strong>?
                                    </>
                                ) : (
                                    <>Are you sure you want to delete this template?</>
                                )}
                            </p>
                        </div>
                    </div>

                    <button onClick={onClose} className="p-2 rounded-md text-gray-500 hover:bg-gray-100" aria-label="Close" title="Close">
                        <X />
                    </button>
                </div>

                <div className="p-4">
                    <div className="mb-4">
                        <label className="flex items-center justify-between gap-3">
                            <div>
                                <div className="font-medium">Also remove questions</div>
                                <div className="text-sm text-gray-500">If enabled, all questions attached to the template will be deleted before the template is removed.</div>
                            </div>

                            {/* simple switch */}
                            <div>
                                <button
                                    type="button"
                                    onClick={() => setIncludeQuestions((s) => !s)}
                                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none
                    ${includeQuestions ? 'bg-indigo-600' : 'bg-gray-200'}`}
                                    aria-pressed={includeQuestions}
                                    aria-label="Toggle include questions"
                                >
                                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${includeQuestions ? 'translate-x-5' : 'translate-x-1'}`} />
                                </button>
                            </div>
                        </label>
                    </div>

                    <div className="mb-3 text-sm text-gray-700">
                        <strong>Warning:</strong> Deleting questions is permanent. If you are unsure, disable "Also remove questions" to keep the questions for reuse.
                    </div>

                    <div className="flex items-center justify-end gap-3 mt-4">
                        <button
                            onClick={handleConfirm}
                            disabled={loading}
                            className="inline-flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-md shadow-sm hover:bg-red-700 disabled:opacity-60"
                        >
                            {loading ? (
                                <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                                </svg>
                            ) : null}
                            {confirmLabel}
                        </button>

                        <button onClick={onClose} className="px-4 py-2 rounded-md border border-gray-200 bg-white text-gray-700 hover:bg-gray-50">
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
