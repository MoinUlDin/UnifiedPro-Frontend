import { useState, Fragment, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '../../../store/themeConfigSlice';
import CommonTable from '../Common_Table';
import CommonPopup from '../Common_Popup';
import CompanyStandards from './Company_Info_Details/CompanyStandards';
import WorkingDays from './Company_Info_Details/WorkingDays';
import Branches from './Company_Info_Details/Branches';
import SubCompanies from './Company_Info_Details/SubCompanies';

// Define the policy type to match the shape of policy objects
interface Policy {
    id: number;
    Name: string;
    Email: string;
    Website: string;
    PhoneNumber: string;
    WorkingTime: string;
    OfficeOpenTime: string;
    OfficeCloseTime: string;
    BreakStartTime: string;
    BreakEndTime: string;
}

const Company_Info = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(setPageTitle('Company Policies'));
    }, [dispatch]);

    const [policies, setPolicies] = useState<Policy[]>([
        {
            id: 1,
            Name: 'None',
            Email: 'example@example.com',
            Website: 'www.example.com',
            PhoneNumber: '123-456-7890',
            WorkingTime: 'None',
            OfficeOpenTime: '9 a.m.',
            OfficeCloseTime: '6 p.m.',
            BreakStartTime: '1 p.m.',
            BreakEndTime: '2 p.m.'
        }
    ]);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [currentEditId, setCurrentEditId] = useState<number | null>(null);

    const initialFormFields: Policy = {
        id: 0,
        Name: 'None',
        Email: '',
        Website: 'None',
        PhoneNumber: '',
        WorkingTime: 'None',
        OfficeOpenTime: '9 a.m.',
        OfficeCloseTime: '6 p.m.',
        BreakStartTime: '1 p.m.',
        BreakEndTime: '2 p.m.'
    };

    const [formData, setFormData] = useState<Policy>(initialFormFields);

    const columns = [
        { accessor: 'id', title: 'ID' },
        { accessor: 'Name', title: 'Name' },
        { accessor: 'Email', title: 'Email' },
        { accessor: 'Website', title: 'Website' },
        { accessor: 'PhoneNumber', title: 'Phone Number' },
        { accessor: 'WorkingTime', title: 'Working Time' },
        { accessor: 'OfficeOpenTime', title: 'Office Open Time' },
        { accessor: 'OfficeCloseTime', title: 'Office Close Time' },
        { accessor: 'BreakStartTime', title: 'Break Start Time' },
        { accessor: 'BreakEndTime', title: 'Break End Time' }
    ];

    const formFields = [
        { id: 'Name', label: 'Name', type: 'text', value: formData.Name },
        { id: 'Email', label: 'Email', type: 'email', value: formData.Email },
        { id: 'Website', label: 'Website', type: 'text', value: formData.Website },
        { id: 'PhoneNumber', label: 'Phone Number', type: 'text', value: formData.PhoneNumber },
        { id: 'WorkingTime', label: 'Working Time', type: 'text', value: formData.WorkingTime },
        { id: 'OfficeOpenTime', label: 'Office Open Time', type: 'time', value: formData.OfficeOpenTime },
        { id: 'OfficeCloseTime', label: 'Office Close Time', type: 'time', value: formData.OfficeCloseTime },
        { id: 'BreakStartTime', label: 'Break Start Time', type: 'time', value: formData.BreakStartTime },
        { id: 'BreakEndTime', label: 'Break End Time', type: 'time', value: formData.BreakEndTime }
    ];

    const handleAddOrEditPolicy = (submittedData: typeof initialFormFields) => {
      if (isEditMode && currentEditId !== null) {
          setPolicies(prev =>
              prev.map(policy =>
                  policy.id === currentEditId
                      ? { ...policy, ...submittedData }
                      : policy
              )
          );
          setIsEditMode(false);
          setCurrentEditId(null);
      } else {
          const newPolicy = {
              ...submittedData,
              id: policies.length + 1
          };
          setPolicies(prev => [...prev, newPolicy]);
      }
  
      setFormData(initialFormFields);
      closeModal();
  };
  

    const closeModal = () => {
        setIsModalOpen(false);
        setFormData(initialFormFields);
        setIsEditMode(false);
        setCurrentEditId(null);
    };

    const openModal = () => setIsModalOpen(true);

    return (
        <div>
            <CommonTable
                heading="Company info'"
                buttonLabel="info"
                formFields={formFields}
                columns={columns}
                data={policies}
                onButtonClick={openModal}
            />

            <Transition appear show={isModalOpen} as={Fragment}>
                <Dialog as="div" className="relative z-10" onClose={closeModal}>
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
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
                                        {isEditMode ? 'Edit Policy' : 'Add Policy'}
                                    </Dialog.Title>
                                    <CommonPopup
                                        fields={formFields}
                                        onSubmit={handleAddOrEditPolicy}
                                        onCancel={closeModal}
                                    />
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>

            <CompanyStandards/>
            <WorkingDays/>
            <Branches/>
            <SubCompanies/>
        </div>
    );
};

export default Company_Info;