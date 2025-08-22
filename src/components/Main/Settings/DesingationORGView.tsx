import React, { useEffect, useState, useMemo } from 'react';
import { Edit, Trash2, ChevronDown, ChevronRight, Users, Crown } from 'lucide-react';
import Swal from 'sweetalert2';
import SettingServices from '../../../services/SettingServices';
import toast from 'react-hot-toast';
import { DesignationType } from '../../../constantTypes/CompanySetupTypes';

interface OrgChartProps {
    data: DesignationType[]; // Filtered data from parent (searchResults)
    filter: string; // Department filter from parent
    onEdit: (node: DesignationType) => void;
    onDelete: (node: DesignationType) => void;
    searchQuery?: string; // Optional search for highlight
}

const OrgNode: React.FC<{
    node: DesignationType;
    depth?: number;
    expanded: Set<string>;
    toggle: (id: string) => void;
    onEdit: (node: DesignationType) => void;
    onDelete: (node: DesignationType) => void;
    searchQuery?: string;
}> = ({ node, depth = 0, expanded, toggle, onEdit, onDelete, searchQuery = '' }) => {
    const hasChildren = !!node.children && node.children.length > 0;
    const isOpen = expanded.has(node.id);
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
        <div className="flex flex-col items-center relative py-4">
            {' '}
            {/* Increased vertical padding */}
            {/* Node Card */}
            <div className="relative group z-10 w-48">
                {' '}
                {/* Fixed width for alignment */}
                <div className="p-3 rounded-xl shadow-md bg-gradient-to-r from-purple-500 to-indigo-500 text-white text-center transform transition-all hover:scale-105">
                    <div className="text-sm font-semibold">{highlightedTitle()}</div>
                    <div className="text-xs opacity-80 mt-1">{node.department || 'No Department'}</div>
                    <div className="flex items-center justify-center gap-1 text-xs mt-1">
                        <Users className="w-3 h-3" />
                        {node.employees} employees
                    </div>
                </div>
                {/* Hover Actions */}
                <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => onEdit(node)} className="p-1 bg-white/20 rounded-full hover:bg-white/30">
                        <Edit className="w-3 h-3" />
                    </button>
                    <button onClick={() => onDelete(node)} className="p-1 bg-white/20 rounded-full hover:bg-white/30">
                        <Trash2 className="w-3 h-3 text-red-300" />
                    </button>
                </div>
                {/* Toggle Button */}
                {hasChildren && (
                    <button
                        onClick={() => toggle(node.id)}
                        className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 bg-white rounded-full p-1 shadow-md hover:shadow-lg transition-shadow z-20"
                    >
                        {isOpen ? <ChevronDown className="w-4 h-4 text-indigo-600" /> : <ChevronRight className="w-4 h-4 text-indigo-600" />}
                    </button>
                )}
            </div>
            {/* Children */}
            {hasChildren && isOpen && (
                <div className="relative flex justify-center w-full mt-12">
                    {' '}
                    {/* Increased mt for vertical space */}
                    {/* Vertical Connector from Parent */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-0.5 h-8 bg-indigo-300"></div> {/* Shorter vertical to horizontal */}
                    {/* Horizontal Connector Bar */}
                    <div className="absolute top-8 left-0 right-0 h-0.5 bg-indigo-300" style={{ width: `${node.children && node?.children?.length * 192}px` }} /> {/* 192 = 48 padding + 144 node */}
                    <div className="flex justify-around w-full">
                        {node.children!.map((child, index) => (
                            <div key={child.id} className="relative flex-1 min-w-[192px]">
                                {' '}
                                {/* Min width for horizontal spacing */}
                                {/* Vertical Drop to Child */}
                                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-0.5 h-8 bg-indigo-300"></div> {/* Connect to child */}
                                <OrgNode node={child} depth={depth + 1} expanded={expanded} toggle={toggle} onEdit={onEdit} onDelete={onDelete} searchQuery={searchQuery} />
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

const DesingationORGView: React.FC<OrgChartProps> = ({ data, filter, onEdit, onDelete, searchQuery }) => {
    const [expanded, setExpanded] = useState<Set<string>>(new Set());

    // Auto-expand all on mount
    useEffect(() => {
        if (!data) return;
        const allExpandable = new Set<string>();
        const collectExpandable = (nodes: DesignationType[]) => {
            nodes.forEach((n) => {
                if (n.children && n.children.length > 0) {
                    allExpandable.add(n.id);
                }
                if (n.children) collectExpandable(n.children);
            });
        };
        collectExpandable(data);
        setExpanded(allExpandable);
    }, [data]);

    // Filter by department if not 'All Departments'
    const filteredData = useMemo(() => {
        if (filter === 'All Departments') return data;
        const keep = (nodes: DesignationType[]): DesignationType[] => {
            return nodes
                .map((n) => {
                    const childMatches = n.children ? keep(n.children) : [];
                    const isMatch = n.department?.toLowerCase() === filter.toLowerCase() || childMatches.length > 0;
                    if (isMatch) {
                        return { ...n, children: childMatches.length ? childMatches : n.children };
                    }
                    return null;
                })
                .filter(Boolean) as DesignationType[];
        };
        return keep(data);
    }, [data, filter]);

    const toggle = (id: string) => {
        setExpanded((prev) => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return next;
        });
    };

    return (
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-indigo-50 overflow-auto max-h-[70vh]">
            {' '}
            {/* Added overflow-auto and max-height for scrolling */}
            <div className="flex flex-col items-center min-w-max">
                {filteredData.map((root) => (
                    <OrgNode key={root.id} node={root} expanded={expanded} toggle={toggle} onEdit={onEdit} onDelete={onDelete} searchQuery={searchQuery} />
                ))}
            </div>
        </div>
    );
};

export default DesingationORGView;
