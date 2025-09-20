// src/pages/Evaluation/FormVersionsAssignmentsPage.tsx
import React, { useEffect, useMemo, useState } from 'react';
import { FileText, Target, CheckCircle, Eye, Download, Search, Filter, BarChart3, Send, Users, Building2, Settings, Star } from 'lucide-react';
// import { DownloadCloud, Settings, Search, ChevronDown, Eye, PlusCircle, Filter, Users, Grid } from 'lucide-react';
import EvaluationServices from '../../../services/EvaluationServices';
import toast from 'react-hot-toast';
import { formatDateOnly, capitalizeName } from '../../../utils/Common';
import AssignmentPopup from './Popups/AssignmentPopup';

type Choice = { key: string; label: string };

type TemplateUser = {
    id: number;
    name: string;
};

type Question = {
    id: number | string;
    text: string;
    qtype?: string;
    weight?: number;
    required?: boolean;
    meta?: any;
};

type Template = {
    id: number;
    name: string;
    description?: string;
    created_by?: TemplateUser;
    created_at?: string;
    form_type?: string;
    default_visibility?: Record<string, boolean>;
    reusable?: boolean;
    questions?: Question[];
};

type Version = {
    id: number;
    template: Template;
    version_number: number;
    title?: string;
    snapshot?: Question[];
    created_at?: string;
};

export default function FormVersionsAssignmentsPage(): JSX.Element {
    const [loading, setLoading] = useState<boolean>(true);
    const [versions, setVersions] = useState<Version[]>([]);
    const [error, setError] = useState<string | null>(null);

    // UI state
    const [search, setSearch] = useState('');
    const [formTypeFilter, setFormTypeFilter] = useState<string>('all');
    const [onlyReusable, setOnlyReusable] = useState(false);

    // preview modal
    const [previewVersion, setPreviewVersion] = useState<Version | null>(null);
    // assignment modal
    const [openAssignPopup, setOpenAssignPopup] = useState<boolean>(false);
    const [initails, setInitails] = useState<any>(null);
    const [versionId, setVersionId] = useState<number | null>(null);
    const [assignVersion, setAssignVersion] = useState<Version | null>(null);

    // allowed form types (derive dynamically from data or fallback)
    const formTypes = useMemo<Choice[]>(() => {
        const types = Array.from(new Set(versions.map((v) => v.template?.form_type).filter(Boolean)));
        if (types.length === 0) {
            return [
                { key: 'self', label: 'Self' },
                { key: 'manager', label: 'Manager' },
                { key: '360', label: '360' },
                { key: 'employee_manager', label: 'Employee -> Manager' },
            ];
        }
        return types.map((t) => ({ key: t!, label: capitalizeName(t!) }));
    }, [versions]);

    useEffect(() => {
        let cancelled = false;
        setLoading(true);
        EvaluationServices.listVersions()
            .then((r: Version[]) => {
                if (cancelled) return;
                // ensure arrays
                const normalized = (r || []).map((x) => ({
                    ...x,
                    snapshot: x.snapshot || [],
                    template: { ...x.template, questions: x.template?.questions || [] },
                }));
                setVersions(normalized);
            })
            .catch((e: any) => {
                console.error(e);
                setError('Failed to load versions');
                toast.error('Failed to load form versions');
            })
            .finally(() => {
                if (!cancelled) setLoading(false);
            });
        return () => {
            cancelled = true;
        };
    }, []);

    // stats computed from versions payload
    const stats = useMemo(() => {
        const totalVersions = versions.length;
        const readyToAssign = versions.filter((v) => (v.snapshot?.length || 0) > 0).length;
        // fallback approximations from data:
        const uniqueCreators = new Set(versions.map((v) => v.template?.created_by?.id).filter(Boolean)).size;
        // departments/employees not provided in response; we approximate using counts from questions or creators
        const approxEmployees = Math.max(uniqueCreators * 3, 0); // just an approximation—replace when you have a real endpoint
        const approxDepartments = Math.max(Math.round(uniqueCreators / 2), 0);
        return { totalVersions, readyToAssign, approxEmployees, approxDepartments };
    }, [versions]);

    // filtered list
    const filtered = useMemo(() => {
        return versions.filter((v) => {
            const tmpl = v.template || ({} as Template);
            if (onlyReusable && !tmpl.reusable) return false;
            if (formTypeFilter !== 'all' && tmpl.form_type && tmpl.form_type !== formTypeFilter) return false;
            if (!search) return true;
            const q = search.toLowerCase();
            // search in template name, description, version title, questions texts
            if (tmpl.name?.toLowerCase().includes(q)) return true;
            if (tmpl.description?.toLowerCase().includes(q)) return true;
            if (v.title?.toLowerCase().includes(q)) return true;
            if (tmpl.created_by?.name?.toLowerCase().includes(q)) return true;
            const snapMatches = (v.snapshot || []).some((s) =>
                String(s.text || '')
                    .toLowerCase()
                    .includes(q)
            );
            if (snapMatches) return true;
            return false;
        });
    }, [versions, search, formTypeFilter, onlyReusable]);

    function openPreview(v: Version) {
        setPreviewVersion(v);
    }

    function openAssign(v: Version) {
        setVersionId(v.id);
        setInitails(null);
        setOpenAssignPopup(true);
    }

    // small UI components
    const StatCard = ({ label, value, icon }: { label: string; value: number | string; icon?: React.ReactNode }) => (
        <div className="bg-white rounded-xl p-4 shadow-sm flex items-center gap-4">
            <div className="rounded-md bg-slate-50 p-3">{icon}</div>
            <div>
                <div className="text-sm text-slate-500">{label}</div>
                <div className="text-lg font-semibold">{value}</div>
            </div>
        </div>
    );

    return (
        <div className="p-8 bg-slate-50 min-h-screen">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-2xl font-bold">Form Versions & Assignments</h1>
                        <p className="text-sm text-slate-500 mt-1">View all form versions and create assignments for evaluations</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <button className="flex items-center gap-2 px-3 py-2 bg-white border rounded-md shadow-sm text-sm">
                            <Download className="w-4 h-4" />
                            Export
                        </button>
                        <button className="flex items-center gap-2 px-3 py-2 bg-white border rounded-md shadow-sm text-sm">
                            <Settings className="w-4 h-4" />
                            Manage Templates
                        </button>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <StatCard label="Total Versions" value={stats.totalVersions} icon={<FileText className="w-5 h-5 text-sky-500" />} />
                    <StatCard label="Ready to Assign" value={stats.readyToAssign} icon={<Target className="w-5 h-5 text-emerald-500" />} />
                    <StatCard label="Available Employees" value={stats.approxEmployees} icon={<Users className="w-5 h-5 text-violet-500" />} />
                    <StatCard label="Departments" value={stats.approxDepartments} icon={<Building2 className="w-5 h-5 text-orange-400" />} />
                </div>

                {/* Search & Filters */}
                <div className="bg-white rounded-xl p-4 mb-6 shadow-sm">
                    <div className="flex gap-4 items-center">
                        <div className="flex items-center gap-2 flex-1">
                            <div className="relative w-full">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input
                                    placeholder="Search form versions..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="pl-10 pr-3 py-2 rounded-md border w-full focus:outline-none"
                                />
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="relative inline-block">
                                <select value={formTypeFilter} onChange={(e) => setFormTypeFilter(e.target.value)} className="form-input py-2 px-3 rounded-md border">
                                    <option value="all">All Form Types</option>
                                    {formTypes.map((ft) => (
                                        <option key={ft.key} value={ft.key}>
                                            {ft.label}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <button title="Filter" className={`px-3 py-2 rounded-md border bg-white ${onlyReusable ? 'ring-2 ring-indigo-200' : ''}`} onClick={() => setOnlyReusable((s) => !s)}>
                                <Filter className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* List */}
                <div className="space-y-6">
                    {loading && <div className="p-8 bg-white rounded-xl shadow text-center text-slate-500">Loading versions...</div>}

                    {!loading && filtered.length === 0 && <div className="p-8 bg-white rounded-xl shadow text-center text-slate-500">No versions found.</div>}

                    {!loading &&
                        filtered.map((v) => {
                            const tmpl = v.template || ({} as Template);
                            const qcount = (v.snapshot || []).length;
                            const previewQuestions = (v.snapshot || []).slice(0, 3);
                            const more = Math.max(0, qcount - 3);
                            return (
                                <div key={v.id} className="bg-white rounded-xl shadow p-6">
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1 pr-6">
                                            <div className="flex items-center gap-3">
                                                <h3 className="text-lg font-semibold">{tmpl.name}</h3>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-xs bg-slate-100 text-slate-700 px-2 py-1 rounded">{capitalizeName(tmpl.form_type || 'N/A')}</span>
                                                    <span className="text-xs bg-emerald-50 text-emerald-700 px-2 py-1 rounded">v{v.version_number}</span>
                                                    {tmpl.reusable && <span className="text-xs bg-indigo-50 text-indigo-700 px-2 py-1 rounded">Reusable</span>}
                                                </div>
                                            </div>

                                            <p className="text-sm text-slate-500 mt-2">{tmpl.description}</p>

                                            <div className="mt-3 text-xs text-slate-400">
                                                <span>
                                                    Created by: <strong className="text-slate-600">{tmpl.created_by?.name || '—'}</strong>
                                                </span>
                                                <span className="mx-2">•</span>
                                                <span>
                                                    Version: <strong className="text-slate-600">{v.title || `v${v.version_number}`}</strong>
                                                </span>
                                                <span className="mx-2">•</span>
                                                <span>
                                                    {qcount} question{qcount !== 1 ? 's' : ''}
                                                </span>
                                                <span className="mx-2">•</span>
                                                <span>Created: {formatDateOnly(v?.created_at!)}</span>
                                            </div>

                                            {/* Questions preview chips */}
                                            <h3 className="mt-6">Questions Preview</h3>
                                            <div className="mt-1 flex flex-wrap gap-2">
                                                {previewQuestions.map((t, i) => (
                                                    <div key={i} className="text-xs px-2 py-1 bg-slate-100 rounded-full flex items-center gap-2">
                                                        {t.qtype === 'bool' ? (
                                                            <CheckCircle size={12} />
                                                        ) : t.qtype === 'choice' ? (
                                                            <Star size={12} />
                                                        ) : t.qtype === 'rating' ? (
                                                            <BarChart3 size={12} />
                                                        ) : (
                                                            <FileText size={12} />
                                                        )}

                                                        {truncate(t.text, 28)}
                                                    </div>
                                                ))}
                                                {more > 0 && <div className="text-xs px-2 py-1 bg-slate-100 rounded-full">+{more} more</div>}
                                            </div>

                                            {/* default visibility chips */}
                                            {tmpl.default_visibility && (
                                                <div className="mt-4 text-xs text-slate-500 flex gap-2 items-center">
                                                    <span className="font-medium">Default Visibility</span>
                                                    {Object.keys(tmpl.default_visibility)
                                                        .filter((k) => tmpl.default_visibility?.[k])
                                                        .map((k) => (
                                                            <span key={k} className="text-xs border px-2 py-0.5 rounded-lg">
                                                                {prettyVisibilityKey(k)}
                                                            </span>
                                                        ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex flex-col gap-3 items-start pt-8 border-t mt-8">
                                        <div className="flex gap-2 text-[12px]">
                                            <button onClick={() => openPreview(v)} className="px-3 py-1 rounded-md border bg-white flex items-center gap-2">
                                                <Eye size={14} /> Preview
                                            </button>
                                            <button onClick={() => openAssign(v)} className="px-3 py-1 rounded-md bg-black text-white flex items-center gap-2 ">
                                                <Send size={14} />
                                                Create Assignment
                                            </button>
                                        </div>

                                        <div className="text-xs text-slate-400"> </div>
                                    </div>
                                </div>
                            );
                        })}
                </div>
            </div>

            {/* Preview Modal */}
            {previewVersion && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    <div className="absolute inset-0 bg-black/40" onClick={() => setPreviewVersion(null)} />
                    <div className="bg-white rounded-xl shadow-lg max-w-2xl w-full p-6 z-10">
                        <div className="flex items-start justify-between">
                            <div>
                                <h2 className="text-xl font-semibold">{previewVersion.template?.name}</h2>
                                <div className="text-xs text-slate-400">{previewVersion.title || `v${previewVersion.version_number}`}</div>
                            </div>
                            <button className="text-slate-500" onClick={() => setPreviewVersion(null)}>
                                Close
                            </button>
                        </div>

                        <p className="text-sm text-slate-600 mt-3">{previewVersion.template?.description}</p>

                        <div className="mt-4">
                            <h3 className="text-sm font-medium">Questions</h3>
                            <div className="mt-2 space-y-2">
                                {(previewVersion.snapshot || []).map((q, idx) => (
                                    <div key={q.id} className="p-3 border rounded-md bg-slate-50">
                                        <div className="flex justify-between">
                                            <div className="text-sm">{q.text}</div>
                                            <div className="text-xs text-slate-400">{q.qtype}</div>
                                        </div>
                                        {q.meta?.choices && <div className="mt-2 text-xs text-slate-500">Options: {(q.meta.choices || []).map((c: any) => c.label).join(', ')}</div>}
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="mt-6 flex justify-end gap-3">
                            <button className="px-4 py-2 border rounded" onClick={() => setPreviewVersion(null)}>
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {}
            <AssignmentPopup
                open={openAssignPopup}
                versionId={Number(versionId)}
                initial={initails}
                onClose={() => setOpenAssignPopup(false)}
                onSubmit={async (payload) => {
                    // call backend to create assignment (e.g. EvaluationServices.createAssignment(payload))
                    // await EvaluationServices.createAssignment(payload);
                    console.log('we recieved payload: ', payload);
                    setOpenAssignPopup(false);
                }}
            />
        </div>
    );

    // helpers
    function truncate(s?: string, n = 30) {
        if (!s) return '';
        return s.length > n ? s.slice(0, n - 1) + '…' : s;
    }

    function prettyVisibilityKey(k: string) {
        return k
            .replace(/^show_to_/, '')
            .split('_')
            .map((p) => capitalizeName(p))
            .join(' ');
    }
}
