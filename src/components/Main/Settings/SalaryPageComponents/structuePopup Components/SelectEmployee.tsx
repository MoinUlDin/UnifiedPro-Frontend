import React, { useEffect, useState } from 'react';
import { User, CheckCircle } from 'lucide-react';
import EmployeeServices from '../../../../../services/EmployeeServices';
import { useDispatch } from 'react-redux';
import { EmployeeType } from '../../../../../constantTypes/Types';
import SalaryServices from '../../../../../services/SalaryServices';
import { useSelector } from 'react-redux';
import { BasicProfileType } from '../../../../../constantTypes/SalaryTypes';
import { getAbbrivation } from '../../../../../utils/Common';
export function getAbbr(f: string, s: string) {
    if (!f || !s) return 'N/A';
    return `${f.charAt(0).toUpperCase()}${s.charAt(0).toUpperCase()}`;
}

export default function SelectEmployee({ selectedEmployee, onSelect }: { selectedEmployee: any; onSelect: (data: any) => void }) {
    const allStructures = useSelector((s: any) => s.company.allStructures);
    const [employees, setEmployees] = useState<BasicProfileType[]>([]);
    const despatch = useDispatch();

    useEffect(() => {
        SalaryServices.FetchAllStructures(despatch)
            .then((r) => {
                setEmployees(r.basic_profiles);
            })
            .catch((e) => {
                console.log(e);
            });
    }, []);

    const [query, setQuery] = useState('');

    const filtered = employees.filter((e) => `${e.employee.name} ${e.department.name} ${e.job_type.name}`.toLowerCase().includes(query.toLowerCase()));

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
                                    {getAbbrivation(emp.employee.name)}
                                </div>
                                <div className="flex-1">
                                    <div className="font-medium text-slate-800">{emp.employee.name ?? 'emp'}</div>
                                    <div className="text-xs text-slate-500">{emp.department.name}</div>
                                    <div className="text-xs text-slate-400 mt-1">{emp.job_type.name}</div>
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
                        <div className="w-12 h-12 rounded-lg bg-white/20 flex items-center justify-center font-semibold">{getAbbrivation(selectedEmployee.employee.name)}</div>
                        <div>
                            <div className="font-semibold">{selectedEmployee.employee.name ?? 'Name N/A'}</div>
                            <div className="text-sm opacity-90">
                                {selectedEmployee.department.name} • {selectedEmployee.job_type.name}
                            </div>
                        </div>
                    </div>
                    <div className="text-sm">Selected Employee</div>
                </div>
            )}
        </div>
    );
}
