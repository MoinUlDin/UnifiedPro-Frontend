// src/pages/DepartmentsPage.tsx
import React, { useEffect, Fragment, useMemo, useState } from 'react';
import { Search, Plus, TreePine, Network, Sparkles, Edit, Trash2, MoreVertical } from 'lucide-react';
import toast from 'react-hot-toast';
import OrgChartViewDept from './OrgChartViewDept';
import SettingServices from '../../../services/SettingServices';
import { Dialog, Transition } from '@headlessui/react';
import Swal from 'sweetalert2';
import { useDispatch } from 'react-redux';
import { AnyAction } from '@reduxjs/toolkit';
import { DeptNode } from '../../../constantTypes/CompanySetupTypes';

type DeptPayload = {
    id: number;
    name: string;
    expected_arrival_time?: string | null;
    parent: number | null;
    parent_name?: string | null;
    employees_count?: number;
};

function buildTree(flat: DeptPayload[]): DeptNode[] {
    const map = new Map<number, DeptNode>();
    flat.forEach((d) => {
        map.set(d.id, {
            id: d.id,
            title: d.name,
            parent: d.parent ?? null,
            parent_name: d.parent_name ?? null,
            expected_arrival_time: d.expected_arrival_time ?? null,
            department: d.name,
            department_id: d.id,
            employees_count: d.employees_count ?? 0,
            children: [],
            root: false,
        });
    });

    const roots: DeptNode[] = [];
    for (const node of map.values()) {
        if (node.parent == null) {
            node.root = true;
            roots.push(node);
        } else {
            const parentNode = map.get(node.parent as number);
            if (parentNode) {
                parentNode.children = parentNode.children ?? [];
                parentNode.children.push(node);
            } else {
                node.root = true;
                roots.push(node);
            }
        }
    }

    const sortRec = (nodes?: DeptNode[]) => {
        if (!nodes) return;
        nodes.sort((a, b) => String(a.title).localeCompare(String(b.title)));
        nodes.forEach((n) => sortRec(n.children));
    };
    sortRec(roots);

    return roots;
}

const DeptBadge: React.FC<{ text?: string | null }> = ({ text }) => {
    if (!text) return null;
    return <span className="ml-3 inline-flex items-center text-xs font-medium px-2 py-1 rounded-full bg-indigo-50 text-indigo-700 border">{text}</span>;
};

const ActionIconButton: React.FC<{ onClick?: () => void; title?: string; children?: React.ReactNode }> = ({ onClick, title, children }) => (
    <button title={title} onClick={onClick} className="p-1 rounded-md hover:bg-gray-100 transition-all text-gray-600">
        {children}
    </button>
);

/* Tree node component (same style as designation page) */
const TreeNode: React.FC<{
    node: DeptNode;
    depth?: number;
    expanded: Set<string>;
    toggle: (id: string) => void;
    hoverId: string | null;
    setHoverId: (id: string | null) => void;
    onEdit: (node: DeptNode) => void;
    onDelete: (node: DeptNode) => void;
    searchQuery?: string;
}> = ({ node, depth = 0, expanded, toggle, hoverId, setHoverId, onEdit, onDelete, searchQuery = '' }) => {
    const hasChildren = !!node.children && node.children.length > 0;
    const isRoot = !!node.root;
    const isOpen = expanded.has(String(node.id));
    const q = (searchQuery || '').toLowerCase();

    const highlightedTitle = () => {
        if (!q) return node.title;
        const lower = node.title.toLowerCase();
        const idx = lower.indexOf(q);
        if (idx === -1) return node.title;
        const before = node.title.slice(0, idx);
        const match = node.title.slice(idx, idx + q.length);
        const after = node.title.slice(idx + q.length);
        return (
            <>
                {before}
                <span className="bg-yellow-200 text-yellow-800 px-1 rounded-sm">{match}</span>
                {after}
            </>
        );
    };

    return (
        <div className="relative">
            <div
                className={`flex items-center gap-3 p-3 ${!isRoot ? 'border-l-2 border-amber-400' : ''} hover:bg-gray-50 transition-colors group`}
                style={{ marginLeft: depth * 24 }}
                onMouseEnter={() => setHoverId(String(node.id))}
                onMouseLeave={() => setHoverId(null)}
            >
                <div className="w-6 flex items-center justify-center">
                    {hasChildren ? (
                        <button onClick={() => toggle(String(node.id))} className="p-1 rounded-full hover:bg-gray-100">
                            {isOpen ? (
                                <svg className="w-4 h-4 text-gray-600" viewBox="0 0 24 24" fill="none">
                                    <path d="M6 9l6 6 6-6" />
                                </svg>
                            ) : (
                                <svg className="w-4 h-4 text-gray-600" viewBox="0 0 24 24" fill="none">
                                    <path d="M9 6l6 6-6 6" />
                                </svg>
                            )}
                        </button>
                    ) : (
                        <div className="w-4 h-4" />
                    )}
                </div>

                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 text-white flex items-center justify-center text-sm font-semibold">
                    {node.title
                        .split(' ')
                        .map((s) => s[0])
                        .slice(0, 2)
                        .join('')}
                </div>

                <div className="flex-1 flex items-center justify-between">
                    <div>
                        <div className="flex items-center">
                            <div className="text-sm font-semibold text-gray-800">{highlightedTitle()}</div>
                            <DeptBadge text={node.expected_arrival_time ? `Arrive: ${node.expected_arrival_time}` : node.parent_name ?? undefined} />
                            <div className="ml-3 text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">{node.employees_count ?? 0} employees</div>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <ActionIconButton title="Edit" onClick={() => onEdit(node)}>
                            <Edit className="w-4 h-4" />
                        </ActionIconButton>
                        <ActionIconButton title="Delete" onClick={() => onDelete(node)}>
                            <Trash2 className="w-4 h-4 text-red-500" />
                        </ActionIconButton>
                        <ActionIconButton title="More">
                            <MoreVertical className="w-4 h-4" />
                        </ActionIconButton>
                    </div>
                </div>
            </div>

            {hasChildren && isOpen && (
                <div>
                    {node.children!.map((child) => (
                        <TreeNode
                            key={child.id}
                            node={child}
                            depth={depth + 1}
                            expanded={expanded}
                            toggle={toggle}
                            hoverId={hoverId}
                            setHoverId={setHoverId}
                            onEdit={onEdit}
                            onDelete={onDelete}
                            searchQuery={searchQuery}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

const DepartmentsPage: React.FC = () => {
    const [departments, setDepartments] = useState<DeptPayload[] | null>(null);
    const [tree, setTree] = useState<DeptNode[] | null>(null);
    const [search, setSearch] = useState('');
    const [activeView, setActiveView] = useState<number>(1); // 1 = tree, 2 = org
    const [loading, setLoading] = useState(false);
    const [expanded, setExpanded] = useState<Set<string>>(new Set());
    const [hoverId, setHoverId] = useState<string | null>(null);

    // modal state for add/edit
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [currentEdit, setCurrentEdit] = useState<DeptPayload | null>(null);

    const dispatch = useDispatch();

    useEffect(() => {
        fetchDepartments();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const fetchDepartments = () => {
        setLoading(true);
        SettingServices.fetchDepartments(dispatch)
            .then((res: DeptPayload[]) => {
                setDepartments(res);
                setTree(buildTree(res));
            })
            .catch((e: any) => {
                console.error(e);
                toast.error(e?.message || 'Failed to fetch departments');
            })
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        if (!departments) return;
        setTree(buildTree(departments));
    }, [departments]);

    // auto expand all on load (for tree and org)
    useEffect(() => {
        if (!tree) return;
        const all = new Set<string>();
        const collect = (nodes?: DeptNode[]) => {
            if (!nodes) return;
            nodes.forEach((n) => {
                if (n.children && n.children.length > 0) all.add(String(n.id));
                if (n.children) collect(n.children);
            });
        };
        collect(tree);
        setExpanded(all);
    }, [tree]);

    const totalDepartments = useMemo(() => departments?.length ?? 0, [departments]);
    const totalRoots = useMemo(() => tree?.filter((d) => d.root).length ?? 0, [tree]);
    const totalWithParent = useMemo(() => (departments ? departments.filter((d) => d.parent != null).length : 0), [departments]);

    // flattened list for selects / search
    const flattened = useMemo(() => {
        const out: DeptNode[] = [];
        const walk = (nodes?: DeptNode[]) => {
            if (!nodes) return;
            nodes.forEach((n) => {
                out.push(n);
                if (n.children) walk(n.children);
            });
        };
        walk(tree ?? []);
        return out;
    }, [tree]);

    // searchResults for Tree view: keep matching subtrees and expand ancestors
    const searchResults = useMemo(() => {
        if (!tree) return tree;
        if (!search.trim()) return tree;
        const q = search.toLowerCase();
        const flat: DeptNode[] = [];
        const buildFlat = (nodes?: DeptNode[]) => {
            if (!nodes) return;
            nodes.forEach((n) => {
                flat.push(n);
                if (n.children) buildFlat(n.children);
            });
        };
        buildFlat(tree);
        const matchedIds = new Set(flat.filter((f) => f.title.toLowerCase().includes(q)).map((m) => String(m.id)));
        if (matchedIds.size === 0) return [];
        // parent map
        const parentMap = new Map<string, string>();
        flat.forEach((n) => {
            if (n.children) n.children.forEach((c) => parentMap.set(String(c.id), String(n.id)));
        });
        const toExpand = new Set<string>();
        matchedIds.forEach((id) => {
            let cur = id;
            while (cur) {
                toExpand.add(cur);
                cur = parentMap.get(cur) || '';
            }
        });
        setExpanded(toExpand);

        const keep = (nodes: DeptNode[]): DeptNode[] =>
            nodes
                .map((n) => {
                    const childMatches = n.children ? keep(n.children) : [];
                    if (matchedIds.has(String(n.id)) || childMatches.length) {
                        return { ...n, children: childMatches.length ? childMatches : n.children };
                    }
                    return null;
                })
                .filter(Boolean) as DeptNode[];

        return keep(tree);
    }, [search, tree]);

    const toggle = (id: string) => {
        setExpanded((prev) => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return next;
        });
    };

    // edit / delete handlers (assume SettingServices provides corresponding methods)
    const openAddModal = () => {
        setIsEditMode(false);
        setCurrentEdit(null);
        setIsModalOpen(true);
    };

    const openEditModal = (n: DeptNode) => {
        setIsEditMode(true);
        setCurrentEdit({
            id: Number(n.id),
            name: n.title,
            expected_arrival_time: n.expected_arrival_time ?? null,
            parent: n.parent ?? null,
            parent_name: n.parent_name ?? null,
        });
        setIsModalOpen(true);
    };

    const handleDelete = (n: DeptNode) => {
        Swal.fire({
            title: 'Are you sure?',
            text: `Do you want to delete department "${n.title}"?`,
            icon: 'warning',
            showCancelButton: true,
        }).then((res) => {
            if (!res.isConfirmed) return;
            // call delete API
            SettingServices.DeleteDepartment(Number(n.id))
                .then(() => {
                    toast.success('Department deleted');
                    fetchDepartments();
                })
                .catch((e: AnyAction) => toast.error(e?.message || 'Delete failed'));
        });
    };

    const submitDepartment = async (payload: { id?: number; name: string; expected_arrival_time?: string | null; parent?: number | null }) => {
        try {
            if (isEditMode && payload.id) {
                await SettingServices.UpdateDepartment(payload.id, payload);
                toast.success('Department updated');
            } else {
                await SettingServices.AddDepartment(payload);
                toast.success('Department created');
            }
            setIsModalOpen(false);
            fetchDepartments();
        } catch (e: any) {
            toast.error(e?.message || 'Save failed');
        }
    };

    // simple form used inside modal
    const DepartmentForm: React.FC<{ initial?: DeptPayload | null; onCancel: () => void; onSubmit: (p: any) => void }> = ({ initial = null, onCancel, onSubmit }) => {
        const [name, setName] = useState(initial?.name ?? '');
        const [parent, setParent] = useState<number | ''>(initial?.parent ?? '');
        const [expected, setExpected] = useState(initial?.expected_arrival_time ?? '');

        return (
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    onSubmit({
                        id: initial?.id,
                        name: name.trim(),
                        parent: parent === '' ? null : Number(parent),
                        expected_arrival_time: expected || null,
                    });
                }}
            >
                <div className="space-y-4">
                    <div>
                        <label className="text-sm font-medium">Name</label>
                        <input value={name} onChange={(e) => setName(e.target.value)} className="form-input w-full mt-1 p-2 border rounded" />
                    </div>
                    <div>
                        <label className="text-sm font-medium">Parent</label>
                        <select value={parent} onChange={(e) => setParent(e.target.value === '' ? '' : Number(e.target.value))} className="form-input w-full mt-1 p-2 border rounded">
                            <option value="">— none —</option>
                            {flattened.map((f) => (
                                <option key={f.id} value={f.id}>
                                    {f.title}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="text-sm font-medium">Expected arrival time (HH:MM)</label>
                        <input value={expected ?? ''} onChange={(e) => setExpected(e.target.value)} placeholder="09:00:00" className="form-input w-full mt-1 p-2 border rounded" />
                    </div>

                    <div className="flex justify-end gap-3 pt-4">
                        <button type="button" onClick={onCancel} className="px-4 py-2 rounded border">
                            Cancel
                        </button>
                        <button type="submit" className="px-4 py-2 rounded bg-indigo-600 text-white">
                            {initial ? 'Update' : 'Create'}
                        </button>
                    </div>
                </div>
            </form>
        );
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 p-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h2 className="text-3xl font-extrabold text-purple-800">Department Management</h2>
                        <p className="text-sm text-gray-500">Manage departments and sub-departments</p>
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setActiveView(1)}
                            className={`${activeView === 1 ? 'border-amber-500 shadow-lg' : ''} px-2 py-1 text-[12px] rounded-md bg-white border hover:shadow-sm flex items-center gap-2 text-gray-700`}
                        >
                            <TreePine className="w-3 h-3" />
                            Tree View
                        </button>

                        <button
                            onClick={() => setActiveView(2)}
                            className={`${activeView === 2 ? 'border-amber-500 shadow-lg' : ''} px-2 py-1 text-[12px] rounded-md bg-white border hover:shadow-sm flex items-center gap-2 text-gray-700`}
                        >
                            <Network className="w-3 h-3" />
                            Org Chart
                        </button>

                        <button onClick={openAddModal} className="px-2 py-1 text-[12px] rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg flex items-center gap-2">
                            <Plus className="w-3 h-3" />
                            Add Department
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    <div className="p-5 rounded-2xl shadow-md text-white bg-blue-500">
                        <div className="text-sm opacity-90">Total Departments</div>
                        <div className="text-3xl font-extrabold mt-3">{totalDepartments}</div>
                    </div>
                    <div className="p-5 rounded-2xl shadow-md text-white bg-green-500">
                        <div className="text-sm opacity-90">With Parent</div>
                        <div className="text-3xl font-extrabold mt-3">{totalWithParent}</div>
                    </div>
                    <div className="p-5 rounded-2xl shadow-md text-white bg-indigo-500">
                        <div className="text-sm opacity-90">Root Departments</div>
                        <div className="text-3xl font-extrabold mt-3">{totalRoots}</div>
                    </div>
                    <div className="p-5 rounded-2xl shadow-md text-white bg-purple-500">
                        <div className="text-sm opacity-90">Search</div>
                        <div className="text-3xl font-extrabold mt-3">{search ? `"${search}"` : '—'}</div>
                    </div>
                </div>

                <div className="bg-white p-4 rounded-2xl shadow-md mb-6 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3 flex-1">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search departments..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-100 shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-300"
                            />
                        </div>
                    </div>

                    <div className="text-sm text-gray-500">{loading ? 'Loading...' : `${totalDepartments} departments`}</div>
                </div>

                {/* Tree view */}
                {activeView === 1 && (
                    <div className="bg-white p-6 rounded-2xl shadow-lg border border-indigo-50">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <Sparkles className="text-green-400 w-4 h-4" />
                                <div className="text-sm font-medium text-gray-700">Department Tree Structure</div>
                            </div>

                            <div className="flex items-center gap-2 text-sm text-gray-500">
                                <div className="px-3 py-1 rounded-full bg-gray-50">Showing {totalDepartments} departments</div>
                            </div>
                        </div>

                        <div className="divide-y">
                            {(search.trim() ? searchResults! : tree ?? []).map((root) => (
                                <div key={root.id} className="py-2">
                                    <TreeNode
                                        node={root}
                                        expanded={expanded}
                                        toggle={toggle}
                                        hoverId={hoverId}
                                        setHoverId={setHoverId}
                                        onEdit={(n) => openEditModal(n)}
                                        onDelete={(n) => handleDelete(n)}
                                        searchQuery={search}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Org chart view */}
                {activeView === 2 && (
                    <OrgChartViewDept
                        data={tree ?? []}
                        search={search}
                        // departments don't have a separate "department" filter here — OrgChartView can use `search`
                        onEdit={(n: DeptNode) => openEditModal(n)}
                        onDelete={(n: DeptNode) => handleDelete(n)}
                    />
                )}
            </div>

            {/* Create / Edit Department Modal */}
            <Transition appear show={isModalOpen} as={Fragment}>
                <Dialog as="div" className="relative z-50" onClose={() => setIsModalOpen(false)}>
                    <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
                        <div className="fixed inset-0 bg-black bg-opacity-25" />
                    </Transition.Child>

                    <div className="fixed inset-0 overflow-y-auto">
                        <div className="flex min-h-full items-center justify-center p-4 text-center">
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 scale-95"
                                enterTo="opacity-100 scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 scale-100"
                                leaveTo="opacity-0 scale-95"
                            >
                                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                                    <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">
                                        {isEditMode ? 'Edit Department' : 'Add Department'}
                                    </Dialog.Title>

                                    <div className="mt-4">
                                        <DepartmentForm initial={isEditMode && currentEdit ? currentEdit : null} onCancel={() => setIsModalOpen(false)} onSubmit={submitDepartment} />
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>
        </div>
    );
};

export default DepartmentsPage;
