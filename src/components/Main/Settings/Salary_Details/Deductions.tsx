import { DataTable } from 'mantine-datatable';
import { useState } from 'react';
import Deductions_Popup from './Deductions_Popup';


const Deductions = () => {
    const [deductionModel, setDeductionModel] = useState(false)

    const deductionPopup = () => {
        setDeductionModel(true)
    }
 
    return (
        <div>
           
            <div className="panel mt-6">
                <div className="flex justify-between items-center text-center">
                    <h5 className="font-semibold text-lg dark:text-white-light mb-4 pt-2">Deductions</h5>
                    <button type="button" className="btn btn-primary mb-2" onClick={deductionPopup}>Create Deductions</button>
                </div>
                <div className="datatables">
                    <DataTable
                        noRecordsText="No results match your search query"
                        highlightOnHover
                        className="whitespace-nowrap table-hover"
                        // records={recordsData}
                        columns={[
                            { accessor: 'Title', title: 'Title' },
                            { accessor: 'Name', title: 'Name' },
                            { accessor: 'Percentage', title: 'Percentage' },
                            { accessor: 'Actions', title: 'Actions' },
                        ]}
                    
                        minHeight={200}
                   />
                </div>
            </div>
            {deductionModel && <Deductions_Popup closeModal={() => setDeductionModel(false)}/>}
        </div>
    );
};

export default Deductions;
