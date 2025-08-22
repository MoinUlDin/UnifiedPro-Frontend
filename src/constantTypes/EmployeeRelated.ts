// types
export interface AttendenceOverviewType {
    date: '2025-08-13';
    total_employees: 5;
    employees_with_records: 2;
    present_count: 2;
    absent_marked_count: 0;
    no_record_count: 3;
    total_absent: 3;
    on_time_count: 0;
    late_count: 2;
    present_percentage: 40.0;
    attendance_rows: [
        {
            id: 1;
            employee: {
                id: 3;
                name: 'Waqs Qadir';
                department: 'IT';
                designation: 'Frontend';
            };
            date: '2025-08-13';
            holiday_date: string | null;
            clock_in_time: '2025-08-13T19:51:31.358431';
            profile_image: string;
            clock_out_time: string | null;
            is_absent: false;
            is_late: true;
            on_time: false;
            is_present: true;
            is_holiday: false;
        }
    ];
}

export interface LeaveRequestOwnerType {
    id: 1;
    employee: {
        id: 3;
        name: 'Waqs Qadir';
        department: 'IT';
        designation: 'Frontend';
        email: 'waqas@gmail.com';
    };
    leave_type: 1;
    start_date: '2025-08-18';
    profile_image: 'http://127.0.0.1:8000/media/profile_images/Untitled_1.png';
    end_date: '2025-08-18';
    is_approved: false;
    rejected: false;
    reason: null;
    description: null;
    duration: '0:00:14';
    created_at: '2025-08-15T18:09:13.897455+05:00';
}

export interface MarkedHolidaysType {
    id: number;
    company: number;
    date: string;
    holiday_type: string;
    remarks: string;
    created_by: {
        id: number;
        first_name: string;
        last_name: string;
    };
    created_at: string;
    updated_at: string;
}
