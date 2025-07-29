import { useEffect, useState } from 'react';
import { Card, Button, Badge, Switch, TextInput, Select, Tabs, Avatar, Group, Text, Stack, Grid, Container, Paper, ActionIcon, Flex, Title, Divider } from '@mantine/core';
import {
    BiShield,
    BiSearch,
    BiFilter,
    BiPlus,
    BiEdit,
    BiTrash,
    BiGroup,
    BiCopy,
    BiRefresh,
    BiHome,
    BiTask,
    BiCog,
    BiBuilding,
    BiBriefcase,
    BiUser,
    BiUserX,
    BiBarChart,
    BiTrendingUp,
    BiSend,
    BiCalendar,
    BiTime,
    BiSun,
    BiError,
    BiDollar,
    BiReceipt,
    BiChart,
    BiBook,
    BiHelpCircle,
    BiTrophy,
    BiCheck,
    BiX,
} from 'react-icons/bi';
import { BiTargetLock } from 'react-icons/bi';
import { BsMegaphone } from 'react-icons/bs';
import { FiActivity, FiEye } from 'react-icons/fi';
import { FaFileAlt } from 'react-icons/fa';
import CompanySetupServices from '../../../services/CompanySetupServices';

// Mock data - same as before but simplified for standalone use
const PERMISSION_TYPES = [
    'Dashboard',
    'Task',
    'Branch',
    'Department',
    'Designation',
    'Employee',
    'Terminated Employee',
    'Employee Details',
    'KPI',
    'Report KPI',
    'Leave',
    'Leave Request',
    'Attendance',
    'managerialAttendance',
    'Working Day',
    'Holiday',
    'Late Arrive',
    'Early Leave',
    'Salary',
    'Salary Slip',
    'Performance',
    'WhistleBlow',
    'Evaluations',
    'Contest',
    'Policy',
    'Announcement',
    'Report',
    'Expense Claim',
    'Company Info',
    'Training',
    'Permissions',
    'Configuration',
    'Quiz',
    'Late Arrival',
    'Performance Matrics',
    'Submit Evaluations',
];

interface UserGroup {
    id: string;
    name: string;
    description: string;
    memberCount: number;
    color: string;
    isSystem: boolean;
}

interface Permission {
    id: string;
    name: string;
    category: string;
    description: string;
    icon: string;
    riskLevel: 'low' | 'medium' | 'high';
}

interface GroupPermission {
    id: string;
    groupId: string;
    permissionName: string;
    canCreate: boolean;
    canRead: boolean;
    canUpdate: boolean;
    canDelete: boolean;
}

const mockUserGroups: UserGroup[] = [
    {
        id: 'group1',
        name: 'Super Admin',
        description: 'Full system access with all permissions',
        memberCount: 2,
        color: '#ef4444',
        isSystem: true,
    },
    {
        id: 'group2',
        name: 'HR Manager',
        description: 'Human resources management with employee-related permissions',
        memberCount: 3,
        color: '#3b82f6',
        isSystem: false,
    },
    {
        id: 'group3',
        name: 'Department Manager',
        description: 'Department-level management permissions',
        memberCount: 8,
        color: '#10b981',
        isSystem: false,
    },
    {
        id: 'group4',
        name: 'Team Lead',
        description: 'Team leadership with limited management permissions',
        memberCount: 15,
        color: '#f59e0b',
        isSystem: false,
    },
    {
        id: 'group5',
        name: 'Employee',
        description: 'Standard employee permissions for daily tasks',
        memberCount: 156,
        color: '#6b7280',
        isSystem: false,
    },
    {
        id: 'group6',
        name: 'Finance Team',
        description: 'Financial operations and reporting permissions',
        memberCount: 6,
        color: '#8b5cf6',
        isSystem: false,
    },
];

const mockPermissions: Permission[] = [
    // Core System
    { id: 'p1', name: 'Dashboard', category: 'Core System', description: 'Access to main dashboard', icon: 'BiHome', riskLevel: 'low' },
    { id: 'p2', name: 'Task', category: 'Core System', description: 'Task management and tracking', icon: 'BiTask', riskLevel: 'low' },
    { id: 'p3', name: 'Configuration', category: 'Core System', description: 'System configuration settings', icon: 'BiCog', riskLevel: 'high' },
    { id: 'p4', name: 'Permissions', category: 'Core System', description: 'User permissions management', icon: 'BiShield', riskLevel: 'high' },

    // Organization
    { id: 'p5', name: 'Branch', category: 'Organization', description: 'Branch management', icon: 'BiBuilding', riskLevel: 'medium' },
    { id: 'p6', name: 'Department', category: 'Organization', description: 'Department management', icon: 'BiGroup', riskLevel: 'medium' },
    { id: 'p7', name: 'Designation', category: 'Organization', description: 'Job designation management', icon: 'BiBriefcase', riskLevel: 'medium' },
    { id: 'p8', name: 'Company Info', category: 'Organization', description: 'Company information management', icon: 'BiBuilding', riskLevel: 'high' },

    // Employee Management
    { id: 'p9', name: 'Employee', category: 'Employee Management', description: 'Employee records management', icon: 'BiUser', riskLevel: 'high' },
    { id: 'p10', name: 'Terminated Employee', category: 'Employee Management', description: 'Terminated employee records', icon: 'BiUserX', riskLevel: 'high' },
    { id: 'p11', name: 'Employee Details', category: 'Employee Management', description: 'Detailed employee information', icon: 'FaFileAlt', riskLevel: 'medium' },

    // Performance & KPIs
    { id: 'p12', name: 'KPI', category: 'Performance', description: 'Key performance indicators', icon: 'BiBarChart', riskLevel: 'medium' },
    { id: 'p13', name: 'Report KPI', category: 'Performance', description: 'KPI reporting and analytics', icon: 'BiTrendingUp', riskLevel: 'low' },
    { id: 'p14', name: 'Performance', category: 'Performance', description: 'Performance management', icon: 'BiTargetLock', riskLevel: 'medium' },
    { id: 'p15', name: 'Performance Matrics', category: 'Performance', description: 'Performance metrics analysis', icon: 'FiActivity', riskLevel: 'low' },
    { id: 'p16', name: 'Evaluations', category: 'Performance', description: 'Employee evaluations', icon: 'BiClipboard', riskLevel: 'medium' },
    { id: 'p17', name: 'Submit Evaluations', category: 'Performance', description: 'Submit performance evaluations', icon: 'BiSend', riskLevel: 'low' },

    // Leave & Attendance
    { id: 'p18', name: 'Leave', category: 'Leave & Attendance', description: 'Leave management', icon: 'BiCalendar', riskLevel: 'low' },
    { id: 'p19', name: 'Leave Request', category: 'Leave & Attendance', description: 'Leave request processing', icon: 'BiCalendar', riskLevel: 'medium' },
    { id: 'p20', name: 'Attendance', category: 'Leave & Attendance', description: 'Attendance tracking', icon: 'BiTime', riskLevel: 'low' },
    { id: 'p21', name: 'managerialAttendance', category: 'Leave & Attendance', description: 'Managerial attendance oversight', icon: 'FiEye', riskLevel: 'medium' },
    { id: 'p22', name: 'Working Day', category: 'Leave & Attendance', description: 'Working day configuration', icon: 'BiCalendar', riskLevel: 'medium' },
    { id: 'p23', name: 'Holiday', category: 'Leave & Attendance', description: 'Holiday management', icon: 'BiSun', riskLevel: 'low' },
    { id: 'p24', name: 'Late Arrive', category: 'Leave & Attendance', description: 'Late arrival tracking', icon: 'BiTime', riskLevel: 'low' },
    { id: 'p25', name: 'Late Arrival', category: 'Leave & Attendance', description: 'Late arrival management', icon: 'BiError', riskLevel: 'low' },
    { id: 'p26', name: 'Early Leave', category: 'Leave & Attendance', description: 'Early leave tracking', icon: 'BiTime', riskLevel: 'low' },

    // Finance
    { id: 'p27', name: 'Salary', category: 'Finance', description: 'Salary management', icon: 'BiDollar', riskLevel: 'high' },
    { id: 'p28', name: 'Salary Slip', category: 'Finance', description: 'Salary slip generation', icon: 'FaFileAlt', riskLevel: 'medium' },
    { id: 'p29', name: 'Expense Claim', category: 'Finance', description: 'Expense claim processing', icon: 'BiReceipt', riskLevel: 'medium' },

    // Communication
    { id: 'p30', name: 'WhistleBlow', category: 'Communication', description: 'Whistleblower reports', icon: 'BiError', riskLevel: 'high' },
    { id: 'p31', name: 'Policy', category: 'Communication', description: 'Policy management', icon: 'FaFileAlt', riskLevel: 'medium' },
    { id: 'p32', name: 'Announcement', category: 'Communication', description: 'Company announcements', icon: 'BsMegaphone', riskLevel: 'low' },
    { id: 'p33', name: 'Report', category: 'Communication', description: 'Report generation', icon: 'BiChart', riskLevel: 'low' },

    // Learning & Development
    { id: 'p34', name: 'Training', category: 'Learning & Development', description: 'Training programs', icon: 'BiBook', riskLevel: 'low' },
    { id: 'p35', name: 'Quiz', category: 'Learning & Development', description: 'Quiz and assessments', icon: 'BiHelpCircle', riskLevel: 'low' },
    { id: 'p36', name: 'Contest', category: 'Learning & Development', description: 'Employee contests', icon: 'BiTrophy', riskLevel: 'low' },
];

// Icon mapping for permissions
const iconMap = {
    BiHome,
    BiTask,
    BiCog,
    BiShield,
    BiBuilding,
    BiGroup,
    BiBriefcase,
    BiUser,
    BiUserX,
    FaFileAlt,
    BiBarChart,
    BiTrendingUp,
    BiTargetLock,
    FiActivity,
    BiSend,
    BiCalendar,
    BiTime,
    FiEye,
    BiSun,
    BiError,
    BiDollar,
    BiReceipt,
    BsMegaphone,
    BiChart,
    BiBook,
    BiHelpCircle,
    BiTrophy,
};

// Sample permissions data
const mockGroupPermissions: GroupPermission[] = [
    // Super Admin - Full permissions
    ...mockPermissions.map((p) => ({
        id: `gp_${p.id}_group1`,
        groupId: 'group1',
        permissionName: p.name,
        canCreate: true,
        canRead: true,
        canUpdate: true,
        canDelete: true,
    })),

    // HR Manager - HR focused permissions
    { id: 'gp_p1_group2', groupId: 'group2', permissionName: 'Dashboard', canCreate: false, canRead: true, canUpdate: false, canDelete: false },
    { id: 'gp_p9_group2', groupId: 'group2', permissionName: 'Employee', canCreate: true, canRead: true, canUpdate: true, canDelete: false },
    { id: 'gp_p18_group2', groupId: 'group2', permissionName: 'Leave', canCreate: true, canRead: true, canUpdate: true, canDelete: false },
    { id: 'gp_p27_group2', groupId: 'group2', permissionName: 'Salary', canCreate: true, canRead: true, canUpdate: true, canDelete: false },

    // Employee - Basic permissions
    { id: 'gp_p1_group5', groupId: 'group5', permissionName: 'Dashboard', canCreate: false, canRead: true, canUpdate: false, canDelete: false },
    { id: 'gp_p2_group5', groupId: 'group5', permissionName: 'Task', canCreate: false, canRead: true, canUpdate: false, canDelete: false },
    { id: 'gp_p18_group5', groupId: 'group5', permissionName: 'Leave', canCreate: true, canRead: true, canUpdate: false, canDelete: false },
];

export default function StandalonePermissionsPage() {
    const [selectedGroup, setSelectedGroup] = useState<string>('group2');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [permissions, setPermissions] = useState<GroupPermission[]>(mockGroupPermissions);
    const [showBulkActions, setShowBulkActions] = useState(false);

    // Get unique categories
    const categories = Array.from(new Set(mockPermissions.map((p) => p.category)));

    // Filter permissions based on search and category
    const filteredPermissions = mockPermissions.filter((permission) => {
        const matchesSearch = permission.name.toLowerCase().includes(searchTerm.toLowerCase()) || permission.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === 'all' || permission.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    // Group permissions by category
    const groupedPermissions = categories.reduce((acc, category) => {
        acc[category] = filteredPermissions.filter((p) => p.category === category);
        return acc;
    }, {} as Record<string, Permission[]>);

    // Get permission for specific group and permission name
    const getGroupPermission = (groupId: string, permissionName: string) => {
        return permissions.find((p) => p.groupId === groupId && p.permissionName === permissionName);
    };

    // Update permission
    const updatePermission = (groupId: string, permissionName: string, field: keyof Pick<GroupPermission, 'canCreate' | 'canRead' | 'canUpdate' | 'canDelete'>, value: boolean) => {
        setPermissions((prev) => {
            const existing = prev.find((p) => p.groupId === groupId && p.permissionName === permissionName);
            if (existing) {
                return prev.map((p) => (p.groupId === groupId && p.permissionName === permissionName ? { ...p, [field]: value } : p));
            } else {
                // Create new permission
                const newPermission: GroupPermission = {
                    id: `gp_${permissionName}_${groupId}_${Date.now()}`,
                    groupId,
                    permissionName,
                    canCreate: field === 'canCreate' ? value : false,
                    canRead: field === 'canRead' ? value : false,
                    canUpdate: field === 'canUpdate' ? value : false,
                    canDelete: field === 'canDelete' ? value : false,
                };
                return [...prev, newPermission];
            }
        });
    };

    // Get risk level color
    const getRiskLevelColor = (riskLevel: string) => {
        switch (riskLevel) {
            case 'high':
                return 'red';
            case 'medium':
                return 'yellow';
            case 'low':
                return 'green';
            default:
                return 'gray';
        }
    };

    // Calculate permission stats for a group
    const getGroupStats = (groupId: string) => {
        const groupPermissions = permissions.filter((p) => p.groupId === groupId);
        const totalPermissions = mockPermissions.length;
        const grantedPermissions = groupPermissions.length;
        const fullAccess = groupPermissions.filter((p) => p.canCreate && p.canRead && p.canUpdate && p.canDelete).length;
        const readOnly = groupPermissions.filter((p) => !p.canCreate && p.canRead && !p.canUpdate && !p.canDelete).length;

        return {
            total: totalPermissions,
            granted: grantedPermissions,
            fullAccess,
            readOnly,
            percentage: Math.round((grantedPermissions / totalPermissions) * 100),
        };
    };

    return (
        <Container size="xl" className="py-6">
            <Stack spacing="xl">
                {/* Header */}
                <Group position="apart">
                    <div>
                        <Title order={1}>Permissions Management</Title>
                        <Text color="dimmed">Manage user group permissions and access control across the system</Text>
                    </div>
                    <Group>
                        <Button variant="light" leftIcon={<BiFilter />} onClick={() => setShowBulkActions(!showBulkActions)}>
                            Bulk Actions
                        </Button>
                        <Button leftIcon={<BiPlus />}>Add Group</Button>
                    </Group>
                </Group>

                {/* Search and Filter */}
                <Group>
                    <TextInput placeholder="Search permissions..." value={searchTerm} onChange={(e) => setSearchTerm(e.currentTarget.value)} icon={<BiSearch />} style={{ flex: 1 }} />
                    <Select
                        placeholder="Filter by category"
                        value={selectedCategory}
                        onChange={(value) => setSelectedCategory(value || 'all')}
                        data={[{ value: 'all', label: 'All Categories' }, ...categories.map((category) => ({ value: category, label: category }))]}
                        style={{ minWidth: 200 }}
                    />
                </Group>

                {/* Bulk Actions Panel */}
                {showBulkActions && (
                    <Paper p="md" withBorder style={{ borderStyle: 'dashed' }}>
                        <Title order={4} mb="md">
                            <Group spacing="xs">
                                <BiFilter />
                                Bulk Actions
                            </Group>
                        </Title>
                        <Group>
                            <Select placeholder="Copy from group" data={mockUserGroups.map((group) => ({ value: group.id, label: group.name }))} style={{ minWidth: 200 }} />
                            <Button variant="light" leftIcon={<BiCopy />}>
                                Copy Permissions
                            </Button>
                            <Button variant="light" leftIcon={<BiRefresh />}>
                                Reset All
                            </Button>
                        </Group>
                    </Paper>
                )}

                <Tabs defaultValue="groups">
                    <Tabs.List>
                        <Tabs.Tab value="groups">Groups & Permissions</Tabs.Tab>
                        <Tabs.Tab value="matrix">Permission Matrix</Tabs.Tab>
                    </Tabs.List>

                    <Tabs.Panel value="groups" pt="lg">
                        <Grid>
                            {/* Groups Sidebar */}
                            <Grid.Col span={3}>
                                <Card withBorder>
                                    <Card.Section p="md" withBorder>
                                        <Group spacing="xs">
                                            <BiGroup />
                                            <Text weight={500}>User Groups</Text>
                                        </Group>
                                    </Card.Section>
                                    <Card.Section p="md">
                                        <Stack spacing="sm">
                                            {mockUserGroups.map((group) => {
                                                const stats = getGroupStats(group.id);
                                                return (
                                                    <Paper
                                                        key={group.id}
                                                        p="md"
                                                        withBorder
                                                        style={{
                                                            cursor: 'pointer',
                                                            borderColor: selectedGroup === group.id ? '#228be6' : undefined,
                                                            backgroundColor: selectedGroup === group.id ? '#f8f9fa' : undefined,
                                                        }}
                                                        onClick={() => setSelectedGroup(group.id)}
                                                    >
                                                        <Group spacing="sm" mb="xs">
                                                            <div
                                                                style={{
                                                                    width: 12,
                                                                    height: 12,
                                                                    borderRadius: '50%',
                                                                    backgroundColor: group.color,
                                                                }}
                                                            />
                                                            <div style={{ flex: 1 }}>
                                                                <Text weight={500} size="sm">
                                                                    {group.name}
                                                                </Text>
                                                                <Text size="xs" color="dimmed">
                                                                    {group.memberCount} members
                                                                </Text>
                                                            </div>
                                                            {group.isSystem && (
                                                                <Badge size="xs" variant="outline">
                                                                    System
                                                                </Badge>
                                                            )}
                                                        </Group>
                                                        <Group position="apart">
                                                            <Text size="xs" color="dimmed">
                                                                {stats.granted}/{stats.total} permissions
                                                            </Text>
                                                            <Text size="xs" color="dimmed">
                                                                {stats.percentage}%
                                                            </Text>
                                                        </Group>
                                                    </Paper>
                                                );
                                            })}
                                        </Stack>
                                    </Card.Section>
                                </Card>
                            </Grid.Col>

                            {/* Permissions Grid */}
                            <Grid.Col span={9}>
                                <Stack spacing="lg">
                                    {/* Selected Group Info */}
                                    {selectedGroup && (
                                        <Card withBorder>
                                            <Card.Section p="md" withBorder>
                                                <Group position="apart">
                                                    <Group spacing="sm">
                                                        <div
                                                            style={{
                                                                width: 16,
                                                                height: 16,
                                                                borderRadius: '50%',
                                                                backgroundColor: mockUserGroups.find((g) => g.id === selectedGroup)?.color,
                                                            }}
                                                        />
                                                        <div>
                                                            <Text weight={500} size="lg">
                                                                {mockUserGroups.find((g) => g.id === selectedGroup)?.name}
                                                            </Text>
                                                            <Text color="dimmed" size="sm">
                                                                {mockUserGroups.find((g) => g.id === selectedGroup)?.description}
                                                            </Text>
                                                        </div>
                                                    </Group>
                                                    <Group>
                                                        <ActionIcon>
                                                            <BiEdit />
                                                        </ActionIcon>
                                                        <ActionIcon color="red">
                                                            <BiTrash />
                                                        </ActionIcon>
                                                    </Group>
                                                </Group>
                                            </Card.Section>
                                            <Card.Section p="md">
                                                <Grid>
                                                    {(() => {
                                                        const stats = getGroupStats(selectedGroup);
                                                        return (
                                                            <>
                                                                <Grid.Col span={3} style={{ textAlign: 'center' }}>
                                                                    <Text size="xl" weight={700}>
                                                                        {stats.granted}
                                                                    </Text>
                                                                    <Text size="sm" color="dimmed">
                                                                        Granted
                                                                    </Text>
                                                                </Grid.Col>
                                                                <Grid.Col span={3} style={{ textAlign: 'center' }}>
                                                                    <Text size="xl" weight={700}>
                                                                        {stats.fullAccess}
                                                                    </Text>
                                                                    <Text size="sm" color="dimmed">
                                                                        Full Access
                                                                    </Text>
                                                                </Grid.Col>
                                                                <Grid.Col span={3} style={{ textAlign: 'center' }}>
                                                                    <Text size="xl" weight={700}>
                                                                        {stats.readOnly}
                                                                    </Text>
                                                                    <Text size="sm" color="dimmed">
                                                                        Read Only
                                                                    </Text>
                                                                </Grid.Col>
                                                                <Grid.Col span={3} style={{ textAlign: 'center' }}>
                                                                    <Text size="xl" weight={700}>
                                                                        {stats.percentage}%
                                                                    </Text>
                                                                    <Text size="sm" color="dimmed">
                                                                        Coverage
                                                                    </Text>
                                                                </Grid.Col>
                                                            </>
                                                        );
                                                    })()}
                                                </Grid>
                                            </Card.Section>
                                        </Card>
                                    )}

                                    {/* Permissions by Category */}
                                    <Stack spacing="md">
                                        {Object.entries(groupedPermissions).map(([category, categoryPermissions]) => {
                                            if (categoryPermissions.length === 0) return null;

                                            return (
                                                <Card key={category} withBorder>
                                                    <Card.Section p="md" withBorder>
                                                        <Text weight={500} size="lg">
                                                            {category}
                                                        </Text>
                                                    </Card.Section>
                                                    <Card.Section p="md">
                                                        <Stack spacing="sm">
                                                            {categoryPermissions.map((permission) => {
                                                                const groupPermission = getGroupPermission(selectedGroup, permission.name);
                                                                const IconComponent = iconMap[permission.icon as keyof typeof iconMap];

                                                                return (
                                                                    <Paper key={permission.id} p="md" withBorder>
                                                                        <Group position="apart">
                                                                            <Group spacing="sm">
                                                                                {IconComponent && <IconComponent size={20} />}
                                                                                <div>
                                                                                    <Group spacing="xs" mb={4}>
                                                                                        <Text weight={500}>{permission.name}</Text>
                                                                                        <Badge size="xs" color={getRiskLevelColor(permission.riskLevel)}>
                                                                                            {permission.riskLevel}
                                                                                        </Badge>
                                                                                    </Group>
                                                                                    <Text size="sm" color="dimmed">
                                                                                        {permission.description}
                                                                                    </Text>
                                                                                </div>
                                                                            </Group>

                                                                            <Group spacing="lg">
                                                                                <Group className="flex flex-col gap-1 items-center" spacing="xs">
                                                                                    <span>Create</span>
                                                                                    <Switch
                                                                                        checked={groupPermission?.canCreate || false}
                                                                                        onChange={(e) => updatePermission(selectedGroup, permission.name, 'canCreate', e.currentTarget.checked)}
                                                                                    />
                                                                                </Group>
                                                                                <Group className="flex flex-col gap-1 items-center" spacing="xs">
                                                                                    <span>Read</span>
                                                                                    <Switch
                                                                                        checked={groupPermission?.canRead || false}
                                                                                        onChange={(e) => updatePermission(selectedGroup, permission.name, 'canRead', e.currentTarget.checked)}
                                                                                    />
                                                                                </Group>
                                                                                <Group className="flex flex-col gap-1 items-center" spacing="xs">
                                                                                    <span>Update</span>
                                                                                    <Switch
                                                                                        checked={groupPermission?.canUpdate || false}
                                                                                        onChange={(e) => updatePermission(selectedGroup, permission.name, 'canUpdate', e.currentTarget.checked)}
                                                                                    />
                                                                                </Group>
                                                                                <Group className="flex flex-col gap-1 items-center" spacing="xs">
                                                                                    <span>Delete</span>
                                                                                    <Switch
                                                                                        checked={groupPermission?.canDelete || false}
                                                                                        onChange={(e) => updatePermission(selectedGroup, permission.name, 'canDelete', e.currentTarget.checked)}
                                                                                    />
                                                                                </Group>
                                                                            </Group>
                                                                        </Group>
                                                                    </Paper>
                                                                );
                                                            })}
                                                        </Stack>
                                                    </Card.Section>
                                                </Card>
                                            );
                                        })}
                                    </Stack>
                                </Stack>
                            </Grid.Col>
                        </Grid>
                    </Tabs.Panel>

                    <Tabs.Panel value="matrix" pt="lg">
                        {/* Permission Matrix */}
                        <Card withBorder>
                            <Card.Section p="md" withBorder>
                                <Title order={4}>Permission Matrix</Title>
                                <Text color="dimmed">Overview of all permissions across user groups</Text>
                            </Card.Section>
                            <Card.Section>
                                <div style={{ overflowX: 'auto' }}>
                                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                        <thead>
                                            <tr style={{ borderBottom: '1px solid #dee2e6' }}>
                                                <th style={{ textAlign: 'left', padding: '12px', fontWeight: 500 }}>Permission</th>
                                                <th style={{ textAlign: 'left', padding: '12px', fontWeight: 500 }}>Category</th>
                                                <th style={{ textAlign: 'left', padding: '12px', fontWeight: 500 }}>Risk</th>
                                                {mockUserGroups.map((group) => (
                                                    <th key={group.id} style={{ textAlign: 'center', padding: '12px', fontWeight: 500, minWidth: 120 }}>
                                                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                                                            <div
                                                                style={{
                                                                    width: 12,
                                                                    height: 12,
                                                                    borderRadius: '50%',
                                                                    backgroundColor: group.color,
                                                                }}
                                                            />
                                                            <Text size="xs">{group.name}</Text>
                                                        </div>
                                                    </th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {filteredPermissions.map((permission) => {
                                                const IconComponent = iconMap[permission.icon as keyof typeof iconMap];
                                                return (
                                                    <tr key={permission.id} style={{ borderBottom: '1px solid #dee2e6' }}>
                                                        <td style={{ padding: '12px' }}>
                                                            <Group spacing="xs">
                                                                {IconComponent && <IconComponent size={16} />}
                                                                <Text weight={500}>{permission.name}</Text>
                                                            </Group>
                                                        </td>
                                                        <td style={{ padding: '12px' }}>
                                                            <Badge variant="light">{permission.category}</Badge>
                                                        </td>
                                                        <td style={{ padding: '12px' }}>
                                                            <Badge color={getRiskLevelColor(permission.riskLevel)}>{permission.riskLevel}</Badge>
                                                        </td>
                                                        {mockUserGroups.map((group) => {
                                                            const groupPermission = getGroupPermission(group.id, permission.name);
                                                            const hasAnyPermission =
                                                                groupPermission && (groupPermission.canCreate || groupPermission.canRead || groupPermission.canUpdate || groupPermission.canDelete);
                                                            const hasFullPermission =
                                                                groupPermission && groupPermission.canCreate && groupPermission.canRead && groupPermission.canUpdate && groupPermission.canDelete;

                                                            return (
                                                                <td key={group.id} style={{ padding: '12px', textAlign: 'center' }}>
                                                                    {hasFullPermission ? (
                                                                        <BiCheck size={20} color="#51cf66" />
                                                                    ) : hasAnyPermission ? (
                                                                        <Badge size="xs" variant="light">
                                                                            Partial
                                                                        </Badge>
                                                                    ) : (
                                                                        <BiX size={20} color="#ff6b6b" />
                                                                    )}
                                                                </td>
                                                            );
                                                        })}
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            </Card.Section>
                        </Card>
                    </Tabs.Panel>
                </Tabs>
            </Stack>
        </Container>
    );
}
