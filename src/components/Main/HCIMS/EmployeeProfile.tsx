import React, { useEffect, useState } from 'react';
import { User, Edit2, Calendar, Target, CheckCircle, Trophy, Clock, MapPin, Phone, Mail } from 'lucide-react';
import EmployeeServices from '../../../services/EmployeeServices';
import { useParams } from 'react-router-dom';
import { formatDateOnly, capitalizeName } from '../../../utils/Common';
import { EditProfilePopup } from './EditProfilePopup';

type AnyObj = Record<string, any>;

export default function EmployeeProfile() {
    const { id } = useParams();
    const [data, setData] = useState<AnyObj | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<'overview' | 'tasks' | 'profile'>('overview');
    const [openEditProfile, setOpenEditProfile] = useState<boolean>(false);

    // --- Normalizer: convert server payload into shape our popup expects ---
    function normalizeServerPayload(payload: AnyObj): AnyObj {
        if (!payload) return payload;

        // helpers
        const firstAchievement = (payload.achievements && payload.achievements[0]) || {};
        const personal = payload.personal || {};
        const address = payload.address || {};
        const employment = payload.employment || {};
        const academic = payload.academic || {};
        const personal_details = payload.personal_details || {};
        const expertise = payload.expertise || {};
        const skillsArr = Array.isArray(payload.skills) ? payload.skills : [];

        // build a details object that matches EmployeeDetails fields exactly (fallback to sensible places)
        const details: AnyObj = {
            // Address
            street_address: address.street ?? payload.address?.street ?? 'N/A',
            city: address.city ?? 'N/A',
            state: address.state ?? 'N/A',
            zipcode: address.zip ?? payload.address?.zip ?? 'N/A',
            apartment: address.apartment ?? null,
            country: address.country ?? 'Pakistan',

            // Previous Job / employment (some fields may also exist at top-level)
            title: employment.previous_title ?? payload.title ?? 'N/A',
            location: employment.previous_location ?? personal.location ?? 'N/A',
            email: employment.previous_email ?? personal.email ?? 'N/A',
            start_date: employment.previous_start_date ?? null,
            end_date: employment.previous_end_date ?? null,
            work_phone: employment.work_phone ?? payload.employment?.work_phone ?? null,
            cell_phone: employment.cell_phone ?? payload.employment?.cell_phone ?? null,

            // Emergency
            emergency_contact_first_name: payload.emergency?.first_name ?? personal_details.emergency_contact_first_name ?? 'N/A',
            emergency_contact_last_name: payload.emergency?.last_name ?? personal_details.emergency_contact_last_name ?? 'N/A',
            emergency_contact_address: payload.emergency?.address ?? personal_details.emergency_contact_address ?? 'N/A',
            primary_phone_no: payload.emergency?.phone ?? personal_details.primary_phone_no ?? 'N/A',
            alternate_phone_no: payload.emergency?.alternate_phone_no ?? personal_details.alternate_phone_no ?? null,

            // Academic
            degree_name: academic.degree_name ?? personal_details.degree_name ?? 'N/A',
            major_subjects: academic.major_subjects ?? personal_details.major_subjects ?? (skillsArr.join(', ') || 'N/A'),
            any_special_info: academic.any_special_info ?? personal_details.any_special_info ?? 'N/A',
            academic_start_date: academic.academic_start_date ?? null,
            academic_end_date: academic.academic_end_date ?? null,
            passing_year: academic.passing_year ?? null,
            university_name: academic.university_name ?? 'N/A',
            graduation_status: academic.graduation_status ?? 'N/A',

            // Expertise & Achievement
            expertise_name: expertise.name ?? personal_details.expertise_name ?? 'N/A',
            expertise_details: expertise.details ?? personal_details.expertise_details ?? 'N/A',
            achievement_title: firstAchievement.title ?? personal_details.achievement_title ?? 'N/A',
            achievement_details: firstAchievement.subtitle ?? personal_details.achievement_details ?? 'N/A',

            // Personal / Bank / Misc
            social_security: personal_details.social_security ?? 'N/A',
            educational_background: personal_details.educational_background ?? 'N/A',
            degrees_earned: personal_details.degrees_earned ?? 'N/A',
            certifications: personal_details.certifications ?? 'N/A',
            professional_memberships: personal_details.professional_memberships ?? 'N/A',
            medical_info: personal_details.medical_info ?? 'N/A',
            personal_contact: personal_details.personal_contact ?? 'N/A',
            bank_name: personal_details.bank_name ?? 'N/A',
            bank_account_number: personal_details.bank_account_number ?? 'N/A',
            hobbies_and_interests: personal_details.hobbies_and_interests ?? 'N/A',
            salary: personal_details.salary ?? (payload.salary ? String(payload.salary) : null),
        };

        // keep original top-level fields for UI (but ensure they exist)
        const normalized: AnyObj = {
            ...payload,
            // keep top-level useful names
            id: payload.id,
            detail_id: payload.detail_id ?? null,
            initials:
                payload.initials ??
                (payload.name
                    ? payload.name
                          .split(' ')
                          .map((s: string) => s[0])
                          .slice(0, 2)
                          .join('')
                          .toUpperCase()
                    : undefined),
            personal: {
                first_name: personal.first_name ?? payload.name?.split(' ')?.[0] ?? null,
                last_name: personal.last_name ?? payload.name?.split(' ')?.slice(1).join(' ') ?? null,
                email: personal.email ?? payload.personal?.email ?? null,
                phone: personal.phone ?? null,
                location: personal.location ?? employment.previous_location ?? null,
                profile_image: personal.profile_image ?? null,
            },
            employment: {
                ...payload.employment,
                previous_title: employment.previous_title ?? details.title,
                previous_location: employment.previous_location ?? details.location,
                previous_email: employment.previous_email ?? details.email,
                previous_start_date: employment.previous_start_date ?? details.start_date,
                previous_end_date: employment.previous_end_date ?? details.end_date,
                work_phone: employment.work_phone ?? details.work_phone,
                cell_phone: employment.cell_phone ?? details.cell_phone,
            },
            address: {
                street: details.street_address,
                city: details.city,
                state: details.state,
                zip: details.zipcode,
                apartment: details.apartment,
                country: details.country,
            },
            academic: {
                degree_name: details.degree_name,
                major_subjects: details.major_subjects,
                any_special_info: details.any_special_info,
                academic_start_date: details.academic_start_date,
                academic_end_date: details.academic_end_date,
                passing_year: details.passing_year,
                university_name: details.university_name,
                graduation_status: details.graduation_status,
            },
            personal_details: {
                social_security: details.social_security,
                educational_background: details.educational_background,
                degrees_earned: details.degrees_earned,
                certifications: details.certifications,
                professional_memberships: details.professional_memberships,
                medical_info: details.medical_info,
                personal_contact: details.personal_contact,
                bank_name: details.bank_name,
                bank_account_number: details.bank_account_number,
                hobbies_and_interests: details.hobbies_and_interests,
                salary: details.salary,
            },

            // add the details object (exactly what popup expects)
            details,
            // ensure skills array exists
            skills: Array.isArray(payload.skills)
                ? payload.skills
                : typeof details.major_subjects === 'string'
                ? details.major_subjects
                      .split(',')
                      .map((s: string) => s.trim())
                      .filter(Boolean)
                : [],
        };

        return normalized;
    }

    const fetchProfileData = () => {
        setLoading(true);
        setError(null);
        EmployeeServices.fetchProfileData(Number(id))
            .then((r: any) => {
                const payload = r?.data ?? r;
                const normalized = normalizeServerPayload(payload);
                setData(normalized);
                console.log('Profile Data: ', normalized);
            })
            .catch((e: any) => {
                console.error(e);
                setError('Failed to load profile');
            })
            .finally(() => {
                setLoading(false);
            });
    };

    useEffect(() => {
        if (!id) return;
        fetchProfileData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    if (loading) {
        return (
            <div className="p-6">
                <div className="animate-pulse space-y-4">
                    <div className="h-6 w-3/12 bg-gray-200 rounded" />
                    <div className="h-64 bg-gray-100 rounded" />
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div>
                <span className="p-6 text-red-600">{error}</span>
                <div className="border mx-auto max-w-4xl mt-10 px-6 py-4 rounded-2xl">
                    <h1 className="text-2xl text-amber-900">Did you forget to create basic profile?</h1>
                    <ul>
                        <li>Go to settings</li>
                        <li>Click Salary Structure</li>
                        <li>Create basic profile for employee</li>
                    </ul>
                </div>
            </div>
        );
    }

    if (!data) return null;

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div className="bg-gradient-to-r from-white to-purple-50 border rounded-2xl p-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-4">
                            {data?.personal?.profile_image ? (
                                <img
                                    src={data?.personal?.profile_image}
                                    alt="Profile"
                                    className="w-20 h-20 rounded-full bg-white border flex items-center justify-center text-xl font-semibold text-gray-700 shadow"
                                />
                            ) : (
                                <div className="w-20 h-20 rounded-full bg-white border flex items-center justify-center text-xl font-semibold text-gray-700 shadow">{data.initials}</div>
                            )}

                            <div>
                                <h2 className="text-2xl font-extrabold">{data.name}</h2>
                                <div className="text-sm text-gray-500">{data.title}</div>
                                <div className="text-xs text-gray-400 mt-2 flex items-center gap-3">
                                    <span className="flex items-center gap-1">
                                        <User className="w-4 h-4" /> {data.employee_code}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <Calendar className="w-4 h-4" /> Joined {data.joined_at}
                                    </span>
                                    <span className="ml-2 inline-block bg-green-100 text-green-700 px-2 py-1 text-xs rounded">{data.status}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <button onClick={() => setOpenEditProfile(true)} className="flex items-center gap-2 border rounded px-3 py-2 text-sm hover:shadow">
                            <Edit2 className="w-4 h-4" /> Edit Profile
                        </button>
                    </div>
                </div>

                {/* metrics row */}
                <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
                    <CardSmall label="Performance Score" value={`${(data.performance_score ?? 0).toFixed(2)}%`} icon={<Target className="w-6 h-6" />} />
                    <CardSmall label="Task Completion" value={`${data.task_completion ?? 0}%`} icon={<CheckCircle className="w-6 h-6" />} />
                    <CardSmall label="Dept. Ranking" value={String(data.dept_ranking)} icon={<Trophy className="w-6 h-6" />} />
                    <CardSmall label="Attendance" value={`${(data.attendance ?? 0).toFixed(2)}%`} icon={<Clock className="w-6 h-6" />} />
                </div>
            </div>

            {/* Tabs */}
            <div className="flex items-center gap-4 border w-fit bg-gray-100 px-1 py-0.5 rounded-full">
                <Tab label="Overview" active={activeTab === 'overview'} onClick={() => setActiveTab('overview')} />
                <Tab label="Tasks" active={activeTab === 'tasks'} onClick={() => setActiveTab('tasks')} />
                <Tab label="Profile" active={activeTab === 'profile'} onClick={() => setActiveTab('profile')} />
            </div>

            {/* Content */}
            {activeTab === 'overview' && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="col-span-2 space-y-6">
                        <div className="bg-white border rounded-lg p-6">
                            <h3 className="font-semibold">Current Month Performance</h3>
                            <p className="text-xs text-gray-400">Month metrics and goals</p>
                            <div className="mt-4 grid grid-cols-2 gap-4">
                                <div>
                                    <div className="text-sm text-gray-500">Tasks Assigned</div>
                                    <div className="text-2xl font-bold">{data.month_metrics?.assigned}</div>
                                </div>
                                <div>
                                    <div className="text-sm text-gray-500">Tasks Completed</div>
                                    <div className="text-2xl font-bold">{data.month_metrics?.completed}</div>
                                </div>
                            </div>

                            <div className="mt-6 border-t pt-4">
                                <div className="text-sm text-gray-500">Goal Achievement</div>
                                <div className="w-full bg-gray-200 rounded-full h-3 mt-2">
                                    <div className="h-3 rounded-full" style={{ width: `${data.month_metrics?.goal_achievement ?? 0}%`, background: '#0f172a' }} />
                                </div>
                                <div className="text-xs text-gray-400 mt-2">
                                    {data.month_metrics?.goal_achievement}% — {data.month_metrics?.completed} of {data.month_metrics?.assigned} goals achieved
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="bg-white border rounded-lg p-6 h-full">
                            <h3 className="font-semibold">Task Status Distribution</h3>
                            <p className="text-xs text-gray-400">Current task breakdown</p>
                            <div className="flex items-center justify-center mt-6">
                                <SmallPie />
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'profile' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="space-y-6">
                        <div className="bg-white border rounded-lg p-6">
                            <h4 className="font-semibold flex items-center gap-2">
                                <User className="w-4 h-4" /> Personal Information
                            </h4>
                            <div className="mt-4 grid grid-cols-2 gap-4">
                                <div>
                                    <div className="text-xs text-gray-400">First Name</div>
                                    <div className="font-medium">{data.personal?.first_name}</div>
                                </div>
                                <div>
                                    <div className="text-xs text-gray-400">Last Name</div>
                                    <div className="font-medium">{data.personal?.last_name}</div>
                                </div>
                                <div>
                                    <div className="text-xs text-gray-400">Email</div>
                                    <div className="font-medium flex items-center gap-2">
                                        <Mail className="w-4 h-4" />
                                        {data.personal?.email}
                                    </div>
                                </div>
                                <div>
                                    <div className="text-xs text-gray-400">Phone</div>
                                    <div className="font-medium flex items-center gap-2">
                                        <Phone className="w-4 h-4" />
                                        {data.personal?.phone}
                                    </div>
                                </div>
                                <div className="col-span-2">
                                    <div className="text-xs text-gray-400">Location</div>
                                    <div className="font-medium flex items-center gap-2">
                                        <MapPin className="w-4 h-4" />
                                        {data.personal?.location}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white border rounded-lg p-6">
                            <h4 className="font-semibold">Skills & Expertise</h4>
                            <div className="mt-4 flex flex-wrap gap-2">
                                {data.skills?.map((s: string, i: number) => (
                                    <span key={i} className="px-3 py-1 border rounded-full text-xs">
                                        {s}
                                    </span>
                                ))}
                            </div>
                        </div>

                        <div className="bg-white border rounded-lg p-6">
                            <h4 className="font-semibold">Address</h4>
                            <div className="mt-4 grid grid-cols-2 gap-4">
                                <div>
                                    <div className="text-xs text-gray-400">Street</div>
                                    <div className="font-medium">{data.address?.street}</div>
                                </div>
                                <div>
                                    <div className="text-xs text-gray-400">City</div>
                                    <div className="font-medium">{data.address?.city}</div>
                                </div>
                                <div>
                                    <div className="text-xs text-gray-400">State</div>
                                    <div className="font-medium">{data.address?.state}</div>
                                </div>
                                <div>
                                    <div className="text-xs text-gray-400">ZIP Code</div>
                                    <div className="font-medium">{data.address?.zip}</div>
                                </div>
                                <div className="col-span-2">
                                    <div className="text-xs text-gray-400">Country</div>
                                    <div className="font-medium">{data.address?.country}</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="bg-white border rounded-lg p-6">
                            <h4 className="font-semibold">Employment Details</h4>
                            <div className="mt-4 grid grid-cols-1 gap-3">
                                <div>
                                    <div className="text-xs text-gray-400">Position</div>
                                    <div className="font-medium">{data.employment?.position}</div>
                                </div>
                                <div>
                                    <div className="text-xs text-gray-400">Department</div>
                                    <div className="font-medium">{data.employment?.department}</div>
                                </div>
                                <div>
                                    <div className="text-xs text-gray-400">Manager</div>
                                    <div className="font-medium">{data.employment?.manager}</div>
                                </div>
                                <div>
                                    <div className="text-xs text-gray-400">Employment Type</div>
                                    <div className="font-medium">{data.employment?.employment_type}</div>
                                </div>
                                <div>
                                    <div className="text-xs text-gray-400">Join Date</div>
                                    <div className="font-medium">{data.employment?.join_date}</div>
                                </div>
                                <div>
                                    <div className="text-xs text-gray-400">Prev. Employer / Title</div>
                                    <div className="font-medium">{data.employment?.previous_title}</div>
                                </div>
                                <div>
                                    <div className="text-xs text-gray-400">Prev. Location</div>
                                    <div className="font-medium">{data.employment?.previous_location}</div>
                                </div>
                                <div>
                                    <div className="text-xs text-gray-400">Work Phone</div>
                                    <div className="font-medium">{data.employment?.work_phone}</div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white border rounded-lg p-6">
                            <h4 className="font-semibold">Emergency Contact</h4>
                            <div className="mt-4">
                                <div className="text-xs text-gray-400">Name</div>
                                <div className="font-medium">{data.emergency?.name}</div>
                                <div className="text-xs text-gray-400 mt-3">Phone</div>
                                <div className="font-medium">{data.emergency?.phone}</div>
                                <div className="text-xs text-gray-400 mt-3">Address</div>
                                <div className="font-medium whitespace-pre-line">{data.emergency?.address}</div>
                            </div>
                        </div>

                        <div className="bg-white border rounded-lg p-6">
                            <h4 className="font-semibold">Academic</h4>
                            <div className="mt-4 grid grid-cols-1 gap-2">
                                <div>
                                    <div className="text-xs text-gray-400">Degree</div>
                                    <div className="font-medium">{data.academic?.degree_name}</div>
                                </div>
                                <div>
                                    <div className="text-xs text-gray-400">University</div>
                                    <div className="font-medium">{data.academic?.university_name}</div>
                                </div>
                                <div>
                                    <div className="text-xs text-gray-400">From / To</div>
                                    <div className="font-medium">
                                        {formatDateOnly(data.academic?.academic_start_date)} — {formatDateOnly(data.academic?.academic_end_date)}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white border rounded-lg p-6">
                            <h4 className="font-semibold">Personal / Bank</h4>
                            <div className="mt-4 grid grid-cols-1 gap-2">
                                <div>
                                    <div className="text-xs text-gray-400">Bank</div>
                                    <div className="font-medium">{data.personal_details?.bank_name}</div>
                                </div>
                                <div>
                                    <div className="text-xs text-gray-400">Bank Account</div>
                                    <div className="font-medium">{data.personal_details?.bank_account_number}</div>
                                </div>
                                <div>
                                    <div className="text-xs text-gray-400">SSN</div>
                                    <div className="font-medium">{data.personal_details?.social_security}</div>
                                </div>
                                <div>
                                    <div className="text-xs text-gray-400">Hobbies</div>
                                    <div className="font-medium">{data.personal_details?.hobbies_and_interests}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'tasks' && (
                <div className="border bg-white rounded-lg p-6">
                    <div className="flex items-start gap-2 font-medium">
                        <div className="mt-1" />
                        <span>
                            <h2>Task Management</h2>
                            <p className="text-sm text-gray-600">All assigned tasks and their current status</p>
                        </span>
                    </div>
                    <div>
                        {data.tasks?.map((t: AnyObj) => {
                            const color = t.status === 'Completed' ? 'green' : t.status === 'Pending' ? 'yellow' : 'red';
                            const size = 3;
                            return (
                                <div className="w-full border py-2 px-3 rounded mb-3" key={`tasks-${t.id}`}>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <div className={`bg-${color}-500 size-${size} rounded-full `}></div>
                                            <h4>{t.task_name} </h4>
                                        </div>
                                        <div className={`text-[12px] py-0.5 px-1 bg-${color}-500 rounded text-white`}>{t.status}</div>
                                    </div>
                                    <div className="flex gap-3 mt-3">
                                        <div className="flex items-center gap-2 ">
                                            <Calendar className="w-4 h-4" />
                                            <span className="mt-0.5 text-[10px] text-gray-500">Due: {formatDateOnly(t.due_date)}</span>
                                        </div>
                                        <div className={`flex items-center gap-2 text-${color}-700`}>
                                            <div className={`mt-0.5 text-[10px] `}>{capitalizeName(t.priority)} Priority</div>
                                        </div>
                                        <div className="flex items-center gap-2 ">
                                            <User className="w-4 h-4" />
                                            <span className="mt-0.5 text-[10px] text-gray-500">{t.assigned_by?.name}</span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {openEditProfile && data && <EditProfilePopup open={openEditProfile} onClose={() => setOpenEditProfile(false)} initial={data} OnSuccess={fetchProfileData} />}
        </div>
    );
}

/* --- small helper components --- */

function Tab({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
    return (
        <button onClick={onClick} className={` px-3 py-1 rounded-full text-sm ${active ? 'bg-white border' : 'bg-gray-100  text-gray-600'}`}>
            {label}
        </button>
    );
}

function CardSmall({ label, value, icon }: { label: string; value: string | number; icon?: React.ReactNode }) {
    return (
        <div className="bg-white border rounded-lg p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-md bg-gray-50 flex items-center justify-center">{icon}</div>
            <div>
                <div className="text-xs text-gray-400">{label}</div>
                <div className="font-semibold text-lg">{value}</div>
            </div>
        </div>
    );
}

function SmallPie() {
    return (
        <svg width="140" height="140" viewBox="0 0 32 32">
            <circle r="16" cx="16" cy="16" fill="#e6f7f0" />
            <path d="M16 16 L32 16 A16 16 0 0 0 16 0 z" fill="#10b981" />
            <path d="M16 16 L16 0 A16 16 0 0 0 4.7 28.2 z" fill="#3b82f6" />
            <path d="M16 16 L4.7 28.2 A16 16 0 0 0 22 30 z" fill="#f59e0b" />
            <circle cx="16" cy="16" r="7" fill="white" />
        </svg>
    );
}
