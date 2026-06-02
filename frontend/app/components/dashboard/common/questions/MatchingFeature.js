"use client";

import React from 'react';

export default function MatchingFeature({ question = {}, value = {}, onChange = () => {}, disabled = false }) {
    const left = question.leftItems || question.left || [];
    const right = question.rightItems || question.right || [];

    const handleChange = (leftIndex, selected) => {
        if (disabled) return;
        const next = { ...(value || {}) };
        next[leftIndex] = selected;
        onChange(next);
    };

    return (
        <div className="space-y-4">
            {question.text && <p className="text-slate-700 font-medium">{question.text}</p>}
            <div className="grid gap-3">
                {left.map((l, i) => (
                    <div key={i} className="flex items-center gap-3 p-3 rounded-xl border bg-white">
                        <div className="flex-1 text-sm text-slate-800">{l}</div>
                        <select
                            className="rounded-lg border px-3 py-2 bg-white"
                            value={value?.[i] ?? ''}
                            onChange={(e) => handleChange(i, e.target.value)}
                            disabled={disabled}
                        >
                            <option value="">Select</option>
                            {right.map((r, j) => (
                                <option key={j} value={r}>{r}</option>
                            ))}
                        </select>
                    </div>
                ))}
            </div>
        </div>
    );
}
