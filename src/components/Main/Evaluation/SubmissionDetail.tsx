// src/pages/SubmissionDetail.tsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import EvaluationServices from '../../../services/EvaluationServices';
import DynamicFormRenderer from './DynamicFormRenderer';

type Params = { id: string };

export default function SubmissionDetail() {
    const { id } = useParams<Params>();
    const [submission, setSubmission] = useState<any | null>(null);

    useEffect(() => {
        if (!id) return;
        EvaluationServices.retrieveSubmission(id)
            .then((r) => setSubmission(r))
            .catch((e) => {
                console.error(e);
                alert('Failed to fetch submission: ' + e.message);
            });
    }, [id]);

    if (!submission) return <div className="p-6">Loading...</div>;

    const snapshot = submission.assignment?.template_version?.snapshot ?? [];

    return (
        <div className="p-6 max-w-6xl mx-auto">
            <div className="bg-white p-6 rounded shadow">
                <div className="flex justify-between items-start">
                    <div>
                        <div className="text-lg font-semibold">{submission.assignment?.template_version?.title}</div>
                        <div className="text-sm text-gray-600">
                            Target: {submission.target_user} · Respondent: {submission.respondent}
                        </div>
                    </div>
                    <div className="text-right">
                        <div className="text-sm text-gray-500">Status: {submission.status}</div>
                        <div className="text-2xl font-bold">{submission.computed_score ?? '—'}</div>
                    </div>
                </div>

                <div className="mt-6">
                    <h4 className="font-medium mb-3">Answers</h4>
                    {/* Render a read-only view of answers */}
                    <DynamicFormRenderer
                        snapshot={snapshot}
                        initialAnswers={(submission.answers ?? []).map((a: any) => ({
                            question_id: a.question_id,
                            raw_value: a.raw_value,
                            numeric_value: a.numeric_value,
                            question_text: a.question_text,
                            qtype: a.qtype,
                        }))}
                        onSubmit={() => {}}
                        submitLabel="View only"
                    />
                </div>
            </div>
        </div>
    );
}
