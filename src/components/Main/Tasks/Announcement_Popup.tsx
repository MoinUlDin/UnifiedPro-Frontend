import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { FaBullhorn, FaTimes, FaUpload } from 'react-icons/fa';
import axios from 'axios';
import { announcementType } from '../../../constantTypes/CompanySetupTypes';
import { useDispatch } from 'react-redux';
import SettingServices from '../../../services/SettingServices';
import { useSelector } from 'react-redux';
import { useDropzone } from 'react-dropzone';
import CompanySetupServices from '../../../services/CompanySetupServices';

interface Props {
    initialData?: announcementType;
    onSuccess?: () => void;
}
interface DepartmentType {
    id: number;
    name: string;
}

export default function Announcement_Popup({ initialData, onSuccess }: Props) {
    const isEdit = Boolean(initialData);
    const [isOpen, setOpen] = useState(false);
    const departmentsList = useSelector((s: any) => s.settings.departmentList);
    const dispatch = useDispatch();
    const { register, handleSubmit, setValue, control, reset, watch } = useForm({
        defaultValues: {
            title: '',
            priority: 'Medium',
            department: 'company-wide',
            description: '',
            uploaded_files: [],
            is_active: true,
        },
    });
    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop: (accepted) => {
            const existing = watch('uploaded_files') || [];
            setValue('uploaded_files', [...existing, ...accepted], { shouldValidate: true });
        },
        multiple: true,
        maxSize: 10 * 1024 * 1024,
        accept: {
            'application/pdf': [],
            'application/msword': [],
            'application/vnd.ms-excel': [],
            'image/png': [],
            'image/jpeg': [],
        },
    });

    const selectedDept = watch('department');

    useEffect(() => {
        // fetch departments
        SettingServices.fetchDepartments(dispatch).then(() => {});
    }, []);

    useEffect(() => {
        if (isOpen && initialData) {
            reset({
                title: initialData.title,
                priority: initialData.priority,
                department: initialData.department ?? 'company-wide',
                description: initialData.description,
                uploaded_files: [],
                is_active: initialData.is_active,
            });
        } else if (isOpen) {
            reset();
        }
    }, [isOpen, initialData, reset]);

    const onSubmit = async (data: any) => {
        const form = new FormData();
        form.append('title', data.title);
        form.append('priority', data.priority);
        if (data.department !== 'company-wide') {
            form.append('department', data.department);
        }
        form.append('description', data.description);
        form.append('is_active', data.is_active);
        Array.from(data.uploaded_files).forEach((file) => form.append('uploaded_files', file));

        try {
            if (isEdit) {
                await axios.put(`/api/announcements/${initialData?.id}/`, form);
            } else {
                CompanySetupServices.AddAnnouncements(form)
                    .then(() => {
                        setOpen(false);
                        onSuccess?.();
                    })
                    .catch((e) => {
                        console.log('e');
                    });
            }
        } catch (err) {
            console.error(err);
            alert('Failed to save announcement');
        }
    };

    return (
        <>
            <button onClick={() => setOpen(true)} className="btn btn-primary">
                {isEdit ? 'Edit Announcement' : 'New Announcement'}
            </button>

            {isOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-lg w-full max-w-lg max-h-[90vh] overflow-y-auto p-6 relative">
                        <button className="absolute top-4 right-4 text-gray-500 hover:text-gray-700" onClick={() => setOpen(false)}>
                            <FaTimes />
                        </button>
                        <div className="flex items-center gap-2 mb-4">
                            <FaBullhorn className="text-2xl text-blue-600 leading-none" />
                            <h2 className="text-2xl font-semibold leading-none">{isEdit ? 'Edit Announcement' : 'Create New Announcement'}</h2>
                        </div>

                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                            {/* Title */}
                            <div>
                                <label className="block text-sm font-medium mb-1">Title *</label>
                                <input {...register('title', { required: true })} className="w-full border rounded p-2" placeholder="Enter announcement title" />
                            </div>

                            <div className="flex items-center gap-2">
                                {/* Priority */}
                                <div className="flex-grow">
                                    <label className="block text-sm font-medium mb-1">Priority</label>
                                    <select {...register('priority')} className="w-full border rounded p-2">
                                        {['High', 'Medium', 'Low'].map((p) => (
                                            <option key={p} value={p}>
                                                {p} Priority
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Target Audience */}
                                <div className="flex-grow">
                                    <label className="block text-sm font-medium mb-1">Target Audience</label>
                                    <select {...register('department')} className="w-full border rounded p-2">
                                        <option value="company-wide">Company-wide</option>
                                        {departmentsList.map((d: any) => (
                                            <option key={d.id} value={d.id}>
                                                {d.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* Description */}
                            <div>
                                <label className="block text-sm font-medium mb-1">Description *</label>
                                <textarea {...register('description', { required: true })} className="w-full border rounded p-2 h-24" placeholder="Enter announcement details..." />
                            </div>

                            {/* Attachments */}
                            <div>
                                <label className="block text-sm font-medium mb-1">Attachments</label>
                                <div
                                    {...getRootProps()}
                                    className={`border-2 border-dashed rounded p-6 text-center cursor-pointer transition
                                    ${isDragActive ? 'border-blue-400 bg-blue-50' : 'border-gray-300'}`}
                                >
                                    <input {...getInputProps()} />

                                    <FaUpload className="text-2xl mx-auto mb-2 text-gray-400" />
                                    <p className="text-gray-500">Drag & drop files here, or click to browse</p>
                                    <p className="text-xs text-gray-400 mt-1">PDF, DOC, XLS, PNG, JPG up to 10MB each</p>
                                </div>

                                {watch('uploaded_files')?.length > 0 && (
                                    <ul className="mt-4 space-y-2">
                                        {watch('uploaded_files').map((file: File, idx: number) => (
                                            <li key={idx} className="flex items-center justify-between bg-gray-50 p-3 rounded">
                                                <div className="truncate">
                                                    {file.name} <span className="text-xs text-gray-500">({(file.size / 1024).toFixed(1)} KB)</span>
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        const arr = [...watch('uploaded_files')];
                                                        arr.splice(idx, 1);
                                                        setValue('uploaded_files', arr);
                                                    }}
                                                    className="text-gray-400 hover:text-gray-600"
                                                >
                                                    <FaTimes />
                                                </button>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>

                            {/* Buttons */}
                            <div className="flex justify-end space-x-3 pt-4">
                                <button type="button" onClick={() => setOpen(false)} className="px-4 py-2 rounded border">
                                    Cancel
                                </button>
                                <button type="submit" className="px-4 py-2 rounded bg-blue-600 text-white">
                                    {isEdit ? 'Update Announcement' : 'Create Announcement'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}
