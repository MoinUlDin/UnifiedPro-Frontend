import { DataTable } from 'mantine-datatable';
import { useEffect, useState } from 'react';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import DepartmentalGoalsPopup from './DepartmentalGoalsPopup';
import { DepartmentGoalType } from '../../../../constantTypes/Types';
import DepartmentGoalServices from '../../../../services/DepartmentGoalServices';
import { render } from '@fullcalendar/core/preact';
import { spacing } from 'react-select/dist/declarations/src/theme';
import toast, { Toaster } from 'react-hot-toast';
import ConfirmActionModal from '../../../ConfirmActionModel';
import { ChildParent } from './Company_Goals_List';
import { Progress } from '@mantine/core';

const Departmental_Goals_List = ({ parentState, setparentState }: ChildParent) => {
    const [modelOpen, setModelOpen] = useState(false);
    const [page, setPage] = useState(1);
    const PAGE_SIZES = [10, 20, 30, 50, 100];
    const [pageSize, setPageSize] = useState(PAGE_SIZES[0]);
    const [initialData, setInitailData] = useState<any>();
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [refresh, setRefresh] = useState<boolean>(false);
    const [editItemID, setEditItemID] = useState<number | null>(null);
    const [openConfirmationModal, setOpenConfirmationModal] = useState(false);
    const [deleteId, setDeleteId] = useState<number | null>(null);
    const [goalData, setGoalData] = useState<DepartmentGoalType[]>();

    const totalRecords = goalData?.length;
    const [recordsData, setRecordsData] = useState(goalData?.slice(0, pageSize));

    useEffect(() => {
        DepartmentGoalServices.FetchGoals()
            .then((r) => {
                console.log('department Goals:', r);
                setGoalData(r);
            })
            .catch((e) => {
                console.log(e);
            });
    }, [refresh, parentState]);
    useEffect(() => {
        setparentState(parentState + 1);
    }, [refresh]);
    useEffect(() => {
        setPage(1);
    }, [pageSize]);

    useEffect(() => {
        const from = (page - 1) * pageSize;
        const to = from + pageSize;
        setRecordsData(goalData?.slice(from, to));
    }, [page, pageSize, goalData]);

    const columns = [
        {
            accessor: 'goal_text',
            title: 'Goal Text',
            render: (row: DepartmentGoalType) => {
                return (
                    <div key={`prog-${row.id}`} className="flex flex-col gap-2">
                        <div>{row.goal_text}</div>
                        <div className="flex items-center gap-1">
                            <span className="text-gray-600 text-[12px]">Target: {Number(row.target).toFixed(0)}</span>
                            <span className="text-gray-600 ">|</span>
                            <span className="text-gray-600 text-[12px]">Weight: {row.weight}</span>
                        </div>
                    </div>
                );
            },
        },
        { accessor: 'department', title: 'Department', render: (row: DepartmentGoalType) => <span>{row.department?.name} </span> },
        {
            accessor: 'progress',
            title: 'Performance',
            render: (row: DepartmentGoalType) => {
                return (
                    <div key={`prog-${row.id}`} className="flex flex-col ">
                        <span className="text-sm">{row.performance} %</span>
                        <Progress value={row.performance} size="sm" animate striped radius="sm" />
                    </div>
                );
            },
        },
        {
            accessor: 'sg_counts',
            title: 'Sessional',
            style: { padding: '0px', width: '1%' },
            render: (row: DepartmentGoalType) => {
                return (
                    <div key={`kpis-${row.id}`} className="flex items-center">
                        <div className="text-[10px] bg-[#ECEEF2] px-4  rounded-xl">
                            {row.sg_counts} {row?.sg_counts! <= 1 ? 'SG' : 'SGs'}
                        </div>
                    </div>
                );
            },
        },
    ];

    const adjustedColumns = [
        ...columns,
        {
            accessor: 'action',
            title: 'Action',
            render: (item: DepartmentGoalType) => (
                <div className="flex justify-start">
                    <Tippy content="Edit">
                        <button type="button" className="text-blue-600 hover:text-blue-800" onClick={() => handleEditClick(item)}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-5 h-5">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 4H4a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2v-7m-6-9l7 7M15 3l6 6" />
                            </svg>
                        </button>
                    </Tippy>
                    <Tippy content="Delete">
                        <button type="button" className="text-red-600 hover:text-red-800 ml-2" onClick={() => handleDeleteClick(item.id)}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-5 h-5">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </Tippy>
                </div>
            ),
        },
    ];

    const handleSubmit = (data: any) => {
        console.log('Given Data: ', data);
        if (isEditing && editItemID) {
            DepartmentGoalServices.UpdateGoal(editItemID, data)
                .then(() => {
                    toast.success('Goal Updated Successfully');
                    setRefresh((p) => !p);
                })
                .catch((e) => {
                    toast.error(e.message || 'Error Updating Gaol');
                });
        } else {
            DepartmentGoalServices.AddGoal(data)
                .then(() => {
                    console.log('Added');
                    toast.success('Goal Added Successfully', { duration: 5000 });
                    setRefresh((p) => !p);
                    setInitailData(null);
                })
                .catch((e: any) => {
                    toast.error(e.message || 'Error Adding Gaol');
                });
        }
    };

    const handleEditClick = (item: DepartmentGoalType) => {
        setEditItemID(item.id);
        setIsEditing(true);
        setInitailData(item);
        setModelOpen(true);
    };

    const handleConfirmDelete = () => {
        if (!deleteId) {
            toast.error('Delete Id not found', { duration: 4000 });
            return;
        }
        DepartmentGoalServices.DeleteGoal(deleteId)
            .then(() => {
                toast.success('Goal Deleted Successfully', { duration: 4000 });
                setRefresh((p) => !p);
                setDeleteId(null);
            })
            .catch((e) => {
                toast.error(e.message || 'Error Deleting Goal', { duration: 4000 });
            });
    };

    const handleDeleteClick = (id: number) => {
        console.log('Delete clicked for ID:', id);
        setDeleteId(id);
        setOpenConfirmationModal(true);
    };

    const handleCreateGoal = () => {
        setEditItemID(null);
        setInitailData(null);
        setIsEditing(false);
        setModelOpen(true);
    };

    return (
        <div>
            <div className="panel mt-8">
                <div className="flex justify-between items-center text-center">
                    <h5 className="font-semibold text-lg dark:text-white-light mb-4 pt-2">Departmental Goals List</h5>
                    <button type="button" className="btn btn-primary mb-4" onClick={handleCreateGoal}>
                        Create New Departmental Goal
                    </button>
                </div>
                <div className="datatables">
                    <DataTable
                        noRecordsText="No results match your search query"
                        highlightOnHover
                        className="whitespace-nowrap table-hover"
                        withBorder={false}
                        minHeight={220}
                        columns={adjustedColumns}
                        records={recordsData}
                        totalRecords={totalRecords}
                        page={page}
                        recordsPerPage={pageSize}
                        onPageChange={setPage}
                        onRecordsPerPageChange={setPageSize}
                        recordsPerPageOptions={PAGE_SIZES}
                        paginationText={({ from, to, totalRecords }) => `Showing ${from} to ${to} of ${totalRecords} entries`}
                    />
                </div>
            </div>
            <Toaster position="top-right" reverseOrder={false} />
            <ConfirmActionModal
                opened={openConfirmationModal}
                onClose={() => setOpenConfirmationModal(false)}
                onConfirm={handleConfirmDelete}
                title="Confirm Deletion"
                message="Are you sure you want to delete this Goal? <br/> This action will delete all child Goals e.g Sessional Goal <br/> Continue?"
                btnText="Delete"
            />
            {/* Uncomment this line and define Job_Type_Popup component when ready */}
            {modelOpen && <DepartmentalGoalsPopup isEditing={isEditing} initialData={initialData} onSubmit={handleSubmit} closeModel={() => setModelOpen(false)} />}
        </div>
    );
};

export default Departmental_Goals_List;
