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
