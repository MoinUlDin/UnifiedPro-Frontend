// SubmissionDetailPage.tsx
import React, { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, MessageSquare, User, Clock, CheckCircle } from 'lucide-react';
import EvaluationServices from '../../../services/EvaluationServices';
import toast from 'react-hot-toast';

type UserShort = {
    id: number;
    name: string;
    email?: string;
};

type PerQuestionBreakdown = {
    question_id: string;
    question_text: string;
    qtype: 'text' | 'rating' | 'bool' | 'choice' | string;
    raw_value: any;
    respondent_answer: any;
    weight: number;
    achieved: number;
    percent_of_weight: number; // 0-100
    selected_labels?: string[]; // for choice
};

type ComputedBreakdown = {
    per_question: PerQuestionBreakdown[];
    total_achieved: number;
    total_weight: number;
};

export type Submission = {
    id: number;
    assignment: {
        id: number;
        template_name?: string;
        template_form_type?: string;
    };
    respondent: UserShort;
    target_user: UserShort | null;
    status: string;
    submitted_at?: string | null;
    computed_score?: number | null;
    computed_breakdown?: ComputedBreakdown | null;
};

type CommentItem = {
    id: number;
    user: { id: number; name: string; avatar?: string | null };
    text: string;
    created_at: string;
};

type Props = {
    submission: Submission;
    formType?: string; // parent passes 'manager' when manager form
    onBack?: () => void;
};

export default function SubmissionDetailPage({ submission, formType, onBack }: Props) {
    const [comments, setComments] = useState<CommentItem[]>([]);
    const [loadingComments, setLoadingComments] = useState(false);
    const [newComment, setNewComment] = useState('');
    const [posting, setPosting] = useState(false);
    const [deletingId, setDeletingId] = useState<number | null>(null);

    // format date/time
    const fmt = (d?: string | null) => {
        if (!d) return '-';
        const dt = new Date(d);
        return dt.toLocaleString();
    };

    // computed values
    const breakdown = submission.computed_breakdown;
    const questions = breakdown?.per_question ?? [];
    const overallScore = submission.computed_score ?? null;

    // load comments for this submission (call service)
    const fetchComments = async () => {
        try {
            setLoadingComments(true);
            // adjust this call if your service method name differs:
            const res = await EvaluationServices.getSubmissionComments(submission.id);
            // assume res is array of comments
            setComments(res || []);
        } catch (e) {
            console.error('Failed to load comments', e);
            toast.error('Could not load comments');
        } finally {
            setLoadingComments(false);
        }
    };

    useEffect(() => {
        // fetch comments when component mounts or submission changes
        fetchComments();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [submission.id]);

    const handlePostComment = async () => {
        const text = newComment.trim();
        if (!text) return toast.error('Comment cannot be empty');
        setPosting(true);
        try {
            // call your API to create comment - adjust payload shape as needed
            const created = await EvaluationServices.postSubmissionComment(submission.id, { text });
            // optimistic: prepend to list
            setComments((s) => [created, ...s]);
            setNewComment('');
            toast.success('Comment posted');
        } catch (e) {
            console.error('Failed to post comment', e);
            toast.error('Failed to post comment');
        } finally {
            setPosting(false);
        }
    };

    const handleDeleteComment = async (id: number) => {};

    const overallPercent = useMemo(() => {
        if (!breakdown) return 0;
        const total = breakdown.total_weight || 0;
        if (total <= 0) return 0;
        return Math.round((breakdown.total_achieved / total) * 100);
    }, [breakdown]);

    return (
        <div className="p-6 ">
            {/* Header */}
            <div className="flex items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-4">
                    <button onClick={() => onBack?.()} className="p-2 rounded border hover:bg-gray-50" title="Back">
                        <ArrowLeft className="w-5 h-5" />
                    </button>

                    <div>
                        <h1 className="text-2xl font-semibold">Submission Report</h1>
                        <p className="text-sm text-gray-500">
                            {submission.assignment.template_name ?? 'Assignment'} • submitted by <span className="font-medium">{submission.respondent.name}</span>
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <div className="text-right">
                        <div className="text-xs text-gray-500">Submitted</div>
                        <div className="font-medium">{fmt(submission.submitted_at)}</div>
                    </div>

                    <div className="bg-white border rounded-lg px-4 py-3 text-center shadow-sm">
                        <div className="text-xs text-gray-500">Score</div>
                        <div className="text-2xl font-bold">{overallScore !== null ? overallScore.toFixed(2) : '-'}</div>
                        <div className="text-xs text-gray-400 mt-1">{overallPercent}% of total weight</div>
                    </div>
                </div>
            </div>

            {/* Main grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left column - questions */}
                <div className="lg:col-span-2 space-y-4">
                    <div className="bg-white rounded-lg shadow border p-4">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-xl text-gray-600">
                                    <User className="w-5 h-5" />
                                </div>
                                <div>
                                    <div className="font-medium">{submission.target_user?.name ?? submission.respondent.name}</div>
                                    <div className="text-xs text-gray-500">{submission.target_user?.email ?? submission.respondent.email}</div>
                                </div>
                            </div>

                            <div className="text-sm text-gray-500 flex items-center gap-2">
                                <CheckCircle className="w-4 h-4 text-green-500" />
                                <div className="capitalize">{submission.status ?? '—'}</div>
                            </div>
                        </div>

                        <div className="divide-y">
                            {questions.map((q, idx) => (
                                <div key={q.question_id} className="py-4 flex gap-4 items-start">
                                    <div className="w-10 text-sm text-gray-500">{idx + 1}.</div>

                                    <div className="flex-1">
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <div className="font-medium">{q.question_text}</div>
                                                <div className="text-xs text-gray-400 mt-1">{q.qtype.toUpperCase()}</div>
                                            </div>

                                            <div className="text-sm text-gray-600">
                                                <div>
                                                    Weight: <span className="font-medium">{q.weight}</span>
                                                </div>
                                                <div className="text-xs text-gray-500 mt-1">
                                                    Achieved: <span className="font-medium">{q.achieved}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="mt-3">
                                            {/* Answer rendering by qtype */}
                                            {q.qtype === 'text' && <div className="whitespace-pre-wrap text-sm">{String(q.respondent_answer ?? q.raw_value ?? '—')}</div>}

                                            {q.qtype === 'rating' && (
                                                <div className="space-y-2">
                                                    <div className="text-sm font-medium">{q.respondent_answer ?? q.raw_value}</div>
                                                    <div className="w-full bg-gray-200 rounded h-2 overflow-hidden">
                                                        <div className="h-2 bg-black" style={{ width: `${q.percent_of_weight}%` }} />
                                                    </div>
                                                    <div className="text-xs text-gray-400 mt-1">{q.percent_of_weight}% of weight</div>
                                                </div>
                                            )}

                                            {q.qtype === 'bool' && <div className="text-sm">{q.respondent_answer ? 'Yes' : 'No'}</div>}

                                            {q.qtype === 'choice' && (
                                                <div className="text-sm">
                                                    <div className="mb-1">Selected: {Array.isArray(q.selected_labels) ? q.selected_labels.join(', ') : JSON.stringify(q.respondent_answer)}</div>
                                                    {Array.isArray(q.respondent_answer) && <div className="text-xs text-gray-400">Raw: {JSON.stringify(q.respondent_answer)}</div>}
                                                </div>
                                            )}

                                            {/* fallback */}
                                            {!['text', 'rating', 'bool', 'choice'].includes(q.qtype) && <div className="text-sm">{String(q.respondent_answer ?? q.raw_value ?? '—')}</div>}
                                        </div>
                                    </div>
                                </div>
                            ))}

                            {/* summary row */}
                            <div className="py-4">
                                <div className="flex items-center justify-between">
                                    <div className="text-sm text-gray-600">Total achieved</div>
                                    <div className="text-lg font-semibold">
                                        {breakdown?.total_achieved ?? 0} / {breakdown?.total_weight ?? 0}
                                    </div>
                                </div>

                                <div className="mt-3 w-full bg-gray-200 rounded h-3 overflow-hidden">
                                    <div className="h-3 bg-black" style={{ width: `${overallPercent}%` }} />
                                </div>
                                <div className="text-xs text-gray-400 mt-2">{overallPercent}%</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right column - comments & metadata */}
                <div className="space-y-4">
                    <div className="bg-white rounded-lg shadow border p-4">
                        <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                                <MessageSquare className="w-5 h-5 text-gray-600" />
                                <div className="font-medium">Comments</div>
                            </div>
                            <div className="text-xs text-gray-400">{loadingComments ? 'Loading…' : `${comments.length} comment(s)`}</div>
                        </div>

                        {/* comment input (only for manager form type) */}
                        {formType === 'manager' && (
                            <div className="mb-3">
                                <textarea
                                    value={newComment}
                                    onChange={(e) => setNewComment(e.target.value)}
                                    placeholder="Add a comment..."
                                    className="w-full border rounded p-2 text-sm min-h-[80px]"
                                />
                                <div className="flex items-center justify-end gap-2 mt-2">
                                    <button className="px-3 py-2 rounded border bg-white text-sm" onClick={() => setNewComment('')} disabled={posting}>
                                        Cancel
                                    </button>
                                    <button className="px-3 py-2 rounded bg-black text-white text-sm" onClick={handlePostComment} disabled={posting || !newComment.trim()}>
                                        {posting ? 'Posting…' : 'Post Comment'}
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* comments list */}
                        <div className="space-y-3">
                            {comments.map((c) => (
                                <div key={c?.id} className="flex items-start gap-3">
                                    <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-sm font-medium text-gray-700">
                                        {c?.user?.name
                                            .split(' ')
                                            .map((p) => p[0])
                                            .slice(0, 2)
                                            .join('')}
                                    </div>

                                    <div className="flex-1">
                                        <div className="flex items-center justify-between gap-2">
                                            <div>
                                                <div className="font-medium text-sm">{c?.user?.name}</div>
                                                <div className="text-xs text-gray-400">{fmt(c?.created_at)}</div>
                                            </div>

                                            {/* delete only available for manager form type (you can restrict further) */}
                                            {formType === 'manager' && (
                                                <div>
                                                    <button className="text-xs text-red-500" onClick={() => handleDeleteComment(c?.id)} disabled={deletingId === c?.id}>
                                                        {deletingId === c?.id ? 'Deleting…' : 'Delete'}
                                                    </button>
                                                </div>
                                            )}
                                        </div>

                                        <div className="mt-1 text-sm">{c?.text}</div>
                                    </div>
                                </div>
                            ))}

                            {comments.length === 0 && !loadingComments && <div className="text-sm text-gray-500">No comments yet.</div>}
                        </div>
                    </div>

                    {/* metadata card */}
                    <div className="bg-white rounded-lg shadow border p-4 text-sm">
                        <div className="mb-3 font-medium">Submission details</div>
                        <div className="space-y-2 text-gray-600">
                            <div className="flex items-center gap-2">
                                <Clock className="w-4 h-4 text-gray-400" />
                                <div>
                                    Submitted at: <span className="font-medium ml-1">{fmt(submission.submitted_at)}</span>
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <User className="w-4 h-4 text-gray-400" />
                                <div>
                                    Respondent: <span className="font-medium ml-1">{submission.respondent.name}</span>
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <div>
                                    Assignment: <span className="font-medium ml-1">{submission.assignment.template_name}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
