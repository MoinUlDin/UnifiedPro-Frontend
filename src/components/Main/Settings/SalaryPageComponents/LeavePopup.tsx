import React, { useEffect, useState } from 'react';
import SettingServices from '../../../../services/SettingServices';
import SalaryServices from '../../../../services/SalaryServices';
import toast from 'react-hot-toast';
interface Department {
    id: number;
    name: string;
}

interface HolidayForm {
    name: string;
    annual_allowance: number;
    from_date: string;
    to_date: string;
    department: string | '';
}

interface Props {
    isOpen: boolean;
    initialData: any;
    onClose: () => void;
    onSubmit: () => void;
}

const LeavePopup: React.FC<Props> = ({ initialData = null, isOpen, onClose, onSubmit }) => {
    const [departments, setDepartments] = useState<Department[]>([]);
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [form, setForm] = useState<HolidayForm>({
        name: initialData?.name || '',
        annual_allowance: initialData?.annual_allowance || 0,
        from_date: initialData?.from_date || '',
        to_date: initialData?.to_date || '',
        department: initialData?.department ? String(initialData.department) : '',
    });

    useEffect(() => {
        SettingServices.fetchParentDepartments()
            .then((res) => {
                setDepartments(res || []);
                console.log('department: ', res);
            })
            .catch((err) => {
                console.error('Error fetching departments', err);
            });
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: name === 'annual_allowance' ? Number(value) : value,
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.department) {
            alert('Please select a department');
            return;
        }
        const payload = {
            ...form,
            department: Number(form.department), // convert here
        };
        if (!isEditing) {
            SalaryServices.AddLeaveTypes(payload)
                .then(() => {
                    toast.success('Leave Type Created Successfully', { duration: 4000 });
                    onSubmit();
                    onClose();
                })
                .catch((e) => {
                    toast.error(e.message);
                });
        } else {
            SalaryServices.UpdateLeaveTypes(initialData.id, payload)
                .then(() => {
                    toast.success('Leave Type Updated Successfully', { duration: 4000 });
                    onSubmit();
                    onClose();
                })
                .catch((e) => {
                    toast.error(e.message);
                });
        }
    };
    useEffect(() => {
        console.log('Initail Data We Got: ', initialData);
        if (initialData) {
            setIsEditing(true);
            setForm({
                name: initialData.name || '',
                annual_allowance: initialData.annual_allowance || 0,
                from_date: initialData.from_date || '',
                to_date: initialData.to_date || '',
                department: initialData.department ? String(initialData.department) : '',
            });
        }
    }, [initialData]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-lg p-6">
                <h2 className="text-xl font-semibold mb-4">{isEditing ? 'Update Leave Type' : 'Add Leave Type'} </h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Name</label>
                        <input type="text" name="name" value={form.name} onChange={handleChange} className="w-full border rounded-md px-3 py-2" required />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Annual Allowance</label>
                        <input type="number" name="annual_allowance" value={form.annual_allowance} onChange={handleChange} className="w-full border rounded-md px-3 py-2" required />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">From Date</label>
                        <input type="date" name="from_date" value={form.from_date} onChange={handleChange} className="w-full border rounded-md px-3 py-2" required />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">To Date</label>
                        <input type="date" name="to_date" value={form.to_date} onChange={handleChange} className="w-full border rounded-md px-3 py-2" required />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Department</label>
                        <select name="department" value={form.department} onChange={handleChange} className="w-full border rounded-md px-3 py-2" required>
                            <option value="">Select department</option>
                            {departments.map((dep) => (
                                <option key={dep.id} value={dep.id.toString()}>
                                    {dep.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="flex justify-end gap-3">
                        <button type="button" onClick={onClose} className="px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-300">
                            Cancel
                        </button>
                        <button type="submit" className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700">
                            {isEditing ? 'Update' : 'Create'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default LeavePopup;
