import React, { useState, useEffect } from 'react';
import { DataTable, DataTableColumn } from 'mantine-datatable';
import { useNavigate } from 'react-router-dom';
import { TaskType } from '../../../constantTypes/TasksTypes';
import toast, { Toaster } from 'react-hot-toast';
import Swal from 'sweetalert2';
import axios from 'axios';
import TaskServices from '../../../services/TaskServices';
import TaskPopupForm from './TaskPopupForm';

const View_Tasks: React.FC = () => {
    const navigate = useNavigate();
    const [tasks, setTasks] = useState<TaskType[]>([]);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [initialData, setInitialData] = useState<any | null>(null);
    const [openTaskPopupForm, setOpenTaskPopupForm] = useState<boolean>(false);
    const [selectedId, setSelectedId] = useState<number | null>(null);
    const [refresh, setRefresh] = useState<boolean>(false);

    // Fetching Tasks
    useEffect(() => {
        TaskServices.FetchTasks()
            .then((r) => {
                setTasks(r);
                console.log('Tasks: ', r);
            })
            .catch((e) => {
                console.log(e);
            })
            .finally(() => {
                setLoading(false);
            });
    }, [refresh]);

    const columns: DataTableColumn<TaskType>[] = [
        {
            accessor: 'task_name',
            title: 'Task',
            render: (task) => {
                const color = task.priority === 'low' ? 'yellow' : task.priority === 'medium' ? 'green' : 'red';
                return (
                    <div key={`name-${task.id}`}>
                        <div className="mb-1 font-bold text-blue-900">{task.task_name}</div>
                        <div className="flex items-center gap-3 font-semibold text-[14px] text-gray-600 ">
                            <span>
                                <span>Weight: </span>
                                {task.weight}
                            </span>
                            <span>
                                <span>Priority: </span>
                                <span className={`bg-${color}-500 px-2 rounded-xl text-black`}>{task.priority}</span>
                            </span>
                        </div>
                    </div>
                );
            },
        },
        {
            accessor: 'due_date',
            title: 'Dates',
            render: (task) => (
                <div key={`date-${task.id}`}>
                    <div className="flex items-center gap-2">
                        <span className="text-black font-semibold">Start Date</span>
                        <span className="text-gray-800 text-[12px]">{task.start_date?.split('T')[0]}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-black font-semibold">Due Date</span>
                        <span className="text-gray-800 text-[12px]">{task.start_date?.split('T')[0]}</span>
                    </div>
                </div>
            ),
        },
        {
            accessor: 'department_kpi',
            title: 'KPI',
            render: (task) => (
                <div key={`kpi-${task.id}`}>
                    <div className="mb-1 font-bold text-gray-900">{task.department_kpi.kpi_text}</div>
                    <div className="flex items-center gap-3 text-[12px] text-gray-600 ">
                        <span>
                            <span>Target: </span>
                            <span>{task.department_kpi.target}</span>
                        </span>
                        <span>
                            <span>Weight: </span>
                            {task.department_kpi.weight}
                        </span>
                    </div>
                </div>
            ),
        },
        {
            accessor: 'key_result',
            title: 'Key Result',
            render: (task) => (
                <div key={`key_result-${task.id}`}>
                    <div className="mb-1 font-bold text-gray-900">{task.key_result.key_result_text}</div>
                    <div className="text-[12px] text-gray-600">
                        target: {task.key_result.target} weight: {task.key_result.weight}
                    </div>
                </div>
            ),
        },
        {
            accessor: 'departmental_session_goal',
            title: 'Session Goal',
            render: (task) => (
                <div key={`SG-${task.id}`}>
                    <div className="mb-1 font-bold text-gray-900">{task.departmental_session_goal.goal_text}</div>
                    <div className="text-[12px] text-gray-600">
                        target: {task.departmental_session_goal.target} weight: {task.departmental_session_goal.weight}
                    </div>
                </div>
            ),
        },
        {
            accessor: 'department_goal',
            title: 'Department Goal',
            render: (task) => (
                <div key={`DG-${task.id}`}>
                    <div className="mb-1 font-bold text-gray-900">{task.department_goal.goal_text}</div>
                    <div className="text-[12px] text-gray-600">
                        target: {task.department_goal.target} weight: {task.department_goal.weight}
                    </div>
                </div>
            ),
        },
        // {
        //     accessor: 'company_goal',
        //     title: 'Company Goal',
        //     render: (task) => (
        //         <div>
        //             <div className="mb-1 font-bold text-gray-900">{task.company_goal.goal_text}</div>
        //             <div className="text-[12px] text-gray-600">weight: {task.company_goal.weight}</div>
        //         </div>
        //     ),
        // },
        {
            accessor: 'Actions',
            title: 'Actions',
            render: (task) => (
                <div key={`Action-${task.id}`} className="sticky right-0">
                    <div className="flex flex-col items-start gap-2">
                        <button onClick={() => handleEdit(task)} className="flex items-center gap-2 btn btn-sm btn-outline-primary min-w-20">
                            <i className="bi bi-pencil-square"></i>
                            Edit
                        </button>
                        <button onClick={() => console.log('clicked')} className="flex items-center gap-2 btn btn-sm btn-outline-primary min-w-20">
                            <i className="bi bi-person-plus" /> Assign
                        </button>
                        <button onClick={() => handleDeleteTask(task.id)} className="flex items-center gap-2 btn btn-sm btn-outline-danger min-w-20">
                            <i className="bi bi-trash"></i>
                            Delete
                        </button>
                    </div>
                </div>
            ),
        },

        // you can add more columns or an actions column here...
    ];

    const handleCreateUpdateSubmit = (data: FormData) => {
        console.log('Submitted Data', data);
        if (isEditing) {
            if (!selectedId) {
                toast.error('No ID found. System Error', { duration: 4000 });
                return;
            }
            TaskServices.UpdateTask(selectedId, data)
                .then(() => {
                    toast.success('Task Updated Succussfully', { duration: 4000 });
                    setRefresh((p) => !p);
                })
                .catch((e) => {
                    toast.error(e.message || 'Error Updating Task.', { duration: 4000 });
                });
        } else {
            TaskServices.AddTask(data)
                .then(() => {
                    console.log('added');
                    toast.success('Task Added Succussfully', { duration: 4000 });
                    setRefresh((p) => !p);
                })
                .catch((e) => {
                    toast.error(e.message || 'Error Adding Task.', { duration: 4000 });
                });
        }
    };
    const handleCreateTask = () => {
        setInitialData(null);
        setIsEditing(false);
        setSelectedId(null);
        setOpenTaskPopupForm(true);
    };
    const handleEdit = (data: TaskType) => {
        console.log('Initial Data: ', data);
        setInitialData(data);
        setIsEditing(true);
        setSelectedId(data.id);
        setOpenTaskPopupForm(true);
    };

    const handleDeleteTask = (id: number) => {
        console.log('deleting ID: ', id);

        Swal.fire({
            title: 'Are you sure?',
            text: 'Do you really want to delete this Task?',
            timerProgressBar: true,
            position: 'top-right',
            timer: 8000,
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'No, cancel!',
            reverseButtons: true,
        }).then((res) => {
            if (res.isConfirmed) {
                console.log('wow');
            }
        });
    };
    return (
        <div className="panel">
            <div className="mb-4 px-3 flex justify-between items-center">
                <h1 className="text-2xl font-semibold">Task List</h1>
                <button onClick={handleCreateTask} className="btn btn-xl btn-success">
                    Create Task
                </button>
            </div>
            <div className="datatables">
                <DataTable
                    withBorder
                    striped
                    className="whitespace-nowrap table-hover"
                    highlightOnHover
                    records={tasks}
                    columns={columns}
                    fetching={loading}
                    noRecordsText="No tasks to display"
                    // pagination, sorting, etc. props as needed
                />
            </div>

            {openTaskPopupForm && (
                <TaskPopupForm
                    isEditing={isEditing}
                    initialData={initialData}
                    onSubmit={handleCreateUpdateSubmit}
                    closeModel={() => {
                        setOpenTaskPopupForm(false);
                    }}
                />
            )}
            <Toaster position="top-right" reverseOrder={false} />
        </div>
    );
};

export default View_Tasks;
