import { DataTable } from 'mantine-datatable';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '../../store/themeConfigSlice';
import CommonPopup from './Common_Popup';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import IconUserPlus from '../Icon/IconUserPlus';
import { FormField } from './Common_Popup';

interface Column {
    accessor: string;
    title: string;
    render?: (row: any) => React.ReactNode;
}

interface TableComponentProps {
    heading: string;
    buttonLabel: string;
    formFields: FormField[];
    columns: Column[];
    data: any[];
    onAdd?: () => void;
    onEdit?: (item: any) => void;
    onDelete?: (id: number) => void;
    onSubmit?: (data: any) => void;
    isModalOpen?: boolean;
    setIsModalOpen?: (isOpen: boolean) => void;
    isLoading?: boolean;
    onButtonClick?: () => void;
}

const Common_Table: React.FC<TableComponentProps> = ({ 
    heading, 
    buttonLabel, 
    formFields, 
    columns, 
    data,
    onAdd,
    onEdit,
    onDelete,
    onSubmit,
    isModalOpen = false,
    setIsModalOpen,
    isLoading = false,
    onButtonClick
}) => {
    const dispatch = useDispatch();
    const [page, setPage] = useState(1);
    const PAGE_SIZES = [10, 20, 30, 50, 100];
    const [pageSize, setPageSize] = useState(PAGE_SIZES[0]);
    const [initialValues, setInitialValues] = useState<any>({});

    useEffect(() => {
        dispatch(setPageTitle(heading));
    }, [dispatch, heading]);

    const handleAdd = () => {
        setInitialValues({});
        if (onAdd) {
            onAdd();
        } else if (setIsModalOpen) {
            setIsModalOpen(true);
        }
    };

    const handleEdit = (item: any) => {
        setInitialValues(item);
        if (onEdit) {
            onEdit(item);
        }
    };

    const handleDelete = (id: number) => {
        if (onDelete) {
            onDelete(id);
        }
    };

    const handleSubmit = (formData: any) => {
        if (onSubmit) {
            onSubmit(formData);
        }
    };

    return (
        <div className="panel">
            <div className="flex justify-between items-center mb-5">
                <h5 className="font-semibold text-lg dark:text-white-light">{heading}</h5>
                <button type="button" className="btn btn-primary" onClick={onButtonClick}>
                    <IconUserPlus className="w-5 h-5 ltr:mr-2 rtl:ml-2" />
                    {buttonLabel}
                </button>
            </div>

            <div className="datatables">
                <DataTable
                    records={data}
                    columns={[
                        ...columns,
                        {
                            accessor: 'actions',
                            title: 'Actions',
                            render: (row) => (
                                <div className="flex gap-4">
                                    {/* <button 
                                        type="button" 
                                        className="btn btn-sm btn-outline-primary"
                                        onClick={() => handleEdit(row)}
                                    >
                                        Edit
                                    </button> */}
                                    <button 
                                        type="button" 
                                        className="btn btn-sm btn-outline-danger"
                                        onClick={() => handleDelete(row.id)}
                                    >
                                        Delete
                                    </button>
                                </div>
                            ),
                        },
                    ]}
                    totalRecords={data.length}
                    recordsPerPage={pageSize}
                    page={page}
                    onPageChange={(p) => setPage(p)}
                    recordsPerPageOptions={PAGE_SIZES}
                    onRecordsPerPageChange={setPageSize}
                    minHeight={200}
                    paginationText={({ from, to, totalRecords }) => `Showing  ${from} to ${to} of ${totalRecords} entries`}
                />
            </div>

            <Transition appear show={isModalOpen} as={Fragment}>
                <Dialog as="div" className="relative z-10" onClose={() => setIsModalOpen?.(false)}>
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
                        <div className="flex min-h-full items-center justify-center p-4 text-center">
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 scale-95"
                                enterTo="opacity-100 scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 scale-100"
                                leaveTo="opacity-0 scale-95"
                            >
                                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                                    <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900 mb-4">
                                        {initialValues.id ? 'Edit' : 'Add'} {heading}
                                    </Dialog.Title>
                                    <CommonPopup
                                        fields={formFields}
                                        onSubmit={handleSubmit}
                                        onCancel={() => setIsModalOpen?.(false)}
                                        initialValues={initialValues}
                                        isLoading={isLoading}
                                    />
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>
        </div>
    );
};

export default Common_Table;
