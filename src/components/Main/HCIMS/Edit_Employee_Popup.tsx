import { useState, Fragment, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import SettingServices from '../../../services/SettingServices';
import IconX from '../../Icon/IconX';
import IconCaretDown from '../../Icon/IconCaretDown';
import EmployeeServices from '../../../services/EmployeeServices';
import Swal from 'sweetalert2';

interface Designation {
    id: number;
    name: string;
    department: number; // FK
    parent: number | null;
    department_name: string;
}

interface Department {
    id: number;
    name: string;
    expected_arrival_time: string | null;
    parent: number | null;
}
interface InitialDatatype {
    id: number;
    email?: string;
    first_name: string;
    last_name: string;
    department: { id: number; name: string };
    designation: { id: number; name: string };
    hire_date: string;
}
interface InputProps {
    closeModal: () => void;
    isEditMode?: boolean;
    initailData?: InitialDatatype | null;
    response?: (data: any) => void;
}

export default function Edit_Employee_Popup({ closeModal, isEditMode = false, initailData = null, response = () => {} }: InputProps) {
    const [params, setParams] = useState({
        email: '',
        password: '',
        password2: '',
        first_name: '',
        last_name: '',
        designation: '', // string so it works with <select>
        department: '',
        hire_date: '',
        profile_image: null as File | null,
    });
    const [loadingInitialdata, setLoadingInitailData] = useState<boolean>(false);
    const [departments, setDepartments] = useState<Department[]>([]);
    const [allDesignations, setAllDesignations] = useState<Designation[]>([]);
    const [filteredDesigs, setFilteredDesigs] = useState<Designation[]>([]);
    const [errors, setErrors] = useState<Partial<Record<keyof typeof params, string>>>({});
    useEffect(() => {
        // fetch departments
        SettingServices.fetchParentDepartments()
            .then((r) => setDepartments(r))
            .catch(console.error);
        // fetch all designations
        SettingServices.fetchDesignations()
            .then((r) => setAllDesignations(r))
            .catch(console.error);
    }, []);

    // when department changes, recompute filtered designations
    useEffect(() => {
        if (loadingInitialdata) return;
        if (params.department) {
            const depId = parseInt(params.department, 10);
            setFilteredDesigs(allDesignations.filter((d) => d.department === depId));
        } else {
            setFilteredDesigs([]);
        }
    }, [params.department, allDesignations]);

    // 1) whenever initailData arrives, copy it into state
    useEffect(() => {
        if (isEditMode && initailData) {
            setLoadingInitailData(true);
            console.log('initial data:', initailData);
            const desigObj = allDesignations.find((d) => d.id === Number(initailData.designation));
            const desigId = desigObj ? String(desigObj.id) : '';

            setParams({
                email: initailData?.email!,
                password: '',
                password2: '',
                first_name: initailData.first_name,
                last_name: initailData.last_name,
                department: String(initailData.department.id),
                designation: String(initailData.designation.id),
                hire_date: initailData.hire_date,
                profile_image: null, // you can’t prefill a File input
            });
        }

        setLoadingInitailData(false);
    }, [isEditMode, initailData, allDesignations]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { id, value } = e.target;
        setParams((p) => ({ ...p, [id]: value }));
        // clear error for this field
        setErrors((err) => ({ ...err, [id]: undefined }));
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        setParams((p) => ({ ...p, profile_image: file }));
    };

    const validate = () => {
        const errs: typeof errors = {};

        // always required:
        if (!params.first_name.trim()) errs.first_name = 'First name is required';
        if (!params.last_name.trim()) errs.last_name = 'Last name is required';

        // department & designation & hire_date always required
        if (!params.department) errs.department = 'Department is required';
        if (!params.designation) errs.designation = 'Designation is required';
        if (!params.hire_date) errs.hire_date = 'Hire date is required';

        // **only** in create mode do we require email/password/file
        if (!isEditMode) {
            if (!params.email.trim()) errs.email = 'Email is required';
            if (!params.password) errs.password = 'Password is required';
            if (!params.password2) errs.password2 = 'Please confirm password';
            if (params.password !== params.password2) errs.password2 = 'Passwords must match';
            // you could also require profile_image here if you want:
            // if (!params.profile_image) errs.profile_image = 'Photo is required';
        }

        setErrors(errs);
        return Object.keys(errs).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validate()) return;
        const form = new FormData();
        Object.entries(params).forEach(([key, value]) => {
            if (value != null) form.append(key, value as any);
        });
        console.log('sending Update Reques with Data: ', FormData);
        let responseToParent = null;

        try {
            if (isEditMode && initailData) {
                // 3) call update endpoint
                await EmployeeServices.UpdateEmployee(initailData.id, form).then(() => {
                    responseToParent = {
                        error: false,
                        message: 'Employee Updated Successfully',
                    };
                });
            } else {
                await EmployeeServices.AddEmployee(form).then(() => {
                    responseToParent = {
                        error: false,
                        message: 'Employee Added Successfully',
                    };
                });
            }
            response(responseToParent);
            closeModal();
        } catch (err: any) {
            console.error(err);
            Swal.fire({
                title: 'Error',
                titleText: err,
                icon: 'error',
            });
        }
    };

    return (
        <Transition appear show as={Fragment}>
            <Dialog as="div" className="relative z-50" onClose={closeModal}>
                <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
                    <div className="fixed inset-0 bg-black bg-opacity-25" />
                </Transition.Child>

                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex items-center justify-center min-h-full p-4 text-start">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <Dialog.Panel className="w-full max-w-xl bg-white p-6 rounded-lg shadow-xl">
                                <button onClick={closeModal} className="absolute top-4 right-4 text-gray-500 hover:text-gray-800">
                                    <IconX />
                                </button>
                                <h2 className="text-lg font-medium mb-4 text-center">Add / Edit Employee</h2>
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    {/* First Name */}
                                    <div>
                                        <label htmlFor="first_name">First Name</label>
                                        <input id="first_name" type="text" placeholder="Moin" className="form-input w-full" value={params.first_name} onChange={handleChange} />
                                        {errors.first_name && <p className="text-red-600">{errors.first_name}</p>}
                                    </div>

                                    {/* Last Name */}
                                    <div>
                                        <label htmlFor="last_name">Last Name</label>
                                        <input id="last_name" type="text" className="form-input w-full" placeholder="Ul Din" value={params.last_name} onChange={handleChange} />
                                        {errors.last_name && <p className="text-red-600">{errors.last_name}</p>}
                                    </div>

                                    <div>
                                        {/* Email */}
                                        <label htmlFor="email">Email</label>
                                        <input id="email" type="email" placeholder="email@google.com" className="form-input w-full" value={params.email} onChange={handleChange} />
                                        {errors.email && <p className="text-red-600">{errors.email}</p>}
                                    </div>

                                    {!isEditMode && (
                                        <div className="grid grid-cols-2 gap-4">
                                            {/* Password & Confirm */}
                                            <div>
                                                <label htmlFor="password">Password</label>
                                                <input id="password" placeholder="Enter your password" type="password" className="form-input w-full" value={params.password} onChange={handleChange} />
                                                {errors.password && <p className="text-red-600">{errors.password}</p>}
                                            </div>
                                            <div>
                                                <label htmlFor="password2">Confirm Password</label>
                                                <input
                                                    id="password2"
                                                    placeholder="Confirm your password"
                                                    type="password"
                                                    className="form-input w-full"
                                                    value={params.password2}
                                                    onChange={handleChange}
                                                />
                                                {errors.password2 && <p className="text-red-600">{errors.password2}</p>}
                                            </div>
                                        </div>
                                    )}

                                    {/* Hire Date */}
                                    <div>
                                        <label htmlFor="hire_date">Hire Date</label>
                                        <input id="hire_date" type="date" className="form-input w-full" value={params.hire_date} onChange={handleChange} />
                                        {errors.hire_date && <p className="text-red-600">{errors.hire_date}</p>}
                                    </div>

                                    {/* Profile Image */}

                                    <div>
                                        <label htmlFor="profile_image">Photo</label>
                                        <input id="profile_image" type="file" className="form-input w-full" onChange={handleImageUpload} />
                                    </div>

                                    {/* Department & Designation */}
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="relative">
                                            <label htmlFor="department">Department</label>
                                            <select id="department" className="form-input w-full pr-8" value={params.department} onChange={handleChange}>
                                                <option disabled value="">
                                                    Select depart...
                                                </option>
                                                {departments.map((d) => (
                                                    <option key={d.id} value={String(d.id)}>
                                                        {d.name}
                                                    </option>
                                                ))}
                                            </select>
                                            <IconCaretDown className="absolute top-9 right-3 pointer-events-none" />
                                            {errors.department && <p className="text-red-600">{errors.department}</p>}
                                        </div>

                                        <div className="relative">
                                            <label htmlFor="designation">Designation</label>
                                            <select id="designation" className="form-input w-full pr-8" value={params.designation} onChange={handleChange} disabled={!filteredDesigs.length}>
                                                <option disabled value="">
                                                    Select designa...
                                                </option>
                                                {filteredDesigs.map((d) => (
                                                    <option key={d.id} value={d.id}>
                                                        {d.name}
                                                    </option>
                                                ))}
                                            </select>
                                            <IconCaretDown className="absolute top-9 right-3 pointer-events-none" />
                                            {errors.designation && <p className="text-red-600">{errors.designation}</p>}
                                        </div>
                                    </div>

                                    {/* Submit */}
                                    <div className="flex justify-end mt-6">
                                        <button type="button" onClick={closeModal} className="btn btn-outline-danger mr-3">
                                            Cancel
                                        </button>
                                        <button type="submit" className="btn btn-primary">
                                            {isEditMode ? 'Update' : 'Add'}
                                        </button>
                                    </div>
                                </form>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
}
