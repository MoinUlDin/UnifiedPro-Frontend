import { DataTable } from 'mantine-datatable';
import { useState,useEffect } from 'react';
import Job_Type_Popup from './Job_Type_Popup';
import axios from 'axios';
import Swal from 'sweetalert2';


const Job_Type = () => {
    const [jobTypeModal, setJobTypeModal] = useState(false);
    const [jobTypes, setjobTypes] = useState([])
    const JobTypePopup = () => {
        setJobTypeModal(true);
    }
    useEffect(() => {
      const fetchJobTypes = async () => {
        try{
            const response=await axios.get("https://success365-backend-86f1c1-145db9-65-108-245-140.traefik.me/routine-tasks/Job-type/",
            { headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` } })
            console.log(response.data)
            setjobTypes(response.data)
        }
        
    catch (error) {
        console.error('Error fetching job types:', error);
    }
      }
      fetchJobTypes();
      
    }, [])
     const DeleteJobType=async(id:number)=>{
                try{
                    const res=await axios.delete(`https://success365-backend-86f1c1-145db9-65-108-245-140.traefik.me/routine-tasks/Job-type/${id}/`,
                        {
                            headers:{
                                Authorization:`Bearer ${localStorage.getItem('token')}`
                            }
                          
                        })
                        setjobTypes((prev) => prev.filter((deduction) => deduction.id !== id));
                        Swal.fire('Deleted Successfully')  
                }catch{
                    Swal.fire("failed to delete")
                }
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
                        records={jobTypes}
                        noRecordsText="No results match your search query"
                        highlightOnHover
                        className="whitespace-nowrap table-hover"
                        columns={[
                            { accessor: 'id', title: 'ID' }, // Display ID column
                            { accessor: 'name', title: 'Job Type' }, // Display Name column
                            {
                                accessor: 'actions',
                                title: 'Actions',
                                render: (record) => (
                                    <button className="btn btn-danger" onClick={() => DeleteJobType(record.id)}>
                                        Delete
                                    </button>
                                ),
                            },
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
