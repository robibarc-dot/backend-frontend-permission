"use client";

import React from 'react';

export default function DiagramLabeling({ question = {}, value = {}, onChange = () => {}, disabled = false }) {
    const labels = question.labels || [];

    const handleChange = (idx, text) => {
        if (disabled) return;
        const next = { ...(value || {}) };
        next[idx] = text;
        onChange(next);
    };

    return (
        <div className="space-y-4">
            {question.text && <p className="text-slate-700 font-medium">{question.text}</p>}
            {question.diagram && (
                <div className="w-full max-w-md">
                    <img src={question.diagram} alt="diagram" className="w-full rounded-lg border" />
                </div>
            )}
            <div className="grid gap-3 max-w-md">
                {labels.map((label, i) => (
                    <label key={i} className="flex items-center gap-3">
                        <span className="w-6 text-sm text-slate-700">{i + 1}.</span>
                        <input
                            className="flex-1 rounded-xl border px-3 py-2"
                            placeholder={label.placeholder || 'Label name'}
                            value={value?.[i] ?? ''}
                            onChange={(e) => handleChange(i, e.target.value)}
                            disabled={disabled}
                        />
                    </label>
                ))}
            </div>
        </div>
    );
}
