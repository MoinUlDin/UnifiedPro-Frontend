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
import { FaCalendar, FaCalendarAlt, FaCog, FaFileInvoice, FaMoneyBill } from 'react-icons/fa';

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

    useEffect(() => {
        SettingServices.fetchCompanyInfo()
            .then((r) => {
                console.log('Comapany Info: ', r);
                setPolicies(r);
            })
            .catch((e) => {
                console.log(e);
            });
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

    const columns = [
        { accessor: 'id', title: 'ID' },
        { accessor: 'name', title: 'Name', width: 100 },
        { accessor: 'email', title: 'Email' },
        { accessor: 'website', title: 'Website', render: (row: any) => <div className="min-w-28">{row.website}</div> },
        { accessor: 'phone_number', title: 'Phone Number' },
        { accessor: 'working_time', title: 'Working Time' },
        { accessor: 'office_open_time', title: 'Office Open Time', render: (row: any) => formatTimeToAMPM(row.office_open_time) },
        { accessor: 'office_close_time', title: 'Office Close Time', render: (row: any) => formatTimeToAMPM(row.office_close_time) },
        { accessor: 'break_start_time', title: 'Break Start Time', render: (row: any) => formatTimeToAMPM(row.break_start_time) },
        { accessor: 'break_end_time', title: 'Break End Time', render: (row: any) => formatTimeToAMPM(row.break_end_time) },
    ];

    const Standard = [
        { accessor: 'id', title: 'ID' },
        { accessor: 'currency', title: 'Currency' },
        { accessor: 'tax_id', title: 'Tax ID' },
        { accessor: 'tax_percentage', title: 'Tax Percentage', render: (row: any) => `${row.tax_percentage}%` },
    ];
    const WorkingDay = [
        { accessor: 'id', title: 'ID' },
        { accessor: 'day_name', title: 'Day Name' },
        { accessor: 'start', title: 'Start Time', render: (row: any) => formatTimeToAMPM(row.start) },
        { accessor: 'end', title: 'End Time', render: (row: any) => formatTimeToAMPM(row.end) },
        {
            accessor: 'action',
            title: 'Action',
            render: (row: any) => (
                <span className="flex items-center gap-3">
                    <button onClick={() => openWorkingDayForm(row.id)} key={'edit'} className="btn btn-sm btn-outline-primary">
                        Edit
                    </button>
                    <button key={'delete'} className="btn btn-sm btn-outline-danger">
                        Delete
                    </button>
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
    // 2. In your component, add:
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
                start: '',
                end: '',
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

    return (
        <div>
            <div className="mb-4 px-1 flex items-center justify-between w-full bg-gray-200 rounded-full py-1">
                <div onClick={() => setActiveTab(1)} className={`hover:cursor-pointer flex flex-grow justify-center items-center gap-1 rounded-full ${activeTabe === 1 && activeCSS}`}>
                    <FaFileInvoice />
                    <span>Company Info</span>
                </div>
                <div onClick={() => setActiveTab(2)} className={`hover:cursor-pointer flex flex-grow justify-center items-center gap-1 rounded-full ${activeTabe === 2 && activeCSS}`}>
                    <FaCog />
                    <span>Company Standard</span>
                </div>
                <div onClick={() => setActiveTab(3)} className={`hover:cursor-pointer flex flex-grow justify-center items-center gap-1 rounded-full ${activeTabe === 3 && activeCSS}`}>
                    <FaCalendarAlt className="" />
                    <span>Working Days</span>
                </div>
            </div>
            <section className=""></section>
            {/* Company Info */}
            <div className="panel">
                <div className="flex justify-between items-center mb-5">
                    <h5 className="font-semibold text-lg dark:text-white-light">Company Info</h5>
                    <button type="button" className="btn btn-primary" onClick={openInfoForm}>
                        Update Info
                    </button>
                </div>
                <div className="datatables">
                    <DataTable
                        records={policies}
                        columns={columns}
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
            {/* Company Standard */}
            <div className="panel">
                <div className="flex justify-between items-center mb-5">
                    <h5 className="font-semibold text-lg dark:text-white-light">Company Standard</h5>
                    <button type="button" className="btn btn-primary" onClick={openStandardForm}>
                        Update Standard
                    </button>
                </div>
                <div className="datatables">
                    <DataTable
                        records={policies}
                        columns={Standard}
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
            {/* Working Days */}
            <div className="panel">
                <div className="flex justify-between items-center mb-5">
                    <h5 className="font-semibold text-lg dark:text-white-light">Working Day</h5>
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
