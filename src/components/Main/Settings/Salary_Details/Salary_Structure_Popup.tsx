import { useState, Fragment, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
// import { useDispatch } from 'react-redux';
// import { setPageTitle } from '../../store/themeConfigSlice';
// import IconUserPlus from '../../components/Icon/IconUserPlus';
import IconX from '../../../Icon/IconX';
import IconCaretDown from '../../../Icon/IconCaretDown';
// import Edit from '../../../../pages/Apps/Invoice/Edit';
import Salary_Structure from './Salary_Structure';
import axios from 'axios';

const Salary_Structure_Popup = ({ closeModal }: { closeModal: () => void }) => {
    const [params, setParams] = useState({
        first_name: '',
        last_name: '',
        department: '',
        job_type: '',
        paygrade: '',
    });

    const changeValue = (e: any) => {
        const { value, id } = e.target;
        setParams({ ...params, [id]: value });
    };
    const [PayGrade, setPayGrade] = useState([])
    const FetchPayGrade=async()=>{
        try{
            const res=await axios.get(`https://success365-backend-86f1c1-145db9-65-108-245-140.traefik.me/routine-tasks/pay-grade/`,
                {
                    headers:{
                        Authorization:`Bearer ${localStorage.getItem('token')}`
                    }
                }
            )
            setPayGrade(res.data)
    
        }catch{
            console.log('Failed to Fetch Pay Grades')
        }
       }
       useEffect(() => {
        FetchPayGrade()
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
                                <div className="text-lg font-medium bg-[#fbfbfb] dark:bg-[#121c2c] ltr:pl-5 rtl:pr-5 py-3 ltr:pr-[50px] rtl:pl-[50px]">Add Employee</div>
                                <div className="p-5">
                                    <form>
                                        <div className="mb-5">
                                            <label htmlFor="first_name">First Name:</label>
                                            <input id="first_name" type="text" placeholder="" className="form-input" value={params.first_name} onChange={(e) => changeValue(e)} />
                                        </div>
                                        <div className="mb-5">
                                            <label htmlFor="last_name">Last Name:</label>
                                            <input id="last_name" type="text" placeholder="" className="form-input" value={params.last_name} onChange={(e) => changeValue(e)} />
                                        </div>
                                        <div className="mb-5">
                                            <label htmlFor="department">Department</label>
                                            <input id="department" type="text" placeholder="" className="form-input" value={params.department} onChange={(e) => changeValue(e)} />
                                        </div>
                                        <div className="mb-5">
                                            <label htmlFor="job_type">Job Type</label>
                                            <input id="job_type" type="text" placeholder="" className="form-input" value={params.job_type} onChange={(e) => changeValue(e)} />
                                        </div>
                                        <div className="mb-5">
                                            <label htmlFor="pay_grade">Pay Grade</label>
                                            {/* <input id="pay_start_date" type="text" placeholder=""  onChange={(e) => changeValue(e)} /> */}
                                            <select value={params.paygrade} className="form-input">
                                                {/* Mapping through the array and creating <option> elements */}
                                                {PayGrade.map((option, index) => (
                                                    <option key={index} value={option}>
                                                        {option.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        <div className="flex justify-end items-center mt-8">
                                            <button type="button" className="btn btn-outline-danger" onClick={closeModal}>
                                                Cancel
                                            </button>
                                            <button type="submit" className="btn btn-primary ltr:ml-4 rtl:mr-4">
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

export default Salary_Structure_Popup;