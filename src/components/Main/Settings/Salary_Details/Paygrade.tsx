import { DataTable } from 'mantine-datatable';
import { useState } from 'react';
import Paygrade_Popup from './Paygrade_Popup';


const Paygrade = () => {
    const [paygradeModel, setPaygradeModel] = useState(false);
    const PaygradePopup = () => {
        setPaygradeModel(true);
    }
 
    return (
        <div>
         
            <div className="panel mt-6">
                <div className="flex justify-between items-center text-center">
                    <h5 className="font-semibold text-lg dark:text-white-light mb-4 pt-2">Pay Grades</h5>
                    <button type="button" className="btn btn-primary mb-2" onClick={PaygradePopup}>
                        Create Pay Grade
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
                            { accessor: 'Minimum Salary', title: 'Minimum Salary' },
                            { accessor: 'Maximum Salary', title: 'Maximum Salary' },
                            { accessor: 'Actions', title: 'Actions' },
                        ]}
                       
                        minHeight={200}
                    />
                </div>
            </div>
            {paygradeModel && <Paygrade_Popup closeModal={() => setPaygradeModel(false)} />}
        </div>
    );
};

export default Paygrade;
