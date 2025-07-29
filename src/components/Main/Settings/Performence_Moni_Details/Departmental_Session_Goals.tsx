import { DataTable } from 'mantine-datatable';
import { useEffect, useState, useMemo } from 'react';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import Departmental_Session_Goals_Popup from './Departmental_Session_Goals_Popup';
import SessionalGoalServices from '../../../../services/SessionalGoalServices';
import toast, { Toaster } from 'react-hot-toast';
import ConfirmActionModal from '../../../ConfirmActionModel';
import { useFilterRows, FilterControls, FilterConfig } from '../../../FilterControls';
import { ChildParent } from './Company_Goals_List';
import { Progress } from '@mantine/core';
import { SessionalGoalType } from '../../../../constantTypes/Types';

const Departmental_Session_Goals = ({ parentState, setparentState }: ChildParent) => {
    const [sessionalGaolsPopup, setSessionalGaolsPopup] = useState<boolean>(false);
    const [page, setPage] = useState(1);
    const PAGE_SIZES = [10, 20, 30, 50, 100];
    const [pageSize, setPageSize] = useState(PAGE_SIZES[0]);
    const [initialData, setInitailData] = useState<SessionalGoalType | null>(null);
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [selectedId, setSelectedId] = useState<number | null>(null);
    const [refresh, setRefresh] = useState<boolean>(false);
    const [openConfirmActionModel, setOpenConfirmActionModel] = useState<boolean>(false);
    const [goalsData, setGoalsData] = useState<SessionalGoalType[]>([
        {
            id: 0,
            department_goals: { id: 0, name: '' },
            department: { id: 0, name: '' },
            goal_text: '',
            target: 0,
            weight: 0,
            session: 'string',
        },
    ]);

    // fetching Goals
    useEffect(() => {
        SessionalGoalServices.FetchGoals()
            .then((r) => {
                console.log('Sessional Goals', r);
                setGoalsData(r);
            })
            .catch((e) => {
                console.log(e);
            });
    }, [refresh, parentState]);

    // 1) Define your filters once
    const filters: FilterConfig[] = [
        { type: 'text', key: 'department.name', placeholder: 'Search Department' },
        { type: 'text', key: 'goal_text', placeholder: 'Search Goal Text' },
        {
            type: 'select',
            key: 'session',
            options: [
                { value: 'Q1', label: 'Q1' },
                { value: 'Q2', label: 'Q2' },
                { value: 'Q3', label: 'Q3' },
                { value: 'Q4', label: 'Q4' },
            ],
        },
    ];

    useEffect(() => {
        setparentState(parentState + 1);
    }, [refresh]);
    // 3) Plug in filtering
    const { filtered: filteredGoals, filterValues, setFilter } = useFilterRows(goalsData, filters);

    const totalRecords = filteredGoals.length;
    const recordsData = useMemo(() => {
        const from = (page - 1) * pageSize;
        return filteredGoals.slice(from, from + pageSize);
    }, [filteredGoals, page, pageSize]);

    useEffect(() => {
        setPage(1);
    }, [pageSize]);

    // useEffect(() => {
    //     const from = (page - 1) * pageSize;
    //     const to = from + pageSize;
    //     setRecordsData(goalsData.slice(from, to));
    // }, [page, pageSize, goalsData]);

    const columns = [
        {
            accessor: 'goal_text',
            title: 'Goal Text',
            render: (row: SessionalGoalType) => {
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
        { accessor: 'department', title: 'Department', render: (row: SessionalGoalType) => row.department.name },
        // { accessor: 'department_goals', title: 'Department Goal', render: (row: SessionalGoalType) => row.department_goals.name },
        { accessor: 'session_display', title: 'Goal Session', render: (row: SessionalGoalType) => row.session_display },
        {
            accessor: 'progress',
            title: 'Performance',
            render: (row: SessionalGoalType) => {
                return (
                    <div key={`prog-${row.id}`} className="flex flex-col ">
                        <span className="text-sm">{row.performance} %</span>
                        <Progress value={row.performance} size="sm" animate striped radius="sm" />
                    </div>
                );
            },
        },
        {
            accessor: 'kr_counts',
            title: 'Key Results',
            style: { padding: '0px', width: '1%' },
            render: (row: SessionalGoalType) => {
                return (
                    <div key={`kpis-${row.id}`} className="flex items-center justify-center">
                        <div className="text-[10px] bg-[#ECEEF2] px-4  rounded-xl">
                            {row.kr_counts} {row?.kr_counts! <= 1 ? 'KR' : 'KRs'}
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
            render: (item: SessionalGoalType) => (
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

    const handleEditClick = (item: SessionalGoalType) => {
        console.log('Edit clicked for:', item);
        setSelectedId(item.id);
        setInitailData(item);
        setIsEditing(true);
        setSessionalGaolsPopup(true);
    };

    const handleConfirmDelete = () => {
        if (!selectedId) {
            toast.error('No Id found');
            return;
        }

        SessionalGoalServices.DeleteGoal(selectedId)
            .then(() => {
                toast.success('Goal Deletd Successfully');
                setRefresh((p) => !p);
            })
            .catch((e) => {
                toast.error(e.message || 'Error Deleting Goal');
            });
    };
    const handleDeleteClick = (id: number) => {
        console.log('Delete clicked for ID:', id);
        setSelectedId(id);
        setOpenConfirmActionModel(true);
    };

    const handleNewGoalsClick = () => {
        setIsEditing(false);
        setInitailData(null);
        setSelectedId(null);
        setSessionalGaolsPopup(true);
    };
    const onSubmit = (data: any) => {
        console.log('we got Data: ', data);
        if (isEditing) {
            if (!selectedId) return;
            SessionalGoalServices.UpdateGoal(selectedId, data)
                .then(() => {
                    setRefresh((p) => !p);
                    toast.success('Goal Updated Successfully', { duration: 4000 });
                })
                .catch((e) => {
                    console.log('error', e);
                    toast.error(e.message || 'Error updating Goal', { duration: 4000 });
                });
        } else {
            SessionalGoalServices.AddGoal(data)
                .then(() => {
                    console.log('done');
                    setRefresh((p) => !p);
                    toast.success('Goal added Successfully', { duration: 4000 });
                })
                .catch((e) => {
                    console.log('e', e);
                    toast.error(e.message || 'Error Adding Goal', { duration: 4000 });
                });
        }
    };

    return (
        <div>
            <div className="panel mt-8">
                <div className="flex justify-between items-center text-center">
                    <h5 className="font-semibold text-lg dark:text-white-light mb-4 pt-2">Departmental Session Goals</h5>
                    <button type="button" className="btn btn-primary mb-4" onClick={handleNewGoalsClick}>
                        Create Departmental Session Goals
                    </button>
                </div>
                <div className="flex items-center mb-4">
                    <FilterControls filters={filters} values={filterValues} onChange={setFilter} />
                    <button
                        onClick={() => {
                            // clear every filter in one go:
                            filters.forEach((f) => setFilter(f.key, '' as any));
                        }}
                        title="Clear all filters"
                        className="ml-2 p-1 hover:bg-gray-200 rounded"
                    >
                        Clear Filters
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
            {sessionalGaolsPopup && <Departmental_Session_Goals_Popup onSubmit={onSubmit} isEditing={isEditing} initialData={initialData} closeModel={() => setSessionalGaolsPopup(false)} />}
            <Toaster position="top-right" reverseOrder={false} />
            <ConfirmActionModal
                opened={openConfirmActionModel}
                onClose={() => setOpenConfirmActionModel(false)}
                onConfirm={handleConfirmDelete}
                title="Confirm Deletion"
                message="Are you sure you want to delete this goal? <br/> This Action will delete all child Goals. <br/>Continue?"
                btnText="Delete"
            />
        </div>
    );
};

export default Departmental_Session_Goals;
