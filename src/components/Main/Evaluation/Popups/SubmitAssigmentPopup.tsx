import React, { useEffect, useMemo, useState } from 'react';
import { X, ChevronLeft, ChevronRight, Save, Check, ArrowRightCircle } from 'lucide-react';
import EvaluationServices from '../../../../services/EvaluationServices';
import { type Evaluatee } from '../../../../constantTypes/ManagerEvaluation';

type Props = {
    assignmentId: number;
    open: boolean;
    onClose: () => void;
    targetUser?: Evaluatee | null;
    onSuccess?: () => void;
};

type QuestionBase = {
    id: number;
    text: string;
    required?: boolean;
    weight?: number;
    // UI hint:
    type: 'rating' | 'text' | 'choice' | 'bool';
    meta: {};
};

type RatingQuestion = QuestionBase & {
    qtype: 'rating';
    min?: number;
    max?: number;
    step?: number;
    // optional labels
    left_label?: string;
    right_label?: string;
};

type TextQuestion = QuestionBase & {
    qtype: 'text';
    placeholder?: string;
    min_length?: number;
    max_length?: number;
};

type SingleChoiceQuestion = QuestionBase & {
    qtype: 'bool';
    options: { key: string | number; label: string }[];
};

type MultipleChoiceQuestion = QuestionBase & {
    qtype: 'choice';
    options: { key: string | number; label: string }[];
    meta: {
        choices: [
            {
                key: string;
                label: string;
                score: 5;
            },
            {
                key: string;
                label: string;
                score: 10;
            },
            {
                key: string;
                label: string;
                score: 15;
            },
            {
                key: string;
                label: string;
                score: 20;
            }
        ];
    };
};

type Question = RatingQuestion | TextQuestion | SingleChoiceQuestion | MultipleChoiceQuestion;

type AssignmentPayload = {
    assignment: {
        id: number;
        form_name: string;
        template_version: number;
        target_user?: number;
    };
    questions: Question[];
};

// answer types
type AnswerValue = number | string | Array<string | number> | null;

type Answer = {
    question_id: number;
    value: AnswerValue;
};

export default function SubmitAssigmentPopup({ assignmentId, open, onClose, targetUser = null, onSuccess }: Props) {
    const [loading, setLoading] = useState<boolean>(false);
    const [assignmentData, setAssignmentData] = useState<AssignmentPayload | null>(null);
    const [currentIndex, setCurrentIndex] = useState<number>(0);
    const [answers, setAnswers] = useState<Record<number, Answer>>({});
    const [saving, setSaving] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showSuccess, setShowSuccess] = useState<string | null>(null);

    // Helper: return the id we should send as target_user, or undefined
    const getTargetUserId = (u?: Evaluatee | null): number | undefined => {
        if (!u) return undefined;
        const anyu = u as any;
        if (typeof anyu.user_id === 'number' && !Number.isNaN(anyu.user_id)) return anyu.user_id;
        if (typeof anyu.allusers_id === 'number' && !Number.isNaN(anyu.allusers_id)) return anyu.allusers_id;
        if (typeof anyu.id === 'number' && !Number.isNaN(anyu.id)) return anyu.id;
        return undefined;
    };

    // Fetch assignment + questions when modal opens or assignmentId changes
    useEffect(() => {
        if (!open) return;
        if (!assignmentId) return;

        let mounted = true;
        setLoading(true);
        setError(null);
        setAssignmentData(null);
        setCurrentIndex(0);
        setAnswers({});
        if (!mounted) return;
        EvaluationServices.getAssignmentQuestions(assignmentId)
            .then((res: any) => {
                // Expected res: { assignment: {...}, questions: [...] }
                console.log('Question: ', res);
                setAssignmentData(res);

                // seed answers with nulls:
                const seeded: Record<number, Answer> = {};
                (res.questions || []).forEach((q: Question) => {
                    seeded[q.id] = { question_id: q.id, value: null };
                });
                setAnswers(seeded);
            })
            .catch((e: any) => {
                console.error('Failed to fetch assignment questions', e);
                setError('Failed to load assignment. Please try again.');
            })
            .finally(() => {
                if (mounted) setLoading(false);
            });

        return () => {
            mounted = false;
        };
    }, [assignmentId, open]);

    const questions = assignmentData?.questions ?? [];

    const total = questions.length;
    const currentQ = questions[currentIndex];

    const progressPercent = useMemo(() => {
        if (total === 0) return 0;
        return Math.round(((currentIndex + 1) / total) * 100);
    }, [currentIndex, total]);

    const setAnswerValue = (questionId: number, value: Answer['value']) => {
        setAnswers((prev) => ({
            ...prev,
            [questionId]: { question_id: questionId, value },
        }));
    };

    const canProceed = (index: number) => {
        const q = questions[index];
        if (!q) return true;
        if (!q.required) return true;
        const a = answers[q.id];
        if (!a) return false;
        if (a.value === null) return false;
        // for arrays check length
        if (Array.isArray(a.value)) return a.value.length > 0;
        if (typeof a.value === 'string') return a.value.trim().length > 0;
        return true;
    };

    const handleNext = () => {
        setError(null);
        // validate current
        if (!canProceed(currentIndex)) {
            setError('This question is required.');
            return;
        }
        if (currentIndex < total - 1) {
            setCurrentIndex((s) => s + 1);
            setError(null);
        }
    };

    const handlePrev = () => {
        setError(null);
        if (currentIndex > 0) {
            setCurrentIndex((s) => s - 1);
        }
    };

    const handleSaveDraft = async () => {
        setSaving(true);
        setError(null);
        setShowSuccess(null);
        try {
            // prepare payload: collect answers into array
            const answersArr = Object.values(answers)
                .filter(Boolean)
                .map((a) => ({ question_id: a!.question_id, value: a!.value }));

            const payload: any = { answers: answersArr };
            const tuid = getTargetUserId(targetUser);
            if (typeof tuid === 'number') payload.target_user = tuid;

            await EvaluationServices.saveDraft(assignmentId, payload);
            setShowSuccess('Draft saved');
            setTimeout(() => setShowSuccess(null), 2000);
        } catch (e: any) {
            console.error(e);
            setError('Failed to save draft.');
        } finally {
            setSaving(false);
        }
    };

    const handleSubmit = async () => {
        setSubmitting(true);
        setError(null);

        // validate all required
        for (let i = 0; i < total; i++) {
            if (!canProceed(i)) {
                setCurrentIndex(i);
                setError('Please answer the required question before submitting.');
                setSubmitting(false);
                return;
            }
        }

        try {
            const answersArr = Object.values(answers)
                .filter(Boolean)
                .map((a) => ({ question_id: a!.question_id, value: a!.value }));
            const payload: any = {
                assignment: assignmentId,
                answers: answersArr,
                submitted_at: new Date().toISOString(),
            };
            const tuid = getTargetUserId(targetUser);
            if (typeof tuid === 'number') payload.target_user = tuid;

            console.log('Assingment submit Payload: ', payload);

            const response = await EvaluationServices.submitResponses(assignmentId, payload);
            setShowSuccess('Submitted successfully');
            console.log('submit Respoonse: ', response);
            // optional: close modal shortly after success
            onSuccess?.();
            setTimeout(() => {
                setShowSuccess(null);
                onClose();
            }, 1000);
        } catch (e: any) {
            const msg = e.response?.data?.detail;
            console.error('Submit failed', msg);
            setError(msg);
        } finally {
            setSubmitting(false);
        }
    };

    // Renderers for question types
    const renderQuestion = (q: Question) => {
        const answerObj = answers[q.id] ?? { question_id: q.id, value: null };
        const val = answerObj.value;

        switch (q.qtype) {
            case 'rating': {
                const r = q as RatingQuestion;
                const min = r.min ?? 0;
                const max = r.max ?? 10;
                const step = r.step ?? 1;
                const numericValue = typeof val === 'number' ? (val as number) : Math.round((min + max) / 2);

                return (
                    <div className="space-y-3">
                        <div className="flex items-center justify-between text-sm text-gray-600">
                            <div className="text-sm">
                                Rate from {min} to {max}
                            </div>
                            <div className="text-sm font-medium">{numericValue}</div>
                        </div>

                        <input
                            type="range"
                            min={min}
                            max={max}
                            step={step}
                            value={typeof val === 'number' ? (val as number) : numericValue}
                            onChange={(e) => setAnswerValue(q.id, Number(e.target.value))}
                            className="w-full"
                        />

                        <div className="flex justify-between text-xs text-gray-400">
                            <div>{r.left_label ?? `${min} - Poor`}</div>
                            <div className="text-center">{Math.round((min + max) / 2)}</div>
                            <div className="text-right">{r.right_label ?? `${max} - Excellent`}</div>
                        </div>
                    </div>
                );
            }

            case 'text': {
                const t = q as TextQuestion;
                return (
                    <textarea
                        className="w-full border rounded p-3 min-h-[120px] text-sm"
                        placeholder={t.placeholder ?? 'Write your answer...'}
                        value={typeof val === 'string' ? (val as string) : ''}
                        onChange={(e) => setAnswerValue(q.id, e.target.value)}
                    />
                );
            }

            case 'bool': {
                const sc = q as SingleChoiceQuestion;
                return (
                    <div className="flex flex-col gap-2">
                        <label className="flex items-center gap-2 cursor-pointer select-none">
                            <input type="radio" name={`q-${q.id}`} checked={val === 1} onChange={() => setAnswerValue(q.id, 1)} />
                            <span>Yes</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer select-none">
                            <input type="radio" name={`q-${q.id}`} checked={val === 0} onChange={() => setAnswerValue(q.id, 0)} />
                            <span>No</span>
                        </label>
                    </div>
                );
            }

            case 'choice': {
                // NOTE: 'choice' is treated here as single-choice (radio) as requested.
                const mc = q as MultipleChoiceQuestion;
                const selected = Array.isArray(val) ? (val as Array<string | number>) : val !== null ? [val] : [];
                // we will store a single value (string | number) for choice questions
                return (
                    <div className="flex flex-col gap-2">
                        {mc?.meta?.choices.map((opt) => {
                            const checked = String(selected.find((s) => String(s) === String(opt.key)) ?? '') === String(opt.key);
                            return (
                                <label key={opt.key} className="flex items-center gap-2 cursor-pointer select-none">
                                    <input
                                        type="radio"
                                        name={`q-${q.id}`}
                                        checked={checked}
                                        onChange={() => {
                                            // set single value (not array) — ensures previous selection is replaced immediately
                                            setAnswerValue(q.id, opt.key);
                                        }}
                                    />
                                    <span>{opt.label}</span>
                                </label>
                            );
                        })}
                    </div>
                );
            }

            default:
                return <div>Unsupported question type</div>;
        }
    };

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
                className="absolute inset-0 bg-black/40"
                onClick={() => {
                    if (!submitting && !saving) onClose();
                }}
            />

            <div className="relative w-full max-w-2xl bg-white rounded-lg shadow-lg z-10">
                <div className="px-6 py-4 border-b flex items-start justify-between">
                    <div>
                        <h3 className="text-lg font-semibold">{assignmentData?.assignment?.form_name ?? 'Evaluation'}</h3>
                        <div className="text-sm text-gray-500">
                            Question {total === 0 ? '-' : currentIndex + 1} of {total}
                        </div>
                    </div>
                    <button
                        onClick={() => {
                            if (!submitting && !saving) onClose();
                        }}
                        className="p-2 rounded hover:bg-gray-100"
                        title="Close"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="px-6 py-4">
                    {/* progress */}
                    <div className="flex items-center justify-between mb-3 text-sm text-gray-600">
                        <div>Progress</div>
                        <div>{progressPercent}%</div>
                    </div>
                    <div className="w-full bg-gray-200 rounded h-2 mb-6 overflow-hidden">
                        <div className="h-full bg-black" style={{ width: `${progressPercent}%` }} />
                    </div>

                    {loading && <div className="text-center py-8">Loading questions...</div>}

                    {!loading && total === 0 && <div className="text-center py-8 text-gray-600">No questions found.</div>}

                    {!loading && currentQ && (
                        <div className="space-y-4">
                            <div className="flex items-start justify-between">
                                <div>
                                    <h4 className="text-base font-medium">{currentQ.text}</h4>
                                </div>
                                <div className="text-xs text-gray-500">
                                    {currentQ.required ? <span className="px-2 py-1 bg-gray-100 rounded">Required</span> : <span className="px-2 py-1 bg-gray-50 rounded">Optional</span>}
                                    {currentQ.weight ? <span className="ml-2 px-2 py-1 bg-gray-50 rounded">Wt: {currentQ.weight}</span> : null}
                                </div>
                            </div>

                            <div>{renderQuestion(currentQ)}</div>

                            {error && <div className="text-red-600 text-sm">{error}</div>}
                            {showSuccess && <div className="text-green-600 text-sm">{showSuccess}</div>}
                        </div>
                    )}
                </div>

                <div className="px-6 py-4 border-t flex items-center gap-3">
                    <button className="flex items-center gap-2 px-3 py-2 rounded border bg-white text-sm" onClick={handlePrev} disabled={currentIndex === 0 || saving || submitting}>
                        <ChevronLeft className="w-4 h-4" />
                        Previous
                    </button>

                    <button className="flex items-center gap-2 px-3 py-2 rounded border bg-white text-sm" onClick={handleSaveDraft} disabled={saving || submitting} title="Save draft">
                        <Save className="w-4 h-4" />
                        {saving ? 'Saving...' : 'Save Draft'}
                    </button>

                    <div className="flex-1" />

                    <div className="flex items-center gap-2">
                        {currentIndex < total - 1 ? (
                            <button className="flex items-center gap-2 px-4 py-2 rounded bg-black text-white font-medium" onClick={handleNext} disabled={submitting || saving}>
                                Next
                                <ChevronRight className="w-4 h-4" />
                            </button>
                        ) : (
                            <button
                                className="flex items-center gap-2 px-4 py-2 rounded bg-black text-white font-medium"
                                onClick={handleSubmit}
                                disabled={submitting || saving}
                                title="Submit responses"
                            >
                                {submitting ? 'Submitting...' : 'Submit'}
                                <ArrowRightCircle className="w-5 h-5" />
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
