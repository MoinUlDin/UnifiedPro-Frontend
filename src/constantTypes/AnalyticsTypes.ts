export interface TaskAnalyticsType {
    all_time: {
        total: number;
        status_counts: {
            Completed: number;
            In_Progress: number;
            Pending: number;
            Overdue: number;
            Upcoming: number;
        };
        completion_rate: number;
        average_completion_seconds: number;
    };
    today: {
        total: number;
        status_counts: {
            In_Progress: number;
            Pending: number;
            Overdue: number;
            Upcoming: number;
        };
        completion_rate: number;
        average_completion_seconds: number;
    };
    this_week: {
        total: number;
        status_counts: {
            In_Progress: number;
            Pending: number;
            Overdue: number;
            Upcoming: number;
        };
        completion_rate: number;
        average_completion_seconds: number;
    };
    this_month: {
        total: number;
        status_counts: {
            Completed: number;
            In_Progress: number;
            Pending: number;
            Overdue: number;
            Upcoming: number;
        };
        completion_rate: number;
        average_completion_seconds: number;
    };
    this_year: {
        total: number;
        status_counts: {
            Completed: number;
            In_Progress: number;
            Pending: number;
            Overdue: number;
            Upcoming: number;
        };
        completion_rate: number;
        average_completion_seconds: number;
    };
}
