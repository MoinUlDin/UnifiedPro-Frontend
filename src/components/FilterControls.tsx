// src/hooks/useFilterRows.tsx
import React, { useState, useMemo, ChangeEvent } from 'react';

export type TextFilter = {
    type: 'text';
    key: string; // e.g. "goal_text" or "department.name"
    placeholder?: string;
};

export type SelectFilter = {
    type: 'select';
    key: string; // same, can be nested path
    options: { value: any; label: string }[];
};

export type FilterConfig = TextFilter | SelectFilter;

/** Resolve nested paths like "department.name" */
function getNestedValue(obj: any, path: string): any {
    return path.split('.').reduce((o, key) => (o == null ? undefined : o[key]), obj);
}

/**
 * Hook to filter rows by an array of FilterConfig.
 * @param rows - The full data array
 * @param filters - Array of filter definitions
 */
export function useFilterRows<T extends Record<string, any>>(rows: T[], filters: FilterConfig[]) {
    // store current filter inputs by key
    const [values, setValues] = useState<Record<string, any>>({});

    /** Set a single filter; passing '' clears it */
    const setFilter = <K extends string>(key: K, value: any | '') => {
        setValues((prev) => ({
            ...prev,
            [key]: value === '' ? undefined : value,
        }));
    };

    /** Compute filtered rows whenever rows or filter values change */
    const filtered = useMemo(() => {
        return rows.filter((row) =>
            filters.every((f) => {
                const raw = getNestedValue(row, f.key);
                const filterVal = values[f.key];

                if (f.type === 'text') {
                    if (!filterVal) return true;
                    return String(raw ?? '')
                        .toLowerCase()
                        .includes(String(filterVal).toLowerCase());
                } else {
                    if (filterVal === undefined) return true;
                    return raw === filterVal;
                }
            })
        );
    }, [rows, values, filters]);

    return { filtered, filterValues: values, setFilter };
}

interface FilterControlsProps {
    filters: FilterConfig[];
    values: Record<string, any>;
    onChange: (key: string, value: any | '') => void;
}

/**
 * Renders text inputs & selects for each filter in the config.
 */
export function FilterControls({ filters, values, onChange }: FilterControlsProps) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 mb-4">
            {filters.map((f) => {
                const val = values[f.key] ?? '';

                if (f.type === 'text') {
                    return (
                        <input
                            key={f.key}
                            type="text"
                            placeholder={f.placeholder || `Search ${f.key}`}
                            value={val}
                            onChange={(e: ChangeEvent<HTMLInputElement>) => onChange(f.key, e.target.value)}
                            className="form-input"
                        />
                    );
                } else {
                    return (
                        <select key={f.key} value={val} onChange={(e: ChangeEvent<HTMLSelectElement>) => onChange(f.key, e.target.value)} className="form-input">
                            <option value="">All {f.key}</option>
                            {f.options.map((o) => (
                                <option key={String(o.value)} value={o.value}>
                                    {o.label}
                                </option>
                            ))}
                        </select>
                    );
                }
            })}
        </div>
    );
}
