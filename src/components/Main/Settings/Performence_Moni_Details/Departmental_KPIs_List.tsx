import { DataTable } from 'mantine-datatable';
import { useEffect, useState } from 'react';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import Departmental_KPIs_List_Popup from './Departmental_KPIs_List_Popup';
import { KPIType } from '../../../../constantTypes/Types';
import KPIServices from '../../../../services/KPIServices';
import toast, { Toaster } from 'react-hot-toast';
import ConfirmActionModal from '../../../ConfirmActionModel';
import { ChildParent } from './Company_Goals_List';
import { Progress } from '@mantine/core';

const Departmental_KPIs_List = ({ parentState, setparentState }: ChildParent) => {
    const [openKPIPopup, setopenKPIPopup] = useState(false);
    const [page, setPage] = useState(1);
    const PAGE_SIZES = [10, 20, 30, 50, 100];
    const [pageSize, setPageSize] = useState(PAGE_SIZES[0]);
    const [KPIs, setKPIs] = useState<KPIType[] | null>(null);
    const [initialData, setInitialData] = useState<KPIType | null>(null);
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [selectedId, setSelectedId] = useState<number | null>(null);
    const [zz, setzz] = useState<boolean>(false);
    const [openConfrimActionModel, setopenConfrimActionModel] = useState<boolean>(false);

    const totalRecords = KPIs?.length;
    const [recordsData, setRecordsData] = useState(KPIs?.slice(0, pageSize));
    useEffect(() => {
        KPIServices.FetchGoals()
            .then((r) => {
                setKPIs(r);
            })
            .catch((e) => {
                console.log(e);
            });
    }, [zz, parentState]);
    useEffect(() => {
        setparentState(parentState + 1);
    }, [zz]);
    useEffect(() => {
        setPage(1);
    }, [pageSize]);

    useEffect(() => {
        const from = (page - 1) * pageSize;
        const to = from + pageSize;
        setRecordsData(KPIs?.slice(from, to));
    }, [page, pageSize, KPIs]);

    const columns = [
        {
            accessor: 'kpi_text',
            title: 'Departmental KPI',
            render: (row: KPIType) => {
                return (
                    <div key={`prog-${row.id}`} className="flex flex-col gap-2">
                        <div>{row.key_result.text}</div>
                        <div className="flex items-center gap-1">
                            <span className="text-gray-600 text-[12px]">Target: {row.target}</span>
                            <span className="text-gray-600 ">|</span>
                            <span className="text-gray-600 text-[12px]">Weight: {row.weight}</span>
                        </div>
                    </div>
                );
            },
        },
        { accessor: 'key_result', title: 'Key Results', render: (row: KPIType) => row.key_result.text },
        {
            accessor: 'progress',
            title: 'Progress',
            render: (row: KPIType) => {
                return (
                    <div key={`prog-${row.id}`} className="flex flex-col ">
                        <span className="text-sm">{row.performance_percent} %</span>
                        <Progress value={row.performance_percent} size="sm" animate striped radius="sm" />
                    </div>
                );
            },
        },
        {
            accessor: 'task_count',
            title: 'KPIs',
            style: { padding: '0px', width: '1%' },
            render: (row: KPIType) => {
                return (
                    <div key={`kpis-${row.id}`} className="flex text-[10px] bg-[#ECEEF2] rounded-xl items-center justify-center">
                        {row.task_count} {row.task_count <= 1 ? 'Task' : 'Tasks'}
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
            render: (item: KPIType) => (
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

    const handleEditClick = (item: KPIType) => {
        console.log('Edit clicked for:', item);
        setSelectedId(item.id);
        setInitialData(item);
        setIsEditing(true);
        setopenKPIPopup(true);
    };

    const handleConfirmDelete = () => {
        if (!selectedId) {
            toast.error("No Id Selected to Delete. Not your fault! It's a system error", { duration: 4000 });
            return;
        }
        KPIServices.DeleteGoal(selectedId)
            .then(() => {
                toast.success('KPI Deleted Successfully', { duration: 4000 });
                setzz((p) => !p);
            })
            .catch((e) => {
                toast.error(e.message || 'Error Deleting KPI', { duration: 5000 });
            });
    };

    const handleDeleteClick = (id: number) => {
        console.log('Delete clicked for ID:', id);
        setSelectedId(id);
        setopenConfrimActionModel(true);
    };

    const handleCreateKPI = () => {
        setIsEditing(false);
        setInitialData(null);
        setopenKPIPopup(true);
    };
    const onSubmit = (data: any) => {
        console.log('we Got data', data);
        if (isEditing) {
            if (!selectedId) {
                toast.error("No Selected ID found. Not your fault! It's System Error");
                return;
            }
            KPIServices.UpdateGoal(selectedId, data)
                .then(() => {
                    toast.success('KPI upated Successfully', { duration: 4000 });
                    setzz((p) => !p);
                })
                .catch((e) => {
                    toast.error(e.message || 'Error Updating KPI', { duration: 5000 });
                });
        } else {
            KPIServices.AddGoal(data)
                .then(() => {
                    toast.success('KPI Created Successfully', { duration: 4000 });
                    setzz((p) => !p);
                })
                .catch((e) => {
                    toast.error(e.message || 'Error Adding KPI', { duration: 5000 });
                });
        }
    };
    const handleCloseModel = () => {
        setSelectedId(null);
        setInitialData(null);
        setIsEditing(false);
        setopenKPIPopup(false);
    };
    return (
        <div>
            <div className="panel mt-8">
                <div className="flex justify-between items-center text-center">
                    <h5 className="font-semibold text-lg dark:text-white-light mb-4 pt-2">Departmental KPIs List</h5>
                    <button type="button" className="btn btn-primary mb-4" onClick={handleCreateKPI}>
                        Create New Departmental KPI
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
            {openKPIPopup && <Departmental_KPIs_List_Popup initialData={initialData} isEditing={isEditing} onSubmit={onSubmit} closeModel={handleCloseModel} />}
            <Toaster position="top-right" reverseOrder={false} />
            <ConfirmActionModal
                onConfirm={handleConfirmDelete}
                opened={openConfrimActionModel}
                onClose={() => {
                    setopenConfrimActionModel(false);
                }}
                message="Are you sure you want to delete this KPI? <br/> 
                This action will also delete all child items E.g. Tasks. <br/>
                Still Continue?
                "
            />
        </div>
    );
};

export default Departmental_KPIs_List;
