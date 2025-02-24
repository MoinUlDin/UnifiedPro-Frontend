import { DataTable } from 'mantine-datatable';
import { useState } from 'react';
import Leave_Quota_Popup from './Leave_Quota_Popup';

const Leave_Quota = () => {
    const [leaveModel, setLeaveModel] = useState(false);

    const leaveModelPopup = () => {
        setLeaveModel(true);
    }
  

    return (
        <div>
           
            <div className="panel mt-6">
                <div className="flex justify-between items-center text-center">
                    <h5 className="font-semibold text-lg dark:text-white-light mb-4 pt-2">Leave Info by Department</h5>
                    <button type="button" className="btn btn-primary mb-2" onClick={leaveModelPopup}>
                        Create Leave Types
                    </button>
                </div>
                <div className="datatables">
                    <DataTable
                        noRecordsText="No results match your search query"
                        highlightOnHover
                        className="whitespace-nowrap table-hover"
                        // records={recordsData}
                        columns={[
                            { accessor: 'Department', title: 'Department' },
                            { accessor: 'Leave Type', title: 'Leave Type' },
                            { accessor: 'Allowed', title: 'Allowed' },
                            { accessor: 'Actions', title: 'Actions' },
                        ]}
                       
                        minHeight={200}
                        // paginationText={({ from, to, totalRecords }) => `Showing  ${from} to ${to} of ${totalRecords} entries`}
                    />
                </div>
            </div>
            {leaveModel && <Leave_Quota_Popup closeModal={() => setLeaveModel(false)}/>}
        </div>
    );
};

export default Leave_Quota;
