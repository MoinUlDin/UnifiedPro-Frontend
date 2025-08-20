import { useState, Fragment, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '../../../store/themeConfigSlice';
import CommonTable from '../Common_Table';
import FormComponent from '../Common_Popup';
import { LeaveRequestOwnerType } from '../../../constantTypes/EmployeeRelated';
import { CheckCircle, Edit2, HopOff, Plus, Trash2, XCircle, XOctagon } from 'lucide-react';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';
import EmployeeServices from '../../../services/EmployeeServices';
import LeaveRequestsPage from './LeaveRequestsPage';

const Time_Req = () => {
    if (true) {
        return <LeaveRequestsPage></LeaveRequestsPage>;
    }
    const dispatch = useDispatch();
    const [leaveRequests, setLeaveRequests] = useState<LeaveRequestOwnerType[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(true);
    const [currentEditId, setCurrentEditId] = useState<number | null>(null);
    const [isAdmin, setIsAdmin] = useState<boolean>(false);
    useEffect(() => {
        dispatch(setPageTitle('Leave Requests'));
    }, [dispatch]);

    const FetchLeaveRequests = () => {
        EmployeeServices.FetchLeaveRequests()
            .then((r) => {
                console.log('leaves requests: ', r);
                setLeaveRequests(r);
            })
            .catch((e) => {
                console.log(e);
            });
    };
    useEffect(() => {
        FetchLeaveRequests();
        const userInfo = JSON.parse(localStorage.getItem('UserInfo') || '');
        console.log('userIfo', userInfo);
        if (userInfo) {
            setIsAdmin(userInfo.is_owner);
        }
    }, []);

    const initialFormFields = {
        id: 0,
        Employee: '',
        Department: '',
        Designation: '',
        StartDate: '',
        EndDate: '',
        TotalDays: 0,
        Status: '',
    };
    const [formData, setFormData] = useState(initialFormFields);

    const formFields = [
        { id: 'Employee', label: 'Employee', type: 'text', value: formData.Employee },
        {
            id: 'Department',
            label: 'Department',
            type: 'select',
            value: formData.Department,
            options: [
                { value: 'IT', label: 'IT' },
                { value: 'Finance', label: 'Finance' },
                { value: 'HR', label: 'HR' },
            ],
        },
        { id: 'Designation', label: 'Designation', type: 'text', value: formData.Designation },
        { id: 'StartDate', label: 'Start Date', type: 'date', value: formData.StartDate },
        { id: 'EndDate', label: 'End Date', type: 'date', value: formData.EndDate },
        { id: 'TotalDays', label: 'Total Days', type: 'number', value: formData.TotalDays },
        {
            id: 'Status',
            label: 'Status',
            type: 'select',
            value: formData.Status,
            options: [
                { value: 'Pending', label: 'Pending' },
                { value: 'Approved', label: 'Approved' },
                { value: 'Rejected', label: 'Rejected' },
            ],
        },
    ];

    const handleApprove = (r: any) => {
        Swal.fire({
            title: 'Are you sure?',
            text: 'Do you really want to approve this?',
            icon: 'warning',
            showCancelButton: true, // ← enable the cancel button
            confirmButtonText: 'Yes, Approve',
            cancelButtonText: 'Cancel', // ← customize its label
            timer: 8000,
            timerProgressBar: true,
            showCloseButton: true,
            reverseButtons: true, // ← optional: swap positions
        }).then((result) => {
            if (result.isConfirmed) {
                EmployeeServices.ApproveLeaveRequest(r, { is_approved: true })
                    .then(() => {
                        toast.success('Request approved successfully', { duration: 4000 });
                        FetchLeaveRequests();
                    })
                    .catch((e) => {
                        toast.error(e.message);
                    });
            }
        });
    };

    const handleRejection = (id: number) => {
        if (!id) return;
        Swal.fire({
            title: 'Are you sure?',
            text: 'Do you really want to Reject this request?',
            icon: 'warning',
            showCancelButton: true, // ← enable the cancel button
            confirmButtonText: 'Yes, Reject',
            cancelButtonText: 'Cancel', // ← customize its label
            timer: 8000,
            timerProgressBar: true,
            showCloseButton: true,
            reverseButtons: true, // ← optional: swap positions
        }).then((result) => {
            if (result.isConfirmed) {
                EmployeeServices.ApproveLeaveRequest(id, { rejected: true })
                    .then(() => {
                        toast.success('Request Rejected successfully', { duration: 4000 });
                        FetchLeaveRequests();
                    })
                    .catch((e) => {
                        toast.error(e.message);
                    });
            }
        });
    };
    const handleAddOrEditLeaveRequest = (submittedData: any) => {
        // if (isEditMode && currentEditId !== null) {
        //     setLeaveRequests((prev) => prev.map((request) => (request.id === currentEditId ? { ...request, ...submittedData } : request)));
        //     setIsEditMode(false);
        //     setCurrentEditId(null);
        // } else {
        //     const newRequest = {
        //         ...submittedData,
        //         id: leaveRequests.length + 1,
        //     };
        //     setLeaveRequests((prev) => [...prev, newRequest]);
        // }
        // setFormData(initialFormFields);
        // closeModal();
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setFormData(initialFormFields);
        setIsEditMode(false);
        setCurrentEditId(null);
    };

    const openModal = () => setIsModalOpen(true);

    return (
        <div>
            <div className="bg-white rounded-lg shadow p-6 space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row gap-2 items-center justify-center sm:justify-between">
                    <div>
                        <h2 className="text-xl font-semibold text-gray-900">Leave Request</h2>
                        <p className="text-gray-600">Manage Employee's Leave Requests</p>
                    </div>
                    {!isAdmin && (
                        <button className="inline-flex text-[12px] sm:text-sm items-center gap-2 py-1 px-2 sm:px-4 sm:py-2 bg-gray-900 text-white rounded hover:bg-indigo-700">
                            <Plus className="w-4 h-4" />
                            Leave Request
                        </button>
                    )}
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="min-w-full text-left">
                        <thead className="">
                            <tr className="border-b ">
                                <th className="py-3 px-4 text-sm font-semibold bg-white text-gray-800">Employee</th>
                                <th className="py-3 px-4 text-sm font-semibold bg-white text-gray-800">Department</th>
                                <th className="py-3 px-4 text-sm font-semibold bg-white text-gray-800">Designation</th>
                                <th className="py-3 px-4 text-sm font-semibold bg-white text-gray-800">From</th>
                                <th className="py-3 px-4 text-sm font-semibold bg-white text-gray-800">To</th>
                                <th className="py-3 px-4 text-sm font-semibold bg-white text-gray-800">Status</th>
                                <th className="py-3 px-4 text-sm font-semibold bg-white text-gray-800">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {leaveRequests &&
                                leaveRequests?.map((r) => (
                                    <tr key={r.id}>
                                        <td className="py-3 px-4">{r.employee?.name}</td>
                                        <td className="py-3 px-4">{r.employee?.department}</td>
                                        <td className="py-3 px-4">{r.employee?.designation}</td>
                                        <td className="py-3 px-4">{r?.start_date}</td>
                                        <td className="py-3 px-4">{r?.end_date}</td>
                                        <td className={`py-3 px-4 flex items-center `}>
                                            <span className={`py-1 px-2 text-[12px] rounded-full ${r?.is_approved ? 'bg-green-500' : 'bg-yellow-400'} `}>{r.is_approved ? 'Approved' : 'Pending'}</span>
                                        </td>

                                        <td className="py-3 px-4 space-x-4 min-w-32">
                                            <button
                                                onClick={() => handleApprove(r.id)}
                                                disabled={r.is_approved}
                                                className={`text-gray-600  ${!r.is_approved && 'hover:text-indigo-600'}`}
                                                aria-label="Edit"
                                            >
                                                {/* <Edit2 className="w-4 h-4" /> */}
                                                <CheckCircle className={`w-5 h-5 ${r.is_approved && 'text-gray-300'}`} />
                                            </button>

                                            <button onClick={() => handleRejection(r.id)} className="text-gray-600 hover:text-red-600" aria-label="Delete">
                                                <HopOff className="w-5 h-5" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            {leaveRequests.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="py-6 px-4 text-center text-gray-500">
                                        No Request found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
            {/* Modal Popup for Form */}
            <Transition appear show={isModalOpen} as={Fragment}>
                <Dialog as="div" className="relative z-10" onClose={closeModal}>
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
                                        {isEditMode ? 'Edit Leave Request' : 'Add Leave Request'}
                                    </Dialog.Title>
                                    <FormComponent fields={formFields} onSubmit={handleAddOrEditLeaveRequest} onCancel={closeModal} />
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>
        </div>
    );
};

export default Time_Req;
