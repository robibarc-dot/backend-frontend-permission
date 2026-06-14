"use client";

import React from 'react';

export default function SingleChoice({ question = {}, value = '', onChange = () => {}, disabled = false }) {
    const options = question.options || [];

    return (
        <div className="space-y-3">
            {question.text && <p className="text-slate-700 font-medium mb-4">{question.text}</p>}
            <div className="grid gap-2">
                {options.map((option, idx) => (
                    <label
                        key={idx}
                        className={`flex items-center gap-3 p-3 rounded-xl border ${
                            value === option ? 'border-blue-500 bg-blue-50' : 'border-slate-100 bg-white'
                        } ${disabled ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}`}
                    >
                        <input
                            type="radio"
                            name={`single-choice-${question.id}`} // Ensure only one can be selected per question
                            value={option}
                            checked={value === option}
                            onChange={() => !disabled && onChange(option)}
                            disabled={disabled}
                            className="w-4 h-4 text-blue-600 border-slate-300 focus:ring-blue-500"
                        />
                        <span className="text-sm">{option}</span>
                    </label>
                ))}
            </div>
        </div>
    );
}