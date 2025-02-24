import React, { useState } from 'react';
import { FiPlus, FiEdit2, FiTrash2, FiSave } from 'react-icons/fi';
import { Form, FormField } from '../types';

interface CustomFormProps {
    form?: Form;
    onSave: (form: Partial<Form>) => void;
    onSubmit: (formData: Record<string, any>) => void;
    isEditMode?: boolean;
}

export const CustomForm: React.FC<CustomFormProps> = ({
    form,
    onSave,
    onSubmit,
    isEditMode = false,
}) => {
    const [fields, setFields] = useState<FormField[]>(form?.fields || []);
    const [formData, setFormData] = useState<Record<string, any>>({});
    const [showFieldModal, setShowFieldModal] = useState(false);
    const [newField, setNewField] = useState<Partial<FormField>>({});

    const handleAddField = () => {
        if (newField.label && newField.type) {
            setFields([
                ...fields,
                {
                    id: Date.now().toString(),
                    label: newField.label,
                    type: newField.type as FormField['type'],
                    required: newField.required || false,
                    options: newField.options,
                    validation: newField.validation,
                    placeholder: newField.placeholder,
                },
            ]);
            setShowFieldModal(false);
            setNewField({});
        }
    };

    const handleFieldChange = (fieldId: string, value: any) => {
        setFormData({
            ...formData,
            [fieldId]: value,
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isEditMode) {
            onSave({ fields });
        } else {
            onSubmit(formData);
        }
    };

    const renderField = (field: FormField) => {
        switch (field.type) {
            case 'text':
            case 'number':
            case 'date':
                return (
                    <input
                        type={field.type}
                        id={field.id}
                        placeholder={field.placeholder}
                        required={field.required}
                        value={formData[field.id] || ''}
                        onChange={(e) => handleFieldChange(field.id, e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                );
            case 'textarea':
                return (
                    <textarea
                        id={field.id}
                        placeholder={field.placeholder}
                        required={field.required}
                        value={formData[field.id] || ''}
                        onChange={(e) => handleFieldChange(field.id, e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        rows={4}
                    />
                );
            case 'select':
                return (
                    <select
                        id={field.id}
                        required={field.required}
                        value={formData[field.id] || ''}
                        onChange={(e) => handleFieldChange(field.id, e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    >
                        <option value="">Select an option</option>
                        {field.options?.map((option) => (
                            <option key={option} value={option}>
                                {option}
                            </option>
                        ))}
                    </select>
                );
            case 'checkbox':
                return (
                    <input
                        type="checkbox"
                        id={field.id}
                        checked={formData[field.id] || false}
                        onChange={(e) => handleFieldChange(field.id, e.target.checked)}
                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                );
            default:
                return null;
        }
    };

    return (
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
            <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                    {isEditMode ? 'Form Builder' : form?.title || 'Form'}
                </h3>
                {isEditMode && (
                    <button
                        onClick={() => setShowFieldModal(true)}
                        className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                    >
                        <FiPlus className="mr-2" />
                        Add Field
                    </button>
                )}
            </div>

            <form onSubmit={handleSubmit} className="px-4 py-5 sm:px-6 space-y-6">
                {fields.map((field) => (
                    <div key={field.id}>
                        <label
                            htmlFor={field.id}
                            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                        >
                            {field.label}
                            {field.required && <span className="text-red-500 ml-1">*</span>}
                        </label>
                        {renderField(field)}
                    </div>
                ))}

                <div className="flex justify-end">
                    <button
                        type="submit"
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
                    >
                        {isEditMode ? (
                            <>
                                <FiSave className="mr-2" />
                                Save Form
                            </>
                        ) : (
                            'Submit'
                        )}
                    </button>
                </div>
            </form>

            {/* Add Field Modal */}
            {showFieldModal && (
                <div className="fixed inset-0 z-50 overflow-y-auto">
                    <div className="flex items-center justify-center min-h-screen px-4">
                        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
                        <div className="relative bg-white dark:bg-gray-800 rounded-lg max-w-md w-full">
                            <div className="px-4 py-5 sm:px-6">
                                <h3 className="text-lg font-medium text-gray-900 dark:text-white">Add Form Field</h3>
                            </div>
                            <div className="px-4 py-5 sm:px-6">
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                            Label
                                        </label>
                                        <input
                                            type="text"
                                            value={newField.label || ''}
                                            onChange={(e) => setNewField({ ...newField, label: e.target.value })}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                            Type
                                        </label>
                                        <select
                                            value={newField.type || ''}
                                            onChange={(e) => setNewField({ ...newField, type: e.target.value as FormField['type'] })}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                        >
                                            <option value="">Select type</option>
                                            <option value="text">Text</option>
                                            <option value="textarea">Text Area</option>
                                            <option value="number">Number</option>
                                            <option value="date">Date</option>
                                            <option value="select">Select</option>
                                            <option value="checkbox">Checkbox</option>
                                        </select>
                                    </div>
                                    {newField.type === 'select' && (
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                                Options (comma-separated)
                                            </label>
                                            <input
                                                type="text"
                                                value={newField.options?.join(',') || ''}
                                                onChange={(e) =>
                                                    setNewField({
                                                        ...newField,
                                                        options: e.target.value.split(',').map((s) => s.trim()),
                                                    })
                                                }
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                            />
                                        </div>
                                    )}
                                    <div className="flex items-center">
                                        <input
                                            type="checkbox"
                                            id="required"
                                            checked={newField.required || false}
                                            onChange={(e) => setNewField({ ...newField, required: e.target.checked })}
                                            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                        />
                                        <label htmlFor="required" className="ml-2 block text-sm text-gray-900 dark:text-gray-300">
                                            Required field
                                        </label>
                                    </div>
                                </div>
                            </div>
                            <div className="px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse bg-gray-50 dark:bg-gray-700">
                                <button
                                    onClick={handleAddField}
                                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                                >
                                    Add Field
                                </button>
                                <button
                                    onClick={() => setShowFieldModal(false)}
                                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:w-auto sm:text-sm"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CustomForm;
