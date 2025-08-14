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
            clock_out_time: string | null;
            is_absent: false;
            is_late: true;
            on_time: false;
            is_present: true;
            is_holiday: false;
        },
        {
            id: 2;
            employee: {
                id: 4;
                name: 'Fahim Ahmed';
                department: 'Sales';
                designation: 'Salas Executive';
            };
            date: '2025-08-13';
            holiday_date: string | null;
            clock_in_time: '2025-08-13T20:13:42.646619';
            clock_out_time: string | null;
            is_absent: false;
            is_late: true;
            on_time: false;
            is_present: true;
            is_holiday: false;
        }
    ];
}
