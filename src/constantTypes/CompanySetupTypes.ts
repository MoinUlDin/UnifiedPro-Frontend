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
