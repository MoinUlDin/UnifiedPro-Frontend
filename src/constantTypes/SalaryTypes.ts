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
