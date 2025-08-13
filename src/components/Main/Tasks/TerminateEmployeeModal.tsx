import React, { useEffect, useState } from 'react';
import EmployeeServices from '../../../services/EmployeeServices';
import toast from 'react-hot-toast';

type Props = {
    open: boolean; // whether modal is visible
    onClose: () => void; // close callback
    user: { id: number; name: string }; // id of user to terminate (required)
    onSuccess?: () => void; // optional success callback (receives server response)
};

export default function TerminateEmployeeModal({ open, onClose, user, onSuccess }: Props) {
    const [terminationDate, setTerminationDate] = useState(
        () => new Date().toISOString().slice(0, 10) // YYYY-MM-DD
    );
    const [reason, setReason] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [message, setMessage] = useState<{ type: 'error' | 'success'; text: string } | null>(null);

    // reset when opened
    useEffect(() => {
        if (open) {
            setReason('');
            setTerminationDate(new Date().toISOString().slice(0, 10));
            setMessage(null);
            setSubmitting(false);
        }
    }, [open]);

    // Escape key closes modal
    useEffect(() => {
        function onKey(e: KeyboardEvent) {
            if (e.key === 'Escape' && open) onClose();
        }
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [open, onClose]);

    if (!open) return null;

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setMessage(null);

        // simple client validation
        if (!reason.trim()) {
            setMessage({ type: 'error', text: 'Please enter a reason.' });
            return;
        }
        if (!terminationDate) {
            setMessage({ type: 'error', text: 'Please select a termination date.' });
            return;
        }

        const payload = {
            user: user.id,
            reason: reason.trim(),
            termination_date: terminationDate,
        };

        setSubmitting(true);
        EmployeeServices.TerminateEmployee(payload)
            .then(() => {
                // close after a short delay so user sees success
                toast.success('employee terminated Succussfully', { duration: 4000 });
                onSuccess?.();
                onClose();
            })
            .catch((e) => {
                toast.error(e.message || 'error terminating employee');
            })
            .finally(() => {
                setSubmitting(false);
            });
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center" aria-modal="true" role="dialog" aria-labelledby="terminate-title">
            {/* overlay */}
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} aria-hidden="true" />

            <div className="relative w-full max-w-md mx-4">
                <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
                    <div className="px-6 pt-6 pb-4 border-b">
                        <div className="flex items-start justify-between gap-4">
                            <div>
                                <h3 id="terminate-title" className="flex items-center gap-3 text-lg font-semibold">
                                    <span className="w-9 h-9 rounded-lg bg-gradient-to-br from-red-500 to-pink-500 flex items-center justify-center text-white">!</span>
                                    Terminate Employee {`(${user.name})`}
                                </h3>
                                <p className="text-sm text-slate-500 mt-1">Provide termination date and a short reason.</p>
                            </div>

                            <button onClick={onClose} aria-label="Close" className="rounded-lg p-2 hover:bg-slate-100" type="button">
                                ✕
                            </button>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="p-6 bg-white">
                        <input type="hidden" name="user" value={user.id} />

                        <div className="mb-4">
                            <label htmlFor="termination_date" className="block text-sm font-medium text-slate-700 mb-1">
                                Termination date
                            </label>
                            <input
                                id="termination_date"
                                type="date"
                                value={terminationDate}
                                onChange={(e) => setTerminationDate(e.target.value)}
                                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-300"
                                required
                            />
                        </div>

                        <div className="mb-3">
                            <label htmlFor="reason" className="block text-sm font-medium text-slate-700 mb-1">
                                Reason
                            </label>
                            <textarea
                                id="reason"
                                value={reason}
                                onChange={(e) => setReason(e.target.value)}
                                placeholder="Short reason (required)"
                                rows={4}
                                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-300 resize-y"
                                required
                            />
                        </div>

                        {message && (
                            <div className={`mb-3 text-sm ${message.type === 'error' ? 'text-red-600' : 'text-green-700'}`} role="status" aria-live="polite">
                                {message.text}
                            </div>
                        )}

                        <div className="flex items-center justify-end gap-3 mt-4">
                            <button type="button" onClick={onClose} className="px-3 py-2 rounded-md text-slate-700 border border-slate-200 hover:bg-slate-50" disabled={submitting}>
                                Cancel
                            </button>

                            <button
                                type="submit"
                                disabled={submitting}
                                className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-red-600 to-pink-500 text-white font-semibold shadow ${
                                    submitting ? 'opacity-70 cursor-wait' : ''
                                }`}
                            >
                                {submitting ? 'Terminating…' : 'Terminate'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
