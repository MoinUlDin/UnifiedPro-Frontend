import { useState, Fragment, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { DataTable } from 'mantine-datatable';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '../../../store/themeConfigSlice';
import CommonTable from '../Common_Table';
import CommonPopup from '../Common_Popup';
import CompanyStandards from './Company_Info_Details/CompanyStandards';
import WorkingDays from './Company_Info_Details/WorkingDays';
import Branches from './Company_Info_Details/Branches';
import SubCompanies from './Company_Info_Details/SubCompanies';
import SettingServices from '../../../services/SettingServices';
import { render } from '@fullcalendar/core/preact';
// Define the policy type to match the shape of policy objects
interface Policy {
    id: number;
    name: string;
    email: string;
    website: string;
    currency?: string;
    tax_id?: string;
    tax_percentage?: string;
    phone_number: string;
    working_time: string;
    office_open_time: string;
    office_close_time: string;
    break_start_time: string;
    break_end_time: string;
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
        name: 'None',
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
        { accessor: 'DayName', title: 'Day Name' },
        { accessor: 'StartTime', title: 'Start Time' },
        { accessor: 'EndTime', title: 'End Time' },
    ];

    const formFields = [
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

    const handleAddOrEditPolicy = (submittedData: typeof initialFormFields) => {
        if (isEditMode && currentEditId !== null) {
            setPolicies((prev) => prev.map((policy) => (policy.id === currentEditId ? { ...policy, ...submittedData } : policy)));
            setIsEditMode(false);
            setCurrentEditId(null);
        } else {
            const newPolicy = {
                ...submittedData,
                id: policies.length + 1,
            };
            setPolicies((prev) => [...prev, newPolicy]);
        }

        setFormData(initialFormFields);
        closeModal();
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setFormData(initialFormFields);
        setIsEditMode(false);
        setCurrentEditId(null);
    };

    const openModal = () => setIsModalOpen(true);
    const onButtonClick = () => {};

    return (
        <div>
            {/* Company Info */}
            <div className="panel">
                <div className="flex justify-between items-center mb-5">
                    <h5 className="font-semibold text-lg dark:text-white-light">Company Info</h5>
                    <button type="button" className="btn btn-primary" onClick={onButtonClick}>
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
                    <button type="button" className="btn btn-primary" onClick={onButtonClick}>
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
                    <button type="button" className="btn btn-primary" onClick={onButtonClick}>
                        Add Day
                    </button>
                </div>
                <div className="datatables">
                    <DataTable
                        records={policies}
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

            <Transition appear show={isModalOpen} as={Fragment}>
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
                                        {isEditMode ? 'Edit Policy' : 'Add Policy'}
                                    </Dialog.Title>
                                    <CommonPopup fields={formFields} onSubmit={handleAddOrEditPolicy} onCancel={closeModal} />
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>
        </div>
    );
};

export default Company_Info;
