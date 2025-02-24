import { DataTable } from 'mantine-datatable';
import { useState } from 'react';
import Salary_Component_Popup from './Salary_Component_Popup';

const Salary_Component = () => {
     const [ salaryModel, setSalaryModel] = useState(false);
     const salaryPopup = () => {
         setSalaryModel(true);
     }
  
    return (
        <div>
          
            <div className="panel mt-6">
                <div className="flex justify-between items-center text-center">
                    <h5 className="font-semibold text-lg dark:text-white-light mb-4 pt-2">Salary Components</h5>
                    <button type="button" className="btn btn-primary mb-2" onClick={salaryPopup}>
                        Create Salary Components
                    </button>
                </div>
                <div className="datatables">
                    <DataTable
                        noRecordsText="No results match your search query"
                        highlightOnHover
                        className="whitespace-nowrap table-hover"
                        // records={recordsData}
                        columns={[
                            { accessor: 'ID', title: 'ID' },
                            { accessor: 'Name', title: 'Name' },
                            { accessor: 'Actions', title: 'Actions' },
                        ]}
                  
                        minHeight={200}
                    />
                </div>
            </div>
            {salaryModel && <Salary_Component_Popup closeModal={() => setSalaryModel(false)}/>}
        </div>
    );
};

export default Salary_Component;
