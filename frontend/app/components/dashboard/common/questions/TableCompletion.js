"use client";

import React from 'react';

export default function TableCompletion({ question = {}, value = {}, onChange = () => {}, disabled = false }) {
    const columns = question.columns || [];
    const rows = question.rows || [];

    const handle = (r, c, text) => {
        if (disabled) return;
        const next = { ...(value || {}) };
        next[`${r}-${c}`] = text;
        onChange(next);
    };

    return (
        <div className="space-y-4 overflow-auto">
            {question.text && <p className="text-slate-700 font-medium">{question.text}</p>}
            <table className="w-full max-w-3xl table-auto border-collapse">
                <thead>
                    <tr>
                        <th className="border px-3 py-2 bg-slate-50"></th>
                        {columns.map((c, i) => <th key={i} className="border px-3 py-2 text-left">{c}</th>)}
                    </tr>
                </thead>
                <tbody>
                    {rows.map((r, ri) => (
                        <tr key={ri}>
                            <td className="border px-3 py-2 bg-slate-50">{r.label || `Row ${ri + 1}`}</td>
                            {columns.map((c, ci) => (
                                <td key={ci} className="border px-3 py-2">
                                    <input className="w-full rounded-md border px-2 py-1" value={value?.[`${ri}-${ci}`] ?? ''} onChange={(e) => handle(ri, ci, e.target.value)} disabled={disabled} />
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
