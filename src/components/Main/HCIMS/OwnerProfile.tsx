import React, { useEffect, useState, ChangeEvent, useRef } from 'react';
import { User, Mail, Phone, Calendar, Camera, Save, Lock, Key, Edit, Eye } from 'lucide-react';

// Assume OwnerServices exists and provides the following methods:
// - fetchProfile(): Promise<OwnerProfile>
// - updateProfile(formData: FormData | object): Promise<any>
// - changePassword(payload: { old_password: string; new_password: string; confirm_password: string }): Promise<any>
import OwnerServices from '../../../services/OwnerServices';
import { CheckOwner, getUser } from '../../../utils/Common';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

interface OwnerProfile {
    id: number;
    profile_image?: string | null;
    first_name: string;
    last_name: string;
    date_of_birth?: string | null; // ISO date
    cnic?: string | null;
    marital_status?: string | null;
    hire_date?: string | null;
    employee_id?: string | null;
    contact_number?: string | null;
    email: string; // read-only
}

export default function OwnerProfilePage() {
    const [profile, setProfile] = useState<OwnerProfile | null>(null);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const owner = CheckOwner();
    const navigate = useNavigate();

    // local form state (editable fields)
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [dateOfBirth, setDateOfBirth] = useState<string | undefined>(undefined);
    const [contactNumber, setContactNumber] = useState<string | undefined>(undefined);
    const [cnic, setCnic] = useState<string | undefined>(undefined);
    const [maritalStatus, setMaritalStatus] = useState<string | undefined>(undefined);
    const [hireDate, setHireDate] = useState<string | undefined>(undefined);
    const [employeeId, setEmployeeId] = useState<string | undefined>(undefined);
    const [profileImageFile, setProfileImageFile] = useState<File | null>(null);
    const [profileImagePreview, setProfileImagePreview] = useState<string | null>(null);

    // password change UI
    const [showPasswordBox, setShowPasswordBox] = useState(false);
    const [pwOld, setPwOld] = useState('');
    const [pwNew, setPwNew] = useState('');
    const [pwNewConfirm, setPwNewConfirm] = useState('');
    const [pwLoading, setPwLoading] = useState(false);
    const [pwMessage, setPwMessage] = useState<string | null>(null);
    const [pwError, setPwError] = useState<string | null>(null);
    const pwSectionRef = useRef<HTMLDivElement | null>(null);
    const pwOldInputRef = useRef<HTMLInputElement | null>(null);
    const [oldp, setoldp] = useState<boolean>(false);
    const [newp, setnewp] = useState<boolean>(false);
    const [newp1, setnewp1] = useState<boolean>(false);

    // scroll + focus when the password box is shown
    useEffect(() => {
        if (showPasswordBox && pwSectionRef.current) {
            // smooth scroll into view and center the element in viewport
            pwSectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });

            // small timeout to ensure scrolling happened and element is focusable
            setTimeout(() => {
                pwOldInputRef.current?.focus();
            }, 250);
        }
    }, [showPasswordBox]);

    useEffect(() => {
        if (!owner) return;
        setLoading(true);
        OwnerServices.fetchProfile()
            .then((r) => {
                setProfile(r);
                setFirstName(r.first_name || '');
                setLastName(r.last_name || '');
                setDateOfBirth(r.date_of_birth || undefined);
                setContactNumber(r.contact_number || undefined);
                setCnic(r.cnic || undefined);
                setMaritalStatus(r.marital_status || undefined);
                setHireDate(r.hire_date || undefined);
                setEmployeeId(r.employee_id || undefined);
                setProfileImagePreview(r.profile_image || null);
            })
            .catch((e) => {
                console.error(e);
                setError('Failed to load profile');
            })
            .finally(() => setLoading(false));
    }, []);

    function handleImageChange(e: ChangeEvent<HTMLInputElement>) {
        const f = e.target.files && e.target.files[0];
        if (f) {
            setProfileImageFile(f);
            const url = URL.createObjectURL(f);
            setProfileImagePreview(url);
        }
    }

    async function handleSave(e?: React.FormEvent) {
        if (!owner) return;
        if (e) e.preventDefault();
        setSaving(true);
        setMessage(null);
        setError(null);

        try {
            // Use FormData if there's a file, otherwise send JSON
            if (profileImageFile) {
                const fd = new FormData();
                fd.append('first_name', firstName);
                fd.append('last_name', lastName);
                if (dateOfBirth) fd.append('date_of_birth', dateOfBirth);
                if (contactNumber) fd.append('contact_number', contactNumber);
                if (cnic) fd.append('cnic', cnic);
                if (maritalStatus) fd.append('marital_status', maritalStatus);
                if (hireDate) fd.append('hire_date', hireDate);
                if (employeeId) fd.append('employee_id', employeeId);
                fd.append('profile_image', profileImageFile);

                await OwnerServices.updateProfile(fd);
            } else {
                const payload: any = {
                    first_name: firstName,
                    last_name: lastName,
                    date_of_birth: dateOfBirth,
                    contact_number: contactNumber,
                    cnic,
                    marital_status: maritalStatus,
                    hire_date: hireDate,
                    employee_id: employeeId,
                };
                // remove undefined keys
                Object.keys(payload).forEach((k) => payload[k] === undefined && delete payload[k]);
                await OwnerServices.updateProfile(payload);
            }

            setMessage('Profile updated successfully.');
            // refresh profile
            const updated = await OwnerServices.fetchProfile();
            setProfile(updated);
        } catch (err: any) {
            console.error(err);
            setError(err?.message || 'Failed to update profile');
        } finally {
            setSaving(false);
        }
    }

    async function handleChangePassword(e?: React.FormEvent) {
        if (!owner) return;
        if (e) e.preventDefault();
        setPwLoading(true);
        setPwError(null);
        setPwMessage(null);

        if (pwNew !== pwNewConfirm) {
            setPwError('New passwords do not match');
            setPwLoading(false);
            return;
        }

        try {
            await OwnerServices.changePassword({ old_password: pwOld, new_password: pwNew, confirm_password: pwNewConfirm });
            setPwMessage('Password changed successfully.');
            setPwOld('');
            setPwNew('');
            setPwNewConfirm('');
            setShowPasswordBox(false);
            toast.success('Password changed successfully.');
        } catch (err: any) {
            console.error(err);
            const msg = err?.response?.data?.old_password || 'Failed to change password';
            setPwError(msg);
        } finally {
            setPwLoading(false);
        }
    }

    if (!owner) {
        const userInfo = getUser();
        setTimeout(() => {
            navigate(`/employees/${userInfo?.id}/profile`);
        }, 200);
    }
    return (
        <div className="max-w-4xl mx-auto p-6">
            <header className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-semibold">Owner Profile</h1>
                <div className="flex items-center gap-3">
                    <button onClick={() => setShowPasswordBox(true)} className="flex items-center gap-2 px-3 py-2 bg-white border rounded shadow-sm hover:bg-gray-50" title="Change password">
                        <Key size={16} />
                        <span className="hidden sm:inline">Change Password</span>
                    </button>
                </div>
            </header>

            {loading ? (
                <div className="p-6 bg-white rounded shadow">Loading...</div>
            ) : error ? (
                <div className="p-4 bg-red-50 text-red-700 rounded">{error}</div>
            ) : (
                <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <section className="md:col-span-1 bg-white p-4 rounded shadow">
                        <div className="flex flex-col items-center">
                            <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-100 mb-3 flex items-center justify-center">
                                {profileImagePreview ? (
                                    // eslint-disable-next-line @next/next/no-img-element
                                    <img src={profileImagePreview} alt="avatar" className="object-cover w-full h-full" />
                                ) : (
                                    <User size={48} />
                                )}
                            </div>
                            <label className="flex items-center gap-2 text-sm cursor-pointer">
                                <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                                <Camera size={14} />
                                <span className="text-blue-600">Upload photo</span>
                            </label>

                            <div className="w-full mt-4 text-center text-sm text-gray-600">
                                <div className="font-medium">
                                    {profile?.first_name} {profile?.last_name}
                                </div>
                                <div className="text-xs">{profile?.email}</div>
                            </div>
                        </div>
                    </section>

                    <section className="md:col-span-2 bg-white p-6 rounded shadow">
                        {message && <div className="mb-4 p-3 bg-green-50 text-green-700 rounded">{message}</div>}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium">First name</label>
                                <div className="mt-1 relative">
                                    <input value={firstName} onChange={(e) => setFirstName(e.target.value)} className="w-full border rounded px-3 py-2" required />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium">Last name</label>
                                <div className="mt-1 relative">
                                    <input value={lastName} onChange={(e) => setLastName(e.target.value)} className="w-full border rounded px-3 py-2" required />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium">Email (read-only)</label>
                                <div className="mt-1 relative flex items-center gap-2">
                                    <Mail size={16} />
                                    <input value={profile?.email || ''} readOnly className="w-full bg-gray-50 border rounded px-3 py-2" />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium">Contact number</label>
                                <div className="mt-1 relative flex items-center gap-2">
                                    <Phone size={16} />
                                    <input value={contactNumber || ''} onChange={(e) => setContactNumber(e.target.value)} className="w-full border rounded px-3 py-2" />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium">Date of birth</label>
                                <div className="mt-1 relative flex items-center gap-2">
                                    <Calendar size={16} />
                                    <input type="date" value={dateOfBirth || ''} onChange={(e) => setDateOfBirth(e.target.value)} className="w-full border rounded px-3 py-2" />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium">CNIC</label>
                                <div className="mt-1 relative">
                                    <input value={cnic || ''} onChange={(e) => setCnic(e.target.value)} className="w-full border rounded px-3 py-2" />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium">Marital status</label>
                                <div className="mt-1 relative">
                                    <select value={maritalStatus || ''} onChange={(e) => setMaritalStatus(e.target.value)} className="w-full border rounded px-3 py-2">
                                        <option value="">Select</option>
                                        <option value="Single">Single</option>
                                        <option value="Married">Married</option>
                                        <option value="Divorced">Divorced</option>
                                        <option value="Widowed">Widowed</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium">Hire date</label>
                                <div className="mt-1 relative flex items-center gap-2">
                                    <Calendar size={16} />
                                    <input type="date" value={hireDate || ''} onChange={(e) => setHireDate(e.target.value)} className="w-full border rounded px-3 py-2" />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium">Employee ID</label>
                                <div className="mt-1 relative">
                                    <input value={employeeId || ''} onChange={(e) => setEmployeeId(e.target.value)} className="w-full border rounded px-3 py-2" />
                                </div>
                            </div>
                        </div>

                        <div className="mt-6 flex items-center justify-end gap-3">
                            <button
                                type="button"
                                onClick={() => {
                                    // reset to original values
                                    if (profile) {
                                        setFirstName(profile.first_name || '');
                                        setLastName(profile.last_name || '');
                                        setDateOfBirth(profile.date_of_birth || undefined);
                                        setContactNumber(profile.contact_number || undefined);
                                        setCnic(profile.cnic || undefined);
                                        setMaritalStatus(profile.marital_status || undefined);
                                        setHireDate(profile.hire_date || undefined);
                                        setEmployeeId(profile.employee_id || undefined);
                                        setProfileImageFile(null);
                                        setProfileImagePreview(profile.profile_image || null);
                                        setMessage(null);
                                        setError(null);
                                    }
                                }}
                                className="px-4 py-2 border rounded"
                            >
                                Reset
                            </button>

                            <button type="submit" disabled={saving} className="px-4 py-2 bg-blue-600 text-white rounded flex items-center gap-2">
                                <Save size={16} />
                                {saving ? 'Saving...' : 'Save changes'}
                            </button>
                        </div>

                        {/* Password box */}
                        {showPasswordBox && (
                            <div ref={pwSectionRef} className="mt-6 p-4 border rounded bg-gray-50">
                                <h3 className="text-sm font-medium mb-3">Change password</h3>
                                {pwMessage && <div className="mb-2 p-2 bg-green-50 text-green-700 rounded">{pwMessage}</div>}
                                {pwError && <div className="mb-2 p-2 bg-red-50 text-red-700 rounded">{pwError}</div>}

                                {/* replaced inner form with a div to avoid nested forms */}
                                <div role="form" aria-label="Change password" className="grid grid-cols-1 gap-3">
                                    <div>
                                        <label className="block text-xs">Old password</label>
                                        <div className="relative">
                                            <input
                                                ref={pwOldInputRef}
                                                value={pwOld}
                                                onChange={(e) => setPwOld(e.target.value)}
                                                type={oldp ? 'text' : 'password'}
                                                className="w-full border h-10 rounded px-3 py-2 pr-10"
                                                required
                                                aria-label="Old password"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setoldp((p) => !p)}
                                                className="absolute right-2 top-1/2 -translate-y-1/2 z-50 p-1 text-gray-600 hover:text-gray-800"
                                                aria-pressed={oldp}
                                                aria-label={oldp ? 'Hide old password' : 'Show old password'}
                                            >
                                                <Eye size={18} />
                                            </button>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-xs">New password</label>
                                        <div className="relative">
                                            <input
                                                value={pwNew}
                                                onChange={(e) => setPwNew(e.target.value)}
                                                type={newp ? 'text' : 'password'}
                                                className="w-full border h-10 rounded px-3 py-2 pr-10"
                                                required
                                                aria-label="New password"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setnewp((p) => !p)}
                                                className="absolute right-2 top-1/2 -translate-y-1/2 z-50 p-1 text-gray-600 hover:text-gray-800"
                                                aria-pressed={newp}
                                                aria-label={newp ? 'Hide new password' : 'Show new password'}
                                            >
                                                <Eye size={18} />
                                            </button>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-xs">Confirm new</label>
                                        <div className="relative">
                                            <input
                                                value={pwNewConfirm}
                                                onChange={(e) => setPwNewConfirm(e.target.value)}
                                                type={newp1 ? 'text' : 'password'}
                                                className="w-full border h-10 rounded px-3 py-2 pr-10"
                                                required
                                                aria-label="Confirm new password"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setnewp1((p) => !p)}
                                                className="absolute right-2 top-1/2 -translate-y-1/2 z-50 p-1 text-gray-600 hover:text-gray-800"
                                                aria-pressed={newp1}
                                                aria-label={newp1 ? 'Hide confirm password' : 'Show confirm password'}
                                            >
                                                <Eye size={18} />
                                            </button>
                                        </div>
                                    </div>

                                    <div className="flex justify-end gap-2 mt-2">
                                        <button type="button" onClick={() => setShowPasswordBox(false)} className="px-3 py-2 border rounded">
                                            Cancel
                                        </button>

                                        {/* IMPORTANT: type="button" so it doesn't submit the outer form */}
                                        <button type="button" onClick={handleChangePassword} disabled={pwLoading} className="px-3 py-2 bg-indigo-600 text-white rounded">
                                            {pwLoading ? 'Updating...' : 'Update password'}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </section>
                </form>
            )}
        </div>
    );
}
