// ProgressUpdatePopup.tsx
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import TaskServices from '../../../services/TaskServices';
import { TaskStatusType } from '../../../constantTypes/TasksTypes';

interface ProgressUpdateForm {
    progress: number;
    status?: TaskStatusType;
}

interface ProgressUpdatePopupProps {
    taskId: number;
    initialProgress: number;
    initialStatus: TaskStatusType;
    onClose: () => void;
    onSuccess: (updatedTask: any) => void; // you can type this more strictly if you like
}

const STATUS_CHOICES: TaskStatusType[] = ['Pending', 'In_Progress', 'On_Hold', 'Completed', 'Not_Completed', 'Running', 'Paused', 'Stopped'];

const ProgressUpdatePopup: React.FC<ProgressUpdatePopupProps> = ({ taskId, initialProgress, initialStatus, onClose, onSuccess }) => {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset,
    } = useForm<ProgressUpdateForm>({
        defaultValues: {
            progress: initialProgress,
            status: initialStatus,
        },
    });

    // reset form if initial props change
    useEffect(() => {
        console.log('progress: ', initialProgress, 'status:', initialStatus);
        reset({ progress: initialProgress, status: initialStatus });
    }, [initialProgress, initialStatus, reset]);

    const onSubmit = async (data: ProgressUpdateForm) => {
        try {
            // assume updateProgress expects { progress, status }
            const updated = await TaskServices.UpdateTaskProgress(taskId, data);
            toast.success('Progress updated');
            onSuccess(updated);
            onClose();
        } catch (err: any) {
            toast.error(err.message || 'Error updating progress');
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30 px-4">
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
                <h2 className="text-xl font-semibold mb-4">Update Progress</h2>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    {/* Progress */}
                    <div>
                        <label className="block text-sm font-medium mb-1">Progress (%)</label>
                        <input
                            type="number"
                            min={0}
                            max={100}
                            {...register('progress', {
                                required: 'Progress is required',
                                min: { value: 0, message: 'Must be at least 0' },
                                max: { value: 100, message: 'Cannot exceed 100' },
                            })}
                            className="form-input w-full"
                        />
                        {errors.progress && <p className="text-red-500 text-sm mt-1">{errors.progress.message}</p>}
                    </div>

                    {/* Status */}
                    <div>
                        <label className="block text-sm font-medium mb-1">Status</label>
                        <select {...register('status', { required: 'Status is required' })} className="form-select w-full">
                            {STATUS_CHOICES.map((s) => (
                                <option key={s} value={s}>
                                    {s.replace('_', ' ')}
                                </option>
                            ))}
                        </select>
                        {errors.status && <p className="text-red-500 text-sm mt-1">{errors.status.message}</p>}
                    </div>

                    {/* Actions */}
                    <div className="flex justify-end gap-2 mt-6">
                        <button type="button" onClick={onClose} className="px-4 py-2 border rounded" disabled={isSubmitting}>
                            Cancel
                        </button>
                        <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded disabled:opacity-50" disabled={isSubmitting}>
                            {isSubmitting ? 'Saving...' : 'Save'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ProgressUpdatePopup;
