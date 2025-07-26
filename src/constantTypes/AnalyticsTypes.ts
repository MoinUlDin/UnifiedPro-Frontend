export interface TaskAnalyticsType {
    total_tasks: number;
    status_counts: {
        Completed: number;
        Pending: number;
        OverDue: number;
        Upcoming: number;
    };
    completion_rate_percent: number;
    average_completion_time_seconds: number;
}
