export interface Assignee {
    id: number;
    name?: string;
}

export interface Evaluatee {
    allusers_id: number;
    user_id: number;
    name: string;
    email?: string;
    designation?: { id: number; name: string } | null;
    department?: { id: number; name: string } | null;
    profile_image?: string | null;
    employee_id?: string | null;
    status: 'submitted' | 'pending';
    submitted_at: string;
}

export interface Assignment {
    id: number;
    template_version: number;
    assigned_by: Assignee | null;
    target_type: string;
    to_evaluate?: Evaluatee[];
    subjects?: any[];
    respondents?: any[];
    target_department: number | null;
    start_date: string | null;
    end_date: string | null;
    anonymity: boolean;
    include_system_metrics: boolean;
    recurrence: string | null;
    period: string | null;
    created_at: string;
    form_type: string;
    form_name: string;
    total_assignees: number;
    complete_count: number;
    completed_percentage: number;
    submitted: boolean;
    avg_score?: number;
}
export interface questionTypeBasic {
    question_id: string;
    qtype: string;
    question_text: string;
    respondent_answer: string;
    raw_value: string | number | string[];
    weight: number;
    achieved: number;
    percent_of_weight: number;
}

export interface userTypeBasic {
    id: number;
    name: string;
    email: string;
}
export interface ManagerSubmittedType {
    id: number;
    assignment: {
        id: number;
        template_name: string;
        template_form_type: string;
    };
    respondent: userTypeBasic;
    target_user: userTypeBasic;
    status: string;
    submitted_at: string;
    computed_score: number;
    computed_breakdown: {
        per_question: questionTypeBasic[];
        total_achieved: number;
        total_weight: number;
    };
    comment_count: number;
}
