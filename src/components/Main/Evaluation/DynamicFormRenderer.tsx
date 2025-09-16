// src/components/DynamicFormRenderer.tsx
import React, { useState } from 'react';

export type SnapshotQuestion = {
    id: string;
    text: string;
    qtype: string; // 'bool'|'rating'|'choice'|'text'
    weight?: number;
    required?: boolean;
    meta?: any;
};

type AnswerShape = {
    question_id: string;
    question_text?: string;
    qtype?: string;
    raw_value?: any;
    numeric_value?: number | null;
};

type Props = {
    snapshot: SnapshotQuestion[];
    initialAnswers?: AnswerShape[];
    onSubmit: (payload: { answers: AnswerShape[] }) => void;
    submitLabel?: string;
};

export default function DynamicFormRenderer({ snapshot, initialAnswers = [], onSubmit, submitLabel = 'Submit' }: Props) {
    const [answersMap, setAnswersMap] = useState<Record<string, AnswerShape>>(() => {
        const map: Record<string, AnswerShape> = {};
        initialAnswers.forEach((a) => (map[a.question_id] = a));
        return map;
    });

    function change(id: string, raw: any, numeric: number | null = null) {
        const q = snapshot.find((s) => s.id === id);
        setAnswersMap((p) => ({ ...p, [id]: { question_id: id, question_text: q?.text, qtype: q?.qtype, raw_value: raw, numeric_value: numeric } }));
    }

    function doSubmit(e?: React.FormEvent) {
        e?.preventDefault();
        const final = snapshot.map((q) => answersMap[q.id] ?? { question_id: q.id, question_text: q.text, qtype: q.qtype, raw_value: null, numeric_value: null });
        onSubmit({ answers: final });
    }

    return (
        <form onSubmit={doSubmit} className="space-y-4">
            {snapshot.map((q) => (
                <div key={q.id} className="p-3 border rounded">
                    <div className="font-medium">
                        {q.text} {q.required ? <span className="text-red-500">*</span> : null}
                    </div>
                    <div className="mt-2">
                        {q.qtype === 'bool' && (
                            <select
                                className="form-input"
                                value={String(answersMap[q.id]?.raw_value ?? '')}
                                onChange={(e) => change(q.id, e.target.value === 'true' ? true : e.target.value === 'false' ? false : null, null)}
                            >
                                <option value="">— choose —</option>
                                <option value="true">Yes / True</option>
                                <option value="false">No / False</option>
                            </select>
                        )}

                        {q.qtype === 'rating' && (
                            <div className="flex items-center gap-3">
                                <input type="range" min={0} max={10} value={answersMap[q.id]?.numeric_value ?? 0} onChange={(e) => change(q.id, Number(e.target.value), Number(e.target.value))} />
                                <div className="w-12 text-center">{answersMap[q.id]?.numeric_value ?? 0}</div>
                            </div>
                        )}

                        {q.qtype === 'choice' && (
                            <select className="form-input" value={answersMap[q.id]?.raw_value ?? ''} onChange={(e) => change(q.id, e.target.value, null)}>
                                <option value="">— choose —</option>
                                {(q.meta?.choices ?? []).map((c: any) => (
                                    <option key={c.key} value={c.key}>
                                        {c.label}
                                    </option>
                                ))}
                            </select>
                        )}

                        {q.qtype === 'text' && <textarea className="form-input w-full" value={answersMap[q.id]?.raw_value ?? ''} onChange={(e) => change(q.id, e.target.value, null)} />}
                    </div>
                </div>
            ))}

            <div className="flex justify-end">
                <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded">
                    {submitLabel}
                </button>
            </div>
        </form>
    );
}
