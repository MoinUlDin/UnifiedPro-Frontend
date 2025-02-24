import { DataTable } from 'mantine-datatable';
import { useState } from 'react';
import Job_Type_Popup from './Job_Type_Popup';


const Job_Type = () => {
    const [jobTypeModal, setJobTypeModal] = useState(false);

    const JobTypePopup = () => {
        setJobTypeModal(true);
    }
 
    return (
        <div>
          
            <div className="panel mt-6">
                <div className="flex justify-between items-center text-center">
                    <h5 className="font-semibold text-lg dark:text-white-light mb-4 pt-2">Job Type</h5>
                    <button type="button" className="btn btn-primary mb-2" onClick={JobTypePopup}>Create Job Type</button>
                </div>
                <div className="datatables">
                    <DataTable
                        noRecordsText="No results match your search query"
                        highlightOnHover
                        className="whitespace-nowrap table-hover"
                        columns={[
                            { accessor: 'Job Type', title: 'Job Type' },
                            { accessor: 'Actions', title: 'Actions' },
                        ]}
                       
                        minHeight={200}
                    />
                </div>
            </div>
            {jobTypeModal && <Job_Type_Popup closeModal={() => setJobTypeModal(false)} />}
        </div>
    );
};

export default Job_Type;
