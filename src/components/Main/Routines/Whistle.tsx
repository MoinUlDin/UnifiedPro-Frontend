import { useState, Fragment, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Dialog, Transition } from '@headlessui/react';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '../../../store/themeConfigSlice';
import CommonTable from '../Common_Table';
import FormComponent from '../Common_Popup';
import CompanySetupServices from '../../../services/CompanySetupServices';
import axios from 'axios';
import toast from 'react-hot-toast';
import { timeAgoOrDate } from '../../../utils/Common';
import { ChevronDown } from 'lucide-react';
import { CheckOwner } from '../../../utils/Common';
import DOMPurify from 'dompurify';
import parse from 'html-react-parser';

const Whistle = () => {
    const dispatch = useDispatch();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [currentEditId, setCurrentEditId] = useState<number | null>(null);
    const CHOICES = ['Pending', 'In Progress', 'Resolved', 'Closed'];
    const [openDropdownId, setOpenDropdownId] = useState<number | null>(null);
    const [dropdownPos, setDropdownPos] = useState<{ top: number; left: number } | null>(null);
    const [isOwner, setIsOwner] = useState<boolean>(false);

    useEffect(() => {
        dispatch(setPageTitle('Whistleblower Reports'));
        setIsOwner(CheckOwner());
    }, [dispatch]);

    const [reports, setReports] = useState([
        {
            id: 0,
            subject: '',
            message: '',
            status: '',
            created_at: '',
        },
    ]);

    const initialFormFields = {
        id: 0,
        subject: '',
        message: '',
        status: '',
        created_at: '',
    };
    const FetchWhistlesblow = () => {
        CompanySetupServices.FetchWhistle().then((r) => {
            console.log('Whistle', r);
            setReports(r);
        });
    };
    useEffect(() => {
        FetchWhistlesblow();
    }, []);
    const [formData, setFormData] = useState(initialFormFields);

    const columns = [
        { accessor: 'id', title: 'ID' },
        { accessor: 'subject', title: 'subject' },
        { accessor: 'message', title: 'message' },
        { accessor: 'created_at', title: 'Created At' },
    ];

    const formFields = [
        {
            id: 'subject',
            label: 'Subject',
            type: 'text',
            value: formData.subject,
            onChange: (e: any) => setFormData({ ...formData, subject: e.target.value }),
        },
        {
            id: 'message',
            label: 'Message',
            type: 'textarea', // <-- textarea type
            value: formData.message,
            onChange: (e: any) => setFormData({ ...formData, message: e.target.value }),
            placeholder: 'Write the details here...',
            rows: 6,
        },
    ];

    const handleAddOrEditReport = async (submittedData: any) => {
        try {
            const payload = {
                subject: submittedData.subject,
                message: submittedData.message,
                uploaded_files: [],
            };

            if (isEditMode && currentEditId !== null) {
                CompanySetupServices.UpdateWhistle(currentEditId, payload)
                    .then(() => {
                        FetchWhistlesblow();
                    })
                    .catch((e) => {
                        toast.error('Can not update right now');
                    });
            } else {
                CompanySetupServices.AddWhistle(payload)
                    .then((r) => {
                        FetchWhistlesblow();
                        toast.success('added successfully');
                    })
                    .catch(() => {
                        console.log('error');
                    });
            }

            closeModal();
        } catch (error) {
            if (axios.isAxiosError(error)) {
                console.error('Error while adding or editing report:', error.response?.data || error.message);
            } else {
                console.error('Unexpected error:', error);
            }
        }
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setFormData(initialFormFields);
        setIsEditMode(false);
        setCurrentEditId(null);
    };

    const openModal = () => setIsModalOpen(true);

    // ---------- NEW: dropdown state + click-outside handling ----------

    // status -> tailwind classes for button background + text
    const statusColor = (status: string) => {
        switch (status) {
            case 'Pending':
                return 'bg-yellow-300 text-yellow-900 border-yellow-100';
            case 'In Progress':
                return 'bg-blue-300 text-blue-900 border-blue-100';
            case 'Resolved':
                return 'bg-green-300 text-green-900 border-green-100';
            case 'Closed':
                return 'bg-gray-300 text-gray-900 border-gray-100';
            default:
                return 'bg-gray-300 text-gray-900 border-gray-100';
        }
    };

    // persist status change
    const handleStatusChange = async (reportId: number, newStatus: string) => {
        try {
            // reuse existing UpdateWhistle endpoint (adjust payload shape if your API expects different)
            console.log('calling service UpdateWhistle', reportId, newStatus);
            await CompanySetupServices.UpdateWhistle(reportId, { status: newStatus });
            setReports((prev) => prev.map((r) => (r.id === reportId ? { ...r, status: newStatus } : r)));
            toast.success('Status updated');
            setOpenDropdownId(null);
        } catch (err) {
            console.error(err);
            toast.error('Failed to update status');
        }
    };
    useEffect(() => {
        const onDocClick = (ev: MouseEvent) => {
            const target = ev.target as HTMLElement | null;
            if (!target) return;
            // Allow clicks inside the button wrapper (.status-dropdown) OR inside the portal (.status-portal)
            if (target.closest('.status-dropdown') || target.closest('.status-portal')) return;
            setOpenDropdownId(null);
        };

        document.addEventListener('click', onDocClick);
        return () => document.removeEventListener('click', onDocClick);
    }, []);
    // ------------------------------------------------------------------

    return (
        <div className="responsiveTable">
            <div className="flex justify-between px-4 mb-3 mt-1">
                <h1 className="text-2xl font-bold">Whistle Reports</h1>
                <button onClick={() => setIsModalOpen(true)} className="btn btn-sm">
                    + Add Whistle
                </button>
            </div>
            {/* Table */}
            <div className="overflow-x-auto ">
                <table className="min-w-full text-left">
                    <thead className="">
                        <tr className="border-b ">
                            <th className="py-3 px-4 text-sm font-semibold bg-white text-gray-800">Id</th>
                            <th className="py-3 px-4 text-sm font-semibold bg-white text-gray-800">Subject</th>
                            <th className="py-3 px-4 text-sm font-semibold bg-white text-gray-800">Message</th>
                            <th className="py-3 px-4 text-sm font-semibold bg-white text-gray-800">Created At</th>
                            <th className="py-3 px-4 text-sm font-semibold bg-white text-gray-800">{isOwner ? 'Action' : 'Status'}</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y">
                        {reports.map((rr) => (
                            <tr key={rr.id}>
                                <td className="py-3 px-4">{rr.id}</td>
                                <td className="py-3 px-4">{rr.subject ?? '--'}</td>
                                <td className="py-3 px-4 flex items-center gap-1">
                                    <div className="text-sm leading-relaxed">{rr.message ? parse(DOMPurify.sanitize(rr.message)) : '--'}</div>
                                </td>

                                <td className="py-3 px-4">{timeAgoOrDate(rr.created_at)}</td>

                                {/* IMPORTANT: allow dropdown to overflow without forcing page scroll */}
                                {!isOwner && (
                                    <td>
                                        <span className={`text-sm px-2 py-1 rounded-full whitespace-nowrap ${statusColor(rr.status)}`}>{rr.status ?? 'Pending'}</span>
                                    </td>
                                )}
                                {isOwner && (
                                    <td className="py-3 px-4">
                                        <div className="status-dropdown inline-block relative">
                                            <button
                                                type="button"
                                                onClick={(e) => {
                                                    const btn = e.currentTarget as HTMLElement;
                                                    const rect = btn.getBoundingClientRect();
                                                    // place dropdown slightly below button
                                                    setDropdownPos({ top: rect.bottom + 8, left: rect.left });
                                                    setOpenDropdownId((prev) => (prev === rr.id ? null : rr.id));
                                                }}
                                                className={`whitespace-nowrap text-[10px] flex items-center gap-2 px-3 py-1.5 text-sm rounded-md border ${statusColor(rr.status)} focus:outline-none`}
                                                aria-haspopup="menu"
                                                aria-expanded={openDropdownId === rr.id}
                                            >
                                                <span>{rr.status ?? 'Pending'}</span>
                                                <ChevronDown className="w-4 h-4" />
                                            </button>
                                        </div>

                                        {/* portal dropdown - renders into body so it won't be clipped or cause scroll */}
                                        {openDropdownId === rr.id &&
                                            dropdownPos &&
                                            createPortal(
                                                <div
                                                    style={{ position: 'fixed', top: dropdownPos.top, left: dropdownPos.left - 20, zIndex: 9999 }}
                                                    className="status-portal w-44 bg-white border rounded-md shadow-lg py-1"
                                                >
                                                    {CHOICES.filter((c) => c !== rr.status).map((choice) => (
                                                        <button key={choice} onClick={() => handleStatusChange(rr.id, choice)} className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50">
                                                            {choice}
                                                        </button>
                                                    ))}
                                                </div>,
                                                document.body
                                            )}
                                    </td>
                                )}
                            </tr>
                        ))}
                        {reports.length === 0 && (
                            <tr>
                                <td colSpan={5} className="py-6 px-4 text-center text-gray-500">
                                    No job types found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
            {/* Modal Popup for Form */}
            <Transition appear show={isModalOpen} as={Fragment}>
                <Dialog as="div" className="relative z-50" onClose={closeModal}>
                    <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
                        <div className="fixed inset-0 bg-black bg-opacity-25" />
                    </Transition.Child>

                    <div className="fixed inset-0 overflow-y-auto">
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
                                        {isEditMode ? 'Edit Report' : 'Add Report'}
                                    </Dialog.Title>
                                    <FormComponent fields={formFields} onSubmit={(submittedData) => handleAddOrEditReport(submittedData)} onCancel={closeModal} />
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>
        </div>
    );
};

export default Whistle;
