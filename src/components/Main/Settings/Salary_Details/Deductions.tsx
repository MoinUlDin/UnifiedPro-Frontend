import { DataTable } from 'mantine-datatable';
import { useState,useEffect } from 'react';
import axios from 'axios';
import Deductions_Popup from './Deductions_Popup';
import Swal from 'sweetalert2';


const Deductions = () => {
    const [deductionModel, setDeductionModel] = useState(false)
    interface Deduction {
        id: number;
        Title: string;
        name: string;
        percentage: number;
    }

    const [Deductions, setDeductions] = useState<Deduction[]>([])
    const deductionPopup = () => {
        setDeductionModel(true)
    }
     const FetchDeuctions=async()=>{
                try{
                    let response=await axios.get('https://success365-backend-86f1c1-145db9-65-108-245-140.traefik.me/routine-tasks/deduction/',
                    {
                        headers:{
                            Authorization:`Bearer ${localStorage.getItem('token')}`
                        }
        
                    }
                    )
                    setDeductions(response.data)
        
                }catch{
                    console.log('failed to fetch')
                }
             }
             useEffect(() => {
               FetchDeuctions()
             }, [])

        const DeleteDeductions=async(id:number)=>{
            try{
                const res=await axios.delete(`https://success365-backend-86f1c1-145db9-65-108-245-140.traefik.me/routine-tasks/deduction/${id}/`,
                    {
                        headers:{
                            Authorization:`Bearer ${localStorage.getItem('token')}`
                        }
                      
                    })
                    setDeductions((prev) => prev.filter((deduction) => deduction.id !== id));
                    Swal.fire('Deleted Successfully')  
            }catch{
                Swal.fire("failed to delete")
            }
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
                        records={Deductions}
                        columns={[
                            { accessor: 'Title', title: 'Title' },
                            { accessor: 'name', title: 'Name' },
                            { accessor: 'percentage', title: 'Percentage' },
                            {  accessor: 'actions',
                                title: 'Actions',
                                render: (record) => (
                                    <button className="btn btn-danger" onClick={() => DeleteDeductions(record.id)}>
                                        Delete
                                    </button>
                                ), },
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
