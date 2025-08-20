// SalaryStructurePopup.tsx
import React, { useEffect, useState } from 'react';
import { User, CheckCircle, X, ChevronLeft, ChevronRight } from 'lucide-react';
import ConfigrationComponent from './structuePopup Components/ConfigrationComponent';
import ReviewConfirm from './structuePopup Components/ReviewConfirm';
import SalaryServices from '../../../../services/SalaryServices';
import { useDispatch, useSelector } from 'react-redux';
import toast, { Toaster } from 'react-hot-toast';

interface SalaryStructureState {
    employee: any | null;
    config: configType;
    isEditing: boolean;
}
// ---- types (kept close to your original) ----
interface ComponentItem {
    id: number;
    name: string;
    category: string;
    amount: number;
}

interface configType {
    selectedComponents: ComponentItem[];
    amounts: Record<number, number>;
    payGrade: any | null; // PayGrade object
    payFreq: string | null;
    deductions: any[];
    baseSalary: number;
    estimatedTotal: number;
    currency: string;
}

// Default config template
const defaultConfig: configType = {
    selectedComponents: [],
    amounts: {},
    payGrade: null,
    payFreq: null,
    deductions: [],
    baseSalary: 0,
    estimatedTotal: 0,
    currency: 'USD',
};

interface Props {
    onClose: () => void;
    initialData?: any;
    response?: (data: any) => void;
}

// ---- Helper: abbreviation (kept simple & local so imports don't break) ----
function getAbbrivation(name: string) {
    if (!name) return 'N/A';
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
    return `${parts[0].charAt(0).toUpperCase()}${parts[1].charAt(0).toUpperCase()}`;
}

// ---- Main popup component (exported) ----
export default function SalaryStrucrePopup({ onClose = () => {}, initialData = null, response }: Props) {
    const [step, setStep] = useState(1); // 1..3
    const [state, setState] = useState<SalaryStructureState>({
        employee: initialData?.employee || null,
        config: initialData?.config || { ...defaultConfig },
        isEditing: !!initialData,
    });

    const dispatch = useDispatch();

    // NEW: employees state controlled by popup and passed into SelectEmployee
    const [employees, setEmployees] = useState<any[]>([]);

    useEffect(() => {
        if (initialData) {
            SalaryServices.FetchDetailedBasicProfile(initialData.id)
                .then((detailedProfile) => {
                    // Transform detailed profile to our config format
                    const selectedComponents = detailedProfile.salary_structures.map((ss: any) => ({
                        id: ss.salary_component.id,
                        name: ss.salary_component.name,
                        category: ss.salary_component.category,
                        amount: ss.pay_amount,
                    }));

                    const amounts = detailedProfile.salary_structures.reduce((acc: any, ss: any) => {
                        acc[ss.salary_component.id] = ss.pay_amount;
                        return acc;
                    }, {} as Record<number, number>);

                    // Find base salary (Basic component)
                    const basicComponent = detailedProfile.salary_structures.find((ss: any) => ss.salary_component.category.toLowerCase().includes('basic'));

                    // Get pay frequency (assuming same for all components)
                    const payFreq = detailedProfile.salary_structures[0]?.pay_frequency?.name || null;

                    setState((prev) => ({
                        ...prev,
                        employee: {
                            id: detailedProfile.id,
                            employee: detailedProfile.employee,
                            department: detailedProfile.department,
                            job_type: detailedProfile.job_type,
                        },
                        config: {
                            selectedComponents,
                            amounts,
                            payGrade: detailedProfile.salary_structures[0]?.pay_grade || null,
                            payFreq,
                            deductions: detailedProfile.deductions || [],
                            baseSalary: basicComponent?.pay_amount || 0,
                            estimatedTotal: selectedComponents.reduce((sum: any, c: any) => sum + c.amount, 0),
                            currency: 'USD',
                        },
                        isEditing: true,
                    }));
                    setStep(2);
                })
                .catch((e) => {
                    console.log(e);
                    toast.error('Failed to load salary structure details');
                });
        }
    }, [initialData]);
    // Update state handlers
    const updateEmployee = (employee: any) => {
        setState((prev) => ({
            ...prev,
            employee,
            // Reset config when changing employees
            config: prev.employee?.id === employee.id ? prev.config : { ...defaultConfig },
        }));
    };
    const updateConfig = (updates: Partial<configType>) => {
        setState((prev) => ({
            ...prev,
            config: { ...prev.config, ...updates },
        }));
    };
    function next() {
        if (step < 3) setStep((s) => s + 1);
    }
    function prev() {
        if (initialData) {
            if (step > 2) setStep((s) => s - 1);
            return;
        }
        if (step > 1) setStep((s) => s - 1);
    }

    // Popup controls fetching of structures / basic_profiles
    useEffect(() => {
        SalaryServices.FetchAllStructures(dispatch)
            .then((r: any) => {
                // original SelectEmployee expected r.basic_profiles
                if (r && r.basic_profiles) {
                    setEmployees(r.basic_profiles);
                } else {
                    // fallback: if your redux already stores them, you can get from selector
                    const fromStore = (dispatch as any) && (window as any).__DEV__ ? [] : [];
                    setEmployees(fromStore);
                }
            })
            .catch((e: any) => {
                console.log(e);
            });
    }, []);

    const handleNextClick = () => {
        if (step === 1 && !state.employee) return toast.error('Please select an employee first.', { duration: 2000 });

        if (step === 2) {
            if (state.config.selectedComponents.length < 1) return toast.error('Please select at least 1 component', { duration: 3000 });
            if (!state.config.payGrade) return toast.error('Please select Pay Grade', { duration: 3000 });
            if (!state.config.payFreq) return toast.error('Please select Pay Frequency', { duration: 3000 });
        }

        next();
    };

    const onUpdate = (submit = false) => {
        if (!submit) return;

        const payload = {
            employeeId: state.employee.id,
            components: state.config.selectedComponents.map((c) => ({
                id: c.id,
                amount: state.config.amounts[c.id],
            })),
            payGrade: state.config.payGrade?.id || null,
            payFrequency: state.config.payFreq,
            deductions: state.config.deductions.map((d) => d.id),
            currency: state.config.currency,
        };

        if (state.isEditing) {
            // Update existing structure
            SalaryServices.UpdateSalaryStructureBulk(payload)
                .then(() => {
                    toast.success('Salary Structure Updated', { duration: 4000 });
                    response?.('Updated Successfully');
                    onClose();
                })
                .catch((e) => {
                    console.log('Error updating salary structure', e);
                    toast.error('Failed to update salary structure');
                });
        } else {
            // Create new structure
            SalaryServices.AddSalaryStructure(payload)
                .then(() => {
                    toast.success('Salary Structure Created', { duration: 4000 });
                    response?.('Created Successfully');
                    onClose();
                })
                .catch((e) => {
                    console.log('Error creating salary structure', e);
                    toast.error('Failed to create salary structure');
                });
        }
    };
    return (
        <div style={{ zIndex: '10000' }} className="fixed inset-0 flex items-center justify-center">
            {/* overlay */}
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

            <div className="relative w-full max-w-5xl mx-2 h-[550px] overflow-y-scroll ">
                <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
                    {/* HEADER (persistent) */}
                    <div className="px-6 pt-4 pb-4 border-b">
                        <div className="flex items-start justify-between gap-2">
                            <div>
                                <h3 className="flex items-center gap-1 text-xl font-semibold">
                                    <span className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-500 to-pink-500 flex items-center justify-center text-white">$</span>
                                    {state.isEditing ? 'Update' : 'Create'} Salary Structure
                                </h3>
                                <p className="text-sm text-slate-500">Design comprehensive compensation package</p>
                            </div>

                            <button aria-label="Close" onClick={onClose} className="rounded-lg p-2 hover:bg-slate-100">
                                <X size={18} />
                            </button>
                        </div>

                        {/* Steps + progress */}
                        <div className="mt-6">
                            <div className="flex items-center gap-6">
                                <StepPill number={1} label="Employee" active={step === 1} done={step > 1} />
                                <div className={`flex-1 rounded-xl h-[2px] ${step > 2 ? 'bg-gradient-to-r from-blue-500 to-sky-800 h-[4px]' : 'bg-slate-200'} `} />
                                <StepPill number={2} label="Configure" active={step === 2} done={step > 2} />
                                <div className={`flex-1 rounded-xl h-[2px] ${step === 3 ? 'bg-gradient-to-r from-blue-500 to-sky-800 h-[4px]' : 'bg-slate-200'} `} />
                                <StepPill number={3} label="Review" active={step === 3} done={step > 3} />
                            </div>

                            {/* decorative progress bar */}
                            <div className="mt-3 h-2 rounded-full bg-slate-100 overflow-hidden">
                                <div className="h-full bg-gradient-to-r from-indigo-700 via-pink-500 to-pink-300" style={{ width: `${((step - 1) / 2) * 100 + 33}%` }} />
                            </div>
                        </div>
                    </div>

                    {/* BODY (changes per step) */}
                    <div className="p-6 bg-white max-h-[360px] overflow-y-auto">
                        {/* Step components with updated props */}
                        {step === 1 && <SelectEmployee employees={employees} selectedEmployee={state.employee} onSelect={updateEmployee} />}

                        {step === 2 && <ConfigrationComponent initialData={state.config} isEditing={state.isEditing} onUpdate={updateConfig} selectedEmployee={state.employee} />}

                        {step === 3 && (
                            <ReviewConfirm
                                isEditing={state.isEditing}
                                onFinalSubmit={() => onUpdate(true)}
                                config={state.config}
                                selectedEmployee={state.employee}
                                onDeductionsChange={(deductions) =>
                                    setState((prev) => ({
                                        ...prev,
                                        config: { ...prev.config, deductions },
                                    }))
                                }
                            />
                        )}
                    </div>

                    {/* FOOTER (persistent) */}
                    <div className="px-6 py-4 border-t bg-white flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <button
                                onClick={prev}
                                disabled={step === 1}
                                className={`flex items-center gap-2 px-3 py-2 rounded-md border ${
                                    step === 1 ? 'text-slate-400 border-slate-100 cursor-not-allowed' : 'text-slate-700 border-slate-200 hover:shadow-sm'
                                }`}
                            >
                                <ChevronLeft size={16} /> Previous
                            </button>

                            <button onClick={onClose} className="px-3 py-2 rounded-md text-slate-700 border border-slate-200 hover:bg-slate-50">
                                Cancel
                            </button>
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="text-sm text-slate-500">Step {step} of 3</div>
                            <button
                                onClick={handleNextClick}
                                disabled={step === 3}
                                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-600 to-pink-500 text-white font-semibold shadow"
                            >
                                <span>Next</span>
                                <ChevronRight size={16} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <Toaster reverseOrder={false} position="bottom-right" />
        </div>
    );
}

// ---- StepPill (same as before) ----
function StepPill({ number, label, active, done }: { number: any; label: any; active: boolean; done: any }) {
    return (
        <div className="flex items-center gap-3">
            <div
                className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium ${
                    done ? 'bg-gradient-to-br from-green-400 to-green-600 text-white' : active ? 'bg-white ring-2 ring-indigo-500 text-indigo-700' : 'bg-slate-100 text-slate-600'
                }`}
            >
                {done ? <CheckCircle size={18} className="text-white" /> : number}
            </div>
            <div className="text-sm">
                <div
                    className={`font-semibold ${active ? 'text-slate-900' : 'text-slate-500'}
        `}
                >
                    {label}
                </div>
            </div>
        </div>
    );
}

// ---- SelectEmployee component moved into same file (unchanged layout & styles) ----
export function SelectEmployee({ employees, selectedEmployee, onSelect }: { employees: any[]; selectedEmployee: any; onSelect: (data: any) => void }) {
    // Use passed employees instead of fetching locally (popup controls data)
    const [query, setQuery] = useState('');
    const filtered = employees.filter((e) => `${e.employee?.name ?? ''} ${e.department?.name ?? ''} ${e.job_type?.name ?? ''}`.toLowerCase().includes(query.toLowerCase()));

    return (
        <div>
            <div className="flex items-center justify-center -mt-3">
                <button className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-50 border border-slate-100">
                    <User size={16} /> Select Employee
                </button>
            </div>

            <p className="text-center text-slate-500 mt-4">Choose the employee for whom you want to create a salary structure</p>

            <div className="mt-4 flex justify-center">
                <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search by name, department, or designation..."
                    className="w-full max-w-2xl px-4 py-3 rounded-full border border-slate-200 shadow-sm focus:outline-none"
                />
            </div>

            <div className="mt-6 grid grid-cols-2 md:grid-cols-3 gap-4">
                {filtered.map((emp) => {
                    const isSelected = selectedEmployee?.id === emp.id;
                    return (
                        <button
                            key={emp.id}
                            onClick={() => onSelect(emp)}
                            className={`flex flex-col items-start gap-3 p-4 rounded-lg border text-left hover:shadow-md transition-all ${
                                isSelected ? 'bg-gradient-to-br from-indigo-50 to-pink-50 border-indigo-300 shadow-lg' : 'bg-white border-slate-200'
                            }`}
                        >
                            <div className="flex items-center gap-3 w-full">
                                <div className="w-12 h-12 rounded-lg flex items-center justify-center text-white font-semibold bg-gradient-to-br from-pink-400 to-indigo-600">
                                    {getAbbrivation(emp.employee?.name)}
                                </div>
                                <div className="flex-1">
                                    <div className="font-medium text-slate-800">{emp.employee?.name ?? 'emp'}</div>
                                    <div className="text-xs text-slate-500">{emp.department?.name}</div>
                                    <div className="text-xs text-slate-400 mt-1">{emp.job_type?.name}</div>
                                </div>
                                {isSelected && (
                                    <div className="pl-2">
                                        <CheckCircle size={18} className="text-green-600" />
                                    </div>
                                )}
                            </div>
                        </button>
                    );
                })}
            </div>

            {/* selected summary */}
            {selectedEmployee && (
                <div className="mt-6 rounded-xl p-4 bg-gradient-to-r from-indigo-600 to-pink-500 text-white flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-lg bg-white/20 flex items-center justify-center font-semibold">{getAbbrivation(selectedEmployee.employee?.name)}</div>
                        <div>
                            <div className="font-semibold">{selectedEmployee.employee?.name ?? 'Name N/A'}</div>
                            <div className="text-sm opacity-90">
                                {selectedEmployee.department?.name} • {selectedEmployee.job_type?.name}
                            </div>
                        </div>
                    </div>
                    <div className="text-sm">Selected Employee</div>
                </div>
            )}
        </div>
    );
}
