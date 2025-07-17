import { DataTable, DataTableColumn } from 'mantine-datatable';
import { useEffect, useState } from 'react';
import Performance_Moni_List_Popup, { PMFormData } from './Performance_Moni_List_Popup';
import SettingServices from '../../../../services/SettingServices';
import toast, { Toaster } from 'react-hot-toast';

interface RowData {
    id: number;
    company: number;
    raw_start: string; // ISO: "2025-01-01"
    raw_end: string; // ISO: "2025-12-31"
    start_date: string; // formatted: "01/Jan/25"
    end_date: string; // formatted: "31/Dec/25"
    session_type: string;
}

function toCapitalize(s: string) {
    return s[0].toUpperCase() + s.slice(1).toLowerCase();
}

function formatDate(iso: string): string {
    if (!iso) return 'N/A';
    const d = new Date(iso);
    return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: '2-digit' }).replace(/ /g, '/');
}

export default function Performance_Moni_List() {
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [selectedPM, setSelectedPM] = useState<RowData | null>(null);
    const [allData, setAllData] = useState<RowData[]>([]);
    const [recordsData, setRecordsData] = useState<RowData[]>([]);

    // fetch & normalize
    const fetchPerfMoni = async () => {
        try {
            const resp: any = await SettingServices.FetchPerformanceMonitoring();
            console.log('response', resp);
            const arr = Array.isArray(resp) ? resp : [resp];
            const mapped: RowData[] = arr.map((item) => ({
                id: item.id,
                company: item.company,
                raw_start: item.start_date.slice(0, 10), // "YYYY-MM-DD"
                raw_end: item.end_date.slice(0, 10),
                start_date: formatDate(item.start_date),
                end_date: formatDate(item.end_date),
                session_type: toCapitalize(item.session_type),
            }));
            setAllData(mapped);
        } catch (err) {
            console.error(err);
            toast.error('Failed to fetch');
        }
    };

    useEffect(() => {
        fetchPerfMoni();
    }, []);

    // open popup
    const openEdit = () => {
        const pm = allData[0];
        if (!pm) return toast.error('No record');
        setSelectedPM(pm);
        setIsPopupOpen(true);
    };

    // mutable columns
    const columns: DataTableColumn<RowData>[] = [
        { accessor: 'company', title: 'Company' },
        { accessor: 'start_date', title: 'Start Date' },
        { accessor: 'end_date', title: 'End Date' },
        { accessor: 'session_type', title: 'Session Type' },
    ];

    return (
        <div>
            <div className="panel mt-8">
                <div className="flex justify-between items-center mb-4">
                    <h5 className="font-semibold text-lg dark:text-white-light">Performance Monitoring Year</h5>
                    <button className="btn btn-primary" onClick={openEdit}>
                        Update Year
                    </button>
                </div>

                <div className="datatables">
                    <DataTable
                        noRecordsText="No data"
                        highlightOnHover
                        withBorder={false}
                        minHeight={220}
                        columns={columns}
                        records={allData}
                        totalRecords={allData.length}
                        page={1}
                        recordsPerPage={20}
                        onPageChange={() => {}}
                        onRecordsPerPageChange={() => {}}
                        recordsPerPageOptions={[20, 30]}
                        paginationText={({ from, to, totalRecords }) => `Showing ${from} to ${to} of ${totalRecords}`}
                    />
                </div>
            </div>

            {isPopupOpen && selectedPM && (
                <Performance_Moni_List_Popup
                    initialData={{
                        id: selectedPM.id,
                        start_date: selectedPM.raw_start,
                        end_date: selectedPM.raw_end,
                        session_type: selectedPM.session_type.toLowerCase(),
                    }}
                    closeModal={(err) => {
                        setIsPopupOpen(false);
                        if (!err) fetchPerfMoni();
                    }}
                />
            )}

            <Toaster position="top-right" reverseOrder={false} />
        </div>
    );
}
