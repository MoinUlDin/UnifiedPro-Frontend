// SystemMetricModal.tsx
import React, { useEffect, useMemo, useState } from 'react';
import { X, Save, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import EvaluationServices from '../../../../services/EvaluationServices';

type Department = {
    id: number;
    name: string;
};

type Company = {
    id: number;
    name: string;
};

type SystemMetric = {
    id?: number;
    company?: Company | number;
    department?: Department | null;
    manager?: number;
    attendence?: number;
    tasks?: number;
};

type Props = {
    open: boolean;
    onClose: () => void;
    onSuccess?: () => void;
    initialData?: SystemMetric;
    departments?: Department[];
};

export default function SystemMetricPopup({ open, onClose, onSuccess, initialData, departments = [] }: Props) {
    const isEditing = Boolean(initialData && initialData.id);

    // department selection stores id or '' for company-wide
    const [deptId, setDeptId] = useState<number | ''>(initialData?.department ? (initialData.department as Department).id : '');
    const [manager, setManager] = useState<number | ''>(initialData?.manager ?? '');
    const [tasks, setTasks] = useState<number | ''>(initialData?.tasks ?? '');
    const [attendence, setAttendence] = useState<number | ''>(initialData?.attendence ?? '');
    const [submitting, setSubmitting] = useState(false);
    const [deleting, setDeleting] = useState(false);

    useEffect(() => {
        if (!open) return;
        setDeptId(initialData?.department ? (initialData.department as Department).id : '');
        setManager(initialData?.manager ?? '');
        setTasks(initialData?.tasks ?? '');
        setAttendence(initialData?.attendence ?? '');
    }, [open, initialData]);

    const totalWeight = useMemo(() => {
        const m = typeof manager === 'number' ? manager : Number(manager || 0);
        const t = typeof tasks === 'number' ? tasks : Number(tasks || 0);
        const a = typeof attendence === 'number' ? attendence : Number(attendence || 0);
        return m + t + a;
    }, [manager, tasks, attendence]);

    const validate = () => {
        const err: string[] = [];
        if (Number.isNaN(Number(manager))) err.push('Manager must be a number');
        if (Number.isNaN(Number(tasks))) err.push('Tasks must be a number');
        if (Number.isNaN(Number(attendence))) err.push('Attendance must be a number');
        if (totalWeight <= 0) err.push('Total weight must be greater than 0');
        return err;
    };

    const handleSubmit = async () => {
        const errs = validate();
        if (errs.length > 0) {
            toast.error(errs[0]);
            return;
        }
        setSubmitting(true);

        const payload: any = {
            manager: Number(manager || 0),
            attendence: Number(attendence || 0),
            tasks: Number(tasks || 0),
        };
        // include department id only if chosen
        if (deptId !== '' && deptId !== null) payload.department = Number(deptId);

        try {
            if (isEditing && initialData && initialData.id) {
                await EvaluationServices.updateSystemMatrix(initialData.id, payload);
                toast.success('Updated');
            } else {
                await EvaluationServices.createSystemMatrix(payload);
                toast.success('Created');
            }
            onSuccess?.();
        } catch (e: any) {
            console.error('Save failed', e);
            const msg = e?.response?.data?.attendence || e?.response?.data?.tasks || e?.response?.data?.manager || e?.response?.data?.non_field_errors || e?.response?.data?.detail || 'Save failed';
            toast.error(msg);
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async () => {
        if (!isEditing || !initialData?.id) return;
        if (!confirm('Permanently delete this system metric config?')) return;
        setDeleting(true);
        try {
            await EvaluationServices.deleteSystemMatrix(initialData.id);
            toast.success('Deleted');
            onSuccess?.();
        } catch (e) {
            console.error('Delete failed', e);
            toast.error('Delete failed');
        } finally {
            setDeleting(false);
        }
    };

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
                className="absolute inset-0 bg-black/40"
                onClick={() => {
                    if (!submitting && !deleting) onClose();
                }}
            />

            <div className="relative w-full max-w-2xl bg-white rounded-lg shadow-lg z-10">
                <div className="px-6 py-4 border-b flex items-center justify-between">
                    <div>
                        <h3 className="text-lg font-semibold">{isEditing ? 'Edit System Metric' : 'Create System Metric'}</h3>
                        <div className="text-sm text-gray-500">{isEditing ? 'Modify settings for this scope' : 'Create company or department level metrics'}</div>
                    </div>

                    <div className="flex items-center gap-2">
                        {isEditing && (
                            <button className="px-3 py-1 text-sm rounded border text-red-600 hover:bg-red-50" onClick={handleDelete} disabled={deleting}>
                                {deleting ? (
                                    'Deleting…'
                                ) : (
                                    <>
                                        <Trash2 className="inline w-4 h-4 mr-2" /> Delete
                                    </>
                                )}
                            </button>
                        )}

                        <button
                            className="p-2 rounded hover:bg-gray-100"
                            onClick={() => {
                                if (!submitting && !deleting) onClose();
                            }}
                            title="Close"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                <div className="px-6 py-6 space-y-4">
                    <div>
                        <label className="text-sm text-gray-700 block mb-1">Department (optional)</label>
                        <select
                            className="w-full border rounded px-3 py-2 text-sm bg-white"
                            value={deptId === '' ? '' : String(deptId)}
                            onChange={(e) => setDeptId(e.target.value === '' ? '' : Number(e.target.value))}
                        >
                            <option value="">Company-wide (no department)</option>
                            {departments.map((d) => (
                                <option key={d.id} value={d.id}>
                                    {d.name}
                                </option>
                            ))}
                        </select>
                        <p className="text-xs text-gray-400 mt-1">
                            If no department selected this matrix applies company-wide. Create a department-level matrix to override company-level weights for that department.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div>
                            <label className="text-sm text-gray-700 block mb-1">Manager</label>
                            <input
                                type="number"
                                min={0}
                                className="w-full border rounded px-3 py-2 text-sm"
                                value={manager === '' ? '' : String(manager)}
                                onChange={(e) => setManager(e.target.value === '' ? '' : Number(e.target.value))}
                            />
                        </div>

                        <div>
                            <label className="text-sm text-gray-700 block mb-1">Tasks</label>
                            <input
                                type="number"
                                min={0}
                                className="w-full border rounded px-3 py-2 text-sm"
                                value={tasks === '' ? '' : String(tasks)}
                                onChange={(e) => setTasks(e.target.value === '' ? '' : Number(e.target.value))}
                            />
                        </div>

                        <div>
                            <label className="text-sm text-gray-700 block mb-1">Attendance</label>
                            <input
                                type="number"
                                min={0}
                                className="w-full border rounded px-3 py-2 text-sm"
                                value={attendence === '' ? '' : String(attendence)}
                                onChange={(e) => setAttendence(e.target.value === '' ? '' : Number(e.target.value))}
                            />
                        </div>
                    </div>

                    <div className="bg-gray-50 border rounded p-3 text-sm">
                        <div className="flex items-center justify-between">
                            <div className="text-sm text-gray-600">Total weight</div>
                            <div className="font-semibold">{totalWeight}</div>
                        </div>
                        <div className="text-xs text-gray-500 mt-2">Make sure total weight &gt; 0. We compute component percentages from these weights for display.</div>
                    </div>
                </div>

                <div className="px-6 py-4 border-t flex items-center gap-3">
                    <div className="flex-1" />
                    <button
                        className="px-4 py-2 rounded border bg-white text-sm"
                        onClick={() => {
                            if (!submitting && !deleting) onClose();
                        }}
                        disabled={submitting}
                    >
                        Cancel
                    </button>
                    <button className="px-4 py-2 rounded bg-black text-white text-sm flex items-center gap-2" onClick={handleSubmit} disabled={submitting}>
                        <Save className="w-4 h-4" />
                        {submitting ? (isEditing ? 'Updating…' : 'Creating…') : isEditing ? 'Update' : 'Create'}
                    </button>
                </div>
            </div>
        </div>
    );
}
