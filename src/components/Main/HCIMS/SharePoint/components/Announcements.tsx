import React, { useState, useEffect, useMemo } from 'react';
import { 
    FiPlus, 
    FiEdit3, 
    FiTrash2, 
    FiFilter, 
    FiSearch, 
    FiMessageCircle, 
    FiShare2, 
    FiBookmark,
    FiMoreVertical,
    FiAlertTriangle,
    FiCheckCircle
} from 'react-icons/fi';
import { Editor, EditorState } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { Announcement, Comment } from '../types';

interface AnnouncementsProps {
    siteId: string;
    announcements: Announcement[];
    onAdd: (announcement: Announcement) => void;
    onEdit: (id: string, updates: Partial<Announcement>) => void;
    onDelete: (id: string) => void;
}

interface Announcement {
    id: string;
    title: string;
    content: string;
    priority: 'normal' | 'high' | 'urgent';
    createdAt: Date;
    modifiedAt: Date;
    author: string;
    likes: number;
    comments: Comment[];
    targetGroups?: string[]; 
    multimedia?: string[]; 
}

interface Comment {
    id: string;
    content: string;
    author: string;
    createdAt: Date;
}

const PriorityBadge: React.FC<{ priority: 'normal' | 'high' | 'urgent' }> = ({ priority }) => {
    const badgeStyles = {
        normal: 'bg-green-100 text-green-800',
        high: 'bg-yellow-100 text-yellow-800',
        urgent: 'bg-red-100 text-red-800'
    };

    const icons = {
        normal: <FiCheckCircle className="mr-1" />,
        high: <FiAlertTriangle className="mr-1" />,
        urgent: <FiAlertTriangle className="mr-1" />
    };

    return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${badgeStyles[priority]}`}>
            {icons[priority]}
            {priority.charAt(0).toUpperCase() + priority.slice(1)}
        </span>
    );
};

const Announcements: React.FC<AnnouncementsProps> = ({ 
    siteId, 
    announcements, 
    onAdd, 
    onEdit, 
    onDelete 
}) => {
    const [filteredAnnouncements, setFilteredAnnouncements] = useState<Announcement[]>(announcements);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterPriority, setFilterPriority] = useState<'all' | 'normal' | 'high' | 'urgent'>('all');
    const [showAddModal, setShowAddModal] = useState(false);
    const [selectedAnnouncement, setSelectedAnnouncement] = useState<Partial<Announcement> | null>(null);
    const [newComment, setNewComment] = useState('');
    const [editorState, setEditorState] = useState(() => EditorState.createEmpty());

    useEffect(() => {
        let filtered = announcements;

        if (searchTerm) {
            filtered = filtered.filter(
                announcement => 
                    announcement.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    announcement.content.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        if (filterPriority !== 'all') {
            filtered = filtered.filter(announcement => announcement.priority === filterPriority);
        }

        setFilteredAnnouncements(filtered);
    }, [announcements, searchTerm, filterPriority]);

    const handleAddComment = (announcementId: string) => {
        if (!newComment.trim()) return;

        const comment: Comment = {
            id: Math.random().toString(),
            content: newComment,
            author: 'Current User',
            createdAt: new Date()
        };

        onEdit(announcementId, {
            comments: [...(selectedAnnouncement?.comments || []), comment]
        });

        setNewComment('');
    };

    const renderAnnouncementActions = (announcement: Announcement) => (
        <div className="absolute top-2 right-2 flex space-x-2">
            <button 
                onClick={() => {
                    setSelectedAnnouncement(announcement);
                    setShowAddModal(true);
                }}
                className="text-gray-500 hover:text-blue-600"
            >
                <FiEdit3 />
            </button>
            <button 
                onClick={() => onDelete(announcement.id)}
                className="text-gray-500 hover:text-red-600"
            >
                <FiTrash2 />
            </button>
            <button 
                className="text-gray-500 hover:text-gray-700"
            >
                <FiMoreVertical />
            </button>
        </div>
    );

    const renderAnnouncementModal = () => (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-2xl p-6 max-h-[90vh] overflow-y-auto">
                <h2 className="text-2xl font-bold mb-4">
                    {selectedAnnouncement?.id ? 'Edit Announcement' : 'Create Announcement'}
                </h2>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Title
                        </label>
                        <input
                            type="text"
                            value={selectedAnnouncement?.title || ''}
                            onChange={(e) => setSelectedAnnouncement(prev => ({ ...prev, title: e.target.value }))}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Content
                        </label>
                        <Editor
                            editorState={editorState}
                            onEditorStateChange={setEditorState}
                            wrapperClassName="demo-wrapper"
                            editorClassName="demo-editor"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Target Groups
                        </label>
                        <input
                            type="text"
                            value={selectedAnnouncement?.targetGroups?.join(', ') || ''}
                            onChange={(e) => setSelectedAnnouncement(prev => ({ 
                                ...prev, 
                                targetGroups: e.target.value.split(',').map(group => group.trim()) 
                            }))}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Multimedia Links
                        </label>
                        <input
                            type="text"
                            value={selectedAnnouncement?.multimedia?.join(', ') || ''}
                            onChange={(e) => setSelectedAnnouncement(prev => ({ 
                                ...prev, 
                                multimedia: e.target.value.split(',').map(link => link.trim()) 
                            }))}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Priority
                        </label>
                        <select
                            value={selectedAnnouncement?.priority || 'normal'}
                            onChange={(e) => setSelectedAnnouncement(prev => ({ 
                                ...prev, 
                                priority: e.target.value as 'normal' | 'high' | 'urgent' 
                            }))}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        >
                            <option value="normal">Normal</option>
                            <option value="high">High</option>
                            <option value="urgent">Urgent</option>
                        </select>
                    </div>
                </div>

                <div className="mt-6 flex justify-end space-x-3">
                    <button 
                        onClick={() => setShowAddModal(false)}
                        className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                    >
                        Cancel
                    </button>
                    <button 
                        onClick={() => {
                            if (selectedAnnouncement?.id) {
                                onEdit(selectedAnnouncement.id, selectedAnnouncement);
                            } else {
                                onAdd({
                                    ...selectedAnnouncement,
                                    id: Math.random().toString(),
                                    createdAt: new Date(),
                                    modifiedAt: new Date(),
                                    author: 'Current User',
                                    likes: 0,
                                    comments: [],
                                    targetGroups: selectedAnnouncement?.targetGroups || [],
                                    multimedia: selectedAnnouncement?.multimedia || []
                                } as Announcement);
                            }
                            setShowAddModal(false);
                            setSelectedAnnouncement(null);
                        }}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700"
                    >
                        {selectedAnnouncement?.id ? 'Update' : 'Create'}
                    </button>
                </div>
            </div>
        </div>
    );

    return (
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Announcements</h2>
                <div className="flex space-x-4">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search announcements..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-8 pr-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        />
                        <FiSearch className="absolute left-2 top-3 text-gray-400" />
                    </div>
                    <select 
                        value={filterPriority}
                        onChange={(e) => setFilterPriority(e.target.value as 'all' | 'normal' | 'high' | 'urgent')}
                        className="border border-gray-300 rounded-md px-3 py-2"
                    >
                        <option value="all">All Priorities</option>
                        <option value="normal">Normal</option>
                        <option value="high">High</option>
                        <option value="urgent">Urgent</option>
                    </select>
                    <button 
                        onClick={() => {
                            setSelectedAnnouncement(null);
                            setShowAddModal(true);
                        }}
                        className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                    >
                        <FiPlus className="mr-2" /> Create Announcement
                    </button>
                </div>
            </div>

            {filteredAnnouncements.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                    No announcements found
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-6">
                    {filteredAnnouncements.map((announcement) => (
                        <div 
                            key={announcement.id} 
                            className="relative bg-gray-50 dark:bg-gray-700 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow"
                        >
                            {renderAnnouncementActions(announcement)}
                            
                            <div className="mb-4">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                        {announcement.title}
                                    </h3>
                                    <PriorityBadge priority={announcement.priority} />
                                </div>
                                <p className="text-gray-600 dark:text-gray-300 mt-2">
                                    {announcement.content}
                                </p>
                            </div>

                            <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                                <div>
                                    <span>By {announcement.author}</span>
                                    <span className="mx-2">•</span>
                                    <span>{announcement.createdAt.toLocaleDateString()}</span>
                                </div>
                                <div className="flex space-x-4">
                                    <button className="hover:text-blue-600 flex items-center">
                                        <FiMessageCircle className="mr-1" /> 
                                        {announcement.comments?.length || 0} Comments
                                    </button>
                                    <button className="hover:text-blue-600 flex items-center">
                                        <FiShare2 className="mr-1" /> Share
                                    </button>
                                    <button className="hover:text-blue-600 flex items-center">
                                        <FiBookmark className="mr-1" /> Bookmark
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {showAddModal && renderAnnouncementModal()}
        </div>
    );
};

export default Announcements;
