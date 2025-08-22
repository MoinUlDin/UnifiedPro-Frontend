// src/components/OrgChartView.tsx
import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { ChevronDown, ChevronRight, Edit, Trash2 } from 'lucide-react';
import type { DesignationType } from '../../../constantTypes/CompanySetupTypes';

type Props = {
    data?: DesignationType[];
    search?: string;
    filterDepartment?: string | null;
    onEdit?: (node: DesignationType) => void;
    onDelete?: (node: DesignationType) => void;
    className?: string;
};

const PADDING = 25; // extra padding around content so nodes aren't flush with container edge

const OrgChartView: React.FC<Props> = ({ data = [], search = '', filterDepartment = null, onEdit, onDelete, className = '' }) => {
    const [expanded, setExpanded] = useState<Set<string>>(new Set());
    const [isMounted, setIsMounted] = useState(false);
    const nodeRefs = useRef<Map<string, HTMLElement>>(new Map());
    const containerRef = useRef<HTMLDivElement | null>(null);
    const svgRef = useRef<SVGSVGElement | null>(null);
    const contentWrapperRef = useRef<HTMLDivElement | null>(null);
    const resizeObserverRef = useRef<ResizeObserver | null>(null);

    // ---- helper to register node DOM elements ----
    const registerNode = (id: string, el: HTMLElement | null) => {
        if (!el) nodeRefs.current.delete(id);
        else nodeRefs.current.set(id, el);
    };

    // ---- department-filter: keep nodes that match department OR have matching descendants ----
    const filteredByDept = useMemo(() => {
        if (!data) return data;
        if (!filterDepartment || filterDepartment === 'All Departments') return data;

        const keep = (nodes: DesignationType[]): DesignationType[] =>
            nodes
                .map((n) => {
                    const childMatches = n.children ? keep(n.children) : [];
                    if ((n.department && n.department === filterDepartment) || childMatches.length) {
                        return { ...n, children: childMatches.length ? childMatches : n.children };
                    }
                    return null;
                })
                .filter(Boolean) as DesignationType[];

        return keep(data);
    }, [data, filterDepartment]);

    // ---- build id->node and parent map from department-filtered tree (so parent links exist for displayData) ----
    const { idToNode, parentMap } = useMemo(() => {
        const idToNode = new Map<string, DesignationType>();
        const parentMap = new Map<string, string>();
        const walk = (nodes?: DesignationType[], parentId?: string) => {
            if (!nodes) return;
            nodes.forEach((n) => {
                idToNode.set(String(n.id), n);
                if (parentId) parentMap.set(String(n.id), String(parentId));
                if (n.children) walk(n.children, String(n.id));
            });
        };
        walk(filteredByDept);
        return { idToNode, parentMap };
    }, [JSON.stringify(filteredByDept)]);

    // ---- search-filter: keep nodes that match search OR have descendant that matches (applied on top of dept-filter) ----
    const finalData = useMemo(() => {
        if (!filteredByDept) return filteredByDept;
        const q = (search || '').trim().toLowerCase();
        if (!q) return filteredByDept;

        // find matches in the dept-filtered flattened tree
        const flat: DesignationType[] = [];
        const buildFlat = (nodes?: DesignationType[]) => {
            if (!nodes) return;
            nodes.forEach((n) => {
                flat.push(n);
                if (n.children) buildFlat(n.children);
            });
        };
        buildFlat(filteredByDept);

        const matchedIds = new Set(flat.filter((f) => f.title.toLowerCase().includes(q)).map((m) => m.id));
        if (matchedIds.size === 0) return []; // nothing matches -> return empty tree

        const keep = (nodes: DesignationType[]): DesignationType[] =>
            nodes
                .map((n) => {
                    const childMatches = n.children ? keep(n.children) : [];
                    if (matchedIds.has(n.id) || childMatches.length) {
                        return { ...n, children: childMatches.length ? childMatches : n.children };
                    }
                    return null;
                })
                .filter(Boolean) as DesignationType[];

        return keep(filteredByDept);
    }, [filteredByDept, search]);

    // ---- auto-expand all nodes on mount when there is no search (so chart open by default) ----
    useEffect(() => {
        const all = new Set<string>();
        const collect = (nodes?: DesignationType[]) => {
            if (!nodes) return;
            nodes.forEach((n) => {
                if (n.children && n.children.length > 0) all.add(String(n.id));
                if (n.children) collect(n.children);
            });
        };
        collect(finalData.length ? finalData : filteredByDept);
        setExpanded(all);
    }, [JSON.stringify(finalData), JSON.stringify(filteredByDept)]);

    // ---- when search changes, expand ancestors of matches and scroll to first match ----
    useEffect(() => {
        const q = (search || '').trim().toLowerCase();
        if (!q) return; // do nothing
        const matches: string[] = [];
        idToNode.forEach((node, id) => {
            if (String(node.title).toLowerCase().includes(q)) matches.push(id);
        });
        if (matches.length === 0) return;

        // collect ancestors
        const toExpand = new Set<string>();
        for (const matchId of matches) {
            let cur: string | undefined = matchId;
            while (cur) {
                toExpand.add(cur);
                const parent = parentMap.get(cur);
                if (!parent) break;
                cur = parent;
            }
        }

        // replace expanded set with union (so user toggles aren't lost)
        setExpanded((prev) => new Set([...Array.from(prev), ...Array.from(toExpand)]));

        // scroll to first match
        requestAnimationFrame(() => {
            const first = nodeRefs.current.get(matches[0]);
            const container = containerRef.current;
            if (first && container) {
                const rect = first.getBoundingClientRect();
                const contRect = container.getBoundingClientRect();
                const centerX = rect.left - contRect.left + rect.width / 2 + container.scrollLeft;
                const centerY = rect.top - contRect.top + rect.height / 2 + container.scrollTop;
                container.scrollTo({
                    left: Math.max(0, centerX - container.clientWidth / 2),
                    top: Math.max(0, centerY - container.clientHeight / 2),
                    behavior: 'smooth',
                });
            }
        });
    }, [search, idToNode, parentMap]);

    const toggle = (id: string) => {
        setExpanded((prev) => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return next;
        });
    };

    // ---- compute visible nodes for drawing connectors ----
    const visibleNodes = useMemo(() => {
        const list: { node: DesignationType; parentId?: string }[] = [];
        const walk = (nodes?: DesignationType[], parentId?: string) => {
            if (!nodes) return;
            nodes.forEach((n) => {
                list.push({ node: n, parentId });
                if (n.children && expanded.has(String(n.id))) walk(n.children, String(n.id));
            });
        };
        walk(finalData.length ? finalData : filteredByDept, undefined);
        return list;
    }, [finalData, filteredByDept, expanded]);

    // ---- layout measurement: compute bounding box of all nodes and set wrapper minWidth/padding so scrollable area includes everything ----
    const [wrapperStyle, setWrapperStyle] = useState({ minWidth: 'auto', paddingLeft: `${PADDING}px`, paddingTop: `${PADDING}px` });
    useLayoutEffect(() => {
        const container = containerRef.current;
        const content = contentWrapperRef.current;
        if (!container || !content) return;

        // calculate extents of visible nodes relative to container
        let minLeft = Infinity;
        let maxRight = -Infinity;
        let minTop = Infinity;
        let maxBottom = -Infinity;
        for (const el of nodeRefs.current.values()) {
            const rect = el.getBoundingClientRect();
            const contRect = container.getBoundingClientRect();
            const left = rect.left - contRect.left;
            const right = rect.right - contRect.left;
            const top = rect.top - contRect.top;
            const bottom = rect.bottom - contRect.top;
            if (left < minLeft) minLeft = left;
            if (right > maxRight) maxRight = right;
            if (top < minTop) minTop = top;
            if (bottom > maxBottom) maxBottom = bottom;
        }

        if (!isFinite(minLeft) || !isFinite(maxRight)) {
            // nothing measured; keep default
            return;
        }

        // desired content width/height (plus margins)
        const contentWidth = Math.ceil(maxRight - minLeft) + PADDING * 2;
        const contentHeight = Math.ceil(maxBottom - minTop) + PADDING * 2;

        // we will ensure the inner wrapper has at least contentWidth to allow scrolling fully left/right
        // also shift paddingLeft so nodes don't appear clipped (we subtract measured minLeft to create left margin)
        const desiredPaddingLeft = Math.max(PADDING, Math.ceil(PADDING - minLeft));

        setWrapperStyle({
            minWidth: `${Math.max(contentWidth, container.clientWidth + 1)}px`, // ensure at least container width
            paddingLeft: `${desiredPaddingLeft}px`,
            paddingTop: `${Math.max(PADDING, Math.ceil(PADDING - minTop))}px`,
        });

        // also set svg size to cover content
        if (svgRef.current) {
            svgRef.current.setAttribute('width', `${Math.max(contentWidth, container.scrollWidth)}`);
            svgRef.current.setAttribute('height', `${Math.max(contentHeight, container.scrollHeight)}`);
        }
    }, [visibleNodes, JSON.stringify(finalData), JSON.stringify(filteredByDept)]);

    // ---- draw connectors (SVG) ----
    const drawConnectors = useMemo(() => {
        return () => {
            const svg = svgRef.current;
            const wrapper = contentWrapperRef.current;
            if (!svg || !wrapper) return;

            // size svg to wrapper's scroll area so it can host full connectors
            svg.setAttribute('width', `${Math.max(wrapper.scrollWidth, wrapper.clientWidth)}`);
            svg.setAttribute('height', `${Math.max(wrapper.scrollHeight, wrapper.clientHeight)}`);

            // clear previous children
            while (svg.firstChild) svg.removeChild(svg.firstChild);

            const wrapperRect = wrapper.getBoundingClientRect();

            const drawForNodes = (nodes?: DesignationType[]) => {
                if (!nodes) return;
                nodes.forEach((n) => {
                    if (n.children && expanded.has(String(n.id))) {
                        const parentEl = nodeRefs.current.get(String(n.id));
                        if (!parentEl) {
                            drawForNodes(n.children);
                            return;
                        }
                        n.children.forEach((c) => {
                            const childEl = nodeRefs.current.get(String(c.id));
                            if (!childEl) return;

                            const parentRect = parentEl.getBoundingClientRect();
                            const childRect = childEl.getBoundingClientRect();

                            // coordinates relative to the wrapper's top-left
                            const pCenterX = parentRect.left - wrapperRect.left + parentRect.width / 2;
                            const pBottomY = parentRect.top - wrapperRect.top + parentRect.height;
                            const cCenterX = childRect.left - wrapperRect.left + childRect.width / 2;
                            const cTopY = childRect.top - wrapperRect.top;

                            const midY = (pBottomY + cTopY) / 2;
                            const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
                            const d = `M ${pCenterX} ${pBottomY} C ${pCenterX} ${midY} ${cCenterX} ${midY} ${cCenterX} ${cTopY}`;
                            path.setAttribute('d', d);
                            path.setAttribute('fill', 'none');
                            path.setAttribute('stroke', 'rgba(148,163,184,0.6)');
                            path.setAttribute('stroke-width', '2');
                            path.setAttribute('stroke-linecap', 'round');
                            svg.appendChild(path);

                            const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
                            circle.setAttribute('cx', `${cCenterX}`);
                            circle.setAttribute('cy', `${cTopY}`);
                            circle.setAttribute('r', '2.5');
                            circle.setAttribute('fill', 'rgba(100,116,139,0.8)');
                            svg.appendChild(circle);
                        });
                    }
                    if (n.children) drawForNodes(n.children);
                });
            };

            drawForNodes(finalData.length ? finalData : filteredByDept);
        };
    }, [visibleNodes, expanded, JSON.stringify(finalData), JSON.stringify(filteredByDept)]);

    // ---- setup resize observer and initial drawing ----
    useEffect(() => {
        setIsMounted(true);

        // Create a resize observer to redraw connectors when the container resizes
        resizeObserverRef.current = new ResizeObserver(() => {
            requestAnimationFrame(() => {
                drawConnectors();
            });
        });

        if (containerRef.current) {
            resizeObserverRef.current.observe(containerRef.current);
        }

        return () => {
            if (resizeObserverRef.current) {
                resizeObserverRef.current.disconnect();
            }
        };
    }, [drawConnectors]);

    // ---- redraw connectors after mount and when dependencies change ----
    useEffect(() => {
        if (!isMounted) return;

        // Use a timeout to ensure DOM is fully updated before drawing
        const timer = setTimeout(() => {
            requestAnimationFrame(() => {
                drawConnectors();
            });
        }, 100);

        return () => clearTimeout(timer);
    }, [isMounted, drawConnectors]);

    // ---- highlight function for title (safe, no innerHTML) ----
    const highlightedTitle = (title: string) => {
        const q = (search || '').trim().toLowerCase();
        if (!q) return <>{title}</>;
        const lower = title.toLowerCase();
        const idx = lower.indexOf(q);
        if (idx === -1) return <>{title}</>;
        const before = title.slice(0, idx);
        const match = title.slice(idx, idx + q.length);
        const after = title.slice(idx + q.length);
        return (
            <>
                {before}
                <span className="bg-yellow-200 text-yellow-800 px-1 rounded-sm">{match}</span>
                {after}
            </>
        );
    };

    // node card
    const NodeCard: React.FC<{ node: DesignationType }> = ({ node }) => {
        const id = String(node.id);
        const isOpen = expanded.has(id);
        return (
            <div ref={(el) => registerNode(id, el)} className="inline-block w-56 bg-white p-3 rounded-xl shadow-md border border-gray-100 relative" data-node-id={id}>
                <div className="flex items-start gap-2">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-600 to-indigo-500 text-white flex items-center justify-center font-semibold text-xs">
                        {node.title
                            .split(' ')
                            .map((s) => s[0])
                            .slice(0, 2)
                            .join('')}
                    </div>
                    <div className="flex-1">
                        <div className="flex items-center justify-between gap-2">
                            <div className="text-sm font-semibold text-gray-800">{highlightedTitle(node.title)}</div>
                            <div className="flex items-center gap-1">
                                <button className="p-1 hover:bg-gray-100 rounded" onClick={() => toggle(id)} aria-label="toggle">
                                    {isOpen ? <ChevronDown className="w-4 h-4 text-gray-600" /> : <ChevronRight className="w-4 h-4 text-gray-600" />}
                                </button>
                                <button onClick={() => onEdit?.(node)} className="p-1 hover:bg-gray-100 rounded" title="Edit">
                                    <Edit className="w-4 h-4 text-gray-600" />
                                </button>
                                <button onClick={() => onDelete?.(node)} className="p-1 hover:bg-gray-100 rounded" title="Delete">
                                    <Trash2 className="w-4 h-4 text-red-500" />
                                </button>
                            </div>
                        </div>
                        <div className="text-xs text-gray-500 mt-1 flex items-center gap-2">
                            <div className="text-[11px] bg-gray-100 px-2 py-0.5 rounded">{node.department ?? '—'}</div>
                            <div className="text-[11px] text-gray-400">{node.employees ?? 0} employees</div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    // recursive layout renderer
    const renderTree = (nodes?: DesignationType[]) => {
        if (!nodes) return null;
        return nodes.map((n) => {
            const id = String(n.id);
            const isOpen = expanded.has(id);
            return (
                <div key={id} className="flex flex-col items-center gap-6">
                    <NodeCard node={n} />
                    {n.children && n.children.length > 0 && isOpen && (
                        <div className="w-full flex items-start justify-center gap-8">
                            {n.children.map((c) => (
                                <div key={c.id} className="flex flex-col items-center gap-4">
                                    <div>{renderTree([c])}</div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            );
        });
    };

    return (
        <div className={`bg-white rounded-2xl p-6 border border-indigo-50 shadow-lg ${className}`}>
            <div className="relative overflow-auto" style={{ maxHeight: '72vh' }} ref={containerRef}>
                {/* svg overlay for connectors */}
                <svg ref={svgRef} style={{ position: 'absolute', left: 0, top: 0, pointerEvents: 'none', zIndex: 0 }} width="0" height="0" />
                {/* content wrapper — its minWidth/padding are adjusted after measurement to allow full scrolling */}
                <div ref={contentWrapperRef} style={{ position: 'relative', zIndex: 1, paddingTop: wrapperStyle.paddingTop, paddingLeft: wrapperStyle.paddingLeft, minWidth: wrapperStyle.minWidth }}>
                    <div className="flex flex-col items-center justify-center">
                        <div className="flex items-start gap-12 justify-center">
                            {finalData && finalData.length ? (
                                finalData.map((root) => <div key={root.id}>{renderTree([root])}</div>)
                            ) : (
                                <div className="text-sm text-gray-400 p-8">No designations match the filter/search.</div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrgChartView;
