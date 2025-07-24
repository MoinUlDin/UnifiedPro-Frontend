export interface TaskCoWorkerType {
    id: number;
    full_name: string;
    email: string;
}

export interface TaskDepartmentKPIType {
    id: number;
    kpi_text: string;
    target: number;
    weight: number;
}

export interface TaskKeyResultType {
    id: number;
    key_result_text: string;
    target: number;
    weight: number;
}

export interface TaskDepartmentalSessionGoalType {
    id: number;
    goal_text: string;
    target: number;
    weight: number;
}

export interface TaskDepartmentGoalType {
    id: number;
    goal_text: string;
    target: number;
    weight: number;
}

export interface TaskCompanyGoalType {
    id: number;
    goal_text: string;
    weight: number;
}

export type TaskFrequencyType = 'at_once' | 'daily' | 'weekly' | 'monthly' | null;
export type TaskPriorityType = 'low' | 'medium' | 'high';
export type TaskStatusType = 'Pending' | 'In_Progress' | 'On_Hold' | 'Completed' | 'Not_Completed' | 'Running' | 'Paused' | 'Stopped';
export interface TaskType {
    id: number;
    task_name: string;
    assigned_to: string;
    frequency: TaskFrequencyType;
    instructions: string;
    start_date: string | null; // ISO datetime or null
    due_date: string | null; // ISO datetime or null
    task_file: string | null; // URL or null
    employee: number | null; // user ID or null
    priority: TaskPriorityType;
    co_worker: TaskCoWorkerType[]; // empty array when none
    department_kpi: TaskDepartmentKPIType;
    weight: number;
    status: TaskStatusType;
    progress: number;
    department_id: number;
    department_name: string;
    key_result: TaskKeyResultType;
    departmental_session_goal: TaskDepartmentalSessionGoalType;
    department_goal: TaskDepartmentGoalType;
    company_goal: TaskCompanyGoalType;
}
