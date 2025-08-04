// components/AnnouncementCard.tsx
import React from 'react';
import { FaCalendarAlt, FaBuilding, FaUser, FaEdit, FaTrash, FaFilePdf, FaDownload, FaEye, FaFile } from 'react-icons/fa';
import { announcementType } from '../../../constantTypes/CompanySetupTypes';
export interface Attachment {
    name: string;
}
import { formatDate } from '../../../utils/Common';
import Swal from 'sweetalert2';
import CompanySetupServices from '../../../services/CompanySetupServices';
import toast, { Toaster } from 'react-hot-toast';

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

const AnnouncementCard: React.FC<announcementType> = ({ id, title, priority, date, department, target_info, total_reads, total_targets, description, progress, attachments, created_by }) => {
    function handleDelete() {
        Swal.fire({
            title: `Delete announcement #${id}?`,
            text: 'This action cannot be undone. Are you sure you want to proceed?',
            icon: 'warning', // 'warning', 'error', 'success', 'info', or 'question'
            showCancelButton: true,
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
                CompanySetupServices.DeleteAnnouncements(id)
                    .then(() => {
                        toast.success('Announcement Deleted', { duration: 4000 });
                    })
                    .catch((e) => {
                        toast.error(e.message || 'Error Deleting Announcement', { duration: 4000 });
                    });
            }
        });
    }
    return (
        <div className="bg-white border rounded-lg shadow-sm">
            {/* Header */}
            <div className="px-6 py-4 border-b flex justify-between items-start">
                <div className="flex-1 flex items-center gap-2">
                    <div className="flex items-center justify-between gap-3">
                        <h2 className="text-xl font-semibold">{title}</h2>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${priorityColors[priority]}`}>{priority}</span>
                    </div>
                </div>
                <div className="flex items-center space-x-2">
                    <button className="text-gray-400 hover:text-gray-600">
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
                        <FaCalendarAlt className="mr-1" /> {formatDate(date)}
                    </div>
                    <div className="flex items-center">
                        <FaUser className="mr-1" /> {target_info}
                    </div>
                    <div className="flex items-center">
                        <FaEye className="mr-1" /> {total_reads}/{total_targets} read
                    </div>
                </div>

                <p className="mt-4 text-gray-700 leading-relaxed">{description}</p>
            </div>

            {/* Progress */}
            <div className="px-6 py-4 border-t">
                <div className="flex items-center justify-between">
                    <div className="text-sm font-medium text-gray-700 mb-1">Read Progress</div>
                    <div className="mt-1 text-right text-xs text-gray-600">{progress}%</div>
                </div>

                <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-600" style={{ width: `${progress}%` }} />
                </div>
            </div>

            {/* Attachments */}
            {attachments.length > 0 && (
                <div className="px-6 py-4 border-t">
                    <div className="flex items-center text-gray-800 font-medium mb-2">
                        <FaFilePdf className="mr-2" />
                        Attachments ({attachments.length})
                    </div>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 space-y-2">
                        {attachments.map((file, i) => (
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
                <div>Created by {created_by.name}</div>
                <div>Updated {formatDate(date)}</div>
            </div>
            <Toaster position="top-right" reverseOrder={false} />
        </div>
    );
};

export default AnnouncementCard;
