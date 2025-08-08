import React, { useState, useEffect } from 'react';
import { DataTable, DataTableColumn } from 'mantine-datatable';
import { useNavigate } from 'react-router-dom';
import { TaskType } from '../../../constantTypes/TasksTypes';
import toast, { Toaster } from 'react-hot-toast';
import Swal from 'sweetalert2';
import axios from 'axios';
import IconUser from '../../Icon/IconUser';
import TaskServices from '../../../services/TaskServices';
import TaskPopupForm from './TaskPopupForm';
import AssignTasksPopup from './AssignTasksPopup';
import ProgressUpdatePopup from './ProgressUpdatePopup';
import { useFilterRows, FilterControls, FilterConfig } from '../../FilterControls';

function formatName(name: string): string {
    if (!name.trim()) return '';

    return name
        .split(' ')
        .filter(Boolean) // removes extra spaces
        .map((word) => word[0].toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');
}
// Filtering Logic
const taskFilters: FilterConfig[] = [
    { type: 'text', key: 'task_name', placeholder: 'Search Task Name' },
    { type: 'text', key: 'department_kpi.kpi_text', placeholder: 'Search KPI' },
    { type: 'text', key: 'key_result.key_result_text', placeholder: 'Search Key Result' },
    { type: 'text', key: 'departmental_session_goal.goal_text', placeholder: 'Search Session Goal' },
    {
        type: 'select',
        key: 'priority',
        options: [
            { value: 'low', label: 'Low' },
            { value: 'medium', label: 'Medium' },
            { value: 'high', label: 'High' },
        ],
    },
    { type: 'text', key: 'assigned_to', placeholder: 'Search Assignee' },
    // you can add more, e.g. date ranges or nested keys
];
const View_Tasks: React.FC = () => {
    const navigate = useNavigate();
    const [allTasks, setAllTasks] = useState<TaskType[]>([]);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [initialData, setInitialData] = useState<any | null>(null);
    const [openTaskPopupForm, setOpenTaskPopupForm] = useState<boolean>(false);
    const [selectedId, setSelectedId] = useState<number | null>(null);
    const [refresh, setRefresh] = useState<boolean>(false);
    const [openAssignTask, setOpenAssignTask] = useState<boolean>(false);
    const [openProgress, setOpenProgress] = useState(false);
    const [selectedTask, setSelectedTask] = useState<TaskType | null>(null);
    const { filtered: tasks, filterValues, setFilter } = useFilterRows(allTasks, taskFilters);

    // Fetching Tasks
    useEffect(() => {
        TaskServices.FetchTasks()
            .then((r) => {
                setAllTasks(r);
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
            accessor: 'Actions',
            title: 'Actions',
            render: (task) => (
                <div key={`Action-${task.id}`} className="sticky left-0">
                    <div className="flex items-start gap-2 ">
                        <button onClick={() => handleEdit(task)} className="flex items-center gap-2 btn btn-sm btn-outline-primary min-w-5">
                            <i className="bi bi-pencil-square"></i>
                        </button>
                        <button onClick={() => handleOpenStauspopup(task)} className="flex items-center gap-2 btn btn-sm btn-outline-primary min-w-5">
                            {/* <i className="bi bi-activity"></i>
                            <i className="bi bi-speedometer"></i> */}
                            <i className="bi bi-bar-chart"></i>
                            {/* <i className="bi bi-diagram-3"></i> */}
                        </button>
                        <button onClick={() => handleDeleteTask(task.id)} className="flex items-center gap-2 btn btn-sm btn-outline-danger min-w-5">
                            <i className="bi bi-trash"></i>
                        </button>
                    </div>
                </div>
            ),
        },
        {
            accessor: 'task_name',
            title: 'Task',
            render: (task) => {
                const color = task.priority === 'low' ? 'yellow' : task.priority === 'medium' ? 'green' : 'red';

                return (
                    <div key={`name-${task.id}`}>
                        <div className="mb-1 font-bold text-blue-900">{task.task_name}</div>
                        <div className="flex items-center gap-3 font-semibold text-[10px] text-gray-600 ">
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
            accessor: 'assignee',
            title: 'Assignee',
            render: (task) => (
                <div key={`date-${task.id}`}>
                    <div className="mt-1 flex gap-3 text-[12px]">
                        {task.assigned_to && task.profile ? <img className="size-8 rounded-full bg-cover" src={task.profile} alt="" /> : <IconUser />}
                        {task.assigned_to ? formatName(task.assigned_to) : 'Unassigned'}
                    </div>
                </div>
            ),
        },
        {
            accessor: 'due_date',
            title: 'Dates',
            render: (task) => (
                <div key={`date-${task.id}`}>
                    <div className="flex items-center gap-2 text-[10px]">
                        <span className="text-black font-semibold">Start Date</span>
                        <span className="text-gray-800 text-[10px]">{task.start_date?.split('T')[0]}</span>
                    </div>
                    <div className="flex items-center gap-2 text-[10px]">
                        <span className="text-black font-semibold">Due Date</span>
                        <span className="text-gray-800 text-[10px]">{task.start_date?.split('T')[0]}</span>
                    </div>
                </div>
            ),
        },
        {
            accessor: 'department_kpi',
            title: 'KPI',
            render: (task) => (
                <div key={`kpi-${task.id}`}>
                    <div className="mb-1 text-[12px] font-bold text-gray-900">
                        {task.department_kpi?.kpi_text?.length > 25 ? task?.department_kpi?.kpi_text?.slice(0, 25) + '...' : task.department_kpi?.kpi_text}
                    </div>
                    <div className="flex items-center gap-3 text-[10px] text-gray-600 ">
                        <span>
                            <span>Target: </span>
                            <span>{task.department_kpi?.target}</span>
                        </span>
                        <span>
                            <span>Weight: </span>
                            {task.department_kpi?.weight}
                        </span>
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
                TaskServices.DeleteTask(id)
                    .then(() => {
                        toast.success(`Task#${id} Deleted Successfully`, { duration: 4000 });
                        setRefresh((p) => !p);
                    })
                    .catch((e) => {
                        toast.error(e.message || `Error Deleting Task#${id}`);
                    });
            }
        });
    };
    const hanldeSubmitAssignTask = (data: any) => {
        console.log('Assign Task Data: ', data);
        TaskServices.AssignTasks(data)
            .then((r) => {
                console.log('assigned Response: ', r);
                toast.success(r.detail || 'Task Assigned Successfully', { duration: 4000 });
                setRefresh((p) => !p);
            })
            .catch((e) => {
                toast.error(e.message || 'Error Assigning Task');
            });
    };

    // Task Status logic
    const handleOpenStauspopup = (task: TaskType) => {
        setSelectedTask(task);
        setOpenProgress(true);
    };

    const handleUpdatedStauspopup = (updatedTask: TaskType) => {
        // update your local list or refetch
        setRefresh((p) => !p);
        setSelectedTask(null);
    };
    return (
        <div className="panel">
            <div className="mb-4 px-3 flex justify-between items-center">
                <h1 className="text-2xl font-semibold">Task List</h1>
                <div className="flex gap-2">
                    <button onClick={() => setOpenAssignTask(true)} className="flex items-center gap-1 btn btn-xl dark:btn-primary ">
                        <i className="bi bi-person" />
                        Assign Task
                    </button>
                    <button onClick={handleCreateTask} className="flex items-center gap-2 btn btn-xl btn-success">
                        <i className="bi bi-clipboard-plus" /> Create Task
                    </button>
                </div>
            </div>

            <FilterControls filters={taskFilters} values={filterValues} onChange={setFilter} />

            {/* Clear Filters */}
            <button
                onClick={() => {
                    // reset every filter by key
                    taskFilters.forEach((f: any) => setFilter(f.key, ''));
                }}
                className="btn btn-sm btn-outline-secondary mb-3"
            >
                Clear Filters
            </button>

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
            {openAssignTask && (
                <AssignTasksPopup
                    onSubmit={hanldeSubmitAssignTask}
                    onClose={() => {
                        setOpenAssignTask(false);
                    }}
                />
            )}
            {openProgress && selectedTask && (
                <ProgressUpdatePopup
                    taskId={selectedTask.id}
                    initialProgress={selectedTask.progress}
                    initialStatus={selectedTask.status}
                    onClose={() => setOpenProgress(false)}
                    onSuccess={handleUpdatedStauspopup}
                />
            )}

            <Toaster position="top-right" reverseOrder={false} />
        </div>
    );
};

export default View_Tasks;
