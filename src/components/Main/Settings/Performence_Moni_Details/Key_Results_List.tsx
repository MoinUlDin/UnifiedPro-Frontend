import { DataTable } from 'mantine-datatable';
import { useEffect, useState } from 'react';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import Key_Results_List_Popup from './Key_Results_List_Popup';

interface RowData {
    Department: string;
    Department_Goals: string;
    Session: string;
    Actions: string;
    id: number;
}

const Key_Results_List = () => {
    const [jobTypeModal, setJobTypeModal] = useState(false);
    const [page, setPage] = useState(1);
    const PAGE_SIZES = [10, 20, 30, 50, 100];
    const [pageSize, setPageSize] = useState(PAGE_SIZES[0]);

    const rowData: RowData[] = [
        { id: 1, Department: 'Sales', Department_Goals: 'Pending', Session: 'Branch A', Actions: '' },
        // { id: 2, Goal_Text: 'Success', Target: 'Branch B', Achieved: 'Yes', Weight: '55', Actions: '' },
        // Add more rows as needed
    ];

    const totalRecords = rowData.length;
    const [recordsData, setRecordsData] = useState(rowData.slice(0, pageSize));

    useEffect(() => {
        setPage(1);
    }, [pageSize]);

    useEffect(() => {
        const from = (page - 1) * pageSize;
        const to = from + pageSize;
        setRecordsData(rowData.slice(from, to));
    }, [page, pageSize, rowData]);

    const handleEditClick = (item: RowData) => {
        console.log('Edit clicked for:', item);
    };

    const handleDeleteClick = (id: number) => {
        console.log('Delete clicked for ID:', id);
    };

    const JobTypePopup = () => setJobTypeModal(true);

    const columns = [
        { accessor: 'Department', title: 'Department' },
        { accessor: 'Department Goals', title: 'Department Goals' },
        { accessor: 'Session', title: 'Session' },
    ];

    const adjustedColumns = [
        ...columns,
        {
            accessor: 'action',
            title: 'Action',
            render: (item: RowData) => (
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

    return (
        <div>
            <div className="panel mt-8">
                <div className="flex justify-between items-center text-center">
                    <h5 className="font-semibold text-lg dark:text-white-light mb-4 pt-2">Key Results</h5>
                    <button type="button" className="btn btn-primary mb-4" onClick={JobTypePopup}>
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
            {jobTypeModal && <Key_Results_List_Popup closeModal={() => setJobTypeModal(false)} />}
        </div>
    );
};

export default Key_Results_List;