// src/pages/SubmissionsList.tsx
import React, { useEffect, useState } from 'react';
import EvaluationServices from '../../../services/EvaluationServices';
import { Link } from 'react-router-dom';

export default function SubmissionsList() {
    const [list, setList] = useState<any[]>([]);

    useEffect(() => {
        EvaluationServices.listSubmissions()
            .then((r) => setList(r))
            .catch(console.error);
    }, []);

    return (
        <div className="p-6 max-w-6xl mx-auto">
            <h2 className="text-xl font-semibold mb-4">Your Submissions</h2>
            <div className="space-y-3">
                {list.map((s) => (
                    <div key={s.id} className="p-4 bg-white rounded shadow-sm flex justify-between">
                        <div>
                            <div className="font-medium">{s.assignment?.template_version?.title ?? 'Evaluation'}</div>
                            <div className="text-xs text-gray-500">
                                Target: {s.target_user} · Status: {s.status}
                            </div>
                        </div>
                        <div>
                            <Link to={`/evaluations/submissions/${s.id}`} className="px-3 py-1 border rounded">
                                View
                            </Link>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
