import React from 'react';
import { Form, Input, InputNumber, Select, DatePicker, Checkbox, Radio, Switch } from 'antd';
import { FormItemProps } from 'antd/es/form';
import { Rule } from 'antd/es/form';

// Define input component types
type InputType =
    | 'text'
    | 'textarea'
    | 'password'
    | 'email'
    | 'number'
    | 'select'
    | 'date'
    | 'checkbox'
    | 'radio'
    | 'switch';

// Define component props
interface FormItemWithVerificationProps extends Omit<FormItemProps, 'rules'> {
    // Basic props
    type: InputType;
    name: string;
    label?: string;
    placeholder?: string;
    value?: any;
    onChange?: (value: any) => void;

    // Common validation props
    required?: boolean;
    requiredMessage?: string;

    // Specific validation props based on type
    min?: number;
    max?: number;
    minMessage?: string;
    maxMessage?: string;
    minLength?: number;
    maxLength?: number;
    minLengthMessage?: string;
    maxLengthMessage?: string;
    pattern?: RegExp;
    patternMessage?: string;
    validator?: (value: any) => Promise<void>;

    // Component specific props
    options?: Array<{ label: string; value: any }>;
    rows?: number;
    disabled?: boolean;
    readOnly?: boolean;
    allowClear?: boolean;

    // Dependencies
    dependencies?: string[];

    // Additional style props
    width?: string | number;
}

/**
 * A reusable Form.Item component with built-in validation
 */
const FormItemWithVerification: React.FC<FormItemWithVerificationProps> = ({
    // Extract all props
    type,
    name,
    label,
    placeholder,
    value,
    onChange,

    required = false,
    requiredMessage,

    min,
    max,
    minMessage,
    maxMessage,
    minLength,
    maxLength,
    minLengthMessage,
    maxLengthMessage,
    pattern,
    patternMessage,
    validator,

    options = [],
    rows = 3,
    disabled = false,
    readOnly = false,
    allowClear = true,

    dependencies = [],

    width = '100%',

    // All other props will be passed to Form.Item
    ...rest
}) => {
    // Build validation rules
    const rules: Rule[] = [];

    // Required rule
    if (required) {
        rules.push({
            required,
            message: requiredMessage || `${label || name} is required`,
        });
    }

    // Numeric validations
    if (type === 'number') {
        if (min !== undefined) {
            rules.push({
                type: 'number',
                min,
                message: minMessage || `${label || name} must be at least ${min}`,
            });
        }
        if (max !== undefined) {
            rules.push({
                type: 'number',
                max,
                message: maxMessage || `${label || name} must be at most ${max}`,
            });
        }
    }

    // String length validations
    if (type === 'text' || type === 'textarea' || type === 'password' || type === 'email') {
        if (minLength !== undefined) {
            rules.push({
                min: minLength,
                message: minLengthMessage || `${label || name} must be at least ${minLength} characters`,
            });
        }
        if (maxLength !== undefined) {
            rules.push({
                max: maxLength,
                message: maxLengthMessage || `${label || name} cannot exceed ${maxLength} characters`,
            });
        }
    }

    // Pattern validation (regex)
    if (pattern) {
        rules.push({
            pattern,
            message: patternMessage || `${label || name} format is invalid`,
        });
    }

    // Custom validator
    if (validator) {
        rules.push({
            validator,
        });
    }

    // Email validation
    if (type === 'email') {
        rules.push({
            type: 'email',
            message: `Please enter a valid email address`,
        });
    }

    // Render the appropriate input component based on type
    const renderInputComponent = () => {
        switch (type) {
            case 'text':
                return (
                    <Input
                        placeholder={placeholder}
                        disabled={disabled}
                        readOnly={readOnly}
                        allowClear={allowClear}
                        style={{ width }}
                    />
                );

            case 'textarea':
                return (
                    <Input.TextArea
                        rows={rows}
                        placeholder={placeholder}
                        disabled={disabled}
                        readOnly={readOnly}
                        allowClear={allowClear}
                        style={{ width }}
                    />
                );

            case 'password':
                return (
                    <Input.Password
                        placeholder={placeholder}
                        disabled={disabled}
                        allowClear={allowClear}
                        style={{ width }}
                    />
                );

            case 'email':
                return (
                    <Input
                        type="email"
                        placeholder={placeholder || 'Email address'}
                        disabled={disabled}
                        readOnly={readOnly}
                        allowClear={allowClear}
                        style={{ width }}
                    />
                );

            case 'number':
                return (
                    <InputNumber
                        placeholder={placeholder}
                        disabled={disabled}
                        min={min}
                        max={max}
                        style={{ width }}
                    />
                );

            case 'select':
                return (
                    <Select
                        placeholder={placeholder || `Select ${label || name}`}
                        disabled={disabled}
                        allowClear={allowClear}
                        options={options}
                        style={{ width }}
                    />
                );

            case 'date':
                return (
                    <DatePicker
                        placeholder={placeholder}
                        disabled={disabled}
                        style={{ width }}
                    />
                );

            case 'checkbox':
                return <Checkbox disabled={disabled}>{placeholder}</Checkbox>;

            case 'radio':
                return (
                    <Radio.Group disabled={disabled} options={options} />
                );

            case 'switch':
                return <Switch disabled={disabled} />;

            default:
                return <Input placeholder={placeholder} style={{ width }} />;
        }
    };

    return (
        <Form.Item
            name={name}
            label={label}
            rules={rules}
            dependencies={dependencies}
            {...rest}
        >
            {renderInputComponent()}
        </Form.Item>
    );
};

export default FormItemWithVerification;
