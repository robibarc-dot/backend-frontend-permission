"use client";

import React from 'react';

export default function SentenceCompletion({ question = {}, value = {}, onChange = () => {}, disabled = false }) {
    const blanks = question.blanks || [];

    const handle = (idx, text) => {
        if (disabled) return;
        const next = { ...(value || {}) };
        next[idx] = text;
        onChange(next);
    };

    return (
        <div className="space-y-4">
            {question.text && <p className="text-slate-700 font-medium">{question.text}</p>}
            <div className="grid gap-2 max-w-xl">
                {blanks.map((b, i) => (
                    <div key={i} className="flex items-center gap-3">
                        <span className="w-6 text-sm text-slate-700">{i + 1}.</span>
                        <input className="flex-1 rounded-xl border px-3 py-2" placeholder={b.placeholder || ''} value={value?.[i] ?? ''} onChange={(e) => handle(i, e.target.value)} disabled={disabled} />
                    </div>
                ))}
            </div>
        </div>
    );
}
