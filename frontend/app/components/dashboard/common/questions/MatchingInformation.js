"use client";

import React from 'react';

export default function MatchingInformation({ question = {}, value = {}, onChange = () => {}, disabled = false }) {
    const prompts = question.prompts || [];
    const options = question.options || [];

    const handle = (idx, sel) => {
        if (disabled) return;
        const next = { ...(value || {}) };
        next[idx] = sel;
        onChange(next);
    };

    return (
        <div className="space-y-4">
            {question.text && <p className="text-slate-700 font-medium">{question.text}</p>}
            <div className="grid gap-3">
                {prompts.map((p, i) => (
                    <div key={i} className="flex items-center gap-3 p-3 rounded-lg border bg-white">
                        <div className="flex-1 text-sm">{p}</div>
                        <select value={value?.[i] ?? ''} onChange={(e) => handle(i, e.target.value)} disabled={disabled} className="rounded-lg border px-3 py-2">
                            <option value="">Select</option>
                            {options.map((o, j) => <option key={j} value={o}>{o}</option>)}
                        </select>
                    </div>
                ))}
            </div>
        </div>
    );
}
