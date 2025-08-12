// ReviewConfirm.tsx
import { AlertCircle, FileText, Percent, CreditCard, CheckCircle } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { DeductionType } from '../../../../../constantTypes/SalaryTypes';
import { getAbbr } from './SelectEmployee';
import SalaryServices from '../../../../../services/SalaryServices';
import toast, { Toaster } from 'react-hot-toast';
import { useSelector } from 'react-redux';
import { current } from '@reduxjs/toolkit';

interface ConfigType {
    selectedComponents: { id: number; name: string; category: string; amount: number }[];
    amounts: Record<number, number>;
    payGrade: any | null;
    payFreq: string | null;
    deductions: DeductionType[];
    baseSalary: number;
    estimatedTotal: number;
    currency?: string;
}

interface Props {
    onFinalSubmit: () => void;
    selectedEmployee: any;
    config: ConfigType | null;
    onDeductionsChange: (deductions: DeductionType[]) => void;
    isEditing: boolean;
}

export default function ReviewConfirm({ isEditing, onFinalSubmit = () => {}, selectedEmployee = null, config = null, onDeductionsChange = () => {} }: Props) {
    // Use config directly from props
    const { selectedComponents = [], payGrade = null, payFreq = null, deductions = [] } = config || {};

    const [deductionList, setDeductionList] = useState<DeductionType[]>([]);
    const [selectedDeductions, setSelectedDeductions] = useState<DeductionType[]>([]);
    const [loadingSubmit, setLoadingSubmit] = useState(false);

    useEffect(() => {
        SalaryServices.FetchDeduction()
            .then((r) => setDeductionList(r || []))
            .catch(() => setDeductionList([]));
    }, []);

    // initialize selected deductions from config
    useEffect(() => {
        if (!config) return;
        setSelectedDeductions(config.deductions ?? []);
    }, [config]);

    // Handle deductions update
    const handleDeductionClick = (d: DeductionType) => {
        const newDeductions = deductions.find((x) => x.id === d.id) ? deductions.filter((x) => x.id !== d.id) : [...deductions, d];

        onDeductionsChange(newDeductions);
    };

    if (!config) return <div className="p-6 text-center text-slate-500">No configuration found.</div>;

    // totals (memoized)
    const gross = useMemo(() => selectedComponents.reduce((s, c) => s + (c.amount || 0), 0), [selectedComponents]);
    const deductionsTotal = useMemo(() => {
        return selectedDeductions.reduce((s, d) => s + gross * (Number(d.percentage) / 100), 0);
    }, [selectedDeductions, gross]);
    const net = gross - deductionsTotal;
    const takeHomePct = gross ? Math.round((net / gross) * 100) : 0;

    const handleConfirm = async () => {
        setLoadingSubmit(true);
        try {
            onFinalSubmit();
        } catch (e) {
            console.error(e);
            toast.error(`Failed to ${isEditing ? 'update' : 'create'} salary structure`);
        } finally {
            setLoadingSubmit(false);
        }
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
                {/* Employee info */}
                <div className="p-4 rounded-lg border border-slate-200 bg-gradient-to-br from-white to-slate-50">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded bg-gradient-to-br from-pink-400 to-indigo-600 flex items-center justify-center text-white font-semibold">
                            {getAbbr(selectedEmployee?.first_name, selectedEmployee?.last_name) ?? 'ED'}
                        </div>
                        <div>
                            <div className="font-semibold">{selectedEmployee.employee.name ?? 'Emp n/a'}</div>
                            <div className="text-sm text-slate-500">
                                {selectedEmployee?.department?.name ?? ''} • {selectedEmployee?.job_type?.name ?? ''}
                            </div>
                        </div>
                        <div className="ml-auto text-sm text-slate-400">Employee Information</div>
                    </div>
                </div>

                {/* Salary configuration summary */}
                <div className="p-4 rounded-lg border border-pink-100 bg-gradient-to-br from-pink-50 to-white">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-pink-600 font-semibold">
                            <FileText size={16} /> Salary Configuration
                        </div>
                        <div className="text-sm text-slate-500">Selected Components ({selectedComponents.length})</div>
                    </div>

                    <div className="mt-4 space-y-2">
                        {selectedComponents.map((c) => (
                            <div key={c.id} className="flex items-center justify-between text-sm bg-white/60 p-2 rounded">
                                <div>{c.name}</div>
                                <div className="font-semibold">{(c.amount || 0).toLocaleString()}</div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                        <div>
                            <div className="text-xs text-slate-400">Pay Grade</div>
                            <div className="font-medium mt-1">{payGrade?.name ?? '-'}</div>
                        </div>
                        <div>
                            <div className="text-xs text-slate-400">Pay Frequency</div>
                            <div className="font-medium mt-1">{payFreq ?? '-'}</div>
                        </div>
                    </div>
                </div>

                {/* Deductions list with toggle */}
                <div className="p-4 rounded-lg border border-yellow-200 bg-yellow-50">
                    <div className="flex items-center gap-2 text-yellow-700 font-semibold">
                        <AlertCircle size={16} /> Additional Details
                    </div>
                    <p className="text-[12px] text-gray-700 mt-3">Select deductions to apply</p>

                    <div className="mt-3 space-y-2 text-sm">
                        {deductionList.length === 0 && <div className="text-sm text-slate-400">No deductions available.</div>}

                        {deductionList.map((d) => {
                            const applied = !!selectedDeductions.find((x) => x.id === d.id);
                            return (
                                <div
                                    key={d.id}
                                    onClick={() => handleDeductionClick(d)}
                                    role="button"
                                    tabIndex={0}
                                    onKeyDown={(e) => e.key === 'Enter' && handleDeductionClick(d)}
                                    className={`flex items-center justify-between hover:shadow hover:cursor-pointer transition-all duration-150 p-2 rounded ${
                                        applied ? 'bg-emerald-50 border border-emerald-200 shadow-sm' : 'bg-white/60'
                                    }`}
                                >
                                    <div className="flex items-center gap-2">
                                        <Percent size={14} />
                                        <div>{d.name}</div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="text-sm font-semibold">{Number(d.percentage).toFixed(2)}%</div>
                                        {applied && <CheckCircle size={16} className="text-emerald-600" />}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Right: final breakdown */}
            <div className="space-y-4">
                <div className="p-4 rounded-lg border border-green-200 bg-gradient-to-br from-white to-green-50">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-green-700 font-semibold">
                            <CreditCard size={16} /> Final Salary Breakdown
                        </div>
                        <div className="text-xs text-slate-400">Complete compensation overview</div>
                    </div>

                    <div className="mt-4 space-y-3">
                        {selectedComponents.map((c) => (
                            <div key={c.id} className="flex items-center justify-between px-3 py-2 bg-white rounded">
                                <div className="text-sm">{c.name}</div>
                                <div className="font-semibold text-green-600">+{(c.amount || 0).toLocaleString()}</div>
                            </div>
                        ))}

                        <div className="flex items-center justify-between px-3 py-2 bg-green-100 rounded font-semibold">
                            <div>Gross Salary</div>
                            <div>
                                {config.currency}-{gross.toLocaleString()}
                            </div>
                        </div>

                        <div className="pt-2" />

                        <div className="text-sm text-red-600 font-semibold">Deductions ({selectedDeductions.length})</div>
                        {selectedDeductions.map((d) => (
                            <div key={d.id} className="flex items-center justify-between px-3 py-2 bg-white rounded text-sm">
                                <div>{d.name}</div>
                                <div className="text-red-600">-{(gross * (Number(d.percentage) / 100)).toFixed(2)}</div>
                            </div>
                        ))}

                        <div className="flex items-center justify-between px-3 py-2 bg-red-50 rounded font-semibold text-red-600">
                            <div>Total Deductions</div>
                            <div>
                                -{config?.currency}-{deductionsTotal.toFixed(2)}
                            </div>
                        </div>

                        <div className="mt-4 p-4 rounded-lg bg-gradient-to-br from-indigo-500 to-pink-500 text-white text-center">
                            <div className="text-xs">Net Salary</div>
                            <div className="text-2xl font-bold mt-1">
                                {config.currency}-{net.toLocaleString()}
                            </div>
                            <div className="text-xs mt-2">Take-home amount</div>
                        </div>

                        <div className="mt-2">
                            <div className="text-xs text-slate-500">Take-home percentage</div>
                            <div className="mt-2 h-3 bg-slate-200 rounded-full overflow-hidden">
                                <div className="h-full bg-gradient-to-r from-indigo-600 to-pink-400" style={{ width: `${takeHomePct}%` }} />
                            </div>
                            <div className="text-xs text-slate-500 mt-1">{takeHomePct}%</div>
                        </div>

                        <div className="mt-4 grid grid-cols-2 gap-3">
                            <button onClick={handleConfirm} disabled={loadingSubmit} className="px-3 py-2 rounded bg-gradient-to-r from-indigo-600 to-pink-500 text-white font-semibold">
                                {loadingSubmit && (isEditing ? 'Updating...' : 'Creating...')}
                                {!loadingSubmit && isEditing ? 'Confirm & Update' : 'Confirm & Create '}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
