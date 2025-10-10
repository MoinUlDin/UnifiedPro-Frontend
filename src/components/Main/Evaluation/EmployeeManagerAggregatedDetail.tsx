// EmployeeManagerAggregatedDetail.tsx
import React, { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, MessageSquare, User, Clock, CheckCircle } from 'lucide-react';
import EvaluationServices from '../../../services/EvaluationServices';
import toast from 'react-hot-toast';
import { type EmployeeManagerTypeAggregated, type boolTypeQuestion, type ratingTypeQuestion, type choiceTypeQuestion, type textTypeQuestion } from '../../../constantTypes/ManagerEvaluation';
/**
 * Reuse / adapt the interfaces you provided (copy here for local use)
 */

/** Comments type used in this page */
type CommentItem = {
    id: number;
    user: { id: number; name: string; avatar?: string | null } | null; // anonymous may be null
    text: string;
    created_at: string;
};

type Props = {
    data?: EmployeeManagerTypeAggregated | null;
    onClose?: () => void;
};

export default function EmployeeManagerAggregatedDetail({ data, onClose }: Props) {
    // if no data provided, immediately close and render nothing
    useEffect(() => {
        if (!data) {
            // call onClose if available and exit
            onClose?.();
        }
    }, [data, onClose]);

    if (!data) return null;

    const agg = data.manager_aggregate;
    const manager = agg.manager;

    const [comments, setComments] = useState<CommentItem[]>([]);
    const [loadingComments, setLoadingComments] = useState(false);
    const [newComment, setNewComment] = useState('');
    const [posting, setPosting] = useState(false);
    const [deletingId, setDeletingId] = useState<number | null>(null);

    const fmt = (d?: string | null) => {
        if (!d) return '-';
        try {
            return new Date(d).toLocaleString();
        } catch {
            return d;
        }
    };

    // load comments for aggregated assignment (assume service method exists)
    const fetchComments = async () => {
        try {
            setLoadingComments(true);
            // adapt method name if your service differs:
            const res = await EvaluationServices.getSubmissionComments?.(data.assignment_id);
            setComments(res || []);
        } catch (e) {
            console.error('Failed to load aggregated comments', e);
            toast.error('Could not load comments');
        } finally {
            setLoadingComments(false);
        }
    };

    useEffect(() => {
        // fetch comments once
        fetchComments();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data.assignment_id]);

    const handlePostComment = async () => {
        const text = newComment.trim();
        if (!text) return toast.error('Comment cannot be empty');
        setPosting(true);
        const payload = {
            submission: data.manager_aggregate.assignment_id,
            message: text,
        };
        try {
            // adapt method name / payload shape as needed for your backend
            const created = await EvaluationServices.postSubmissionComment?.(payload);

            // optimistic update
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

    const questions = agg.per_question_average || [];

    // helpers for rendering small bars
    const maxCountForRating = (q: ratingTypeQuestion) => {
        return Math.max(...Object.values(q.counts.per_rating));
    };

    return (
        <div className="p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6 gap-4">
                <div className="flex items-center gap-4">
                    <button onClick={() => onClose?.()} className="p-2 rounded border hover:bg-gray-50" title="Back">
                        <ArrowLeft className="w-5 h-5" />
                    </button>

                    <div>
                        <h1 className="text-2xl font-semibold">{data.template_name} — Manager Aggregate</h1>
                        <p className="text-sm text-gray-500">
                            Aggregated anonymous responses for <span className="font-medium">{manager.name}</span>
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <div className="bg-white border rounded-lg px-4 py-3 text-center shadow-sm">
                        <div className="text-xs text-gray-500">Avg. Score</div>
                        <div className="text-2xl font-bold">{agg.average_score?.toFixed?.(2) ?? '-'}</div>
                        <div className="text-xs text-gray-400 mt-1">
                            {agg.responded_count}/{agg.invited_count} responded
                        </div>
                    </div>
                </div>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left: questions */}
                <div className="lg:col-span-2 space-y-4">
                    <div className="bg-white rounded-lg shadow border p-4">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-xl text-gray-600">
                                    <User className="w-5 h-5" />
                                </div>
                                <div>
                                    <div className="font-medium">{manager.name}</div>
                                    <div className="text-xs text-gray-500">{manager.designation?.name ?? manager.email}</div>
                                </div>
                            </div>

                            <div className="text-sm text-gray-500 flex items-center gap-2">
                                <CheckCircle className="w-4 h-4 text-green-500" />
                                <div>Aggregated</div>
                            </div>
                        </div>

                        <div className="divide-y">
                            {questions.map((q, idx) => {
                                return (
                                    <div key={q.question_id} className="py-4">
                                        <div className="flex items-start justify-between gap-4">
                                            <div className="flex-1">
                                                <div className="font-medium">
                                                    {idx + 1}. {q.question_text}
                                                </div>
                                                <div className="text-xs text-gray-400 mt-1">{q.qtype.toUpperCase()}</div>
                                            </div>

                                            <div className="text-sm text-gray-600 text-right">
                                                <div>
                                                    Total responses: <span className="font-medium">{(q as any).total_responses ?? '-'}</span>
                                                </div>
                                                {/* For rating/choice we might show average */}
                                                {'average_numeric' in q && q.average_numeric !== null && (
                                                    <div className="text-xs text-gray-500 mt-1">
                                                        Avg: <span className="font-medium">{(q as any).average_numeric}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        <div className="mt-3">
                                            {/* RATING */}
                                            {q.qtype === 'rating' &&
                                                (() => {
                                                    const rq = q as ratingTypeQuestion;
                                                    const per = rq.counts.per_rating;
                                                    const max = Math.max(...Object.values(per), 1);
                                                    return (
                                                        <div className="space-y-3">
                                                            <div className="grid grid-cols-11 gap-2 items-center text-xs text-gray-600">
                                                                {Object.keys(per).map((k) => {
                                                                    const count = per[k as keyof typeof per] || 0;
                                                                    const pct = rq.total_responses > 0 ? Math.round((count / rq.total_responses) * 100) : 0;
                                                                    return (
                                                                        <div key={k} className="col-span-11 flex items-center gap-2">
                                                                            <div className="w-8 text-right text-xs">{k}</div>
                                                                            <div className="flex-1 bg-gray-100 rounded h-3 overflow-hidden">
                                                                                <div className="h-3 bg-black" style={{ width: `${(count / (max || 1)) * 100}%` }} />
                                                                            </div>
                                                                            <div className="w-12 text-xs text-gray-500 text-right">
                                                                                {count} ({pct}%)
                                                                            </div>
                                                                        </div>
                                                                    );
                                                                })}
                                                            </div>

                                                            <div className="mt-2 grid grid-cols-3 gap-3 text-xs">
                                                                <div className="bg-gray-50 p-2 rounded">
                                                                    <div className="text-xs text-gray-500">Low</div>
                                                                    <div className="font-medium">{rq.counts.buckets.low}</div>
                                                                </div>
                                                                <div className="bg-gray-50 p-2 rounded">
                                                                    <div className="text-xs text-gray-500">Mid</div>
                                                                    <div className="font-medium">{rq.counts.buckets.mid}</div>
                                                                </div>
                                                                <div className="bg-gray-50 p-2 rounded">
                                                                    <div className="text-xs text-gray-500">High</div>
                                                                    <div className="font-medium">{rq.counts.buckets.high}</div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    );
                                                })()}

                                            {/* BOOL */}
                                            {q.qtype === 'bool' &&
                                                (() => {
                                                    const bq = q as boolTypeQuestion;
                                                    const total = Math.max(1, bq?.counts?.yes + bq?.counts?.no);
                                                    const yesPct = Math.round((bq.counts.yes / total) * 100);
                                                    const noPct = Math.round((bq.counts.no / total) * 100);
                                                    return (
                                                        <div className="flex items-center gap-4">
                                                            <div className="flex-1">
                                                                <div className="text-sm font-medium">{bq.counts.yes} Yes</div>
                                                                <div className="w-full bg-gray-200 rounded h-2 mt-2 overflow-hidden">
                                                                    <div className="h-2 bg-black" style={{ width: `${yesPct}%` }} />
                                                                </div>
                                                                <div className="text-xs text-gray-500 mt-1">{yesPct}% yes</div>
                                                            </div>

                                                            <div className="w-28 text-sm text-gray-600 text-right">
                                                                <div>
                                                                    No: <span className="font-medium">{bq.counts.no}</span>
                                                                </div>
                                                                <div className="text-xs text-gray-400">{noPct}%</div>
                                                            </div>
                                                        </div>
                                                    );
                                                })()}

                                            {/* CHOICE => show buckets only */}
                                            {q.qtype === 'choice' &&
                                                (() => {
                                                    const cq = q as choiceTypeQuestion;
                                                    // attempt to read buckets from counts (server should provide buckets or bucket_percent)
                                                    const buckets = (cq.counts as any).buckets ?? null;
                                                    const bucketPercent = (cq.counts as any).bucket_percent ?? null;
                                                    if (buckets) {
                                                        const total = buckets.low + buckets.mid + buckets.high || 1;
                                                        return (
                                                            <div className="space-y-3">
                                                                <div className="grid grid-cols-3 gap-3 text-xs">
                                                                    <div className="bg-gray-50 p-3 rounded">
                                                                        <div className="text-xs text-gray-500">Low</div>
                                                                        <div className="font-medium text-lg">{buckets.low}</div>
                                                                        {bucketPercent && <div className="text-xs text-gray-400">{bucketPercent.low}%</div>}
                                                                    </div>
                                                                    <div className="bg-gray-50 p-3 rounded">
                                                                        <div className="text-xs text-gray-500">Mid</div>
                                                                        <div className="font-medium text-lg">{buckets.mid}</div>
                                                                        {bucketPercent && <div className="text-xs text-gray-400">{bucketPercent.mid}%</div>}
                                                                    </div>
                                                                    <div className="bg-gray-50 p-3 rounded">
                                                                        <div className="text-xs text-gray-500">High</div>
                                                                        <div className="font-medium text-lg">{buckets.high}</div>
                                                                        {bucketPercent && <div className="text-xs text-gray-400">{bucketPercent.high}%</div>}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        );
                                                    } else {
                                                        // fallback: compute buckets from options' scores (best-effort)
                                                        const opts = cq.counts.options || [];
                                                        // naive split by score: score <=5 low, 6-7 mid, >=8 high (example)
                                                        const low = opts.filter((o) => o.score <= 5).reduce((s, o) => s + (o.count || 0), 0);
                                                        const mid = opts.filter((o) => o.score > 5 && o.score < 8).reduce((s, o) => s + (o.count || 0), 0);
                                                        const high = opts.filter((o) => o.score >= 8).reduce((s, o) => s + (o.count || 0), 0);
                                                        const total = Math.max(1, low + mid + high);
                                                        return (
                                                            <div className="space-y-3">
                                                                <div className="grid grid-cols-3 gap-3 text-xs">
                                                                    <div className="bg-gray-50 p-3 rounded">
                                                                        <div className="text-xs text-gray-500">Low</div>
                                                                        <div className="font-medium text-lg">{low}</div>
                                                                        <div className="text-xs text-gray-400">{Math.round((low / total) * 100)}%</div>
                                                                    </div>
                                                                    <div className="bg-gray-50 p-3 rounded">
                                                                        <div className="text-xs text-gray-500">Mid</div>
                                                                        <div className="font-medium text-lg">{mid}</div>
                                                                        <div className="text-xs text-gray-400">{Math.round((mid / total) * 100)}%</div>
                                                                    </div>
                                                                    <div className="bg-gray-50 p-3 rounded">
                                                                        <div className="text-xs text-gray-500">High</div>
                                                                        <div className="font-medium text-lg">{high}</div>
                                                                        <div className="text-xs text-gray-400">{Math.round((high / total) * 100)}%</div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        );
                                                    }
                                                })()}

                                            {/* TEXT */}
                                            {q.qtype === 'text' &&
                                                (() => {
                                                    const tq = q as textTypeQuestion;
                                                    const other = (q as any).counts_other ?? []; // fallback
                                                    // If no detailed free-text available on this payload, show a placeholder message
                                                    const freeTexts = (q as any).average_numeric;
                                                    return (
                                                        <div className="space-y-2">
                                                            {Array.isArray(freeTexts) && freeTexts.length > 0 ? (
                                                                freeTexts.slice(0, 6).map((t: string, i: number) => (
                                                                    <div key={i} className="p-2 bg-gray-50 rounded text-sm">
                                                                        {t}
                                                                    </div>
                                                                ))
                                                            ) : (
                                                                <div className="text-sm text-gray-500">No free-text responses available.</div>
                                                            )}
                                                        </div>
                                                    );
                                                })()}
                                        </div>
                                    </div>
                                );
                            })}

                            {questions.length === 0 && <div className="py-8 text-center text-gray-500">No question aggregates available.</div>}
                        </div>
                    </div>
                </div>

                {/* Right: comments & metadata */}
                <div className="space-y-4">
                    <div className="bg-white rounded-lg shadow border p-4">
                        <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                                <MessageSquare className="w-5 h-5 text-gray-600" />
                                <div className="font-medium">Comments / Notes</div>
                            </div>
                            <div className="text-xs text-gray-400">{loadingComments ? 'Loading…' : `${comments.length} comment(s)`}</div>
                        </div>

                        {/* comment input */}
                        <div className="mb-3">
                            <textarea
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                placeholder="Add a private note or annotation about this aggregate..."
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

                        <div className="space-y-3">
                            {comments.map((c) => (
                                <div key={c.id} className="flex items-start gap-3">
                                    <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-sm font-medium text-gray-700">
                                        {c.user?.name
                                            ? c.user.name
                                                  .split(' ')
                                                  .map((p) => p[0])
                                                  .slice(0, 2)
                                                  .join('')
                                            : 'AN'}
                                    </div>

                                    <div className="flex-1">
                                        <div className="flex items-center justify-between gap-2">
                                            <div>
                                                <div className="font-medium text-sm">{c.user?.name ?? 'Anonymous'}</div>
                                                <div className="text-xs text-gray-400">{fmt(c.created_at)}</div>
                                            </div>

                                            <div>
                                                <button className="text-xs text-red-500" onClick={() => handleDeleteComment(c.id)} disabled={deletingId === c.id}>
                                                    {deletingId === c.id ? 'Deleting…' : 'Delete'}
                                                </button>
                                            </div>
                                        </div>

                                        <div className="mt-1 text-sm">{c.text}</div>
                                    </div>
                                </div>
                            ))}

                            {comments.length === 0 && !loadingComments && <div className="text-sm text-gray-500">No comments yet.</div>}
                        </div>
                    </div>

                    {/* metadata */}
                    <div className="bg-white rounded-lg shadow border p-4 text-sm">
                        <div className="mb-3 font-medium">Aggregate details</div>
                        <div className="space-y-2 text-gray-600">
                            <div>
                                Invited: <span className="font-medium ml-1">{agg.invited_count}</span>
                            </div>
                            <div>
                                Responded: <span className="font-medium ml-1">{agg.responded_count}</span>
                            </div>
                            <div>
                                Pending: <span className="font-medium ml-1">{agg.pending_count}</span>
                            </div>
                            <div>
                                Assignment: <span className="font-medium ml-1">{data.template_name}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
