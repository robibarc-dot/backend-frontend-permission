"use client";

import React from 'react';

export default function FlowchartCompletion({ question = {}, value = {}, onChange = () => {}, disabled = false }) {
    const nodes = question.nodes || [];

    const handleChange = (nodeId, text) => {
        if (disabled) return;
        const next = { ...(value || {}) };
        next[nodeId] = text;
        onChange(next);
    };

    return (
        <div className="space-y-4">
            {question.text && <p className="text-slate-700 font-medium">{question.text}</p>}
            <div className="grid gap-3 max-w-2xl">
                {nodes.map((n, i) => (
                    <div key={n.id ?? i} className="p-3 rounded-lg border bg-white flex items-center gap-3">
                        <div className="w-12 text-sm text-slate-700">{n.label ?? `Node ${i + 1}`}</div>
                        <input
                            className="flex-1 rounded-xl border px-3 py-2"
                            placeholder={n.placeholder || ''}
                            value={value?.[n.id] ?? ''}
                            onChange={(e) => handleChange(n.id ?? i, e.target.value)}
                            disabled={disabled}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
}
