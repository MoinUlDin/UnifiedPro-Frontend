import React, { useCallback, useEffect, useRef, useState } from 'react';
import EmployeeServices from '../../../services/EmployeeServices';
import toast from 'react-hot-toast';

type EditPayload = {
    // Address
    street_address?: string;
    city?: string;
    state?: string;
    zipcode?: string;
    apartment?: string | null;
    country?: string | null;

    // Previous job / employment
    title?: string | null;
    location?: string | null;
    email?: string | null;
    start_date?: string | null; // YYYY-MM-DD
    end_date?: string | null; // YYYY-MM-DD
    work_phone?: string | null;
    cell_phone?: string | null;

    // Emergency
    emergency_contact_first_name?: string | null;
    emergency_contact_last_name?: string | null;
    emergency_contact_address?: string | null;
    primary_phone_no?: string | null;
    alternate_phone_no?: string | null;

    // Academic
    degree_name?: string | null;
    major_subjects?: string | null;
    any_special_info?: string | null;
    academic_start_date?: string | null;
    academic_end_date?: string | null;
    passing_year?: string | null; // treat as date string or year string
    university_name?: string | null;
    graduation_status?: string | null;

    // Expertise
    expertise_name?: string | null;
    expertise_details?: string | null;

    // Achievement
    achievement_title?: string | null;
    achievement_details?: string | null;

    // Personal / bank / misc
    social_security?: string | null;
    educational_background?: string | null;
    degrees_earned?: string | null;
    certifications?: string | null;
    professional_memberships?: string | null;
    medical_info?: string | null;
    personal_contact?: string | null;
    bank_name?: string | null;
    bank_account_number?: string | null;
    hobbies_and_interests?: string | null;
    salary?: number | null;
};

export function EditProfilePopup({
    open,
    onClose,
    initial,
    OnSuccess,
}: {
    open: boolean;
    onClose: () => void;
    initial: any; // full profile payload
    OnSuccess: () => void;
}) {
    const [form, setForm] = useState<EditPayload>({});
    const [saving, setSaving] = useState(false);
    const [allUserID, setAllUserID] = useState<number | null>(null);
    const [errorMap, setErrorMap] = useState<Record<string, string>>({});

    const seededForId = useRef<number | null>(null);

    // helper to normalize possible date string or null
    const normalizeDate = (v: any): string | null => {
        if (!v && v !== 0) return null;
        // if v is string like "2025-10-01T00:00:00Z" -> take first 10 chars
        if (typeof v === 'string') return v.length >= 10 ? v.slice(0, 10) : v;
        // if Date object
        if (v instanceof Date) return v.toISOString().slice(0, 10);
        return null;
    };

    useEffect(() => {
        if (!open) return;
        const targetId = initial?.id ?? null;
        if (seededForId.current === targetId) return; // don't reseed while user edits same id
        seededForId.current = targetId;
        setErrorMap({});
        setAllUserID(targetId);

        const d = initial?.details ?? {};

        setForm({
            // Address
            street_address: (d.street_address ?? initial?.address?.street ?? '') as any,
            city: (d.city ?? initial?.address?.city ?? '') as any,
            state: (d.state ?? initial?.address?.state ?? '') as any,
            zipcode: (d.zipcode ?? initial?.address?.zip ?? '') as any,
            apartment: (d.apartment ?? '') as any,
            country: (d.country ?? '') as any,

            // Previous job / employment
            title: (d.title ?? '') as any,
            location: (d.location ?? initial?.personal?.location ?? '') as any,
            email: (d.email ?? '') as any,
            start_date: normalizeDate(d.start_date ?? d.start_date ?? null),
            end_date: normalizeDate(d.end_date ?? d.end_date ?? null),
            work_phone: (d.work_phone ?? '') as any,
            cell_phone: (d.cell_phone ?? '') as any,

            // Emergency
            emergency_contact_first_name: (d.emergency_contact_first_name ?? '') as any,
            emergency_contact_last_name: (d.emergency_contact_last_name ?? '') as any,
            emergency_contact_address: (d.emergency_contact_address ?? '') as any,
            primary_phone_no: (d.primary_phone_no ?? '') as any,
            alternate_phone_no: (d.alternate_phone_no ?? '') as any,

            // Academic
            degree_name: (d.degree_name ?? '') as any,
            major_subjects: (d.major_subjects ?? (initial?.skills ? initial.skills.join(', ') : '')) as any,
            any_special_info: (d.any_special_info ?? '') as any,
            academic_start_date: normalizeDate(d.academic_start_date ?? null),
            academic_end_date: normalizeDate(d.academic_end_date ?? null),
            passing_year: normalizeDate(d.passing_year ?? null),
            university_name: (d.university_name ?? '') as any,
            graduation_status: (d.graduation_status ?? '') as any,

            // Expertise
            expertise_name: (d.expertise_name ?? '') as any,
            expertise_details: (d.expertise_details ?? '') as any,

            // Achievement
            achievement_title: (d.achievement_title ?? '') as any,
            achievement_details: (d.achievement_details ?? '') as any,

            // Personal / bank / misc
            social_security: (d.social_security ?? '') as any,
            educational_background: (d.educational_background ?? '') as any,
            degrees_earned: (d.degrees_earned ?? '') as any,
            certifications: (d.certifications ?? '') as any,
            professional_memberships: (d.professional_memberships ?? '') as any,
            medical_info: (d.medical_info ?? '') as any,
            personal_contact: (d.personal_contact ?? '') as any,
            bank_name: (d.bank_name ?? '') as any,
            bank_account_number: (d.bank_account_number ?? '') as any,
            hobbies_and_interests: (d.hobbies_and_interests ?? '') as any,
            salary: typeof d.salary !== 'undefined' ? (d.salary as any) : null,
        });
    }, [open, initial?.id]);

    useEffect(() => {
        if (!open) seededForId.current = null;
    }, [open]);

    const setField = useCallback(<K extends keyof EditPayload>(k: K, v: EditPayload[K]) => {
        setForm((s) => ({ ...s, [k]: v }));
        setErrorMap((m) => {
            if (!m[k as string]) return m;
            const nxt = { ...m };
            delete nxt[k as string];
            return nxt;
        });
    }, []);

    const buildPayloadFromForm = useCallback(() => {
        const payload: Record<string, any> = {};
        Object.entries(form).forEach(([k, v]) => {
            if (typeof v === 'undefined') return;
            if (typeof v === 'string') {
                const trimmed = v.trim();
                if (trimmed.length === 0) return; // skip empty strings
                payload[k] = trimmed;
                return;
            }
            if (typeof v === 'number') {
                payload[k] = v;
                return;
            }
            if (v === null) return; // skip explicit nulls
            payload[k] = v;
        });
        return payload;
    }, [form]);

    async function handleSave() {
        setErrorMap({});
        if (!allUserID) {
            toast.error('User ID missing');
            return;
        }
        const payload = buildPayloadFromForm();
        if (Object.keys(payload).length === 0) {
            toast('No changes to save', { icon: 'ℹ️' });
            onClose();
            return;
        }
        setSaving(true);
        try {
            await EmployeeServices.updateProfileData(allUserID, payload);
            toast.success('Profile updated');
            OnSuccess();
            onClose();
        } catch (err: any) {
            console.error('Update error', err);
            const detail = err?.response?.data?.detail ?? err;
            console.log('error Details', detail);
            if (detail && typeof detail === 'object') {
                const map: Record<string, string> = {};
                Object.keys(detail).forEach((k) => {
                    const v = (detail as any)[k];
                    if (Array.isArray(v) && v.length) map[k] = String(v[0]);
                    else map[k] = String(v);
                });
                setErrorMap(map);
                const firstKey = Object.keys(map)[0];
                if (firstKey) toast.error(map[firstKey]);
            } else if (err?.message) {
                toast.error(err.message);
            } else {
                toast.error('Failed to update profile');
            }
        } finally {
            setSaving(false);
        }
    }

    if (!open) return null;

    const InputRow = React.useCallback(
        ({ label, value, onChange, error, type = 'text', placeholder }: { label: string; value: any; onChange: (v: any) => void; error?: string; type?: string; placeholder?: string }) => (
            <div>
                <label className="text-xs text-gray-500">{label}</label>
                {type === 'textarea' ? (
                    <textarea value={value ?? ''} onChange={(e) => onChange(e.target.value)} className="w-full border rounded px-2 py-1" placeholder={placeholder} />
                ) : (
                    <input type={type} value={value ?? ''} onChange={(e) => onChange(e.target.value)} className="w-full border rounded px-2 py-1" placeholder={placeholder} />
                )}
                {error && <div className="text-xs text-red-600 mt-1">{error}</div>}
            </div>
        ),
        []
    );

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black opacity-40" onClick={onClose}></div>

            <div className="relative bg-white rounded-lg w-full max-w-4xl max-h-[92vh] overflow-auto p-6 shadow-lg z-10">
                <div className="flex items-center justify-between mb-4 sticky top-0 -m-6 -translate-y-6 px-6 py-3 bg-gray-300/90">
                    <h3 className="text-lg font-semibold">Edit Profile (Details)</h3>
                    <div className="flex gap-2">
                        <button className="px-3 py-1 rounded border" onClick={onClose} disabled={saving}>
                            Cancel
                        </button>
                        <button onClick={handleSave} className="px-3 py-1 rounded bg-blue-600 text-white" disabled={saving}>
                            {saving ? 'Saving...' : 'Save'}
                        </button>
                    </div>
                </div>

                {/* Address */}
                <div className="mb-4 border rounded p-4">
                    <h4 className="font-semibold text-sm mb-2">Address</h4>
                    <div className="grid grid-cols-2 gap-4">
                        {InputRow({ label: 'Street', value: form.street_address, onChange: (v) => setField('street_address', v), error: errorMap['street_address'], placeholder: 'Street address' })}
                        {InputRow({ label: 'City', value: form.city, onChange: (v) => setField('city', v), error: errorMap['city'], placeholder: 'City' })}
                        {InputRow({ label: 'State', value: form.state, onChange: (v) => setField('state', v), error: errorMap['state'], placeholder: 'State' })}
                        {InputRow({ label: 'ZIP / Postal', value: form.zipcode, onChange: (v) => setField('zipcode', v), error: errorMap['zipcode'], placeholder: 'Zip code' })}
                        {InputRow({ label: 'Apartment / Suite', value: form.apartment, onChange: (v) => setField('apartment', v), error: errorMap['apartment'], placeholder: 'Apt / Suite' })}
                        {InputRow({ label: 'Country', value: form.country, onChange: (v) => setField('country', v), error: errorMap['country'], placeholder: 'Country' })}
                    </div>
                </div>

                {/* Employment / Previous job */}
                <div className="mb-4 border rounded p-4">
                    <h4 className="font-semibold text-sm mb-2">Employment / Previous Job</h4>
                    <div className="grid grid-cols-2 gap-4">
                        {InputRow({ label: 'Title', value: form.title, onChange: (v) => setField('title', v), error: errorMap['title'] })}
                        {InputRow({ label: 'Location', value: form.location, onChange: (v) => setField('location', v), error: errorMap['location'] })}
                        {InputRow({ label: 'Email', value: form.email, onChange: (v) => setField('email', v), error: errorMap['email'], type: 'email' })}
                        {InputRow({ label: 'Start Date', value: form.start_date, onChange: (v) => setField('start_date', v), error: errorMap['start_date'], type: 'date' })}
                        {InputRow({ label: 'End Date', value: form.end_date, onChange: (v) => setField('end_date', v), error: errorMap['end_date'], type: 'date' })}
                        {InputRow({ label: 'Work Phone', value: form.work_phone, onChange: (v) => setField('work_phone', v), error: errorMap['work_phone'] })}
                        {InputRow({ label: 'Cell Phone', value: form.cell_phone, onChange: (v) => setField('cell_phone', v), error: errorMap['cell_phone'] })}
                    </div>
                </div>

                {/* Emergency */}
                <div className="mb-4 border rounded p-4">
                    <h4 className="font-semibold text-sm mb-2">Emergency Contact</h4>
                    <div className="grid grid-cols-2 gap-4">
                        {InputRow({
                            label: 'First Name',
                            value: form.emergency_contact_first_name,
                            onChange: (v) => setField('emergency_contact_first_name', v),
                            error: errorMap['emergency_contact_first_name'],
                        })}
                        {InputRow({
                            label: 'Last Name',
                            value: form.emergency_contact_last_name,
                            onChange: (v) => setField('emergency_contact_last_name', v),
                            error: errorMap['emergency_contact_last_name'],
                        })}
                        <div className="col-span-2">
                            {InputRow({
                                label: 'Emergency Address',
                                value: form.emergency_contact_address,
                                onChange: (v) => setField('emergency_contact_address', v),
                                error: errorMap['emergency_contact_address'],
                                type: 'textarea',
                                placeholder: 'Emergency contact address',
                            })}
                        </div>
                        {InputRow({ label: 'Primary Phone', value: form.primary_phone_no, onChange: (v) => setField('primary_phone_no', v), error: errorMap['primary_phone_no'] })}
                        {InputRow({ label: 'Alternate Phone', value: form.alternate_phone_no, onChange: (v) => setField('alternate_phone_no', v), error: errorMap['alternate_phone_no'] })}
                    </div>
                </div>

                {/* Academic */}
                <div className="mb-4 border rounded p-4">
                    <h4 className="font-semibold text-sm mb-2">Academic</h4>
                    <div className="grid grid-cols-2 gap-4">
                        {InputRow({ label: 'Degree', value: form.degree_name, onChange: (v) => setField('degree_name', v), error: errorMap['degree_name'] })}
                        {InputRow({ label: 'Major Subjects', value: form.major_subjects, onChange: (v) => setField('major_subjects', v), error: errorMap['major_subjects'] })}
                        {InputRow({ label: 'Any Special Info', value: form.any_special_info, onChange: (v) => setField('any_special_info', v), error: errorMap['any_special_info'], type: 'textarea' })}
                        {InputRow({
                            label: 'Academic Start',
                            value: form.academic_start_date,
                            onChange: (v) => setField('academic_start_date', v),
                            error: errorMap['academic_start_date'],
                            type: 'date',
                        })}
                        {InputRow({ label: 'Academic End', value: form.academic_end_date, onChange: (v) => setField('academic_end_date', v), error: errorMap['academic_end_date'], type: 'date' })}
                        {InputRow({ label: 'Passing Year', value: form.passing_year, onChange: (v) => setField('passing_year', v), error: errorMap['passing_year'], type: 'date' })}
                        {InputRow({ label: 'University', value: form.university_name, onChange: (v) => setField('university_name', v), error: errorMap['university_name'] })}
                        {InputRow({ label: 'Graduation Status', value: form.graduation_status, onChange: (v) => setField('graduation_status', v), error: errorMap['graduation_status'] })}
                    </div>
                </div>

                {/* Expertise & Skills */}
                <div className="mb-4 border rounded p-4">
                    <h4 className="font-semibold text-sm mb-2">Expertise & Skills</h4>
                    <div className="grid grid-cols-1 gap-4">
                        {InputRow({
                            label: 'Expertise',
                            value: form.expertise_name,
                            onChange: (v) => setField('expertise_name', v),
                            error: errorMap['expertise_name'],
                            placeholder: 'e.g. Frontend, Backend',
                        })}
                        {InputRow({
                            label: 'Expertise Details',
                            value: form.expertise_details,
                            onChange: (v) => setField('expertise_details', v),
                            error: errorMap['expertise_details'],
                            type: 'textarea',
                        })}
                        {InputRow({
                            label: 'Skills (comma separated)',
                            value: form.major_subjects,
                            onChange: (v) => setField('major_subjects', v),
                            error: errorMap['major_subjects'],
                            placeholder: 'React, Node, Django',
                        })}
                    </div>
                </div>

                {/* Achievement & Other */}
                <div className="mb-4 border rounded p-4">
                    <h4 className="font-semibold text-sm mb-2">Achievement & Other</h4>
                    <div className="grid grid-cols-2 gap-4">
                        {InputRow({ label: 'Achievement Title', value: form.achievement_title, onChange: (v) => setField('achievement_title', v), error: errorMap['achievement_title'] })}
                        {InputRow({ label: 'Achievement Details', value: form.achievement_details, onChange: (v) => setField('achievement_details', v), error: errorMap['achievement_details'] })}
                        {InputRow({ label: 'Salary', value: form.salary ?? '', onChange: (v) => setField('salary', v ? Number(v) : null), error: errorMap['salary'], type: 'number' })}
                        <div className="col-span-2">
                            {InputRow({
                                label: 'Hobbies / Interests',
                                value: form.hobbies_and_interests,
                                onChange: (v) => setField('hobbies_and_interests', v),
                                error: errorMap['hobbies_and_interests'],
                                type: 'textarea',
                            })}
                        </div>
                    </div>
                </div>

                {/* Personal / Bank / Misc */}
                <div className="mb-6 border rounded p-4">
                    <h4 className="font-semibold text-sm mb-2">Personal / Bank / Other</h4>
                    <div className="grid grid-cols-2 gap-4">
                        {InputRow({ label: 'Social Security', value: form.social_security, onChange: (v) => setField('social_security', v), error: errorMap['social_security'] })}
                        {InputRow({ label: 'Personal Contact', value: form.personal_contact, onChange: (v) => setField('personal_contact', v), error: errorMap['personal_contact'] })}
                        {InputRow({
                            label: 'Educational Background',
                            value: form.educational_background,
                            onChange: (v) => setField('educational_background', v),
                            error: errorMap['educational_background'],
                            type: 'textarea',
                        })}
                        {InputRow({ label: 'Degrees Earned', value: form.degrees_earned, onChange: (v) => setField('degrees_earned', v), error: errorMap['degrees_earned'], type: 'textarea' })}
                        {InputRow({ label: 'Certifications', value: form.certifications, onChange: (v) => setField('certifications', v), error: errorMap['certifications'], type: 'textarea' })}
                        {InputRow({
                            label: 'Professional Memberships',
                            value: form.professional_memberships,
                            onChange: (v) => setField('professional_memberships', v),
                            error: errorMap['professional_memberships'],
                            type: 'textarea',
                        })}
                        {InputRow({ label: 'Medical Info', value: form.medical_info, onChange: (v) => setField('medical_info', v), error: errorMap['medical_info'], type: 'textarea' })}
                        {InputRow({ label: 'Bank Name', value: form.bank_name, onChange: (v) => setField('bank_name', v), error: errorMap['bank_name'] })}
                        {InputRow({ label: 'Bank Account #', value: form.bank_account_number, onChange: (v) => setField('bank_account_number', v), error: errorMap['bank_account_number'] })}
                    </div>
                </div>
            </div>
        </div>
    );
}
