import { useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

export interface FormField {
    id: string;
    label: string;
    type: string;
    value?: string | number;
    options?: { value: string | number; label: string }[];
    helpText?: string;
}

interface FormComponentProps {
    fields: FormField[];
    onSubmit: (data: any) => void;
    onCancel: () => void;
    isLoading?: boolean;
    initialValues?: Record<string, any>;
    onValueChange?: (fieldId: string, value: any) => void;
}

const Common_Popup = ({ fields, onSubmit, onCancel, initialValues = {}, isLoading = false, onValueChange }: FormComponentProps) => {
    const [formData, setFormData] = useState<Record<string, string | number | File | null>>(() =>
        fields.reduce((acc, field) => {
            acc[field.id] = initialValues[field.id] ?? (field.type === 'file' ? null : '');
            return acc;
        }, {} as Record<string, string | number | File | null>)
    );

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        const newVal = type === 'file' && e.target instanceof HTMLInputElement ? e.target.files?.[0] || null : value;
        setFormData((prev) => ({
            ...prev,
            [name]: type === 'file' && e.target instanceof HTMLInputElement ? e.target.files?.[0] || null : value,
        }));

        if (onValueChange) onValueChange(name, newVal);
    };

    const handleQuillChange = (id: string, value: string) => {
        setFormData((prev) => ({ ...prev, [id]: value }));
        if (onValueChange) onValueChange(id, value);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!isLoading) {
            onSubmit(formData);
        }
    };

    const renderField = (field: FormField) => {
        switch (field.type) {
            case 'textarea':
                return <ReactQuill theme="snow" value={formData[field.id] as string} onChange={(val) => handleQuillChange(field.id, val)} />;
            case 'select':
                return (
                    <select id={field.id} name={field.id} className="form-select mt-1 w-full" value={formData[field.id] as string} onChange={handleChange} required>
                        <option value="" disabled>
                            Select an option
                        </option>
                        {field.options?.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                                {opt.label}
                            </option>
                        ))}
                    </select>
                );
            case 'file':
                return <input id={field.id} name={field.id} type="file" className="form-input mt-1 w-full" onChange={handleChange} />;
            default:
                return <input id={field.id} name={field.id} type={field.type} className="form-input mt-1 w-full" value={formData[field.id] as string} onChange={handleChange} required />;
        }
    };

    return (
        <form className="w-full" onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                {fields.map((field) => (
                    <div key={field.id} className={field.type === 'textarea' || field.type === 'file' ? 'col-span-2' : ''}>
                        <label htmlFor={field.id} className="block mb-1 font-medium">
                            {field.label}
                        </label>
                        {renderField(field)}
                        {field.helpText && <small className="text-gray-500 block mt-1">{field.helpText}</small>}
                    </div>
                ))}
            </div>

            <div className="flex justify-end mt-6 space-x-4">
                <button type="button" className="btn btn-outline-danger" onClick={onCancel} disabled={isLoading}>
                    Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={isLoading}>
                    {isLoading ? 'Saving…' : 'Submit'}
                </button>
            </div>
        </form>
    );
};

export default Common_Popup;
