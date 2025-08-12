import { useEffect, useState } from 'react';
import { AlertCircle, DollarSign, PlusCircle, Eye, MinusCircle, TrendingUp, Clock, Clock1, CreditCard } from 'lucide-react';
import SalaryServices from '../../../../../services/SalaryServices';
import { AllComponents, SalaryComponentType, PayGradeType, PayFrequencyType } from '../../../../../constantTypes/SalaryTypes';
import { getAbbrivation } from '../../../../../utils/Common';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';

interface Props {
    selectedEmployee: any;
    onUpdate: (data: any) => void;
}

export default function ConfigrationComponent({ selectedEmployee = null, onUpdate = () => {} }: Props) {
    const [allcompo, setAllComponents] = useState<AllComponents | null>(null);
    // use numbers for ids coming from API
    const [selected, setSelected] = useState<number[]>([]);
    const [amounts, setAmounts] = useState<Record<number, number>>({});
    const [payGrades, setPayGrades] = useState<PayGradeType[]>([]);
    const [components, setComponents] = useState<SalaryComponentType[]>([]);
    const [payFreqs, setPayFreqs] = useState<PayFrequencyType[]>([]);
    const [payGradeSelected, setPayGradeSelected] = useState<any | null>(null);
    const [currency, setCurrency] = useState<string>('USD');
    const [payFreq, setPayFreq] = useState<string | null>(null);

    // find the 'basic' component for base salary calculation
    const basicComponent = components.find((c) => (c.category && c.category.toLowerCase() === 'basic') || (c.name && c.name.toLowerCase().includes('basic')));
    const baseSalary = basicComponent ? amounts[basicComponent.id] || 0 : 0;
    const dispatch = useDispatch();
    useEffect(() => {
        SalaryServices.FetchAllStructures(dispatch)
            .then((r: AllComponents) => {
                setAllComponents(r);
                console.log('All Structures: ', r);
                setComponents(r.components || []);
                setPayGrades(r.paygrades || []);
                setPayFreqs(r.pay_frequency || []);
                setCurrency(r.currency);

                // initialize amounts from `current` or `minimum_salary`
                const initAmounts: Record<number, number> = {};
                (r.components || []).forEach((c) => {
                    initAmounts[c.id] = Number(c.current ?? c.minimum_salary ?? 0);
                });
                setAmounts(initAmounts);

                // default selected: components that have `current` set OR fallback to basic if none
                const withCurrent = (r.components || []).filter((c) => c.current != null).map((c) => c.id);

                if (withCurrent.length > 0) {
                    setSelected(withCurrent);
                } else {
                    const basic = (r.components || []).find((c) => (c.category && c.category.toLowerCase() === 'basic') || (c.name && c.name.toLowerCase().includes('basic')));
                    setSelected(basic ? [basic.id] : []);
                }
            })
            .catch((e) => {
                console.error('FetchAllStructures error:', e);
            });
    }, []);

    const toggle = (id: number) => {
        setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));
    };

    const setAmount = (id: number, value: string | number) => {
        const num = Number(value) || 0;
        setAmounts((a) => ({ ...a, [id]: num }));
    };

    const estimatedTotal = selected.reduce((sum, id) => sum + (amounts[id] || 0), 0);

    // inside ConfigrationComponent (replace your placeholder useEffect)
    useEffect(() => {
        // build selectedComponents array with id, name, amount
        const selectedComponents = selected
            .map((id) => {
                const comp = components.find((c) => c.id === id);
                if (!comp) return null;
                return {
                    id: comp.id,
                    name: comp.name,
                    category: comp.category,
                    amount: amounts[comp.id] ?? Number(comp.current ?? comp.minimum_salary ?? 0),
                };
            })
            .filter(Boolean);

        // baseSalary detection (if you want explicit base component)
        const base = components.find((c) => (c.category || '').toLowerCase() === 'basic' || (c.name || '').toLowerCase().includes('basic'));
        const baseSalary = base ? amounts[base.id] ?? Number(base.current ?? base.minimum_salary ?? 0) : 0;

        const payload = {
            // arrays & maps that Review will expect
            selectedComponents, // [{id, name, amount, category}, ...]
            amounts, // { [componentId]: amount, ... }
            payGrade: payGradeSelected ?? null, // the selected pay grade object (or null)
            payFreq: payFreq ?? null, // selected pay frequency name/object
            deductions: [], // you can wire actual deductions here if you expose them in the UI
            effectiveDate: null, // wire from date input when you add it
            baseSalary,
            estimatedTotal: selectedComponents.reduce((s, c) => s + (c?.amount || 0), 0),
            currency,
        };
        console.log('payload', payload);
        // call parent's onUpdate so parent stores the latest config
        onUpdate(payload);
    }, [selected, amounts, payGradeSelected, payFreq, components /*, deductions, effectiveDate */]);

    // guard while data loading
    if (!allcompo) {
        return <div className="p-6 text-center text-slate-500">Loading salary structures…</div>;
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="flex items-center justify-center col-span-3">
                <button className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-pink-50 border border-pink-100 text-pink-600">
                    <CreditCard size={16} /> Configure Salary
                </button>
            </div>

            <p className="text-center text-slate-500 col-span-3">Set up salary components, pay grade, and base salary amount</p>

            {/* selected employee bar */}
            {selectedEmployee && (
                <div className="mt-4 col-span-3 rounded-lg border border-indigo-200 p-3 flex items-center gap-4">
                    <div className="w-10 h-10 rounded bg-gradient-to-br from-indigo-200  to-indigo-600 flex items-center justify-center font-semibold text-indigo-700">
                        {getAbbrivation(selectedEmployee.employee.name)}
                    </div>
                    <div className="flex-1">
                        <div className="font-semibold">{selectedEmployee.employee.name ?? 'Emp N/A'}</div>
                        <div className="text-sm text-slate-500">
                            {selectedEmployee.department.name} • {selectedEmployee.job_type.name}
                        </div>
                    </div>
                </div>
            )}

            <div className="lg:col-span-2 space-y-4">
                <div className="border-l-2 border-orange-300 bg-orange-50 p-4 rounded-md mt-3">
                    <div className="flex items-start gap-3">
                        <AlertCircle size={18} className="text-orange-500" />
                        <div className="text-sm text-orange-800">
                            <div className="font-semibold">Complete the following to proceed:</div>
                            <ul className="list-disc ml-5 mt-2 space-y-1">
                                <li>Select at least 1 salary components</li>
                                <li>Select a pay grade</li>
                                <li>Select a pay frequency</li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Salary Components grid */}
                <div className="mt-4">
                    <div className="flex items-center justify-between">
                        <h4 className="font-semibold">Salary Components</h4>
                        <div className="text-sm text-slate-500">Select and configure amounts (min 2 required)</div>
                    </div>

                    <div className="grid grid-cols-1 p-4 border rounded border-gray-700 md:grid-cols-2 gap-4 mt-3 mb-8 max-h-[400px] overflow-y-auto">
                        {components.map((c) => {
                            const isOn = selected.includes(c.id);
                            return (
                                <div key={c.id} className={`p-4 rounded-lg border ${isOn ? 'border-green-300 bg-green-50 shadow-sm' : 'border-slate-200 bg-white'}`}>
                                    <div className="flex items-start gap-3">
                                        <div className="flex-1">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <div className="font-medium">{c.name}</div>
                                                    <div className="text-xs text-slate-500">{c.category}</div>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-xs px-2 py-1 rounded-full bg-slate-100">{c.category}</span>
                                                    <button onClick={() => toggle(c.id)} className="p-1 rounded-full border hover:bg-slate-50">
                                                        {isOn ? <MinusCircle size={16} /> : <PlusCircle size={16} />}
                                                    </button>
                                                </div>
                                            </div>

                                            {isOn && (
                                                <div className="mt-3">
                                                    <label className="text-xs text-slate-500">Amount for this component</label>
                                                    <div className="mt-2 flex items-center gap-2">
                                                        <span className="px-2 py-2 rounded-l-md border border-r-0 bg-slate-50">{currency}</span>
                                                        <input
                                                            value={amounts[c.id] ?? ''}
                                                            onChange={(e) => setAmount(c.id, e.target.value)}
                                                            className="flex-1 px-3 py-2 border rounded-r-md focus:outline-none"
                                                        />
                                                    </div>
                                                    <div className="text-xs text-slate-400 mt-1">
                                                        Range: {currency}-{c.minimum_salary?.toLocaleString()} ~ {c.maximum_salary?.toLocaleString()}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Pay Grade and Frequency + Base Salary */}
                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <div>
                            <h5 className="font-medium flex items-center gap-1">
                                <TrendingUp className="rounded-full bg-amber-600 p-1" />
                                <span>
                                    Pay Grade <span className="text-red-500">*</span>
                                </span>
                            </h5>
                        </div>
                        <div className="mt-3 space-y-2 max-h-[200px] overflow-y-auto">
                            {payGrades &&
                                payGrades?.map((g) => (
                                    <label key={g?.id} className={`block p-3 border rounded-lg ${payGradeSelected?.id === g?.id ? 'border-amber-600 border-2 bg-indigo-50' : 'border-slate-200'}`}>
                                        <input type="radio" name="grade" value={g?.id} className="mr-2" onChange={() => setPayGradeSelected(g)} checked={payGradeSelected?.id === g?.id} />
                                        {g?.name}
                                        <div className="text-xs text-slate-400">{g?.range}</div>
                                    </label>
                                ))}
                        </div>
                    </div>

                    <div className="">
                        <div>
                            <h5 className="font-medium flex items-center gap-1">
                                <Clock1 className="rounded-full text-white bg-blue-600 p-1" />
                                <span>
                                    Pay Frequency <span className="text-red-500">*</span>
                                </span>
                            </h5>
                        </div>
                        <div className="mt-3 space-y-2 max-h-[200px] overflow-y-auto">
                            {payFreqs.map((f) => (
                                <label key={f.id} className={`block p-3 border rounded-lg ${payFreq === f.name ? 'border-indigo-300 bg-indigo-50' : 'border-slate-200'}`}>
                                    <input type="radio" name="freq" value={f.name} className="mr-2" onChange={() => setPayFreq(f.name)} checked={payFreq === f.name} />
                                    {f.name}
                                </label>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Sidebar: Live Preview */}
            <div className="col-span-1">
                {payGradeSelected && <div className="border-amber-600"></div>}
                <div className="sticky top-6 p-4 border border-dashed border-blue-600 rounded-lg bg-gradient-to-r from-[#F5F6FF] to-[#FAF5FE] shadow-sm">
                    <div className="flex flex-col items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Eye color="blue" size={16} />
                            <div className="text-sm font-semibold text-blue-600">Live Preview</div>
                        </div>
                        <div className="text-xs text-slate-400">Real-time configuration preview</div>
                    </div>

                    <div className="mt-4 space-y-3">
                        <div>
                            {payGradeSelected && (
                                <div className="flex my-2 flex-col items-start border border-amber-700 justify-between py-2 px-3 bg-slate-50 rounded">
                                    <span className="flex gap-2 items-center text-amber-500">
                                        <TrendingUp /> <span>Pay Grade</span>
                                    </span>
                                    <span className="text-amber-800 text-semibold">{payGradeSelected.name}</span>
                                    <span>{payGradeSelected.range}</span>
                                </div>
                            )}
                            {payFreq && (
                                <div className="flex my-2 items-start border border-blue-700 justify-between py-2 px-3 bg-slate-50 rounded">
                                    <span className="flex gap-2 items-center text-blue-500">
                                        <Clock /> <span>Frequency</span>
                                    </span>
                                    <span className="text-blue-800 text-semibold">{payFreq}</span>
                                </div>
                            )}
                            <div className="text-xs text-slate-500">Components ({selected.length})</div>
                            <div className="mt-2 space-y-2">
                                {selected.map((id) => {
                                    const c = components.find((x) => x.id === id);
                                    if (!c) return null;
                                    return (
                                        <div key={id} className="flex items-center justify-between py-2 px-3 bg-slate-50 rounded">
                                            <div className="text-sm">{c.name}</div>
                                            <div className="font-semibold">{(amounts[id] || 0).toLocaleString()}</div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        <div className="pt-3 border-t"></div>

                        <div className="mt-3">
                            <div className="mt-3 flex">
                                <button className="flex items-center justify-between w-full px-3 py-2 rounded-md bg-green-500 text-white font-semibold">
                                    Estimated Total{' '}
                                    <div>
                                        {currency}:{estimatedTotal.toLocaleString()}
                                    </div>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
