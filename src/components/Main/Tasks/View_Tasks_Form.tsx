import React, { useState } from 'react';
import Select from 'react-select';
import ImageUploading, { ImageListType } from 'react-images-uploading';
import View_Tasks from './View_Tasks';
// import 'file-upload-with-preview/dist/file-upload-with-preview.min.css';

const View_Tasks_Form = () => {
    const [editorState, setEditorState] = useState<any>();
    const [formData, setFormData] = useState({
        quotationNo: '',
        quotationDate: '',
        expirationDate: '',
        quantity: '',
        unitPrice: '',
        email: '',
        phoneNo: '',
    });
    const [images2, setImages2] = useState<any>([]);
    const maxNumber = 69;

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

    const onChange2 = (imageList: ImageListType) => {
        setImages2(imageList as never[]);
    };

    const onEditorStateChange = (editorStates: any) => {
        setEditorState(editorStates);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        console.log(formData);
    };

    return (
        <div className="max-w-7xl mx-auto p-2  rounded-lg ">
            <h1 className="text-gray-600 text-2xl font-semibold mb-6">Create Task</h1>

            <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div>
                        <div className="bg-white shadow rounded-lg p-6 mb-6">
                            <h5 className="text-lg font-semibold bg-gray-100 p-3 mb-4 rounded-b-lg">Task Information</h5>
                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-2">Department:</label>
                                <Select classNamePrefix="react-select" options={categories} />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-2">Task title:</label>
                                <input
                                    type="text"
                                    name="quotationNo"
                                    value={formData.quotationNo}
                                    onChange={handleInputChange}
                                    placeholder=""
                                    className="w-full px-4 py-2 border border-gray-300 rounded"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-2">Designation:</label>
                                <Select classNamePrefix="react-select" options={categories} />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-2">Employee:</label>
                                <Select classNamePrefix="react-select" options={categories} />
                            </div>
                        </div>

                        <div className="bg-white shadow rounded-lg p-6 mb-6">
                            <h5 className="text-lg font-semibold bg-gray-100 p-3 mb-4 rounded-b-lg">Task Details</h5>
                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-2">Frequency:</label>
                                <Select classNamePrefix="react-select" options={categories} />
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                                <div>
                                    <label className="block text-sm font-medium mb-2">Start Date:</label>
                                    <input type="date" name="quotationDate" value={formData.quotationDate} onChange={handleInputChange} className="w-full px-4 py-2 border border-gray-300 rounded" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2">Due Date:</label>
                                    <input type="date" name="expirationDate" value={formData.expirationDate} onChange={handleInputChange} className="w-full px-4 py-2 border border-gray-300 rounded" />
                                </div>
                            </div>

                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-2">Instructions:</label>
                                <textarea
                                    name="description"
                                    rows={5}
                                    className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder=""
                                ></textarea>
                            </div>
                        </div>
                    </div>

                    <div>
                        <div className="bg-white shadow rounded-lg p-6 mb-6">
                            <h5 className="text-lg font-semibold bg-gray-100 p-3 mb-4 rounded-b-lg">Performance Metrics</h5>
                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-2">Department Key Results:</label>
                                <Select classNamePrefix="react-select" options={categories} />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-2">Department KPI:</label>
                                <Select classNamePrefix="react-select" options={categories} />
                            </div>
                            <div className="custom-file-container mb-2" data-upload-id="mySecondImage">
                                <div className="label-container flex justify-between">
                                    <label className="block text-sm font-medium text-white">Task File:</label>
                                    <button
                                        type="button"
                                        className="custom-file-container__image-clear text-red-500"
                                        title="Clear Image"
                                        onClick={() => {
                                            setImages2([]);
                                        }}
                                    >
                                        ×
                                    </button>
                                </div>
                                <ImageUploading multiple value={images2} onChange={onChange2} maxNumber={maxNumber}>
                                    {({ imageList, onImageUpload, onImageRemove }) => (
                                        <div className="upload__image-wrapper">
                                            <button className="custom-file-container__custom-file__custom-file-control bg-gray-400 text-white py-1 px-4 rounded" onClick={onImageUpload} type="button">
                                                Choose File...
                                            </button>
                                            <div className="grid gap-4 sm:grid-cols-3 grid-cols-1 mt-12">
                                                {imageList.map((image, index) => (
                                                    <div key={index} className="relative">
                                                        <button
                                                            type="button"
                                                            className="absolute top-0 left-0 bg-red-500 text-white p-1 rounded-full"
                                                            title="Remove Image"
                                                            onClick={() => onImageRemove(index)}
                                                        >
                                                            ×
                                                        </button>
                                                        <img src={image.dataURL} alt="Task" className="w-full h-48 object-cover shadow rounded-lg" />
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </ImageUploading>
                                {images2.length === 0 && <img src="/assets/images/file-preview.svg" className="max-w-56 w-full m-auto mt-4" alt="File preview" />}
                            </div>
                        </div>
                        <div className="bg-white shadow rounded-lg p-6 mb-6">
                            <h5 className="text-lg font-semibold bg-gray-100 p-3 mb-4 rounded-b-lg">Task Settings: </h5>
                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-2">Priority:</label>
                                <Select classNamePrefix="react-select" options={categories} />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-2">Weight:</label>
                                <input
                                    type="text"
                                    name="quotationNo"
                                    value={formData.quotationNo}
                                    onChange={handleInputChange}
                                    placeholder=""
                                    className="w-full px-4 py-2 border border-gray-300 rounded"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-2">Co-Workers:</label>
                                <Select classNamePrefix="react-select" options={categories} />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex justify-center mt-6">
                    <button className="bg-blue-500 text-white py-2 px-6 rounded">Submit</button>
                </div>
            </form>
        </div>
    );
};

export default View_Tasks_Form;