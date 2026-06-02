"use client";

import React from 'react';

export default function TrueFalseNotGiven({ question = {}, value = '', onChange = () => {}, disabled = false }) {
    const options = ['True', 'False', 'Not Given'];
    return (
        <div className="space-y-3">
            {question.text && <p className="text-slate-700 font-medium mb-4">{question.text}</p>}
            <div className="grid gap-2">
                {options.map((opt) => (
                    <label key={opt} className={`flex items-center gap-3 p-3 rounded-xl border ${value === opt ? 'border-blue-500 bg-blue-50' : 'border-slate-100 bg-white'}`}>
                        <input type="radio" name={`tfn-${question.id}`} value={opt} checked={value === opt} onChange={() => !disabled && onChange(opt)} disabled={disabled} />
                        <span className="text-sm">{opt}</span>
                    </label>
                ))}
            </div>
        </div>
    );
}
