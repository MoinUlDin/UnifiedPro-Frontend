import { DataTable } from 'mantine-datatable';
import { useState } from 'react';
import Salary_Structure_Popup from './Salary_Structure_Popup';


const Salary_Structure = () => {
    const [salaryStructureModel, setSalaryStructureModel] = useState(false);

    const salaryStructurePopup = () => {
        setSalaryStructureModel(true);
    }
   
    return (
        <div>
         
            <div className="panel mt-6">
                <div className="flex justify-between items-center text-center">
                    <h5 className="font-semibold text-lg dark:text-white-light mb-4 pt-2">Salary Structure</h5>
                    <button type="button" className="btn btn-primary mb-2" onClick={salaryStructurePopup}>Create Salary Structure</button>
                </div>
                <div className="datatables">
                    <DataTable
                        noRecordsText="No results match your search query"
                        highlightOnHover
                        className="whitespace-nowrap table-hover"
                        // records={recordsData}
                        columns={[
                            { accessor: 'First Name', title: 'First Name' },
                            { accessor: 'Last Name', title: 'Last Name' },
                            { accessor: 'Department', title: 'Department' },
                            { accessor: 'Job Type', title: 'Job Type' },
                            { accessor: 'Pay Start Date', title: 'Pay Start Date' },
                            { accessor: 'Action', title: 'Action' },
                        ]}
                    
                        minHeight={200}
                    />
                </div>
            </div>
            {salaryStructureModel && <Salary_Structure_Popup closeModal={() => setSalaryStructureModel(false)}/>}
        </div>
    );
};

export default Salary_Structure;
