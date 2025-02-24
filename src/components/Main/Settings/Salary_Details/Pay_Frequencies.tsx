import { DataTable } from 'mantine-datatable';
import { useState } from 'react';
import Pay_Frequencies_Popup from './Pay_Frequencies_Popup';


const Pay_Frequencies = () => {
    const [PayFrequencyModel, setPayFrequencyModel] = useState(false);

    const payFrequencyPopup = () => {
        setPayFrequencyModel(true);
    }

 

    return (
        <div>
          
            <div className="panel mt-6">
                <div className="flex justify-between items-center text-center">
                    <h5 className="font-semibold text-lg dark:text-white-light mb-4 pt-2">Pay Frequencies</h5>
                    <button type="button" className="btn btn-primary mb-2" onClick={payFrequencyPopup}>
                        Create Pay Frequencies
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
            {PayFrequencyModel && <Pay_Frequencies_Popup closeModal={() => setPayFrequencyModel(false)}/> }
        </div>
    );
};

export default Pay_Frequencies;
