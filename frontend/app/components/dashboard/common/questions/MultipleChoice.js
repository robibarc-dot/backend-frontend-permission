"use client";

import React from 'react';

export default function MultipleChoice({ question = {}, value = [], onChange = () => {}, disabled = false }) {
    const options = question.options || [];

    const toggle = (opt) => {
        if (disabled) return;
        const set = new Set(value || []);
        if (set.has(opt)) set.delete(opt);
        else set.add(opt);
        onChange(Array.from(set));
    };

    return (
        <div className="space-y-3">
            {question.text && <p className="text-slate-700 font-medium mb-4">{question.text}</p>}
            <div className="grid gap-2">
                {options.map((option, idx) => (
                    <label key={idx} className={`flex items-center gap-3 p-3 rounded-xl border ${ (value || []).includes(option) ? 'border-blue-500 bg-blue-50' : 'border-slate-100 bg-white' } ${disabled ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}`}>
                        <input type="checkbox" checked={(value || []).includes(option)} onChange={() => toggle(option)} disabled={disabled} className="w-4 h-4" />
                        <span className="text-sm">{option}</span>
                    </label>
                ))}
            </div>
        </div>
    );
}
