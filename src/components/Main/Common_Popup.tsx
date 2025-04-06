import { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

export interface FormField {
    id: string;
    label: string;
    type: string;
    value: string | number;
    options?: { value: string; label: string }[];
    helpText?: string;
}

interface FormComponentProps {
    fields: FormField[];
    onSubmit: (data: any) => void;
    onCancel: () => void;
    initialValues?: Record<string, string | number | File | null>;
}

const Common_Popup = ({ fields, onSubmit, onCancel, initialValues = {} }: FormComponentProps) => {
    const [formData, setFormData] = useState<Record<string, string | number | File | null>>(() => {
        return fields.reduce((acc, field) => {
            acc[field.id] = initialValues[field.id] ?? (field.type === "file" ? null : "");
            return acc;
        }, {} as Record<string, string | number | File | null>);
    });

    const resetForm = () => setFormData({ ...initialValues });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: type === "file" && e.target instanceof HTMLInputElement ? e.target.files?.[0] || null : value,
        }));
    };

    const handleQuillChange = (id: string, value: string) => {
        setFormData((prevData) => ({
            ...prevData,
            [id]: value,
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
    };

    const renderField = (field: FormField) => {
        if (field.type === "textarea") {
            return (
                <ReactQuill
                    theme="snow"
                    value={formData[field.id] as string}
                    onChange={(value) => handleQuillChange(field.id, value)}
                />
            );
        } else if (field.type === "select") {
            return (
                <select
                    id={field.id}
                    name={field.id}
                    className="form-select"
                    value={formData[field.id] as string}
                    onChange={handleChange}
                    required
                >
                    <option value="" disabled>
                        Select an option
                    </option>
                    {field.options?.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
            );
        } else if (field.type === "file") {
            return <input id={field.id} name={field.id} type="file" className="form-input" onChange={handleChange} />;
        } else {
            return (
                <input
                    id={field.id}
                    name={field.id}
                    type={field.type}
                    value={formData[field.id] as string}
                    className="form-input"
                    onChange={handleChange}
                    required
                />
            );
        }
    };

    return (
        <form className="w-full" onSubmit={handleSubmit}>
            {fields.map((field) => (
                <div className="mb-5" key={field.id}>
                    <label htmlFor={field.id} className="block mb-2">
                        {field.label}
                    </label>
                    {renderField(field)}
                    {field.helpText && <small className="text-gray-500">{field.helpText}</small>}
                </div>
            ))}
            <div className="flex justify-end mt-8">
                <button type="button" className="btn btn-outline-danger" onClick={onCancel}>
                    Cancel
                </button>
                <button type="submit" className="btn btn-primary ml-4">
                    Submit
                </button>
            </div>
        </form>
    );
};

export default Common_Popup;
