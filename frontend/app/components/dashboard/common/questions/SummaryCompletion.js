"use client";

import React from 'react';

export default function SummaryCompletion({ question = {}, value = '', onChange = () => {}, disabled = false }) {
    return (
        <div className="space-y-3">
            {question.text && <p className="text-slate-700 font-medium">{question.text}</p>}
            <textarea className="w-full max-w-2xl rounded-xl border px-4 py-3 min-h-[120px]" placeholder={question.placeholder || ''} value={value || ''} onChange={(e) => !disabled && onChange(e.target.value)} disabled={disabled} />
        </div>
    );
}
