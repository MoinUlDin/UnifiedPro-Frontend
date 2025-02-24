import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { FiFolder, FiFile, FiUpload, FiDownload, FiTrash2, FiEdit2, FiShare2 } from 'react-icons/fi';

interface Document {
    id: string;
    name: string;
    type: string;
    size: number;
    modified: Date;
    modifiedBy: string;
    version: string;
    shared: boolean;
    path: string;
}

interface Folder {
    id: string;
    name: string;
    path: string;
    documents: Document[];
    folders: Folder[];
}

const DocumentLibrary: React.FC = () => {
    const [currentFolder, setCurrentFolder] = useState<Folder>({
        id: 'root',
        name: 'Documents',
        path: '/',
        documents: [],
        folders: []
    });
    const [selectedItems, setSelectedItems] = useState<string[]>([]);
    const [viewType, setViewType] = useState<'list' | 'grid'>('list');
    const [sorting, setSorting] = useState({ field: 'name', direction: 'asc' });
    const [showVersionHistory, setShowVersionHistory] = useState(false);
    const [showShareModal, setShowShareModal] = useState(false);

    const onDrop = useCallback((acceptedFiles: File[]) => {
        const newDocuments = acceptedFiles.map(file => ({
            id: Math.random().toString(),
            name: file.name,
            type: file.type,
            size: file.size,
            modified: new Date(),
            modifiedBy: 'Current User',
            version: '1.0',
            shared: false,
            path: currentFolder.path + file.name
        }));

        setCurrentFolder(prev => ({
            ...prev,
            documents: [...prev.documents, ...newDocuments]
        }));
    }, [currentFolder]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        noClick: true,
        noKeyboard: true
    });

    const handleCreateFolder = () => {
        const folderName = prompt('Enter folder name:');
        if (folderName) {
            const newFolder: Folder = {
                id: Math.random().toString(),
                name: folderName,
                path: currentFolder.path + folderName + '/',
                documents: [],
                folders: []
            };
            setCurrentFolder(prev => ({
                ...prev,
                folders: [...prev.folders, newFolder]
            }));
        }
    };

    const handleDelete = (ids: string[]) => {
        setCurrentFolder(prev => ({
            ...prev,
            documents: prev.documents.filter(doc => !ids.includes(doc.id)),
            folders: prev.folders.filter(folder => !ids.includes(folder.id))
        }));
        setSelectedItems([]);
    };

    const handleShare = (ids: string[]) => {
        setShowShareModal(true);
    };

    const renderBreadcrumb = () => {
        const paths = currentFolder.path.split('/').filter(Boolean);
        return (
            <div className="flex items-center space-x-2 text-sm text-gray-600 mb-4">
                <button 
                    onClick={() => setCurrentFolder({
                        id: 'root',
                        name: 'Documents',
                        path: '/',
                        documents: [],
                        folders: []
                    })}
                    className="hover:text-blue-600"
                >
                    Documents
                </button>
                {paths.map((path, index) => (
                    <React.Fragment key={index}>
                        <span>/</span>
                        <button className="hover:text-blue-600">{path}</button>
                    </React.Fragment>
                ))}
            </div>
        );
    };

    return (
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6" {...getRootProps()}>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Document Library</h2>
                <div className="flex space-x-4">
                    <button
                        onClick={handleCreateFolder}
                        className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                    >
                        <FiFolder className="mr-2" />
                        New Folder
                    </button>
                    <label className="inline-flex items-center px-3 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 cursor-pointer">
                        <FiUpload className="mr-2" />
                        Upload Files
                        <input {...getInputProps()} />
                    </label>
                </div>
            </div>

            {renderBreadcrumb()}

            {isDragActive && (
                <div className="border-2 border-dashed border-blue-400 rounded-lg p-8 mb-4 text-center text-blue-600">
                    Drop files here to upload
                </div>
            )}

            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                Name
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                Modified
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                Modified By
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                        {currentFolder.folders.map(folder => (
                            <tr
                                key={folder.id}
                                className="hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
                                onClick={() => setCurrentFolder(folder)}
                            >
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                        <FiFolder className="mr-2 text-yellow-500" />
                                        <span className="text-sm text-gray-900 dark:text-white">{folder.name}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                    -
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                    -
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                    <div className="flex space-x-2">
                                        <button onClick={(e) => {
                                            e.stopPropagation();
                                            handleShare([folder.id]);
                                        }}>
                                            <FiShare2 className="h-4 w-4" />
                                        </button>
                                        <button onClick={(e) => {
                                            e.stopPropagation();
                                            handleDelete([folder.id]);
                                        }}>
                                            <FiTrash2 className="h-4 w-4" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {currentFolder.documents.map(doc => (
                            <tr
                                key={doc.id}
                                className="hover:bg-gray-50 dark:hover:bg-gray-700"
                            >
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                        <FiFile className="mr-2 text-blue-500" />
                                        <span className="text-sm text-gray-900 dark:text-white">{doc.name}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                    {doc.modified.toLocaleDateString()}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                    {doc.modifiedBy}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                    <div className="flex space-x-2">
                                        <button>
                                            <FiDownload className="h-4 w-4" />
                                        </button>
                                        <button onClick={() => handleShare([doc.id])}>
                                            <FiShare2 className="h-4 w-4" />
                                        </button>
                                        <button onClick={() => handleDelete([doc.id])}>
                                            <FiTrash2 className="h-4 w-4" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default DocumentLibrary;
