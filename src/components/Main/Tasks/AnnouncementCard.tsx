// components/AnnouncementCard.tsx
import React, { useState } from 'react';
import { FaCalendarAlt, FaBuilding, FaUser, FaEdit, FaTrash, FaFilePdf, FaDownload, FaEye, FaFile } from 'react-icons/fa';
import { announcementType } from '../../../constantTypes/CompanySetupTypes';
export interface Attachment {
    name: string;
}
import { formatDate } from '../../../utils/Common';
import Swal from 'sweetalert2';
import CompanySetupServices from '../../../services/CompanySetupServices';
import toast, { Toaster } from 'react-hot-toast';
import Announcement_Popup from './Announcement_Popup';

const priorityColors = {
    High: 'bg-red-100 text-red-800',
    Medium: 'bg-yellow-100 text-yellow-800',
    Low: 'bg-green-100 text-green-800',
};

export function formatBytes(bytes: number | null): string {
    if (!bytes) return '0 B';
    if (bytes === 0) return '0 B';
    const k = 1024;
    const dm = 2;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

function formatFilename(name: string | null) {
    if (!name) return null;
    if (name.length < 21) return name;
    return `${name.slice(0, 14)}…${name.slice(-7)}`;
}
interface props {
    inputData: announcementType;
    onSuccessOuter?: () => void;
}

const AnnouncementCard: React.FC<props> = ({ inputData, onSuccessOuter }: props) => {
    const [initialData, setInitialData] = useState<any>();
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [openAnnouncementPopup, setOpenAnnouncementPopup] = useState<boolean>(false);
    function handleDelete() {
        Swal.fire({
            title: `Delete announcement #${inputData.id}?`,
            text: 'This action cannot be undone. Are you sure you want to proceed?',
            icon: 'warning', // 'warning', 'error', 'success', 'info', or 'question'
            showCancelButton: true,
            timer: 8000,
            timerProgressBar: true,
            confirmButtonText: 'Yes, delete it',
            cancelButtonText: 'Cancel',
            customClass: {
                // this class will wrap both buttons
                actions: 'd-flex justify-content-end gap-2', // Bootstrap 5: gap-2
                confirmButton: 'btn btn-danger',
                cancelButton: 'btn btn-secondary',
            },
            buttonsStyling: false, // if you want to use your own Bootstrap classes
        }).then((result) => {
            if (result.isConfirmed) {
                CompanySetupServices.DeleteAnnouncements(inputData.id)
                    .then(() => {
                        toast.success('Announcement Deleted', { duration: 4000 });
                        onSuccessOuter?.();
                    })
                    .catch((e) => {
                        toast.error(e.message || 'Error Deleting Announcement', { duration: 4000 });
                    });
            }
        });
    }

    const onSuccess = () => {
        onSuccessOuter?.();
    };
    const handleEditing = () => {
        console.log('Initial: data', inputData);
        setInitialData(inputData);
        setIsEditing(true);
        setOpenAnnouncementPopup(true);
    };
    return (
        <div className="bg-white border rounded-lg shadow-sm">
            {/* Header */}
            <div className="px-6 py-4 border-b flex justify-between items-center">
                <div>
                    <div className="flex items-center gap-3">
                        <h2 className="text-2xl font-semibold">{inputData.title}</h2>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${priorityColors[inputData.priority]}`}>{inputData.priority}</span>
                    </div>
                </div>
                <div className="flex items-center space-x-2">
                    <button onClick={handleEditing} className="text-gray-400 hover:text-gray-600">
                        <FaEdit />
                    </button>
                    <button onClick={handleDelete} className="text-red-400 hover:text-red-600">
                        <FaTrash />
                    </button>
                </div>
            </div>

            {/* Meta + Body */}
            <div className="px-6 py-4">
                <div className="flex flex-wrap text-[12px] text-gray-600 space-x-6">
                    <div className="flex items-center">
                        <FaCalendarAlt className="mr-1" /> {formatDate(inputData.date)}
                    </div>
                    <div className="flex items-center">
                        <FaUser className="mr-1" /> {inputData.target_info}
                    </div>
                    <div className="flex items-center">
                        <FaEye className="mr-1" /> {inputData.total_reads}/{inputData.total_targets} read
                    </div>
                </div>

                <p className="mt-4 text-gray-700 leading-relaxed">{inputData.description}</p>
            </div>

            {/* Progress */}
            <div className="px-6 py-4 border-t">
                <div className="flex items-center justify-between">
                    <div className="text-sm font-medium text-gray-700 mb-1">Read Progress</div>
                    <div className="mt-1 text-right text-xs text-gray-600">{inputData.progress}%</div>
                </div>

                <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-600" style={{ width: `${inputData.progress}%` }} />
                </div>
            </div>

            {/* Attachments */}
            {inputData.attachments.length > 0 && (
                <div className="px-6 py-4 border-t">
                    <div className="flex items-center text-gray-800 font-medium mb-2">
                        <FaFilePdf className="mr-2" />
                        Attachments ({inputData.attachments.length})
                    </div>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                        {inputData.attachments.map((file, i) => (
                            <li key={i} className="flex items-center justify-between bg-gray-50 p-3 rounded">
                                <div className="flex items-center space-x-2">
                                    <FaFile className="text-red-500" />
                                    <div className="flex flex-col">
                                        <span className="truncate font-medium">{formatFilename(file.name)}</span>
                                        <span className="text-xs text-gray-500">{formatBytes(file.size)}</span>
                                    </div>
                                </div>
                                <a
                                    href={`http://127.0.0.1:8000/company-Setup/announcements/files/${file.id}/download/`}
                                    download={file.name}
                                    className="text-gray-500 hover:text-gray-700"
                                    title={`Download ${file.name}`}
                                >
                                    <FaDownload />
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {/* Footer */}
            <div className="px-6 py-3 border-t text-xs text-gray-500 flex justify-between">
                <div>Created by {inputData.created_by.name}</div>
                <div>Updated {formatDate(inputData.date)}</div>
            </div>
            <Toaster position="top-right" reverseOrder={false} />
            {openAnnouncementPopup && <Announcement_Popup isEditing={isEditing} initialData={initialData} onSuccess={onSuccess} onClose={() => setOpenAnnouncementPopup(false)} />}
        </div>
    );
};

export default AnnouncementCard;
