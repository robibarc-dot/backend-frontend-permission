"use client";

import React from 'react';

export default function MatchingHeading({ question = {}, value = {}, onChange = () => {}, disabled = false }) {
    const paragraphs = question.paragraphs || [];
    const headings = question.headings || [];

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
                {paragraphs.map((p, i) => (
                    <div key={i} className="flex items-center gap-3 p-3 rounded-lg border bg-white">
                        <div className="flex-1 text-sm">{p}</div>
                        <select value={value?.[i] ?? ''} onChange={(e) => handle(i, e.target.value)} disabled={disabled} className="rounded-lg border px-3 py-2">
                            <option value="">Select heading</option>
                            {headings.map((h, j) => <option key={j} value={h}>{h}</option>)}
                        </select>
                    </div>
                ))}
            </div>
        </div>
    );
}
