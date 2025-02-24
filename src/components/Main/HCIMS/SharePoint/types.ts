export interface Site {
    id: string;
    title: string;
    description: string;
    template: 'team' | 'communication';
    createdAt: Date;
    modifiedAt: Date;
    owner: string;
    members: string[];
    webParts: WebPart[];
    navigation: NavigationItem[];
    theme: Theme;
}

export interface NavigationItem {
    id: string;
    title: string;
    url: string;
    icon?: string;
    children?: NavigationItem[];
}

export interface Theme {
    primary: string;
    secondary: string;
    accent: string;
    isDark: boolean;
}

export interface WebPart {
    id: string;
    type: 'announcement' | 'form' | 'documentLibrary' | 'calendar' | 'list';
    title: string;
    description?: string;
    position: {
        x: number;
        y: number;
        width: number;
        height: number;
    };
    config: any;
}

export interface Announcement {
    id: string;
    title: string;
    content: string;
    priority: 'normal' | 'high' | 'urgent';
    createdAt: Date;
    modifiedAt: Date;
    author: string;
    attachments?: Attachment[];
    likes: number;
    comments: Comment[];
}

export interface Comment {
    id: string;
    content: string;
    author: string;
    createdAt: Date;
    replies?: Comment[];
}

export interface Attachment {
    id: string;
    name: string;
    type: string;
    size: number;
    url: string;
}

export interface Form {
    id: string;
    title: string;
    description: string;
    fields: FormField[];
    submissions: FormSubmission[];
    createdAt: Date;
    modifiedAt: Date;
    author: string;
}

export interface FormField {
    id: string;
    type: 'text' | 'number' | 'date' | 'select' | 'checkbox' | 'file';
    label: string;
    required: boolean;
    options?: string[];
    validation?: {
        pattern?: string;
        min?: number;
        max?: number;
        message?: string;
    };
}

export interface FormSubmission {
    id: string;
    formId: string;
    values: { [key: string]: any };
    submittedAt: Date;
    submittedBy: string;
    status: 'pending' | 'approved' | 'rejected';
}

export interface Document {
    id: string;
    name: string;
    type: string;
    size: number;
    path: string;
    createdAt: Date;
    modifiedAt: Date;
    author: string;
    version: string;
    checkoutBy?: string;
    permissions: Permission[];
    metadata: { [key: string]: any };
    versions: DocumentVersion[];
}

export interface DocumentVersion {
    id: string;
    version: string;
    modifiedAt: Date;
    modifiedBy: string;
    comment: string;
    size: number;
}

export interface Permission {
    userId: string;
    role: 'owner' | 'editor' | 'viewer';
    inherited: boolean;
}

export interface List {
    id: string;
    title: string;
    description: string;
    columns: ListColumn[];
    items: ListItem[];
    views: ListView[];
    permissions: Permission[];
}

export interface ListColumn {
    id: string;
    name: string;
    type: 'text' | 'number' | 'date' | 'choice' | 'user' | 'boolean';
    required: boolean;
    unique: boolean;
    options?: string[];
    defaultValue?: any;
}

export interface ListItem {
    id: string;
    values: { [key: string]: any };
    createdAt: Date;
    modifiedAt: Date;
    author: string;
    version: number;
}

export interface ListView {
    id: string;
    name: string;
    columns: string[];
    filter?: any;
    sort?: { column: string; direction: 'asc' | 'desc' }[];
    groupBy?: string;
}

export interface Calendar {
    id: string;
    events: CalendarEvent[];
    views: CalendarView[];
    permissions: Permission[];
}

export interface CalendarEvent {
    id: string;
    title: string;
    description: string;
    start: Date;
    end: Date;
    allDay: boolean;
    location?: string;
    attendees: string[];
    recurrence?: RecurrenceRule;
    category?: string;
    color?: string;
}

export interface CalendarView {
    id: string;
    name: string;
    type: 'month' | 'week' | 'day' | 'agenda';
    filter?: any;
}

export interface RecurrenceRule {
    frequency: 'daily' | 'weekly' | 'monthly' | 'yearly';
    interval: number;
    endDate?: Date;
    endAfter?: number;
    daysOfWeek?: number[];
    dayOfMonth?: number;
    monthOfYear?: number;
}
