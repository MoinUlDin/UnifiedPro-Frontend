import { useState, Fragment, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '../../../store/themeConfigSlice';
import FormComponent from '../Common_Popup';
import SalaryServices from '../../../services/SalaryServices';
import { ExpenseClaimListType } from '../../../constantTypes/SalaryTypes';
import toast from 'react-hot-toast';
import { captureDate } from '../../../utils/Common';
import { CheckCircle, SquareX } from 'lucide-react';

const Exp_Claims = () => {
    const dispatch = useDispatch();
    const [expClaims, setExpClaims] = useState<ExpenseClaimListType[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState<'approve' | 'reject' | null>(null);
    const [selectedExp, setSelectedExp] = useState<ExpenseClaimListType | null>(null);
    const [reason, setReason] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        dispatch(setPageTitle('Expense Claims'));
    }, [dispatch]);

    const FetchExpenseClaims = () => {
        SalaryServices.FetchExpenseClaims()
            .then((r) => {
                console.log('Expense Claims: ', r);
                setExpClaims(r);
            })
            .catch((e: any) => {
                toast.error(e?.message || 'Failed to fetch');
                console.log(e);
            });
    };
    useEffect(() => {
        FetchExpenseClaims();
    }, []);

    const openApproveModal = (exp: ExpenseClaimListType) => {
        setSelectedExp(exp);
        setModalMode('approve');
        setReason(''); // optional reason for approve
        setIsModalOpen(true);
    };

    const openRejectModal = (exp: ExpenseClaimListType) => {
        setSelectedExp(exp);
        setModalMode('reject');
        setReason('');
        setIsModalOpen(true);
    };

    const closeModal = () => {
        if (loading) return;
        setIsModalOpen(false);
        setSelectedExp(null);
        setModalMode(null);
        setReason('');
    };

    const confirmAction = async () => {
        if (!selectedExp || !modalMode) return;
        // for reject, require reason
        if (modalMode === 'reject' && reason.trim() === '') {
            toast.error('Please provide a rejection reason');
            return;
        }

        setLoading(true);
        try {
            if (modalMode === 'approve') {
                // assumed SalaryServices method - adjust if your service uses a different name
                await SalaryServices.ApproveExpenseClaim(selectedExp.id, {
                    approval_reason: reason || '',
                });
                toast.success('Expense claim approved');
            } else {
                await SalaryServices.RejectExpenseClaim(selectedExp.id, {
                    rejection_reason: reason,
                });
                toast.success('Expense claim rejected');
            }
            // refresh list
            FetchExpenseClaims();
            closeModal();
        } catch (err: any) {
            console.error(err);
            toast.error(err?.message || 'Action failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h2 className="text-xl font-bold mb-4">Expense Claims</h2>

            {/* Filters */}
            <div className="mb-4 flex gap-4">
                <button className="px-4 py-2 bg-gray-200 rounded">All</button>
                <button className="px-4 py-2 bg-gray-200 rounded">Filter by Department</button>
                <button className="px-4 py-2 bg-gray-200 rounded">Filter by Designation</button>
                <button className="px-4 py-2 bg-gray-200 rounded">Filter by Department Manager</button>
                <input type="date" className="px-4 py-2 bg-gray-200 rounded" placeholder="mm/dd/yyyy" />
            </div>

            {/* Table */}
            <div className="overflow-x-auto ">
                <table className="min-w-full text-left">
                    <thead className="">
                        <tr className="border-b ">
                            <th className="py-3 px-4 text-sm font-semibold bg-white text-gray-800">Employee</th>
                            <th className="py-3 px-4 text-sm font-semibold bg-white text-gray-800">Description</th>
                            <th className="py-3 px-4 text-sm font-semibold bg-white text-gray-800">Amount</th>
                            <th className="py-3 px-4 text-sm font-semibold bg-white text-gray-800">Claim Date</th>
                            <th className="py-3 px-4 text-sm font-semibold bg-white text-gray-800">Status</th>
                            <th className="py-3 px-4 text-sm font-semibold bg-white text-gray-800">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y">
                        {expClaims.map((exp) => {
                            const status = exp.is_approved ? 'Approved' : exp.rejected ? 'Rejected' : 'Pending';
                            return (
                                <tr key={exp.id}>
                                    <td className="py-3 px-4 flex items-center gap-1">{exp.employee.name}</td>
                                    <td className="py-3 px-4">{exp.description ?? '--'}</td>
                                    <td className="py-3 px-4">{exp.amount}</td>
                                    <td className="py-3 px-4">{captureDate(exp.claim_date)}</td>
                                    <td className="py-3 px-4">{status}</td>
                                    <td className="py-3 px-4 space-x-4">
                                        <button
                                            disabled={exp.is_approved}
                                            onClick={() => openApproveModal(exp)}
                                            className={`${exp.is_approved ? 'text-gray-400' : 'text-gray-600 hover:text-indigo-600'}  `}
                                            aria-label="Approve"
                                        >
                                            <CheckCircle className="w-5 h-5" />
                                        </button>
                                        <button
                                            disabled={exp.rejected}
                                            onClick={() => openRejectModal(exp)}
                                            className={`${exp.rejected ? 'text-gray-400' : 'text-gray-600 hover:text-red-600'} `}
                                            aria-label="Reject"
                                        >
                                            <SquareX className="w-5 h-5" />
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                        {expClaims.length === 0 && (
                            <tr>
                                <td colSpan={6} className="py-6 px-4 text-center text-gray-500">
                                    No expense claims found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Modal placeholder replaced by the actual modal below */}
            {isModalOpen && (
                <div className="inset-0 fixed z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-labelledby="modal-title">
                    <div
                        className="absolute inset-0 bg-black bg-opacity-40 transition-opacity"
                        onClick={() => {
                            if (!loading) closeModal();
                        }}
                    />
                    <div className="relative bg-white rounded-lg shadow-lg w-full max-w-lg mx-auto z-10 p-6">
                        <h3 id="modal-title" className="text-lg font-semibold mb-2">
                            {modalMode === 'approve' ? 'Approve Expense Claim' : 'Reject Expense Claim'}
                        </h3>

                        <p className="text-sm text-gray-600 mb-4">
                            {modalMode === 'approve'
                                ? 'Are you sure you want to approve this expense claim? You may add an approval reason (optional).'
                                : 'Are you sure you want to reject this expense claim? Please provide a rejection reason.'}
                        </p>

                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Employee</label>
                            <div className="text-sm text-gray-800">{selectedExp?.employee?.name ?? '--'}</div>
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
                            <div className="text-sm text-gray-800">{selectedExp?.amount ?? '--'}</div>
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">{modalMode === 'approve' ? 'Approval Reason (optional)' : 'Rejection Reason'}</label>
                            <textarea
                                value={reason}
                                onChange={(e) => setReason(e.target.value)}
                                rows={4}
                                className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200"
                                placeholder={modalMode === 'approve' ? 'Add an approval note (optional)' : 'Why are you rejecting this claim?'}
                            />
                        </div>

                        <div className="flex justify-end gap-3">
                            <button type="button" onClick={closeModal} disabled={loading} className="px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-300">
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={confirmAction}
                                disabled={loading || (modalMode === 'reject' && reason.trim() === '')}
                                className={`px-4 py-2 rounded-md text-white ${modalMode === 'approve' ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-red-600 hover:bg-red-700'} disabled:opacity-60`}
                            >
                                {loading ? 'Processing...' : modalMode === 'approve' ? 'Confirm Approve' : 'Confirm Reject'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Exp_Claims;
