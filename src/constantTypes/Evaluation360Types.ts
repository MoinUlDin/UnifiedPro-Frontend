//  360 type
export interface type360Target {
    allusers_id: number;
    user_id?: number;
    name: string;
    email?: string;
    designation?: { id: number; name: string } | null;
    department?: { id: number; name: string } | null;
    profile_image?: string;
    employee_id?: null;
}
export interface type360Evaluation {
    assignment_id: number;
    template_version: number;
    template_name: '360 form';
    form_type: '360';
    subject: type360Target;
    status: string;
    submitted_at: string | null;
    score: number | null;
}

export interface type360aggregatedsingle {
    assignment_id: 10;
    template_version: 3;
    template_name: '360 form';
    target: {
        assignment_id: 10;
        target_user: type360Target;
        invited_count: 11;
        responded_count: 2;
        pending_count: 9;
        average_score: 6.92;
        per_question_average: {
            '9': {
                average_numeric: 37.5;
                count: 2;
            };
            '11': {
                average_numeric: 7.5;
                count: 2;
            };
        };
    };
}
export interface type360Aggregated {
    results: [
        {
            assignment_id: 10;
            template_version: 3;
            template_name: '360 form';
            target: {
                assignment_id: 10;
                target_user: {
                    allusers_id: 9;
                    user_id: 9;
                    name: 'ETO No.1';
                    email: 'ETO@gmail.com';
                    designation: {
                        id: 2;
                        name: 'ETO';
                    };
                    department: {
                        id: 1;
                        name: 'IT';
                    };
                    profile_image: '/media/profile_images/fermin-rodriguez-penelas-b8kEUZqMNoQ-unsplash_WG1Lkx1.jpg';
                    employee_id: null;
                };
                invited_count: 11;
                responded_count: 2;
                pending_count: 9;
                average_score: 6.92;
                per_question_average: {
                    '9': {
                        average_numeric: 37.5;
                        count: 2;
                    };
                    '11': {
                        average_numeric: 7.5;
                        count: 2;
                    };
                };
            };
        },
        {
            assignment_id: 10;
            template_version: 3;
            template_name: '360 form';
            target: {
                assignment_id: 10;
                target_user: {
                    allusers_id: 2;
                    user_id: 2;
                    name: 'Moin Ul Din';
                    email: 'moinuldinc@gmail.com';
                    designation: {
                        id: 3;
                        name: 'Full Stack Dev';
                    };
                    department: {
                        id: 1;
                        name: 'IT';
                    };
                    profile_image: '/media/profile_images/Profile1_clF62b1.jpeg';
                    employee_id: null;
                };
                invited_count: 11;
                responded_count: 3;
                pending_count: 8;
                average_score: 8.973333333333334;
                per_question_average: {
                    '9': {
                        average_numeric: 43.333333333333336;
                        count: 3;
                    };
                    '11': {
                        average_numeric: 15;
                        count: 3;
                    };
                };
            };
        },
        {
            assignment_id: 10;
            template_version: 3;
            template_name: '360 form';
            target: {
                assignment_id: 10;
                target_user: {
                    allusers_id: 6;
                    user_id: 6;
                    name: 'Jameel Ahmed';
                    email: 'Jameel@gmail.com';
                    designation: {
                        id: 5;
                        name: 'Backend';
                    };
                    department: {
                        id: 1;
                        name: 'IT';
                    };
                    profile_image: '/media/profile_images/Category5.jpg';
                    employee_id: null;
                };
                invited_count: 11;
                responded_count: 2;
                pending_count: 9;
                average_score: 7.305000000000001;
                per_question_average: {
                    '9': {
                        average_numeric: 32.5;
                        count: 2;
                    };
                    '11': {
                        average_numeric: 15;
                        count: 2;
                    };
                };
            };
        }
    ];
}
