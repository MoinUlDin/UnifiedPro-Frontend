export interface notificationsObjectType {
    id: number;
    company: number;
    user: number | null;
    department: number | null;
    target_type: 'user' | 'deparment' | 'company-wide';
    title: string;
    message: string;
    created_at: string;
    is_read: false;
}

export interface notificationsType {
    unread_count: number;
    results: notificationsObjectType[];
}
