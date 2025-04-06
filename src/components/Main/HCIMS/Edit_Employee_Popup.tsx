import { useState, Fragment, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
// import { useDispatch } from 'react-redux';
// import { setPageTitle } from '../../store/themeConfigSlice';
// import IconUserPlus from '../../components/Icon/IconUserPlus';
import IconX from '../../Icon/IconX';
import IconCaretDown from '../../Icon/IconCaretDown';
import axios from 'axios';

// import Edit from '../../../pages/Apps/Invoice/Edit';

const Edit_Employee_Popup = ({ closeModal }: { closeModal: () => void }) => {
    const [params, setParams] = useState({
        email: 'test@example.com',
        password: '123456',
        password2: '123456',
        first_name: 'John',
        last_name: 'Doe',
        designation: null,
        department: '',
        hire_date: '2025-03-05',
        report_to: null,
        profile_image: new File([], "empty.jpg", { type: "image/jpeg" }),
    });
      interface Designation {
        id: number;
        name: string;
        ParentDesignation: string;
        ChildDesignation: string;
    }
    interface Department {
        id: number;
        name: string;
        ParentDesignation: string;
        ChildDesignation: string;
    }

    const [departments, setDepartments] = useState<Department[]>([]);
    const [designations, setDesignations] = useState<Designation[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const changeValue = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { value, id } = e.target;
        setParams(prevParams => ({ ...prevParams, [id]: value }));
    };
    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]; // Get selected file
        if (file) {
            setParams(prev => ({ ...prev, profile_image: file }));
        }
    };
    // ✅ Token Refresh Function
    const refreshAccessToken = async () => {
        try {
            const refreshToken = localStorage.getItem("refreshToken");
            if (!refreshToken) throw new Error("No refresh token available");

            const response = await axios.post(`https://success365-backend-86f1c1-145db9-65-108-245-140.traefik.me/auth/token/refresh`, {
                refresh: refreshToken,
            });

            const { access, refresh } = response.data;

            localStorage.setItem("token", access);
            localStorage.setItem("refreshToken", refresh);

            return access;
        } catch (error) {
            console.error("❌ Failed to refresh token:", error);
            return null;
        }
    };

    // ✅ Handle Form Submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault(); 
        setIsLoading(true);
        setError("");

        try {
            let token = localStorage.getItem('token');
            if (!token) {
                setError("No access token found. Please log in again.");
                return;
            }

            const API_BASE_URL = "https://success365-backend-86f1c1-145db9-65-108-245-140.traefik.me";
            const response = await axios.post(`${API_BASE_URL}/auth/employee-register/`, params, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data",
                }
            });
            console.log("Submitting params:", params);
            if (response.status === 201) {
                alert("Employee added successfully!");
              

                closeModal();
            } else {
                setError("Failed to add employee. Please try again.");
            }
        } catch (err: any) {
            console.error("❌ Error:", err);

            if (err.response?.status === 401) {
                // Token expired, try refreshing
                const newToken = await refreshAccessToken();
                if (newToken) {
                    localStorage.setItem("token", newToken); // Update token before retrying
                    return handleSubmit(e);
                } else {
                    setError("Session expired. Please log in again.");
                }
            } else {
                setError(err.response?.data?.message || "Something went wrong.");
            }
        } finally {
            setIsLoading(false);
        }
    };

    // ✅ Fetch Employee Data When Component Loads
    useEffect(() => {
        const fetchEmployeeData = async () => {
            try {
                const token = localStorage.getItem('token'); // Fetch the token inside the effect
                if (!token) {
                    setError("No access token found.");
                    return;
                }

                const API_BASE_URL = "https://success365-backend-86f1c1-145db9-65-108-245-140.traefik.me";

                const response = await axios.get(`${API_BASE_URL}/auth/employees/7/`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json"
                    }
                });

                console.log(response.data);
                setParams(response.data); // ✅ Populate form with fetched data

            } catch (err: any) {
                console.error("❌ Error fetching employee data:", err);
                setError(err.response?.data?.message || "Failed to fetch data.");
            }
        };

        fetchEmployeeData();
    }, []);
    const fetchDepartments = async () => {
        const API_BASE_URL = "https://success365-backend-86f1c1-145db9-65-108-245-140.traefik.me";
        const authToken = localStorage.getItem('token');
        if (!authToken) {
            navigate('/auth/boxed-signin');
            return;
        }

        try {
            const response = await axios.get(`${API_BASE_URL}/company-Setup/departments/`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`
                }
            });
            setDepartments(response.data);
        } catch (err) {
            console.error('Failed to fetch departments:', err);
            setError('Failed to fetch departments');
        }
    };
   useEffect(() => {
     
   
    
    fetchDepartments()
   }, [])

   const fetchDesignation = async () => {
    const API_BASE_URL = "https://success365-backend-86f1c1-145db9-65-108-245-140.traefik.me";
    const authToken = localStorage.getItem('token');
    if (!authToken) {
        navigate('/auth/boxed-signin');
        return;
    }
    
    try {
        const response = await axios.get(`${API_BASE_URL}/company-Setup/designations/`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            }
        });

        setDesignations(response.data);
    } catch (err) {
        console.error('Failed to fetch designations:', err);
        setError('Failed to fetch designations');
    }
};

// ✅ Correct useEffect for fetching designations
useEffect(() => {
    fetchDesignation();
}, []);

console.log(departments)

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
                                    <form onSubmit={handleSubmit}>
                                        <div className="mb-5">
                                            <label htmlFor="full_name">First Name:</label>
                                            <input id="first_name" type="text" placeholder="" className="form-input" value={params.first_name} onChange={(e) => changeValue(e)} />
                                        </div>
                                        <div className="mb-5">
                                            <label htmlFor="full_name">Last Name:</label>
                                            <input id="last_name" type="text" placeholder="" className="form-input" value={params.last_name} onChange={(e) => changeValue(e)} />
                                        </div>
                                        <div className="mb-5 w-">
                                            <label htmlFor="email">Email:</label>
                                            <input id="email" type="email" placeholder="" className="form-input" value={params.email} onChange={(e) => changeValue(e)} />
                                        </div>
                                        <div className="flex gap-4">
                                            <div className="mb-5 w-[48%]">
                                                <label htmlFor="password">Password:</label>
                                                <input id="password" type="password" placeholder="" className="form-input" value={params.password} onChange={(e) => changeValue(e)} />
                                            </div>

                                            <div className="mb-5  w-[48%]">
                                                <label htmlFor="password2">Confirm Password:</label>
                                                <input id="password2" type="password" placeholder="" className="form-input" value={params.password2} onChange={(e) => changeValue(e)} />
                                            </div>
                                        </div>
                                        <div className="mb-5">
                                            <label htmlFor="hire_date">Hire Date:</label>
                                            <input id="hire_date" type="date" placeholder="" className="form-input" value={params.hire_date} onChange={(e) => changeValue(e)} />
                                        </div>
                                        <div className="mb-5">
                                            <label htmlFor="dp">Upload Image:</label>
                                            <input id="dp" type="file" className="form-input" onChange={(e) => handleImageUpload(e)} />
                                        </div>
                                        <div className="flex gap-4">
                                            {/* Department Select with Icon */}
                                            <div className="mb-5 w-[48%] relative">
                                                <label htmlFor="department">Department:</label>
                                                <select
                                                    id="department"
                                                    className="form-input pr-10" // Add padding-right to make space for the icon
                                                    value={params.department}
                                                    onChange={(e) => changeValue(e)}
                                                >
                                                    <option value="">None</option>
                                                    {departments.map((dept) => (
                                                        <option key={dept.id} value={dept.id.toString()}>
                                                            {dept.name}
                                                        </option>
                                                    ))}
                                                </select>
                                                <IconCaretDown className="absolute top-10 right-3 pointer-events-none" /> {/* Position icon */}
                                            </div>

                                            {/* Assign Designation Select with Icon */}
                                            <div className="mb-5 w-[48%] relative">
                                                <label htmlFor="assign_designation">Assign designation:</label>
                                                <select id="designation" className="form-input text-white pr-10" value={params.designation} onChange={(e) => changeValue(e)}>
                                                    <option value=""></option>
                                                    {designations.map((dept) => (
                                                        <option key={dept.id} value={dept.id.toString()}>
                                                            {dept.name}
                                                        </option>
                                                    ))}
                                                </select>
                                                <IconCaretDown className="absolute top-10 right-3 pointer-events-none" />
                                            </div>
                                        </div>

                                        <div className="flex gap-4">
                                            <div className="mb-5  w-[48%] relative">
                                                <label htmlFor="report_to">Report To:</label>

                                                <select id="report_to" className="form-input pr-10" value={params.report_to} onChange={(e) => changeValue(e)}>
                                                    <option value=""></option>
                                                    <option value="CEO">CEO</option>
                                                    <option value="CTO">CTO</option>
                                                    <option value="Manager">Manager</option>
                                                </select>
                                                <IconCaretDown className="absolute top-10 right-3 pointer-events-none" />
                                            </div>
                                            <div className="mb-5  w-[48%]">
                                                <label htmlFor="id">Employee ID:</label>
                                                <input id="id" type="text" placeholder="" className="form-input" value={params.id} onChange={(e) => changeValue(e)} />
                                            </div>
                                        </div>

                                        <div className="flex justify-end items-center mt-8">
                                            <button type="button" className="btn btn-outline-danger" onClick={closeModal}>
                                                Cancel
                                            </button>
                                            <button type="submit" className="btn btn-primary ltr:ml-4 rtl:mr-4">
                                                Add
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

export default Edit_Employee_Popup;