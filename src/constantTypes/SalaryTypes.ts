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
export interface OverviewType {
    basic_profile_id: 1;
    employee_name: 'Moin Ul Din';
    department: string;
    job_type: 'Salary Based';
    pay_frequency: 'monthly';
    pay_grade: 'PS-12';
    gross_salary: '34000.00';
    total_deductions: '1700.00';
    net_salary: '32300.00';
    pay_start_date: '2025-08-12';
}

export interface LeaveTypes {
    id: 1;
    department: {
        id: 1;
        name: 'IT';
    };
    name: 'Annual Leave';
    annual_allowance: 14;
    from_date: '2025-08-02';
    to_date: '2025-08-30';
}

export interface ExpenseClaimListType {
    id: 5;
    claim_date: '2025-08-18T14:21:42.528444+05:00';
    description: 'somthing nothing 22';
    amount: 8000;
    file: null;
    is_approved: true;
    rejected: false;
    rejection_reason: null;
    approval_reason: 'Nothing';
    company: 1;
    employee: {
        id: 3;
        name: 'Waqs Qadir';
        designation: 'Frontend';
    };
    department: null;
    designation: null;
}

// Salary Slip Type

export type Period = {
    from: string;
    to: string;
    days_in_range?: number;
};
export type ComponentItem = {
    component: string;
    amount: number;
};

export type Breakdown = {
    basic_profile_id?: number;
    employee_id?: number;
    employee_name?: string;
    period: Period;
    required_work_days_count?: number;
    hours_per_day?: number;
    required_work_hours?: number;
    worked_hours?: number;
    variance_hours?: number;
    absent_days?: number;
    components: ComponentItem[];
    total_earnings?: number;
    total_percentage_deductions?: number;
    gross_salary?: number;
    basic_component_amount?: number | null;
    per_day_income?: number;
    work_bonus?: number;
    work_deduction?: number;
    expense_claims_total?: number;
    net_payable?: number;
    manual_bonus?: number;
    bonus_total?: number;
};

export type SalarySlipDetailType = {
    id: number;
    company?: number;
    basic_profile?: number;
    From_date?: string;
    To_date?: string;
    remarks?: string;
    bonus?: string | number;
    manual_bonus?: string | number;
    work_bonus?: string | number;
    deduction?: string | number;
    total_amount?: string | number;
    breakdown: Breakdown;
    status?: string;
    locked?: boolean;
    created_at?: string;
    updated_at?: string;
};
