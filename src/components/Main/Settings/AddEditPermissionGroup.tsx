import { Group, Switch } from '@mantine/core';
import React, { useEffect, useState } from 'react';
import CompanySetupServices from '../../../services/CompanySetupServices';

interface PropsType {
    isEditing: boolean;
    initialData: any;
    onClose: () => void;
}
import toast, { Toaster } from 'react-hot-toast';
function AddEditPermissionGroup({ isEditing, initialData, onClose }: PropsType) {
    const [groupName, setGroupName] = useState<string>('');
    const [color, setColor] = useState<string>('blue');
    const [isSystem, setIsSystem] = useState<boolean>(false);
    const [error, setError] = useState<any>(null);

    // Pre filling Initial Data
    useEffect(() => {
        if (isEditing && initialData) {
            setGroupName(initialData.name);
            setColor(initialData.color);
            setIsSystem(initialData.isSystem);
        }
    }, [isEditing, initialData]);

    const onNameChange = (e: any) => {
        setError(null);
        setGroupName(e.target.value);
    };
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        const gn = groupName.trim();
        if (gn.trim() === '') {
            setError('Group name is required');
            return;
        } else if (gn.length < 3) {
            setError('Group name must have at least 3 characters');
            return;
        }
        const payload = {
            name: groupName.trim(),
            color: color.trim().toLowerCase(),
            is_system: isSystem,
        };
        console.log('payload', payload);
        CompanySetupServices.AddGroupPermission(payload)
            .then(() => {
                toast.success('Group Added Successfully', { duration: 4000 });
                onClose;
            })
            .catch((e) => {
                toast.error(e.message || 'error Adding group');
            });
    };

    return (
        <div className="inset-0 fixed flex z-50 items-center justify-center min-h-screen">
            <div onClick={onClose} className="inset-0 fixed bg-black bg-opacity-60 z-50"></div>
            <div className="flex mx-1 sm:mx-3 sm:w-[45%] md:w-[35%] flex-col items-center rounded-lg overflow-hidden bg-white z-50">
                <h1 className="bg-gray-100 py-6 w-full text-2xl font-bold text-center">{isEditing ? 'Update Group' : 'Add Group'}</h1>
                <form onSubmit={handleSubmit} className="w-full px-3 md:px-5 p-2 m-3 flex flex-col gap-4" action="">
                    <div className="flex flex-col mb-2">
                        <label htmlFor="name">Group Name</label>
                        <input placeholder="HR Manager" className="border px-3 py-2 rounded focus:outline-blue-400" onChange={(e) => onNameChange(e)} id="name" type="text" />
                        {error && <p className="text-red-500 text-sm">{error} </p>}
                    </div>
                    <div className="flex flex-col mb-2">
                        <label htmlFor="color">Color</label>
                        <input placeholder="blue" className="border px-3 py-2 rounded focus:outline-blue-400" onChange={(e) => setColor(e.target.value)} id="color" type="text" />
                    </div>
                    <div className="flex flex-col">
                        <Group>
                            <label htmlFor="color">Is System</label>
                            <Switch checked={isSystem} onChange={(e) => setIsSystem(e.currentTarget.checked)} />
                        </Group>
                    </div>
                    <div className="flex items-center justify-end">
                        <div className="flex items-center gap-2">
                            <button type="submit" className="btn btn-sm btn-primary px-4">
                                {isEditing ? 'Update' : 'Add'}
                            </button>
                            <button onClick={onClose} className="btn btn-sm btn-secondary px-4">
                                Close
                            </button>
                        </div>
                    </div>
                </form>
            </div>
            <Toaster position="top-right" reverseOrder={false} />
        </div>
    );
}

export default AddEditPermissionGroup;
