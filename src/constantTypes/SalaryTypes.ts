// Salary
export interface jobType {
    id: number;
    name: string;
    description: string;
    created_at: string;
}

export interface PayGradeType {
    id: number;
    name: string;
    description: null;
    minimum_salary: number;
    maximum_salary: number;
    created_at: string;
    range: string;
}
export interface SalaryComponentType {
    id: number;
    name: string;
    current: number;
    pay_grade: number;
    category: string;
    minimum_salary: number;
    maximum_salary: number;
    pay_grade_name: string;
    created_at: string;
    range: string;
}
export interface PayFrequencyType {
    id: number;
    name: string;
    period_day: string;
    created_at: string;
    company: number;
}
export interface DeductionType {
    id: number;
    name: string;
    percentage: string;
    company: number;
    created_at: string;
    type: string;
}
export interface BasicProfileType {
    id: number;
    employee: {
        id: number;
        name: string;
    };
    department: {
        id: number;
        name: string;
    };
    job_type: {
        id: number;
        name: string;
    };
    pay_start_date: string;
}

export interface SalaryStructureType {
    id: number;
    basic_profile: {
        id: number;
        name: string;
    };
    salary_component: {
        id: number;
        name: string;
    };
    pay_frequency: {
        id: number;
        name: string;
    };
    pay_grade: {
        id: number;
        name: string;
        minimum_salary: number;
        maximum_salary: number;
    };
    pay_amount: number;
}

export interface AllComponents {
    paygrades: PayGradeType[];
    components: SalaryComponentType[];
    pay_frequency: PayFrequencyType[];
    deductions: DeductionType[];
    currency: string;
}
