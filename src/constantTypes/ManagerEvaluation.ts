export interface Assignee {
    id: number;
    name?: string;
}

type Subject = {
    allusers_id: number;
    user_id?: number;
    name: string;
    email?: string;
    designation?: { id: number; name: string } | null;
    department?: { id: number; name: string } | null;
    profile_image?: string | null;
    employee_id?: string | null;
    status?: 'submitted' | 'pending';
    submitted_at?: string;
};
export interface Evaluatee {
    allusers_id: number;
    user_id?: number;
    name: string;
    email?: string;
    designation?: { id: number; name: string } | null;
    department?: { id: number; name: string } | null;
    profile_image?: string | null;
    employee_id?: string | null;
    status?: 'submitted' | 'pending';
    submitted_at?: string;
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

interface EmployeeManagerType {
    id: 13;
    template_version: 5;
    assigned_by: {
        id: 1;
        name: 'Jam Ali';
    };
    target_type: 'user';
    subjects: [8];
    respondents: [];
    target_department: null;
    start_date: '2025-10-01T00:00:00+05:00';
    end_date: '2025-10-31T00:00:00+05:00';
    anonymity: false;
    include_system_metrics: false;
    recurrence: null;
    period: 'one-off';
    created_at: '2025-10-07T19:46:10.222711+05:00';
    form_type: 'employee_manager';
    form_name: 'Employee manager';
}

export interface aggregatedemployee {
    assignment_id: number;
    template_version: number;
    template_name: 'Employee manager';
    manager_aggregate: {
        assignment_id: number;
        manager: {
            allusers_id: number;
            user_id: number;
            name: 'ETO No.1';
            email: 'ETO@gmail.com';
            designation: {
                id: number;
                name: 'ETO';
            };
            department: {
                id: number;
                name: 'IT';
            };
            profile_image: '/media/profile_images/fermin-rodriguez-penelas-b8kEUZqMNoQ-unsplash_WG1Lkx1.jpg';
            employee_id: null;
        };
        invited_count: number;
        responded_count: number;
        pending_count: number;
        average_score: null;
        per_question_average: {
            '13': {
                average_numeric: 0.8;
                count: 1;
            };
            '14': {
                average_numeric: 14;
                count: 1;
            };
            '15': {
                average_numeric: 0.3;
                count: 1;
            };
        };
    };
}

//  new
// types.ts

export interface boolTypeQuestion {
    question_id: '16';
    question_text: 'Is he resposible person?';
    qtype: 'bool';
    total_responses: 1;
    average_numeric: 10;
    counts: {
        yes: 1;
        no: 0;
    };
}
export interface ratingTypeQuestion {
    question_id: string;
    question_text: string;
    qtype: 'rating';
    total_responses: number;
    average_numeric: number;
    counts: {
        per_rating: Record<'0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10', number>;
        buckets: { low: number; mid: number; high: number };
        bucket_percent: { low: number; mid: number; high: number };
    };
}
export interface choiceTypeQuestion {
    question_id: string;
    question_text: string;
    qtype: 'choice';
    total_responses: number;
    average_numeric: number;
    counts: {
        options: Array<{
            key: string;
            label: string;
            score: number;
            count: number;
        }>;
        other: string[]; // other/free-text responses
    };
}
export interface textTypeQuestion {
    question_id: '19';
    question_text: 'How effectively he communicate ';
    qtype: 'text';
    total_responses: 1;
    average_numeric: number | null;
    counts: number | null;
}

export interface EmployeeManagerTypeAggregated {
    assignment_id: number;
    template_version: number;
    template_name: string;
    manager_aggregate: {
        assignment_id: number;
        manager: {
            allusers_id: number;
            user_id: number;
            name: string;
            email: string;
            designation: { id: number; name: string };
            department: { id: number; name: string };
            profile_image: string;
            employee_id: number | null;
        };
        invited_count: number;
        responded_count: number;
        pending_count: number;
        average_score: number;
        per_question_average: Array<ratingTypeQuestion | choiceTypeQuestion | boolTypeQuestion | textTypeQuestion>;
    };
}
