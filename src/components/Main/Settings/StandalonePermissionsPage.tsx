import { useEffect, useMemo, useState } from 'react';
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
import AddEditPermissionGroup from './AddEditPermissionGroup';
import toast from 'react-hot-toast';

interface CorePermissionType {
    code: string;
    name: string;
    category: string;
    description: string;
    icon: string;
    riskLevel: string;
}

interface UserGroup {
    id: string;
    name: string;
    description: string;
    memberCount: number;
    color: string;
    isSystem: boolean;
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

export default function StandalonePermissionsPage() {
    const [groups, setGroups] = useState<UserGroup[]>([]);
    const [corePermissions, setCorePermissions] = useState<CorePermissionType[]>([]);
    const [groupPermissions, setGroupPermissions] = useState<GroupPermission[]>([]);
    const [selectedGroup, setSelectedGroup] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [showBulkActions, setShowBulkActions] = useState(false);
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [openPermissionGroupPopup, setOpenPermissionGroupPopup] = useState<boolean>(false);
    const [initialData, setInitialData] = useState<any>();
    // 1) on mount: load all groups + all core perms
    useEffect(() => {
        CompanySetupServices.FetchUserPermissionGroupList()
            .then((r) => {
                setGroups(r);
                if (r.length > 0) {
                    setSelectedGroup(r[0].id); // ← select first group by default
                }
            })
            .catch(console.error);

        CompanySetupServices.FetchCorePermissions()
            .then((r) => setCorePermissions(r))
            .catch(console.error);
    }, []);

    // 2) when selectedGroup changes, load that group’s flags
    useEffect(() => {
        if (!selectedGroup) return;
        CompanySetupServices.FetchPermissionsInGroup(Number(selectedGroup))
            .then((r) => setGroupPermissions(r))
            .catch(console.error);
    }, [selectedGroup]);

    // helpers
    const getGroupPermission = (code: string) => groupPermissions.find((p) => p.permissionName === code);

    const categories = Array.from(new Set(corePermissions.map((p) => p.category)));

    const filteredCore = corePermissions.filter((p) => {
        const text = (p.name + p.description).toLowerCase();
        return text.includes(searchTerm.toLowerCase()) && (selectedCategory === 'all' || p.category === selectedCategory);
    });

    const grouped = categories.reduce((acc, cat) => {
        acc[cat] = filteredCore.filter((p) => p.category === cat);
        return acc;
    }, {} as Record<string, CorePermissionType[]>);

    const toggleFlag = (code: string, field: keyof GroupPermission, value: boolean) => {
        setGroupPermissions((all) => all.map((gp) => (gp.permissionName === code ? { ...gp, [field]: value } : gp)));
    };

    // one‐shot save of all flags
    const handleSave = () => {
        if (!selectedGroup) return;
        CompanySetupServices.BulkUpdatePermissions({
            groupId: Number(selectedGroup),
            permissions: groupPermissions.map((gp) => ({
                permissionName: gp.permissionName,
                canCreate: gp.canCreate,
                canRead: gp.canRead,
                canUpdate: gp.canUpdate,
                canDelete: gp.canDelete,
            })),
        })
            .then((r) => {
                return r;
            })
            .then(setGroupPermissions)
            .catch(console.error);
    };

    const stats = useMemo(() => {
        const total = corePermissions.length;
        const grantedPermissions = groupPermissions.filter((gp) => gp.canCreate || gp.canRead || gp.canUpdate || gp.canDelete);

        const granted = grantedPermissions.length;
        const fullAccess = groupPermissions.filter((gp) => gp.canCreate && gp.canRead && gp.canUpdate && gp.canDelete).length;
        const readOnly = groupPermissions.filter((gp) => !gp.canCreate && gp.canRead && !gp.canUpdate && !gp.canDelete).length;
        const coverage = total > 0 ? Math.round((granted / total) * 100) : 0;
        return { total, granted, fullAccess, readOnly, coverage };
    }, [corePermissions, groupPermissions]);

    const handleClosePopup = () => {
        setOpenPermissionGroupPopup(false);
    };
    const handleOpenForNew = () => {
        setInitialData(null);
        setOpenPermissionGroupPopup(true);
    };

    const handleDelete = () => {
        if (!selectedGroup) return;
        const id = Number(selectedGroup);
        window.confirm(`are you sure you want to delete Group # ${id}`);
        CompanySetupServices.DeleteGroupPermission(id)
            .then(() => {
                console.log('we are good to go');
                toast.success(`Group with ID: ${id} Deleted`, { duration: 4000 });
            })
            .catch((e) => {
                toast.error(`Error Deleting Group with ID: ${id}`, { duration: 4000 });
            });
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
                        <Button variant="light" leftIcon={<BiFilter />} onClick={() => setShowBulkActions((v) => !v)}>
                            Bulk Actions
                        </Button>
                        <button onClick={handleOpenForNew} className="btn btn-sm btn-primary">
                            Add Group
                        </button>

                        {selectedGroup && (
                            <button onClick={handleSave} className="btn btn-sm btn-success">
                                Save Permissions
                            </button>
                        )}
                    </Group>
                </Group>

                {/* Search + Filter */}
                <Group>
                    <TextInput placeholder="Search permissions..." value={searchTerm} onChange={(e) => setSearchTerm(e.currentTarget.value)} icon={<BiSearch />} style={{ flex: 1 }} />
                    <Select
                        placeholder="Filter by category"
                        value={selectedCategory}
                        onChange={(v) => setSelectedCategory(v || 'all')}
                        data={[{ value: 'all', label: 'All Categories' }, ...categories.map((c) => ({ value: c, label: c }))]}
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
                            <Select placeholder="Copy from group" data={groups.map((g) => ({ value: g.id, label: g.name }))} style={{ minWidth: 200 }} />
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

                    {/* — Groups & Permissions view — */}
                    <Tabs.Panel value="groups" pt="lg">
                        <Grid>
                            {/* Sidebar: list of groups */}
                            <Grid.Col span={12} xs={12} sm={12} md={3}>
                                <Card withBorder>
                                    <Card.Section p="md" withBorder>
                                        <Group spacing="xs">
                                            <BiGroup />
                                            <span className="font-bold">User Groups</span>
                                        </Group>
                                    </Card.Section>
                                    <Card.Section p="md">
                                        <Stack spacing="sm">
                                            {groups.map((g) => {
                                                return (
                                                    <Paper
                                                        key={g.id}
                                                        p="md"
                                                        withBorder
                                                        style={{
                                                            cursor: 'pointer',
                                                            borderColor: selectedGroup === g.id ? '#228be6' : undefined,
                                                            backgroundColor: selectedGroup === g.id ? '#f8f9fa' : undefined,
                                                        }}
                                                        onClick={() => setSelectedGroup(g.id)}
                                                    >
                                                        <Group spacing="sm" mb="xs">
                                                            <div
                                                                style={{
                                                                    width: 12,
                                                                    height: 12,
                                                                    borderRadius: 6,
                                                                    backgroundColor: g.color,
                                                                }}
                                                            />
                                                            <div style={{ flex: 1 }}>
                                                                <Text weight={500} size="sm">
                                                                    {g.name}
                                                                </Text>
                                                                <Text size="xs" color="dimmed">
                                                                    {g.memberCount} members
                                                                </Text>
                                                            </div>
                                                            {g.isSystem && (
                                                                <Badge size="xs" variant="outline">
                                                                    System
                                                                </Badge>
                                                            )}
                                                        </Group>
                                                        {/* <Group position="apart">
                                                            <span className="text-gray-700 text-[10px]">
                                                                {stats.granted}/{stats.total} permissions
                                                            </span>
                                                            <span className="text-gray-700 text-[10px]">{stats.coverage}%</span>
                                                        </Group> */}
                                                    </Paper>
                                                );
                                            })}
                                        </Stack>
                                    </Card.Section>
                                </Card>
                            </Grid.Col>

                            {/* Main: permission Info  */}
                            <Grid.Col span={12} md={9} xs={12} sm={12}>
                                <Stack spacing="lg">
                                    {selectedGroup && (
                                        <Card withBorder>
                                            <Card.Section p="md" withBorder>
                                                <Group position="apart">
                                                    <Group spacing="sm">
                                                        <div
                                                            style={{
                                                                width: 16,
                                                                height: 16,
                                                                borderRadius: 8,
                                                                backgroundColor: groups.find((g) => g.id === selectedGroup)?.color,
                                                            }}
                                                        />
                                                        <div>
                                                            <Text weight={500} size="lg">
                                                                {groups.find((g) => g.id === selectedGroup)?.name}
                                                            </Text>
                                                            <Text color="dimmed" size="sm">
                                                                {groups.find((g) => g.id === selectedGroup)?.description}
                                                            </Text>
                                                        </div>
                                                    </Group>
                                                    <Group>
                                                        <ActionIcon>
                                                            <BiEdit />
                                                        </ActionIcon>
                                                        <ActionIcon onClick={handleDelete} color="red">
                                                            <BiTrash />
                                                        </ActionIcon>
                                                    </Group>
                                                </Group>
                                            </Card.Section>
                                            <Card.Section p="md">
                                                <Grid>
                                                    {[
                                                        { label: 'Granted', value: stats.granted },
                                                        { label: 'Full Access', value: stats.fullAccess },
                                                        { label: 'Read Only', value: stats.readOnly },
                                                        { label: 'Coverage', value: stats.coverage + '%' },
                                                    ].map(({ label, value }) => (
                                                        <Grid.Col span={3} key={label} style={{ textAlign: 'center' }}>
                                                            <Text size="xl" weight={700}>
                                                                {value}
                                                            </Text>
                                                            <Text size="sm" color="dimmed">
                                                                {label}
                                                            </Text>
                                                        </Grid.Col>
                                                    ))}
                                                </Grid>
                                            </Card.Section>
                                        </Card>
                                    )}
                                    {/* permission Grid with */}
                                    {Object.entries(grouped).map(([category, perms]) => (
                                        <Card key={category} withBorder>
                                            <Card.Section p="md" withBorder>
                                                <Text weight={500} size="lg">
                                                    {category}
                                                </Text>
                                            </Card.Section>
                                            <Card.Section p="md">
                                                <Stack spacing="sm">
                                                    {perms.map((perm) => {
                                                        const gp = getGroupPermission(perm.code);
                                                        const Icon = iconMap[perm.icon as keyof typeof iconMap];
                                                        return (
                                                            <Paper key={perm.code} p="md" withBorder>
                                                                <Group position="apart">
                                                                    <Group spacing="sm">
                                                                        {Icon && <Icon size={20} />}
                                                                        <div>
                                                                            <Group spacing="xs" mb={4}>
                                                                                {/* {perm.name} */}
                                                                                <span className="font-semibold">{perm.name}</span>

                                                                                <Badge size="xs" variant="light">
                                                                                    {perm.riskLevel}
                                                                                </Badge>
                                                                            </Group>
                                                                            <Text size="sm" color="dimmed">
                                                                                {perm.description}
                                                                            </Text>
                                                                        </div>
                                                                    </Group>

                                                                    <Group spacing="lg">
                                                                        {(['canCreate', 'canRead', 'canUpdate', 'canDelete'] as const).map((f) => (
                                                                            <Group className="flex flex-col gap-1 items-center" spacing="xs" key={f}>
                                                                                <span className="text-[10px] sm:text-[12px]">{f.replace('can', '')}</span>
                                                                                <Switch checked={Boolean(gp?.[f])} onChange={(e) => toggleFlag(perm.code, f, e.currentTarget.checked)} />
                                                                            </Group>
                                                                        ))}
                                                                    </Group>
                                                                </Group>
                                                            </Paper>
                                                        );
                                                    })}
                                                </Stack>
                                            </Card.Section>
                                        </Card>
                                    ))}
                                </Stack>
                            </Grid.Col>
                        </Grid>
                    </Tabs.Panel>

                    {/* — Permission Matrix view — */}
                    <Tabs.Panel value="matrix" pt="lg">
                        <Card withBorder>
                            <Card.Section p="md" withBorder>
                                <Title order={4}>Permission Matrix</Title>
                                <Text color="dimmed">Overview of all permissions across user groups</Text>
                            </Card.Section>
                            <Card.Section>
                                <div style={{ overflowX: 'auto' }}>
                                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                        <thead>
                                            <tr>
                                                <th>Permission</th>
                                                <th>Category</th>
                                                <th>Risk</th>
                                                {groups.map((g) => (
                                                    <th key={g.id}>{g.name}</th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {filteredCore.map((perm) => {
                                                const gp = getGroupPermission(perm.code);
                                                const any = gp?.canCreate || gp?.canRead || gp?.canUpdate || gp?.canDelete;
                                                const full = gp?.canCreate && gp?.canRead && gp?.canUpdate && gp?.canDelete;
                                                return (
                                                    <tr key={perm.code}>
                                                        <td>{perm.name}</td>
                                                        <td>{perm.category}</td>
                                                        <td>{perm.riskLevel}</td>
                                                        {groups.map((g) => (
                                                            <td key={g.id}>{full ? <BiCheck /> : any ? <Badge>Partial</Badge> : <BiX />}</td>
                                                        ))}
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
            {openPermissionGroupPopup && <AddEditPermissionGroup isEditing={isEditing} initialData={initialData} onClose={handleClosePopup} />}
        </Container>
    );
}
