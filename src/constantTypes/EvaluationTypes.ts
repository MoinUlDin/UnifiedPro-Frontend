// constantTypes/EvaluationTypes.ts

export interface FormChoiceTypes {
    key: string;
    label: string;
}
export interface CommonChoiceType {
    key: string;
    label: string;
}
export interface FromBuilderChoiceType {
    form_types: CommonChoiceType[];
    question_types: CommonChoiceType[];
    assign_target_types: CommonChoiceType[];
    period_choices: CommonChoiceType[];
    qtype_meta: {
        bool: {
            input: 'select';
            options: [
                {
                    key: true;
                    label: 'Yes/True';
                },
                {
                    key: false;
                    label: 'No/False';
                }
            ];
            note: 'Stored as boolean or mapped values (true/false).';
        };
        rating: {
            input: 'range';
            min: 0;
            max: 10;
            step: 1;
            note: "Rating scale 0..10 by default. Use 'meta' in question to override.";
        };
        choice: {
            input: 'multi_or_single_select';
            note: 'Provide `meta.choices` (list of {key,label}) when creating a question.';
        };
        text: {
            input: 'textarea';
            note: 'Free text; respect `required` flag on questions.';
        };
    };
    visibility_options: CommonChoiceType[];
}
