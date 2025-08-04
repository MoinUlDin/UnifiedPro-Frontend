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
