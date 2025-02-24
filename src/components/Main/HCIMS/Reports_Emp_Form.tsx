import React, { useState } from 'react';
import Select from 'react-select';
import ImageUploading, { ImageListType } from 'react-images-uploading';
// import 'file-upload-with-preview/dist/file-upload-with-preview.min.css';

const Reports_Emp_Form = () => {
    const [editorState, setEditorState] = useState<any>();
    const [formData, setFormData] = useState({
        cnic: '',
        marital_status: '',
        dateofbirth: '',
        street_address: '',
        city: '',
        state: '',
        zip_code: '',
        appartment: '',
        title: '',
        company: '',
        department: '',
        location: '',
        email: '',
        startdate: '',
        enddate: '',
        workphone: '',
        cell_phone: '',
        employee_id: '',
        first_name: '',
        last_name: '',
        person_address: '',
        primary_phone_no: '',
        alternate_phone_no: '',
        social_security: '',
        contact_no: '',
        bank_name: '',
        bank_account_no: '',
        educational_background: '',
        degrees_earned: '',
        certifications: '',
        professional_memberships: '',
        citizenship: '',
        bank_account_number: '',
        signature: '',
        medical_information: '',
        hobbies_and_interests: '',
        date: '',
        salary: '',
        degree_name: '',
        academic_start_date: '',
        academic_end_date: '',
        passing_year: '',
        major_subjects: '',
        any_special_info: '',
        achievements_title: '',
        achievements_details: '',
        expertise_name: '',
        expertise_details: '',
    });

    const categories = [
        {
            label: 'Branch',
            options: [
                { value: 'SH1', label: 'Garigel 1' },
                { value: 'SH2', label: 'Garigel 2' },
                { value: 'SH3', label: 'Garigel 3' },
            ],
        },
        {
            label: 'Assigned To',
            options: [
                { value: 'CRM1', label: 'Muhammad Mohsin' },
                { value: 'CRM2', label: 'Sharyar Khan' },
                { value: 'CRM3', label: 'Musa Khan' },
                { value: 'CRM4', label: 'Shah Hassan' },
                { value: 'CRM5', label: 'Amir Saeed' },
            ],
        },
        {
            label: 'Campaign Type',
            options: [
                { value: 'E1', label: 'Online' },
                { value: 'E2', label: 'Offline' },
                { value: 'E3', label: 'Email' },
                { value: 'E4', label: 'Social Media' },
            ],
        },
        {
            label: 'Product',
            options: [
                { value: 'E1', label: 'LCMS' },
                { value: 'E2', label: 'CRM' },
                { value: 'E3', label: 'HRMS' },
                { value: 'E4', label: 'Social Galaxia' },
            ],
        },
    ];

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const onEditorStateChange = (editorStates: any) => {
        setEditorState(editorStates);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        console.log(formData);
    };

    return (
        <div className="max-w-7xl mx-auto p-2  rounded-lg">
            <h1 className="text-gray-600 text-2xl font-semibold mb-6">Employee Details</h1>

            <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div>
                        <div className="bg-white shadow rounded-b-lg p-6 mb-6 dark:bg-black">
                            <h5 className="text-lg font-semibold bg-gray-100 p-3 mb-4 rounded-b-lg dark:bg-black">Employee Information</h5>
                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-2">CNIC:</label>
                                <input type="text" name="cnic" value={formData.cnic} onChange={handleInputChange} placeholder="" className="form-input" />
                            </div>

                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-2">Marital Status:</label>
                                <Select classNamePrefix="react-select" options={categories} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">Date Of Birth:</label>
                                <input type="date" name="dateofbirth" value={formData.dateofbirth} onChange={handleInputChange} className="form-input" />
                            </div>
                        </div>

                        <div className="bg-white shadow rounded-lg p-6 mb-6 dark:bg-black">
                            <h5 className="text-lg font-semibold bg-gray-100 p-3 mb-4 rounded-b-lg dark:bg-black">Address Information</h5>
                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-2">Street Address:</label>
                                <input
                                    type="text"
                                    name="street_address"
                                    value={formData.street_address}
                                    onChange={handleInputChange}
                                    placeholder=""
                                    className="form-input"
                                />
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                                <div>
                                    <label className="block text-sm font-medium mb-2">City:</label>
                                    <input type="text" name="city" value={formData.city} onChange={handleInputChange} placeholder="" className="form-input" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2">Zip Code:</label>
                                    <input
                                        type="text"
                                        name="zip_code"
                                        value={formData.zip_code}
                                        onChange={handleInputChange}
                                        placeholder=""
                                        className="form-input"
                                    />
                                </div>
                            </div>

                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-2">State:</label>
                                <input type="text" name="state" value={formData.state} onChange={handleInputChange} placeholder="" className="form-input" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">Appartment:</label>
                                <input
                                    type="text"
                                    name="appartment"
                                    value={formData.appartment}
                                    onChange={handleInputChange}
                                    placeholder=""
                                    className="form-input"
                                />
                            </div>
                        </div>
                        <div className="bg-white shadow  p-6 mb-6 rounded-b-lg dark:bg-black">
                            <h5 className="text-lg font-semibold bg-gray-100 p-3 mb-4 rounded-b-lg dark:bg-black">Previous Job Information</h5>
                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-2">Title:</label>
                                <input type="text" name="title" value={formData.title} onChange={handleInputChange} placeholder="" className="form-input" />
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                                <div>
                                    <label className="block text-sm font-medium mb-2">Company:</label>
                                    <input
                                        type="text"
                                        name="company"
                                        value={formData.company}
                                        onChange={handleInputChange}
                                        placeholder=""
                                        className="form-input"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2">Department:</label>
                                    <input
                                        type="text"
                                        name="department"
                                        value={formData.department}
                                        onChange={handleInputChange}
                                        placeholder=""
                                        className="form-input"
                                    />
                                </div>
                            </div>

                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-2">Email:</label>
                                <input type="text" name="email" value={formData.email} onChange={handleInputChange} placeholder="" className="form-input" />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-2">Location:</label>
                                <input type="text" name="location" value={formData.location} onChange={handleInputChange} placeholder="" className="form-input" />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                                <div>
                                    <label className="block text-sm font-medium mb-2">Start Date:</label>
                                    <input type="date" name="startdate" value={formData.startdate} onChange={handleInputChange} className="form-input" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2">End Date:</label>
                                    <input type="date" name="enddate" value={formData.enddate} onChange={handleInputChange} className="form-input" />
                                </div>
                            </div>

                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-2">Work Phone:</label>
                                <input
                                    type="text"
                                    name="workphone"
                                    value={formData.workphone}
                                    onChange={handleInputChange}
                                    placeholder=""
                                    className="form-input"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-2">Employee ID:</label>
                                <input
                                    type="text"
                                    name="employee_id"
                                    value={formData.employee_id}
                                    onChange={handleInputChange}
                                    placeholder=""
                                    className="form-input"
                                />
                            </div>

                            <div className="mb-4">
                                <div>
                                    <label className="block text-sm font-medium mb-2">Cell Phone:</label>
                                    <input
                                        type="text"
                                        name="cell_phone"
                                        value={formData.cell_phone}
                                        onChange={handleInputChange}
                                        placeholder=""
                                        className="form-input"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div>
                        <div className="bg-white shadow rounded-lg p-6 mb-6 dark:bg-black">
                            <h5 className="text-lg font-semibold bg-gray-100 p-3 mb-4 rounded-b-lg dark:bg-black">Emergency Contact Information</h5>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                                <div>
                                    <label className="block text-sm font-medium mb-2">First Name:</label>
                                    <input
                                        type="text"
                                        name="first_name"
                                        value={formData.first_name}
                                        onChange={handleInputChange}
                                        placeholder=""
                                        className="form-input"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2">Last Name:</label>
                                    <input
                                        type="text"
                                        name="last_name"
                                        value={formData.last_name}
                                        onChange={handleInputChange}
                                        placeholder=""
                                        className="form-input"
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                                <div>
                                    <label className="block text-sm font-medium mb-2">Primary Phone No:</label>
                                    <input
                                        type="text"
                                        name="primary_phone_no"
                                        value={formData.primary_phone_no}
                                        onChange={handleInputChange}
                                        placeholder=""
                                        className="form-input"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2">Alternate Phone No:</label>
                                    <input
                                        type="text"
                                        name="alternate_phone_no"
                                        value={formData.alternate_phone_no}
                                        onChange={handleInputChange}
                                        placeholder=""
                                        className="form-input"
                                    />
                                </div>
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-2">Person Address:</label>
                                <textarea
                                    name="person_address"
                                    rows={2}
                                    className="form-input"
                                    placeholder=""
                                ></textarea>
                            </div>
                        </div>
                        <div className="bg-white shadow rounded-lg p-6 mb-6 dark:bg-black">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                                <div>
                                    <label className="block text-sm font-medium mb-2">Social Security:</label>
                                    <input
                                        type="text"
                                        name="social_security"
                                        value={formData.social_security}
                                        onChange={handleInputChange}
                                        placeholder=""
                                        className="form-input"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2">Contact No:</label>
                                    <input
                                        type="text"
                                        name="contact_no"
                                        value={formData.contact_no}
                                        onChange={handleInputChange}
                                        placeholder=""
                                        className="form-input"
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                                <div>
                                    <label className="block text-sm font-medium mb-2">Bank Name:</label>
                                    <input
                                        type="text"
                                        name="bank_name"
                                        value={formData.bank_name}
                                        onChange={handleInputChange}
                                        placeholder=""
                                        className="form-input"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2">Bank Account No:</label>
                                    <input
                                        type="text"
                                        name="bank_account_no"
                                        value={formData.bank_account_no}
                                        onChange={handleInputChange}
                                        placeholder=""
                                        className="form-input"
                                    />
                                </div>
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-2">Educational Background:</label>
                                <textarea
                                    name="educational_background"
                                    rows={2}
                                    className="form-input"
                                    placeholder=""
                                ></textarea>
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-2">Degrees Earned:</label>
                                <textarea
                                    name="degrees_earned"
                                    rows={2}
                                    className="form-input"
                                    placeholder=""
                                ></textarea>
                            </div>
                        </div>
                        <div className="bg-white shadow rounded-lg p-6 mb-6 dark:bg-black">
                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-2">Citizenship:</label>
                                <Select classNamePrefix="react-select" options={categories} />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                                <div>
                                    <label className="block text-sm font-medium mb-2">Bank Account Number:</label>
                                    <input
                                        type="text"
                                        name="bank_account_number"
                                        value={formData.bank_account_number}
                                        onChange={handleInputChange}
                                        placeholder=""
                                        className="form-input"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2">Signature:</label>
                                    <input
                                        type="text"
                                        name="signature"
                                        value={formData.signature}
                                        onChange={handleInputChange}
                                        placeholder=""
                                        className="form-input"
                                    />
                                </div>
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-2">Certifications:</label>
                                <textarea
                                    name="certifications"
                                    rows={2}
                                    className="form-input"
                                    placeholder=""
                                ></textarea>
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-2">Professional Memberships:</label>
                                <textarea
                                    name="professional_memberships"
                                    rows={2}
                                    className="form-input"
                                    placeholder=""
                                ></textarea>
                            </div>
                        </div>
                        <div className="bg-white shadow rounded-lg p-6 mb-6 dark:bg-black">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                                <div>
                                    <label className="block text-sm font-medium mb-2">Date:</label>
                                    <input type="date" name="date" value={formData.date} onChange={handleInputChange} className="form-input" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2">Salary:</label>
                                    <input type="text" name="salary" value={formData.salary} onChange={handleInputChange} placeholder="" className="form-input" />
                                </div>
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-2">Medical Information:</label>
                                <textarea
                                    name="medical_information"
                                    rows={2}
                                    className="form-input"
                                    placeholder=""
                                ></textarea>
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-2">Hobbies and Interests:</label>
                                <textarea
                                    name="hobbies_and_interests"
                                    rows={2}
                                    className="form-input"
                                    placeholder=""
                                ></textarea>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex justify-center mt-6">
                    <button className=" bg-blue-500 text-white py-2 px-16 rounded">Submit</button>
                </div>
            </form>

            <form onSubmit={handleSubmit} className="mt-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div>
                        <div className="bg-white shadow rounded-lg p-6 mb-6 dark:bg-black">
                            <h5 className="text-lg font-semibold bg-gray-100 p-3 mb-4 rounded-b-lg dark:bg-black">Academic Information</h5>
                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-2">Degree Name:</label>
                                <input
                                    type="text"
                                    name="degree_name"
                                    value={formData.degree_name}
                                    onChange={handleInputChange}
                                    placeholder=""
                                    className="form-input"
                                />
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                                <div>
                                    <label className="block text-sm font-medium mb-2">Start Date:</label>
                                    <input
                                        type="date"
                                        name="academic_start_date"
                                        value={formData.academic_start_date}
                                        onChange={handleInputChange}
                                        className="form-input"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2">End Date:</label>
                                    <input
                                        type="date"
                                        name="academic_end_date"
                                        value={formData.academic_end_date}
                                        onChange={handleInputChange}
                                        className="form-input"
                                    />
                                </div>
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-2">Passing Year:</label>
                                <input type="date" name="passing_year" value={formData.passing_year} onChange={handleInputChange} className="form-input" />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-2">Major Subjects:</label>
                                <textarea
                                    name="major_subjects"
                                    rows={2}
                                    className="form-input"
                                    placeholder=""
                                ></textarea>
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-2">Any Special Info:</label>
                                <textarea
                                    name="any_special_info"
                                    rows={2}
                                    className="form-input"
                                    placeholder=""
                                ></textarea>
                            </div>
                        </div>
                    </div>
                    <div>
                        <div className="bg-white shadow rounded-lg p-6 mb-6 dark:bg-black">
                            <h5 className="text-lg font-semibold bg-gray-100 p-3 mb-4 rounded-b-lg dark:bg-black">Achievements</h5>

                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-2">Title:</label>
                                <input
                                    type="text"
                                    name="achievements_title"
                                    value={formData.achievements_title}
                                    onChange={handleInputChange}
                                    placeholder=""
                                    className="form-input"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-2">Details:</label>
                                <textarea
                                    name="achievements_details"
                                    rows={2}
                                    className="form-input"
                                    placeholder=""
                                ></textarea>
                            </div>
                            <h5 className="text-lg font-semibold bg-gray-100 p-3 mb-4 rounded-b-lg dark:bg-black">Expertise</h5>
                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-2">Name:</label>
                                <input
                                    type="text"
                                    name="expertise_name"
                                    value={formData.expertise_name}
                                    onChange={handleInputChange}
                                    placeholder=""
                                    className="form-input"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-2">Details:</label>
                                <textarea
                                    name="expertise_details"
                                    rows={2}
                                    className="form-input"
                                    placeholder=""
                                ></textarea>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex justify-center mt-6">
                    <button className="bg-blue-500 text-white py-2 px-16 rounded">Save</button>
                </div>
            </form>
        </div>
    );
};

export default Reports_Emp_Form;