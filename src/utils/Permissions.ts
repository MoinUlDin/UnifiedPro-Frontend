// Helper to check if user has required permissions
export const hasPermission = (requiredPermissions: string[] | undefined): boolean => {
    // Allow access if no permissions are required
    if (!requiredPermissions || requiredPermissions.length === 0) return true;

    try {
        const userPermissions = JSON.parse(localStorage.getItem('UserPerms') || '[]');

        return requiredPermissions.every((perm) => {
            const [code, action] = perm.split('.');
            const permission = userPermissions.find((p: any) => p.code === code);
            return permission?.[action];
        });
    } catch (e) {
        console.error('Permission check error', e);
        return false;
    }
};

// Convert permission objects to simple keys
export const getPermissionKeys = (permissions: any[]): string[] => {
    return permissions.flatMap((p) => {
        const keys: string[] = [];
        if (p.can_create) keys.push(`${p.code}.can_create`);
        if (p.can_read) keys.push(`${p.code}.can_read`);
        if (p.can_update) keys.push(`${p.code}.can_update`);
        if (p.can_delete) keys.push(`${p.code}.can_delete`);
        return keys;
    });
};
