"use client";

import React from 'react';

export default function FormCompletion({ question = {}, value = {}, onChange = () => {}, disabled = false }) {
    const fields = question.fields || [];

    const handleChange = (fieldId, text) => {
        if (disabled) return;
        const next = { ...(value || {}) };
        next[fieldId] = text;
        onChange(next);
    };

    return (
        <div className="space-y-4">
            {question.text && <p className="text-slate-700 font-medium">{question.text}</p>}
            <div className="grid gap-3 max-w-md">
                {fields.map((f, i) => (
                    <label key={f.id ?? i} className="flex flex-col gap-2">
                        <span className="text-sm text-slate-700">{f.label || `Field ${i + 1}`}</span>
                        <input
                            className="rounded-xl border px-3 py-2"
                            placeholder={f.placeholder || ''}
                            value={value?.[f.id] ?? ''}
                            onChange={(e) => handleChange(f.id ?? i, e.target.value)}
                            disabled={disabled}
                        />
                    </label>
                ))}
            </div>
        </div>
    );
}
