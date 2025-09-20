// src/pages/AggregateReport.tsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import EvaluationServices from '../../../services/EvaluationServices';

type Params = { userId: string };

export default function AggregateReport() {
    const { userId } = useParams<Params>();
    const [payload, setPayload] = useState<any | null>(null);
    const [dates, setDates] = useState({ start: '', end: '' });

    useEffect(() => {
        if (!userId) return;
        (async () => {
            try {
                const r = await EvaluationServices.aggregateForTarget(userId, { start_date: dates.start, end_date: dates.end });
                setPayload(r);
            } catch (e) {
                console.error(e);
                setPayload(null);
            }
        })();
    }, [userId, dates]);

    return (
        <div className="p-6 max-w-6xl mx-auto">
            <div className="mb-4 flex gap-3 items-center">
                <label>Start</label>
                <input type="date" value={dates.start} onChange={(e) => setDates((d) => ({ ...d, start: e.target.value }))} className="form-input" />
                <label>End</label>
                <input type="date" value={dates.end} onChange={(e) => setDates((d) => ({ ...d, end: e.target.value }))} className="form-input" />
            </div>

            {!payload ? (
                <div>Loading...</div>
            ) : (
                <div className="bg-white p-6 rounded shadow">
                    <div className="text-lg font-semibold">Target: {payload.target_user}</div>
                    <div className="mt-3">Count: {payload.count}</div>
                    <div>Average score: {payload.average_score ?? '—'}</div>

                    <div className="mt-4">
                        <h4 className="font-medium">Per-question average</h4>
                        <pre className="bg-slate-50 p-3 rounded mt-2 text-sm">{JSON.stringify(payload.per_question_average, null, 2)}</pre>
                    </div>

                    <div className="mt-4">
                        <h4 className="font-medium">Text feedback (anonymized)</h4>
                        <ul className="list-disc pl-6 mt-2 text-sm">
                            {(payload.text_feedback_anonymized ?? []).map((t: any, i: number) => (
                                <li key={i}>{t.text ?? t}</li>
                            ))}
                        </ul>
                    </div>
                </div>
            )}
        </div>
    );
}
