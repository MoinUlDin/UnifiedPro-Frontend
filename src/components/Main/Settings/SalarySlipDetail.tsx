import React from 'react';
import { User, Calendar, Hash, Home, Truck, PlusSquare, MinusSquare, FileText, CreditCard } from 'lucide-react';

import { Period, ComponentItem, Breakdown, SalarySlipDetailType } from '../../../constantTypes/SalaryTypes';

/*
  Usage:
    <SalarySlipDetail data={salaryDetail} />
*/

const formatCurrency = (v?: number | string) => {
    const n = Number(v) || 0;
    return n.toLocaleString(undefined, { style: 'currency', currency: 'PKR', maximumFractionDigits: 0 });
};

const smallFormat = (v?: number | string) => {
    const n = Number(v) || 0;
    return n.toLocaleString();
};

const LabelValue: React.FC<{ label: string; value: React.ReactNode; className?: string }> = ({ label, value, className }) => (
    <div className={`flex justify-between items-start ${className ?? ''}`}>
        <div className="text-sm text-muted-foreground">{label}</div>
        <div className="text-sm font-medium">{value}</div>
    </div>
);

export default function SalarySlipDetail({ data }: { data: SalarySlipDetailType }) {
    const b = data.breakdown || ({} as Breakdown);
    const net = Number(b.net_payable ?? data.total_amount ?? 0);
    const gross = Number(b.gross_salary ?? 0);
    const deductions = Number(b.total_percentage_deductions ?? data.deduction ?? 0) + Number(b.work_deduction ?? 0);
    const advances: { title: string; amount: number; date?: string }[] = [];
    const bonus = Number(b.manual_bonus);

    // If your API returns advances/expense claims, map them here. For now we assume none.

    return (
        <div className="max-w-4xl mx-auto p-6 space-y-6">
            {/* Header card */}
            <div className="rounded-xl overflow-hidden shadow">
                <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 px-6 py-6 text-white">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-2xl font-bold">SALARY SLIP</h2>
                            <div className="text-sm opacity-90">
                                Pay Period: {b.period?.from ?? data.From_date} - {b.period?.to ?? data.To_date}
                            </div>
                        </div>
                        <div className="text-right">
                            <div className="text-sm opacity-90">Net Pay</div>
                            <div className="text-3xl font-extrabold">{formatCurrency(net)}</div>
                        </div>
                    </div>

                    <div className="mt-4 grid grid-cols-3 gap-4 items-center">
                        <div className="flex items-center gap-3 col-span-2">
                            <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                                <User className="w-6 h-6" />
                            </div>
                            <div>
                                <div className="font-semibold">{b.employee_name ?? 'Unknown'}</div>
                                <div className="text-sm opacity-90">EMP-{b.employee_id ?? data.basic_profile}</div>
                                <div className="text-xs opacity-80">{data.remarks ?? ''}</div>
                            </div>
                        </div>

                        <div className="text-right">
                            <div className="text-xs">Department</div>
                            <div className="font-medium">Information Technology</div>
                            <div className="text-xs">Pay Date: {data.updated_at ? new Date(data.updated_at).toLocaleDateString() : ''}</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Earnings & Deductions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white rounded-lg shadow-sm p-4">
                    <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2 text-green-600 font-semibold">
                            <PlusSquare /> <span>+ Earnings</span>
                        </div>
                        <div className="text-sm font-bold">{formatCurrency(b.total_earnings)}</div>
                    </div>

                    <div className="space-y-3">
                        {b.components?.map((c, idx) => (
                            <div key={idx} className="flex justify-between items-center">
                                <div className="text-sm">{c.component}</div>
                                <div className="text-sm font-medium">{formatCurrency(c.amount)}</div>
                            </div>
                        ))}

                        <div className="border-t pt-3 mt-3">
                            <div className="flex justify-between items-center text-lg font-semibold">
                                <div>Gross Salary</div>
                                <div>{formatCurrency(b.gross_salary)}</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm p-4">
                    <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2 text-red-600 font-semibold">
                            <MinusSquare /> <span>- Deductions</span>
                        </div>
                        <div className="text-sm font-bold">{formatCurrency(deductions)}</div>
                    </div>

                    <div className="space-y-3">
                        {/* Example deductions. You might have a dedicated breakdown in API — adapt accordingly. */}
                        <div className="flex justify-between items-center">
                            <div className="text-sm">Income Tax</div>
                            <div className="text-sm font-medium">{formatCurrency(b.total_percentage_deductions)}</div>
                        </div>
                        <div className="flex justify-between items-center">
                            <div className="text-sm">Work Deduction</div>
                            <div className="text-sm font-medium">{formatCurrency(b.work_deduction)}</div>
                        </div>

                        <div className="border-t pt-3 mt-3">
                            <div className="flex justify-between items-center text-lg font-semibold">
                                <div>Total Deductions</div>
                                <div>{formatCurrency(deductions)}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Advances / Deductions detail box */}
            <div className="bg-amber-50 border border-amber-100 rounded-lg p-4">
                <div className="font-semibold mb-2">Advance Payments Deducted</div>
                {advances.length === 0 ? (
                    <div className="text-sm opacity-70">No advances deducted.</div>
                ) : (
                    advances.map((a, i) => (
                        <div key={i} className="flex justify-between items-center py-2 border-b last:border-b-0">
                            <div>
                                <div className="text-sm">{a.title}</div>
                                <div className="text-xs opacity-80">Date: {a.date}</div>
                            </div>
                            <div className="font-medium">-{formatCurrency(a.amount)}</div>
                        </div>
                    ))
                )}

                <div className="pt-3 border-t mt-3 flex justify-between font-semibold">
                    <div>Total Advances Deducted</div>
                    <div>-{formatCurrency(advances.reduce((s, a) => s + a.amount, 0))}</div>
                </div>
            </div>

            {/* Summary */}
            <div className="bg-white rounded-lg shadow p-4">
                <div className="grid grid-cols-2 gap-4">
                    <div className="text-sm">Gross Salary</div>
                    <div className="text-right font-semibold">{formatCurrency(gross)}</div>
                    <div className="text-sm">Bonus</div>
                    <div className="text-right font-semibold">{formatCurrency(bonus)}</div>

                    <div className="text-sm">Total Deductions</div>
                    <div className="text-right text-red-600 font-semibold">-{formatCurrency(deductions)}</div>

                    <div className="text-sm">Advance Deducted</div>
                    <div className="text-right text-red-600 font-semibold">-{formatCurrency(advances.reduce((s, a) => s + a.amount, 0))}</div>

                    <div className="col-span-2 h-px bg-gray-100 my-2" />

                    <div className="text-lg">Net Pay</div>
                    <div className="text-right text-2xl font-extrabold text-indigo-600">{formatCurrency(net)}</div>
                </div>
            </div>

            <div className="text-xs text-center text-muted-foreground">Generated at: {data.created_at ? new Date(data.created_at).toLocaleString() : ''}</div>
        </div>
    );
}
