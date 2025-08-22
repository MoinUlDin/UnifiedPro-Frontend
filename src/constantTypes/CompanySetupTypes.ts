//  Company setup related types
export interface announcementType {
    id: number;
    company: number;
    department: null;
    title: string;
    priority: 'High';
    description: string;
    date: string;
    progress: number;
    is_active: true;
    created_by: {
        id: number;
        name: string;
    };
    total_targets: number;
    total_reads: number;
    unread_count?: number;
    target_info?: string;
    attachments: [
        {
            id: number;
            files: string;
            name: string | null;
            size: number | null;
        }
    ];
}

export interface DesignationFormType {
    id: number;
    name: string;
    department: number;
    department_name: string;
    parent: number | null;
    parent_name?: string;
}

export interface EmployeeWithDesignationType {
    id: Number;
    first_name: string;
    last_name: string;
    email: string;
    profile_image: string;
}
export interface ParentDesignationType {
    parent: {
        id: number;
        name: string;
        department: string;
        parent_id: number;
        employees: EmployeeWithDesignationType[];
    };
}
export interface DesignationType {
    id?: string;
    title: string;
    department?: string | null;
    department_id?: number | null;
    employees?: number;
    children?: DesignationType[];
    root?: boolean;
    parent?: number;
}
export interface DeptNode {
    id: number | string;
    title: string;
    parent: number | null;
    parent_name?: string | null;
    expected_arrival_time?: string | null;
    department?: string | null;
    department_id?: number | null;
    employees_count?: number;
    children?: DeptNode[];
    root?: boolean;
}
