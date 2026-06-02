"use client";

import React from 'react';

export default function ShortAnswer({ question = {}, value = '', onChange = () => {}, disabled = false }) {
    return (
        <div className="space-y-3">
            {question.text && <p className="text-slate-700 font-medium mb-4">{question.text}</p>}
            <input
                type="text"
                value={value || ''}
                onChange={(e) => !disabled && onChange(e.target.value)}
                placeholder={question.placeholder || 'Type your answer here...'}
                className="w-full max-w-md rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100 disabled:opacity-60"
                disabled={disabled}
            />
        </div>
    );
}
