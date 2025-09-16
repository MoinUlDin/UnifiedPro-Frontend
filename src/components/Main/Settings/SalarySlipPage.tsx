import React, { useEffect, useMemo, useState } from 'react';
import { Search, Calendar, Eye, Printer, DownloadCloud, Filter } from 'lucide-react';
import SalarySlipDetail from './SalarySlipDetail';
import { SalarySlipDetailType } from '../../../constantTypes/SalaryTypes';
import SalaryServices from '../../../services/SalaryServices';

type Props = {
    slips?: SalarySlipDetailType[]; // optional: parent may pass initial data
};

const formatCurrency = (v?: number | string) => {
    const n = Number(v) || 0;
    return n.toLocaleString(undefined, { style: 'currency', currency: 'PKR', maximumFractionDigits: 0 });
};

export default function SalarySlipsPage({ slips }: Props) {
    const [query, setQuery] = useState('');
    const [month, setMonth] = useState('All');
    const [status, setStatus] = useState('All');
    const [selected, setSelected] = useState<SalarySlipDetailType | null>(null);
    const [salarySlip, setSalarySlip] = useState<SalarySlipDetailType[]>([]);
    const [loading, setLoading] = useState(false);

    // fetch if parent didn't provide data
    useEffect(() => {
        if (slips && slips.length) return; // parent provided
        setLoading(true);
        SalaryServices.FetchSalarySlip()
            .then((r) => setSalarySlip(r))
            .catch((e) => console.error(e))
            .finally(() => setLoading(false));
    }, [slips]);

    // source of truth: parent slips if provided else fetched
    const source = (slips && slips.length ? slips : salarySlip) || [];

    const months = useMemo(() => {
        const set = new Set<string>();
        source.forEach((s) => {
            const from = s.breakdown?.period?.from ?? s.From_date ?? '';
            if (!from) return;
            const d = new Date(from);
            const label = d.toLocaleString(undefined, { month: 'long', year: 'numeric' });
            set.add(label);
        });
        return ['All', ...Array.from(set)];
    }, [source]);

    const filtered = useMemo(() => {
        return source.filter((s) => {
            const name = s.breakdown?.employee_name?.toLowerCase() ?? '';
            if (query && !name.includes(query.toLowerCase())) return false;
            if (month !== 'All') {
                const from = s.breakdown?.period?.from ?? s.From_date ?? '';
                const d = new Date(from);
                const label = d.toLocaleString(undefined, { month: 'long', year: 'numeric' });
                if (label !== month) return false;
            }
            if (status !== 'All') {
                if ((s.status ?? '').toLowerCase() !== status.toLowerCase()) return false;
            }
            return true;
        });
    }, [source, query, month, status]);

    const totals = useMemo(() => {
        const totalSlips = source.length;
        const paidSlips = source.filter((s) => (s.status ?? '').toLowerCase() === 'paid').length;
        const totalPayout = source.reduce((sum, s) => sum + Number(s.breakdown?.net_payable ?? s.total_amount ?? 0), 0);
        const avgSalary = totalSlips ? Math.round(totalPayout / totalSlips) : 0;
        const advances = source.reduce((sum, s) => sum + Number(s.breakdown?.expense_claims_total ?? 0), 0);
        return { totalSlips, paidSlips, totalPayout, avgSalary, advances };
    }, [source]);

    return (
        <div className="p-6">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-indigo-600">Salary Slips</h1>
                    <p className="text-sm text-gray-500">Manage and view all employee salary slips</p>
                </div>
                <div>
                    <select className="form-input" onChange={() => {}} defaultValue="Admin">
                        <option>Admin</option>
                    </select>
                </div>
            </div>

            {/* Summary cards */}
            <div className="grid grid-cols-1 sm:grid-cols-5 gap-4 mb-6">
                <div className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white p-4 rounded-lg shadow">
                    <div className="text-sm flex items-center gap-2">Total Slips</div>
                    <div className="text-2xl font-bold">{totals.totalSlips}</div>
                </div>
                <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white p-4 rounded-lg shadow">
                    <div className="text-sm">Paid Slips</div>
                    <div className="text-2xl font-bold">{totals.paidSlips}</div>
                </div>
                <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-4 rounded-lg shadow">
                    <div className="text-sm">Total Payout</div>
                    <div className="text-2xl font-bold">{formatCurrency(totals.totalPayout)}</div>
                </div>
                <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white p-4 rounded-lg shadow">
                    <div className="text-sm">Avg Salary</div>
                    <div className="text-2xl font-bold">{formatCurrency(totals.avgSalary)}</div>
                </div>
                <div className="bg-gradient-to-r from-teal-500 to-green-500 text-white p-4 rounded-lg shadow">
                    <div className="text-sm">Advances</div>
                    <div className="text-2xl font-bold">{formatCurrency(totals.advances)}</div>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-lg shadow p-4 mb-6">
                <div className="flex gap-4 items-center">
                    <div className="flex items-center gap-2 flex-1 bg-gray-50 rounded px-3 py-2">
                        <Search className="w-5 h-5 text-gray-400" />
                        <input placeholder="Search employees..." className="w-full bg-transparent outline-none" value={query} onChange={(e) => setQuery(e.target.value)} />
                    </div>

                    <div className="flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-gray-400" />
                        <select className="form-input" value={month} onChange={(e) => setMonth(e.target.value)}>
                            {months.map((m) => (
                                <option key={m} value={m}>
                                    {m}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="flex items-center gap-2">
                        <Filter className="w-5 h-5 text-gray-400" />
                        <select className="form-input" value={status} onChange={(e) => setStatus(e.target.value)}>
                            <option value="All">All Status</option>
                            <option value="generated">Generated</option>
                            <option value="paid">Paid</option>
                        </select>
                    </div>

                    <div className="ml-auto text-sm text-gray-500">Showing {filtered.length} slips</div>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="min-w-full table-auto">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-4 py-3 text-left text-sm">Employee</th>
                            <th className="px-4 py-3 text-left text-sm">Pay Period</th>
                            <th className="px-4 py-3 text-left text-sm">Gross Salary</th>
                            <th className="px-4 py-3 text-left text-sm">Deductions</th>
                            <th className="px-4 py-3 text-left text-sm">Advances</th>
                            <th className="px-4 py-3 text-left text-sm">Net Pay</th>
                            <th className="px-4 py-3 text-left text-sm">Status</th>
                            <th className="px-4 py-3 text-center text-sm">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan={8} className="text-center py-8">
                                    Loading...
                                </td>
                            </tr>
                        ) : filtered.length === 0 ? (
                            <tr>
                                <td colSpan={8} className="text-center py-8">
                                    No salary slips found
                                </td>
                            </tr>
                        ) : (
                            filtered.map((s) => (
                                <tr key={s.id} className="border-t hover:bg-gray-50">
                                    <td className="px-4 py-4 align-top">
                                        <div className="font-semibold">{s.breakdown?.employee_name ?? 'Unknown'}</div>
                                        <div className="text-xs text-gray-500">EMP-{s.breakdown?.employee_id ?? s.basic_profile}</div>
                                        <div className="text-xs text-gray-400">Information Technology</div>
                                    </td>
                                    <td className="px-4 py-4 align-top">
                                        <div className="font-medium">{new Date(s.breakdown?.period?.from ?? s.From_date ?? '').toLocaleString(undefined, { month: 'long', year: 'numeric' })}</div>
                                        <div className="text-xs text-gray-400">
                                            {s.breakdown?.period?.from} - {s.breakdown?.period?.to}
                                        </div>
                                    </td>
                                    <td className="px-4 py-4 align-top text-green-600 font-semibold">{formatCurrency(s.breakdown?.gross_salary)}</td>
                                    <td className="px-4 py-4 align-top text-red-600">{formatCurrency(s.breakdown?.total_percentage_deductions ?? s.deduction)}</td>
                                    <td className="px-4 py-4 align-top text-amber-600">{formatCurrency(s.breakdown?.expense_claims_total)}</td>
                                    <td className="px-4 py-4 align-top text-indigo-600 font-semibold">{formatCurrency(s.breakdown?.net_payable ?? s.total_amount)}</td>
                                    <td className="px-4 py-4 align-top">
                                        <span className={`inline-block px-2 py-1 text-xs rounded-full ${s.status === 'paid' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                                            {' '}
                                            {s.status}
                                        </span>
                                    </td>
                                    <td className="px-4 py-4 align-top text-center">
                                        <div className="flex items-center justify-center gap-2">
                                            <button title="View" className="p-2 hover:bg-gray-100 rounded" onClick={() => setSelected(s)}>
                                                <Eye className="w-5 h-5" />
                                            </button>
                                            <button title="Print" className="p-2 hover:bg-gray-100 rounded" onClick={() => window.print()}>
                                                <Printer className="w-5 h-5" />
                                            </button>
                                            <button title="Download" className="p-2 hover:bg-gray-100 rounded">
                                                <DownloadCloud className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Detail modal / slide-over */}
            {selected && (
                <div className="fixed inset-0 z-50 flex">
                    <div className="absolute inset-0 bg-black/50" onClick={() => setSelected(null)} />
                    <div className="relative ml-auto w-full sm:w-3/4 lg:w-2/3 bg-white h-full overflow-auto">
                        <div className="p-4 border-b flex items-center justify-between">
                            <div className="text-lg font-semibold">Salary Slip Detail</div>
                            <div className="flex items-center gap-2">
                                <button className="btn" onClick={() => window.print()} title="Print">
                                    <Printer />
                                </button>
                                <button className="btn" onClick={() => setSelected(null)} title="Close">
                                    Close
                                </button>
                            </div>
                        </div>
                        <div className="p-6">
                            <SalarySlipDetail data={selected} />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
