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
