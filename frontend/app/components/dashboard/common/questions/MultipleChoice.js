"use client";

import React from 'react';

export default function MultipleChoice({ question = {}, value = [], onChange = () => {}, disabled = false }) {
    const options = question.options || [];
    const toggle = (optKey) => {
        if (disabled) return;
        const set = new Set(value || []);
        if (set.has(optKey)) set.delete(optKey);
        else set.add(optKey);
        onChange(Array.from(set));
    };

    return (
        <div className="space-y-3">
            <div className="grid gap-2">
                {options.map((option, idx) => {
                    const optKey = option.key || option.text || String(option);
                    const optText = option.text || String(option);
                    return (
                        <label key={idx} className={`flex items-center gap-3 p-3 rounded-xl border ${(value || []).includes(optKey) ? 'border-blue-500 bg-blue-50' : 'border-slate-100 bg-white'} ${disabled ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}`}>
                            <input type="checkbox" checked={(value || []).includes(optKey)} onChange={() => toggle(optKey)} disabled={disabled} className="w-4 h-4" />
                            <span className="text-sm">{optText}</span>
                        </label>
                    );
                })}
            </div>
        </div>
    );
}