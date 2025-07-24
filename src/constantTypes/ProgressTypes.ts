export interface TaskProgressType {
    total_tasks: number;
    status_counts: {
        Completed: number;
        In_Progress: number;
        Pending: number;
        OverDue: number;
    };
    completion_rate_percent: number;
    average_completion_time_seconds: number;
}
export interface KPIPerformanceType {
    total_task_weight: number;
    total_contribution_weight: number;
    kpi_performance_percent: number;
}
export interface KPIAnalyticsType {
    total_kpis: number;
    overdue: number;
    not_started: number;
    in_progress: number;
    completed: number;
}
