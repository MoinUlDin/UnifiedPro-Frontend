import { useState, Fragment, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { DataTable } from 'mantine-datatable';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '../../../store/themeConfigSlice';
import CommonTable from '../Common_Table';
import CommonPopup, { FormField } from '../Common_Popup';
import CompanyStandards from './Company_Info_Details/CompanyStandards';
import WorkingDays from './Company_Info_Details/WorkingDays';
import Branches from './Company_Info_Details/Branches';
import SubCompanies from './Company_Info_Details/SubCompanies';
import SettingServices from '../../../services/SettingServices';
import { render } from '@fullcalendar/core/preact';
import CompanyInfoPopup from './CompanyInfoPopup';
import toast, { Toaster } from 'react-hot-toast';
import { FaBuilding, FaCalendar, FaCalendarAlt, FaCog, FaFileInvoice, FaMoneyBill } from 'react-icons/fa';
import { Building2, Mail, Globe, Phone, Clock, Coffee, CreditCard, Receipt, Percent, Calendar, Edit, Plus, Trash2, Save, X, CheckCircle, AlertCircle, Info, Settings } from 'lucide-react';
import Swal from 'sweetalert2';
// Define the policy type to match the shape of policy objects

interface WorkingDay {
    id: number;
    day_name: string;
    start: string;
    end: string;
    is_selected: boolean;
}
interface Policy {
    id?: number;
    name: string;
    email: string;
    website: string;
    currency?: string;
    tax_id?: string;
    tax_percentage?: string;
    working_days_details?: WorkingDay[];
    phone_number: string;
    working_time: string;
    office_open_time: string;
    office_close_time: string;
    break_start_time: string;
    break_end_time: string;
}
interface Standard {
    currency?: string;
    tax_id?: string;
    tax_percentage?: number;
}

interface ModalConfig {
    title: string;
    fields: FormField[];
    initialValues: Record<string, any>;
    onSubmit: (data: any) => Promise<void> | void;
}

function formatTimeToAMPM(timeStr: string): string {
    if (!timeStr) return 'N/A';
    // Construct a Date on epoch day so it ignores the date
    const [hh, mm, ss] = timeStr.split(':').map(Number);
    const date = new Date();
    date.setHours(hh, mm, ss, 0);
    return date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
    });
}

const Company_Info = () => {
    const dispatch = useDispatch();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [page, setPage] = useState(1);
    const [recordsPerPage, setRecordsPerPage] = useState(10);
    const [policies, setPolicies] = useState<Policy[]>([]);
    const [currentEditId, setCurrentEditId] = useState<number | null>(null);
    const pagedData = policies.slice((page - 1) * recordsPerPage, page * recordsPerPage);
    const [activeTabe, setActiveTab] = useState<number>(1);

    const [modalConfig, setModalConfig] = useState<ModalConfig | null>(null);
    const activeCSS = 'bg-white py-1';

    useEffect(() => {
        dispatch(setPageTitle('Company Policies'));
    }, [dispatch]);

    const fetchCompanyInfo = () => {
        SettingServices.fetchCompanyInfo()
            .then((r) => {
                console.log('Comapany Info: ', r);
                setPolicies(r);
            })
            .catch((e) => {
                console.log(e);
            });
    };
    useEffect(() => {
        fetchCompanyInfo();
    }, []);

    const initialFormFields: Policy = {
        id: 0,
        name: 'My Company',
        email: '',
        website: 'None',
        phone_number: '',
        working_time: 'None',
        office_open_time: '9 a.m.',
        office_close_time: '6 p.m.',
        break_start_time: '1 p.m.',
        break_end_time: '2 p.m.',
    };

    const [formData, setFormData] = useState<Policy>(initialFormFields);

    const WorkingDay = [
        { accessor: 'id', title: 'ID' },
        { accessor: 'day_name', title: 'Day Name' },
        { accessor: 'start', title: 'Start Time', render: (row: any) => formatTimeToAMPM(row.start) },
        { accessor: 'end', title: 'End Time', render: (row: any) => formatTimeToAMPM(row.end) },
        {
            accessor: 'action',
            title: 'Action',
            render: (row: any) => (
                <span className="flex items-center gap-4">
                    <Edit className="hover:text-blue-500 hover:cursor-pointer" size={14} onClick={() => openWorkingDayForm(row.id)} />
                    <Trash2 onClick={() => handleDeleteWorkDay(row.id)} size={14} className="hover:text-red-500 hover:cursor-pointer" />
                </span>
            ),
        },
    ];

    const formFields: FormField[] = [
        { id: 'name', label: 'Name', type: 'text', value: formData.name },
        { id: 'email', label: 'Email', type: 'email', value: formData.email },
        { id: 'website', label: 'Website', type: 'text', value: formData.website },
        { id: 'phone_number', label: 'Phone Number', type: 'text', value: formData.phone_number },
        { id: 'working_time', label: 'Working Time', type: 'text', value: formData.working_time },
        { id: 'office_open_time', label: 'Office Open Time', type: 'time', value: formData.office_open_time },
        { id: 'office_close_time', label: 'Office Close Time', type: 'time', value: formData.office_close_time },
        { id: 'break_start_time', label: 'Break Start Time', type: 'time', value: formData.break_start_time },
        { id: 'break_end_time', label: 'Break End Time', type: 'time', value: formData.break_end_time },
    ];

    const standardFields: FormField[] = [
        { id: 'currency', label: 'Currency', type: 'text' },
        { id: 'tax_id', label: 'Tax ID', type: 'text' },
        { id: 'tax_percentage', label: 'Tax Percentage', type: 'text' },
    ];
    // 1. Define FormField schema for working days:
    const workingDayFields: FormField[] = [
        { id: 'day_name', label: 'Day Name', type: 'text' },
        { id: 'start', label: 'Start Time', type: 'time' },
        { id: 'end', label: 'End Time', type: 'time' },
        {
            id: 'is_selected',
            label: 'Is Selected',
            type: 'select',
            options: [
                { value: 'Yes', label: 'Yes' },
                { value: 'No', label: 'No' },
            ],
        },
    ];

    const closeModal = () => setModalConfig(null);

    const onButtonClick = () => {};

    const openInfoForm = () => {
        const info = policies[0]!;
        setModalConfig({
            title: 'Update Company Info',
            fields: formFields, // your array of FormField for info
            initialValues: {
                name: info.name,
                email: info.email,
                website: info.website,
                phone_number: info.phone_number,
                working_time: info.working_time,
                office_open_time: info.office_open_time,
                office_close_time: info.office_close_time,
                break_start_time: info.break_start_time,
                break_end_time: info.break_end_time,
            },

            onSubmit: async (data) => {
                await SettingServices.updateCompanyInfo(info.id!, data)
                    .then(() => {
                        toast.success('Company Info updated');
                        SettingServices.fetchCompanyInfo().then(setPolicies);
                        closeModal();
                    })
                    .catch((e) => {
                        toast.error(e.message || 'error', { duration: 4000 });
                    });
            },
        });
    };
    // ─── open Standard form ───────────────────────
    const openStandardForm = () => {
        const std = policies[0]!;
        setModalConfig({
            title: 'Update Company Standard',
            fields: standardFields, // your array of FormField for standard
            initialValues: {
                currency: std.currency,
                tax_id: std.tax_id,
                tax_percentage: std.tax_percentage,
            },
            onSubmit: async (data) => {
                await SettingServices.updateCompanyInfo(std.id!, data);
                toast.success('Standard updated');
                const updated = await SettingServices.fetchCompanyInfo();
                setPolicies(updated);
            },
        });
    };
    // ─── open Standard form ───────────────────────
    const openWorkingDayForm = (id: number) => {
        console.log('Given Id: ', id);
        const wd = policies[0]?.working_days_details?.find((w) => w.id === id); // or pick which day you want
        if (!wd) {
            toast.error('No working day to edit');
            return;
        }

        setModalConfig({
            title: `Edit Working Day: ${wd.day_name}`,
            fields: workingDayFields,
            initialValues: {
                day_name: wd.day_name,
                start: wd.start,
                end: wd.end,
                is_selected: wd.is_selected ? 'true' : 'false',
            },
            onSubmit: async (data) => {
                const cleanData = {
                    ...data,
                    is_selected: data.is_selected === 'true',
                    day_name: (data.day_name as string)
                        .trim()
                        .toLowerCase()
                        .replace(/\b\w/g, (c) => c.toUpperCase()),
                };
                try {
                    // call your API to update this one working day
                    await SettingServices.UpdateWorkingDay(wd.id, cleanData);
                    toast.success('Working day updated');
                    // then reload full company info to refresh that nested list
                    const updated = await SettingServices.fetchCompanyInfo();
                    setPolicies(updated);
                } catch {
                    toast.error('Failed to update working day');
                }
            },
        });
    };
    const openWorkingDayFormNew = () => {
        const flag = false;
        setModalConfig({
            title: `Add Working Day`,
            fields: workingDayFields,
            initialValues: {
                day_name: '',
                start: '09:00',
                end: '17:00',
                is_selected: flag ? 'false' : 'true',
            },
            onSubmit: async (data) => {
                const cleanData = {
                    ...data,
                    // day_name: data.day_name.strip,
                    is_selected: data.is_selected === 'true',
                    day_name: (data.day_name as string)
                        .trim()
                        .toLowerCase()
                        .replace(/\b\w/g, (c) => c.toUpperCase()),
                };
                try {
                    // call your API to update this one working day
                    await SettingServices.AddWorkingDay(cleanData);
                    toast.success('Working day updated');
                    // then reload full company info to refresh that nested list
                    const updated = await SettingServices.fetchCompanyInfo();
                    setPolicies(updated);
                } catch (e: any) {
                    toast.error(e.message);
                }
            },
        });
    };
    const handleDeleteWorkDay = (id: number) => {
        if (!id) return;
        Swal.fire({
            title: 'Are you sure?',
            text: `Do you really want to Delete this WorkingDay#${id}? This action is irreversible.`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, Delete',
            cancelButtonText: 'Cancel',
            timer: 8000,
            timerProgressBar: true,
            showCloseButton: true,
            reverseButtons: true,
        }).then((result) => {
            if (result.isConfirmed) {
                SettingServices.DeleteWorkingDay(id)
                    .then(() => {
                        toast.success('Working day deleted successfully', { duration: 4000 });
                        fetchCompanyInfo();
                    })
                    .catch((e) => {
                        toast.error(e.message);
                    });
            }
        });
    };

    if (!policies[0]) {
        return <div></div>;
    }

    return (
        <div>
            {/* Taps */}
            <div className="mb-4 px-1 flex flex-col sm:flex-row items-center justify-between w-full rounded-lg bg-gray-200 sm:rounded-full py-1">
                <div onClick={() => setActiveTab(1)} className={`px-8 hover:cursor-pointer flex flex-grow justify-center items-center gap-1 rounded-full ${activeTabe === 1 && activeCSS}`}>
                    <Building2 size={14} />
                    <span>Company Info</span>
                </div>
                <div onClick={() => setActiveTab(2)} className={`px-8 hover:cursor-pointer flex flex-grow justify-center items-center gap-1 rounded-full ${activeTabe === 2 && activeCSS}`}>
                    <Settings size={14} />
                    <span>Company Standard</span>
                </div>
                <div onClick={() => setActiveTab(3)} className={`px-8 hover:cursor-pointer flex flex-grow justify-center items-center gap-1 rounded-full ${activeTabe === 3 && activeCSS}`}>
                    <Calendar size={14} />
                    <span>Working Days</span>
                </div>
            </div>

            {/* Info Section */}
            {activeTabe === 1 && (
                <section className="border bg-white p-4 py-6 rounded-2xl mb-4">
                    {/* Headings and Button*/}
                    <div className="flex items-center justify-between px-4 mb-6">
                        <div>
                            <div className="flex items-center gap-2">
                                <Building2 />
                                <h1>Company Information</h1>
                            </div>
                            <p className="text-[10px] text-gray-500">Basic company details and contact information</p>
                        </div>
                        <button onClick={openInfoForm} className="text-sm flex items-center gap-2 bg-black text-white px-3 py-1 rounded hover:cursor-pointer">
                            <Edit className="text-gray-300 size-4" />
                            <span className="font-semibold">Update info</span>
                        </button>
                    </div>
                    {/* cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                        <div className="gap-4 bg-[#EFF6FF] flex py-2 px-8 rounded-xl items-center justify-start">
                            <Building2 size={28} color="blue" />
                            <div className="flex flex-col">
                                <span className="text-gray-500 text-[12px]">Company Name</span>
                                <span className="text-lg font-semibold">{policies[0].name}</span>
                            </div>
                        </div>
                        <div className="gap-4 bg-[#FAF5FF] flex py-2 px-8 rounded-xl items-center justify-start">
                            <Globe size={28} className="text-[#9038b3]" />
                            <div className="flex flex-col">
                                <span className="text-gray-500 text-[12px]">Website</span>
                                <span className="text-lg font-semibold">{policies[0].website}</span>
                            </div>
                        </div>
                        <div className="gap-4 bg-[#FEFCE8] flex py-2 px-8 rounded-xl items-center justify-start">
                            <Clock size={28} className="text-[#d8cd36]" />
                            <div className="flex flex-col">
                                <span className="text-gray-500 text-[12px]">Working Hours</span>
                                <span className="text-lg font-semibold">{policies[0].working_time} hours/day</span>
                            </div>
                        </div>
                        <div className="gap-4 bg-[#F0FDF4] flex py-2 px-8 rounded-xl items-center justify-start">
                            <Mail size={28} className="text-[#24ad4d]" />
                            <div className="flex flex-col">
                                <span className="text-gray-500 text-[12px]">Email</span>
                                <span className="text-lg font-semibold">{policies[0].email}</span>
                            </div>
                        </div>
                        <div className="gap-4 bg-[#FFF7ED] flex py-2 px-8 rounded-xl items-center justify-start">
                            <Phone size={28} className="text-[#ff6060]" />
                            <div className="flex flex-col">
                                <span className="text-gray-500 text-[12px]">Phone</span>
                                <span className="text-lg font-semibold">{policies[0].phone_number}</span>
                            </div>
                        </div>
                        <div className="gap-4 bg-[#FEF2F2] flex py-2 px-8 rounded-xl items-center justify-start">
                            <Coffee size={28} className="text-[#541e69]" />
                            <div className="flex flex-col">
                                <span className="text-gray-500 text-[12px]">Break Time</span>
                                <span className="text-lg font-semibold">{`${formatTimeToAMPM(policies[0].break_start_time)} - ${formatTimeToAMPM(policies[0].break_end_time)}`}</span>
                            </div>
                        </div>
                    </div>

                    <div className="mt-8 flex items-center justify-between bg-[#F5F5F7] py-4 px-5 rounded-lg">
                        <div>
                            <h4 className="tex-sm font-semibold">Office Hours</h4>
                            <p className="text-[12px] text-gray-500">Daily operating schedule</p>
                        </div>
                        <div>
                            <div className="tex-sm font-semibold">{`${formatTimeToAMPM(policies[0].break_start_time)} - ${formatTimeToAMPM(policies[0].break_end_time)}`}</div>
                            <p className="text-[12px] text-gray-500">Monday to Saturday</p>
                        </div>
                    </div>
                </section>
            )}

            {/* Standard Section */}
            {activeTabe === 2 && (
                <section className="border bg-white p-4 py-6 rounded-2xl mb-4">
                    {/* Headings and Button*/}
                    <div className="flex items-center justify-between px-4  mb-6">
                        <div>
                            <div className="flex items-center gap-2">
                                <Settings />
                                <h1>Company Standards</h1>
                            </div>
                            <p className="text-[10px] text-gray-500">Financial and tax configuration settings</p>
                        </div>
                        <button onClick={openStandardForm} className="text-sm flex items-center gap-2 bg-black text-white px-3 py-[6px] rounded hover:cursor-pointer">
                            <Edit className="text-gray-300 size-4" />
                            <span className="font-semibold">Update Standard</span>
                        </button>
                    </div>
                    {/* cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                        <div className="gap-4 bg-[#EFF6FF] flex py-2 px-8 rounded-xl items-center justify-start">
                            <CreditCard size={28} color="blue" />
                            <div className="flex flex-col">
                                <span className="text-gray-500 text-[12px]">Currency</span>
                                <span className="text-lg font-semibold">{policies[0].currency}</span>
                            </div>
                        </div>
                        <div className="gap-4 bg-[#FAF5FF] flex py-2 px-8 rounded-xl items-center justify-start">
                            <Receipt size={28} className="text-[#9038b3]" />
                            <div className="flex flex-col">
                                <span className="text-gray-500 text-[12px]">Tax ID</span>
                                <span className="text-lg font-semibold">{policies[0].tax_id}</span>
                            </div>
                        </div>
                        <div className="gap-4 bg-[#FEFCE8] flex py-2 px-8 rounded-xl items-center justify-start">
                            <Percent size={28} className="text-[#d8cd36]" />
                            <div className="flex flex-col">
                                <span className="text-gray-500 text-[12px]">Tax Rate</span>
                                <span className="text-lg font-semibold">{policies[0].tax_percentage}</span>
                            </div>
                        </div>
                    </div>

                    <div className="mt-8 flex gap-4 items-center border border-[#fad957] bg-[#FFFBEB] py-4 px-5 rounded-lg">
                        <Info className="text-[#c7a82b]" />
                        <div>
                            <h4 className="text-[#ad8429] tex-sm font-semibold">Important Note</h4>
                            <p className="text-[#ac7829] text-[12px]">Changes to tax configuration will affect all future financial calculations. Please ensure accuracy before updating.</p>
                        </div>
                    </div>
                </section>
            )}

            {/* Working Days */}
            {activeTabe === 3 && (
                <div className="panel">
                    <div className="flex justify-between items-center mb-5">
                        <div className="">
                            <div className="flex items-center gap-2">
                                <Calendar />
                                <h5 className="font-semibold text-lg dark:text-white-light">Working Days Management</h5>
                            </div>
                            <p className="text-[12px] text-gray-600">Configure working schedules for each day of the week</p>
                        </div>

                        <button type="button" className="btn btn-primary" onClick={openWorkingDayFormNew}>
                            Add Day
                        </button>
                    </div>
                    <div className="datatables">
                        <DataTable
                            records={policies[0]?.working_days_details}
                            columns={WorkingDay}
                            totalRecords={policies.length}
                            page={page}
                            recordsPerPage={recordsPerPage}
                            onPageChange={setPage}
                            onRecordsPerPageChange={setRecordsPerPage}
                            recordsPerPageOptions={[5, 10, 20, 50]}
                            minHeight={200}
                            paginationText={({ from, to, totalRecords }) => `Showing ${from} to ${to} of ${totalRecords}`}
                            striped
                            highlightOnHover
                        />
                    </div>
                </div>
            )}

            <Transition appear show={!!modalConfig} as={Fragment}>
                <Dialog as="div" className="relative z-50" onClose={closeModal}>
                    <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
                        <div className="fixed inset-0 bg-black bg-opacity-25" />
                    </Transition.Child>

                    <div className="fixed inset-0 overflow-y-auto z-50">
                        <div className="flex items-center justify-center min-h-full p-4 text-center">
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 scale-95"
                                enterTo="opacity-100 scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 scale-100"
                                leaveTo="opacity-0 scale-95"
                            >
                                <Dialog.Panel className="w-full max-w-3xl p-6 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-xl">
                                    <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900 mb-4">
                                        {modalConfig?.title || 'Popup Editor'}
                                    </Dialog.Title>
                                    {modalConfig && (
                                        <CommonPopup
                                            fields={modalConfig.fields}
                                            initialValues={modalConfig.initialValues}
                                            onSubmit={async (formData) => {
                                                await modalConfig.onSubmit(formData);
                                                closeModal();
                                            }}
                                            onCancel={closeModal}
                                        />
                                    )}
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>

            <Toaster
                position="top-right"
                reverseOrder={false}
                toastOptions={{
                    duration: 4000, // Default 4 seconds for all toasts
                }}
            />
        </div>
    );
};

export default Company_Info;
