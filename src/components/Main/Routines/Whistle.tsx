import { useState, Fragment, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '../../../store/themeConfigSlice';
import CommonTable from '../Common_Table';
import FormComponent from '../Common_Popup';
import axios from 'axios'
const Whistle = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(setPageTitle('Whistleblower Reports'));
    }, [dispatch]);

    const [reports, setReports] = useState([
        {
            id: 0,
            subject: '',
            message: '',
        },
        
    ]);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [currentEditId, setCurrentEditId] = useState<number | null>(null);

    const initialFormFields = {
        id: 0,
        subject: '',
        message: '',
    };
    const [formData, setFormData] = useState(initialFormFields);

    const columns = [
        { accessor: 'id', title: 'ID' },
        { accessor: 'subject', title: 'subject' },
        { accessor: 'message', title: 'message' },
    ];

    
        const formFields = [
            { 
                id: 'subject', 
                label: 'Subject', 
                type: 'text', 
                value: formData.subject, 
                onChange: (e: any) => setFormData({ ...formData, subject: e.target.value }) 
            },
            { 
                id: 'message', 
                label: 'Message', // Label changed for clarity
                type: 'text', 
                value: formData.message, 
                onChange: (e: any) => setFormData({ ...formData, message: e.target.value }) 
            },
        ];
        
    

        const handleAddOrEditReport = async (submittedData: any) => {
            const config = {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json',
                },
            };
        
            try {
                const payload = {
                    subject: submittedData.subject,  
                    message: submittedData.message,  
                    uploaded_files: [], 
                };
        
                if (isEditMode && currentEditId !== null) {
                    await axios.put(
                        `https://success365-backend-86f1c1-145db9-65-108-245-140.traefik.me/company-Setup/whistle-blower/${currentEditId}`,
                        payload,
                        config
                    );
        
                    setReports((prev) =>
                        prev.map((report) =>
                            report.id === currentEditId ? { ...report, ...submittedData } : report
                        )
                    );
                } else {
                    const response = await axios.post(
                        'https://success365-backend-86f1c1-145db9-65-108-245-140.traefik.me/company-Setup/whistle-blower/',
                        payload,
                        config
                    );
        
                    const newReport = { ...response.data, id: reports.length + 1 };
                    setReports((prev) => [...prev, newReport]);
                }
        
                closeModal();
            } catch (error) {
                if (axios.isAxiosError(error)) {
                    console.error('Error while adding or editing report:', error.response?.data || error.message);
                } else {
                    console.error('Unexpected error:', error);
                }
            }
        };
        
        const handleDeleteReport = async (reportId: number) => {
            const config = {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            };
        
            try {
                await axios.delete(
                    `https://success365-backend-86f1c1-145db9-65-108-245-140.traefik.me/company-Setup/whistle-blower/${reportId}/`,
                    config
                );
        
                // Remove the deleted report from the state
                setReports((prevReports) => prevReports.filter(report => report.id !== reportId));
        
                console.log(`Report with ID ${reportId} deleted successfully`);
            } catch (error) {
                if (axios.isAxiosError(error)) {
                    console.error('Error deleting report:', error.response?.data || error.message);
                } else {
                    console.error('Unexpected error:', error);
                }
            }
        };
        
        const FetchWhistles=async()=>{
            const config = {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            };
        
            try{
                const response = await axios.get(`https://success365-backend-86f1c1-145db9-65-108-245-140.traefik.me/company-Setup/whistle-blower/`,
                config
                )
                setReports(response.data);
            }
            catch (error) {
                if (axios.isAxiosError(error)) {
                    console.error('Error fetching reports:', error.response?.data || error.message);
                } else {
                    console.error('Unexpected error:', error);
            }}
        };
        useEffect(() => {
         FetchWhistles();
        }, [])
        

    const closeModal = () => {
        setIsModalOpen(false);
        setFormData(initialFormFields);
        setIsEditMode(false);
        setCurrentEditId(null);
    };

    const openModal = () => setIsModalOpen(true);

    return (
        <div>
            <CommonTable heading="Whistle Report" onButtonClick={openModal} onDelete={handleDeleteReport} buttonLabel="Report" formFields={formFields} columns={columns} data={reports} />

            {/* Modal Popup for Form */}
            <Transition appear show={isModalOpen} as={Fragment}>
                <Dialog as="div" className="relative z-10" onClose={closeModal}>
                    <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
                        <div className="fixed inset-0 bg-black bg-opacity-25" />
                    </Transition.Child>

                    <div className="fixed inset-0 overflow-y-auto">
                        <div className="flex items-center justify-center min-h-full p-4 text-center">
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 scale-95"
                                enterTo="opacity-100 scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 scale-100"
                                leaveTo="opacity-0 scale-95"
                            >
                                <Dialog.Panel className="w-full max-w-3xl p-6 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-xl">
                                    <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900 mb-4">
                                        {isEditMode ? 'Edit Report' : 'Add Report'}
                                    </Dialog.Title>
                                    <FormComponent fields={formFields}     onSubmit={(submittedData) => handleAddOrEditReport(submittedData)}   onCancel={closeModal} />
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>
        </div>
    );
};

export default Whistle;
