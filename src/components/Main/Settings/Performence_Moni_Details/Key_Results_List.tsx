import { DataTable } from 'mantine-datatable';
import { useEffect, useState } from 'react';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import Key_Results_List_Popup from './Key_Results_List_Popup';
import SessionalGoalServices from '../../../../services/SessionalGoalServices';
import KeyResultServices from '../../../../services/KeyResultServices';
import toast, { Toaster } from 'react-hot-toast';
import ConfirmActionModal from '../../../ConfirmActionModel';
import { ChildParent } from './Company_Goals_List';
import { KeyResultType } from '../../../../constantTypes/Types';
import { Progress } from '@mantine/core';

const Key_Results_List = ({ parentState, setparentState }: ChildParent) => {
    const [openKeyPopup, setOpenKeyPopup] = useState(false);
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [selectedId, setSelectedId] = useState<null | number>(null);
    const [initialData, setInitialData] = useState<any | null>(null);
    const [openConfirmationModal, setOpenConfirmationModal] = useState(false);
    const [refresh, setRefresh] = useState<boolean>(false);
    const [page, setPage] = useState(1);
    const PAGE_SIZES = [10, 20, 30, 50, 100];
    const [pageSize, setPageSize] = useState(PAGE_SIZES[0]);

    const [KRData, setKRData] = useState<KeyResultType[]>([
        {
            id: 0,
            departmental_session_goal: { id: 0, name: '' },
            key_results_text: '',
            weight: 0,
            target: 0,
        },
    ]);

    const totalRecords = KRData.length;
    const [recordsData, setRecordsData] = useState(KRData.slice(0, pageSize));

    useEffect(() => {
        KeyResultServices.FetchGoals()
            .then((r) => {
                setKRData(r);
                console.log('Key results: ', r);
            })
            .catch((e) => {
                toast.error('Error Fetching Key Results', { duration: 4000 });
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
        setRecordsData(KRData.slice(from, to));
    }, [page, pageSize, KRData]);

    const columns = [
        {
            accessor: 'key_results_text',
            title: 'KR Text',
            render: (row: KeyResultType) => {
                return (
                    <div key={`prog-${row.id}`} className="flex flex-col gap-2">
                        <div>{row.key_results_text}</div>
                        <div className="flex items-center gap-1">
                            <span className="text-gray-600 text-[12px]">Target: {row.target}</span>
                            <span className="text-gray-600 ">|</span>
                            <span className="text-gray-600 text-[12px]">Weight: {row.weight}</span>
                        </div>
                    </div>
                );
            },
        },
        { accessor: 'departmental_session_goal', title: 'Sessional Goal', render: (row: KeyResultType) => row.departmental_session_goal.name },
        {
            accessor: 'progress',
            title: 'Progress',
            render: (row: KeyResultType) => {
                return (
                    <div key={`prog-${row.id}`} className="flex flex-col ">
                        <span className="text-sm">{Number(row.performance) < 100 ? row.performance : Number(row.performance).toFixed(0)} %</span>
                        {Number(row.performance) < 100 ? (
                            <Progress value={row.performance} color="teal" size="md" animate striped radius="sm" />
                        ) : (
                            <Progress value={row.performance} color="teal" size="sm" radius="sm" />
                        )}
                    </div>
                );
            },
        },
        {
            accessor: 'kpis_count',
            title: 'KPIs',
            style: { padding: '0px', width: '1%' },
            render: (row: KeyResultType) => {
                return (
                    <div key={`kpis-${row.id}`} className="flex text-[10px] bg-[#ECEEF2] rounded-xl items-center justify-center">
                        {row.kpis_count} {row?.kpis_count! <= 1 ? 'KPI' : 'KPIs'}
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
            render: (item: KeyResultType) => (
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
        if (isEditing) {
            if (!selectedId) {
                toast.error('No Id selected to update');
                return;
            }
            KeyResultServices.UpdateGoal(selectedId, data)
                .then(() => {
                    toast.success('Key Result Upated Successfully');
                    setRefresh((p) => !p);
                })
                .catch((e) => {
                    toast.error(e.message || 'Error Updating KR');
                });
        } else {
            KeyResultServices.AddGoal(data)
                .then(() => {
                    toast.success('Key Resust Added Successfully', { duration: 4000 });
                    setRefresh((p) => !p);
                })
                .catch((e) => {
                    console.log(e, 'error Adding key Result');
                    toast.error(e.message || 'Error adding KR');
                });
        }
    };

    const handleEditClick = (item: KeyResultType) => {
        setInitialData(item);
        setSelectedId(item.id);
        setIsEditing(true);
        setOpenKeyPopup(true);
    };

    const handleConfirmDelete = () => {
        if (!selectedId) {
            toast.error("No Id found, it's not your fault, It's a System errro");
            return;
        }
        KeyResultServices.DeleteGoal(selectedId)
            .then(() => {
                toast.success('Key Result Deleted Successfully', { duration: 4000 });
                setSelectedId(null);
                setRefresh((p) => !p);
            })
            .catch((e) => {
                toast.error(e.message || 'Error Deleting KR');
            });
    };
    const handleDeleteClick = (id: number) => {
        console.log('Delete clicked for ID:', id);
        setSelectedId(id);
        setOpenConfirmationModal(true);
    };

    const handleCreateNewKR = () => {
        setIsEditing(false);
        setInitialData(null);
        setSelectedId(null);
        setOpenKeyPopup(true);
    };
    return (
        <div>
            <div className="panel mt-8">
                <div className="flex justify-between items-center text-center">
                    <h5 className="font-semibold text-lg dark:text-white-light mb-4 pt-2">Key Results</h5>
                    <button type="button" className="btn btn-primary mb-4" onClick={handleCreateNewKR}>
                        Create Key Result
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
            {/* Uncomment this line and define Job_Type_Popup component when ready */}
            {openKeyPopup && <Key_Results_List_Popup isEditing={isEditing} initialData={initialData} onSubmit={handleSubmit} closeModel={() => setOpenKeyPopup(false)} />}
            <Toaster position="top-right" reverseOrder={false} />
            <ConfirmActionModal
                opened={openConfirmationModal}
                onClose={() => setOpenConfirmationModal(false)}
                onConfirm={handleConfirmDelete}
                title="Confirm Deletion"
                message="Are you sure you want to delete this Goal? <br/> This action will delete all it's childrens e.g KPI, Tasks <br/> Continue?"
                btnText="Delete"
            />
        </div>
    );
};

export default Key_Results_List;
