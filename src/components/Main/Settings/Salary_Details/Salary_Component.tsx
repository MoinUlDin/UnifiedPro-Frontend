import { DataTable } from 'mantine-datatable';
import { useState,useEffect } from 'react';
import Salary_Component_Popup from './Salary_Component_Popup';
import axios from 'axios';
import Swal from 'sweetalert2';

const Salary_Component = () => {
     const [ salaryModel, setSalaryModel] = useState(false);
     const [SalaryComp, setSalaryComp] = useState([])
     const salaryPopup = () => {
         setSalaryModel(true);
     }
     const FetchSalaryComps=async()=>{
        try{
            let response=await axios.get('https://success365-backend-86f1c1-145db9-65-108-245-140.traefik.me/routine-tasks/salary-component/',
            {
                headers:{
                    Authorization:`Bearer ${localStorage.getItem('token')}`
                }

            }
            )
            setSalaryComp(response.data)

        }catch{
            console.log('failed to fetch')
        }
     }
     useEffect(() => {
       FetchSalaryComps()
     }, [])
     const DeleteComponent=async(id:number)=>{
        try{
            const res=await axios.delete(`https://success365-backend-86f1c1-145db9-65-108-245-140.traefik.me/routine-tasks/deduction/${id}/`,
                {
                    headers:{
                        Authorization:`Bearer ${localStorage.getItem('token')}`
                    }
                  
                })
                setSalaryComp((prev) => prev.filter((deduction) => deduction.id !== id));
                Swal.fire('Deleted Successfully')  
        }catch{
            Swal.fire("failed to delete")
        }
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
                        records={SalaryComp}
                        columns={[
                            { accessor: 'id', title: 'ID' },
                            { accessor: 'name', title: 'Name' },
                            {  accessor: 'actions',
                                title: 'Actions',
                                render: (record) => (
                                    <button className="btn btn-danger" onClick={() => DeleteComponent(record.id)}>
                                        Delete
                                    </button>
                                ), },
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
