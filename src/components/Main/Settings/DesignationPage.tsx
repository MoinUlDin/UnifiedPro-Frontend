import React, { useEffect, Fragment, useMemo, useState } from 'react';
import {
    Building2,
    Users,
    Plus,
    Edit,
    Trash2,
    ChevronDown,
    ChevronRight,
    GitBranch,
    Crown,
    User,
    Search,
    Filter,
    MoreVertical,
    Move,
    Sparkles,
    Network,
    TreePine,
    Layers,
    Target,
    UserPlus,
    Settings,
    Eye,
    MapPin,
    Table,
} from 'lucide-react';
import SettingServices from '../../../services/SettingServices';
import toast from 'react-hot-toast';
import { DesignationFormType } from '../../../constantTypes/CompanySetupTypes';
import { Dialog, Transition } from '@headlessui/react';
import FormComponent, { FormField } from '../Common_Popup';
import Create_Design from './Designation';
import DesignationForm from './DesignationForm';
import Swal from 'sweetalert2';
import DesingationORGView from './DesingationORGView';
import OrgChartView from './OrgChartView';
import { DesignationType } from '../../../constantTypes/CompanySetupTypes';

const StatCard: React.FC<{ title: string; value: number; gradient: string }> = ({ title, value, gradient }) => (
    <div className={`p-5 rounded-2xl shadow-md text-white ${gradient}`}>
        <div className="text-sm opacity-90">{title}</div>
        <div className="text-3xl font-extrabold mt-3">{value}</div>
    </div>
);

const DeptBadge: React.FC<{ text?: string | null }> = ({ text }) => {
    if (!text) return null;
    const color = text.toLowerCase() === 'engineering' ? 'bg-blue-100 text-blue-800' : text.toLowerCase() === 'marketing' ? 'bg-green-100 text-green-800' : 'bg-purple-100 text-purple-800';
    return <span className={`ml-3 inline-flex items-center text-xs font-medium px-2 py-1 rounded-full ${color} border`}>{text}</span>;
};

const ActionIconButton: React.FC<{ onClick?: () => void; title?: string; children?: React.ReactNode }> = ({ onClick, title, children }) => (
    <button title={title} onClick={onClick} className="p-1 rounded-md hover:bg-gray-100 transition-all text-gray-600">
        {children}
    </button>
);

/* ---------------------------- Tree node component ----------------------------- */

const TreeNode: React.FC<{
    node: DesignationType;
    depth?: number;
    expanded: Set<string>;
    toggle: (id: string) => void;
    hoverId: string | null;
    setHoverId: (id: string | null) => void;
    onEdit: (node: DesignationType) => void;
    onDelete: (node: DesignationType) => void;
    searchQuery?: string; // New: pass search for highlight
}> = ({ node, depth = 0, expanded, toggle, hoverId, setHoverId, onEdit, onDelete, searchQuery = '' }) => {
    const hasChildren = !!node.children && node.children.length > 0;
    const isRoot = node.root;
    const isOpen = expanded.has(node.id!);
    const q = searchQuery.toLowerCase();

    // Highlight matching text in title
    const highlightedTitle = () => {
        if (!q) return node.title;
        const parts = node.title.toLowerCase().split(q);
        if (parts.length === 1) return node.title;
        const original = node.title.split('');
        let highlighted = '';
        let idx = 0;
        parts.forEach((part, i) => {
            highlighted += original.slice(idx, idx + part.length).join('');
            idx += part.length;
            if (i < parts.length - 1) {
                const match = original.slice(idx, idx + q.length).join('');
                highlighted += `<span class="bg-yellow-200 text-yellow-800">${match}</span>`;
                idx += q.length;
            }
        });
        return <span dangerouslySetInnerHTML={{ __html: highlighted }} />;
    };

    return (
        <div className="relative">
            <div
                className={`flex items-center gap-3 p-3 ${!isRoot && 'border-l-2 border-amber-400'}   hover:bg-gray-50 transition-colors group`}
                style={{ marginLeft: depth * 24 }}
                onMouseEnter={() => setHoverId(node.id!)}
                onMouseLeave={() => setHoverId(null)}
            >
                {/* vertical connector + toggle */}
                <div className="w-6 flex items-center justify-center">
                    {hasChildren ? (
                        <button onClick={() => toggle(node.id!)} className="p-1 rounded-full hover:bg-gray-100">
                            {isOpen ? <ChevronDown className="w-4 h-4 text-gray-600" /> : <ChevronRight className="w-4 h-4 text-gray-600" />}
                        </button>
                    ) : (
                        <div className="w-4 h-4" />
                    )}
                </div>

                {/* icon */}
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-600 to-indigo-500 text-white flex items-center justify-center text-sm font-semibold">
                    {node.title
                        .split(' ')
                        .map((s) => s[0])
                        .slice(0, 2)
                        .join('')}
                </div>

                {/* content */}
                <div className="flex-1 flex items-center justify-between">
                    <div>
                        <div className="flex items-center">
                            <div className="text-sm font-semibold text-gray-800">{highlightedTitle()}</div>
                            <DeptBadge text={node.department} />
                            <div className="ml-3 text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">{node.employees} employees</div>
                        </div>
                    </div>

                    {/* hover action icons */}
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

            {/* children */}
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
                            searchQuery={searchQuery} // Pass down for highlight
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

/* -------------------------- Main page component -------------------------- */

const DesignationPage: React.FC = () => {
    const [data, setData] = useState<DesignationType[]>();
    const [expanded, setExpanded] = useState<Set<string>>(new Set()); // Start empty
    const [hoverId, setHoverId] = useState<string | null>(null);
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState('All Departments');
    const [activeView, setActiveView] = useState<number>(1);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [currentEditId, setCurrentEditId] = useState<number | null>(null);
    const [openConfirmActionModel, setOpenConfirmActionModel] = useState(false);
    const initialFormData = { name: '', department: '', parent: null as number | null };
    const [formData, setFormData] = useState<any>(initialFormData);
    const [departments, setDepartments] = useState<{ value: number; label: string }[]>([]);

    const formFields: FormField[] = [
        { id: 'name', label: 'Designation Name', type: 'text', value: formData?.name },
        {
            id: 'department',
            label: 'Department',
            type: 'select',
            options: departments,
            value: formData.department,
        },
    ];

    // fetch Designations Tree
    const FetchDesignations = () => {
        SettingServices.fetchDesignationTree()
            .then((r) => {
                setData(r);
                console.log('orignal Data: ', r);
            })
            .catch((e) => {
                toast.error(e.message);
            });
    };

    useEffect(() => {
        FetchDesignations();
    }, []);

    // Auto-expand all on mount (after data fetch)
    useEffect(() => {
        if (!data) return;
        const allExpandable = new Set<string>();
        const collectExpandable = (nodes: DesignationType[]) => {
            nodes.forEach((n) => {
                if (n.children && n.children.length > 0) {
                    allExpandable.add(n.id!);
                }
                if (n.children) collectExpandable(n.children);
            });
        };
        collectExpandable(data);
        setExpanded(allExpandable);
    }, [data]);

    const totalDesignations = useMemo(() => {
        let count = 0;
        const traverse = (nodes?: DesignationType[]) => {
            if (!nodes) return;
            nodes.forEach((n) => {
                count++;
                traverse(n.children);
            });
        };
        traverse(data);
        return count;
    }, [data]);

    const totalWithDept = useMemo(() => {
        let count = 0;
        const traverse = (nodes?: DesignationType[]) => {
            if (!nodes) return;
            nodes.forEach((n) => {
                if (n.department) count++;
                traverse(n.children);
            });
        };
        traverse(data);
        return count;
    }, [data]);

    const totalEmployees = useMemo(() => {
        let count = 0;
        const traverse = (nodes?: DesignationType[]) => {
            if (!nodes) return;
            nodes.forEach((n) => {
                count += n.employees || 0;
                traverse(n.children);
            });
        };
        traverse(data);
        return count;
    }, [data]);

    const totalRoots = useMemo(() => data?.filter((d) => d.root).length, [data]);

    const toggle = (id: string) => {
        setExpanded((prev) => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return next;
        });
    };

    const flattenedList: DesignationType[] = useMemo(() => {
        const list: DesignationType[] = [];
        const f = (nodes?: DesignationType[]) => {
            if (!nodes) return;
            nodes.forEach((n) => {
                list.push(n);
                f(n.children);
            });
        };
        f(data);
        return list;
    }, [data]);

    useEffect(() => {
        if (!flattenedList) return;
        console.log('flattenedList: ', flattenedList);
    }, [flattenedList]);

    const searchResults = useMemo(() => {
        if (!search.trim()) return data;
        const q = search.toLowerCase();
        // Find matching nodes
        const matchedIds = new Set(flattenedList.filter((f) => f.title.toLowerCase().includes(q)).map((m) => m.id));

        // Build set of IDs to expand: ancestors of matches + matches with children
        const toExpand = new Set<string>();
        const parentMap = new Map<string, string>(); // childId -> parentId
        flattenedList.forEach((n) => {
            if (n.children) {
                n.children.forEach((c) => parentMap.set(c.id!, n.id!));
            }
        });

        matchedIds.forEach((matchId) => {
            let current = matchId;
            while (current) {
                toExpand.add(current);
                current = parentMap.get(current) || '';
            }
            // If match has children, expand it too
            const matchNode = flattenedList.find((f) => f.id === matchId);
            if (matchNode?.children?.length) toExpand.add(matchId!);
        });

        // Set expanded to include these
        setExpanded(toExpand);

        // Filter tree to keep matching subtrees (nodes that match or have matching descendants)
        const keep = (nodes: DesignationType[]): DesignationType[] => {
            return nodes
                .map((n) => {
                    const childMatches = n.children ? keep(n.children) : [];
                    const isMatchOrHasMatch = matchedIds.has(n.id) || childMatches.length > 0;
                    if (isMatchOrHasMatch) {
                        return { ...n, children: childMatches.length ? childMatches : n.children };
                    }
                    return null;
                })
                .filter(Boolean) as DesignationType[];
        };
        return keep(data!);
    }, [search, data, flattenedList]);

    const closeModal = () => {
        setIsModalOpen(false);
        setIsEditMode(false);
        setCurrentEditId(null);
    };
    const openModal = () => {
        setIsEditMode(false);
        setCurrentEditId(null);
        setFormData({
            department: null,
            name: null,
            parent: null,
        });
        setIsModalOpen(true);
    };
    const handleEdit = (node: DesignationType) => {
        console.log('node to build payload: ', node);

        setFormData({
            department: node.department_id,
            name: node.title,
            parent: node.parent,
        });

        setCurrentEditId(Number(node.id));
        setIsEditMode(true);
        setIsModalOpen(true);
    };

    const handleDelete = (node: DesignationType) => {
        const id = Number(node.id);
        console.log('node TO delete: ', node);
        Swal.fire({
            title: 'Are you sure?',
            text: `Do you really want to Delete this designation#${node.id}? This action is irreversible.`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, Delete',
            cancelButtonText: 'Cancel',
            timer: 8000,
            timerProgressBar: true,
            showCloseButton: true,
            reverseButtons: true,
        }).then((result) => {
            if (result.isConfirmed) {
                SettingServices.deleteDesignation(id)
                    .then(() => {
                        toast.success('Designation Deleted successfully', { duration: 4000 });
                        FetchDesignations();
                    })
                    .catch((e) => {
                        toast.error(e.message);
                    });
            }
        });
    };
    const handleAddOrEditDesignation = async (data: any) => {
        if (isEditMode && currentEditId) {
            await SettingServices.updateDesignation(currentEditId, data)
                .then(() => {
                    toast.success('Designation updated!');
                    SettingServices.fetchDesignations().then((fresh) => {
                        FetchDesignations();
                        closeModal();
                    });
                })
                .catch((e) => {
                    toast.error(e.message);
                });
        } else {
            await SettingServices.createDesignation(data)
                .then(() => {
                    toast.success('Designation created!');
                    SettingServices.fetchDesignations().then((fresh) => {
                        FetchDesignations();
                        closeModal();
                    });
                })
                .catch((e) => {
                    toast.error('Error completing your action');
                });
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 p-8">
            {/* Header */}
            <div className="max-w-7xl mx-auto">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h2 className="text-3xl font-extrabold text-purple-800">Designation Management</h2>
                        <p className="text-sm text-gray-500">Manage organizational hierarchy and designation structure</p>
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setActiveView(1)}
                            className={`${activeView === 1 && 'border-amber-500 shadow-lg'} px-2 py-1 text-[12px] rounded-md bg-white border hover:shadow-sm flex items-center gap-2 text-gray-700`}
                        >
                            <TreePine className="w-3 h-3" />
                            Hierarchy View
                        </button>
                        <button
                            onClick={() => setActiveView(2)}
                            className={`${activeView === 2 && 'border-amber-500 shadow-lg'} px-2 py-1 text-[12px] rounded-md bg-white border hover:shadow-sm flex items-center gap-2 text-gray-700}`}
                        >
                            <Network className="w-3 h-3" />
                            Org Chart
                        </button>
                        <button
                            onClick={() => setActiveView(3)}
                            className={`${activeView === 3 && 'border-amber-500 shadow-lg'} px-2 py-1 text-[12px] rounded-md bg-white border hover:shadow-sm flex items-center gap-2 text-gray-700}`}
                        >
                            <Table className="w-3 h-3" />
                            Classic View
                        </button>
                    </div>
                </div>
                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    <StatCard title="Total Designations" value={totalDesignations} gradient="from-blue-500 to-blue-400 bg-gradient-to-r" />
                    <StatCard title="With Department" value={totalWithDept} gradient="from-green-500 to-green-400 bg-gradient-to-r" />
                    <StatCard title="Total Employees" value={totalEmployees} gradient="from-purple-500 to-pink-500 bg-gradient-to-r" />
                    <StatCard title="Root Positions" value={totalRoots!} gradient="from-orange-500 to-red-500 bg-gradient-to-r" />
                </div>
                {/* Search & filter */}
                <div className="bg-white p-4 rounded-2xl shadow-md mb-6 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3 flex-1">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search designations..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-100 shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-300"
                            />
                        </div>

                        <select className="px-4 py-3 rounded-xl border border-gray-100" value={filter} onChange={(e) => setFilter(e.target.value)}>
                            <option>All Departments</option>
                            <option>Engineering</option>
                            <option>Sales</option>
                            <option>IT</option>
                        </select>
                    </div>

                    <div className="text-sm text-gray-500">
                        Showing {totalDesignations} of {totalDesignations} designations
                    </div>
                </div>
                <div className="mb-1 flex justify-end">
                    <button onClick={openModal} className="px-2 py-1 text-[12px] rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg flex items-center gap-2">
                        <Plus className="w-3 h-3" />
                        Add Designation
                    </button>
                </div>
                {activeView === 1 && (
                    <div>
                        {/* Tree card */}
                        <div className="bg-white p-6 rounded-2xl shadow-lg border border-indigo-50">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <Sparkles className="text-green-400 w-4 h-4" />
                                    <div className="text-sm font-medium text-gray-700">Designation Tree Structure</div>
                                </div>

                                <div className="flex items-center gap-2 text-sm text-gray-500">
                                    <div className="px-3 py-1 rounded-full bg-gray-50">
                                        Showing {totalDesignations} of {totalDesignations} designations
                                    </div>
                                </div>
                            </div>

                            <div className="divide-y">
                                {/* Render tree */}
                                {searchResults?.map((root) => (
                                    <div key={root.id} className="py-2">
                                        <TreeNode
                                            node={root}
                                            expanded={expanded}
                                            toggle={toggle}
                                            hoverId={hoverId}
                                            setHoverId={setHoverId}
                                            onEdit={handleEdit}
                                            onDelete={handleDelete}
                                            searchQuery={search} // Pass search for highlight
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
                {activeView === 2 && (
                    <OrgChartView
                        data={data} // raw tree OR filtered tree
                        search={search}
                        filterDepartment={filter}
                        onEdit={(n) => handleEdit(n)}
                        onDelete={(n) => handleDelete(n)}
                    />
                )}
                {activeView === 3 && (
                    <div>
                        <Create_Design />
                    </div>
                )}
            </div>
            {/* {activeView === 2 && <DesingationORGView data={searchResults!} filter={filter} onEdit={handleEdit} onDelete={handleDelete} searchQuery={search} />} */}
            {/* Create edit Designation */}
            <Transition appear show={isModalOpen} as={Fragment}>
                <Dialog as="div" className="relative z-50" onClose={closeModal}>
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
                                        {isEditMode ? 'Edit' : 'Add'} Designation
                                    </Dialog.Title>

                                    <div className="mt-2">
                                        <DesignationForm onSubmit={handleAddOrEditDesignation} onCancel={() => setIsModalOpen(false)} initialValues={formData} />
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

export default DesignationPage;
