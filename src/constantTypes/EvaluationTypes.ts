// constantTypes/EvaluationTypes.ts

export interface FormChoiceTypes {
    key: string;
    label: string;
}
export interface CommonChoiceType {
    key: string;
    label: string;
}
export interface FromBuilderChoiceType {
    form_types: CommonChoiceType[];
    question_types: CommonChoiceType[];
    assign_target_types: CommonChoiceType[];
    period_choices: CommonChoiceType[];
    qtype_meta: {
        bool: {
            input: 'select';
            options: [
                {
                    key: true;
                    label: 'Yes/True';
                },
                {
                    key: false;
                    label: 'No/False';
                }
            ];
            note: 'Stored as boolean or mapped values (true/false).';
        };
        rating: {
            input: 'range';
            min: 0;
            max: 10;
            step: 1;
            note: "Rating scale 0..10 by default. Use 'meta' in question to override.";
        };
        choice: {
            input: 'multi_or_single_select';
            note: 'Provide `meta.choices` (list of {key,label}) when creating a question.';
        };
        text: {
            input: 'textarea';
            note: 'Free text; respect `required` flag on questions.';
        };
    };
    visibility_options: CommonChoiceType[];
}

//  ====================================================================
//  ========================== List Templates ==========================
//  ====================================================================
export interface ListQuestionType {
    id: number;
    text: string;
    qtype: string;
    weight: number;
    required: boolean;
    meta: {
        choices: [
            {
                key: string;
                label: string;
                score: number;
            }
        ];
    };
}
export interface ListTemplatesType {
    id: number;
    name: string;
    description: string;
    created_by: {
        id: number;
        name: string;
    };
    created_at: string;
    form_type: string;
    default_visibility: {
        show_to_employee: boolean;
        show_to_manager: boolean;
        show_to_top_authorities: boolean;
    };
    reusable: boolean;
    questions: ListQuestionType[];
}

export type EmployeeItem = {
    user_id: number | null;
    allusers_id: number;
    full_name: string;
    email?: string;
    department_id?: number | null;
};

export type DepartmentGroup = {
    department_id: number | null;
    department_name: string;
    employee_count: number;
    employees: EmployeeItem[];
};

export type AssignmentOptionsResponse =
    | {
          mode: 'grouped_by_department';
          total_employees: number;
          departments: DepartmentGroup[];
      }
    | {
          mode: string;
          [k: string]: any;
      };

export type AssignmentPayload = {
    template_version: number | string; // id of version
    target_type: 'user' | 'department' | 'company';
    target_users?: number[]; // user_id array (respondents)
    subjects?: number[];
    target_department?: number | null;
    start_date: string; // ISO date YYYY-MM-DD
    end_date?: string | null; // ISO date
    period: 'one-off' | 'monthly' | 'weekly' | 'quarterly' | 'yearly';
    anonymity: boolean;
    include_system_metrics: boolean;
    // Additional helper fields (frontend-only)
    title?: string;
};

export type Props = {
    versionId: number | string;
    open: boolean;
    qCount: number;
    initial?: Partial<AssignmentPayload> | null;
    onClose: () => void;
    onSubmit: (payload: AssignmentPayload) => Promise<any> | void;
    formType?: 'self' | 'manager' | '360' | 'employee_manager';
};
