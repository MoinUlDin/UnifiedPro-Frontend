import { DataTable } from 'mantine-datatable';
import { useState,useEffect } from 'react';
import Pay_Frequencies_Popup from './Pay_Frequencies_Popup';
import axios from 'axios';

const Pay_Frequencies = () => {
    const [PayFrequencyModel, setPayFrequencyModel] = useState(false);
    const [PayFreq, setPayFreq] = useState([])
    const payFrequencyPopup = () => {
        setPayFrequencyModel(true);
    }
     const FetchSalaryComps=async()=>{
            try{
                let response=await axios.get('https://success365-backend-86f1c1-145db9-65-108-245-140.traefik.me/routine-tasks/pay-frequency/',
                {
                    headers:{
                        Authorization:`Bearer ${localStorage.getItem('token')}`
                    }
    
                }
                )
                setPayFreq(response.data)
    
            }catch{
                console.log('failed to fetch')
            }
         }
         useEffect(() => {
           FetchSalaryComps()
         }, [])
         
 

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
                        records={PayFreq}
                        columns={[
                            { accessor: 'id', title: 'ID' },
                            { accessor: 'name', title: 'Name' },
                            { accessor: 'actions',
                                title: 'Actions',
                                render: (record) => (
                                    <button className="btn btn-danger" onClick={() => console.log('Delete', record.id)}>
                                        Delete
                                    </button>
                                ), },
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
