//  comman functions
export function formatDate(input: string): string {
    const d = new Date(input);
    // e.g. “28 Jul 2025, 7:00 PM”
    return d.toLocaleString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
    });
}
export function formatDateOnly(input: string): string {
    const d = new Date(input);
    // e.g. “28 Jul 2025, 7:00 PM”
    return d
        .toLocaleString('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
        })
        .replaceAll(' ', '/');
}
export function capitalizeName(name: string): string {
    if (!name) return '';

    return name
        .trim()
        .split(/\s+/) // split on any whitespace, collapse extra spaces
        .map((word) =>
            // split around '-' and '\'' but keep the separators so we can rejoin them
            word
                .split(/([-'])/)
                .map((part) =>
                    /[-']/.test(part)
                        ? part // keep separators as-is
                        : part.charAt(0).toUpperCase() + part.slice(1).toLowerCase()
                )
                .join('')
        )
        .join(' ');
}

export function getAbbrivation(name: string) {
    if (!name) return;
    return name
        .trim()
        .split(' ')
        .map((w) => w.charAt(0).toUpperCase())
        .join('');
}

export function captureDate(data: string) {
    return data.split('T')[0];
}

type Options = {
    locale?: string | string[];
    dateOptions?: Intl.DateTimeFormatOptions;
};
export function timeAgoOrDate(input: string | Date, opts: Options = {}): string {
    const { locale, dateOptions } = opts;
    const defaultDateOptions: Intl.DateTimeFormatOptions = {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    };

    const date = input instanceof Date ? input : new Date(input);
    if (Number.isNaN(date.getTime())) return String(input);

    const now = new Date();
    const deltaMs = now.getTime() - date.getTime();
    if (deltaMs < 0) {
        // future date — show formatted date
        return date.toLocaleDateString(locale, dateOptions ?? defaultDateOptions);
    }

    const seconds = Math.floor(deltaMs / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(seconds / 3600);
    const days = Math.floor(seconds / 86400);

    if (seconds < 60) return 'just now';
    if (minutes < 60) {
        return `${minutes} ${minutes === 1 ? 'minute' : 'minutes'} ago`;
    }
    if (hours < 24) {
        const remMinutes = Math.floor((seconds % 3600) / 60);
        if (remMinutes > 0) {
            return `${hours}h ${remMinutes} ${remMinutes === 1 ? 'minute' : 'minutes'} ago`;
        }
        return `${hours}h ago`;
    }
    if (days <= 3) {
        return `${days} ${days === 1 ? 'day' : 'days'} ago`;
    }

    // More than 3 days — return formatted date
    return date.toLocaleDateString(locale, dateOptions ?? defaultDateOptions);
}

export function CheckOwner() {
    const userInfoString = localStorage.getItem('UserInfo');
    if (userInfoString) {
        const userInfo = JSON.parse(userInfoString);
        if (userInfo) {
            return userInfo.is_owner;
        }
    }
    return false;
}

export function formatTime(input: string | null): string | null {
    if (!input) return null;
    const d = new Date(input);
    // e.g. “7:00 PM”
    return d.toLocaleString('en-GB', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
    });
}
type userInfo = {
    id: number;
    allUser_id: number;
    name: string;
    is_owner: boolean;
    email: string;
    profile_image: string | null;
};
export function getUser() {
    const raw = localStorage.getItem('UserInfo');
    if (!raw) return null;
    const user: userInfo = JSON.parse(raw);
    if (user) return user;
    return null;
}
