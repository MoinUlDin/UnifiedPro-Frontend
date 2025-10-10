// SystemMetricsPage.tsx
import React, { useEffect, useState } from 'react';
import { Plus, Trash2, Edit, RefreshCw } from 'lucide-react';
import EvaluationServices from '../../../services/EvaluationServices';
import SettingServices from '../../../services/SettingServices';
import toast from 'react-hot-toast';
import SystemMetricPopup from './Popups/SystemMetricPopup';

type Department = {
    id: number;
    name: string;
};

type Company = {
    id: number;
    name: string;
};

type SystemMetric = {
    id: number;
    company: Company | number; // backend now returns company object
    department: Department | null;
    manager: number;
    attendence: number; // keep backend spelling
    tasks: number;
    updated_at?: string | null;
};

export default function SystemMetricsPage() {
    const [loading, setLoading] = useState(false);
    const [items, setItems] = useState<SystemMetric[]>([]);
    const [departments, setDepartments] = useState<Department[]>([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [editing, setEditing] = useState<SystemMetric | null>(null);
    const [refreshKey, setRefreshKey] = useState(0);
    const [deletingId, setDeletingId] = useState<number | null>(null);

    const fetchAll = async () => {
        setLoading(true);
        try {
            const res = await EvaluationServices.fetchAllSystemMatrix();
            setItems(res || []);
        } catch (e) {
            console.error('Failed to load system metrics', e);
            toast.error('Failed to load system metrics');
            setItems([]);
        } finally {
            setLoading(false);
        }
    };

    const fetchDepts = async () => {
        try {
            const r = await SettingServices.fetchParentDepartments();
            setDepartments(r || []);
        } catch (e) {
            console.error('Failed to load departments', e);
            setDepartments([]);
        }
    };

    useEffect(() => {
        fetchAll();
        fetchDepts();
    }, [refreshKey]);

    const openCreate = () => {
        setEditing(null);
        setModalOpen(true);
    };

    const openEdit = (row: SystemMetric) => {
        setEditing(row);
        setModalOpen(true);
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Delete this system metric configuration? This cannot be undone.')) return;
        setDeletingId(id);
        try {
            await EvaluationServices.deleteSystemMatrix(id);
            toast.success('Deleted');
            setRefreshKey((k) => k + 1);
        } catch (e) {
            console.error('Delete failed', e);
            toast.error('Failed to delete');
        } finally {
            setDeletingId(null);
        }
    };

    const humanWhen = (iso?: string | null) => {
        if (!iso) return '-';
        try {
            return new Date(iso).toLocaleString();
        } catch {
            return iso;
        }
    };

    const onModalSuccess = () => {
        setModalOpen(false);
        setEditing(null);
        setRefreshKey((k) => k + 1);
    };

    // compute percentages for a row
    const computePercents = (row: SystemMetric) => {
        const m = Number(row.manager || 0);
        const t = Number(row.tasks || 0);
        const a = Number(row.attendence || 0);
        const total = m + t + a;
        if (total <= 0) return { managerPct: 0, tasksPct: 0, attendPct: 0 };
        return {
            managerPct: Math.round((m / total) * 100),
            tasksPct: Math.round((t / total) * 100),
            attendPct: Math.round((a / total) * 100),
        };
    };

    return (
        <div className="p-6">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-semibold">System Metric Configurations</h1>
                    <p className="text-sm text-gray-500">Configure company-level or department-level system metric weights.</p>
                </div>

                <div className="flex items-center gap-3">
                    <button className="inline-flex items-center gap-2 px-4 py-2 rounded bg-white border text-sm hover:bg-gray-50" onClick={() => setRefreshKey((k) => k + 1)} title="Refresh">
                        <RefreshCw className="w-4 h-4" />
                        Refresh
                    </button>

                    <button className="inline-flex items-center gap-2 px-4 py-2 rounded bg-black text-white text-sm" onClick={openCreate}>
                        <Plus className="w-4 h-4" />
                        Create Matrix
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border p-4 mb-4">
                <div className="text-sm text-gray-600">
                    If <span className="font-medium">Department</span> is not selected, the matrix will be considered <span className="font-semibold">company-wide</span>. To have a different matrix
                    for a specific department create one for that department.
                </div>
            </div>

            <div className="bg-white rounded-lg shadow border overflow-x-auto">
                <table className="w-full min-w-[900px] table-auto">
                    <thead>
                        <tr className="text-left text-xs text-gray-500 border-b">
                            <th className="px-4 py-3">Company</th>
                            <th className="px-4 py-3">Scope</th>

                            <th className="px-4 py-3">Manager %</th>
                            <th className="px-4 py-3">Tasks %</th>
                            <th className="px-4 py-3">Attendance %</th>
                            <th className="px-4 py-3">Updated</th>
                            <th className="px-4 py-3">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading && (
                            <tr>
                                <td colSpan={10} className="px-4 py-8 text-center text-gray-500">
                                    Loading...
                                </td>
                            </tr>
                        )}

                        {!loading && items.length === 0 && (
                            <tr>
                                <td colSpan={10} className="px-4 py-8 text-center text-gray-500">
                                    No system metric configurations yet.
                                </td>
                            </tr>
                        )}

                        {!loading &&
                            items.map((it) => {
                                const p = computePercents(it);
                                const deptName = it.department ? (it.department as Department).name : null;
                                const companyName = typeof it.company === 'object' ? (it.company as Company).name : String(it.company);
                                return (
                                    <tr key={it.id} className="border-b hover:bg-gray-50">
                                        <td className="px-4 py-3">
                                            <div className="font-medium">{companyName}</div>
                                            <div className="text-xs text-gray-400">Company</div>
                                        </td>

                                        <td className="px-4 py-3">
                                            {deptName ? (
                                                <div className="flex flex-col">
                                                    <div className="font-medium">{deptName}</div>
                                                    <div className="text-xs text-gray-400">Department</div>
                                                </div>
                                            ) : (
                                                <div className="flex flex-col">
                                                    <div className="font-medium">Company-wide</div>
                                                    <div className="text-xs text-gray-400">No department</div>
                                                </div>
                                            )}
                                        </td>

                                        <td className="px-4 py-3">{p.managerPct}%</td>
                                        <td className="px-4 py-3">{p.tasksPct}%</td>
                                        <td className="px-4 py-3">{p.attendPct}%</td>

                                        <td className="px-4 py-3">{humanWhen(it.updated_at ?? null)}</td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-2">
                                                <button className="px-2 py-1 rounded border hover:bg-gray-50" onClick={() => openEdit(it)} title="Edit">
                                                    <Edit className="w-4 h-4" />
                                                </button>
                                                <button
                                                    className="px-2 py-1 rounded border hover:bg-red-50 text-red-600"
                                                    onClick={() => handleDelete(it.id)}
                                                    disabled={deletingId === it.id}
                                                    title="Delete"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                    </tbody>
                </table>
            </div>

            {modalOpen && (
                <SystemMetricPopup
                    open={modalOpen}
                    onClose={() => {
                        setModalOpen(false);
                        setEditing(null);
                    }}
                    onSuccess={onModalSuccess}
                    initialData={editing ?? undefined}
                    departments={departments}
                />
            )}
        </div>
    );
}
