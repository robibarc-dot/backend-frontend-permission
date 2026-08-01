"use client";

import React, { useState } from 'react';
import GroupTitle from './GroupTitle';

/**
 * IELTS Table Completion
 *
 * Renders a table with blank input fields numbered sequentially.
 * Each question in the group becomes a numbered blank in the table.
 * 
 * Props:
 * - question.groupQuestions: array of question objects from the group
 * - value: { "rowIndex-colIndex": "user answer" } or { "q-{id}": "answer" }
 * - onChange: callback with updated answers object
 */
export default function TableCompletion({title=null, question = {}, value = {}, onChange = () => {}, onFocusChange = () => {}, disabled = false }) {
    const [focusedCell, setFocusedCell] = useState(null);
    const columns = question.columns || [];
    const rows = question.rows || [];
    const groupQuestions = question.groupQuestions || [];

    // If no explicit rows/columns, use group questions as simple numbered list
    const hasTableData = columns.length > 0 || rows.length > 0;

    const handleInput = (rowIdx, colIdx, text) => {
        if (disabled) return;
        const key = `${rowIdx}-${colIdx}`;
        const next = { ...(value || {}) };
        if (text === '') {
            delete next[key];
        } else {
            next[key] = text;
        }
        onChange(next);
    };

    const handleQuestionInput = (questionId, text) => {
        if (disabled) return;
        const key = `q-${questionId}`;
        const next = { ...(value || {}) };
        if (text === '') {
            delete next[key];
        } else {
            next[key] = text;
        }
        onChange(next);
    };

    // Determine if a cell is a blank (requires user input)
    const isBlankCell = (cell) => {
        if (!cell) return true;
        if (typeof cell === 'object') {
            return cell.isBlank === true || (cell.text === null || cell.text === undefined || cell.text === '');
        }
        return false;
    };

    const getCellText = (cell) => {
        if (!cell) return '';
        if (typeof cell === 'object') {
            return cell.text || '';
        }
        return String(cell);
    };

    // No table structure: render each question in the group as a numbered input
    if (!hasTableData && groupQuestions.length > 0) {
        return (
            <div className="space-y-4">
                <GroupTitle title={title} />

                <div className="overflow-hidden rounded-xl border border-slate-200 dark:border-slate-700">
                    <table className="w-full border-collapse">
                        <tbody>
                                {groupQuestions.map((q, idx) => {
                                    const qId = q.id || idx;
                                    const key = `q-${qId}`;
                                    const userValue = value?.[key] ?? "";

                                    return (
                                        <tr
                                            key={qId}
                                            id={`question-${qId}`}
                                            className="border-b border-slate-200 last:border-b-0 dark:border-slate-700"
                                        >
                                        <td className="w-16 bg-slate-50 px-4 py-3 text-center font-semibold dark:bg-slate-800">
                                            {idx + 1}
                                        </td>

                                        <td className="px-4 py-3">
                                            {q.question_text || q.text}
                                        </td>

                                        <td className="max-w-[400px] px-4 py-3">
                                            <input
                                                type="text"
                                                value={userValue}
                                                onChange={(e) =>
                                                    handleQuestionInput(qId, e.target.value)
                                                }
                                                onFocus={() => onFocusChange(idx + 1)}
                                                disabled={disabled}
                                                placeholder={`Answer ${idx + 1}`}
                                                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-rose-500 focus:outline-none focus:ring-2 focus:ring-rose-200 dark:border-slate-600 dark:bg-slate-900"
                                            />
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }

    // Fallback: single input when no table data and no group questions
    if (!hasTableData) {
        const valueStr = value?.['0-0'] ?? '';
        return (
            <div className="flex items-start gap-3">
                <span className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-rose-500 text-[11px] font-bold text-white">
                    1
                </span>
                <input
                    type="text"
                    className="flex-1 rounded-xl border border-dashed border-rose-300 bg-rose-50/50 px-4 py-2.5 text-sm font-medium text-slate-800 transition focus:border-rose-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-200 dark:border-rose-700 dark:bg-rose-900/10 dark:text-slate-100 dark:focus:border-rose-500 dark:focus:bg-slate-800 dark:focus:ring-rose-800/30"
                    placeholder="Type your answer..."
                    value={valueStr}
                    onChange={(e) => handleInput(0, 0, e.target.value)}
                    disabled={disabled}
                />
            </div>
        );
    }

    // Table structure with rows/columns: render actual table
    return (
        <div className="space-y-4">
            <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700">
                <table className="w-full min-w-[400px] table-fixed border-collapse">
                    <thead>
                        <tr>
                            {columns.map((col, ci) => (
                                <th
                                    key={ci}
                                    className="border-r border-b-2 border-slate-200 bg-slate-50 px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-slate-600 last:border-r-0 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
                                >
                                    {typeof col === 'object' ? (col.text || col.label || '') : String(col)}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {rows.map((row, ri) => {
                            const cells = row.cells || [];
                            const displayCells = cells.length > 0 ? cells : Array(columns.length).fill(null);

                            return (
                                <tr key={ri} className="border-b border-slate-100 last:border-b-0 dark:border-slate-800">
                                    {displayCells.map((cell, ci) => (
                                        <td
                                            key={ci}
                                            className="border-r border-slate-100 px-3 py-2.5 last:border-r-0 dark:border-slate-800"
                                        >
                                            {ci === 0 && row.label ? (
                                                <span className="block text-sm font-semibold text-slate-700 dark:text-slate-200">
                                                    {row.label}
                                                </span>
                                            ) : isBlankCell(cell) ? (
                                                renderBlankCell(ri, ci, cell, rows, isBlankCell, value, handleInput, (blankNum) => onFocusChange(blankNum), disabled)
                                            ) : (
                                                <span className="block px-2 py-2 text-sm font-medium text-slate-700 dark:text-slate-200">
                                                    {getCellText(cell)}
                                                </span>
                                            )}
                                        </td>
                                    ))}
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {/* Answer key legend */}
            <div className="flex items-center gap-4 text-[11px] text-slate-400 dark:text-slate-500">
                <div className="flex items-center gap-1.5">
                    <span className="inline-block h-3 w-3 rounded border border-dashed border-rose-300 bg-rose-50/50 dark:border-rose-700 dark:bg-rose-900/10" />
                    <span>Blank to complete</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <span className="inline-block h-3 w-3 rounded border border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-800" />
                    <span>Pre-filled</span>
                </div>
            </div>
        </div>
    );
}

/**
 * Render a blank cell with numbered badge
 */
function renderBlankCell(rowIdx, colIdx, cell, rows, isBlankFn, value, handleInputFn, onFocusChangeFn, disabled) {
    // Count blanks sequentially across the table for numbering
    let blankNumber = 0;
    for (let r = 0; r <= rowIdx; r++) {
        const rowCells = rows[r]?.cells || [];
        for (let c = 0; c < (r === rowIdx ? colIdx : rowCells.length); c++) {
            if (isBlankFn(rowCells[c])) blankNumber++;
        }
    }
    if (isBlankFn(cell)) blankNumber++;
    blankNumber++; // 1-based

    const key = `${rowIdx}-${colIdx}`;
    const userValue = value?.[key] ?? '';

    return (
        <div className="relative">
            <span className="absolute -top-2 -left-1 z-10 flex h-5 w-5 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white shadow-sm">
                {blankNumber}
            </span>
            <input
                type="text"
                className="w-full min-w-[80px] rounded-md border border-dashed border-rose-300 bg-rose-50/50 px-3 py-2 pl-6 text-sm font-medium text-slate-800 placeholder-slate-400 transition focus:border-rose-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-200 dark:border-rose-700 dark:bg-rose-900/10 dark:text-slate-100 dark:placeholder-slate-500 dark:focus:border-rose-500 dark:focus:bg-slate-800 dark:focus:ring-rose-800/30"
                placeholder={`Answer ${blankNumber}`}
                value={userValue}
                onChange={(e) => handleInputFn(rowIdx, colIdx, e.target.value)}
                onFocus={() => onFocusChangeFn(blankNumber)}
                disabled={disabled}
                aria-label={`Question ${blankNumber}`}
            />
        </div>
    );
}