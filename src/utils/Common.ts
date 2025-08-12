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
