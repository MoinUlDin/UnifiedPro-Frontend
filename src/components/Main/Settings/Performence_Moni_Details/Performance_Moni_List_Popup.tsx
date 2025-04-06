import { useState, Fragment, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
// import { useDispatch } from 'react-redux';
// import { setPageTitle } from '../../store/themeConfigSlice';
// import IconUserPlus from '../../components/Icon/IconUserPlus';
import IconX from '../../../Icon/IconX';
import IconCaretDown from '../../../Icon/IconCaretDown';
import axios from 'axios';
import Swal from 'sweetalert2';
// import Edit from '../../../pages/Apps/Invoice/Edit';
// import Job_Type from './Job_Type';

const Performance_Moni_List_Popup = ({ closeModal }: { closeModal: () => void }) => {
    const [params, setParams] = useState({
        branch: '',  // lowercase key
        start_date: '',  // lowercase key
        end_date: '',  // lowercase key
        PerformanceMonitoring_session: '',

        // email: '',
        // password: '',
        // confirm_password: '',
        // department: '',
        // assign_designation: '',
        // report_to: '',
        // hire_date: '',
        // employee_id: '',
    });
    const [Branches, setBranches] = useState([])
    const changeValue = (e: any) => {
        const { value, id } = e.target;
        setParams({ ...params, [id]: value });
    };
    const Submit=async(e: any)=>{
            e.preventDefault();
            try{
                let response=await axios.post("https://success365-backend-86f1c1-145db9-65-108-245-140.traefik.me/company-performace/performance-monitoring/",params,
                    {
                        headers:{
                            Authorization:`Bearer ${localStorage.getItem('token')}`
                        }
                    }
                )
                console.log(response.data)
                closeModal()
            }catch{
                Swal.fire({
                    title:'Error',
                    text:'Failed to create Performance Monitoring Year',
                    timer:10000
                })
                closeModal()
            }
        }
          const FetchBranches=async()=>{
                try{
                    let res=await axios.get(`https://success365-backend-86f1c1-145db9-65-108-245-140.traefik.me/company-Setup/branch/`,
                        {
                            headers:{Authorization:`Bearer ${localStorage.getItem('token')}`}
                        }
                    )
                    console.log(res.data)
                    setBranches(res.data)
                }catch{};
            }
            useEffect(() => {
              FetchBranches()
            }, [])
            
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
                                <div className="text-lg font-medium bg-[#fbfbfb] dark:bg-[#121c2c] ltr:pl-5 rtl:pr-5 py-3 ltr:pr-[50px] rtl:pl-[50px]">Create Performance Monitoring Year</div>
                                <div className="p-5">
                                    <form>
                                        <div className="mb-5 relative">
                                            <label htmlFor="Branch">Branch</label>
                                            <div className="relative">
                                            <select id="branch" className="form-input appearance-none pr-10" value={params.branch} onChange={(e) => changeValue(e)}>
                                            <option value="" disabled>
                                                        --------
                                                    </option>
                                                    {Branches.map((branch: any) => (
                                                        <option value={branch.id}>{branch.name}</option>
                                                    ))}
                                                    {/* <option value="Branch A">Branch A</option>
                                                    <option value="Branch B">Branch B</option>
                                                    <option value="Branch C">Branch C</option> */}
                                                </select>
                                                <i className="bi bi-chevron-down absolute top-1/2 right-2 transform -translate-y-1/2 pointer-events-none"></i>
                                            </div>
                                        </div>
                                        <div className="mb-5">
                                            <label htmlFor="start_date">Start Date</label>
                                            <input id="start_date" type="date" className="form-input" value={params.start_date} onChange={(e) => changeValue(e)} />
                                        </div>
                                        <div className="mb-5">
                                            <label htmlFor="end_date">End Date</label>
                                            <input id="end_date" type="date" className="form-input" value={params.end_date} onChange={(e) => changeValue(e)} />
                                        </div>

                                        <div className="mb-5 relative">
                                            <label htmlFor="Performance_Monitoring_Session">Performance Monitoring Session</label>
                                            <div className="relative">
                                                <select
                                                    id="Performance_Monitoring_Session"
                                                    className="form-input appearance-none pr-10"
                                                    value={params.PerformanceMonitoring_session}
                                                    onChange={(e) => changeValue(e)}
                                                >
                                                    <option value="" disabled>
                                                        --------
                                                    </option>
                                                    <option value="Session 1">Session 1</option>
                                                    <option value="Session 2">Session 2</option>
                                                    <option value="Session 3">Session 3</option>
                                                </select>
                                                <i className="bi bi-chevron-down absolute top-1/2 right-2 transform -translate-y-1/2 pointer-events-none"></i>
                                            </div>
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

export default Performance_Moni_List_Popup;