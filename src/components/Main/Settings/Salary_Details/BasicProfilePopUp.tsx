import { useState, Fragment, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
// import { useDispatch } from 'react-redux';
// import { setPageTitle } from '../../store/themeConfigSlice';
// import IconUserPlus from '../../components/Icon/IconUserPlus';
import IconX from '../../../Icon/IconX';
import IconCaretDown from '../../../Icon/IconCaretDown';
import axios from 'axios';
import Swal from 'sweetalert2';
// import Edit from '../../../../pages/Apps/Invoice/Edit';

const Paygrade_Popup = ({ closeModal }: { closeModal: () => void }) => {
    const [params, setParams] = useState({
        employee: 0,
        department: 0,
        job_type: 0,
        pay_start_date: '',
    });
    const [JobType, setJobType] = useState([])
    const changeValue = (e: any) => {
        const { value, id } = e.target;
        setParams({ ...params, [id]: value });
    };
    const Submit=async(e:any)=>{
        e.preventDefault();
        try{
            const response=await axios.post('https://success365-backend-86f1c1-145db9-65-108-245-140.traefik.me/routine-tasks/basic-profile/',params,
                {headers: {
                    'Content-Type': 'application/json',
                Authorization:`Bearer ${localStorage.getItem('token')}`}
            })
            console.log(response.data);
            closeModal();
            
        }catch{
             Swal.fire({
                            title:'Error',
                            text:'Failed to create Salary Compoonent',
                            timer:10000
                        })
                        closeModal()
            console.log('error');
            
        }
    
    }
    const FetchJobType=async()=>{
        try{
            let res=await axios.get(`https://success365-backend-86f1c1-145db9-65-108-245-140.traefik.me/routine-tasks/Job-type/`,
                {
                    headers:{Authorization:`Bearer ${localStorage.getItem('token')}`}
                }
            )
            setJobType(res.data)
        }catch{
          console.log("failed to fetch job types" )
        }
       
    }
    useEffect(() => {
    FetchJobType()

    }, [])
    const FetchDepartements=async()=>{
        
    }
    return (
        <Transition appear show={true} as={Fragment}>
            <Dialog as="div" open={true} onClose={closeModal} className="   relative z-[51]">
                <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
                    <div className="fixed inset-0 bg-[black]/60" />
                </Transition.Child>
                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center px-4 py-8">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <Dialog.Panel className="panel border-0 p-0 rounded-lg overflow-hidden w-full max-w-xl text-black dark:text-white-dark">
                                <button type="button" onClick={closeModal} className="absolute top-4 ltr:right-4 rtl:left-4 text-gray-400 hover:text-gray-800 dark:hover:text-gray-600 outline-none">
                                    <IconX />
                                </button>
                                <div className="text-lg font-medium bg-[#fbfbfb] dark:bg-[#121c2c] ltr:pl-5 rtl:pr-5 py-3 ltr:pr-[50px] rtl:pl-[50px]">Add Employee</div>
                                <div className="p-5">
                                    <form>
                                        <div className="mb-5">
                                            <label htmlFor="name">Employee</label>
                                            <input id="name" type="text" placeholder="" className="form-input" value={params.employee} onChange={(e) => changeValue(e)} />
                                        </div>
                                        <div className="mb-5">
                                            <label htmlFor="minimum_salary">Department:</label>
                                            <input id="minimum_salary" type="text" placeholder="" className="form-input" value={params.department} onChange={(e) => changeValue(e)} />
                                        </div>
                                            <div className="mb-5">
                                                <label htmlFor="maximum_salary">Job Type:</label>
                                                <select id="job_type" className="form-input" value={params.job_type} onChange={changeValue}>
                                                <option value="">Select Job Type</option>
                                                {JobType.map((job: any) => (
                                                    <option key={job.id} value={job.id}>
                                                        {job.name}
                                                    </option>
                                                ))}
                                            </select>
                                            </div>
                                            <div className="mb-5">
                                                <label htmlFor="maximum_salary">Pay start date:</label>
                                                <input id="maximum_salary" type="text" placeholder="" className="form-input" value={params.pay_start_date} onChange={(e) => changeValue(e)} />
                                            </div>
                                        <div className="flex justify-end items-center mt-8">
                                            <button type="button" className="btn btn-outline-danger" onClick={closeModal}>
                                                Cancel
                                            </button>
                                            <button type="submit" onClick={Submit} className="btn btn-primary ltr:ml-4 rtl:mr-4">
                                                Create
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
};

export default Paygrade_Popup;