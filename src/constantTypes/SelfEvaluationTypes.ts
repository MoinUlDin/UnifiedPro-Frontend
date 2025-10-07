import { type userTypeBasic, type questionTypeBasic } from './ManagerEvaluation';
export interface SelfEvaluationSubmitType {
    id: 15;
    assignment: {
        id: 5;
        template_name: 'Self-Evaluation';
        template_form_type: 'self';
    };
    respondent: userTypeBasic;
    target_user: userTypeBasic;
    status: 'submitted';
    submitted_at: '2025-10-06T17:29:41.520605+05:00';
    computed_score: 9.45;
    computed_breakdown: {
        per_question: questionTypeBasic[];
        total_achieved: 38.75;
        total_weight: 41;
    };
}
