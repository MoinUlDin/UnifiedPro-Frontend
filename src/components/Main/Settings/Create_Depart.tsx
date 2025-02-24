import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import config from '../../../config';

interface Department {
    id: number;
    name: string;
    expected_arrival_time: string;
    parent: number | null;
}

interface FormData {
    name: string;
    expected_arrival_time: string;
    parent: string | null;
}

const CreateDepartmentForm: React.FC = () => {
    const [formData, setFormData] = useState<FormData>({
        name: '',
        expected_arrival_time: '',
        parent: 'null',
    });
    const [departments, setDepartments] = useState<Department[]>([]);
    const [error, setError] = useState<string>('');
    const [success, setSuccess] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const navigate = useNavigate();

    useEffect(() => {
        document.title = 'Create Department';
        fetchDepartments();
    }, []);

    const fetchDepartments = async () => {
        const authToken = localStorage.getItem('token');
        if (!authToken) {
            navigate('/auth/boxed-signin');
            return;
        }

        try {
            const response = await axios.get(
                `${config.API_BASE_URL}company-Setup/departments/`,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Token ${authToken}`
                    }
                }
            );
            setDepartments(response.data);
        } catch (err) {
            console.error('Failed to fetch departments:', err);
            setError('Failed to fetch departments');
        }
    };

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);

        const authToken = localStorage.getItem('token');
        if (!authToken) {
            setError('Authentication token is missing');
            setIsLoading(false);
            return;
        }

        try {
            const submissionData = {
                name: formData.name,
                expected_arrival_time: formData.expected_arrival_time,
                parent: formData.parent === 'null' ? null : Number(formData.parent),
            };

            // Make POST request to create department
            const response = await axios.post(
                `${config.API_BASE_URL}company-Setup/departments/`,
                submissionData,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Token ${authToken}`
                    }
                }
            );

            console.log('Department created successfully:', response.data);
            setSuccess('Department created successfully!');
            
            // Reset form
            setFormData({
                name: '',
                expected_arrival_time: '',
                parent: 'null'
            });
            
            // Refresh departments list
            fetchDepartments();
            toast.success('Department created successfully!');
        } catch (err) {
            let errorMessage = 'An unknown error occurred';

            if (axios.isAxiosError(err) && err.response) {
                errorMessage = err.response.data.detail || err.response.statusText;
            }
            setError(errorMessage);
            toast.error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Create Department</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label htmlFor="name" className="block text-sm font-medium">
                        Department Name
                    </label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full px-3 py-2 border rounded"
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="expected_arrival_time" className="block text-sm font-medium">
                        Expected Arrival Time
                    </label>
                    <input
                        type="time"
                        id="expected_arrival_time"
                        name="expected_arrival_time"
                        value={formData.expected_arrival_time}
                        onChange={handleChange}
                        required
                        className="w-full px-3 py-2 border rounded"
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="parent" className="block text-sm font-medium">
                        Parent Department
                    </label>
                    <select
                        id="parent"
                        name="parent"
                        value={formData.parent}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border rounded"
                    >
                        <option value="null">None</option>
                        {departments.map((dept) => (
                            <option key={dept.id} value={dept.id.toString()}>
                                {dept.name}
                            </option>
                        ))}
                    </select>
                </div>

                {error && <div className="mt-4 text-red-600">{error}</div>}
                {success && <div className="mt-4 text-green-600">{success}</div>}

                <button
                    type="submit"
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    disabled={isLoading}
                >
                    {isLoading ? 'Creating...' : 'Create Department'}
                </button>
            </form>
        </div>
    );
};

export default CreateDepartmentForm;
