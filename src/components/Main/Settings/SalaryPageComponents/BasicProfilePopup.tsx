// src/components/PayGradePopup.tsx
import { useState, useEffect } from 'react';
import SalaryServices from '../../../../services/SalaryServices';
import toast from 'react-hot-toast';
import { capitalizeName } from '../../../../utils/Common';
import { BasicProfileType } from '../../../../constantTypes/SalaryTypes';
import SettingServices from '../../../../services/SettingServices';
import EmployeeServices from '../../../../services/EmployeeServices';
import { promises } from 'dns';
import { useDispatch } from 'react-redux';

interface PayGradeModalProps {
    show: boolean;
    initialData?: BasicProfileType | null;
    onClose: () => void;
    sendResponse?: (data: any) => void;
}

export default function BasicProfilePopup({ show, initialData, onClose, sendResponse }: PayGradeModalProps) {
    const [department, setDepartment] = useState(-1);
    const [jobType, setJobType] = useState(-1);
    const [payStartDate, setPayStartDate] = useState('');
    const [employee, setEmployee] = useState(-1);
    const [loading, setLoading] = useState<boolean>(false);
    const [data, setData] = useState<any>();
    const [dList, setdList] = useState<any>();
    const [jList, setjList] = useState<any>();
    const [eList, seteList] = useState<any>();

    const dispatch = useDispatch();
    useEffect(() => {
        let mounted = true; // prevent state updates after unmount

        (async () => {
            setLoading(true);
            try {
                // run all requests in parallel
                const [deptRes, jobTypeRes, empRes] = await Promise.all([
                    SettingServices.fetchParentDepartments(), // returns Promise<Department[]>
                    SalaryServices.FetchJobs(), // Promise<JobType[]>
                    EmployeeServices.FetchEmployees(dispatch), // Promise<Employee[]>
                ]);

                if (!mounted) return;

                setdList(deptRes);
                setjList(jobTypeRes);
                seteList(empRes);
            } catch (err: any) {
                console.error('Failed to load data', err);
                toast.error(err?.message || 'Failed to load form data');
            } finally {
                if (mounted) setLoading(false);
            }
        })();

        return () => {
            mounted = false;
        };
    }, [show]);

    // Populate fields when editing
    useEffect(() => {
        if (initialData) {
            setDepartment(initialData?.department?.id);
            setJobType(initialData?.job_type.id);
            setPayStartDate(initialData?.pay_start_date);
            setEmployee(initialData?.employee?.id);
        } else {
            setDepartment(-1);
            setJobType(-1);
            setPayStartDate('');
            setEmployee(-1);
        }
    }, [initialData, show]);

    if (!show) return null;

    const handleSubmit = async () => {
        // simple front-end validation
        if (!department) {
            toast.error('Department is required');
            return;
        }
        if (!jobType) {
            toast.error('jobType is required');
            return;
        }
        if (!payStartDate) {
            toast.error('Pay Start Date is required');
            return;
        }

        let payload: any = {
            department: department,
            job_type: jobType,
            pay_start_date: payStartDate,
        };
        if (employee) {
            payload = {
                ...payload,
                employee: employee,
            };
        }

        try {
            if (initialData?.id) {
                console.log('Id: ', initialData.id, 'payLoad: ', payload);

                await SalaryServices.UpdateBasicProfile(initialData.id, payload);
                toast.success('Deduction updated successfully', { duration: 4000 });
                sendResponse?.('Deduction updated successfully');
            } else {
                await SalaryServices.AddBasicProfile(payload);
                toast.success('Deduction Created Successfully', { duration: 4000 });
                sendResponse?.('Deduction updated successfully');
            }
            onClose();
        } catch (err: any) {
            toast.error(err.message || 'Something went wrong');
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-md mx-4">
                <div className="px-6 py-4 border-b">
                    <h2 className="text-lg font-semibold text-gray-800">{initialData ? 'Edit Frequency' : 'New Frequency'}</h2>
                </div>
                <form
                    className="px-6 py-4 space-y-4"
                    onSubmit={(e) => {
                        e.preventDefault();
                        handleSubmit();
                    }}
                >
                    {/* Department */}
                    <div>
                        <label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-1">
                            Department
                        </label>
                        <select
                            id="department"
                            onChange={(e) => setDepartment(Number(e.target.value))}
                            value={department}
                            required
                            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                        >
                            <option disabled value={-1}>
                                --Select Department--
                            </option>
                            {dList &&
                                dList.map((d: any) => (
                                    <option key={`D-${d.id}`} value={d.id}>
                                        {d.name}
                                    </option>
                                ))}
                        </select>
                    </div>
                    {/* JobType */}
                    <div>
                        <label htmlFor="JobType" className="block text-sm font-medium text-gray-700 mb-1">
                            JobType
                        </label>
                        <select
                            id="JobType"
                            onChange={(e) => setJobType(Number(e.target.value))}
                            value={jobType}
                            required
                            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                        >
                            <option disabled value={-1}>
                                --Select job Type--
                            </option>
                            {jList &&
                                jList.map((d: any) => (
                                    <option key={`D-${d.id}`} value={d.id}>
                                        {d.name}
                                    </option>
                                ))}
                        </select>
                    </div>
                    {/* Pay Start Date */}
                    <div>
                        <label htmlFor="JobType" className="block text-sm font-medium text-gray-700 mb-1">
                            Pay Start Date
                        </label>
                        <input
                            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                            value={payStartDate}
                            onChange={(e) => setPayStartDate(e.target.value)}
                            type="date"
                            name=""
                            id=""
                        />
                    </div>
                    {/* Employee */}
                    <div>
                        <label htmlFor="Employee" className="block text-sm font-medium text-gray-700 mb-1">
                            Employee
                        </label>
                        <select
                            id="Employee"
                            onChange={(e) => setEmployee(Number(e.target.value))}
                            value={employee}
                            required
                            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                        >
                            <option disabled value={-1}>
                                --Select Employee--
                            </option>
                            {eList &&
                                eList.map((d: any) => (
                                    <option key={`D-${d.id}`} value={d.id}>
                                        {d.first_name}
                                    </option>
                                ))}
                        </select>
                    </div>

                    {/* Buttons */}
                    <div className="flex justify-end space-x-3 pt-2 border-t">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-white border border-gray-300 rounded hover:bg-gray-50">
                            Cancel
                        </button>
                        <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700">
                            {initialData ? 'Update' : 'Create'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
