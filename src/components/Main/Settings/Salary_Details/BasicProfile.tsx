import { DataTable } from 'mantine-datatable';
import { useState,useEffect } from 'react';
import Paygrade_Popup from './BasicProfilePopUp';
import axios from 'axios';
import Swal from 'sweetalert2';


const Paygrade = () => {
    const [paygradeModel, setPaygradeModel] = useState(false);
    const [PayGrade, setPayGrade] = useState([])
    const PaygradePopup = () => {
        setPaygradeModel(true);
    }
 const FetchBasice=async()=>{
        try{
            let reposnse=await axios.get("https://success365-backend-86f1c1-145db9-65-108-245-140.traefik.me/routine-tasks/basic-profile/",
                { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } })
            console.log(reposnse.data);
            setPayGrade(reposnse.data);
        }catch{
            console.log('error');
        }

        }
        useEffect(() => {
          
        FetchBasice();
          
           
        }, [])
        const DeletePayGrade=async(id:number)=>{
            try{
                const res=await axios.delete(`https://success365-backend-86f1c1-145db9-65-108-245-140.traefik.me/routine-tasks/pay-grade/${id}/`,
                    {
                        headers:{
                            Authorization:`Bearer ${localStorage.getItem('token')}`
                        }
                      
                    })
                    setPayGrade((prev) => prev.filter((deduction) => deduction.id !== id));
                    Swal.fire('Deleted Successfully')  
            }catch{
                Swal.fire("failed to delete")
            }
        }
    return (
        <div>
         
            <div className="panel mt-6">
                <div className="flex justify-between items-center text-center">
                    <h5 className="font-semibold text-lg dark:text-white-light mb-4 pt-2">Basic Profile</h5>
                    <button type="button" className="btn btn-primary mb-2" onClick={PaygradePopup}>
                        Create Basic Profile
                    </button>
                </div>
                <div className="datatables">
                    <DataTable
                        noRecordsText="No results match your search query"
                        highlightOnHover
                        className="whitespace-nowrap table-hover"
                         records={PayGrade} // ✅ Pass fetched data here
                        columns={[
                            { accessor: 'id', title: 'ID' }, // ✅ Match API field names
                            { accessor: 'name', title: 'Name' },
                            { accessor: 'minimum_salary', title: 'Minimum Salary' },
                            { accessor: 'maximum_salary', title: 'Maximum Salary' },
                            {
                                accessor: 'actions',
                                title: 'Actions',
                                render: (record) => (
                                    <button className="btn btn-sm btn-danger" onClick={() => DeletePayGrade(record.id)}>
                                        Delete
                                    </button>
                                ),
                            },
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
