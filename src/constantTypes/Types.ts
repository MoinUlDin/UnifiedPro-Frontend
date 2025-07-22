export interface DepartmentGoalType {
    id: number;
    company_goal: { id: number; text: string };
    department: { id: number; name: string };
    goal_text: string;
    target: number;
    weight: number;
    start_date: string;
    due_date: string;
    combined: null;
}

export interface SessionalGoalType {
    id: number;
    department: { id: number; name: string };
    department_goals: { id: number; name: string };
    goal_text: string;
    target: number;
    weight: number;
    session: string;
    session_display: string;
}
export interface KPIType {
    id: number;
    key_result: {
        id: number;
        text: string;
    };
    kpi_text: string;
    target: number;
    start_date?: string | null;
    due_date?: string | null;
    weight: number;
    achieved?: number | null;
    sessional_goal: {
        id: number;
        text: string;
        session: string;
    };
    department_goal: {
        id: number;
        text: string;
    };
    department: {
        id: number;
        name: string;
    };
}

export interface KeyResultType {
    id: number;
    departmental_session_goal: { id: number; name: string };
    department_goal: { id: number; goal_text: string };
    key_results_text: string;
    target: number;
    weight: number;
    achieved: string;
}
export interface AllGoalsType {
    company_goals: number; // fix this later
    department_goals: DepartmentGoalType[];
    session_goals: SessionalGoalType[];
    key_results: KeyResultType[];
    kpis: KPIType[]; // fix this later
}
export interface InputData {
    id?: number;
    goal_text: string;
    weight: number;
}
export interface Props {
    closeModel: () => void;
    onSubmit: (data: InputData | any) => void;
    initialData?: InputData | DepartmentGoalType | null;
    isEditing: boolean;
}

export interface EmployeeType {
    id: number;
    first_name: string;
    last_name: string;
    designation: { id: number; name: string };
    profile_image: string | null; // URL or null
    department: { id: number; name: string };
    parent: { id: number; name: string } | null; // manager or null
    is_terminated: boolean;
    hire_date: string; // ISO date string
    employee_id: string | null; // e.g. staff code, or null
}
