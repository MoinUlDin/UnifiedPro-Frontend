import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import CompanySetupServices from '../../../services/CompanySetupServices';
import EmployeeServices from '../../../services/EmployeeServices';
import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux';

interface Employee {
    id: number;
    username: string;
    email: string;
    first_name: string;
    last_name: string;
}

interface UserGroup {
    id: string;
    name: string;
}

interface Props {
    opened: boolean;
    initialGroupId: string | null;
    onClose(): void;
    onSuccess: (updater: (prev: number) => number) => void;
}

export default function ManageGroupMembersModal({ opened, onClose, initialGroupId, onSuccess }: Props) {
    const [groups, setGroups] = useState<UserGroup[]>([]);
    const [groupId, setGroupId] = useState<string | null>(initialGroupId);
    const [allEmployees, setAllEmployees] = useState<Employee[]>([]);
    const [inGroup, setInGroup] = useState<Employee[]>([]);
    const [outGroup, setOutGroup] = useState<Employee[]>([]);
    const [filter, setFilter] = useState('');
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();

    // mount: fetch groups + employees
    useEffect(() => {
        setLoading(true);
        Promise.all([CompanySetupServices.FetchUserPermissionGroupList(), CompanySetupServices.FetchMemeberForPermisssion()])
            .then(([grp, emp]) => {
                console.log('emp: ', emp);
                setGroups(grp);
                setAllEmployees(emp);
                if (!groupId && grp.length) setGroupId(grp[0].id);
            })
            .catch(console.error)
            .finally(() => setLoading(false));
    }, [dispatch, groupId]);

    // when groupId changes, fetch members
    useEffect(() => {
        if (!groupId) return;
        setLoading(true);
        CompanySetupServices.FetchMemberListInGroup(Number(groupId))
            .then((members: Employee[]) => {
                console.log('members in group: ', members);
                const memberIds = new Set(members.map((u) => u.id));
                setInGroup(members);
                setOutGroup(allEmployees.filter((u) => !memberIds.has(u.id)));
            })
            .catch(console.error)
            .finally(() => setLoading(false));
    }, [groupId, allEmployees]);

    // move one or many selected items from out → in or in → out
    const moveItems = (fromIn: boolean, ids: number[]) => {
        if (fromIn) {
            // remove from inGroup, put back to outGroup
            const newIn = inGroup.filter((u) => !ids.includes(u.id));
            const returning = inGroup.filter((u) => ids.includes(u.id));
            setInGroup(newIn);
            setOutGroup([...outGroup, ...returning]);
        } else {
            // remove from outGroup, add to inGroup
            const newOut = outGroup.filter((u) => !ids.includes(u.id));
            const adding = outGroup.filter((u) => ids.includes(u.id));
            setOutGroup(newOut);
            setInGroup([...inGroup, ...adding]);
        }
    };

    const handleSave = () => {
        if (!groupId) return;
        setLoading(true);
        CompanySetupServices.UpdateGroupMembers(Number(groupId), { userIds: inGroup.map((u) => u.id) })
            .then(() => {
                toast.success('Group members updated');
                onSuccess((p: number) => p + 1);
                onClose();
            })
            .catch(() => toast.error('Update failed'))
            .finally(() => setLoading(false));
    };

    if (!opened) return null;
    return createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* backdrop */}
            <div onClick={onClose} className="absolute inset-0 bg-black opacity-50" />
            <div className="relative bg-white rounded-lg shadow-xl w-11/12 max-w-4xl p-6 overflow-auto" style={{ maxHeight: '90vh' }}>
                <header className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">Manage Group Members</h2>
                    <button onClick={onClose} className="text-gray-600 hover:text-gray-900">
                        &times;
                    </button>
                </header>

                {loading && (
                    <div className="fixed inset-0 items-center flex justify-center py-20 z-50 bg-black bg-opacity-40">
                        <svg className="bg-white rounded-full animate-spin h-20 w-52 text-red-600" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                            <path className="opacity-90" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                        </svg>
                    </div>
                )}
                <>
                    {/* selectors & search */}
                    <div className="flex flex-wrap gap-4 mb-4">
                        <div className="flex-1">
                            <label className="block text-sm font-medium mb-1">Select Group</label>
                            <select className="w-full border rounded px-3 py-2" value={String(groupId)} onChange={(e) => setGroupId(e.target.value)}>
                                {groups.map((g) => (
                                    <option key={g.id} value={g.id}>
                                        {g.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="flex-1">
                            <label className="block text-sm font-medium mb-1">Filter employees</label>
                            <input type="text" className="w-full border rounded px-3 py-2" placeholder="Search by name or email…" value={filter} onChange={(e) => setFilter(e.target.value)} />
                        </div>
                    </div>

                    {/* counts */}
                    <p className="text-sm mb-4">
                        In <strong>{groups.find((g) => g.id === groupId)?.name}</strong>: <strong>{inGroup.length}</strong> members; Available: <strong>{outGroup.length}</strong>
                    </p>

                    {/* two lists + controls */}
                    <div className="flex gap-4">
                        {/** Available **/}
                        <div className="flex-1">
                            <h3 className="text-sm font-medium mb-2">Available</h3>
                            <ul className="border rounded h-64 overflow-auto">
                                {outGroup
                                    .filter((u) => `${u.first_name} ${u.last_name} ${u.email}`.toLowerCase().includes(filter.toLowerCase()))
                                    .map((u) => (
                                        <li key={u.id} className="px-3 py-1 hover:bg-gray-100 cursor-pointer" onClick={() => moveItems(false, [u.id])}>
                                            {u.first_name} {u.last_name} <span className="text-gray-500">&lt;{u.email}&gt;</span>
                                        </li>
                                    ))}
                            </ul>
                        </div>

                        {/** spacer + buttons **/}
                        <div className="flex flex-col items-center justify-center gap-2">
                            <button
                                onClick={() =>
                                    moveItems(
                                        false,
                                        outGroup.map((u) => u.id)
                                    )
                                }
                                className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                                title="Add all"
                            >
                                &gt;&gt;
                            </button>
                            <button
                                onClick={() =>
                                    moveItems(
                                        true,
                                        inGroup.map((u) => u.id)
                                    )
                                }
                                className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                                title="Remove all"
                            >
                                &lt;&lt;
                            </button>
                        </div>

                        {/** In group **/}
                        <div className="flex-1">
                            <h3 className="text-sm font-medium mb-2">In Group</h3>
                            <ul className="border rounded h-64 overflow-auto">
                                {inGroup
                                    .filter((u) => `${u.first_name} ${u.last_name} ${u.email}`.toLowerCase().includes(filter.toLowerCase()))
                                    .map((u) => (
                                        <li key={u.id} className="px-3 py-1 hover:bg-gray-100 cursor-pointer" onClick={() => moveItems(true, [u.id])}>
                                            {u.first_name} {u.last_name} <span className="text-gray-500">&lt;{u.email}&gt;</span>
                                        </li>
                                    ))}
                            </ul>
                        </div>
                    </div>

                    {/* actions */}
                    <footer className="mt-6 flex justify-end gap-2">
                        <button onClick={onClose} className="px-4 py-2 border rounded hover:bg-gray-100">
                            Cancel
                        </button>
                        <button onClick={handleSave} className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">
                            Save
                        </button>
                    </footer>
                </>
            </div>
        </div>,
        document.body
    );
}

// // components/ManageGroupMembersModal.tsx
// import { useEffect, useState } from 'react';
// import { Modal, Group, Select, TextInput, TransferList, Button, Loader, Text, Badge, Stack, Title } from '@mantine/core';
// import { BiSearch, BiSave, BiX } from 'react-icons/bi';
// import CompanySetupServices from '../../../services/CompanySetupServices';
// import EmployeeServices from '../../../services/EmployeeServices';
// import toast from 'react-hot-toast';
// import { useDispatch } from 'react-redux';
// import type { TransferListData, TransferListItem } from '@mantine/core';

// interface Employee {
//     id: number;
//     username: string;
//     email: string;
//     first_name: string;
//     last_name: string;
// }

// interface UserGroup {
//     id: string;
//     name: string;
// }

// interface ManageGroupMembersModalProps {
//     opened: boolean;
//     onClose(): void;
//     initialGroupId: string | null;
// }

// export default function ManageGroupMembersModal({ opened, onClose, initialGroupId }: ManageGroupMembersModalProps) {
//     const [groups, setGroups] = useState<UserGroup[]>([]);
//     const [groupId, setGroupId] = useState<string | null>(initialGroupId || null);
//     const [allEmployees, setAllEmployees] = useState<Employee[]>([]);
//     const [listData, setListData] = useState<TransferListData>([[], []]);
//     const [loading, setLoading] = useState(true);
//     const [filter, setFilter] = useState('');
//     const dispatch = useDispatch();

//     // load groups and employees
//     useEffect(() => {
//         setLoading(true);
//         Promise.all([CompanySetupServices.FetchUserPermissionGroupList(), EmployeeServices.FetchEmployees(dispatch)])
//             .then(([grp, emp]) => {
//                 setGroups(grp);
//                 setAllEmployees(emp);
//             })
//             .catch(console.error)
//             .finally(() => setLoading(false));
//     }, [dispatch]);

//     // when group changes, fetch its members and build left/right
//     useEffect(() => {
//         if (!groupId) return;
//         setLoading(true);
//         CompanySetupServices.FetchMemberListInGroup(Number(groupId))
//             .then((members: Employee[]) => {
//                 const memberIds = new Set(members.map((u) => u.id));
//                 const left: TransferListItem[] = allEmployees
//                     .filter((u) => !memberIds.has(u.id))
//                     .map((u) => ({
//                         value: u.id.toString(),
//                         label: `${u.first_name} ${u.last_name} (${u.email})`,
//                     }));
//                 const right: TransferListItem[] = members.map((u) => ({
//                     value: u.id.toString(),
//                     label: `${u.first_name} ${u.last_name} (${u.email})`,
//                 }));
//                 setListData([left, right]);
//             })
//             .catch(console.error)
//             .finally(() => setLoading(false));
//     }, [groupId, allEmployees]);

//     const filterItems = (items: TransferListItem[]) => {
//         if (!filter) return items;
//         return items.filter((it) => it.label.toLowerCase().includes(filter.toLowerCase()));
//     };

//     const handleSave = () => {
//         if (!groupId) return;
//         const newIds = listData[1].map((it) => Number(it.value));
//         CompanySetupServices.UpdateGroupMembers(Number(groupId), { userIds: newIds })
//             .then(() => {
//                 toast.success('Members updated');
//                 onClose();
//             })
//             .catch(() => toast.error('Update failed'));
//     };

//     return (
//         <Modal
//             opened={opened}
//             onClose={onClose}
//             size="xl"
//             title={
//                 <Group position="apart">
//                     <Title order={3}>Manage Group Members</Title>
//                     <Button variant="subtle" onClick={onClose} leftIcon={<BiX />} />
//                 </Group>
//             }
//         >
//             {loading ? (
//                 <Group position="center" style={{ minHeight: 200 }}>
//                     <Loader />
//                 </Group>
//             ) : (
//                 <Stack spacing="md">
//                     <Group position="apart">
//                         <Select label="Select Group" value={groupId} onChange={setGroupId} data={groups.map((g) => ({ value: g.id, label: g.name }))} style={{ flex: 1 }} />
//                         <TextInput icon={<BiSearch />} placeholder="Filter employees..." value={filter} onChange={(e) => setFilter(e.currentTarget.value)} style={{ flex: 1 }} />
//                     </Group>

//                     <Text>
//                         In <Badge>{groups.find((g) => g.id === groupId)?.name || ''}</Badge>: <strong>{listData[1].length}</strong> members; Available: <strong>{listData[0].length}</strong>
//                     </Text>

//                     <TransferList
//                         value={listData}
//                         onChange={setListData}
//                         searchPlaceholder="Type to filter..."
//                         nothingFound="No matches"
//                         titles={['Available', 'In group']}
//                         filter={(search, item) => item.label.toLowerCase().includes(search.toLowerCase())}
//                         styles={{
//                             // container for both lists
//                             transferListItems: {
//                                 height: 300,
//                                 overflowY: 'auto',
//                             },
//                             // each individual item
//                             transferListItem: {
//                                 whiteSpace: 'nowrap',
//                                 padding: '8px 12px',
//                                 lineHeight: 1.4,
//                             },
//                             // header/title above each list
//                             transferListHeader: {
//                                 padding: '8px 12px',
//                                 fontSize: '0.9rem',
//                             },
//                             // search input above each list
//                             transferListSearch: {
//                                 marginBottom: 8,
//                             },
//                         }}
//                         breakpoint="sm"
//                     />

//                     <Group position="right">
//                         <Button variant="outline" onClick={onClose}>
//                             Cancel
//                         </Button>
//                         <Button leftIcon={<BiSave />} onClick={handleSave}>
//                             Save
//                         </Button>
//                     </Group>
//                 </Stack>
//             )}
//         </Modal>
//     );
// }

// components/ManageGroupMembersModal.tsx
