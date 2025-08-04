import { useState, Fragment, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import Swal from 'sweetalert2';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '../../../../store/themeConfigSlice';
import IconUserPlus from '../../../Icon/IconUserPlus';
import IconListCheck from '../../../Icon/IconListCheck';
import IconLayoutGrid from '../../../Icon/IconLayoutGrid';
import IconSearch from '../../../Icon/IconSearch';
import IconUser from '../../../Icon/IconUser';
import IconFacebook from '../../../Icon/IconFacebook';
import IconInstagram from '../../../Icon/IconInstagram';
import IconLinkedin from '../../../Icon/IconLinkedin';
import IconTwitter from '../../../Icon/IconTwitter';
import IconX from '../../../Icon/IconX';
import EmployeeServices from '../../../../services/EmployeeServices';
import { useSelector } from 'react-redux';
import toast, { Toaster } from 'react-hot-toast';

const Employee_Details = () => {
    const EmployeesList = useSelector((s: any) => s.employee.employeesList);
    const dispatch = useDispatch();
    const [refresh, setRefresh] = useState<boolean>(false);

    useEffect(() => {
        dispatch(setPageTitle('Contacts'));
    });
    useEffect(() => {
        EmployeeServices.FetchEmployees(dispatch)
            .then((r) => {
                console.log('Employees: ', r);
            })
            .catch(console.error);
    }, [refresh]);

    const [addContactModal, setAddContactModal] = useState<any>(false);

    const [value, setValue] = useState<any>('list');
    const [defaultParams] = useState({
        id: null,
        first_name: '',
        last_name: '',
        email: '',
        contact_number: '',
        role: '',
        location: '',
    });

    const [params, setParams] = useState<any>(JSON.parse(JSON.stringify(defaultParams)));

    const changeValue = (e: any) => {
        const { value, id } = e.target;
        setParams({ ...params, [id]: value });
    };

    const [search, setSearch] = useState<any>('');

    const [filteredItems, setFilteredItems] = useState<any>(EmployeesList);
    useEffect(() => {
        console.log('EmployeesList', EmployeesList);
    }, [EmployeesList]);
    useEffect(() => {
        if (!EmployeesList) return;
        setFilteredItems(() => {
            return EmployeesList.filter((item: any) => {
                return item.first_name.toLowerCase().includes(search.toLowerCase());
            });
        });
    }, [search, EmployeesList]);

    const saveUser = () => {
        if (!params.first_name) {
            showMessage('First Name is required.', 'error');
            return true;
        }
        if (!params.last_name) {
            showMessage('Last Name is required.', 'error');
            return true;
        }
        if (!params.email) {
            showMessage('Email is required.', 'error');
            return true;
        }
        if (!params.contact_number) {
            showMessage('Contact Number is required.', 'error');
            return true;
        }
        // if (!params.role) {
        //     showMessage('Occupation is required.', 'error');
        //     return true;
        // }
        const payload = {
            first_name: params.first_name,
            last_name: params.last_name,
            email: params.email,
            contact_number: params.contact_number,
            location: params.location,
        };
        if (params.id) {
            //update user
            EmployeeServices.UpdateEmployee(params.id, payload)
                .then((r) => {
                    console.log('Updated ', r);
                    showMessage('User has been saved successfully.');
                    setAddContactModal(false);
                    setRefresh((p) => !p);
                })
                .catch((e) => {
                    console.log(e);
                });
        } else {
            //add user
            EmployeeServices.AddEmployee(payload)
                .then((r) => {
                    console.log('added ', r);
                    showMessage('User has been saved successfully.');
                    setAddContactModal(false);
                    setRefresh((p) => !p);
                })
                .catch((e) => {
                    console.log(e);
                });
        }
    };

    const editUser = (user: any = null) => {
        const json = JSON.parse(JSON.stringify(defaultParams));
        setParams(json);
        if (user) {
            let json1 = JSON.parse(JSON.stringify(user));
            setParams(json1);
        }
        setAddContactModal(true);
    };

    const deleteUser = (user: any = null) => {
        if (!filteredItems) return;
        setFilteredItems(filteredItems.filter((d: any) => d.id !== user.id));
        showMessage('User has been deleted successfully.');
    };

    const showMessage = (msg = '', type = 'success') => {
        const toast: any = Swal.mixin({
            toast: true,
            position: 'top',
            showConfirmButton: false,
            timer: 3000,
            customClass: { container: 'toast' },
        });
        toast.fire({
            icon: type,
            title: msg,
            padding: '10px 20px',
        });
    };

    useEffect(() => {
        console.log('filteredItems: ', filteredItems);
    }, [filteredItems]);

    return (
        <div>
            <div className="flex items-center justify-between flex-wrap gap-4">
                <h2 className="text-xl">Employee Details</h2>
                <div className="flex sm:flex-row flex-col sm:items-center sm:gap-3 gap-4 w-full sm:w-auto">
                    <div className="flex gap-3">
                        <div>
                            <button type="button" className="btn btn-primary" onClick={() => editUser()}>
                                <IconUserPlus className="ltr:mr-2 rtl:ml-2" />
                                Add Employees
                            </button>
                        </div>
                        <div>
                            <button type="button" className={`btn btn-outline-primary p-2 ${value === 'list' && 'bg-primary text-white'}`} onClick={() => setValue('list')}>
                                <IconListCheck />
                            </button>
                        </div>
                        <div>
                            <button type="button" className={`btn btn-outline-primary p-2 ${value === 'grid' && 'bg-primary text-white'}`} onClick={() => setValue('grid')}>
                                <IconLayoutGrid />
                            </button>
                        </div>
                    </div>
                    <div className="relative">
                        <input type="text" placeholder="Search Contacts" className="form-input py-2 ltr:pr-11 rtl:pl-11 peer" value={search} onChange={(e) => setSearch(e.target.value)} />
                        <button type="button" className="absolute ltr:right-[11px] rtl:left-[11px] top-1/2 -translate-y-1/2 peer-focus:text-primary">
                            <IconSearch className="mx-auto" />
                        </button>
                    </div>
                </div>
            </div>
            {value === 'list' && (
                <div className="mt-5 panel p-0 border-0 overflow-hidden">
                    <div className="table-responsive">
                        <table className="table-striped table-hover">
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Departemnt</th>
                                    <th>Phone</th>
                                    <th className="!text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredItems &&
                                    filteredItems.map((contact: any) => {
                                        return (
                                            <tr key={contact.id}>
                                                <td>
                                                    <div className="flex items-center w-max">
                                                        {contact.profile_image && (
                                                            <div className="w-max">
                                                                <img src={`${contact.profile_image}`} className="h-8 w-8 rounded-full object-cover ltr:mr-2 rtl:ml-2" alt="avatar" />
                                                            </div>
                                                        )}
                                                        {!contact.profile_image && contact.name && (
                                                            <div className="grid place-content-center h-8 w-8 ltr:mr-2 rtl:ml-2 rounded-full bg-primary text-white text-sm font-semibold"></div>
                                                        )}
                                                        {!contact.profile_image && !contact.name && (
                                                            <div className="border border-gray-300 dark:border-gray-800 rounded-full p-2 ltr:mr-2 rtl:ml-2">
                                                                <IconUser className="w-4.5 h-4.5" />
                                                            </div>
                                                        )}
                                                        <div>{`${contact.first_name} ${contact.last_name} `}</div>
                                                    </div>
                                                </td>
                                                <td>{contact.email}</td>
                                                <td className="whitespace-nowrap">{contact?.department?.name}</td>
                                                <td className="whitespace-nowrap">{contact?.contact_number || 'N/A'}</td>
                                                <td>
                                                    <div className="flex gap-4 items-center justify-center">
                                                        <button type="button" className="btn btn-sm btn-outline-primary" onClick={() => editUser(contact)}>
                                                            Edit
                                                        </button>
                                                        <button type="button" className="btn btn-sm btn-outline-danger" onClick={() => deleteUser(contact)}>
                                                            Delete
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {value === 'grid' && (
                <div className="grid 2xl:grid-cols-4 xl:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-6 mt-5 w-full">
                    {filteredItems &&
                        filteredItems.map((contact: any) => {
                            return (
                                <div className="bg-white dark:bg-[#1c232f] rounded-md overflow-hidden text-center shadow relative" key={contact.id}>
                                    <div className="bg-white dark:bg-[#1c232f] rounded-md overflow-hidden text-center shadow relative">
                                        <div
                                            className="bg-white/40 rounded-t-md bg-center bg-cover p-6 pb-0 bg-"
                                            style={{
                                                backgroundImage: `url('/assets/images/notification-bg.png')`,
                                                backgroundRepeat: 'no-repeat',
                                                width: '100%',
                                                height: '100%',
                                            }}
                                        >
                                            <img className="object-contain w-4/5 max-h-40 mx-auto" src={contact.profile_image} alt="contact_image" />
                                        </div>
                                        <div className="px-6 pb-24 -mt-10 relative">
                                            <div className="shadow-md bg-white dark:bg-gray-900 rounded-md px-2 py-4">
                                                <div className="text-xl">{`${contact.first_name} ${contact.last_name}`}</div>
                                                <div className="text-white-dark">{contact.role}</div>
                                                <div className="flex items-center justify-between flex-wrap mt-6 gap-3">
                                                    <div className="flex-auto">
                                                        <div className="text-info">{contact.posts}</div>
                                                        <div>Posts</div>
                                                    </div>
                                                    <div className="flex-auto">
                                                        <div className="text-info">{contact.following}</div>
                                                        <div>Following</div>
                                                    </div>
                                                    <div className="flex-auto">
                                                        <div className="text-info">{contact.followers}</div>
                                                        <div>Followers</div>
                                                    </div>
                                                </div>
                                                <div className="mt-4">
                                                    <ul className="flex space-x-4 rtl:space-x-reverse items-center justify-center">
                                                        <li>
                                                            <button type="button" className="btn btn-outline-primary p-0 h-7 w-7 rounded-full">
                                                                <IconFacebook />
                                                            </button>
                                                        </li>
                                                        <li>
                                                            <button type="button" className="btn btn-outline-primary p-0 h-7 w-7 rounded-full">
                                                                <IconInstagram />
                                                            </button>
                                                        </li>
                                                        <li>
                                                            <button type="button" className="btn btn-outline-primary p-0 h-7 w-7 rounded-full">
                                                                <IconLinkedin />
                                                            </button>
                                                        </li>
                                                        <li>
                                                            <button type="button" className="btn btn-outline-primary p-0 h-7 w-7 rounded-full">
                                                                <IconTwitter />
                                                            </button>
                                                        </li>
                                                    </ul>
                                                </div>
                                            </div>
                                            <div className="mt-6 grid grid-cols-1 gap-4 ltr:text-left rtl:text-right">
                                                <div className="flex items-center">
                                                    <div className="flex-none ltr:mr-2 rtl:ml-2">Email :</div>
                                                    <div className="truncate text-white-dark">{contact.email}</div>
                                                </div>
                                                <div className="flex items-center">
                                                    <div className="flex-none ltr:mr-2 rtl:ml-2">Phone :</div>
                                                    <div className="text-white-dark">{contact.contact_number}</div>
                                                </div>
                                                <div className="flex items-center">
                                                    <div className="flex-none ltr:mr-2 rtl:ml-2">Address :</div>
                                                    <div className="text-white-dark">{contact.location}</div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="mt-6 flex gap-4 absolute bottom-0 w-full ltr:left-0 rtl:right-0 p-6">
                                            <button type="button" className="btn btn-outline-primary w-1/2" onClick={() => editUser(contact)}>
                                                Edit
                                            </button>
                                            <button type="button" className="btn btn-outline-danger w-1/2" onClick={() => deleteUser(contact)}>
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                </div>
            )}

            <Transition appear show={addContactModal} as={Fragment}>
                <Dialog as="div" open={addContactModal} onClose={() => setAddContactModal(false)} className="relative z-[51]">
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
                                <Dialog.Panel className="panel border-0 p-0 rounded-lg overflow-hidden w-full max-w-lg text-black dark:text-white-dark">
                                    <button
                                        type="button"
                                        onClick={() => setAddContactModal(false)}
                                        className="absolute top-4 ltr:right-4 rtl:left-4 text-gray-400 hover:text-gray-800 dark:hover:text-gray-600 outline-none"
                                    >
                                        <IconX />
                                    </button>
                                    <div className="text-lg font-medium bg-[#fbfbfb] dark:bg-[#121c2c] ltr:pl-5 rtl:pr-5 py-3 ltr:pr-[50px] rtl:pl-[50px]">
                                        {params.id ? 'Edit Contact' : 'Add Contact'}
                                    </div>
                                    <div className="p-5">
                                        <form>
                                            <div className="mb-5">
                                                <label htmlFor="first_name">Frist Name</label>
                                                <input id="first_name" type="text" placeholder="Enter First Name" className="form-input" value={params.first_name} onChange={(e) => changeValue(e)} />
                                            </div>
                                            <div className="mb-5">
                                                <label htmlFor="last_name">Last Name</label>
                                                <input id="last_name" type="text" placeholder="Enter Last Name" className="form-input" value={params.last_name} onChange={(e) => changeValue(e)} />
                                            </div>
                                            <div className="mb-5">
                                                <label htmlFor="email">Email</label>
                                                <input id="email" type="email" placeholder="Enter Email" className="form-input" value={params.email} onChange={(e) => changeValue(e)} />
                                            </div>
                                            <div className="mb-5">
                                                <label htmlFor="number">Phone Number</label>
                                                <input
                                                    id="contact_number"
                                                    type="text"
                                                    placeholder="Enter Phone Number"
                                                    className="form-input"
                                                    value={params.contact_number}
                                                    onChange={(e) => changeValue(e)}
                                                />
                                            </div>
                                            <div className="mb-5">
                                                <label htmlFor="occupation">Occupation</label>
                                                <input id="role" type="text" placeholder="Enter Occupation" className="form-input" value={params.role} onChange={(e) => changeValue(e)} />
                                            </div>
                                            <div className="mb-5">
                                                <label htmlFor="address">Address</label>
                                                <textarea
                                                    id="location"
                                                    rows={3}
                                                    placeholder="Enter Address"
                                                    className="form-textarea resize-none min-h-[130px]"
                                                    value={params.location}
                                                    onChange={(e) => changeValue(e)}
                                                ></textarea>
                                            </div>
                                            <div className="flex justify-end items-center mt-8">
                                                <button type="button" className="btn btn-outline-danger" onClick={() => setAddContactModal(false)}>
                                                    Cancel
                                                </button>
                                                <button type="button" className="btn btn-primary ltr:ml-4 rtl:mr-4" onClick={saveUser}>
                                                    {params.id ? 'Update' : 'Add'}
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
        </div>
    );
};

export default Employee_Details;
