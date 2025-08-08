import { useEffect, useState } from 'react';
import { Transition } from '@headlessui/react';
import SettingServices from '../../../services/SettingServices';
import toast from 'react-hot-toast';

interface DepartmentOption {
    value: number;
    label: string;
}

interface Designation {
    id: number;
    name: string;
}

interface Props {
    initialValues?: any;
    onSubmit: (data: { name: string; department: number; parent: number | null }) => void;
    onCancel: () => void;
    isLoading?: boolean;
}

const DesignationForm = ({ initialValues = {}, onSubmit, onCancel, isLoading = false }: Props) => {
    const [name, setName] = useState(initialValues?.name || '');
    const [department, setDepartment] = useState<number | ''>(initialValues?.department || '');
    const [parent, setParent] = useState<number | null>(initialValues?.parent ?? null);

    const [departments, setDepartments] = useState<DepartmentOption[]>([]);
    const [parentOptions, setParentOptions] = useState<Designation[]>([]);
    const [parentSearch, setParentSearch] = useState('');
    const [parentOpen, setParentOpen] = useState(false);

    // Log initial values for debugging
    useEffect(() => {
        console.log('initialValues we received: ', initialValues);
    }, [initialValues]);

    // Load departments on mount
    useEffect(() => {
        SettingServices.fetchParentDepartments()
            .then((list: any[]) => setDepartments(list.map((d) => ({ value: d.id, label: d.name }))))
            .catch(() => toast.error('Failed to load departments'));
    }, []);

    // Load designations under selected department and handle initial parent
    useEffect(() => {
        if (!department) {
            setParentOptions([]);
            setParent(null);
            return;
        }

        SettingServices.fetchDesignationsByDepartment(department)
            .then((res: Designation[]) => {
                setParentOptions(res);
                // Preserve initial parent if it exists in the options, otherwise reset
                if (initialValues.parent && res.some((d) => d.id === initialValues.parent)) {
                    setParent(initialValues.parent);
                } else if (department !== initialValues.department) {
                    setParent(null); // Reset if department changes
                }
            })
            .catch(() => toast.error('Failed to load designations'));
    }, [department, initialValues?.department, initialValues?.parent]);

    const filteredParents = parentOptions.filter((d) => d.name.toLowerCase().includes(parentSearch.toLowerCase()));

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name || !department) {
            toast.error('Please fill required fields');
            return;
        }

        onSubmit({
            name,
            department: Number(department),
            parent,
        });
    };

    const handleClearParent = () => {
        setParent(null);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-700">Designation Name</label>
                <input type="text" className="w-full border px-3 py-1 mt-1" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700">Department</label>
                <select className="w-full border px-3 py-1 mt-1" value={department} onChange={(e) => setDepartment(Number(e.target.value))} required>
                    <option value="">Select Department</option>
                    {departments.map((d) => (
                        <option key={d.value} value={d.value}>
                            {d.label}
                        </option>
                    ))}
                </select>
                {parent !== null && (
                    <div className="mt-2 flex items-center">
                        <span className="text-sm text-gray-600">Reporting to: {parentOptions.find((d) => d.id === parent)?.name}</span>
                        <button type="button" className="ml-2 text-red-500 hover:text-red-700" onClick={handleClearParent}>
                            ×
                        </button>
                    </div>
                )}
            </div>

            {/* Collapsible “Report To” section */}
            {department && (
                <div>
                    <button type="button" className="text-blue-600 hover:underline text-sm" onClick={() => setParentOpen((p) => !p)}>
                        {parentOpen ? 'Hide Report To' : 'Set Report To…'}
                    </button>

                    <Transition
                        show={parentOpen}
                        enter="transition-all duration-300 ease-out"
                        enterFrom="max-h-0 opacity-0"
                        enterTo="max-h-screen opacity-100"
                        leave="transition-all duration-200 ease-in"
                        leaveFrom="max-h-screen opacity-100"
                        leaveTo="max-h-0 opacity-0"
                    >
                        <div className="border p-3 mt-2 rounded">
                            <input type="text" className="w-full border px-2 py-1 mb-2" placeholder="Search report-to…" value={parentSearch} onChange={(e) => setParentSearch(e.target.value)} />
                            <ul className="max-h-40 overflow-auto border rounded">
                                {filteredParents.map((d) => (
                                    <li key={d.id} className={`p-1 cursor-pointer ${parent === d.id ? 'bg-blue-100 font-medium' : 'hover:bg-gray-100'}`} onClick={() => setParent(d.id)}>
                                        {d.name}
                                    </li>
                                ))}
                                {filteredParents.length === 0 && <li className="text-gray-500 p-1">No matches</li>}
                            </ul>
                            {parent !== null && (
                                <p className="mt-2 text-sm">
                                    Reporting to: <strong>{parentOptions.find((d) => d.id === parent)?.name}</strong>
                                </p>
                            )}
                        </div>
                    </Transition>
                </div>
            )}

            <div className="flex justify-end gap-2">
                <button type="button" onClick={onCancel} className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">
                    Cancel
                </button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700" disabled={isLoading}>
                    {isLoading ? 'Saving...' : 'Save'}
                </button>
            </div>
        </form>
    );
};

export default DesignationForm;
